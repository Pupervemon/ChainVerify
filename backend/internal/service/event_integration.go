package service

import (
	"context"
	"errors"
	"log"
	"strings"
	"time"

	"github.com/Pupervemon/ChainVerify/internal/models"
	"github.com/Pupervemon/ChainVerify/internal/repository"
	"github.com/Pupervemon/ChainVerify/pkg/contracts/proofstore"
	"github.com/Pupervemon/ChainVerify/pkg/eth"
	"github.com/Pupervemon/ChainVerify/pkg/hashutil"
	"github.com/ethereum/go-ethereum/common"
)

// EventIntegrationService 负责连接以太坊事件监听和本地数据库服务
type EventIntegrationService struct {
	listener     *eth.EventListener
	proofService *ProofService
}

// NewEventIntegrationService 创建新的事件集成服务
func NewEventIntegrationService(listener *eth.EventListener, proofService *ProofService) *EventIntegrationService {
	return &EventIntegrationService{
		listener:     listener,
		proofService: proofService,
	}
}

// Start 启动事件处理
func (s *EventIntegrationService) Start(ctx context.Context) {
	log.Println("Starting EventIntegrationService...")

	go func() {
		err := s.listener.ListenProofCreated(ctx, s.handleProofCreated)
		if err != nil && err != context.Canceled {
			log.Printf("Error in EventListener: %v\n", err)
		} else {
			log.Println("EventIntegrationService stopped gracefully.")
		}
	}()
}

// handleProofCreated 处理 ProofCreated 事件
func (s *EventIntegrationService) handleProofCreated(event *proofstore.ProofStoreProofCreated) {
	//  1：精准提取 bytes32 indexed 的 FileHash
	// event.FileHash 现在是 [32]byte，我们用 common.Hash 包装它，转为 Hex 字符串并去掉 "0x"
	fileHashHex := common.Hash(event.FileHash).Hex()
	fileHash := strings.ToLower(strings.TrimPrefix(fileHashHex, "0x"))

	// 从 Event 中直接获取 Owner (原 WalletAddress)
	wallet := strings.ToLower(event.Owner.Hex())

	log.Printf(" Processing ProofCreated Event - FileHash: %s, Wallet: %s, TxHash: %s\n",
		fileHash, wallet, event.Raw.TxHash.Hex())

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// 规范化 Hash (统一格式，防止数据库出现重复的变体)
	normalizedHash, err := hashutil.NormalizeSHA256Hex(fileHash)
	if err != nil {
		log.Printf(" Failed to normalize file hash from event: %v\n", err)
		return
	}

	//  2：直接删除了 s.listener.GetProof(ctx, normalizedHash)
	// 校验文件大小转换
	if !event.FileSize.IsInt64() {
		log.Printf(" On-chain file size exceeds int64 range for hash=%s\n", normalizedHash)
		return
	}
	fileSize := event.FileSize.Int64()

	// 获取当前连接的网络 ChainID
	chainID, err := s.listener.ChainID(ctx)
	if err != nil {
		log.Printf(" Failed to fetch chain id: %v\n", err)
		chainID = ""
	}

	//  3：直接使用 event 对象组装数据库 Model
	proof := &models.Proof{
		WalletAddress:   wallet,
		FileHash:        normalizedHash,
		FileName:        event.FileName,    // 从事件中读取明文
		FileSize:        fileSize,          // 从事件中读取
		ContentType:     event.ContentType, // 从事件中读取
		CID:             event.Cid,         // 从事件中读取
		TxHash:          event.Raw.TxHash.Hex(),
		BlockNumber:     event.Raw.BlockNumber,
		ChainID:         chainID,
		ContractAddress: s.listener.ContractAddressHex(),
		ProofCreatedAt:  time.Unix(event.Timestamp.Int64(), 0), // 从事件中读取区块时间
	}

	// 检查数据库中是否已经存在该 Hash 的记录
	existingProof, err := s.proofService.GetProof(ctx, normalizedHash)
	if err == nil && existingProof != nil {
		// 如果已存在（可能是重试机制导致的重复监听到），更新其 ID 执行覆写或跳过
		proof.ID = existingProof.ID
	} else if err != nil && !errors.Is(err, repository.ErrProofNotFound) {
		log.Printf(" Failed to query existing proof for hash=%s: %v\n", normalizedHash, err)
		return
	}

	// 落库：将组装好的完整数据写入 MySQL
	if err := s.proofService.SaveProof(ctx, proof); err != nil {
		log.Printf(" Failed to persist on-chain proof for hash=%s: %v\n", normalizedHash, err)
		return
	}

	log.Printf(" Successfully synchronized on-chain proof for hash=%s\n", normalizedHash)
}
