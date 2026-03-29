// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IAssetPassport} from "./IAssetPassport.sol";
import {IChronicleStamp} from "./IChronicleStamp.sol";
import {IPassportAuthority} from "./IPassportAuthority.sol";
import {PassportTypes} from "./PassportTypes.sol";

/**
 * @title ChronicleStamp
 * @dev 资产存证印章合约。
 * 负责定义不同的印章类型（StampType），并为特定的资产通行证签发、撤销和查询印章。
 * 印章可用于记录资产的维修记录、鉴定报告、所有权变更补充说明等。
 */
contract ChronicleStamp is IChronicleStamp {
    // --- 错误定义 ---
    error NotOwner(); // 仅限合约所有者
    error Unauthorized(); // 未授权的操作
    error ZeroAddress(); // 不允许零地址
    error InvalidPassport(); // 无效或不存在的通行证
    error PassportNotActive(); // 通行证状态非活跃
    error StampTypeNotActive(); // 该印章类型未启用
    error UnknownStamp(); // 找不到该印章
    error StampAlreadyRevoked(); // 印章已被撤销
    error InvalidOccurredAt(); // 发生时间无效（不能为未来时间）
    error EmptyMetadataCID(); // 元数据 CID 不能为空
    error EmptyReasonCID(); // 撤销原因 CID 不能为空
    error InvalidSupersession(); // 无效的印章替代（类型或通行证不匹配）
    error SingletonConflict(); // 单例印章冲突（该类型只能有一个活跃印章）
    error IndexOutOfBounds(); // 索引越界

    // --- 事件定义 ---
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // --- 状态变量 ---
    address public owner; // 合约所有者
    address public override assetPassport; // 关联的资产通行证核心合约地址
    address public override authority; // 权限管理合约地址

    uint256 private _nextStampId = 1; // 下一个印章 ID

    mapping(uint256 stampTypeId => PassportTypes.StampTypeConfig config) private _stampTypes; // 印章类型配置映射
    mapping(uint256 stampId => PassportTypes.StampRecord record) private _stampRecords; // 印章详细记录映射
    mapping(uint256 passportId => uint256[] stampIds) private _stampIdsByPassport; // 通行证关联的印章 ID 列表
    mapping(uint256 passportId => mapping(uint256 stampTypeId => uint256 stampId))
        private _latestEffectiveStampIds; // 通行证下每种印章类型的最新有效印章 ID

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
     * @dev 配置印章类型（仅限管理员或授权地址）
     * @param stampTypeId 印章类型 ID
     * @param config 类型配置（代码、名称、架构、单例状态等）
     */
    function configureStampType(
        uint256 stampTypeId,
        PassportTypes.StampTypeConfig calldata config
    ) external override {
        if (!_canManageStampType(stampTypeId, msg.sender)) revert Unauthorized();

        _stampTypes[stampTypeId] = config;

        emit StampTypeConfigured(
            stampTypeId,
            config.code,
            config.name,
            config.schemaCID,
            config.active,
            config.singleton
        );
    }

    /**
     * @dev 为通行证签发印章
     * @param passportId 通行证 ID
     * @param stampTypeId 印章类型 ID
     * @param occurredAt 事实发生的时间戳
     * @param metadataCID 指向存证详情的 CID（IPFS/Arweave等）
     * @param supersedesStampId 若为替代旧印章，提供旧印章 ID；否则为 0
     * @return stampId 新签发的印章 ID
     */
    function issueStamp(
        uint256 passportId,
        uint256 stampTypeId,
        uint64 occurredAt,
        string calldata metadataCID,
        uint256 supersedesStampId
    ) external override returns (uint256 stampId) {
        if (bytes(metadataCID).length == 0) revert EmptyMetadataCID();
        if (occurredAt == 0 || occurredAt > block.timestamp) revert InvalidOccurredAt();
        if (assetPassport == address(0) || authority == address(0)) revert Unauthorized();
        
        // 权限校验：检查签发者是否有权为该通行证签发此类印章
        if (!IPassportAuthority(authority).canIssue(msg.sender, stampTypeId, passportId)) {
            revert Unauthorized();
        }

        // 加载活跃的通行证信息
        PassportTypes.PassportRecord memory passport = _loadActivePassport(passportId);
        PassportTypes.StampTypeConfig memory stampType = _stampTypes[stampTypeId];
        if (!stampType.active) revert StampTypeNotActive();

        uint256 previousEffectiveStampId = _latestEffectiveStampIds[passportId][stampTypeId];
        
        // 单例模式校验：某些类型的印章在同一时间只能有一个有效的
        if (stampType.singleton) {
            if (previousEffectiveStampId == 0 && supersedesStampId != 0) {
                revert InvalidSupersession();
            }
            if (previousEffectiveStampId != 0 && supersedesStampId != previousEffectiveStampId) {
                revert SingletonConflict();
            }
        }

        stampId = _nextStampId;
        _nextStampId = stampId + 1;

        // 如果提供了替代印章 ID，则撤销旧印章并关联新印章
        if (supersedesStampId != 0) {
            _consumeSupersededStamp(
                supersedesStampId,
                passportId,
                stampTypeId,
                previousEffectiveStampId,
                stampType.singleton,
                stampId
            );
        } else if (stampType.singleton && previousEffectiveStampId != 0) {
            revert SingletonConflict();
        }

        // 创建印章记录
        PassportTypes.StampRecord memory record = PassportTypes.StampRecord({
            stampId: stampId,
            passportId: passportId,
            stampTypeId: stampTypeId,
            issuer: msg.sender,
            occurredAt: occurredAt,
            issuedAt: uint64(block.timestamp),
            metadataCID: metadataCID,
            revoked: false,
            supersedesStampId: supersedesStampId,
            revokedByStampId: 0
        });

        _stampRecords[stampId] = record;
        _stampIdsByPassport[passportId].push(stampId);
        _latestEffectiveStampIds[passportId][stampTypeId] = stampId;

        emit StampIssued(
            stampId,
            passportId,
            stampTypeId,
            msg.sender,
            passport.subjectAccount,
            occurredAt,
            uint64(block.timestamp),
            metadataCID,
            supersedesStampId
        );
    }

    /**
     * @dev 撤销已签发的印章
     * @param stampId 印章 ID
     * @param reasonCID 撤销原因的 CID
     */
    function revokeStamp(uint256 stampId, string calldata reasonCID) external override {
        if (bytes(reasonCID).length == 0) revert EmptyReasonCID();
        if (authority == address(0)) revert Unauthorized();

        PassportTypes.StampRecord storage record = _stampRecords[stampId];
        if (record.stampId == 0) revert UnknownStamp();
        if (record.revoked) revert StampAlreadyRevoked();
        
        // 权限校验：检查是否有权撤销
        if (!IPassportAuthority(authority).canRevoke(msg.sender, stampId)) {
            revert Unauthorized();
        }

        record.revoked = true;

        // 更新最新有效印章缓存
        if (_latestEffectiveStampIds[record.passportId][record.stampTypeId] == stampId) {
            _latestEffectiveStampIds[record.passportId][record.stampTypeId] = 0;
        }

        emit StampRevoked(stampId, record.passportId, msg.sender, reasonCID);
    }

    /**
     * @dev 设置关联的资产通行证合约地址
     */
    function setAssetPassport(address assetPassport_) external override onlyOwner {
        if (assetPassport_ == address(0)) revert ZeroAddress();

        assetPassport = assetPassport_;
        emit AssetPassportUpdated(assetPassport_);
    }

    /**
     * @dev 设置权限管理合约地址
     */
    function setAuthority(address authority_) external override onlyOwner {
        if (authority_ == address(0)) revert ZeroAddress();

        authority = authority_;
        emit AuthorityUpdated(authority_);
    }

    /**
     * @dev 获取印章类型配置
     */
    function stampTypeOf(
        uint256 stampTypeId
    ) external view override returns (PassportTypes.StampTypeConfig memory) {
        return _stampTypes[stampTypeId];
    }

    /**
     * @dev 获取单个印章记录
     */
    function stampRecordOf(
        uint256 stampId
    ) external view override returns (PassportTypes.StampRecord memory) {
        PassportTypes.StampRecord memory record = _stampRecords[stampId];
        if (record.stampId == 0) revert UnknownStamp();
        return record;
    }

    /**
     * @dev 获取通行证关联的印章总数
     */
    function stampCountByPassport(uint256 passportId) external view override returns (uint256) {
        return _stampIdsByPassport[passportId].length;
    }

    /**
     * @dev 根据索引获取通行证的印章 ID
     */
    function stampIdByPassportAndIndex(
        uint256 passportId,
        uint256 index
    ) external view override returns (uint256) {
        uint256[] storage stampIds = _stampIdsByPassport[passportId];
        if (index >= stampIds.length) revert IndexOutOfBounds();
        return stampIds[index];
    }

    /**
     * @dev 获取通行证下特定类型的最新有效印章 ID
     */
    function latestEffectiveStampId(
        uint256 passportId,
        uint256 stampTypeId
    ) external view override returns (uint256) {
        return _latestEffectiveStampIds[passportId][stampTypeId];
    }

    // --- 内部辅助函数 ---

    /**
     * @dev 加载活跃通行证记录，若不活跃或不存在则报错
     */
    function _loadActivePassport(
        uint256 passportId
    ) private view returns (PassportTypes.PassportRecord memory) {
        IAssetPassport passportContract = IAssetPassport(assetPassport);
        if (!passportContract.exists(passportId)) revert InvalidPassport();

        PassportTypes.PassportRecord memory passport = passportContract.recordOf(passportId);
        if (passport.status != PassportTypes.PassportStatus.Active) {
            revert PassportNotActive();
        }

        return passport;
    }

    /**
     * @dev 处理被替代的印章，将其状态标记为撤销
     */
    function _consumeSupersededStamp(
        uint256 supersedesStampId,
        uint256 passportId,
        uint256 stampTypeId,
        uint256 previousEffectiveStampId,
        bool singleton,
        uint256 revokedByStampId
    ) private {
        PassportTypes.StampRecord storage previousRecord = _stampRecords[supersedesStampId];
        if (previousRecord.stampId == 0) revert UnknownStamp();
        if (previousRecord.revoked) revert StampAlreadyRevoked();
        if (previousRecord.passportId != passportId || previousRecord.stampTypeId != stampTypeId) {
            revert InvalidSupersession();
        }
        if (singleton && supersedesStampId != previousEffectiveStampId) {
            revert SingletonConflict();
        }

        previousRecord.revoked = true;
        previousRecord.revokedByStampId = revokedByStampId;
    }

    /**
     * @dev 检查调用者是否有权管理特定印章类型
     */
    function _canManageStampType(uint256 stampTypeId, address operator) private view returns (bool) {
        if (operator == owner) {
            return true;
        }

        if (authority == address(0)) {
            return false;
        }

        return IPassportAuthority(authority).isStampTypeAdmin(stampTypeId, operator);
    }
}
