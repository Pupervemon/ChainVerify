# ChronicleStamp 合约说明

## 合约定位

`ChronicleStamp` 是资产护照体系中的履历记录合约，用于表示某本资产护照在生命周期中发生的各种事件。

它解决的不是“有多少枚某类印章”的问题，而是“某本护照发生过哪些具体事件”的问题。

因此第一版实现明确采用：

- `stampTypeId` 表示事件类别
- `stampId` 表示具体事件实例

这使它更适合做履历系统，而不是简单的资产分类系统。

## 业务职责

`ChronicleStamp` 当前承担以下职责：

- 定义和维护履历事件类型
- 对符合权限条件的发行方开放履历签发入口
- 为每条履历事件生成唯一 `stampId`
- 建立 `passportId -> stampId[]` 的索引关系
- 提供“当前有效印章”的快速读取能力
- 处理 supersede 与 revoke 两种失效路径

它不负责：

- 资产主体护照的铸造与转移
- 白名单和角色策略本身的定义

这两块由 `AssetPassport` 和 `PassportAuthority` 负责。

## 为什么不直接用 ERC-1155 余额模型

如果只需要表达：

- 这本护照曾被维修过 3 次
- 曾被拍卖行展出过 2 次

那么 ERC-1155 余额模型是够用的。

但如果系统要表达的是“履历事件实例”，每一次事件都需要保留：

- 发生时间
- 发行机构
- 元数据 CID
- 是否已撤销
- 是否由后续事件替代

那么“按类型累计余额”就不再是合适的事实来源。

所以当前 `ChronicleStamp` 的核心设计是“唯一事件台账”，而不是“类型余额账户”。

## 核心数据结构

### 事件类型

```solidity
struct StampTypeConfig {
    string code;
    string name;
    string schemaCID;
    bool active;
    bool singleton;
}
```

字段含义：

- `code`：类型编码，便于系统内部引用
- `name`：类型名称
- `schemaCID`：类型元数据结构说明
- `active`：该类型是否允许继续签发
- `singleton`：是否只允许同一本护照存在一个当前有效记录

### 履历记录

```solidity
struct StampRecord {
    uint256 stampId;
    uint256 passportId;
    uint256 stampTypeId;
    address issuer;
    uint64 occurredAt;
    uint64 issuedAt;
    string metadataCID;
    bool revoked;
    uint256 supersedesStampId;
    uint256 revokedByStampId;
}
```

字段含义：

- `stampId`：唯一履历编号
- `passportId`：所属资产护照
- `stampTypeId`：事件类型
- `issuer`：签发机构地址
- `occurredAt`：业务发生时间
- `issuedAt`：链上写入时间
- `metadataCID`：详细业务内容的链下元数据入口
- `revoked`：是否失效
- `supersedesStampId`：本条记录替代了哪条旧记录
- `revokedByStampId`：本条记录是否被后续记录替代

## 事件类型管理

核心入口函数：

```solidity
function configureStampType(
    uint256 stampTypeId,
    PassportTypes.StampTypeConfig calldata config
) external;
```

当前允许配置类型的主体：

- 合约 owner
- `PassportAuthority` 中配置的某个 `stampTypeId` 类型管理员

这使得你可以将不同履历类型的治理权拆给不同角色，例如：

- 官方认证类型由品牌方管理
- 维修类型由维修中心联盟管理
- 展陈类型由拍卖行或策展机构管理

## 签发流程

核心入口函数：

```solidity
function issueStamp(
    uint256 passportId,
    uint256 stampTypeId,
    uint64 occurredAt,
    string calldata metadataCID,
    uint256 supersedesStampId
) external returns (uint256 stampId);
```

当前签发时会做以下校验：

1. `metadataCID` 非空
2. `occurredAt` 非零且不能晚于当前区块时间
3. `assetPassport` 和 `authority` 已配置
4. 调用 `PassportAuthority.canIssue(...)` 验证当前签发地址权限
5. 目标 `passportId` 必须存在
6. 目标护照状态必须为 `Active`
7. `stampTypeId` 必须处于激活状态
8. 如为 `singleton` 类型，则必须满足当前有效记录的替换规则

## `singleton` 类型语义

`singleton` 的设计目的，是处理“同一时刻只能有一个有效结论”的场景，例如：

- 当前官方认证状态
- 当前保真状态
- 当前监管状态

规则如下：

- 若该类型尚无当前有效记录，则可直接签发
- 若已有当前有效记录，则新签发必须通过 `supersedesStampId` 指向当前有效记录
- 旧记录会被标记为 `revoked = true`
- 旧记录的 `revokedByStampId` 会指向新的记录

这个模型可以很好地保留历史变化链，而不是简单覆盖掉旧结论。

## 撤销模型

核心入口函数：

```solidity
function revokeStamp(uint256 stampId, string calldata reasonCID) external;
```

当前撤销要求：

- `reasonCID` 非空
- 调用方通过 `PassportAuthority.canRevoke(...)` 校验
- 目标 `stampId` 必须存在
- 目标记录此前未被撤销

撤销后的效果：

- `record.revoked = true`
- 如果它正好是某个类型下的当前有效记录，则 `latestEffectiveStampId` 会被清空

当前设计选择了一个偏保守的语义：

- 直接撤销某条记录，不会自动恢复之前被 supersede 的旧记录

这样做的原因是：

- “恢复旧记录”往往是业务判断，不适合自动化假设
- 更稳妥的做法是重新签发一条纠正性记录

## 索引模型

为便于后端或前端快速读取，当前合约维护了两套主要索引：

- `_stampIdsByPassport[passportId]`
- `_latestEffectiveStampIds[passportId][stampTypeId]`

对应读取接口：

- `stampCountByPassport(passportId)`
- `stampIdByPassportAndIndex(passportId, index)`
- `latestEffectiveStampId(passportId, stampTypeId)`

这套结构适合：

- 展示护照全量履历
- 快速展示当前认证状态、当前维修状态等摘要信息

## 权限依赖

`ChronicleStamp` 不内置复杂授权规则，而是把权限判断委托给 `PassportAuthority`：

- `issueStamp` -> `canIssue`
- `revokeStamp` -> `canRevoke`
- `configureStampType` -> `isStampTypeAdmin`

这种设计的优点是：

- 记录合约保持聚焦
- 权限规则可单独迭代
- 后续更换权限模型时不必重写履历记录逻辑

## 事件设计

核心业务事件包括：

- `StampTypeConfigured`
- `StampIssued`
- `StampRevoked`
- `AssetPassportUpdated`
- `AuthorityUpdated`

后端如果要做索引，建议重点消费：

- `StampIssued`
- `StampRevoked`

因为这两个事件已经包含了记录同步所需的大部分关键上下文。

## 当前实现边界

第一版实现仍然有一些刻意保留的扩展空间：

- 未直接实现 ERC-1155 / ERC-721 的印章 Token 化展示
- 未做分页读取优化
- 未实现批量签发
- 未支持链下签名授权发行
- 未支持按 passport 分级的复杂业务约束

这些可以在主流程跑通后继续迭代。
