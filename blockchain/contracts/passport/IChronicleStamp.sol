// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {PassportTypes} from "./PassportTypes.sol";

/**
 * @title IChronicleStamp
 * @dev 资产存证印章接口。
 * 定义了管理资产溯源记录（印章）的行为，包括印章类型的配置、印章的签发与撤销，以及相关的查询接口。
 */
interface IChronicleStamp {
    // --- 事件定义 ---
    event AssetPassportUpdated(address indexed assetPassport); // 关联的资产通行证合约更新
    event AuthorityUpdated(address indexed authority); // 关联的权限管理合约更新
    
    // 印章类型配置变更事件
    event StampTypeConfigured(
        uint256 indexed stampTypeId,
        string code,
        string name,
        string schemaCID,
        bool active,
        bool singleton
    );
    
    // 印章签发事件
    event StampIssued(
        uint256 indexed stampId,
        uint256 indexed passportId,
        uint256 indexed stampTypeId,
        address issuer,
        address subjectAccount,
        uint64 occurredAt,
        uint64 issuedAt,
        string metadataCID,
        uint256 supersedesStampId
    );
    
    // 印章撤销事件
    event StampRevoked(
        uint256 indexed stampId,
        uint256 indexed passportId,
        address indexed operator,
        string reasonCID
    );

    /**
     * @dev 配置印章类型
     * @param stampTypeId 印章类型 ID
     * @param config 类型配置（代码、名称、数据模式 CID、是否单例等）
     */
    function configureStampType(
        uint256 stampTypeId,
        PassportTypes.StampTypeConfig calldata config
    ) external;

    /**
     * @dev 为指定通行证签发印章
     * @param passportId 通行证 ID
     * @param stampTypeId 印章类型 ID
     * @param occurredAt 事实发生的时间
     * @param metadataCID 指向印章详情的元数据 CID
     * @param supersedesStampId 被此印章替代的旧印章 ID (0 表示不替代)
     * @return stampId 新生成的印章 ID
     */
    function issueStamp(
        uint256 passportId,
        uint256 stampTypeId,
        uint64 occurredAt,
        string calldata metadataCID,
        uint256 supersedesStampId
    ) external returns (uint256 stampId);

    /**
     * @dev 撤销已有的印章
     * @param stampId 印章 ID
     * @param reasonCID 撤销原因的元数据 CID
     */
    function revokeStamp(uint256 stampId, string calldata reasonCID) external;

    /**
     * @dev 设置关联的资产通行证核心合约
     */
    function setAssetPassport(address assetPassport) external;

    /**
     * @dev 设置关联的权限管理合约
     */
    function setAuthority(address authority) external;

    /**
     * @dev 获取指定印章类型的配置
     */
    function stampTypeOf(uint256 stampTypeId)
        external
        view
        returns (PassportTypes.StampTypeConfig memory);

    /**
     * @dev 获取单个印章的详细记录
     */
    function stampRecordOf(uint256 stampId)
        external
        view
        returns (PassportTypes.StampRecord memory);

    /**
     * @dev 获取特定通行证关联的印章总数
     */
    function stampCountByPassport(uint256 passportId) external view returns (uint256);

    /**
     * @dev 根据索引获取通行证关联的印章 ID
     */
    function stampIdByPassportAndIndex(
        uint256 passportId,
        uint256 index
    ) external view returns (uint256);

    /**
     * @dev 获取通行证下特定类型的最新有效印章 ID
     */
    function latestEffectiveStampId(
        uint256 passportId,
        uint256 stampTypeId
    ) external view returns (uint256);

    /**
     * @dev 获取关联的资产通行证核心合约地址
     */
    function assetPassport() external view returns (address);

    /**
     * @dev 获取关联的权限管理合约地址
     */
    function authority() external view returns (address);
}
