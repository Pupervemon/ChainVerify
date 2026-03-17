package hashutil

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
)

// CalculateSHA256 计算 io.Reader 流的 SHA-256 哈希值
func CalculateSHA256(r io.Reader) (string, error) {
	hash := sha256.New()
	if _, err := io.Copy(hash, r); err != nil {
		return "", fmt.Errorf("calculate hash failed: %w", err)
	}
	return hex.EncodeToString(hash.Sum(nil)), nil
}
