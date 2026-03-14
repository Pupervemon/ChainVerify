// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ProofStore
 * @dev 链上存证智能合约，用于将文件哈希和 IPFS CID 绑定并持久化记录在区块链上。
 */
contract ProofStore {

    // 存证数据结构体
    struct Proof {
        address walletAddress;  // 存证者的钱包地址
        string fileHash;        // 文件的哈希值（如 SHA-256）
        string fileName;        // 文件名称 
        uint256 fileSize;       // 文件大小（字节数）
        string contentType;     // 文件的 MIME 类型
        string cid;             // 存在 IPFS / 去中心化存储网络的 CID
        uint256 timestamp;      // 区块上的存证创建时间
    }

    // 存储文件哈希到存证详情的映射 (文件哈希全网唯一)
    mapping(string => Proof) private proofs;
    
    // 记录用户拥有存证的哈希列表，便于链上遍历查询
    mapping(address => string[]) private userProofs;

    // 记录平台总存证数
    uint256 public totalProofs;

    // 存证创建事件 (便于链下 Indexer / 后端去同步和抓取)
    event ProofCreated(
        address indexed walletAddress,
        string indexed fileHash,
        string cid,
        uint256 timestamp
    );

    /**
     * @dev 存储新的文件存证记录
     * @param _fileHash    文件哈希 (建议前端计算好后传入)
     * @param _fileName    文件名称
     * @param _fileSize    文件大小
     * @param _contentType MIME 类型
     * @param _cid         IPFS 上传后得到的 CID
     */
    function storeProof(
        string memory _fileHash,
        string memory _fileName,
        uint256 _fileSize,
        string memory _contentType,
        string memory _cid
    ) public {
        // 1. 参数校验
        require(bytes(_fileHash).length > 0, "ProofStore: fileHash cannot be empty");
        require(bytes(_cid).length > 0, "ProofStore: cid cannot be empty");
        require(bytes(proofs[_fileHash].fileHash).length == 0, "ProofStore: file hash already exists");

        // 2. 组装数据并存储
        Proof memory newProof = Proof({
            walletAddress: msg.sender,
            fileHash: _fileHash,
            fileName: _fileName,
            fileSize: _fileSize,
            contentType: _contentType,
            cid: _cid,
            timestamp: block.timestamp
        });

        // 保存映射
        proofs[_fileHash] = newProof;
        // 保存用户持有的存证列表
        userProofs[msg.sender].push(_fileHash);
        // 增加总量
        totalProofs++;

        // 3. 抛出事件以供后端检索入库
        emit ProofCreated(msg.sender, _fileHash, _cid, block.timestamp);
    }

    /**
     * @dev 根据文件哈希查询单条存证记录详情
     * @param _fileHash 文件哈希
     * @return Proof 对应哈希的存证详情结构信息
     */
    function getProof(string memory _fileHash) public view returns (Proof memory) {
        require(bytes(proofs[_fileHash].fileHash).length > 0, "ProofStore: proof not found");
        return proofs[_fileHash];
    }

    /**
     * @dev 查询特定用户的存证哈希列表
     * @param _user 用户钱包地址
     * @return string[] 用户所存证的文件哈希集合
     */
    function getUserProofs(address _user) public view returns (string[] memory) {
        return userProofs[_user];
    }

    /**
     * @dev 验证给定的文件是否由当前账号存证，并且并未被篡改 (匹配 CID)
     * @param _fileHash 文件哈希
     * @param _cid 要对比的 CID
     * @return bool 验证成功与否
     */
    function verifyProof(string memory _fileHash, string memory _cid) public view returns (bool) {
        if (bytes(proofs[_fileHash].fileHash).length == 0) {
            return false;
        }
        
        // 关键在于对比保存的 cid 与 用户期望的 cid 是否吻合
        return keccak256(bytes(proofs[_fileHash].cid)) == keccak256(bytes(_cid));
    }
}
