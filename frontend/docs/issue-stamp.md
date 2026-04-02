# Issue Stamp 页面使用说明

## 1. 页面是做什么的

`Issue Stamp` 页面用于给某一本 passport 签发一条新的 stamp 记录。

这个页面做的事情很直接：

- 选择 `passportId`
- 选择或填写 `stampTypeId`
- 填写发生时间 `occurredAt`
- 填写 `metadataCID`
- 根据需要填写 `supersedesStampId`
- 直接调用 `ChronicleStamp.issueStamp(...)` 提交签发

这个页面不负责：

- 配置发章权限
- 创建 Passport
- 创建 Stamp Type
- 编辑已有 stamp 内容

## 2. 谁可以使用

从页面交互上看，任何连接钱包的人都可以进入。

但是否真的能提交成功，要看当前钱包地址是否满足发章权限和上下文条件。

页面顶部的 `Access` 卡片展示的是“当前是否具备实际提交条件”，不是只看 `PassportAuthority.canIssue()` 的单一结果。

## 3. 使用前提

在操作前，需要满足下面这些条件：

- 钱包已连接
- 网络已切到当前前端目标链
- 前端已配置完整的 Passport 相关合约地址
- 目标 `passportId` 存在
- 目标 `stampTypeId` 已配置
- 目标 stamp type 处于 `active`
- 当前钱包对这个 passport 和 stamp type 具备发章权限

如果其中任何一步不满足，页面会在 `Access` 卡片里直接显示原因。

## 4. 页面主要分成哪几块

### 4.1 顶部状态卡

用于快速判断当前是否可以签发：

- `Access`
- `Target / Current Network`
- `Stamp Type`

### 4.2 Stamp Input

这是主输入区，用来填写签发参数。

### 4.3 Transaction Outcome

用于查看提交结果、报错和最新有效 stamp。

## 5. 完整使用流程

## 5.1 第一步：输入 Passport ID

先填写目标 `Passport ID`。

这表示你准备把 stamp 发到哪一本 passport 上。

页面之后会去检查：

- 这本 passport 是否存在
- 这本 passport 当前状态是否允许发章

当前合约要求 passport 必须是 `Active`，否则不能签发。

## 5.2 第二步：选择 Stamp Type

页面支持两种方式选择 stamp type：

- 从下拉框选择已配置的类型
- 手动输入 `stampTypeId`

下拉框的数据来源不是 storage 枚举，而是根据 `StampTypeConfigured` 事件重建出来的当前类型列表。

如果下拉框为空，通常说明下面几种情况之一：

- 前端没有完整合约配置
- 当前钱包链不对
- 链上还没有配置任何 stamp type

页面右侧有 `Refresh Types`，可以重新拉一次当前链上的配置结果。

## 5.3 第三步：等待 Access 自动检查

当 `passportId` 和 `stampTypeId` 都是合法数字后，页面会自动加载签发上下文。

它会同时检查：

- `PassportAuthority.canIssue(address, stampTypeId, passportId)`
- `AssetPassport.exists(passportId)`
- `AssetPassport.recordOf(passportId).status`
- `ChronicleStamp.stampTypeOf(stampTypeId)`
- `ChronicleStamp.latestEffectiveStampId(passportId, stampTypeId)`

也就是说，这个页面不是只看权限，还会把 passport 状态、stamp type 状态、singleton 上下文一起拿回来。

## 5.4 第四步：填写 Occurred At

`Occurred At` 表示这条业务事件实际发生的时间。

它不是链上提交时间，而是业务发生时间。

规则：

- 必填
- 不能是空
- 不能是未来时间
- 不能是 0

前端会把这个时间转成 Unix 秒时间戳，再提交给合约。

## 5.5 第五步：填写 Metadata CID

`Metadata CID` 是这条 stamp 的业务内容地址，例如 `ipfs://...`。

规则：

- 必填
- 不能为空字符串

它通常用于承载这条 stamp 的详细材料、结构化数据或链下证明内容。

