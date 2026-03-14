package router

import (
	"net/http"
	"strings"

	"github.com/Pupervemon/ChainVerify/internal/config"
	"github.com/Pupervemon/ChainVerify/internal/handler"
	"github.com/gin-gonic/gin"
)

// New 初始化路由并配置中间件
func New(cfg config.Config, h *handler.Handler) *gin.Engine {
	engine := gin.New()
	engine.Use(gin.Logger(), gin.Recovery(), corsMiddleware(cfg.AllowedOrigins))
	engine.MaxMultipartMemory = cfg.MaxUploadSize

	engine.GET("/healthz", h.Health)

	v1 := engine.Group(cfg.BasePath)
	{
		v1.POST("/store/upload", h.UploadToIPFS)
		v1.GET("/proofs", h.ListProofs)
		v1.GET("/proofs/:file_hash", h.GetProof)
		v1.GET("/stats", h.GetStats)
	}

	return engine
}

func corsMiddleware(origins []string) gin.HandlerFunc {
	allowed := make(map[string]struct{}, len(origins))
	for _, origin := range origins {
		allowed[strings.TrimSpace(origin)] = struct{}{}
	}

	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		if origin != "" {
			if _, ok := allowed[origin]; ok {
				c.Header("Access-Control-Allow-Origin", origin)
				c.Header("Vary", "Origin")
			}
		}

		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")
		c.Header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}
