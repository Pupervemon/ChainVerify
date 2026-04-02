package repository

import (
	"context"
	"errors"
	"sort"
	"strings"
	"time"

	"github.com/Pupervemon/ChainVerify/internal/models"
	"github.com/Pupervemon/ChainVerify/pkg/hashutil"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// ErrProofNotFound indicates that no proof exists for the requested hash.
var ErrProofNotFound = errors.New("proof not found")

// ProofRepository defines proof persistence behaviour.
type ProofRepository interface {
	ListByWallet(context.Context, string, int, int) ([]models.Proof, int64, error)
	GetByFileHash(context.Context, string) (*models.Proof, error)
	Save(context.Context, *models.Proof) error
	GetStats(context.Context) (models.ProofStats, error)
}

// GormProofRepository is the GORM-backed proof repository implementation.
type GormProofRepository struct {
	db *gorm.DB
}

// NewGormProofRepository creates a GORM-backed proof repository.
func NewGormProofRepository(db *gorm.DB) *GormProofRepository {
	return &GormProofRepository{db: db}
}

// ListByWallet returns proofs for the given wallet.
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

// GetByFileHash returns a proof by canonical or legacy hash format.
func (r *GormProofRepository) GetByFileHash(ctx context.Context, fileHash string) (*models.Proof, error) {
	variants, err := hashutil.LookupSHA256HexVariants(fileHash)
	if err != nil {
		return nil, err
	}

	var proof models.Proof
	if err := r.db.WithContext(ctx).
		Where("file_hash IN ?", variants).
		Order("proof_created_at DESC").
		First(&proof).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrProofNotFound
		}
		return nil, err
	}

	return &proof, nil
}

// Save creates or updates a proof record.
func (r *GormProofRepository) Save(ctx context.Context, proof *models.Proof) error {
	if proof.ID != 0 {
		return r.db.WithContext(ctx).Save(proof).Error
	}

	return r.db.WithContext(ctx).Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "file_hash"}},
		UpdateAll: true,
	}).Create(proof).Error
}

// GetStats returns aggregate proof statistics.
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

// MemoryProofRepository is the in-memory fallback repository.
type MemoryProofRepository struct {
	proofs []models.Proof
}

// NewMemoryProofRepository creates an in-memory proof repository.
func NewMemoryProofRepository() *MemoryProofRepository {
	return &MemoryProofRepository{proofs: []models.Proof{}}
}

// ListByWallet returns proofs for the given wallet from memory.
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

// GetByFileHash returns a proof by hash from memory.
func (r *MemoryProofRepository) GetByFileHash(_ context.Context, fileHash string) (*models.Proof, error) {
	variants, err := hashutil.LookupSHA256HexVariants(fileHash)
	if err != nil {
		return nil, err
	}

	for _, proof := range r.proofs {
		for _, variant := range variants {
			if strings.EqualFold(proof.FileHash, variant) {
				copyProof := proof
				return &copyProof, nil
			}
		}
	}

	return nil, ErrProofNotFound
}

// Save stores or updates a proof in memory.
func (r *MemoryProofRepository) Save(_ context.Context, proof *models.Proof) error {
	if proof.ID != 0 {
		for i, existing := range r.proofs {
			if existing.ID == proof.ID {
				r.proofs[i] = *proof
				return nil
			}
		}
	}

	for i, existing := range r.proofs {
		existingHash, existingErr := hashutil.NormalizeSHA256Hex(existing.FileHash)
		incomingHash, incomingErr := hashutil.NormalizeSHA256Hex(proof.FileHash)
		if existingErr == nil && incomingErr == nil && existingHash == incomingHash {
			if proof.ID == 0 {
				proof.ID = existing.ID
			}
			r.proofs[i] = *proof
			return nil
		}
	}

	if proof.ID == 0 {
		proof.ID = uint(len(r.proofs) + 1)
	}

	r.proofs = append(r.proofs, *proof)
	return nil
}

// GetStats returns aggregate proof statistics from memory.
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
