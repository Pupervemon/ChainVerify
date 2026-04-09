# Stamp Type Permission 页面使用说明

## 1. 页面是做什么的

`Stamp Type Permission` 页面用于管理某个 `stampTypeId` 的类型管理员。

这个页面做的事情只有一类：

- 指定某个地址是否为某个 `stampTypeId` 的 `stamp type admin`

它底层调用的是：

- `PassportAuthority.setStampTypeAdmin(stampTypeId, admin, enabled)`

这个页面不负责：

- 配置 stamp type 定义
- 给地址发章授权
- 给地址发 Passport 创建权限

## 2. 谁可以操作

只有 `PassportAuthority.owner` 可以提交修改。

也就是说：

- 非 owner 可以查看状态
- 非 owner 不能授予或撤销 `stamp type admin`

这个页面顶部的 `Access` 显示的就是：

- 当前钱包是不是 `PassportAuthority.owner`

## 3. 这个角色到底有什么权限

这是这个页面最重要的业务点。

给一个地址授予某个 `stampTypeId` 的 `stamp type admin` 后，这个地址会获得两类能力：

### 3.1 可以管理这个 stamp type 的定义

它可以在 `Stamp Type Admin` 页面里配置这个 `stampTypeId` 的：

- `code`
- `name`
- `schemaCID`
- `active`
- `singleton`

对应权限来源是：

- `ChronicleStamp.configureStampType(...)`
- `ChronicleStamp` 内部会通过 `PassportAuthority.isStampTypeAdmin(...)` 校验

### 3.2 可以撤销这个类型下的 stamp

在 `PassportAuthority.canRevoke(...)` 里，某个 stamp 所属的 `stampTypeId` 的管理员，也有权撤销该 stamp。

也就是说，这个角色不只是“类型配置管理员”，它同时也是“该类型的撤销管理员”。

## 4. 这个角色没有什么权限

授予 `stamp type admin` 并不会自动带来下面这些能力：

- 不能因此获得发章权限
- 不能因此获得 Passport 创建权限
- 不能因此获得全局管理员权限
- 不能因此管理其他 `stampTypeId`

所以要区分清楚：

- `stamp type admin` 管的是“类型定义”和“该类型撤销”
- `issuer access` 管的是“能不能发章”

这两条权限线是独立的。

## 5. 页面结构

页面主要分成两块：

### 5.1 顶部状态区

用于确认当前环境：

- `Access`
- `Owner`
- `Connected Wallet`

### 5.2 Admin Operation

用于实际操作：

- 输入 `stampTypeId`
- 输入 `admin address`
- 检查当前状态
- 授权或撤销

## 6. 完整使用流程

## 6.1 第一步：输入 Stamp Type ID

先填写要操作的 `stampTypeId`。

这表示你要管理的是哪一种印章类型的管理员权限。

## 6.2 第二步：输入 Admin Address

填写要授予或撤销的目标地址。

这里填的是：

- 钱包地址
- 或其他作为管理员使用的地址

前端要求它必须是有效地址格式。

## 6.3 第三步：点击 Check Status

这一步会读取：

- `PassportAuthority.isStampTypeAdmin(stampTypeId, adminAddress)`

返回结果会显示在 `Current Status` 里：

- 是管理员
- 或不是管理员

这一步建议在授予和撤销前都先做一次。

## 6.4 第四步：点击 Grant 或 Revoke

如果当前钱包是 `PassportAuthority.owner`，就可以提交：

- `Grant`
- `Revoke`

底层调用分别都是：

- `setStampTypeAdmin(stampTypeId, adminAddress, true)`
- `setStampTypeAdmin(stampTypeId, adminAddress, false)`

交易确认后，页面会自动重新检查该地址的当前状态。

## 7. 和 Stamp Type Admin 页面的关系

这两个页面很容易混淆，但职责不同。

### Stamp Type Permission

它管的是：

- 谁能成为某个 type 的管理员

### Stamp Type Admin

它管的是：

- 这个 type 本身怎么配置

可以理解为：

- `Stamp Type Permission` 是发角色
- `Stamp Type Admin` 是拿着角色去做配置

## 8. 当前页面的真实业务含义

从业务上看，这个页面是在做“按类型下放治理权”。

典型用法是：

- 平台方定义整体协议
- 再把某个 `stampTypeId` 的管理权委托给某个合作方或业务域负责人

这样做的结果是：

- 合作方不需要拿到全局 owner 权限
- 但可以维护自己负责的类型
- 同时也能撤销这个类型下的错误或失效 stamp

这也是当前系统向基础设施化扩展时很关键的一层能力。

## 9. 常见业务场景

### 场景 1：把某个业务域的类型交给合作方维护

适合。

做法：

- 平台 owner 在这里给合作方地址授予某个 `stampTypeId` 的 admin

结果：

- 合作方可以在 `Stamp Type Admin` 页面维护该类型定义

### 场景 2：让某个业务团队负责撤销某一类错误记录

适合。

因为该角色也具备该类型 stamp 的撤销能力。

### 场景 3：想让某地址可以发某种章

这个页面不适合。

应该去：

- `Issuer Access`

## 10. 当前页面的边界和注意事项

### 这是按 type 授权，不是全局授权

你在这里授予的是：

- 某个地址对某个 `stampTypeId` 的权限

不是对所有类型的全局管理权。

### 撤销 admin 不会删除类型配置

如果把某个 admin 撤销掉：

- 这个类型本身的链上配置仍然存在
- 只是这个地址以后不能再继续管理它

### 页面只检查角色状态，不会展开更多业务判断

这个页面检查的是：

- 该地址当前是否为这个 type 的 admin

它不会进一步展示：

- 这个地址曾经做过哪些配置
- 这个 type 下面有哪些 stamp

## 11. 操作建议

- 授权前先 `Check Status`
- 不要把 `stamp type admin` 和 `issuer` 角色混为一谈
- 授权给合作方前，先确认它是否真的需要同时拥有“类型配置”和“该类型撤销”两类能力
- 如果只是想让某地址发章，不要在这里操作
