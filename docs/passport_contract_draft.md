# 资产护照合约设计草案

本文档用于说明链上“资产护照”功能的第一版合约架构设计。

## 设计目标

- 使用唯一的 ERC-721 护照作为每个资产在链上的规范化身份标识。
- 将每一条履历事件视为独立记录，即使它们属于同一种事件类型。
- 在数据模型层面保持 TBA 和 ERC-6551 为可选能力，但为后续接入预留清晰扩展点。
- 保持后端采用事件驱动模型。后端应直接消费内容完整的链上事件，而不是每次写入后再额外回链上读取状态。

## 推荐的合约拆分

- `AssetPassport`：资产主体身份合约，负责资产护照的核心状态与生命周期。
- `ChronicleStamp`：履历记录合约，以 `stampId` 作为唯一履历记录主键。
- `PassportAuthority`：权限策略合约，负责发行方授权与细粒度权限控制。
- `PassportFactory`：可选的工厂合约，用于统一处理护照铸造和 `subjectAccount` 初始化。

## 为什么不建议将 ERC-1155 余额作为事实来源

ERC-1155 很适合表示有限的类别，但如果系统需要记录“履历事件”，而每个事件实例都带有自己的元数据、发生时间、签发方和撤销状态，那么仅靠基于余额的模型并不够。

因此，本草案明确区分：

- `stampTypeId`：事件类别标识
- `stampId`：具体事件实例的唯一标识

如果未来希望为了展示或兼容性增加一层 ERC-1155 镜像，可以在 `stampId` 台账之上构建，而不应反过来替代它。

## 核心主键

- `passportId`：整个系统中的主体主键，用于标识资产护照。
- `subjectAccount`：可选的附属账户地址，通常用于未来接入 ERC-6551。
- `stampId`：每一条履历事件的唯一主键。
- `stampTypeId`：用于权限控制与索引的类别主键。

## 权限模型

本草案不直接把权限硬编码为“维修机构”“拍卖行”等固定角色，而是支持围绕以下维度进行策略判断：

- 发行方地址 `issuer`
- 印章类型 `stampTypeId`
- 护照编号 `passportId`

这种方式比单纯的角色矩阵更灵活，后续更容易扩展白名单、有效期控制，以及针对单本护照的授权策略。

当前 `PassportAuthority.sol` 第一版的权限语义如下：

- 全局发行策略可以授予某地址广泛的签发权限
- 类型级发行策略可以授予某地址针对单个 `stampTypeId` 的签发权限
- 护照级发行策略可以授予某地址针对单个 `passportId` 的签发权限
- `passportAllowlistMode` 可强制要求某本护照必须具备显式的护照级授权后才能签发
- `restrictToExplicitPassportList` 可让全局策略或类型策略进一步要求：即便策略本身有效，也必须同时具备该护照的显式授权

当前允许执行撤销操作的角色包括：

- 合约 owner
- 专门配置的撤销操作员
- 该履历记录的原始签发者
- 对应 `stampTypeId` 的类型管理员

## 事件模型

为了便于后端进行事件索引与落库，链上事件应直接携带后端所需的关键字段，包括：

- `passportId`
- `stampId`
- `stampTypeId`
- `issuer`
- `subjectAccount`
- 时间戳字段
- `metadataCID`
- supersede 与 revoke 相关引用字段

这与当前仓库已有的“后端监听事件并写入数据库”的模式保持一致。

## ChronicleStamp 语义

第一版 `ChronicleStamp.sol` 当前采用如下规则：

- 只有状态为 `Active` 的护照才允许新增履历印章
- 每一条新增履历都会生成唯一的 `stampId`
- `stampTypeId` 表示类别，不表示具体事件实例
- 当某个类型被配置为 `singleton` 时，同一本护照在该类型下同一时间只能存在一条当前有效记录
- 如果要替换当前有效的 `singleton` 记录，必须通过 `supersedesStampId` 指向当前有效印章
- 被 supersede 的旧记录会被标记为已撤销，并写入 `revokedByStampId`
- 直接调用 `revokeStamp` 撤销某条记录时，不会自动恢复之前被 supersede 的记录；如果要纠正状态，应通过新的一次签发来完成
- `latestEffectiveStampId(passportId, stampTypeId)` 用于快速读取某本护照在某个类型下的当前有效印章

## ChronicleStamp 授权规则

当前 `ChronicleStamp.sol` 第一版实现中：

- `issueStamp` 需要通过 `PassportAuthority.canIssue(msg.sender, stampTypeId, passportId)` 校验
- `configureStampType` 仅允许合约 owner 或 `PassportAuthority` 中配置的类型管理员调用
- `revokeStamp` 需要通过 `PassportAuthority.canRevoke(msg.sender, stampId)` 校验

## AssetPassport 语义

第一版 `AssetPassport.sol` 当前使用自包含的最小 ERC-721 实现，主要规则如下：

- `assetFingerprint` 必须非零，且在全局范围内唯一
- 护照铸造目前允许合约 owner 调用，后续也允许配置后的 `factory` 调用
- 新铸造的护照默认状态为 `Active`
- 状态为 `Frozen` 或 `Retired` 的护照不可转移
- 护照元数据允许由当前 token 持有人、已授权操作员或合约 owner 更新
- 护照状态允许由合约 owner 或配置后的 `authority` 合约修改
- `subjectAccount` 当前由合约 owner 或 `factory` 负责绑定

这样做的目的是在还未引入 OpenZeppelin 或 ERC-6551 依赖之前，先把护照主体能力和 `ChronicleStamp` 需要读取的状态稳定下来。

## PassportFactory 语义

第一版 `PassportFactory.sol` 当前作为一个薄协调层，主要职责如下：

- 统一调用 `AssetPassport.mintPassport(...)` 创建新的资产护照
- 在配置了 `subjectAccountRegistry` 和 `subjectAccountImplementation` 时，按 ERC-6551 风格为新护照创建对应的 `subjectAccount`
- 在成功创建 `subjectAccount` 后，回写到 `AssetPassport.setSubjectAccount(...)`
- 对外发出 `PassportCreated` 事件，供后端或索引器统一消费

当前第一版实现中的约束如下：

- `createPassport(...)` 当前由 `PassportAuthority.canCreatePassport(msg.sender)` 决定是否允许调用；默认 `PassportAuthority.owner` 可调用，也可额外授权 `passportCreator`
- `initData.initialHolder` 当前必须显式提供，不能为零地址
- 如果未配置 `subjectAccountRegistry` 或 `subjectAccountImplementation`，工厂仍可正常创建护照，只是不会创建 `subjectAccount`
- `previewSubjectAccount(passportId)` 当前使用 ERC-6551 风格的 `registry.account(...)` 方式预估账户地址
- `authority` 和 `chronicle` 地址目前主要作为配置预留，便于后续把工厂初始化流程继续串起来

这意味着当前的 `PassportFactory` 更偏向“后台/管理端统一铸造入口”，而不是一个完全开放给任意用户直接调用的工厂。

## 建议的下一步

在接口和数据模型确认后，建议按以下顺序继续实现：

1. `PassportAuthority`
2. `AssetPassport`
3. `ChronicleStamp`
4. `PassportFactory`

这个顺序可以尽量减少循环依赖，也能让 `Factory` 保持为一个薄协调层，而不是把业务规则堆到工厂合约里。
