# Stamp Type Admin 页面使用说明

## 1. 页面是做什么的

`Stamp Type Admin` 页面用于配置某个 `stampTypeId` 的定义。

这个页面负责写入 `ChronicleStamp.configureStampType(...)`，也就是管理：

- `code`
- `name`
- `schemaCID`
- `active`
- `singleton`

它处理的是“印章类型定义”，不是发章授权。

这个页面不负责：

- 给地址授予 stamp type admin 权限
- 给 issuer 授予发章权限
- 签发具体 stamp

## 2. 谁可以操作

当前合约里，满足下面任意一种身份，才可以配置某个 stamp type：

- `ChronicleStamp.owner`
- 该 `stampTypeId` 对应的 `stamp type admin`

权限判断来自 `ChronicleStamp` 合约内部：

- `owner` 可以管理任意 type
- 非 owner 需要通过 `PassportAuthority.isStampTypeAdmin(stampTypeId, operator)`

这意味着：

- 权限不是在这个页面里发放的
- `stamp type admin` 身份需要先在权限页面里被授予

## 3. 页面结构

页面主要分成 3 块：

### 3.1 Authority Snapshot

用于查看当前环境和角色状态：

- `ChronicleStamp` 合约地址
- `Target / Current Network`
- `Owner`
- 当前钱包是否是 `Chronicle Owner` 或 `Stamp Type Admin`

### 3.2 Configure Stamp Type

这是核心编辑区，用来加载并提交某个 `stampTypeId` 的配置。

### 3.3 On-chain List / Current Config / Operational Notes

用于：

- 浏览已配置类型
- 查看当前加载的链上配置
- 了解权限模型

## 4. 完整使用流程

## 4.1 第一步：确定你要操作的 Stamp Type ID

先输入目标 `stampTypeId`。

这个页面支持两种方式进入：

- 从右侧 `Configured Stamp Types` 列表里点选一个已存在的 type
- 直接手动输入一个 type ID

这两种方式都可以。

## 4.2 第二步：加载当前配置

点 `Load` 后，页面会读取：

- `ChronicleStamp.stampTypeOf(stampTypeId)`
- `PassportAuthority.isStampTypeAdmin(stampTypeId, currentWallet)`

页面会据此得到：

- 当前链上的配置值
- 当前钱包是否是这个 type 的 admin

如果当前钱包是 `ChronicleStamp.owner`，即使 `isStampTypeAdmin = false`，依然可以管理。

## 4.3 第三步：编辑配置字段

页面可编辑的字段有 5 个。

### Code

业务代码，用于标识这个印章类型，例如：

- `AUTHENTIC`
- `MAINTENANCE`
- `INSPECTION`

当前前端要求它不能为空。

### Name

这个 stamp type 的业务名称。

当前前端也要求它不能为空。

### Schema CID

这个字段用于绑定该印章类型对应的链下数据结构说明，例如：

- `ipfs://...`
- `ar://...`

它通常用于约束该类型 stamp 的 metadata 应该长什么样。

当前合约只存 CID，不会验证 CID 对应内容。

### Active

表示这个 stamp type 当前是否启用。

业务含义：

- `true`：允许对这个 type 继续签发
- `false`：该 type 仍然存在，但不能继续签发新 stamp

### Singleton

表示这个 stamp type 是否是单例类型。

业务含义：

- `true`：同一本 passport 在这个 type 下，同一时刻只能有一条有效 stamp
- `false`：同一本 passport 在这个 type 下可以存在多条记录

这会直接影响 `Issue Stamp` 页面的 `supersedes` 规则和合约校验逻辑。

## 4.4 第四步：提交 Configure Stamp Type

点击按钮后，前端会调用：

- `ChronicleStamp.configureStampType(stampTypeId, config)`

提交成功后，页面会：

- 显示成功提示
- 刷新右侧类型列表
- 重新加载当前 type 的链上配置

## 5. 这个页面最重要的业务特点

## 5.1 它是整条配置覆盖写入，不是局部修改

这是最容易被忽略的一点。

`configureStampType(...)` 会提交整条配置结构体：

