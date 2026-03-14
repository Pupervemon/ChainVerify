# API 接口文档

## 基础信息

- Base URL: `http://localhost:8080/api/v1`
- 数据格式: `application/json`
- 文件上传: `multipart/form-data`
- 成功状态码: `200`
- 失败状态码: `4xx` / `5xx`

## 1. 上传文件至 IPFS 网络

- 路径: `POST /store/upload`
- Content-Type: `multipart/form-data`
- 表单字段: `file`

### 成功响应

```json
{
  "code": 200,
  "message": "file uploaded to ipfs",
  "data": {
    "cid": "Qm...",
    "file_name": "contract.pdf",
    "file_size": 102400,
    "gateway_url": "https://gateway.pinata.cloud/ipfs/Qm..."
  }
}
```

## 2. 分页查询用户的存证历史列表

- 路径: `GET /proofs`
- Query:
  - `wallet_address`: 可选，钱包地址
  - `page`: 可选，默认 `1`
  - `page_size`: 可选，默认 `10`，最大 `100`

### 成功响应

```json
{
  "code": 200,
  "message": "proof list fetched",
  "data": {
    "items": [
      {
        "id": 1,
        "wallet_address": "0x123...",
        "file_hash": "0xabcd...",
        "file_name": "contract.pdf",
        "file_size": 102400,
        "content_type": "application/pdf",
        "cid": "Qm...",
        "tx_hash": "0xdef...",
        "block_number": 123456,
        "chain_id": "11155111",
        "contract_address": "0xcontract...",
        "proof_created_at": "2026-03-12T10:00:00Z",
        "created_at": "2026-03-12T10:00:01Z",
        "updated_at": "2026-03-12T10:00:01Z"
      }
    ],
    "pagination": {
      "page": 1,
      "page_size": 10,
      "total": 1
    }
  }
}
```

## 3. 获取单份文件的存证核验详情

- 路径: `GET /proofs/:file_hash`

### 成功响应

```json
{
  "code": 200,
  "message": "proof detail fetched",
  "data": {
    "id": 1,
    "wallet_address": "0x123...",
    "file_hash": "0xabcd...",
    "file_name": "contract.pdf",
    "file_size": 102400,
    "content_type": "application/pdf",
    "cid": "Qm...",
    "tx_hash": "0xdef...",
    "block_number": 123456,
    "chain_id": "11155111",
    "contract_address": "0xcontract...",
    "proof_created_at": "2026-03-12T10:00:00Z",
    "created_at": "2026-03-12T10:00:01Z",
    "updated_at": "2026-03-12T10:00:01Z"
  }
}
```

### 未找到响应

```json
{
  "code": 404,
  "message": "proof not found"
}
```

## 4. 获取系统大屏全局统计数据

- 路径: `GET /stats`

### 成功响应

```json
{
  "code": 200,
  "message": "stats fetched",
  "data": {
    "total_proofs": 128,
    "total_users": 45,
    "total_storage": 104857600,
    "latest_proof_at": "2026-03-12T10:00:00Z",
    "database_enabled": true
  }
}
```