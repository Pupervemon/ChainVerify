# PassportFactory 合约说明

## 合约定位

`PassportFactory` 是资产护照系统中的统一创建入口，用于把多步初始化流程收敛到一个地方。

它目前主要负责：

- 调用 `AssetPassport` 铸造护照
- 可选地创建 `subjectAccount`
- 在必要时把初始化流程标准化

从业务角度看，它更像一个“护照发行工厂”，而不是一个简单的工具合约。

## 为什么需要工厂合约

如果没有工厂，护照初始化流程通常会散落在多个独立调用中：

1. 铸造 `AssetPassport`
2. 创建 `subjectAccount`
3. 将 `subjectAccount` 绑定回护照
4. 配置后续依赖关系

这样的问题在于：

- 前端流程复杂
- 多步操作容易遗漏
- 发生中断时容易留下半初始化状态
- 审计和运维成本更高

工厂的价值就是把这几步收敛为一个受控入口。

## 业务职责

当前 `PassportFactory` 第一版承担以下职责：

- 作为 `AssetPassport` 的统一铸造入口
- 读取 `PassportInitData` 并创建护照
- 在已配置 registry / implementation 时创建 `subjectAccount`
- 将创建出的 `subjectAccount` 回写到对应护照
- 通过 `PassportCreated` 事件输出统一的创建结果

它不负责：

- 管理护照状态
- 决定谁能签发履历
- 记录履历本身

## 当前创建流程

核心入口函数：

```solidity
function createPassport(
    PassportTypes.PassportInitData calldata initData
) external returns (uint256 passportId, address subjectAccount);
```

当前执行顺序：

1. 校验 `assetPassport` 已配置
2. 校验 `initData.initialHolder` 非零
3. 调用 `AssetPassport.mintPassport(...)`
4. 如果 registry / implementation 已配置，则尝试创建 `subjectAccount`
5. 如果成功创建 `subjectAccount`，则调用 `AssetPassport.setSubjectAccount(...)`
6. 发出 `PassportCreated` 事件

## `subjectAccount` 预留设计

当前工厂使用的是 ERC-6551 风格接口：

```solidity
interface ISubjectAccountRegistry {
    function createAccount(
        address implementation,
        bytes32 salt,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId
    ) external returns (address);

    function account(
        address implementation,
        bytes32 salt,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId
    ) external view returns (address);
}
```

这意味着工厂当前已经为后续接入 ERC-6551 做好了接口预留，但并没有把具体账户实现写死在主业务合约里。

这是一个更稳的工程选择，因为：

- 你可以后续替换账户实现
- 不会把第一版原型和某个特定 registry 紧耦合
- 部署时可按环境决定是否开启账户化能力

## 权限模型

当前实现中，`createPassport(...)` 不是由工厂 `owner` 决定谁能调用，而是由
`PassportAuthority.canCreatePassport(msg.sender)` 决定。

也就是说：

- `PassportAuthority.owner` 可以调用工厂创建 passport
- 被 `PassportAuthority.setPassportCreator(operator, true)` 授权的地址也可以调用
- `PassportFactory.owner` 只负责配置工厂本身，不自动等于“可创建者”

这意味着：

- 当前依然偏向管理后台或受控角色统一创建
- 但权限已经从“工厂 owner 单点控制”演进为“权限中心统一控制”
- 工厂本身更像受控的标准化执行入口，而不是权限判断中心

这种设计的价值在于：

- 避免任意地址大量铸造护照
- 把“谁能创建”从工厂配置中剥离出来，集中到 `PassportAuthority`
- 便于后续扩展为更细的 creator 白名单、机构角色或链下签名授权

## 配置项

当前可配置的关键地址包括：

- `assetPassport`
- `authority`
- `chronicle`
- `subjectAccountRegistry`
- `subjectAccountImplementation`

其中：

- `assetPassport` 是当前真正必须配置的地址
- `subjectAccountRegistry` 和 `subjectAccountImplementation` 是可选能力
- `authority` 与 `chronicle` 当前更多是为后续完整初始化链路预留

## `previewSubjectAccount`

核心读取函数：

```solidity
function previewSubjectAccount(uint256 passportId) external view returns (address);
```

它的作用是：

- 在不真正创建账户的情况下，预估某个 `passportId` 对应的 `subjectAccount`

这个能力对前端和后台都很有用：

- 前端可以提前展示账户地址
- 后端可以预先建立资产账户映射
- 部署流程可以做初始化校验

## 事件设计

工厂的核心业务事件为：

- `PassportCreated`
- `AssetPassportUpdated`
- `AuthorityUpdated`
- `ChronicleUpdated`
- `SubjectAccountRegistryUpdated`
- `SubjectAccountImplementationUpdated`

后端如果要统一监听护照创建，推荐优先消费 `PassportCreated`，而不是自己串联多个子事件。

## 当前实现边界

第一版 `PassportFactory` 是一个薄工厂，保留了以下后续扩展空间：

- 未实现批量创建
- 未实现按机构分配铸造权限
- 未实现链下签名授权创建
- 未实现创建后自动初始化默认履历类型
- 未实现创建后的业务回调

但对于现阶段，它已经足够把“护照 + 账户初始化”流程收拢成稳定入口。
