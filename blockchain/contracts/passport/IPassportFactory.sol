// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {PassportTypes} from "./PassportTypes.sol";

/**
 * @title IPassportFactory
 * @dev 资产通行证工厂接口。
 * 规范了通行证的统一创建入口，以及关联的 ERC6551 主体账户（Subject Account）的配置与管理。
 */
interface IPassportFactory {
    // --- 事件定义 ---
    event AssetPassportUpdated(address indexed assetPassport); // 关联的资产通行证核心合约更新
    event AuthorityUpdated(address indexed authority); // 关联的权限管理合约更新
    event ChronicleUpdated(address indexed chronicle); // 关联的存证记录合约更新
    event SubjectAccountImplementationUpdated(address indexed implementation); // TBA 实现合约更新
    event SubjectAccountRegistryUpdated(address indexed registry); // ERC6551 注册表更新
    
    // 通行证创建完成事件（包含生成的 TBA 地址）
    event PassportCreated(
        uint256 indexed passportId,
        address indexed owner,
        bytes32 indexed assetFingerprint,
        address subjectAccount,
        string passportMetadataCID,
        string assetMetadataCID
    );

    /**
     * @dev 创建新的资产通行证
     * @param initData 初始配置数据
     * @return passportId 生成的通行证 ID
     * @return subjectAccount 自动生成的 ERC6551 账户地址
     */
    function createPassport(
        PassportTypes.PassportInitData calldata initData
    ) external returns (uint256 passportId, address subjectAccount);

    /**
     * @dev 设置关联的资产通行证核心合约
     */
    function setAssetPassport(address assetPassport) external;

    /**
     * @dev 设置关联的权限管理合约
     */
    function setAuthority(address authority) external;

    /**
     * @dev 设置关联的存证记录合约
     */
    function setChronicle(address chronicle) external;

    /**
     * @dev 设置 ERC6551 注册表地址
     */
    function setSubjectAccountRegistry(address registry) external;

    /**
     * @dev 设置 TBA 实现合约地址
     */
    function setSubjectAccountImplementation(address implementation) external;

    /**
     * @dev 预计算指定通行证的主体账户地址（不产生链上操作）
     */
    function previewSubjectAccount(uint256 passportId) external view returns (address);

    /**
     * @dev 获取关联的资产通行证核心合约地址
     */
    function assetPassport() external view returns (address);

    /**
     * @dev 获取关联的权限管理合约地址
     */
    function authority() external view returns (address);

    /**
     * @dev 获取关联的存证记录合约地址
     */
    function chronicle() external view returns (address);

    /**
     * @dev 获取当前使用的 ERC6551 注册表地址
     */
    function subjectAccountRegistry() external view returns (address);

    /**
     * @dev 获取当前使用的 TBA 实现合约地址
     */
    function subjectAccountImplementation() external view returns (address);
}
