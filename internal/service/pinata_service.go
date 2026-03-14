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
	"time"

	"github.com/Pupervemon/ChainVerify/internal/config"
)

// ErrPinataJWTMissing 当配置文件中缺少 Pinata JWT 令牌时返回此错误
var ErrPinataJWTMissing = errors.New("pinata jwt is not configured")

// UploadResult 定义了文件上传到 IPFS 成功后的返回结构
type UploadResult struct {
	CID        string `json:"cid"`         // IPFS 唯一内容标识符 (Hash)
	FileName   string `json:"file_name"`   // 原始文件名
	FileSize   int64  `json:"file_size"`   // 文件大小 (字节)
	GatewayURL string `json:"gateway_url"` // 可直接访问文件的网关 URL
}

// PinataService 封装了与 Pinata IPFS 托管服务交互的逻辑
type PinataService struct {
	cfg        config.Config // 系统配置信息
	httpClient *http.Client  // 复用的 HTTP 客户端
}

// NewPinataService 创建并初始化一个新的 Pinata 服务实例
func NewPinataService(cfg config.Config) *PinataService {
	return &PinataService{
		cfg:        cfg,
		// 设置 60 秒超时，防止大文件上传或网络问题导致服务挂起
		httpClient: &http.Client{Timeout: 60 * time.Second},
	}
}

// UploadFile 将上传的文件流转发到 Pinata IPFS 节点
// 参数:
//   ctx: 上下文，用于控制请求生命周期
//   file: 已经打开的文件流 (multipart.File)
//   fileHeader: 包含文件名等元信息的文件头
func (s *PinataService) UploadFile(ctx context.Context, file multipart.File, fileHeader *multipart.FileHeader) (UploadResult, error) {
	// 1. 权限前置检查：确保 API 令牌已配置
	if s.cfg.PinataJWT == "" {
		return UploadResult{}, ErrPinataJWTMissing
	}

	// 确保在函数退出时关闭输入文件流，防止内存泄漏
	defer file.Close()

	// 2. 构造 Multipart 表单数据
	// Pinata 的 API 要求以 multipart/form-data 格式接收文件
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	// A. 创建文件字段 (字段名必须为 "file")
	part, err := writer.CreateFormFile("file", filepath.Base(fileHeader.Filename))
	if err != nil {
		return UploadResult{}, fmt.Errorf("create form file failed: %w", err)
	}

	// B. 将文件内容从输入流拷贝到 Multipart 表单流中
	size, err := io.Copy(part, file)
	if err != nil {
		return UploadResult{}, fmt.Errorf("copy file content failed: %w", err)
	}

	// C. 添加 Pinata 元数据 (pinataMetadata)
	// 这有助于在 Pinata 后台管理页面显示正确的文件名，而非只有哈希
	metadata, err := writer.CreateFormField("pinataMetadata")
	if err != nil {
		return UploadResult{}, fmt.Errorf("create metadata field failed: %w", err)
	}

	if _, err := metadata.Write([]byte(fmt.Sprintf(`{"name":"%s"}`, filepath.Base(fileHeader.Filename)))); err != nil {
		return UploadResult{}, err
	}

	// 必须关闭 writer 才能将最后的 boundary 写入 body
	if err := writer.Close(); err != nil {
		return UploadResult{}, err
	}

	// 3. 构建并发送 HTTP POST 请求
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, s.cfg.PinataUploadURL, body)
	if err != nil {
		return UploadResult{}, fmt.Errorf("create request failed: %w", err)
	}

	// 设置认证头 (Bearer Token 模式)
	req.Header.Set("Authorization", "Bearer "+s.cfg.PinataJWT)
	// 设置 Content-Type，必须包含特定的 multipart boundary
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

	// 处理非成功状态码
	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		return UploadResult{}, fmt.Errorf("pinata upload failed: status=%d body=%s", resp.StatusCode, string(respBody))
	}

	// 解析 Pinata 返回的 JSON (主要获取 IpfsHash)
	var pinataResp struct {
		IpfsHash string `json:"IpfsHash"`
	}
	if err := json.Unmarshal(respBody, &pinataResp); err != nil {
		return UploadResult{}, fmt.Errorf("unmarshal response failed: %w", err)
	}

	// 5. 组装最终结果返回
	return UploadResult{
		CID:        pinataResp.IpfsHash,
		FileName:   fileHeader.Filename,
		FileSize:   size,
		// 使用官方公共网关拼接访问地址
		GatewayURL: "https://gateway.pinata.cloud/ipfs/" + pinataResp.IpfsHash,
	}, nil
}
