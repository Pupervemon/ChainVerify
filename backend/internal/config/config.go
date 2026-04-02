package config

import (
	"log"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

// Config 应用配置结构体
type Config struct {
	Port              string
	BasePath          string
	MySQLDSN          string
	PinataJWT         string
	PinataUploadURL   string
	PinataTimeout     time.Duration
	MaxUploadSize     int64
	ReadTimeout       time.Duration
	WriteTimeout      time.Duration
	AllowedOrigins    []string
	EnableAutoMigrate bool
	EthRPCURL         string
	HardhatPrivateKey string
	ContractAddress   string
}

// Load 从环境变量加载配置
func Load() Config {
	// 尝试自动寻找并加载 .env 文件
	// 从当前目录向上搜索，直到找到 .env 文件或到达根目录
	dir, err := os.Getwd()
	if err == nil {
		for {
			envPath := filepath.Join(dir, ".env")
			if _, err := os.Stat(envPath); err == nil {
				_ = godotenv.Load(envPath)
				log.Printf("Loaded environment variables from: %s", envPath)
				break
			}

			// 同时尝试在 backend 子目录下查找（如果当前是在项目根目录运行）
			backendEnvPath := filepath.Join(dir, "backend", ".env")
			if _, err := os.Stat(backendEnvPath); err == nil {
				_ = godotenv.Load(backendEnvPath)
				log.Printf("Loaded environment variables from: %s", backendEnvPath)
				break
			}

			parent := filepath.Dir(dir)
			if parent == dir {
				log.Println("No .env file found, using system environment variables")
				break
			}
			dir = parent
		}
	}

	return Config{
		Port:              getEnv("PORT", "8080"),
		BasePath:          getEnv("BASE_PATH", "/api/v1"),
		MySQLDSN:          os.Getenv("MYSQL_DSN"),
		PinataJWT:         os.Getenv("PINATA_JWT"),
		PinataUploadURL:   getEnv("PINATA_UPLOAD_URL", "https://api.pinata.cloud/pinning/pinFileToIPFS"),
		PinataTimeout:     getEnvDuration("PINATA_TIMEOUT", 60*time.Second),
		MaxUploadSize:     getEnvInt64("MAX_UPLOAD_SIZE", 32<<20),
		ReadTimeout:       getEnvDuration("READ_TIMEOUT", 15*time.Second),
		WriteTimeout:      getEnvDuration("WRITE_TIMEOUT", 30*time.Second),
		AllowedOrigins:    getEnvCSV("ALLOWED_ORIGINS", []string{"http://localhost:3000", "http://localhost:5173"}),
		EnableAutoMigrate: getEnvBool("ENABLE_AUTO_MIGRATE", true),
		EthRPCURL:         getEnvAny([]string{"ETH_RPC_URL", "SEPOLIA_RPC_URL"}, "http://127.0.0.1:8545"),
		HardhatPrivateKey: getEnv("HARDHAT_PRIVATE_KEY", "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"),
		ContractAddress:   os.Getenv("CONTRACT_ADDRESS"),
	}
}

func getEnvAny(keys []string, fallback string) string {
	for _, key := range keys {
		if value := os.Getenv(key); value != "" {
			return value
		}
	}

	return fallback
}

func getEnvCSV(key string, fallback []string) []string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	items := make([]string, 0)
	for _, item := range strings.Split(value, ",") {
		trimmed := strings.TrimSpace(item)
		if trimmed != "" {
			items = append(items, trimmed)
		}
	}

	if len(items) == 0 {
		return fallback
	}

	return items
}

func getEnv(key, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	return value
}

func getEnvInt64(key string, fallback int64) int64 {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	parsed, err := strconv.ParseInt(value, 10, 64)
	if err != nil {
		return fallback
	}

	return parsed
}

func getEnvDuration(key string, fallback time.Duration) time.Duration {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	parsed, err := time.ParseDuration(value)
	if err != nil {
		return fallback
	}

	return parsed
}

func getEnvBool(key string, fallback bool) bool {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	parsed, err := strconv.ParseBool(value)
	if err != nil {
		return fallback
	}

	return parsed
}
