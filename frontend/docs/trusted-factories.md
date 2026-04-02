# Trusted Factories 页面使用说明

## 1. 页面是做什么的

`Trusted Factories` 页面用于管理 `AssetPassport` 的可信工厂白名单。

它底层调用的是：

- `AssetPassport.setFactory(factoryAddress, enabled)`

这个页面做的事情不是“给钱包发创建权限”，而是：

- 允许或移除某个合约地址，作为 `AssetPassport` 的可信工厂

## 2. 谁可以操作

只有 `AssetPassport.owner` 可以提交修改。

注意这里不是：

- `PassportAuthority.owner`

而是：

- `AssetPassport.owner`

所以这个页面和 `Creator Access`、`Issuer Authorization` 的 owner 口径不完全一样。

## 3. “可信工厂”到底代表什么

这是这个页面最核心的业务点。

把某个地址加入 `Trusted Factories` 后，这个地址会被 `AssetPassport` 当成可信工厂合约。

它会获得的能力包括：

### 3.1 可以直接调用 `AssetPassport.mintPassport(...)`

`AssetPassport` 在铸造护照时会检查：

- `msg.sender` 是否在可信工厂白名单中

也就是说，这里的授权是直接作用在核心 NFT 合约上的。

### 3.2 可以调用 `AssetPassport.setSubjectAccount(...)`

`AssetPassport` 的基础设施管理权限也允许可信工厂调用，用于在 mint 后绑定 subject account。

所以这个角色不是一个纯展示标签，而是明确的基础设施写权限。

## 4. 这个页面不等于 Creator Access

这是最容易混淆的地方。

系统里实际上有两层和“创建护照”相关的门槛：

### 第一层：Trusted Factory

这是合约地址级别的门槛。

它决定：

- 哪个工厂合约可以直接调用 `AssetPassport`

### 第二层：Creator Access

这是操作人地址级别的门槛。

它决定：

- 哪个钱包地址可以通过 `PassportAuthority.canCreatePassport(...)`

## 5. 标准 PassportFactory 流程下，两层通常都要满足

如果走的是标准 `PassportFactory.createPassport(...)` 流程，那么通常需要同时满足：

1. 调用工厂的那个钱包地址，必须通过 `PassportAuthority.canCreatePassport(msg.sender)`
2. 这个 `PassportFactory` 合约地址，本身必须已经在 `AssetPassport` 的 trusted factory allowlist 中

原因是：

- `PassportFactory` 在入口处检查调用人有没有 creator 权限
- `PassportFactory` 之后再去调用 `AssetPassport.mintPassport(...)`
- 这时 `AssetPassport` 看的是工厂合约地址是否可信

所以：

- `Creator Access` 管的是“谁能通过工厂发起创建”
- `Trusted Factories` 管的是“哪个合约能真正触达核心 mint 能力”

## 6. 这也意味着它比 Creator Access 更底层

如果你把一个自定义合约加入 `Trusted Factories`，那这个合约理论上就可以直接调用：

- `AssetPassport.mintPassport(...)`

至于它内部要不要再做 `creator` 权限控制，取决于那个工厂合约自己的逻辑。

所以业务上要把这个页面理解成：

- 合约级基础设施白名单

而不是简单的业务角色列表。

## 7. 页面结构

页面主要分成两块：

### 7.1 Manage Factory

用于：

- 输入工厂合约地址
- 检查该地址是否已被信任
- 执行 `Trust` 或 `Remove`

### 7.2 Current Allowlist

用于查看当前链上可信工厂列表。

## 8. 完整使用流程

## 8.1 第一步：输入 Factory Contract

先填写工厂合约地址。

这里填的是：

- 合约地址

而不是：

- 普通操作钱包地址

## 8.2 第二步：点击 Check Status

这一步会读取：

- `AssetPassport.isFactory(factoryAddress)`

返回结果会告诉你：

- 该地址是否已经在 trusted factory allowlist 中

## 8.3 第三步：点击 Trust 或 Remove

如果当前钱包是 `AssetPassport.owner`，就可以提交：

- `Trust`
- `Remove`

底层调用分别是：

- `setFactory(factoryAddress, true)`
- `setFactory(factoryAddress, false)`

提交成功后，页面会重新读取该地址状态，并刷新右侧 allowlist。

## 9. Current Allowlist 的数据来源

这个页面的列表不是事件重建出来的，而是直接读取链上可枚举接口：

- `factoryCount()`
- `factoryAt(index)`

这和 `Creator Access` 不一样。

`Creator Access` 当前前端是通过事件扫描重建列表，而这里是直接读当前链上数组。

所以这个页面的 allowlist 展示更直接，也更接近合约真实状态。

## 10. 为什么列表顺序会变化

当前 `AssetPassport` 在移除工厂时，会对内部数组做压缩整理。

它不是保留空槽，而是会把最后一个元素补到被删除的位置。

所以：

- 列表顺序不是稳定顺序
- 删除某个工厂后，其他工厂的索引位置可能变化

这也是页面里提示 “array slot may change after removals” 的原因。

## 11. 常见业务场景

### 场景 1：上线一个官方 PassportFactory

适合。

做法：

- 把官方 `PassportFactory` 合约地址加入 trusted factories

通常还要同时配合：

- `Creator Access`

这样业务方钱包才能通过这个工厂真正创建护照。

### 场景 2：给合作方接入自定义工厂

适合。

做法：

- 把合作方自己的工厂合约地址加入 trusted factories

这样合作方就可以在自己的工厂逻辑上叠加业务能力。

但前提是你要接受：

- 这个合约已经拿到了直接触达 `AssetPassport` mint 能力的基础设施权限

### 场景 3：只想让某个钱包地址能创建护照

这个页面不适合。

应该去：

- `Creator Access`

## 12. 当前页面的边界和注意事项

### 这里授权的是合约，不是钱包

不要把：

- 工厂合约地址

和：

- creator 钱包地址

混为一谈。

### Trusted Factory 是底层能力开关

它直接作用在 `AssetPassport` 层。

所以授予前要确认：

- 这个工厂合约的实现逻辑你是否信任
- 它内部是否还有自己的权限控制

### Remove 不会销毁历史护照

把某个工厂从 allowlist 中移除后：

- 只是它以后不能继续调用核心 mint 能力
- 已经创建出来的 passport 不会因此被删除

## 13. 和 Creator Access 的最简对照

### Trusted Factories

- 管合约地址
- 作用在 `AssetPassport`
- 决定哪个合约能触达核心 mint / infrastructure 能力
- owner 是 `AssetPassport.owner`

### Creator Access

- 管钱包地址
- 作用在 `PassportAuthority`
- 决定哪个操作人能通过业务授权发起创建
- owner 是 `PassportAuthority.owner`

## 14. 操作建议

- 授权前先 `Check Status`
- 确认你填的是工厂合约地址，不是普通钱包地址
- 如果接入的是标准 `PassportFactory`，同时检查 `Trusted Factories` 和 `Creator Access`
- 移除工厂后，如果前端按索引展示列表，不要把列表位置当成稳定标识
- 对合作方自定义工厂要做更严格审查，因为这里给的是底层 mint 入口权限
