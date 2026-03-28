// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IAssetPassport} from "./IAssetPassport.sol";
import {IChronicleStamp} from "./IChronicleStamp.sol";
import {IPassportAuthority} from "./IPassportAuthority.sol";
import {PassportTypes} from "./PassportTypes.sol";

contract ChronicleStamp is IChronicleStamp {
    error NotOwner();
    error Unauthorized();
    error ZeroAddress();
    error InvalidPassport();
    error PassportNotActive();
    error StampTypeNotActive();
    error UnknownStamp();
    error StampAlreadyRevoked();
    error InvalidOccurredAt();
    error EmptyMetadataCID();
    error EmptyReasonCID();
    error InvalidSupersession();
    error SingletonConflict();
    error IndexOutOfBounds();

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    address public owner;
    address public override assetPassport;
    address public override authority;

    uint256 private _nextStampId = 1;

    mapping(uint256 stampTypeId => PassportTypes.StampTypeConfig config) private _stampTypes;
    mapping(uint256 stampId => PassportTypes.StampRecord record) private _stampRecords;
    mapping(uint256 passportId => uint256[] stampIds) private _stampIdsByPassport;
    mapping(uint256 passportId => mapping(uint256 stampTypeId => uint256 stampId))
        private _latestEffectiveStampIds;

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

    function configureStampType(
        uint256 stampTypeId,
        PassportTypes.StampTypeConfig calldata config
    ) external override {
        if (!_canManageStampType(stampTypeId, msg.sender)) revert Unauthorized();

        _stampTypes[stampTypeId] = config;

        emit StampTypeConfigured(
            stampTypeId,
            config.code,
            config.name,
            config.schemaCID,
            config.active,
            config.singleton
        );
    }

    function issueStamp(
        uint256 passportId,
        uint256 stampTypeId,
        uint64 occurredAt,
        string calldata metadataCID,
        uint256 supersedesStampId
    ) external override returns (uint256 stampId) {
        if (bytes(metadataCID).length == 0) revert EmptyMetadataCID();
        if (occurredAt == 0 || occurredAt > block.timestamp) revert InvalidOccurredAt();
        if (assetPassport == address(0) || authority == address(0)) revert Unauthorized();
        if (!IPassportAuthority(authority).canIssue(msg.sender, stampTypeId, passportId)) {
            revert Unauthorized();
        }

        PassportTypes.PassportRecord memory passport = _loadActivePassport(passportId);
        PassportTypes.StampTypeConfig memory stampType = _stampTypes[stampTypeId];
        if (!stampType.active) revert StampTypeNotActive();

        uint256 previousEffectiveStampId = _latestEffectiveStampIds[passportId][stampTypeId];
        if (stampType.singleton) {
            if (previousEffectiveStampId == 0 && supersedesStampId != 0) {
                revert InvalidSupersession();
            }
            if (previousEffectiveStampId != 0 && supersedesStampId != previousEffectiveStampId) {
                revert SingletonConflict();
            }
        }

        stampId = _nextStampId;
        _nextStampId = stampId + 1;

        if (supersedesStampId != 0) {
            _consumeSupersededStamp(
                supersedesStampId,
                passportId,
                stampTypeId,
                previousEffectiveStampId,
                stampType.singleton,
                stampId
            );
        } else if (stampType.singleton && previousEffectiveStampId != 0) {
            revert SingletonConflict();
        }

        PassportTypes.StampRecord memory record = PassportTypes.StampRecord({
            stampId: stampId,
            passportId: passportId,
            stampTypeId: stampTypeId,
            issuer: msg.sender,
            occurredAt: occurredAt,
            issuedAt: uint64(block.timestamp),
            metadataCID: metadataCID,
            revoked: false,
            supersedesStampId: supersedesStampId,
            revokedByStampId: 0
        });

        _stampRecords[stampId] = record;
        _stampIdsByPassport[passportId].push(stampId);
        _latestEffectiveStampIds[passportId][stampTypeId] = stampId;

        emit StampIssued(
            stampId,
            passportId,
            stampTypeId,
            msg.sender,
            passport.subjectAccount,
            occurredAt,
            uint64(block.timestamp),
            metadataCID,
            supersedesStampId
        );
    }

    function revokeStamp(uint256 stampId, string calldata reasonCID) external override {
        if (bytes(reasonCID).length == 0) revert EmptyReasonCID();
        if (authority == address(0)) revert Unauthorized();

        PassportTypes.StampRecord storage record = _stampRecords[stampId];
        if (record.stampId == 0) revert UnknownStamp();
        if (record.revoked) revert StampAlreadyRevoked();
        if (!IPassportAuthority(authority).canRevoke(msg.sender, stampId)) {
            revert Unauthorized();
        }

        record.revoked = true;

        if (_latestEffectiveStampIds[record.passportId][record.stampTypeId] == stampId) {
            _latestEffectiveStampIds[record.passportId][record.stampTypeId] = 0;
        }

        emit StampRevoked(stampId, record.passportId, msg.sender, reasonCID);
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

    function stampTypeOf(
        uint256 stampTypeId
    ) external view override returns (PassportTypes.StampTypeConfig memory) {
        return _stampTypes[stampTypeId];
    }

    function stampRecordOf(
        uint256 stampId
    ) external view override returns (PassportTypes.StampRecord memory) {
        PassportTypes.StampRecord memory record = _stampRecords[stampId];
        if (record.stampId == 0) revert UnknownStamp();
        return record;
    }

    function stampCountByPassport(uint256 passportId) external view override returns (uint256) {
        return _stampIdsByPassport[passportId].length;
    }

    function stampIdByPassportAndIndex(
        uint256 passportId,
        uint256 index
    ) external view override returns (uint256) {
        uint256[] storage stampIds = _stampIdsByPassport[passportId];
        if (index >= stampIds.length) revert IndexOutOfBounds();
        return stampIds[index];
    }

    function latestEffectiveStampId(
        uint256 passportId,
        uint256 stampTypeId
    ) external view override returns (uint256) {
        return _latestEffectiveStampIds[passportId][stampTypeId];
    }

    function _loadActivePassport(
        uint256 passportId
    ) private view returns (PassportTypes.PassportRecord memory) {
        IAssetPassport passportContract = IAssetPassport(assetPassport);
        if (!passportContract.exists(passportId)) revert InvalidPassport();

        PassportTypes.PassportRecord memory passport = passportContract.recordOf(passportId);
        if (passport.status != PassportTypes.PassportStatus.Active) {
            revert PassportNotActive();
        }

        return passport;
    }

    function _consumeSupersededStamp(
        uint256 supersedesStampId,
        uint256 passportId,
        uint256 stampTypeId,
        uint256 previousEffectiveStampId,
        bool singleton,
        uint256 revokedByStampId
    ) private {
        PassportTypes.StampRecord storage previousRecord = _stampRecords[supersedesStampId];
        if (previousRecord.stampId == 0) revert UnknownStamp();
        if (previousRecord.revoked) revert StampAlreadyRevoked();
        if (previousRecord.passportId != passportId || previousRecord.stampTypeId != stampTypeId) {
            revert InvalidSupersession();
        }
        if (singleton && supersedesStampId != previousEffectiveStampId) {
            revert SingletonConflict();
        }

        previousRecord.revoked = true;
        previousRecord.revokedByStampId = revokedByStampId;
    }

    function _canManageStampType(uint256 stampTypeId, address operator) private view returns (bool) {
        if (operator == owner) {
            return true;
        }

        if (authority == address(0)) {
            return false;
        }

        return IPassportAuthority(authority).isStampTypeAdmin(stampTypeId, operator);
    }
}
