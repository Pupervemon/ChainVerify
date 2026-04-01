# Proof 数据库 SQL 与规则

本文档说明当前 `ProofStore` 合约与后端对齐后的数据库设计、业务规则，以及 MySQL 迁移 SQL。

相关代码：

- `blockchain/contracts/ProofStore.sol`
- `backend/internal/models/proof.go`
- `backend/internal/repository/proof_repository.go`
- `backend/internal/handler/storage_handler.go`
- `backend/internal/service/event_integration.go`

## 1. 当前最终规则

当前项目采用的最终规则只有一条核心约束：

- 同一份文件只能存证一次

落到实现上就是：

- 唯一键只看 `file_hash`
- 不再按 `wallet_address + file_hash` 组合去重
- `wallet_address` 只表示“是谁第一次提交了这份文件”
- 如果某个 `file_hash` 已经存在，任何钱包都不能再次写入

这条规则需要同时在三层保持一致：

1. 合约层：`fileHash` 全局唯一
2. 后端接口层：上传前按 `fileHash` 全局查重
3. 数据库层：`file_hash` 单列唯一索引

## 2. 数据库字段含义

当前后端模型 `backend/internal/models/proof.go` 对应的核心字段如下：

| 字段 | 含义 | 是否参与唯一约束 |
| --- | --- | --- |
| `id` | 主键 | 否 |
| `wallet_address` | 首次提交该文件的钱包地址 | 否 |
| `file_hash` | 文件 SHA-256 哈希 | 是，唯一键 |
| `file_name` | 文件名 | 否 |
| `file_size` | 文件大小，单位字节 | 否 |
| `content_type` | MIME 类型 | 否 |
| `cid` | IPFS CID | 否 |
| `tx_hash` | 上链交易哈希 | 否 |
| `block_number` | 区块号 | 否 |
| `chain_id` | 链 ID | 否 |
| `contract_address` | 合约地址 | 否 |
| `proof_created_at` | 链上 proof 时间 | 否 |
| `created_at` | 数据库创建时间 | 否 |
| `updated_at` | 数据库更新时间 | 否 |

## 3. 建表 SQL

下面是一份与当前 Go 模型语义一致的 MySQL 建表示例。

