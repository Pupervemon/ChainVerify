package handler

import (
	"encoding/json" // 新增导入 JSON 库
	"errors"
	"io"

	"github.com/Pupervemon/ChainVerify/internal/repository"
	"github.com/Pupervemon/ChainVerify/internal/service"
	"github.com/Pupervemon/ChainVerify/pkg/hashutil"
	"github.com/Pupervemon/ChainVerify/pkg/response"
	"github.com/gin-gonic/gin"
)

// 定义最大文件上传大小 (例如：10 MB)
const MaxUploadSize = 10 << 20

// UploadToIPFS 处理上传文件到 IPFS 请求
// @Summary      上传文件到 IPFS
// @Description  带大小限制和元数据。通过 Pinata 服务将文件上传至 IPFS，并获取文件哈希。
// @Tags         存储
// @Accept       multipart/form-data
// @Produce      json
// @Param        file      formData  file    true  "待上传文件 (最大10MB)"
// @Param        metadata  formData  string  false "文件元数据 (JSON字符串, 最多3个KV, 如 {'author':'Alice'})"
// @Success      200       {object}  response.Response{data=service.UploadResult} "文件上传成功或返回已有记录"
// @Router       /store/upload [post]
func (h *Handler) UploadToIPFS(c *gin.Context) {
	// 1. 容量限制校验
	if err := c.Request.ParseMultipartForm(MaxUploadSize); err != nil {
		response.BadRequest(c, "file size exceeds limit", "maximum allowed size is 10MB")
		return
	}

	fileHeader, err := c.FormFile("file")
	if err != nil {
		response.BadRequest(c, "missing file field", err.Error())
		return
	}

	if fileHeader.Size > MaxUploadSize {
		response.BadRequest(c, "file too large", "maximum allowed size is 10MB")
		return
	}

	// 2. 接收并解析前端传来的 Metadata (JSON 字符串 -> map[string]string)
	metadataStr := c.PostForm("metadata")
	var customMetadata map[string]string

	// 只有当前端确实传了 metadata 时，才进行 JSON 解析
	if metadataStr != "" {
		if err := json.Unmarshal([]byte(metadataStr), &customMetadata); err != nil {
			response.BadRequest(c, "invalid metadata format", "metadata must be a valid JSON object with string key-values")
			return
		}
	}

	// 打开文件流
	file, err := fileHeader.Open()
	if err != nil {
		response.BadRequest(c, "open uploaded file failed", err.Error())
		return
	}
	defer file.Close()

	// 3. 计算上传文件的哈希值
	fileHash, err := hashutil.CalculateSHA256(file)
	if err != nil {
		response.InternalError(c, "calculate file hash failed", err.Error())
		return
	}

	// 4. 全局按文件哈希查重
	existingProof, err := h.proofService.GetProof(c.Request.Context(), fileHash)
	if err == nil && existingProof != nil {
		response.BadRequest(c, "file already notarized", "this file has already been stored on-chain by "+existingProof.WalletAddress)
		return
	} else if err != nil && !errors.Is(err, repository.ErrProofNotFound) {
		response.InternalError(c, "database query failed", err.Error())
		return
	}

	// 5. 重置文件指针 (因为上面算 Hash 把文件读到末尾了)
	if seeker, ok := file.(io.Seeker); ok {
		if _, err := seeker.Seek(0, io.SeekStart); err != nil {
			response.InternalError(c, "reset file pointer failed", err.Error())
			return
		}
	} else {
		response.InternalError(c, "file does not support seeking")
		return
	}

	// 6. 执行上传到 Pinata (传入解析好的 map：customMetadata)
	result, err := h.pinataService.UploadFile(c.Request.Context(), file, fileHeader, fileHash, customMetadata)
	if err != nil {
		// 捕获超过 3 个 KV 限制的错误，作为 400 错误返回给前端
		if errors.Is(err, service.ErrTooManyMetadata) {
			response.BadRequest(c, "metadata validation failed", err.Error())
			return
		}
		// 捕获 JWT 未配置的错误
		if errors.Is(err, service.ErrPinataJWTMissing) {
			response.InternalError(c, "pinata service not configured", err.Error())
			return
		}
		// 其他不可预知的 IPFS 错误
		response.BadGateway(c, "upstream ipfs service failure", err.Error())
		return
	}

	response.Success(c, "file uploaded to ipfs", result)
}