## 5.6 第六步：决定是否填写 Supersedes Stamp ID

这个字段用于表示：

- 新 stamp 是否替代一条旧 stamp

如果不替代旧记录，就填 `0`，或者直接留空。

当前前端行为是：

- 空字符串会按 `0` 处理
- 非数字会直接视为非法输入

## 5.7 第七步：点击 Issue Stamp

提交时，前端会直接调用：

- `ChronicleStamp.issueStamp(passportId, stampTypeId, occurredAt, metadataCID, supersedesStampId)`

在真正发送交易前，前端会先做一次 `estimateContractGas(...)`，然后带着估算值提交。

这样做是为了避免之前本地环境里出现的 gas cap 问题。

## 5.8 第八步：查看结果

交易确认后，页面会在 `Transaction Outcome` 显示：

- 成功提示
- 新签发的 `stampId`
- 跳转到对应 passport 详情页的入口
- 当前 `Latest Effective Stamp`

如果交易失败，这里会显示合约 revert 原因或标准化后的错误信息。

## 6. Access 卡片到底在检查什么

当前页面里的 `Access` 不是单纯的“有没有授权”，而是更接近“现在能不能提交”。

它的判定顺序大致是：

1. 钱包是否已连接
2. 网络是否正确
3. 前端是否配置了相关合约地址
4. `passportId` 和 `stampTypeId` 是否已经选好
5. 是否仍在加载链上上下文
6. 当前上下文是否读取成功
7. passport 是否存在
8. passport 是否为 `Active`
9. stamp type 是否为 `active`
10. 当前钱包是否通过 `canIssue()`
11. `supersedesStampId` 输入是否合法
12. 如果是 singleton 类型，`supersedesStampId` 是否满足该类型的替代规则

只有这些条件都满足时，页面才会显示：

- `Authorized Issuer`

这也是为什么这里的 `Access` 比单纯的“有权限 / 没权限”更有业务意义。

## 7. Supersedes Stamp ID 的业务规则

这是 `Issue Stamp` 页面里最容易出错的输入项。

## 7.1 基本含义

`Supersedes Stamp ID` 表示：

- 这条新 stamp 要替代哪一条旧 stamp

如果是新增，而不是替代：

- 用 `0`

## 7.2 基础格式规则

前端要求它必须是：

- `0`
- 或正整数

空值会被视为 `0`。

## 7.3 singleton 类型的规则

如果当前 stamp type 是 `singleton = true`，规则会更严格。

### 情况 1：当前还没有有效 stamp

如果该 passport 在该 stamp type 下还没有有效 stamp：

- `latestEffectiveStampId` 为空
- 这时 `supersedesStampId` 必须是 `0`

也就是第一次签发 singleton 类型时，不能凭空指定要替代某个旧 stamp。

### 情况 2：当前已经有有效 stamp

如果已经存在当前有效 stamp：

- 新 stamp 必须替代它
- `supersedesStampId` 必须严格等于 `latestEffectiveStampId`

不能跳过当前有效 stamp 去替代更老的记录。

## 7.4 非 singleton 类型的规则

如果当前类型不是 singleton，前端不会做那么强的替代约束。

但合约层仍然会校验：

- 被替代的 stamp 是否存在
- 是否已经被撤销
- 是否属于同一个 passport
- 是否属于同一个 stamp type

所以即使前端允许你填一个数字，也不代表链上一定会接受。

## 8. 当前合约中的实际签发校验顺序

当前 `ChronicleStamp.issueStamp(...)` 的核心逻辑可以理解为下面这几个步骤：

