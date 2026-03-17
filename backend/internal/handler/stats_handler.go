package handler

import (
	"github.com/Pupervemon/ChainVerify/pkg/response"
	"github.com/gin-gonic/gin"
)

// GetStats 处理获取统计信息请求
// @Summary      获取存证统计
// @Description  获取全站存证数据统计（如存证总数、数据库状态等）
// @Tags         统计
// @Accept       json
// @Produce      json
// @Success      200  {object}  response.Response{data=models.ProofStats} "成功获取统计信息"
// @Failure      500  {object}  response.Response "服务器内部错误"
// @Router       /stats [get]
func (h *Handler) GetStats(c *gin.Context) {
	stats, err := h.proofService.GetStats(c.Request.Context())
	if err != nil {
		response.InternalError(c, "fetch stats failed", err.Error())
		return
	}

	response.Success(c, "stats fetched", stats)
}

// Health 处理健康检查请求
// @Summary      服务健康检查
// @Description  检查后端 API 服务是否运行正常
// @Tags         系统
// @Accept       json
// @Produce      json
// @Success      200  {object}  response.Response{data=object{service=string,version=string}} "服务运行正常"
// @Router       /healthz [get]
func (h *Handler) Health(c *gin.Context) {
	response.Success(c, "ok", gin.H{
		"service": "ChainVerify API",
		"version": "v1",
	})
}
