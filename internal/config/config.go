package config

import (
	"os"
	"strconv"
	"time"
)

// Config 应用配置结构体
type Config struct {
	Port              string
	BasePath          string
	MySQLDSN          string
	PinataJWT         string
	PinataUploadURL   string
	MaxUploadSize     int64
	ReadTimeout       time.Duration
	WriteTimeout      time.Duration
	AllowedOrigins    []string
	EnableAutoMigrate bool
}

// Load 从环境变量加载配置
func Load() Config {
	return Config{
		Port:              getEnv("PORT", "8080"),
		BasePath:          getEnv("BASE_PATH", "/api/v1"),
		MySQLDSN:          os.Getenv("MYSQL_DSN"),
		PinataJWT:         os.Getenv("PINATA_JWT"),
		PinataUploadURL:   getEnv("PINATA_UPLOAD_URL", "https://api.pinata.cloud/pinning/pinFileToIPFS"),
		MaxUploadSize:     getEnvInt64("MAX_UPLOAD_SIZE", 32<<20),
		ReadTimeout:       getEnvDuration("READ_TIMEOUT", 15*time.Second),
		WriteTimeout:      getEnvDuration("WRITE_TIMEOUT", 30*time.Second),
		AllowedOrigins:    []string{"http://localhost:3000", "http://localhost:5173"},
		EnableAutoMigrate: getEnvBool("ENABLE_AUTO_MIGRATE", true),
	}
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
