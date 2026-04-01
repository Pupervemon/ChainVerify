# 后端链上同步问题排查与修复说明

本文档记录本次本地区块链联调中发现的两个相关问题：

1. Hardhat 本地节点中持续出现 `eth_call Contract call: ProofStore#<unrecognized-selector>` 日志。
2. 后端监听 `ProofCreated` 事件后，存在将错误的文件哈希写入数据库的风险。

## 1. 问题现象

本地节点日志中反复出现如下内容：

```text
eth_call
  Contract call:       ProofStore#<unrecognized-selector>
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  To:                  0x5fbdb2315678afecb367f032d93f642f64180aa3

  Error: Transaction reverted without a reason
```

同时，代码检查发现后端事件同步逻辑中使用了：

- `event.FileHash.Hex()` 作为文件哈希

但在 Solidity 中，`ProofCreated` 事件的 `fileHash` 是 `indexed string`，这类动态类型的索引字段在日志 topic 中保存的是 `keccak256(value)`，不是原始字符串。

这意味着：

- 节点日志里看到的错误，不一定是后端本身发起的调用。
- 后端如果直接使用 `event.FileHash.Hex()` 入库，会把 topic hash 当成文件哈希保存，导致链上同步数据错误。

## 2. 根因分析

### 2.1 `unrecognized-selector` 的直接来源不是后端事件监听

后端启动逻辑位于：

- `backend/cmd/server/main.go`

这里仅创建了合约事件监听器，并订阅 `ProofCreated` 事件，不会循环调用 `getProofForUser`、`getUserProofs` 之类的只读方法。

实际持续发起链上 `eth_call` 的位置在前端：

- `frontend/src/App.tsx`

当 Dashboard 页面从后端没有查到数据时，会回退到链上查询：

1. `getUserProofs(address)`
2. `getProofForUser(address, hash)`

因此，这类日志更可能由前端链上回退查询触发，而不是后端监听器触发。

### 2.2 后端事件同步存在真实缺陷

原始合约事件定义中：

```solidity
event ProofCreated(
    address indexed walletAddress,
    string indexed fileHash,
    string cid,
    uint256 timestamp
);
```

其中：

- `walletAddress` 为静态类型，indexed 后仍可直接从 topic 解析出地址
- `fileHash` 为 `string`，属于动态类型，indexed 后 topic 中存放的是其哈希值

Go 绑定中对应字段类型为：

- `WalletAddress common.Address`
- `FileHash common.Hash`

这里的 `FileHash` 只是 topic 哈希，不是原始文件哈希。

原后端逻辑在：

- `backend/internal/service/event_integration.go`

直接执行：

```go
fileHash := strings.ToLower(strings.TrimPrefix(event.FileHash.Hex(), "0x"))
```

这会导致：

- 数据库查询命中失败
- 新建链上同步记录时保存错误哈希
- 前端校验、检索和后续同步逻辑出现不一致

## 3. 修复方案

本次采用的修复方案包括三部分。

### 3.1 修改合约事件，增加原始文件哈希字段

更新文件：

- `blockchain/contracts/ProofStore.sol`

将事件改为：

```solidity
event ProofCreated(
    address indexed walletAddress,
    string indexed fileHash,
    string rawFileHash,
    string cid,
    uint256 timestamp
);
```

并在触发事件时同时传出原始 `_fileHash`：

```solidity
emit ProofCreated(msg.sender, _fileHash, _fileHash, _cid, block.timestamp);
```

这样可以兼顾：

- 保留 `indexed fileHash` 作为链上过滤条件
- 新增 `rawFileHash` 供后端直接解析和入库

### 3.2 更新 ABI、前端合约 JSON 和 Go 绑定

涉及文件：

- `blockchain/ProofStore.abi`
- `blockchain/ProofStore.bin`
- `frontend/src/contracts/ProofStore.json`
- `backend/pkg/contracts/proofstore/proofstore.go`

更新后，Go 事件结构体中新增：

```go
RawFileHash string
```

### 3.3 修改后端事件消费逻辑

更新文件：

- `backend/pkg/eth/listener.go`
- `backend/internal/service/event_integration.go`

修复后的策略：

1. 优先使用 `event.RawFileHash`
2. 仅在兼容旧事件时，才回退到 `event.FileHash.Hex()`
3. 日志中同时打印原始哈希和 indexed topic hash，便于排查

核心逻辑如下：

```go
fileHash := strings.ToLower(strings.TrimPrefix(event.RawFileHash, "0x"))
if fileHash == "" {
    fileHash = strings.ToLower(strings.TrimPrefix(event.FileHash.Hex(), "0x"))
}
```

## 4. 额外发现的问题

在同步 ABI 时，还发现 `Hardhat` 配置对环境变量容错不足。

涉及文件：

- `blockchain/hardhat.config.ts`

问题表现：

- `backend/.env` 中 `SEPOLIA_RPC_URL` 使用了 `ws://127.0.0.1:8545`
- `Hardhat` 的 `sepolia` 网络却声明为 `type: "http"`
- `HARDHAT_PRIVATE_KEY` 也可能缺少 `0x` 前缀

这会导致 `npx hardhat compile` 直接在配置校验阶段失败。

本次已增加两项兼容处理：

1. 自动将 `ws://` 转换为 `http://`
2. 自动为私钥补齐 `0x` 前缀

## 5. 验证结果

本次修改后已完成以下验证：

1. 重新生成后端 Go 合约绑定
2. 同步前端合约 ABI JSON
3. 运行后端测试

验证命令：

```bash
cd backend
go test ./...
```

结果：

- 后端测试通过

## 6. 落地注意事项

### 6.1 必须重新部署本地合约

由于本次修改了 `ProofCreated` 事件签名，旧的本地部署合约不会自动升级。

如果继续使用旧部署：

- 后端仍只能收到旧事件格式
- `RawFileHash` 不存在
- 新逻辑只能走兼容分支，无法彻底解决事件同步数据错误

因此需要：

1. 重启或清空本地 Hardhat 链
2. 重新部署 `ProofStore`
3. 确认前后端都使用新的合约地址和新 ABI

### 6.2 `unrecognized-selector` 仍需优先检查前端和节点状态

如果之后还看到类似日志，优先排查以下内容：

1. 当前打开的前端页面是否还是旧版本
2. `frontend/.env` 中的 `VITE_CONTRACT_ADDRESS` 是否和本地链一致
3. 本地节点是否是最新重启的实例
4. 是否存在旧钱包会话、旧 ABI 缓存或旧页面标签页

## 7. 建议的后续操作

建议按以下顺序完成联调收尾：

1. 重启本地 Hardhat 节点
2. 重新部署 `ProofStore`
3. 更新 `backend/.env` 和 `frontend/.env` 中的合约地址
4. 重启后端服务
5. 重启前端开发服务
6. 上传一个新文件，确认链上交易成功
7. 检查数据库中 `file_hash` 是否为真实 SHA-256 值，而不是 topic hash
8. 打开 Dashboard，确认链上回退查询和后端同步结果一致

## 8. 相关文件清单

本次问题涉及的关键文件如下：

- `backend/cmd/server/main.go`
- `backend/pkg/eth/listener.go`
- `backend/internal/service/event_integration.go`
- `backend/pkg/contracts/proofstore/proofstore.go`
- `frontend/src/App.tsx`
- `frontend/src/contracts/ProofStore.json`
- `blockchain/contracts/ProofStore.sol`
- `blockchain/ProofStore.abi`
- `blockchain/ProofStore.bin`
- `blockchain/hardhat.config.ts`

---

更新日期：2026-03-18
