# ChainVerify 存证业务链路总结

`ChainVerify` 项目的核心业务链路和运行机制：

## 1. 整体架构与机制分析
目前 Go 后端项目扮演的是 **"去中心化存储网关"** 与 **"链下数据索引查询"** 的角色，而并非直接处理一切状态写入。项目的核心思路是 **"链上确权 + IPFS存储 + 链下索引加速"** 的 Web3 混合架构。

## 2. 核心业务工作流 (Workflow)

整个完整的存证(Proof)流程应该由前端、Go 后端、智能合约以及链下同步(Indexer)四部分配合完成：

### 阶段一：文件存储 (上传 IPFS)
1. **用户操作**：用户在前端选择需要存证的文件进行上传。
2. **接口调用**：前端调用后端的 `POST /api/v1/store/upload` 接口，将文件表单发送给后端。
3. **网关处理**：
   - 后端路由接收请求，转交 `storage_handler`。
   - [PinataService](file:///e:/Myspace/MyProject/ChainVerify/internal/service/pinata_service.go#30-34) 将该文件转发至 **Pinata IPFS 节点**，并携带文件元数据。
   - 上传成功后，Pinata 返回独一无二的 **CID (IPFS Hash)**。
4. **前端响应**：后端将得到的 CID、文件大小、文件名等信息返回给前端。

### 阶段二：链上确权 (提交到智能合约)
1. **信息组装**：前端利用拿到的 CID，并在本地计算文件的 Hash（如 SHA-256 作为 `file_hash`）。
2. **钱包签名**：前端通过用户的 MetaMask 等 Web3 钱包，调用**智能合约**的 `storeProof` 方法。
3. **上链存储**：
   - 将 [(fileHash, fileName, fileSize, contentType, cid)](file:///e:/Myspace/MyProject/ChainVerify/internal/router/router.go#12-30) 写入智能合约，持久化到区块链上。
   - 合约在写入时会自动记录 `msg.sender` (用户的 wallet_address) 和 `block.timestamp`。
   - 写入成功后，合约抛出 `ProofCreated` 事件。

### 阶段三：链下数据同步 (Indexer 索引)
*目前后端代码尚未发现此部分代码，但理论上属于架构中缺失或运行在别处的组件模块*
1. **事件监听**：一个基于 Go (如 go-ethereum) 或 GraphNode 的索引服务监听智能合约释放的 `ProofCreated` 事件。
2. **存入数据库**：监听到事件后，从链上和事件参数中获取并拼装 [Proof](file:///e:/Myspace/MyProject/ChainVerify/internal/models/proof.go#6-22) 模型的所有字段 (包含 `TxHash`, `BlockNumber`, `ChainID`, `ContractAddress`)。
3. **写入 MySQL**：将这条完整的记录插入到 `proofs` 表中。

### 阶段四：数据查询与统计 (Query)
1. **获取存证列表**：用户在前端进入“我的存证”，前端调用后端 `GET /api/v1/proofs?wallet_address=0x...` 接口。
2. **查询详情记录**：依靠 `GET /api/v1/proofs/:file_hash` 获取单条记录。
3. **大盘统计数据**：系统看板调用 `GET /api/v1/stats` 获取平台总数据缓存（总存证量、总用户数等）。此时依赖的是阶段三已同步进 MySQL 的数据。

---

## 3. 设计亮点与改进建议
- **巧妙处**：大文件存放在 IPFS 保证去中心化，而区块链只记录 Hash 和 CID 避免高昂 gas 费；采用后台进行缓存索引来解决区块链查询慢、查询复杂的问题。
- **缺失处**：当前仓库中缺少 "阶段三（Indexer 事件监听入库）" 的代码，当前 Repository 中所有方法只读 ([ListByWallet](file:///e:/Myspace/MyProject/ChainVerify/internal/repository/proof_repository.go#34-54), [GetByFileHash](file:///e:/Myspace/MyProject/ChainVerify/internal/repository/proof_repository.go#125-136), [GetStats](file:///e:/Myspace/MyProject/ChainVerify/internal/repository/proof_repository.go#21-22))，并未实现 `Create`，由此推测系统架构是基于事件监听驱动的。
