package handler

import (
	"github.com/Pupervemon/ChainVerify/internal/config"
	"github.com/Pupervemon/ChainVerify/internal/service"
)

// Handler 统一处理器结构体，持有各业务服务的引用
type Handler struct {
	cfg           config.Config
	pinataService *service.PinataService
	proofService  *service.ProofService
}

// NewHandler 创建新的处理器实例
func NewHandler(cfg config.Config, pinataService *service.PinataService, proofService *service.ProofService) *Handler {
	return &Handler{
		cfg:           cfg,
		pinataService: pinataService,
		proofService:  proofService,
	}
}
