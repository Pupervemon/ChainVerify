// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {PassportTypes} from "./PassportTypes.sol";

interface IChronicleStamp {
    event AssetPassportUpdated(address indexed assetPassport);
    event AuthorityUpdated(address indexed authority);
    event StampTypeConfigured(
        uint256 indexed stampTypeId,
        string code,
        string name,
        string schemaCID,
        bool active,
        bool singleton
    );
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
    event StampRevoked(
        uint256 indexed stampId,
        uint256 indexed passportId,
        address indexed operator,
        string reasonCID
    );

    function configureStampType(
        uint256 stampTypeId,
        PassportTypes.StampTypeConfig calldata config
    ) external;

    function issueStamp(
        uint256 passportId,
        uint256 stampTypeId,
        uint64 occurredAt,
        string calldata metadataCID,
        uint256 supersedesStampId
    ) external returns (uint256 stampId);

    function revokeStamp(uint256 stampId, string calldata reasonCID) external;

    function setAssetPassport(address assetPassport) external;

    function setAuthority(address authority) external;

    function stampTypeOf(uint256 stampTypeId)
        external
        view
        returns (PassportTypes.StampTypeConfig memory);

    function stampRecordOf(uint256 stampId)
        external
        view
        returns (PassportTypes.StampRecord memory);

    function stampCountByPassport(uint256 passportId) external view returns (uint256);

    function stampIdByPassportAndIndex(
        uint256 passportId,
        uint256 index
    ) external view returns (uint256);

    function latestEffectiveStampId(
        uint256 passportId,
        uint256 stampTypeId
    ) external view returns (uint256);

    function assetPassport() external view returns (address);

    function authority() external view returns (address);
}
