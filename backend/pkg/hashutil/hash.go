package hashutil

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
	"strings"
)

const sha256HexLength = 64

// CalculateSHA256 calculates a canonical SHA-256 hash string for the reader.
func CalculateSHA256(r io.Reader) (string, error) {
	hash := sha256.New()
	if _, err := io.Copy(hash, r); err != nil {
		return "", fmt.Errorf("calculate hash failed: %w", err)
	}

	return NormalizeSHA256Hex(hex.EncodeToString(hash.Sum(nil)))
}

// NormalizeSHA256Hex converts a SHA-256 hex string to its canonical 0x-prefixed lowercase form.
func NormalizeSHA256Hex(value string) (string, error) {
	normalized := strings.TrimSpace(value)
	if normalized == "" {
		return "", fmt.Errorf("file hash is empty")
	}

	if strings.HasPrefix(normalized, "0x") || strings.HasPrefix(normalized, "0X") {
		normalized = normalized[2:]
	}

	normalized = strings.ToLower(normalized)
	if len(normalized) != sha256HexLength {
		return "", fmt.Errorf("invalid sha256 hex length: got %d", len(normalized))
	}

	if _, err := hex.DecodeString(normalized); err != nil {
		return "", fmt.Errorf("invalid sha256 hex: %w", err)
	}

	return "0x" + normalized, nil
}

// LookupSHA256HexVariants returns both canonical and legacy forms for backward-compatible lookups.
func LookupSHA256HexVariants(value string) ([]string, error) {
	normalized, err := NormalizeSHA256Hex(value)
	if err != nil {
		return nil, err
	}

	return []string{normalized, strings.TrimPrefix(normalized, "0x")}, nil
}
