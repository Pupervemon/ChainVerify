// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ProofStore
 * @dev 针对 Go Indexer 架构优化的 Web3 原生存证合约。
 * 核心原则：链上只存共识必须的最小数据，业务描述数据全部打入 Event 供链下索引。
 */
contract ProofStore {
    // 限制 CID 最大长度，防止恶意构造超长字符串消耗节点资源
    uint256 private constant MAX_CID_LENGTH = 128;

    // 1. 极简的链上状态存储结构
    struct Proof {
        address owner; // 确权人
        string cid; // IPFS 源文件链接
        uint256 timestamp; // 区块链共识时间戳
    }

    // 2. 核心映射：使用 bytes32 代替 string 存储哈希，极大节省 Gas
    mapping(bytes32 => Proof) public proofs;

    // 全局存证总数计数器
    uint256 public totalProofs;

    // 3. 核心日志 (Event)：承载所有前端传来的业务数据，供 Go 后端监听
    event ProofCreated(
        bytes32 indexed fileHash, // indexed: 允许后端按 Hash 快速过滤检索
        address indexed owner, // indexed: 允许后端按地址快速过滤检索
        string cid,
        uint256 timestamp,
        string fileName,
        uint256 fileSize,
        string contentType
    );

    /**
     * @dev 存入凭证
     */
    function storeProof(
        bytes32 _fileHash, // 注意：前端算出的 SHA-256 原生就是 32 字节
        string memory _cid,
        string memory _fileName,
        uint256 _fileSize,
        string memory _contentType
    ) public {
        // 校验：CID 不能为空且不能超长
        bytes memory cidBytes = bytes(_cid);
        require(
            cidBytes.length > 0 && cidBytes.length <= MAX_CID_LENGTH,
            "ProofStore: Invalid CID"
        );

        // 校验：防重复存证
        require(
            proofs[_fileHash].timestamp == 0,
            "ProofStore: File hash already exists"
        );

        proofs[_fileHash] = Proof({
            owner: msg.sender,
            cid: _cid,
            timestamp: block.timestamp
        });

        totalProofs++;

        emit ProofCreated(
            _fileHash,
            msg.sender,
            _cid,
            block.timestamp,
            _fileName,
            _fileSize,
            _contentType
        );
    }

    function getProof(
        bytes32 _fileHash
    )
        public
        view
        returns (address owner, string memory cid, uint256 timestamp)
    {
        Proof memory proof = proofs[_fileHash];
        require(proof.timestamp != 0, "ProofStore: Proof not found");
        return (proof.owner, proof.cid, proof.timestamp);
    }

    function isProofExists(bytes32 _fileHash) public view returns (bool) {
        return proofs[_fileHash].timestamp != 0;
    }
}
