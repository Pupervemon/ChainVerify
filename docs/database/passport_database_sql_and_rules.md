# Passport 合约事件检查与数据库设计

本文针对 `passport` 合约组做两件事：

1. 完整盘点当前链上事件
2. 给出适合后端索引器的 MySQL 初版 SQL

对应 SQL 文件：`docs/database/passport_indexer_mysql.sql`

## 1. 当前合约事件总览

### 1.1 PassportFactory

| 事件 | 作用 | 后端建议 |
| --- | --- | --- |
| `OwnershipTransferred` | 工厂 owner 变更 | 更新 `passport_contract_state`，同时写入 `chain_event_logs` |
| `AssetPassportUpdated` | 工厂绑定的 `AssetPassport` 更新 | 更新 `passport_contract_state` |
| `AuthorityUpdated` | 工厂绑定的 `PassportAuthority` 更新 | 更新 `passport_contract_state` |
| `ChronicleUpdated` | 工厂绑定的 `ChronicleStamp` 更新 | 更新 `passport_contract_state` |
| `SubjectAccountRegistryUpdated` | ERC6551 Registry 更新 | 更新 `passport_contract_state` |
| `SubjectAccountImplementationUpdated` | TBA implementation 更新 | 更新 `passport_contract_state` |
| `PassportCreated` | 工厂创建流程完成，带 `passportId / owner / assetFingerprint / subjectAccount / metadata` | Upsert `passports`，并写入 `chain_event_logs` |

### 1.2 AssetPassport

| 事件 | 作用 | 后端建议 |
| --- | --- | --- |
| `OwnershipTransferred` | `AssetPassport` owner 变更 | 更新 `passport_contract_state` |
| `Transfer` | ERC721 所有权变化 | 插入 `passport_transfer_history`，并更新 `passports.current_owner_address` |
| `Approval` | 单 token 授权变化 | 先只落 `chain_event_logs`，当前后端没有刚需查询 |
| `ApprovalForAll` | 全量 operator 授权变化 | 先只落 `chain_event_logs` |
| `AuthorityUpdated` | 核心护照合约绑定的 authority 更新 | 更新 `passport_contract_state` |
| `ChronicleUpdated` | 核心护照合约绑定的 chronicle 更新 | 更新 `passport_contract_state` |
| `FactoryAuthorizationUpdated` | trusted factory allowlist 变化 | Upsert `passport_trusted_factories` |
| `PassportMinted` | 护照铸造成功 | 创建或补全 `passports` 主记录 |
| `SubjectAccountBound` | 护照绑定 TBA | 更新 `passports.subject_account_address` |
| `PassportMetadataUpdated` | 护照元数据 CID 更新 | 更新 `passports` 的 metadata 字段 |
| `PassportStatusUpdated` | 护照状态更新 | 更新 `passports.status` |

### 1.3 PassportAuthority

| 事件 | 作用 | 后端建议 |
| --- | --- | --- |
| `OwnershipTransferred` | `PassportAuthority` owner 变更 | 更新 `passport_contract_state` |
| `AssetPassportUpdated` | authority 绑定的 `AssetPassport` 更新 | 更新 `passport_contract_state` |
| `ChronicleUpdated` | authority 绑定的 `ChronicleStamp` 更新 | 更新 `passport_contract_state` |
| `GlobalIssuerPolicySet` | 全局 issuer policy 更新 | Upsert `passport_issuer_policies` |
| `TypeIssuerPolicySet` | stamp type 级 issuer policy 更新 | Upsert `passport_issuer_policies` |
| `PassportIssuerPolicySet` | passport 级 issuer policy 更新 | Upsert `passport_issuer_policies` |
| `PassportCreatorSet` | creator 权限显式开关 | Upsert `passport_creators` |
| `PassportIssuerAllowlistModeSet` | 某 passport 是否开启 allowlist 模式 | Upsert `passport_allowlist_modes` |
| `StampTypeAdminSet` | stamp type admin 显式开关 | Upsert `passport_stamp_type_admins` |
| `RevocationOperatorSet` | 全局 revocation operator 显式开关 | Upsert `passport_revocation_operators` |

### 1.4 ChronicleStamp

| 事件 | 作用 | 后端建议 |
| --- | --- | --- |
| `OwnershipTransferred` | `ChronicleStamp` owner 变更 | 更新 `passport_contract_state` |
| `AssetPassportUpdated` | chronicle 绑定的 `AssetPassport` 更新 | 更新 `passport_contract_state` |
| `AuthorityUpdated` | chronicle 绑定的 `PassportAuthority` 更新 | 更新 `passport_contract_state` |
| `StampTypeConfigured` | stamp type 当前定义更新 | Upsert `passport_stamp_types` |
| `StampIssued` | 新 stamp 签发 | Upsert `passport_stamps` |
| `StampRevoked` | 显式撤销某个 stamp | 更新 `passport_stamps` 的撤销字段 |

## 2. 这套事件里最重要的 4 个后端语义

### 2.1 护照创建不是单事件完成

一次完整创建通常至少会涉及这些事件：

1. `AssetPassport.Transfer(address(0), owner, passportId)`
2. `AssetPassport.PassportMinted(...)`
3. `AssetPassport.SubjectAccountBound(...)`，如果本次创建出了 TBA
4. `PassportFactory.PassportCreated(...)`

因此后端不能把 `PassportCreated` 当成唯一来源，也不能在 `PassportMinted` 和 `PassportCreated` 上各插一条记录。正确做法是：

- `passports` 只按 `(chain_id, asset_passport_address, passport_id)` 做唯一 upsert
- `PassportMinted` 负责保证主记录存在
- `PassportCreated` 负责补充 `factory_contract_address` 和创建链路信息
- `SubjectAccountBound` 作为 `subject_account_address` 的最终权威来源

