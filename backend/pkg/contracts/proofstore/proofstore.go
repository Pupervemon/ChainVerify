// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package proofstore

import (
	"errors"
	"math/big"
	"strings"

	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"
)

// Reference imports to suppress errors if they are not otherwise used.
var (
	_ = errors.New
	_ = big.NewInt
	_ = strings.NewReader
	_ = ethereum.NotFound
	_ = bind.Bind
	_ = common.Big1
	_ = types.BloomLookup
	_ = event.NewSubscription
	_ = abi.ConvertType
)

// ProofStoreMetaData contains all meta data concerning the ProofStore contract.
var ProofStoreMetaData = &bind.MetaData{
	ABI: "[{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"fileHash\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"cid\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"fileName\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"fileSize\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"contentType\",\"type\":\"string\"}],\"name\":\"ProofCreated\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"_fileHash\",\"type\":\"bytes32\"}],\"name\":\"getProof\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"cid\",\"type\":\"string\"},{\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"_fileHash\",\"type\":\"bytes32\"}],\"name\":\"isProofExists\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"name\":\"proofs\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"cid\",\"type\":\"string\"},{\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"_fileHash\",\"type\":\"bytes32\"},{\"internalType\":\"string\",\"name\":\"_cid\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"_fileName\",\"type\":\"string\"},{\"internalType\":\"uint256\",\"name\":\"_fileSize\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"_contentType\",\"type\":\"string\"}],\"name\":\"storeProof\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"totalProofs\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]",
	Bin: "0x6080604052348015600e575f5ffd5b50610e698061001c5f395ff3fe608060405234801561000f575f5ffd5b5060043610610055575f3560e01c80631627212c146100595780631b80bb3a146100895780632ded3568146100bb578063444d95b0146100d95780639e2aa6eb1461010b575b5f5ffd5b610073600480360381019061006e9190610594565b610127565b60405161008091906105d9565b60405180910390f35b6100a3600480360381019061009e9190610594565b610146565b6040516100b2939291906106b9565b60405180910390f35b6100c36102b8565b6040516100d091906106f5565b60405180910390f35b6100f360048036038101906100ee9190610594565b6102be565b604051610102939291906106b9565b60405180910390f35b61012560048036038101906101209190610864565b610388565b005b5f5f5f5f8481526020019081526020015f206002015414159050919050565b5f60605f5f5f5f8681526020019081526020015f206040518060600160405290815f82015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016001820180546101ca9061095c565b80601f01602080910402602001604051908101604052809291908181526020018280546101f69061095c565b80156102415780601f1061021857610100808354040283529160200191610241565b820191905f5260205f20905b81548152906001019060200180831161022457829003601f168201915b5050505050815260200160028201548152505090505f81604001510361029c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610293906109d6565b60405180910390fd5b805f015181602001518260400151935093509350509193909250565b60015481565b5f602052805f5260405f205f91509050805f015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010180546103019061095c565b80601f016020809104026020016040519081016040528092919081815260200182805461032d9061095c565b80156103785780601f1061034f57610100808354040283529160200191610378565b820191905f5260205f20905b81548152906001019060200180831161035b57829003601f168201915b5050505050908060020154905083565b5f8490505f815111801561039e57506080815111155b6103dd576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103d490610a3e565b60405180910390fd5b5f5f5f8881526020019081526020015f206002015414610432576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161042990610acc565b60405180910390fd5b60405180606001604052803373ffffffffffffffffffffffffffffffffffffffff168152602001868152602001428152505f5f8881526020019081526020015f205f820151815f015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160010190816104cc9190610c8a565b506040820151816002015590505060015f8154809291906104ec90610d86565b91905055503373ffffffffffffffffffffffffffffffffffffffff16867fc53fdb167ae4e7df825301fdf14ad957c5b7346bfc927cda990f52e27b3476a68742888888604051610540959493929190610dcd565b60405180910390a3505050505050565b5f604051905090565b5f5ffd5b5f5ffd5b5f819050919050565b61057381610561565b811461057d575f5ffd5b50565b5f8135905061058e8161056a565b92915050565b5f602082840312156105a9576105a8610559565b5b5f6105b684828501610580565b91505092915050565b5f8115159050919050565b6105d3816105bf565b82525050565b5f6020820190506105ec5f8301846105ca565b92915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f61061b826105f2565b9050919050565b61062b81610611565b82525050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f601f19601f8301169050919050565b5f61067382610631565b61067d818561063b565b935061068d81856020860161064b565b61069681610659565b840191505092915050565b5f819050919050565b6106b3816106a1565b82525050565b5f6060820190506106cc5f830186610622565b81810360208301526106de8185610669565b90506106ed60408301846106aa565b949350505050565b5f6020820190506107085f8301846106aa565b92915050565b5f5ffd5b5f5ffd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b61074c82610659565b810181811067ffffffffffffffff8211171561076b5761076a610716565b5b80604052505050565b5f61077d610550565b90506107898282610743565b919050565b5f67ffffffffffffffff8211156107a8576107a7610716565b5b6107b182610659565b9050602081019050919050565b828183375f83830152505050565b5f6107de6107d98461078e565b610774565b9050828152602081018484840111156107fa576107f9610712565b5b6108058482856107be565b509392505050565b5f82601f8301126108215761082061070e565b5b81356108318482602086016107cc565b91505092915050565b610843816106a1565b811461084d575f5ffd5b50565b5f8135905061085e8161083a565b92915050565b5f5f5f5f5f60a0868803121561087d5761087c610559565b5b5f61088a88828901610580565b955050602086013567ffffffffffffffff8111156108ab576108aa61055d565b5b6108b78882890161080d565b945050604086013567ffffffffffffffff8111156108d8576108d761055d565b5b6108e48882890161080d565b93505060606108f588828901610850565b925050608086013567ffffffffffffffff8111156109165761091561055d565b5b6109228882890161080d565b9150509295509295909350565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061097357607f821691505b6020821081036109865761098561092f565b5b50919050565b7f50726f6f6653746f72653a2050726f6f66206e6f7420666f756e6400000000005f82015250565b5f6109c0601b8361063b565b91506109cb8261098c565b602082019050919050565b5f6020820190508181035f8301526109ed816109b4565b9050919050565b7f50726f6f6653746f72653a20496e76616c6964204349440000000000000000005f82015250565b5f610a2860178361063b565b9150610a33826109f4565b602082019050919050565b5f6020820190508181035f830152610a5581610a1c565b9050919050565b7f50726f6f6653746f72653a2046696c65206861736820616c72656164792065785f8201527f6973747300000000000000000000000000000000000000000000000000000000602082015250565b5f610ab660248361063b565b9150610ac182610a5c565b604082019050919050565b5f6020820190508181035f830152610ae381610aaa565b9050919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f60088302610b467fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610b0b565b610b508683610b0b565b95508019841693508086168417925050509392505050565b5f819050919050565b5f610b8b610b86610b81846106a1565b610b68565b6106a1565b9050919050565b5f819050919050565b610ba483610b71565b610bb8610bb082610b92565b848454610b17565b825550505050565b5f5f905090565b610bcf610bc0565b610bda818484610b9b565b505050565b5b81811015610bfd57610bf25f82610bc7565b600181019050610be0565b5050565b601f821115610c4257610c1381610aea565b610c1c84610afc565b81016020851015610c2b578190505b610c3f610c3785610afc565b830182610bdf565b50505b505050565b5f82821c905092915050565b5f610c625f1984600802610c47565b1980831691505092915050565b5f610c7a8383610c53565b9150826002028217905092915050565b610c9382610631565b67ffffffffffffffff811115610cac57610cab610716565b5b610cb6825461095c565b610cc1828285610c01565b5f60209050601f831160018114610cf2575f8415610ce0578287015190505b610cea8582610c6f565b865550610d51565b601f198416610d0086610aea565b5f5b82811015610d2757848901518255600182019150602085019450602081019050610d02565b86831015610d445784890151610d40601f891682610c53565b8355505b6001600288020188555050505b505050505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f610d90826106a1565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203610dc257610dc1610d59565b5b600182019050919050565b5f60a0820190508181035f830152610de58188610669565b9050610df460208301876106aa565b8181036040830152610e068186610669565b9050610e1560608301856106aa565b8181036080830152610e278184610669565b9050969550505050505056fea2646970667358221220e53af0cc9555fe040a087c54b81e8db1e1df01aea53f12af5351894ee192e34864736f6c634300081c0033",
}

