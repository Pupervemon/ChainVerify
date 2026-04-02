package models

import "time"

// Proof 存证记录模型
type Proof struct {
	ID              uint      `json:"id" gorm:"primaryKey"`
	WalletAddress   string    `json:"wallet_address" gorm:"size:64;index;index:idx_proofs_wallet_created_at,priority:1;not null"`
	FileHash        string    `json:"file_hash" gorm:"size:128;uniqueIndex;not null"`
	FileName        string    `json:"file_name" gorm:"size:255;not null"`
	FileSize        int64     `json:"file_size" gorm:"not null"`
	ContentType     string    `json:"content_type" gorm:"size:128"`
	CID             string    `json:"cid" gorm:"column:cid;size:255;index;not null"`
	TxHash          string    `json:"tx_hash" gorm:"size:128;index"`
	BlockNumber     uint64    `json:"block_number"`
	ChainID         string    `json:"chain_id" gorm:"size:32"`
	ContractAddress string    `json:"contract_address" gorm:"size:64"`
	ProofCreatedAt  time.Time `json:"proof_created_at" gorm:"index;index:idx_proofs_wallet_created_at,priority:2;not null"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// ProofStats 存证统计信息
type ProofStats struct {
	TotalProofs     int64      `json:"total_proofs"`
	TotalUsers      int64      `json:"total_users"`
	TotalStorage    int64      `json:"total_storage"`
	LatestProofAt   *time.Time `json:"latest_proof_at,omitempty"`
	DatabaseEnabled bool       `json:"database_enabled"`
}
