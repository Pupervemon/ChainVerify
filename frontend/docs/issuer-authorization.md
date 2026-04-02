# Issuer Authorization 页面使用说明

## 1. 页面是做什么的

`Issuer Authorization` 页面用于管理某个 `issuer address` 的发章授权。

这个页面只处理一件事：

- 某个地址是否可以发章
- 这个权限生效在哪个范围
- 这个权限从什么时候开始生效，到什么时候失效
- 是否要求进一步缩小到 passport 级别的显式授权

这个页面不负责：

- 创建 Passport
- 创建 Stamp Type
- 编辑 Stamp 内容
- 校验 `policyCID` 指向的文档内容

## 2. 谁可以操作

只有 `PassportAuthority.owner` 可以提交修改。

非 owner 钱包进入页面时：

- 可以查看已有授权
- 可以加载某个 issuer 的授权上下文
- 不能保存授权
- 不能修改 passport 的 allowlist enforcement

## 3. 使用前提

在操作前，需要满足下面几个条件：

- 钱包已连接
- 网络已切到当前前端配置的目标链
- `PassportAuthority` 合约地址已在前端环境中配置
- 你知道要配置的 `issuer address`
- 如果要配置 `Type` 范围，你还需要知道 `stampTypeId`
- 如果要配置 `Passport` 范围，你还需要知道 `passportId`

## 4. 页面整体分成哪几块

页面主要分成 3 个区域：

### 4.1 顶部状态卡

用于快速确认当前环境：

- `Access`：当前钱包是否有 owner 权限
- `Owner`：当前 `PassportAuthority.owner`
- `Current Scope`：当前编辑中的授权范围
- `Authorized Entries`：当前通过事件索引出的已启用授权条目数量

### 4.2 Configure Authorization

这是核心编辑区，用来加载并修改一条授权记录。

### 4.3 Authorization Snapshot / Authorized Addresses

- `Authorization Snapshot`：当前已加载上下文的链上快照
- `Authorized Addresses`：按事件重建出的启用中地址列表，便于快速回填编辑

## 5. 完整使用流程

## 5.1 第一步：选择授权范围

页面支持 3 种范围：

### Global

表示这个 issuer 在全局范围内有发章权限。

业务含义：

- 可以对任意 passport 发章
- 可以对任意 stamp type 发章
- 但仍然要通过其他合约校验
  - passport 必须存在
  - passport 状态必须允许
  - stamp type 必须是 active

### Type

表示这个 issuer 只对某一个 `stampTypeId` 有发章权限。

业务含义：

- 只能发某一个类型的章
- 不限制 passportId
- 但仍然要通过 passport 是否可发章的其他校验

### Passport

表示这个 issuer 只对某一个 `passportId` 有发章权限。

业务含义：

- 只限制到 passport
- 当前合约里，这个范围不是 “passport + stamp type”
- 也就是说，只要这个 issuer 对该 passport 有 passport-level authorization，它就可以对该 passport 发任意 active 的 stamp type

这一点是当前业务里最需要注意的地方。

## 5.2 第二步：填写上下文

选择完范围后，填写对应字段：

- 所有范围都要填 `Issuer Address`
- `Type` 范围额外填写 `Stamp Type ID`
- `Passport` 范围额外填写 `Passport ID`

只有这些字段完整且格式正确后，页面才能加载该上下文。

## 5.3 第三步：点击 Load Authorization

这一步会从链上读取当前这条授权记录，并回填到表单。

读取规则：

- `Global` 读取 `globalIssuerPolicyOf(issuer)`
- `Type` 读取 `typeIssuerPolicyOf(issuer, stampTypeId)`
- `Passport` 读取 `passportIssuerPolicyOf(issuer, passportId)`

如果当前是 `Passport` 范围，还会额外读取：

- `passportAllowlistMode(passportId)`

建议每次修改前都先点一次 `Load Authorization`，先确认链上当前状态，再编辑。

## 5.4 第四步：修改授权字段

### Enable Authorization

表示这条授权是否启用。

- 开启：这条授权有机会参与 `canIssue()` 判断
- 关闭：这条授权直接视为无效

注意：

- 即使开启，也不代表一定能成功发章
- 时间窗过期后，这条授权同样会失效

### Require Passport-Level Authorization

这个开关只会出现在 `Global` 和 `Type` 范围。

它对应合约里的 `restrictToExplicitPassportList`。

业务含义：

- 如果关闭：
  - 全局授权或类型授权本身就足够
- 如果开启：
  - 全局授权或类型授权本身不够
  - issuer 还必须同时拿到目标 passport 的显式 passport-level authorization

可以把它理解成：

- `Global` / `Type` 给的是大范围资格
- 这个开关决定是否还要再下沉到 passport 逐本授权

注意：

- 这个字段在 `Passport` 范围下没有意义
- 所以页面在 `Passport` 范围下不会显示它

### Valid After

授权从什么时候开始生效。

- 留空：立即生效
- 填时间：只有到达该时间后才算有效

### Valid Until

授权什么时候失效。

- 留空：永不过期
- 填时间：超过该时间后失效

### Authorization Document CID

用于记录这条授权对应的链下说明文档地址，例如 `ipfs://...`。

它的作用是留痕和对账，不参与链上权限判断。

## 5.5 第五步：点击 Save Authorization

保存时，页面会根据当前 scope 调不同的合约函数：

- `Global` -> `setGlobalIssuerPolicy`
- `Type` -> `setTypeIssuerPolicy`
- `Passport` -> `setPassportIssuerPolicy`

