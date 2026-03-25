package service

import (
	"context"
	"strings"

	"github.com/Pupervemon/ChainVerify/internal/models"
	"github.com/Pupervemon/ChainVerify/internal/repository"
	"github.com/Pupervemon/ChainVerify/pkg/hashutil"
)

// ProofService stores proof-related business logic.
type ProofService struct {
	repo repository.ProofRepository
}

// NewProofService creates a proof service instance.
func NewProofService(repo repository.ProofRepository) *ProofService {
	return &ProofService{repo: repo}
}

// ListProofs returns a paginated proof list for a wallet.
func (s *ProofService) ListProofs(ctx context.Context, wallet string, page int, pageSize int) ([]models.Proof, int64, error) {
	wallet = strings.ToLower(strings.TrimSpace(wallet))
	proofs, total, err := s.repo.ListByWallet(ctx, wallet, page, pageSize)
	if err != nil {
		return nil, 0, err
	}

	for i := range proofs {
		if normalized, normErr := hashutil.NormalizeSHA256Hex(proofs[i].FileHash); normErr == nil {
			proofs[i].FileHash = normalized
		}
	}

	return proofs, total, nil
}

// GetProof returns a single proof by file hash.
func (s *ProofService) GetProof(ctx context.Context, fileHash string) (*models.Proof, error) {
	normalized, err := hashutil.NormalizeSHA256Hex(fileHash)
	if err != nil {
		return nil, err
	}

	proof, err := s.repo.GetByFileHash(ctx, normalized)
	if err != nil {
		return nil, err
	}

	if canonical, normErr := hashutil.NormalizeSHA256Hex(proof.FileHash); normErr == nil {
		proof.FileHash = canonical
	}

	return proof, nil
}

// GetStats returns proof statistics.
func (s *ProofService) GetStats(ctx context.Context) (models.ProofStats, error) {
	return s.repo.GetStats(ctx)
}

// SaveProof persists a proof after normalizing its file hash.
func (s *ProofService) SaveProof(ctx context.Context, proof *models.Proof) error {
	if proof == nil {
		return nil
	}

	proof.WalletAddress = strings.ToLower(strings.TrimSpace(proof.WalletAddress))
	normalized, err := hashutil.NormalizeSHA256Hex(proof.FileHash)
	if err != nil {
		return err
	}
	proof.FileHash = normalized

	return s.repo.Save(ctx, proof)
}
