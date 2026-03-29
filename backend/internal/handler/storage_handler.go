package handler

import (
	"encoding/json"
	"errors"
	"io"
	"mime/multipart"
	"strings"

	"github.com/Pupervemon/ChainVerify/internal/repository"
	"github.com/Pupervemon/ChainVerify/internal/service"
	"github.com/Pupervemon/ChainVerify/pkg/hashutil"
	"github.com/Pupervemon/ChainVerify/pkg/response"
	"github.com/gin-gonic/gin"
)

const MaxUploadSize = 10 << 20

// UploadIPFS handles unified IPFS uploads and optionally checks duplicate proofs.
// @Summary      上传文件到 IPFS
// @Description  统一 IPFS 上传入口。默认执行普通上传；当 query 参数 scene=proof 时，会先进行存证重复校验再上传。
// @Tags         存储
// @Accept       multipart/form-data
// @Produce      json
// @Param        file     formData  file    true   "待上传文件"
// @Param        metadata formData  string  false  "可选 metadata JSON 字符串"
// @Param        scene    query     string  false  "上传场景，proof 表示启用重复校验"
// @Success      200      {object}  response.Response{data=service.UploadResult} "文件上传成功"
// @Failure      400      {object}  response.Response "请求参数错误"
// @Failure      500      {object}  response.Response "内部服务配置错误"
// @Failure      502      {object}  response.Response "上游服务错误"
// @Router       /ipfs/upload [post]
func (h *Handler) UploadIPFS(c *gin.Context) {
	scene := strings.ToLower(strings.TrimSpace(c.DefaultQuery("scene", "")))
	checkDuplicate := scene == "proof"

	h.uploadToIPFS(c, checkDuplicate)
}

func (h *Handler) uploadToIPFS(c *gin.Context, checkDuplicate bool) {
	fileHeader, customMetadata, file, fileHash, ok := h.prepareIPFSUpload(c)
	if !ok {
		return
	}
	defer file.Close()

	if checkDuplicate {
		existingProof, err := h.proofService.GetProof(c.Request.Context(), fileHash)
		if err == nil && existingProof != nil {
			response.BadRequest(
				c,
				"file already notarized",
				"this file has already been stored on-chain by "+existingProof.WalletAddress,
			)
			return
		}
		if err != nil && !errors.Is(err, repository.ErrProofNotFound) {
			response.InternalError(c, "database query failed", err.Error())
			return
		}
	}

	if err := resetUploadFile(file); err != nil {
		response.InternalError(c, "reset file pointer failed", err.Error())
		return
	}

	result, err := h.pinataService.UploadFile(
		c.Request.Context(),
		file,
		fileHeader,
		fileHash,
		customMetadata,
	)
	if !handlePinataUploadError(c, err) {
		return
	}

	response.Success(c, "file uploaded to ipfs", result)
}

func (h *Handler) prepareIPFSUpload(
	c *gin.Context,
) (*multipart.FileHeader, map[string]string, multipart.File, string, bool) {
	if err := c.Request.ParseMultipartForm(MaxUploadSize); err != nil {
		response.BadRequest(c, "file size exceeds limit", "maximum allowed size is 10MB")
		return nil, nil, nil, "", false
	}

	fileHeader, err := c.FormFile("file")
	if err != nil {
		response.BadRequest(c, "missing file field", err.Error())
		return nil, nil, nil, "", false
	}

	if fileHeader.Size > MaxUploadSize {
		response.BadRequest(c, "file too large", "maximum allowed size is 10MB")
		return nil, nil, nil, "", false
	}

	var customMetadata map[string]string
	metadataStr := c.PostForm("metadata")
	if metadataStr != "" {
		if err := json.Unmarshal([]byte(metadataStr), &customMetadata); err != nil {
			response.BadRequest(
				c,
				"invalid metadata format",
				"metadata must be a valid JSON object with string key-values",
			)
			return nil, nil, nil, "", false
		}
	}

	file, err := fileHeader.Open()
	if err != nil {
		response.BadRequest(c, "open uploaded file failed", err.Error())
		return nil, nil, nil, "", false
	}

	fileHash, err := hashutil.CalculateSHA256(file)
	if err != nil {
		file.Close()
		response.InternalError(c, "calculate file hash failed", err.Error())
		return nil, nil, nil, "", false
	}

	return fileHeader, customMetadata, file, fileHash, true
}

func resetUploadFile(file multipart.File) error {
	seeker, ok := file.(io.Seeker)
	if !ok {
		return errors.New("file does not support seeking")
	}

	_, err := seeker.Seek(0, io.SeekStart)
	return err
}

func handlePinataUploadError(c *gin.Context, err error) bool {
	if err == nil {
		return true
	}

	if errors.Is(err, service.ErrTooManyMetadata) {
		response.BadRequest(c, "metadata validation failed", err.Error())
		return false
	}

	if errors.Is(err, service.ErrPinataJWTMissing) {
		response.InternalError(c, "pinata service not configured", err.Error())
		return false
	}

	response.BadGateway(c, "upstream ipfs service failure", err.Error())
	return false
}
