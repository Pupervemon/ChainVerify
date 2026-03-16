package service

import (
	"context"

	"github.com/Pupervemon/ChainVerify/internal/models"
	"github.com/Pupervemon/ChainVerify/internal/repository"
)

// ProofService 存证业务服务
type ProofService struct {
	repo repository.ProofRepository
}

// NewProofService 创建新的存证服务实例
func NewProofService(repo repository.ProofRepository) *ProofService {
	return &ProofService{repo: repo}
}

// ListProofs 获取存证记录列表
func (s *ProofService) ListProofs(ctx context.Context, wallet string, page int, pageSize int) ([]models.Proof, int64, error) {
	return s.repo.ListByWallet(ctx, wallet, page, pageSize)
}

// GetProof 根据哈希获取单个存证记录
func (s *ProofService) GetProof(ctx context.Context, fileHash string) (*models.Proof, error) {
	return s.repo.GetByFileHash(ctx, fileHash)
}

// GetStats 获取存证统计信息
func (s *ProofService) GetStats(ctx context.Context) (models.ProofStats, error) {
	return s.repo.GetStats(ctx)
}

// SaveProof 保存存证记录
func (s *ProofService) SaveProof(ctx context.Context, proof *models.Proof) error {
	return s.repo.Save(ctx, proof)
}
