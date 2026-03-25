package eth

import (
	"context"
	"fmt"
	"log"
	"math/big"
	"strings"

	"github.com/Pupervemon/ChainVerify/pkg/contracts/proofstore"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
)

// EventListener 以太坊事件监听器
type EventListener struct {
	client     *Client
	proofStore *proofstore.ProofStore
	address    common.Address
}

// NewEventListener 创建一个新的事件监听器
func NewEventListener(client *Client, contractAddressHex string) (*EventListener, error) {
	address := common.HexToAddress(contractAddressHex)

	// 初始化合约实例
	store, err := proofstore.NewProofStore(address, client.Client)
	if err != nil {
		return nil, fmt.Errorf("failed to bind proof store contract: %w", err)
	}

	return &EventListener{
		client:     client,
		proofStore: store,
		address:    address,
	}, nil
}

// ListenProofCreated 开始监听 ProofCreated 事件
// handler 函数将在每次收到事件时被调用
func (l *EventListener) ListenProofCreated(ctx context.Context, handler func(*proofstore.ProofStoreProofCreated)) error {
	logs := make(chan *proofstore.ProofStoreProofCreated)

	// 订阅 ProofCreated 事件
	// WatchOpts 中的 Context 可以用来取消订阅
	sub, err := l.proofStore.WatchProofCreated(&bind.WatchOpts{Context: ctx}, logs, nil, nil)
	if err != nil {
		return fmt.Errorf("failed to watch ProofCreated event: %w", err)
	}
	defer sub.Unsubscribe()

	log.Printf("Started listening for ProofCreated events on contract: %s", l.address.Hex())

	for {
		select {
		case err := <-sub.Err():
			return fmt.Errorf("ProofCreated subscription error: %w", err)
		case event := <-logs:
			fileHashHex := common.Hash(event.FileHash).Hex()
			ownerHex := event.Owner.Hex()

			log.Printf("监听到新存证上链! Hash: %s, Owner: %s, FileName: %s, CID: %s",
				fileHashHex, ownerHex, event.FileName, event.Cid)
			if handler != nil {
				handler(event)
			}
		case <-ctx.Done():
			log.Println("Context canceled, stopping event listener...")
			return ctx.Err()
		}
	}
}

// OnChainProof 自定义结构体，用于接收 GetProof 的多返回值
type OnChainProof struct {
	Owner     common.Address
	Cid       string
	Timestamp *big.Int
}

// GetProof 读取链上确权信息 (用于核验文件真伪)
// fileHashHex 应该是一个带 "0x" 前缀的 64 位哈希字符串
func (l *EventListener) GetProof(ctx context.Context, fileHashHex string) (*OnChainProof, error) {
	fileHashBytes32 := common.HexToHash(fileHashHex)

	// 调用智能合约的 getProof 方法
	// 注意：根据 abigen 的生成规则，带有多个具名返回值的 view 函数，会返回一个匿名结构体
	result, err := l.proofStore.GetProof(&bind.CallOpts{Context: ctx}, fileHashBytes32)
	if err != nil {
		return nil, fmt.Errorf("failed to get proof from chain: %w", err)
	}

	// 组装并返回
	return &OnChainProof{
		Owner:     result.Owner,
		Cid:       result.Cid,
		Timestamp: result.Timestamp,
	}, nil
}

// ContractAddressHex returns the bound contract address.
func (l *EventListener) ContractAddressHex() string {
	return strings.ToLower(l.address.Hex())
}

// ChainID returns the connected chain id as a string.
func (l *EventListener) ChainID(ctx context.Context) (string, error) {
	chainID, err := l.client.Client.NetworkID(ctx)
	if err != nil {
		return "", err
	}

	return chainID.String(), nil
}
