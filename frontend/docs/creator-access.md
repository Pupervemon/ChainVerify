# Creator Access 页面使用说明

## 1. 页面是做什么的

`Creator Access` 页面用于管理哪些操作人地址可以发起 Passport 创建。

它底层调用的是：

- `PassportAuthority.setPassportCreator(operator, enabled)`

这个页面管的是：

- 操作人钱包地址

不是：

- 工厂合约地址

所以它和 `Trusted Factories` 是两条不同的权限线。

## 2. 谁可以操作

只有 `PassportAuthority.owner` 可以在这个页面授予或撤销 creator 权限。

非 owner 钱包进入页面时：

- 可以查看状态
- 可以检查某个地址是否被显式授权
- 不能提交 `Grant` / `Revoke`

## 3. Creator Access 到底代表什么

它代表：

- 某个操作人地址，是否可以通过创建流程发起 Passport 创建

当前标准流程里，`PassportFactory.createPassport(...)` 会先检查：

- `PassportAuthority.canCreatePassport(msg.sender)`

如果这一步不通过，工厂会直接拒绝。

所以从业务角度看，`Creator Access` 管的是：

- 谁可以发起创建动作

## 4. 这个页面不等于 Trusted Factories

这是最容易混淆的点。

### Creator Access

它管理的是：

- 钱包地址

它作用在：

- `PassportAuthority`

它解决的问题是：

- 谁可以发起创建

### Trusted Factories

它管理的是：

- 合约地址

它作用在：

- `AssetPassport`

它解决的问题是：

- 哪个工厂合约可以真正调用核心 mint 能力

所以标准工厂流程下，通常需要两层同时成立：

1. 调用工厂的操作人地址，通过 `canCreatePassport(msg.sender)`
2. 工厂合约地址本身，已经在 `Trusted Factories` allowlist 里

这两层少一层都不够。

## 5. 页面结构

页面主要分成两块：

### 5.1 Manage Operator

用于：

- 输入一个操作人地址
- 检查它当前是否被显式授权
- `Grant` / `Revoke` creator 权限

### 5.2 Authorized Wallets

用于查看当前已授权的 creator 钱包列表。

## 6. 完整使用流程

## 6.1 第一步：输入 Operator Address

先填写要检查或操作的钱包地址。

这里填的是：

- 钱包地址
- 操作人地址

不是：

- 工厂合约地址

## 6.2 第二步：点击 Check Status

这一步会读取：

- `PassportAuthority.isPassportCreator(operatorAddress)`

它检查的是：

- 该地址是否被显式写入 `_passportCreators`

返回结果会显示在 `Current Status` 里。

## 6.3 第三步：点击 Grant 或 Revoke

如果当前钱包是 `PassportAuthority.owner`，可以提交：

- `Grant`
- `Revoke`

底层调用分别是：

- `setPassportCreator(operatorAddress, true)`
- `setPassportCreator(operatorAddress, false)`

交易确认后，页面会自动重新检查该地址状态，并刷新右侧列表。

## 7. 当前列表的数据来源

右侧 `Authorized Wallets` 不是直接枚举合约 storage，而是根据事件重建出来的。

前端会扫描：

- `PassportCreatorSet`

再回放最新状态，生成当前的 creator 列表。

所以它的特点是：

- 适合展示显式授权结果
- 适合做运营查看

但它不是链上直接枚举接口。

## 8. 一个很重要的业务细节：owner 有隐含创建权限

当前 `PassportAuthority.canCreatePassport(operator)` 的合约逻辑是：

- `operator == owner`
- 或 `_passportCreators[operator] == true`

这意味着：

- `PassportAuthority.owner` 天然就有创建权限
- 即使它没有被显式写进 creator 列表

而当前这个页面检查的是：

- `isPassportCreator(operatorAddress)`

所以会出现一个现象：

- 某个地址如果正好是 `PassportAuthority.owner`
- 但没有被显式授予 creator
- 页面 `Check Status` 可能显示它不是 creator
- 但从合约最终效果看，它依然可以通过 `canCreatePassport(...)`

同样地：

- 右侧 `Authorized Wallets` 列表也只反映显式 creator 授权
- 不会把 owner 的隐含权限自动显示进去

这是当前页面和合约语义之间必须注意的差异。

## 9. 常见业务场景

### 场景 1：给运营钱包开通创建资格

适合。

做法：

- 在这里给该钱包地址 `Grant` creator 权限

通常还要同时确认：

- 它走的工厂是否已经在 `Trusted Factories` 里

### 场景 2：给合作方接入创建能力

适合。

典型做法是：

1. 给合作方的钱包地址开 creator 权限
2. 如果合作方走自定义工厂，再把工厂合约加到 `Trusted Factories`

### 场景 3：只想允许某个合约直接 mint

这个页面不适合。

应该去：

- `Trusted Factories`

## 10. 当前页面的边界和注意事项

### 这里授权的是操作人，不是工厂

不要把：

- creator 钱包地址

和：

- trusted factory 合约地址

混在一起。

### 页面显示的是显式 creator 状态

它不是 `canCreatePassport(...)` 的完整镜像。

特别是：

- owner 的隐含创建权限

不会完整反映在这个页面的 `Current Status` 和列表里。

### Revoke 不会影响历史已创建 Passport

撤销某个 creator 地址后：

- 只是它以后不能再发起创建
- 已经创建出来的 Passport 不会被删除

## 11. 操作建议

- 先 `Check Status` 再做 `Grant` / `Revoke`
- 如果是标准工厂流程，同时检查 `Creator Access` 和 `Trusted Factories`
- 不要把“显式 creator 状态”和“最终 `canCreatePassport` 结果”完全等同
- 特别留意 `PassportAuthority.owner` 的隐含创建权限
