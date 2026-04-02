# Revocation Operators 页面使用说明

## 1. 页面是做什么的

`Revocation Operators` 页面用于管理哪些地址可以作为全局撤销操作员。

它底层调用的是：

- `PassportAuthority.setRevocationOperator(operator, enabled)`

这个页面管的是：

- 全局撤销角色

不是：

- 具体某条 stamp 的 issuer 身份
- 某个 stamp type 的管理员身份

## 2. 谁可以操作

只有 `PassportAuthority.owner` 可以授予或撤销 revocation operator。

非 owner 钱包进入页面时：

- 可以检查某个地址的当前显式状态
- 不能提交 `Grant` / `Revoke`

## 3. Revocation Operator 到底代表什么

它代表：

- 某个地址拥有“全局撤销任意 stamp”的能力

在 `PassportAuthority.canRevoke(operator, stampId)` 里，只要满足下面之一，就会直接通过：

- `operator == owner`
- `_revocationOperators[operator] == true`

所以 revocation operator 是一个非常强的角色。

它不需要：

- 是原始 issuer
- 是该 type 的 admin

也可以直接撤销任意 stamp。

## 4. 它和其他撤销来源的关系

当前系统里，能撤销 stamp 的来源一共有 4 类：

### 4.1 PassportAuthority.owner

全局最高权限。

### 4.2 Revocation Operator

被 owner 单独授予的全局撤销角色。

### 4.3 Stamp 的原始 issuer

某条 stamp 的签发方，也可以撤销自己签发的那条记录。

### 4.4 该 stampTypeId 的 stamp type admin

该类型的管理员，也可以撤销这个类型下的 stamp。

所以：

- `Revocation Operators` 页面只负责其中一条权限线
- 它不是 `canRevoke()` 全部来源的总览

## 5. 页面结构

这个页面比较简单，主要只有一个操作区：

- 输入操作人地址
- 检查当前是否为 revocation operator
- `Grant` / `Revoke`

当前页面没有像 `Creator Access` 那样单独做链上列表展示。

## 6. 完整使用流程

## 6.1 第一步：输入 Operator Address

先填写要检查或操作的钱包地址。

这里填的是：

- 钱包地址

不是：

- `stampId`
- issuer address 范围配置

## 6.2 第二步：点击 Check Status

这一步会读取：

- `PassportAuthority.isRevocationOperator(operatorAddress)`

它检查的是：

- 该地址是否被显式授予了 revocation operator 身份

返回结果会显示在 `Current Status` 里。

## 6.3 第三步：点击 Grant 或 Revoke

如果当前钱包是 `PassportAuthority.owner`，就可以提交：

- `Grant`
- `Revoke`

底层调用分别是：

- `setRevocationOperator(operatorAddress, true)`
- `setRevocationOperator(operatorAddress, false)`

交易确认后，页面会重新检查该地址的当前状态。

## 7. 一个很重要的业务细节：owner 天然就能全局撤销

当前页面检查的是：

- `isRevocationOperator(operatorAddress)`

但合约最终撤销判断看的是：

- `canRevoke(operator, stampId)`

而 `canRevoke()` 里，`PassportAuthority.owner` 本身就天然拥有全局撤销能力。

这意味着：

- 如果你查询的是 owner 地址
- 但它没有被显式授予 revocation operator
- 页面可能会显示它不是 revocation operator
- 但它在链上依然可以全局撤销任何 stamp

所以这里也要区分：

- 显式 operator 状态
- 最终 `canRevoke(...)` 的真实结果

## 8. 它和 Revoke Stamp 页面的关系

`Revoke Stamp` 页面是在实际执行撤销。

`Revocation Operators` 页面是在发放“全局撤销角色”。

可以理解成：

- `Revocation Operators` 管角色
- `Revoke Stamp` 管实际提交撤销交易

如果某个地址在这里被授予了 revocation operator，那么它在 `Revoke Stamp` 页面处理任意 stamp 时，通常都能通过权限校验。

## 9. 常见业务场景

### 场景 1：平台合规或风控团队统一处理撤销

适合。

做法：

- 给该团队的钱包地址授予 revocation operator

结果：

- 该地址可以对任意 stamp 执行撤销

### 场景 2：不想把 owner 私钥直接用于日常运营

适合。

做法：

- 保留 owner 作为最高权限
- 日常撤销由独立 operator 钱包执行

### 场景 3：只想让某个地址撤销自己签发的章

这个页面不适合。

因为原始 issuer 本来就能撤销自己签发的 stamp，不需要额外变成全局 revocation operator。

## 10. 当前页面的边界和注意事项

### 这是全局权限，不是局部权限

一旦授予成功，这个地址就不是只能处理某一类 stamp，而是：

- 可以全局撤销任意 stamp

所以要比 `stamp type admin` 更谨慎。

### 页面显示的是显式 operator 状态

它不会把下面这些其他撤销来源一起显示出来：

- owner
- 原始 issuer
- stamp type admin

所以不要把这个页面理解成 `canRevoke()` 的完整总览。

### Revoke 不会恢复旧状态

撤销某个全局 operator 后：

- 只是这个地址以后失去全局撤销角色
- 已经撤销过的历史记录不会恢复

## 11. 操作建议

- 只把这个角色授予极少数高信任地址
- 授权前先确认业务上是否真的需要“全局撤销任意 stamp”的能力
- 不要把 revocation operator 和 stamp type admin 混为一谈
- 如果只是日常按类型处理撤销，优先考虑 `stamp type admin`
- 如果只是处理自己签发的章，也不需要额外授予这个角色
