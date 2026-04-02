# Revoke Stamp 页面使用说明

## 1. 页面是做什么的

`Revoke Stamp` 页面用于撤销一条已经签发的 stamp。

这个页面做的事情只有一类：

- 加载某个 `stampId` 的当前上下文
- 判断当前钱包是否有撤销权限
- 填写撤销原因 `reasonCID`
- 调用 `ChronicleStamp.revokeStamp(...)` 提交撤销

这个页面不负责：

- 修改 stamp 内容
- 恢复已撤销的 stamp
- 替代旧 stamp
- 管理撤销权限本身

## 2. 谁可以撤销

当前合约里，满足下面任意一种身份，就可能具备撤销权限：

- `PassportAuthority.owner`
- 被授权的 `revocation operator`
- 这条 stamp 的原始 `issuer`
- 这条 stamp 所属 `stampTypeId` 的 `stamp type admin`

权限判断来自 `PassportAuthority.canRevoke(operator, stampId)`。

但注意：

- `canRevoke = true`
- 不等于这笔撤销交易一定成功

因为链上提交时还会继续检查 stamp 是否存在、是否已被撤销、`reasonCID` 是否为空等条件。

## 3. 页面结构

页面主要分成 2 块：

### 3.1 Revocation Input

用于填写：

- `Stamp ID`
- `Reason CID`

### 3.2 Stamp Context

用于查看当前加载的 stamp 信息和交易结果：

- 所属 `passportId`
- 所属 `stampTypeId`
- 当前是否已撤销
- 提交成功或失败后的结果提示

## 4. 完整使用流程

## 4.1 第一步：输入 Stamp ID

先填写要撤销的 `stampId`。

页面会自动尝试加载这条 stamp 的上下文。

加载内容包括：

- `PassportAuthority.canRevoke(currentWallet, stampId)`
- `ChronicleStamp.stampRecordOf(stampId)`

如果 `stampId` 不存在，页面上下文会加载失败，并显示错误。

## 4.2 第二步：查看 Access 和 Current State

页面顶部会显示两个关键信息：

- `Access`
- `Current State`

`Access` 主要反映：

- 当前钱包对这条 stamp 是否具备 `canRevoke()` 权限

`Current State` 主要反映：

- 这条 stamp 目前是 `Effective / revocable`
- 还是 `Already revoked`

这两个状态要一起看，不能只看其中一个。

## 4.3 第三步：填写 Reason CID

`Reason CID` 是撤销理由的链下说明地址，例如：

- `ipfs://...`

规则：

- 必填
- 不能为空字符串

合约只要求它非空，不会校验里面的文档内容。

## 4.4 第四步：提交 Revoke Stamp

点击 `Revoke Stamp` 后，前端会调用：

- `ChronicleStamp.revokeStamp(stampId, reasonCID)`

提交成功后，页面会显示：

- 撤销成功提示
- 已撤销的 `stampId`
- 对应 passport 详情页入口

## 5. Access 的真实含义

这个页面里的 `Access` 主要是基于 `canRevoke()` 的结果。

因此它表达的是：

- 当前钱包有没有撤销这类 stamp 的角色权限

它不是一个完整的“最终一定可提交”的判断结果。

例如下面这些情况，仍然可能导致最终交易失败：

- 这条 stamp 已经被撤销
- `Reason CID` 为空
- 合约地址未正确配置
- 当前网络不正确

当前页面的按钮禁用条件也比较简单，主要依赖：

- `stampId` 是否是合法数字
- `canRevoke` 是否为 true
- 当前是否正在提交

也就是说，业务上应该把这个页面理解成：

- `Access` 负责看角色权限
- 最终是否成功，仍然由链上校验决定

## 6. 当前合约中的实际撤销校验顺序

当前 `ChronicleStamp.revokeStamp(...)` 的核心逻辑可以理解为：

1. `reasonCID` 不能为空
2. `authority` 地址必须已配置
3. 目标 stamp 必须存在
4. 目标 stamp 不能已经是 revoked
5. `PassportAuthority.canRevoke(msg.sender, stampId)` 必须为 true
6. 将该 stamp 标记为 revoked
7. 如果该 stamp 正好是当前 `latestEffectiveStampId`
   - 则把当前 `(passportId, stampTypeId)` 的 `latestEffectiveStampId` 清成 `0`
8. 发出 `StampRevoked` 事件

## 7. 撤销后的业务影响

撤销并不是“软删除展示”这么简单，它会影响后续业务判断。

### 7.1 这条 stamp 会被标记为 revoked

撤销后，这条记录本身仍然存在，但状态会变成已撤销。

### 7.2 如果它是当前最新有效 stamp，会清空 latestEffectiveStampId

这是一个很重要的业务点。

如果你撤销的是当前 `(passportId, stampTypeId)` 下的最新有效 stamp，那么：

- `latestEffectiveStampId` 会被清成 `0`

这意味着：

- 当前这个 passport 在这个 stamp type 下，会变成“没有有效 stamp”

合约不会自动回退到更早的旧记录。

## 8. 谁适合用这个页面

### 场景 1：原签发方发现误发，需要撤销

适合。

前提是：

- 当前钱包就是这条 stamp 的原始 issuer

### 场景 2：平台方统一处理撤销

适合。

前提是：

- 当前钱包是 `PassportAuthority.owner`
- 或者已经被设置为 `revocation operator`

### 场景 3：某类业务管理员管理某一种印章

适合。

前提是：

- 当前钱包是该 `stampTypeId` 的 `stamp type admin`

## 9. 当前页面的边界和注意事项

### Access 不等于最终一定成功

这个页面的 `Access` 更像权限预判，不是完整的提交模拟。

特别是：

- 已撤销 stamp
- 空 `reasonCID`

这些情况要结合 `Stamp Context` 和输入内容一起判断。

### 页面不会帮你恢复旧记录

撤销一个有效 stamp 后，系统只会把当前有效状态清掉，不会自动恢复更旧的历史记录。

### `Reason CID` 只是引用地址

合约只要求非空，不会检查内容格式是否规范，也不会检查 CID 指向的文档是否真实存在。

## 10. 操作建议

- 提交前先确认 `Stamp Context` 已成功加载
- 同时看 `Access` 和 `Current State`
- 不要只因为 `Access` 显示可撤销，就忽略 stamp 是否已经撤销
- `Reason CID` 最好指向清晰可审计的撤销说明文档
- 如果撤销的是当前有效 stamp，要提前确认业务上是否接受“该类型当前没有有效记录”的结果
