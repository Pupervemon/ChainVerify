// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IAssetPassport} from "./IAssetPassport.sol";
import {IPassportAuthority} from "./IPassportAuthority.sol";
import {IPassportFactory} from "./IPassportFactory.sol";
import {PassportTypes} from "./PassportTypes.sol";

/**
 * @dev ERC6551 注册表接口，用于创建代币绑定账户（TBA）
 */
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

/**
 * @title PassportFactory
 * @dev 资产通行证工厂合约。
 * 负责统一创建（铸造）资产通行证，并集成 ERC6551 协议，为每个通行证自动分配一个受控账户。
 */
contract PassportFactory is IPassportFactory {
    // --- 错误定义 ---
    error NotOwner(); // 仅限所有者
    error Unauthorized(); // 未授权的操作
    error ZeroAddress(); // 不允许零地址
    error InvalidInitialHolder(); // 无效的初始持有者
    error AssetPassportNotConfigured(); // 核心合约未配置
    error AuthorityNotConfigured(); // 权限合约未配置
    error SubjectAccountProvisionFailed(); // 创建主体账户失败

    // --- 事件定义 ---
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // --- 状态变量 ---
    address public owner; // 合约所有者
    address public override assetPassport; // 资产通行证核心合约地址
    address public override authority; // 权限管理合约地址
    address public override chronicle; // 存证记录合约地址
    address public override subjectAccountRegistry; // ERC6551 注册表地址
    address public override subjectAccountImplementation; // TBA 实现合约地址

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
     * @dev 转移所有权
     */
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();

        address previousOwner = owner;
        owner = newOwner;

        emit OwnershipTransferred(previousOwner, newOwner);
    }

    /**
     * @dev 创建新的资产通行证并绑定主体账户
     * @param initData 初始数据（资产指纹、元数据等）
     * @return passportId 新创建的通行证 ID
     * @return subjectAccount 为该通行证创建的 ERC6551 账户地址
     */
    function createPassport(
        PassportTypes.PassportInitData calldata initData
    ) external override returns (uint256 passportId, address subjectAccount) {
        if (assetPassport == address(0)) revert AssetPassportNotConfigured();
        if (authority == address(0)) revert AuthorityNotConfigured();
        
        // 校验调用者是否有权创建通行证（通常需要后端签名或特定角色）
        if (!IPassportAuthority(authority).canCreatePassport(msg.sender)) revert Unauthorized();
        if (initData.initialHolder == address(0)) revert InvalidInitialHolder();

        // 1. 在核心合约中铸造通行证
        passportId = IAssetPassport(assetPassport).mintPassport(initData.initialHolder, initData);
        
        // 2. 为新铸造的通行证分配主体账户（TBA）
        subjectAccount = _provisionSubjectAccount(passportId);

        // 3. 将生成的 TBA 地址回填到通行证记录中
        if (subjectAccount != address(0)) {
            IAssetPassport(assetPassport).setSubjectAccount(passportId, subjectAccount);
        }

        emit PassportCreated(
            passportId,
            initData.initialHolder,
            initData.assetFingerprint,
            subjectAccount,
            initData.passportMetadataCID,
            initData.assetMetadataCID
        );
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
     * @dev 设置权限管理合约地址
     */
    function setAuthority(address authority_) external override onlyOwner {
        if (authority_ == address(0)) revert ZeroAddress();

        authority = authority_;
        emit AuthorityUpdated(authority_);
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
     * @dev 设置 ERC6551 注册表地址
     */
    function setSubjectAccountRegistry(address registry) external override onlyOwner {
        if (registry == address(0)) revert ZeroAddress();

        subjectAccountRegistry = registry;
        emit SubjectAccountRegistryUpdated(registry);
    }

    /**
     * @dev 设置 TBA 实现合约地址
     */
    function setSubjectAccountImplementation(address implementation) external override onlyOwner {
        if (implementation == address(0)) revert ZeroAddress();

        subjectAccountImplementation = implementation;
        emit SubjectAccountImplementationUpdated(implementation);
    }

    /**
     * @dev 预估（计算）特定通行证的主体账户地址
     */
    function previewSubjectAccount(uint256 passportId) external view override returns (address) {
        if (
            assetPassport == address(0) ||
            subjectAccountRegistry == address(0) ||
            subjectAccountImplementation == address(0)
        ) {
            return address(0);
        }

        return
            ISubjectAccountRegistry(subjectAccountRegistry).account(
                subjectAccountImplementation,
                bytes32(0),
                block.chainid,
                assetPassport,
                passportId
            );
    }

    /**
     * @dev 内部函数：在注册表中实际创建主体账户
     */
    function _provisionSubjectAccount(uint256 passportId) private returns (address subjectAccount) {
        // 如果未配置注册表或实现合约，则不创建账户
        if (
            subjectAccountRegistry == address(0) ||
            subjectAccountImplementation == address(0)
        ) {
            return address(0);
        }

        try
            ISubjectAccountRegistry(subjectAccountRegistry).createAccount(
                subjectAccountImplementation,
                bytes32(0),
                block.chainid,
                assetPassport,
                passportId
            )
        returns (address accountAddress) {
            return accountAddress;
        } catch {
            revert SubjectAccountProvisionFailed();
        }
    }
}