// ProofStoreABI is the input ABI used to generate the binding from.
// Deprecated: Use ProofStoreMetaData.ABI instead.
var ProofStoreABI = ProofStoreMetaData.ABI

// ProofStoreBin is the compiled bytecode used for deploying new contracts.
// Deprecated: Use ProofStoreMetaData.Bin instead.
var ProofStoreBin = ProofStoreMetaData.Bin

// DeployProofStore deploys a new Ethereum contract, binding an instance of ProofStore to it.
func DeployProofStore(auth *bind.TransactOpts, backend bind.ContractBackend) (common.Address, *types.Transaction, *ProofStore, error) {
	parsed, err := ProofStoreMetaData.GetAbi()
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	if parsed == nil {
		return common.Address{}, nil, nil, errors.New("GetABI returned nil")
	}

	address, tx, contract, err := bind.DeployContract(auth, *parsed, common.FromHex(ProofStoreBin), backend)
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	return address, tx, &ProofStore{ProofStoreCaller: ProofStoreCaller{contract: contract}, ProofStoreTransactor: ProofStoreTransactor{contract: contract}, ProofStoreFilterer: ProofStoreFilterer{contract: contract}}, nil
}

// ProofStore is an auto generated Go binding around an Ethereum contract.
type ProofStore struct {
	ProofStoreCaller     // Read-only binding to the contract
	ProofStoreTransactor // Write-only binding to the contract
	ProofStoreFilterer   // Log filterer for contract events
}

