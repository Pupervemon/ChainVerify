// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {PassportTypes} from "./PassportTypes.sol";

interface IAssetPassport {
    event AuthorityUpdated(address indexed authority);
    event ChronicleUpdated(address indexed chronicle);
    event FactoryAuthorizationUpdated(address indexed factory, bool enabled);
    event PassportMinted(
        uint256 indexed passportId,
        address indexed owner,
        bytes32 indexed assetFingerprint,
        string passportMetadataCID,
        string assetMetadataCID
    );
    event SubjectAccountBound(uint256 indexed passportId, address indexed subjectAccount);
    event PassportMetadataUpdated(
        uint256 indexed passportId,
        string passportMetadataCID,
        string assetMetadataCID
    );
    event PassportStatusUpdated(
        uint256 indexed passportId,
        PassportTypes.PassportStatus previousStatus,
        PassportTypes.PassportStatus newStatus
    );

    function mintPassport(
        address to,
        PassportTypes.PassportInitData calldata initData
    ) external returns (uint256 passportId);

    function setSubjectAccount(uint256 passportId, address subjectAccount) external;

    function updatePassportMetadata(
        uint256 passportId,
        string calldata passportMetadataCID,
        string calldata assetMetadataCID
    ) external;

    function setPassportStatus(
        uint256 passportId,
        PassportTypes.PassportStatus newStatus
    ) external;

    function setAuthority(address authority) external;

    function setChronicle(address chronicle) external;

    function setFactory(address factory, bool enabled) external;

    function exists(uint256 passportId) external view returns (bool);

    function recordOf(uint256 passportId) external view returns (PassportTypes.PassportRecord memory);

    function subjectAccountOf(uint256 passportId) external view returns (address);

    function isFactory(address factory) external view returns (bool);

    function factoryCount() external view returns (uint256);

    function factoryAt(uint256 index) external view returns (address);

    function authority() external view returns (address);

    function chronicle() external view returns (address);
}
