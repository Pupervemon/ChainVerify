// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {PassportTypes} from "./PassportTypes.sol";

/**
 * @title IPassportAuthority
 * @dev 资产通行证权限管理接口。
 * 规范了权限策略的设置以及签发、创建、撤销等关键操作的权限检查逻辑。
 */
interface IPassportAuthority {
    // --- 事件定义 ---
    event AssetPassportUpdated(address indexed assetPassport); // 关联的资产通行证合约更新
    event ChronicleUpdated(address indexed chronicle); // 关联的存证记录合约更新
    
    // 权限策略变更事件
    event GlobalIssuerPolicySet(address indexed issuer, bool enabled, string policyCID);
    event TypeIssuerPolicySet(
        address indexed issuer,
        uint256 indexed stampTypeId,
        bool enabled,
        string policyCID
    );
    event PassportIssuerPolicySet(
        address indexed issuer,
        uint256 indexed passportId,
        bool enabled,
        string policyCID
    );
    
    event PassportCreatorSet(address indexed operator, bool enabled); // 通行证创建者授权变更
    event PassportIssuerAllowlistModeSet(uint256 indexed passportId, bool enabled); // 白名单模式变更
    event StampTypeAdminSet(uint256 indexed stampTypeId, address indexed admin, bool enabled); // 印章类型管理员变更
    event RevocationOperatorSet(address indexed operator, bool enabled); // 撤销操作员授权变更

    /**
     * @dev 设置关联的资产通行证核心合约
     */
    function setAssetPassport(address assetPassport) external;

    /**
     * @dev 设置关联的存证记录合约
     */
    function setChronicle(address chronicle) external;

    /**
     * @dev 设置全局签发者策略
     */
    function setGlobalIssuerPolicy(
        address issuer,
        PassportTypes.IssuerPolicy calldata policy
    ) external;

    /**
     * @dev 设置特定类型的签发者策略
     */
    function setTypeIssuerPolicy(
        address issuer,
        uint256 stampTypeId,
        PassportTypes.IssuerPolicy calldata policy
    ) external;

    /**
     * @dev 设置针对特定通行证的签发者策略
     */
    function setPassportIssuerPolicy(
        address issuer,
        uint256 passportId,
        PassportTypes.IssuerPolicy calldata policy
    ) external;

    /**
     * @dev 授权或撤销通行证创建权限
     */
    function setPassportCreator(address operator, bool enabled) external;

    /**
     * @dev 开启或关闭特定通行证的签发白名单模式
     */
    function setPassportAllowlistMode(uint256 passportId, bool enabled) external;

    /**
     * @dev 授权或撤销印章类型管理员
     */
    function setStampTypeAdmin(uint256 stampTypeId, address admin, bool enabled) external;

    /**
     * @dev 授权或撤销全局撤销操作员权限
     */
    function setRevocationOperator(address operator, bool enabled) external;

    /**
     * @dev 权限检查：是否可以签发
     */
    function canIssue(
        address issuer,
        uint256 stampTypeId,
        uint256 passportId
    ) external view returns (bool);

    /**
     * @dev 权限检查：是否可以创建通行证
     */
    function canCreatePassport(address operator) external view returns (bool);

    /**
     * @dev 权限检查：是否可以撤销指定印章
     */
    function canRevoke(address operator, uint256 stampId) external view returns (bool);

    /**
     * @dev 查询全局签发策略
     */
    function globalIssuerPolicyOf(
        address issuer
    ) external view returns (PassportTypes.IssuerPolicy memory);

    /**
     * @dev 查询特定类型的签发策略
     */
    function typeIssuerPolicyOf(
        address issuer,
        uint256 stampTypeId
    ) external view returns (PassportTypes.IssuerPolicy memory);

    /**
     * @dev 查询特定通行证的签发策略
     */
    function passportIssuerPolicyOf(
        address issuer,
        uint256 passportId
    ) external view returns (PassportTypes.IssuerPolicy memory);

    /**
     * @dev 检查是否为某印章类型的管理员
     */
    function isStampTypeAdmin(uint256 stampTypeId, address admin) external view returns (bool);

    /**
     * @dev 检查是否被授权创建通行证
     */
    function isPassportCreator(address operator) external view returns (bool);

    /**
     * @dev 检查是否被授权为撤销操作员
     */
    function isRevocationOperator(address operator) external view returns (bool);

    /**
     * @dev 获取关联的资产通行证核心合约地址
     */
    function assetPassport() external view returns (address);

    /**
     * @dev 获取关联的存证记录合约地址
     */
    function chronicle() external view returns (address);
}
