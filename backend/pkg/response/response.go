package response

import "github.com/gin-gonic/gin"

type payload struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

// Success 返回成功的 JSON 响应
func Success(c *gin.Context, message string, data interface{}) {
	c.JSON(200, payload{
		Code:    200,
		Message: message,
		Data:    data,
	})
}

// Error 返回错误的 JSON 响应
func Error(c *gin.Context, code int, message string) {
	c.JSON(code, payload{
		Code:    code,
		Message: message,
	})
}
