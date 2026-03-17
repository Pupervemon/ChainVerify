package handler

import (
	"errors"
	"net/http"

	"github.com/Pupervemon/ChainVerify/internal/service"
	"github.com/Pupervemon/ChainVerify/pkg/response"
	"github.com/gin-gonic/gin"
)

// UploadToIPFS 处理上传文件到 IPFS 请求
// @Summary      上传文件到 IPFS
// @Description  通过 Pinata 服务将文件上传至 IPFS，并获取文件哈希
// @Tags         存储
// @Accept       multipart/form-data
// @Produce      json
// @Param        file  formData  file  true  "待上传文件"
// @Success      200   {object}  response.Response{data=service.UploadResult} "文件上传成功"
// @Failure      400   {object}  response.Response "请求参数错误"
// @Failure      500   {object}  response.Response "内部服务配置错误"
// @Failure      502   {object}  response.Response "上游服务错误"
// @Router       /store/upload [post]
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
