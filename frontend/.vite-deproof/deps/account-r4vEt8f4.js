import { $ as aInRange, A as size, B as fromHex$3, C as fromBoolean, Ct as RawContractError, D as padLeft, E as fromString$1, G as toBigInt, I as trimLeft$1, J as toString, K as toBoolean, Kt as splitParameters, L as validate$4, O as padRight, P as toNumber$1, Q as BaseError, Qt as createCursor, S as from$7, St as ContractFunctionZeroDataError, T as fromNumber, Tt as InvalidSerializableTransactionError, U as size$1, Ut as parseStructs, V as fromString, Vt as decodeFunctionResult, W as slice$1, Wt as parseAbiParameter, X as validate$5, Xt as modifiers, Y as trimLeft, Yt as isStructSignature, Z as stringify, _t as utf8ToBytes$1, an as multicall3Abi, at as bytesToNumberBE, bt as ContractFunctionExecutionError, ct as createHmacDrbg, dt as inRange, et as abool, ft as isBytes$1, g as multicall3Bytecode, gt as numberToHexUnpadded, h as erc6492SignatureValidatorByteCode, ht as numberToBytesLE, in as erc6492SignatureValidatorAbi, it as bytesToHex, j as slice, l as defineFormatter, lt as ensureBytes, mt as numberToBytesBE, n as call, nn as erc1271Abi, nt as bitLen, ot as bytesToNumberLE, p as encodeDeployData, pt as memoized, q as toNumber, qt as InvalidAbiParametersError, rt as bitMask, st as concatBytes$1, t as isAddressEqual, tt as abytes$1, ut as hexToBytes, v as IntegerOutOfRangeError, vt as validateObject, w as fromBytes$2, x as concat, xt as ContractFunctionRevertedError, y as InvalidLengthError, yt as CallExecutionError, z as from$6 } from "./isAddressEqual-DXU8Mzf0.js";
import { S as getAddress, _ as concatHex, k as AbiDecodingZeroDataError, o as formatAbiParameters, t as encodeFunctionData, w as keccak256$1, x as checksumAddress } from "./encodeFunctionData-YLQ8NBAq.js";
import { E as isHex, T as size$2, a as toBytes$2, c as numberToHex, h as hexToNumber, m as hexToBool, p as hexToBigInt, r as hexToBytes$1, s as bytesToHex$1, u as toHex$3, w as BaseError$1 } from "./stringify-Bm23iD_D.js";
import { U as RpcRequestError, b as InternalRpcError, x as InvalidInputRpcError } from "./createBatchScheduler-D2ue-dEZ.js";
import { r as sha256$5, t as secp256k1$1 } from "./secp256k1-C6EqCcUM.js";
//#region node_modules/abitype/dist/esm/human-readable/parseAbiParameters.js
/**
* Parses human-readable ABI parameters into {@link AbiParameter}s
*
* @param params - Human-readable ABI parameters
* @returns Parsed {@link AbiParameter}s
*
* @example
* const abiParameters = parseAbiParameters('address from, address to, uint256 amount')
* //    ^? const abiParameters: [{ type: "address"; name: "from"; }, { type: "address";...
*
* @example
* const abiParameters = parseAbiParameters([
*   //  ^? const abiParameters: [{ type: "tuple"; components: [{ type: "string"; name:...
*   'Baz bar',
*   'struct Baz { string name; }',
* ])
*/
function parseAbiParameters(params) {
	const abiParameters = [];
	if (typeof params === "string") {
		const parameters = splitParameters(params);
		const length = parameters.length;
		for (let i = 0; i < length; i++) abiParameters.push(parseAbiParameter(parameters[i], { modifiers }));
	} else {
		const structs = parseStructs(params);
		const length = params.length;
		for (let i = 0; i < length; i++) {
			const signature = params[i];
			if (isStructSignature(signature)) continue;
			const parameters = splitParameters(signature);
			const length = parameters.length;
			for (let k = 0; k < length; k++) abiParameters.push(parseAbiParameter(parameters[k], {
				modifiers,
				structs
			}));
		}
	}
	if (abiParameters.length === 0) throw new InvalidAbiParametersError({ params });
	return abiParameters;
}
//#endregion
//#region node_modules/viem/_esm/utils/getAction.js
/**
* Retrieves and returns an action from the client (if exists), and falls
* back to the tree-shakable action.
*
* Useful for extracting overridden actions from a client (ie. if a consumer
* wants to override the `sendTransaction` implementation).
*/
function getAction(client, actionFn, name) {
	const action_implicit = client[actionFn.name];
	if (typeof action_implicit === "function") return action_implicit;
	const action_explicit = client[name];
	if (typeof action_explicit === "function") return action_explicit;
	return (params) => actionFn(client, params);
}
//#endregion
//#region node_modules/viem/_esm/utils/errors/getContractError.js
var EXECUTION_REVERTED_ERROR_CODE = 3;
function getContractError(err, { abi, address, args, docsPath, functionName, sender }) {
	const error = err instanceof RawContractError ? err : err instanceof BaseError$1 ? err.walk((err) => "data" in err) || err.walk() : {};
	const { code, data, details, message, shortMessage } = error;
	return new ContractFunctionExecutionError((() => {
		if (err instanceof AbiDecodingZeroDataError) return new ContractFunctionZeroDataError({ functionName });
		if ([EXECUTION_REVERTED_ERROR_CODE, InternalRpcError.code].includes(code) && (data || details || message || shortMessage) || code === InvalidInputRpcError.code && details === "execution reverted" && data) return new ContractFunctionRevertedError({
			abi,
			data: typeof data === "object" ? data.data : data,
			functionName,
			message: error instanceof RpcRequestError ? details : shortMessage ?? message
		});
		return err;
	})(), {
		abi,
		args,
		contractAddress: address,
		docsPath,
		functionName,
		sender
	});
}
//#endregion
//#region node_modules/viem/_esm/actions/public/readContract.js
/**
* Calls a read-only function on a contract, and returns the response.
*
* - Docs: https://viem.sh/docs/contract/readContract
* - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_reading-contracts
*
* A "read-only" function (constant function) on a Solidity contract is denoted by a `view` or `pure` keyword. They can only read the state of the contract, and cannot make any changes to it. Since read-only methods do not change the state of the contract, they do not require any gas to be executed, and can be called by any user without the need to pay for gas.
*
* Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`call` action](https://viem.sh/docs/actions/public/call) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).
*
* @param client - Client to use
* @param parameters - {@link ReadContractParameters}
* @returns The response from the contract. Type is inferred. {@link ReadContractReturnType}
*
* @example
* import { createPublicClient, http, parseAbi } from 'viem'
* import { mainnet } from 'viem/chains'
* import { readContract } from 'viem/contract'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const result = await readContract(client, {
*   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
*   abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
*   functionName: 'balanceOf',
*   args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
* })
* // 424122n
*/
async function readContract(client, parameters) {
	const { abi, address, args, functionName, ...rest } = parameters;
	const calldata = encodeFunctionData({
		abi,
		args,
		functionName
	});
	try {
		const { data } = await getAction(client, call, "call")({
			...rest,
			data: calldata,
			to: address
		});
		return decodeFunctionResult({
			abi,
			args,
			functionName,
			data: data || "0x"
		});
	} catch (error) {
		throw getContractError(error, {
			abi,
			address,
			args,
			docsPath: "/docs/contract/readContract",
			functionName
		});
	}
}
//#endregion
//#region node_modules/viem/_esm/accounts/utils/publicKeyToAddress.js
/**
* @description Converts an ECDSA public key to an address.
*
* @param publicKey The public key to convert.
*
* @returns The address.
*/
function publicKeyToAddress(publicKey) {
	return checksumAddress(`0x${keccak256$1(`0x${publicKey.substring(4)}`).substring(26)}`);
}
//#endregion
//#region node_modules/viem/_esm/utils/signature/recoverPublicKey.js
async function recoverPublicKey$1({ hash, signature }) {
	const hashHex = isHex(hash) ? hash : toHex$3(hash);
	const { secp256k1 } = await import("./secp256k1-C6EqCcUM.js").then((n) => n.n);
	return `0x${(() => {
		if (typeof signature === "object" && "r" in signature && "s" in signature) {
			const { r, s, v, yParity } = signature;
			const recoveryBit = toRecoveryBit(Number(yParity ?? v));
			return new secp256k1.Signature(hexToBigInt(r), hexToBigInt(s)).addRecoveryBit(recoveryBit);
		}
		const signatureHex = isHex(signature) ? signature : toHex$3(signature);
		if (size$2(signatureHex) !== 65) throw new Error("invalid signature length");
		const recoveryBit = toRecoveryBit(hexToNumber(`0x${signatureHex.slice(130)}`));
		return secp256k1.Signature.fromCompact(signatureHex.substring(2, 130)).addRecoveryBit(recoveryBit);
	})().recoverPublicKey(hashHex.substring(2)).toHex(false)}`;
}
function toRecoveryBit(yParityOrV) {
	if (yParityOrV === 0 || yParityOrV === 1) return yParityOrV;
	if (yParityOrV === 27) return 0;
	if (yParityOrV === 28) return 1;
	throw new Error("Invalid yParityOrV value");
}
//#endregion
//#region node_modules/viem/_esm/utils/signature/recoverAddress.js
async function recoverAddress$1({ hash, signature }) {
	return publicKeyToAddress(await recoverPublicKey$1({
		hash,
		signature
	}));
}
//#endregion
//#region node_modules/viem/_esm/utils/encoding/toRlp.js
function toRlp(bytes, to = "hex") {
	const encodable = getEncodable$1(bytes);
	const cursor = createCursor(new Uint8Array(encodable.length));
	encodable.encode(cursor);
	if (to === "hex") return bytesToHex$1(cursor.bytes);
	return cursor.bytes;
}
function getEncodable$1(bytes) {
	if (Array.isArray(bytes)) return getEncodableList$1(bytes.map((x) => getEncodable$1(x)));
	return getEncodableBytes$1(bytes);
}
function getEncodableList$1(list) {
	const bodyLength = list.reduce((acc, x) => acc + x.length, 0);
	const sizeOfBodyLength = getSizeOfLength$1(bodyLength);
	return {
		length: (() => {
			if (bodyLength <= 55) return 1 + bodyLength;
			return 1 + sizeOfBodyLength + bodyLength;
		})(),
		encode(cursor) {
			if (bodyLength <= 55) cursor.pushByte(192 + bodyLength);
			else {
				cursor.pushByte(247 + sizeOfBodyLength);
				if (sizeOfBodyLength === 1) cursor.pushUint8(bodyLength);
				else if (sizeOfBodyLength === 2) cursor.pushUint16(bodyLength);
				else if (sizeOfBodyLength === 3) cursor.pushUint24(bodyLength);
				else cursor.pushUint32(bodyLength);
			}
			for (const { encode } of list) encode(cursor);
		}
	};
}
function getEncodableBytes$1(bytesOrHex) {
	const bytes = typeof bytesOrHex === "string" ? hexToBytes$1(bytesOrHex) : bytesOrHex;
	const sizeOfBytesLength = getSizeOfLength$1(bytes.length);
	return {
		length: (() => {
			if (bytes.length === 1 && bytes[0] < 128) return 1;
			if (bytes.length <= 55) return 1 + bytes.length;
			return 1 + sizeOfBytesLength + bytes.length;
		})(),
		encode(cursor) {
			if (bytes.length === 1 && bytes[0] < 128) cursor.pushBytes(bytes);
			else if (bytes.length <= 55) {
				cursor.pushByte(128 + bytes.length);
				cursor.pushBytes(bytes);
			} else {
				cursor.pushByte(183 + sizeOfBytesLength);
				if (sizeOfBytesLength === 1) cursor.pushUint8(bytes.length);
				else if (sizeOfBytesLength === 2) cursor.pushUint16(bytes.length);
				else if (sizeOfBytesLength === 3) cursor.pushUint24(bytes.length);
				else cursor.pushUint32(bytes.length);
				cursor.pushBytes(bytes);
			}
		}
	};
}
function getSizeOfLength$1(length) {
	if (length < 2 ** 8) return 1;
	if (length < 2 ** 16) return 2;
	if (length < 2 ** 24) return 3;
	if (length < 2 ** 32) return 4;
	throw new BaseError$1("Length is too large.");
}
//#endregion
//#region node_modules/viem/_esm/utils/authorization/hashAuthorization.js
/**
* Computes an Authorization hash in [EIP-7702 format](https://eips.ethereum.org/EIPS/eip-7702): `keccak256('0x05' || rlp([chain_id, address, nonce]))`.
*/
function hashAuthorization(parameters) {
	const { chainId, nonce, to } = parameters;
	const address = parameters.contractAddress ?? parameters.address;
	const hash = keccak256$1(concatHex(["0x05", toRlp([
		chainId ? numberToHex(chainId) : "0x",
		address,
		nonce ? numberToHex(nonce) : "0x"
	])]));
	if (to === "bytes") return hexToBytes$1(hash);
	return hash;
}
//#endregion
//#region node_modules/viem/_esm/utils/authorization/recoverAuthorizationAddress.js
async function recoverAuthorizationAddress(parameters) {
	const { authorization, signature } = parameters;
	return recoverAddress$1({
		hash: hashAuthorization(authorization),
		signature: signature ?? authorization
	});
}
//#endregion
//#region node_modules/viem/_esm/utils/formatters/transaction.js
var transactionType = {
	"0x0": "legacy",
	"0x1": "eip2930",
	"0x2": "eip1559",
	"0x3": "eip4844",
	"0x4": "eip7702"
};
function formatTransaction(transaction, _) {
	const transaction_ = {
		...transaction,
		blockHash: transaction.blockHash ? transaction.blockHash : null,
		blockNumber: transaction.blockNumber ? BigInt(transaction.blockNumber) : null,
		chainId: transaction.chainId ? hexToNumber(transaction.chainId) : void 0,
		gas: transaction.gas ? BigInt(transaction.gas) : void 0,
		gasPrice: transaction.gasPrice ? BigInt(transaction.gasPrice) : void 0,
		maxFeePerBlobGas: transaction.maxFeePerBlobGas ? BigInt(transaction.maxFeePerBlobGas) : void 0,
		maxFeePerGas: transaction.maxFeePerGas ? BigInt(transaction.maxFeePerGas) : void 0,
		maxPriorityFeePerGas: transaction.maxPriorityFeePerGas ? BigInt(transaction.maxPriorityFeePerGas) : void 0,
		nonce: transaction.nonce ? hexToNumber(transaction.nonce) : void 0,
		to: transaction.to ? transaction.to : null,
		transactionIndex: transaction.transactionIndex ? Number(transaction.transactionIndex) : null,
		type: transaction.type ? transactionType[transaction.type] : void 0,
		typeHex: transaction.type ? transaction.type : void 0,
		value: transaction.value ? BigInt(transaction.value) : void 0,
		v: transaction.v ? BigInt(transaction.v) : void 0
	};
	if (transaction.authorizationList) transaction_.authorizationList = formatAuthorizationList(transaction.authorizationList);
	transaction_.yParity = (() => {
		if (transaction.yParity) return Number(transaction.yParity);
		if (typeof transaction_.v === "bigint") {
			if (transaction_.v === 0n || transaction_.v === 27n) return 0;
			if (transaction_.v === 1n || transaction_.v === 28n) return 1;
			if (transaction_.v >= 35n) return transaction_.v % 2n === 0n ? 1 : 0;
		}
	})();
	if (transaction_.type === "legacy") {
		delete transaction_.accessList;
		delete transaction_.maxFeePerBlobGas;
		delete transaction_.maxFeePerGas;
		delete transaction_.maxPriorityFeePerGas;
		delete transaction_.yParity;
	}
	if (transaction_.type === "eip2930") {
		delete transaction_.maxFeePerBlobGas;
		delete transaction_.maxFeePerGas;
		delete transaction_.maxPriorityFeePerGas;
	}
	if (transaction_.type === "eip1559") delete transaction_.maxFeePerBlobGas;
	return transaction_;
}
var defineTransaction = /* @__PURE__ */ defineFormatter("transaction", formatTransaction);
function formatAuthorizationList(authorizationList) {
	return authorizationList.map((authorization) => ({
		address: authorization.address,
		chainId: Number(authorization.chainId),
		nonce: Number(authorization.nonce),
		r: authorization.r,
		s: authorization.s,
		yParity: Number(authorization.yParity)
	}));
}
//#endregion
//#region node_modules/viem/_esm/utils/formatters/block.js
function formatBlock(block, _) {
	const transactions = (block.transactions ?? []).map((transaction) => {
		if (typeof transaction === "string") return transaction;
		return formatTransaction(transaction);
	});
	return {
		...block,
		baseFeePerGas: block.baseFeePerGas ? BigInt(block.baseFeePerGas) : null,
		blobGasUsed: block.blobGasUsed ? BigInt(block.blobGasUsed) : void 0,
		difficulty: block.difficulty ? BigInt(block.difficulty) : void 0,
		excessBlobGas: block.excessBlobGas ? BigInt(block.excessBlobGas) : void 0,
		gasLimit: block.gasLimit ? BigInt(block.gasLimit) : void 0,
		gasUsed: block.gasUsed ? BigInt(block.gasUsed) : void 0,
		hash: block.hash ? block.hash : null,
		logsBloom: block.logsBloom ? block.logsBloom : null,
		nonce: block.nonce ? block.nonce : null,
		number: block.number ? BigInt(block.number) : null,
		size: block.size ? BigInt(block.size) : void 0,
		timestamp: block.timestamp ? BigInt(block.timestamp) : void 0,
		transactions,
		totalDifficulty: block.totalDifficulty ? BigInt(block.totalDifficulty) : null
	};
}
var defineBlock = /* @__PURE__ */ defineFormatter("block", formatBlock);
//#endregion
//#region node_modules/viem/_esm/utils/blob/blobsToCommitments.js
/**
* Compute commitments from a list of blobs.
*
* @example
* ```ts
* import { blobsToCommitments, toBlobs } from 'viem'
* import { kzg } from './kzg'
*
* const blobs = toBlobs({ data: '0x1234' })
* const commitments = blobsToCommitments({ blobs, kzg })
* ```
*/
function blobsToCommitments(parameters) {
	const { kzg } = parameters;
	const to = parameters.to ?? (typeof parameters.blobs[0] === "string" ? "hex" : "bytes");
	const blobs = typeof parameters.blobs[0] === "string" ? parameters.blobs.map((x) => hexToBytes$1(x)) : parameters.blobs;
	const commitments = [];
	for (const blob of blobs) commitments.push(Uint8Array.from(kzg.blobToKzgCommitment(blob)));
	return to === "bytes" ? commitments : commitments.map((x) => bytesToHex$1(x));
}
//#endregion
//#region node_modules/viem/_esm/utils/blob/blobsToProofs.js
/**
* Compute the proofs for a list of blobs and their commitments.
*
* @example
* ```ts
* import {
*   blobsToCommitments,
*   toBlobs
* } from 'viem'
* import { kzg } from './kzg'
*
* const blobs = toBlobs({ data: '0x1234' })
* const commitments = blobsToCommitments({ blobs, kzg })
* const proofs = blobsToProofs({ blobs, commitments, kzg })
* ```
*/
function blobsToProofs(parameters) {
	const { kzg } = parameters;
	const to = parameters.to ?? (typeof parameters.blobs[0] === "string" ? "hex" : "bytes");
	const blobs = typeof parameters.blobs[0] === "string" ? parameters.blobs.map((x) => hexToBytes$1(x)) : parameters.blobs;
	const commitments = typeof parameters.commitments[0] === "string" ? parameters.commitments.map((x) => hexToBytes$1(x)) : parameters.commitments;
	const proofs = [];
	for (let i = 0; i < blobs.length; i++) {
		const blob = blobs[i];
		const commitment = commitments[i];
		proofs.push(Uint8Array.from(kzg.computeBlobKzgProof(blob, commitment)));
	}
	return to === "bytes" ? proofs : proofs.map((x) => bytesToHex$1(x));
}
//#endregion
//#region node_modules/viem/node_modules/@noble/hashes/esm/sha256.js
/**
* SHA2-256 a.k.a. sha256. In JS, it is the fastest hash, even faster than Blake3.
*
* To break sha256 using birthday attack, attackers need to try 2^128 hashes.
* BTC network is doing 2^70 hashes/sec (2^95 hashes/year) as per 2025.
*
* Check out [FIPS 180-4](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf).
* @module
* @deprecated
*/
/** @deprecated Use import from `noble/hashes/sha2` module */
var sha256$4 = sha256$5;
//#endregion
//#region node_modules/viem/_esm/utils/hash/sha256.js
function sha256$3(value, to_) {
	const to = to_ || "hex";
	const bytes = sha256$4(isHex(value, { strict: false }) ? toBytes$2(value) : value);
	if (to === "bytes") return bytes;
	return toHex$3(bytes);
}
//#endregion
//#region node_modules/viem/_esm/utils/blob/commitmentToVersionedHash.js
/**
* Transform a commitment to it's versioned hash.
*
* @example
* ```ts
* import {
*   blobsToCommitments,
*   commitmentToVersionedHash,
*   toBlobs
* } from 'viem'
* import { kzg } from './kzg'
*
* const blobs = toBlobs({ data: '0x1234' })
* const [commitment] = blobsToCommitments({ blobs, kzg })
* const versionedHash = commitmentToVersionedHash({ commitment })
* ```
*/
function commitmentToVersionedHash(parameters) {
	const { commitment, version = 1 } = parameters;
	const to = parameters.to ?? (typeof commitment === "string" ? "hex" : "bytes");
	const versionedHash = sha256$3(commitment, "bytes");
	versionedHash.set([version], 0);
	return to === "bytes" ? versionedHash : bytesToHex$1(versionedHash);
}
//#endregion
//#region node_modules/viem/_esm/utils/blob/commitmentsToVersionedHashes.js
/**
* Transform a list of commitments to their versioned hashes.
*
* @example
* ```ts
* import {
*   blobsToCommitments,
*   commitmentsToVersionedHashes,
*   toBlobs
* } from 'viem'
* import { kzg } from './kzg'
*
* const blobs = toBlobs({ data: '0x1234' })
* const commitments = blobsToCommitments({ blobs, kzg })
* const versionedHashes = commitmentsToVersionedHashes({ commitments })
* ```
*/
function commitmentsToVersionedHashes(parameters) {
	const { commitments, version } = parameters;
	const to = parameters.to ?? (typeof commitments[0] === "string" ? "hex" : "bytes");
	const hashes = [];
	for (const commitment of commitments) hashes.push(commitmentToVersionedHash({
		commitment,
		to,
		version
	}));
	return hashes;
}
//#endregion
//#region node_modules/viem/_esm/constants/blob.js
/** Blob limit per transaction. */
var blobsPerTransaction = 6;
/** The number of field elements in a blob. */
var fieldElementsPerBlob = 4096;
/** The number of bytes in a blob. */
var bytesPerBlob = 32 * fieldElementsPerBlob;
/** Blob bytes limit per transaction. */
var maxBytesPerTransaction = bytesPerBlob * blobsPerTransaction - 1 - 1 * fieldElementsPerBlob * blobsPerTransaction;
//#endregion
//#region node_modules/viem/_esm/errors/blob.js
var BlobSizeTooLargeError = class extends BaseError$1 {
	constructor({ maxSize, size }) {
		super("Blob size is too large.", {
			metaMessages: [`Max: ${maxSize} bytes`, `Given: ${size} bytes`],
			name: "BlobSizeTooLargeError"
		});
	}
};
var EmptyBlobError = class extends BaseError$1 {
	constructor() {
		super("Blob data must not be empty.", { name: "EmptyBlobError" });
	}
};
var InvalidVersionedHashSizeError = class extends BaseError$1 {
	constructor({ hash, size }) {
		super(`Versioned hash "${hash}" size is invalid.`, {
			metaMessages: ["Expected: 32", `Received: ${size}`],
			name: "InvalidVersionedHashSizeError"
		});
	}
};
var InvalidVersionedHashVersionError = class extends BaseError$1 {
	constructor({ hash, version }) {
		super(`Versioned hash "${hash}" version is invalid.`, {
			metaMessages: [`Expected: 1`, `Received: ${version}`],
			name: "InvalidVersionedHashVersionError"
		});
	}
};
//#endregion
//#region node_modules/viem/_esm/utils/blob/toBlobs.js
/**
* Transforms arbitrary data to blobs.
*
* @example
* ```ts
* import { toBlobs, stringToHex } from 'viem'
*
* const blobs = toBlobs({ data: stringToHex('hello world') })
* ```
*/
function toBlobs(parameters) {
	const to = parameters.to ?? (typeof parameters.data === "string" ? "hex" : "bytes");
	const data = typeof parameters.data === "string" ? hexToBytes$1(parameters.data) : parameters.data;
	const size_ = size$2(data);
	if (!size_) throw new EmptyBlobError();
	if (size_ > 761855) throw new BlobSizeTooLargeError({
		maxSize: maxBytesPerTransaction,
		size: size_
	});
	const blobs = [];
	let active = true;
	let position = 0;
	while (active) {
		const blob = createCursor(new Uint8Array(bytesPerBlob));
		let size = 0;
		while (size < fieldElementsPerBlob) {
			const bytes = data.slice(position, position + 31);
			blob.pushByte(0);
			blob.pushBytes(bytes);
			if (bytes.length < 31) {
				blob.pushByte(128);
				active = false;
				break;
			}
			size++;
			position += 31;
		}
		blobs.push(blob);
	}
	return to === "bytes" ? blobs.map((x) => x.bytes) : blobs.map((x) => bytesToHex$1(x.bytes));
}
//#endregion
//#region node_modules/viem/_esm/utils/blob/toBlobSidecars.js
/**
* Transforms arbitrary data (or blobs, commitments, & proofs) into a sidecar array.
*
* @example
* ```ts
* import { toBlobSidecars, stringToHex } from 'viem'
*
* const sidecars = toBlobSidecars({ data: stringToHex('hello world') })
* ```
*
* @example
* ```ts
* import {
*   blobsToCommitments,
*   toBlobs,
*   blobsToProofs,
*   toBlobSidecars,
*   stringToHex
* } from 'viem'
*
* const blobs = toBlobs({ data: stringToHex('hello world') })
* const commitments = blobsToCommitments({ blobs, kzg })
* const proofs = blobsToProofs({ blobs, commitments, kzg })
*
* const sidecars = toBlobSidecars({ blobs, commitments, proofs })
* ```
*/
function toBlobSidecars(parameters) {
	const { data, kzg, to } = parameters;
	const blobs = parameters.blobs ?? toBlobs({
		data,
		to
	});
	const commitments = parameters.commitments ?? blobsToCommitments({
		blobs,
		kzg,
		to
	});
	const proofs = parameters.proofs ?? blobsToProofs({
		blobs,
		commitments,
		kzg,
		to
	});
	const sidecars = [];
	for (let i = 0; i < blobs.length; i++) sidecars.push({
		blob: blobs[i],
		commitment: commitments[i],
		proof: proofs[i]
	});
	return sidecars;
}
//#endregion
//#region node_modules/viem/_esm/utils/transaction/getTransactionType.js
function getTransactionType(transaction) {
	if (transaction.type) return transaction.type;
	if (typeof transaction.authorizationList !== "undefined") return "eip7702";
	if (typeof transaction.blobs !== "undefined" || typeof transaction.blobVersionedHashes !== "undefined" || typeof transaction.maxFeePerBlobGas !== "undefined" || typeof transaction.sidecars !== "undefined") return "eip4844";
	if (typeof transaction.maxFeePerGas !== "undefined" || typeof transaction.maxPriorityFeePerGas !== "undefined") return "eip1559";
	if (typeof transaction.gasPrice !== "undefined") {
		if (typeof transaction.accessList !== "undefined") return "eip2930";
		return "legacy";
	}
	throw new InvalidSerializableTransactionError({ transaction });
}
//#endregion
//#region node_modules/viem/_esm/actions/public/getCode.js
/**
* Retrieves the bytecode at an address.
*
* - Docs: https://viem.sh/docs/contract/getCode
* - JSON-RPC Methods: [`eth_getCode`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getcode)
*
* @param client - Client to use
* @param parameters - {@link GetCodeParameters}
* @returns The contract's bytecode. {@link GetCodeReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getCode } from 'viem/contract'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const code = await getCode(client, {
*   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
* })
*/
async function getCode(client, { address, blockNumber, blockTag = "latest" }) {
	const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
	const hex = await client.request({
		method: "eth_getCode",
		params: [address, blockNumberHex || blockTag]
	}, { dedupe: Boolean(blockNumberHex) });
	if (hex === "0x") return void 0;
	return hex;
}
//#endregion
//#region node_modules/viem/_esm/utils/formatters/log.js
function formatLog(log, { args, eventName } = {}) {
	return {
		...log,
		blockHash: log.blockHash ? log.blockHash : null,
		blockNumber: log.blockNumber ? BigInt(log.blockNumber) : null,
		blockTimestamp: log.blockTimestamp ? BigInt(log.blockTimestamp) : log.blockTimestamp === null ? null : void 0,
		logIndex: log.logIndex ? Number(log.logIndex) : null,
		transactionHash: log.transactionHash ? log.transactionHash : null,
		transactionIndex: log.transactionIndex ? Number(log.transactionIndex) : null,
		...eventName ? {
			args,
			eventName
		} : {}
	};
}
//#endregion
//#region node_modules/viem/_esm/utils/authorization/verifyAuthorization.js
/**
* Verify that an Authorization object was signed by the provided address.
*
* - Docs {@link https://viem.sh/docs/utilities/verifyAuthorization}
*
* @param parameters - {@link VerifyAuthorizationParameters}
* @returns Whether or not the signature is valid. {@link VerifyAuthorizationReturnType}
*/
async function verifyAuthorization({ address, authorization, signature }) {
	return isAddressEqual(getAddress(address), await recoverAuthorizationAddress({
		authorization,
		signature
	}));
}
//#endregion
//#region node_modules/viem/_esm/utils/formatters/transactionReceipt.js
var receiptStatuses = {
	"0x0": "reverted",
	"0x1": "success"
};
function formatTransactionReceipt(transactionReceipt, _) {
	const receipt = {
		...transactionReceipt,
		blockNumber: transactionReceipt.blockNumber ? BigInt(transactionReceipt.blockNumber) : null,
		contractAddress: transactionReceipt.contractAddress ? transactionReceipt.contractAddress : null,
		cumulativeGasUsed: transactionReceipt.cumulativeGasUsed ? BigInt(transactionReceipt.cumulativeGasUsed) : null,
		effectiveGasPrice: transactionReceipt.effectiveGasPrice ? BigInt(transactionReceipt.effectiveGasPrice) : null,
		gasUsed: transactionReceipt.gasUsed ? BigInt(transactionReceipt.gasUsed) : null,
		logs: transactionReceipt.logs ? transactionReceipt.logs.map((log) => formatLog(log)) : null,
		to: transactionReceipt.to ? transactionReceipt.to : null,
		transactionIndex: transactionReceipt.transactionIndex ? hexToNumber(transactionReceipt.transactionIndex) : null,
		status: transactionReceipt.status ? receiptStatuses[transactionReceipt.status] : null,
		type: transactionReceipt.type ? transactionType[transactionReceipt.type] || transactionReceipt.type : null
	};
	if (transactionReceipt.blobGasPrice) receipt.blobGasPrice = BigInt(transactionReceipt.blobGasPrice);
	if (transactionReceipt.blobGasUsed) receipt.blobGasUsed = BigInt(transactionReceipt.blobGasUsed);
	return receipt;
}
var defineTransactionReceipt = /* @__PURE__ */ defineFormatter("transactionReceipt", formatTransactionReceipt);
//#endregion
//#region node_modules/ox/_esm/core/internal/lru.js
/**
* @internal
*
* Map with a LRU (Least recently used) policy.
* @see https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU
*/
var LruMap = class extends Map {
	constructor(size) {
		super();
		Object.defineProperty(this, "maxSize", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.maxSize = size;
	}
	get(key) {
		const value = super.get(key);
		if (super.has(key) && value !== void 0) {
			this.delete(key);
			super.set(key, value);
		}
		return value;
	}
	set(key, value) {
		super.set(key, value);
		if (this.maxSize && this.size > this.maxSize) {
			const firstKey = this.keys().next().value;
			if (firstKey) this.delete(firstKey);
		}
		return this;
	}
};
var checksum$1 = { checksum: /* @__PURE__ */ new LruMap(8192) }.checksum;
//#endregion
//#region node_modules/ox/node_modules/@noble/hashes/esm/crypto.js
var crypto = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
//#endregion
//#region node_modules/ox/node_modules/@noble/hashes/esm/utils.js
/**
* Utilities for hex, bytes, CSPRNG.
* @module
*/
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
/** Checks if something is Uint8Array. Be careful: nodejs Buffer will return true. */
function isBytes(a) {
	return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
/** Asserts something is positive integer. */
function anumber(n) {
	if (!Number.isSafeInteger(n) || n < 0) throw new Error("positive integer expected, got " + n);
}
/** Asserts something is Uint8Array. */
function abytes(b, ...lengths) {
	if (!isBytes(b)) throw new Error("Uint8Array expected");
	if (lengths.length > 0 && !lengths.includes(b.length)) throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
}
/** Asserts something is hash */
function ahash(h) {
	if (typeof h !== "function" || typeof h.create !== "function") throw new Error("Hash should be wrapped by utils.createHasher");
	anumber(h.outputLen);
	anumber(h.blockLen);
}
/** Asserts a hash instance has not been destroyed / finished */
function aexists(instance, checkFinished = true) {
	if (instance.destroyed) throw new Error("Hash instance has been destroyed");
	if (checkFinished && instance.finished) throw new Error("Hash#digest() has already been called");
}
/** Asserts output is properly-sized byte array */
function aoutput(out, instance) {
	abytes(out);
	const min = instance.outputLen;
	if (out.length < min) throw new Error("digestInto() expects output buffer of length at least " + min);
}
/** Cast u8 / u16 / u32 to u32. */
function u32(arr) {
	return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
/** Zeroize a byte array. Warning: JS provides no guarantees. */
function clean(...arrays) {
	for (let i = 0; i < arrays.length; i++) arrays[i].fill(0);
}
/** Create DataView of an array for easy byte-level manipulation. */
function createView(arr) {
	return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
/** The rotate right (circular right shift) operation for uint32 */
function rotr(word, shift) {
	return word << 32 - shift | word >>> shift;
}
/** Is current platform little-endian? Most are. Big-Endian platform: IBM */
var isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
/** The byte swap operation for uint32 */
function byteSwap(word) {
	return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
}
/** In place byte swap for Uint32Array */
function byteSwap32(arr) {
	for (let i = 0; i < arr.length; i++) arr[i] = byteSwap(arr[i]);
	return arr;
}
var swap32IfBE = isLE ? (u) => u : byteSwap32;
typeof Uint8Array.from([]).toHex === "function" && Uint8Array.fromHex;
/**
* Converts string to bytes using UTF8 encoding.
* @example utf8ToBytes('abc') // Uint8Array.from([97, 98, 99])
*/
function utf8ToBytes(str) {
	if (typeof str !== "string") throw new Error("string expected");
	return new Uint8Array(new TextEncoder().encode(str));
}
/**
* Normalizes (non-hex) string or Uint8Array to Uint8Array.
* Warning: when Uint8Array is passed, it would NOT get copied.
* Keep in mind for future mutable operations.
*/
function toBytes$1(data) {
	if (typeof data === "string") data = utf8ToBytes(data);
	abytes(data);
	return data;
}
/** Copies several Uint8Arrays into one. */
function concatBytes(...arrays) {
	let sum = 0;
	for (let i = 0; i < arrays.length; i++) {
		const a = arrays[i];
		abytes(a);
		sum += a.length;
	}
	const res = new Uint8Array(sum);
	for (let i = 0, pad = 0; i < arrays.length; i++) {
		const a = arrays[i];
		res.set(a, pad);
		pad += a.length;
	}
	return res;
}
/** For runtime check if class implements interface */
var Hash = class {};
/** Wraps hash function, creating an interface on top of it */
function createHasher$1(hashCons) {
	const hashC = (msg) => hashCons().update(toBytes$1(msg)).digest();
	const tmp = hashCons();
	hashC.outputLen = tmp.outputLen;
	hashC.blockLen = tmp.blockLen;
	hashC.create = () => hashCons();
	return hashC;
}
function createXOFer(hashCons) {
	const hashC = (msg, opts) => hashCons(opts).update(toBytes$1(msg)).digest();
	const tmp = hashCons({});
	hashC.outputLen = tmp.outputLen;
	hashC.blockLen = tmp.blockLen;
	hashC.create = (opts) => hashCons(opts);
	return hashC;
}
/** Cryptographically secure PRNG. Uses internal OS-level `crypto.getRandomValues`. */
function randomBytes(bytesLength = 32) {
	if (crypto && typeof crypto.getRandomValues === "function") return crypto.getRandomValues(new Uint8Array(bytesLength));
	if (crypto && typeof crypto.randomBytes === "function") return Uint8Array.from(crypto.randomBytes(bytesLength));
	throw new Error("crypto.getRandomValues must be defined");
}
//#endregion
//#region node_modules/ox/node_modules/@noble/hashes/esm/hmac.js
/**
* HMAC: RFC2104 message authentication code.
* @module
*/
var HMAC = class extends Hash {
	constructor(hash, _key) {
		super();
		this.finished = false;
		this.destroyed = false;
		ahash(hash);
		const key = toBytes$1(_key);
		this.iHash = hash.create();
		if (typeof this.iHash.update !== "function") throw new Error("Expected instance of class which extends utils.Hash");
		this.blockLen = this.iHash.blockLen;
		this.outputLen = this.iHash.outputLen;
		const blockLen = this.blockLen;
		const pad = new Uint8Array(blockLen);
		pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
		for (let i = 0; i < pad.length; i++) pad[i] ^= 54;
		this.iHash.update(pad);
		this.oHash = hash.create();
		for (let i = 0; i < pad.length; i++) pad[i] ^= 106;
		this.oHash.update(pad);
		clean(pad);
	}
	update(buf) {
		aexists(this);
		this.iHash.update(buf);
		return this;
	}
	digestInto(out) {
		aexists(this);
		abytes(out, this.outputLen);
		this.finished = true;
		this.iHash.digestInto(out);
		this.oHash.update(out);
		this.oHash.digestInto(out);
		this.destroy();
	}
	digest() {
		const out = new Uint8Array(this.oHash.outputLen);
		this.digestInto(out);
		return out;
	}
	_cloneInto(to) {
		to || (to = Object.create(Object.getPrototypeOf(this), {}));
		const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
		to = to;
		to.finished = finished;
		to.destroyed = destroyed;
		to.blockLen = blockLen;
		to.outputLen = outputLen;
		to.oHash = oHash._cloneInto(to.oHash);
		to.iHash = iHash._cloneInto(to.iHash);
		return to;
	}
	clone() {
		return this._cloneInto();
	}
	destroy() {
		this.destroyed = true;
		this.oHash.destroy();
		this.iHash.destroy();
	}
};
/**
* HMAC: RFC2104 message authentication code.
* @param hash - function that would be used e.g. sha256
* @param key - message key
* @param message - message data
* @example
* import { hmac } from '@noble/hashes/hmac';
* import { sha256 } from '@noble/hashes/sha2';
* const mac1 = hmac(sha256, 'key', 'message');
*/
var hmac = (hash, key, message) => new HMAC(hash, key).update(message).digest();
hmac.create = (hash, key) => new HMAC(hash, key);
//#endregion
//#region node_modules/ox/node_modules/@noble/hashes/esm/_md.js
/**
* Internal Merkle-Damgard hash utils.
* @module
*/
/** Polyfill for Safari 14. https://caniuse.com/mdn-javascript_builtins_dataview_setbiguint64 */
function setBigUint64(view, byteOffset, value, isLE) {
	if (typeof view.setBigUint64 === "function") return view.setBigUint64(byteOffset, value, isLE);
	const _32n = BigInt(32);
	const _u32_max = BigInt(4294967295);
	const wh = Number(value >> _32n & _u32_max);
	const wl = Number(value & _u32_max);
	const h = isLE ? 4 : 0;
	const l = isLE ? 0 : 4;
	view.setUint32(byteOffset + h, wh, isLE);
	view.setUint32(byteOffset + l, wl, isLE);
}
/** Choice: a ? b : c */
function Chi(a, b, c) {
	return a & b ^ ~a & c;
}
/** Majority function, true if any two inputs is true. */
function Maj(a, b, c) {
	return a & b ^ a & c ^ b & c;
}
/**
* Merkle-Damgard hash construction base class.
* Could be used to create MD5, RIPEMD, SHA1, SHA2.
*/
var HashMD = class extends Hash {
	constructor(blockLen, outputLen, padOffset, isLE) {
		super();
		this.finished = false;
		this.length = 0;
		this.pos = 0;
		this.destroyed = false;
		this.blockLen = blockLen;
		this.outputLen = outputLen;
		this.padOffset = padOffset;
		this.isLE = isLE;
		this.buffer = new Uint8Array(blockLen);
		this.view = createView(this.buffer);
	}
	update(data) {
		aexists(this);
		data = toBytes$1(data);
		abytes(data);
		const { view, buffer, blockLen } = this;
		const len = data.length;
		for (let pos = 0; pos < len;) {
			const take = Math.min(blockLen - this.pos, len - pos);
			if (take === blockLen) {
				const dataView = createView(data);
				for (; blockLen <= len - pos; pos += blockLen) this.process(dataView, pos);
				continue;
			}
			buffer.set(data.subarray(pos, pos + take), this.pos);
			this.pos += take;
			pos += take;
			if (this.pos === blockLen) {
				this.process(view, 0);
				this.pos = 0;
			}
		}
		this.length += data.length;
		this.roundClean();
		return this;
	}
	digestInto(out) {
		aexists(this);
		aoutput(out, this);
		this.finished = true;
		const { buffer, view, blockLen, isLE } = this;
		let { pos } = this;
		buffer[pos++] = 128;
		clean(this.buffer.subarray(pos));
		if (this.padOffset > blockLen - pos) {
			this.process(view, 0);
			pos = 0;
		}
		for (let i = pos; i < blockLen; i++) buffer[i] = 0;
		setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
		this.process(view, 0);
		const oview = createView(out);
		const len = this.outputLen;
		if (len % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
		const outLen = len / 4;
		const state = this.get();
		if (outLen > state.length) throw new Error("_sha2: outputLen bigger than state");
		for (let i = 0; i < outLen; i++) oview.setUint32(4 * i, state[i], isLE);
	}
	digest() {
		const { buffer, outputLen } = this;
		this.digestInto(buffer);
		const res = buffer.slice(0, outputLen);
		this.destroy();
		return res;
	}
	_cloneInto(to) {
		to || (to = new this.constructor());
		to.set(...this.get());
		const { blockLen, buffer, length, finished, destroyed, pos } = this;
		to.destroyed = destroyed;
		to.finished = finished;
		to.length = length;
		to.pos = pos;
		if (length % blockLen) to.buffer.set(buffer);
		return to;
	}
	clone() {
		return this._cloneInto();
	}
};
/**
* Initial SHA-2 state: fractional parts of square roots of first 16 primes 2..53.
* Check out `test/misc/sha2-gen-iv.js` for recomputation guide.
*/
/** Initial SHA256 state. Bits 0..32 of frac part of sqrt of primes 2..19 */
var SHA256_IV = /* @__PURE__ */ Uint32Array.from([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]);
/** Initial SHA384 state. Bits 0..64 of frac part of sqrt of primes 23..53 */
var SHA384_IV = /* @__PURE__ */ Uint32Array.from([
	3418070365,
	3238371032,
	1654270250,
	914150663,
	2438529370,
	812702999,
	355462360,
	4144912697,
	1731405415,
	4290775857,
	2394180231,
	1750603025,
	3675008525,
	1694076839,
	1203062813,
	3204075428
]);
/** Initial SHA512 state. Bits 0..64 of frac part of sqrt of primes 2..19 */
var SHA512_IV = /* @__PURE__ */ Uint32Array.from([
	1779033703,
	4089235720,
	3144134277,
	2227873595,
	1013904242,
	4271175723,
	2773480762,
	1595750129,
	1359893119,
	2917565137,
	2600822924,
	725511199,
	528734635,
	4215389547,
	1541459225,
	327033209
]);
//#endregion
//#region node_modules/ox/node_modules/@noble/hashes/esm/_u64.js
/**
* Internal helpers for u64. BigUint64Array is too slow as per 2025, so we implement it using Uint32Array.
* @todo re-check https://issues.chromium.org/issues/42212588
* @module
*/
var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
var _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
	if (le) return {
		h: Number(n & U32_MASK64),
		l: Number(n >> _32n & U32_MASK64)
	};
	return {
		h: Number(n >> _32n & U32_MASK64) | 0,
		l: Number(n & U32_MASK64) | 0
	};
}
function split(lst, le = false) {
	const len = lst.length;
	let Ah = new Uint32Array(len);
	let Al = new Uint32Array(len);
	for (let i = 0; i < len; i++) {
		const { h, l } = fromBig(lst[i], le);
		[Ah[i], Al[i]] = [h, l];
	}
	return [Ah, Al];
}
var shrSH = (h, _l, s) => h >>> s;
var shrSL = (h, l, s) => h << 32 - s | l >>> s;
var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
var rotlSH = (h, l, s) => h << s | l >>> 32 - s;
var rotlSL = (h, l, s) => l << s | h >>> 32 - s;
var rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
var rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
function add(Ah, Al, Bh, Bl) {
	const l = (Al >>> 0) + (Bl >>> 0);
	return {
		h: Ah + Bh + (l / 2 ** 32 | 0) | 0,
		l: l | 0
	};
}
var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
//#endregion
//#region node_modules/ox/node_modules/@noble/hashes/esm/sha3.js
/**
* SHA3 (keccak) hash function, based on a new "Sponge function" design.
* Different from older hashes, the internal state is bigger than output size.
*
* Check out [FIPS-202](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.202.pdf),
* [Website](https://keccak.team/keccak.html),
* [the differences between SHA-3 and Keccak](https://crypto.stackexchange.com/questions/15727/what-are-the-key-differences-between-the-draft-sha-3-standard-and-the-keccak-sub).
*
* Check out `sha3-addons` module for cSHAKE, k12, and others.
* @module
*/
var _0n$4 = BigInt(0);
var _1n$4 = BigInt(1);
var _2n$3 = BigInt(2);
var _7n = BigInt(7);
var _256n = BigInt(256);
var _0x71n = BigInt(113);
var SHA3_PI = [];
var SHA3_ROTL = [];
var _SHA3_IOTA = [];
for (let round = 0, R = _1n$4, x = 1, y = 0; round < 24; round++) {
	[x, y] = [y, (2 * x + 3 * y) % 5];
	SHA3_PI.push(2 * (5 * y + x));
	SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
	let t = _0n$4;
	for (let j = 0; j < 7; j++) {
		R = (R << _1n$4 ^ (R >> _7n) * _0x71n) % _256n;
		if (R & _2n$3) t ^= _1n$4 << (_1n$4 << /* @__PURE__ */ BigInt(j)) - _1n$4;
	}
	_SHA3_IOTA.push(t);
}
var IOTAS = split(_SHA3_IOTA, true);
var SHA3_IOTA_H = IOTAS[0];
var SHA3_IOTA_L = IOTAS[1];
var rotlH = (h, l, s) => s > 32 ? rotlBH(h, l, s) : rotlSH(h, l, s);
var rotlL = (h, l, s) => s > 32 ? rotlBL(h, l, s) : rotlSL(h, l, s);
/** `keccakf1600` internal function, additionally allows to adjust round count. */
function keccakP(s, rounds = 24) {
	const B = new Uint32Array(10);
	for (let round = 24 - rounds; round < 24; round++) {
		for (let x = 0; x < 10; x++) B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
		for (let x = 0; x < 10; x += 2) {
			const idx1 = (x + 8) % 10;
			const idx0 = (x + 2) % 10;
			const B0 = B[idx0];
			const B1 = B[idx0 + 1];
			const Th = rotlH(B0, B1, 1) ^ B[idx1];
			const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
			for (let y = 0; y < 50; y += 10) {
				s[x + y] ^= Th;
				s[x + y + 1] ^= Tl;
			}
		}
		let curH = s[2];
		let curL = s[3];
		for (let t = 0; t < 24; t++) {
			const shift = SHA3_ROTL[t];
			const Th = rotlH(curH, curL, shift);
			const Tl = rotlL(curH, curL, shift);
			const PI = SHA3_PI[t];
			curH = s[PI];
			curL = s[PI + 1];
			s[PI] = Th;
			s[PI + 1] = Tl;
		}
		for (let y = 0; y < 50; y += 10) {
			for (let x = 0; x < 10; x++) B[x] = s[y + x];
			for (let x = 0; x < 10; x++) s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
		}
		s[0] ^= SHA3_IOTA_H[round];
		s[1] ^= SHA3_IOTA_L[round];
	}
	clean(B);
}
/** Keccak sponge function. */
var Keccak = class Keccak extends Hash {
	constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
		super();
		this.pos = 0;
		this.posOut = 0;
		this.finished = false;
		this.destroyed = false;
		this.enableXOF = false;
		this.blockLen = blockLen;
		this.suffix = suffix;
		this.outputLen = outputLen;
		this.enableXOF = enableXOF;
		this.rounds = rounds;
		anumber(outputLen);
		if (!(0 < blockLen && blockLen < 200)) throw new Error("only keccak-f1600 function is supported");
		this.state = new Uint8Array(200);
		this.state32 = u32(this.state);
	}
	clone() {
		return this._cloneInto();
	}
	keccak() {
		swap32IfBE(this.state32);
		keccakP(this.state32, this.rounds);
		swap32IfBE(this.state32);
		this.posOut = 0;
		this.pos = 0;
	}
	update(data) {
		aexists(this);
		data = toBytes$1(data);
		abytes(data);
		const { blockLen, state } = this;
		const len = data.length;
		for (let pos = 0; pos < len;) {
			const take = Math.min(blockLen - this.pos, len - pos);
			for (let i = 0; i < take; i++) state[this.pos++] ^= data[pos++];
			if (this.pos === blockLen) this.keccak();
		}
		return this;
	}
	finish() {
		if (this.finished) return;
		this.finished = true;
		const { state, suffix, pos, blockLen } = this;
		state[pos] ^= suffix;
		if ((suffix & 128) !== 0 && pos === blockLen - 1) this.keccak();
		state[blockLen - 1] ^= 128;
		this.keccak();
	}
	writeInto(out) {
		aexists(this, false);
		abytes(out);
		this.finish();
		const bufferOut = this.state;
		const { blockLen } = this;
		for (let pos = 0, len = out.length; pos < len;) {
			if (this.posOut >= blockLen) this.keccak();
			const take = Math.min(blockLen - this.posOut, len - pos);
			out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
			this.posOut += take;
			pos += take;
		}
		return out;
	}
	xofInto(out) {
		if (!this.enableXOF) throw new Error("XOF is not possible for this instance");
		return this.writeInto(out);
	}
	xof(bytes) {
		anumber(bytes);
		return this.xofInto(new Uint8Array(bytes));
	}
	digestInto(out) {
		aoutput(out, this);
		if (this.finished) throw new Error("digest() was already called");
		this.writeInto(out);
		this.destroy();
		return out;
	}
	digest() {
		return this.digestInto(new Uint8Array(this.outputLen));
	}
	destroy() {
		this.destroyed = true;
		clean(this.state);
	}
	_cloneInto(to) {
		const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
		to || (to = new Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
		to.state32.set(this.state32);
		to.pos = this.pos;
		to.posOut = this.posOut;
		to.finished = this.finished;
		to.rounds = rounds;
		to.suffix = suffix;
		to.outputLen = outputLen;
		to.enableXOF = enableXOF;
		to.destroyed = this.destroyed;
		return to;
	}
};
var gen = (suffix, blockLen, outputLen) => createHasher$1(() => new Keccak(blockLen, suffix, outputLen));
gen(6, 144, 224 / 8);
gen(6, 136, 256 / 8);
gen(6, 104, 384 / 8);
gen(6, 72, 512 / 8);
gen(1, 144, 224 / 8);
/** keccak-256 hash function. Different from SHA3-256. */
var keccak_256 = gen(1, 136, 256 / 8);
gen(1, 104, 384 / 8);
gen(1, 72, 512 / 8);
var genShake = (suffix, blockLen, outputLen) => createXOFer((opts = {}) => new Keccak(blockLen, suffix, opts.dkLen === void 0 ? outputLen : opts.dkLen, true));
genShake(31, 168, 128 / 8);
genShake(31, 136, 256 / 8);
//#endregion
//#region node_modules/ox/node_modules/@noble/hashes/esm/sha2.js
/**
* SHA2 hash function. A.k.a. sha256, sha384, sha512, sha512_224, sha512_256.
* SHA256 is the fastest hash implementable in JS, even faster than Blake3.
* Check out [RFC 4634](https://datatracker.ietf.org/doc/html/rfc4634) and
* [FIPS 180-4](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf).
* @module
*/
/**
* Round constants:
* First 32 bits of fractional parts of the cube roots of the first 64 primes 2..311)
*/
var SHA256_K = /* @__PURE__ */ Uint32Array.from([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]);
/** Reusable temporary buffer. "W" comes straight from spec. */
var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
var SHA256 = class extends HashMD {
	constructor(outputLen = 32) {
		super(64, outputLen, 8, false);
		this.A = SHA256_IV[0] | 0;
		this.B = SHA256_IV[1] | 0;
		this.C = SHA256_IV[2] | 0;
		this.D = SHA256_IV[3] | 0;
		this.E = SHA256_IV[4] | 0;
		this.F = SHA256_IV[5] | 0;
		this.G = SHA256_IV[6] | 0;
		this.H = SHA256_IV[7] | 0;
	}
	get() {
		const { A, B, C, D, E, F, G, H } = this;
		return [
			A,
			B,
			C,
			D,
			E,
			F,
			G,
			H
		];
	}
	set(A, B, C, D, E, F, G, H) {
		this.A = A | 0;
		this.B = B | 0;
		this.C = C | 0;
		this.D = D | 0;
		this.E = E | 0;
		this.F = F | 0;
		this.G = G | 0;
		this.H = H | 0;
	}
	process(view, offset) {
		for (let i = 0; i < 16; i++, offset += 4) SHA256_W[i] = view.getUint32(offset, false);
		for (let i = 16; i < 64; i++) {
			const W15 = SHA256_W[i - 15];
			const W2 = SHA256_W[i - 2];
			const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
			SHA256_W[i] = (rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10) + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
		}
		let { A, B, C, D, E, F, G, H } = this;
		for (let i = 0; i < 64; i++) {
			const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
			const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
			const T2 = (rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22)) + Maj(A, B, C) | 0;
			H = G;
			G = F;
			F = E;
			E = D + T1 | 0;
			D = C;
			C = B;
			B = A;
			A = T1 + T2 | 0;
		}
		A = A + this.A | 0;
		B = B + this.B | 0;
		C = C + this.C | 0;
		D = D + this.D | 0;
		E = E + this.E | 0;
		F = F + this.F | 0;
		G = G + this.G | 0;
		H = H + this.H | 0;
		this.set(A, B, C, D, E, F, G, H);
	}
	roundClean() {
		clean(SHA256_W);
	}
	destroy() {
		this.set(0, 0, 0, 0, 0, 0, 0, 0);
		clean(this.buffer);
	}
};
var K512 = split([
	"0x428a2f98d728ae22",
	"0x7137449123ef65cd",
	"0xb5c0fbcfec4d3b2f",
	"0xe9b5dba58189dbbc",
	"0x3956c25bf348b538",
	"0x59f111f1b605d019",
	"0x923f82a4af194f9b",
	"0xab1c5ed5da6d8118",
	"0xd807aa98a3030242",
	"0x12835b0145706fbe",
	"0x243185be4ee4b28c",
	"0x550c7dc3d5ffb4e2",
	"0x72be5d74f27b896f",
	"0x80deb1fe3b1696b1",
	"0x9bdc06a725c71235",
	"0xc19bf174cf692694",
	"0xe49b69c19ef14ad2",
	"0xefbe4786384f25e3",
	"0x0fc19dc68b8cd5b5",
	"0x240ca1cc77ac9c65",
	"0x2de92c6f592b0275",
	"0x4a7484aa6ea6e483",
	"0x5cb0a9dcbd41fbd4",
	"0x76f988da831153b5",
	"0x983e5152ee66dfab",
	"0xa831c66d2db43210",
	"0xb00327c898fb213f",
	"0xbf597fc7beef0ee4",
	"0xc6e00bf33da88fc2",
	"0xd5a79147930aa725",
	"0x06ca6351e003826f",
	"0x142929670a0e6e70",
	"0x27b70a8546d22ffc",
	"0x2e1b21385c26c926",
	"0x4d2c6dfc5ac42aed",
	"0x53380d139d95b3df",
	"0x650a73548baf63de",
	"0x766a0abb3c77b2a8",
	"0x81c2c92e47edaee6",
	"0x92722c851482353b",
	"0xa2bfe8a14cf10364",
	"0xa81a664bbc423001",
	"0xc24b8b70d0f89791",
	"0xc76c51a30654be30",
	"0xd192e819d6ef5218",
	"0xd69906245565a910",
	"0xf40e35855771202a",
	"0x106aa07032bbd1b8",
	"0x19a4c116b8d2d0c8",
	"0x1e376c085141ab53",
	"0x2748774cdf8eeb99",
	"0x34b0bcb5e19b48a8",
	"0x391c0cb3c5c95a63",
	"0x4ed8aa4ae3418acb",
	"0x5b9cca4f7763e373",
	"0x682e6ff3d6b2b8a3",
	"0x748f82ee5defb2fc",
	"0x78a5636f43172f60",
	"0x84c87814a1f0ab72",
	"0x8cc702081a6439ec",
	"0x90befffa23631e28",
	"0xa4506cebde82bde9",
	"0xbef9a3f7b2c67915",
	"0xc67178f2e372532b",
	"0xca273eceea26619c",
	"0xd186b8c721c0c207",
	"0xeada7dd6cde0eb1e",
	"0xf57d4f7fee6ed178",
	"0x06f067aa72176fba",
	"0x0a637dc5a2c898a6",
	"0x113f9804bef90dae",
	"0x1b710b35131c471b",
	"0x28db77f523047d84",
	"0x32caab7b40c72493",
	"0x3c9ebe0a15c9bebc",
	"0x431d67c49c100d4c",
	"0x4cc5d4becb3e42b6",
	"0x597f299cfc657e2a",
	"0x5fcb6fab3ad6faec",
	"0x6c44198c4a475817"
].map((n) => BigInt(n)));
var SHA512_Kh = K512[0];
var SHA512_Kl = K512[1];
var SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
var SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
var SHA512 = class extends HashMD {
	constructor(outputLen = 64) {
		super(128, outputLen, 16, false);
		this.Ah = SHA512_IV[0] | 0;
		this.Al = SHA512_IV[1] | 0;
		this.Bh = SHA512_IV[2] | 0;
		this.Bl = SHA512_IV[3] | 0;
		this.Ch = SHA512_IV[4] | 0;
		this.Cl = SHA512_IV[5] | 0;
		this.Dh = SHA512_IV[6] | 0;
		this.Dl = SHA512_IV[7] | 0;
		this.Eh = SHA512_IV[8] | 0;
		this.El = SHA512_IV[9] | 0;
		this.Fh = SHA512_IV[10] | 0;
		this.Fl = SHA512_IV[11] | 0;
		this.Gh = SHA512_IV[12] | 0;
		this.Gl = SHA512_IV[13] | 0;
		this.Hh = SHA512_IV[14] | 0;
		this.Hl = SHA512_IV[15] | 0;
	}
	get() {
		const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
		return [
			Ah,
			Al,
			Bh,
			Bl,
			Ch,
			Cl,
			Dh,
			Dl,
			Eh,
			El,
			Fh,
			Fl,
			Gh,
			Gl,
			Hh,
			Hl
		];
	}
	set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
		this.Ah = Ah | 0;
		this.Al = Al | 0;
		this.Bh = Bh | 0;
		this.Bl = Bl | 0;
		this.Ch = Ch | 0;
		this.Cl = Cl | 0;
		this.Dh = Dh | 0;
		this.Dl = Dl | 0;
		this.Eh = Eh | 0;
		this.El = El | 0;
		this.Fh = Fh | 0;
		this.Fl = Fl | 0;
		this.Gh = Gh | 0;
		this.Gl = Gl | 0;
		this.Hh = Hh | 0;
		this.Hl = Hl | 0;
	}
	process(view, offset) {
		for (let i = 0; i < 16; i++, offset += 4) {
			SHA512_W_H[i] = view.getUint32(offset);
			SHA512_W_L[i] = view.getUint32(offset += 4);
		}
		for (let i = 16; i < 80; i++) {
			const W15h = SHA512_W_H[i - 15] | 0;
			const W15l = SHA512_W_L[i - 15] | 0;
			const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
			const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
			const W2h = SHA512_W_H[i - 2] | 0;
			const W2l = SHA512_W_L[i - 2] | 0;
			const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
			const SUMl = add4L(s0l, rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6), SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
			SHA512_W_H[i] = add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]) | 0;
			SHA512_W_L[i] = SUMl | 0;
		}
		let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
		for (let i = 0; i < 80; i++) {
			const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
			const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
			const CHIh = Eh & Fh ^ ~Eh & Gh;
			const CHIl = El & Fl ^ ~El & Gl;
			const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
			const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
			const T1l = T1ll | 0;
			const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
			const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
			const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
			const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
			Hh = Gh | 0;
			Hl = Gl | 0;
			Gh = Fh | 0;
			Gl = Fl | 0;
			Fh = Eh | 0;
			Fl = El | 0;
			({h: Eh, l: El} = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
			Dh = Ch | 0;
			Dl = Cl | 0;
			Ch = Bh | 0;
			Cl = Bl | 0;
			Bh = Ah | 0;
			Bl = Al | 0;
			const All = add3L(T1l, sigma0l, MAJl);
			Ah = add3H(All, T1h, sigma0h, MAJh);
			Al = All | 0;
		}
		({h: Ah, l: Al} = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
		({h: Bh, l: Bl} = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
		({h: Ch, l: Cl} = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
		({h: Dh, l: Dl} = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
		({h: Eh, l: El} = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
		({h: Fh, l: Fl} = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
		({h: Gh, l: Gl} = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
		({h: Hh, l: Hl} = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
		this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
	}
	roundClean() {
		clean(SHA512_W_H, SHA512_W_L);
	}
	destroy() {
		clean(this.buffer);
		this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	}
};
var SHA384 = class extends SHA512 {
	constructor() {
		super(48);
		this.Ah = SHA384_IV[0] | 0;
		this.Al = SHA384_IV[1] | 0;
		this.Bh = SHA384_IV[2] | 0;
		this.Bl = SHA384_IV[3] | 0;
		this.Ch = SHA384_IV[4] | 0;
		this.Cl = SHA384_IV[5] | 0;
		this.Dh = SHA384_IV[6] | 0;
		this.Dl = SHA384_IV[7] | 0;
		this.Eh = SHA384_IV[8] | 0;
		this.El = SHA384_IV[9] | 0;
		this.Fh = SHA384_IV[10] | 0;
		this.Fl = SHA384_IV[11] | 0;
		this.Gh = SHA384_IV[12] | 0;
		this.Gl = SHA384_IV[13] | 0;
		this.Hh = SHA384_IV[14] | 0;
		this.Hl = SHA384_IV[15] | 0;
	}
};
/**
* SHA2-256 hash function from RFC 4634.
*
* It is the fastest JS hash, even faster than Blake3.
* To break sha256 using birthday attack, attackers need to try 2^128 hashes.
* BTC network is doing 2^70 hashes/sec (2^95 hashes/year) as per 2025.
*/
var sha256$2 = /* @__PURE__ */ createHasher$1(() => new SHA256());
/** SHA2-512 hash function from RFC 4634. */
var sha512 = /* @__PURE__ */ createHasher$1(() => new SHA512());
/** SHA2-384 hash function from RFC 4634. */
var sha384 = /* @__PURE__ */ createHasher$1(() => new SHA384());
//#endregion
//#region node_modules/ox/node_modules/@noble/hashes/esm/sha256.js
/**
* SHA2-256 a.k.a. sha256. In JS, it is the fastest hash, even faster than Blake3.
*
* To break sha256 using birthday attack, attackers need to try 2^128 hashes.
* BTC network is doing 2^70 hashes/sec (2^95 hashes/year) as per 2025.
*
* Check out [FIPS 180-4](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf).
* @module
* @deprecated
*/
/** @deprecated Use import from `noble/hashes/sha2` module */
var sha256$1 = sha256$2;
//#endregion
//#region node_modules/ox/_esm/core/Hash.js
/**
* Calculates the [Keccak256](https://en.wikipedia.org/wiki/SHA-3) hash of a {@link ox#Bytes.Bytes} or {@link ox#Hex.Hex} value.
*
* This function is a re-export of `keccak_256` from [`@noble/hashes`](https://github.com/paulmillr/noble-hashes), an audited & minimal JS hashing library.
*
* @example
* ```ts twoslash
* import { Hash } from 'ox'
*
* Hash.keccak256('0xdeadbeef')
* // @log: '0xd4fd4e189132273036449fc9e11198c739161b4c0116a9a2dccdfa1c492006f1'
* ```
*
* @example
* ### Calculate Hash of a String
*
* ```ts twoslash
* import { Hash, Hex } from 'ox'
*
* Hash.keccak256(Hex.fromString('hello world'))
* // @log: '0x3ea2f1d0abf3fc66cf29eebb70cbd4e7fe762ef8a09bcc06c8edf641230afec0'
* ```
*
* @example
* ### Configure Return Type
*
* ```ts twoslash
* import { Hash } from 'ox'
*
* Hash.keccak256('0xdeadbeef', { as: 'Bytes' })
* // @log: Uint8Array [...]
* ```
*
* @param value - {@link ox#Bytes.Bytes} or {@link ox#Hex.Hex} value.
* @param options - Options.
* @returns Keccak256 hash.
*/
function keccak256(value, options = {}) {
	const { as = typeof value === "string" ? "Hex" : "Bytes" } = options;
	const bytes = keccak_256(from$6(value));
	if (as === "Bytes") return bytes;
	return fromBytes$2(bytes);
}
/**
* Calculates the [Sha256](https://en.wikipedia.org/wiki/SHA-256) hash of a {@link ox#Bytes.Bytes} or {@link ox#Hex.Hex} value.
*
* This function is a re-export of `sha256` from [`@noble/hashes`](https://github.com/paulmillr/noble-hashes), an audited & minimal JS hashing library.
*
* @example
* ```ts twoslash
* import { Hash } from 'ox'
*
* Hash.sha256('0xdeadbeef')
* // '0x5f78c33274e43fa9de5659265c1d917e25c03722dcb0b8d27db8d5feaa813953'
* ```
*
* @param value - {@link ox#Bytes.Bytes} or {@link ox#Hex.Hex} value.
* @param options - Options.
* @returns Sha256 hash.
*/
function sha256(value, options = {}) {
	const { as = typeof value === "string" ? "Hex" : "Bytes" } = options;
	const bytes = sha256$1(from$6(value));
	if (as === "Bytes") return bytes;
	return fromBytes$2(bytes);
}
/**
* Checks if a string is a valid hash value.
*
* @example
* ```ts twoslash
* import { Hash } from 'ox'
*
* Hash.validate('0x')
* // @log: false
*
* Hash.validate('0x3ea2f1d0abf3fc66cf29eebb70cbd4e7fe762ef8a09bcc06c8edf641230afec0')
* // @log: true
* ```
*
* @param value - Value to check.
* @returns Whether the value is a valid hash.
*/
function validate$3(value) {
	return validate$4(value) && size(value) === 32;
}
//#endregion
//#region node_modules/ox/_esm/core/PublicKey.js
/**
* Asserts that a {@link ox#PublicKey.PublicKey} is valid.
*
* @example
* ```ts twoslash
* import { PublicKey } from 'ox'
*
* PublicKey.assert({
*   prefix: 4,
*   y: 49782753348462494199823712700004552394425719014458918871452329774910450607807n,
* })
* // @error: PublicKey.InvalidError: Value \`{"y":"1"}\` is not a valid public key.
* // @error: Public key must contain:
* // @error: - an `x` and `prefix` value (compressed)
* // @error: - an `x`, `y`, and `prefix` value (uncompressed)
* ```
*
* @param publicKey - The public key object to assert.
*/
function assert$4(publicKey, options = {}) {
	const { compressed } = options;
	const { prefix, x, y } = publicKey;
	if (compressed === false || typeof x === "bigint" && typeof y === "bigint") {
		if (prefix !== 4) throw new InvalidPrefixError({
			prefix,
			cause: new InvalidUncompressedPrefixError()
		});
		return;
	}
	if (compressed === true || typeof x === "bigint" && typeof y === "undefined") {
		if (prefix !== 3 && prefix !== 2) throw new InvalidPrefixError({
			prefix,
			cause: new InvalidCompressedPrefixError()
		});
		return;
	}
	throw new InvalidError({ publicKey });
}
/**
* Instantiates a typed {@link ox#PublicKey.PublicKey} object from a {@link ox#PublicKey.PublicKey}, {@link ox#Bytes.Bytes}, or {@link ox#Hex.Hex}.
*
* @example
* ```ts twoslash
* import { PublicKey } from 'ox'
*
* const publicKey = PublicKey.from({
*   prefix: 4,
*   x: 59295962801117472859457908919941473389380284132224861839820747729565200149877n,
*   y: 24099691209996290925259367678540227198235484593389470330605641003500238088869n,
* })
* // @log: {
* // @log:   prefix: 4,
* // @log:   x: 59295962801117472859457908919941473389380284132224861839820747729565200149877n,
* // @log:   y: 24099691209996290925259367678540227198235484593389470330605641003500238088869n,
* // @log: }
* ```
*
* @example
* ### From Serialized
*
* ```ts twoslash
* import { PublicKey } from 'ox'
*
* const publicKey = PublicKey.from('0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5')
* // @log: {
* // @log:   prefix: 4,
* // @log:   x: 59295962801117472859457908919941473389380284132224861839820747729565200149877n,
* // @log:   y: 24099691209996290925259367678540227198235484593389470330605641003500238088869n,
* // @log: }
* ```
*
* @param value - The public key value to instantiate.
* @returns The instantiated {@link ox#PublicKey.PublicKey}.
*/
function from$5(value) {
	const publicKey = (() => {
		if (validate$4(value)) return fromHex$2(value);
		if (validate$5(value)) return fromBytes$1(value);
		const { prefix, x, y } = value;
		if (typeof x === "bigint" && typeof y === "bigint") return {
			prefix: prefix ?? 4,
			x,
			y
		};
		return {
			prefix,
			x
		};
	})();
	assert$4(publicKey);
	return publicKey;
}
/**
* Deserializes a {@link ox#PublicKey.PublicKey} from a {@link ox#Bytes.Bytes} value.
*
* @example
* ```ts twoslash
* // @noErrors
* import { PublicKey } from 'ox'
*
* const publicKey = PublicKey.fromBytes(new Uint8Array([128, 3, 131, ...]))
* // @log: {
* // @log:   prefix: 4,
* // @log:   x: 59295962801117472859457908919941473389380284132224861839820747729565200149877n,
* // @log:   y: 24099691209996290925259367678540227198235484593389470330605641003500238088869n,
* // @log: }
* ```
*
* @param publicKey - The serialized public key.
* @returns The deserialized public key.
*/
function fromBytes$1(publicKey) {
	return fromHex$2(fromBytes$2(publicKey));
}
/**
* Deserializes a {@link ox#PublicKey.PublicKey} from a {@link ox#Hex.Hex} value.
*
* @example
* ```ts twoslash
* import { PublicKey } from 'ox'
*
* const publicKey = PublicKey.fromHex('0x8318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5')
* // @log: {
* // @log:   prefix: 4,
* // @log:   x: 59295962801117472859457908919941473389380284132224861839820747729565200149877n,
* // @log:   y: 24099691209996290925259367678540227198235484593389470330605641003500238088869n,
* // @log: }
* ```
*
* @example
* ### Deserializing a Compressed Public Key
*
* ```ts twoslash
* import { PublicKey } from 'ox'
*
* const publicKey = PublicKey.fromHex('0x038318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed75')
* // @log: {
* // @log:   prefix: 3,
* // @log:   x: 59295962801117472859457908919941473389380284132224861839820747729565200149877n,
* // @log: }
* ```
*
* @param publicKey - The serialized public key.
* @returns The deserialized public key.
*/
function fromHex$2(publicKey) {
	if (publicKey.length !== 132 && publicKey.length !== 130 && publicKey.length !== 68) throw new InvalidSerializedSizeError$1({ publicKey });
	if (publicKey.length === 130) return {
		prefix: 4,
		x: BigInt(slice(publicKey, 0, 32)),
		y: BigInt(slice(publicKey, 32, 64))
	};
	if (publicKey.length === 132) return {
		prefix: Number(slice(publicKey, 0, 1)),
		x: BigInt(slice(publicKey, 1, 33)),
		y: BigInt(slice(publicKey, 33, 65))
	};
	return {
		prefix: Number(slice(publicKey, 0, 1)),
		x: BigInt(slice(publicKey, 1, 33))
	};
}
/**
* Serializes a {@link ox#PublicKey.PublicKey} to {@link ox#Bytes.Bytes}.
*
* @example
* ```ts twoslash
* import { PublicKey } from 'ox'
*
* const publicKey = PublicKey.from({
*   prefix: 4,
*   x: 59295962801117472859457908919941473389380284132224861839820747729565200149877n,
*   y: 24099691209996290925259367678540227198235484593389470330605641003500238088869n,
* })
*
* const bytes = PublicKey.toBytes(publicKey) // [!code focus]
* // @log: Uint8Array [128, 3, 131, ...]
* ```
*
* @param publicKey - The public key to serialize.
* @returns The serialized public key.
*/
function toBytes(publicKey, options = {}) {
	return fromHex$3(toHex$2(publicKey, options));
}
/**
* Serializes a {@link ox#PublicKey.PublicKey} to {@link ox#Hex.Hex}.
*
* @example
* ```ts twoslash
* import { PublicKey } from 'ox'
*
* const publicKey = PublicKey.from({
*   prefix: 4,
*   x: 59295962801117472859457908919941473389380284132224861839820747729565200149877n,
*   y: 24099691209996290925259367678540227198235484593389470330605641003500238088869n,
* })
*
* const hex = PublicKey.toHex(publicKey) // [!code focus]
* // @log: '0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5'
* ```
*
* @param publicKey - The public key to serialize.
* @returns The serialized public key.
*/
function toHex$2(publicKey, options = {}) {
	assert$4(publicKey);
	const { prefix, x, y } = publicKey;
	const { includePrefix = true } = options;
	return concat(includePrefix ? fromNumber(prefix, { size: 1 }) : "0x", fromNumber(x, { size: 32 }), typeof y === "bigint" ? fromNumber(y, { size: 32 }) : "0x");
}
/**
* Thrown when a public key is invalid.
*
* @example
* ```ts twoslash
* import { PublicKey } from 'ox'
*
* PublicKey.assert({ y: 1n })
* // @error: PublicKey.InvalidError: Value `{"y":1n}` is not a valid public key.
* // @error: Public key must contain:
* // @error: - an `x` and `prefix` value (compressed)
* // @error: - an `x`, `y`, and `prefix` value (uncompressed)
* ```
*/
var InvalidError = class extends BaseError {
	constructor({ publicKey }) {
		super(`Value \`${stringify(publicKey)}\` is not a valid public key.`, { metaMessages: [
			"Public key must contain:",
			"- an `x` and `prefix` value (compressed)",
			"- an `x`, `y`, and `prefix` value (uncompressed)"
		] });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "PublicKey.InvalidError"
		});
	}
};
/** Thrown when a public key has an invalid prefix. */
var InvalidPrefixError = class extends BaseError {
	constructor({ prefix, cause }) {
		super(`Prefix "${prefix}" is invalid.`, { cause });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "PublicKey.InvalidPrefixError"
		});
	}
};
/** Thrown when the public key has an invalid prefix for a compressed public key. */
var InvalidCompressedPrefixError = class extends BaseError {
	constructor() {
		super("Prefix must be 2 or 3 for compressed public keys.");
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "PublicKey.InvalidCompressedPrefixError"
		});
	}
};
/** Thrown when the public key has an invalid prefix for an uncompressed public key. */
var InvalidUncompressedPrefixError = class extends BaseError {
	constructor() {
		super("Prefix must be 4 for uncompressed public keys.");
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "PublicKey.InvalidUncompressedPrefixError"
		});
	}
};
/** Thrown when the public key has an invalid serialized size. */
var InvalidSerializedSizeError$1 = class extends BaseError {
	constructor({ publicKey }) {
		super(`Value \`${publicKey}\` is an invalid public key size.`, { metaMessages: ["Expected: 33 bytes (compressed + prefix), 64 bytes (uncompressed) or 65 bytes (uncompressed + prefix).", `Received ${size(from$7(publicKey))} bytes.`] });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "PublicKey.InvalidSerializedSizeError"
		});
	}
};
//#endregion
//#region node_modules/ox/_esm/core/Address.js
var addressRegex = /^0x[a-fA-F0-9]{40}$/;
/**
* Asserts that the given value is a valid {@link ox#Address.Address}.
*
* @example
* ```ts twoslash
* import { Address } from 'ox'
*
* Address.assert('0xA0Cf798816D4b9b9866b5330EEa46a18382f251e')
* ```
*
* @example
* ```ts twoslash
* import { Address } from 'ox'
*
* Address.assert('0xdeadbeef')
* // @error: InvalidAddressError: Address "0xdeadbeef" is invalid.
* ```
*
* @param value - Value to assert if it is a valid address.
* @param options - Assertion options.
*/
function assert$3(value, options = {}) {
	const { strict = true } = options;
	if (!addressRegex.test(value)) throw new InvalidAddressError({
		address: value,
		cause: new InvalidInputError()
	});
	if (strict) {
		if (value.toLowerCase() === value) return;
		if (checksum(value) !== value) throw new InvalidAddressError({
			address: value,
			cause: new InvalidChecksumError()
		});
	}
}
/**
* Computes the checksum address for the given {@link ox#Address.Address}.
*
* @example
* ```ts twoslash
* import { Address } from 'ox'
*
* Address.checksum('0xa0cf798816d4b9b9866b5330eea46a18382f251e')
* // @log: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'
* ```
*
* @param address - The address to compute the checksum for.
* @returns The checksummed address.
*/
function checksum(address) {
	if (checksum$1.has(address)) return checksum$1.get(address);
	assert$3(address, { strict: false });
	const hexAddress = address.substring(2).toLowerCase();
	const hash = keccak256(fromString(hexAddress), { as: "Bytes" });
	const characters = hexAddress.split("");
	for (let i = 0; i < 40; i += 2) {
		if (hash[i >> 1] >> 4 >= 8 && characters[i]) characters[i] = characters[i].toUpperCase();
		if ((hash[i >> 1] & 15) >= 8 && characters[i + 1]) characters[i + 1] = characters[i + 1].toUpperCase();
	}
	const result = `0x${characters.join("")}`;
	checksum$1.set(address, result);
	return result;
}
/**
* Converts a stringified address to a typed (optionally checksummed) {@link ox#Address.Address}.
*
* @example
* ```ts twoslash
* import { Address } from 'ox'
*
* Address.from('0xa0cf798816d4b9b9866b5330eea46a18382f251e')
* // @log: '0xa0cf798816d4b9b9866b5330eea46a18382f251e'
* ```
*
* @example
* ```ts twoslash
* import { Address } from 'ox'
*
* Address.from('0xa0cf798816d4b9b9866b5330eea46a18382f251e', {
*   checksum: true
* })
* // @log: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'
* ```
*
* @example
* ```ts twoslash
* import { Address } from 'ox'
*
* Address.from('hello')
* // @error: InvalidAddressError: Address "0xa" is invalid.
* ```
*
* @param address - An address string to convert to a typed Address.
* @param options - Conversion options.
* @returns The typed Address.
*/
function from$4(address, options = {}) {
	const { checksum: checksumVal = false } = options;
	assert$3(address);
	if (checksumVal) return checksum(address);
	return address;
}
/**
* Converts an ECDSA public key to an {@link ox#Address.Address}.
*
* @example
* ```ts twoslash
* import { Address, PublicKey } from 'ox'
*
* const publicKey = PublicKey.from(
*   '0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5',
* )
* const address = Address.fromPublicKey(publicKey)
* // @log: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
* ```
*
* @param publicKey - The ECDSA public key to convert to an {@link ox#Address.Address}.
* @param options - Conversion options.
* @returns The {@link ox#Address.Address} corresponding to the public key.
*/
function fromPublicKey(publicKey, options = {}) {
	return from$4(`0x${keccak256(`0x${toHex$2(publicKey).slice(4)}`).substring(26)}`, options);
}
/**
* Checks if two {@link ox#Address.Address} are equal.
*
* @example
* ```ts twoslash
* import { Address } from 'ox'
*
* Address.isEqual(
*   '0xa0cf798816d4b9b9866b5330eea46a18382f251e',
*   '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'
* )
* // @log: true
* ```
*
* @example
* ```ts twoslash
* import { Address } from 'ox'
*
* Address.isEqual(
*   '0xa0cf798816d4b9b9866b5330eea46a18382f251e',
*   '0xA0Cf798816D4b9b9866b5330EEa46a18382f251f'
* )
* // @log: false
* ```
*
* @param addressA - The first address to compare.
* @param addressB - The second address to compare.
* @returns Whether the addresses are equal.
*/
function isEqual(addressA, addressB) {
	assert$3(addressA, { strict: false });
	assert$3(addressB, { strict: false });
	return addressA.toLowerCase() === addressB.toLowerCase();
}
/**
* Checks if the given address is a valid {@link ox#Address.Address}.
*
* @example
* ```ts twoslash
* import { Address } from 'ox'
*
* Address.validate('0xA0Cf798816D4b9b9866b5330EEa46a18382f251e')
* // @log: true
* ```
*
* @example
* ```ts twoslash
* import { Address } from 'ox'
*
* Address.validate('0xdeadbeef')
* // @log: false
* ```
*
* @param address - Value to check if it is a valid address.
* @param options - Check options.
* @returns Whether the address is a valid address.
*/
function validate$2(address, options = {}) {
	const { strict = true } = options ?? {};
	try {
		assert$3(address, { strict });
		return true;
	} catch {
		return false;
	}
}
/**
* Thrown when an address is invalid.
*
* @example
* ```ts twoslash
* import { Address } from 'ox'
*
* Address.from('0x123')
* // @error: Address.InvalidAddressError: Address `0x123` is invalid.
* ```
*/
var InvalidAddressError = class extends BaseError {
	constructor({ address, cause }) {
		super(`Address "${address}" is invalid.`, { cause });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Address.InvalidAddressError"
		});
	}
};
/** Thrown when an address is not a 20 byte (40 hexadecimal character) value. */
var InvalidInputError = class extends BaseError {
	constructor() {
		super("Address is not a 20 byte (40 hexadecimal character) value.");
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Address.InvalidInputError"
		});
	}
};
/** Thrown when an address does not match its checksum counterpart. */
var InvalidChecksumError = class extends BaseError {
	constructor() {
		super("Address does not match its checksum counterpart.");
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Address.InvalidChecksumError"
		});
	}
};
//#endregion
//#region node_modules/ox/_esm/core/Solidity.js
var arrayRegex = /^(.*)\[([0-9]*)\]$/;
var bytesRegex = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
var integerRegex = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
2n ** (8n - 1n) - 1n;
2n ** (16n - 1n) - 1n;
2n ** (24n - 1n) - 1n;
2n ** (32n - 1n) - 1n;
2n ** (40n - 1n) - 1n;
2n ** (48n - 1n) - 1n;
2n ** (56n - 1n) - 1n;
2n ** (64n - 1n) - 1n;
2n ** (72n - 1n) - 1n;
2n ** (80n - 1n) - 1n;
2n ** (88n - 1n) - 1n;
2n ** (96n - 1n) - 1n;
2n ** (104n - 1n) - 1n;
2n ** (112n - 1n) - 1n;
2n ** (120n - 1n) - 1n;
2n ** (128n - 1n) - 1n;
2n ** (136n - 1n) - 1n;
2n ** (144n - 1n) - 1n;
2n ** (152n - 1n) - 1n;
2n ** (160n - 1n) - 1n;
2n ** (168n - 1n) - 1n;
2n ** (176n - 1n) - 1n;
2n ** (184n - 1n) - 1n;
2n ** (192n - 1n) - 1n;
2n ** (200n - 1n) - 1n;
2n ** (208n - 1n) - 1n;
2n ** (216n - 1n) - 1n;
2n ** (224n - 1n) - 1n;
2n ** (232n - 1n) - 1n;
2n ** (240n - 1n) - 1n;
2n ** (248n - 1n) - 1n;
2n ** (256n - 1n) - 1n;
-(2n ** (8n - 1n));
-(2n ** (16n - 1n));
-(2n ** (24n - 1n));
-(2n ** (32n - 1n));
-(2n ** (40n - 1n));
-(2n ** (48n - 1n));
-(2n ** (56n - 1n));
-(2n ** (64n - 1n));
-(2n ** (72n - 1n));
-(2n ** (80n - 1n));
-(2n ** (88n - 1n));
-(2n ** (96n - 1n));
-(2n ** (104n - 1n));
-(2n ** (112n - 1n));
-(2n ** (120n - 1n));
-(2n ** (128n - 1n));
-(2n ** (136n - 1n));
-(2n ** (144n - 1n));
-(2n ** (152n - 1n));
-(2n ** (160n - 1n));
-(2n ** (168n - 1n));
-(2n ** (176n - 1n));
-(2n ** (184n - 1n));
-(2n ** (192n - 1n));
-(2n ** (200n - 1n));
-(2n ** (208n - 1n));
-(2n ** (216n - 1n));
-(2n ** (224n - 1n));
-(2n ** (232n - 1n));
-(2n ** (240n - 1n));
-(2n ** (248n - 1n));
-(2n ** (256n - 1n));
var maxUint256 = 2n ** 256n - 1n;
//#endregion
//#region node_modules/ox/_esm/core/internal/abiParameters.js
/** @internal */
function decodeParameter(cursor, param, options) {
	const { checksumAddress, staticPosition } = options;
	const arrayComponents = getArrayComponents(param.type);
	if (arrayComponents) {
		const [length, type] = arrayComponents;
		return decodeArray(cursor, {
			...param,
			type
		}, {
			checksumAddress,
			length,
			staticPosition
		});
	}
	if (param.type === "tuple") return decodeTuple(cursor, param, {
		checksumAddress,
		staticPosition
	});
	if (param.type === "address") return decodeAddress(cursor, { checksum: checksumAddress });
	if (param.type === "bool") return decodeBool(cursor);
	if (param.type.startsWith("bytes")) return decodeBytes(cursor, param, { staticPosition });
	if (param.type.startsWith("uint") || param.type.startsWith("int")) return decodeNumber(cursor, param);
	if (param.type === "string") return decodeString(cursor, { staticPosition });
	throw new InvalidTypeError(param.type);
}
var sizeOfLength = 32;
var sizeOfOffset = 32;
/** @internal */
function decodeAddress(cursor, options = {}) {
	const { checksum: checksum$2 = false } = options;
	const value = cursor.readBytes(32);
	const wrap = (address) => checksum$2 ? checksum(address) : address;
	return [wrap(fromBytes$2(slice$1(value, -20))), 32];
}
/** @internal */
function decodeArray(cursor, param, options) {
	const { checksumAddress, length, staticPosition } = options;
	if (!length) {
		const start = staticPosition + toNumber(cursor.readBytes(sizeOfOffset));
		const startOfData = start + sizeOfLength;
		cursor.setPosition(start);
		const length = toNumber(cursor.readBytes(sizeOfLength));
		const dynamicChild = hasDynamicChild(param);
		let consumed = 0;
		const value = [];
		for (let i = 0; i < length; ++i) {
			cursor.setPosition(startOfData + (dynamicChild ? i * 32 : consumed));
			const [data, consumed_] = decodeParameter(cursor, param, {
				checksumAddress,
				staticPosition: startOfData
			});
			consumed += consumed_;
			value.push(data);
		}
		cursor.setPosition(staticPosition + 32);
		return [value, 32];
	}
	if (hasDynamicChild(param)) {
		const start = staticPosition + toNumber(cursor.readBytes(sizeOfOffset));
		const value = [];
		for (let i = 0; i < length; ++i) {
			cursor.setPosition(start + i * 32);
			const [data] = decodeParameter(cursor, param, {
				checksumAddress,
				staticPosition: start
			});
			value.push(data);
		}
		cursor.setPosition(staticPosition + 32);
		return [value, 32];
	}
	let consumed = 0;
	const value = [];
	for (let i = 0; i < length; ++i) {
		const [data, consumed_] = decodeParameter(cursor, param, {
			checksumAddress,
			staticPosition: staticPosition + consumed
		});
		consumed += consumed_;
		value.push(data);
	}
	return [value, consumed];
}
/** @internal */
function decodeBool(cursor) {
	return [toBoolean(cursor.readBytes(32), { size: 32 }), 32];
}
/** @internal */
function decodeBytes(cursor, param, { staticPosition }) {
	const [_, size] = param.type.split("bytes");
	if (!size) {
		const offset = toNumber(cursor.readBytes(32));
		cursor.setPosition(staticPosition + offset);
		const length = toNumber(cursor.readBytes(32));
		if (length === 0) {
			cursor.setPosition(staticPosition + 32);
			return ["0x", 32];
		}
		const data = cursor.readBytes(length);
		cursor.setPosition(staticPosition + 32);
		return [fromBytes$2(data), 32];
	}
	return [fromBytes$2(cursor.readBytes(Number.parseInt(size, 10), 32)), 32];
}
/** @internal */
function decodeNumber(cursor, param) {
	const signed = param.type.startsWith("int");
	const size = Number.parseInt(param.type.split("int")[1] || "256", 10);
	const value = cursor.readBytes(32);
	return [size > 48 ? toBigInt(value, { signed }) : toNumber(value, { signed }), 32];
}
/** @internal */
function decodeTuple(cursor, param, options) {
	const { checksumAddress, staticPosition } = options;
	const hasUnnamedChild = param.components.length === 0 || param.components.some(({ name }) => !name);
	const value = hasUnnamedChild ? [] : {};
	let consumed = 0;
	if (hasDynamicChild(param)) {
		const start = staticPosition + toNumber(cursor.readBytes(sizeOfOffset));
		for (let i = 0; i < param.components.length; ++i) {
			const component = param.components[i];
			cursor.setPosition(start + consumed);
			const [data, consumed_] = decodeParameter(cursor, component, {
				checksumAddress,
				staticPosition: start
			});
			consumed += consumed_;
			value[hasUnnamedChild ? i : component?.name] = data;
		}
		cursor.setPosition(staticPosition + 32);
		return [value, 32];
	}
	for (let i = 0; i < param.components.length; ++i) {
		const component = param.components[i];
		const [data, consumed_] = decodeParameter(cursor, component, {
			checksumAddress,
			staticPosition
		});
		value[hasUnnamedChild ? i : component?.name] = data;
		consumed += consumed_;
	}
	return [value, consumed];
}
/** @internal */
function decodeString(cursor, { staticPosition }) {
	const start = staticPosition + toNumber(cursor.readBytes(32));
	cursor.setPosition(start);
	const length = toNumber(cursor.readBytes(32));
	if (length === 0) {
		cursor.setPosition(staticPosition + 32);
		return ["", 32];
	}
	const value = toString(trimLeft(cursor.readBytes(length, 32)));
	cursor.setPosition(staticPosition + 32);
	return [value, 32];
}
/** @internal */
function prepareParameters({ checksumAddress, parameters, values }) {
	const preparedParameters = [];
	for (let i = 0; i < parameters.length; i++) preparedParameters.push(prepareParameter({
		checksumAddress,
		parameter: parameters[i],
		value: values[i]
	}));
	return preparedParameters;
}
/** @internal */
function prepareParameter({ checksumAddress = false, parameter: parameter_, value }) {
	const parameter = parameter_;
	const arrayComponents = getArrayComponents(parameter.type);
	if (arrayComponents) {
		const [length, type] = arrayComponents;
		return encodeArray(value, {
			checksumAddress,
			length,
			parameter: {
				...parameter,
				type
			}
		});
	}
	if (parameter.type === "tuple") return encodeTuple(value, {
		checksumAddress,
		parameter
	});
	if (parameter.type === "address") return encodeAddress(value, { checksum: checksumAddress });
	if (parameter.type === "bool") return encodeBoolean(value);
	if (parameter.type.startsWith("uint") || parameter.type.startsWith("int")) {
		const signed = parameter.type.startsWith("int");
		const [, , size = "256"] = integerRegex.exec(parameter.type) ?? [];
		return encodeNumber(value, {
			signed,
			size: Number(size)
		});
	}
	if (parameter.type.startsWith("bytes")) return encodeBytes(value, { type: parameter.type });
	if (parameter.type === "string") return encodeString(value);
	throw new InvalidTypeError(parameter.type);
}
/** @internal */
function encode$1(preparedParameters) {
	let staticSize = 0;
	for (let i = 0; i < preparedParameters.length; i++) {
		const { dynamic, encoded } = preparedParameters[i];
		if (dynamic) staticSize += 32;
		else staticSize += size(encoded);
	}
	const staticParameters = [];
	const dynamicParameters = [];
	let dynamicSize = 0;
	for (let i = 0; i < preparedParameters.length; i++) {
		const { dynamic, encoded } = preparedParameters[i];
		if (dynamic) {
			staticParameters.push(fromNumber(staticSize + dynamicSize, { size: 32 }));
			dynamicParameters.push(encoded);
			dynamicSize += size(encoded);
		} else staticParameters.push(encoded);
	}
	return concat(...staticParameters, ...dynamicParameters);
}
/** @internal */
function encodeAddress(value, options) {
	const { checksum = false } = options;
	assert$3(value, { strict: checksum });
	return {
		dynamic: false,
		encoded: padLeft(value.toLowerCase())
	};
}
/** @internal */
function encodeArray(value, options) {
	const { checksumAddress, length, parameter } = options;
	const dynamic = length === null;
	if (!Array.isArray(value)) throw new InvalidArrayError(value);
	if (!dynamic && value.length !== length) throw new ArrayLengthMismatchError({
		expectedLength: length,
		givenLength: value.length,
		type: `${parameter.type}[${length}]`
	});
	let dynamicChild = false;
	const preparedParameters = [];
	for (let i = 0; i < value.length; i++) {
		const preparedParam = prepareParameter({
			checksumAddress,
			parameter,
			value: value[i]
		});
		if (preparedParam.dynamic) dynamicChild = true;
		preparedParameters.push(preparedParam);
	}
	if (dynamic || dynamicChild) {
		const data = encode$1(preparedParameters);
		if (dynamic) {
			const length = fromNumber(preparedParameters.length, { size: 32 });
			return {
				dynamic: true,
				encoded: preparedParameters.length > 0 ? concat(length, data) : length
			};
		}
		if (dynamicChild) return {
			dynamic: true,
			encoded: data
		};
	}
	return {
		dynamic: false,
		encoded: concat(...preparedParameters.map(({ encoded }) => encoded))
	};
}
/** @internal */
function encodeBytes(value, { type }) {
	const [, parametersize] = type.split("bytes");
	const bytesSize = size(value);
	if (!parametersize) {
		let value_ = value;
		if (bytesSize % 32 !== 0) value_ = padRight(value_, Math.ceil((value.length - 2) / 2 / 32) * 32);
		return {
			dynamic: true,
			encoded: concat(padLeft(fromNumber(bytesSize, { size: 32 })), value_)
		};
	}
	if (bytesSize !== Number.parseInt(parametersize, 10)) throw new BytesSizeMismatchError({
		expectedSize: Number.parseInt(parametersize, 10),
		value
	});
	return {
		dynamic: false,
		encoded: padRight(value)
	};
}
/** @internal */
function encodeBoolean(value) {
	if (typeof value !== "boolean") throw new BaseError(`Invalid boolean value: "${value}" (type: ${typeof value}). Expected: \`true\` or \`false\`.`);
	return {
		dynamic: false,
		encoded: padLeft(fromBoolean(value))
	};
}
/** @internal */
function encodeNumber(value, { signed, size }) {
	if (typeof size === "number") {
		const max = 2n ** (BigInt(size) - (signed ? 1n : 0n)) - 1n;
		const min = signed ? -max - 1n : 0n;
		if (value > max || value < min) throw new IntegerOutOfRangeError({
			max: max.toString(),
			min: min.toString(),
			signed,
			size: size / 8,
			value: value.toString()
		});
	}
	return {
		dynamic: false,
		encoded: fromNumber(value, {
			size: 32,
			signed
		})
	};
}
/** @internal */
function encodeString(value) {
	const hexValue = fromString$1(value);
	const partsLength = Math.ceil(size(hexValue) / 32);
	const parts = [];
	for (let i = 0; i < partsLength; i++) parts.push(padRight(slice(hexValue, i * 32, (i + 1) * 32)));
	return {
		dynamic: true,
		encoded: concat(padRight(fromNumber(size(hexValue), { size: 32 })), ...parts)
	};
}
/** @internal */
function encodeTuple(value, options) {
	const { checksumAddress, parameter } = options;
	let dynamic = false;
	const preparedParameters = [];
	for (let i = 0; i < parameter.components.length; i++) {
		const param_ = parameter.components[i];
		const preparedParam = prepareParameter({
			checksumAddress,
			parameter: param_,
			value: value[Array.isArray(value) ? i : param_.name]
		});
		preparedParameters.push(preparedParam);
		if (preparedParam.dynamic) dynamic = true;
	}
	return {
		dynamic,
		encoded: dynamic ? encode$1(preparedParameters) : concat(...preparedParameters.map(({ encoded }) => encoded))
	};
}
/** @internal */
function getArrayComponents(type) {
	const matches = type.match(/^(.*)\[(\d+)?\]$/);
	return matches ? [matches[2] ? Number(matches[2]) : null, matches[1]] : void 0;
}
/** @internal */
function hasDynamicChild(param) {
	const { type } = param;
	if (type === "string") return true;
	if (type === "bytes") return true;
	if (type.endsWith("[]")) return true;
	if (type === "tuple") return param.components?.some(hasDynamicChild);
	const arrayComponents = getArrayComponents(param.type);
	if (arrayComponents && hasDynamicChild({
		...param,
		type: arrayComponents[1]
	})) return true;
	return false;
}
//#endregion
//#region node_modules/ox/_esm/core/internal/cursor.js
var staticCursor = {
	bytes: new Uint8Array(),
	dataView: /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(0)),
	position: 0,
	positionReadCount: /* @__PURE__ */ new Map(),
	recursiveReadCount: 0,
	recursiveReadLimit: Number.POSITIVE_INFINITY,
	assertReadLimit() {
		if (this.recursiveReadCount >= this.recursiveReadLimit) throw new RecursiveReadLimitExceededError({
			count: this.recursiveReadCount + 1,
			limit: this.recursiveReadLimit
		});
	},
	assertPosition(position) {
		if (position < 0 || position > this.bytes.length - 1) throw new PositionOutOfBoundsError({
			length: this.bytes.length,
			position
		});
	},
	decrementPosition(offset) {
		if (offset < 0) throw new NegativeOffsetError({ offset });
		const position = this.position - offset;
		this.assertPosition(position);
		this.position = position;
	},
	getReadCount(position) {
		return this.positionReadCount.get(position || this.position) || 0;
	},
	incrementPosition(offset) {
		if (offset < 0) throw new NegativeOffsetError({ offset });
		const position = this.position + offset;
		this.assertPosition(position);
		this.position = position;
	},
	inspectByte(position_) {
		const position = position_ ?? this.position;
		this.assertPosition(position);
		return this.bytes[position];
	},
	inspectBytes(length, position_) {
		const position = position_ ?? this.position;
		this.assertPosition(position + length - 1);
		return this.bytes.subarray(position, position + length);
	},
	inspectUint8(position_) {
		const position = position_ ?? this.position;
		this.assertPosition(position);
		return this.bytes[position];
	},
	inspectUint16(position_) {
		const position = position_ ?? this.position;
		this.assertPosition(position + 1);
		return this.dataView.getUint16(position);
	},
	inspectUint24(position_) {
		const position = position_ ?? this.position;
		this.assertPosition(position + 2);
		return (this.dataView.getUint16(position) << 8) + this.dataView.getUint8(position + 2);
	},
	inspectUint32(position_) {
		const position = position_ ?? this.position;
		this.assertPosition(position + 3);
		return this.dataView.getUint32(position);
	},
	pushByte(byte) {
		this.assertPosition(this.position);
		this.bytes[this.position] = byte;
		this.position++;
	},
	pushBytes(bytes) {
		this.assertPosition(this.position + bytes.length - 1);
		this.bytes.set(bytes, this.position);
		this.position += bytes.length;
	},
	pushUint8(value) {
		this.assertPosition(this.position);
		this.bytes[this.position] = value;
		this.position++;
	},
	pushUint16(value) {
		this.assertPosition(this.position + 1);
		this.dataView.setUint16(this.position, value);
		this.position += 2;
	},
	pushUint24(value) {
		this.assertPosition(this.position + 2);
		this.dataView.setUint16(this.position, value >> 8);
		this.dataView.setUint8(this.position + 2, value & 255);
		this.position += 3;
	},
	pushUint32(value) {
		this.assertPosition(this.position + 3);
		this.dataView.setUint32(this.position, value);
		this.position += 4;
	},
	readByte() {
		this.assertReadLimit();
		this._touch();
		const value = this.inspectByte();
		this.position++;
		return value;
	},
	readBytes(length, size) {
		this.assertReadLimit();
		this._touch();
		const value = this.inspectBytes(length);
		this.position += size ?? length;
		return value;
	},
	readUint8() {
		this.assertReadLimit();
		this._touch();
		const value = this.inspectUint8();
		this.position += 1;
		return value;
	},
	readUint16() {
		this.assertReadLimit();
		this._touch();
		const value = this.inspectUint16();
		this.position += 2;
		return value;
	},
	readUint24() {
		this.assertReadLimit();
		this._touch();
		const value = this.inspectUint24();
		this.position += 3;
		return value;
	},
	readUint32() {
		this.assertReadLimit();
		this._touch();
		const value = this.inspectUint32();
		this.position += 4;
		return value;
	},
	get remaining() {
		return this.bytes.length - this.position;
	},
	setPosition(position) {
		const oldPosition = this.position;
		this.assertPosition(position);
		this.position = position;
		return () => this.position = oldPosition;
	},
	_touch() {
		if (this.recursiveReadLimit === Number.POSITIVE_INFINITY) return;
		const count = this.getReadCount();
		this.positionReadCount.set(this.position, count + 1);
		if (count > 0) this.recursiveReadCount++;
	}
};
/** @internal */
function create(bytes, { recursiveReadLimit = 8192 } = {}) {
	const cursor = Object.create(staticCursor);
	cursor.bytes = bytes;
	cursor.dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	cursor.positionReadCount = /* @__PURE__ */ new Map();
	cursor.recursiveReadLimit = recursiveReadLimit;
	return cursor;
}
/** @internal */
var NegativeOffsetError = class extends BaseError {
	constructor({ offset }) {
		super(`Offset \`${offset}\` cannot be negative.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Cursor.NegativeOffsetError"
		});
	}
};
/** @internal */
var PositionOutOfBoundsError = class extends BaseError {
	constructor({ length, position }) {
		super(`Position \`${position}\` is out of bounds (\`0 < position < ${length}\`).`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Cursor.PositionOutOfBoundsError"
		});
	}
};
/** @internal */
var RecursiveReadLimitExceededError = class extends BaseError {
	constructor({ count, limit }) {
		super(`Recursive read limit of \`${limit}\` exceeded (recursive read count: \`${count}\`).`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Cursor.RecursiveReadLimitExceededError"
		});
	}
};
//#endregion
//#region node_modules/ox/_esm/core/AbiParameters.js
function decode(parameters, data, options = {}) {
	const { as = "Array", checksumAddress = false } = options;
	const bytes = typeof data === "string" ? fromHex$3(data) : data;
	const cursor = create(bytes);
	if (size$1(bytes) === 0 && parameters.length > 0) throw new ZeroDataError();
	if (size$1(bytes) && size$1(bytes) < 32) throw new DataSizeTooSmallError({
		data: typeof data === "string" ? data : fromBytes$2(data),
		parameters,
		size: size$1(bytes)
	});
	let consumed = 0;
	const values = as === "Array" ? [] : {};
	for (let i = 0; i < parameters.length; ++i) {
		const param = parameters[i];
		cursor.setPosition(consumed);
		const [data, consumed_] = decodeParameter(cursor, param, {
			checksumAddress,
			staticPosition: 0
		});
		consumed += consumed_;
		if (as === "Array") values.push(data);
		else values[param.name ?? i] = data;
	}
	return values;
}
/**
* Encodes primitive values into ABI encoded data as per the [Application Binary Interface (ABI) Specification](https://docs.soliditylang.org/en/latest/abi-spec).
*
* @example
* ```ts twoslash
* import { AbiParameters } from 'ox'
*
* const data = AbiParameters.encode(
*   AbiParameters.from(['string', 'uint', 'bool']),
*   ['wagmi', 420n, true],
* )
* ```
*
* @example
* ### JSON Parameters
*
* Specify **JSON ABI** Parameters as schema:
*
* ```ts twoslash
* import { AbiParameters } from 'ox'
*
* const data = AbiParameters.encode(
*   [
*     { type: 'string', name: 'name' },
*     { type: 'uint', name: 'age' },
*     { type: 'bool', name: 'isOwner' },
*   ],
*   ['wagmi', 420n, true],
* )
* ```
*
* @param parameters - The set of ABI parameters to encode, in the shape of the `inputs` or `outputs` attribute of an ABI Item. These parameters must include valid [ABI types](https://docs.soliditylang.org/en/latest/types.html).
* @param values - The set of primitive values that correspond to the ABI types defined in `parameters`.
* @returns ABI encoded data.
*/
function encode(parameters, values, options) {
	const { checksumAddress = false } = options ?? {};
	if (parameters.length !== values.length) throw new LengthMismatchError({
		expectedLength: parameters.length,
		givenLength: values.length
	});
	const data = encode$1(prepareParameters({
		checksumAddress,
		parameters,
		values
	}));
	if (data.length === 0) return "0x";
	return data;
}
/**
* Encodes an array of primitive values to a [packed ABI encoding](https://docs.soliditylang.org/en/latest/abi-spec.html#non-standard-packed-mode).
*
* @example
* ```ts twoslash
* import { AbiParameters } from 'ox'
*
* const encoded = AbiParameters.encodePacked(
*   ['address', 'string'],
*   ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045', 'hello world'],
* )
* // @log: '0xd8da6bf26964af9d7eed9e03e53415d37aa9604568656c6c6f20776f726c64'
* ```
*
* @param types - Set of ABI types to pack encode.
* @param values - The set of primitive values that correspond to the ABI types defined in `types`.
* @returns The encoded packed data.
*/
function encodePacked(types, values) {
	if (types.length !== values.length) throw new LengthMismatchError({
		expectedLength: types.length,
		givenLength: values.length
	});
	const data = [];
	for (let i = 0; i < types.length; i++) {
		const type = types[i];
		const value = values[i];
		data.push(encodePacked.encode(type, value));
	}
	return concat(...data);
}
(function(encodePacked) {
	function encode(type, value, isArray = false) {
		if (type === "address") {
			const address = value;
			assert$3(address);
			return padLeft(address.toLowerCase(), isArray ? 32 : 0);
		}
		if (type === "string") return fromString$1(value);
		if (type === "bytes") return value;
		if (type === "bool") return padLeft(fromBoolean(value), isArray ? 32 : 1);
		const intMatch = type.match(integerRegex);
		if (intMatch) {
			const [_type, baseType, bits = "256"] = intMatch;
			const size = Number.parseInt(bits, 10) / 8;
			return fromNumber(value, {
				size: isArray ? 32 : size,
				signed: baseType === "int"
			});
		}
		const bytesMatch = type.match(bytesRegex);
		if (bytesMatch) {
			const [_type, size] = bytesMatch;
			if (Number.parseInt(size, 10) !== (value.length - 2) / 2) throw new BytesSizeMismatchError({
				expectedSize: Number.parseInt(size, 10),
				value
			});
			return padRight(value, isArray ? 32 : 0);
		}
		const arrayMatch = type.match(arrayRegex);
		if (arrayMatch && Array.isArray(value)) {
			const [_type, childType] = arrayMatch;
			const data = [];
			for (let i = 0; i < value.length; i++) data.push(encode(childType, value[i], true));
			if (data.length === 0) return "0x";
			return concat(...data);
		}
		throw new InvalidTypeError(type);
	}
	encodePacked.encode = encode;
})(encodePacked || (encodePacked = {}));
/**
* Parses arbitrary **JSON ABI Parameters** or **Human Readable ABI Parameters** into typed {@link ox#AbiParameters.AbiParameters}.
*
* @example
* ### JSON Parameters
*
* ```ts twoslash
* import { AbiParameters } from 'ox'
*
* const parameters = AbiParameters.from([
*   {
*     name: 'spender',
*     type: 'address',
*   },
*   {
*     name: 'amount',
*     type: 'uint256',
*   },
* ])
*
* parameters
* //^?
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
* ### Human Readable Parameters
*
* Human Readable ABI Parameters can be parsed into a typed {@link ox#AbiParameters.AbiParameters}:
*
* ```ts twoslash
* import { AbiParameters } from 'ox'
*
* const parameters = AbiParameters.from('address spender, uint256 amount')
*
* parameters
* //^?
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
* import { AbiParameters } from 'ox'
*
* const parameters = AbiParameters.from([
*   'struct Foo { address spender; uint256 amount; }', // [!code hl]
*   'Foo foo, address bar',
* ])
*
* parameters
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
* @param parameters - The ABI Parameters to parse.
* @returns The typed ABI Parameters.
*/
function from$3(parameters) {
	if (Array.isArray(parameters) && typeof parameters[0] === "string") return parseAbiParameters(parameters);
	if (typeof parameters === "string") return parseAbiParameters(parameters);
	return parameters;
}
/**
* Throws when the data size is too small for the given parameters.
*
* @example
* ```ts twoslash
* import { AbiParameters } from 'ox'
*
* AbiParameters.decode([{ type: 'uint256' }], '0x010f')
* //                                             ↑ ❌ 2 bytes
* // @error: AbiParameters.DataSizeTooSmallError: Data size of 2 bytes is too small for given parameters.
* // @error: Params: (uint256)
* // @error: Data:   0x010f (2 bytes)
* ```
*
* ### Solution
*
* Pass a valid data size.
*
* ```ts twoslash
* import { AbiParameters } from 'ox'
*
* AbiParameters.decode([{ type: 'uint256' }], '0x00000000000000000000000000000000000000000000000000000000000010f')
* //                                             ↑ ✅ 32 bytes
* ```
*/
var DataSizeTooSmallError = class extends BaseError {
	constructor({ data, parameters, size }) {
		super(`Data size of ${size} bytes is too small for given parameters.`, { metaMessages: [`Params: (${formatAbiParameters(parameters)})`, `Data:   ${data} (${size} bytes)`] });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "AbiParameters.DataSizeTooSmallError"
		});
	}
};
/**
* Throws when zero data is provided, but data is expected.
*
* @example
* ```ts twoslash
* import { AbiParameters } from 'ox'
*
* AbiParameters.decode([{ type: 'uint256' }], '0x')
* //                                           ↑ ❌ zero data
* // @error: AbiParameters.DataSizeTooSmallError: Data size of 2 bytes is too small for given parameters.
* // @error: Params: (uint256)
* // @error: Data:   0x010f (2 bytes)
* ```
*
* ### Solution
*
* Pass valid data.
*
* ```ts twoslash
* import { AbiParameters } from 'ox'
*
* AbiParameters.decode([{ type: 'uint256' }], '0x00000000000000000000000000000000000000000000000000000000000010f')
* //                                             ↑ ✅ 32 bytes
* ```
*/
var ZeroDataError = class extends BaseError {
	constructor() {
		super("Cannot decode zero data (\"0x\") with ABI parameters.");
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "AbiParameters.ZeroDataError"
		});
	}
};
/**
* The length of the array value does not match the length specified in the corresponding ABI parameter.
*
* ### Example
*
* ```ts twoslash
* // @noErrors
* import { AbiParameters } from 'ox'
* // ---cut---
* AbiParameters.encode(AbiParameters.from('uint256[3]'), [[69n, 420n]])
* //                                               ↑ expected: 3  ↑ ❌ length: 2
* // @error: AbiParameters.ArrayLengthMismatchError: ABI encoding array length mismatch
* // @error: for type `uint256[3]`. Expected: `3`. Given: `2`.
* ```
*
* ### Solution
*
* Pass an array of the correct length.
*
* ```ts twoslash
* import { AbiParameters } from 'ox'
* // ---cut---
* AbiParameters.encode(AbiParameters.from(['uint256[3]']), [[69n, 420n, 69n]])
* //                                                         ↑ ✅ length: 3
* ```
*/
var ArrayLengthMismatchError = class extends BaseError {
	constructor({ expectedLength, givenLength, type }) {
		super(`Array length mismatch for type \`${type}\`. Expected: \`${expectedLength}\`. Given: \`${givenLength}\`.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "AbiParameters.ArrayLengthMismatchError"
		});
	}
};
/**
* The size of the bytes value does not match the size specified in the corresponding ABI parameter.
*
* ### Example
*
* ```ts twoslash
* // @noErrors
* import { AbiParameters } from 'ox'
* // ---cut---
* AbiParameters.encode(AbiParameters.from('bytes8'), [['0xdeadbeefdeadbeefdeadbeef']])
* //                                            ↑ expected: 8 bytes  ↑ ❌ size: 12 bytes
* // @error: BytesSizeMismatchError: Size of bytes "0xdeadbeefdeadbeefdeadbeef"
* // @error: (bytes12) does not match expected size (bytes8).
* ```
*
* ### Solution
*
* Pass a bytes value of the correct size.
*
* ```ts twoslash
* import { AbiParameters } from 'ox'
* // ---cut---
* AbiParameters.encode(AbiParameters.from(['bytes8']), ['0xdeadbeefdeadbeef'])
* //                                                       ↑ ✅ size: 8 bytes
* ```
*/
var BytesSizeMismatchError = class extends BaseError {
	constructor({ expectedSize, value }) {
		super(`Size of bytes "${value}" (bytes${size(value)}) does not match expected size (bytes${expectedSize}).`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "AbiParameters.BytesSizeMismatchError"
		});
	}
};
/**
* The length of the values to encode does not match the length of the ABI parameters.
*
* ### Example
*
* ```ts twoslash
* // @noErrors
* import { AbiParameters } from 'ox'
* // ---cut---
* AbiParameters.encode(AbiParameters.from(['string', 'uint256']), ['hello'])
* // @error: LengthMismatchError: ABI encoding params/values length mismatch.
* // @error: Expected length (params): 2
* // @error: Given length (values): 1
* ```
*
* ### Solution
*
* Pass the correct number of values to encode.
*
* ### Solution
*
* Pass a [valid ABI type](https://docs.soliditylang.org/en/develop/abi-spec.html#types).
*/
var LengthMismatchError = class extends BaseError {
	constructor({ expectedLength, givenLength }) {
		super([
			"ABI encoding parameters/values length mismatch.",
			`Expected length (parameters): ${expectedLength}`,
			`Given length (values): ${givenLength}`
		].join("\n"));
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "AbiParameters.LengthMismatchError"
		});
	}
};
/**
* The value provided is not a valid array as specified in the corresponding ABI parameter.
*
* ### Example
*
* ```ts twoslash
* // @noErrors
* import { AbiParameters } from 'ox'
* // ---cut---
* AbiParameters.encode(AbiParameters.from(['uint256[3]']), [69])
* ```
*
* ### Solution
*
* Pass an array value.
*/
var InvalidArrayError = class extends BaseError {
	constructor(value) {
		super(`Value \`${value}\` is not a valid array.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "AbiParameters.InvalidArrayError"
		});
	}
};
/**
* Throws when the ABI parameter type is invalid.
*
* @example
* ```ts twoslash
* import { AbiParameters } from 'ox'
*
* AbiParameters.decode([{ type: 'lol' }], '0x00000000000000000000000000000000000000000000000000000000000010f')
* //                             ↑ ❌ invalid type
* // @error: AbiParameters.InvalidTypeError: Type `lol` is not a valid ABI Type.
* ```
*/
var InvalidTypeError = class extends BaseError {
	constructor(type) {
		super(`Type \`${type}\` is not a valid ABI Type.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "AbiParameters.InvalidTypeError"
		});
	}
};
//#endregion
//#region node_modules/ox/_esm/core/Rlp.js
/**
* Decodes a Recursive-Length Prefix (RLP) value into a {@link ox#Hex.Hex} value.
*
* @example
* ```ts twoslash
* import { Rlp } from 'ox'
* Rlp.toHex('0x8b68656c6c6f20776f726c64')
* // 0x68656c6c6f20776f726c64
* ```
*
* @param value - The value to decode.
* @returns The decoded {@link ox#Hex.Hex} value.
*/
function toHex$1(value) {
	return to(value, "Hex");
}
/** @internal */
function to(value, to) {
	const to_ = to ?? (typeof value === "string" ? "Hex" : "Bytes");
	return decodeRlpCursor(create((() => {
		if (typeof value === "string") {
			if (value.length > 3 && value.length % 2 !== 0) throw new InvalidLengthError(value);
			return fromHex$3(value);
		}
		return value;
	})(), { recursiveReadLimit: Number.POSITIVE_INFINITY }), to_);
}
/** @internal */
/** @internal */
function decodeRlpCursor(cursor, to = "Hex") {
	if (cursor.bytes.length === 0) return to === "Hex" ? fromBytes$2(cursor.bytes) : cursor.bytes;
	const prefix = cursor.readByte();
	if (prefix < 128) cursor.decrementPosition(1);
	if (prefix < 192) {
		const length = readLength(cursor, prefix, 128);
		const bytes = cursor.readBytes(length);
		return to === "Hex" ? fromBytes$2(bytes) : bytes;
	}
	return readList(cursor, readLength(cursor, prefix, 192), to);
}
/** @internal */
function readLength(cursor, prefix, offset) {
	if (offset === 128 && prefix < 128) return 1;
	if (prefix <= offset + 55) return prefix - offset;
	if (prefix === offset + 55 + 1) return cursor.readUint8();
	if (prefix === offset + 55 + 2) return cursor.readUint16();
	if (prefix === offset + 55 + 3) return cursor.readUint24();
	if (prefix === offset + 55 + 4) return cursor.readUint32();
	throw new BaseError("Invalid RLP prefix");
}
/** @internal */
function readList(cursor, length, to) {
	const position = cursor.position;
	const value = [];
	while (cursor.position - position < length) value.push(decodeRlpCursor(cursor, to));
	return value;
}
/**
* Encodes a {@link ox#Bytes.Bytes} or {@link ox#Hex.Hex} value into a Recursive-Length Prefix (RLP) value.
*
* @example
* ```ts twoslash
* import { Bytes, Rlp } from 'ox'
*
* Rlp.from('0x68656c6c6f20776f726c64', { as: 'Hex' })
* // @log: 0x8b68656c6c6f20776f726c64
*
* Rlp.from(Bytes.from([139, 104, 101, 108, 108, 111,  32, 119, 111, 114, 108, 100]), { as: 'Bytes' })
* // @log: Uint8Array([104, 101, 108, 108, 111,  32, 119, 111, 114, 108, 100])
* ```
*
* @param value - The {@link ox#Bytes.Bytes} or {@link ox#Hex.Hex} value to encode.
* @param options - Options.
* @returns The RLP value.
*/
function from$2(value, options) {
	const { as } = options;
	const encodable = getEncodable(value);
	const cursor = create(new Uint8Array(encodable.length));
	encodable.encode(cursor);
	if (as === "Hex") return fromBytes$2(cursor.bytes);
	return cursor.bytes;
}
/**
* Encodes a {@link ox#Hex.Hex} value into a Recursive-Length Prefix (RLP) value.
*
* @example
* ```ts twoslash
* import { Rlp } from 'ox'
*
* Rlp.fromHex('0x68656c6c6f20776f726c64')
* // @log: 0x8b68656c6c6f20776f726c64
* ```
*
* @param hex - The {@link ox#Hex.Hex} value to encode.
* @param options - Options.
* @returns The RLP value.
*/
function fromHex$1(hex, options = {}) {
	const { as = "Hex" } = options;
	return from$2(hex, { as });
}
function getEncodable(bytes) {
	if (Array.isArray(bytes)) return getEncodableList(bytes.map((x) => getEncodable(x)));
	return getEncodableBytes(bytes);
}
function getEncodableList(list) {
	const bodyLength = list.reduce((acc, x) => acc + x.length, 0);
	const sizeOfBodyLength = getSizeOfLength(bodyLength);
	return {
		length: (() => {
			if (bodyLength <= 55) return 1 + bodyLength;
			return 1 + sizeOfBodyLength + bodyLength;
		})(),
		encode(cursor) {
			if (bodyLength <= 55) cursor.pushByte(192 + bodyLength);
			else {
				cursor.pushByte(247 + sizeOfBodyLength);
				if (sizeOfBodyLength === 1) cursor.pushUint8(bodyLength);
				else if (sizeOfBodyLength === 2) cursor.pushUint16(bodyLength);
				else if (sizeOfBodyLength === 3) cursor.pushUint24(bodyLength);
				else cursor.pushUint32(bodyLength);
			}
			for (const { encode } of list) encode(cursor);
		}
	};
}
function getEncodableBytes(bytesOrHex) {
	const bytes = typeof bytesOrHex === "string" ? fromHex$3(bytesOrHex) : bytesOrHex;
	const sizeOfBytesLength = getSizeOfLength(bytes.length);
	return {
		length: (() => {
			if (bytes.length === 1 && bytes[0] < 128) return 1;
			if (bytes.length <= 55) return 1 + bytes.length;
			return 1 + sizeOfBytesLength + bytes.length;
		})(),
		encode(cursor) {
			if (bytes.length === 1 && bytes[0] < 128) cursor.pushBytes(bytes);
			else if (bytes.length <= 55) {
				cursor.pushByte(128 + bytes.length);
				cursor.pushBytes(bytes);
			} else {
				cursor.pushByte(183 + sizeOfBytesLength);
				if (sizeOfBytesLength === 1) cursor.pushUint8(bytes.length);
				else if (sizeOfBytesLength === 2) cursor.pushUint16(bytes.length);
				else if (sizeOfBytesLength === 3) cursor.pushUint24(bytes.length);
				else cursor.pushUint32(bytes.length);
				cursor.pushBytes(bytes);
			}
		}
	};
}
function getSizeOfLength(length) {
	if (length <= 255) return 1;
	if (length <= 65535) return 2;
	if (length <= 16777215) return 3;
	if (length <= 4294967295) return 4;
	throw new BaseError("Length is too large.");
}
//#endregion
//#region node_modules/ox/node_modules/@noble/curves/esm/abstract/modular.js
/**
* Utils for modular division and finite fields.
* A finite field over 11 is integer number operations `mod 11`.
* There is no division: it is replaced by modular multiplicative inverse.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n$3 = BigInt(0), _1n$3 = BigInt(1), _2n$2 = /* @__PURE__ */ BigInt(2), _3n$1 = /* @__PURE__ */ BigInt(3);
var _4n$1 = /* @__PURE__ */ BigInt(4), _5n = /* @__PURE__ */ BigInt(5), _8n = /* @__PURE__ */ BigInt(8);
function mod(a, b) {
	const result = a % b;
	return result >= _0n$3 ? result : b + result;
}
/** Does `x^(2^power)` mod p. `pow2(30, 4)` == `30^(2^4)` */
function pow2(x, power, modulo) {
	let res = x;
	while (power-- > _0n$3) {
		res *= res;
		res %= modulo;
	}
	return res;
}
/**
* Inverses number over modulo.
* Implemented using [Euclidean GCD](https://brilliant.org/wiki/extended-euclidean-algorithm/).
*/
function invert(number, modulo) {
	if (number === _0n$3) throw new Error("invert: expected non-zero number");
	if (modulo <= _0n$3) throw new Error("invert: expected positive modulus, got " + modulo);
	let a = mod(number, modulo);
	let b = modulo;
	let x = _0n$3, y = _1n$3, u = _1n$3, v = _0n$3;
	while (a !== _0n$3) {
		const q = b / a;
		const r = b % a;
		const m = x - u * q;
		const n = y - v * q;
		b = a, a = r, x = u, y = v, u = m, v = n;
	}
	if (b !== _1n$3) throw new Error("invert: does not exist");
	return mod(x, modulo);
}
function sqrt3mod4(Fp, n) {
	const p1div4 = (Fp.ORDER + _1n$3) / _4n$1;
	const root = Fp.pow(n, p1div4);
	if (!Fp.eql(Fp.sqr(root), n)) throw new Error("Cannot find square root");
	return root;
}
function sqrt5mod8(Fp, n) {
	const p5div8 = (Fp.ORDER - _5n) / _8n;
	const n2 = Fp.mul(n, _2n$2);
	const v = Fp.pow(n2, p5div8);
	const nv = Fp.mul(n, v);
	const i = Fp.mul(Fp.mul(nv, _2n$2), v);
	const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
	if (!Fp.eql(Fp.sqr(root), n)) throw new Error("Cannot find square root");
	return root;
}
/**
* Tonelli-Shanks square root search algorithm.
* 1. https://eprint.iacr.org/2012/685.pdf (page 12)
* 2. Square Roots from 1; 24, 51, 10 to Dan Shanks
* @param P field order
* @returns function that takes field Fp (created from P) and number n
*/
function tonelliShanks(P) {
	if (P < BigInt(3)) throw new Error("sqrt is not defined for small field");
	let Q = P - _1n$3;
	let S = 0;
	while (Q % _2n$2 === _0n$3) {
		Q /= _2n$2;
		S++;
	}
	let Z = _2n$2;
	const _Fp = Field(P);
	while (FpLegendre(_Fp, Z) === 1) if (Z++ > 1e3) throw new Error("Cannot find square root: probably non-prime P");
	if (S === 1) return sqrt3mod4;
	let cc = _Fp.pow(Z, Q);
	const Q1div2 = (Q + _1n$3) / _2n$2;
	return function tonelliSlow(Fp, n) {
		if (Fp.is0(n)) return n;
		if (FpLegendre(Fp, n) !== 1) throw new Error("Cannot find square root");
		let M = S;
		let c = Fp.mul(Fp.ONE, cc);
		let t = Fp.pow(n, Q);
		let R = Fp.pow(n, Q1div2);
		while (!Fp.eql(t, Fp.ONE)) {
			if (Fp.is0(t)) return Fp.ZERO;
			let i = 1;
			let t_tmp = Fp.sqr(t);
			while (!Fp.eql(t_tmp, Fp.ONE)) {
				i++;
				t_tmp = Fp.sqr(t_tmp);
				if (i === M) throw new Error("Cannot find square root");
			}
			const exponent = _1n$3 << BigInt(M - i - 1);
			const b = Fp.pow(c, exponent);
			M = i;
			c = Fp.sqr(b);
			t = Fp.mul(t, c);
			R = Fp.mul(R, b);
		}
		return R;
	};
}
/**
* Square root for a finite field. Will try optimized versions first:
*
* 1. P ≡ 3 (mod 4)
* 2. P ≡ 5 (mod 8)
* 3. Tonelli-Shanks algorithm
*
* Different algorithms can give different roots, it is up to user to decide which one they want.
* For example there is FpSqrtOdd/FpSqrtEven to choice root based on oddness (used for hash-to-curve).
*/
function FpSqrt(P) {
	if (P % _4n$1 === _3n$1) return sqrt3mod4;
	if (P % _8n === _5n) return sqrt5mod8;
	return tonelliShanks(P);
}
var FIELD_FIELDS = [
	"create",
	"isValid",
	"is0",
	"neg",
	"inv",
	"sqrt",
	"sqr",
	"eql",
	"add",
	"sub",
	"mul",
	"pow",
	"div",
	"addN",
	"subN",
	"mulN",
	"sqrN"
];
function validateField(field) {
	return validateObject(field, FIELD_FIELDS.reduce((map, val) => {
		map[val] = "function";
		return map;
	}, {
		ORDER: "bigint",
		MASK: "bigint",
		BYTES: "isSafeInteger",
		BITS: "isSafeInteger"
	}));
}
/**
* Same as `pow` but for Fp: non-constant-time.
* Unsafe in some contexts: uses ladder, so can expose bigint bits.
*/
function FpPow(Fp, num, power) {
	if (power < _0n$3) throw new Error("invalid exponent, negatives unsupported");
	if (power === _0n$3) return Fp.ONE;
	if (power === _1n$3) return num;
	let p = Fp.ONE;
	let d = num;
	while (power > _0n$3) {
		if (power & _1n$3) p = Fp.mul(p, d);
		d = Fp.sqr(d);
		power >>= _1n$3;
	}
	return p;
}
/**
* Efficiently invert an array of Field elements.
* Exception-free. Will return `undefined` for 0 elements.
* @param passZero map 0 to 0 (instead of undefined)
*/
function FpInvertBatch(Fp, nums, passZero = false) {
	const inverted = new Array(nums.length).fill(passZero ? Fp.ZERO : void 0);
	const multipliedAcc = nums.reduce((acc, num, i) => {
		if (Fp.is0(num)) return acc;
		inverted[i] = acc;
		return Fp.mul(acc, num);
	}, Fp.ONE);
	const invertedAcc = Fp.inv(multipliedAcc);
	nums.reduceRight((acc, num, i) => {
		if (Fp.is0(num)) return acc;
		inverted[i] = Fp.mul(acc, inverted[i]);
		return Fp.mul(acc, num);
	}, invertedAcc);
	return inverted;
}
/**
* Legendre symbol.
* Legendre constant is used to calculate Legendre symbol (a | p)
* which denotes the value of a^((p-1)/2) (mod p).
*
* * (a | p) ≡ 1    if a is a square (mod p), quadratic residue
* * (a | p) ≡ -1   if a is not a square (mod p), quadratic non residue
* * (a | p) ≡ 0    if a ≡ 0 (mod p)
*/
function FpLegendre(Fp, n) {
	const p1mod2 = (Fp.ORDER - _1n$3) / _2n$2;
	const powered = Fp.pow(n, p1mod2);
	const yes = Fp.eql(powered, Fp.ONE);
	const zero = Fp.eql(powered, Fp.ZERO);
	const no = Fp.eql(powered, Fp.neg(Fp.ONE));
	if (!yes && !zero && !no) throw new Error("invalid Legendre symbol result");
	return yes ? 1 : zero ? 0 : -1;
}
function nLength(n, nBitLength) {
	if (nBitLength !== void 0) anumber(nBitLength);
	const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
	return {
		nBitLength: _nBitLength,
		nByteLength: Math.ceil(_nBitLength / 8)
	};
}
/**
* Initializes a finite field over prime.
* Major performance optimizations:
* * a) denormalized operations like mulN instead of mul
* * b) same object shape: never add or remove keys
* * c) Object.freeze
* Fragile: always run a benchmark on a change.
* Security note: operations don't check 'isValid' for all elements for performance reasons,
* it is caller responsibility to check this.
* This is low-level code, please make sure you know what you're doing.
* @param ORDER prime positive bigint
* @param bitLen how many bits the field consumes
* @param isLE (def: false) if encoding / decoding should be in little-endian
* @param redef optional faster redefinitions of sqrt and other methods
*/
function Field(ORDER, bitLen, isLE = false, redef = {}) {
	if (ORDER <= _0n$3) throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
	const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, bitLen);
	if (BYTES > 2048) throw new Error("invalid field: expected ORDER of <= 2048 bytes");
	let sqrtP;
	const f = Object.freeze({
		ORDER,
		isLE,
		BITS,
		BYTES,
		MASK: bitMask(BITS),
		ZERO: _0n$3,
		ONE: _1n$3,
		create: (num) => mod(num, ORDER),
		isValid: (num) => {
			if (typeof num !== "bigint") throw new Error("invalid field element: expected bigint, got " + typeof num);
			return _0n$3 <= num && num < ORDER;
		},
		is0: (num) => num === _0n$3,
		isOdd: (num) => (num & _1n$3) === _1n$3,
		neg: (num) => mod(-num, ORDER),
		eql: (lhs, rhs) => lhs === rhs,
		sqr: (num) => mod(num * num, ORDER),
		add: (lhs, rhs) => mod(lhs + rhs, ORDER),
		sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
		mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
		pow: (num, power) => FpPow(f, num, power),
		div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
		sqrN: (num) => num * num,
		addN: (lhs, rhs) => lhs + rhs,
		subN: (lhs, rhs) => lhs - rhs,
		mulN: (lhs, rhs) => lhs * rhs,
		inv: (num) => invert(num, ORDER),
		sqrt: redef.sqrt || ((n) => {
			if (!sqrtP) sqrtP = FpSqrt(ORDER);
			return sqrtP(f, n);
		}),
		toBytes: (num) => isLE ? numberToBytesLE(num, BYTES) : numberToBytesBE(num, BYTES),
		fromBytes: (bytes) => {
			if (bytes.length !== BYTES) throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
			return isLE ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
		},
		invertBatch: (lst) => FpInvertBatch(f, lst),
		cmov: (a, b, c) => c ? b : a
	});
	return Object.freeze(f);
}
/**
* Returns total number of bytes consumed by the field element.
* For example, 32 bytes for usual 256-bit weierstrass curve.
* @param fieldOrder number of field elements, usually CURVE.n
* @returns byte length of field
*/
function getFieldBytesLength(fieldOrder) {
	if (typeof fieldOrder !== "bigint") throw new Error("field order must be bigint");
	const bitLength = fieldOrder.toString(2).length;
	return Math.ceil(bitLength / 8);
}
/**
* Returns minimal amount of bytes that can be safely reduced
* by field order.
* Should be 2^-128 for 128-bit curve such as P256.
* @param fieldOrder number of field elements, usually CURVE.n
* @returns byte length of target hash
*/
function getMinHashLength(fieldOrder) {
	const length = getFieldBytesLength(fieldOrder);
	return length + Math.ceil(length / 2);
}
/**
* "Constant-time" private key generation utility.
* Can take (n + n/2) or more bytes of uniform input e.g. from CSPRNG or KDF
* and convert them into private scalar, with the modulo bias being negligible.
* Needs at least 48 bytes of input for 32-byte private key.
* https://research.kudelskisecurity.com/2020/07/28/the-definitive-guide-to-modulo-bias-and-how-to-avoid-it/
* FIPS 186-5, A.2 https://csrc.nist.gov/publications/detail/fips/186/5/final
* RFC 9380, https://www.rfc-editor.org/rfc/rfc9380#section-5
* @param hash hash output from SHA3 or a similar function
* @param groupOrder size of subgroup - (e.g. secp256k1.CURVE.n)
* @param isLE interpret hash bytes as LE num
* @returns valid private scalar
*/
function mapHashToField(key, fieldOrder, isLE = false) {
	const len = key.length;
	const fieldLen = getFieldBytesLength(fieldOrder);
	const minLen = getMinHashLength(fieldOrder);
	if (len < 16 || len < minLen || len > 1024) throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
	const reduced = mod(isLE ? bytesToNumberLE(key) : bytesToNumberBE(key), fieldOrder - _1n$3) + _1n$3;
	return isLE ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
}
//#endregion
//#region node_modules/ox/node_modules/@noble/curves/esm/abstract/curve.js
/**
* Methods for elliptic curve multiplication by scalars.
* Contains wNAF, pippenger
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n$2 = BigInt(0);
var _1n$2 = BigInt(1);
function constTimeNegate(condition, item) {
	const neg = item.negate();
	return condition ? neg : item;
}
function validateW(W, bits) {
	if (!Number.isSafeInteger(W) || W <= 0 || W > bits) throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
}
function calcWOpts(W, scalarBits) {
	validateW(W, scalarBits);
	const windows = Math.ceil(scalarBits / W) + 1;
	const windowSize = 2 ** (W - 1);
	const maxNumber = 2 ** W;
	return {
		windows,
		windowSize,
		mask: bitMask(W),
		maxNumber,
		shiftBy: BigInt(W)
	};
}
function calcOffsets(n, window, wOpts) {
	const { windowSize, mask, maxNumber, shiftBy } = wOpts;
	let wbits = Number(n & mask);
	let nextN = n >> shiftBy;
	if (wbits > windowSize) {
		wbits -= maxNumber;
		nextN += _1n$2;
	}
	const offsetStart = window * windowSize;
	const offset = offsetStart + Math.abs(wbits) - 1;
	const isZero = wbits === 0;
	const isNeg = wbits < 0;
	const isNegF = window % 2 !== 0;
	return {
		nextN,
		offset,
		isZero,
		isNeg,
		isNegF,
		offsetF: offsetStart
	};
}
function validateMSMPoints(points, c) {
	if (!Array.isArray(points)) throw new Error("array expected");
	points.forEach((p, i) => {
		if (!(p instanceof c)) throw new Error("invalid point at index " + i);
	});
}
function validateMSMScalars(scalars, field) {
	if (!Array.isArray(scalars)) throw new Error("array of scalars expected");
	scalars.forEach((s, i) => {
		if (!field.isValid(s)) throw new Error("invalid scalar at index " + i);
	});
}
var pointPrecomputes = /* @__PURE__ */ new WeakMap();
var pointWindowSizes = /* @__PURE__ */ new WeakMap();
function getW(P) {
	return pointWindowSizes.get(P) || 1;
}
/**
* Elliptic curve multiplication of Point by scalar. Fragile.
* Scalars should always be less than curve order: this should be checked inside of a curve itself.
* Creates precomputation tables for fast multiplication:
* - private scalar is split by fixed size windows of W bits
* - every window point is collected from window's table & added to accumulator
* - since windows are different, same point inside tables won't be accessed more than once per calc
* - each multiplication is 'Math.ceil(CURVE_ORDER / 𝑊) + 1' point additions (fixed for any scalar)
* - +1 window is neccessary for wNAF
* - wNAF reduces table size: 2x less memory + 2x faster generation, but 10% slower multiplication
*
* @todo Research returning 2d JS array of windows, instead of a single window.
* This would allow windows to be in different memory locations
*/
function wNAF(c, bits) {
	return {
		constTimeNegate,
		hasPrecomputes(elm) {
			return getW(elm) !== 1;
		},
		unsafeLadder(elm, n, p = c.ZERO) {
			let d = elm;
			while (n > _0n$2) {
				if (n & _1n$2) p = p.add(d);
				d = d.double();
				n >>= _1n$2;
			}
			return p;
		},
		precomputeWindow(elm, W) {
			const { windows, windowSize } = calcWOpts(W, bits);
			const points = [];
			let p = elm;
			let base = p;
			for (let window = 0; window < windows; window++) {
				base = p;
				points.push(base);
				for (let i = 1; i < windowSize; i++) {
					base = base.add(p);
					points.push(base);
				}
				p = base.double();
			}
			return points;
		},
		wNAF(W, precomputes, n) {
			let p = c.ZERO;
			let f = c.BASE;
			const wo = calcWOpts(W, bits);
			for (let window = 0; window < wo.windows; window++) {
				const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n, window, wo);
				n = nextN;
				if (isZero) f = f.add(constTimeNegate(isNegF, precomputes[offsetF]));
				else p = p.add(constTimeNegate(isNeg, precomputes[offset]));
			}
			return {
				p,
				f
			};
		},
		wNAFUnsafe(W, precomputes, n, acc = c.ZERO) {
			const wo = calcWOpts(W, bits);
			for (let window = 0; window < wo.windows; window++) {
				if (n === _0n$2) break;
				const { nextN, offset, isZero, isNeg } = calcOffsets(n, window, wo);
				n = nextN;
				if (isZero) continue;
				else {
					const item = precomputes[offset];
					acc = acc.add(isNeg ? item.negate() : item);
				}
			}
			return acc;
		},
		getPrecomputes(W, P, transform) {
			let comp = pointPrecomputes.get(P);
			if (!comp) {
				comp = this.precomputeWindow(P, W);
				if (W !== 1) pointPrecomputes.set(P, transform(comp));
			}
			return comp;
		},
		wNAFCached(P, n, transform) {
			const W = getW(P);
			return this.wNAF(W, this.getPrecomputes(W, P, transform), n);
		},
		wNAFCachedUnsafe(P, n, transform, prev) {
			const W = getW(P);
			if (W === 1) return this.unsafeLadder(P, n, prev);
			return this.wNAFUnsafe(W, this.getPrecomputes(W, P, transform), n, prev);
		},
		setWindowSize(P, W) {
			validateW(W, bits);
			pointWindowSizes.set(P, W);
			pointPrecomputes.delete(P);
		}
	};
}
/**
* Pippenger algorithm for multi-scalar multiplication (MSM, Pa + Qb + Rc + ...).
* 30x faster vs naive addition on L=4096, 10x faster than precomputes.
* For N=254bit, L=1, it does: 1024 ADD + 254 DBL. For L=5: 1536 ADD + 254 DBL.
* Algorithmically constant-time (for same L), even when 1 point + scalar, or when scalar = 0.
* @param c Curve Point constructor
* @param fieldN field over CURVE.N - important that it's not over CURVE.P
* @param points array of L curve points
* @param scalars array of L scalars (aka private keys / bigints)
*/
function pippenger(c, fieldN, points, scalars) {
	validateMSMPoints(points, c);
	validateMSMScalars(scalars, fieldN);
	const plength = points.length;
	const slength = scalars.length;
	if (plength !== slength) throw new Error("arrays of points and scalars must have equal length");
	const zero = c.ZERO;
	const wbits = bitLen(BigInt(plength));
	let windowSize = 1;
	if (wbits > 12) windowSize = wbits - 3;
	else if (wbits > 4) windowSize = wbits - 2;
	else if (wbits > 0) windowSize = 2;
	const MASK = bitMask(windowSize);
	const buckets = new Array(Number(MASK) + 1).fill(zero);
	const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize;
	let sum = zero;
	for (let i = lastBits; i >= 0; i -= windowSize) {
		buckets.fill(zero);
		for (let j = 0; j < slength; j++) {
			const scalar = scalars[j];
			const wbits = Number(scalar >> BigInt(i) & MASK);
			buckets[wbits] = buckets[wbits].add(points[j]);
		}
		let resI = zero;
		for (let j = buckets.length - 1, sumI = zero; j > 0; j--) {
			sumI = sumI.add(buckets[j]);
			resI = resI.add(sumI);
		}
		sum = sum.add(resI);
		if (i !== 0) for (let j = 0; j < windowSize; j++) sum = sum.double();
	}
	return sum;
}
function validateBasic(curve) {
	validateField(curve.Fp);
	validateObject(curve, {
		n: "bigint",
		h: "bigint",
		Gx: "field",
		Gy: "field"
	}, {
		nBitLength: "isSafeInteger",
		nByteLength: "isSafeInteger"
	});
	return Object.freeze({
		...nLength(curve.n, curve.nBitLength),
		...curve,
		p: curve.Fp.ORDER
	});
}
//#endregion
//#region node_modules/ox/node_modules/@noble/curves/esm/abstract/weierstrass.js
/**
* Short Weierstrass curve methods. The formula is: y² = x³ + ax + b.
*
* ### Parameters
*
* To initialize a weierstrass curve, one needs to pass following params:
*
* * a: formula param
* * b: formula param
* * Fp: finite field of prime characteristic P; may be complex (Fp2). Arithmetics is done in field
* * n: order of prime subgroup a.k.a total amount of valid curve points
* * Gx: Base point (x, y) aka generator point. Gx = x coordinate
* * Gy: ...y coordinate
* * h: cofactor, usually 1. h*n = curve group order (n is only subgroup order)
* * lowS: whether to enable (default) or disable "low-s" non-malleable signatures
*
* ### Design rationale for types
*
* * Interaction between classes from different curves should fail:
*   `k256.Point.BASE.add(p256.Point.BASE)`
* * For this purpose we want to use `instanceof` operator, which is fast and works during runtime
* * Different calls of `curve()` would return different classes -
*   `curve(params) !== curve(params)`: if somebody decided to monkey-patch their curve,
*   it won't affect others
*
* TypeScript can't infer types for classes created inside a function. Classes is one instance
* of nominative types in TypeScript and interfaces only check for shape, so it's hard to create
* unique type for every function call.
*
* We can use generic types via some param, like curve opts, but that would:
*     1. Enable interaction between `curve(params)` and `curve(params)` (curves of same params)
*     which is hard to debug.
*     2. Params can be generic and we can't enforce them to be constant value:
*     if somebody creates curve from non-constant params,
*     it would be allowed to interact with other curves with non-constant params
*
* @todo https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html#unique-symbol
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function validateSigVerOpts(opts) {
	if (opts.lowS !== void 0) abool("lowS", opts.lowS);
	if (opts.prehash !== void 0) abool("prehash", opts.prehash);
}
function validatePointOpts(curve) {
	const opts = validateBasic(curve);
	validateObject(opts, {
		a: "field",
		b: "field"
	}, {
		allowInfinityPoint: "boolean",
		allowedPrivateKeyLengths: "array",
		clearCofactor: "function",
		fromBytes: "function",
		isTorsionFree: "function",
		toBytes: "function",
		wrapPrivateKey: "boolean"
	});
	const { endo, Fp, a } = opts;
	if (endo) {
		if (!Fp.eql(a, Fp.ZERO)) throw new Error("invalid endo: CURVE.a must be 0");
		if (typeof endo !== "object" || typeof endo.beta !== "bigint" || typeof endo.splitScalar !== "function") throw new Error("invalid endo: expected \"beta\": bigint and \"splitScalar\": function");
	}
	return Object.freeze({ ...opts });
}
var DERErr = class extends Error {
	constructor(m = "") {
		super(m);
	}
};
/**
* ASN.1 DER encoding utilities. ASN is very complex & fragile. Format:
*
*     [0x30 (SEQUENCE), bytelength, 0x02 (INTEGER), intLength, R, 0x02 (INTEGER), intLength, S]
*
* Docs: https://letsencrypt.org/docs/a-warm-welcome-to-asn1-and-der/, https://luca.ntop.org/Teaching/Appunti/asn1.html
*/
var DER = {
	Err: DERErr,
	_tlv: {
		encode: (tag, data) => {
			const { Err: E } = DER;
			if (tag < 0 || tag > 256) throw new E("tlv.encode: wrong tag");
			if (data.length & 1) throw new E("tlv.encode: unpadded data");
			const dataLen = data.length / 2;
			const len = numberToHexUnpadded(dataLen);
			if (len.length / 2 & 128) throw new E("tlv.encode: long form length too big");
			const lenLen = dataLen > 127 ? numberToHexUnpadded(len.length / 2 | 128) : "";
			return numberToHexUnpadded(tag) + lenLen + len + data;
		},
		decode(tag, data) {
			const { Err: E } = DER;
			let pos = 0;
			if (tag < 0 || tag > 256) throw new E("tlv.encode: wrong tag");
			if (data.length < 2 || data[pos++] !== tag) throw new E("tlv.decode: wrong tlv");
			const first = data[pos++];
			const isLong = !!(first & 128);
			let length = 0;
			if (!isLong) length = first;
			else {
				const lenLen = first & 127;
				if (!lenLen) throw new E("tlv.decode(long): indefinite length not supported");
				if (lenLen > 4) throw new E("tlv.decode(long): byte length is too big");
				const lengthBytes = data.subarray(pos, pos + lenLen);
				if (lengthBytes.length !== lenLen) throw new E("tlv.decode: length bytes not complete");
				if (lengthBytes[0] === 0) throw new E("tlv.decode(long): zero leftmost byte");
				for (const b of lengthBytes) length = length << 8 | b;
				pos += lenLen;
				if (length < 128) throw new E("tlv.decode(long): not minimal encoding");
			}
			const v = data.subarray(pos, pos + length);
			if (v.length !== length) throw new E("tlv.decode: wrong value length");
			return {
				v,
				l: data.subarray(pos + length)
			};
		}
	},
	_int: {
		encode(num) {
			const { Err: E } = DER;
			if (num < _0n$1) throw new E("integer: negative integers are not allowed");
			let hex = numberToHexUnpadded(num);
			if (Number.parseInt(hex[0], 16) & 8) hex = "00" + hex;
			if (hex.length & 1) throw new E("unexpected DER parsing assertion: unpadded hex");
			return hex;
		},
		decode(data) {
			const { Err: E } = DER;
			if (data[0] & 128) throw new E("invalid signature integer: negative");
			if (data[0] === 0 && !(data[1] & 128)) throw new E("invalid signature integer: unnecessary leading zero");
			return bytesToNumberBE(data);
		}
	},
	toSig(hex) {
		const { Err: E, _int: int, _tlv: tlv } = DER;
		const data = ensureBytes("signature", hex);
		const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
		if (seqLeftBytes.length) throw new E("invalid signature: left bytes after parsing");
		const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
		const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
		if (sLeftBytes.length) throw new E("invalid signature: left bytes after parsing");
		return {
			r: int.decode(rBytes),
			s: int.decode(sBytes)
		};
	},
	hexFromSig(sig) {
		const { _tlv: tlv, _int: int } = DER;
		const seq = tlv.encode(2, int.encode(sig.r)) + tlv.encode(2, int.encode(sig.s));
		return tlv.encode(48, seq);
	}
};
function numToSizedHex(num, size) {
	return bytesToHex(numberToBytesBE(num, size));
}
var _0n$1 = BigInt(0), _1n$1 = BigInt(1), _2n$1 = BigInt(2), _3n = BigInt(3), _4n = BigInt(4);
function weierstrassPoints(opts) {
	const CURVE = validatePointOpts(opts);
	const { Fp } = CURVE;
	const Fn = Field(CURVE.n, CURVE.nBitLength);
	const toBytes = CURVE.toBytes || ((_c, point, _isCompressed) => {
		const a = point.toAffine();
		return concatBytes$1(Uint8Array.from([4]), Fp.toBytes(a.x), Fp.toBytes(a.y));
	});
	const fromBytes = CURVE.fromBytes || ((bytes) => {
		const tail = bytes.subarray(1);
		return {
			x: Fp.fromBytes(tail.subarray(0, Fp.BYTES)),
			y: Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES))
		};
	});
	/**
	* y² = x³ + ax + b: Short weierstrass curve formula. Takes x, returns y².
	* @returns y²
	*/
	function weierstrassEquation(x) {
		const { a, b } = CURVE;
		const x2 = Fp.sqr(x);
		const x3 = Fp.mul(x2, x);
		return Fp.add(Fp.add(x3, Fp.mul(x, a)), b);
	}
	function isValidXY(x, y) {
		const left = Fp.sqr(y);
		const right = weierstrassEquation(x);
		return Fp.eql(left, right);
	}
	if (!isValidXY(CURVE.Gx, CURVE.Gy)) throw new Error("bad curve params: generator point");
	const _4a3 = Fp.mul(Fp.pow(CURVE.a, _3n), _4n);
	const _27b2 = Fp.mul(Fp.sqr(CURVE.b), BigInt(27));
	if (Fp.is0(Fp.add(_4a3, _27b2))) throw new Error("bad curve params: a or b");
	function isWithinCurveOrder(num) {
		return inRange(num, _1n$1, CURVE.n);
	}
	function normPrivateKeyToScalar(key) {
		const { allowedPrivateKeyLengths: lengths, nByteLength, wrapPrivateKey, n: N } = CURVE;
		if (lengths && typeof key !== "bigint") {
			if (isBytes$1(key)) key = bytesToHex(key);
			if (typeof key !== "string" || !lengths.includes(key.length)) throw new Error("invalid private key");
			key = key.padStart(nByteLength * 2, "0");
		}
		let num;
		try {
			num = typeof key === "bigint" ? key : bytesToNumberBE(ensureBytes("private key", key, nByteLength));
		} catch (error) {
			throw new Error("invalid private key, expected hex or " + nByteLength + " bytes, got " + typeof key);
		}
		if (wrapPrivateKey) num = mod(num, N);
		aInRange("private key", num, _1n$1, N);
		return num;
	}
	function aprjpoint(other) {
		if (!(other instanceof Point)) throw new Error("ProjectivePoint expected");
	}
	const toAffineMemo = memoized((p, iz) => {
		const { px: x, py: y, pz: z } = p;
		if (Fp.eql(z, Fp.ONE)) return {
			x,
			y
		};
		const is0 = p.is0();
		if (iz == null) iz = is0 ? Fp.ONE : Fp.inv(z);
		const ax = Fp.mul(x, iz);
		const ay = Fp.mul(y, iz);
		const zz = Fp.mul(z, iz);
		if (is0) return {
			x: Fp.ZERO,
			y: Fp.ZERO
		};
		if (!Fp.eql(zz, Fp.ONE)) throw new Error("invZ was invalid");
		return {
			x: ax,
			y: ay
		};
	});
	const assertValidMemo = memoized((p) => {
		if (p.is0()) {
			if (CURVE.allowInfinityPoint && !Fp.is0(p.py)) return;
			throw new Error("bad point: ZERO");
		}
		const { x, y } = p.toAffine();
		if (!Fp.isValid(x) || !Fp.isValid(y)) throw new Error("bad point: x or y not FE");
		if (!isValidXY(x, y)) throw new Error("bad point: equation left != right");
		if (!p.isTorsionFree()) throw new Error("bad point: not in prime-order subgroup");
		return true;
	});
	/**
	* Projective Point works in 3d / projective (homogeneous) coordinates: (X, Y, Z) ∋ (x=X/Z, y=Y/Z)
	* Default Point works in 2d / affine coordinates: (x, y)
	* We're doing calculations in projective, because its operations don't require costly inversion.
	*/
	class Point {
		constructor(px, py, pz) {
			if (px == null || !Fp.isValid(px)) throw new Error("x required");
			if (py == null || !Fp.isValid(py) || Fp.is0(py)) throw new Error("y required");
			if (pz == null || !Fp.isValid(pz)) throw new Error("z required");
			this.px = px;
			this.py = py;
			this.pz = pz;
			Object.freeze(this);
		}
		static fromAffine(p) {
			const { x, y } = p || {};
			if (!p || !Fp.isValid(x) || !Fp.isValid(y)) throw new Error("invalid affine point");
			if (p instanceof Point) throw new Error("projective point not allowed");
			const is0 = (i) => Fp.eql(i, Fp.ZERO);
			if (is0(x) && is0(y)) return Point.ZERO;
			return new Point(x, y, Fp.ONE);
		}
		get x() {
			return this.toAffine().x;
		}
		get y() {
			return this.toAffine().y;
		}
		/**
		* Takes a bunch of Projective Points but executes only one
		* inversion on all of them. Inversion is very slow operation,
		* so this improves performance massively.
		* Optimization: converts a list of projective points to a list of identical points with Z=1.
		*/
		static normalizeZ(points) {
			const toInv = FpInvertBatch(Fp, points.map((p) => p.pz));
			return points.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
		}
		/**
		* Converts hash string or Uint8Array to Point.
		* @param hex short/long ECDSA hex
		*/
		static fromHex(hex) {
			const P = Point.fromAffine(fromBytes(ensureBytes("pointHex", hex)));
			P.assertValidity();
			return P;
		}
		static fromPrivateKey(privateKey) {
			return Point.BASE.multiply(normPrivateKeyToScalar(privateKey));
		}
		static msm(points, scalars) {
			return pippenger(Point, Fn, points, scalars);
		}
		_setWindowSize(windowSize) {
			wnaf.setWindowSize(this, windowSize);
		}
		assertValidity() {
			assertValidMemo(this);
		}
		hasEvenY() {
			const { y } = this.toAffine();
			if (Fp.isOdd) return !Fp.isOdd(y);
			throw new Error("Field doesn't support isOdd");
		}
		/**
		* Compare one point to another.
		*/
		equals(other) {
			aprjpoint(other);
			const { px: X1, py: Y1, pz: Z1 } = this;
			const { px: X2, py: Y2, pz: Z2 } = other;
			const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
			const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
			return U1 && U2;
		}
		/**
		* Flips point to one corresponding to (x, -y) in Affine coordinates.
		*/
		negate() {
			return new Point(this.px, Fp.neg(this.py), this.pz);
		}
		double() {
			const { a, b } = CURVE;
			const b3 = Fp.mul(b, _3n);
			const { px: X1, py: Y1, pz: Z1 } = this;
			let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
			let t0 = Fp.mul(X1, X1);
			let t1 = Fp.mul(Y1, Y1);
			let t2 = Fp.mul(Z1, Z1);
			let t3 = Fp.mul(X1, Y1);
			t3 = Fp.add(t3, t3);
			Z3 = Fp.mul(X1, Z1);
			Z3 = Fp.add(Z3, Z3);
			X3 = Fp.mul(a, Z3);
			Y3 = Fp.mul(b3, t2);
			Y3 = Fp.add(X3, Y3);
			X3 = Fp.sub(t1, Y3);
			Y3 = Fp.add(t1, Y3);
			Y3 = Fp.mul(X3, Y3);
			X3 = Fp.mul(t3, X3);
			Z3 = Fp.mul(b3, Z3);
			t2 = Fp.mul(a, t2);
			t3 = Fp.sub(t0, t2);
			t3 = Fp.mul(a, t3);
			t3 = Fp.add(t3, Z3);
			Z3 = Fp.add(t0, t0);
			t0 = Fp.add(Z3, t0);
			t0 = Fp.add(t0, t2);
			t0 = Fp.mul(t0, t3);
			Y3 = Fp.add(Y3, t0);
			t2 = Fp.mul(Y1, Z1);
			t2 = Fp.add(t2, t2);
			t0 = Fp.mul(t2, t3);
			X3 = Fp.sub(X3, t0);
			Z3 = Fp.mul(t2, t1);
			Z3 = Fp.add(Z3, Z3);
			Z3 = Fp.add(Z3, Z3);
			return new Point(X3, Y3, Z3);
		}
		add(other) {
			aprjpoint(other);
			const { px: X1, py: Y1, pz: Z1 } = this;
			const { px: X2, py: Y2, pz: Z2 } = other;
			let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
			const a = CURVE.a;
			const b3 = Fp.mul(CURVE.b, _3n);
			let t0 = Fp.mul(X1, X2);
			let t1 = Fp.mul(Y1, Y2);
			let t2 = Fp.mul(Z1, Z2);
			let t3 = Fp.add(X1, Y1);
			let t4 = Fp.add(X2, Y2);
			t3 = Fp.mul(t3, t4);
			t4 = Fp.add(t0, t1);
			t3 = Fp.sub(t3, t4);
			t4 = Fp.add(X1, Z1);
			let t5 = Fp.add(X2, Z2);
			t4 = Fp.mul(t4, t5);
			t5 = Fp.add(t0, t2);
			t4 = Fp.sub(t4, t5);
			t5 = Fp.add(Y1, Z1);
			X3 = Fp.add(Y2, Z2);
			t5 = Fp.mul(t5, X3);
			X3 = Fp.add(t1, t2);
			t5 = Fp.sub(t5, X3);
			Z3 = Fp.mul(a, t4);
			X3 = Fp.mul(b3, t2);
			Z3 = Fp.add(X3, Z3);
			X3 = Fp.sub(t1, Z3);
			Z3 = Fp.add(t1, Z3);
			Y3 = Fp.mul(X3, Z3);
			t1 = Fp.add(t0, t0);
			t1 = Fp.add(t1, t0);
			t2 = Fp.mul(a, t2);
			t4 = Fp.mul(b3, t4);
			t1 = Fp.add(t1, t2);
			t2 = Fp.sub(t0, t2);
			t2 = Fp.mul(a, t2);
			t4 = Fp.add(t4, t2);
			t0 = Fp.mul(t1, t4);
			Y3 = Fp.add(Y3, t0);
			t0 = Fp.mul(t5, t4);
			X3 = Fp.mul(t3, X3);
			X3 = Fp.sub(X3, t0);
			t0 = Fp.mul(t3, t1);
			Z3 = Fp.mul(t5, Z3);
			Z3 = Fp.add(Z3, t0);
			return new Point(X3, Y3, Z3);
		}
		subtract(other) {
			return this.add(other.negate());
		}
		is0() {
			return this.equals(Point.ZERO);
		}
		wNAF(n) {
			return wnaf.wNAFCached(this, n, Point.normalizeZ);
		}
		/**
		* Non-constant-time multiplication. Uses double-and-add algorithm.
		* It's faster, but should only be used when you don't care about
		* an exposed private key e.g. sig verification, which works over *public* keys.
		*/
		multiplyUnsafe(sc) {
			const { endo, n: N } = CURVE;
			aInRange("scalar", sc, _0n$1, N);
			const I = Point.ZERO;
			if (sc === _0n$1) return I;
			if (this.is0() || sc === _1n$1) return this;
			if (!endo || wnaf.hasPrecomputes(this)) return wnaf.wNAFCachedUnsafe(this, sc, Point.normalizeZ);
			/** See docs for {@link EndomorphismOpts} */
			let { k1neg, k1, k2neg, k2 } = endo.splitScalar(sc);
			let k1p = I;
			let k2p = I;
			let d = this;
			while (k1 > _0n$1 || k2 > _0n$1) {
				if (k1 & _1n$1) k1p = k1p.add(d);
				if (k2 & _1n$1) k2p = k2p.add(d);
				d = d.double();
				k1 >>= _1n$1;
				k2 >>= _1n$1;
			}
			if (k1neg) k1p = k1p.negate();
			if (k2neg) k2p = k2p.negate();
			k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
			return k1p.add(k2p);
		}
		/**
		* Constant time multiplication.
		* Uses wNAF method. Windowed method may be 10% faster,
		* but takes 2x longer to generate and consumes 2x memory.
		* Uses precomputes when available.
		* Uses endomorphism for Koblitz curves.
		* @param scalar by which the point would be multiplied
		* @returns New point
		*/
		multiply(scalar) {
			const { endo, n: N } = CURVE;
			aInRange("scalar", scalar, _1n$1, N);
			let point, fake;
			/** See docs for {@link EndomorphismOpts} */
			if (endo) {
				const { k1neg, k1, k2neg, k2 } = endo.splitScalar(scalar);
				let { p: k1p, f: f1p } = this.wNAF(k1);
				let { p: k2p, f: f2p } = this.wNAF(k2);
				k1p = wnaf.constTimeNegate(k1neg, k1p);
				k2p = wnaf.constTimeNegate(k2neg, k2p);
				k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
				point = k1p.add(k2p);
				fake = f1p.add(f2p);
			} else {
				const { p, f } = this.wNAF(scalar);
				point = p;
				fake = f;
			}
			return Point.normalizeZ([point, fake])[0];
		}
		/**
		* Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
		* Not using Strauss-Shamir trick: precomputation tables are faster.
		* The trick could be useful if both P and Q are not G (not in our case).
		* @returns non-zero affine point
		*/
		multiplyAndAddUnsafe(Q, a, b) {
			const G = Point.BASE;
			const mul = (P, a) => a === _0n$1 || a === _1n$1 || !P.equals(G) ? P.multiplyUnsafe(a) : P.multiply(a);
			const sum = mul(this, a).add(mul(Q, b));
			return sum.is0() ? void 0 : sum;
		}
		toAffine(iz) {
			return toAffineMemo(this, iz);
		}
		isTorsionFree() {
			const { h: cofactor, isTorsionFree } = CURVE;
			if (cofactor === _1n$1) return true;
			if (isTorsionFree) return isTorsionFree(Point, this);
			throw new Error("isTorsionFree() has not been declared for the elliptic curve");
		}
		clearCofactor() {
			const { h: cofactor, clearCofactor } = CURVE;
			if (cofactor === _1n$1) return this;
			if (clearCofactor) return clearCofactor(Point, this);
			return this.multiplyUnsafe(CURVE.h);
		}
		toRawBytes(isCompressed = true) {
			abool("isCompressed", isCompressed);
			this.assertValidity();
			return toBytes(Point, this, isCompressed);
		}
		toHex(isCompressed = true) {
			abool("isCompressed", isCompressed);
			return bytesToHex(this.toRawBytes(isCompressed));
		}
	}
	Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
	Point.ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO);
	const { endo, nBitLength } = CURVE;
	const wnaf = wNAF(Point, endo ? Math.ceil(nBitLength / 2) : nBitLength);
	return {
		CURVE,
		ProjectivePoint: Point,
		normPrivateKeyToScalar,
		weierstrassEquation,
		isWithinCurveOrder
	};
}
function validateOpts(curve) {
	const opts = validateBasic(curve);
	validateObject(opts, {
		hash: "hash",
		hmac: "function",
		randomBytes: "function"
	}, {
		bits2int: "function",
		bits2int_modN: "function",
		lowS: "boolean"
	});
	return Object.freeze({
		lowS: true,
		...opts
	});
}
/**
* Creates short weierstrass curve and ECDSA signature methods for it.
* @example
* import { Field } from '@noble/curves/abstract/modular';
* // Before that, define BigInt-s: a, b, p, n, Gx, Gy
* const curve = weierstrass({ a, b, Fp: Field(p), n, Gx, Gy, h: 1n })
*/
function weierstrass(curveDef) {
	const CURVE = validateOpts(curveDef);
	const { Fp, n: CURVE_ORDER, nByteLength, nBitLength } = CURVE;
	const compressedLen = Fp.BYTES + 1;
	const uncompressedLen = 2 * Fp.BYTES + 1;
	function modN(a) {
		return mod(a, CURVE_ORDER);
	}
	function invN(a) {
		return invert(a, CURVE_ORDER);
	}
	const { ProjectivePoint: Point, normPrivateKeyToScalar, weierstrassEquation, isWithinCurveOrder } = weierstrassPoints({
		...CURVE,
		toBytes(_c, point, isCompressed) {
			const a = point.toAffine();
			const x = Fp.toBytes(a.x);
			const cat = concatBytes$1;
			abool("isCompressed", isCompressed);
			if (isCompressed) return cat(Uint8Array.from([point.hasEvenY() ? 2 : 3]), x);
			else return cat(Uint8Array.from([4]), x, Fp.toBytes(a.y));
		},
		fromBytes(bytes) {
			const len = bytes.length;
			const head = bytes[0];
			const tail = bytes.subarray(1);
			if (len === compressedLen && (head === 2 || head === 3)) {
				const x = bytesToNumberBE(tail);
				if (!inRange(x, _1n$1, Fp.ORDER)) throw new Error("Point is not on curve");
				const y2 = weierstrassEquation(x);
				let y;
				try {
					y = Fp.sqrt(y2);
				} catch (sqrtError) {
					const suffix = sqrtError instanceof Error ? ": " + sqrtError.message : "";
					throw new Error("Point is not on curve" + suffix);
				}
				const isYOdd = (y & _1n$1) === _1n$1;
				if ((head & 1) === 1 !== isYOdd) y = Fp.neg(y);
				return {
					x,
					y
				};
			} else if (len === uncompressedLen && head === 4) return {
				x: Fp.fromBytes(tail.subarray(0, Fp.BYTES)),
				y: Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES))
			};
			else {
				const cl = compressedLen;
				const ul = uncompressedLen;
				throw new Error("invalid Point, expected length of " + cl + ", or uncompressed " + ul + ", got " + len);
			}
		}
	});
	function isBiggerThanHalfOrder(number) {
		return number > CURVE_ORDER >> _1n$1;
	}
	function normalizeS(s) {
		return isBiggerThanHalfOrder(s) ? modN(-s) : s;
	}
	const slcNum = (b, from, to) => bytesToNumberBE(b.slice(from, to));
	/**
	* ECDSA signature with its (r, s) properties. Supports DER & compact representations.
	*/
	class Signature {
		constructor(r, s, recovery) {
			aInRange("r", r, _1n$1, CURVE_ORDER);
			aInRange("s", s, _1n$1, CURVE_ORDER);
			this.r = r;
			this.s = s;
			if (recovery != null) this.recovery = recovery;
			Object.freeze(this);
		}
		static fromCompact(hex) {
			const l = nByteLength;
			hex = ensureBytes("compactSignature", hex, l * 2);
			return new Signature(slcNum(hex, 0, l), slcNum(hex, l, 2 * l));
		}
		static fromDER(hex) {
			const { r, s } = DER.toSig(ensureBytes("DER", hex));
			return new Signature(r, s);
		}
		/**
		* @todo remove
		* @deprecated
		*/
		assertValidity() {}
		addRecoveryBit(recovery) {
			return new Signature(this.r, this.s, recovery);
		}
		recoverPublicKey(msgHash) {
			const { r, s, recovery: rec } = this;
			const h = bits2int_modN(ensureBytes("msgHash", msgHash));
			if (rec == null || ![
				0,
				1,
				2,
				3
			].includes(rec)) throw new Error("recovery id invalid");
			const radj = rec === 2 || rec === 3 ? r + CURVE.n : r;
			if (radj >= Fp.ORDER) throw new Error("recovery id 2 or 3 invalid");
			const prefix = (rec & 1) === 0 ? "02" : "03";
			const R = Point.fromHex(prefix + numToSizedHex(radj, Fp.BYTES));
			const ir = invN(radj);
			const u1 = modN(-h * ir);
			const u2 = modN(s * ir);
			const Q = Point.BASE.multiplyAndAddUnsafe(R, u1, u2);
			if (!Q) throw new Error("point at infinify");
			Q.assertValidity();
			return Q;
		}
		hasHighS() {
			return isBiggerThanHalfOrder(this.s);
		}
		normalizeS() {
			return this.hasHighS() ? new Signature(this.r, modN(-this.s), this.recovery) : this;
		}
		toDERRawBytes() {
			return hexToBytes(this.toDERHex());
		}
		toDERHex() {
			return DER.hexFromSig(this);
		}
		toCompactRawBytes() {
			return hexToBytes(this.toCompactHex());
		}
		toCompactHex() {
			const l = nByteLength;
			return numToSizedHex(this.r, l) + numToSizedHex(this.s, l);
		}
	}
	const utils = {
		isValidPrivateKey(privateKey) {
			try {
				normPrivateKeyToScalar(privateKey);
				return true;
			} catch (error) {
				return false;
			}
		},
		normPrivateKeyToScalar,
		randomPrivateKey: () => {
			const length = getMinHashLength(CURVE.n);
			return mapHashToField(CURVE.randomBytes(length), CURVE.n);
		},
		precompute(windowSize = 8, point = Point.BASE) {
			point._setWindowSize(windowSize);
			point.multiply(BigInt(3));
			return point;
		}
	};
	/**
	* Computes public key for a private key. Checks for validity of the private key.
	* @param privateKey private key
	* @param isCompressed whether to return compact (default), or full key
	* @returns Public key, full when isCompressed=false; short when isCompressed=true
	*/
	function getPublicKey(privateKey, isCompressed = true) {
		return Point.fromPrivateKey(privateKey).toRawBytes(isCompressed);
	}
	/**
	* Quick and dirty check for item being public key. Does not validate hex, or being on-curve.
	*/
	function isProbPub(item) {
		if (typeof item === "bigint") return false;
		if (item instanceof Point) return true;
		const len = ensureBytes("key", item).length;
		const fpl = Fp.BYTES;
		const compLen = fpl + 1;
		const uncompLen = 2 * fpl + 1;
		if (CURVE.allowedPrivateKeyLengths || nByteLength === compLen) return;
		else return len === compLen || len === uncompLen;
	}
	/**
	* ECDH (Elliptic Curve Diffie Hellman).
	* Computes shared public key from private key and public key.
	* Checks: 1) private key validity 2) shared key is on-curve.
	* Does NOT hash the result.
	* @param privateA private key
	* @param publicB different public key
	* @param isCompressed whether to return compact (default), or full key
	* @returns shared public key
	*/
	function getSharedSecret(privateA, publicB, isCompressed = true) {
		if (isProbPub(privateA) === true) throw new Error("first arg must be private key");
		if (isProbPub(publicB) === false) throw new Error("second arg must be public key");
		return Point.fromHex(publicB).multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
	}
	const bits2int = CURVE.bits2int || function(bytes) {
		if (bytes.length > 8192) throw new Error("input is too large");
		const num = bytesToNumberBE(bytes);
		const delta = bytes.length * 8 - nBitLength;
		return delta > 0 ? num >> BigInt(delta) : num;
	};
	const bits2int_modN = CURVE.bits2int_modN || function(bytes) {
		return modN(bits2int(bytes));
	};
	const ORDER_MASK = bitMask(nBitLength);
	/**
	* Converts to bytes. Checks if num in `[0..ORDER_MASK-1]` e.g.: `[0..2^256-1]`.
	*/
	function int2octets(num) {
		aInRange("num < 2^" + nBitLength, num, _0n$1, ORDER_MASK);
		return numberToBytesBE(num, nByteLength);
	}
	function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
		if (["recovered", "canonical"].some((k) => k in opts)) throw new Error("sign() legacy options not supported");
		const { hash, randomBytes } = CURVE;
		let { lowS, prehash, extraEntropy: ent } = opts;
		if (lowS == null) lowS = true;
		msgHash = ensureBytes("msgHash", msgHash);
		validateSigVerOpts(opts);
		if (prehash) msgHash = ensureBytes("prehashed msgHash", hash(msgHash));
		const h1int = bits2int_modN(msgHash);
		const d = normPrivateKeyToScalar(privateKey);
		const seedArgs = [int2octets(d), int2octets(h1int)];
		if (ent != null && ent !== false) {
			const e = ent === true ? randomBytes(Fp.BYTES) : ent;
			seedArgs.push(ensureBytes("extraEntropy", e));
		}
		const seed = concatBytes$1(...seedArgs);
		const m = h1int;
		function k2sig(kBytes) {
			const k = bits2int(kBytes);
			if (!isWithinCurveOrder(k)) return;
			const ik = invN(k);
			const q = Point.BASE.multiply(k).toAffine();
			const r = modN(q.x);
			if (r === _0n$1) return;
			const s = modN(ik * modN(m + r * d));
			if (s === _0n$1) return;
			let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n$1);
			let normS = s;
			if (lowS && isBiggerThanHalfOrder(s)) {
				normS = normalizeS(s);
				recovery ^= 1;
			}
			return new Signature(r, normS, recovery);
		}
		return {
			seed,
			k2sig
		};
	}
	const defaultSigOpts = {
		lowS: CURVE.lowS,
		prehash: false
	};
	const defaultVerOpts = {
		lowS: CURVE.lowS,
		prehash: false
	};
	/**
	* Signs message hash with a private key.
	* ```
	* sign(m, d, k) where
	*   (x, y) = G × k
	*   r = x mod n
	*   s = (m + dr)/k mod n
	* ```
	* @param msgHash NOT message. msg needs to be hashed to `msgHash`, or use `prehash`.
	* @param privKey private key
	* @param opts lowS for non-malleable sigs. extraEntropy for mixing randomness into k. prehash will hash first arg.
	* @returns signature with recovery param
	*/
	function sign(msgHash, privKey, opts = defaultSigOpts) {
		const { seed, k2sig } = prepSig(msgHash, privKey, opts);
		const C = CURVE;
		return createHmacDrbg(C.hash.outputLen, C.nByteLength, C.hmac)(seed, k2sig);
	}
	Point.BASE._setWindowSize(8);
	/**
	* Verifies a signature against message hash and public key.
	* Rejects lowS signatures by default: to override,
	* specify option `{lowS: false}`. Implements section 4.1.4 from https://www.secg.org/sec1-v2.pdf:
	*
	* ```
	* verify(r, s, h, P) where
	*   U1 = hs^-1 mod n
	*   U2 = rs^-1 mod n
	*   R = U1⋅G - U2⋅P
	*   mod(R.x, n) == r
	* ```
	*/
	function verify(signature, msgHash, publicKey, opts = defaultVerOpts) {
		const sg = signature;
		msgHash = ensureBytes("msgHash", msgHash);
		publicKey = ensureBytes("publicKey", publicKey);
		const { lowS, prehash, format } = opts;
		validateSigVerOpts(opts);
		if ("strict" in opts) throw new Error("options.strict was renamed to lowS");
		if (format !== void 0 && format !== "compact" && format !== "der") throw new Error("format must be compact or der");
		const isHex = typeof sg === "string" || isBytes$1(sg);
		const isObj = !isHex && !format && typeof sg === "object" && sg !== null && typeof sg.r === "bigint" && typeof sg.s === "bigint";
		if (!isHex && !isObj) throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");
		let _sig = void 0;
		let P;
		try {
			if (isObj) _sig = new Signature(sg.r, sg.s);
			if (isHex) {
				try {
					if (format !== "compact") _sig = Signature.fromDER(sg);
				} catch (derError) {
					if (!(derError instanceof DER.Err)) throw derError;
				}
				if (!_sig && format !== "der") _sig = Signature.fromCompact(sg);
			}
			P = Point.fromHex(publicKey);
		} catch (error) {
			return false;
		}
		if (!_sig) return false;
		if (lowS && _sig.hasHighS()) return false;
		if (prehash) msgHash = CURVE.hash(msgHash);
		const { r, s } = _sig;
		const h = bits2int_modN(msgHash);
		const is = invN(s);
		const u1 = modN(h * is);
		const u2 = modN(r * is);
		const R = Point.BASE.multiplyAndAddUnsafe(P, u1, u2)?.toAffine();
		if (!R) return false;
		return modN(R.x) === r;
	}
	return {
		CURVE,
		getPublicKey,
		getSharedSecret,
		sign,
		verify,
		ProjectivePoint: Point,
		Signature,
		utils
	};
}
/**
* Implementation of the Shallue and van de Woestijne method for any weierstrass curve.
* TODO: check if there is a way to merge this with uvRatio in Edwards; move to modular.
* b = True and y = sqrt(u / v) if (u / v) is square in F, and
* b = False and y = sqrt(Z * (u / v)) otherwise.
* @param Fp
* @param Z
* @returns
*/
function SWUFpSqrtRatio(Fp, Z) {
	const q = Fp.ORDER;
	let l = _0n$1;
	for (let o = q - _1n$1; o % _2n$1 === _0n$1; o /= _2n$1) l += _1n$1;
	const c1 = l;
	const _2n_pow_c1_1 = _2n$1 << c1 - _1n$1 - _1n$1;
	const _2n_pow_c1 = _2n_pow_c1_1 * _2n$1;
	const c2 = (q - _1n$1) / _2n_pow_c1;
	const c3 = (c2 - _1n$1) / _2n$1;
	const c4 = _2n_pow_c1 - _1n$1;
	const c5 = _2n_pow_c1_1;
	const c6 = Fp.pow(Z, c2);
	const c7 = Fp.pow(Z, (c2 + _1n$1) / _2n$1);
	let sqrtRatio = (u, v) => {
		let tv1 = c6;
		let tv2 = Fp.pow(v, c4);
		let tv3 = Fp.sqr(tv2);
		tv3 = Fp.mul(tv3, v);
		let tv5 = Fp.mul(u, tv3);
		tv5 = Fp.pow(tv5, c3);
		tv5 = Fp.mul(tv5, tv2);
		tv2 = Fp.mul(tv5, v);
		tv3 = Fp.mul(tv5, u);
		let tv4 = Fp.mul(tv3, tv2);
		tv5 = Fp.pow(tv4, c5);
		let isQR = Fp.eql(tv5, Fp.ONE);
		tv2 = Fp.mul(tv3, c7);
		tv5 = Fp.mul(tv4, tv1);
		tv3 = Fp.cmov(tv2, tv3, isQR);
		tv4 = Fp.cmov(tv5, tv4, isQR);
		for (let i = c1; i > _1n$1; i--) {
			let tv5 = i - _2n$1;
			tv5 = _2n$1 << tv5 - _1n$1;
			let tvv5 = Fp.pow(tv4, tv5);
			const e1 = Fp.eql(tvv5, Fp.ONE);
			tv2 = Fp.mul(tv3, tv1);
			tv1 = Fp.mul(tv1, tv1);
			tvv5 = Fp.mul(tv4, tv1);
			tv3 = Fp.cmov(tv2, tv3, e1);
			tv4 = Fp.cmov(tvv5, tv4, e1);
		}
		return {
			isValid: isQR,
			value: tv3
		};
	};
	if (Fp.ORDER % _4n === _3n) {
		const c1 = (Fp.ORDER - _3n) / _4n;
		const c2 = Fp.sqrt(Fp.neg(Z));
		sqrtRatio = (u, v) => {
			let tv1 = Fp.sqr(v);
			const tv2 = Fp.mul(u, v);
			tv1 = Fp.mul(tv1, tv2);
			let y1 = Fp.pow(tv1, c1);
			y1 = Fp.mul(y1, tv2);
			const y2 = Fp.mul(y1, c2);
			const tv3 = Fp.mul(Fp.sqr(y1), v);
			const isQR = Fp.eql(tv3, u);
			return {
				isValid: isQR,
				value: Fp.cmov(y2, y1, isQR)
			};
		};
	}
	return sqrtRatio;
}
/**
* Simplified Shallue-van de Woestijne-Ulas Method
* https://www.rfc-editor.org/rfc/rfc9380#section-6.6.2
*/
function mapToCurveSimpleSWU(Fp, opts) {
	validateField(Fp);
	if (!Fp.isValid(opts.A) || !Fp.isValid(opts.B) || !Fp.isValid(opts.Z)) throw new Error("mapToCurveSimpleSWU: invalid opts");
	const sqrtRatio = SWUFpSqrtRatio(Fp, opts.Z);
	if (!Fp.isOdd) throw new Error("Fp.isOdd is not implemented!");
	return (u) => {
		let tv1, tv2, tv3, tv4, tv5, tv6, x, y;
		tv1 = Fp.sqr(u);
		tv1 = Fp.mul(tv1, opts.Z);
		tv2 = Fp.sqr(tv1);
		tv2 = Fp.add(tv2, tv1);
		tv3 = Fp.add(tv2, Fp.ONE);
		tv3 = Fp.mul(tv3, opts.B);
		tv4 = Fp.cmov(opts.Z, Fp.neg(tv2), !Fp.eql(tv2, Fp.ZERO));
		tv4 = Fp.mul(tv4, opts.A);
		tv2 = Fp.sqr(tv3);
		tv6 = Fp.sqr(tv4);
		tv5 = Fp.mul(tv6, opts.A);
		tv2 = Fp.add(tv2, tv5);
		tv2 = Fp.mul(tv2, tv3);
		tv6 = Fp.mul(tv6, tv4);
		tv5 = Fp.mul(tv6, opts.B);
		tv2 = Fp.add(tv2, tv5);
		x = Fp.mul(tv1, tv3);
		const { isValid, value } = sqrtRatio(tv2, tv6);
		y = Fp.mul(tv1, u);
		y = Fp.mul(y, value);
		x = Fp.cmov(x, tv3, isValid);
		y = Fp.cmov(y, value, isValid);
		const e1 = Fp.isOdd(u) === Fp.isOdd(y);
		y = Fp.cmov(Fp.neg(y), y, e1);
		const tv4_inv = FpInvertBatch(Fp, [tv4], true)[0];
		x = Fp.mul(x, tv4_inv);
		return {
			x,
			y
		};
	};
}
//#endregion
//#region node_modules/ox/node_modules/@noble/curves/esm/_shortw_utils.js
/**
* Utilities for short weierstrass curves, combined with noble-hashes.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
/** connects noble-curves to noble-hashes */
function getHash(hash) {
	return {
		hash,
		hmac: (key, ...msgs) => hmac(hash, key, concatBytes(...msgs)),
		randomBytes
	};
}
function createCurve(curveDef, defHash) {
	const create = (hash) => weierstrass({
		...curveDef,
		...getHash(hash)
	});
	return {
		...create(defHash),
		create
	};
}
//#endregion
//#region node_modules/ox/node_modules/@noble/curves/esm/abstract/hash-to-curve.js
var os2ip = bytesToNumberBE;
function i2osp(value, length) {
	anum(value);
	anum(length);
	if (value < 0 || value >= 1 << 8 * length) throw new Error("invalid I2OSP input: " + value);
	const res = Array.from({ length }).fill(0);
	for (let i = length - 1; i >= 0; i--) {
		res[i] = value & 255;
		value >>>= 8;
	}
	return new Uint8Array(res);
}
function strxor(a, b) {
	const arr = new Uint8Array(a.length);
	for (let i = 0; i < a.length; i++) arr[i] = a[i] ^ b[i];
	return arr;
}
function anum(item) {
	if (!Number.isSafeInteger(item)) throw new Error("number expected");
}
/**
* Produces a uniformly random byte string using a cryptographic hash function H that outputs b bits.
* [RFC 9380 5.3.1](https://www.rfc-editor.org/rfc/rfc9380#section-5.3.1).
*/
function expand_message_xmd(msg, DST, lenInBytes, H) {
	abytes$1(msg);
	abytes$1(DST);
	anum(lenInBytes);
	if (DST.length > 255) DST = H(concatBytes$1(utf8ToBytes$1("H2C-OVERSIZE-DST-"), DST));
	const { outputLen: b_in_bytes, blockLen: r_in_bytes } = H;
	const ell = Math.ceil(lenInBytes / b_in_bytes);
	if (lenInBytes > 65535 || ell > 255) throw new Error("expand_message_xmd: invalid lenInBytes");
	const DST_prime = concatBytes$1(DST, i2osp(DST.length, 1));
	const Z_pad = i2osp(0, r_in_bytes);
	const l_i_b_str = i2osp(lenInBytes, 2);
	const b = new Array(ell);
	const b_0 = H(concatBytes$1(Z_pad, msg, l_i_b_str, i2osp(0, 1), DST_prime));
	b[0] = H(concatBytes$1(b_0, i2osp(1, 1), DST_prime));
	for (let i = 1; i <= ell; i++) b[i] = H(concatBytes$1(...[
		strxor(b_0, b[i - 1]),
		i2osp(i + 1, 1),
		DST_prime
	]));
	return concatBytes$1(...b).slice(0, lenInBytes);
}
/**
* Produces a uniformly random byte string using an extendable-output function (XOF) H.
* 1. The collision resistance of H MUST be at least k bits.
* 2. H MUST be an XOF that has been proved indifferentiable from
*    a random oracle under a reasonable cryptographic assumption.
* [RFC 9380 5.3.2](https://www.rfc-editor.org/rfc/rfc9380#section-5.3.2).
*/
function expand_message_xof(msg, DST, lenInBytes, k, H) {
	abytes$1(msg);
	abytes$1(DST);
	anum(lenInBytes);
	if (DST.length > 255) {
		const dkLen = Math.ceil(2 * k / 8);
		DST = H.create({ dkLen }).update(utf8ToBytes$1("H2C-OVERSIZE-DST-")).update(DST).digest();
	}
	if (lenInBytes > 65535 || DST.length > 255) throw new Error("expand_message_xof: invalid lenInBytes");
	return H.create({ dkLen: lenInBytes }).update(msg).update(i2osp(lenInBytes, 2)).update(DST).update(i2osp(DST.length, 1)).digest();
}
/**
* Hashes arbitrary-length byte strings to a list of one or more elements of a finite field F.
* [RFC 9380 5.2](https://www.rfc-editor.org/rfc/rfc9380#section-5.2).
* @param msg a byte string containing the message to hash
* @param count the number of elements of F to output
* @param options `{DST: string, p: bigint, m: number, k: number, expand: 'xmd' | 'xof', hash: H}`, see above
* @returns [u_0, ..., u_(count - 1)], a list of field elements.
*/
function hash_to_field(msg, count, options) {
	validateObject(options, {
		DST: "stringOrUint8Array",
		p: "bigint",
		m: "isSafeInteger",
		k: "isSafeInteger",
		hash: "hash"
	});
	const { p, k, m, hash, expand, DST: _DST } = options;
	abytes$1(msg);
	anum(count);
	const DST = typeof _DST === "string" ? utf8ToBytes$1(_DST) : _DST;
	const log2p = p.toString(2).length;
	const L = Math.ceil((log2p + k) / 8);
	const len_in_bytes = count * m * L;
	let prb;
	if (expand === "xmd") prb = expand_message_xmd(msg, DST, len_in_bytes, hash);
	else if (expand === "xof") prb = expand_message_xof(msg, DST, len_in_bytes, k, hash);
	else if (expand === "_internal_pass") prb = msg;
	else throw new Error("expand must be \"xmd\" or \"xof\"");
	const u = new Array(count);
	for (let i = 0; i < count; i++) {
		const e = new Array(m);
		for (let j = 0; j < m; j++) {
			const elm_offset = L * (j + i * m);
			e[j] = mod(os2ip(prb.subarray(elm_offset, elm_offset + L)), p);
		}
		u[i] = e;
	}
	return u;
}
function isogenyMap(field, map) {
	const coeff = map.map((i) => Array.from(i).reverse());
	return (x, y) => {
		const [xn, xd, yn, yd] = coeff.map((val) => val.reduce((acc, i) => field.add(field.mul(acc, x), i)));
		const [xd_inv, yd_inv] = FpInvertBatch(field, [xd, yd], true);
		x = field.mul(xn, xd_inv);
		y = field.mul(y, field.mul(yn, yd_inv));
		return {
			x,
			y
		};
	};
}
/** Creates hash-to-curve methods from EC Point and mapToCurve function. */
function createHasher(Point, mapToCurve, defaults) {
	if (typeof mapToCurve !== "function") throw new Error("mapToCurve() must be defined");
	function map(num) {
		return Point.fromAffine(mapToCurve(num));
	}
	function clear(initial) {
		const P = initial.clearCofactor();
		if (P.equals(Point.ZERO)) return Point.ZERO;
		P.assertValidity();
		return P;
	}
	return {
		defaults,
		hashToCurve(msg, options) {
			const u = hash_to_field(msg, 2, {
				...defaults,
				DST: defaults.DST,
				...options
			});
			const u0 = map(u[0]);
			const u1 = map(u[1]);
			return clear(u0.add(u1));
		},
		encodeToCurve(msg, options) {
			return clear(map(hash_to_field(msg, 1, {
				...defaults,
				DST: defaults.encodeDST,
				...options
			})[0]));
		},
		mapToCurve(scalars) {
			if (!Array.isArray(scalars)) throw new Error("expected array of bigints");
			for (const i of scalars) if (typeof i !== "bigint") throw new Error("expected array of bigints");
			return clear(map(scalars));
		}
	};
}
//#endregion
//#region node_modules/ox/node_modules/@noble/curves/esm/secp256k1.js
/**
* NIST secp256k1. See [pdf](https://www.secg.org/sec2-v2.pdf).
*
* Seems to be rigid (not backdoored)
* [as per discussion](https://bitcointalk.org/index.php?topic=289795.msg3183975#msg3183975).
*
* secp256k1 belongs to Koblitz curves: it has efficiently computable endomorphism.
* Endomorphism uses 2x less RAM, speeds up precomputation by 2x and ECDH / key recovery by 20%.
* For precomputed wNAF it trades off 1/2 init time & 1/3 ram for 20% perf hit.
* [See explanation](https://gist.github.com/paulmillr/eb670806793e84df628a7c434a873066).
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var secp256k1P = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f");
var secp256k1N = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
var _0n = BigInt(0);
var _1n = BigInt(1);
var _2n = BigInt(2);
var divNearest = (a, b) => (a + b / _2n) / b;
/**
* √n = n^((p+1)/4) for fields p = 3 mod 4. We unwrap the loop and multiply bit-by-bit.
* (P+1n/4n).toString(2) would produce bits [223x 1, 0, 22x 1, 4x 0, 11, 00]
*/
function sqrtMod(y) {
	const P = secp256k1P;
	const _3n = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
	const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
	const b2 = y * y * y % P;
	const b3 = b2 * b2 * y % P;
	const b11 = pow2(pow2(pow2(b3, _3n, P) * b3 % P, _3n, P) * b3 % P, _2n, P) * b2 % P;
	const b22 = pow2(b11, _11n, P) * b11 % P;
	const b44 = pow2(b22, _22n, P) * b22 % P;
	const b88 = pow2(b44, _44n, P) * b44 % P;
	const root = pow2(pow2(pow2(pow2(pow2(pow2(b88, _88n, P) * b88 % P, _44n, P) * b44 % P, _3n, P) * b3 % P, _23n, P) * b22 % P, _6n, P) * b2 % P, _2n, P);
	if (!Fpk1.eql(Fpk1.sqr(root), y)) throw new Error("Cannot find square root");
	return root;
}
var Fpk1 = Field(secp256k1P, void 0, void 0, { sqrt: sqrtMod });
/**
* secp256k1 curve, ECDSA and ECDH methods.
*
* Field: `2n**256n - 2n**32n - 2n**9n - 2n**8n - 2n**7n - 2n**6n - 2n**4n - 1n`
*
* @example
* ```js
* import { secp256k1 } from '@noble/curves/secp256k1';
* const priv = secp256k1.utils.randomPrivateKey();
* const pub = secp256k1.getPublicKey(priv);
* const msg = new Uint8Array(32).fill(1); // message hash (not message) in ecdsa
* const sig = secp256k1.sign(msg, priv); // `{prehash: true}` option is available
* const isValid = secp256k1.verify(sig, msg, pub) === true;
* ```
*/
var secp256k1 = createCurve({
	a: _0n,
	b: BigInt(7),
	Fp: Fpk1,
	n: secp256k1N,
	Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
	Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
	h: BigInt(1),
	lowS: true,
	endo: {
		beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
		splitScalar: (k) => {
			const n = secp256k1N;
			const a1 = BigInt("0x3086d221a7d46bcde86c90e49284eb15");
			const b1 = -_1n * BigInt("0xe4437ed6010e88286f547fa90abfe4c3");
			const a2 = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8");
			const b2 = a1;
			const POW_2_128 = BigInt("0x100000000000000000000000000000000");
			const c1 = divNearest(b2 * k, n);
			const c2 = divNearest(-b1 * k, n);
			let k1 = mod(k - c1 * a1 - c2 * a2, n);
			let k2 = mod(-c1 * b1 - c2 * b2, n);
			const k1neg = k1 > POW_2_128;
			const k2neg = k2 > POW_2_128;
			if (k1neg) k1 = n - k1;
			if (k2neg) k2 = n - k2;
			if (k1 > POW_2_128 || k2 > POW_2_128) throw new Error("splitScalar: Endomorphism failed, k=" + k);
			return {
				k1neg,
				k1,
				k2neg,
				k2
			};
		}
	}
}, sha256$2);
secp256k1.ProjectivePoint;
secp256k1.utils.randomPrivateKey;
var isoMap = isogenyMap(Fpk1, [
	[
		"0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa8c7",
		"0x7d3d4c80bc321d5b9f315cea7fd44c5d595d2fc0bf63b92dfff1044f17c6581",
		"0x534c328d23f234e6e2a413deca25caece4506144037c40314ecbd0b53d9dd262",
		"0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa88c"
	],
	[
		"0xd35771193d94918a9ca34ccbb7b640dd86cd409542f8487d9fe6b745781eb49b",
		"0xedadc6f64383dc1df7c4b2d51b54225406d36b641f5e41bbc52a56612a8c6d14",
		"0x0000000000000000000000000000000000000000000000000000000000000001"
	],
	[
		"0x4bda12f684bda12f684bda12f684bda12f684bda12f684bda12f684b8e38e23c",
		"0xc75e0c32d5cb7c0fa9d0a54b12a0a6d5647ab046d686da6fdffc90fc201d71a3",
		"0x29a6194691f91a73715209ef6512e576722830a201be2018a765e85a9ecee931",
		"0x2f684bda12f684bda12f684bda12f684bda12f684bda12f684bda12f38e38d84"
	],
	[
		"0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffff93b",
		"0x7a06534bb8bdb49fd5e9e6632722c2989467c1bfc8e8d978dfb425d2685c2573",
		"0x6484aa716545ca2cf3a70c3fa8fe337e0a3d21162f0d6299a7bf8192bfd2a76f",
		"0x0000000000000000000000000000000000000000000000000000000000000001"
	]
].map((i) => i.map((j) => BigInt(j))));
var mapSWU = mapToCurveSimpleSWU(Fpk1, {
	A: BigInt("0x3f8731abdd661adca08a5558f0f5d272e953d363cb6f0e5d405447c01a444533"),
	B: BigInt("1771"),
	Z: Fpk1.create(BigInt("-11"))
});
/** Hashing / encoding to secp256k1 points / field. RFC 9380 methods. */
var secp256k1_hasher = createHasher(secp256k1.ProjectivePoint, (scalars) => {
	const { x, y } = mapSWU(Fpk1.create(scalars[0]));
	return isoMap(x, y);
}, {
	DST: "secp256k1_XMD:SHA-256_SSWU_RO_",
	encodeDST: "secp256k1_XMD:SHA-256_SSWU_NU_",
	p: Fpk1.ORDER,
	m: 1,
	k: 128,
	expand: "xmd",
	hash: sha256$2
});
secp256k1_hasher.hashToCurve;
secp256k1_hasher.encodeToCurve;
//#endregion
//#region node_modules/ox/_esm/core/Signature.js
/**
* Asserts that a Signature is valid.
*
* @example
* ```ts twoslash
* import { Signature } from 'ox'
*
* Signature.assert({
*   r: -49782753348462494199823712700004552394425719014458918871452329774910450607807n,
*   s: 33726695977844476214676913201140481102225469284307016937915595756355928419768n,
*   yParity: 1,
* })
* // @error: InvalidSignatureRError:
* // @error: Value `-549...n` is an invalid r value.
* // @error: r must be a positive integer less than 2^256.
* ```
*
* @param signature - The signature object to assert.
*/
function assert$2(signature, options = {}) {
	const { recovered } = options;
	if (typeof signature.r === "undefined") throw new MissingPropertiesError({ signature });
	if (typeof signature.s === "undefined") throw new MissingPropertiesError({ signature });
	if (recovered && typeof signature.yParity === "undefined") throw new MissingPropertiesError({ signature });
	if (signature.r < 0n || signature.r > maxUint256) throw new InvalidRError({ value: signature.r });
	if (signature.s < 0n || signature.s > maxUint256) throw new InvalidSError({ value: signature.s });
	if (typeof signature.yParity === "number" && signature.yParity !== 0 && signature.yParity !== 1) throw new InvalidYParityError({ value: signature.yParity });
}
/**
* Deserializes a {@link ox#Bytes.Bytes} signature into a structured {@link ox#Signature.Signature}.
*
* @example
* ```ts twoslash
* // @noErrors
* import { Signature } from 'ox'
*
* Signature.fromBytes(new Uint8Array([128, 3, 131, ...]))
* // @log: { r: 5231...n, s: 3522...n, yParity: 0 }
* ```
*
* @param signature - The serialized signature.
* @returns The deserialized {@link ox#Signature.Signature}.
*/
function fromBytes(signature) {
	return fromHex(fromBytes$2(signature));
}
/**
* Deserializes a {@link ox#Hex.Hex} signature into a structured {@link ox#Signature.Signature}.
*
* @example
* ```ts twoslash
* import { Signature } from 'ox'
*
* Signature.fromHex('0x6e100a352ec6ad1b70802290e18aeed190704973570f3b8ed42cb9808e2ea6bf4a90a229a244495b41890987806fcbd2d5d23fc0dbe5f5256c2613c039d76db81c')
* // @log: { r: 5231...n, s: 3522...n, yParity: 0 }
* ```
*
* @param serialized - The serialized signature.
* @returns The deserialized {@link ox#Signature.Signature}.
*/
function fromHex(signature) {
	if (signature.length !== 130 && signature.length !== 132) throw new InvalidSerializedSizeError({ signature });
	const r = BigInt(slice(signature, 0, 32));
	const s = BigInt(slice(signature, 32, 64));
	const yParity = (() => {
		const yParity = Number(`0x${signature.slice(130)}`);
		if (Number.isNaN(yParity)) return void 0;
		try {
			return vToYParity(yParity);
		} catch {
			throw new InvalidYParityError({ value: yParity });
		}
	})();
	if (typeof yParity === "undefined") return {
		r,
		s
	};
	return {
		r,
		s,
		yParity
	};
}
/**
* Extracts a {@link ox#Signature.Signature} from an arbitrary object that may include signature properties.
*
* @example
* ```ts twoslash
* // @noErrors
* import { Signature } from 'ox'
*
* Signature.extract({
*   baz: 'barry',
*   foo: 'bar',
*   r: 49782753348462494199823712700004552394425719014458918871452329774910450607807n,
*   s: 33726695977844476214676913201140481102225469284307016937915595756355928419768n,
*   yParity: 1,
*   zebra: 'stripes',
* })
* // @log: {
* // @log:   r: 49782753348462494199823712700004552394425719014458918871452329774910450607807n,
* // @log:   s: 33726695977844476214676913201140481102225469284307016937915595756355928419768n,
* // @log:   yParity: 1
* // @log: }
* ```
*
* @param value - The arbitrary object to extract the signature from.
* @returns The extracted {@link ox#Signature.Signature}.
*/
function extract(value) {
	if (typeof value.r === "undefined") return void 0;
	if (typeof value.s === "undefined") return void 0;
	return from$1(value);
}
/**
* Instantiates a typed {@link ox#Signature.Signature} object from a {@link ox#Signature.Signature}, {@link ox#Signature.Legacy}, {@link ox#Bytes.Bytes}, or {@link ox#Hex.Hex}.
*
* @example
* ```ts twoslash
* import { Signature } from 'ox'
*
* Signature.from({
*   r: 49782753348462494199823712700004552394425719014458918871452329774910450607807n,
*   s: 33726695977844476214676913201140481102225469284307016937915595756355928419768n,
*   yParity: 1,
* })
* // @log: {
* // @log:   r: 49782753348462494199823712700004552394425719014458918871452329774910450607807n,
* // @log:   s: 33726695977844476214676913201140481102225469284307016937915595756355928419768n,
* // @log:   yParity: 1
* // @log: }
* ```
*
* @example
* ### From Serialized
*
* ```ts twoslash
* import { Signature } from 'ox'
*
* Signature.from('0x6e100a352ec6ad1b70802290e18aeed190704973570f3b8ed42cb9808e2ea6bf4a90a229a244495b41890987806fcbd2d5d23fc0dbe5f5256c2613c039d76db801')
* // @log: {
* // @log:   r: 49782753348462494199823712700004552394425719014458918871452329774910450607807n,
* // @log:   s: 33726695977844476214676913201140481102225469284307016937915595756355928419768n,
* // @log:   yParity: 1,
* // @log: }
* ```
*
* @example
* ### From Legacy
*
* ```ts twoslash
* import { Signature } from 'ox'
*
* Signature.from({
*   r: 47323457007453657207889730243826965761922296599680473886588287015755652701072n,
*   s: 57228803202727131502949358313456071280488184270258293674242124340113824882788n,
*   v: 27,
* })
* // @log: {
* // @log:   r: 47323457007453657207889730243826965761922296599680473886588287015755652701072n,
* // @log:   s: 57228803202727131502949358313456071280488184270258293674242124340113824882788n,
* // @log:   yParity: 0
* // @log: }
* ```
*
* @param signature - The signature value to instantiate.
* @returns The instantiated {@link ox#Signature.Signature}.
*/
function from$1(signature) {
	const signature_ = (() => {
		if (typeof signature === "string") return fromHex(signature);
		if (signature instanceof Uint8Array) return fromBytes(signature);
		if (typeof signature.r === "string") return fromRpc$1(signature);
		if (signature.v) return fromLegacy(signature);
		return {
			r: signature.r,
			s: signature.s,
			...typeof signature.yParity !== "undefined" ? { yParity: signature.yParity } : {}
		};
	})();
	assert$2(signature_);
	return signature_;
}
/**
* Converts a {@link ox#Signature.Legacy} into a {@link ox#Signature.Signature}.
*
* @example
* ```ts twoslash
* import { Signature } from 'ox'
*
* const legacy = Signature.fromLegacy({ r: 1n, s: 2n, v: 28 })
* // @log: { r: 1n, s: 2n, yParity: 1 }
* ```
*
* @param signature - The {@link ox#Signature.Legacy} to convert.
* @returns The converted {@link ox#Signature.Signature}.
*/
function fromLegacy(signature) {
	return {
		r: signature.r,
		s: signature.s,
		yParity: vToYParity(signature.v)
	};
}
/**
* Converts a {@link ox#Signature.Rpc} into a {@link ox#Signature.Signature}.
*
* @example
* ```ts twoslash
* import { Signature } from 'ox'
*
* const signature = Signature.fromRpc({
*   r: '0x635dc2033e60185bb36709c29c75d64ea51dfbd91c32ef4be198e4ceb169fb4d',
*   s: '0x50c2667ac4c771072746acfdcf1f1483336dcca8bd2df47cd83175dbe60f0540',
*   yParity: '0x0',
* })
* ```
*
* @param signature - The {@link ox#Signature.Rpc} to convert.
* @returns The converted {@link ox#Signature.Signature}.
*/
function fromRpc$1(signature) {
	const yParity = (() => {
		const v = signature.v ? Number(signature.v) : void 0;
		let yParity = signature.yParity ? Number(signature.yParity) : void 0;
		if (typeof v === "number" && typeof yParity !== "number") yParity = vToYParity(v);
		if (typeof yParity !== "number") throw new InvalidYParityError({ value: signature.yParity });
		return yParity;
	})();
	return {
		r: BigInt(signature.r),
		s: BigInt(signature.s),
		yParity
	};
}
/**
* Converts a {@link ox#Signature.Tuple} to a {@link ox#Signature.Signature}.
*
* @example
* ```ts twoslash
* import { Signature } from 'ox'
*
* const signature = Signature.fromTuple(['0x01', '0x7b', '0x1c8'])
* // @log: {
* // @log:   r: 123n,
* // @log:   s: 456n,
* // @log:   yParity: 1,
* // @log: }
* ```
*
* @param tuple - The {@link ox#Signature.Tuple} to convert.
* @returns The {@link ox#Signature.Signature}.
*/
function fromTuple(tuple) {
	const [yParity, r, s] = tuple;
	return from$1({
		r: r === "0x" ? 0n : BigInt(r),
		s: s === "0x" ? 0n : BigInt(s),
		yParity: yParity === "0x" ? 0 : Number(yParity)
	});
}
/**
* Serializes a {@link ox#Signature.Signature} to {@link ox#Hex.Hex}.
*
* @example
* ```ts twoslash
* import { Signature } from 'ox'
*
* const signature = Signature.toHex({
*   r: 49782753348462494199823712700004552394425719014458918871452329774910450607807n,
*   s: 33726695977844476214676913201140481102225469284307016937915595756355928419768n,
*   yParity: 1
* })
* // @log: '0x6e100a352ec6ad1b70802290e18aeed190704973570f3b8ed42cb9808e2ea6bf4a90a229a244495b41890987806fcbd2d5d23fc0dbe5f5256c2613c039d76db81c'
* ```
*
* @param signature - The signature to serialize.
* @returns The serialized signature.
*/
function toHex(signature) {
	assert$2(signature);
	const r = signature.r;
	const s = signature.s;
	return concat(fromNumber(r, { size: 32 }), fromNumber(s, { size: 32 }), typeof signature.yParity === "number" ? fromNumber(yParityToV(signature.yParity), { size: 1 }) : "0x");
}
/**
* Converts a {@link ox#Signature.Signature} into a {@link ox#Signature.Rpc}.
*
* @example
* ```ts twoslash
* import { Signature } from 'ox'
*
* const signature = Signature.toRpc({
*   r: 49782753348462494199823712700004552394425719014458918871452329774910450607807n,
*   s: 33726695977844476214676913201140481102225469284307016937915595756355928419768n,
*   yParity: 1
* })
* ```
*
* @param signature - The {@link ox#Signature.Signature} to convert.
* @returns The converted {@link ox#Signature.Rpc}.
*/
function toRpc$1(signature) {
	const { r, s, yParity } = signature;
	return {
		r: fromNumber(r, { size: 32 }),
		s: fromNumber(s, { size: 32 }),
		yParity: yParity === 0 ? "0x0" : "0x1"
	};
}
/**
* Converts a {@link ox#Signature.Signature} to a serialized {@link ox#Signature.Tuple} to be used for signatures in Transaction Envelopes, EIP-7702 Authorization Lists, etc.
*
* @example
* ```ts twoslash
* import { Signature } from 'ox'
*
* const signatureTuple = Signature.toTuple({
*   r: 123n,
*   s: 456n,
*   yParity: 1,
* })
* // @log: [yParity: '0x01', r: '0x7b', s: '0x1c8']
* ```
*
* @param signature - The {@link ox#Signature.Signature} to convert.
* @returns The {@link ox#Signature.Tuple}.
*/
function toTuple(signature) {
	const { r, s, yParity } = signature;
	return [
		yParity ? "0x01" : "0x",
		r === 0n ? "0x" : trimLeft$1(fromNumber(r)),
		s === 0n ? "0x" : trimLeft$1(fromNumber(s))
	];
}
/**
* Converts a ECDSA `v` value to a `yParity` value.
*
* @example
* ```ts twoslash
* import { Signature } from 'ox'
*
* const yParity = Signature.vToYParity(28)
* // @log: 1
* ```
*
* @param v - The ECDSA `v` value to convert.
* @returns The `yParity` value.
*/
function vToYParity(v) {
	if (v === 0 || v === 27) return 0;
	if (v === 1 || v === 28) return 1;
	if (v >= 35) return v % 2 === 0 ? 1 : 0;
	throw new InvalidVError({ value: v });
}
/**
* Converts a ECDSA `v` value to a `yParity` value.
*
* @example
* ```ts twoslash
* import { Signature } from 'ox'
*
* const v = Signature.yParityToV(1)
* // @log: 28
* ```
*
* @param yParity - The ECDSA `yParity` value to convert.
* @returns The `v` value.
*/
function yParityToV(yParity) {
	if (yParity === 0) return 27;
	if (yParity === 1) return 28;
	throw new InvalidYParityError({ value: yParity });
}
/** Thrown when the serialized signature is of an invalid size. */
var InvalidSerializedSizeError = class extends BaseError {
	constructor({ signature }) {
		super(`Value \`${signature}\` is an invalid signature size.`, { metaMessages: ["Expected: 64 bytes or 65 bytes.", `Received ${size(from$7(signature))} bytes.`] });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Signature.InvalidSerializedSizeError"
		});
	}
};
/** Thrown when the signature is missing either an `r`, `s`, or `yParity` property. */
var MissingPropertiesError = class extends BaseError {
	constructor({ signature }) {
		super(`Signature \`${stringify(signature)}\` is missing either an \`r\`, \`s\`, or \`yParity\` property.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Signature.MissingPropertiesError"
		});
	}
};
/** Thrown when the signature has an invalid `r` value. */
var InvalidRError = class extends BaseError {
	constructor({ value }) {
		super(`Value \`${value}\` is an invalid r value. r must be a positive integer less than 2^256.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Signature.InvalidRError"
		});
	}
};
/** Thrown when the signature has an invalid `s` value. */
var InvalidSError = class extends BaseError {
	constructor({ value }) {
		super(`Value \`${value}\` is an invalid s value. s must be a positive integer less than 2^256.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Signature.InvalidSError"
		});
	}
};
/** Thrown when the signature has an invalid `yParity` value. */
var InvalidYParityError = class extends BaseError {
	constructor({ value }) {
		super(`Value \`${value}\` is an invalid y-parity value. Y-parity must be 0 or 1.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Signature.InvalidYParityError"
		});
	}
};
/** Thrown when the signature has an invalid `v` value. */
var InvalidVError = class extends BaseError {
	constructor({ value }) {
		super(`Value \`${value}\` is an invalid v value. v must be 27, 28 or >=35.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Signature.InvalidVError"
		});
	}
};
//#endregion
//#region node_modules/ox/_esm/core/Authorization.js
/**
* Converts an [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) Authorization object into a typed {@link ox#Authorization.Authorization}.
*
* @example
* An Authorization can be instantiated from an [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) Authorization tuple in object format.
*
* ```ts twoslash
* import { Authorization } from 'ox'
*
* const authorization = Authorization.from({
*   address: '0x1234567890abcdef1234567890abcdef12345678',
*   chainId: 1,
*   nonce: 69n,
* })
* ```
*
* @example
* ### Attaching Signatures
*
* A {@link ox#Signature.Signature} can be attached with the `signature` option. The example below demonstrates signing
* an Authorization with {@link ox#Secp256k1.(sign:function)}.
*
* ```ts twoslash
* import { Authorization, Secp256k1 } from 'ox'
*
* const authorization = Authorization.from({
*   address: '0xbe95c3f554e9fc85ec51be69a3d807a0d55bcf2c',
*   chainId: 1,
*   nonce: 40n,
* })
*
* const signature = Secp256k1.sign({
*   payload: Authorization.getSignPayload(authorization),
*   privateKey: '0x...',
* })
*
* const authorization_signed = Authorization.from(authorization, { signature }) // [!code focus]
* ```
*
* @param authorization - An [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) Authorization tuple in object format.
* @param options - Authorization options.
* @returns The {@link ox#Authorization.Authorization}.
*/
function from(authorization, options = {}) {
	if (typeof authorization.chainId === "string") return fromRpc(authorization);
	return {
		...authorization,
		...options.signature
	};
}
/**
* Converts an {@link ox#Authorization.Rpc} to an {@link ox#Authorization.Authorization}.
*
* @example
* ```ts twoslash
* import { Authorization } from 'ox'
*
* const authorization = Authorization.fromRpc({
*   address: '0x0000000000000000000000000000000000000000',
*   chainId: '0x1',
*   nonce: '0x1',
*   r: '0x635dc2033e60185bb36709c29c75d64ea51dfbd91c32ef4be198e4ceb169fb4d',
*   s: '0x50c2667ac4c771072746acfdcf1f1483336dcca8bd2df47cd83175dbe60f0540',
*   yParity: '0x0',
* })
* ```
*
* @param authorization - The RPC-formatted Authorization.
* @returns A signed {@link ox#Authorization.Authorization}.
*/
function fromRpc(authorization) {
	const { address, chainId, nonce } = authorization;
	const signature = extract(authorization);
	return {
		address,
		chainId: Number(chainId),
		nonce: BigInt(nonce),
		...signature
	};
}
/**
* Converts an {@link ox#Authorization.ListRpc} to an {@link ox#Authorization.List}.
*
* @example
* ```ts twoslash
* import { Authorization } from 'ox'
*
* const authorizationList = Authorization.fromRpcList([{
*   address: '0x0000000000000000000000000000000000000000',
*   chainId: '0x1',
*   nonce: '0x1',
*   r: '0x635dc2033e60185bb36709c29c75d64ea51dfbd91c32ef4be198e4ceb169fb4d',
*   s: '0x50c2667ac4c771072746acfdcf1f1483336dcca8bd2df47cd83175dbe60f0540',
*   yParity: '0x0',
* }])
* ```
*
* @param authorizationList - The RPC-formatted Authorization list.
* @returns A signed {@link ox#Authorization.List}.
*/
function fromRpcList(authorizationList) {
	return authorizationList.map(fromRpc);
}
/**
* Converts an {@link ox#Authorization.Authorization} to an {@link ox#Authorization.Rpc}.
*
* @example
* ```ts twoslash
* import { Authorization } from 'ox'
*
* const authorization = Authorization.toRpc({
*   address: '0x0000000000000000000000000000000000000000',
*   chainId: 1,
*   nonce: 1n,
*   r: 44944627813007772897391531230081695102703289123332187696115181104739239197517n,
*   s: 36528503505192438307355164441104001310566505351980369085208178712678799181120n,
*   yParity: 0,
* })
* ```
*
* @param authorization - An Authorization.
* @returns An RPC-formatted Authorization.
*/
function toRpc(authorization) {
	const { address, chainId, nonce, ...signature } = authorization;
	return {
		address,
		chainId: fromNumber(chainId),
		nonce: fromNumber(nonce),
		...toRpc$1(signature)
	};
}
/**
* Converts an {@link ox#Authorization.List} to an {@link ox#Authorization.ListRpc}.
*
* @example
* ```ts twoslash
* import { Authorization } from 'ox'
*
* const authorization = Authorization.toRpcList([{
*   address: '0x0000000000000000000000000000000000000000',
*   chainId: 1,
*   nonce: 1n,
*   r: 44944627813007772897391531230081695102703289123332187696115181104739239197517n,
*   s: 36528503505192438307355164441104001310566505351980369085208178712678799181120n,
*   yParity: 0,
* }])
* ```
*
* @param authorizationList - An Authorization List.
* @returns An RPC-formatted Authorization List.
*/
function toRpcList(authorizationList) {
	return authorizationList.map(toRpc);
}
//#endregion
//#region node_modules/ox/_esm/core/Secp256k1.js
/**
* Recovers the signing address from the signed payload and signature.
*
* @example
* ```ts twoslash
* import { Secp256k1 } from 'ox'
*
* const signature = Secp256k1.sign({ payload: '0xdeadbeef', privateKey: '0x...' })
*
* const address = Secp256k1.recoverAddress({ // [!code focus]
*   payload: '0xdeadbeef', // [!code focus]
*   signature, // [!code focus]
* }) // [!code focus]
* ```
*
* @param options - The recovery options.
* @returns The recovered address.
*/
function recoverAddress(options) {
	return fromPublicKey(recoverPublicKey(options));
}
/**
* Recovers the signing public key from the signed payload and signature.
*
* @example
* ```ts twoslash
* import { Secp256k1 } from 'ox'
*
* const signature = Secp256k1.sign({ payload: '0xdeadbeef', privateKey: '0x...' })
*
* const publicKey = Secp256k1.recoverPublicKey({ // [!code focus]
*   payload: '0xdeadbeef', // [!code focus]
*   signature, // [!code focus]
* }) // [!code focus]
* ```
*
* @param options - The recovery options.
* @returns The recovered public key.
*/
function recoverPublicKey(options) {
	const { payload, signature } = options;
	const { r, s, yParity } = signature;
	return from$5(new secp256k1.Signature(BigInt(r), BigInt(s)).addRecoveryBit(yParity).recoverPublicKey(from$7(payload).substring(2)));
}
/**
* Verifies a payload was signed by the provided address.
*
* @example
* ### Verify with Ethereum Address
*
* ```ts twoslash
* import { Secp256k1 } from 'ox'
*
* const signature = Secp256k1.sign({ payload: '0xdeadbeef', privateKey: '0x...' })
*
* const verified = Secp256k1.verify({ // [!code focus]
*   address: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', // [!code focus]
*   payload: '0xdeadbeef', // [!code focus]
*   signature, // [!code focus]
* }) // [!code focus]
* ```
*
* @example
* ### Verify with Public Key
*
* ```ts twoslash
* import { Secp256k1 } from 'ox'
*
* const privateKey = '0x...'
* const publicKey = Secp256k1.getPublicKey({ privateKey })
* const signature = Secp256k1.sign({ payload: '0xdeadbeef', privateKey })
*
* const verified = Secp256k1.verify({ // [!code focus]
*   publicKey, // [!code focus]
*   payload: '0xdeadbeef', // [!code focus]
*   signature, // [!code focus]
* }) // [!code focus]
* ```
*
* @param options - The verification options.
* @returns Whether the payload was signed by the provided address.
*/
function verify(options) {
	const { address, hash, payload, publicKey, signature } = options;
	if (address) return isEqual(address, recoverAddress({
		payload,
		signature
	}));
	return secp256k1.verify(signature, from$6(payload), toBytes(publicKey), ...hash ? [{
		prehash: true,
		lowS: true
	}] : []);
}
/** Suffix ABI parameters for the ERC-8010 wrapped signature. */
var suffixParameters = from$3("(uint256 chainId, address delegation, uint256 nonce, uint8 yParity, uint256 r, uint256 s), address to, bytes data");
/**
* Asserts that the wrapped signature is valid.
*
* @example
* ```ts twoslash
* import { SignatureErc8010 } from 'ox/erc8010'
*
* SignatureErc8010.assert('0xdeadbeef')
* // @error: InvalidWrappedSignatureError: Value `0xdeadbeef` is an invalid ERC-8010 wrapped signature.
* ```
*
* @param value - The value to assert.
*/
function assert$1(value) {
	if (typeof value === "string") {
		if (slice(value, -32) !== "0x8010801080108010801080108010801080108010801080108010801080108010") throw new InvalidWrappedSignatureError$1(value);
	} else assert$2(value.authorization);
}
/**
* Unwraps an [ERC-8010 wrapped signature](https://github.com/jxom/ERCs/blob/16f7e3891fff2e1e9c25dea0485497739db8a816/ERCS/erc-8010.md) into its constituent parts.
*
* @example
* ```ts twoslash
* import { SignatureErc8010 } from 'ox/erc8010'
*
* const { authorization, data, signature } = SignatureErc8010.unwrap('0x...')
* ```
*
* @param wrapped - Wrapped signature to unwrap.
* @returns Unwrapped signature.
*/
function unwrap(wrapped) {
	assert$1(wrapped);
	const suffixLength = toNumber$1(slice(wrapped, -64, -32));
	const suffix = slice(wrapped, -suffixLength - 64, -64);
	const signature = slice(wrapped, 0, -suffixLength - 64);
	const [auth, to, data] = decode(suffixParameters, suffix);
	return {
		authorization: from({
			address: auth.delegation,
			chainId: Number(auth.chainId),
			nonce: auth.nonce,
			yParity: auth.yParity,
			r: auth.r,
			s: auth.s
		}),
		signature,
		...data && data !== "0x" ? {
			data,
			to
		} : {}
	};
}
/**
* Validates a wrapped signature. Returns `true` if the wrapped signature is valid, `false` otherwise.
*
* @example
* ```ts twoslash
* import { SignatureErc8010 } from 'ox/erc8010'
*
* const valid = SignatureErc8010.validate('0xdeadbeef')
* // @log: false
* ```
*
* @param value - The value to validate.
* @returns `true` if the value is valid, `false` otherwise.
*/
function validate$1(value) {
	try {
		assert$1(value);
		return true;
	} catch {
		return false;
	}
}
/** Thrown when the ERC-8010 wrapped signature is invalid. */
var InvalidWrappedSignatureError$1 = class extends BaseError {
	constructor(wrapped) {
		super(`Value \`${wrapped}\` is an invalid ERC-8010 wrapped signature.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "SignatureErc8010.InvalidWrappedSignatureError"
		});
	}
};
//#endregion
//#region node_modules/ox/_esm/erc6492/SignatureErc6492.js
/**
* Magic bytes used to identify ERC-6492 wrapped signatures.
*/
var magicBytes = "0x6492649264926492649264926492649264926492649264926492649264926492";
/**
* Asserts that the wrapped signature is valid.
*
* @example
* ```ts twoslash
* import { SignatureErc6492 } from 'ox/erc6492'
*
* SignatureErc6492.assert('0xdeadbeef')
* // @error: InvalidWrappedSignatureError: Value `0xdeadbeef` is an invalid ERC-6492 wrapped signature.
* ```
*
* @param wrapped - The wrapped signature to assert.
*/
function assert(wrapped) {
	if (slice(wrapped, -32) !== "0x6492649264926492649264926492649264926492649264926492649264926492") throw new InvalidWrappedSignatureError(wrapped);
}
/**
* Serializes an [ERC-6492 wrapped signature](https://eips.ethereum.org/EIPS/eip-6492#specification).
*
* @example
* ```ts twoslash
* import { Secp256k1, Signature } from 'ox'
* import { SignatureErc6492 } from 'ox/erc6492' // [!code focus]
*
* const signature = Secp256k1.sign({
*   payload: '0x...',
*   privateKey: '0x...',
* })
*
* const wrapped = SignatureErc6492.wrap({ // [!code focus]
*   data: '0xdeadbeef', // [!code focus]
*   signature: Signature.toHex(signature), // [!code focus]
*   to: '0x00000000219ab540356cBB839Cbe05303d7705Fa', // [!code focus]
* }) // [!code focus]
* ```
*
* @param value - Wrapped signature to serialize.
* @returns Serialized wrapped signature.
*/
function wrap(value) {
	const { data, signature, to } = value;
	return concat(encode(from$3("address, bytes, bytes"), [
		to,
		data,
		signature
	]), magicBytes);
}
/**
* Validates a wrapped signature. Returns `true` if the wrapped signature is valid, `false` otherwise.
*
* @example
* ```ts twoslash
* import { SignatureErc6492 } from 'ox/erc6492'
*
* const valid = SignatureErc6492.validate('0xdeadbeef')
* // @log: false
* ```
*
* @param wrapped - The wrapped signature to validate.
* @returns `true` if the wrapped signature is valid, `false` otherwise.
*/
function validate(wrapped) {
	try {
		assert(wrapped);
		return true;
	} catch {
		return false;
	}
}
/** Thrown when the ERC-6492 wrapped signature is invalid. */
var InvalidWrappedSignatureError = class extends BaseError {
	constructor(wrapped) {
		super(`Value \`${wrapped}\` is an invalid ERC-6492 wrapped signature.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "SignatureErc6492.InvalidWrappedSignatureError"
		});
	}
};
//#endregion
//#region node_modules/viem/_esm/utils/signature/serializeSignature.js
/**
* @description Converts a signature into hex format.
*
* @param signature The signature to convert.
* @returns The signature in hex format.
*
* @example
* serializeSignature({
*   r: '0x6e100a352ec6ad1b70802290e18aeed190704973570f3b8ed42cb9808e2ea6bf',
*   s: '0x4a90a229a244495b41890987806fcbd2d5d23fc0dbe5f5256c2613c039d76db8',
*   yParity: 1
* })
* // "0x6e100a352ec6ad1b70802290e18aeed190704973570f3b8ed42cb9808e2ea6bf4a90a229a244495b41890987806fcbd2d5d23fc0dbe5f5256c2613c039d76db81c"
*/
function serializeSignature({ r, s, to = "hex", v, yParity }) {
	const yParity_ = (() => {
		if (yParity === 0 || yParity === 1) return yParity;
		if (v && (v === 27n || v === 28n || v >= 35n)) return v % 2n === 0n ? 1 : 0;
		throw new Error("Invalid `v` or `yParity` value");
	})();
	const signature = `0x${new secp256k1$1.Signature(hexToBigInt(r), hexToBigInt(s)).toCompactHex()}${yParity_ === 0 ? "1b" : "1c"}`;
	if (to === "hex") return signature;
	return hexToBytes$1(signature);
}
//#endregion
//#region node_modules/viem/_esm/actions/public/verifyHash.js
/**
* Verifies a message hash onchain using ERC-6492.
*
* @param client - Client to use.
* @param parameters - {@link VerifyHashParameters}
* @returns Whether or not the signature is valid. {@link VerifyHashReturnType}
*/
async function verifyHash(client, parameters) {
	const { address, chain = client.chain, hash, erc6492VerifierAddress: verifierAddress = parameters.universalSignatureVerifierAddress ?? chain?.contracts?.erc6492Verifier?.address, multicallAddress = parameters.multicallAddress ?? chain?.contracts?.multicall3?.address } = parameters;
	if (chain?.verifyHash) return await chain.verifyHash(client, parameters);
	const signature = (() => {
		const signature = parameters.signature;
		if (isHex(signature)) return signature;
		if (typeof signature === "object" && "r" in signature && "s" in signature) return serializeSignature(signature);
		return bytesToHex$1(signature);
	})();
	try {
		if (validate$1(signature)) return await verifyErc8010(client, {
			...parameters,
			multicallAddress,
			signature
		});
		return await verifyErc6492(client, {
			...parameters,
			verifierAddress,
			signature
		});
	} catch (error) {
		try {
			if (isAddressEqual(getAddress(address), await recoverAddress$1({
				hash,
				signature
			}))) return true;
		} catch {}
		if (error instanceof VerificationError) return false;
		throw error;
	}
}
/** @internal */
async function verifyErc8010(client, parameters) {
	const { address, blockNumber, blockTag, hash, multicallAddress } = parameters;
	const { authorization: authorization_ox, data: initData, signature, to } = unwrap(parameters.signature);
	if (await getCode(client, {
		address,
		blockNumber,
		blockTag
	}) === concatHex(["0xef0100", authorization_ox.address])) return await verifyErc1271(client, {
		address,
		blockNumber,
		blockTag,
		hash,
		signature
	});
	const authorization = {
		address: authorization_ox.address,
		chainId: Number(authorization_ox.chainId),
		nonce: Number(authorization_ox.nonce),
		r: numberToHex(authorization_ox.r, { size: 32 }),
		s: numberToHex(authorization_ox.s, { size: 32 }),
		yParity: authorization_ox.yParity
	};
	if (!await verifyAuthorization({
		address,
		authorization
	})) throw new VerificationError();
	const results = await getAction(client, readContract, "readContract")({
		...multicallAddress ? { address: multicallAddress } : { code: multicall3Bytecode },
		authorizationList: [authorization],
		abi: multicall3Abi,
		blockNumber,
		blockTag: "pending",
		functionName: "aggregate3",
		args: [[...initData ? [{
			allowFailure: true,
			target: to ?? address,
			callData: initData
		}] : [], {
			allowFailure: true,
			target: address,
			callData: encodeFunctionData({
				abi: erc1271Abi,
				functionName: "isValidSignature",
				args: [hash, signature]
			})
		}]]
	});
	if ((results[results.length - 1]?.returnData)?.startsWith("0x1626ba7e")) return true;
	throw new VerificationError();
}
/** @internal */
async function verifyErc6492(client, parameters) {
	const { address, factory, factoryData, hash, signature, verifierAddress, ...rest } = parameters;
	const wrappedSignature = await (async () => {
		if (!factory && !factoryData) return signature;
		if (validate(signature)) return signature;
		return wrap({
			data: factoryData,
			signature,
			to: factory
		});
	})();
	const args = verifierAddress ? {
		to: verifierAddress,
		data: encodeFunctionData({
			abi: erc6492SignatureValidatorAbi,
			functionName: "isValidSig",
			args: [
				address,
				hash,
				wrappedSignature
			]
		}),
		...rest
	} : {
		data: encodeDeployData({
			abi: erc6492SignatureValidatorAbi,
			args: [
				address,
				hash,
				wrappedSignature
			],
			bytecode: erc6492SignatureValidatorByteCode
		}),
		...rest
	};
	const { data } = await getAction(client, call, "call")(args).catch((error) => {
		if (error instanceof CallExecutionError) throw new VerificationError();
		throw error;
	});
	if (hexToBool(data ?? "0x0")) return true;
	throw new VerificationError();
}
/** @internal */
async function verifyErc1271(client, parameters) {
	const { address, blockNumber, blockTag, hash, signature } = parameters;
	if ((await getAction(client, readContract, "readContract")({
		address,
		abi: erc1271Abi,
		args: [hash, signature],
		blockNumber,
		blockTag,
		functionName: "isValidSignature"
	}).catch((error) => {
		if (error instanceof ContractFunctionExecutionError) throw new VerificationError();
		throw error;
	})).startsWith("0x1626ba7e")) return true;
	throw new VerificationError();
}
var VerificationError = class extends Error {};
//#endregion
//#region node_modules/viem/_esm/errors/account.js
var AccountNotFoundError = class extends BaseError$1 {
	constructor({ docsPath } = {}) {
		super(["Could not find an Account to execute with this Action.", "Please provide an Account with the `account` argument on the Action, or by supplying an `account` to the Client."].join("\n"), {
			docsPath,
			docsSlug: "account",
			name: "AccountNotFoundError"
		});
	}
};
var AccountTypeNotSupportedError = class extends BaseError$1 {
	constructor({ docsPath, metaMessages, type }) {
		super(`Account type "${type}" is not supported.`, {
			docsPath,
			metaMessages,
			name: "AccountTypeNotSupportedError"
		});
	}
};
//#endregion
export { blobsToCommitments as $, isEqual as A, defineTransactionReceipt as B, fromHex$1 as C, assert$3 as D, create as E, sha256 as F, getTransactionType as G, receiptStatuses as H, validate$3 as I, InvalidVersionedHashSizeError as J, toBlobSidecars as K, sha256$2 as L, toBytes as M, toHex$2 as N, checksum as O, keccak256 as P, blobsToProofs as Q, sha384 as R, Field as S, encode as T, formatLog as U, formatTransactionReceipt as V, getCode as W, commitmentsToVersionedHashes as X, InvalidVersionedHashVersionError as Y, sha256$3 as Z, toTuple as _, recoverPublicKey as a, toRlp as at, createCurve as b, toRpcList as c, getAction as ct, from$1 as d, defineBlock as et, fromHex as f, toRpc$1 as g, toHex as h, recoverAddress as i, recoverAuthorizationAddress as it, validate$2 as j, fromPublicKey as k, assert$2 as l, parseAbiParameters as lt, fromTuple as m, AccountTypeNotSupportedError as n, defineTransaction as nt, verify as o, readContract as ot, fromRpc$1 as p, EmptyBlobError as q, verifyHash as r, formatTransaction as rt, fromRpcList as s, getContractError as st, AccountNotFoundError as t, formatBlock as tt, extract as u, yParityToV as v, toHex$1 as w, mapToCurveSimpleSWU as x, createHasher as y, sha512 as z };

//# sourceMappingURL=account-r4vEt8f4.js.map