# ChainVerify Backend API

Go 后端项目，提供 Web3 去中心化存证系统所需的基础 API：

- IPFS 上传网关，作为前端与 Pinata 间的安全代理。
- 存证历史分页查询。
- 单文件 Hash 的存证详情查询。
- 全局统计数据查询。

## 技术栈

- Gin: HTTP 路由与接口层。
- GORM + MySQL: 存证数据索引持久化。
- Pinata API: IPFS 文件上传。

## 快速启动

1. 配置环境变量

   复制 [.env.example](.env.example) 并填入实际配置，至少需要：

   - `PINATA_JWT`: Pinata JWT。
   - `MYSQL_DSN`: MySQL 连接串。未配置时服务仍可启动，但存证查询接口使用内存仓储，数据为空。

2. 安装依赖

```bash
go mod tidy
```

3. 启动服务

```bash
go run ./cmd/server
```

4. 健康检查

```bash
curl http://localhost:8080/healthz
```

## API 概览

基础前缀：`http://localhost:8080/api/v1`

- `POST /store/upload`
- `GET /proofs`
- `GET /proofs/:file_hash`
- `GET /stats`

详细接口见 [docs/api.md](docs/api.md)。

## 数据模型

`proofs` 表建议由链上事件监听任务写入，字段已在 [internal/models/proof.go](internal/models/proof.go) 定义。当前项目已包含自动建表能力。

## 后续扩展

- 增加监听以太坊合约 `ProofCreated` 事件的后台 worker。
- 增加认证、中间件签名校验和访问限流。
- 接入 Swagger 或 OpenAPI 自动文档。