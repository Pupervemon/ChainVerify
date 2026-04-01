# PassportAuthority 合约说明

## 合约定位

`PassportAuthority` 是资产护照体系中的权限中心合约，用于管理：

- 哪些地址可以签发什么类型的履历
- 哪些地址可以针对哪些护照签发履历
- 哪些地址可以撤销某类履历
- 哪些地址可以管理某个履历类型

它是业务权限的集中治理层，也是把“合约权限”从“记录逻辑”中剥离出来的关键模块。

## 业务职责

`PassportAuthority` 当前承担以下职责：

- 管理发行方全局策略
- 管理发行方类型级策略
- 管理发行方护照级策略
- 管理 `passportAllowlistMode`
- 管理某个 `stampTypeId` 的管理员
- 管理专用撤销操作员
- 对外提供 `canIssue` 和 `canRevoke` 判断接口

它不负责：

- 履历记录本身的存储
- 护照铸造
- 护照转移

## 为什么要单独拆权限合约

把权限逻辑拆出来有几个直接好处：

- `ChronicleStamp` 可以专注记录逻辑
- 权限规则未来升级时更容易替换或重构
- 管理后台、审核系统、联盟治理等场景更容易接入
- 不同合约对权限中心可以形成统一依赖

从工程角度看，这是一种典型的“策略与执行分离”做法。

## 策略层级

当前权限模型分三层：

- 全局策略 `globalIssuerPolicy`
- 类型级策略 `typeIssuerPolicy`
- 护照级策略 `passportIssuerPolicy`

对应含义：

- 全局策略：某地址是否具备广泛的履历签发能力
- 类型级策略：某地址是否具备签发某类履历的能力
- 护照级策略：某地址是否具备针对某本护照签发履历的能力

这些策略可以叠加，也可以互相限制。

## 核心数据结构

```solidity
struct IssuerPolicy {
    bool enabled;
    uint64 validAfter;
    uint64 validUntil;
    bool restrictToExplicitPassportList;
    string policyCID;
}
```

字段含义：

- `enabled`：策略是否启用
- `validAfter`：策略生效起始时间
- `validUntil`：策略失效时间
- `restrictToExplicitPassportList`：即便策略本身生效，是否仍要求具备护照级显式授权
- `policyCID`：链下策略说明文档

## `canIssue` 逻辑

核心判断函数：

```solidity
function canIssue(
    address issuer,
    uint256 stampTypeId,
    uint256 passportId
) external view returns (bool);
```

当前逻辑顺序如下：

1. 如果 `issuer` 为零地址，直接拒绝
2. 读取该地址在 `passportId` 上的护照级策略
3. 如果该护照开启了 `passportAllowlistMode`，则必须拥有有效的护照级策略
4. 如果护照级策略有效，则允许签发
5. 否则检查类型级策略
6. 若类型级策略有效，则视 `restrictToExplicitPassportList` 判断是否还需要护照级授权
7. 否则检查全局策略
8. 若全局策略有效，则同样视 `restrictToExplicitPassportList` 决定是否放行
9. 三层策略都不满足，则拒绝签发

这套逻辑的核心特点是：

- 优先支持细粒度授权
- 允许全局/类型策略被护照级 allowlist 再次约束

## `passportAllowlistMode` 的意义

```solidity
mapping(uint256 passportId => bool enabled) private _passportAllowlistMode;
```

它表示：

- 某本护照是否必须显式列入白名单后，机构才能对它签发履历

适用场景：

- 高价值资产只允许少数指定机构写履历
- 某些资产进入监管或争议阶段后，需要临时收紧权限
- 某些联盟要求护照必须先加入联盟许可列表

## 撤销权限模型

核心判断函数：

```solidity
function canRevoke(address operator, uint256 stampId) external view returns (bool);
```

当前允许撤销的主体：

- 合约 owner
- `_revocationOperators` 中的专门撤销员
- 对应 `stampId` 的原始 `issuer`
- 对应该 `stampTypeId` 的类型管理员

这是一种比较务实的第一版设计：

- owner 保留最终控制力
- 专门撤销员支持平台治理
- 原始 issuer 支持业务自纠
- 类型管理员支持分域治理

## 管理能力

当前 owner 可执行的关键管理操作包括：

- 设置 `assetPassport`
- 设置 `chronicle`
- 设置全局策略
- 设置类型策略
- 设置护照策略
- 开关 `passportAllowlistMode`
- 设置类型管理员
- 设置撤销操作员

后续如果你要进一步收紧权限，建议考虑：

- owner 改为多签
- 不同策略入口拆给不同治理角色
- 加入 timelock 或治理提案机制

## 事件设计

主要事件包括：

- `GlobalIssuerPolicySet`
- `TypeIssuerPolicySet`
- `PassportIssuerPolicySet`
- `PassportIssuerAllowlistModeSet`
- `StampTypeAdminSet`
- `RevocationOperatorSet`
- `AssetPassportUpdated`
- `ChronicleUpdated`

这些事件非常适合被管理后台和审计系统索引。

## 依赖关系

`PassportAuthority` 当前与以下合约形成关系：

- 被 `ChronicleStamp` 调用以做签发与撤销校验
- 通过 `chronicle` 地址回读 `stampRecordOf`，判断撤销权限

这种双向关系意味着：

- `ChronicleStamp` 和 `PassportAuthority` 部署后需要互相注入地址

因此部署脚本必须显式完成 wiring。

## 当前实现边界

第一版权限中心仍保留了一些后续扩展空间：

- 未引入可升级代理模式
- 未实现复杂的角色继承
- 未实现批量策略设置
- 未接入链下签名授权
- 未支持资产系列、品牌、地区等多维约束

但对于当前原型阶段，它已经足够支撑“谁能给哪本护照写什么履历”这一核心问题。
