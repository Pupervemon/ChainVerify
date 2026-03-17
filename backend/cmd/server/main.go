package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Pupervemon/ChainVerify/internal/config"
	"github.com/Pupervemon/ChainVerify/internal/database"
	"github.com/Pupervemon/ChainVerify/internal/handler"
	"github.com/Pupervemon/ChainVerify/internal/repository"
	"github.com/Pupervemon/ChainVerify/internal/router"
	"github.com/Pupervemon/ChainVerify/internal/service"
	"github.com/Pupervemon/ChainVerify/pkg/eth"
)

// @title           ChainVerify API
// @version         1.0
// @description     ChainVerify 存证平台后端 API 文档。
// @termsOfService  http://swagger.io/terms/

// @contact.name   API Support
// @contact.url    http://www.swagger.io/support
// @contact.email  support@swagger.io

// @license.name  Apache 2.0
// @license.url   http://www.apache.org/licenses/LICENSE-2.0.html

// @host      localhost:8080
// @BasePath  /api/v1

func main() {
	cfg := config.Load()

	// 初始化数据库
	db, err := database.NewMySQL(cfg)
	if err != nil {
		log.Fatalf("init mysql failed: %v", err)
	}

	var proofRepository repository.ProofRepository = repository.NewMemoryProofRepository()
	if db != nil {
		log.Println("Using MySQL as proof repository")
		proofRepository = repository.NewGormProofRepository(db)
	}

	pinataService := service.NewPinataService(cfg)
	proofService := service.NewProofService(proofRepository)

	// 可优雅退出的 context
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// 初始化以太坊事件监听
	if cfg.ContractAddress != "" {
		ethClient, ethErr := eth.NewClient(cfg.EthRPCURL)
		if ethErr != nil {
			log.Printf("Warning: failed to connect to Ethereum node: %v, event listener disabled", ethErr)
		} else {
			listener, listenErr := eth.NewEventListener(ethClient, cfg.ContractAddress)
			if listenErr != nil {
				log.Printf("Warning: failed to create event listener: %v, event listener disabled", listenErr)
			} else {
				eventSvc := service.NewEventIntegrationService(listener, proofService)
				eventSvc.Start(ctx)
				log.Printf("Ethereum event listener started for contract: %s", cfg.ContractAddress)
			}
		}
	} else {
		log.Println("CONTRACT_ADDRESS not set, Ethereum event listener disabled")
	}

	h := handler.NewHandler(cfg, pinataService, proofService)
	engine := router.New(cfg, h)

	srv := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: engine,
	}

	// 在独立协程中启动 Web 服务器
	go func() {
		log.Printf("Starting server on port %s...", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	// 监听系统信号并等待
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutdown signal received, stopping services...")

	// 触发 context 取消，通知所有后台服务停止
	cancel()

	// 优雅关闭 Web 服务器（给它 5 秒时间处理完现有请求）
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer shutdownCancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exiting")
}
