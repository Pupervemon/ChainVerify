package config

import (
	"reflect"
	"testing"
)

func TestGetEnvCSV_UsesFallbackWhenUnset(t *testing.T) {
	t.Setenv("ALLOWED_ORIGINS", "")

	fallback := []string{"http://localhost:3000", "http://localhost:5173"}
	got := getEnvCSV("ALLOWED_ORIGINS", fallback)
	if !reflect.DeepEqual(got, fallback) {
		t.Fatalf("getEnvCSV returned %v, want %v", got, fallback)
	}
}

func TestGetEnvCSV_ParsesCommaSeparatedOrigins(t *testing.T) {
	t.Setenv("ALLOWED_ORIGINS", " http://localhost:3000,https://example.com , ,https://app.example.com ")

	want := []string{
		"http://localhost:3000",
		"https://example.com",
		"https://app.example.com",
	}
	got := getEnvCSV("ALLOWED_ORIGINS", nil)
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("getEnvCSV returned %v, want %v", got, want)
	}
}

func TestGetEnvCSV_UsesFallbackWhenOnlyEmptyValuesProvided(t *testing.T) {
	t.Setenv("ALLOWED_ORIGINS", " , , ")

	fallback := []string{"http://localhost:3000"}
	got := getEnvCSV("ALLOWED_ORIGINS", fallback)
	if !reflect.DeepEqual(got, fallback) {
		t.Fatalf("getEnvCSV returned %v, want %v", got, fallback)
	}
}
