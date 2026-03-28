// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IAssetPassport} from "./IAssetPassport.sol";
import {IPassportAuthority} from "./IPassportAuthority.sol";
import {IPassportFactory} from "./IPassportFactory.sol";
import {PassportTypes} from "./PassportTypes.sol";

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

contract PassportFactory is IPassportFactory {
    error NotOwner();
    error Unauthorized();
    error ZeroAddress();
    error InvalidInitialHolder();
    error AssetPassportNotConfigured();
    error AuthorityNotConfigured();
    error SubjectAccountProvisionFailed();

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    address public owner;
    address public override assetPassport;
    address public override authority;
    address public override chronicle;
    address public override subjectAccountRegistry;
    address public override subjectAccountImplementation;

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor(address initialOwner) {
        if (initialOwner == address(0)) revert ZeroAddress();

        owner = initialOwner;
        emit OwnershipTransferred(address(0), initialOwner);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();

        address previousOwner = owner;
        owner = newOwner;

        emit OwnershipTransferred(previousOwner, newOwner);
    }

    function createPassport(
        PassportTypes.PassportInitData calldata initData
    ) external override returns (uint256 passportId, address subjectAccount) {
        if (assetPassport == address(0)) revert AssetPassportNotConfigured();
        if (authority == address(0)) revert AuthorityNotConfigured();
        if (!IPassportAuthority(authority).canCreatePassport(msg.sender)) revert Unauthorized();
        if (initData.initialHolder == address(0)) revert InvalidInitialHolder();

        passportId = IAssetPassport(assetPassport).mintPassport(initData.initialHolder, initData);
        subjectAccount = _provisionSubjectAccount(passportId);

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

    function setAssetPassport(address assetPassport_) external override onlyOwner {
        if (assetPassport_ == address(0)) revert ZeroAddress();

        assetPassport = assetPassport_;
        emit AssetPassportUpdated(assetPassport_);
    }

    function setAuthority(address authority_) external override onlyOwner {
        if (authority_ == address(0)) revert ZeroAddress();

        authority = authority_;
        emit AuthorityUpdated(authority_);
    }

    function setChronicle(address chronicle_) external override onlyOwner {
        if (chronicle_ == address(0)) revert ZeroAddress();

        chronicle = chronicle_;
        emit ChronicleUpdated(chronicle_);
    }

    function setSubjectAccountRegistry(address registry) external override onlyOwner {
        if (registry == address(0)) revert ZeroAddress();

        subjectAccountRegistry = registry;
        emit SubjectAccountRegistryUpdated(registry);
    }

    function setSubjectAccountImplementation(address implementation) external override onlyOwner {
        if (implementation == address(0)) revert ZeroAddress();

        subjectAccountImplementation = implementation;
        emit SubjectAccountImplementationUpdated(implementation);
    }

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

    function _provisionSubjectAccount(uint256 passportId) private returns (address subjectAccount) {
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