1. `metadataCID` 不能为空
2. `occurredAt` 必须有效，且不能晚于当前区块时间
3. `assetPassport` 和 `authority` 地址必须已经配置
4. 调用 `PassportAuthority.canIssue(msg.sender, stampTypeId, passportId)`
5. 检查目标 passport 是否存在
6. 检查目标 passport 状态是否为 `Active`
7. 检查目标 stamp type 是否为 `active`
8. 读取当前 `(passportId, stampTypeId)` 的 `latestEffectiveStampId`
9. 如果 stamp type 是 singleton，校验 `supersedesStampId` 是否满足 singleton 规则
10. 如果 `supersedesStampId != 0`，校验被替代的旧 stamp 是否合法
11. 写入新 stamp
12. 如有替代关系，把旧 stamp 标记为 revoked，并把 `revokedByStampId` 指向新 stamp
13. 更新 `latestEffectiveStampId`

这说明：

- 前端只是帮你预检查
- 最终是否成功，还是以链上合约校验为准

## 9. `canIssue()` 通过了，为什么仍然可能失败

这是业务上很容易误解的一点。

`PassportAuthority.canIssue()` 只回答一个问题：

- 当前地址是否有资格对这个 passport 发这个 stamp type

但实际签发还会受这些条件影响：

- passport 是否存在
- passport 是否为 `Active`
- stamp type 是否为 `active`
- `occurredAt` 是否合法
- `metadataCID` 是否为空
- `supersedesStampId` 是否满足替代规则

所以：

- `canIssue = true`
- 不等于这笔交易一定成功

当前前端已经把其中大部分关键条件提前暴露在 `Access` 卡片里了。

## 10. 最新有效 stamp 是什么

页面下方的 `Latest Effective Stamp` 表示：

- 在这本 passport 下
- 对这个 stamp type 来说
- 当前仍然有效的最新一条 stamp 记录

它的作用主要有两个：

- 帮助用户理解当前这个类型是否已经有有效记录
- 在 singleton 类型下，帮助用户知道新记录必须替代哪一条旧记录

如果这里为空，表示当前这个 `(passportId, stampTypeId)` 组合还没有有效 stamp。

## 11. 常见使用场景

### 场景 1：第一次给某本 passport 签发某种 stamp

操作方式：

- 填 `passportId`
- 选 `stampTypeId`
- 填 `occurredAt`
- 填 `metadataCID`
- `supersedesStampId` 保持 `0`

适用于：

- 普通首次签发
- singleton 类型的首次签发

### 场景 2：更新一个 singleton 类型的 stamp

操作方式：

- 先选择目标 passport 和 stamp type
- 查看 `Latest Effective Stamp`
- 在 `Supersedes Stamp ID` 里填写该 `Latest Effective Stamp`
- 再提交新 stamp

结果：

- 旧有效 stamp 会被新 stamp 替代
- 新 stamp 成为新的 `Latest Effective Stamp`

### 场景 3：普通非 singleton 类型下替代一条旧记录

操作方式：

- 填写正确的 `supersedesStampId`
- 保证该旧 stamp 属于同一个 passport、同一个 stamp type，且未被撤销

结果：

- 旧 stamp 会被标记为 revoked
- 新 stamp 接管有效状态

## 12. 当前页面的边界

### 页面会预检查，但不会穷尽所有链上情况

当前页面已经预检查了最重要的失败原因，但仍有一部分规则是由合约最终裁定的。

特别是非 singleton 类型下的 `supersedesStampId`，前端没有把所有合法性都提前做完。

### stamp type 下拉框来自事件，不是 storage 枚举

因此它适合做“当前已配置类型”的操作入口，但不是一个协议级强保证的完整枚举接口。

### 页面签发的是链上 stamp 记录，不是草稿

点击 `Issue Stamp` 后提交的是正式链上交易，不存在前端草稿保存。

## 13. 操作建议

- 先确认当前钱包是否真的具备该 passport 的发章权限
- 提交前先看 `Access` 是否已经变成 `Authorized Issuer`
- `Occurred At` 填真实业务发生时间，不要填未来时间
- `Metadata CID` 不要留空
- 如果是 singleton 类型，先看 `Latest Effective Stamp` 再填 `Supersedes Stamp ID`
- 如果是首次签发 singleton 类型，`Supersedes Stamp ID` 保持 `0`
- 如果是替代旧记录，确认旧 stamp 的 passport 和 type 都匹配
