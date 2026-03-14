package handler

import (
	"net/http"

	"github.com/Pupervemon/ChainVerify/pkg/response"
	"github.com/gin-gonic/gin"
)

// GetStats 处理获取统计信息请求
func (h *Handler) GetStats(c *gin.Context) {
	stats, err := h.proofService.GetStats(c.Request.Context())
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "query stats failed")
		return
	}

	response.Success(c, "stats fetched", stats)
}

// Health 处理健康检查请求
func (h *Handler) Health(c *gin.Context) {
	response.Success(c, "ok", gin.H{
		"service": "ChainVerify API",
		"version": "v1",
	})
}
