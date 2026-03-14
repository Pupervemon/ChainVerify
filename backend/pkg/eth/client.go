package eth

import (
	"context"
	"fmt"

	"github.com/ethereum/go-ethereum/ethclient"
)

// Client 包装以太坊客户端
type Client struct {
	Client *ethclient.Client
}

// NewClient 初始化并返回一个新的以太坊客户端包装器
func NewClient(rpcURL string) (*Client, error) {
	client, err := ethclient.DialContext(context.Background(), rpcURL)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to the Ethereum client: %w", err)
	}

	return &Client{
		Client: client,
	}, nil
}

// Close 关闭与节点的连接
func (c *Client) Close() {
	if c.Client != nil {
		c.Client.Close()
	}
}
