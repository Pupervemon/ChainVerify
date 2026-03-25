import { Bt as InvalidChainIdError, a as maxUint256, s as defineTransactionRequest } from "./isAddressEqual-DXU8Mzf0.js";
import { C as isAddress, T as InvalidAddressError, _ as concatHex } from "./encodeFunctionData-YLQ8NBAq.js";
import { _ as trim, p as hexToBigInt, u as toHex, w as BaseError } from "./stringify-Bm23iD_D.js";
import { at as toRlp, et as defineBlock, nt as defineTransaction, rt as formatTransaction } from "./account-r4vEt8f4.js";
import { f as TipAboveFeeCapError, i as FeeCapTooHighError } from "./createBatchScheduler-D2ue-dEZ.js";
import { _ as toYParitySignatureArray, h as contracts, p as serializeTransaction$1, v as serializeAccessList } from "./sepolia-8_St3NiF.js";
import { t as defineChain } from "./defineChain-DOrIgftx.js";
//#region node_modules/viem/_esm/chains/definitions/anvil.js
var anvil = /* @__PURE__ */ defineChain({
	id: 31337,
	name: "Anvil",
	nativeCurrency: {
		decimals: 18,
		name: "Ether",
		symbol: "ETH"
	},
	rpcUrls: { default: {
		http: ["http://127.0.0.1:8545"],
		webSocket: ["ws://127.0.0.1:8545"]
	} }
});
//#endregion
//#region node_modules/viem/_esm/chains/definitions/arbitrumSepolia.js
var arbitrumSepolia = /* @__PURE__ */ defineChain({
	id: 421614,
	name: "Arbitrum Sepolia",
	blockTime: 250,
	nativeCurrency: {
		name: "Arbitrum Sepolia Ether",
		symbol: "ETH",
		decimals: 18
	},
	rpcUrls: { default: { http: ["https://sepolia-rollup.arbitrum.io/rpc"] } },
	blockExplorers: { default: {
		name: "Arbiscan",
		url: "https://sepolia.arbiscan.io",
		apiUrl: "https://api-sepolia.arbiscan.io/api"
	} },
	contracts: { multicall3: {
		address: "0xca11bde05977b3631167028862be2a173976ca11",
		blockCreated: 81930
	} },
	testnet: true
});
//#endregion
//#region node_modules/viem/_esm/chains/definitions/berachain.js
var berachain = /* @__PURE__ */ defineChain({
	id: 80094,
	name: "Berachain",
	blockTime: 2e3,
	nativeCurrency: {
		decimals: 18,
		name: "BERA Token",
		symbol: "BERA"
	},
	contracts: {
		multicall3: {
			address: "0xcA11bde05977b3631167028862bE2a173976CA11",
			blockCreated: 0
		},
		ensRegistry: {
			address: "0x5b22280886a2f5e09a49bea7e320eab0e5320e28",
			blockCreated: 877007
		},
		ensUniversalResolver: {
			address: "0x4D41762915F83c76EcaF6776d9b08076aA32b492",
			blockCreated: 9310021
		}
	},
	rpcUrls: { default: { http: ["https://rpc.berachain.com"] } },
	blockExplorers: { default: {
		name: "Berascan",
		url: "https://berascan.com"
	} },
	ensTlds: [".bera"],
	testnet: false
});
//#endregion
//#region node_modules/viem/_esm/chains/definitions/berachainBepolia.js
var berachainBepolia = /* @__PURE__ */ defineChain({
	id: 80069,
	blockTime: 2e3,
	name: "Berachain Bepolia",
	nativeCurrency: {
		decimals: 18,
		name: "BERA Token",
		symbol: "BERA"
	},
	contracts: { multicall3: {
		address: "0xcA11bde05977b3631167028862bE2a173976CA11",
		blockCreated: 0
	} },
	rpcUrls: { default: { http: ["https://bepolia.rpc.berachain.com"] } },
	blockExplorers: { default: {
		name: "Berascan",
		url: "https://bepolia.beratrail.io"
	} },
	testnet: true
});
//#endregion
//#region node_modules/viem/_esm/celo/fees.js
var fees = { estimateFeesPerGas: async (params) => {
	if (!params.request?.feeCurrency) return null;
	const [gasPrice, maxPriorityFeePerGas] = await Promise.all([estimateFeePerGasInFeeCurrency(params.client, params.request.feeCurrency), estimateMaxPriorityFeePerGasInFeeCurrency(params.client, params.request.feeCurrency)]);
	return {
		maxFeePerGas: params.multiply(gasPrice - maxPriorityFeePerGas) + maxPriorityFeePerGas,
		maxPriorityFeePerGas
	};
} };
async function estimateFeePerGasInFeeCurrency(client, feeCurrency) {
	const fee = await client.request({
		method: "eth_gasPrice",
		params: [feeCurrency]
	});
	return BigInt(fee);
}
async function estimateMaxPriorityFeePerGasInFeeCurrency(client, feeCurrency) {
	const feesPerGas = await client.request({
		method: "eth_maxPriorityFeePerGas",
		params: [feeCurrency]
	});
	return BigInt(feesPerGas);
}
//#endregion
//#region node_modules/viem/_esm/celo/utils.js
function isEmpty(value) {
	return value === 0 || value === 0n || value === void 0 || value === null || value === "0" || value === "" || typeof value === "string" && (trim(value).toLowerCase() === "0x" || trim(value).toLowerCase() === "0x00");
}
function isPresent(value) {
	return !isEmpty(value);
}
/** @internal */
function isEIP1559(transaction) {
	return typeof transaction.maxFeePerGas !== "undefined" && typeof transaction.maxPriorityFeePerGas !== "undefined";
}
function isCIP64(transaction) {
	if (transaction.type === "cip64") return true;
	return isEIP1559(transaction) && isPresent(transaction.feeCurrency);
}
//#endregion
//#region node_modules/viem/_esm/celo/formatters.js
var formatters = {
	block: /* @__PURE__ */ defineBlock({ format(args) {
		return { transactions: args.transactions?.map((transaction) => {
			if (typeof transaction === "string") return transaction;
			return {
				...formatTransaction(transaction),
				...transaction.gatewayFee ? {
					gatewayFee: hexToBigInt(transaction.gatewayFee),
					gatewayFeeRecipient: transaction.gatewayFeeRecipient
				} : {},
				feeCurrency: transaction.feeCurrency
			};
		}) };
	} }),
	transaction: /* @__PURE__ */ defineTransaction({ format(args) {
		if (args.type === "0x7e") return {
			isSystemTx: args.isSystemTx,
			mint: args.mint ? hexToBigInt(args.mint) : void 0,
			sourceHash: args.sourceHash,
			type: "deposit"
		};
		const transaction = { feeCurrency: args.feeCurrency };
		if (args.type === "0x7b") transaction.type = "cip64";
		else {
			if (args.type === "0x7c") transaction.type = "cip42";
			transaction.gatewayFee = args.gatewayFee ? hexToBigInt(args.gatewayFee) : null;
			transaction.gatewayFeeRecipient = args.gatewayFeeRecipient;
		}
		return transaction;
	} }),
	transactionRequest: /* @__PURE__ */ defineTransactionRequest({ format(args) {
		const request = {};
		if (args.feeCurrency) request.feeCurrency = args.feeCurrency;
		if (isCIP64(args)) request.type = "0x7b";
		return request;
	} })
};
//#endregion
//#region node_modules/viem/_esm/celo/serializers.js
function serializeTransaction(transaction, signature) {
	if (isCIP64(transaction)) return serializeTransactionCIP64(transaction, signature);
	return serializeTransaction$1(transaction, signature);
}
var serializers = { transaction: serializeTransaction };
function serializeTransactionCIP64(transaction, signature) {
	assertTransactionCIP64(transaction);
	const { chainId, gas, nonce, to, value, maxFeePerGas, maxPriorityFeePerGas, accessList, feeCurrency, data } = transaction;
	return concatHex(["0x7b", toRlp([
		toHex(chainId),
		nonce ? toHex(nonce) : "0x",
		maxPriorityFeePerGas ? toHex(maxPriorityFeePerGas) : "0x",
		maxFeePerGas ? toHex(maxFeePerGas) : "0x",
		gas ? toHex(gas) : "0x",
		to ?? "0x",
		value ? toHex(value) : "0x",
		data ?? "0x",
		serializeAccessList(accessList),
		feeCurrency,
		...toYParitySignatureArray(transaction, signature)
	])]);
}
var MAX_MAX_FEE_PER_GAS = maxUint256;
function assertTransactionCIP64(transaction) {
	const { chainId, maxPriorityFeePerGas, gasPrice, maxFeePerGas, to, feeCurrency } = transaction;
	if (chainId <= 0) throw new InvalidChainIdError({ chainId });
	if (to && !isAddress(to)) throw new InvalidAddressError({ address: to });
	if (gasPrice) throw new BaseError("`gasPrice` is not a valid CIP-64 Transaction attribute.");
	if (isPresent(maxFeePerGas) && maxFeePerGas > MAX_MAX_FEE_PER_GAS) throw new FeeCapTooHighError({ maxFeePerGas });
	if (isPresent(maxPriorityFeePerGas) && isPresent(maxFeePerGas) && maxPriorityFeePerGas > maxFeePerGas) throw new TipAboveFeeCapError({
		maxFeePerGas,
		maxPriorityFeePerGas
	});
	if (isPresent(feeCurrency) && !isAddress(feeCurrency)) throw new BaseError("`feeCurrency` MUST be a token address for CIP-64 transactions.");
	if (isEmpty(feeCurrency)) throw new BaseError("`feeCurrency` must be provided for CIP-64 transactions.");
}
//#endregion
//#region node_modules/viem/_esm/celo/chainConfig.js
var chainConfig = {
	blockTime: 1e3,
	contracts,
	formatters,
	serializers,
	fees
};
//#endregion
//#region node_modules/viem/_esm/chains/definitions/celo.js
var celo = /* @__PURE__ */ defineChain({
	...chainConfig,
	id: 42220,
	name: "Celo",
	nativeCurrency: {
		decimals: 18,
		name: "CELO",
		symbol: "CELO"
	},
	rpcUrls: { default: { http: ["https://forno.celo.org"] } },
	blockExplorers: { default: {
		name: "Celo Explorer",
		url: "https://celoscan.io",
		apiUrl: "https://api.celoscan.io/api"
	} },
	contracts: { multicall3: {
		address: "0xcA11bde05977b3631167028862bE2a173976CA11",
		blockCreated: 13112599
	} },
	testnet: false
});
//#endregion
//#region node_modules/viem/_esm/chains/definitions/gnosis.js
var gnosis = /* @__PURE__ */ defineChain({
	id: 100,
	name: "Gnosis",
	nativeCurrency: {
		decimals: 18,
		name: "xDAI",
		symbol: "XDAI"
	},
	blockTime: 5e3,
	rpcUrls: { default: {
		http: ["https://rpc.gnosischain.com"],
		webSocket: ["wss://rpc.gnosischain.com/wss"]
	} },
	blockExplorers: { default: {
		name: "Gnosisscan",
		url: "https://gnosisscan.io",
		apiUrl: "https://api.gnosisscan.io/api"
	} },
	contracts: { multicall3: {
		address: "0xca11bde05977b3631167028862be2a173976ca11",
		blockCreated: 21022491
	} }
});
//#endregion
//#region node_modules/viem/_esm/chains/definitions/hoodi.js
var hoodi = /* @__PURE__ */ defineChain({
	id: 560048,
	name: "Hoodi",
	nativeCurrency: {
		name: "Hoodi Ether",
		symbol: "ETH",
		decimals: 18
	},
	rpcUrls: { default: { http: ["https://rpc.hoodi.ethpandaops.io"] } },
	blockExplorers: { default: {
		name: "Etherscan",
		url: "https://hoodi.etherscan.io"
	} },
	contracts: { multicall3: {
		address: "0xcA11bde05977b3631167028862bE2a173976CA11",
		blockCreated: 2589
	} },
	testnet: true
});
//#endregion
//#region node_modules/viem/_esm/chains/definitions/katana.js
var katana = /* @__PURE__ */ defineChain({
	id: 747474,
	name: "Katana",
	network: "katana",
	nativeCurrency: {
		name: "Ether",
		symbol: "ETH",
		decimals: 18
	},
	rpcUrls: { default: { http: ["https://rpc.katana.network"] } },
	blockExplorers: { default: {
		name: "katana explorer",
		url: "https://katanascan.com"
	} },
	testnet: false
});
//#endregion
export { chainConfig as a, arbitrumSepolia as c, celo as i, anvil as l, hoodi as n, berachainBepolia as o, gnosis as r, berachain as s, katana as t };

//# sourceMappingURL=katana-CvyhsLGQ.js.map