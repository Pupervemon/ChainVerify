package hashutil

import (
	"strings"
	"testing"
)

func TestNormalizeSHA256Hex(t *testing.T) {
	t.Parallel()

	got, err := NormalizeSHA256Hex("0XABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789")
	if err != nil {
		t.Fatalf("NormalizeSHA256Hex returned error: %v", err)
	}

	const want = "0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789"
	if got != want {
		t.Fatalf("NormalizeSHA256Hex = %q, want %q", got, want)
	}
}

func TestNormalizeSHA256HexRejectsInvalidValue(t *testing.T) {
	t.Parallel()

	if _, err := NormalizeSHA256Hex("not-a-hash"); err == nil {
		t.Fatal("expected error for invalid hash")
	}
}

func TestCalculateSHA256ReturnsCanonicalFormat(t *testing.T) {
	t.Parallel()

	got, err := CalculateSHA256(strings.NewReader("hello world"))
	if err != nil {
		t.Fatalf("CalculateSHA256 returned error: %v", err)
	}

	const want = "0xb94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
	if got != want {
		t.Fatalf("CalculateSHA256 = %q, want %q", got, want)
	}
}
