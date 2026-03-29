package handler

import (
	"bytes"
	"encoding/json"
	"io"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"sync/atomic"
	"testing"
	"time"

	"github.com/Pupervemon/ChainVerify/internal/config"
	"github.com/Pupervemon/ChainVerify/internal/models"
	"github.com/Pupervemon/ChainVerify/internal/repository"
	"github.com/Pupervemon/ChainVerify/internal/service"
	"github.com/Pupervemon/ChainVerify/pkg/hashutil"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
)

func TestUploadIPFS_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)

	var uploadCalls int32
	pinataServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		atomic.AddInt32(&uploadCalls, 1)
		require.Equal(t, http.MethodPost, r.Method)
		require.Equal(t, "Bearer test-jwt", r.Header.Get("Authorization"))

		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"IpfsHash":"QmTestCid"}`))
	}))
	defer pinataServer.Close()

	h := newTestHandler(pinataServer.URL)
	req := newUploadRequest(t, "hello.txt", []byte("hello ipfs"), `{"source":"test"}`)
	rec := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(rec)
	ctx.Request = req

	h.UploadIPFS(ctx)

	require.Equal(t, http.StatusOK, rec.Code)
	require.Equal(t, int32(1), atomic.LoadInt32(&uploadCalls))

	var resp struct {
		Code    int    `json:"code"`
		Message string `json:"message"`
		Data    struct {
			CID      string `json:"cid"`
			FileHash string `json:"file_hash"`
			FileName string `json:"file_name"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(rec.Body.Bytes(), &resp))
	require.Equal(t, http.StatusOK, resp.Code)
	require.Equal(t, "file uploaded to ipfs", resp.Message)
	require.Equal(t, "QmTestCid", resp.Data.CID)
	require.Equal(t, "hello.txt", resp.Data.FileName)
	require.NotEmpty(t, resp.Data.FileHash)
}

func TestUploadIPFS_ProofSceneRejectsDuplicate(t *testing.T) {
	gin.SetMode(gin.TestMode)
	content := []byte("hello ipfs")

	var uploadCalls int32
	pinataServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		atomic.AddInt32(&uploadCalls, 1)
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"IpfsHash":"QmShouldNotBeCalled"}`))
	}))
	defer pinataServer.Close()

	repo := repository.NewMemoryProofRepository()
	proofService := service.NewProofService(repo)
	fileHash, err := hashutil.CalculateSHA256(bytes.NewReader(content))
	require.NoError(t, err)
	err = proofService.SaveProof(t.Context(), &models.Proof{
		WalletAddress:  "0xabc",
		FileHash:       fileHash,
		FileName:       "hello.txt",
		FileSize:       int64(len(content)),
		ContentType:    "text/plain",
		CID:            "QmExisting",
		ProofCreatedAt: time.Now(),
	})
	require.NoError(t, err)

	h := &Handler{
		cfg:           config.Config{},
		pinataService: service.NewPinataService(config.Config{PinataJWT: "test-jwt", PinataUploadURL: pinataServer.URL}),
		proofService:  proofService,
	}

	req := newUploadRequest(t, "hello.txt", content, "")
	req.URL.RawQuery = "scene=proof"
	rec := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(rec)
	ctx.Request = req

	h.UploadIPFS(ctx)

	require.Equal(t, http.StatusBadRequest, rec.Code)
	require.Equal(t, int32(0), atomic.LoadInt32(&uploadCalls))

	var resp struct {
		Code    int    `json:"code"`
		Message string `json:"message"`
		Error   string `json:"error"`
	}
	require.NoError(t, json.Unmarshal(rec.Body.Bytes(), &resp))
	require.Equal(t, "file already notarized", resp.Message)
	require.Contains(t, resp.Error, "0xabc")
}

func TestUploadIPFS_ProofSceneUploadsWhenNoDuplicate(t *testing.T) {
	gin.SetMode(gin.TestMode)

	var uploadCalls int32
	pinataServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		atomic.AddInt32(&uploadCalls, 1)
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"IpfsHash":"QmProofCid"}`))
	}))
	defer pinataServer.Close()

	h := newTestHandler(pinataServer.URL)
	req := newUploadRequest(t, "proof.txt", []byte("proof-content"), "")
	req.URL.RawQuery = "scene=proof"
	rec := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(rec)
	ctx.Request = req

	h.UploadIPFS(ctx)

	require.Equal(t, http.StatusOK, rec.Code)
	require.Equal(t, int32(1), atomic.LoadInt32(&uploadCalls))
	require.Contains(t, rec.Body.String(), "QmProofCid")
}

func TestUploadIPFS_InvalidMetadata(t *testing.T) {
	gin.SetMode(gin.TestMode)

	h := newTestHandler("http://127.0.0.1/unused")
	req := newUploadRequest(t, "hello.txt", []byte("hello ipfs"), `{invalid`)
	rec := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(rec)
	ctx.Request = req

	h.UploadIPFS(ctx)

	require.Equal(t, http.StatusBadRequest, rec.Code)
	require.Contains(t, rec.Body.String(), "invalid metadata format")
}

func newTestHandler(pinataUploadURL string) *Handler {
	repo := repository.NewMemoryProofRepository()
	return &Handler{
		cfg: config.Config{},
		pinataService: service.NewPinataService(config.Config{
			PinataJWT:       "test-jwt",
			PinataUploadURL: pinataUploadURL,
		}),
		proofService: service.NewProofService(repo),
	}
}

func newUploadRequest(t *testing.T, filename string, content []byte, metadata string) *http.Request {
	t.Helper()

	var body bytes.Buffer
	writer := multipart.NewWriter(&body)

	fileWriter, err := writer.CreateFormFile("file", filename)
	require.NoError(t, err)

	_, err = io.Copy(fileWriter, bytes.NewReader(content))
	require.NoError(t, err)

	if metadata != "" {
		require.NoError(t, writer.WriteField("metadata", metadata))
	}

	require.NoError(t, writer.Close())

	req := httptest.NewRequest(http.MethodPost, "/api/v1/ipfs/upload", &body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	return req
}
