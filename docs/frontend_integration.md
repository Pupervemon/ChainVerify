# ChainVerify 前端集成开发文档

本指南旨在帮助前端工程师快速接入 `ChainVerify` 系统的后端服务与区块链智能合约。

## 1. 环境信息

- **后端 Base URL**: `http://localhost:8080/api/v1` (开发环境)
- **区块链网络**: Sepolia Testnet (Chain ID: `11155111`)
- **智能合约地址**: `0x5e74A5EC199636B5ECda49fEf0A15Ce06bFcdE5D`
- **去中心化存储**: Pinata IPFS Gateway

---

## 2. 核心业务流程 (Critical Path)

完成一次完整的“存证”需遵循以下三个步骤：

1.  **文件上传 (后端)**：调用 `POST /store/upload`，获取文件的 **IPFS CID**。
2.  **哈希计算 (前端)**：前端本地计算文件的 SHA-256 哈希值（`file_hash`）。
3.  **链上确权 (合约)**：使用钱包（如 MetaMask）调用合约的 `storeProof` 方法。

> **注意**：后端会自动通过事件监听（Indexer）将链上数据同步至数据库，因此无需手动调用后端的“创建”接口。

---

## 3. 后端 API 接口

### 3.1 文件上传至 IPFS
- **URL**: `/store/upload`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Request Body**: `file` (Binary)
- **Response Data**:
  - `cid`: IPFS 唯一标识符
  - `file_name`: 原始文件名
  - `file_size`: 文件大小（Bytes）
  - `gateway_url`: 可直接访问文件的 URL

### 3.2 获取存证列表 (带分页)
- **URL**: `/proofs`
- **Method**: `GET`
- **Query Params**:
  - `wallet_address`: 过滤特定用户的存证
  - `page`: 页码（默认 1）
  - `page_size`: 每页数量（默认 10）

### 3.3 核验详情查询
- **URL**: `/proofs/:file_hash`
- **Method**: `GET`
- **Description**: 根据文件哈希查询该文件在系统中的完整存证记录（包含交易哈希、区块高度等）。

### 3.4 系统全局统计
- **URL**: `/stats`
- **Method**: `GET`
- **Description**: 获取平台总存证数、总用户数、总存储容量。

---

## 4. 智能合约集成 (Web3)

### 4.1 核心方法说明 (`ProofStore.sol`)

| 方法名 | 类型 | 说明 | 参数 |
| :--- | :--- | :--- | :--- |
| `storeProof` | Write | **核心存证方法** | `fileHash`, `fileName`, `fileSize`, `contentType`, `cid` |
| `getProof` | View | 查询链上原始数据 | `fileHash` |
| `verifyProof` | View | 验证哈希与CID是否匹配 | `fileHash`, `cid` |
| `totalProofs` | View | 获取链上总存证计数器 | - |

### 4.2 存证调用示例 (ethers.js)

```javascript
const contract = new ethers.Contract(ADDRESS, ABI, signer);

// 前端计算 fileHash (示例使用 SHA-256)
const fileHash = await calculateSHA256(fileBlob); 

// 执行上链交易
const tx = await contract.storeProof(
    fileHash,      // 文件哈希
    "report.pdf",  // 文件名
    102400,        // 文件大小
    "application/pdf", // MIME类型
    "Qm..."        // 从后端 upload 接口拿到的 CID
);
await tx.wait(); // 等待区块确认
```

---

## 5. 开发建议

1.  **状态管理**：由于交易上链有延迟，后端数据库同步通常在交易成功后 10-30 秒内完成。建议在用户提交后显示“打包中”状态，并轮询 `/proofs/:file_hash`接口直至数据出现。
2.  **错误处理**：
    - 合约报错 `ProofStore: file hash already exists` 表示该文件已被存证。
    - 后端返回 `404` 表示数据尚未同步至数据库。
3.  **安全性**：前端计算 `fileHash` 时应保证算法与后端/合约一致（推荐标准的 SHA-256 十六进制字符串，带 `0x` 前缀）。
