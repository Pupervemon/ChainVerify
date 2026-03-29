// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IChronicleStamp} from "./IChronicleStamp.sol";
import {IPassportAuthority} from "./IPassportAuthority.sol";
import {PassportTypes} from "./PassportTypes.sol";

/**
 * @title PassportAuthority
 * @dev 资产通行证权限管理合约。
 * 负责定义和管理系统中所有的权限策略，包括：
 * 1. 签发者权限（全局、按类型、按特定通行证）。
 * 2. 通行证创建者权限。
 * 3. 记录撤销权限。
 * 4. 印章类型管理权限。
 */
contract PassportAuthority is IPassportAuthority {
    // --- 错误定义 ---
    error NotOwner(); // 仅限合约所有者
    error ZeroAddress(); // 不允许零地址

    // --- 事件定义 ---
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // --- 状态变量 ---
    address public owner; // 合约所有者（超级管理员）
    address public override assetPassport; // 关联的资产通行证合约地址
    address public override chronicle; // 关联的存证记录合约地址

    // 权限策略存储
    mapping(address issuer => PassportTypes.IssuerPolicy policy) private _globalIssuerPolicies; // 全局签发策略
    mapping(address issuer => mapping(uint256 stampTypeId => PassportTypes.IssuerPolicy policy))
        private _typeIssuerPolicies; // 按印章类型的签发策略
    mapping(address issuer => mapping(uint256 passportId => PassportTypes.IssuerPolicy policy))
        private _passportIssuerPolicies; // 按特定通行证的签发策略
    
    mapping(uint256 passportId => bool enabled) private _passportAllowlistMode; // 通行证是否开启白名单模式（开启后仅限特定授权者签发）
    mapping(uint256 stampTypeId => mapping(address admin => bool enabled)) private _stampTypeAdmins; // 印章类型管理员
    mapping(address operator => bool enabled) private _passportCreators; // 有权创建通行证的地址（通常是工厂合约）
    mapping(address operator => bool enabled) private _revocationOperators; // 有权执行撤销操作的专用地址

    // --- 修饰符 ---
    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    /**
     * @dev 构造函数
     * @param initialOwner 初始所有者
     */
    constructor(address initialOwner) {
        if (initialOwner == address(0)) revert ZeroAddress();
        owner = initialOwner;
        emit OwnershipTransferred(address(0), initialOwner);
    }

    /**
     * @dev 转移合约所有权
     */
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();

        address previousOwner = owner;
        owner = newOwner;

        emit OwnershipTransferred(previousOwner, newOwner);
    }

    /**
     * @dev 设置资产通行证核心合约地址
     */
    function setAssetPassport(address assetPassport_) external override onlyOwner {
        if (assetPassport_ == address(0)) revert ZeroAddress();

        assetPassport = assetPassport_;
        emit AssetPassportUpdated(assetPassport_);
    }

    /**
     * @dev 设置存证记录合约地址
     */
    function setChronicle(address chronicle_) external override onlyOwner {
        if (chronicle_ == address(0)) revert ZeroAddress();

        chronicle = chronicle_;
        emit ChronicleUpdated(chronicle_);
    }

    /**
     * @dev 设置全局签发者策略
     * @param issuer 签发者地址
     * @param policy 权限策略
     */
    function setGlobalIssuerPolicy(
        address issuer,
        PassportTypes.IssuerPolicy calldata policy
    ) external override onlyOwner {
        if (issuer == address(0)) revert ZeroAddress();

        _globalIssuerPolicies[issuer] = policy;
        emit GlobalIssuerPolicySet(issuer, policy.enabled, policy.policyCID);
    }

    /**
     * @dev 设置特定印章类型的签发者策略
     */
    function setTypeIssuerPolicy(
        address issuer,
        uint256 stampTypeId,
        PassportTypes.IssuerPolicy calldata policy
    ) external override onlyOwner {
        if (issuer == address(0)) revert ZeroAddress();

        _typeIssuerPolicies[issuer][stampTypeId] = policy;
        emit TypeIssuerPolicySet(issuer, stampTypeId, policy.enabled, policy.policyCID);
    }

    /**
     * @dev 设置针对特定通行证的签发者策略
     */
    function setPassportIssuerPolicy(
        address issuer,
        uint256 passportId,
        PassportTypes.IssuerPolicy calldata policy
    ) external override onlyOwner {
        if (issuer == address(0)) revert ZeroAddress();

        _passportIssuerPolicies[issuer][passportId] = policy;
        emit PassportIssuerPolicySet(issuer, passportId, policy.enabled, policy.policyCID);
    }

    /**
     * @dev 授权通行证创建者
     */
    function setPassportCreator(address operator, bool enabled) external override onlyOwner {
        if (operator == address(0)) revert ZeroAddress();

        _passportCreators[operator] = enabled;
        emit PassportCreatorSet(operator, enabled);
    }

    /**
     * @dev 开启或关闭特定通行证的白名单模式
     */
    function setPassportAllowlistMode(
        uint256 passportId,
        bool enabled
    ) external override onlyOwner {
        _passportAllowlistMode[passportId] = enabled;
        emit PassportIssuerAllowlistModeSet(passportId, enabled);
    }

    /**
     * @dev 授权印章类型管理员
     */
    function setStampTypeAdmin(
        uint256 stampTypeId,
        address admin,
        bool enabled
    ) external override onlyOwner {
        if (admin == address(0)) revert ZeroAddress();

        _stampTypeAdmins[stampTypeId][admin] = enabled;
        emit StampTypeAdminSet(stampTypeId, admin, enabled);
    }

    /**
     * @dev 授权专用的撤销操作员
     */
    function setRevocationOperator(address operator, bool enabled) external override onlyOwner {
        if (operator == address(0)) revert ZeroAddress();

        _revocationOperators[operator] = enabled;
        emit RevocationOperatorSet(operator, enabled);
    }

    /**
     * @dev 核心权限检查函数：判断某签发者是否有权为某通行证签发某类型的印章
     */
    function canIssue(
        address issuer,
        uint256 stampTypeId,
        uint256 passportId
    ) external view override returns (bool) {
        if (issuer == address(0)) {
            return false;
        }

        // 1. 检查是否有针对该通行证的直接授权
        PassportTypes.IssuerPolicy memory passportPolicy = _passportIssuerPolicies[issuer][passportId];
        bool hasExplicitPassportGrant = _isPolicyActive(passportPolicy);

        // 如果开启了白名单模式，则必须有直接授权
        if (_passportAllowlistMode[passportId]) {
            return hasExplicitPassportGrant;
        }

        // 如果已有直接授权，则允许
        if (hasExplicitPassportGrant) {
            return true;
        }

        // 2. 检查是否有针对该印章类型的授权
        PassportTypes.IssuerPolicy memory typePolicy = _typeIssuerPolicies[issuer][stampTypeId];
        if (_isPolicyActive(typePolicy)) {
            // 如果该类型授权限制了必须在白名单内，则返回 false（因为上面已经检查过没有直接授权）
            return !typePolicy.restrictToExplicitPassportList || hasExplicitPassportGrant;
        }

        // 3. 检查是否有全局授权
        PassportTypes.IssuerPolicy memory globalPolicy = _globalIssuerPolicies[issuer];
        if (_isPolicyActive(globalPolicy)) {
            return !globalPolicy.restrictToExplicitPassportList || hasExplicitPassportGrant;
        }

        return false;
    }

    /**
     * @dev 检查调用者是否有权创建通行证
     */
    function canCreatePassport(address operator) external view override returns (bool) {
        if (operator == address(0)) {
            return false;
        }

        return operator == owner || _passportCreators[operator];
    }

    /**
     * @dev 检查调用者是否有权撤销特定印章
     */
    function canRevoke(address operator, uint256 stampId) external view override returns (bool) {
        if (operator == address(0)) {
            return false;
        }

        // 超级管理员或专用撤销操作员有权
        if (operator == owner || _revocationOperators[operator]) {
            return true;
        }

        if (chronicle == address(0)) {
            return false;
        }

        // 签发者自己，或该印章类型的管理员有权撤销
        try IChronicleStamp(chronicle).stampRecordOf(stampId) returns (
            PassportTypes.StampRecord memory stamp
        ) {
            return operator == stamp.issuer || _stampTypeAdmins[stamp.stampTypeId][operator];
        } catch {
            return false;
        }
    }

    /**
     * @dev 获取全局签发者策略
     */
    function globalIssuerPolicyOf(
        address issuer
    ) external view override returns (PassportTypes.IssuerPolicy memory) {
        return _globalIssuerPolicies[issuer];
    }

    /**
     * @dev 获取特定印章类型的签发者策略
     */
    function typeIssuerPolicyOf(
        address issuer,
        uint256 stampTypeId
    ) external view override returns (PassportTypes.IssuerPolicy memory) {
        return _typeIssuerPolicies[issuer][stampTypeId];
    }

    /**
     * @dev 获取针对特定通行证的签发者策略
     */
    function passportIssuerPolicyOf(
        address issuer,
        uint256 passportId
    ) external view override returns (PassportTypes.IssuerPolicy memory) {
        return _passportIssuerPolicies[issuer][passportId];
    }

    /**
     * @dev 检查是否为某印章类型的管理员
     */
    function isStampTypeAdmin(
        uint256 stampTypeId,
        address admin
    ) external view override returns (bool) {
        return _stampTypeAdmins[stampTypeId][admin];
    }

    /**
     * @dev 检查是否为通行证创建者
     */
    function isPassportCreator(address operator) external view override returns (bool) {
        return _passportCreators[operator];
    }

    /**
     * @dev 检查是否为撤销操作员
     */
    function isRevocationOperator(address operator) external view override returns (bool) {
        return _revocationOperators[operator];
    }

    /**
     * @dev 检查通行证是否开启白名单模式
     */
    function passportAllowlistMode(uint256 passportId) external view returns (bool) {
        return _passportAllowlistMode[passportId];
    }

    /**
     * @dev 内部函数：检查策略当前是否有效（考虑启用状态及生效/过期时间）
     */
    function _isPolicyActive(PassportTypes.IssuerPolicy memory policy) private view returns (bool) {
        if (!policy.enabled) {
            return false;
        }

        if (policy.validAfter != 0 && block.timestamp < policy.validAfter) {
            return false;
        }

        if (policy.validUntil != 0 && block.timestamp > policy.validUntil) {
            return false;
        }

        return true;
    }
}
