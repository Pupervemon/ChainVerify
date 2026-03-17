package repository

import (
	"context"
	"errors"
	"sort"
	"strings"
	"time"

	"github.com/Pupervemon/ChainVerify/internal/models"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// ErrProofNotFound 存证记录未找到错误
var ErrProofNotFound = errors.New("proof not found")

// ProofRepository 存证仓库接口
type ProofRepository interface {
	ListByWallet(context.Context, string, int, int) ([]models.Proof, int64, error)
	GetByFileHash(context.Context, string) (*models.Proof, error)
	Save(context.Context, *models.Proof) error
	GetStats(context.Context) (models.ProofStats, error)
}

// GormProofRepository 基于 GORM 的 MySQL 存证仓库实现
type GormProofRepository struct {
	db *gorm.DB
}

// NewGormProofRepository 创建新的 GORM 仓库实例
func NewGormProofRepository(db *gorm.DB) *GormProofRepository {
	return &GormProofRepository{db: db}
}

// ListByWallet 根据钱包地址列出存证记录
func (r *GormProofRepository) ListByWallet(ctx context.Context, wallet string, page int, pageSize int) ([]models.Proof, int64, error) {
	var proofs []models.Proof
	var total int64

	query := r.db.WithContext(ctx).Model(&models.Proof{})
	if wallet != "" {
		query = query.Where("wallet_address = ?", wallet)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := query.Order("proof_created_at DESC").Offset((page - 1) * pageSize).Limit(pageSize).Find(&proofs).Error; err != nil {
		return nil, 0, err
	}

	return proofs, total, nil
}

// GetByFileHash 根据文件哈希获取存证记录
func (r *GormProofRepository) GetByFileHash(ctx context.Context, fileHash string) (*models.Proof, error) {
	var proof models.Proof
	if err := r.db.WithContext(ctx).Where("file_hash = ?", fileHash).First(&proof).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrProofNotFound
		}
		return nil, err
	}

	return &proof, nil
}

// Save 保存或更新存证记录 (支持 Upsert)
func (r *GormProofRepository) Save(ctx context.Context, proof *models.Proof) error {
	// 使用 GORM 的 OnConflict 功能来处理并发写入或重复事件
	// 如果 file_hash 冲突，则更新所有字段
	return r.db.WithContext(ctx).Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "file_hash"}},
		UpdateAll: true,
	}).Create(proof).Error
}

// GetStats 获取存证统计信息
func (r *GormProofRepository) GetStats(ctx context.Context) (models.ProofStats, error) {
	stats := models.ProofStats{DatabaseEnabled: true}

	if err := r.db.WithContext(ctx).Model(&models.Proof{}).Count(&stats.TotalProofs).Error; err != nil {
		return stats, err
	}

	if err := r.db.WithContext(ctx).Model(&models.Proof{}).Distinct("wallet_address").Count(&stats.TotalUsers).Error; err != nil {
		return stats, err
	}

	row := r.db.WithContext(ctx).Model(&models.Proof{}).Select("COALESCE(SUM(file_size), 0), MAX(proof_created_at)").Row()
	if err := row.Scan(&stats.TotalStorage, &stats.LatestProofAt); err != nil {
		return stats, err
	}

	return stats, nil
}

// MemoryProofRepository 基于内存的存证仓库实现（回退方案）
type MemoryProofRepository struct {
	proofs []models.Proof
}

// NewMemoryProofRepository 创建新的内存仓库实例
func NewMemoryProofRepository() *MemoryProofRepository {
	return &MemoryProofRepository{proofs: []models.Proof{}}
}

// ListByWallet 内存实现：根据钱包地址列出存证记录
func (r *MemoryProofRepository) ListByWallet(_ context.Context, wallet string, page int, pageSize int) ([]models.Proof, int64, error) {
	filtered := make([]models.Proof, 0, len(r.proofs))
	for _, proof := range r.proofs {
		if wallet == "" || strings.EqualFold(proof.WalletAddress, wallet) {
			filtered = append(filtered, proof)
		}
	}

	sort.Slice(filtered, func(i, j int) bool {
		return filtered[i].ProofCreatedAt.After(filtered[j].ProofCreatedAt)
	})

	total := int64(len(filtered))
	start := (page - 1) * pageSize
	if start >= len(filtered) {
		return []models.Proof{}, total, nil
	}

	end := start + pageSize
	if end > len(filtered) {
		end = len(filtered)
	}

	return filtered[start:end], total, nil
}

// GetByFileHash 内存实现：根据文件哈希获取存证记录
func (r *MemoryProofRepository) GetByFileHash(_ context.Context, fileHash string) (*models.Proof, error) {
	for _, proof := range r.proofs {
		if strings.EqualFold(proof.FileHash, fileHash) {
			copyProof := proof
			return &copyProof, nil
		}
	}

	return nil, ErrProofNotFound
}

// Save 内存实现：保存或更新存证记录
func (r *MemoryProofRepository) Save(_ context.Context, proof *models.Proof) error {
	for i, p := range r.proofs {
		if strings.EqualFold(p.FileHash, proof.FileHash) {
			r.proofs[i] = *proof
			return nil
		}
	}
	r.proofs = append(r.proofs, *proof)
	return nil
}

// GetStats 内存实现：获取存证统计信息
func (r *MemoryProofRepository) GetStats(_ context.Context) (models.ProofStats, error) {
	stats := models.ProofStats{DatabaseEnabled: false}
	uniqueWallets := make(map[string]struct{})
	var latest time.Time

	for _, proof := range r.proofs {
		stats.TotalProofs++
		stats.TotalStorage += proof.FileSize
		uniqueWallets[strings.ToLower(proof.WalletAddress)] = struct{}{}
		if proof.ProofCreatedAt.After(latest) {
			latest = proof.ProofCreatedAt
		}
	}

	stats.TotalUsers = int64(len(uniqueWallets))
	if !latest.IsZero() {
		stats.LatestProofAt = &latest
	}

	return stats, nil
}
