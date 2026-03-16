package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/Pupervemon/ChainVerify/internal/config"
	"github.com/Pupervemon/ChainVerify/internal/database"
	"github.com/Pupervemon/ChainVerify/internal/handler"
	"github.com/Pupervemon/ChainVerify/internal/repository"
	"github.com/Pupervemon/ChainVerify/internal/router"
	"github.com/Pupervemon/ChainVerify/internal/service"
	"github.com/Pupervemon/ChainVerify/pkg/eth"
)

func main() {
	cfg := config.Load()

	// 初始化数据库
	db, err := database.NewMySQL(cfg)
	if err != nil {
		log.Fatalf("init mysql failed: %v", err)
	}

	var proofRepository repository.ProofRepository = repository.NewMemoryProofRepository()
	if db != nil {
		proofRepository = repository.NewGormProofRepository(db)
	}

	pinataService := service.NewPinataService(cfg)
	proofService := service.NewProofService(proofRepository)

	// 可优雅退出的 context
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// 监听系统信号，触发优雅退出
	go func() {
		quit := make(chan os.Signal, 1)
		signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
		<-quit
		log.Println("Shutdown signal received, stopping services...")
		cancel()
	}()

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
	if err := engine.Run(":" + cfg.Port); err != nil {
		log.Fatalf("start server failed: %v", err)
	}
}
