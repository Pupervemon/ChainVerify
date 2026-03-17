package handler

import (
	"bytes"
	"encoding/json"
	"io"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/Pupervemon/ChainVerify/internal/config"
	"github.com/Pupervemon/ChainVerify/internal/models"
	"github.com/Pupervemon/ChainVerify/internal/repository"
	"github.com/Pupervemon/ChainVerify/internal/service"
	"github.com/Pupervemon/ChainVerify/pkg/hashutil"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func setupTestRouter() (*gin.Engine, *Handler, *repository.MemoryProofRepository) {
	gin.SetMode(gin.TestMode)
	cfg := config.Config{
		PinataJWT: "test-jwt",
	}
	
	repo := repository.NewMemoryProofRepository()
	proofService := service.NewProofService(repo)
	pinataService := service.NewPinataService(cfg)
	
	h := NewHandler(cfg, pinataService, proofService)
	r := gin.New()
	r.POST("/api/v1/store/upload", h.UploadToIPFS)
	
	return r, h, repo
}

func TestUploadToIPFS_DuplicateCheck(t *testing.T) {
	router, _, repo := setupTestRouter()

	// 1. 准备测试数据并动态计算其哈希
	testContent := "hello chainverify integrated test\n"
	testHash, _ := hashutil.CalculateSHA256(strings.NewReader(testContent))
	testCID := "QmTDFDkWVDxchC4mditQhtpP9qhfQq4yETTqNuiNThETPy"
	
	// 2. 预填一条数据到内存仓库中
	repo.Save(nil, &models.Proof{
		FileHash:      testHash,
		CID:           testCID,
		FileName:      "test.txt",
		FileSize:      int64(len(testContent)),
		WalletAddress: "0xd4b5996d0f659e1e2798cc1a3693b9730fe56fb4",
	})

	// 3. 构造相同内容的上传请求
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, _ := writer.CreateFormFile("file", "test.txt")
	io.WriteString(part, testContent) 
	writer.Close()

	req, _ := http.NewRequest("POST", "/api/v1/store/upload", body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	w := httptest.NewRecorder()

	// 4. 执行请求
	router.ServeHTTP(w, req)

	// 5. 断言结果
	assert.Equal(t, http.StatusOK, w.Code)
	
	var resp struct {
		Code    int                    `json:"code"`
		Message string                 `json:"message"`
		Data    map[string]interface{} `json:"data"`
	}
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	assert.NoError(t, err)
	
	assert.Equal(t, "file already exists", resp.Message)
	assert.Equal(t, testCID, resp.Data["cid"])
}

func TestUploadToIPFS_MissingFile(t *testing.T) {
	router, _, _ := setupTestRouter()

	req, _ := http.NewRequest("POST", "/api/v1/store/upload", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "missing file field")
}
