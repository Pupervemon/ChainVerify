package handler

import (
	"errors"
	"io"

	"github.com/Pupervemon/ChainVerify/internal/repository"
	"github.com/Pupervemon/ChainVerify/internal/service"
	"github.com/Pupervemon/ChainVerify/pkg/hashutil"
	"github.com/Pupervemon/ChainVerify/pkg/response"
	"github.com/gin-gonic/gin"
)

// UploadToIPFS 处理上传文件到 IPFS 请求
// @Summary      上传文件到 IPFS
// @Description  通过 Pinata 服务将文件上传至 IPFS，并获取文件哈希。上传前会检查数据库中是否已存在相同文件的存证记录。
// @Tags         存储
// @Accept       multipart/form-data
// @Produce      json
// @Param        file  formData  file  true  "待上传文件"
// @Success      200   {object}  response.Response{data=service.UploadResult} "文件上传成功或返回已有记录"
// @Failure      400   {object}  response.Response "请求参数错误"
// @Failure      500   {object}  response.Response "内部服务配置错误"
// @Failure      502   {object}  response.Response "上游服务错误"
// @Router       /store/upload [post]
func (h *Handler) UploadToIPFS(c *gin.Context) {
	fileHeader, err := c.FormFile("file")
	if err != nil {
		response.BadRequest(c, "missing file field", err.Error())
		return
	}

	file, err := fileHeader.Open()
	if err != nil {
		response.BadRequest(c, "open uploaded file failed", err.Error())
		return
	}
	defer file.Close()

	// 1. 计算上传文件的哈希值
	fileHash, err := hashutil.CalculateSHA256(file)
	if err != nil {
		response.InternalError(c, "calculate file hash failed", err.Error())
		return
	}

	// 2. 数据库查重：如果该文件已存在，则直接返回
	existingProof, err := h.proofService.GetProof(c.Request.Context(), fileHash)
	if err == nil && existingProof != nil {
		response.Success(c, "file already exists", service.UploadResult{
			CID:        existingProof.CID,
			FileName:   existingProof.FileName,
			FileSize:   existingProof.FileSize,
			GatewayURL: "https://gateway.pinata.cloud/ipfs/" + existingProof.CID,
		})
		return
	} else if err != nil && !errors.Is(err, repository.ErrProofNotFound) {
		response.InternalError(c, "database query failed", err.Error())
		return
	}

	// 3. 重置文件指针，以便后续上传
	if seeker, ok := file.(io.Seeker); ok {
		if _, err := seeker.Seek(0, io.SeekStart); err != nil {
			response.InternalError(c, "reset file pointer failed", err.Error())
			return
		}
	} else {
		response.InternalError(c, "file does not support seeking")
		return
	}

	// 4. 执行上传到 Pinata
	result, err := h.pinataService.UploadFile(c.Request.Context(), file, fileHeader)
	if err != nil {
		if errors.Is(err, service.ErrPinataJWTMissing) {
			response.InternalError(c, "pinata service not configured", err.Error())
			return
		}

		response.BadGateway(c, "upstream ipfs service failure", err.Error())
		return
	}

	response.Success(c, "file uploaded to ipfs", result)
}
