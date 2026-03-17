package handler

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/Pupervemon/ChainVerify/internal/repository"
	"github.com/Pupervemon/ChainVerify/pkg/response"
	"github.com/gin-gonic/gin"
)

// ListProofs 处理获取存证列表请求
// @Summary      获取存证列表
// @Description  根据钱包地址、分页获取存证记录
// @Tags         存证
// @Accept       json
// @Produce      json
// @Param        wallet_address  query     string  false  "钱包地址"
// @Param        page            query     int     false  "页码"     default(1)
// @Param        page_size       query     int     false  "每页大小"  default(10)
// @Success      200             {object}  response.Response{data=object{items=[]models.Proof,pagination=object}} "成功获取存证列表"
// @Failure      500             {object}  response.Response "服务器内部错误"
// @Router       /proofs [get]
func (h *Handler) ListProofs(c *gin.Context) {
	page := parsePositiveInt(c.DefaultQuery("page", "1"), 1)
	pageSize := parsePositiveInt(c.DefaultQuery("page_size", "10"), 10)
	if pageSize > 100 {
		pageSize = 100
	}

	walletAddress := c.Query("wallet_address")
	proofs, total, err := h.proofService.ListProofs(c.Request.Context(), walletAddress, page, pageSize)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "query proofs failed")
		return
	}

	response.Success(c, "proof list fetched", gin.H{
		"items": proofs,
		"pagination": gin.H{
			"page":      page,
			"page_size": pageSize,
			"total":     total,
		},
	})
}

// GetProof 处理获取单个存证记录请求
// @Summary      获取存证详情
// @Description  根据文件哈希获取存证详情
// @Tags         存证
// @Accept       json
// @Produce      json
// @Param        file_hash  path      string  true  "文件哈希"
// @Success      200        {object}  response.Response{data=models.Proof} "成功获取存证详情"
// @Failure      400        {object}  response.Response "请求参数错误"
// @Failure      404        {object}  response.Response "未找到该存证"
// @Failure      500        {object}  response.Response "服务器内部错误"
// @Router       /proofs/{file_hash} [get]
func (h *Handler) GetProof(c *gin.Context) {
	fileHash := c.Param("file_hash")
	if fileHash == "" {
		response.Error(c, http.StatusBadRequest, "file_hash is required")
		return
	}

	proof, err := h.proofService.GetProof(c.Request.Context(), fileHash)
	if err != nil {
		if errors.Is(err, repository.ErrProofNotFound) {
			response.Error(c, http.StatusNotFound, "proof not found")
			return
		}

		response.Error(c, http.StatusInternalServerError, "query proof failed")
		return
	}

	response.Success(c, "proof detail fetched", proof)
}

func parsePositiveInt(value string, fallback int) int {
	parsed, err := strconv.Atoi(value)
	if err != nil || parsed <= 0 {
		return fallback
	}

	return parsed
}
