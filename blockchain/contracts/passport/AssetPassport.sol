// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IAssetPassport} from "./IAssetPassport.sol";
import {PassportTypes} from "./PassportTypes.sol";

/**
 * @dev ERC721 接收者接口，用于安全转账校验
 */
interface IERC721Receiver {
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}

/**
 * @title AssetPassport
 * @dev 资产通行证核心合约。实现了资产通行证的铸造、转让、元数据管理和状态控制。
 * 通行证以类 ERC721 NFT 的形式存在，每个通行证绑定一个唯一的资产指纹。
 */
contract AssetPassport is IAssetPassport {
    // --- 错误定义 ---
    error NotOwner(); // 仅所有者可调用
    error Unauthorized(); // 未授权的操作
    error ZeroAddress(); // 不允许零地址
    error UnknownPassport(); // 通行证不存在
    error AlreadyMinted(); // 资产指纹已被铸造
    error EmptyAssetFingerprint(); // 资产指纹不能为空
    error InitialHolderMismatch(); // 初始持有者不匹配
    error NonTransferableStatus(); // 当前状态下不可转让
    error InvalidStatus(); // 无效的状态变更
    error ApprovalToCurrentOwner(); // 不能授权给当前所有者
    error ApproveCallerNotOwnerNorOperator(); // 调用者无权授权
    error InvalidTransferFrom(); // 无效的转账来源
    error UnsafeRecipient(); // 接收者合约未实现 IERC721Receiver
    error IndexOutOfBounds(); // 索引越界

    // --- 事件定义 ---
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    // --- 状态变量 ---
    string public name; // 代币名称
    string public symbol; // 代币符号

    address public owner; // 合约所有者（管理权限）
    address public override authority; // 权限管理合约地址
    address public override chronicle; // 存证记录合约地址

    uint256 public totalSupply; // 总供应量
    uint256 private _nextPassportId = 1; // 下一个可用的通行证 ID

    mapping(uint256 passportId => address holder) private _owners; // ID 到持有者的映射
    mapping(address holder => uint256 balance) private _balances; // 持有者余额映射
    mapping(uint256 passportId => address approved) private _tokenApprovals; // 代币授权映射
    mapping(address holder => mapping(address operator => bool approved))
        private _operatorApprovals; // 操作员批量授权映射
    
    mapping(uint256 passportId => PassportTypes.PassportRecord record) private _passportRecords; // 通行证详细记录
    mapping(bytes32 assetFingerprint => uint256 passportId) private _passportIdByFingerprint; // 资产指纹到 ID 的映射
    
    mapping(address factory => bool enabled) private _factories; // 已授权的工厂合约映射
    mapping(address factory => uint256 indexPlusOne) private _factoryIndexPlusOne; // 工厂在列表中的索引（加1）
    address[] private _factoryList; // 已授权工厂列表

    // --- 修饰符 ---
    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    /**
     * @dev 构造函数
     * @param initialOwner 合约初始所有者
     * @param name_ 代币名称
     * @param symbol_ 代币符号
     */
    constructor(address initialOwner, string memory name_, string memory symbol_) {
        if (initialOwner == address(0)) revert ZeroAddress();

        owner = initialOwner;
        name = name_;
        symbol = symbol_;

        emit OwnershipTransferred(address(0), initialOwner);
    }

    /**
     * @dev 转移合约所有权
     * @param newOwner 新所有者地址
     */
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();

        address previousOwner = owner;
        owner = newOwner;

        emit OwnershipTransferred(previousOwner, newOwner);
    }

    /**
     * @dev 铸造新的资产通行证
     * @param to 接收者地址
     * @param initData 初始数据（指纹、元数据等）
     * @return passportId 新铸造的通行证 ID
     */
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
        
        // 初始化通行证记录
        _passportRecords[passportId] = PassportTypes.PassportRecord({
            passportId: passportId,
            assetFingerprint: initData.assetFingerprint,
            subjectAccount: address(0), // 初始为空，后续可绑定 TBA
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

    /**
     * @dev 为通行证绑定主体账户（如 ERC6551 代币绑定账户）
     * @param passportId 通行证 ID
     * @param subjectAccount 主体账户地址
     */
    function setSubjectAccount(uint256 passportId, address subjectAccount) external override {
        PassportTypes.PassportRecord storage record = _requirePassportRecord(passportId);
        if (!_canManageInfrastructure(msg.sender)) revert Unauthorized();

        record.subjectAccount = subjectAccount;
        emit SubjectAccountBound(passportId, subjectAccount);
    }

    /**
     * @dev 更新通行证元数据
     * @param passportId 通行证 ID
     * @param passportMetadataCID 通行证本身元数据哈希
     * @param assetMetadataCID 关联资产元数据哈希
     */
    function updatePassportMetadata(
        uint256 passportId,
        string calldata passportMetadataCID,
        string calldata assetMetadataCID
    ) external override {
        PassportTypes.PassportRecord storage record = _requirePassportRecord(passportId);
        // 仅限持有者、授权操作员或合约管理员更新
        if (!_isApprovedOrOwner(msg.sender, passportId) && msg.sender != owner) {
            revert Unauthorized();
        }

        record.passportMetadataCID = passportMetadataCID;
        record.assetMetadataCID = assetMetadataCID;

        emit PassportMetadataUpdated(passportId, passportMetadataCID, assetMetadataCID);
    }

    /**
     * @dev 更新通行证状态
     * @param passportId 通行证 ID
     * @param newStatus 新状态（Active, Inactive, Revoked, etc.）
     */
    function setPassportStatus(
        uint256 passportId,
        PassportTypes.PassportStatus newStatus
    ) external override {
        PassportTypes.PassportRecord storage record = _requirePassportRecord(passportId);
        // 仅限管理员或授权合约（如 Authority）更新状态
        if (msg.sender != owner && msg.sender != authority) revert Unauthorized();
        if (newStatus == PassportTypes.PassportStatus.Uninitialized) revert InvalidStatus();

        PassportTypes.PassportStatus previousStatus = record.status;
        record.status = newStatus;

        emit PassportStatusUpdated(passportId, previousStatus, newStatus);
    }

    /**
     * @dev 设置权限管理合约地址
     */
    function setAuthority(address authority_) external override onlyOwner {
        if (authority_ == address(0)) revert ZeroAddress();

        authority = authority_;
        emit AuthorityUpdated(authority_);
    }

    /**
     * @dev 设置存证记录合约地址
     */
    function setChronicle(address chronicle_) external override onlyOwner {
        if (chronicle_ == address(0)) revert ZeroAddress();

        chronicle = chronicle_;
        emit ChronicleUpdated(chronicle_);
    }

    /**
     * @dev 授权或撤销工厂合约的铸造权限
     * @param factory_ 工厂合约地址
     * @param enabled 是否授权
     */
    function setFactory(address factory_, bool enabled) external override onlyOwner {
        if (factory_ == address(0)) revert ZeroAddress();

        bool current = _factories[factory_];
        if (current == enabled) {
            emit FactoryAuthorizationUpdated(factory_, enabled);
            return;
        }

        _factories[factory_] = enabled;

        // 维护工厂列表
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

    /**
     * @dev 检查通行证是否存在
     */
    function exists(uint256 passportId) external view override returns (bool) {
        return _owners[passportId] != address(0);
    }

    /**
     * @dev 获取通行证完整记录
     */
    function recordOf(
        uint256 passportId
    ) external view override returns (PassportTypes.PassportRecord memory) {
        PassportTypes.PassportRecord memory record = _passportRecords[passportId];
        if (_owners[passportId] == address(0)) revert UnknownPassport();
        return record;
    }

    /**
     * @dev 获取绑定的主体账户地址
     */
    function subjectAccountOf(uint256 passportId) external view override returns (address) {
        PassportTypes.PassportRecord storage record = _requirePassportRecord(passportId);
        return record.subjectAccount;
    }

    /**
     * @dev 检查是否为授权工厂
     */
    function isFactory(address factory_) external view override returns (bool) {
        return _factories[factory_];
    }

    /**
     * @dev 获取授权工厂总数
     */
    function factoryCount() external view override returns (uint256) {
        return _factoryList.length;
    }

    /**
     * @dev 根据索引获取授权工厂地址
     */
    function factoryAt(uint256 index) external view override returns (address) {
        if (index >= _factoryList.length) revert IndexOutOfBounds();
        return _factoryList[index];
    }

    /**
     * @dev 获取账户余额（符合 ERC721 标准）
     */
    function balanceOf(address account) external view returns (uint256) {
        if (account == address(0)) revert ZeroAddress();
        return _balances[account];
    }

    /**
     * @dev 获取通行证所有者（符合 ERC721 标准）
     */
    function ownerOf(uint256 passportId) public view returns (address) {
        address holder = _owners[passportId];
        if (holder == address(0)) revert UnknownPassport();
        return holder;
    }

    /**
     * @dev 授权单个通行证给他人使用（符合 ERC721 标准）
     */
    function approve(address to, uint256 passportId) external {
        address holder = ownerOf(passportId);
        if (to == holder) revert ApprovalToCurrentOwner();
        if (msg.sender != holder && !_operatorApprovals[holder][msg.sender]) {
            revert ApproveCallerNotOwnerNorOperator();
        }

        _tokenApprovals[passportId] = to;
        emit Approval(holder, to, passportId);
    }

    /**
     * @dev 获取通行证的授权地址（符合 ERC721 标准）
     */
    function getApproved(uint256 passportId) external view returns (address) {
        if (_owners[passportId] == address(0)) revert UnknownPassport();
        return _tokenApprovals[passportId];
    }

    /**
     * @dev 批量授权/撤销操作员权限（符合 ERC721 标准）
     */
    function setApprovalForAll(address operator, bool approved) external {
        if (operator == msg.sender) revert ApprovalToCurrentOwner();

        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    /**
     * @dev 检查是否为批量授权的操作员（符合 ERC721 标准）
     */
    function isApprovedForAll(address account, address operator) external view returns (bool) {
        return _operatorApprovals[account][operator];
    }

    /**
     * @dev 转让通行证
     */
    function transferFrom(address from, address to, uint256 passportId) public {
        if (!_isApprovedOrOwner(msg.sender, passportId)) revert Unauthorized();
        if (ownerOf(passportId) != from) revert InvalidTransferFrom();
        if (to == address(0)) revert ZeroAddress();

        _requireTransferable(passportId); // 检查通行证当前状态是否允许转让
        _approve(address(0), passportId); // 清除现有授权

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[passportId] = to;

        emit Transfer(from, to, passportId);
    }

    /**
     * @dev 安全转让通行证
     */
    function safeTransferFrom(address from, address to, uint256 passportId) external {
        safeTransferFrom(from, to, passportId, "");
    }

    /**
     * @dev 安全转让通行证并附带数据
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 passportId,
        bytes memory data
    ) public {
        transferFrom(from, to, passportId);
        _checkOnERC721Received(msg.sender, from, to, passportId, data);
    }

    /**
     * @dev 获取代币 URI（指向元数据）
     */
    function tokenURI(uint256 passportId) external view returns (string memory) {
        PassportTypes.PassportRecord storage record = _requirePassportRecord(passportId);
        return record.passportMetadataCID;
    }

    /**
     * @dev 通过资产指纹反查通行证 ID
     */
    function passportIdByFingerprint(bytes32 assetFingerprint) external view returns (uint256) {
        return _passportIdByFingerprint[assetFingerprint];
    }

    // --- 内部辅助函数 ---

    /**
     * @dev 检查调用者是否有权铸造
     */
    function _canMint(address operator) private view returns (bool) {
        return _factories[operator];
    }

    /**
     * @dev 检查调用者是否有权管理系统基础设施
     */
    function _canManageInfrastructure(address operator) private view returns (bool) {
        return operator == owner || _factories[operator];
    }

    /**
     * @dev 内部检查权限：持有者、授权地址或操作员
     */
    function _isApprovedOrOwner(address operator, uint256 passportId) private view returns (bool) {
        address holder = ownerOf(passportId);
        return (operator == holder ||
            _tokenApprovals[passportId] == operator ||
            _operatorApprovals[holder][operator]);
    }

    /**
     * @dev 内部授权方法
     */
    function _approve(address to, uint256 passportId) private {
        _tokenApprovals[passportId] = to;
        emit Approval(ownerOf(passportId), to, passportId);
    }

    /**
     * @dev 检查接收地址是否能安全接收 NFT
     */
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

    /**
     * @dev 获取存储中的记录引用，若不存在则报错
     */
    function _requirePassportRecord(
        uint256 passportId
    ) private view returns (PassportTypes.PassportRecord storage record) {
        if (_owners[passportId] == address(0)) revert UnknownPassport();
        return _passportRecords[passportId];
    }

    /**
     * @dev 检查通行证当前是否可转让
     */
    function _requireTransferable(uint256 passportId) private view {
        PassportTypes.PassportStatus status = _passportRecords[passportId].status;
        // 仅 Active 状态支持转让，其他状态（如 Revoked, Suspended, TransferredToNewChain）禁止转让
        if (status != PassportTypes.PassportStatus.Active) revert NonTransferableStatus();
    }
}
