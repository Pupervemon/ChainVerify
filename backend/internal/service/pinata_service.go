package service

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"path/filepath"

	"github.com/Pupervemon/ChainVerify/internal/config"
)

// ErrPinataJWTMissing 当配置文件中缺少 Pinata JWT 令牌时返回此错误
var ErrPinataJWTMissing = errors.New("pinata jwt is not configured")

var ErrTooManyMetadata = errors.New("metadata exceeds the maximum limit of 3 key-value pairs")

// UploadResult 定义了文件上传到 IPFS 成功后的返回结构
type UploadResult struct {
	CID        string `json:"cid"`         // IPFS 唯一内容标识符 (Hash)
	FileHash   string `json:"file_hash"`   // 后端计算的文件 SHA256 哈希
	FileName   string `json:"file_name"`   // 原始文件名
	FileSize   int64  `json:"file_size"`   // 文件大小 (字节)
	GatewayURL string `json:"gateway_url"` // 可直接访问文件的网关 URL
}

// PinataService 封装了与 Pinata IPFS 托管服务交互的逻辑
type PinataService struct {
	cfg        config.Config // 系统配置信息
	httpClient *http.Client  // 复用的 HTTP 客户端
}

type PinataMetadata struct {
	Name      string            `json:"name"`                // 文件在 Pinata 后台显示的名字
	KeyValues map[string]string `json:"keyvalues,omitempty"` // 自定义键值对，omitempty 表示如果为空则不生成此字段
}

// NewPinataService 创建一个新的 PinataService 实例
func NewPinataService(cfg config.Config) *PinataService {
	return &PinataService{
		cfg:        cfg,
		httpClient: &http.Client{},
	}
}

// UploadFile 将上传的文件流转发到 Pinata IPFS 节点，并附带自定义 Metadata
func (s *PinataService) UploadFile(ctx context.Context, file multipart.File, fileHeader *multipart.FileHeader, fileHash string, customMetadata map[string]string) (UploadResult, error) {
	// 1. 权限与前置规则检查
	if s.cfg.PinataJWT == "" {
		return UploadResult{}, ErrPinataJWTMissing
	}
	// 校验：限制自定义 metadata 最多只能有 3 个键值对
	if len(customMetadata) > 3 {
		return UploadResult{}, ErrTooManyMetadata
	}

	defer file.Close()

	// 2. 构造 Multipart 表单数据
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	// A. 创建文件字段
	part, err := writer.CreateFormFile("file", filepath.Base(fileHeader.Filename))
	if err != nil {
		return UploadResult{}, fmt.Errorf("create form file failed: %w", err)
	}

	// B. 拷贝文件流
	size, err := io.Copy(part, file)
	if err != nil {
		return UploadResult{}, fmt.Errorf("copy file content failed: %w", err)
	}

	// C. 动态生成并添加 Pinata Metadata
	metadataField, err := writer.CreateFormField("pinataMetadata")
	if err != nil {
		return UploadResult{}, fmt.Errorf("create metadata field failed: %w", err)
	}

	// 将数据填入结构体
	pm := PinataMetadata{
		Name:      filepath.Base(fileHeader.Filename),
		KeyValues: customMetadata, // 把用户传进来的 map 赋给 KeyValues
	}

	// 使用 json.Marshal 将结构体安全地转换为 JSON 字节流
	pmBytes, err := json.Marshal(pm)
	if err != nil {
		return UploadResult{}, fmt.Errorf("marshal metadata failed: %w", err)
	}

	// 把生成的 JSON 字符串写入 metadata 隔层
	if _, err := metadataField.Write(pmBytes); err != nil {
		return UploadResult{}, err
	}

	// 必须关闭 writer 写入最后的 boundary
	if err := writer.Close(); err != nil {
		return UploadResult{}, err
	}

	// 3. 构建并发送 HTTP POST 请求 (后续逻辑保持不变)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, s.cfg.PinataUploadURL, body)
	if err != nil {
		return UploadResult{}, fmt.Errorf("create request failed: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+s.cfg.PinataJWT)
	req.Header.Set("Content-Type", writer.FormDataContentType())

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return UploadResult{}, fmt.Errorf("execute request failed: %w", err)
	}
	defer resp.Body.Close()

	// 4. 解析响应结果
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return UploadResult{}, fmt.Errorf("read response body failed: %w", err)
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

	// 5. 返回结果
	return UploadResult{
		CID:        pinataResp.IpfsHash,
		FileHash:   fileHash,
		FileName:   fileHeader.Filename,
		FileSize:   size,
		GatewayURL: "https://gateway.pinata.cloud/ipfs/" + pinataResp.IpfsHash,
	}, nil
}
