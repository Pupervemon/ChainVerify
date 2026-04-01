# 资产护照合约部署说明

## 文档目的

本文档说明如何在当前仓库中部署资产护照合约套件，包括：

- `AssetPassport`
- `PassportAuthority`
- `ChronicleStamp`
- `PassportFactory`

对应部署脚本位于：

[deploy-passport.ts](E:/Myspace/MyProject/DeProof/blockchain/scripts/deploy-passport.ts)

## 部署脚本职责

该脚本当前会完成以下动作：

1. 部署 `PassportAuthority`
2. 部署 `AssetPassport`
3. 部署 `ChronicleStamp`
4. 部署 `PassportFactory`
5. 将四个合约需要互相引用的地址全部注入
6. 如果配置了 `subjectAccountRegistry` / `subjectAccountImplementation`，则将它们写入工厂
7. 如果配置了 `PASSPORT_FINAL_OWNER`，在所有初始化完成后转移 ownership
8. 将部署结果写入 `blockchain/deployments/passport/<network>.json`
9. 自动同步四个 Passport 合约的 ABI 到前端和后端目录
10. 自动同步一份 deployment manifest 到前端和后端目录

## 环境变量

当前脚本会读取以下环境变量：

- `PASSPORT_NAME`
- `PASSPORT_SYMBOL`
- `PASSPORT_FINAL_OWNER`
- `SUBJECT_ACCOUNT_REGISTRY`
- `SUBJECT_ACCOUNT_IMPLEMENTATION`

已有的 Hardhat 网络配置仍然沿用：

- `SEPOLIA_RPC_URL`
- `HARDHAT_PRIVATE_KEY`

建议在 `backend/.env` 中加入：

```env
PASSPORT_NAME=DeProof Asset Passport
PASSPORT_SYMBOL=DPAP
PASSPORT_FINAL_OWNER=0xYourAdminAddress
SUBJECT_ACCOUNT_REGISTRY=
SUBJECT_ACCOUNT_IMPLEMENTATION=
```

说明：

- 如果不设置 `PASSPORT_FINAL_OWNER`，部署完成后 owner 默认保持为 deployer
- 如果不设置 `SUBJECT_ACCOUNT_REGISTRY` 和 `SUBJECT_ACCOUNT_IMPLEMENTATION`，部署仍会成功，只是不启用 `subjectAccount` 自动创建

## 本地部署

1. 启动本地节点

```powershell
cd blockchain
npx hardhat node
```

2. 在新终端执行部署

```powershell
cd blockchain
npx hardhat run --network localhost scripts/deploy-passport.ts
```

3. 查看部署清单

输出文件：

- `blockchain/deployments/passport/localhost.json`

## Sepolia 部署

```powershell
cd blockchain
npx hardhat run --network sepolia scripts/deploy-passport.ts
```

输出文件：

- `blockchain/deployments/passport/sepolia.json`

## 部署后 wiring 结果

脚本部署后会自动完成以下配置：

- `AssetPassport.authority = PassportAuthority`
- `AssetPassport.chronicle = ChronicleStamp`
- `AssetPassport.factory = PassportFactory`
- `PassportAuthority.assetPassport = AssetPassport`
- `PassportAuthority.chronicle = ChronicleStamp`
- `ChronicleStamp.assetPassport = AssetPassport`
- `ChronicleStamp.authority = PassportAuthority`
- `PassportFactory.assetPassport = AssetPassport`
- `PassportFactory.authority = PassportAuthority`
- `PassportFactory.chronicle = ChronicleStamp`

这意味着部署脚本已经把最关键的互相依赖关系处理好了，不需要再手动逐个调用 setter。

## 部署产物

部署脚本会生成 JSON 文件，内容包括：

- 网络名
- chainId
- 部署时间
- deployer 地址
- 最终 owner 地址
- 护照名称 / 符号
- 可选的 subject account 配置
- 四个核心合约地址

这个文件建议作为：

- 前端环境初始化依据
- 后端配置依据
- 运维留档
- 后续 ABI/地址同步脚本输入

除此之外，部署脚本现在还会自动写入以下文件：

- `frontend/src/contracts/passport/AssetPassport.json`
- `frontend/src/contracts/passport/ChronicleStamp.json`
- `frontend/src/contracts/passport/PassportAuthority.json`
- `frontend/src/contracts/passport/PassportFactory.json`
- `frontend/src/contracts/passport/deployment.json`
- `backend/contracts/passport/AssetPassport.json`
- `backend/contracts/passport/ChronicleStamp.json`
- `backend/contracts/passport/PassportAuthority.json`
- `backend/contracts/passport/PassportFactory.json`
- `backend/contracts/passport/deployment.json`

这些同步文件包含：

- `abi`
- `address`
- `network`
- `chainId`
- `deployedAt`
- `contractName`
- `sourceName`

其中前端的 `src/config/passport.ts` 已支持：

- 优先读取 `VITE_*` 环境变量地址
- 若环境变量未提供，则回退到部署脚本同步写入的 JSON 地址

## 推荐部署顺序

推荐实际执行顺序如下：

1. `npx hardhat compile`
2. `npx hardhat run --network <network> scripts/deploy-passport.ts`
3. 记录 `deployments/passport/<network>.json`
4. 检查前后端同步后的 ABI / 地址文件是否符合目标环境
5. 再开始做测试数据初始化和业务联调

## 后续建议

部署脚本已经可以完成第一版原型合约的完整初始化。下一阶段建议继续补上：

- 护照合约测试
- 前端/后端读取部署清单的自动化脚本
- 真实 ERC-6551 registry / account 接入
