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
