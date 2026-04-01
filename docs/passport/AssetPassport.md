# AssetPassport 合约说明

## 合约定位

`AssetPassport` 是整套资产护照系统的主体合约，用于在链上以 ERC-721 的形式表示一份唯一的“资产护照”。

从业务上看，它回答的是两个核心问题：

- 某个现实资产在链上的主身份是什么
- 当前谁拥有这份资产护照

从系统架构上看，它是其他合约的主索引来源：

- `ChronicleStamp` 通过 `passportId` 关联履历记录
- `PassportFactory` 统一调用它完成护照铸造
- `PassportAuthority` 通过它所代表的主体对象参与授权判断

## 业务职责

`AssetPassport` 当前承担以下业务职责：

- 为每个资产铸造唯一的 `passportId`
- 保证 `assetFingerprint` 全局唯一，避免同一资产被重复发行多本护照
- 维护护照的基础元数据
- 维护护照状态，例如 `Active`、`Frozen`、`Retired`
- 提供基础的 ERC-721 持有、授权、转移能力
- 记录并暴露该护照关联的 `subjectAccount`

它不负责：

- 履历印章的签发与撤销
- 白名单或角色策略判断
- ERC-6551 账户的创建

这些职责分别由 `ChronicleStamp`、`PassportAuthority`、`PassportFactory` 承担。

## 核心数据结构

核心记录类型定义在 [PassportTypes.sol](E:/Myspace/MyProject/DeProof/blockchain/contracts/passport/PassportTypes.sol) 中：

```solidity
struct PassportRecord {
    uint256 passportId;
    bytes32 assetFingerprint;
    address subjectAccount;
    string passportMetadataCID;
    string assetMetadataCID;
    PassportStatus status;
}
```

关键字段解释：

- `passportId`：链上护照唯一编号
- `assetFingerprint`：资产指纹，建议由业务侧的稳定唯一标识计算得到
- `subjectAccount`：附属账户地址，预留给 ERC-6551 等账户化方案
- `passportMetadataCID`：护照级元数据
- `assetMetadataCID`：资产级元数据
- `status`：护照状态

## 状态模型

当前定义的状态枚举如下：

- `Uninitialized`
- `Active`
- `Frozen`
- `Retired`

当前实现约束：

- 新铸造的护照默认进入 `Active`
- `Uninitialized` 不能被外部设置为目标状态
- 只有 `Active` 状态的护照允许转移
- `Frozen` 和 `Retired` 状态下禁止转移

建议的业务语义：

- `Active`：资产护照正常有效，可继续流转与写入履历
- `Frozen`：资产存在争议、审核中、临时限制流转
- `Retired`：护照退出流通状态，通常用于永久归档或停用

## 铸造流程

核心入口函数：

```solidity
function mintPassport(
    address to,
    PassportTypes.PassportInitData calldata initData
) external returns (uint256 passportId);
```

当前实现逻辑：

1. 校验调用方是否具备铸造权限
2. 校验接收地址 `to` 非零
3. 校验 `assetFingerprint` 非零
4. 校验 `initData.initialHolder` 与 `to` 一致
5. 校验该 `assetFingerprint` 尚未被铸造
6. 生成新的 `passportId`
7. 写入 `_owners`、`_balances`、`_passportRecords`
8. 发出 ERC-721 `Transfer` 和业务事件 `PassportMinted`

当前允许铸造的主体：

- 合约 owner
- 已配置的 `factory`

这意味着第一版实现默认更偏向“平台统一发行”，而不是任意用户自由铸造。

## 元数据更新

核心入口函数：

```solidity
function updatePassportMetadata(
    uint256 passportId,
    string calldata passportMetadataCID,
    string calldata assetMetadataCID
) external;
```

当前允许更新元数据的主体：

- 护照当前持有人
- 已获授权的操作员
- 合约 owner

这种设计适合早期阶段快速推进，但后续你可能需要进一步细化：

- 是否允许持有人任意修改资产元数据
- 是否应该拆分“展示元数据”和“核心资产属性元数据”
- 是否需要把部分关键字段改为仅管理员或特定机构可变

## `subjectAccount` 绑定

核心入口函数：

```solidity
function setSubjectAccount(uint256 passportId, address subjectAccount) external;
```

当前允许调用者：

- 合约 owner
- 已配置的 `factory`

这意味着第一版的 `subjectAccount` 由系统侧统一初始化，而不是由终端用户自行设置。

这与 `PassportFactory` 的设计是配套的：

- 如果工厂已经配置 ERC-6551 风格的 registry / implementation
- 工厂在铸造护照后可以立即创建并回写 `subjectAccount`

## ERC-721 行为

当前实现是一个自包含的最小 ERC-721，而不是直接继承 OpenZeppelin。

已支持能力：

- `balanceOf`
- `ownerOf`
- `approve`
- `getApproved`
- `setApprovalForAll`
- `isApprovedForAll`
- `transferFrom`
- `safeTransferFrom`
- `tokenURI`

当前未引入的能力：

- ERC-721 Enumerable
- ERC-721 Metadata 完整扩展接口声明
- ERC-165 标准接口探测
- OpenZeppelin 的标准化错误与 hook 体系

因此它适合当前原型阶段，但如果后续要对接外部 NFT 基础设施、市场、钱包生态，更建议切换到 OpenZeppelin 标准实现。

## 事件设计

业务相关事件包括：

- `PassportMinted`
- `SubjectAccountBound`
- `PassportMetadataUpdated`
- `PassportStatusUpdated`
- `AuthorityUpdated`
- `ChronicleUpdated`
- `FactoryUpdated`

同时保留 ERC-721 核心事件：

- `Transfer`
- `Approval`
- `ApprovalForAll`

后端如果要做资产护照表同步，推荐优先监听：

- `PassportMinted`
- `PassportMetadataUpdated`
- `PassportStatusUpdated`
- `SubjectAccountBound`

## 权限模型

当前权限模型比较直接：

- owner：系统级管理者
- factory：受控的统一铸造入口
- token owner / approved：护照持有人及其授权方
- authority：允许修改护照状态的外部权限中心

建议后续演进方向：

- 将 owner 的部分操作转移到多签或治理账户
- 对元数据写权限进一步分层
- 明确哪些状态变化必须由 `PassportAuthority` 决定

## 依赖关系

`AssetPassport` 对外依赖较少，但会被其他合约依赖：

- 被 `PassportFactory` 调用铸造与绑定 `subjectAccount`
- 被 `ChronicleStamp` 调用 `exists` / `recordOf` 做有效性校验

因此它是整套系统中的“核心主体合约”。

## 当前实现边界

第一版实现的主要目标是让主体模型先跑通，因此保留了几个有意简化点：

- 不直接接 OpenZeppelin
- 不直接接 ERC-6551
- 不引入复杂的资产属性治理逻辑
- 不处理链下签名发行流程

这些都是后续可扩展项，而不是当前版本必须一次性做完的部分。
