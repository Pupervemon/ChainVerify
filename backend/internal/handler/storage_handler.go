package handler

import (
	"errors"
	"net/http"

	"github.com/Pupervemon/ChainVerify/internal/service"
	"github.com/Pupervemon/ChainVerify/pkg/response"
	"github.com/gin-gonic/gin"
)

// UploadToIPFS 处理上传文件到 IPFS 请求
func (h *Handler) UploadToIPFS(c *gin.Context) {
	fileHeader, err := c.FormFile("file")
	if err != nil {
		response.Error(c, http.StatusBadRequest, "missing file field")
		return
	}

	file, err := fileHeader.Open()
	if err != nil {
		response.Error(c, http.StatusBadRequest, "open uploaded file failed")
		return
	}

	result, err := h.pinataService.UploadFile(c.Request.Context(), file, fileHeader)
	if err != nil {
		if errors.Is(err, service.ErrPinataJWTMissing) {
			response.Error(c, http.StatusInternalServerError, "pinata service not configured")
			return
		}

		response.Error(c, http.StatusBadGateway, err.Error())
		return
	}

	response.Success(c, "file uploaded to ipfs", result)
}
