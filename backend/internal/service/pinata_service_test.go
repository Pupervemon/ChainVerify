package service

import (
	"bytes"
	"encoding/json"
	"io"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/Pupervemon/ChainVerify/internal/config"
)

func TestNewPinataService_UsesConfiguredTimeout(t *testing.T) {
	t.Parallel()

	svc := NewPinataService(config.Config{PinataTimeout: 12 * time.Second})
	if svc.httpClient.Timeout != 12*time.Second {
		t.Fatalf("http client timeout = %v, want %v", svc.httpClient.Timeout, 12*time.Second)
	}
}

func TestNewPinataService_UsesDefaultTimeout(t *testing.T) {
	t.Parallel()

	svc := NewPinataService(config.Config{})
	if svc.httpClient.Timeout != 60*time.Second {
		t.Fatalf("http client timeout = %v, want %v", svc.httpClient.Timeout, 60*time.Second)
	}
}

func TestUploadFile_SendsExpectedMultipartPayload(t *testing.T) {
	t.Parallel()

	content := []byte("hello streamed pinata")
	type capturedRequest struct {
		Authorization string
		FileName      string
		FileBody      []byte
		Metadata      PinataMetadata
	}

	requests := make(chan capturedRequest, 1)
	errCh := make(chan error, 1)
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if err := r.ParseMultipartForm(32 << 20); err != nil {
			errCh <- err
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		file, fileHeader, err := r.FormFile("file")
		if err != nil {
			errCh <- err
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		defer file.Close()

		fileBody, err := io.ReadAll(file)
		if err != nil {
			errCh <- err
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		var metadata PinataMetadata
		if err := json.Unmarshal([]byte(r.FormValue("pinataMetadata")), &metadata); err != nil {
			errCh <- err
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		requests <- capturedRequest{
			Authorization: r.Header.Get("Authorization"),
			FileName:      fileHeader.Filename,
			FileBody:      fileBody,
			Metadata:      metadata,
		}

		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"IpfsHash":"QmStreamedCid"}`))
	}))
	defer server.Close()

	fileHeader, file := newPinataUploadFile(t, "stream.txt", content)
	defer file.Close()

	svc := NewPinataService(config.Config{
		PinataJWT:       "test-jwt",
		PinataUploadURL: server.URL,
		PinataTimeout:   5 * time.Second,
	})

	result, err := svc.UploadFile(
		t.Context(),
		file,
		fileHeader,
		"0x1234",
		map[string]string{"source": "service-test"},
	)
	if err != nil {
		t.Fatalf("UploadFile failed: %v", err)
	}

	select {
	case err := <-errCh:
		t.Fatalf("server validation failed: %v", err)
	case got := <-requests:
		if got.Authorization != "Bearer test-jwt" {
			t.Fatalf("Authorization = %q, want %q", got.Authorization, "Bearer test-jwt")
		}
		if got.FileName != "stream.txt" {
			t.Fatalf("filename = %q, want %q", got.FileName, "stream.txt")
		}
		if !bytes.Equal(got.FileBody, content) {
			t.Fatalf("file body = %q, want %q", string(got.FileBody), string(content))
		}
		if got.Metadata.Name != "stream.txt" {
			t.Fatalf("metadata.name = %q, want %q", got.Metadata.Name, "stream.txt")
		}
		if got.Metadata.KeyValues["source"] != "service-test" {
			t.Fatalf("metadata.keyvalues[source] = %q, want %q", got.Metadata.KeyValues["source"], "service-test")
		}
	case <-time.After(2 * time.Second):
		t.Fatal("timed out waiting for streamed upload request")
	}
	if result.CID != "QmStreamedCid" {
		t.Fatalf("CID = %q, want %q", result.CID, "QmStreamedCid")
	}
	if result.FileSize != int64(len(content)) {
		t.Fatalf("FileSize = %d, want %d", result.FileSize, len(content))
	}
	if result.FileName != "stream.txt" {
		t.Fatalf("FileName = %q, want %q", result.FileName, "stream.txt")
	}
}

func newPinataUploadFile(t *testing.T, filename string, content []byte) (*multipart.FileHeader, multipart.File) {
	t.Helper()

	var body bytes.Buffer
	writer := multipart.NewWriter(&body)

	part, err := writer.CreateFormFile("file", filename)
	if err != nil {
		t.Fatalf("CreateFormFile failed: %v", err)
	}

	if _, err := part.Write(content); err != nil {
		t.Fatalf("Write content failed: %v", err)
	}

	if err := writer.Close(); err != nil {
		t.Fatalf("Close writer failed: %v", err)
	}

	req := httptest.NewRequest(http.MethodPost, "/upload", &body)
	req.Header.Set("Content-Type", writer.FormDataContentType())

	file, fileHeader, err := req.FormFile("file")
	if err != nil {
		t.Fatalf("FormFile failed: %v", err)
	}

	return fileHeader, file
}