### 2.2 Policy 事件拿不到完整策略结构

`PassportAuthority` 的三个 policy 事件只带：

- `issuer`
- `enabled`
- `policyCID`

但链上真正的 `IssuerPolicy` 结构还有：

- `validAfter`
- `validUntil`
- `restrictToExplicitPassportList`

也就是说，仅靠事件无法完整重建策略快照。

所以 SQL 里我给 `passport_issuer_policies` 预留了：

- `valid_after`
- `valid_until`
- `restrict_to_explicit_passport_list`
- `needs_chain_refresh`

其中 `resource_id` 约定如下：

- `scope = 'global'` 时固定为 `0`
- `scope = 'type'` 时等于 `stampTypeId`
- `scope = 'passport'` 时等于 `passportId`

推荐同步策略：

1. 先消费事件并 upsert 当前 enabled/policyCID
2. 再调用链上 view：
   - `globalIssuerPolicyOf`
   - `typeIssuerPolicyOf`
   - `passportIssuerPolicyOf`
3. 把缺失字段补齐，并把 `needs_chain_refresh` 置为 `0`

### 2.3 Stamp supersede 不会额外发 `StampRevoked`

`ChronicleStamp.issueStamp(...)` 在 `supersedesStampId != 0` 时，会把旧 stamp 直接标记为 revoked，并设置 `revokedByStampId`，但不会再额外发一条 `StampRevoked`。

这意味着后端在处理 `StampIssued` 时必须额外做一件事：

- 如果 `supersedes_stamp_id != 0`
- 同步更新被替代的旧 stamp：
  - `revoked = 1`
  - `revoked_via = 'superseded'`
  - `revoked_by_stamp_id = new_stamp_id`

否则数据库里的当前状态会和链上 `stampRecordOf` 不一致。

### 2.4 Approval 事件先保留原始日志即可

`Approval` / `ApprovalForAll` 是标准 ERC721 事件，但当前项目：

- 前端没有 approval 索引列表需求
- 后端也没有 approval 查询接口

因此现阶段不建议先做专门 projection 表，直接保留到 `chain_event_logs` 就够了。这样不会漏数据，也避免一开始把索引器做得太重。

## 3. SQL 表设计说明

SQL 文件把数据分成三层。

### 3.1 同步控制层

- `chain_sync_cursors`

用途：

- 记录每个合约、每种事件当前已经扫到哪个区块
- 支持断点续扫
- 支持后续拆分成多个 worker

### 3.2 原始事件层

- `chain_event_logs`

用途：

- 保存每一条链上日志的原始入库记录
- 幂等键使用 `(chain_id, tx_hash, log_index)`
- 方便排查回放、补数据、重建 projection

### 3.3 当前状态层

| 表 | 用途 |
| --- | --- |
| `passport_contract_state` | 记录 4 个 passport 合约当前 owner 和互相引用关系 |
| `passports` | 护照当前快照 |
| `passport_transfer_history` | 所有 owner 变化历史 |
| `passport_trusted_factories` | trusted factory 当前状态 |
| `passport_creators` | creator 当前显式授权状态 |
| `passport_revocation_operators` | revocation operator 当前显式授权状态 |
| `passport_stamp_type_admins` | stamp type admin 当前显式授权状态 |
| `passport_allowlist_modes` | passport allowlist mode 当前状态 |
| `passport_issuer_policies` | issuer policy 当前快照，带链上补齐位 |
| `passport_stamp_types` | stamp type 当前定义 |
| `passport_stamps` | stamp 当前快照 |

补充约定：

- 事件里的 `address(0)` 建议在 projection 层统一写成 `NULL`
- 例如没有创建出 TBA 时，`subject_account_address` 不要保留零地址字符串
- `Transfer(from = address(0))` 仍然正常写入 `passport_transfer_history`，这样 mint 和普通转移能共用一条时间线

## 4. 为什么主键都带 `chain_id + contract_address`

因为 `passportId / stampId / stampTypeId` 都是 `uint256`，并不是全局唯一。

如果未来：

- 同一条链上存在多套部署
- 或者后端同时索引多条链

只靠 `passport_id` 或 `stamp_id` 一列一定会冲突。

所以这版 SQL 的默认原则是：

- 护照类主键带 `asset_passport_address`
- 印章类主键带 `chronicle_address`
- 权限类主键带 `authority_address`
- 所有表统一带 `chain_id`

## 5. 这版 SQL 能直接替代前端哪些全链扫描

当前前端有几类页面还在浏览器里从 `fromBlock = 0` 扫事件重建状态。后端索引器一旦接上，这几类都应该优先切到后端 API：

- creator 列表：`PassportCreatorSet`
- issuer policy 列表：`GlobalIssuerPolicySet / TypeIssuerPolicySet / PassportIssuerPolicySet`
- stamp type 列表：`StampTypeConfigured`
- revocation operator 列表：`RevocationOperatorSet`
- stamp type admin 列表：`StampTypeAdminSet`
- dashboard 里的统计计数

## 6. 推荐同步顺序

推荐索引器按下面顺序处理一条日志：

1. 先写 `chain_event_logs`
2. 再按事件类型 upsert 对应 projection
3. 如果事件是 policy 类，再补一次链上 view 快照
4. 成功后推进 `chain_sync_cursors.next_block`

## 7. 本次 SQL 没有单独建表的事件

下面这些事件没有单独 projection 表，但不会丢，因为已经进入 `chain_event_logs`：

- `Approval`
- `ApprovalForAll`

如果后续确实要做 NFT approval 查询接口，再补专门表即可。
