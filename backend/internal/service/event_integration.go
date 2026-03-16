package service

import (
	"context"
	"log"
	"time"

	"github.com/Pupervemon/ChainVerify/internal/models"
	"github.com/Pupervemon/ChainVerify/pkg/contracts/proofstore"
	"github.com/Pupervemon/ChainVerify/pkg/eth"
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
	log.Printf("Processing ProofCreated Event - FileHash: %s, Wallet: %s\n", event.FileHash.Hex(), event.WalletAddress.Hex())

	// 转换为数据库模型
	// 注意：智能合约传来的 fileHash 是 common.Hash 类型 (32 bytes的字节数组)，如果是用 string 存储（比如 IPFS hash 或普通 sha256 字符串），这里需要转换
	// 如果前端传入的是字符串哈希存入合约被截断，需要检查匹配逻辑。这里假设传入以太坊合约的存证记录本身 fileHash 就能匹配
	proof := &models.Proof{
		WalletAddress:  event.WalletAddress.Hex(),
		FileHash:       event.FileHash.Hex(),
		CID:            event.Cid,
		ProofCreatedAt: time.Unix(event.Timestamp.Int64(), 0),
		// 这里由于 Event 里只有极少部分字段，其他如 FileName/FileSize 可能需要前端上传时即存数据库，这里更新；
		// 或者仅存储最核⼼的链上记录。如果是后者，先尝试从库中寻找是否已有该文件记录进行更新。
	}

	// 尝试获取现有记录，补充其他字段
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	existingProof, err := s.proofService.GetProof(ctx, proof.FileHash)
	if err == nil {
		// 如果数据库中已经存在（例如前端调用 storeProof 的同时保存了部分信息），那么我们进行合并更新
		existingProof.CID = proof.CID
		existingProof.ProofCreatedAt = proof.ProofCreatedAt
		existingProof.WalletAddress = proof.WalletAddress

		err = s.proofService.SaveProof(ctx, existingProof)
		if err != nil {
			log.Printf("Failed to update existing proof in database: %v\n", err)
			return
		}
		log.Printf("Successfully updated existing proof for FileHash: %s\n", proof.FileHash)

	} else {
		// 没有找到，直接保存链上给的新记录
		err = s.proofService.SaveProof(ctx, proof)
		if err != nil {
			log.Printf("Failed to save new event proof to database: %v\n", err)
			return
		}
		log.Printf("Successfully saved new proof from chain to database - FileHash: %s\n", proof.FileHash)
	}
}
