import { s as __toESM } from "./chunk-t8Qwt55I.js";
import { S as getAddress } from "./encodeFunctionData-YLQ8NBAq.js";
import { E as isHex, c as numberToHex, h as hexToNumber } from "./stringify-Bm23iD_D.js";
import { t as import_eventemitter3 } from "./eventemitter3-Big23LkK.js";
import { B as UserRejectedRequestError, M as SwitchChainError, j as ResourceUnavailableRpcError } from "./createBatchScheduler-D2ue-dEZ.js";
import { a as mainnet, d as arbitrum, i as optimism, l as base, n as polygon, r as optimismSepolia, s as baseSepolia, t as sepolia } from "./sepolia-8_St3NiF.js";
import { c as withRetry, s as withTimeout } from "./http-DRuaSs_V.js";
import { Ft as ChainNotConfiguredError, P as ProviderNotFoundError, g as createConnector, n as extractRpcUrls } from "./exports-CPhf7Cn4.js";
import { i as encode, r as wallet_connect } from "./dist-BhpSyzpF.js";
import { c as arbitrumSepolia } from "./katana-CvyhsLGQ.js";
import { t as polygonAmoy } from "./polygonAmoy-YRPSwb-H.js";
import { t as require_fast_safe_stringify } from "./fast-safe-stringify-KqX1Aowj.js";
//#region node_modules/@wagmi/connectors/dist/esm/baseAccount.js
function baseAccount(parameters = {}) {
	let walletProvider;
	let accountsChanged;
	let chainChanged;
	let disconnect;
	return createConnector((config) => ({
		id: "baseAccount",
		name: "Base Account",
		rdns: "app.base.account",
		type: "baseAccount",
		async connect({ chainId, withCapabilities, ...rest } = {}) {
			try {
				const provider = await this.getProvider();
				const targetChainId = chainId ?? config.chains[0]?.id;
				if (!targetChainId) throw new ChainNotConfiguredError();
				const response = await provider.request({
					method: "wallet_connect",
					params: [{
						capabilities: "capabilities" in rest && rest.capabilities ? rest.capabilities : {},
						chainIds: [numberToHex(targetChainId), ...config.chains.filter((x) => x.id !== targetChainId).map((x) => numberToHex(x.id))]
					}]
				});
				const accounts = response.accounts.map((account) => ({
					address: getAddress(account.address),
					capabilities: account.capabilities ?? {}
				}));
				let currentChainId = Number(response.chainIds[0]);
				if (!accountsChanged) {
					accountsChanged = this.onAccountsChanged.bind(this);
					provider.on("accountsChanged", accountsChanged);
				}
				if (!chainChanged) {
					chainChanged = this.onChainChanged.bind(this);
					provider.on("chainChanged", chainChanged);
				}
				if (!disconnect) {
					disconnect = this.onDisconnect.bind(this);
					provider.on("disconnect", disconnect);
				}
				if (chainId && currentChainId !== chainId) currentChainId = (await this.switchChain({ chainId }).catch((error) => {
					if (error.code === UserRejectedRequestError.code) throw error;
					return { id: currentChainId };
				}))?.id ?? currentChainId;
				return {
					accounts: withCapabilities ? accounts : accounts.map((account) => account.address),
					chainId: currentChainId
				};
			} catch (error) {
				if (/(user closed modal|accounts received is empty|user denied account|request rejected)/i.test(error.message)) throw new UserRejectedRequestError(error);
				throw error;
			}
		},
		async disconnect() {
			const provider = await this.getProvider();
			if (accountsChanged) {
				provider.removeListener("accountsChanged", accountsChanged);
				accountsChanged = void 0;
			}
			if (chainChanged) {
				provider.removeListener("chainChanged", chainChanged);
				chainChanged = void 0;
			}
			if (disconnect) {
				provider.removeListener("disconnect", disconnect);
				disconnect = void 0;
			}
			provider.disconnect();
		},
		async getAccounts() {
			return (await (await this.getProvider()).request({ method: "eth_accounts" })).map((x) => getAddress(x));
		},
		async getChainId() {
			const chainId = await (await this.getProvider()).request({ method: "eth_chainId" });
			return Number(chainId);
		},
		async getProvider() {
			if (!walletProvider) {
				const preference = (() => {
					if (typeof parameters.preference === "string") return { options: parameters.preference };
					return {
						...parameters.preference,
						options: parameters.preference?.options ?? "all"
					};
				})();
				const { createBaseAccountSDK } = await import("./dist-BWIMkxXA.js");
				walletProvider = createBaseAccountSDK({
					...parameters,
					appChainIds: config.chains.map((x) => x.id),
					preference
				}).getProvider();
			}
			return walletProvider;
		},
		async isAuthorized() {
			try {
				return !!(await this.getAccounts()).length;
			} catch {
				return false;
			}
		},
		async switchChain({ addEthereumChainParameter, chainId }) {
			const chain = config.chains.find((chain) => chain.id === chainId);
			if (!chain) throw new SwitchChainError(new ChainNotConfiguredError());
			const provider = await this.getProvider();
			try {
				await provider.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId: numberToHex(chain.id) }]
				});
				return chain;
			} catch (error) {
				if (error.code === 4902) try {
					let blockExplorerUrls;
					if (addEthereumChainParameter?.blockExplorerUrls) blockExplorerUrls = addEthereumChainParameter.blockExplorerUrls;
					else blockExplorerUrls = chain.blockExplorers?.default.url ? [chain.blockExplorers?.default.url] : [];
					let rpcUrls;
					if (addEthereumChainParameter?.rpcUrls?.length) rpcUrls = addEthereumChainParameter.rpcUrls;
					else rpcUrls = [chain.rpcUrls.default?.http[0] ?? ""];
					const addEthereumChain = {
						blockExplorerUrls,
						chainId: numberToHex(chainId),
						chainName: addEthereumChainParameter?.chainName ?? chain.name,
						iconUrls: addEthereumChainParameter?.iconUrls,
						nativeCurrency: addEthereumChainParameter?.nativeCurrency ?? chain.nativeCurrency,
						rpcUrls
					};
					await provider.request({
						method: "wallet_addEthereumChain",
						params: [addEthereumChain]
					});
					return chain;
				} catch (error) {
					throw new UserRejectedRequestError(error);
				}
				throw new SwitchChainError(error);
			}
		},
		onAccountsChanged(accounts) {
			if (accounts.length === 0) this.onDisconnect();
			else config.emitter.emit("change", { accounts: accounts.map((x) => getAddress(x)) });
		},
		onChainChanged(chain) {
			const chainId = Number(chain);
			config.emitter.emit("change", { chainId });
		},
		async onDisconnect(_error) {
			config.emitter.emit("disconnect");
			const provider = await this.getProvider();
			if (accountsChanged) {
				provider.removeListener("accountsChanged", accountsChanged);
				accountsChanged = void 0;
			}
			if (chainChanged) {
				provider.removeListener("chainChanged", chainChanged);
				chainChanged = void 0;
			}
			if (disconnect) {
				provider.removeListener("disconnect", disconnect);
				disconnect = void 0;
			}
		}
	}));
}
//#endregion
//#region node_modules/@wagmi/connectors/dist/esm/coinbaseWallet.js
coinbaseWallet.type = "coinbaseWallet";
function coinbaseWallet(parameters = {}) {
	if (parameters.version === "3" || parameters.headlessMode) return version3(parameters);
	return version4(parameters);
}
function version4(parameters) {
	let walletProvider;
	let accountsChanged;
	let chainChanged;
	let disconnect;
	return createConnector((config) => ({
		id: "coinbaseWalletSDK",
		name: "Coinbase Wallet",
		rdns: "com.coinbase.wallet",
		type: coinbaseWallet.type,
		async connect({ chainId, withCapabilities, ...rest } = {}) {
			try {
				const provider = await this.getProvider();
				const accounts = (await provider.request({
					method: "eth_requestAccounts",
					params: "instantOnboarding" in rest && rest.instantOnboarding ? [{ onboarding: "instant" }] : []
				})).map((x) => getAddress(x));
				if (!accountsChanged) {
					accountsChanged = this.onAccountsChanged.bind(this);
					provider.on("accountsChanged", accountsChanged);
				}
				if (!chainChanged) {
					chainChanged = this.onChainChanged.bind(this);
					provider.on("chainChanged", chainChanged);
				}
				if (!disconnect) {
					disconnect = this.onDisconnect.bind(this);
					provider.on("disconnect", disconnect);
				}
				let currentChainId = await this.getChainId();
				if (chainId && currentChainId !== chainId) currentChainId = (await this.switchChain({ chainId }).catch((error) => {
					if (error.code === UserRejectedRequestError.code) throw error;
					return { id: currentChainId };
				}))?.id ?? currentChainId;
				return {
					accounts: withCapabilities ? accounts.map((address) => ({
						address,
						capabilities: {}
					})) : accounts,
					chainId: currentChainId
				};
			} catch (error) {
				if (/(user closed modal|accounts received is empty|user denied account|request rejected)/i.test(error.message)) throw new UserRejectedRequestError(error);
				throw error;
			}
		},
		async disconnect() {
			const provider = await this.getProvider();
			if (accountsChanged) {
				provider.removeListener("accountsChanged", accountsChanged);
				accountsChanged = void 0;
			}
			if (chainChanged) {
				provider.removeListener("chainChanged", chainChanged);
				chainChanged = void 0;
			}
			if (disconnect) {
				provider.removeListener("disconnect", disconnect);
				disconnect = void 0;
			}
			provider.disconnect();
			provider.close?.();
		},
		async getAccounts() {
			return (await (await this.getProvider()).request({ method: "eth_accounts" })).map((x) => getAddress(x));
		},
		async getChainId() {
			const chainId = await (await this.getProvider()).request({ method: "eth_chainId" });
			return Number(chainId);
		},
		async getProvider() {
			if (!walletProvider) {
				const preference = (() => {
					if (typeof parameters.preference === "string") return { options: parameters.preference };
					return {
						...parameters.preference,
						options: parameters.preference?.options ?? "all"
					};
				})();
				const { createCoinbaseWalletSDK } = await import("./dist-BM2XmpT1.js");
				walletProvider = createCoinbaseWalletSDK({
					...parameters,
					appChainIds: config.chains.map((x) => x.id),
					preference
				}).getProvider();
			}
			return walletProvider;
		},
		async isAuthorized() {
			try {
				return !!(await this.getAccounts()).length;
			} catch {
				return false;
			}
		},
		async switchChain({ addEthereumChainParameter, chainId }) {
			const chain = config.chains.find((chain) => chain.id === chainId);
			if (!chain) throw new SwitchChainError(new ChainNotConfiguredError());
			const provider = await this.getProvider();
			try {
				await provider.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId: numberToHex(chain.id) }]
				});
				return chain;
			} catch (error) {
				if (error.code === 4902) try {
					let blockExplorerUrls;
					if (addEthereumChainParameter?.blockExplorerUrls) blockExplorerUrls = addEthereumChainParameter.blockExplorerUrls;
					else blockExplorerUrls = chain.blockExplorers?.default.url ? [chain.blockExplorers?.default.url] : [];
					let rpcUrls;
					if (addEthereumChainParameter?.rpcUrls?.length) rpcUrls = addEthereumChainParameter.rpcUrls;
					else rpcUrls = [chain.rpcUrls.default?.http[0] ?? ""];
					const addEthereumChain = {
						blockExplorerUrls,
						chainId: numberToHex(chainId),
						chainName: addEthereumChainParameter?.chainName ?? chain.name,
						iconUrls: addEthereumChainParameter?.iconUrls,
						nativeCurrency: addEthereumChainParameter?.nativeCurrency ?? chain.nativeCurrency,
						rpcUrls
					};
					await provider.request({
						method: "wallet_addEthereumChain",
						params: [addEthereumChain]
					});
					return chain;
				} catch (error) {
					throw new UserRejectedRequestError(error);
				}
				throw new SwitchChainError(error);
			}
		},
		onAccountsChanged(accounts) {
			if (accounts.length === 0) this.onDisconnect();
			else config.emitter.emit("change", { accounts: accounts.map((x) => getAddress(x)) });
		},
		onChainChanged(chain) {
			const chainId = Number(chain);
			config.emitter.emit("change", { chainId });
		},
		async onDisconnect(_error) {
			config.emitter.emit("disconnect");
			const provider = await this.getProvider();
			if (accountsChanged) {
				provider.removeListener("accountsChanged", accountsChanged);
				accountsChanged = void 0;
			}
			if (chainChanged) {
				provider.removeListener("chainChanged", chainChanged);
				chainChanged = void 0;
			}
			if (disconnect) {
				provider.removeListener("disconnect", disconnect);
				disconnect = void 0;
			}
		}
	}));
}
function version3(parameters) {
	const reloadOnDisconnect = false;
	let sdk;
	let walletProvider;
	let accountsChanged;
	let chainChanged;
	let disconnect;
	return createConnector((config) => ({
		id: "coinbaseWalletSDK",
		name: "Coinbase Wallet",
		rdns: "com.coinbase.wallet",
		type: coinbaseWallet.type,
		async connect({ chainId, withCapabilities } = {}) {
			try {
				const provider = await this.getProvider();
				const accounts = (await provider.request({ method: "eth_requestAccounts" })).map((x) => getAddress(x));
				if (!accountsChanged) {
					accountsChanged = this.onAccountsChanged.bind(this);
					provider.on("accountsChanged", accountsChanged);
				}
				if (!chainChanged) {
					chainChanged = this.onChainChanged.bind(this);
					provider.on("chainChanged", chainChanged);
				}
				if (!disconnect) {
					disconnect = this.onDisconnect.bind(this);
					provider.on("disconnect", disconnect);
				}
				let currentChainId = await this.getChainId();
				if (chainId && currentChainId !== chainId) currentChainId = (await this.switchChain({ chainId }).catch((error) => {
					if (error.code === UserRejectedRequestError.code) throw error;
					return { id: currentChainId };
				}))?.id ?? currentChainId;
				return {
					accounts: withCapabilities ? accounts.map((address) => ({
						address,
						capabilities: {}
					})) : accounts,
					chainId: currentChainId
				};
			} catch (error) {
				if (/(user closed modal|accounts received is empty|user denied account)/i.test(error.message)) throw new UserRejectedRequestError(error);
				throw error;
			}
		},
		async disconnect() {
			const provider = await this.getProvider();
			if (accountsChanged) {
				provider.removeListener("accountsChanged", accountsChanged);
				accountsChanged = void 0;
			}
			if (chainChanged) {
				provider.removeListener("chainChanged", chainChanged);
				chainChanged = void 0;
			}
			if (disconnect) {
				provider.removeListener("disconnect", disconnect);
				disconnect = void 0;
			}
			provider.disconnect();
			provider.close();
		},
		async getAccounts() {
			return (await (await this.getProvider()).request({ method: "eth_accounts" })).map((x) => getAddress(x));
		},
		async getChainId() {
			const chainId = await (await this.getProvider()).request({ method: "eth_chainId" });
			return Number(chainId);
		},
		async getProvider() {
			if (!walletProvider) {
				sdk = new (await ((async () => {
					const { default: SDK } = await import("./dist-DbhOPEj3.js").then((m) => /* @__PURE__ */ __toESM(m.default, 1));
					if (typeof SDK !== "function" && typeof SDK.default === "function") return SDK.default;
					return SDK;
				})()))({
					...parameters,
					reloadOnDisconnect
				});
				const walletExtensionChainId = sdk.walletExtension?.getChainId();
				const chain = config.chains.find((chain) => parameters.chainId ? chain.id === parameters.chainId : chain.id === walletExtensionChainId) || config.chains[0];
				const chainId = parameters.chainId || chain?.id;
				const jsonRpcUrl = parameters.jsonRpcUrl || chain?.rpcUrls.default.http[0];
				walletProvider = sdk.makeWeb3Provider(jsonRpcUrl, chainId);
			}
			return walletProvider;
		},
		async isAuthorized() {
			try {
				return !!(await this.getAccounts()).length;
			} catch {
				return false;
			}
		},
		async switchChain({ addEthereumChainParameter, chainId }) {
			const chain = config.chains.find((chain) => chain.id === chainId);
			if (!chain) throw new SwitchChainError(new ChainNotConfiguredError());
			const provider = await this.getProvider();
			try {
				await provider.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId: numberToHex(chain.id) }]
				});
				return chain;
			} catch (error) {
				if (error.code === 4902) try {
					let blockExplorerUrls;
					if (addEthereumChainParameter?.blockExplorerUrls) blockExplorerUrls = addEthereumChainParameter.blockExplorerUrls;
					else blockExplorerUrls = chain.blockExplorers?.default.url ? [chain.blockExplorers?.default.url] : [];
					let rpcUrls;
					if (addEthereumChainParameter?.rpcUrls?.length) rpcUrls = addEthereumChainParameter.rpcUrls;
					else rpcUrls = [chain.rpcUrls.default?.http[0] ?? ""];
					const addEthereumChain = {
						blockExplorerUrls,
						chainId: numberToHex(chainId),
						chainName: addEthereumChainParameter?.chainName ?? chain.name,
						iconUrls: addEthereumChainParameter?.iconUrls,
						nativeCurrency: addEthereumChainParameter?.nativeCurrency ?? chain.nativeCurrency,
						rpcUrls
					};
					await provider.request({
						method: "wallet_addEthereumChain",
						params: [addEthereumChain]
					});
					return chain;
				} catch (error) {
					throw new UserRejectedRequestError(error);
				}
				throw new SwitchChainError(error);
			}
		},
		onAccountsChanged(accounts) {
			if (accounts.length === 0) this.onDisconnect();
			else config.emitter.emit("change", { accounts: accounts.map((x) => getAddress(x)) });
		},
		onChainChanged(chain) {
			const chainId = Number(chain);
			config.emitter.emit("change", { chainId });
		},
		async onDisconnect(_error) {
			config.emitter.emit("disconnect");
			const provider = await this.getProvider();
			if (accountsChanged) {
				provider.removeListener("accountsChanged", accountsChanged);
				accountsChanged = void 0;
			}
			if (chainChanged) {
				provider.removeListener("chainChanged", chainChanged);
				chainChanged = void 0;
			}
			if (disconnect) {
				provider.removeListener("disconnect", disconnect);
				disconnect = void 0;
			}
		}
	}));
}
//#endregion
//#region node_modules/@metamask/superstruct/dist/error.mjs
/**
* A `StructFailure` represents a single specific failure in validation.
*/
/**
* `StructError` objects are thrown (or returned) when validation fails.
*
* Validation logic is design to exit early for maximum performance. The error
* represents the first error encountered during validation. For more detail,
* the `error.failures` property is a generator function that can be run to
* continue validation and receive all the failures in the data.
*/
var StructError = class extends TypeError {
	constructor(failure, failures) {
		let cached;
		const { message, explanation, ...rest } = failure;
		const { path } = failure;
		const cause = path.length === 0 ? message : `At path: ${path.join(".")} -- ${message}`;
		super(explanation ?? cause);
		if (explanation !== null && explanation !== void 0) this.cause = cause;
		Object.assign(this, rest);
		this.name = this.constructor.name;
		this.failures = () => {
			return cached ?? (cached = [failure, ...failures()]);
		};
	}
};
//#endregion
//#region node_modules/@metamask/superstruct/dist/utils.mjs
/**
* Check if a value is an iterator.
*
* @param value - The value to check.
* @returns Whether the value is an iterator.
*/
function isIterable(value) {
	return isObject$1(value) && typeof value[Symbol.iterator] === "function";
}
/**
* Check if a value is a plain object.
*
* @param value - The value to check.
* @returns Whether the value is a plain object.
*/
function isObject$1(value) {
	return typeof value === "object" && value !== null;
}
/**
* Return a value as a printable string.
*
* @param value - The value to print.
* @returns The value as a string.
*/
function print(value) {
	if (typeof value === "symbol") return value.toString();
	return typeof value === "string" ? JSON.stringify(value) : `${value}`;
}
/**
* Shift (remove and return) the first value from the `input` iterator.
* Like `Array.prototype.shift()` but for an `Iterator`.
*
* @param input - The iterator to shift.
* @returns The first value of the iterator, or `undefined` if the iterator is
* empty.
*/
function shiftIterator(input) {
	const { done, value } = input.next();
	return done ? void 0 : value;
}
/**
* Convert a single validation result to a failure.
*
* @param result - The result to convert.
* @param context - The context of the validation.
* @param struct - The struct being validated.
* @param value - The value being validated.
* @returns A failure if the result is a failure, or `undefined` if the result
* is a success.
*/
function toFailure(result, context, struct, value) {
	if (result === true) return;
	else if (result === false) result = {};
	else if (typeof result === "string") result = { message: result };
	const { path, branch } = context;
	const { type } = struct;
	const { refinement, message = `Expected a value of type \`${type}\`${refinement ? ` with refinement \`${refinement}\`` : ""}, but received: \`${print(value)}\`` } = result;
	return {
		value,
		type,
		refinement,
		key: path[path.length - 1],
		path,
		branch,
		...result,
		message
	};
}
/**
* Convert a validation result to an iterable of failures.
*
* @param result - The result to convert.
* @param context - The context of the validation.
* @param struct - The struct being validated.
* @param value - The value being validated.
* @yields The failures.
* @returns An iterable of failures.
*/
function* toFailures(result, context, struct, value) {
	if (!isIterable(result)) result = [result];
	for (const validationResult of result) {
		const failure = toFailure(validationResult, context, struct, value);
		if (failure) yield failure;
	}
}
/**
* Check a value against a struct, traversing deeply into nested values, and
* returning an iterator of failures or success.
*
* @param value - The value to check.
* @param struct - The struct to check against.
* @param options - Optional settings.
* @param options.path - The path to the value in the input data.
* @param options.branch - The branch of the value in the input data.
* @param options.coerce - Whether to coerce the value before validating it.
* @param options.mask - Whether to mask the value before validating it.
* @param options.message - An optional message to include in the error.
* @yields An iterator of failures or success.
* @returns An iterator of failures or success.
*/
function* run(value, struct, options = {}) {
	const { path = [], branch = [value], coerce = false, mask = false } = options;
	const context = {
		path,
		branch
	};
	if (coerce) {
		value = struct.coercer(value, context);
		if (mask && struct.type !== "type" && isObject$1(struct.schema) && isObject$1(value) && !Array.isArray(value)) {
			for (const key in value) if (struct.schema[key] === void 0) delete value[key];
		}
	}
	let status = "valid";
	for (const failure of struct.validator(value, context)) {
		failure.explanation = options.message;
		status = "not_valid";
		yield [failure, void 0];
	}
	for (let [innerKey, innerValue, innerStruct] of struct.entries(value, context)) {
		const iterable = run(innerValue, innerStruct, {
			path: innerKey === void 0 ? path : [...path, innerKey],
			branch: innerKey === void 0 ? branch : [...branch, innerValue],
			coerce,
			mask,
			message: options.message
		});
		for (const result of iterable) if (result[0]) {
			status = result[0].refinement === null || result[0].refinement === void 0 ? "not_valid" : "not_refined";
			yield [result[0], void 0];
		} else if (coerce) {
			innerValue = result[1];
			if (innerKey === void 0) value = innerValue;
			else if (value instanceof Map) value.set(innerKey, innerValue);
			else if (value instanceof Set) value.add(innerValue);
			else if (isObject$1(value)) {
				if (innerValue !== void 0 || innerKey in value) value[innerKey] = innerValue;
			}
		}
	}
	if (status !== "not_valid") for (const failure of struct.refiner(value, context)) {
		failure.explanation = options.message;
		status = "not_refined";
		yield [failure, void 0];
	}
	if (status === "valid") yield [void 0, value];
}
//#endregion
//#region node_modules/@metamask/superstruct/dist/struct.mjs
/**
* `Struct` objects encapsulate the validation logic for a specific type of
* values. Once constructed, you use the `assert`, `is` or `validate` helpers to
* validate unknown input data against the struct.
*/
var Struct = class {
	constructor(props) {
		const { type, schema, validator, refiner, coercer = (value) => value, entries = function* () {} } = props;
		this.type = type;
		this.schema = schema;
		this.entries = entries;
		this.coercer = coercer;
		if (validator) this.validator = (value, context) => {
			return toFailures(validator(value, context), context, this, value);
		};
		else this.validator = () => [];
		if (refiner) this.refiner = (value, context) => {
			return toFailures(refiner(value, context), context, this, value);
		};
		else this.refiner = () => [];
	}
	/**
	* Assert that a value passes the struct's validation, throwing if it doesn't.
	*/
	assert(value, message) {
		return assert(value, this, message);
	}
	/**
	* Create a value with the struct's coercion logic, then validate it.
	*/
	create(value, message) {
		return create(value, this, message);
	}
	/**
	* Check if a value passes the struct's validation.
	*/
	is(value) {
		return is(value, this);
	}
	/**
	* Mask a value, coercing and validating it, but returning only the subset of
	* properties defined by the struct's schema.
	*/
	mask(value, message) {
		return mask(value, this, message);
	}
	/**
	* Validate a value with the struct's validation logic, returning a tuple
	* representing the result.
	*
	* You may optionally pass `true` for the `withCoercion` argument to coerce
	* the value before attempting to validate it. If you do, the result will
	* contain the coerced result when successful.
	*/
	validate(value, options = {}) {
		return validate(value, this, options);
	}
};
var ExactOptionalBrand = "EXACT_OPTIONAL";
/**
* An `ExactOptionalStruct` is a `Struct` that is used to create exactly optional
* properties of `object()` structs.
*/
var ExactOptionalStruct = class extends Struct {
	constructor(props) {
		super({
			...props,
			type: `exact optional ${props.type}`
		});
		this.brand = ExactOptionalBrand;
	}
	static isExactOptional(value) {
		return isObject$1(value) && "brand" in value && value.brand === ExactOptionalBrand;
	}
};
/**
* Assert that a value passes a struct, throwing if it doesn't.
*
* @param value - The value to validate.
* @param struct - The struct to validate against.
* @param message - An optional message to include in the error.
*/
function assert(value, struct, message) {
	const result = validate(value, struct, { message });
	if (result[0]) throw result[0];
}
/**
* Create a value with the coercion logic of struct and validate it.
*
* @param value - The value to coerce and validate.
* @param struct - The struct to validate against.
* @param message - An optional message to include in the error.
* @returns The coerced and validated value.
*/
function create(value, struct, message) {
	const result = validate(value, struct, {
		coerce: true,
		message
	});
	if (result[0]) throw result[0];
	else return result[1];
}
/**
* Mask a value, returning only the subset of properties defined by a struct.
*
* @param value - The value to mask.
* @param struct - The struct to mask against.
* @param message - An optional message to include in the error.
* @returns The masked value.
*/
function mask(value, struct, message) {
	const result = validate(value, struct, {
		coerce: true,
		mask: true,
		message
	});
	if (result[0]) throw result[0];
	else return result[1];
}
/**
* Check if a value passes a struct.
*
* @param value - The value to validate.
* @param struct - The struct to validate against.
* @returns `true` if the value passes the struct, `false` otherwise.
*/
function is(value, struct) {
	return !validate(value, struct)[0];
}
/**
* Validate a value against a struct, returning an error if invalid, or the
* value (with potential coercion) if valid.
*
* @param value - The value to validate.
* @param struct - The struct to validate against.
* @param options - Optional settings.
* @param options.coerce - Whether to coerce the value before validating it.
* @param options.mask - Whether to mask the value before validating it.
* @param options.message - An optional message to include in the error.
* @returns A tuple containing the error (if invalid) and the validated value.
*/
function validate(value, struct, options = {}) {
	const tuples = run(value, struct, options);
	const tuple = shiftIterator(tuples);
	if (tuple[0]) return [new StructError(tuple[0], function* () {
		for (const innerTuple of tuples) if (innerTuple[0]) yield innerTuple[0];
	}), void 0];
	return [void 0, tuple[1]];
}
//#endregion
//#region node_modules/@metamask/superstruct/dist/structs/utilities.mjs
/**
* Define a new struct type with a custom validation function.
*
* @param name - The name of the struct type.
* @param validator - The validation function.
* @returns A new struct type.
*/
function define(name, validator) {
	return new Struct({
		type: name,
		schema: null,
		validator
	});
}
//#endregion
//#region node_modules/@metamask/superstruct/dist/structs/types.mjs
/**
* Ensure that any value passes validation.
*
* @returns A struct that will always pass validation.
*/
function any() {
	return define("any", () => true);
}
/**
* Ensure that a value is an array and that its elements are of a specific type.
*
* Note: If you omit the element struct, the arrays elements will not be
* iterated at all. This can be helpful for cases where performance is critical,
* and it is preferred to using `array(any())`.
*
* @param Element - The struct to validate each element in the array against.
* @returns A new struct that will only accept arrays of the given type.
*/
function array(Element) {
	return new Struct({
		type: "array",
		schema: Element,
		*entries(value) {
			if (Element && Array.isArray(value)) for (const [index, arrayValue] of value.entries()) yield [
				index,
				arrayValue,
				Element
			];
		},
		coercer(value) {
			return Array.isArray(value) ? value.slice() : value;
		},
		validator(value) {
			return Array.isArray(value) || `Expected an array value, but received: ${print(value)}`;
		}
	});
}
/**
* Ensure that a value is an integer.
*
* @returns A new struct that will only accept integers.
*/
function integer() {
	return define("integer", (value) => {
		return typeof value === "number" && !isNaN(value) && Number.isInteger(value) || `Expected an integer, but received: ${print(value)}`;
	});
}
/**
* Ensure that a value is an exact value, using `===` for comparison.
*
* @param constant - The exact value that the input must be.
* @returns A new struct that will only accept the exact given value.
*/
function literal(constant) {
	const description = print(constant);
	const valueType = typeof constant;
	return new Struct({
		type: "literal",
		schema: valueType === "string" || valueType === "number" || valueType === "boolean" ? constant : null,
		validator(value) {
			return value === constant || `Expected the literal \`${description}\`, but received: ${print(value)}`;
		}
	});
}
/**
* Ensure that no value ever passes validation.
*
* @returns A new struct that will never pass validation.
*/
function never() {
	return define("never", () => false);
}
/**
* Augment an existing struct to allow `null` values.
*
* @param struct - The struct to augment.
* @returns A new struct that will accept `null` values.
*/
function nullable(struct) {
	return new Struct({
		...struct,
		validator: (value, ctx) => value === null || struct.validator(value, ctx),
		refiner: (value, ctx) => value === null || struct.refiner(value, ctx)
	});
}
/**
* Ensure that a value is a number.
*
* @returns A new struct that will only accept numbers.
*/
function number() {
	return define("number", (value) => {
		return typeof value === "number" && !isNaN(value) || `Expected a number, but received: ${print(value)}`;
	});
}
/**
* Ensure that a value is an object, that it has a known set of properties,
* and that its properties are of specific types.
*
* Note: Unrecognized properties will fail validation.
*
* @param schema - An object that defines the structure of the object.
* @returns A new struct that will only accept objects.
*/
function object$1(schema) {
	const knowns = schema ? Object.keys(schema) : [];
	const Never = never();
	return new Struct({
		type: "object",
		schema: schema ?? null,
		*entries(value) {
			if (schema && isObject$1(value)) {
				const unknowns = new Set(Object.keys(value));
				for (const key of knowns) {
					unknowns.delete(key);
					const propertySchema = schema[key];
					if (ExactOptionalStruct.isExactOptional(propertySchema) && !Object.prototype.hasOwnProperty.call(value, key)) continue;
					yield [
						key,
						value[key],
						schema[key]
					];
				}
				for (const key of unknowns) yield [
					key,
					value[key],
					Never
				];
			}
		},
		validator(value) {
			return isObject$1(value) || `Expected an object, but received: ${print(value)}`;
		},
		coercer(value) {
			return isObject$1(value) ? { ...value } : value;
		}
	});
}
/**
* Augment a struct to allow `undefined` values.
*
* @param struct - The struct to augment.
* @returns A new struct that will accept `undefined` values.
*/
function optional(struct) {
	return new Struct({
		...struct,
		validator: (value, ctx) => value === void 0 || struct.validator(value, ctx),
		refiner: (value, ctx) => value === void 0 || struct.refiner(value, ctx)
	});
}
/**
* Ensure that a value is an object with keys and values of specific types, but
* without ensuring any specific shape of properties.
*
* Like TypeScript's `Record` utility.
*/
/**
* Ensure that a value is an object with keys and values of specific types, but
* without ensuring any specific shape of properties.
*
* @param Key - The struct to validate each key in the record against.
* @param Value - The struct to validate each value in the record against.
* @returns A new struct that will only accept objects.
*/
function record(Key, Value) {
	return new Struct({
		type: "record",
		schema: null,
		*entries(value) {
			if (isObject$1(value)) for (const objectKey in value) {
				const objectValue = value[objectKey];
				yield [
					objectKey,
					objectKey,
					Key
				];
				yield [
					objectKey,
					objectValue,
					Value
				];
			}
		},
		validator(value) {
			return isObject$1(value) || `Expected an object, but received: ${print(value)}`;
		}
	});
}
/**
* Ensure that a value is a string.
*
* @returns A new struct that will only accept strings.
*/
function string() {
	return define("string", (value) => {
		return typeof value === "string" || `Expected a string, but received: ${print(value)}`;
	});
}
/**
* Ensure that a value matches one of a set of types.
*
* @param Structs - The set of structs that the value must match.
* @returns A new struct that will only accept values that match one of the
* given structs.
*/
function union(Structs) {
	const description = Structs.map((struct) => struct.type).join(" | ");
	return new Struct({
		type: "union",
		schema: null,
		coercer(value) {
			for (const InnerStruct of Structs) {
				const [error, coerced] = InnerStruct.validate(value, { coerce: true });
				if (!error) return coerced;
			}
			return value;
		},
		validator(value, ctx) {
			const failures = [];
			for (const InnerStruct of Structs) {
				const [ ...tuples] = run(value, InnerStruct, ctx);
				const [first] = tuples;
				if (!first?.[0]) return [];
				for (const [failure] of tuples) if (failure) failures.push(failure);
			}
			return [`Expected the value to satisfy a union of \`${description}\`, but received: ${print(value)}`, ...failures];
		}
	});
}
/**
* Ensure that any value passes validation, without widening its type to `any`.
*
* @returns A struct that will always pass validation.
*/
function unknown() {
	return define("unknown", () => true);
}
//#endregion
//#region node_modules/@metamask/superstruct/dist/structs/coercions.mjs
/**
* Augment a `Struct` to add an additional coercion step to its input.
*
* This allows you to transform input data before validating it, to increase the
* likelihood that it passes validation—for example for default values, parsing
* different formats, etc.
*
* Note: You must use `create(value, Struct)` on the value to have the coercion
* take effect! Using simply `assert()` or `is()` will not use coercion.
*
* @param struct - The struct to augment.
* @param condition - A struct that the input must pass to be coerced.
* @param coercer - A function that takes the input and returns the coerced
* value.
* @returns A new struct that will coerce its input before validating it.
*/
function coerce(struct, condition, coercer) {
	return new Struct({
		...struct,
		coercer: (value, ctx) => {
			return is(value, condition) ? struct.coercer(coercer(value, ctx), ctx) : struct.coercer(value, ctx);
		}
	});
}
//#endregion
//#region node_modules/@metamask/superstruct/dist/structs/refinements.mjs
/**
* Augment a `Struct` to add an additional refinement to the validation.
*
* The refiner function is guaranteed to receive a value of the struct's type,
* because the struct's existing validation will already have passed. This
* allows you to layer additional validation on top of existing structs.
*
* @param struct - The struct to augment.
* @param name - The name of the refinement.
* @param refiner - The refiner function.
* @returns A new struct that will run the refiner function after the existing
* validation.
*/
function refine(struct, name, refiner) {
	return new Struct({
		...struct,
		*refiner(value, ctx) {
			yield* struct.refiner(value, ctx);
			const failures = toFailures(refiner(value, ctx), ctx, struct, value);
			for (const failure of failures) yield {
				...failure,
				refinement: name
			};
		}
	});
}
//#endregion
//#region node_modules/@metamask/utils/dist/misc.mjs
/**
* A type guard for {@link RuntimeObject}.
*
* @param value - The value to check.
* @returns Whether the specified value has a runtime type of `object` and is
* neither `null` nor an `Array`.
*/
function isObject(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
/**
* A type guard for ensuring an object has a property.
*
* @param objectToCheck - The object to check.
* @param name - The property name to check for.
* @returns Whether the specified object has an own property with the specified
* name, regardless of whether it is enumerable or not.
*/
var hasProperty = (objectToCheck, name) => Object.hasOwnProperty.call(objectToCheck, name);
/**
* Predefined sizes (in Bytes) of specific parts of JSON structure.
*/
var JsonSize;
(function(JsonSize) {
	JsonSize[JsonSize["Null"] = 4] = "Null";
	JsonSize[JsonSize["Comma"] = 1] = "Comma";
	JsonSize[JsonSize["Wrapper"] = 1] = "Wrapper";
	JsonSize[JsonSize["True"] = 4] = "True";
	JsonSize[JsonSize["False"] = 5] = "False";
	JsonSize[JsonSize["Quote"] = 1] = "Quote";
	JsonSize[JsonSize["Colon"] = 1] = "Colon";
	JsonSize[JsonSize["Date"] = 24] = "Date";
})(JsonSize = JsonSize || (JsonSize = {}));
/**
* Check if the value is plain object.
*
* @param value - Value to be checked.
* @returns True if an object is the plain JavaScript object,
* false if the object is not plain (e.g. function).
*/
function isPlainObject(value) {
	if (typeof value !== "object" || value === null) return false;
	try {
		let proto = value;
		while (Object.getPrototypeOf(proto) !== null) proto = Object.getPrototypeOf(proto);
		return Object.getPrototypeOf(value) === proto;
	} catch (_) {
		return false;
	}
}
//#endregion
//#region node_modules/@metamask/utils/dist/json.mjs
/**
* A struct to check if the given value is a valid object, with support for
* {@link exactOptional} types.
*
* @deprecated Use `exactOptional` and `object` from `@metamask/superstruct@>=3.2.0` instead.
* @param schema - The schema of the object.
* @returns A struct to check if the given value is an object.
*/
var object = (schema) => object$1(schema);
/**
* Check the last field of a path is present.
*
* @param context - The context to check.
* @param context.path - The path to check.
* @param context.branch - The branch to check.
* @returns Whether the last field of a path is present.
*/
function hasOptional({ path, branch }) {
	const field = path[path.length - 1];
	return hasProperty(branch[branch.length - 2], field);
}
/**
* A struct which allows the property of an object to be absent, or to be present
* as long as it's valid and not set to `undefined`.
*
* This struct should be used in conjunction with the {@link object} from this
* library, to get proper type inference.
*
* @deprecated Use `exactOptional` and `object` from `@metamask/superstruct@>=3.2.0` instead.
* @param struct - The struct to check the value against, if present.
* @returns A struct to check if the given value is valid, or not present.
* @example
* ```ts
* const struct = object({
*   foo: exactOptional(string()),
*   bar: exactOptional(number()),
*   baz: optional(boolean()),
*   qux: unknown(),
* });
*
* type Type = Infer<typeof struct>;
* // Type is equivalent to:
* // {
* //   foo?: string;
* //   bar?: number;
* //   baz?: boolean | undefined;
* //   qux: unknown;
* // }
* ```
*/
function exactOptional(struct) {
	return new Struct({
		...struct,
		type: `optional ${struct.type}`,
		validator: (value, context) => !hasOptional(context) || struct.validator(value, context),
		refiner: (value, context) => !hasOptional(context) || struct.refiner(value, context)
	});
}
/**
* Validate an unknown input to be valid JSON.
*
* Useful for constructing JSON structs.
*
* @param json - An unknown value.
* @returns True if the value is valid JSON, otherwise false.
*/
function validateJson(json) {
	if (json === null || typeof json === "boolean" || typeof json === "string") return true;
	if (typeof json === "number" && Number.isFinite(json)) return true;
	if (typeof json === "object") {
		let every = true;
		if (Array.isArray(json)) {
			for (let i = 0; i < json.length; i++) if (!validateJson(json[i])) {
				every = false;
				break;
			}
			return every;
		}
		const entries = Object.entries(json);
		for (let i = 0; i < entries.length; i++) if (typeof entries[i][0] !== "string" || !validateJson(entries[i][1])) {
			every = false;
			break;
		}
		return every;
	}
	return false;
}
/**
* A struct to check if the given value is a valid JSON-serializable value.
*
* Note that this struct is unsafe. For safe validation, use {@link JsonStruct}.
*/
var UnsafeJsonStruct = define("JSON", (json) => validateJson(json));
/**
* A struct to check if the given value is a valid JSON-serializable value.
*
* This struct sanitizes the value before validating it, so that it is safe to
* use with untrusted input.
*/
var JsonStruct = coerce(UnsafeJsonStruct, refine(any(), "JSON", (value) => is(value, UnsafeJsonStruct)), (value) => JSON.parse(JSON.stringify(value, (propKey, propValue) => {
	if (propKey === "__proto__" || propKey === "constructor") return;
	return propValue;
})));
/**
* Check if the given value is a valid {@link Json} value, i.e., a value that is
* serializable to JSON.
*
* @param value - The value to check.
* @returns Whether the value is a valid {@link Json} value.
*/
function isValidJson(value) {
	try {
		getSafeJson(value);
		return true;
	} catch {
		return false;
	}
}
/**
* Validate and return sanitized JSON.
*
* Note:
* This function uses sanitized JsonStruct for validation
* that applies stringify and then parse of a value provided
* to ensure that there are no getters which can have side effects
* that can cause security issues.
*
* @param value - JSON structure to be processed.
* @returns Sanitized JSON structure.
*/
function getSafeJson(value) {
	return create(value, JsonStruct);
}
var JsonRpcVersionStruct = literal("2.0");
var JsonRpcIdStruct = nullable(union([number(), string()]));
var JsonRpcErrorStruct = object({
	code: integer(),
	message: string(),
	data: exactOptional(JsonStruct),
	stack: exactOptional(string())
});
var JsonRpcParamsStruct = union([record(string(), JsonStruct), array(JsonStruct)]);
object({
	id: JsonRpcIdStruct,
	jsonrpc: JsonRpcVersionStruct,
	method: string(),
	params: exactOptional(JsonRpcParamsStruct)
});
object({
	jsonrpc: JsonRpcVersionStruct,
	method: string(),
	params: exactOptional(JsonRpcParamsStruct)
});
object$1({
	id: JsonRpcIdStruct,
	jsonrpc: JsonRpcVersionStruct,
	result: optional(unknown()),
	error: optional(JsonRpcErrorStruct)
});
union([object({
	id: JsonRpcIdStruct,
	jsonrpc: JsonRpcVersionStruct,
	result: JsonStruct
}), object({
	id: JsonRpcIdStruct,
	jsonrpc: JsonRpcVersionStruct,
	error: JsonRpcErrorStruct
})]);
/**
* Check if the given value is a valid {@link JsonRpcError} object.
*
* @param value - The value to check.
* @returns Whether the given value is a valid {@link JsonRpcError} object.
*/
function isJsonRpcError(value) {
	return is(value, JsonRpcErrorStruct);
}
//#endregion
//#region node_modules/@metamask/rpc-errors/dist/error-constants.mjs
var errorCodes = {
	rpc: {
		invalidInput: -32e3,
		resourceNotFound: -32001,
		resourceUnavailable: -32002,
		transactionRejected: -32003,
		methodNotSupported: -32004,
		limitExceeded: -32005,
		parse: -32700,
		invalidRequest: -32600,
		methodNotFound: -32601,
		invalidParams: -32602,
		internal: -32603
	},
	provider: {
		userRejectedRequest: 4001,
		unauthorized: 4100,
		unsupportedMethod: 4200,
		disconnected: 4900,
		chainDisconnected: 4901
	}
};
var errorValues = {
	"-32700": {
		standard: "JSON RPC 2.0",
		message: "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
	},
	"-32600": {
		standard: "JSON RPC 2.0",
		message: "The JSON sent is not a valid Request object."
	},
	"-32601": {
		standard: "JSON RPC 2.0",
		message: "The method does not exist / is not available."
	},
	"-32602": {
		standard: "JSON RPC 2.0",
		message: "Invalid method parameter(s)."
	},
	"-32603": {
		standard: "JSON RPC 2.0",
		message: "Internal JSON-RPC error."
	},
	"-32000": {
		standard: "EIP-1474",
		message: "Invalid input."
	},
	"-32001": {
		standard: "EIP-1474",
		message: "Resource not found."
	},
	"-32002": {
		standard: "EIP-1474",
		message: "Resource unavailable."
	},
	"-32003": {
		standard: "EIP-1474",
		message: "Transaction rejected."
	},
	"-32004": {
		standard: "EIP-1474",
		message: "Method not supported."
	},
	"-32005": {
		standard: "EIP-1474",
		message: "Request limit exceeded."
	},
	"4001": {
		standard: "EIP-1193",
		message: "User rejected the request."
	},
	"4100": {
		standard: "EIP-1193",
		message: "The requested account and/or method has not been authorized by the user."
	},
	"4200": {
		standard: "EIP-1193",
		message: "The requested method is not supported by this Ethereum provider."
	},
	"4900": {
		standard: "EIP-1193",
		message: "The provider is disconnected from all chains."
	},
	"4901": {
		standard: "EIP-1193",
		message: "The provider is disconnected from the specified chain."
	}
};
//#endregion
//#region node_modules/@metamask/rpc-errors/dist/utils.mjs
var FALLBACK_ERROR_CODE = errorCodes.rpc.internal;
var FALLBACK_MESSAGE = "Unspecified error message. This is a bug, please report it.";
var FALLBACK_ERROR = {
	code: FALLBACK_ERROR_CODE,
	message: getMessageFromCode(FALLBACK_ERROR_CODE)
};
var JSON_RPC_SERVER_ERROR_MESSAGE = "Unspecified server error.";
/**
* Gets the message for a given code, or a fallback message if the code has
* no corresponding message.
*
* @param code - The error code.
* @param fallbackMessage - The fallback message to use if the code has no
* corresponding message.
* @returns The message for the given code, or the fallback message if the code
* has no corresponding message.
*/
function getMessageFromCode(code, fallbackMessage = FALLBACK_MESSAGE) {
	if (isValidCode(code)) {
		const codeString = code.toString();
		if (hasProperty(errorValues, codeString)) return errorValues[codeString].message;
		if (isJsonRpcServerError(code)) return JSON_RPC_SERVER_ERROR_MESSAGE;
	}
	return fallbackMessage;
}
/**
* Returns whether the given code is valid.
* A code is valid if it is an integer.
*
* @param code - The error code.
* @returns Whether the given code is valid.
*/
function isValidCode(code) {
	return Number.isInteger(code);
}
/**
* Serializes the given error to an Ethereum JSON RPC-compatible error object.
* If the given error is not fully compatible, it will be preserved on the
* returned object's data.cause property.
*
* @param error - The error to serialize.
* @param options - Options bag.
* @param options.fallbackError - The error to return if the given error is
* not compatible. Should be a JSON-serializable value.
* @param options.shouldIncludeStack - Whether to include the error's stack
* on the returned object.
* @param options.shouldPreserveMessage - Whether to preserve the error's
* message if the fallback error is used.
* @returns The serialized error.
*/
function serializeError(error, { fallbackError = FALLBACK_ERROR, shouldIncludeStack = true, shouldPreserveMessage = true } = {}) {
	if (!isJsonRpcError(fallbackError)) throw new Error("Must provide fallback error with integer number code and string message.");
	const serialized = buildError(error, fallbackError, shouldPreserveMessage);
	if (!shouldIncludeStack) delete serialized.stack;
	return serialized;
}
/**
* Construct a JSON-serializable object given an error and a JSON-serializable `fallbackError`
*
* @param error - The error in question.
* @param fallbackError - A JSON-serializable fallback error.
* @param shouldPreserveMessage - Whether to preserve the error's message if the fallback
* error is used.
* @returns A JSON-serializable error object.
*/
function buildError(error, fallbackError, shouldPreserveMessage) {
	if (error && typeof error === "object" && "serialize" in error && typeof error.serialize === "function") return error.serialize();
	if (isJsonRpcError(error)) return error;
	const originalMessage = getOriginalMessage(error);
	const cause = serializeCause(error);
	return {
		...fallbackError,
		...shouldPreserveMessage && originalMessage && { message: originalMessage },
		data: { cause }
	};
}
/**
* Attempts to extract the original `message` property from an error value of uncertain shape.
*
* @param error - The error in question.
* @returns The original message, if it exists and is a non-empty string.
*/
function getOriginalMessage(error) {
	if (isObject(error) && hasProperty(error, "message") && typeof error.message === "string" && error.message.length > 0) return error.message;
}
/**
* Check if the given code is a valid JSON-RPC server error code.
*
* @param code - The error code.
* @returns Whether the given code is a valid JSON-RPC server error code.
*/
function isJsonRpcServerError(code) {
	return code >= -32099 && code <= -32e3;
}
/**
* Serializes an unknown error to be used as the `cause` in a fallback error.
*
* @param error - The unknown error.
* @returns A JSON-serializable object containing as much information about the original error as possible.
*/
function serializeCause(error) {
	if (Array.isArray(error)) return error.map((entry) => {
		if (isValidJson(entry)) return entry;
		else if (isObject(entry)) return serializeObject(entry);
		return null;
	});
	else if (isObject(error)) return serializeObject(error);
	if (isValidJson(error)) return error;
	return null;
}
/**
* Extracts all JSON-serializable properties from an object.
*
* @param object - The object in question.
* @returns An object containing all the JSON-serializable properties.
*/
function serializeObject(object) {
	return Object.getOwnPropertyNames(object).reduce((acc, key) => {
		const value = object[key];
		if (isValidJson(value)) acc[key] = value;
		return acc;
	}, {});
}
/**
* Returns true if supplied error data has a usable `cause` property; false otherwise.
*
* @param data - Optional data to validate.
* @returns Whether cause property is present and an object.
*/
function dataHasCause(data) {
	return isObject(data) && hasProperty(data, "cause") && isObject(data.cause);
}
//#endregion
//#region node_modules/@metamask/rpc-errors/dist/classes.mjs
var import_fast_safe_stringify = /* @__PURE__ */ __toESM(require_fast_safe_stringify(), 1);
function $importDefault(module) {
	if (module?.__esModule) return module.default;
	return module;
}
var safeStringify = $importDefault(import_fast_safe_stringify.default);
/**
* Error subclass implementing JSON RPC 2.0 errors and Ethereum RPC errors
* per EIP-1474.
*
* Permits any integer error code.
*/
var JsonRpcError = class extends Error {
	constructor(code, message, data) {
		if (!Number.isInteger(code)) throw new Error("\"code\" must be an integer.");
		if (!message || typeof message !== "string") throw new Error("\"message\" must be a non-empty string.");
		if (dataHasCause(data)) {
			super(message, { cause: data.cause });
			if (!hasProperty(this, "cause")) Object.assign(this, { cause: data.cause });
		} else super(message);
		if (data !== void 0) this.data = data;
		this.code = code;
	}
	/**
	* Get the error as JSON-serializable object.
	*
	* @returns A plain object with all public class properties.
	*/
	serialize() {
		const serialized = {
			code: this.code,
			message: this.message
		};
		if (this.data !== void 0) {
			serialized.data = this.data;
			if (isPlainObject(this.data)) serialized.data.cause = serializeCause(this.data.cause);
		}
		if (this.stack) serialized.stack = this.stack;
		return serialized;
	}
	/**
	* Get a string representation of the serialized error, omitting any circular
	* references.
	*
	* @returns A string representation of the serialized error.
	*/
	toString() {
		return safeStringify(this.serialize(), stringifyReplacer, 2);
	}
};
/**
* Error subclass implementing Ethereum Provider errors per EIP-1193.
* Permits integer error codes in the [ 1000 <= 4999 ] range.
*/
var EthereumProviderError = class extends JsonRpcError {
	/**
	* Create an Ethereum Provider JSON-RPC error.
	*
	* @param code - The JSON-RPC error code. Must be an integer in the
	* `1000 <= n <= 4999` range.
	* @param message - The JSON-RPC error message.
	* @param data - Optional data to include in the error.
	*/
	constructor(code, message, data) {
		if (!isValidEthProviderCode(code)) throw new Error("\"code\" must be an integer such that: 1000 <= code <= 4999");
		super(code, message, data);
	}
};
/**
* Check if the given code is a valid JSON-RPC error code.
*
* @param code - The code to check.
* @returns Whether the code is valid.
*/
function isValidEthProviderCode(code) {
	return Number.isInteger(code) && code >= 1e3 && code <= 4999;
}
/**
* A JSON replacer function that omits circular references.
*
* @param _ - The key being replaced.
* @param value - The value being replaced.
* @returns The value to use in place of the original value.
*/
function stringifyReplacer(_, value) {
	if (value === "[Circular]") return;
	return value;
}
//#endregion
//#region node_modules/@metamask/rpc-errors/dist/errors.mjs
var rpcErrors = {
	parse: (arg) => getJsonRpcError(errorCodes.rpc.parse, arg),
	invalidRequest: (arg) => getJsonRpcError(errorCodes.rpc.invalidRequest, arg),
	invalidParams: (arg) => getJsonRpcError(errorCodes.rpc.invalidParams, arg),
	methodNotFound: (arg) => getJsonRpcError(errorCodes.rpc.methodNotFound, arg),
	internal: (arg) => getJsonRpcError(errorCodes.rpc.internal, arg),
	server: (opts) => {
		if (!opts || typeof opts !== "object" || Array.isArray(opts)) throw new Error("Ethereum RPC Server errors must provide single object argument.");
		const { code } = opts;
		if (!Number.isInteger(code) || code > -32005 || code < -32099) throw new Error("\"code\" must be an integer such that: -32099 <= code <= -32005");
		return getJsonRpcError(code, opts);
	},
	invalidInput: (arg) => getJsonRpcError(errorCodes.rpc.invalidInput, arg),
	resourceNotFound: (arg) => getJsonRpcError(errorCodes.rpc.resourceNotFound, arg),
	resourceUnavailable: (arg) => getJsonRpcError(errorCodes.rpc.resourceUnavailable, arg),
	transactionRejected: (arg) => getJsonRpcError(errorCodes.rpc.transactionRejected, arg),
	methodNotSupported: (arg) => getJsonRpcError(errorCodes.rpc.methodNotSupported, arg),
	limitExceeded: (arg) => getJsonRpcError(errorCodes.rpc.limitExceeded, arg)
};
var providerErrors = {
	userRejectedRequest: (arg) => {
		return getEthProviderError(errorCodes.provider.userRejectedRequest, arg);
	},
	unauthorized: (arg) => {
		return getEthProviderError(errorCodes.provider.unauthorized, arg);
	},
	unsupportedMethod: (arg) => {
		return getEthProviderError(errorCodes.provider.unsupportedMethod, arg);
	},
	disconnected: (arg) => {
		return getEthProviderError(errorCodes.provider.disconnected, arg);
	},
	chainDisconnected: (arg) => {
		return getEthProviderError(errorCodes.provider.chainDisconnected, arg);
	},
	custom: (opts) => {
		if (!opts || typeof opts !== "object" || Array.isArray(opts)) throw new Error("Ethereum Provider custom errors must provide single object argument.");
		const { code, message, data } = opts;
		if (!message || typeof message !== "string") throw new Error("\"message\" must be a nonempty string");
		return new EthereumProviderError(code, message, data);
	}
};
/**
* Get a generic JSON-RPC error class instance.
*
* @param code - The error code.
* @param arg - The error message or options bag.
* @returns An instance of the {@link JsonRpcError} class.
*/
function getJsonRpcError(code, arg) {
	const [message, data] = parseOpts(arg);
	return new JsonRpcError(code, message ?? getMessageFromCode(code), data);
}
/**
* Get an Ethereum Provider error class instance.
*
* @param code - The error code.
* @param arg - The error message or options bag.
* @returns An instance of the {@link EthereumProviderError} class.
*/
function getEthProviderError(code, arg) {
	const [message, data] = parseOpts(arg);
	return new EthereumProviderError(code, message ?? getMessageFromCode(code), data);
}
/**
* Get an error message and optional data from an options bag.
*
* @param arg - The error message or options bag.
* @returns A tuple containing the error message and optional data.
*/
function parseOpts(arg) {
	if (arg) {
		if (typeof arg === "string") return [arg];
		else if (typeof arg === "object" && !Array.isArray(arg)) {
			const { message, data } = arg;
			if (message && typeof message !== "string") throw new Error("Must specify string message.");
			return [message ?? void 0, data];
		}
	}
	return [];
}
//#endregion
//#region node_modules/@gemini-wallet/core/dist/index.js
var package_default = {
	name: "@gemini-wallet/core",
	version: "0.3.2",
	description: "Core SDK for Gemini Wallet integration with popup communication",
	main: "./dist/index.cjs",
	types: "./dist/index.d.ts",
	type: "module",
	repository: {
		type: "git",
		url: "git+https://github.com/gemini/gemini-wallet-core.git"
	},
	homepage: "https://keys.gemini.com",
	bugs: { url: "https://github.com/gemini/gemini-wallet-core/issues" },
	license: "MIT",
	author: "Gemini",
	files: [
		"dist",
		"src",
		"README.md",
		"LICENSE"
	],
	exports: {
		".": {
			types: "./dist/index.d.ts",
			import: "./dist/index.js",
			require: "./dist/index.cjs"
		},
		"./package.json": "./package.json"
	},
	scripts: {
		build: "dotenv -e .env.production -- tsup",
		dev: "dotenv -e .env.local -- tsup --watch",
		typecheck: "tsc --noEmit",
		lint: "eslint ./src",
		"lint:ci": "eslint --max-warnings 0 ./src",
		"lint:fix": "eslint ./src --fix",
		test: "bun test"
	},
	dependencies: {
		"@metamask/rpc-errors": "7.0.2",
		eventemitter3: "5.0.1"
	},
	devDependencies: {
		"@eslint/eslintrc": "3.3.1",
		"@eslint/js": "9.38.0",
		"@types/node": "22.13.0",
		"dotenv-cli": "10.0.0",
		"esbuild-plugin-replace": "1.4.0",
		eslint: "9.38.0",
		"eslint-config-prettier": "10.1.8",
		"eslint-config-turbo": "2.5.6",
		"eslint-plugin-import": "2.32.0",
		"eslint-plugin-only-warn": "1.1.0",
		"eslint-plugin-prettier": "5.5.4",
		"eslint-plugin-simple-import-sort": "12.1.1",
		"eslint-plugin-sort-keys-fix": "1.1.2",
		globals: "16.4.0",
		prettier: "3.6.2",
		tsup: "8.5.0",
		typescript: "5.5.3",
		"typescript-eslint": "8.40.0",
		vitest: "3.2.4"
	},
	peerDependencies: { viem: ">=2.0.0" },
	keywords: [
		"gemini",
		"wallet",
		"sdk",
		"ethereum",
		"web3",
		"crypto"
	],
	module: "./dist/index.js"
};
var SDK_BACKEND_URL = "https://keys.gemini.com";
var SDK_VERSION = package_default.version;
var DEFAULT_CHAIN_ID = 42161;
var MAINNET_CHAIN_IDS = {
	ARBITRUM_ONE: 42161,
	BASE: 8453,
	ETHEREUM: 1,
	OP_MAINNET: 10,
	POLYGON: 137
};
var TESTNET_CHAIN_IDS = {
	ARBITRUM_SEPOLIA: 421614,
	BASE_SEPOLIA: 84532,
	OP_SEPOLIA: 11155420,
	POLYGON_AMOY: 80002,
	SEPOLIA: 11155111
};
var SUPPORTED_CHAIN_IDS = [...Object.values(MAINNET_CHAIN_IDS), ...Object.values(TESTNET_CHAIN_IDS)];
function getDefaultRpcUrl(chainId) {
	return {
		[mainnet.id]: mainnet.rpcUrls.default.http[0],
		[arbitrum.id]: arbitrum.rpcUrls.default.http[0],
		[optimism.id]: optimism.rpcUrls.default.http[0],
		[base.id]: base.rpcUrls.default.http[0],
		[polygon.id]: polygon.rpcUrls.default.http[0],
		[sepolia.id]: sepolia.rpcUrls.default.http[0],
		[arbitrumSepolia.id]: arbitrumSepolia.rpcUrls.default.http[0],
		[optimismSepolia.id]: optimismSepolia.rpcUrls.default.http[0],
		[baseSepolia.id]: baseSepolia.rpcUrls.default.http[0],
		[polygonAmoy.id]: polygonAmoy.rpcUrls.default.http[0]
	}[chainId];
}
var ProviderEventEmitter = class extends import_eventemitter3.default {};
var SHARED_CONTRACT_ADDRESSES = {
	ATTESTER: "0x000474392a9cd86a4687354f1Ce2964B52e97484",
	BOOTSTRAPPER: "0x00000000D3254452a909E4eeD47455Af7E27C289",
	REGISTRY: "0x000000000069E2a187AEFFb852bF3cCdC95151B2"
};
({ ...SHARED_CONTRACT_ADDRESSES });
({ ...SHARED_CONTRACT_ADDRESSES });
var POPUP_WIDTH2 = 420;
var POPUP_HEIGHT2 = 650;
var openPopup = (url) => {
	const left = (window.innerWidth - POPUP_WIDTH2) / 2 + window.screenX;
	const top = (window.innerHeight - POPUP_HEIGHT2) / 2 + window.screenY;
	const popupId = `wallet_${window?.crypto?.randomUUID()}`;
	const popup = window.open(url, popupId, `width=${POPUP_WIDTH2}, height=${POPUP_HEIGHT2}, left=${left}, top=${top}`);
	popup?.focus();
	if (!popup) throw rpcErrors.internal("Pop up window failed to open");
	return popup;
};
var closePopup = (popup) => {
	if (popup && !popup.closed) {
		popup.opener?.focus();
		popup.close();
	}
};
var hexStringFromNumber = (num) => {
	return `0x${BigInt(num).toString(16)}`;
};
var safeJsonStringify = (obj) => JSON.stringify(obj, (_, value) => typeof value === "bigint" ? value.toString() + "n" : value, 2);
var Communicator = class {
	constructor({ appMetadata, onDisconnectCallback }) {
		this.popup = null;
		this.listeners = /* @__PURE__ */ new Map();
		this.postMessage = async (message) => {
			(await this.waitForPopupLoaded()).postMessage(message, this.url.origin);
		};
		this.postRequestAndWaitForResponse = async (request) => {
			const responsePromise = this.onMessage(({ requestId }) => requestId === request.requestId);
			this.postMessage(request);
			return await responsePromise;
		};
		this.onMessage = (predicate) => {
			return new Promise((resolve, reject) => {
				const listener = (event) => {
					if (event.origin !== this.url.origin) return;
					const message = event.data;
					if (predicate(message)) {
						resolve(message);
						window.removeEventListener("message", listener);
						this.listeners.delete(listener);
					}
				};
				window.addEventListener("message", listener);
				this.listeners.set(listener, { reject });
			});
		};
		this.onRequestCancelled = () => {
			closePopup(this.popup);
			this.popup = null;
			this.listeners.forEach(({ reject }, listener) => {
				reject(providerErrors.userRejectedRequest());
				window.removeEventListener("message", listener);
			});
			this.listeners.clear();
		};
		this.waitForPopupLoaded = () => {
			if (this.popup && !this.popup.closed) {
				this.popup.focus();
				return Promise.resolve(this.popup);
			}
			this.popup = openPopup(this.url);
			this.onMessage(({ event }) => event === "POPUP_UNLOADED").then(this.onRequestCancelled).catch(() => {});
			this.onMessage(({ event }) => event === "SDK_DISCONNECT").then(() => {
				this.onDisconnectCallback?.();
				this.onRequestCancelled();
			}).catch(() => {});
			return this.onMessage(({ event }) => event === "POPUP_LOADED").then((message) => {
				this.postMessage({
					chainId: DEFAULT_CHAIN_ID,
					data: {
						appMetadata: this.appMetadata,
						origin: window.location.origin,
						sdkVersion: SDK_VERSION
					},
					event: "POPUP_APP_CONTEXT",
					origin: window.location.origin,
					requestId: message.requestId
				});
			}).then(() => {
				if (!this.popup) throw rpcErrors.internal();
				return this.popup;
			});
		};
		this.url = new URL(SDK_BACKEND_URL);
		this.appMetadata = appMetadata;
		this.onDisconnectCallback = onDisconnectCallback;
	}
};
var memoryStorage = {};
var GeminiStorage = class {
	constructor({ scope = "@gemini", module = "wallet" } = {}) {
		this.scope = scope;
		this.module = module;
	}
	scopedKey(key) {
		return `${this.scope}.${this.module}.${key}`;
	}
	async storeObject(key, item) {
		const json = safeJsonStringify(item);
		await this.setItem(key, json);
	}
	async loadObject(key, fallback) {
		const item = await this.getItem(key);
		if (!item) {
			await this.storeObject(key, fallback);
			return fallback;
		}
		try {
			return JSON.parse(item);
		} catch (error) {
			console.error(`Error parsing JSON for key ${key}:`, error);
			return fallback;
		}
	}
	async setItem(key, value) {
		const scoped = this.scopedKey(key);
		try {
			localStorage.setItem(scoped, value);
		} catch (e) {
			console.warn("localStorage not available, using memory storage", e);
			memoryStorage[scoped] = value;
		}
	}
	async getItem(key) {
		const scoped = this.scopedKey(key);
		try {
			return localStorage.getItem(scoped);
		} catch (e) {
			console.warn("localStorage not available, using memory storage", e);
			return memoryStorage[scoped] || null;
		}
	}
	async removeItem(key) {
		const scoped = this.scopedKey(key);
		try {
			localStorage.removeItem(scoped);
		} catch (e) {
			console.warn("localStorage not available, using memory storage", e);
			delete memoryStorage[scoped];
		}
	}
	async removeItems(keys) {
		await Promise.all(keys.map((key) => this.removeItem(key)));
	}
};
var STORAGE_ETH_ACCOUNTS_KEY = "eth-accounts";
var STORAGE_ETH_ACTIVE_CHAIN_KEY = "eth-active-chain";
var STORAGE_CALL_BATCHES_KEY = "call-batches";
function isChainSupportedByGeminiSw(chainId) {
	return SUPPORTED_CHAIN_IDS.includes(chainId);
}
var GeminiWallet = class {
	constructor({ appMetadata, chain, onDisconnectCallback, storage }) {
		this.accounts = [];
		this.chain = { id: DEFAULT_CHAIN_ID };
		this.communicator = new Communicator({
			appMetadata,
			onDisconnectCallback
		});
		this.storage = storage || new GeminiStorage();
		const fallbackChainId = chain?.id ?? 42161;
		const defaultChain = {
			id: fallbackChainId,
			rpcUrl: chain?.rpcUrl ?? getDefaultRpcUrl(fallbackChainId)
		};
		this.initPromise = this.initializeFromStorage(defaultChain);
	}
	async initializeFromStorage(defaultChain) {
		const fallbackChain = {
			...defaultChain,
			rpcUrl: defaultChain.rpcUrl || getDefaultRpcUrl(defaultChain.id)
		};
		const [storedChain, storedAccounts] = await Promise.all([this.storage.loadObject(STORAGE_ETH_ACTIVE_CHAIN_KEY, fallbackChain), this.storage.loadObject(STORAGE_ETH_ACCOUNTS_KEY, this.accounts)]);
		this.chain = {
			...storedChain,
			rpcUrl: storedChain.rpcUrl || getDefaultRpcUrl(storedChain.id)
		};
		this.accounts = storedAccounts;
	}
	async ensureInitialized() {
		await this.initPromise;
	}
	async connect() {
		await this.ensureInitialized();
		const response = await this.sendMessageToPopup({
			chainId: this.chain.id,
			event: "SDK_CONNECT",
			origin: window.location.origin
		});
		this.accounts = response.data.address ? [response.data.address] : [];
		await this.storage.storeObject(STORAGE_ETH_ACCOUNTS_KEY, this.accounts);
		return this.accounts;
	}
	async disconnect() {
		await this.ensureInitialized();
		this.accounts = [];
		await this.storage.storeObject(STORAGE_ETH_ACCOUNTS_KEY, this.accounts);
	}
	async switchChain({ id }) {
		await this.ensureInitialized();
		if (isChainSupportedByGeminiSw(id)) {
			this.chain = {
				id,
				rpcUrl: getDefaultRpcUrl(id)
			};
			await this.storage.storeObject(STORAGE_ETH_ACTIVE_CHAIN_KEY, this.chain);
			return null;
		}
		return (await this.sendMessageToPopup({
			chainId: this.chain.id,
			data: id,
			event: "SDK_SWITCH_CHAIN",
			origin: window.location.origin
		})).data.error ?? "Unsupported chain.";
	}
	async sendTransaction(txData) {
		await this.ensureInitialized();
		return (await this.sendMessageToPopup({
			chainId: this.chain.id,
			data: txData,
			event: "SDK_SEND_TRANSACTION",
			origin: window.location.origin
		})).data;
	}
	async signData({ message }) {
		await this.ensureInitialized();
		return (await this.sendMessageToPopup({
			chainId: this.chain.id,
			data: { message },
			event: "SDK_SIGN_DATA",
			origin: window.location.origin
		})).data;
	}
	async signTypedData({ message, types, primaryType, domain }) {
		await this.ensureInitialized();
		return (await this.sendMessageToPopup({
			chainId: this.chain.id,
			data: {
				domain,
				message,
				primaryType,
				types
			},
			event: "SDK_SIGN_TYPED_DATA",
			origin: window.location.origin
		})).data;
	}
	async openSettings() {
		await this.ensureInitialized();
		await this.sendMessageToPopup({
			chainId: this.chain.id,
			data: {},
			event: "SDK_OPEN_SETTINGS",
			origin: window.location.origin
		});
	}
	getCapabilities(requestedChainIds) {
		const capabilities = {};
		const chainIds = requestedChainIds?.map((id) => parseInt(id, 16)) || [this.chain.id];
		for (const chainId of chainIds) {
			const chainIdHex = hexStringFromNumber(chainId);
			capabilities[chainIdHex] = {
				atomic: { status: "supported" },
				paymasterService: { supported: true }
			};
		}
		return capabilities;
	}
	async sendCalls(params) {
		await this.ensureInitialized();
		const batchId = window?.crypto?.randomUUID() || `batch-${Date.now()}-${Math.random()}`;
		const requestedChainId = parseInt(params.chainId, 16);
		if (requestedChainId !== this.chain.id) throw new Error(`Chain mismatch. Expected ${this.chain.id}, got ${requestedChainId}`);
		if (!params.calls || params.calls.length === 0) throw new Error("No calls provided");
		const batchMetadata = {
			calls: params.calls,
			capabilities: params.capabilities,
			chainId: params.chainId,
			from: params.from,
			id: batchId,
			status: "pending",
			timestamp: Date.now()
		};
		const batches = await this.storage.loadObject(STORAGE_CALL_BATCHES_KEY, {});
		batches[batchId] = batchMetadata;
		await this.storage.storeObject(STORAGE_CALL_BATCHES_KEY, batches);
		try {
			const response = await this.sendMessageToPopup({
				chainId: this.chain.id,
				data: { calls: params.calls },
				event: "SDK_SEND_BATCH_CALLS",
				origin: window.location.origin
			});
			if (response.data.error) throw new Error(response.data.error);
			batchMetadata.transactionHash = response.data.hash;
			batchMetadata.status = "pending";
			batches[batchId] = batchMetadata;
			await this.storage.storeObject(STORAGE_CALL_BATCHES_KEY, batches);
			return {
				capabilities: { caip345: {
					caip2: `eip155:${requestedChainId}`,
					transactionHashes: [response.data.hash]
				} },
				id: batchId
			};
		} catch (error) {
			batchMetadata.status = "failed";
			batches[batchId] = batchMetadata;
			await this.storage.storeObject(STORAGE_CALL_BATCHES_KEY, batches);
			throw error;
		}
	}
	async getCallsStatus(batchId) {
		await this.ensureInitialized();
		const batches = await this.storage.loadObject(STORAGE_CALL_BATCHES_KEY, {});
		const batch = batches[batchId];
		if (!batch) throw new Error(`Unknown bundle ID: ${batchId}`);
		if (batch.transactionHash && this.chain.rpcUrl) try {
			const receipt = (await (await fetch(this.chain.rpcUrl, {
				body: JSON.stringify({
					id: 1,
					jsonrpc: "2.0",
					method: "eth_getTransactionReceipt",
					params: [batch.transactionHash]
				}),
				headers: { "Content-Type": "application/json" },
				method: "POST"
			})).json()).result;
			if (receipt) {
				const receiptStatus = receipt.status === "0x1" ? "confirmed" : "reverted";
				batch.status = receiptStatus;
				batches[batchId] = batch;
				await this.storage.storeObject(STORAGE_CALL_BATCHES_KEY, batches);
				return {
					atomic: true,
					chainId: batch.chainId,
					id: batchId,
					receipts: [{
						blockHash: receipt.blockHash,
						blockNumber: receipt.blockNumber,
						gasUsed: receipt.gasUsed,
						logs: receipt.logs.map((log) => ({
							address: log.address,
							data: log.data,
							topics: log.topics
						})),
						status: receiptStatus === "confirmed" ? "success" : "reverted",
						transactionHash: receipt.transactionHash
					}],
					status: receiptStatus === "confirmed" ? 200 : 500,
					version: "2.0.0"
				};
			}
		} catch (error) {
			console.error("Failed to fetch transaction receipt:", error);
		}
		let statusCode;
		switch (batch.status) {
			case "pending":
				statusCode = 100;
				break;
			case "confirmed":
				statusCode = 200;
				break;
			case "failed":
				statusCode = 400;
				break;
			case "reverted":
				statusCode = 500;
				break;
			default: statusCode = 100;
		}
		return {
			atomic: true,
			chainId: batch.chainId,
			id: batchId,
			status: statusCode,
			version: "2.0.0"
		};
	}
	async showCallsStatus(batchId) {
		await this.ensureInitialized();
		if (!(await this.storage.loadObject("call-batches", {}))[batchId]) throw new Error(`Unknown bundle ID: ${batchId}`);
	}
	sendMessageToPopup(request) {
		return this.communicator.postRequestAndWaitForResponse({
			...request,
			requestId: window?.crypto?.randomUUID()
		});
	}
};
var fetchRpcRequest = async (request, rpcUrl) => {
	const requestBody = {
		...request,
		id: window?.crypto?.randomUUID(),
		jsonrpc: "2.0"
	};
	const { result, error } = await (await window.fetch(rpcUrl, {
		body: JSON.stringify(requestBody),
		headers: { "Content-Type": "application/json" },
		method: "POST",
		mode: "cors"
	})).json();
	if (error) throw error;
	return result;
};
function validateRpcRequestArgs(args) {
	if (!args || typeof args !== "object" || Array.isArray(args)) throw rpcErrors.invalidParams({ message: "Expected a single, non-array, object argument." });
	const { method, params } = args;
	if (typeof method !== "string" || method.length === 0) throw rpcErrors.invalidParams({ message: "'args.method' must be a non-empty string." });
	if (params !== void 0 && !Array.isArray(params) && (typeof params !== "object" || params === null)) throw rpcErrors.invalidParams({ message: "'args.params' must be an object or array if provided." });
}
function convertSendValuesToBigInt(tx) {
	const FIELDS_TO_NORMALIZE = [
		"value",
		"gas",
		"gasPrice",
		"maxPriorityFeePerGas",
		"maxFeePerGas"
	];
	const normalized = { ...tx };
	for (const field of FIELDS_TO_NORMALIZE) {
		if (!(field in tx)) continue;
		const value = tx[field];
		if (typeof value === "bigint") continue;
		if (isHex(value)) normalized[field] = BigInt(value);
	}
	return normalized;
}
var GeminiWalletProvider = class extends ProviderEventEmitter {
	constructor(providerConfig) {
		super();
		this.wallet = null;
		this.config = providerConfig;
		const userDisconnectCallback = providerConfig.onDisconnectCallback;
		this.wallet = new GeminiWallet({
			...providerConfig,
			onDisconnectCallback: () => {
				userDisconnectCallback?.();
				this.disconnect();
			}
		});
	}
	async request(args) {
		try {
			validateRpcRequestArgs(args);
			if (!this.wallet?.accounts?.length) switch (args.method) {
				case "eth_requestAccounts":
					if (!this.wallet) {
						const userDisconnectCallback = this.config.onDisconnectCallback;
						this.wallet = new GeminiWallet({
							...this.config,
							onDisconnectCallback: () => {
								userDisconnectCallback?.();
								this.disconnect();
							}
						});
					}
					await this.wallet.connect();
					this.emit("accountsChanged", this.wallet.accounts);
					break;
				case "net_version": return DEFAULT_CHAIN_ID;
				case "eth_chainId": return hexStringFromNumber(DEFAULT_CHAIN_ID);
				default: throw providerErrors.unauthorized();
			}
			let response;
			let requestParams;
			switch (args.method) {
				case "eth_requestAccounts":
				case "eth_accounts":
					response = this.wallet.accounts;
					break;
				case "net_version":
					response = this.wallet.chain.id;
					break;
				case "eth_chainId":
					response = hexStringFromNumber(this.wallet.chain.id);
					break;
				case "personal_sign":
				case "wallet_sign":
					requestParams = args.params;
					response = await this.wallet.signData({
						account: requestParams[1],
						message: requestParams[0]
					});
					if (response.error) throw rpcErrors.transactionRejected(response.error);
					else response = response.hash;
					break;
				case "eth_sendTransaction":
				case "wallet_sendTransaction":
					requestParams = args.params;
					requestParams = convertSendValuesToBigInt(requestParams[0]);
					response = await this.wallet.sendTransaction(requestParams);
					if (response.error) throw rpcErrors.transactionRejected(response.error);
					else response = response.hash;
					break;
				case "wallet_switchEthereumChain": {
					const rawParams = args.params;
					let chainId;
					if (Array.isArray(rawParams) && rawParams[0]?.chainId) chainId = parseInt(rawParams[0].chainId, 16);
					else if (rawParams && typeof rawParams === "object" && "id" in rawParams && Number.isInteger(rawParams.id)) chainId = rawParams.id;
					else throw rpcErrors.invalidParams("Invalid chain id argument. Expected [{ chainId: hex_string }] or { id: number }.");
					response = await this.wallet.switchChain({ id: chainId });
					if (response) throw providerErrors.custom({
						code: 4902,
						message: response
					});
					await this.emit("chainChanged", hexStringFromNumber(chainId));
					break;
				}
				case "eth_signTypedData_v1":
				case "eth_signTypedData_v2":
				case "eth_signTypedData_v3":
				case "eth_signTypedData_v4":
				case "eth_signTypedData": {
					requestParams = args.params;
					const signedTypedDataParams = JSON.parse(requestParams[1]);
					response = await this.wallet.signTypedData({
						account: requestParams[0],
						domain: signedTypedDataParams.domain,
						message: signedTypedDataParams.message,
						primaryType: signedTypedDataParams.primaryType,
						types: signedTypedDataParams.types
					});
					if (response.error) throw rpcErrors.transactionRejected(response.error);
					else response = response.hash;
					break;
				}
				case "wallet_getCapabilities": {
					const capabilityParams = Array.isArray(args.params) ? args.params : void 0;
					response = this.getCapabilities(capabilityParams);
					break;
				}
				case "wallet_sendCalls":
					requestParams = args.params;
					response = await this.sendCalls(requestParams[0]);
					break;
				case "wallet_getCallsStatus":
					requestParams = args.params;
					response = await this.getCallsStatus(requestParams[0]);
					break;
				case "wallet_showCallsStatus":
					requestParams = args.params;
					await this.showCallsStatus(requestParams[0]);
					response = null;
					break;
				case "eth_ecRecover":
				case "eth_subscribe":
				case "eth_unsubscribe":
				case "personal_ecRecover":
				case "eth_signTransaction":
				case "wallet_watchAsset":
				case "wallet_grantPermissions": throw rpcErrors.methodNotSupported("Not yet implemented.");
				case "eth_sign":
				case "eth_coinbase":
				case "wallet_addEthereumChain": throw rpcErrors.methodNotSupported();
				default:
					if (!this.wallet.chain.rpcUrl) throw rpcErrors.internal(`RPC URL missing for current chain (${this.wallet.chain.id})`);
					return fetchRpcRequest(args, this.wallet.chain.rpcUrl);
			}
			return response;
		} catch (error) {
			const { code } = error;
			if (code === errorCodes.provider.unauthorized) this.disconnect();
			return Promise.reject(serializeError(error));
		}
	}
	async openSettings() {
		await this.wallet?.openSettings();
	}
	getCapabilities(params) {
		if (!this.wallet) throw providerErrors.unauthorized();
		const requestedChainIds = params?.[0];
		return this.wallet.getCapabilities(requestedChainIds);
	}
	async sendCalls(params) {
		if (!this.wallet) throw providerErrors.unauthorized();
		try {
			return await this.wallet.sendCalls(params);
		} catch (error) {
			throw rpcErrors.transactionRejected(error instanceof Error ? error.message : String(error));
		}
	}
	async getCallsStatus(batchId) {
		if (!this.wallet) throw providerErrors.unauthorized();
		try {
			return await this.wallet.getCallsStatus(batchId);
		} catch (error) {
			throw rpcErrors.invalidParams(error instanceof Error ? error.message : String(error));
		}
	}
	async showCallsStatus(batchId) {
		if (!this.wallet) throw providerErrors.unauthorized();
		try {
			await this.wallet.showCallsStatus(batchId);
		} catch (error) {
			throw rpcErrors.invalidParams(error instanceof Error ? error.message : String(error));
		}
	}
	async disconnect() {
		if (this.wallet) {
			const storage = this.config.storage || new GeminiStorage();
			await storage.removeItem(STORAGE_ETH_ACCOUNTS_KEY);
			await storage.removeItem(STORAGE_ETH_ACTIVE_CHAIN_KEY);
		}
		this.wallet = null;
		this.config.onDisconnectCallback?.();
		await this.emit("disconnect", "User initiated disconnection");
		await this.emit("accountsChanged", []);
	}
};
//#endregion
//#region node_modules/@wagmi/connectors/dist/esm/gemini.js
gemini.type = "gemini";
function gemini(parameters = {}) {
	let walletProvider;
	let onAccountsChanged;
	let onChainChanged;
	let onDisconnect;
	return createConnector((config) => ({
		id: "gemini",
		name: "Gemini Wallet",
		type: gemini.type,
		icon: "https://keys.gemini.com/images/gemini-wallet-logo.svg",
		async connect({ chainId, withCapabilities } = {}) {
			try {
				const provider = await this.getProvider();
				const accounts = await provider.request({ method: "eth_requestAccounts" });
				if (!onAccountsChanged) {
					onAccountsChanged = this.onAccountsChanged.bind(this);
					provider.on("accountsChanged", onAccountsChanged);
				}
				if (!onChainChanged) {
					onChainChanged = this.onChainChanged.bind(this);
					provider.on("chainChanged", onChainChanged);
				}
				if (!onDisconnect) {
					onDisconnect = this.onDisconnect.bind(this);
					provider.on("disconnect", onDisconnect);
				}
				let currentChainId = await this.getChainId();
				if (chainId && currentChainId !== chainId) currentChainId = (await this.switchChain({ chainId }).catch((error) => {
					if (error.code === UserRejectedRequestError.code) throw error;
					return { id: currentChainId };
				}))?.id ?? currentChainId;
				return {
					accounts: withCapabilities ? accounts.map((address) => ({
						address,
						capabilities: {}
					})) : accounts,
					chainId: currentChainId
				};
			} catch (error) {
				if (/(user closed modal|accounts received is empty|user denied account|request rejected)/i.test(error.message)) throw new UserRejectedRequestError(error);
				throw error;
			}
		},
		async disconnect() {
			const provider = await this.getProvider();
			if (onAccountsChanged) {
				provider.removeListener("accountsChanged", onAccountsChanged);
				onAccountsChanged = void 0;
			}
			if (onChainChanged) {
				provider.removeListener("chainChanged", onChainChanged);
				onChainChanged = void 0;
			}
			if (onDisconnect) {
				provider.removeListener("disconnect", onDisconnect);
				onDisconnect = void 0;
			}
			await provider.disconnect();
		},
		async getAccounts() {
			return (await (await this.getProvider()).request({ method: "eth_accounts" })).map((x) => getAddress(x));
		},
		async getChainId() {
			const chainId = await (await this.getProvider()).request({ method: "eth_chainId" });
			return Number(chainId);
		},
		async getProvider() {
			if (!walletProvider) walletProvider = new GeminiWalletProvider({
				appMetadata: parameters.appMetadata ?? {},
				chain: {
					id: config.chains[0]?.id ?? 1,
					rpcUrl: config.chains[0]?.rpcUrls?.default?.http[0]
				}
			});
			return walletProvider;
		},
		async isAuthorized() {
			try {
				const accounts = await this.getAccounts();
				return Boolean(accounts.length);
			} catch {
				return false;
			}
		},
		async switchChain({ chainId }) {
			const chain = config.chains.find((chain) => chain.id === chainId);
			if (!chain) throw new SwitchChainError(new ChainNotConfiguredError());
			const provider = await this.getProvider();
			try {
				await provider.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId: numberToHex(chainId) }]
				});
				return chain;
			} catch (error) {
				throw new SwitchChainError(error);
			}
		},
		onAccountsChanged(accounts) {
			if (accounts.length === 0) this.onDisconnect();
			else config.emitter.emit("change", { accounts: accounts.map((x) => getAddress(x)) });
		},
		onChainChanged(chain) {
			const chainId = Number(chain);
			config.emitter.emit("change", { chainId });
		},
		async onDisconnect() {
			config.emitter.emit("disconnect");
			const provider = await this.getProvider();
			if (onAccountsChanged) {
				provider.removeListener("accountsChanged", onAccountsChanged);
				onAccountsChanged = void 0;
			}
			if (onChainChanged) {
				provider.removeListener("chainChanged", onChainChanged);
				onChainChanged = void 0;
			}
			if (onDisconnect) {
				provider.removeListener("disconnect", onDisconnect);
				onDisconnect = void 0;
			}
		}
	}));
}
//#endregion
//#region node_modules/@wagmi/connectors/dist/esm/metaMask.js
metaMask.type = "metaMask";
function metaMask(parameters = {}) {
	let sdk;
	let provider;
	let providerPromise;
	let accountsChanged;
	let chainChanged;
	let connect;
	let displayUri;
	let disconnect;
	return createConnector((config) => ({
		id: "metaMaskSDK",
		name: "MetaMask",
		rdns: ["io.metamask", "io.metamask.mobile"],
		type: metaMask.type,
		async setup() {
			const provider = await this.getProvider();
			if (provider?.on) {
				if (!connect) {
					connect = this.onConnect.bind(this);
					provider.on("connect", connect);
				}
				if (!accountsChanged) {
					accountsChanged = this.onAccountsChanged.bind(this);
					provider.on("accountsChanged", accountsChanged);
				}
			}
		},
		async connect({ chainId, isReconnecting, withCapabilities } = {}) {
			const provider = await this.getProvider();
			if (!displayUri) {
				displayUri = this.onDisplayUri;
				provider.on("display_uri", displayUri);
			}
			let accounts = [];
			if (isReconnecting) accounts = await this.getAccounts().catch(() => []);
			try {
				let signResponse;
				let connectWithResponse;
				if (!accounts?.length) if (parameters.connectAndSign || parameters.connectWith) {
					if (parameters.connectAndSign) signResponse = await sdk.connectAndSign({ msg: parameters.connectAndSign });
					else if (parameters.connectWith) connectWithResponse = await sdk.connectWith({
						method: parameters.connectWith.method,
						params: parameters.connectWith.params
					});
					accounts = await this.getAccounts();
				} else accounts = (await sdk.connect()).map((x) => getAddress(x));
				let currentChainId = await this.getChainId();
				if (chainId && currentChainId !== chainId) currentChainId = (await this.switchChain({ chainId }).catch((error) => {
					if (error.code === UserRejectedRequestError.code) throw error;
					return { id: currentChainId };
				}))?.id ?? currentChainId;
				if (displayUri) {
					provider.removeListener("display_uri", displayUri);
					displayUri = void 0;
				}
				if (signResponse) provider.emit("connectAndSign", {
					accounts,
					chainId: currentChainId,
					signResponse
				});
				else if (connectWithResponse) provider.emit("connectWith", {
					accounts,
					chainId: currentChainId,
					connectWithResponse
				});
				if (connect) {
					provider.removeListener("connect", connect);
					connect = void 0;
				}
				if (!accountsChanged) {
					accountsChanged = this.onAccountsChanged.bind(this);
					provider.on("accountsChanged", accountsChanged);
				}
				if (!chainChanged) {
					chainChanged = this.onChainChanged.bind(this);
					provider.on("chainChanged", chainChanged);
				}
				if (!disconnect) {
					disconnect = this.onDisconnect.bind(this);
					provider.on("disconnect", disconnect);
				}
				return {
					accounts: withCapabilities ? accounts.map((address) => ({
						address,
						capabilities: {}
					})) : accounts,
					chainId: currentChainId
				};
			} catch (err) {
				const error = err;
				if (error.code === UserRejectedRequestError.code) throw new UserRejectedRequestError(error);
				if (error.code === ResourceUnavailableRpcError.code) throw new ResourceUnavailableRpcError(error);
				throw error;
			}
		},
		async disconnect() {
			const provider = await this.getProvider();
			if (chainChanged) {
				provider.removeListener("chainChanged", chainChanged);
				chainChanged = void 0;
			}
			if (disconnect) {
				provider.removeListener("disconnect", disconnect);
				disconnect = void 0;
			}
			if (!connect) {
				connect = this.onConnect.bind(this);
				provider.on("connect", connect);
			}
			await sdk.terminate();
		},
		async getAccounts() {
			return (await (await this.getProvider()).request({ method: "eth_accounts" })).map((x) => getAddress(x));
		},
		async getChainId() {
			const provider = await this.getProvider();
			const chainId = provider.getChainId() || await provider?.request({ method: "eth_chainId" });
			return Number(chainId);
		},
		async getProvider() {
			async function initProvider() {
				const MetaMaskSDK = await (async () => {
					const { default: SDK } = await import("./metamask-sdk-D2WIc-or.js");
					if (typeof SDK !== "function" && typeof SDK.default === "function") return SDK.default;
					return SDK;
				})();
				const readonlyRPCMap = {};
				for (const chain of config.chains) readonlyRPCMap[numberToHex(chain.id)] = extractRpcUrls({
					chain,
					transports: config.transports
				})?.[0];
				sdk = new MetaMaskSDK({
					_source: "wagmi",
					forceDeleteProvider: false,
					forceInjectProvider: false,
					injectProvider: false,
					...parameters,
					readonlyRPCMap,
					dappMetadata: {
						...parameters.dappMetadata,
						name: parameters.dappMetadata?.name ? parameters.dappMetadata?.name : "wagmi",
						url: parameters.dappMetadata?.url ? parameters.dappMetadata?.url : typeof window !== "undefined" ? window.location.origin : "https://wagmi.sh"
					},
					useDeeplink: parameters.useDeeplink ?? true
				});
				const result = await sdk.init();
				const provider = (() => {
					if (result?.activeProvider) return result.activeProvider;
					return sdk.getProvider();
				})();
				if (!provider) throw new ProviderNotFoundError();
				return provider;
			}
			if (!provider) {
				if (!providerPromise) providerPromise = initProvider();
				provider = await providerPromise;
			}
			return provider;
		},
		async isAuthorized() {
			try {
				const timeout = 200;
				return !!(await withRetry(() => withTimeout(() => this.getAccounts(), { timeout }), {
					delay: timeout + 1,
					retryCount: 3
				})).length;
			} catch {
				return false;
			}
		},
		async switchChain({ addEthereumChainParameter, chainId }) {
			const provider = await this.getProvider();
			const chain = config.chains.find((x) => x.id === chainId);
			if (!chain) throw new SwitchChainError(new ChainNotConfiguredError());
			try {
				await provider.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId: numberToHex(chainId) }]
				});
				await waitForChainIdToSync();
				await sendAndWaitForChangeEvent(chainId);
				return chain;
			} catch (err) {
				const error = err;
				if (error.code === UserRejectedRequestError.code) throw new UserRejectedRequestError(error);
				if (error.code === 4902 || error?.data?.originalError?.code === 4902) try {
					await provider.request({
						method: "wallet_addEthereumChain",
						params: [{
							blockExplorerUrls: (() => {
								const { default: blockExplorer, ...blockExplorers } = chain.blockExplorers ?? {};
								if (addEthereumChainParameter?.blockExplorerUrls) return addEthereumChainParameter.blockExplorerUrls;
								if (blockExplorer) return [blockExplorer.url, ...Object.values(blockExplorers).map((x) => x.url)];
							})(),
							chainId: numberToHex(chainId),
							chainName: addEthereumChainParameter?.chainName ?? chain.name,
							iconUrls: addEthereumChainParameter?.iconUrls,
							nativeCurrency: addEthereumChainParameter?.nativeCurrency ?? chain.nativeCurrency,
							rpcUrls: (() => {
								if (addEthereumChainParameter?.rpcUrls?.length) return addEthereumChainParameter.rpcUrls;
								return [chain.rpcUrls.default?.http[0] ?? ""];
							})()
						}]
					});
					await waitForChainIdToSync();
					await sendAndWaitForChangeEvent(chainId);
					return chain;
				} catch (err) {
					const error = err;
					if (error.code === UserRejectedRequestError.code) throw new UserRejectedRequestError(error);
					throw new SwitchChainError(error);
				}
				throw new SwitchChainError(error);
			}
			async function waitForChainIdToSync() {
				await withRetry(async () => {
					const value = hexToNumber(await provider.request({ method: "eth_chainId" }));
					if (value !== chainId) throw new Error("User rejected switch after adding network.");
					return value;
				}, {
					delay: 50,
					retryCount: 20
				});
			}
			async function sendAndWaitForChangeEvent(chainId) {
				await new Promise((resolve) => {
					const listener = ((data) => {
						if ("chainId" in data && data.chainId === chainId) {
							config.emitter.off("change", listener);
							resolve();
						}
					});
					config.emitter.on("change", listener);
					config.emitter.emit("change", { chainId });
				});
			}
		},
		async onAccountsChanged(accounts) {
			if (accounts.length === 0) if (sdk.isExtensionActive()) this.onDisconnect();
			else return;
			else if (config.emitter.listenerCount("connect")) {
				const chainId = (await this.getChainId()).toString();
				this.onConnect({ chainId });
			} else config.emitter.emit("change", { accounts: accounts.map((x) => getAddress(x)) });
		},
		onChainChanged(chain) {
			const chainId = Number(chain);
			config.emitter.emit("change", { chainId });
		},
		async onConnect(connectInfo) {
			const accounts = await this.getAccounts();
			if (accounts.length === 0) return;
			const chainId = Number(connectInfo.chainId);
			config.emitter.emit("connect", {
				accounts,
				chainId
			});
			const provider = await this.getProvider();
			if (connect) {
				provider.removeListener("connect", connect);
				connect = void 0;
			}
			if (!accountsChanged) {
				accountsChanged = this.onAccountsChanged.bind(this);
				provider.on("accountsChanged", accountsChanged);
			}
			if (!chainChanged) {
				chainChanged = this.onChainChanged.bind(this);
				provider.on("chainChanged", chainChanged);
			}
			if (!disconnect) {
				disconnect = this.onDisconnect.bind(this);
				provider.on("disconnect", disconnect);
			}
		},
		async onDisconnect(error) {
			const provider = await this.getProvider();
			if (error && error.code === 1013) {
				if (provider && !!(await this.getAccounts()).length) return;
			}
			config.emitter.emit("disconnect");
			if (chainChanged) {
				provider.removeListener("chainChanged", chainChanged);
				chainChanged = void 0;
			}
			if (disconnect) {
				provider.removeListener("disconnect", disconnect);
				disconnect = void 0;
			}
			if (!connect) {
				connect = this.onConnect.bind(this);
				provider.on("connect", connect);
			}
		},
		onDisplayUri(uri) {
			config.emitter.emit("message", {
				type: "display_uri",
				data: uri
			});
		}
	}));
}
//#endregion
//#region node_modules/@wagmi/connectors/dist/esm/porto.js
function porto(parameters = {}) {
	return createConnector((wagmiConfig) => {
		const chains = wagmiConfig.chains ?? parameters.chains ?? [];
		const transports = (() => {
			if (wagmiConfig.transports) return wagmiConfig.transports;
			return parameters.transports;
		})();
		let porto_promise;
		let accountsChanged;
		let chainChanged;
		let connect;
		let disconnect;
		return {
			async connect({ chainId = chains[0].id, ...rest } = {}) {
				const isReconnecting = "isReconnecting" in rest && rest.isReconnecting || false;
				const withCapabilities = "withCapabilities" in rest && rest.withCapabilities || false;
				let accounts = [];
				let currentChainId;
				if (isReconnecting) {
					[accounts, currentChainId] = await Promise.all([this.getAccounts().catch(() => []), this.getChainId().catch(() => void 0)]);
					if (chainId && currentChainId !== chainId) currentChainId = (await this.switchChain({ chainId }).catch((error) => {
						if (error.code === UserRejectedRequestError.code) throw error;
						return { id: currentChainId };
					}))?.id ?? currentChainId;
				}
				const provider = await this.getProvider();
				try {
					if (!accounts?.length && !isReconnecting) {
						const res = await provider.request({
							method: "wallet_connect",
							params: [{
								..."capabilities" in rest ? { capabilities: encode(wallet_connect.Capabilities, rest.capabilities ?? {}) } : {},
								chainIds: [numberToHex(chainId), ...chains.filter((x) => x.id !== chainId).map((x) => numberToHex(x.id))]
							}]
						});
						accounts = res.accounts;
						currentChainId = Number(res.chainIds[0]);
					}
					if (!currentChainId) throw new ChainNotConfiguredError();
					if (connect) {
						provider.removeListener("connect", connect);
						connect = void 0;
					}
					if (!accountsChanged) {
						accountsChanged = this.onAccountsChanged.bind(this);
						provider.on("accountsChanged", accountsChanged);
					}
					if (!chainChanged) {
						chainChanged = this.onChainChanged.bind(this);
						provider.on("chainChanged", chainChanged);
					}
					if (!disconnect) {
						disconnect = this.onDisconnect.bind(this);
						provider.on("disconnect", disconnect);
					}
					return {
						accounts: accounts.map((account) => {
							if (typeof account === "object") return withCapabilities ? account : account.address;
							return withCapabilities ? {
								address: account,
								capabilities: {}
							} : account;
						}),
						chainId: currentChainId
					};
				} catch (err) {
					const error = err;
					if (error.code === UserRejectedRequestError.code) throw new UserRejectedRequestError(error);
					throw error;
				}
			},
			async disconnect() {
				const provider = await this.getProvider();
				if (chainChanged) {
					provider.removeListener("chainChanged", chainChanged);
					chainChanged = void 0;
				}
				if (disconnect) {
					provider.removeListener("disconnect", disconnect);
					disconnect = void 0;
				}
				if (!connect) {
					connect = this.onConnect.bind(this);
					provider.on("connect", connect);
				}
				await provider.request({ method: "wallet_disconnect" });
			},
			async getAccounts() {
				return (await (await this.getProvider()).request({ method: "eth_accounts" })).map((x) => getAddress(x));
			},
			async getChainId() {
				const hexChainId = await (await this.getProvider()).request({ method: "eth_chainId" });
				return Number(hexChainId);
			},
			async getPortoInstance() {
				porto_promise ??= (async () => {
					const { Porto } = await import("./dist-BK3qjx7l.js");
					return Porto.create({
						...parameters,
						announceProvider: false,
						chains,
						transports
					});
				})();
				return await porto_promise;
			},
			async getProvider() {
				return (await this.getPortoInstance()).provider;
			},
			icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDIyIiBoZWlnaHQ9IjQyMiIgdmlld0JveD0iMCAwIDQyMiA0MjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MjIiIGhlaWdodD0iNDIyIiBmaWxsPSJibGFjayIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfMV8xNSkiPgo8cGF0aCBkPSJNODEgMjg2LjM2NkM4MSAyODAuODkzIDg1LjQ1MDUgMjc2LjQ1NSA5MC45NDA0IDI3Ni40NTVIMzI5LjUxMUMzMzUuMDAxIDI3Ni40NTUgMzM5LjQ1MiAyODAuODkzIDMzOS40NTIgMjg2LjM2NlYzMDYuMTg4QzMzOS40NTIgMzExLjY2MiAzMzUuMDAxIDMxNi4wOTkgMzI5LjUxMSAzMTYuMDk5SDkwLjk0MDRDODUuNDUwNSAzMTYuMDk5IDgxIDMxMS42NjIgODEgMzA2LjE4OFYyODYuMzY2WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOTAuOTQwNCAyMzQuODI4Qzg1LjQ1MDUgMjM0LjgyOCA4MSAyMzkuMjY2IDgxIDI0NC43MzlWMjcxLjUzMUM4My44NDMyIDI2OS42MzMgODcuMjYyMiAyNjguNTI2IDkwLjk0MDQgMjY4LjUyNkgzMjkuNTExQzMzMy4xODggMjY4LjUyNiAzMzYuNjA4IDI2OS42MzMgMzM5LjQ1MiAyNzEuNTMxVjI0NC43MzlDMzM5LjQ1MiAyMzkuMjY2IDMzNS4wMDEgMjM0LjgyOCAzMjkuNTExIDIzNC44MjhIOTAuOTQwNFpNMzM5LjQ1MiAyODYuMzY2QzMzOS40NTIgMjgwLjg5MyAzMzUuMDAxIDI3Ni40NTUgMzI5LjUxMSAyNzYuNDU1SDkwLjk0MDRDODUuNDUwNSAyNzYuNDU1IDgxIDI4MC44OTMgODEgMjg2LjM2NlYzMDYuMTlDODEgMzExLjY2NCA4NS40NTA1IDMxNi4xMDEgOTAuOTQwNCAzMTYuMTAxSDMyOS41MTFDMzM1LjAwMSAzMTYuMTAxIDMzOS40NTIgMzExLjY2NCAzMzkuNDUyIDMwNi4xOVYyODYuMzY2WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOTAuOTQwNCAxOTMuMjAxQzg1LjQ1MDUgMTkzLjIwMSA4MSAxOTcuNjM4IDgxIDIwMy4xMTJWMjI5LjkwM0M4My44NDMyIDIyOC4wMDYgODcuMjYyMiAyMjYuODk5IDkwLjk0MDQgMjI2Ljg5OUgzMjkuNTExQzMzMy4xODggMjI2Ljg5OSAzMzYuNjA4IDIyOC4wMDYgMzM5LjQ1MiAyMjkuOTAzVjIwMy4xMTJDMzM5LjQ1MiAxOTcuNjM4IDMzNS4wMDEgMTkzLjIwMSAzMjkuNTExIDE5My4yMDFIOTAuOTQwNFpNMzM5LjQ1MiAyNDQuNzM5QzMzOS40NTIgMjM5LjI2NSAzMzUuMDAxIDIzNC44MjggMzI5LjUxMSAyMzQuODI4SDkwLjk0MDRDODUuNDUwNSAyMzQuODI4IDgxIDIzOS4yNjUgODEgMjQ0LjczOVYyNzEuNTNDODEuMjE3NSAyNzEuMzg1IDgxLjQzODMgMjcxLjI0NSA4MS42NjI0IDI3MS4xMDlDODMuODMyNSAyNjkuNzk0IDg2LjMwNTQgMjY4LjkyNyA4OC45NTIzIDI2OC42MzVDODkuNjA1MSAyNjguNTYzIDkwLjI2ODQgMjY4LjUyNiA5MC45NDA0IDI2OC41MjZIMzI5LjUxMUMzMzAuMTgzIDI2OC41MjYgMzMwLjg0NiAyNjguNTYzIDMzMS40OTggMjY4LjYzNUMzMzQuNDE5IDI2OC45NTcgMzM3LjEyOCAyNjkuOTggMzM5LjQ1MiAyNzEuNTNWMjQ0LjczOVpNMzM5LjQ1MiAyODYuMzY2QzMzOS40NTIgMjgxLjAyMSAzMzUuMjA2IDI3Ni42NjMgMzI5Ljg5MyAyNzYuNDYyQzMyOS43NjcgMjc2LjQ1NyAzMjkuNjQgMjc2LjQ1NSAzMjkuNTExIDI3Ni40NTVIOTAuOTQwNEM4NS40NTA1IDI3Ni40NTUgODEgMjgwLjg5MyA4MSAyODYuMzY2VjMwNi4xODhDODEgMzExLjY2MiA4NS40NTA1IDMxNi4xMDEgOTAuOTQwNCAzMTYuMTAxSDMyOS41MTFDMzM1LjAwMSAzMTYuMTAxIDMzOS40NTIgMzExLjY2MiAzMzkuNDUyIDMwNi4xODhWMjg2LjM2NloiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPgo8cGF0aCBvcGFjaXR5PSIwLjMiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOTguMDE0NiAxMDRDODguNjE3NyAxMDQgODEgMTExLjU5NSA4MSAxMjAuOTY1VjE4OC4yNzZDODMuODQzMiAxODYuMzc5IDg3LjI2MjIgMTg1LjI3MiA5MC45NDA0IDE4NS4yNzJIMzI5LjUxMUMzMzMuMTg4IDE4NS4yNzIgMzM2LjYwOCAxODYuMzc5IDMzOS40NTIgMTg4LjI3NlYxMjAuOTY1QzMzOS40NTIgMTExLjU5NSAzMzEuODMzIDEwNCAzMjIuNDM3IDEwNEg5OC4wMTQ2Wk0zMzkuNDUyIDIwMy4xMTJDMzM5LjQ1MiAxOTcuNjM4IDMzNS4wMDEgMTkzLjIwMSAzMjkuNTExIDE5My4yMDFIOTAuOTQwNEM4NS40NTA1IDE5My4yMDEgODEgMTk3LjYzOCA4MSAyMDMuMTEyVjIyOS45MDNDODEuMjE3NSAyMjkuNzU4IDgxLjQzODMgMjI5LjYxOCA4MS42NjI0IDIyOS40ODJDODMuODMyNSAyMjguMTY3IDg2LjMwNTQgMjI3LjMgODguOTUyMyAyMjcuMDA4Qzg5LjYwNTEgMjI2LjkzNiA5MC4yNjg0IDIyNi44OTkgOTAuOTQwNCAyMjYuODk5SDMyOS41MTFDMzMwLjE4MyAyMjYuODk5IDMzMC44NDYgMjI2LjkzNiAzMzEuNDk4IDIyNy4wMDhDMzM0LjQxOSAyMjcuMzMgMzM3LjEyOCAyMjguMzUyIDMzOS40NTIgMjI5LjkwM1YyMDMuMTEyWk0zMzkuNDUyIDI0NC43MzlDMzM5LjQ1MiAyMzkuMzkzIDMzNS4yMDYgMjM1LjAzNiAzMjkuODkzIDIzNC44MzVDMzI5Ljc2NyAyMzQuODMgMzI5LjY0IDIzNC44MjggMzI5LjUxMSAyMzQuODI4SDkwLjk0MDRDODUuNDUwNSAyMzQuODI4IDgxIDIzOS4yNjUgODEgMjQ0LjczOVYyNzEuNTNMODEuMDcwNyAyNzEuNDgzQzgxLjI2NTMgMjcxLjM1NSA4MS40NjI1IDI3MS4yMyA4MS42NjI0IDI3MS4xMDlDODEuOTA4MyAyNzAuOTYgODIuMTU4MSAyNzAuODE3IDgyLjQxMTcgMjcwLjY3OUM4NC4zOTUzIDI2OS42MDUgODYuNjA1NCAyNjguODk0IDg4Ljk1MjMgMjY4LjYzNUM4OS4wMDUyIDI2OC42MjkgODkuMDU4IDI2OC42MjQgODkuMTExIDI2OC42MThDODkuNzEyNSAyNjguNTU3IDkwLjMyMjggMjY4LjUyNiA5MC45NDA0IDI2OC41MjZIMzI5LjUxMUMzMjkuNzM4IDI2OC41MjYgMzI5Ljk2NSAyNjguNTMgMzMwLjE5MiAyNjguNTM5QzMzMC42MzEgMjY4LjU1NSAzMzEuMDY3IDI2OC41ODcgMzMxLjQ5OCAyNjguNjM1QzMzNC40MTkgMjY4Ljk1NyAzMzcuMTI4IDI2OS45OCAzMzkuNDUyIDI3MS41M1YyNDQuNzM5Wk0zMzkuNDUyIDI4Ni4zNjZDMzM5LjQ1MiAyODEuMDIxIDMzNS4yMDYgMjc2LjY2MyAzMjkuODkzIDI3Ni40NjJMMzI5Ljg2NSAyNzYuNDYxQzMyOS43NDggMjc2LjQ1NyAzMjkuNjI5IDI3Ni40NTUgMzI5LjUxMSAyNzYuNDU1SDkwLjk0MDRDODUuNDUwNSAyNzYuNDU1IDgxIDI4MC44OTMgODEgMjg2LjM2NlYzMDYuMTg4QzgxIDMxMS42NjIgODUuNDUwNSAzMTYuMTAxIDkwLjk0MDQgMzE2LjEwMUgzMjkuNTExQzMzNS4wMDEgMzE2LjEwMSAzMzkuNDUyIDMxMS42NjIgMzM5LjQ1MiAzMDYuMTg4VjI4Ni4zNjZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjY5Ljg2OCAxMzEuNzUyQzI2OS44NjggMTI2LjI3OCAyNzQuMzE4IDEyMS44NCAyNzkuODA4IDEyMS44NEgzMTEuNjE4QzMxNy4xMDggMTIxLjg0IDMyMS41NTggMTI2LjI3OCAzMjEuNTU4IDEzMS43NTJWMTYxLjQ4NUMzMjEuNTU4IDE2Ni45NTkgMzE3LjEwOCAxNzEuMzk2IDMxMS42MTggMTcxLjM5NkgyNzkuODA4QzI3NC4zMTggMTcxLjM5NiAyNjkuODY4IDE2Ni45NTkgMjY5Ljg2OCAxNjEuNDg1VjEzMS43NTJaIiBmaWxsPSJ3aGl0ZSIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzFfMTUiPgo8cmVjdCB3aWR0aD0iMjU5IiBoZWlnaHQ9IjIxMyIgZmlsbD0id2hpdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDgxIDEwNCkiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K",
			id: "xyz.ithaca.porto",
			async isAuthorized() {
				try {
					return !!(await withRetry(() => this.getAccounts())).length;
				} catch {
					return false;
				}
			},
			name: "Porto",
			async onAccountsChanged(accounts) {
				wagmiConfig.emitter.emit("change", { accounts: accounts.map((x) => getAddress(x)) });
			},
			onChainChanged(chain) {
				const chainId = Number(chain);
				wagmiConfig.emitter.emit("change", { chainId });
			},
			async onConnect(connectInfo) {
				const accounts = await this.getAccounts();
				if (accounts.length === 0) return;
				const chainId = Number(connectInfo.chainId);
				wagmiConfig.emitter.emit("connect", {
					accounts,
					chainId
				});
				const provider = await this.getProvider();
				if (provider) {
					if (connect) {
						provider.removeListener("connect", connect);
						connect = void 0;
					}
					if (!accountsChanged) {
						accountsChanged = this.onAccountsChanged.bind(this);
						provider.on("accountsChanged", accountsChanged);
					}
					if (!chainChanged) {
						chainChanged = this.onChainChanged.bind(this);
						provider.on("chainChanged", chainChanged);
					}
					if (!disconnect) {
						disconnect = this.onDisconnect.bind(this);
						provider.on("disconnect", disconnect);
					}
				}
			},
			async onDisconnect(_error) {
				const provider = await this.getProvider();
				wagmiConfig.emitter.emit("disconnect");
				if (provider) {
					if (chainChanged) {
						provider.removeListener("chainChanged", chainChanged);
						chainChanged = void 0;
					}
					if (disconnect) {
						provider.removeListener("disconnect", disconnect);
						disconnect = void 0;
					}
					if (!connect) {
						connect = this.onConnect.bind(this);
						provider.on("connect", connect);
					}
				}
			},
			async setup() {
				if (!connect) {
					const provider = await this.getProvider();
					connect = this.onConnect.bind(this);
					provider.on("connect", connect);
				}
			},
			async switchChain({ chainId }) {
				const chain = chains.find((x) => x.id === chainId);
				if (!chain) throw new SwitchChainError(new ChainNotConfiguredError());
				await (await this.getProvider()).request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId: numberToHex(chainId) }]
				});
				return chain;
			},
			type: "injected"
		};
	});
}
//#endregion
//#region node_modules/@wagmi/connectors/dist/esm/safe.js
safe.type = "safe";
function safe(parameters = {}) {
	const { shimDisconnect = false } = parameters;
	let provider_;
	let disconnect;
	return createConnector((config) => ({
		id: "safe",
		name: "Safe",
		type: safe.type,
		async connect({ withCapabilities } = {}) {
			const provider = await this.getProvider();
			if (!provider) throw new ProviderNotFoundError();
			const accounts = await this.getAccounts();
			const chainId = await this.getChainId();
			if (!disconnect) {
				disconnect = this.onDisconnect.bind(this);
				provider.on("disconnect", disconnect);
			}
			if (shimDisconnect) await config.storage?.removeItem("safe.disconnected");
			return {
				accounts: withCapabilities ? accounts.map((address) => ({
					address,
					capabilities: {}
				})) : accounts,
				chainId
			};
		},
		async disconnect() {
			const provider = await this.getProvider();
			if (!provider) throw new ProviderNotFoundError();
			if (disconnect) {
				provider.removeListener("disconnect", disconnect);
				disconnect = void 0;
			}
			if (shimDisconnect) await config.storage?.setItem("safe.disconnected", true);
		},
		async getAccounts() {
			const provider = await this.getProvider();
			if (!provider) throw new ProviderNotFoundError();
			return (await provider.request({ method: "eth_accounts" })).map(getAddress);
		},
		async getProvider() {
			if (!(typeof window !== "undefined" && window?.parent !== window)) return;
			if (!provider_) {
				const { default: SDK } = await import("./esm-Cr-A8sgd.js");
				const sdk = new SDK(parameters);
				const safe = await withTimeout(() => sdk.safe.getInfo(), { timeout: parameters.unstable_getInfoTimeout ?? 10 });
				if (!safe) throw new Error("Could not load Safe information");
				provider_ = new (await ((async () => {
					const Provider = await import("./dist-xFJHgfBT.js").then((m) => /* @__PURE__ */ __toESM(m.default, 1));
					if (typeof Provider.SafeAppProvider !== "function" && typeof Provider.default.SafeAppProvider === "function") return Provider.default.SafeAppProvider;
					return Provider.SafeAppProvider;
				})()))(safe, sdk);
			}
			return provider_;
		},
		async getChainId() {
			const provider = await this.getProvider();
			if (!provider) throw new ProviderNotFoundError();
			return Number(provider.chainId);
		},
		async isAuthorized() {
			try {
				if (shimDisconnect && await config.storage?.getItem("safe.disconnected")) return false;
				return !!(await this.getAccounts()).length;
			} catch {
				return false;
			}
		},
		onAccountsChanged() {},
		onChainChanged() {},
		onDisconnect() {
			config.emitter.emit("disconnect");
		}
	}));
}
//#endregion
//#region node_modules/@wagmi/connectors/dist/esm/version.js
var version = "6.2.0";
//#endregion
//#region node_modules/@wagmi/connectors/dist/esm/walletConnect.js
walletConnect.type = "walletConnect";
/**
* @deprecated **NOTE: This connector uses a vulnerable dependency downstream** (`@walletconnect/ethereum-provider@2.21.1` > `@reown/appkit@1.8.9` > `@reown/appkit-utils@1.8.9` > `@walletconnect/logger@2.1.2` > `pino@7.11.0`). You should override `pino` to a secure version via your package manager:
*
* ### npm
* ```json
* {
*   "overrides": {
*     "@walletconnect/logger": {
*       "pino": "10.0.0"
*     }
*   }
* }
* ```
*
* ### pnpm
* ```json
* {
*   "pnpm": {
*     "overrides": {
*       "@walletconnect/logger>pino": "10.0.0"
*     }
*   }
* }
* ```
*
* ### yarn
* ```json
* {
*   "resolutions": {
*     "@walletconnect/logger/pino": "10.0.0"
*   }
* }
* ```
*
* ### bun
* ```json
* {
*   "overrides": {
*     "@walletconnect/logger": {
*       "pino": "10.0.0"
*     }
*   }
* }
* ```
*
* Normally the Wagmi team would upgrade `@walletconnect/ethereum-provider` to a fixed version for you, but `@walletconnect/ethereum-provider` was relicensed recently from Apache to a [non-permissive license](https://github.com/reown-com/appkit/blob/main/LICENSE.md). We are trying to get the WalletConnect team to release a version that closes the vulnerability under the old Apache license.
*/
function walletConnect(parameters) {
	const isNewChainsStale = parameters.isNewChainsStale ?? true;
	let provider_;
	let providerPromise;
	const NAMESPACE = "eip155";
	let accountsChanged;
	let chainChanged;
	let connect;
	let displayUri;
	let sessionDelete;
	let disconnect;
	return createConnector((config) => ({
		id: "walletConnect",
		name: "WalletConnect",
		type: walletConnect.type,
		async setup() {
			const provider = await this.getProvider().catch(() => null);
			if (!provider) return;
			if (!connect) {
				connect = this.onConnect.bind(this);
				provider.on("connect", connect);
			}
			if (!sessionDelete) {
				sessionDelete = this.onSessionDelete.bind(this);
				provider.on("session_delete", sessionDelete);
			}
		},
		async connect({ chainId, withCapabilities, ...rest } = {}) {
			try {
				const provider = await this.getProvider();
				if (!provider) throw new ProviderNotFoundError();
				if (!displayUri) {
					displayUri = this.onDisplayUri;
					provider.on("display_uri", displayUri);
				}
				let targetChainId = chainId;
				if (!targetChainId) {
					const state = await config.storage?.getItem("state") ?? {};
					if (config.chains.some((x) => x.id === state.chainId)) targetChainId = state.chainId;
					else targetChainId = config.chains[0]?.id;
				}
				if (!targetChainId) throw new Error("No chains found on connector.");
				const isChainsStale = await this.isChainsStale();
				if (provider.session && isChainsStale) await provider.disconnect();
				if (!provider.session || isChainsStale) {
					const optionalChains = config.chains.filter((chain) => chain.id !== targetChainId).map((optionalChain) => optionalChain.id);
					await provider.connect({
						optionalChains: [targetChainId, ...optionalChains],
						..."pairingTopic" in rest ? { pairingTopic: rest.pairingTopic } : {}
					});
					this.setRequestedChainsIds(config.chains.map((x) => x.id));
				}
				const accounts = (await provider.enable()).map((x) => getAddress(x));
				let currentChainId = await this.getChainId();
				if (chainId && currentChainId !== chainId) currentChainId = (await this.switchChain({ chainId }).catch((error) => {
					if (error.code === UserRejectedRequestError.code && error.cause?.message !== "Missing or invalid. request() method: wallet_addEthereumChain") throw error;
					return { id: currentChainId };
				}))?.id ?? currentChainId;
				if (displayUri) {
					provider.removeListener("display_uri", displayUri);
					displayUri = void 0;
				}
				if (connect) {
					provider.removeListener("connect", connect);
					connect = void 0;
				}
				if (!accountsChanged) {
					accountsChanged = this.onAccountsChanged.bind(this);
					provider.on("accountsChanged", accountsChanged);
				}
				if (!chainChanged) {
					chainChanged = this.onChainChanged.bind(this);
					provider.on("chainChanged", chainChanged);
				}
				if (!disconnect) {
					disconnect = this.onDisconnect.bind(this);
					provider.on("disconnect", disconnect);
				}
				if (!sessionDelete) {
					sessionDelete = this.onSessionDelete.bind(this);
					provider.on("session_delete", sessionDelete);
				}
				return {
					accounts: withCapabilities ? accounts.map((address) => ({
						address,
						capabilities: {}
					})) : accounts,
					chainId: currentChainId
				};
			} catch (error) {
				if (/(user rejected|connection request reset)/i.test(error?.message)) throw new UserRejectedRequestError(error);
				throw error;
			}
		},
		async disconnect() {
			const provider = await this.getProvider();
			try {
				await provider?.disconnect();
			} catch (error) {
				if (!/No matching key/i.test(error.message)) throw error;
			} finally {
				if (chainChanged) {
					provider?.removeListener("chainChanged", chainChanged);
					chainChanged = void 0;
				}
				if (disconnect) {
					provider?.removeListener("disconnect", disconnect);
					disconnect = void 0;
				}
				if (!connect) {
					connect = this.onConnect.bind(this);
					provider?.on("connect", connect);
				}
				if (accountsChanged) {
					provider?.removeListener("accountsChanged", accountsChanged);
					accountsChanged = void 0;
				}
				if (sessionDelete) {
					provider?.removeListener("session_delete", sessionDelete);
					sessionDelete = void 0;
				}
				this.setRequestedChainsIds([]);
			}
		},
		async getAccounts() {
			return (await this.getProvider()).accounts.map((x) => getAddress(x));
		},
		async getProvider({ chainId } = {}) {
			async function initProvider() {
				const optionalChains = config.chains.map((x) => x.id);
				if (!optionalChains.length) return;
				const { EthereumProvider } = await import("./index.es-rjQ5MhiY.js");
				return await EthereumProvider.init({
					...parameters,
					disableProviderPing: true,
					optionalChains,
					projectId: parameters.projectId,
					rpcMap: Object.fromEntries(config.chains.map((chain) => {
						const [url] = extractRpcUrls({
							chain,
							transports: config.transports
						});
						return [chain.id, url];
					})),
					showQrModal: parameters.showQrModal ?? true
				});
			}
			if (!provider_) {
				if (!providerPromise) providerPromise = initProvider();
				provider_ = await providerPromise;
				provider_?.events.setMaxListeners(Number.POSITIVE_INFINITY);
			}
			if (chainId) await this.switchChain?.({ chainId });
			return provider_;
		},
		async getChainId() {
			return (await this.getProvider()).chainId;
		},
		async isAuthorized() {
			try {
				const [accounts, provider] = await Promise.all([this.getAccounts(), this.getProvider()]);
				if (!accounts.length) return false;
				if (await this.isChainsStale() && provider.session) {
					await provider.disconnect().catch(() => {});
					return false;
				}
				return true;
			} catch {
				return false;
			}
		},
		async switchChain({ addEthereumChainParameter, chainId }) {
			const provider = await this.getProvider();
			if (!provider) throw new ProviderNotFoundError();
			const chain = config.chains.find((x) => x.id === chainId);
			if (!chain) throw new SwitchChainError(new ChainNotConfiguredError());
			try {
				await Promise.all([new Promise((resolve) => {
					const listener = ({ chainId: currentChainId }) => {
						if (currentChainId === chainId) {
							config.emitter.off("change", listener);
							resolve();
						}
					};
					config.emitter.on("change", listener);
				}), provider.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId: numberToHex(chainId) }]
				})]);
				const requestedChains = await this.getRequestedChainsIds();
				this.setRequestedChainsIds([...requestedChains, chainId]);
				return chain;
			} catch (err) {
				const error = err;
				if (/(user rejected)/i.test(error.message)) throw new UserRejectedRequestError(error);
				try {
					let blockExplorerUrls;
					if (addEthereumChainParameter?.blockExplorerUrls) blockExplorerUrls = addEthereumChainParameter.blockExplorerUrls;
					else blockExplorerUrls = chain.blockExplorers?.default.url ? [chain.blockExplorers?.default.url] : [];
					let rpcUrls;
					if (addEthereumChainParameter?.rpcUrls?.length) rpcUrls = addEthereumChainParameter.rpcUrls;
					else rpcUrls = [...chain.rpcUrls.default.http];
					const addEthereumChain = {
						blockExplorerUrls,
						chainId: numberToHex(chainId),
						chainName: addEthereumChainParameter?.chainName ?? chain.name,
						iconUrls: addEthereumChainParameter?.iconUrls,
						nativeCurrency: addEthereumChainParameter?.nativeCurrency ?? chain.nativeCurrency,
						rpcUrls
					};
					await provider.request({
						method: "wallet_addEthereumChain",
						params: [addEthereumChain]
					});
					const requestedChains = await this.getRequestedChainsIds();
					this.setRequestedChainsIds([...requestedChains, chainId]);
					return chain;
				} catch (error) {
					throw new UserRejectedRequestError(error);
				}
			}
		},
		onAccountsChanged(accounts) {
			if (accounts.length === 0) this.onDisconnect();
			else config.emitter.emit("change", { accounts: accounts.map((x) => getAddress(x)) });
		},
		onChainChanged(chain) {
			const chainId = Number(chain);
			config.emitter.emit("change", { chainId });
		},
		async onConnect(connectInfo) {
			const chainId = Number(connectInfo.chainId);
			const accounts = await this.getAccounts();
			config.emitter.emit("connect", {
				accounts,
				chainId
			});
		},
		async onDisconnect(_error) {
			this.setRequestedChainsIds([]);
			config.emitter.emit("disconnect");
			const provider = await this.getProvider();
			if (accountsChanged) {
				provider.removeListener("accountsChanged", accountsChanged);
				accountsChanged = void 0;
			}
			if (chainChanged) {
				provider.removeListener("chainChanged", chainChanged);
				chainChanged = void 0;
			}
			if (disconnect) {
				provider.removeListener("disconnect", disconnect);
				disconnect = void 0;
			}
			if (sessionDelete) {
				provider.removeListener("session_delete", sessionDelete);
				sessionDelete = void 0;
			}
			if (!connect) {
				connect = this.onConnect.bind(this);
				provider.on("connect", connect);
			}
		},
		onDisplayUri(uri) {
			config.emitter.emit("message", {
				type: "display_uri",
				data: uri
			});
		},
		onSessionDelete() {
			this.onDisconnect();
		},
		getNamespaceChainsIds() {
			if (!provider_) return [];
			return provider_.session?.namespaces[NAMESPACE]?.accounts?.map((account) => Number.parseInt(account.split(":")[1] || "", 10)) ?? [];
		},
		async getRequestedChainsIds() {
			return await config.storage?.getItem(this.requestedChainsStorageKey) ?? [];
		},
		async isChainsStale() {
			if (!isNewChainsStale) return false;
			const connectorChains = config.chains.map((x) => x.id);
			const namespaceChains = this.getNamespaceChainsIds();
			if (namespaceChains.length && !namespaceChains.some((id) => connectorChains.includes(id))) return false;
			const requestedChains = await this.getRequestedChainsIds();
			return !connectorChains.every((id) => requestedChains.includes(id));
		},
		async setRequestedChainsIds(chains) {
			await config.storage?.setItem(this.requestedChainsStorageKey, chains);
		},
		get requestedChainsStorageKey() {
			return `${this.id}.requestedChains`;
		}
	}));
}
//#endregion
export { metaMask as a, baseAccount as c, porto as i, version as n, gemini as o, safe as r, coinbaseWallet as s, walletConnect as t };

//# sourceMappingURL=connectors-Bumvksgx.js.map