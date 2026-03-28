// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IChronicleStamp} from "./IChronicleStamp.sol";
import {IPassportAuthority} from "./IPassportAuthority.sol";
import {PassportTypes} from "./PassportTypes.sol";

contract PassportAuthority is IPassportAuthority {
    error NotOwner();
    error ZeroAddress();

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    address public owner;
    address public override assetPassport;
    address public override chronicle;

    mapping(address issuer => PassportTypes.IssuerPolicy policy) private _globalIssuerPolicies;
    mapping(address issuer => mapping(uint256 stampTypeId => PassportTypes.IssuerPolicy policy))
        private _typeIssuerPolicies;
    mapping(address issuer => mapping(uint256 passportId => PassportTypes.IssuerPolicy policy))
        private _passportIssuerPolicies;
    mapping(uint256 passportId => bool enabled) private _passportAllowlistMode;
    mapping(uint256 stampTypeId => mapping(address admin => bool enabled)) private _stampTypeAdmins;
    mapping(address operator => bool enabled) private _passportCreators;
    mapping(address operator => bool enabled) private _revocationOperators;

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

    function setAssetPassport(address assetPassport_) external override onlyOwner {
        if (assetPassport_ == address(0)) revert ZeroAddress();

        assetPassport = assetPassport_;
        emit AssetPassportUpdated(assetPassport_);
    }

    function setChronicle(address chronicle_) external override onlyOwner {
        if (chronicle_ == address(0)) revert ZeroAddress();

        chronicle = chronicle_;
        emit ChronicleUpdated(chronicle_);
    }

    function setGlobalIssuerPolicy(
        address issuer,
        PassportTypes.IssuerPolicy calldata policy
    ) external override onlyOwner {
        if (issuer == address(0)) revert ZeroAddress();

        _globalIssuerPolicies[issuer] = policy;
        emit GlobalIssuerPolicySet(issuer, policy.enabled, policy.policyCID);
    }

    function setTypeIssuerPolicy(
        address issuer,
        uint256 stampTypeId,
        PassportTypes.IssuerPolicy calldata policy
    ) external override onlyOwner {
        if (issuer == address(0)) revert ZeroAddress();

        _typeIssuerPolicies[issuer][stampTypeId] = policy;
        emit TypeIssuerPolicySet(issuer, stampTypeId, policy.enabled, policy.policyCID);
    }

    function setPassportIssuerPolicy(
        address issuer,
        uint256 passportId,
        PassportTypes.IssuerPolicy calldata policy
    ) external override onlyOwner {
        if (issuer == address(0)) revert ZeroAddress();

        _passportIssuerPolicies[issuer][passportId] = policy;
        emit PassportIssuerPolicySet(issuer, passportId, policy.enabled, policy.policyCID);
    }

    function setPassportCreator(address operator, bool enabled) external override onlyOwner {
        if (operator == address(0)) revert ZeroAddress();

        _passportCreators[operator] = enabled;
        emit PassportCreatorSet(operator, enabled);
    }

    function setPassportAllowlistMode(
        uint256 passportId,
        bool enabled
    ) external override onlyOwner {
        _passportAllowlistMode[passportId] = enabled;
        emit PassportIssuerAllowlistModeSet(passportId, enabled);
    }

    function setStampTypeAdmin(
        uint256 stampTypeId,
        address admin,
        bool enabled
    ) external override onlyOwner {
        if (admin == address(0)) revert ZeroAddress();

        _stampTypeAdmins[stampTypeId][admin] = enabled;
        emit StampTypeAdminSet(stampTypeId, admin, enabled);
    }

    function setRevocationOperator(address operator, bool enabled) external override onlyOwner {
        if (operator == address(0)) revert ZeroAddress();

        _revocationOperators[operator] = enabled;
        emit RevocationOperatorSet(operator, enabled);
    }

    function canIssue(
        address issuer,
        uint256 stampTypeId,
        uint256 passportId
    ) external view override returns (bool) {
        if (issuer == address(0)) {
            return false;
        }

        PassportTypes.IssuerPolicy memory passportPolicy = _passportIssuerPolicies[issuer][passportId];
        bool hasExplicitPassportGrant = _isPolicyActive(passportPolicy);

        if (_passportAllowlistMode[passportId]) {
            return hasExplicitPassportGrant;
        }

        if (hasExplicitPassportGrant) {
            return true;
        }

        PassportTypes.IssuerPolicy memory typePolicy = _typeIssuerPolicies[issuer][stampTypeId];
        if (_isPolicyActive(typePolicy)) {
            return
                !typePolicy.restrictToExplicitPassportList || hasExplicitPassportGrant;
        }

        PassportTypes.IssuerPolicy memory globalPolicy = _globalIssuerPolicies[issuer];
        if (_isPolicyActive(globalPolicy)) {
            return
                !globalPolicy.restrictToExplicitPassportList || hasExplicitPassportGrant;
        }

        return false;
    }

    function canCreatePassport(address operator) external view override returns (bool) {
        if (operator == address(0)) {
            return false;
        }

        return operator == owner || _passportCreators[operator];
    }

    function canRevoke(address operator, uint256 stampId) external view override returns (bool) {
        if (operator == address(0)) {
            return false;
        }

        if (operator == owner || _revocationOperators[operator]) {
            return true;
        }

        if (chronicle == address(0)) {
            return false;
        }

        try IChronicleStamp(chronicle).stampRecordOf(stampId) returns (
            PassportTypes.StampRecord memory stamp
        ) {
            return operator == stamp.issuer || _stampTypeAdmins[stamp.stampTypeId][operator];
        } catch {
            return false;
        }
    }

    function globalIssuerPolicyOf(
        address issuer
    ) external view override returns (PassportTypes.IssuerPolicy memory) {
        return _globalIssuerPolicies[issuer];
    }

    function typeIssuerPolicyOf(
        address issuer,
        uint256 stampTypeId
    ) external view override returns (PassportTypes.IssuerPolicy memory) {
        return _typeIssuerPolicies[issuer][stampTypeId];
    }

    function passportIssuerPolicyOf(
        address issuer,
        uint256 passportId
    ) external view override returns (PassportTypes.IssuerPolicy memory) {
        return _passportIssuerPolicies[issuer][passportId];
    }

    function isStampTypeAdmin(
        uint256 stampTypeId,
        address admin
    ) external view override returns (bool) {
        return _stampTypeAdmins[stampTypeId][admin];
    }

    function isPassportCreator(address operator) external view override returns (bool) {
        return _passportCreators[operator];
    }

    function isRevocationOperator(address operator) external view override returns (bool) {
        return _revocationOperators[operator];
    }

    function passportAllowlistMode(uint256 passportId) external view returns (bool) {
        return _passportAllowlistMode[passportId];
    }

    function _isPolicyActive(PassportTypes.IssuerPolicy memory policy) private view returns (bool) {
        if (!policy.enabled) {
            return false;
        }

        if (policy.validAfter != 0 && block.timestamp < policy.validAfter) {
            return false;
        }

        if (policy.validUntil != 0 && block.timestamp > policy.validUntil) {
            return false;
        }

        return true;
    }
}
