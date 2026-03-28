// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IAssetPassport} from "./IAssetPassport.sol";
import {PassportTypes} from "./PassportTypes.sol";

interface IERC721Receiver {
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}

contract AssetPassport is IAssetPassport {
    error NotOwner();
    error Unauthorized();
    error ZeroAddress();
    error UnknownPassport();
    error AlreadyMinted();
    error EmptyAssetFingerprint();
    error InitialHolderMismatch();
    error NonTransferableStatus();
    error InvalidStatus();
    error ApprovalToCurrentOwner();
    error ApproveCallerNotOwnerNorOperator();
    error InvalidTransferFrom();
    error UnsafeRecipient();
    error IndexOutOfBounds();

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    string public name;
    string public symbol;

    address public owner;
    address public override authority;
    address public override chronicle;

    uint256 public totalSupply;
    uint256 private _nextPassportId = 1;

    mapping(uint256 passportId => address holder) private _owners;
    mapping(address holder => uint256 balance) private _balances;
    mapping(uint256 passportId => address approved) private _tokenApprovals;
    mapping(address holder => mapping(address operator => bool approved))
        private _operatorApprovals;
    mapping(uint256 passportId => PassportTypes.PassportRecord record) private _passportRecords;
    mapping(bytes32 assetFingerprint => uint256 passportId) private _passportIdByFingerprint;
    mapping(address factory => bool enabled) private _factories;
    mapping(address factory => uint256 indexPlusOne) private _factoryIndexPlusOne;
    address[] private _factoryList;

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor(address initialOwner, string memory name_, string memory symbol_) {
        if (initialOwner == address(0)) revert ZeroAddress();

        owner = initialOwner;
        name = name_;
        symbol = symbol_;

        emit OwnershipTransferred(address(0), initialOwner);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();

        address previousOwner = owner;
        owner = newOwner;

        emit OwnershipTransferred(previousOwner, newOwner);
    }

    function mintPassport(
        address to,
        PassportTypes.PassportInitData calldata initData
    ) external override returns (uint256 passportId) {
        if (!_canMint(msg.sender)) revert Unauthorized();
        if (to == address(0)) revert ZeroAddress();
        if (initData.assetFingerprint == bytes32(0)) revert EmptyAssetFingerprint();
        if (initData.initialHolder != address(0) && initData.initialHolder != to) {
            revert InitialHolderMismatch();
        }
        if (_passportIdByFingerprint[initData.assetFingerprint] != 0) revert AlreadyMinted();

        passportId = _nextPassportId;
        _nextPassportId = passportId + 1;
        totalSupply += 1;

        _balances[to] += 1;
        _owners[passportId] = to;
        _passportIdByFingerprint[initData.assetFingerprint] = passportId;
        _passportRecords[passportId] = PassportTypes.PassportRecord({
            passportId: passportId,
            assetFingerprint: initData.assetFingerprint,
            subjectAccount: address(0),
            passportMetadataCID: initData.passportMetadataCID,
            assetMetadataCID: initData.assetMetadataCID,
            status: PassportTypes.PassportStatus.Active
        });

        emit Transfer(address(0), to, passportId);
        emit PassportMinted(
            passportId,
            to,
            initData.assetFingerprint,
            initData.passportMetadataCID,
            initData.assetMetadataCID
        );
    }

    function setSubjectAccount(uint256 passportId, address subjectAccount) external override {
        PassportTypes.PassportRecord storage record = _requirePassportRecord(passportId);
        if (!_canManageInfrastructure(msg.sender)) revert Unauthorized();

        record.subjectAccount = subjectAccount;
        emit SubjectAccountBound(passportId, subjectAccount);
    }

    function updatePassportMetadata(
        uint256 passportId,
        string calldata passportMetadataCID,
        string calldata assetMetadataCID
    ) external override {
        PassportTypes.PassportRecord storage record = _requirePassportRecord(passportId);
        if (!_isApprovedOrOwner(msg.sender, passportId) && msg.sender != owner) {
            revert Unauthorized();
        }

        record.passportMetadataCID = passportMetadataCID;
        record.assetMetadataCID = assetMetadataCID;

        emit PassportMetadataUpdated(passportId, passportMetadataCID, assetMetadataCID);
    }

    function setPassportStatus(
        uint256 passportId,
        PassportTypes.PassportStatus newStatus
    ) external override {
        PassportTypes.PassportRecord storage record = _requirePassportRecord(passportId);
        if (msg.sender != owner && msg.sender != authority) revert Unauthorized();
        if (newStatus == PassportTypes.PassportStatus.Uninitialized) revert InvalidStatus();

        PassportTypes.PassportStatus previousStatus = record.status;
        record.status = newStatus;

        emit PassportStatusUpdated(passportId, previousStatus, newStatus);
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

    function setFactory(address factory_, bool enabled) external override onlyOwner {
        if (factory_ == address(0)) revert ZeroAddress();

        bool current = _factories[factory_];
        if (current == enabled) {
            emit FactoryAuthorizationUpdated(factory_, enabled);
            return;
        }

        _factories[factory_] = enabled;

        if (enabled) {
            _factoryList.push(factory_);
            _factoryIndexPlusOne[factory_] = _factoryList.length;
        } else {
            uint256 index = _factoryIndexPlusOne[factory_];
            uint256 lastIndex = _factoryList.length;

            if (index != 0) {
                if (index != lastIndex) {
                    address lastFactory = _factoryList[lastIndex - 1];
                    _factoryList[index - 1] = lastFactory;
                    _factoryIndexPlusOne[lastFactory] = index;
                }

                _factoryList.pop();
                delete _factoryIndexPlusOne[factory_];
            }
        }

        emit FactoryAuthorizationUpdated(factory_, enabled);
    }

    function exists(uint256 passportId) external view override returns (bool) {
        return _owners[passportId] != address(0);
    }

    function recordOf(
        uint256 passportId
    ) external view override returns (PassportTypes.PassportRecord memory) {
        PassportTypes.PassportRecord memory record = _passportRecords[passportId];
        if (_owners[passportId] == address(0)) revert UnknownPassport();
        return record;
    }

    function subjectAccountOf(uint256 passportId) external view override returns (address) {
        PassportTypes.PassportRecord storage record = _requirePassportRecord(passportId);
        return record.subjectAccount;
    }

    function isFactory(address factory_) external view override returns (bool) {
        return _factories[factory_];
    }

    function factoryCount() external view override returns (uint256) {
        return _factoryList.length;
    }

    function factoryAt(uint256 index) external view override returns (address) {
        if (index >= _factoryList.length) revert IndexOutOfBounds();
        return _factoryList[index];
    }

    function balanceOf(address account) external view returns (uint256) {
        if (account == address(0)) revert ZeroAddress();
        return _balances[account];
    }

    function ownerOf(uint256 passportId) public view returns (address) {
        address holder = _owners[passportId];
        if (holder == address(0)) revert UnknownPassport();
        return holder;
    }

    function approve(address to, uint256 passportId) external {
        address holder = ownerOf(passportId);
        if (to == holder) revert ApprovalToCurrentOwner();
        if (msg.sender != holder && !_operatorApprovals[holder][msg.sender]) {
            revert ApproveCallerNotOwnerNorOperator();
        }

        _tokenApprovals[passportId] = to;
        emit Approval(holder, to, passportId);
    }

    function getApproved(uint256 passportId) external view returns (address) {
        if (_owners[passportId] == address(0)) revert UnknownPassport();
        return _tokenApprovals[passportId];
    }

    function setApprovalForAll(address operator, bool approved) external {
        if (operator == msg.sender) revert ApprovalToCurrentOwner();

        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function isApprovedForAll(address account, address operator) external view returns (bool) {
        return _operatorApprovals[account][operator];
    }

    function transferFrom(address from, address to, uint256 passportId) public {
        if (!_isApprovedOrOwner(msg.sender, passportId)) revert Unauthorized();
        if (ownerOf(passportId) != from) revert InvalidTransferFrom();
        if (to == address(0)) revert ZeroAddress();

        _requireTransferable(passportId);
        _approve(address(0), passportId);

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[passportId] = to;

        emit Transfer(from, to, passportId);
    }

    function safeTransferFrom(address from, address to, uint256 passportId) external {
        safeTransferFrom(from, to, passportId, "");
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 passportId,
        bytes memory data
    ) public {
        transferFrom(from, to, passportId);
        _checkOnERC721Received(msg.sender, from, to, passportId, data);
    }

    function tokenURI(uint256 passportId) external view returns (string memory) {
        PassportTypes.PassportRecord storage record = _requirePassportRecord(passportId);
        return record.passportMetadataCID;
    }

    function passportIdByFingerprint(bytes32 assetFingerprint) external view returns (uint256) {
        return _passportIdByFingerprint[assetFingerprint];
    }

    function _canMint(address operator) private view returns (bool) {
        return _factories[operator];
    }

    function _canManageInfrastructure(address operator) private view returns (bool) {
        return operator == owner || _factories[operator];
    }

    function _isApprovedOrOwner(address operator, uint256 passportId) private view returns (bool) {
        address holder = ownerOf(passportId);
        return (operator == holder ||
            _tokenApprovals[passportId] == operator ||
            _operatorApprovals[holder][operator]);
    }

    function _approve(address to, uint256 passportId) private {
        _tokenApprovals[passportId] = to;
        emit Approval(ownerOf(passportId), to, passportId);
    }

    function _checkOnERC721Received(
        address operator,
        address from,
        address to,
        uint256 passportId,
        bytes memory data
    ) private {
        if (to.code.length == 0) {
            return;
        }

        try IERC721Receiver(to).onERC721Received(operator, from, passportId, data) returns (
            bytes4 retval
        ) {
            if (retval != IERC721Receiver.onERC721Received.selector) {
                revert UnsafeRecipient();
            }
        } catch {
            revert UnsafeRecipient();
        }
    }

    function _requirePassportRecord(
        uint256 passportId
    ) private view returns (PassportTypes.PassportRecord storage record) {
        if (_owners[passportId] == address(0)) revert UnknownPassport();
        return _passportRecords[passportId];
    }

    function _requireTransferable(uint256 passportId) private view {
        PassportTypes.PassportStatus status = _passportRecords[passportId].status;
        if (status != PassportTypes.PassportStatus.Active) revert NonTransferableStatus();
    }
}
