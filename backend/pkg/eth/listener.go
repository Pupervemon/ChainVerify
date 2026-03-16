package eth

import (
	"context"
	"fmt"
	"log"

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
			log.Printf("Received ProofCreated event: fileHash=%s, wallet=%s, cid=%s",
				event.FileHash.Hex(), event.WalletAddress.Hex(), event.Cid)
			if handler != nil {
				handler(event)
			}
		case <-ctx.Done():
			log.Println("Context canceled, stopping event listener...")
			return ctx.Err()
		}
	}
}
