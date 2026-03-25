import { s as __toESM } from "./chunk-t8Qwt55I.js";
import { Dt as TransactionExecutionError, E as fromString, Gt as parseSignature, It as parseAccount, Jt as InvalidAbiItemError, L as validate, Mt as prettyPrint, Nt as formatEther, Q as BaseError, Rt as ChainMismatchError, Ut as parseStructs, Yt as isStructSignature, c as formatTransactionRequest, f as getNodeError, j as slice, o as serializeStateOverride, r as assertRequest, u as extract, zt as ChainNotFoundError } from "./isAddressEqual-DXU8Mzf0.js";
import { a as formatAbiItem, b as sliceHex, g as concat, t as encodeFunctionData } from "./encodeFunctionData-YLQ8NBAq.js";
import { _ as trim, c as numberToHex, h as hexToNumber, n as LruMap, p as hexToBigInt, t as stringify, w as BaseError$1 } from "./stringify-Bm23iD_D.js";
import { $ as blobsToCommitments, G as getTransactionType, H as receiptStatuses, K as toBlobSidecars, P as keccak256, Q as blobsToProofs, X as commitmentsToVersionedHashes, ct as getAction, it as recoverAuthorizationAddress, j as validate$1, n as AccountTypeNotSupportedError, ot as readContract, rt as formatTransaction, t as AccountNotFoundError, tt as formatBlock } from "./account-r4vEt8f4.js";
import { R as UnsupportedNonOptionalCapabilityError, Y as formatGwei, g as AtomicityNotSupportedError, m as UnknownNodeError, n as withResolvers } from "./createBatchScheduler-D2ue-dEZ.js";
import { c as withRetry, i as uid, l as wait } from "./http-DRuaSs_V.js";
import { t as require_eventemitter3 } from "./eventemitter3--nuI5ZCb.js";
//#region node_modules/abitype/dist/esm/human-readable/parseAbiItem.js
/**
* Parses human-readable ABI item (e.g. error, event, function) into {@link Abi} item
*
* @param signature - Human-readable ABI item
* @returns Parsed {@link Abi} item
*
* @example
* const abiItem = parseAbiItem('function balanceOf(address owner) view returns (uint256)')
* //    ^? const abiItem: { name: "balanceOf"; type: "function"; stateMutability: "view";...
*
* @example
* const abiItem = parseAbiItem([
*   //  ^? const abiItem: { name: "foo"; type: "function"; stateMutability: "view"; inputs:...
*   'function foo(Baz bar) view returns (string)',
*   'struct Baz { string name; }',
* ])
*/
function parseAbiItem(signature) {
	let abiItem;
	if (typeof signature === "string") abiItem = parseSignature(signature);
	else {
		const structs = parseStructs(signature);
		const length = signature.length;
		for (let i = 0; i < length; i++) {
			const signature_ = signature[i];
			if (isStructSignature(signature_)) continue;
			abiItem = parseSignature(signature_, structs);
			break;
		}
	}
	if (!abiItem) throw new InvalidAbiItemError({ signature });
	return abiItem;
}
//#endregion
//#region node_modules/viem/_esm/errors/estimateGas.js
var EstimateGasExecutionError = class extends BaseError$1 {
	constructor(cause, { account, docsPath, chain, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value }) {
		const prettyArgs = prettyPrint({
			from: account?.address,
			to,
			value: typeof value !== "undefined" && `${formatEther(value)} ${chain?.nativeCurrency?.symbol || "ETH"}`,
			data,
			gas,
			gasPrice: typeof gasPrice !== "undefined" && `${formatGwei(gasPrice)} gwei`,
			maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${formatGwei(maxFeePerGas)} gwei`,
			maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${formatGwei(maxPriorityFeePerGas)} gwei`,
			nonce
		});
		super(cause.shortMessage, {
			cause,
			docsPath,
			metaMessages: [
				...cause.metaMessages ? [...cause.metaMessages, " "] : [],
				"Estimate Gas Arguments:",
				prettyArgs
			].filter(Boolean),
			name: "EstimateGasExecutionError"
		});
		Object.defineProperty(this, "cause", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.cause = cause;
	}
};
//#endregion
//#region node_modules/viem/_esm/utils/errors/getEstimateGasError.js
function getEstimateGasError(err, { docsPath, ...args }) {
	return new EstimateGasExecutionError((() => {
		const cause = getNodeError(err, args);
		if (cause instanceof UnknownNodeError) return err;
		return cause;
	})(), {
		docsPath,
		...args
	});
}
//#endregion
//#region node_modules/viem/_esm/errors/fee.js
var BaseFeeScalarError = class extends BaseError$1 {
	constructor() {
		super("`baseFeeMultiplier` must be greater than 1.", { name: "BaseFeeScalarError" });
	}
};
var Eip1559FeesNotSupportedError = class extends BaseError$1 {
	constructor() {
		super("Chain does not support EIP-1559 fees.", { name: "Eip1559FeesNotSupportedError" });
	}
};
var MaxFeePerGasTooLowError = class extends BaseError$1 {
	constructor({ maxPriorityFeePerGas }) {
		super(`\`maxFeePerGas\` cannot be less than the \`maxPriorityFeePerGas\` (${formatGwei(maxPriorityFeePerGas)} gwei).`, { name: "MaxFeePerGasTooLowError" });
	}
};
//#endregion
//#region node_modules/viem/_esm/errors/block.js
var BlockNotFoundError = class extends BaseError$1 {
	constructor({ blockHash, blockNumber }) {
		let identifier = "Block";
		if (blockHash) identifier = `Block at hash "${blockHash}"`;
		if (blockNumber) identifier = `Block at number "${blockNumber}"`;
		super(`${identifier} could not be found.`, { name: "BlockNotFoundError" });
	}
};
//#endregion
//#region node_modules/viem/_esm/actions/public/getBlock.js
/**
* Returns information about a block at a block number, hash, or tag.
*
* - Docs: https://viem.sh/docs/actions/public/getBlock
* - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_fetching-blocks
* - JSON-RPC Methods:
*   - Calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbynumber) for `blockNumber` & `blockTag`.
*   - Calls [`eth_getBlockByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbyhash) for `blockHash`.
*
* @param client - Client to use
* @param parameters - {@link GetBlockParameters}
* @returns Information about the block. {@link GetBlockReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getBlock } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const block = await getBlock(client)
*/
async function getBlock(client, { blockHash, blockNumber, blockTag = client.experimental_blockTag ?? "latest", includeTransactions: includeTransactions_ } = {}) {
	const includeTransactions = includeTransactions_ ?? false;
	const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
	let block = null;
	if (blockHash) block = await client.request({
		method: "eth_getBlockByHash",
		params: [blockHash, includeTransactions]
	}, { dedupe: true });
	else block = await client.request({
		method: "eth_getBlockByNumber",
		params: [blockNumberHex || blockTag, includeTransactions]
	}, { dedupe: Boolean(blockNumberHex) });
	if (!block) throw new BlockNotFoundError({
		blockHash,
		blockNumber
	});
	return (client.chain?.formatters?.block?.format || formatBlock)(block, "getBlock");
}
//#endregion
//#region node_modules/viem/_esm/actions/public/getGasPrice.js
/**
* Returns the current price of gas (in wei).
*
* - Docs: https://viem.sh/docs/actions/public/getGasPrice
* - JSON-RPC Methods: [`eth_gasPrice`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gasprice)
*
* @param client - Client to use
* @returns The gas price (in wei). {@link GetGasPriceReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getGasPrice } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const gasPrice = await getGasPrice(client)
*/
async function getGasPrice(client) {
	const gasPrice = await client.request({ method: "eth_gasPrice" });
	return BigInt(gasPrice);
}
//#endregion
//#region node_modules/viem/_esm/actions/public/estimateMaxPriorityFeePerGas.js
/**
* Returns an estimate for the max priority fee per gas (in wei) for a
* transaction to be likely included in the next block.
* Defaults to [`chain.fees.defaultPriorityFee`](/docs/clients/chains#fees-defaultpriorityfee) if set.
*
* - Docs: https://viem.sh/docs/actions/public/estimateMaxPriorityFeePerGas
*
* @param client - Client to use
* @returns An estimate (in wei) for the max priority fee per gas. {@link EstimateMaxPriorityFeePerGasReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { estimateMaxPriorityFeePerGas } from 'viem/actions'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const maxPriorityFeePerGas = await estimateMaxPriorityFeePerGas(client)
* // 10000000n
*/
async function estimateMaxPriorityFeePerGas(client, args) {
	return internal_estimateMaxPriorityFeePerGas(client, args);
}
async function internal_estimateMaxPriorityFeePerGas(client, args) {
	const { block: block_, chain = client.chain, request } = args || {};
	try {
		const maxPriorityFeePerGas = chain?.fees?.maxPriorityFeePerGas ?? chain?.fees?.defaultPriorityFee;
		if (typeof maxPriorityFeePerGas === "function") {
			const maxPriorityFeePerGas_ = await maxPriorityFeePerGas({
				block: block_ || await getAction(client, getBlock, "getBlock")({}),
				client,
				request
			});
			if (maxPriorityFeePerGas_ === null) throw new Error();
			return maxPriorityFeePerGas_;
		}
		if (typeof maxPriorityFeePerGas !== "undefined") return maxPriorityFeePerGas;
		return hexToBigInt(await client.request({ method: "eth_maxPriorityFeePerGas" }));
	} catch {
		const [block, gasPrice] = await Promise.all([block_ ? Promise.resolve(block_) : getAction(client, getBlock, "getBlock")({}), getAction(client, getGasPrice, "getGasPrice")({})]);
		if (typeof block.baseFeePerGas !== "bigint") throw new Eip1559FeesNotSupportedError();
		const maxPriorityFeePerGas = gasPrice - block.baseFeePerGas;
		if (maxPriorityFeePerGas < 0n) return 0n;
		return maxPriorityFeePerGas;
	}
}
//#endregion
//#region node_modules/viem/_esm/actions/public/estimateFeesPerGas.js
/**
* Returns an estimate for the fees per gas (in wei) for a
* transaction to be likely included in the next block.
* Defaults to [`chain.fees.estimateFeesPerGas`](/docs/clients/chains#fees-estimatefeespergas) if set.
*
* - Docs: https://viem.sh/docs/actions/public/estimateFeesPerGas
*
* @param client - Client to use
* @param parameters - {@link EstimateFeesPerGasParameters}
* @returns An estimate (in wei) for the fees per gas. {@link EstimateFeesPerGasReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { estimateFeesPerGas } from 'viem/actions'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const maxPriorityFeePerGas = await estimateFeesPerGas(client)
* // { maxFeePerGas: ..., maxPriorityFeePerGas: ... }
*/
async function estimateFeesPerGas(client, args) {
	return internal_estimateFeesPerGas(client, args);
}
async function internal_estimateFeesPerGas(client, args) {
	const { block: block_, chain = client.chain, request, type = "eip1559" } = args || {};
	const baseFeeMultiplier = await (async () => {
		if (typeof chain?.fees?.baseFeeMultiplier === "function") return chain.fees.baseFeeMultiplier({
			block: block_,
			client,
			request
		});
		return chain?.fees?.baseFeeMultiplier ?? 1.2;
	})();
	if (baseFeeMultiplier < 1) throw new BaseFeeScalarError();
	const denominator = 10 ** (baseFeeMultiplier.toString().split(".")[1]?.length ?? 0);
	const multiply = (base) => base * BigInt(Math.ceil(baseFeeMultiplier * denominator)) / BigInt(denominator);
	const block = block_ ? block_ : await getAction(client, getBlock, "getBlock")({});
	if (typeof chain?.fees?.estimateFeesPerGas === "function") {
		const fees = await chain.fees.estimateFeesPerGas({
			block: block_,
			client,
			multiply,
			request,
			type
		});
		if (fees !== null) return fees;
	}
	if (type === "eip1559") {
		if (typeof block.baseFeePerGas !== "bigint") throw new Eip1559FeesNotSupportedError();
		const maxPriorityFeePerGas = typeof request?.maxPriorityFeePerGas === "bigint" ? request.maxPriorityFeePerGas : await internal_estimateMaxPriorityFeePerGas(client, {
			block,
			chain,
			request
		});
		const baseFeePerGas = multiply(block.baseFeePerGas);
		return {
			maxFeePerGas: request?.maxFeePerGas ?? baseFeePerGas + maxPriorityFeePerGas,
			maxPriorityFeePerGas
		};
	}
	return { gasPrice: request?.gasPrice ?? multiply(await getAction(client, getGasPrice, "getGasPrice")({})) };
}
//#endregion
//#region node_modules/viem/_esm/actions/public/getTransactionCount.js
/**
* Returns the number of [Transactions](https://viem.sh/docs/glossary/terms#transaction) an Account has sent.
*
* - Docs: https://viem.sh/docs/actions/public/getTransactionCount
* - JSON-RPC Methods: [`eth_getTransactionCount`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactioncount)
*
* @param client - Client to use
* @param parameters - {@link GetTransactionCountParameters}
* @returns The number of transactions an account has sent. {@link GetTransactionCountReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getTransactionCount } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const transactionCount = await getTransactionCount(client, {
*   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
* })
*/
async function getTransactionCount(client, { address, blockTag = "latest", blockNumber }) {
	return hexToNumber(await client.request({
		method: "eth_getTransactionCount",
		params: [address, typeof blockNumber === "bigint" ? numberToHex(blockNumber) : blockTag]
	}, { dedupe: Boolean(blockNumber) }));
}
//#endregion
//#region node_modules/viem/_esm/utils/errors/getTransactionError.js
function getTransactionError(err, { docsPath, ...args }) {
	return new TransactionExecutionError((() => {
		const cause = getNodeError(err, args);
		if (cause instanceof UnknownNodeError) return err;
		return cause;
	})(), {
		docsPath,
		...args
	});
}
//#endregion
//#region node_modules/viem/_esm/actions/public/getChainId.js
/**
* Returns the chain ID associated with the current network.
*
* - Docs: https://viem.sh/docs/actions/public/getChainId
* - JSON-RPC Methods: [`eth_chainId`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_chainid)
*
* @param client - Client to use
* @returns The current chain ID. {@link GetChainIdReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getChainId } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const chainId = await getChainId(client)
* // 1
*/
async function getChainId(client) {
	return hexToNumber(await client.request({ method: "eth_chainId" }, { dedupe: true }));
}
//#endregion
//#region node_modules/viem/_esm/actions/public/fillTransaction.js
/**
* Fills a transaction request with the necessary fields to be signed over.
*
* - Docs: https://viem.sh/docs/actions/public/fillTransaction
*
* @param client - Client to use
* @param parameters - {@link FillTransactionParameters}
* @returns The filled transaction. {@link FillTransactionReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { fillTransaction } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const result = await fillTransaction(client, {
*   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
*   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
*   value: parseEther('1'),
* })
*/
async function fillTransaction(client, parameters) {
	const { account = client.account, accessList, authorizationList, chain = client.chain, blobVersionedHashes, blobs, data, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce: nonce_, nonceManager, to, type, value, ...rest } = parameters;
	const nonce = await (async () => {
		if (!account) return nonce_;
		if (!nonceManager) return nonce_;
		if (typeof nonce_ !== "undefined") return nonce_;
		const account_ = parseAccount(account);
		const chainId = chain ? chain.id : await getAction(client, getChainId, "getChainId")({});
		return await nonceManager.consume({
			address: account_.address,
			chainId,
			client
		});
	})();
	assertRequest(parameters);
	const chainFormat = chain?.formatters?.transactionRequest?.format;
	const request = (chainFormat || formatTransactionRequest)({
		...extract(rest, { format: chainFormat }),
		account: account ? parseAccount(account) : void 0,
		accessList,
		authorizationList,
		blobs,
		blobVersionedHashes,
		data,
		gas,
		gasPrice,
		maxFeePerBlobGas,
		maxFeePerGas,
		maxPriorityFeePerGas,
		nonce,
		to,
		type,
		value
	}, "fillTransaction");
	try {
		const response = await client.request({
			method: "eth_fillTransaction",
			params: [request]
		});
		const transaction = (chain?.formatters?.transaction?.format || formatTransaction)(response.tx);
		delete transaction.blockHash;
		delete transaction.blockNumber;
		delete transaction.r;
		delete transaction.s;
		delete transaction.transactionIndex;
		delete transaction.v;
		delete transaction.yParity;
		transaction.data = transaction.input;
		if (transaction.gas) transaction.gas = parameters.gas ?? transaction.gas;
		if (transaction.gasPrice) transaction.gasPrice = parameters.gasPrice ?? transaction.gasPrice;
		if (transaction.maxFeePerBlobGas) transaction.maxFeePerBlobGas = parameters.maxFeePerBlobGas ?? transaction.maxFeePerBlobGas;
		if (transaction.maxFeePerGas) transaction.maxFeePerGas = parameters.maxFeePerGas ?? transaction.maxFeePerGas;
		if (transaction.maxPriorityFeePerGas) transaction.maxPriorityFeePerGas = parameters.maxPriorityFeePerGas ?? transaction.maxPriorityFeePerGas;
		if (transaction.nonce) transaction.nonce = parameters.nonce ?? transaction.nonce;
		const feeMultiplier = await (async () => {
			if (typeof chain?.fees?.baseFeeMultiplier === "function") {
				const block = await getAction(client, getBlock, "getBlock")({});
				return chain.fees.baseFeeMultiplier({
					block,
					client,
					request: parameters
				});
			}
			return chain?.fees?.baseFeeMultiplier ?? 1.2;
		})();
		if (feeMultiplier < 1) throw new BaseFeeScalarError();
		const denominator = 10 ** (feeMultiplier.toString().split(".")[1]?.length ?? 0);
		const multiplyFee = (base) => base * BigInt(Math.ceil(feeMultiplier * denominator)) / BigInt(denominator);
		if (transaction.maxFeePerGas && !parameters.maxFeePerGas) transaction.maxFeePerGas = multiplyFee(transaction.maxFeePerGas);
		if (transaction.gasPrice && !parameters.gasPrice) transaction.gasPrice = multiplyFee(transaction.gasPrice);
		return {
			raw: response.raw,
			transaction: {
				from: request.from,
				...transaction
			}
		};
	} catch (err) {
		throw getTransactionError(err, {
			...parameters,
			chain: client.chain
		});
	}
}
//#endregion
//#region node_modules/viem/_esm/actions/wallet/prepareTransactionRequest.js
var defaultParameters = [
	"blobVersionedHashes",
	"chainId",
	"fees",
	"gas",
	"nonce",
	"type"
];
/** @internal */
var eip1559NetworkCache = /* @__PURE__ */ new Map();
/** @internal */
var supportsFillTransaction = /* @__PURE__ */ new LruMap(128);
/**
* Prepares a transaction request for signing.
*
* - Docs: https://viem.sh/docs/actions/wallet/prepareTransactionRequest
*
* @param args - {@link PrepareTransactionRequestParameters}
* @returns The transaction request. {@link PrepareTransactionRequestReturnType}
*
* @example
* import { createWalletClient, custom } from 'viem'
* import { mainnet } from 'viem/chains'
* import { prepareTransactionRequest } from 'viem/actions'
*
* const client = createWalletClient({
*   chain: mainnet,
*   transport: custom(window.ethereum),
* })
* const request = await prepareTransactionRequest(client, {
*   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
*   to: '0x0000000000000000000000000000000000000000',
*   value: 1n,
* })
*
* @example
* // Account Hoisting
* import { createWalletClient, http } from 'viem'
* import { privateKeyToAccount } from 'viem/accounts'
* import { mainnet } from 'viem/chains'
* import { prepareTransactionRequest } from 'viem/actions'
*
* const client = createWalletClient({
*   account: privateKeyToAccount('0x…'),
*   chain: mainnet,
*   transport: custom(window.ethereum),
* })
* const request = await prepareTransactionRequest(client, {
*   to: '0x0000000000000000000000000000000000000000',
*   value: 1n,
* })
*/
async function prepareTransactionRequest(client, args) {
	let request = args;
	request.account ??= client.account;
	request.parameters ??= defaultParameters;
	const { account: account_, chain = client.chain, nonceManager, parameters } = request;
	const prepareTransactionRequest = (() => {
		if (typeof chain?.prepareTransactionRequest === "function") return {
			fn: chain.prepareTransactionRequest,
			runAt: ["beforeFillTransaction"]
		};
		if (Array.isArray(chain?.prepareTransactionRequest)) return {
			fn: chain.prepareTransactionRequest[0],
			runAt: chain.prepareTransactionRequest[1].runAt
		};
	})();
	let chainId;
	async function getChainId$1() {
		if (chainId) return chainId;
		if (typeof request.chainId !== "undefined") return request.chainId;
		if (chain) return chain.id;
		chainId = await getAction(client, getChainId, "getChainId")({});
		return chainId;
	}
	const account = account_ ? parseAccount(account_) : account_;
	let nonce = request.nonce;
	if (parameters.includes("nonce") && typeof nonce === "undefined" && account && nonceManager) {
		const chainId = await getChainId$1();
		nonce = await nonceManager.consume({
			address: account.address,
			chainId,
			client
		});
	}
	if (prepareTransactionRequest?.fn && prepareTransactionRequest.runAt?.includes("beforeFillTransaction")) {
		request = await prepareTransactionRequest.fn({
			...request,
			chain
		}, { phase: "beforeFillTransaction" });
		nonce ??= request.nonce;
	}
	const fillResult = (() => {
		if ((parameters.includes("blobVersionedHashes") || parameters.includes("sidecars")) && request.kzg && request.blobs) return false;
		if (supportsFillTransaction.get(client.uid) === false) return false;
		if (!["fees", "gas"].some((parameter) => parameters.includes(parameter))) return false;
		if (parameters.includes("chainId") && typeof request.chainId !== "number") return true;
		if (parameters.includes("nonce") && typeof nonce !== "number") return true;
		if (parameters.includes("fees") && typeof request.gasPrice !== "bigint" && (typeof request.maxFeePerGas !== "bigint" || typeof request.maxPriorityFeePerGas !== "bigint")) return true;
		if (parameters.includes("gas") && typeof request.gas !== "bigint") return true;
		return false;
	})() ? await getAction(client, fillTransaction, "fillTransaction")({
		...request,
		nonce
	}).then((result) => {
		const { chainId, from, gas, gasPrice, nonce, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, type, ...rest } = result.transaction;
		supportsFillTransaction.set(client.uid, true);
		return {
			...request,
			...from ? { from } : {},
			...type && !request.type ? { type } : {},
			...typeof chainId !== "undefined" ? { chainId } : {},
			...typeof gas !== "undefined" ? { gas } : {},
			...typeof gasPrice !== "undefined" ? { gasPrice } : {},
			...typeof nonce !== "undefined" ? { nonce } : {},
			...typeof maxFeePerBlobGas !== "undefined" && request.type !== "legacy" && request.type !== "eip2930" ? { maxFeePerBlobGas } : {},
			...typeof maxFeePerGas !== "undefined" && request.type !== "legacy" && request.type !== "eip2930" ? { maxFeePerGas } : {},
			...typeof maxPriorityFeePerGas !== "undefined" && request.type !== "legacy" && request.type !== "eip2930" ? { maxPriorityFeePerGas } : {},
			..."nonceKey" in rest && typeof rest.nonceKey !== "undefined" ? { nonceKey: rest.nonceKey } : {}
		};
	}).catch((e) => {
		const error = e;
		if (error.name !== "TransactionExecutionError") return request;
		if (error.walk?.((e) => {
			const error = e;
			return error.name === "MethodNotFoundRpcError" || error.name === "MethodNotSupportedRpcError";
		})) supportsFillTransaction.set(client.uid, false);
		return request;
	}) : request;
	nonce ??= fillResult.nonce;
	request = {
		...fillResult,
		...account ? { from: account?.address } : {},
		...nonce ? { nonce } : {}
	};
	const { blobs, gas, kzg, type } = request;
	if (prepareTransactionRequest?.fn && prepareTransactionRequest.runAt?.includes("beforeFillParameters")) request = await prepareTransactionRequest.fn({
		...request,
		chain
	}, { phase: "beforeFillParameters" });
	let block;
	async function getBlock$1() {
		if (block) return block;
		block = await getAction(client, getBlock, "getBlock")({ blockTag: "latest" });
		return block;
	}
	if (parameters.includes("nonce") && typeof nonce === "undefined" && account && !nonceManager) request.nonce = await getAction(client, getTransactionCount, "getTransactionCount")({
		address: account.address,
		blockTag: "pending"
	});
	if ((parameters.includes("blobVersionedHashes") || parameters.includes("sidecars")) && blobs && kzg) {
		const commitments = blobsToCommitments({
			blobs,
			kzg
		});
		if (parameters.includes("blobVersionedHashes")) {
			const versionedHashes = commitmentsToVersionedHashes({
				commitments,
				to: "hex"
			});
			request.blobVersionedHashes = versionedHashes;
		}
		if (parameters.includes("sidecars")) {
			const sidecars = toBlobSidecars({
				blobs,
				commitments,
				proofs: blobsToProofs({
					blobs,
					commitments,
					kzg
				}),
				to: "hex"
			});
			request.sidecars = sidecars;
		}
	}
	if (parameters.includes("chainId")) request.chainId = await getChainId$1();
	if ((parameters.includes("fees") || parameters.includes("type")) && typeof type === "undefined") try {
		request.type = getTransactionType(request);
	} catch {
		let isEip1559Network = eip1559NetworkCache.get(client.uid);
		if (typeof isEip1559Network === "undefined") {
			isEip1559Network = typeof (await getBlock$1())?.baseFeePerGas === "bigint";
			eip1559NetworkCache.set(client.uid, isEip1559Network);
		}
		request.type = isEip1559Network ? "eip1559" : "legacy";
	}
	if (parameters.includes("fees")) if (request.type !== "legacy" && request.type !== "eip2930") {
		if (typeof request.maxFeePerGas === "undefined" || typeof request.maxPriorityFeePerGas === "undefined") {
			const { maxFeePerGas, maxPriorityFeePerGas } = await internal_estimateFeesPerGas(client, {
				block: await getBlock$1(),
				chain,
				request
			});
			if (typeof request.maxPriorityFeePerGas === "undefined" && request.maxFeePerGas && request.maxFeePerGas < maxPriorityFeePerGas) throw new MaxFeePerGasTooLowError({ maxPriorityFeePerGas });
			request.maxPriorityFeePerGas = maxPriorityFeePerGas;
			request.maxFeePerGas = maxFeePerGas;
		}
	} else {
		if (typeof request.maxFeePerGas !== "undefined" || typeof request.maxPriorityFeePerGas !== "undefined") throw new Eip1559FeesNotSupportedError();
		if (typeof request.gasPrice === "undefined") {
			const { gasPrice: gasPrice_ } = await internal_estimateFeesPerGas(client, {
				block: await getBlock$1(),
				chain,
				request,
				type: "legacy"
			});
			request.gasPrice = gasPrice_;
		}
	}
	if (parameters.includes("gas") && typeof gas === "undefined") request.gas = await getAction(client, estimateGas, "estimateGas")({
		...request,
		account,
		prepare: account?.type === "local" ? [] : ["blobVersionedHashes"]
	});
	if (prepareTransactionRequest?.fn && prepareTransactionRequest.runAt?.includes("afterFillParameters")) request = await prepareTransactionRequest.fn({
		...request,
		chain
	}, { phase: "afterFillParameters" });
	assertRequest(request);
	delete request.parameters;
	return request;
}
//#endregion
//#region node_modules/viem/_esm/actions/public/estimateGas.js
/**
* Estimates the gas necessary to complete a transaction without submitting it to the network.
*
* - Docs: https://viem.sh/docs/actions/public/estimateGas
* - JSON-RPC Methods: [`eth_estimateGas`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_estimategas)
*
* @param client - Client to use
* @param parameters - {@link EstimateGasParameters}
* @returns The gas estimate (in gas units). {@link EstimateGasReturnType}
*
* @example
* import { createPublicClient, http, parseEther } from 'viem'
* import { mainnet } from 'viem/chains'
* import { estimateGas } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const gasEstimate = await estimateGas(client, {
*   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
*   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
*   value: parseEther('1'),
* })
*/
async function estimateGas(client, args) {
	const { account: account_ = client.account, prepare = true } = args;
	const account = account_ ? parseAccount(account_) : void 0;
	const parameters = (() => {
		if (Array.isArray(prepare)) return prepare;
		if (account?.type !== "local") return ["blobVersionedHashes"];
	})();
	try {
		const to = await (async () => {
			if (args.to) return args.to;
			if (args.authorizationList && args.authorizationList.length > 0) return await recoverAuthorizationAddress({ authorization: args.authorizationList[0] }).catch(() => {
				throw new BaseError$1("`to` is required. Could not infer from `authorizationList`");
			});
		})();
		const { accessList, authorizationList, blobs, blobVersionedHashes, blockNumber, blockTag, data, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce, value, stateOverride, ...rest } = prepare ? await prepareTransactionRequest(client, {
			...args,
			parameters,
			to
		}) : args;
		if (gas && args.gas !== gas) return gas;
		const block = (typeof blockNumber === "bigint" ? numberToHex(blockNumber) : void 0) || blockTag;
		const rpcStateOverride = serializeStateOverride(stateOverride);
		assertRequest(args);
		const chainFormat = client.chain?.formatters?.transactionRequest?.format;
		const request = (chainFormat || formatTransactionRequest)({
			...extract(rest, { format: chainFormat }),
			account,
			accessList,
			authorizationList,
			blobs,
			blobVersionedHashes,
			data,
			gasPrice,
			maxFeePerBlobGas,
			maxFeePerGas,
			maxPriorityFeePerGas,
			nonce,
			to,
			value
		}, "estimateGas");
		return BigInt(await client.request({
			method: "eth_estimateGas",
			params: rpcStateOverride ? [
				request,
				block ?? client.experimental_blockTag ?? "latest",
				rpcStateOverride
			] : block ? [request, block] : [request]
		}));
	} catch (err) {
		throw getEstimateGasError(err, {
			...args,
			account,
			chain: client.chain
		});
	}
}
//#endregion
//#region node_modules/viem/_esm/utils/promise/withCache.js
/** @internal */
var promiseCache = /* @__PURE__ */ new Map();
/** @internal */
var responseCache = /* @__PURE__ */ new Map();
function getCache(cacheKey) {
	const buildCache = (cacheKey, cache) => ({
		clear: () => cache.delete(cacheKey),
		get: () => cache.get(cacheKey),
		set: (data) => cache.set(cacheKey, data)
	});
	const promise = buildCache(cacheKey, promiseCache);
	const response = buildCache(cacheKey, responseCache);
	return {
		clear: () => {
			promise.clear();
			response.clear();
		},
		promise,
		response
	};
}
/**
* @description Returns the result of a given promise, and caches the result for
* subsequent invocations against a provided cache key.
*/
async function withCache(fn, { cacheKey, cacheTime = Number.POSITIVE_INFINITY }) {
	const cache = getCache(cacheKey);
	const response = cache.response.get();
	if (response && cacheTime > 0) {
		if (Date.now() - response.created.getTime() < cacheTime) return response.data;
	}
	let promise = cache.promise.get();
	if (!promise) {
		promise = fn();
		cache.promise.set(promise);
	}
	try {
		const data = await promise;
		cache.response.set({
			created: /* @__PURE__ */ new Date(),
			data
		});
		return data;
	} finally {
		cache.promise.clear();
	}
}
//#endregion
//#region node_modules/viem/_esm/errors/eip712.js
var Eip712DomainNotFoundError = class extends BaseError$1 {
	constructor({ address }) {
		super(`No EIP-712 domain found on contract "${address}".`, {
			metaMessages: [
				"Ensure that:",
				`- The contract is deployed at the address "${address}".`,
				"- `eip712Domain()` function exists on the contract.",
				"- `eip712Domain()` function matches signature to ERC-5267 specification."
			],
			name: "Eip712DomainNotFoundError"
		});
	}
};
//#endregion
//#region node_modules/viem/_esm/actions/public/getEip712Domain.js
/**
* Reads the EIP-712 domain from a contract, based on the ERC-5267 specification.
*
* @param client - A {@link Client} instance.
* @param parameters - The parameters of the action. {@link GetEip712DomainParameters}
* @returns The EIP-712 domain, fields, and extensions. {@link GetEip712DomainReturnType}
*
* @example
* ```ts
* import { createPublicClient, http, getEip712Domain } from 'viem'
* import { mainnet } from 'viem/chains'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
*
* const domain = await getEip712Domain(client, {
*   address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
* })
* // {
* //   domain: {
* //     name: 'ExampleContract',
* //     version: '1',
* //     chainId: 1,
* //     verifyingContract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
* //   },
* //   fields: '0x0f',
* //   extensions: [],
* // }
* ```
*/
async function getEip712Domain(client, parameters) {
	const { address, factory, factoryData } = parameters;
	try {
		const [fields, name, version, chainId, verifyingContract, salt, extensions] = await getAction(client, readContract, "readContract")({
			abi,
			address,
			functionName: "eip712Domain",
			factory,
			factoryData
		});
		return {
			domain: {
				name,
				version,
				chainId: Number(chainId),
				verifyingContract,
				salt
			},
			extensions,
			fields
		};
	} catch (e) {
		const error = e;
		if (error.name === "ContractFunctionExecutionError" && error.cause.name === "ContractFunctionZeroDataError") throw new Eip712DomainNotFoundError({ address });
		throw error;
	}
}
var abi = [{
	inputs: [],
	name: "eip712Domain",
	outputs: [
		{
			name: "fields",
			type: "bytes1"
		},
		{
			name: "name",
			type: "string"
		},
		{
			name: "version",
			type: "string"
		},
		{
			name: "chainId",
			type: "uint256"
		},
		{
			name: "verifyingContract",
			type: "address"
		},
		{
			name: "salt",
			type: "bytes32"
		},
		{
			name: "extensions",
			type: "uint256[]"
		}
	],
	stateMutability: "view",
	type: "function"
}];
//#endregion
//#region node_modules/viem/_esm/utils/chain/assertCurrentChain.js
function assertCurrentChain({ chain, currentChainId }) {
	if (!chain) throw new ChainNotFoundError();
	if (currentChainId !== chain.id) throw new ChainMismatchError({
		chain,
		currentChainId
	});
}
//#endregion
//#region node_modules/ox/_esm/core/internal/abiItem.js
/** @internal */
function normalizeSignature(signature) {
	let active = true;
	let current = "";
	let level = 0;
	let result = "";
	let valid = false;
	for (let i = 0; i < signature.length; i++) {
		const char = signature[i];
		if ([
			"(",
			")",
			","
		].includes(char)) active = true;
		if (char === "(") level++;
		if (char === ")") level--;
		if (!active) continue;
		if (level === 0) {
			if (char === " " && [
				"event",
				"function",
				"error",
				""
			].includes(result)) result = "";
			else {
				result += char;
				if (char === ")") {
					valid = true;
					break;
				}
			}
			continue;
		}
		if (char === " ") {
			if (signature[i - 1] !== "," && current !== "," && current !== ",(") {
				current = "";
				active = false;
			}
			continue;
		}
		result += char;
		current += char;
	}
	if (!valid) throw new BaseError("Unable to normalize signature.");
	return result;
}
/** @internal */
function isArgOfType(arg, abiParameter) {
	const argType = typeof arg;
	const abiParameterType = abiParameter.type;
	switch (abiParameterType) {
		case "address": return validate$1(arg, { strict: false });
		case "bool": return argType === "boolean";
		case "function": return argType === "string";
		case "string": return argType === "string";
		default:
			if (abiParameterType === "tuple" && "components" in abiParameter) return Object.values(abiParameter.components).every((component, index) => {
				return isArgOfType(Object.values(arg)[index], component);
			});
			if (/^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(abiParameterType)) return argType === "number" || argType === "bigint";
			if (/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(abiParameterType)) return argType === "string" || arg instanceof Uint8Array;
			if (/[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(abiParameterType)) return Array.isArray(arg) && arg.every((x) => isArgOfType(x, {
				...abiParameter,
				type: abiParameterType.replace(/(\[[0-9]{0,}\])$/, "")
			}));
			return false;
	}
}
/** @internal */
function getAmbiguousTypes(sourceParameters, targetParameters, args) {
	for (const parameterIndex in sourceParameters) {
		const sourceParameter = sourceParameters[parameterIndex];
		const targetParameter = targetParameters[parameterIndex];
		if (sourceParameter.type === "tuple" && targetParameter.type === "tuple" && "components" in sourceParameter && "components" in targetParameter) return getAmbiguousTypes(sourceParameter.components, targetParameter.components, args[parameterIndex]);
		const types = [sourceParameter.type, targetParameter.type];
		if ((() => {
			if (types.includes("address") && types.includes("bytes20")) return true;
			if (types.includes("address") && types.includes("string")) return validate$1(args[parameterIndex], { strict: false });
			if (types.includes("address") && types.includes("bytes")) return validate$1(args[parameterIndex], { strict: false });
			return false;
		})()) return types;
	}
}
//#endregion
//#region node_modules/ox/_esm/core/AbiItem.js
/**
* Parses an arbitrary **JSON ABI Item** or **Human Readable ABI Item** into a typed {@link ox#AbiItem.AbiItem}.
*
* @example
* ### JSON ABIs
*
* ```ts twoslash
* import { AbiItem } from 'ox'
*
* const abiItem = AbiItem.from({
*   type: 'function',
*   name: 'approve',
*   stateMutability: 'nonpayable',
*   inputs: [
*     {
*       name: 'spender',
*       type: 'address',
*     },
*     {
*       name: 'amount',
*       type: 'uint256',
*     },
*   ],
*   outputs: [{ type: 'bool' }],
* })
*
* abiItem
* //^?
*
*
*
*
*
*
*
*
*
*
*
*
* ```
*
* @example
* ### Human Readable ABIs
*
* A Human Readable ABI can be parsed into a typed ABI object:
*
* ```ts twoslash
* import { AbiItem } from 'ox'
*
* const abiItem = AbiItem.from(
*   'function approve(address spender, uint256 amount) returns (bool)' // [!code hl]
* )
*
* abiItem
* //^?
*
*
*
*
*
*
*
*
*
*
*
*
*
* ```
*
* @example
* It is possible to specify `struct`s along with your definitions:
*
* ```ts twoslash
* import { AbiItem } from 'ox'
*
* const abiItem = AbiItem.from([
*   'struct Foo { address spender; uint256 amount; }', // [!code hl]
*   'function approve(Foo foo) returns (bool)',
* ])
*
* abiItem
* //^?
*
*
*
*
*
*
*
*
*
*
*
*
* ```
*
*
*
* @param abiItem - The ABI Item to parse.
* @returns The typed ABI Item.
*/
function from(abiItem, options = {}) {
	const { prepare = true } = options;
	const item = (() => {
		if (Array.isArray(abiItem)) return parseAbiItem(abiItem);
		if (typeof abiItem === "string") return parseAbiItem(abiItem);
		return abiItem;
	})();
	return {
		...item,
		...prepare ? { hash: getSignatureHash(item) } : {}
	};
}
/**
* Extracts an {@link ox#AbiItem.AbiItem} from an {@link ox#Abi.Abi} given a name and optional arguments.
*
* @example
* ABI Items can be extracted by their name using the `name` option:
*
* ```ts twoslash
* import { Abi, AbiItem } from 'ox'
*
* const abi = Abi.from([
*   'function foo()',
*   'event Transfer(address owner, address to, uint256 tokenId)',
*   'function bar(string a) returns (uint256 x)',
* ])
*
* const item = AbiItem.fromAbi(abi, 'Transfer') // [!code focus]
* //    ^?
*
*
*
*
*
*
* ```
*
* @example
* ### Extracting by Selector
*
* ABI Items can be extract by their selector when {@link ox#Hex.Hex} is provided to `name`.
*
* ```ts twoslash
* import { Abi, AbiItem } from 'ox'
*
* const abi = Abi.from([
*   'function foo()',
*   'event Transfer(address owner, address to, uint256 tokenId)',
*   'function bar(string a) returns (uint256 x)',
* ])
* const item = AbiItem.fromAbi(abi, '0x095ea7b3') // [!code focus]
* //    ^?
*
*
*
*
*
*
*
*
*
*
*
*
*
* ```
*
* :::note
*
* Extracting via a hex selector is useful when extracting an ABI Item from an `eth_call` RPC response,
* a Transaction `input`, or from Event Log `topics`.
*
* :::
*
* @param abi - The ABI to extract from.
* @param name - The name (or selector) of the ABI item to extract.
* @param options - Extraction options.
* @returns The ABI item.
*/
function fromAbi(abi, name, options) {
	const { args = [], prepare = true } = options ?? {};
	const isSelector = validate(name, { strict: false });
	const abiItems = abi.filter((abiItem) => {
		if (isSelector) {
			if (abiItem.type === "function" || abiItem.type === "error") return getSelector(abiItem) === slice(name, 0, 4);
			if (abiItem.type === "event") return getSignatureHash(abiItem) === name;
			return false;
		}
		return "name" in abiItem && abiItem.name === name;
	});
	if (abiItems.length === 0) throw new NotFoundError({ name });
	if (abiItems.length === 1) return {
		...abiItems[0],
		...prepare ? { hash: getSignatureHash(abiItems[0]) } : {}
	};
	let matchedAbiItem;
	for (const abiItem of abiItems) {
		if (!("inputs" in abiItem)) continue;
		if (!args || args.length === 0) {
			if (!abiItem.inputs || abiItem.inputs.length === 0) return {
				...abiItem,
				...prepare ? { hash: getSignatureHash(abiItem) } : {}
			};
			continue;
		}
		if (!abiItem.inputs) continue;
		if (abiItem.inputs.length === 0) continue;
		if (abiItem.inputs.length !== args.length) continue;
		if (args.every((arg, index) => {
			const abiParameter = "inputs" in abiItem && abiItem.inputs[index];
			if (!abiParameter) return false;
			return isArgOfType(arg, abiParameter);
		})) {
			if (matchedAbiItem && "inputs" in matchedAbiItem && matchedAbiItem.inputs) {
				const ambiguousTypes = getAmbiguousTypes(abiItem.inputs, matchedAbiItem.inputs, args);
				if (ambiguousTypes) throw new AmbiguityError({
					abiItem,
					type: ambiguousTypes[0]
				}, {
					abiItem: matchedAbiItem,
					type: ambiguousTypes[1]
				});
			}
			matchedAbiItem = abiItem;
		}
	}
	const abiItem = (() => {
		if (matchedAbiItem) return matchedAbiItem;
		const [abiItem, ...overloads] = abiItems;
		return {
			...abiItem,
			overloads
		};
	})();
	if (!abiItem) throw new NotFoundError({ name });
	return {
		...abiItem,
		...prepare ? { hash: getSignatureHash(abiItem) } : {}
	};
}
function getSelector(...parameters) {
	return slice(getSignatureHash((() => {
		if (Array.isArray(parameters[0])) {
			const [abi, name] = parameters;
			return fromAbi(abi, name);
		}
		return parameters[0];
	})()), 0, 4);
}
function getSignature(...parameters) {
	const abiItem = (() => {
		if (Array.isArray(parameters[0])) {
			const [abi, name] = parameters;
			return fromAbi(abi, name);
		}
		return parameters[0];
	})();
	return normalizeSignature((() => {
		if (typeof abiItem === "string") return abiItem;
		return formatAbiItem(abiItem);
	})());
}
function getSignatureHash(...parameters) {
	const abiItem = (() => {
		if (Array.isArray(parameters[0])) {
			const [abi, name] = parameters;
			return fromAbi(abi, name);
		}
		return parameters[0];
	})();
	if (typeof abiItem !== "string" && "hash" in abiItem && abiItem.hash) return abiItem.hash;
	return keccak256(fromString(getSignature(abiItem)));
}
/**
* Throws when ambiguous types are found on overloaded ABI items.
*
* @example
* ```ts twoslash
* import { Abi, AbiFunction } from 'ox'
*
* const foo = Abi.from(['function foo(address)', 'function foo(bytes20)'])
* AbiFunction.fromAbi(foo, 'foo', {
*   args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
* })
* // @error: AbiItem.AmbiguityError: Found ambiguous types in overloaded ABI Items.
* // @error: `bytes20` in `foo(bytes20)`, and
* // @error: `address` in `foo(address)`
* // @error: These types encode differently and cannot be distinguished at runtime.
* // @error: Remove one of the ambiguous items in the ABI.
* ```
*
* ### Solution
*
* Remove one of the ambiguous types from the ABI.
*
* ```ts twoslash
* import { Abi, AbiFunction } from 'ox'
*
* const foo = Abi.from([
*   'function foo(address)',
*   'function foo(bytes20)' // [!code --]
* ])
* AbiFunction.fromAbi(foo, 'foo', {
*   args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
* })
* // @error: AbiItem.AmbiguityError: Found ambiguous types in overloaded ABI Items.
* // @error: `bytes20` in `foo(bytes20)`, and
* // @error: `address` in `foo(address)`
* // @error: These types encode differently and cannot be distinguished at runtime.
* // @error: Remove one of the ambiguous items in the ABI.
* ```
*/
var AmbiguityError = class extends BaseError {
	constructor(x, y) {
		super("Found ambiguous types in overloaded ABI Items.", { metaMessages: [
			`\`${x.type}\` in \`${normalizeSignature(formatAbiItem(x.abiItem))}\`, and`,
			`\`${y.type}\` in \`${normalizeSignature(formatAbiItem(y.abiItem))}\``,
			"",
			"These types encode differently and cannot be distinguished at runtime.",
			"Remove one of the ambiguous items in the ABI."
		] });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "AbiItem.AmbiguityError"
		});
	}
};
/**
* Throws when an ABI item is not found in the ABI.
*
* @example
* ```ts twoslash
* // @noErrors
* import { Abi, AbiFunction } from 'ox'
*
* const foo = Abi.from([
*   'function foo(address)',
*   'function bar(uint)'
* ])
* AbiFunction.fromAbi(foo, 'baz')
* // @error: AbiItem.NotFoundError: ABI function with name "baz" not found.
* ```
*
* ### Solution
*
* Ensure the ABI item exists on the ABI.
*
* ```ts twoslash
* // @noErrors
* import { Abi, AbiFunction } from 'ox'
*
* const foo = Abi.from([
*   'function foo(address)',
*   'function bar(uint)',
*   'function baz(bool)' // [!code ++]
* ])
* AbiFunction.fromAbi(foo, 'baz')
* ```
*/
var NotFoundError = class extends BaseError {
	constructor({ name, data, type = "item" }) {
		const selector = (() => {
			if (name) return ` with name "${name}"`;
			if (data) return ` with data "${data}"`;
			return "";
		})();
		super(`ABI ${type}${selector} not found.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "AbiItem.NotFoundError"
		});
	}
};
//#endregion
//#region node_modules/viem/_esm/constants/address.js
var ethAddress = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
var zeroAddress = "0x0000000000000000000000000000000000000000";
//#endregion
//#region node_modules/viem/_esm/utils/observe.js
/** @internal */
var listenersCache = /* @__PURE__ */ new Map();
/** @internal */
var cleanupCache = /* @__PURE__ */ new Map();
var callbackCount = 0;
/**
* @description Sets up an observer for a given function. If another function
* is set up under the same observer id, the function will only be called once
* for both instances of the observer.
*/
function observe(observerId, callbacks, fn) {
	const callbackId = ++callbackCount;
	const getListeners = () => listenersCache.get(observerId) || [];
	const unsubscribe = () => {
		const listeners = getListeners();
		listenersCache.set(observerId, listeners.filter((cb) => cb.id !== callbackId));
	};
	const unwatch = () => {
		const listeners = getListeners();
		if (!listeners.some((cb) => cb.id === callbackId)) return;
		const cleanup = cleanupCache.get(observerId);
		if (listeners.length === 1 && cleanup) {
			const p = cleanup();
			if (p instanceof Promise) p.catch(() => {});
		}
		unsubscribe();
	};
	const listeners = getListeners();
	listenersCache.set(observerId, [...listeners, {
		id: callbackId,
		fns: callbacks
	}]);
	if (listeners && listeners.length > 0) return unwatch;
	const emit = {};
	for (const key in callbacks) emit[key] = ((...args) => {
		const listeners = getListeners();
		if (listeners.length === 0) return;
		for (const listener of listeners) listener.fns[key]?.(...args);
	});
	const cleanup = fn(emit);
	if (typeof cleanup === "function") cleanupCache.set(observerId, cleanup);
	return unwatch;
}
//#endregion
//#region node_modules/viem/_esm/utils/poll.js
/**
* @description Polls a function at a specified interval.
*/
function poll(fn, { emitOnBegin, initialWaitTime, interval }) {
	let active = true;
	const unwatch = () => active = false;
	const watch = async () => {
		let data;
		if (emitOnBegin) data = await fn({ unpoll: unwatch });
		await wait(await initialWaitTime?.(data) ?? interval);
		const poll = async () => {
			if (!active) return;
			await fn({ unpoll: unwatch });
			await wait(interval);
			poll();
		};
		poll();
	};
	watch();
	return unwatch;
}
//#endregion
//#region node_modules/viem/_esm/actions/wallet/sendRawTransaction.js
/**
* Sends a **signed** transaction to the network
*
* - Docs: https://viem.sh/docs/actions/wallet/sendRawTransaction
* - JSON-RPC Method: [`eth_sendRawTransaction`](https://ethereum.github.io/execution-apis/api-documentation/)
*
* @param client - Client to use
* @param parameters - {@link SendRawTransactionParameters}
* @returns The transaction hash. {@link SendRawTransactionReturnType}
*
* @example
* import { createWalletClient, custom } from 'viem'
* import { mainnet } from 'viem/chains'
* import { sendRawTransaction } from 'viem/wallet'
*
* const client = createWalletClient({
*   chain: mainnet,
*   transport: custom(window.ethereum),
* })
*
* const hash = await sendRawTransaction(client, {
*   serializedTransaction: '0x02f850018203118080825208808080c080a04012522854168b27e5dc3d5839bab5e6b39e1a0ffd343901ce1622e3d64b48f1a04e00902ae0502c4728cbf12156290df99c3ed7de85b1dbfe20b5c36931733a33'
* })
*/
async function sendRawTransaction(client, { serializedTransaction }) {
	return client.request({
		method: "eth_sendRawTransaction",
		params: [serializedTransaction]
	}, { retryCount: 0 });
}
//#endregion
//#region node_modules/viem/_esm/actions/wallet/sendTransaction.js
var supportsWalletNamespace = new LruMap(128);
/**
* Creates, signs, and sends a new transaction to the network.
*
* - Docs: https://viem.sh/docs/actions/wallet/sendTransaction
* - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_sending-transactions
* - JSON-RPC Methods:
*   - JSON-RPC Accounts: [`eth_sendTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendtransaction)
*   - Local Accounts: [`eth_sendRawTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendrawtransaction)
*
* @param client - Client to use
* @param parameters - {@link SendTransactionParameters}
* @returns The [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash. {@link SendTransactionReturnType}
*
* @example
* import { createWalletClient, custom } from 'viem'
* import { mainnet } from 'viem/chains'
* import { sendTransaction } from 'viem/wallet'
*
* const client = createWalletClient({
*   chain: mainnet,
*   transport: custom(window.ethereum),
* })
* const hash = await sendTransaction(client, {
*   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
*   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
*   value: 1000000000000000000n,
* })
*
* @example
* // Account Hoisting
* import { createWalletClient, http } from 'viem'
* import { privateKeyToAccount } from 'viem/accounts'
* import { mainnet } from 'viem/chains'
* import { sendTransaction } from 'viem/wallet'
*
* const client = createWalletClient({
*   account: privateKeyToAccount('0x…'),
*   chain: mainnet,
*   transport: http(),
* })
* const hash = await sendTransaction(client, {
*   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
*   value: 1000000000000000000n,
* })
*/
async function sendTransaction(client, parameters) {
	const { account: account_ = client.account, assertChainId = true, chain = client.chain, accessList, authorizationList, blobs, data, dataSuffix = typeof client.dataSuffix === "string" ? client.dataSuffix : client.dataSuffix?.value, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce, type, value, ...rest } = parameters;
	if (typeof account_ === "undefined") throw new AccountNotFoundError({ docsPath: "/docs/actions/wallet/sendTransaction" });
	const account = account_ ? parseAccount(account_) : null;
	try {
		assertRequest(parameters);
		const to = await (async () => {
			if (parameters.to) return parameters.to;
			if (parameters.to === null) return void 0;
			if (authorizationList && authorizationList.length > 0) return await recoverAuthorizationAddress({ authorization: authorizationList[0] }).catch(() => {
				throw new BaseError$1("`to` is required. Could not infer from `authorizationList`.");
			});
		})();
		if (account?.type === "json-rpc" || account === null) {
			let chainId;
			if (chain !== null) {
				chainId = await getAction(client, getChainId, "getChainId")({});
				if (assertChainId) assertCurrentChain({
					currentChainId: chainId,
					chain
				});
			}
			const chainFormat = client.chain?.formatters?.transactionRequest?.format;
			const request = (chainFormat || formatTransactionRequest)({
				...extract(rest, { format: chainFormat }),
				accessList,
				account,
				authorizationList,
				blobs,
				chainId,
				data: data ? concat([data, dataSuffix ?? "0x"]) : data,
				gas,
				gasPrice,
				maxFeePerBlobGas,
				maxFeePerGas,
				maxPriorityFeePerGas,
				nonce,
				to,
				type,
				value
			}, "sendTransaction");
			const isWalletNamespaceSupported = supportsWalletNamespace.get(client.uid);
			const method = isWalletNamespaceSupported ? "wallet_sendTransaction" : "eth_sendTransaction";
			try {
				return await client.request({
					method,
					params: [request]
				}, { retryCount: 0 });
			} catch (e) {
				if (isWalletNamespaceSupported === false) throw e;
				const error = e;
				if (error.name === "InvalidInputRpcError" || error.name === "InvalidParamsRpcError" || error.name === "MethodNotFoundRpcError" || error.name === "MethodNotSupportedRpcError") return await client.request({
					method: "wallet_sendTransaction",
					params: [request]
				}, { retryCount: 0 }).then((hash) => {
					supportsWalletNamespace.set(client.uid, true);
					return hash;
				}).catch((e) => {
					const walletNamespaceError = e;
					if (walletNamespaceError.name === "MethodNotFoundRpcError" || walletNamespaceError.name === "MethodNotSupportedRpcError") {
						supportsWalletNamespace.set(client.uid, false);
						throw error;
					}
					throw walletNamespaceError;
				});
				throw error;
			}
		}
		if (account?.type === "local") {
			const request = await getAction(client, prepareTransactionRequest, "prepareTransactionRequest")({
				account,
				accessList,
				authorizationList,
				blobs,
				chain,
				data: data ? concat([data, dataSuffix ?? "0x"]) : data,
				gas,
				gasPrice,
				maxFeePerBlobGas,
				maxFeePerGas,
				maxPriorityFeePerGas,
				nonce,
				nonceManager: account.nonceManager,
				parameters: [...defaultParameters, "sidecars"],
				type,
				value,
				...rest,
				to
			});
			const serializer = chain?.serializers?.transaction;
			const serializedTransaction = await account.signTransaction(request, { serializer });
			return await getAction(client, sendRawTransaction, "sendRawTransaction")({ serializedTransaction });
		}
		if (account?.type === "smart") throw new AccountTypeNotSupportedError({
			metaMessages: ["Consider using the `sendUserOperation` Action instead."],
			docsPath: "/docs/actions/bundler/sendUserOperation",
			type: "smart"
		});
		throw new AccountTypeNotSupportedError({
			docsPath: "/docs/actions/wallet/sendTransaction",
			type: account?.type
		});
	} catch (err) {
		if (err instanceof AccountTypeNotSupportedError) throw err;
		throw getTransactionError(err, {
			...parameters,
			account,
			chain: parameters.chain || void 0
		});
	}
}
//#endregion
//#region node_modules/viem/_esm/actions/wallet/sendCalls.js
var fallbackMagicIdentifier = "0x5792579257925792579257925792579257925792579257925792579257925792";
var fallbackTransactionErrorMagicIdentifier = numberToHex(0, { size: 32 });
/**
* Requests the connected wallet to send a batch of calls.
*
* - Docs: https://viem.sh/docs/actions/wallet/sendCalls
* - JSON-RPC Methods: [`wallet_sendCalls`](https://eips.ethereum.org/EIPS/eip-5792)
*
* @param client - Client to use
* @returns Transaction identifier. {@link SendCallsReturnType}
*
* @example
* import { createWalletClient, custom } from 'viem'
* import { mainnet } from 'viem/chains'
* import { sendCalls } from 'viem/actions'
*
* const client = createWalletClient({
*   chain: mainnet,
*   transport: custom(window.ethereum),
* })
* const id = await sendCalls(client, {
*   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
*   calls: [
*     {
*       data: '0xdeadbeef',
*       to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
*     },
*     {
*       to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
*       value: 69420n,
*     },
*   ],
* })
*/
async function sendCalls(client, parameters) {
	const { account: account_ = client.account, chain = client.chain, experimental_fallback, experimental_fallbackDelay = 32, forceAtomic = false, id, version = "2.0.0" } = parameters;
	const account = account_ ? parseAccount(account_) : null;
	let capabilities = parameters.capabilities;
	if (client.dataSuffix && !parameters.capabilities?.dataSuffix) if (typeof client.dataSuffix === "string") capabilities = {
		...parameters.capabilities,
		dataSuffix: {
			value: client.dataSuffix,
			optional: true
		}
	};
	else capabilities = {
		...parameters.capabilities,
		dataSuffix: {
			value: client.dataSuffix.value,
			...client.dataSuffix.required ? {} : { optional: true }
		}
	};
	const calls = parameters.calls.map((call_) => {
		const call = call_;
		const data = call.abi ? encodeFunctionData({
			abi: call.abi,
			functionName: call.functionName,
			args: call.args
		}) : call.data;
		return {
			data: call.dataSuffix && data ? concat([data, call.dataSuffix]) : data,
			to: call.to,
			value: call.value ? numberToHex(call.value) : void 0
		};
	});
	try {
		const response = await client.request({
			method: "wallet_sendCalls",
			params: [{
				atomicRequired: forceAtomic,
				calls,
				capabilities,
				chainId: numberToHex(chain.id),
				from: account?.address,
				id,
				version
			}]
		}, { retryCount: 0 });
		if (typeof response === "string") return { id: response };
		return response;
	} catch (err) {
		const error = err;
		if (experimental_fallback && (error.name === "MethodNotFoundRpcError" || error.name === "MethodNotSupportedRpcError" || error.name === "UnknownRpcError" || error.details.toLowerCase().includes("does not exist / is not available") || error.details.toLowerCase().includes("missing or invalid. request()") || error.details.toLowerCase().includes("did not match any variant of untagged enum") || error.details.toLowerCase().includes("account upgraded to unsupported contract") || error.details.toLowerCase().includes("eip-7702 not supported") || error.details.toLowerCase().includes("unsupported wc_ method") || error.details.toLowerCase().includes("feature toggled misconfigured") || error.details.toLowerCase().includes("jsonrpcengine: response has no error or result for request"))) {
			if (capabilities) {
				if (Object.values(capabilities).some((capability) => !capability.optional)) {
					const message = "non-optional `capabilities` are not supported on fallback to `eth_sendTransaction`.";
					throw new UnsupportedNonOptionalCapabilityError(new BaseError$1(message, { details: message }));
				}
			}
			if (forceAtomic && calls.length > 1) {
				const message = "`forceAtomic` is not supported on fallback to `eth_sendTransaction`.";
				throw new AtomicityNotSupportedError(new BaseError$1(message, { details: message }));
			}
			const promises = [];
			for (const call of calls) {
				const promise = sendTransaction(client, {
					account,
					chain,
					data: call.data,
					to: call.to,
					value: call.value ? hexToBigInt(call.value) : void 0
				});
				promises.push(promise);
				if (experimental_fallbackDelay > 0) await new Promise((resolve) => setTimeout(resolve, experimental_fallbackDelay));
			}
			const results = await Promise.allSettled(promises);
			if (results.every((r) => r.status === "rejected")) throw results[0].reason;
			return { id: concat([
				...results.map((result) => {
					if (result.status === "fulfilled") return result.value;
					return fallbackTransactionErrorMagicIdentifier;
				}),
				numberToHex(chain.id, { size: 32 }),
				fallbackMagicIdentifier
			]) };
		}
		throw getTransactionError(err, {
			...parameters,
			account,
			chain: parameters.chain
		});
	}
}
//#endregion
//#region node_modules/viem/_esm/actions/wallet/getCallsStatus.js
/**
* Returns the status of a call batch that was sent via `sendCalls`.
*
* - Docs: https://viem.sh/docs/actions/wallet/getCallsStatus
* - JSON-RPC Methods: [`wallet_getCallsStatus`](https://eips.ethereum.org/EIPS/eip-5792)
*
* @param client - Client to use
* @returns Status of the calls. {@link GetCallsStatusReturnType}
*
* @example
* import { createWalletClient, custom } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getCallsStatus } from 'viem/actions'
*
* const client = createWalletClient({
*   chain: mainnet,
*   transport: custom(window.ethereum),
* })
* const { receipts, status } = await getCallsStatus(client, { id: '0xdeadbeef' })
*/
async function getCallsStatus(client, parameters) {
	async function getStatus(id) {
		if (id.endsWith("0x5792579257925792579257925792579257925792579257925792579257925792".slice(2))) {
			const chainId = trim(sliceHex(id, -64, -32));
			const hashes = sliceHex(id, 0, -64).slice(2).match(/.{1,64}/g);
			const receipts = await Promise.all(hashes.map((hash) => fallbackTransactionErrorMagicIdentifier.slice(2) !== hash ? client.request({
				method: "eth_getTransactionReceipt",
				params: [`0x${hash}`]
			}, { dedupe: true }) : void 0));
			const status = (() => {
				if (receipts.some((r) => r === null)) return 100;
				if (receipts.every((r) => r?.status === "0x1")) return 200;
				if (receipts.every((r) => r?.status === "0x0")) return 500;
				return 600;
			})();
			return {
				atomic: false,
				chainId: hexToNumber(chainId),
				receipts: receipts.filter(Boolean),
				status,
				version: "2.0.0"
			};
		}
		return client.request({
			method: "wallet_getCallsStatus",
			params: [id]
		});
	}
	const { atomic = false, chainId, receipts, version = "2.0.0", ...response } = await getStatus(parameters.id);
	const [status, statusCode] = (() => {
		const statusCode = response.status;
		if (statusCode >= 100 && statusCode < 200) return ["pending", statusCode];
		if (statusCode >= 200 && statusCode < 300) return ["success", statusCode];
		if (statusCode >= 300 && statusCode < 700) return ["failure", statusCode];
		if (statusCode === "CONFIRMED") return ["success", 200];
		if (statusCode === "PENDING") return ["pending", 100];
		return [void 0, statusCode];
	})();
	return {
		...response,
		atomic,
		chainId: chainId ? hexToNumber(chainId) : void 0,
		receipts: receipts?.map((receipt) => ({
			...receipt,
			blockNumber: hexToBigInt(receipt.blockNumber),
			gasUsed: hexToBigInt(receipt.gasUsed),
			status: receiptStatuses[receipt.status]
		})) ?? [],
		statusCode,
		status,
		version
	};
}
//#endregion
//#region node_modules/viem/_esm/errors/calls.js
var BundleFailedError = class extends BaseError$1 {
	constructor(result) {
		super(`Call bundle failed with status: ${result.statusCode}`, { name: "BundleFailedError" });
		Object.defineProperty(this, "result", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.result = result;
	}
};
//#endregion
//#region node_modules/viem/_esm/actions/wallet/waitForCallsStatus.js
/**
* Waits for the status & receipts of a call bundle that was sent via `sendCalls`.
*
* - Docs: https://viem.sh/docs/actions/wallet/waitForCallsStatus
* - JSON-RPC Methods: [`wallet_getCallsStatus`](https://eips.ethereum.org/EIPS/eip-5792)
*
* @param client - Client to use
* @param parameters - {@link WaitForCallsStatusParameters}
* @returns Status & receipts of the call bundle. {@link WaitForCallsStatusReturnType}
*
* @example
* import { createWalletClient, custom } from 'viem'
* import { mainnet } from 'viem/chains'
* import { waitForCallsStatus } from 'viem/actions'
*
* const client = createWalletClient({
*   chain: mainnet,
*   transport: custom(window.ethereum),
* })
*
* const { receipts, status } = await waitForCallsStatus(client, { id: '0xdeadbeef' })
*/
async function waitForCallsStatus(client, parameters) {
	const { id, pollingInterval = client.pollingInterval, status = ({ statusCode }) => statusCode === 200 || statusCode >= 300, retryCount = 4, retryDelay = ({ count }) => ~~(1 << count) * 200, timeout = 6e4, throwOnFailure = false } = parameters;
	const observerId = stringify([
		"waitForCallsStatus",
		client.uid,
		id
	]);
	const { promise, resolve, reject } = withResolvers();
	let timer;
	const unobserve = observe(observerId, {
		resolve,
		reject
	}, (emit) => {
		const unpoll = poll(async () => {
			const done = (fn) => {
				clearTimeout(timer);
				unpoll();
				fn();
				unobserve();
			};
			try {
				const result = await withRetry(async () => {
					const result = await getAction(client, getCallsStatus, "getCallsStatus")({ id });
					if (throwOnFailure && result.status === "failure") throw new BundleFailedError(result);
					return result;
				}, {
					retryCount,
					delay: retryDelay
				});
				if (!status(result)) return;
				done(() => emit.resolve(result));
			} catch (error) {
				done(() => emit.reject(error));
			}
		}, {
			interval: pollingInterval,
			emitOnBegin: true
		});
		return unpoll;
	});
	timer = timeout ? setTimeout(() => {
		unobserve();
		clearTimeout(timer);
		reject(new WaitForCallsStatusTimeoutError({ id }));
	}, timeout) : void 0;
	return await promise;
}
var WaitForCallsStatusTimeoutError = class extends BaseError$1 {
	constructor({ id }) {
		super(`Timed out while waiting for call bundle with id "${id}" to be confirmed.`, { name: "WaitForCallsStatusTimeoutError" });
	}
};
//#endregion
//#region node_modules/viem/_esm/clients/createClient.js
function createClient(parameters) {
	const { batch, chain, ccipRead, dataSuffix, key = "base", name = "Base Client", type = "base" } = parameters;
	const experimental_blockTag = parameters.experimental_blockTag ?? (typeof chain?.experimental_preconfirmationTime === "number" ? "pending" : void 0);
	const blockTime = chain?.blockTime ?? 12e3;
	const defaultPollingInterval = Math.min(Math.max(Math.floor(blockTime / 2), 500), 4e3);
	const pollingInterval = parameters.pollingInterval ?? defaultPollingInterval;
	const cacheTime = parameters.cacheTime ?? pollingInterval;
	const account = parameters.account ? parseAccount(parameters.account) : void 0;
	const { config, request, value } = parameters.transport({
		account,
		chain,
		pollingInterval
	});
	const client = {
		account,
		batch,
		cacheTime,
		ccipRead,
		chain,
		dataSuffix,
		key,
		name,
		pollingInterval,
		request,
		transport: {
			...config,
			...value
		},
		type,
		uid: uid(),
		...experimental_blockTag ? { experimental_blockTag } : {}
	};
	function extend(base) {
		return (extendFn) => {
			const extended = extendFn(base);
			for (const key in client) delete extended[key];
			const combined = {
				...base,
				...extended
			};
			return Object.assign(combined, { extend: extend(combined) });
		};
	}
	return Object.assign(client, { extend: extend(client) });
}
//#endregion
//#region node_modules/eventemitter3/index.mjs
var import_eventemitter3 = /* @__PURE__ */ __toESM(require_eventemitter3(), 1);
//#endregion
export { BlockNotFoundError as A, getChainId as C, estimateMaxPriorityFeePerGas as D, estimateFeesPerGas as E, getGasPrice as O, fillTransaction as S, getTransactionCount as T, getEip712Domain as _, sendCalls as a, defaultParameters as b, poll as c, zeroAddress as d, NotFoundError as f, assertCurrentChain as g, getSelector as h, getCallsStatus as i, parseAbiItem as j, getBlock as k, observe as l, fromAbi as m, createClient as n, sendTransaction as o, from as p, waitForCallsStatus as r, sendRawTransaction as s, import_eventemitter3 as t, ethAddress as u, withCache as v, getTransactionError as w, prepareTransactionRequest as x, estimateGas as y };

//# sourceMappingURL=eventemitter3-Big23LkK.js.map