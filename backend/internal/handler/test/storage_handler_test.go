package handler

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"mime/multipart"
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

type uploadResponse struct {
	Code    int                   `json:"code"`
	Message string                `json:"message"`
	Data    *service.UploadResult `json:"data"`
	Error   string                `json:"error"`
}

func setupUploadHandlerTest(t *testing.T) (*gin.Engine, *repository.MemoryProofRepository) {
	t.Helper()

	gin.SetMode(gin.TestMode)

	repo := repository.NewMemoryProofRepository()
	proofService := service.NewProofService(repo)
	pinataService := service.NewPinataService(config.Config{
		PinataJWT: "test-jwt",
	})

	h := NewHandler(config.Config{}, pinataService, proofService)
	router := gin.New()
	router.POST("/api/v1/store/upload", h.UploadToIPFS)

	return router, repo
}

func TestUploadToIPFSDuplicateCheck(t *testing.T) {
	t.Parallel()

	router, repo := setupUploadHandlerTest(t)
	if err := repo.Save(context.Background(), &models.Proof{
		ID:             1,
		FileHash:       "0xb94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
		CID:            "QmExisting",
		FileName:       "hello.txt",
		FileSize:       int64(len("hello world")),
		WalletAddress:  "0xd4b5996d0f659e1e2798cc1a3693b9730fe56fb4",
		ProofCreatedAt: time.Unix(1700000000, 0),
	}); err != nil {
		t.Fatalf("repo.Save returned error: %v", err)
	}

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("file", "hello.txt")
	if err != nil {
		t.Fatalf("CreateFormFile returned error: %v", err)
	}
	if _, err := part.Write([]byte("hello world")); err != nil {
		t.Fatalf("part.Write returned error: %v", err)
	}
	if err := writer.Close(); err != nil {
		t.Fatalf("writer.Close returned error: %v", err)
	}

	req := httptest.NewRequest(http.MethodPost, "/api/v1/store/upload", body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusBadRequest)
	}
}

func TestUploadToIPFSMissingFile(t *testing.T) {
	t.Parallel()

	router, _ := setupUploadHandlerTest(t)

	req := httptest.NewRequest(http.MethodPost, "/api/v1/store/upload", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusBadRequest)
	}
}

func TestUploadToIPFSReturnsCanonicalFileHash(t *testing.T) {
	t.Parallel()

	gin.SetMode(gin.TestMode)

	pinataServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			t.Fatalf("method = %s, want %s", r.Method, http.MethodPost)
		}
		if _, err := io.ReadAll(r.Body); err != nil {
			t.Fatalf("failed to read request body: %v", err)
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"IpfsHash":"QmCanonicalHash"}`))
	}))
	defer pinataServer.Close()

	pinataService := service.NewPinataService(config.Config{
		PinataJWT:       "test-jwt",
		PinataUploadURL: pinataServer.URL,
	})
	proofService := service.NewProofService(repository.NewMemoryProofRepository())

	h := NewHandler(config.Config{}, pinataService, proofService)
	router := gin.New()
	router.POST("/store/upload", h.UploadToIPFS)

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("file", "hello.txt")
	if err != nil {
		t.Fatalf("CreateFormFile returned error: %v", err)
	}
	if _, err := part.Write([]byte("hello world")); err != nil {
		t.Fatalf("part.Write returned error: %v", err)
	}
	if err := writer.Close(); err != nil {
		t.Fatalf("writer.Close returned error: %v", err)
	}

	req := httptest.NewRequest(http.MethodPost, "/store/upload", body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusOK)
	}

	var resp uploadResponse
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("json.Unmarshal returned error: %v", err)
	}

	if resp.Data == nil {
		t.Fatal("expected upload result in response")
	}

	const wantHash = "0xb94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
	if resp.Data.FileHash != wantHash {
		t.Fatalf("file_hash = %q, want %q", resp.Data.FileHash, wantHash)
	}
}

func TestUploadToIPFSRejectsSameHashForDifferentWallets(t *testing.T) {
	t.Parallel()

	gin.SetMode(gin.TestMode)

	pinataServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if _, err := io.ReadAll(r.Body); err != nil {
			t.Fatalf("failed to read request body: %v", err)
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"IpfsHash":"QmDifferentWallet"}`))
	}))
	defer pinataServer.Close()

	repo := repository.NewMemoryProofRepository()
	if err := repo.Save(context.Background(), &models.Proof{
		ID:             1,
		FileHash:       "0xb94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
		CID:            "QmExisting",
		FileName:       "hello.txt",
		FileSize:       int64(len("hello world")),
		WalletAddress:  "0x1111111111111111111111111111111111111111",
		ProofCreatedAt: time.Unix(1700000000, 0),
	}); err != nil {
		t.Fatalf("repo.Save returned error: %v", err)
	}

	pinataService := service.NewPinataService(config.Config{
		PinataJWT:       "test-jwt",
		PinataUploadURL: pinataServer.URL,
	})
	proofService := service.NewProofService(repo)

	h := NewHandler(config.Config{}, pinataService, proofService)
	router := gin.New()
	router.POST("/store/upload", h.UploadToIPFS)

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("file", "hello.txt")
	if err != nil {
		t.Fatalf("CreateFormFile returned error: %v", err)
	}
	if _, err := part.Write([]byte("hello world")); err != nil {
		t.Fatalf("part.Write returned error: %v", err)
	}
	if err := writer.Close(); err != nil {
		t.Fatalf("writer.Close returned error: %v", err)
	}

	req := httptest.NewRequest(http.MethodPost, "/store/upload", body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d; body=%s", rec.Code, http.StatusBadRequest, rec.Body.String())
	}
}