保存成功后，页面会：

- 等待交易确认
- 重新加载当前上下文
- 刷新下方的授权列表

## 5.6 第六步：如果是 Passport 范围，再决定是否开启 Allowlist Enforcement

当 scope 为 `Passport` 时，页面会出现 `Passport Allowlist Enforcement` 区块。

这里控制的是 `passportAllowlistMode(passportId)`。

它和上面的 `Save Authorization` 是两笔独立交易，不会一起提交。

操作方式：

1. 先加载某个 passport 范围上下文
2. 勾选或取消 `Enable Allowlist Enforcement`
3. 点击 `Update Allowlist Enforcement`

## 6. Allowlist Enforcement 的真实业务含义

这是这个页面里最容易误解的部分。

开启后，某个 passport 的发章判断会变成：

- 只有显式的 passport-level authorization 才算数
- global authorization 不再单独生效
- type authorization 不再单独生效

关闭后，判断顺序恢复为普通模式。

它不是：

- 冻结 passport
- 禁止 passport 被使用
- 禁止所有人发章

它只是把这个 passport 的授权口径切换成“必须逐本显式授权”。

## 7. 当前合约里的实际判定顺序

当前 `PassportAuthority.canIssue(issuer, stampTypeId, passportId)` 的核心顺序如下：

1. 先看该 issuer 对该 passport 是否有 passport-level authorization
2. 如果该 passport 开启了 allowlist enforcement
   - 直接只认第 1 步结果
3. 如果第 1 步已经命中
   - 直接允许
4. 再看是否有 type-level authorization
   - 如果该 type policy 要求 passport-level authorization，则还必须命中第 1 步
5. 再看是否有 global authorization
   - 如果该 global policy 要求 passport-level authorization，则还必须命中第 1 步
6. 都不满足则拒绝

这意味着：

- passport-level authorization 优先级最高
- allowlist enforcement 是一个强覆盖开关
- `restrictToExplicitPassportList` 只对 `Global` / `Type` 路径有意义

## 8. Snapshot 和 Authorized Addresses 怎么看

## 8.1 Authorization Snapshot

这里展示的是你当前加载的那条链上记录，适合用来确认：

- 当前 scope
- 当前是否 enabled
- 当前时间窗
- 当前 CID
- 如果是 passport scope，还能看到 allowlist enforcement 当前状态

这个区域是查看“当前上下文真实状态”的主要地方。

## 8.2 Authorized Addresses

这个列表不是直接枚举合约 storage，而是根据事件重建出来的。

它的特点：

- 能快速看到当前启用中的授权地址
- 可以一键 `Load` 到编辑区
- 适合做运营查看和快速跳转

它的限制：

- 这里只能可靠反映最新启用状态
- 不是完整的链上授权明细视图
- 精确时间窗仍然要看上面的 `Authorization Snapshot`

## 9. 常见业务配置场景

### 场景 1：某合作方可以给所有 passport 发章

配置方式：

- Scope 选 `Global`
- 填合作方地址
- 开启 `Enable Authorization`
- 不开启 `Require Passport-Level Authorization`

结果：

- 这个合作方默认可对所有 passport 发所有 active stamp type

### 场景 2：某合作方只能发某一种章

配置方式：

- Scope 选 `Type`
- 填合作方地址
- 填目标 `stampTypeId`
- 开启 `Enable Authorization`

结果：

- 这个合作方只能发这一种类型的章

### 场景 3：某合作方虽然有全局权限，但只能对白名单 passport 发章

配置方式：

- 先配置一条 `Global` 授权
- 开启 `Require Passport-Level Authorization`
- 再按 passport 逐本配置 `Passport` 授权

结果：

- 全局资格存在
- 但只有拿到 passport-level authorization 的 passport 才能真正发章

### 场景 4：某本 passport 必须逐本授权，不能吃全局或类型权限

配置方式：

- 进入该 `Passport` 范围
- 开启 `Passport Allowlist Enforcement`
- 再配置需要的 passport-level authorization

结果：

- 该 passport 不再接受单独的 global / type 授权
- 只有显式 passport-level authorization 才能发章

## 10. 当前业务限制

### Passport 范围不是按 stamp type 细分

当前 passport-level authorization 只限制到 passport，不限制 stamp type。

也就是说：

- 给某个 issuer 配了 `passportId = 10` 的 passport-level authorization
- 只要 stamp type 是 active
- 这个 issuer 就可以对 passport `#10` 发任意类型的章

如果未来业务希望做到：

- 某地址只能对某本 passport 发某一种章

那需要新增更细粒度的授权结构，当前合约还不支持。

### policyCID 不参与权限判断

`Authorization Document CID` 只是留痕字段。

即使 CID 为空，授权依然可以有效。

### 是否能成功发章，不只看这个页面

即使这里显示已经授权，实际发章仍然可能失败，因为还会被其他合约条件拦住，例如：

- passport 不存在
- passport 状态不是 Active
- stamp type 不是 active
- 其他发章参数不合法

## 11. 操作建议

- 每次改授权前，先 `Load Authorization`
- 改 `Global` / `Type` 权限时，先确认是否真的需要打开 `Require Passport-Level Authorization`
- 改 `Passport` 范围时，区分清楚
  - 你是在改某条 issuer 的 passport-level authorization
  - 还是在改这个 passport 的 allowlist enforcement
- 核对结果优先看 `Authorization Snapshot`
- 浏览已启用地址可以看 `Authorized Addresses`
