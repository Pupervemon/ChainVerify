// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

library PassportTypes {
    enum PassportStatus {
        Uninitialized,
        Active,
        Frozen,
        Retired
    }

    struct PassportInitData {
        bytes32 assetFingerprint;
        string passportMetadataCID;
        string assetMetadataCID;
        address initialHolder;
    }

    struct PassportRecord {
        uint256 passportId;
        bytes32 assetFingerprint;
        address subjectAccount;
        string passportMetadataCID;
        string assetMetadataCID;
        PassportStatus status;
    }

    struct StampTypeConfig {
        string code;
        string name;
        string schemaCID;
        bool active;
        bool singleton;
    }

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

    struct IssuerPolicy {
        bool enabled;
        uint64 validAfter;
        uint64 validUntil;
        bool restrictToExplicitPassportList;
        string policyCID;
    }
}
