# Passport Frontend Docs

## 1. 这份目录是做什么的

`frontend/docs` 用来解释 Passport 前端各个业务页面在链上到底配置了什么、谁可以操作、操作后会影响什么。

这不是组件文档，也不是开发规范文档，而是：

- 业务对齐文档
- 页面使用文档
- 权限关系说明

## 2. 建议先建立这 4 个总概念

在看具体页面前，先把系统拆成 4 层：

### AssetPassport

核心 Passport NFT 合约，负责：

- mint Passport
- 存储 Passport 基础记录
- 维护 trusted factories
- 管理 Passport 状态和 subject account

### PassportAuthority

权限管理合约，负责：

- issuer authorization
- creator 权限
- stamp type admin 权限
- revocation operator 权限

### ChronicleStamp

印章合约，负责：

- 配置 stamp type
- issue stamp
- revoke stamp

### PassportFactory

工厂合约，负责：

- 用标准流程创建 Passport
- 调用 `AssetPassport.mintPassport(...)`
- 创建并绑定 subject account

## 3. 最容易混淆的 5 条权限线

这套系统里最容易混淆的不是页面，而是权限线。

### 3.1 Trusted Factory

它管的是：

- 哪个合约地址可以直接调用 `AssetPassport`

它是：

- 合约级基础设施白名单

不是：

- 钱包级 creator 权限

对应文档：

- [trusted-factories.md](./trusted-factories.md)

### 3.2 Creator / Passport Creation 权限

它管的是：

- 哪个操作人地址可以通过创建流程发起 Passport 创建

它是：

- 操作人级别权限

不是：

- 工厂合约白名单

对应文档：

- [creator-access.md](./creator-access.md)

### 3.3 Issuer Authorization

它管的是：

- 哪个地址可以对哪些 Passport / stamp type 发章

它是：

- 发章权限

不是：

- stamp type 管理权限

对应文档：

- [issuer-authorization.md](./issuer-authorization.md)

### 3.4 Stamp Type Admin

它管的是：

- 谁可以管理某个 `stampTypeId` 的定义
- 谁可以撤销该类型下的 stamp

它是：

- 类型治理权限

不是：

- 发章权限

对应文档：

- [stamp-type-permission.md](./stamp-type-permission.md)
- [stamp-type-admin.md](./stamp-type-admin.md)

### 3.5 Revocation Operator

它管的是：

- 哪个地址拥有全局撤销任意 stamp 的能力

它是：

- 全局撤销角色

不是：

- issuer 自己撤销
- stamp type admin 按类型撤销

对应文档：

- [revocation-operators.md](./revocation-operators.md)
- [revoke-stamp.md](./revoke-stamp.md)

## 4. 当前目录里的文档怎么读

如果你是第一次接触这个系统，建议按下面顺序阅读。

### 第一组：先看基础设施入口

1. [trusted-factories.md](./trusted-factories.md)
2. [creator-access.md](./creator-access.md)

先理解：

- 哪个工厂合约可以触达 `AssetPassport`
- 为什么 Trusted Factory 和 Creator 不是一回事
- 为什么标准创建流程里两层通常都要一起满足

### 第二组：再看印章治理

3. [stamp-type-permission.md](./stamp-type-permission.md)
4. [stamp-type-admin.md](./stamp-type-admin.md)

先理解：

- 谁能当某个 type 的 admin
- admin 具体能做什么
- type 定义里的 `active` 和 `singleton` 会怎样影响后续发章

### 第三组：再看发章授权

5. [issuer-authorization.md](./issuer-authorization.md)

这里是最核心的业务权限线，重点理解：

- `Global / Type / Passport` 三层范围
- `Require Passport-Level Authorization`
- `Passport Allowlist Enforcement`

### 第四组：最后看实际操作页

6. [issue-stamp.md](./issue-stamp.md)
7. [revocation-operators.md](./revocation-operators.md)
8. [revoke-stamp.md](./revoke-stamp.md)

当你已经理解：

- type 怎么定义
- issuer 怎么授权

再看具体怎么签发和撤销，就会顺很多。

## 5. 当前文档覆盖了哪些页面

目前已整理：

- `Trusted Factories`
- `Creator Access`
- `Stamp Type Permission`
- `Stamp Type Admin`
- `Issuer Authorization`
- `Issue Stamp`
- `Revocation Operators`
- `Revoke Stamp`

## 6. 当前还没有单独整理的页面

当前项目里还有一些相关页面，但这个目录里还没有单独拆文档：

- 其他 Passport 管理页

如果后续继续补，优先级建议是：

1. 其他 owner/admin 运营页

## 7. 如果你只想先搞明白“合作方怎么接入”

建议按这条业务路径理解：

1. 先决定合作方是用平台官方工厂，还是自定义工厂
2. 如果是自定义工厂，先看 [trusted-factories.md](./trusted-factories.md)
3. 再看 [creator-access.md](./creator-access.md)，确认操作人地址有没有创建资格
4. 如果合作方需要维护自己的印章类型，先给它 `stamp type admin`
5. 再去看 [stamp-type-admin.md](./stamp-type-admin.md) 配置类型
6. 如果合作方需要发章，再去看 [issuer-authorization.md](./issuer-authorization.md)
7. 最后再落到 [issue-stamp.md](./issue-stamp.md) 做实际签发

## 8. 如果你只想先搞明白“发章为什么会失败”

建议按下面顺序排查：

1. 先看 [issuer-authorization.md](./issuer-authorization.md)，确认当前地址有没有发章资格
2. 再看 [stamp-type-admin.md](./stamp-type-admin.md)，确认该 `stampTypeId` 是否为 `active`
3. 再看 [issue-stamp.md](./issue-stamp.md)，确认：

- Passport 是否存在
- Passport 是否为 `Active`
- `Occurred At` 是否合法
- `Metadata CID` 是否为空
- `Supersedes Stamp ID` 是否满足规则

## 9. 一句话理解当前系统

可以把当前系统理解成：

- `AssetPassport` 管核心资产护照
- `PassportAuthority` 管角色和授权
- `ChronicleStamp` 管印章类型和印章记录
- 前端这些页面，本质上是在分别操作这三层里的不同权限和配置入口
