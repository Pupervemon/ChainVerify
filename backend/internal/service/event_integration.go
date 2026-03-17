package service

import (
	"context"
	"log"
	"strings"
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
	// 标准化文件哈希：去除可能存在的 0x 前缀，统一转为小写
	fileHash := strings.ToLower(strings.TrimPrefix(event.FileHash.Hex(), "0x"))
	wallet := strings.ToLower(event.WalletAddress.Hex())
	
	log.Printf("Processing ProofCreated Event - FileHash: %s, Wallet: %s, TxHash: %s\n", 
		fileHash, wallet, event.Raw.TxHash.Hex())

	// 1. 尝试从数据库获取现有记录 (通过上传接口已创建的记录)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	existingProof, err := s.proofService.GetProof(ctx, fileHash)
	
	if err == nil && existingProof != nil {
		// 场景 A：文件已由上传接口存入数据库，现在监听到链上存证完成
		// 更新链上相关字段
		existingProof.CID = event.Cid
		existingProof.WalletAddress = wallet
		existingProof.TxHash = event.Raw.TxHash.Hex()
		existingProof.BlockNumber = event.Raw.BlockNumber
		existingProof.ProofCreatedAt = time.Unix(event.Timestamp.Int64(), 0)

		err = s.proofService.SaveProof(ctx, existingProof)
		if err != nil {
			log.Printf("Failed to update proof with on-chain info: %v\n", err)
			return
		}
		log.Printf("Successfully synchronized on-chain data for FileHash: %s\n", fileHash)

	} else {
		// 场景 B：数据库中没有记录（可能是用户直接通过合约调用，或上传接口未成功保存）
		// 创建一条新的存证记录
		newProof := &models.Proof{
			WalletAddress:  wallet,
			FileHash:       fileHash,
			FileName:       "Unknown (From Chain)", // 链上不存文件名，标记为未知
			CID:            event.Cid,
			TxHash:         event.Raw.TxHash.Hex(),
			BlockNumber:    event.Raw.BlockNumber,
			ProofCreatedAt: time.Unix(event.Timestamp.Int64(), 0),
		}

		err = s.proofService.SaveProof(ctx, newProof)
		if err != nil {
			log.Printf("Failed to save new chain event proof: %v\n", err)
			return
		}
		log.Printf("Successfully created new proof from chain event - FileHash: %s\n", fileHash)
	}
}
