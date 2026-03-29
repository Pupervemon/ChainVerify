// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {PassportTypes} from "./PassportTypes.sol";

/**
 * @title IAssetPassport
 * @dev 资产通行证核心接口。
 * 定义了资产通行证（类 ERC721）的核心行为，包括铸造、元数据更新、状态管理及基础设施配置。
 */
interface IAssetPassport {
    // --- 事件定义 ---
    event AuthorityUpdated(address indexed authority); // 权限管理合约更新
    event ChronicleUpdated(address indexed chronicle); // 存证记录合约更新
    event FactoryAuthorizationUpdated(address indexed factory, bool enabled); // 工厂授权状态更新
    
    // 通行证铸造事件
    event PassportMinted(
        uint256 indexed passportId,
        address indexed owner,
        bytes32 indexed assetFingerprint,
        string passportMetadataCID,
        string assetMetadataCID
    );
    
    event SubjectAccountBound(uint256 indexed passportId, address indexed subjectAccount); // 绑定主体账户 (TBA)
    
    // 元数据更新事件
    event PassportMetadataUpdated(
        uint256 indexed passportId,
        string passportMetadataCID,
        string assetMetadataCID
    );
    
    // 状态更新事件
    event PassportStatusUpdated(
        uint256 indexed passportId,
        PassportTypes.PassportStatus previousStatus,
        PassportTypes.PassportStatus newStatus
    );

    /**
     * @dev 铸造新的资产通行证
     * @param to 初始持有者地址
     * @param initData 初始配置数据
     * @return passportId 新生成的通行证 ID
     */
    function mintPassport(
        address to,
        PassportTypes.PassportInitData calldata initData
    ) external returns (uint256 passportId);

    /**
     * @dev 为通行证绑定主体账户（通常由工厂合约调用）
     */
    function setSubjectAccount(uint256 passportId, address subjectAccount) external;

    /**
     * @dev 更新通行证的元数据引用 (CID)
     */
    function updatePassportMetadata(
        uint256 passportId,
        string calldata passportMetadataCID,
        string calldata assetMetadataCID
    ) external;

    /**
     * @dev 设置通行证的状态（Active, Frozen 等）
     */
    function setPassportStatus(
        uint256 passportId,
        PassportTypes.PassportStatus newStatus
    ) external;

    /**
     * @dev 设置权限管理合约地址
     */
    function setAuthority(address authority) external;

    /**
     * @dev 设置存证记录合约地址
     */
    function setChronicle(address chronicle) external;

    /**
     * @dev 授权或撤销工厂合约的铸造权限
     */
    function setFactory(address factory, bool enabled) external;

    /**
     * @dev 检查通行证是否存在
     */
    function exists(uint256 passportId) external view returns (bool);

    /**
     * @dev 获取通行证的完整记录
     */
    function recordOf(uint256 passportId) external view returns (PassportTypes.PassportRecord memory);

    /**
     * @dev 获取通行证绑定的主体账户地址
     */
    function subjectAccountOf(uint256 passportId) external view returns (address);

    /**
     * @dev 检查地址是否为已授权的工厂
     */
    function isFactory(address factory) external view returns (bool);

    /**
     * @dev 获取已授权工厂的总数
     */
    function factoryCount() external view returns (uint256);

    /**
     * @dev 根据索引获取授权工厂地址
     */
    function factoryAt(uint256 index) external view returns (address);

    /**
     * @dev 返回当前关联的权限管理合约地址
     */
    function authority() external view returns (address);

    /**
     * @dev 返回当前关联的存证记录合约地址
     */
    function chronicle() external view returns (address);
}
