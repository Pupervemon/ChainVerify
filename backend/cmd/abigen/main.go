package main

import (
	"log"
	"os"
	"strings"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
)

func main() {

	abiBytes, err := os.ReadFile("../blockchain/ProofStore.abi")
	if err != nil {
		log.Fatalf("Failed to read abi: %v", err)
	}

	binBytes, err := os.ReadFile("../blockchain/ProofStore.bin")
	if err != nil {
		log.Fatalf("Failed to read bin: %v", err)
	}

	bin := strings.TrimPrefix(strings.TrimSpace(string(binBytes)), "0x")

	code, err := bind.Bind(
		[]string{"ProofStore"},
		[]string{string(abiBytes)},
		[]string{bin},
		nil,
		"proofstore",
		nil,
		nil,
	)

	if err != nil {
		log.Fatalf("Failed to generate bind: %v", err)
	}

	os.MkdirAll("pkg/contracts/proofstore", os.ModePerm)

	err = os.WriteFile("pkg/contracts/proofstore/proofstore.go", []byte(code), 0600)
	if err != nil {
		log.Fatalf("Failed to write proofstore.go: %v", err)
	}

	log.Println("Successfully generated proofstore.go")
}
