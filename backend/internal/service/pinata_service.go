package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"path/filepath"
	"time"

	"github.com/Pupervemon/ChainVerify/internal/config"
)

var ErrPinataJWTMissing = errors.New("pinata jwt is not configured")

var ErrTooManyMetadata = errors.New("metadata exceeds the maximum limit of 3 key-value pairs")

type UploadResult struct {
	CID        string `json:"cid"`
	FileHash   string `json:"file_hash"`
	FileName   string `json:"file_name"`
	FileSize   int64  `json:"file_size"`
	GatewayURL string `json:"gateway_url"`
}

type PinataService struct {
	cfg        config.Config
	httpClient *http.Client
}

type PinataMetadata struct {
	Name      string            `json:"name"`
	KeyValues map[string]string `json:"keyvalues,omitempty"`
}

type uploadStreamResult struct {
	size int64
	err  error
}

func NewPinataService(cfg config.Config) *PinataService {
	timeout := cfg.PinataTimeout
	if timeout <= 0 {
		timeout = 60 * time.Second
	}

	return &PinataService{
		cfg:        cfg,
		httpClient: &http.Client{Timeout: timeout},
	}
}

func (s *PinataService) UploadFile(
	ctx context.Context,
	file multipart.File,
	fileHeader *multipart.FileHeader,
	fileHash string,
	customMetadata map[string]string,
) (UploadResult, error) {
	if s.cfg.PinataJWT == "" {
		return UploadResult{}, ErrPinataJWTMissing
	}
	if len(customMetadata) > 3 {
		return UploadResult{}, ErrTooManyMetadata
	}

	pmBytes, err := json.Marshal(PinataMetadata{
		Name:      filepath.Base(fileHeader.Filename),
		KeyValues: customMetadata,
	})
	if err != nil {
		return UploadResult{}, fmt.Errorf("marshal metadata failed: %w", err)
	}

	body, contentType, streamResultCh := createPinataUploadStream(
		file,
		filepath.Base(fileHeader.Filename),
		pmBytes,
	)

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, s.cfg.PinataUploadURL, body)
	if err != nil {
		_ = body.Close()
		return UploadResult{}, fmt.Errorf("create request failed: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+s.cfg.PinataJWT)
	req.Header.Set("Content-Type", contentType)

	resp, err := s.httpClient.Do(req)
	if err != nil {
		_ = body.Close()
		if streamResult := <-streamResultCh; streamResult.err != nil {
			return UploadResult{}, streamResult.err
		}
		return UploadResult{}, fmt.Errorf("execute request failed: %w", err)
	}
	defer body.Close()
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return UploadResult{}, fmt.Errorf("read response body failed: %w", err)
	}

	streamResult := <-streamResultCh
	if streamResult.err != nil {
		return UploadResult{}, streamResult.err
	}

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		return UploadResult{}, fmt.Errorf("pinata upload failed: status=%d body=%s", resp.StatusCode, string(respBody))
	}

	var pinataResp struct {
		IpfsHash string `json:"IpfsHash"`
	}
	if err := json.Unmarshal(respBody, &pinataResp); err != nil {
		return UploadResult{}, fmt.Errorf("unmarshal response failed: %w", err)
	}

	return UploadResult{
		CID:        pinataResp.IpfsHash,
		FileHash:   fileHash,
		FileName:   fileHeader.Filename,
		FileSize:   streamResult.size,
		GatewayURL: "https://gateway.pinata.cloud/ipfs/" + pinataResp.IpfsHash,
	}, nil
}

func createPinataUploadStream(
	file multipart.File,
	filename string,
	metadata []byte,
) (io.ReadCloser, string, <-chan uploadStreamResult) {
	pipeReader, pipeWriter := io.Pipe()
	writer := multipart.NewWriter(pipeWriter)
	resultCh := make(chan uploadStreamResult, 1)

	go func() {
		result := uploadStreamResult{}
		defer func() {
			if result.err != nil {
				_ = pipeWriter.CloseWithError(result.err)
			} else {
				if err := writer.Close(); err != nil {
					result.err = fmt.Errorf("finalize multipart body failed: %w", err)
					_ = pipeWriter.CloseWithError(result.err)
				} else if err := pipeWriter.Close(); err != nil {
					result.err = fmt.Errorf("close upload stream failed: %w", err)
				}
			}

			resultCh <- result
			close(resultCh)
		}()

		part, err := writer.CreateFormFile("file", filename)
		if err != nil {
			result.err = fmt.Errorf("create form file failed: %w", err)
			return
		}

		result.size, err = io.Copy(part, file)
		if err != nil {
			result.err = fmt.Errorf("copy file content failed: %w", err)
			return
		}

		metadataField, err := writer.CreateFormField("pinataMetadata")
		if err != nil {
			result.err = fmt.Errorf("create metadata field failed: %w", err)
			return
		}

		if _, err := metadataField.Write(metadata); err != nil {
			result.err = fmt.Errorf("write metadata failed: %w", err)
			return
		}
	}()

	return pipeReader, writer.FormDataContentType(), resultCh
}
