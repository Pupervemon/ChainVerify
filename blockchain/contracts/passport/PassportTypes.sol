// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title PassportTypes
 * @dev 资产通行证系统使用的核心数据类型库。
 * 包含枚举定义、铸造初始化数据、通行证记录、印章配置及权限策略等结构。
 */
library PassportTypes {
    /**
     * @dev 通行证状态枚举
     * Uninitialized: 未初始化（默认值）
     * Active: 活跃（正常使用中）
     * Frozen: 冻结（由于争议或安全原因临时禁用）
     * Retired: 退役（资产已销毁或通行证已失效）
     */
    enum PassportStatus {
        Uninitialized,
        Active,
        Frozen,
        Retired
    }

    /**
     * @dev 通行证铸造初始数据
     * assetFingerprint: 资产的唯一指纹（如哈希值）
     * passportMetadataCID: 通行证本身的元数据存储地址 (IPFS/Arweave CID)
     * assetMetadataCID: 资产详细信息的元数据存储地址
     * initialHolder: 初始持有者地址
     */
    struct PassportInitData {
        bytes32 assetFingerprint;
        string passportMetadataCID;
        string assetMetadataCID;
        address initialHolder;
    }

    /**
     * @dev 通行证完整记录结构
     * passportId: 通行证唯一 ID
     * assetFingerprint: 绑定的资产指纹
     * subjectAccount: 关联的主体账户 (ERC6551 TBA 地址)
     * passportMetadataCID: 通行证元数据 CID
     * assetMetadataCID: 资产元数据 CID
     * status: 通行证当前状态
     */
    struct PassportRecord {
        uint256 passportId;
        bytes32 assetFingerprint;
        address subjectAccount;
        string passportMetadataCID;
        string assetMetadataCID;
        PassportStatus status;
    }

    /**
     * @dev 印章类型配置结构
     * code: 印章类型代码（如 "MAINTENANCE", "INSPECTION"）
     * name: 印章类型名称
     * schemaCID: 该类型印章需遵循的数据结构定义 CID
     * active: 该类型是否启用
     * singleton: 是否为单例（若为 true，则同一通行证下该类型只能有一个有效的最新印章）
     */
    struct StampTypeConfig {
        string code;
        string name;
        string schemaCID;
        bool active;
        bool singleton;
    }

    /**
     * @dev 单条印章记录结构
     * stampId: 印章唯一 ID
     * passportId: 所属的通行证 ID
     * stampTypeId: 印章类型 ID
     * issuer: 签发者地址
     * occurredAt: 事实发生的时间戳
     * issuedAt: 链上签发的时间戳
     * metadataCID: 印章详情数据 CID
     * revoked: 是否已撤销
     * supersedesStampId: 被此印章替代的旧印章 ID
     * revokedByStampId: 替代此印章的新印章 ID（如果适用）
     */
    struct StampRecord {
        uint256 stampId;
        uint256 passportId;
        uint256 stampTypeId;
        address issuer;
        uint64 occurredAt;
        uint64 issuedAt;
        string metadataCID;
        bool revoked;
        uint256 supersedesStampId;
        uint256 revokedByStampId;
    }

    /**
     * @dev 签发者策略配置结构
     * enabled: 策略是否启用
     * validAfter: 策略生效时间 (0 表示立即)
     * validUntil: 策略过期时间 (0 表示永不过期)
     * restrictToExplicitPassportList: 是否限制仅能签发被明确授权的通行证
     * policyCID: 离线详细策略文档的 CID
     */
    struct IssuerPolicy {
        bool enabled;
        uint64 validAfter;
        uint64 validUntil;
        bool restrictToExplicitPassportList;
        string policyCID;
    }
}
