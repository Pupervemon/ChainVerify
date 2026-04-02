package response

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Response 统一响应结构体
type Response struct {
	Code    int         `json:"code"`            // 业务状态码 (如 200, 4001, 5002 等)
	Message string      `json:"message"`         // 给前端显示的提示信息
	Data    interface{} `json:"data,omitempty"`  // 成功的业务数据
	Error   string      `json:"error,omitempty"` // 详细的错误调试信息 (可选)
}

// Success 返回成功的 JSON 响应 (HTTP 200)
func Success(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusOK, Response{
		Code:    http.StatusOK,
		Message: message,
		Data:    data,
	})
}

// Error 返回标准的错误响应
func Error(c *gin.Context, httpCode int, message string, detail ...string) {
	resp := Response{
		Code:    httpCode,
		Message: message,
	}
	if len(detail) > 0 && httpCode < http.StatusInternalServerError {
		resp.Error = detail[0]
	}
	if len(detail) > 0 && httpCode >= http.StatusInternalServerError {
		logServerError(c, httpCode, message, detail[0])
	}
	c.JSON(httpCode, resp)
}

// BadRequest 返回 400 错误 (参数错误)
func BadRequest(c *gin.Context, message string, detail ...string) {
	Error(c, http.StatusBadRequest, message, detail...)
}

// Unauthorized 返回 401 错误 (未授权)
func Unauthorized(c *gin.Context, message string, detail ...string) {
	Error(c, http.StatusUnauthorized, message, detail...)
}

// Forbidden 返回 403 错误 (无权限)
func Forbidden(c *gin.Context, message string, detail ...string) {
	Error(c, http.StatusForbidden, message, detail...)
}

// NotFound 返回 404 错误 (资源不存在)
func NotFound(c *gin.Context, message string, detail ...string) {
	Error(c, http.StatusNotFound, message, detail...)
}

// InternalError 返回 500 错误 (内部故障)
func InternalError(c *gin.Context, message string, detail ...string) {
	Error(c, http.StatusInternalServerError, message, detail...)
}

// BadGateway 返回 502 错误 (上游服务故障)
func BadGateway(c *gin.Context, message string, detail ...string) {
	Error(c, http.StatusBadGateway, message, detail...)
}

func logServerError(c *gin.Context, httpCode int, message string, detail string) {
	path := ""
	method := ""
	if c != nil && c.Request != nil {
		method = c.Request.Method
		path = c.FullPath()
		if path == "" && c.Request.URL != nil {
			path = c.Request.URL.Path
		}
	}

	log.Printf("http %d %s %s: %s: %s", httpCode, method, path, message, detail)
}