- `code`
- `name`
- `schemaCID`
- `active`
- `singleton`

也就是说：

- 你不是只改其中一个字段
- 而是把整条配置重新写一遍

因此，正确操作应该是：

1. 先 `Load`
2. 让表单回填当前链上值
3. 在现有基础上修改你想改的字段
4. 再提交

如果不先加载，直接提交，可能会把其他字段一起覆盖成当前表单里的值。

## 5.2 新类型也可以通过这里创建

如果某个 `stampTypeId` 之前还没有真正配置过：

- 它不会出现在右侧事件列表里
- 但你仍然可以手动输入这个 ID
- 只要你有权限，就可以直接提交第一版配置

第一次成功提交后：

- 链上会发出 `StampTypeConfigured` 事件
- 这个 type 才会出现在右侧列表中

## 5.3 右侧列表来自事件，不是 storage 枚举

`Configured Stamp Types` 列表是根据 `StampTypeConfigured` 事件重建出来的。

它适合：

- 看当前已配置过的 type
- 快速点选回填

但它不是协议层的强枚举接口。

## 6. 当前前端和合约的职责边界

当前前端会做一些输入约束，但合约本身不完全一样。

### 前端当前要求

- `code` 不能为空
- `name` 不能为空

### 合约当前实际限制

合约层对 `configureStampType(...)` 的核心限制主要是：

- 你有没有权限

也就是说：

- 前端比合约更严格
- `schemaCID` 为空在链上是允许的

从业务角度看，这种前端约束是合理的，因为空 `code` / `name` 会让后续运营和前端展示都比较混乱。

## 7. active 和 singleton 分别影响什么

## 7.1 Active

`active = false` 的影响是：

- 这个 type 定义仍然存在
- 但 `Issue Stamp` 时会被 `ChronicleStamp.issueStamp(...)` 拒绝

所以它更像：

- “停用该类型”

而不是删除。

## 7.2 Singleton

`singleton = true` 的影响是：

- 同一本 passport 在该 type 下只能保留一条当前有效记录
- 后续签发时，必须正确填写 `supersedesStampId`

如果已经存在有效 stamp，再签发新 stamp 时：

- 新 stamp 必须替代当前 `latestEffectiveStampId`

否则链上会直接拒绝。

## 8. 谁适合用这个页面

### 场景 1：平台方统一定义印章类型

适合。

前提是：

- 当前钱包是 `ChronicleStamp.owner`

### 场景 2：按业务域拆分给合作方维护类型

适合。

前提是：

- 平台先给合作方授予指定 `stampTypeId` 的 admin 权限
- 合作方再来这里维护该 type 的定义

这也是当前系统向基础设施方向扩展时比较合理的模式。

### 场景 3：停用某个旧印章类型

适合。

做法是：

- 加载该 type
- 把 `Active` 改为 `false`
- 提交

## 9. 当前页面的边界和注意事项

### 这个页面不授予权限

它只消费权限，不发放权限。

如果当前钱包不是 owner，也不是该 type 的 admin，就算能打开页面，也不能提交成功。

### 不建议盲改 singleton

因为 `singleton` 会直接改变后续签发规则。

如果某个 type 已经在线上使用，修改它前需要先确认：

- 后续签发流程是否已经准备好按 singleton 规则处理

### Schema CID 只是引用，不是链上校验规则本身

当前系统只把 `schemaCID` 作为配置元数据保存。

是否真的按该 schema 校验数据，取决于链下流程和前端实现，不是这个合约自动完成的。

## 10. 操作建议

- 每次修改前先 `Load`
- 把这个页面当成“整条 type 配置编辑器”，不是单字段开关页
- 新建 type 时，可以直接手动输入一个新 `stampTypeId`
- 提交前确认当前钱包的角色到底是 `Chronicle Owner` 还是该 type 的 `Stamp Type Admin`
- 停用类型优先用 `Active = false`，不要把业务语义和删除概念混在一起
- 修改 `singleton` 前，先确认 `Issue Stamp` 侧的流程和业务方是否已经同步
