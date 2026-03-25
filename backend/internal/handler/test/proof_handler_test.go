package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/Pupervemon/ChainVerify/internal/config"
	"github.com/Pupervemon/ChainVerify/internal/models"
	"github.com/Pupervemon/ChainVerify/internal/repository"
	"github.com/Pupervemon/ChainVerify/internal/service"
	"github.com/gin-gonic/gin"
)

type proofDetailResponse struct {
	Code    int           `json:"code"`
	Message string        `json:"message"`
	Data    *models.Proof `json:"data"`
	Error   string        `json:"error"`
}

func TestGetProofAcceptsLegacyHashPathAndReturnsCanonicalHash(t *testing.T) {
	t.Parallel()

	gin.SetMode(gin.TestMode)

	repo := repository.NewMemoryProofRepository()
	proofService := service.NewProofService(repo)
	if err := repo.Save(context.Background(), &models.Proof{
		ID:             1,
		WalletAddress:  "0xabc",
		FileHash:       "abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
		FileName:       "report.pdf",
		FileSize:       123,
		ContentType:    "application/pdf",
		CID:            "QmTest",
		ProofCreatedAt: time.Unix(1700000000, 0),
	}); err != nil {
		t.Fatalf("repo.Save returned error: %v", err)
	}

	h := NewHandler(config.Config{}, nil, proofService)
	router := gin.New()
	router.GET("/proofs/:file_hash", h.GetProof)

	req := httptest.NewRequest(http.MethodGet, "/proofs/abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusOK)
	}

	var resp proofDetailResponse
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("json.Unmarshal returned error: %v", err)
	}

	if resp.Data == nil {
		t.Fatal("expected proof in response")
	}

	const wantHash = "0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789"
	if resp.Data.FileHash != wantHash {
		t.Fatalf("file_hash = %q, want %q", resp.Data.FileHash, wantHash)
	}
}

func TestGetProofRejectsInvalidHash(t *testing.T) {
	t.Parallel()

	gin.SetMode(gin.TestMode)

	h := NewHandler(config.Config{}, nil, service.NewProofService(repository.NewMemoryProofRepository()))
	router := gin.New()
	router.GET("/proofs/:file_hash", h.GetProof)

	req := httptest.NewRequest(http.MethodGet, "/proofs/not-a-hash", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusBadRequest)
	}
}
