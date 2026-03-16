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

// ProofStoreProof is an auto generated low-level Go binding around an user-defined struct.
type ProofStoreProof struct {
	WalletAddress common.Address
	FileHash      string
	FileName      string
	FileSize      *big.Int
	ContentType   string
	Cid           string
	Timestamp     *big.Int
}

// ProofStoreMetaData contains all meta data concerning the ProofStore contract.
var ProofStoreMetaData = &bind.MetaData{
	ABI: "[{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"walletAddress\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"string\",\"name\":\"fileHash\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"cid\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"name\":\"ProofCreated\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"_fileHash\",\"type\":\"string\"}],\"name\":\"getProof\",\"outputs\":[{\"components\":[{\"internalType\":\"address\",\"name\":\"walletAddress\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"fileHash\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"fileName\",\"type\":\"string\"},{\"internalType\":\"uint256\",\"name\":\"fileSize\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"contentType\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"cid\",\"type\":\"string\"},{\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"internalType\":\"structProofStore.Proof\",\"name\":\"\",\"type\":\"tuple\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_user\",\"type\":\"address\"}],\"name\":\"getUserProofs\",\"outputs\":[{\"internalType\":\"string[]\",\"name\":\"\",\"type\":\"string[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"_fileHash\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"_fileName\",\"type\":\"string\"},{\"internalType\":\"uint256\",\"name\":\"_fileSize\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"_contentType\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"_cid\",\"type\":\"string\"}],\"name\":\"storeProof\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"totalProofs\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"_fileHash\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"_cid\",\"type\":\"string\"}],\"name\":\"verifyProof\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]",
	Bin: "0x6080604052348015600e575f5ffd5b506116628061001c5f395ff3fe608060405234801561000f575f5ffd5b5060043610610055575f3560e01c80632ded3568146100595780633f86f8191461007757806346bdfb801461009357806378939fad146100c3578063d57763a1146100f3575b5f5ffd5b610061610123565b60405161006e9190610975565b60405180910390f35b610091600480360381019061008c9190610b05565b610129565b005b6100ad60048036038101906100a89190610c46565b61042c565b6040516100ba9190610d8c565b60405180910390f35b6100dd60048036038101906100d89190610dac565b61053d565b6040516100ea9190610e3c565b60405180910390f35b61010d60048036038101906101089190610e55565b6105c0565b60405161011a9190610f68565b60405180910390f35b60025481565b5f85511161016c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161016390611008565b60405180910390fd5b5f8151116101af576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101a690611070565b60405180910390fd5b5f5f866040516101bf91906110c8565b908152602001604051809103902060010180546101db9061110b565b90501461021d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610214906111ab565b60405180910390fd5b5f6040518060e001604052803373ffffffffffffffffffffffffffffffffffffffff168152602001878152602001868152602001858152602001848152602001838152602001428152509050805f8760405161027991906110c8565b90815260200160405180910390205f820151815f015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160010190816102e09190611369565b5060408201518160020190816102f69190611369565b506060820151816003015560808201518160040190816103169190611369565b5060a082015181600501908161032c9190611369565b5060c0820151816006015590505060015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2086908060018154018082558091505060019003905f5260205f20015f9091909190915090816103a69190611369565b5060025f8154809291906103b990611465565b9190505550856040516103cc91906110c8565b60405180910390203373ffffffffffffffffffffffffffffffffffffffff167fe8932153cac222c948293560d66f0332ff70e8e7d0ce4d7286f8a693781bbdee844260405161041c9291906114e4565b60405180910390a3505050505050565b606060015f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20805480602002602001604051908101604052809291908181526020015f905b82821015610532578382905f5260205f200180546104a79061110b565b80601f01602080910402602001604051908101604052809291908181526020018280546104d39061110b565b801561051e5780601f106104f55761010080835404028352916020019161051e565b820191905f5260205f20905b81548152906001019060200180831161050157829003601f168201915b50505050508152602001906001019061048a565b505050509050919050565b5f5f5f8460405161054e91906110c8565b9081526020016040518091039020600101805461056a9061110b565b905003610579575f90506105ba565b81805190602001205f8460405161059091906110c8565b90815260200160405180910390206005016040516105ae91906115ae565b60405180910390201490505b92915050565b6105c861090d565b5f5f836040516105d891906110c8565b908152602001604051809103902060010180546105f49061110b565b905011610636576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161062d9061160e565b60405180910390fd5b5f8260405161064591906110c8565b90815260200160405180910390206040518060e00160405290815f82015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016001820180546106c29061110b565b80601f01602080910402602001604051908101604052809291908181526020018280546106ee9061110b565b80156107395780601f1061071057610100808354040283529160200191610739565b820191905f5260205f20905b81548152906001019060200180831161071c57829003601f168201915b505050505081526020016002820180546107529061110b565b80601f016020809104026020016040519081016040528092919081815260200182805461077e9061110b565b80156107c95780601f106107a0576101008083540402835291602001916107c9565b820191905f5260205f20905b8154815290600101906020018083116107ac57829003601f168201915b50505050508152602001600382015481526020016004820180546107ec9061110b565b80601f01602080910402602001604051908101604052809291908181526020018280546108189061110b565b80156108635780601f1061083a57610100808354040283529160200191610863565b820191905f5260205f20905b81548152906001019060200180831161084657829003601f168201915b5050505050815260200160058201805461087c9061110b565b80601f01602080910402602001604051908101604052809291908181526020018280546108a89061110b565b80156108f35780601f106108ca576101008083540402835291602001916108f3565b820191905f5260205f20905b8154815290600101906020018083116108d657829003601f168201915b505050505081526020016006820154815250509050919050565b6040518060e001604052805f73ffffffffffffffffffffffffffffffffffffffff16815260200160608152602001606081526020015f815260200160608152602001606081526020015f81525090565b5f819050919050565b61096f8161095d565b82525050565b5f6020820190506109885f830184610966565b92915050565b5f604051905090565b5f5ffd5b5f5ffd5b5f5ffd5b5f5ffd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b6109ed826109a7565b810181811067ffffffffffffffff82111715610a0c57610a0b6109b7565b5b80604052505050565b5f610a1e61098e565b9050610a2a82826109e4565b919050565b5f67ffffffffffffffff821115610a4957610a486109b7565b5b610a52826109a7565b9050602081019050919050565b828183375f83830152505050565b5f610a7f610a7a84610a2f565b610a15565b905082815260208101848484011115610a9b57610a9a6109a3565b5b610aa6848285610a5f565b509392505050565b5f82601f830112610ac257610ac161099f565b5b8135610ad2848260208601610a6d565b91505092915050565b610ae48161095d565b8114610aee575f5ffd5b50565b5f81359050610aff81610adb565b92915050565b5f5f5f5f5f60a08688031215610b1e57610b1d610997565b5b5f86013567ffffffffffffffff811115610b3b57610b3a61099b565b5b610b4788828901610aae565b955050602086013567ffffffffffffffff811115610b6857610b6761099b565b5b610b7488828901610aae565b9450506040610b8588828901610af1565b935050606086013567ffffffffffffffff811115610ba657610ba561099b565b5b610bb288828901610aae565b925050608086013567ffffffffffffffff811115610bd357610bd261099b565b5b610bdf88828901610aae565b9150509295509295909350565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f610c1582610bec565b9050919050565b610c2581610c0b565b8114610c2f575f5ffd5b50565b5f81359050610c4081610c1c565b92915050565b5f60208284031215610c5b57610c5a610997565b5b5f610c6884828501610c32565b91505092915050565b5f81519050919050565b5f82825260208201905092915050565b5f819050602082019050919050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f610ccc82610c9a565b610cd68185610ca4565b9350610ce6818560208601610cb4565b610cef816109a7565b840191505092915050565b5f610d058383610cc2565b905092915050565b5f602082019050919050565b5f610d2382610c71565b610d2d8185610c7b565b935083602082028501610d3f85610c8b565b805f5b85811015610d7a5784840389528151610d5b8582610cfa565b9450610d6683610d0d565b925060208a01995050600181019050610d42565b50829750879550505050505092915050565b5f6020820190508181035f830152610da48184610d19565b905092915050565b5f5f60408385031215610dc257610dc1610997565b5b5f83013567ffffffffffffffff811115610ddf57610dde61099b565b5b610deb85828601610aae565b925050602083013567ffffffffffffffff811115610e0c57610e0b61099b565b5b610e1885828601610aae565b9150509250929050565b5f8115159050919050565b610e3681610e22565b82525050565b5f602082019050610e4f5f830184610e2d565b92915050565b5f60208284031215610e6a57610e69610997565b5b5f82013567ffffffffffffffff811115610e8757610e8661099b565b5b610e9384828501610aae565b91505092915050565b610ea581610c0b565b82525050565b610eb48161095d565b82525050565b5f60e083015f830151610ecf5f860182610e9c565b5060208301518482036020860152610ee78282610cc2565b91505060408301518482036040860152610f018282610cc2565b9150506060830151610f166060860182610eab565b5060808301518482036080860152610f2e8282610cc2565b91505060a083015184820360a0860152610f488282610cc2565b91505060c0830151610f5d60c0860182610eab565b508091505092915050565b5f6020820190508181035f830152610f808184610eba565b905092915050565b5f82825260208201905092915050565b7f50726f6f6653746f72653a2066696c65486173682063616e6e6f7420626520655f8201527f6d70747900000000000000000000000000000000000000000000000000000000602082015250565b5f610ff2602483610f88565b9150610ffd82610f98565b604082019050919050565b5f6020820190508181035f83015261101f81610fe6565b9050919050565b7f50726f6f6653746f72653a206369642063616e6e6f7420626520656d707479005f82015250565b5f61105a601f83610f88565b915061106582611026565b602082019050919050565b5f6020820190508181035f8301526110878161104e565b9050919050565b5f81905092915050565b5f6110a282610c9a565b6110ac818561108e565b93506110bc818560208601610cb4565b80840191505092915050565b5f6110d38284611098565b915081905092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061112257607f821691505b602082108103611135576111346110de565b5b50919050565b7f50726f6f6653746f72653a2066696c65206861736820616c72656164792065785f8201527f6973747300000000000000000000000000000000000000000000000000000000602082015250565b5f611195602483610f88565b91506111a08261113b565b604082019050919050565b5f6020820190508181035f8301526111c281611189565b9050919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f600883026112257fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826111ea565b61122f86836111ea565b95508019841693508086168417925050509392505050565b5f819050919050565b5f61126a6112656112608461095d565b611247565b61095d565b9050919050565b5f819050919050565b61128383611250565b61129761128f82611271565b8484546111f6565b825550505050565b5f5f905090565b6112ae61129f565b6112b981848461127a565b505050565b5b818110156112dc576112d15f826112a6565b6001810190506112bf565b5050565b601f821115611321576112f2816111c9565b6112fb846111db565b8101602085101561130a578190505b61131e611316856111db565b8301826112be565b50505b505050565b5f82821c905092915050565b5f6113415f1984600802611326565b1980831691505092915050565b5f6113598383611332565b9150826002028217905092915050565b61137282610c9a565b67ffffffffffffffff81111561138b5761138a6109b7565b5b611395825461110b565b6113a08282856112e0565b5f60209050601f8311600181146113d1575f84156113bf578287015190505b6113c9858261134e565b865550611430565b601f1984166113df866111c9565b5f5b82811015611406578489015182556001820191506020850194506020810190506113e1565b86831015611423578489015161141f601f891682611332565b8355505b6001600288020188555050505b505050505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61146f8261095d565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82036114a1576114a0611438565b5b600182019050919050565b5f6114b682610c9a565b6114c08185610f88565b93506114d0818560208601610cb4565b6114d9816109a7565b840191505092915050565b5f6040820190508181035f8301526114fc81856114ac565b905061150b6020830184610966565b9392505050565b5f81905092915050565b5f819050815f5260205f209050919050565b5f815461153a8161110b565b6115448186611512565b9450600182165f811461155e5760018114611573576115a5565b60ff19831686528115158202860193506115a5565b61157c8561151c565b5f5b8381101561159d5781548189015260018201915060208101905061157e565b838801955050505b50505092915050565b5f6115b9828461152e565b915081905092915050565b7f50726f6f6653746f72653a2070726f6f66206e6f7420666f756e6400000000005f82015250565b5f6115f8601b83610f88565b9150611603826115c4565b602082019050919050565b5f6020820190508181035f830152611625816115ec565b905091905056fea264697066735822122031c9a8eab435a7223da18893ca7ee77a656c1b1599fc835e71fc0df9e4d0f45264736f6c634300081e0033",
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

// GetProof is a free data retrieval call binding the contract method 0xd57763a1.
//
// Solidity: function getProof(string _fileHash) view returns((address,string,string,uint256,string,string,uint256))
func (_ProofStore *ProofStoreCaller) GetProof(opts *bind.CallOpts, _fileHash string) (ProofStoreProof, error) {
	var out []interface{}
	err := _ProofStore.contract.Call(opts, &out, "getProof", _fileHash)

	if err != nil {
		return *new(ProofStoreProof), err
	}

	out0 := *abi.ConvertType(out[0], new(ProofStoreProof)).(*ProofStoreProof)

	return out0, err

}

// GetProof is a free data retrieval call binding the contract method 0xd57763a1.
//
// Solidity: function getProof(string _fileHash) view returns((address,string,string,uint256,string,string,uint256))
func (_ProofStore *ProofStoreSession) GetProof(_fileHash string) (ProofStoreProof, error) {
	return _ProofStore.Contract.GetProof(&_ProofStore.CallOpts, _fileHash)
}

// GetProof is a free data retrieval call binding the contract method 0xd57763a1.
//
// Solidity: function getProof(string _fileHash) view returns((address,string,string,uint256,string,string,uint256))
func (_ProofStore *ProofStoreCallerSession) GetProof(_fileHash string) (ProofStoreProof, error) {
	return _ProofStore.Contract.GetProof(&_ProofStore.CallOpts, _fileHash)
}

// GetUserProofs is a free data retrieval call binding the contract method 0x46bdfb80.
//
// Solidity: function getUserProofs(address _user) view returns(string[])
func (_ProofStore *ProofStoreCaller) GetUserProofs(opts *bind.CallOpts, _user common.Address) ([]string, error) {
	var out []interface{}
	err := _ProofStore.contract.Call(opts, &out, "getUserProofs", _user)

	if err != nil {
		return *new([]string), err
	}

	out0 := *abi.ConvertType(out[0], new([]string)).(*[]string)

	return out0, err

}

// GetUserProofs is a free data retrieval call binding the contract method 0x46bdfb80.
//
// Solidity: function getUserProofs(address _user) view returns(string[])
func (_ProofStore *ProofStoreSession) GetUserProofs(_user common.Address) ([]string, error) {
	return _ProofStore.Contract.GetUserProofs(&_ProofStore.CallOpts, _user)
}

// GetUserProofs is a free data retrieval call binding the contract method 0x46bdfb80.
//
// Solidity: function getUserProofs(address _user) view returns(string[])
func (_ProofStore *ProofStoreCallerSession) GetUserProofs(_user common.Address) ([]string, error) {
	return _ProofStore.Contract.GetUserProofs(&_ProofStore.CallOpts, _user)
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

// VerifyProof is a free data retrieval call binding the contract method 0x78939fad.
//
// Solidity: function verifyProof(string _fileHash, string _cid) view returns(bool)
func (_ProofStore *ProofStoreCaller) VerifyProof(opts *bind.CallOpts, _fileHash string, _cid string) (bool, error) {
	var out []interface{}
	err := _ProofStore.contract.Call(opts, &out, "verifyProof", _fileHash, _cid)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// VerifyProof is a free data retrieval call binding the contract method 0x78939fad.
//
// Solidity: function verifyProof(string _fileHash, string _cid) view returns(bool)
func (_ProofStore *ProofStoreSession) VerifyProof(_fileHash string, _cid string) (bool, error) {
	return _ProofStore.Contract.VerifyProof(&_ProofStore.CallOpts, _fileHash, _cid)
}

// VerifyProof is a free data retrieval call binding the contract method 0x78939fad.
//
// Solidity: function verifyProof(string _fileHash, string _cid) view returns(bool)
func (_ProofStore *ProofStoreCallerSession) VerifyProof(_fileHash string, _cid string) (bool, error) {
	return _ProofStore.Contract.VerifyProof(&_ProofStore.CallOpts, _fileHash, _cid)
}

// StoreProof is a paid mutator transaction binding the contract method 0x3f86f819.
//
// Solidity: function storeProof(string _fileHash, string _fileName, uint256 _fileSize, string _contentType, string _cid) returns()
func (_ProofStore *ProofStoreTransactor) StoreProof(opts *bind.TransactOpts, _fileHash string, _fileName string, _fileSize *big.Int, _contentType string, _cid string) (*types.Transaction, error) {
	return _ProofStore.contract.Transact(opts, "storeProof", _fileHash, _fileName, _fileSize, _contentType, _cid)
}

// StoreProof is a paid mutator transaction binding the contract method 0x3f86f819.
//
// Solidity: function storeProof(string _fileHash, string _fileName, uint256 _fileSize, string _contentType, string _cid) returns()
func (_ProofStore *ProofStoreSession) StoreProof(_fileHash string, _fileName string, _fileSize *big.Int, _contentType string, _cid string) (*types.Transaction, error) {
	return _ProofStore.Contract.StoreProof(&_ProofStore.TransactOpts, _fileHash, _fileName, _fileSize, _contentType, _cid)
}

// StoreProof is a paid mutator transaction binding the contract method 0x3f86f819.
//
// Solidity: function storeProof(string _fileHash, string _fileName, uint256 _fileSize, string _contentType, string _cid) returns()
func (_ProofStore *ProofStoreTransactorSession) StoreProof(_fileHash string, _fileName string, _fileSize *big.Int, _contentType string, _cid string) (*types.Transaction, error) {
	return _ProofStore.Contract.StoreProof(&_ProofStore.TransactOpts, _fileHash, _fileName, _fileSize, _contentType, _cid)
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
	WalletAddress common.Address
	FileHash      common.Hash
	Cid           string
	Timestamp     *big.Int
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterProofCreated is a free log retrieval operation binding the contract event 0xe8932153cac222c948293560d66f0332ff70e8e7d0ce4d7286f8a693781bbdee.
//
// Solidity: event ProofCreated(address indexed walletAddress, string indexed fileHash, string cid, uint256 timestamp)
func (_ProofStore *ProofStoreFilterer) FilterProofCreated(opts *bind.FilterOpts, walletAddress []common.Address, fileHash []string) (*ProofStoreProofCreatedIterator, error) {

	var walletAddressRule []interface{}
	for _, walletAddressItem := range walletAddress {
		walletAddressRule = append(walletAddressRule, walletAddressItem)
	}
	var fileHashRule []interface{}
	for _, fileHashItem := range fileHash {
		fileHashRule = append(fileHashRule, fileHashItem)
	}

	logs, sub, err := _ProofStore.contract.FilterLogs(opts, "ProofCreated", walletAddressRule, fileHashRule)
	if err != nil {
		return nil, err
	}
	return &ProofStoreProofCreatedIterator{contract: _ProofStore.contract, event: "ProofCreated", logs: logs, sub: sub}, nil
}

// WatchProofCreated is a free log subscription operation binding the contract event 0xe8932153cac222c948293560d66f0332ff70e8e7d0ce4d7286f8a693781bbdee.
//
// Solidity: event ProofCreated(address indexed walletAddress, string indexed fileHash, string cid, uint256 timestamp)
func (_ProofStore *ProofStoreFilterer) WatchProofCreated(opts *bind.WatchOpts, sink chan<- *ProofStoreProofCreated, walletAddress []common.Address, fileHash []string) (event.Subscription, error) {

	var walletAddressRule []interface{}
	for _, walletAddressItem := range walletAddress {
		walletAddressRule = append(walletAddressRule, walletAddressItem)
	}
	var fileHashRule []interface{}
	for _, fileHashItem := range fileHash {
		fileHashRule = append(fileHashRule, fileHashItem)
	}

	logs, sub, err := _ProofStore.contract.WatchLogs(opts, "ProofCreated", walletAddressRule, fileHashRule)
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

// ParseProofCreated is a log parse operation binding the contract event 0xe8932153cac222c948293560d66f0332ff70e8e7d0ce4d7286f8a693781bbdee.
//
// Solidity: event ProofCreated(address indexed walletAddress, string indexed fileHash, string cid, uint256 timestamp)
func (_ProofStore *ProofStoreFilterer) ParseProofCreated(log types.Log) (*ProofStoreProofCreated, error) {
	event := new(ProofStoreProofCreated)
	if err := _ProofStore.contract.UnpackLog(event, "ProofCreated", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
