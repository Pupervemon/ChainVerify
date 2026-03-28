// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {PassportTypes} from "./PassportTypes.sol";

interface IPassportFactory {
    event AssetPassportUpdated(address indexed assetPassport);
    event AuthorityUpdated(address indexed authority);
    event ChronicleUpdated(address indexed chronicle);
    event SubjectAccountImplementationUpdated(address indexed implementation);
    event SubjectAccountRegistryUpdated(address indexed registry);
    event PassportCreated(
        uint256 indexed passportId,
        address indexed owner,
        bytes32 indexed assetFingerprint,
        address subjectAccount,
        string passportMetadataCID,
        string assetMetadataCID
    );

    function createPassport(
        PassportTypes.PassportInitData calldata initData
    ) external returns (uint256 passportId, address subjectAccount);

    function setAssetPassport(address assetPassport) external;

    function setAuthority(address authority) external;

    function setChronicle(address chronicle) external;

    function setSubjectAccountRegistry(address registry) external;

    function setSubjectAccountImplementation(address implementation) external;

    function previewSubjectAccount(uint256 passportId) external view returns (address);

    function assetPassport() external view returns (address);

    function authority() external view returns (address);

    function chronicle() external view returns (address);

    function subjectAccountRegistry() external view returns (address);

    function subjectAccountImplementation() external view returns (address);
}
