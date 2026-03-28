// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {PassportTypes} from "./PassportTypes.sol";

interface IPassportAuthority {
    event AssetPassportUpdated(address indexed assetPassport);
    event ChronicleUpdated(address indexed chronicle);
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
    event PassportCreatorSet(address indexed operator, bool enabled);
    event PassportIssuerAllowlistModeSet(uint256 indexed passportId, bool enabled);
    event StampTypeAdminSet(uint256 indexed stampTypeId, address indexed admin, bool enabled);
    event RevocationOperatorSet(address indexed operator, bool enabled);

    function setAssetPassport(address assetPassport) external;

    function setChronicle(address chronicle) external;

    function setGlobalIssuerPolicy(
        address issuer,
        PassportTypes.IssuerPolicy calldata policy
    ) external;

    function setTypeIssuerPolicy(
        address issuer,
        uint256 stampTypeId,
        PassportTypes.IssuerPolicy calldata policy
    ) external;

    function setPassportIssuerPolicy(
        address issuer,
        uint256 passportId,
        PassportTypes.IssuerPolicy calldata policy
    ) external;

    function setPassportCreator(address operator, bool enabled) external;

    function setPassportAllowlistMode(uint256 passportId, bool enabled) external;

    function setStampTypeAdmin(uint256 stampTypeId, address admin, bool enabled) external;

    function setRevocationOperator(address operator, bool enabled) external;

    function canIssue(
        address issuer,
        uint256 stampTypeId,
        uint256 passportId
    ) external view returns (bool);

    function canCreatePassport(address operator) external view returns (bool);

    function canRevoke(address operator, uint256 stampId) external view returns (bool);

    function globalIssuerPolicyOf(
        address issuer
    ) external view returns (PassportTypes.IssuerPolicy memory);

    function typeIssuerPolicyOf(
        address issuer,
        uint256 stampTypeId
    ) external view returns (PassportTypes.IssuerPolicy memory);

    function passportIssuerPolicyOf(
        address issuer,
        uint256 passportId
    ) external view returns (PassportTypes.IssuerPolicy memory);

    function isStampTypeAdmin(uint256 stampTypeId, address admin) external view returns (bool);

    function isPassportCreator(address operator) external view returns (bool);

    function isRevocationOperator(address operator) external view returns (bool);

    function assetPassport() external view returns (address);

    function chronicle() external view returns (address);
}
