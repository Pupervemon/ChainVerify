package main

import (
	"log"

	"github.com/Pupervemon/ChainVerify/internal/config"
	"github.com/Pupervemon/ChainVerify/internal/database"
	"github.com/Pupervemon/ChainVerify/internal/handler"
	"github.com/Pupervemon/ChainVerify/internal/repository"
	"github.com/Pupervemon/ChainVerify/internal/router"
	"github.com/Pupervemon/ChainVerify/internal/service"
)

func main() {
	cfg := config.Load()

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
	h := handler.NewHandler(cfg, pinataService, proofService)

	engine := router.New(cfg, h)
	if err := engine.Run(":" + cfg.Port); err != nil {
		log.Fatalf("start server failed: %v", err)
	}
}