```sql
CREATE TABLE `proofs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `wallet_address` VARCHAR(64) NOT NULL,
  `file_hash` VARCHAR(128) NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_size` BIGINT NOT NULL,
  `content_type` VARCHAR(128) NULL,
  `cid` VARCHAR(255) NOT NULL,
  `tx_hash` VARCHAR(128) NULL,
  `block_number` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `chain_id` VARCHAR(32) NULL,
  `contract_address` VARCHAR(64) NULL,
  `proof_created_at` DATETIME(3) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_proofs_file_hash` (`file_hash`),
  KEY `idx_proofs_wallet_address` (`wallet_address`),
  KEY `idx_proofs_cid` (`cid`),
  KEY `idx_proofs_tx_hash` (`tx_hash`),
  KEY `idx_proofs_proof_created_at` (`proof_created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

说明：

- `file_hash` 是唯一键，这是整套系统的核心约束
- `wallet_address` 只是普通索引，用于按用户查询列表
- `cid`、`tx_hash`、`proof_created_at` 是查询优化索引，不参与唯一性

## 4. 当前数据库行为规则

### 4.1 上传去重规则

上传接口在保存文件前会先计算 SHA-256：

1. 计算文件 `file_hash`
2. 按 `file_hash` 查询数据库
3. 如果已存在，直接拒绝上传

这意味着：

- 同钱包重复上传同一文件，拒绝
- 不同钱包上传同一文件，仍然拒绝

### 4.2 数据库存储规则

数据库中同一个 `file_hash` 只允许存在一行记录。

因此一条 proof 记录代表的是：

- 某个文件的唯一存证记录

而不是：

- 某个钱包对某个文件的一次存证记录

### 4.3 事件同步规则

后端监听链上 `ProofCreated` 事件后，会按 `file_hash` 回填数据库。

对应仓储层语义是：

- 以 `file_hash` 作为冲突键进行 upsert
- 如果数据库里已经有该 `file_hash`，则更新该行
- 不再新增第二条相同 `file_hash` 的记录

对应的 SQL 语义接近：

```sql
INSERT INTO proofs (
  wallet_address,
  file_hash,
  file_name,
  file_size,
  content_type,
  cid,
  tx_hash,
  block_number,
  chain_id,
  contract_address,
  proof_created_at,
  created_at,
  updated_at
) VALUES (
  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  wallet_address = VALUES(wallet_address),
  file_name = VALUES(file_name),
  file_size = VALUES(file_size),
  content_type = VALUES(content_type),
  cid = VALUES(cid),
  tx_hash = VALUES(tx_hash),
  block_number = VALUES(block_number),
  chain_id = VALUES(chain_id),
  contract_address = VALUES(contract_address),
  proof_created_at = VALUES(proof_created_at),
  updated_at = NOW(3);
```

## 5. 不能再使用的旧规则

下面这些规则已经不适用：

- `(wallet_address, file_hash)` 复合唯一
- “不同钱包可以对同一文件各自存一次”
- 上传查重时只检查“同一钱包是否重复”
- 事件同步按“钱包 + 文件哈希”去定位记录

如果数据库中还保留这套旧索引，实际行为就会继续与当前合约/后端逻辑不一致。

## 6. 检查当前索引 SQL

在执行迁移前，先检查当前 `proofs` 表索引：

```sql
SHOW INDEX FROM proofs;
```

如果你想更清楚地看到每个索引覆盖了哪些列，可以执行：

```sql
SELECT
  INDEX_NAME,
  NON_UNIQUE,
  GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS columns_in_index
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'proofs'
GROUP BY INDEX_NAME, NON_UNIQUE
ORDER BY INDEX_NAME;
```

目标状态应当是：

- 有且仅有一个 `file_hash` 单列唯一索引
- 不存在 `(wallet_address, file_hash)` 复合唯一索引

## 7. 迁移 SQL

### 7.1 从错误的复合唯一迁回当前规则

如果之前已经错误地建成了 `(wallet_address, file_hash)` 复合唯一，需要先删除它。

先查索引名，再执行：

```sql
ALTER TABLE proofs DROP INDEX `你的旧复合唯一索引名`;
```

例如，如果旧索引名恰好是 `idx_proofs_wallet_file_hash`，则写成：

```sql
ALTER TABLE proofs DROP INDEX `idx_proofs_wallet_file_hash`;
```

然后确保存在 `file_hash` 单列唯一索引：

```sql
ALTER TABLE proofs
ADD UNIQUE INDEX `idx_proofs_file_hash` (`file_hash`);
```

### 7.2 如果 `file_hash` 唯一索引已经存在

如果执行 `ADD UNIQUE INDEX` 报索引已存在，不需要重复创建。此时只要确认：

- 旧复合唯一索引已经删除
- `file_hash` 单列唯一索引仍然存在

### 7.3 如果库里已经出现重复 `file_hash`

在极少数情况下，如果历史数据已经产生重复 `file_hash`，新增唯一索引会失败。

可以先检查重复数据：

```sql
SELECT file_hash, COUNT(*) AS cnt
FROM proofs
GROUP BY file_hash
HAVING COUNT(*) > 1;
```

确认保留哪条记录后，再删除多余数据，最后补上唯一索引。

## 8. AutoMigrate 注意事项

当前后端在 `backend/internal/database/mysql.go` 中启用了：

```go
db.AutoMigrate(&models.Proof{})
```

这表示应用启动时会尝试自动同步表结构，但要注意：

- `AutoMigrate` 适合补字段、补索引
- 它不适合依赖为“清理旧的错误索引”

因此如果数据库以前跑过错误版本，不能只依赖应用重启，仍然应当手动执行上面的索引检查和迁移 SQL。

## 9. 最终验收标准

数据库层最终应满足以下结果：

1. `proofs.file_hash` 是全局唯一
2. `wallet_address` 只是记录字段，不参与唯一约束
3. 同一文件不管由哪个钱包上传，都只能存在一条 proof 记录
4. 链上事件同步时，对同一个 `file_hash` 只更新同一行数据

如果这四点成立，则数据库规则已经和当前合约、后端逻辑完全一致。
