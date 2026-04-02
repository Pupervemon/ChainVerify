package database

import (
	"errors"

	"github.com/Pupervemon/ChainVerify/internal/config"
	"github.com/Pupervemon/ChainVerify/internal/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// NewMySQL 初始化 MySQL 数据库连接
func NewMySQL(cfg config.Config) (*gorm.DB, error) {
	if cfg.MySQLDSN == "" {
		return nil, errors.New("MYSQL_DSN is required")
	}

	db, err := gorm.Open(mysql.Open(cfg.MySQLDSN), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	if cfg.EnableAutoMigrate {
		if err := db.AutoMigrate(&models.Proof{}); err != nil {
			return nil, err
		}
	}

	return db, nil
}