// ProofStoreCaller is an auto generated read-only Go binding around an Ethereum contract.
type ProofStoreCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// ProofStoreTransactor is an auto generated write-only Go binding around an Ethereum contract.
type ProofStoreTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// ProofStoreFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type ProofStoreFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// ProofStoreSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type ProofStoreSession struct {
	Contract     *ProofStore       // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// ProofStoreCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type ProofStoreCallerSession struct {
	Contract *ProofStoreCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts     // Call options to use throughout this session
}

// ProofStoreTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type ProofStoreTransactorSession struct {
	Contract     *ProofStoreTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts     // Transaction auth options to use throughout this session
}

// ProofStoreRaw is an auto generated low-level Go binding around an Ethereum contract.
type ProofStoreRaw struct {
	Contract *ProofStore // Generic contract binding to access the raw methods on
}

// ProofStoreCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type ProofStoreCallerRaw struct {
	Contract *ProofStoreCaller // Generic read-only contract binding to access the raw methods on
}

// ProofStoreTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type ProofStoreTransactorRaw struct {
	Contract *ProofStoreTransactor // Generic write-only contract binding to access the raw methods on
}

// NewProofStore creates a new instance of ProofStore, bound to a specific deployed contract.
func NewProofStore(address common.Address, backend bind.ContractBackend) (*ProofStore, error) {
	contract, err := bindProofStore(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &ProofStore{ProofStoreCaller: ProofStoreCaller{contract: contract}, ProofStoreTransactor: ProofStoreTransactor{contract: contract}, ProofStoreFilterer: ProofStoreFilterer{contract: contract}}, nil
}

// NewProofStoreCaller creates a new read-only instance of ProofStore, bound to a specific deployed contract.
func NewProofStoreCaller(address common.Address, caller bind.ContractCaller) (*ProofStoreCaller, error) {
	contract, err := bindProofStore(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &ProofStoreCaller{contract: contract}, nil
}

// NewProofStoreTransactor creates a new write-only instance of ProofStore, bound to a specific deployed contract.
func NewProofStoreTransactor(address common.Address, transactor bind.ContractTransactor) (*ProofStoreTransactor, error) {
	contract, err := bindProofStore(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &ProofStoreTransactor{contract: contract}, nil
}

// NewProofStoreFilterer creates a new log filterer instance of ProofStore, bound to a specific deployed contract.
func NewProofStoreFilterer(address common.Address, filterer bind.ContractFilterer) (*ProofStoreFilterer, error) {
	contract, err := bindProofStore(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &ProofStoreFilterer{contract: contract}, nil
}

// bindProofStore binds a generic wrapper to an already deployed contract.
func bindProofStore(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := ProofStoreMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_ProofStore *ProofStoreRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _ProofStore.Contract.ProofStoreCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_ProofStore *ProofStoreRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _ProofStore.Contract.ProofStoreTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_ProofStore *ProofStoreRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _ProofStore.Contract.ProofStoreTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_ProofStore *ProofStoreCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _ProofStore.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_ProofStore *ProofStoreTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _ProofStore.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_ProofStore *ProofStoreTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _ProofStore.Contract.contract.Transact(opts, method, params...)
}

// GetProof is a free data retrieval call binding the contract method 0x1b80bb3a.
//
// Solidity: function getProof(bytes32 _fileHash) view returns(address owner, string cid, uint256 timestamp)
func (_ProofStore *ProofStoreCaller) GetProof(opts *bind.CallOpts, _fileHash [32]byte) (struct {
	Owner     common.Address
	Cid       string
	Timestamp *big.Int
}, error) {
	var out []interface{}
	err := _ProofStore.contract.Call(opts, &out, "getProof", _fileHash)

	outstruct := new(struct {
		Owner     common.Address
		Cid       string
		Timestamp *big.Int
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.Owner = *abi.ConvertType(out[0], new(common.Address)).(*common.Address)
	outstruct.Cid = *abi.ConvertType(out[1], new(string)).(*string)
	outstruct.Timestamp = *abi.ConvertType(out[2], new(*big.Int)).(**big.Int)

	return *outstruct, err

}

// GetProof is a free data retrieval call binding the contract method 0x1b80bb3a.
//
// Solidity: function getProof(bytes32 _fileHash) view returns(address owner, string cid, uint256 timestamp)
func (_ProofStore *ProofStoreSession) GetProof(_fileHash [32]byte) (struct {
	Owner     common.Address
	Cid       string
	Timestamp *big.Int
}, error) {
	return _ProofStore.Contract.GetProof(&_ProofStore.CallOpts, _fileHash)
}

// GetProof is a free data retrieval call binding the contract method 0x1b80bb3a.
//
// Solidity: function getProof(bytes32 _fileHash) view returns(address owner, string cid, uint256 timestamp)
func (_ProofStore *ProofStoreCallerSession) GetProof(_fileHash [32]byte) (struct {
	Owner     common.Address
	Cid       string
	Timestamp *big.Int
}, error) {
	return _ProofStore.Contract.GetProof(&_ProofStore.CallOpts, _fileHash)
}

// IsProofExists is a free data retrieval call binding the contract method 0x1627212c.
//
// Solidity: function isProofExists(bytes32 _fileHash) view returns(bool)
func (_ProofStore *ProofStoreCaller) IsProofExists(opts *bind.CallOpts, _fileHash [32]byte) (bool, error) {
	var out []interface{}
	err := _ProofStore.contract.Call(opts, &out, "isProofExists", _fileHash)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsProofExists is a free data retrieval call binding the contract method 0x1627212c.
//
// Solidity: function isProofExists(bytes32 _fileHash) view returns(bool)
func (_ProofStore *ProofStoreSession) IsProofExists(_fileHash [32]byte) (bool, error) {
	return _ProofStore.Contract.IsProofExists(&_ProofStore.CallOpts, _fileHash)
}

// IsProofExists is a free data retrieval call binding the contract method 0x1627212c.
//
// Solidity: function isProofExists(bytes32 _fileHash) view returns(bool)
func (_ProofStore *ProofStoreCallerSession) IsProofExists(_fileHash [32]byte) (bool, error) {
	return _ProofStore.Contract.IsProofExists(&_ProofStore.CallOpts, _fileHash)
}

// Proofs is a free data retrieval call binding the contract method 0x444d95b0.
//
// Solidity: function proofs(bytes32 ) view returns(address owner, string cid, uint256 timestamp)
func (_ProofStore *ProofStoreCaller) Proofs(opts *bind.CallOpts, arg0 [32]byte) (struct {
	Owner     common.Address
	Cid       string
	Timestamp *big.Int
}, error) {
	var out []interface{}
	err := _ProofStore.contract.Call(opts, &out, "proofs", arg0)

	outstruct := new(struct {
		Owner     common.Address
		Cid       string
		Timestamp *big.Int
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.Owner = *abi.ConvertType(out[0], new(common.Address)).(*common.Address)
	outstruct.Cid = *abi.ConvertType(out[1], new(string)).(*string)
	outstruct.Timestamp = *abi.ConvertType(out[2], new(*big.Int)).(**big.Int)

	return *outstruct, err

}

// Proofs is a free data retrieval call binding the contract method 0x444d95b0.
//
// Solidity: function proofs(bytes32 ) view returns(address owner, string cid, uint256 timestamp)
func (_ProofStore *ProofStoreSession) Proofs(arg0 [32]byte) (struct {
	Owner     common.Address
	Cid       string
	Timestamp *big.Int
}, error) {
	return _ProofStore.Contract.Proofs(&_ProofStore.CallOpts, arg0)
}

// Proofs is a free data retrieval call binding the contract method 0x444d95b0.
//
// Solidity: function proofs(bytes32 ) view returns(address owner, string cid, uint256 timestamp)
func (_ProofStore *ProofStoreCallerSession) Proofs(arg0 [32]byte) (struct {
	Owner     common.Address
	Cid       string
	Timestamp *big.Int
}, error) {
	return _ProofStore.Contract.Proofs(&_ProofStore.CallOpts, arg0)
}

// TotalProofs is a free data retrieval call binding the contract method 0x2ded3568.
//
// Solidity: function totalProofs() view returns(uint256)
func (_ProofStore *ProofStoreCaller) TotalProofs(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _ProofStore.contract.Call(opts, &out, "totalProofs")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// TotalProofs is a free data retrieval call binding the contract method 0x2ded3568.
//
// Solidity: function totalProofs() view returns(uint256)
func (_ProofStore *ProofStoreSession) TotalProofs() (*big.Int, error) {
	return _ProofStore.Contract.TotalProofs(&_ProofStore.CallOpts)
}

// TotalProofs is a free data retrieval call binding the contract method 0x2ded3568.
//
// Solidity: function totalProofs() view returns(uint256)
func (_ProofStore *ProofStoreCallerSession) TotalProofs() (*big.Int, error) {
	return _ProofStore.Contract.TotalProofs(&_ProofStore.CallOpts)
}

// StoreProof is a paid mutator transaction binding the contract method 0x9e2aa6eb.
//
// Solidity: function storeProof(bytes32 _fileHash, string _cid, string _fileName, uint256 _fileSize, string _contentType) returns()
func (_ProofStore *ProofStoreTransactor) StoreProof(opts *bind.TransactOpts, _fileHash [32]byte, _cid string, _fileName string, _fileSize *big.Int, _contentType string) (*types.Transaction, error) {
	return _ProofStore.contract.Transact(opts, "storeProof", _fileHash, _cid, _fileName, _fileSize, _contentType)
}

// StoreProof is a paid mutator transaction binding the contract method 0x9e2aa6eb.
//
// Solidity: function storeProof(bytes32 _fileHash, string _cid, string _fileName, uint256 _fileSize, string _contentType) returns()
func (_ProofStore *ProofStoreSession) StoreProof(_fileHash [32]byte, _cid string, _fileName string, _fileSize *big.Int, _contentType string) (*types.Transaction, error) {
	return _ProofStore.Contract.StoreProof(&_ProofStore.TransactOpts, _fileHash, _cid, _fileName, _fileSize, _contentType)
}

// StoreProof is a paid mutator transaction binding the contract method 0x9e2aa6eb.
//
// Solidity: function storeProof(bytes32 _fileHash, string _cid, string _fileName, uint256 _fileSize, string _contentType) returns()
func (_ProofStore *ProofStoreTransactorSession) StoreProof(_fileHash [32]byte, _cid string, _fileName string, _fileSize *big.Int, _contentType string) (*types.Transaction, error) {
	return _ProofStore.Contract.StoreProof(&_ProofStore.TransactOpts, _fileHash, _cid, _fileName, _fileSize, _contentType)
}

// ProofStoreProofCreatedIterator is returned from FilterProofCreated and is used to iterate over the raw logs and unpacked data for ProofCreated events raised by the ProofStore contract.
type ProofStoreProofCreatedIterator struct {
	Event *ProofStoreProofCreated // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *ProofStoreProofCreatedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(ProofStoreProofCreated)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(ProofStoreProofCreated)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *ProofStoreProofCreatedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ProofStoreProofCreatedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// ProofStoreProofCreated represents a ProofCreated event raised by the ProofStore contract.
type ProofStoreProofCreated struct {
	FileHash    [32]byte
	Owner       common.Address
	Cid         string
	Timestamp   *big.Int
	FileName    string
	FileSize    *big.Int
	ContentType string
	Raw         types.Log // Blockchain specific contextual infos
}

// FilterProofCreated is a free log retrieval operation binding the contract event 0xc53fdb167ae4e7df825301fdf14ad957c5b7346bfc927cda990f52e27b3476a6.
//
// Solidity: event ProofCreated(bytes32 indexed fileHash, address indexed owner, string cid, uint256 timestamp, string fileName, uint256 fileSize, string contentType)
func (_ProofStore *ProofStoreFilterer) FilterProofCreated(opts *bind.FilterOpts, fileHash [][32]byte, owner []common.Address) (*ProofStoreProofCreatedIterator, error) {

	var fileHashRule []interface{}
	for _, fileHashItem := range fileHash {
		fileHashRule = append(fileHashRule, fileHashItem)
	}
	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _ProofStore.contract.FilterLogs(opts, "ProofCreated", fileHashRule, ownerRule)
	if err != nil {
		return nil, err
	}
	return &ProofStoreProofCreatedIterator{contract: _ProofStore.contract, event: "ProofCreated", logs: logs, sub: sub}, nil
}

// WatchProofCreated is a free log subscription operation binding the contract event 0xc53fdb167ae4e7df825301fdf14ad957c5b7346bfc927cda990f52e27b3476a6.
//
// Solidity: event ProofCreated(bytes32 indexed fileHash, address indexed owner, string cid, uint256 timestamp, string fileName, uint256 fileSize, string contentType)
func (_ProofStore *ProofStoreFilterer) WatchProofCreated(opts *bind.WatchOpts, sink chan<- *ProofStoreProofCreated, fileHash [][32]byte, owner []common.Address) (event.Subscription, error) {

	var fileHashRule []interface{}
	for _, fileHashItem := range fileHash {
		fileHashRule = append(fileHashRule, fileHashItem)
	}
	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _ProofStore.contract.WatchLogs(opts, "ProofCreated", fileHashRule, ownerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(ProofStoreProofCreated)
				if err := _ProofStore.contract.UnpackLog(event, "ProofCreated", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseProofCreated is a log parse operation binding the contract event 0xc53fdb167ae4e7df825301fdf14ad957c5b7346bfc927cda990f52e27b3476a6.
//
// Solidity: event ProofCreated(bytes32 indexed fileHash, address indexed owner, string cid, uint256 timestamp, string fileName, uint256 fileSize, string contentType)
func (_ProofStore *ProofStoreFilterer) ParseProofCreated(log types.Log) (*ProofStoreProofCreated, error) {
	event := new(ProofStoreProofCreated)
	if err := _ProofStore.contract.UnpackLog(event, "ProofCreated", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
