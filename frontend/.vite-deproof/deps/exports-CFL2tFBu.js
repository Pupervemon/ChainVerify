import { s as __toESM, t as __commonJSMin } from "./chunk-t8Qwt55I.js";
import { t as require_react } from "./react.js";
import { $ as getStorageAt, A as waitForCallsStatus, At as deployContract, B as showCallsStatus, C as watchClient, Ct as readContract, D as watchAsset, Dt as estimateGas, E as watchBlockNumber, Et as estimateMaxPriorityFeePerGas, G as reconnect, H as sendTransaction, Ht as BaseError$1, I as switchAccount, J as getTransactionReceipt, K as prepareTransactionRequest, L as simulateContract, M as verifyMessage, N as switchChain, O as watchAccount, Ot as estimateFeesPerGas, Pt as connect, Q as getToken, R as signTypedData, S as watchConnections, St as readContracts, T as watchBlocks, Tt as getAccount, U as sendCallsSync, V as sendTransactionSync, W as sendCalls, Wt as call, X as getTransactionConfirmations, Y as getTransactionCount, Z as getTransaction, _ as writeContract, _t as getBytecode, at as getEnsResolver, b as watchContractEvent, bt as getBlock, c as hydrate, ct as getEnsAddress, dt as getClient, et as getPublicClient, ft as getChains, gt as getCallsStatus, ht as getCapabilities, it as getEnsText, j as verifyTypedData, jt as getConnectorClient, k as waitForTransactionReceipt, kt as disconnect, lt as getConnectors, mt as getChainId, nt as getGasPrice, ot as getEnsName, pt as deepEqual, q as getWalletClient, rt as getFeeHistory, st as getEnsAvatar, tt as getProof, ut as getConnections, v as watchPublicClient, vt as getBlockTransactionCount, w as watchChainId, x as watchConnectors, xt as getBalance, y as watchPendingTransactions, yt as getBlockNumber, z as signMessage, zt as ConnectorNotConnectedError } from "./exports-CPhf7Cn4.js";
import { C as useQueryClient, et as replaceEqualDeep, h as useQuery$1, r as useMutation, t as useInfiniteQuery$1 } from "./modern-BAXZv9qx.js";
//#region node_modules/wagmi/dist/esm/hydrate.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function Hydrate(parameters) {
	const { children, config, initialState, reconnectOnMount = true } = parameters;
	const { onMount } = hydrate(config, {
		initialState,
		reconnectOnMount
	});
	if (!config._internal.ssr) onMount();
	const active = (0, import_react.useRef)(true);
	(0, import_react.useEffect)(() => {
		if (!active.current) return;
		if (!config._internal.ssr) return;
		onMount();
		return () => {
			active.current = false;
		};
	}, []);
	return children;
}
//#endregion
//#region node_modules/wagmi/dist/esm/context.js
var WagmiContext = (0, import_react.createContext)(void 0);
function WagmiProvider(parameters) {
	const { children, config } = parameters;
	const props = { value: config };
	return (0, import_react.createElement)(Hydrate, parameters, (0, import_react.createElement)(WagmiContext.Provider, props, children));
}
//#endregion
//#region node_modules/wagmi/dist/esm/version.js
var version = "2.19.5";
//#endregion
//#region node_modules/wagmi/dist/esm/utils/getVersion.js
var getVersion = () => `wagmi@${version}`;
//#endregion
//#region node_modules/wagmi/dist/esm/errors/base.js
var BaseError = class extends BaseError$1 {
	constructor() {
		super(...arguments);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "WagmiError"
		});
	}
	get docsBaseUrl() {
		return "https://wagmi.sh/react";
	}
	get version() {
		return getVersion();
	}
};
//#endregion
//#region node_modules/wagmi/dist/esm/errors/context.js
var WagmiProviderNotFoundError = class extends BaseError {
	constructor() {
		super("`useConfig` must be used within `WagmiProvider`.", { docsPath: "/api/WagmiProvider" });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "WagmiProviderNotFoundError"
		});
	}
};
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useConfig.js
/** https://wagmi.sh/react/api/hooks/useConfig */
function useConfig(parameters = {}) {
	const config = parameters.config ?? (0, import_react.useContext)(WagmiContext);
	if (!config) throw new WagmiProviderNotFoundError();
	return config;
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/actions/watchChains.js
/**
* @internal
* We don't expose this because as far as consumers know, you can't chainge (lol) `config.chains` at runtime.
* Setting `config.chains` via `config._internal.chains.setState(...)` is an extremely advanced use case that's not worth documenting or supporting in the public API at this time.
*/
function watchChains(config, parameters) {
	const { onChange } = parameters;
	return config._internal.chains.subscribe((chains, prevChains) => {
		onChange(chains, prevChains);
	});
}
//#endregion
//#region node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js
/**
* @license React
* use-sync-external-store-shim.development.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_use_sync_external_store_shim_development = /* @__PURE__ */ __commonJSMin(((exports) => {
	(function() {
		function is(x, y) {
			return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
		}
		function useSyncExternalStore$2(subscribe, getSnapshot) {
			didWarnOld18Alpha || void 0 === React.startTransition || (didWarnOld18Alpha = !0, console.error("You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."));
			var value = getSnapshot();
			if (!didWarnUncachedGetSnapshot) {
				var cachedValue = getSnapshot();
				objectIs(value, cachedValue) || (console.error("The result of getSnapshot should be cached to avoid an infinite loop"), didWarnUncachedGetSnapshot = !0);
			}
			cachedValue = useState({ inst: {
				value,
				getSnapshot
			} });
			var inst = cachedValue[0].inst, forceUpdate = cachedValue[1];
			useLayoutEffect(function() {
				inst.value = value;
				inst.getSnapshot = getSnapshot;
				checkIfSnapshotChanged(inst) && forceUpdate({ inst });
			}, [
				subscribe,
				value,
				getSnapshot
			]);
			useEffect(function() {
				checkIfSnapshotChanged(inst) && forceUpdate({ inst });
				return subscribe(function() {
					checkIfSnapshotChanged(inst) && forceUpdate({ inst });
				});
			}, [subscribe]);
			useDebugValue(value);
			return value;
		}
		function checkIfSnapshotChanged(inst) {
			var latestGetSnapshot = inst.getSnapshot;
			inst = inst.value;
			try {
				var nextValue = latestGetSnapshot();
				return !objectIs(inst, nextValue);
			} catch (error) {
				return !0;
			}
		}
		function useSyncExternalStore$1(subscribe, getSnapshot) {
			return getSnapshot();
		}
		"undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
		var React = require_react(), objectIs = "function" === typeof Object.is ? Object.is : is, useState = React.useState, useEffect = React.useEffect, useLayoutEffect = React.useLayoutEffect, useDebugValue = React.useDebugValue, didWarnOld18Alpha = !1, didWarnUncachedGetSnapshot = !1, shim = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
		exports.useSyncExternalStore = void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim;
		"undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
	})();
}));
//#endregion
//#region node_modules/use-sync-external-store/shim/index.js
var require_shim = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_use_sync_external_store_shim_development();
}));
//#endregion
//#region node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js
/**
* @license React
* use-sync-external-store-shim/with-selector.development.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_with_selector_development = /* @__PURE__ */ __commonJSMin(((exports) => {
	(function() {
		function is(x, y) {
			return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
		}
		"undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
		var React = require_react(), shim = require_shim(), objectIs = "function" === typeof Object.is ? Object.is : is, useSyncExternalStore = shim.useSyncExternalStore, useRef = React.useRef, useEffect = React.useEffect, useMemo = React.useMemo, useDebugValue = React.useDebugValue;
		exports.useSyncExternalStoreWithSelector = function(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
			var instRef = useRef(null);
			if (null === instRef.current) {
				var inst = {
					hasValue: !1,
					value: null
				};
				instRef.current = inst;
			} else inst = instRef.current;
			instRef = useMemo(function() {
				function memoizedSelector(nextSnapshot) {
					if (!hasMemo) {
						hasMemo = !0;
						memoizedSnapshot = nextSnapshot;
						nextSnapshot = selector(nextSnapshot);
						if (void 0 !== isEqual && inst.hasValue) {
							var currentSelection = inst.value;
							if (isEqual(currentSelection, nextSnapshot)) return memoizedSelection = currentSelection;
						}
						return memoizedSelection = nextSnapshot;
					}
					currentSelection = memoizedSelection;
					if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
					var nextSelection = selector(nextSnapshot);
					if (void 0 !== isEqual && isEqual(currentSelection, nextSelection)) return memoizedSnapshot = nextSnapshot, currentSelection;
					memoizedSnapshot = nextSnapshot;
					return memoizedSelection = nextSelection;
				}
				var hasMemo = !1, memoizedSnapshot, memoizedSelection, maybeGetServerSnapshot = void 0 === getServerSnapshot ? null : getServerSnapshot;
				return [function() {
					return memoizedSelector(getSnapshot());
				}, null === maybeGetServerSnapshot ? void 0 : function() {
					return memoizedSelector(maybeGetServerSnapshot());
				}];
			}, [
				getSnapshot,
				getServerSnapshot,
				selector,
				isEqual
			]);
			var value = useSyncExternalStore(subscribe, instRef[0], instRef[1]);
			useEffect(function() {
				inst.hasValue = !0;
				inst.value = value;
			}, [value]);
			useDebugValue(value);
			return value;
		};
		"undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
	})();
}));
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useSyncExternalStoreWithTracked.js
var import_with_selector = (/* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_with_selector_development();
})))();
var isPlainObject$1 = (obj) => typeof obj === "object" && !Array.isArray(obj);
function useSyncExternalStoreWithTracked(subscribe, getSnapshot, getServerSnapshot = getSnapshot, isEqual = deepEqual) {
	const trackedKeys = (0, import_react.useRef)([]);
	const result = (0, import_with_selector.useSyncExternalStoreWithSelector)(subscribe, getSnapshot, getServerSnapshot, (x) => x, (a, b) => {
		if (isPlainObject$1(a) && isPlainObject$1(b) && trackedKeys.current.length) {
			for (const key of trackedKeys.current) if (!isEqual(a[key], b[key])) return false;
			return true;
		}
		return isEqual(a, b);
	});
	return (0, import_react.useMemo)(() => {
		if (isPlainObject$1(result)) {
			const trackedResult = { ...result };
			let properties = {};
			for (const [key, value] of Object.entries(trackedResult)) properties = {
				...properties,
				[key]: {
					configurable: false,
					enumerable: true,
					get: () => {
						if (!trackedKeys.current.includes(key)) trackedKeys.current.push(key);
						return value;
					}
				}
			};
			Object.defineProperties(trackedResult, properties);
			return trackedResult;
		}
		return result;
	}, [result]);
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useAccount.js
/** https://wagmi.sh/react/api/hooks/useAccount */
function useAccount(parameters = {}) {
	const config = useConfig(parameters);
	return useSyncExternalStoreWithTracked((onChange) => watchAccount(config, { onChange }), () => getAccount(config));
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useAccountEffect.js
/** https://wagmi.sh/react/api/hooks/useAccountEffect */
function useAccountEffect(parameters = {}) {
	const { onConnect, onDisconnect } = parameters;
	const config = useConfig(parameters);
	(0, import_react.useEffect)(() => {
		return watchAccount(config, { onChange(data, prevData) {
			if ((prevData.status === "reconnecting" || prevData.status === "connecting" && prevData.address === void 0) && data.status === "connected") {
				const { address, addresses, chain, chainId, connector } = data;
				const isReconnected = prevData.status === "reconnecting" || prevData.status === void 0;
				onConnect?.({
					address,
					addresses,
					chain,
					chainId,
					connector,
					isReconnected
				});
			} else if (prevData.status === "connected" && data.status === "disconnected") onDisconnect?.();
		} });
	}, [
		config,
		onConnect,
		onDisconnect
	]);
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/utils.js
function structuralSharing(oldData, newData) {
	return replaceEqualDeep(oldData, newData);
}
function hashFn(queryKey) {
	return JSON.stringify(queryKey, (_, value) => {
		if (isPlainObject(value)) return Object.keys(value).sort().reduce((result, key) => {
			result[key] = value[key];
			return result;
		}, {});
		if (typeof value === "bigint") return value.toString();
		return value;
	});
}
function isPlainObject(value) {
	if (!hasObjectPrototype(value)) return false;
	const ctor = value.constructor;
	if (typeof ctor === "undefined") return true;
	const prot = ctor.prototype;
	if (!hasObjectPrototype(prot)) return false;
	if (!prot.hasOwnProperty("isPrototypeOf")) return false;
	return true;
}
function hasObjectPrototype(o) {
	return Object.prototype.toString.call(o) === "[object Object]";
}
function filterQueryOptions(options) {
	const { _defaulted, behavior, gcTime, initialData, initialDataUpdatedAt, maxPages, meta, networkMode, queryFn, queryHash, queryKey, queryKeyHashFn, retry, retryDelay, structuralSharing, getPreviousPageParam, getNextPageParam, initialPageParam, _optimisticResults, enabled, notifyOnChangeProps, placeholderData, refetchInterval, refetchIntervalInBackground, refetchOnMount, refetchOnReconnect, refetchOnWindowFocus, retryOnMount, select, staleTime, suspense, throwOnError, config, connector, query, ...rest } = options;
	return rest;
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/call.js
function callQueryOptions(config, options = {}) {
	return {
		async queryFn({ queryKey }) {
			const { scopeKey: _, ...parameters } = queryKey[1];
			return await call(config, { ...parameters }) ?? null;
		},
		queryKey: callQueryKey(options)
	};
}
function callQueryKey(options) {
	return ["call", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/connect.js
function connectMutationOptions(config) {
	return {
		mutationFn(variables) {
			return connect(config, variables);
		},
		mutationKey: ["connect"]
	};
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/deployContract.js
function deployContractMutationOptions(config) {
	return {
		mutationFn(variables) {
			return deployContract(config, variables);
		},
		mutationKey: ["deployContract"]
	};
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/disconnect.js
function disconnectMutationOptions(config) {
	return {
		mutationFn(variables) {
			return disconnect(config, variables);
		},
		mutationKey: ["disconnect"]
	};
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/estimateFeesPerGas.js
function estimateFeesPerGasQueryOptions(config, options = {}) {
	return {
		async queryFn({ queryKey }) {
			const { scopeKey: _, ...parameters } = queryKey[1];
			return estimateFeesPerGas(config, parameters);
		},
		queryKey: estimateFeesPerGasQueryKey(options)
	};
}
function estimateFeesPerGasQueryKey(options = {}) {
	return ["estimateFeesPerGas", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/estimateGas.js
function estimateGasQueryOptions(config, options = {}) {
	return {
		async queryFn({ queryKey }) {
			const { connector } = options;
			const { account, scopeKey: _, ...parameters } = queryKey[1];
			if (!account && !connector) throw new Error("account or connector is required");
			return estimateGas(config, {
				account,
				connector,
				...parameters
			});
		},
		queryKey: estimateGasQueryKey(options)
	};
}
function estimateGasQueryKey(options = {}) {
	const { connector: _, ...rest } = options;
	return ["estimateGas", filterQueryOptions(rest)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/estimateMaxPriorityFeePerGas.js
function estimateMaxPriorityFeePerGasQueryOptions(config, options = {}) {
	return {
		async queryFn({ queryKey }) {
			const { scopeKey: _, ...parameters } = queryKey[1];
			return estimateMaxPriorityFeePerGas(config, parameters);
		},
		queryKey: estimateMaxPriorityFeePerGasQueryKey(options)
	};
}
function estimateMaxPriorityFeePerGasQueryKey(options = {}) {
	return ["estimateMaxPriorityFeePerGas", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/getBalance.js
function getBalanceQueryOptions(config, options = {}) {
	return {
		async queryFn({ queryKey }) {
			const { address, scopeKey: _, ...parameters } = queryKey[1];
			if (!address) throw new Error("address is required");
			return await getBalance(config, {
				...parameters,
				address
			}) ?? null;
		},
		queryKey: getBalanceQueryKey(options)
	};
}
function getBalanceQueryKey(options = {}) {
	return ["balance", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/getBlock.js
function getBlockQueryOptions(config, options = {}) {
	return {
		async queryFn({ queryKey }) {
			const { scopeKey: _, ...parameters } = queryKey[1];
			return await getBlock(config, parameters) ?? null;
		},
		queryKey: getBlockQueryKey(options)
	};
}
function getBlockQueryKey(options = {}) {
	return ["block", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/getBlockNumber.js
function getBlockNumberQueryOptions(config, options = {}) {
	return {
		gcTime: 0,
		async queryFn({ queryKey }) {
			const { scopeKey: _, ...parameters } = queryKey[1];
			return await getBlockNumber(config, parameters) ?? null;
		},
		queryKey: getBlockNumberQueryKey(options)
	};
}
function getBlockNumberQueryKey(options = {}) {
	return ["blockNumber", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/getBlockTransactionCount.js
function getBlockTransactionCountQueryOptions(config, options = {}) {
	return {
		async queryFn({ queryKey }) {
			const { scopeKey: _, ...parameters } = queryKey[1];
			return await getBlockTransactionCount(config, parameters) ?? null;
		},
		queryKey: getBlockTransactionCountQueryKey(options)
	};
}
function getBlockTransactionCountQueryKey(options = {}) {
	return ["blockTransactionCount", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/getBytecode.js
function getBytecodeQueryOptions(config, options = {}) {
	return {
		async queryFn({ queryKey }) {
			const { address, scopeKey: _, ...parameters } = queryKey[1];
			if (!address) throw new Error("address is required");
			return await getBytecode(config, {
				...parameters,
				address
			}) ?? null;
		},
		queryKey: getBytecodeQueryKey(options)
	};
}
function getBytecodeQueryKey(options) {
	return ["getBytecode", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/getCallsStatus.js
function getCallsStatusQueryOptions(config, options) {
	return {
		async queryFn({ queryKey }) {
			const { scopeKey: _, ...parameters } = queryKey[1];
			return await getCallsStatus(config, parameters);
		},
		queryKey: getCallsStatusQueryKey(options),
		retry(failureCount, error) {
			if (error instanceof ConnectorNotConnectedError) return false;
			return failureCount < 3;
		}
	};
}
function getCallsStatusQueryKey(options) {
	return ["callsStatus", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/getCapabilities.js
function getCapabilitiesQueryOptions(config, options = {}) {
	return {
		async queryFn({ queryKey }) {
			const { scopeKey: _, ...parameters } = queryKey[1];
			return await getCapabilities(config, parameters);
		},
		queryKey: getCapabilitiesQueryKey(options),
		retry(failureCount, error) {
			if (error instanceof ConnectorNotConnectedError) return false;
			return failureCount < 3;
		}
	};
}
function getCapabilitiesQueryKey(options = {}) {
	return ["capabilities", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/getConnectorClient.js
function getConnectorClientQueryOptions(config, options = {}) {
	return {
		gcTime: 0,
		async queryFn({ queryKey }) {
			const { connector } = options;
			const { connectorUid: _, scopeKey: _s, ...parameters } = queryKey[1];
			return getConnectorClient(config, {
				...parameters,
				connector
			});
		},
		queryKey: getConnectorClientQueryKey(options)
	};
}
function getConnectorClientQueryKey(options = {}) {
	const { connector, ...parameters } = options;
	return ["connectorClient", {
		...filterQueryOptions(parameters),
		connectorUid: connector?.uid
	}];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/getEnsAddress.js
function getEnsAddressQueryOptions(config, options = {}) {
	return {
		async queryFn({ queryKey }) {
			const { name, scopeKey: _, ...parameters } = queryKey[1];
			if (!name) throw new Error("name is required");
			return getEnsAddress(config, {
				...parameters,
				name
			});
		},
		queryKey: getEnsAddressQueryKey(options)
	};
}
function getEnsAddressQueryKey(options = {}) {
	return ["ensAddress", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/getEnsAvatar.js
function getEnsAvatarQueryOptions(config, options = {}) {
	return {
		async queryFn({ queryKey }) {
			const { name, scopeKey: _, ...parameters } = queryKey[1];
			if (!name) throw new Error("name is required");
			return getEnsAvatar(config, {
				...parameters,
				name
			});
		},
		queryKey: getEnsAvatarQueryKey(options)
	};
}
function getEnsAvatarQueryKey(options = {}) {
	return ["ensAvatar", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/getEnsName.js
function getEnsNameQueryOptions(config, options = {}) {
	return {
		async queryFn({ queryKey }) {
			const { address, scopeKey: _, ...parameters } = queryKey[1];
			if (!address) throw new Error("address is required");
			return getEnsName(config, {
				...parameters,
				address
			});
		},
		queryKey: getEnsNameQueryKey(options)
	};
}
function getEnsNameQueryKey(options = {}) {
	return ["ensName", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/getEnsResolver.js
function getEnsResolverQueryOptions(config, options = {}) {
	return {
		async queryFn({ queryKey }) {
			const { name, scopeKey: _, ...parameters } = queryKey[1];
			if (!name) throw new Error("name is required");
			return getEnsResolver(config, {
				...parameters,
				name
			});
		},
		queryKey: getEnsResolverQueryKey(options)
	};
}
function getEnsResolverQueryKey(options = {}) {
	return ["ensResolver", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/getEnsText.js
function getEnsTextQueryOptions(config, options = {}) {
	return {
		async queryFn({ queryKey }) {
			const { key, name, scopeKey: _, ...parameters } = queryKey[1];
			if (!key || !name) throw new Error("key and name are required");
			return getEnsText(config, {
				...parameters,
				key,
				name
			});
		},
		queryKey: getEnsTextQueryKey(options)
	};
}
function getEnsTextQueryKey(options = {}) {
	return ["ensText", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/getFeeHistory.js
function getFeeHistoryQueryOptions(config, options = {}) {
	return {
		async queryFn({ queryKey }) {
			const { blockCount, rewardPercentiles, scopeKey: _, ...parameters } = queryKey[1];
			if (!blockCount) throw new Error("blockCount is required");
			if (!rewardPercentiles) throw new Error("rewardPercentiles is required");
			return await getFeeHistory(config, {
				...parameters,
				blockCount,
				rewardPercentiles
			}) ?? null;
		},
		queryKey: getFeeHistoryQueryKey(options)
	};
}
function getFeeHistoryQueryKey(options = {}) {
	return ["feeHistory", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/getGasPrice.js
function getGasPriceQueryOptions(config, options = {}) {
	return {
		async queryFn({ queryKey }) {
			const { scopeKey: _, ...parameters } = queryKey[1];
			return await getGasPrice(config, parameters) ?? null;
		},
		queryKey: getGasPriceQueryKey(options)
	};
}
function getGasPriceQueryKey(options = {}) {
	return ["gasPrice", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/getProof.js
function getProofQueryOptions(config, options = {}) {
	return {
		async queryFn({ queryKey }) {
			const { address, scopeKey: _, storageKeys, ...parameters } = queryKey[1];
			if (!address || !storageKeys) throw new Error("address and storageKeys are required");
			return getProof(config, {
				...parameters,
				address,
				storageKeys
			});
		},
		queryKey: getProofQueryKey(options)
	};
}
function getProofQueryKey(options) {
	return ["getProof", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/getStorageAt.js
function getStorageAtQueryOptions(config, options = {}) {
	return {
		queryFn({ queryKey }) {
			const { address, slot, scopeKey: _, ...parameters } = queryKey[1];
			if (!address || !slot) throw new Error("address and slot are required");
			return getStorageAt(config, {
				...parameters,
				address,
				slot
			});
		},
		queryKey: getStorageAtQueryKey(options)
	};
}
function getStorageAtQueryKey(options) {
	return ["getStorageAt", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/getToken.js
function getTokenQueryOptions(config, options = {}) {
	return {
		async queryFn({ queryKey }) {
			const { address, scopeKey: _, ...parameters } = queryKey[1];
			if (!address) throw new Error("address is required");
			return getToken(config, {
				...parameters,
				address
			});
		},
		queryKey: getTokenQueryKey(options)
	};
}
function getTokenQueryKey(options = {}) {
	return ["token", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/getTransaction.js
function getTransactionQueryOptions(config, options = {}) {
	return {
		async queryFn({ queryKey }) {
			const { blockHash, blockNumber, blockTag, hash, index } = queryKey[1];
			if (!blockHash && !blockNumber && !blockTag && !hash) throw new Error("blockHash, blockNumber, blockTag, or hash is required");
			if (!hash && !index) throw new Error("index is required for blockHash, blockNumber, or blockTag");
			const { scopeKey: _, ...rest } = queryKey[1];
			return getTransaction(config, rest);
		},
		queryKey: getTransactionQueryKey(options)
	};
}
function getTransactionQueryKey(options = {}) {
	return ["transaction", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/getTransactionConfirmations.js
function getTransactionConfirmationsQueryOptions(config, options = {}) {
	return {
		async queryFn({ queryKey }) {
			const { hash, transactionReceipt, scopeKey: _, ...parameters } = queryKey[1];
			if (!hash && !transactionReceipt) throw new Error("hash or transactionReceipt is required");
			return await getTransactionConfirmations(config, {
				hash,
				transactionReceipt,
				...parameters
			}) ?? null;
		},
		queryKey: getTransactionConfirmationsQueryKey(options)
	};
}
function getTransactionConfirmationsQueryKey(options = {}) {
	return ["transactionConfirmations", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/getTransactionCount.js
function getTransactionCountQueryOptions(config, options = {}) {
	return {
		async queryFn({ queryKey }) {
			const { address, scopeKey: _, ...parameters } = queryKey[1];
			if (!address) throw new Error("address is required");
			return await getTransactionCount(config, {
				...parameters,
				address
			}) ?? null;
		},
		queryKey: getTransactionCountQueryKey(options)
	};
}
function getTransactionCountQueryKey(options = {}) {
	return ["transactionCount", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/getTransactionReceipt.js
function getTransactionReceiptQueryOptions(config, options = {}) {
	return {
		queryFn({ queryKey }) {
			const { hash, scopeKey: _, ...parameters } = queryKey[1];
			if (!hash) throw new Error("hash is required");
			return getTransactionReceipt(config, {
				...parameters,
				hash
			});
		},
		queryKey: getTransactionReceiptQueryKey(options)
	};
}
function getTransactionReceiptQueryKey(options) {
	return ["getTransactionReceipt", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/getWalletClient.js
function getWalletClientQueryOptions(config, options = {}) {
	return {
		gcTime: 0,
		async queryFn({ queryKey }) {
			const { connector } = options;
			const { connectorUid: _, scopeKey: _s, ...parameters } = queryKey[1];
			return getWalletClient(config, {
				...parameters,
				connector
			});
		},
		queryKey: getWalletClientQueryKey(options)
	};
}
function getWalletClientQueryKey(options = {}) {
	const { connector, ...parameters } = options;
	return ["walletClient", {
		...filterQueryOptions(parameters),
		connectorUid: connector?.uid
	}];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/infiniteReadContracts.js
function infiniteReadContractsQueryOptions(config, options) {
	return {
		...options.query,
		async queryFn({ pageParam, queryKey }) {
			const { contracts } = options;
			const { cacheKey: _, scopeKey: _s, ...parameters } = queryKey[1];
			return await readContracts(config, {
				...parameters,
				contracts: contracts(pageParam)
			});
		},
		queryKey: infiniteReadContractsQueryKey(options)
	};
}
function infiniteReadContractsQueryKey(options) {
	const { contracts: _, query: _q, ...parameters } = options;
	return ["infiniteReadContracts", filterQueryOptions(parameters)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/prepareTransactionRequest.js
function prepareTransactionRequestQueryOptions(config, options = {}) {
	return {
		queryFn({ queryKey }) {
			const { scopeKey: _, to, ...parameters } = queryKey[1];
			if (!to) throw new Error("to is required");
			return prepareTransactionRequest(config, {
				to,
				...parameters
			});
		},
		queryKey: prepareTransactionRequestQueryKey(options)
	};
}
function prepareTransactionRequestQueryKey(options) {
	return ["prepareTransactionRequest", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/readContract.js
function readContractQueryOptions(config, options = {}) {
	return {
		async queryFn({ queryKey }) {
			const abi = options.abi;
			if (!abi) throw new Error("abi is required");
			const { functionName, scopeKey: _, ...parameters } = queryKey[1];
			const addressOrCodeParams = (() => {
				const params = queryKey[1];
				if (params.address) return { address: params.address };
				if (params.code) return { code: params.code };
				throw new Error("address or code is required");
			})();
			if (!functionName) throw new Error("functionName is required");
			return readContract(config, {
				abi,
				functionName,
				args: parameters.args,
				...addressOrCodeParams,
				...parameters
			});
		},
		queryKey: readContractQueryKey(options)
	};
}
function readContractQueryKey(options = {}) {
	const { abi: _, ...rest } = options;
	return ["readContract", filterQueryOptions(rest)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/readContracts.js
function readContractsQueryOptions(config, options = {}) {
	return {
		async queryFn({ queryKey }) {
			const contracts = [];
			const length = queryKey[1].contracts.length;
			for (let i = 0; i < length; i++) {
				const contract = queryKey[1].contracts[i];
				const abi = (options.contracts?.[i]).abi;
				contracts.push({
					...contract,
					abi
				});
			}
			const { scopeKey: _, ...parameters } = queryKey[1];
			return readContracts(config, {
				...parameters,
				contracts
			});
		},
		queryKey: readContractsQueryKey(options)
	};
}
function readContractsQueryKey(options = {}) {
	const contracts = [];
	for (const contract of options.contracts ?? []) {
		const { abi: _, ...rest } = contract;
		contracts.push({
			...rest,
			chainId: rest.chainId ?? options.chainId
		});
	}
	return ["readContracts", filterQueryOptions({
		...options,
		contracts
	})];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/reconnect.js
function reconnectMutationOptions(config) {
	return {
		mutationFn(variables) {
			return reconnect(config, variables);
		},
		mutationKey: ["reconnect"]
	};
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/sendCalls.js
function sendCallsMutationOptions(config) {
	return {
		mutationFn(variables) {
			return sendCalls(config, variables);
		},
		mutationKey: ["sendCalls"]
	};
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/sendCallsSync.js
function sendCallsSyncMutationOptions(config) {
	return {
		mutationFn(variables) {
			return sendCallsSync(config, variables);
		},
		mutationKey: ["sendCallsSync"]
	};
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/sendTransaction.js
function sendTransactionMutationOptions(config) {
	return {
		mutationFn(variables) {
			return sendTransaction(config, variables);
		},
		mutationKey: ["sendTransaction"]
	};
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/sendTransactionSync.js
function sendTransactionSyncMutationOptions(config) {
	return {
		mutationFn(variables) {
			return sendTransactionSync(config, variables);
		},
		mutationKey: ["sendTransactionSync"]
	};
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/showCallsStatus.js
function showCallsStatusMutationOptions(config) {
	return {
		mutationFn(variables) {
			return showCallsStatus(config, variables);
		},
		mutationKey: ["showCallsStatus"]
	};
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/signMessage.js
function signMessageMutationOptions(config) {
	return {
		mutationFn(variables) {
			return signMessage(config, variables);
		},
		mutationKey: ["signMessage"]
	};
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/signTypedData.js
function signTypedDataMutationOptions(config) {
	return {
		mutationFn(variables) {
			return signTypedData(config, variables);
		},
		mutationKey: ["signTypedData"]
	};
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/simulateContract.js
function simulateContractQueryOptions(config, options = {}) {
	return {
		async queryFn({ queryKey }) {
			const { abi, connector } = options;
			if (!abi) throw new Error("abi is required");
			const { scopeKey: _, ...parameters } = queryKey[1];
			const { address, functionName } = parameters;
			if (!address) throw new Error("address is required");
			if (!functionName) throw new Error("functionName is required");
			return simulateContract(config, {
				abi,
				connector,
				...parameters
			});
		},
		queryKey: simulateContractQueryKey(options)
	};
}
function simulateContractQueryKey(options = {}) {
	const { abi: _, connector: _c, ...rest } = options;
	return ["simulateContract", filterQueryOptions(rest)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/switchAccount.js
function switchAccountMutationOptions(config) {
	return {
		mutationFn(variables) {
			return switchAccount(config, variables);
		},
		mutationKey: ["switchAccount"]
	};
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/switchChain.js
function switchChainMutationOptions(config) {
	return {
		mutationFn(variables) {
			return switchChain(config, variables);
		},
		mutationKey: ["switchChain"]
	};
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/verifyMessage.js
function verifyMessageQueryOptions(config, options = {}) {
	return {
		async queryFn({ queryKey }) {
			const { address, message, signature } = queryKey[1];
			if (!address || !message || !signature) throw new Error("address, message, and signature are required");
			const { scopeKey: _, ...parameters } = queryKey[1];
			return await verifyMessage(config, parameters) ?? null;
		},
		queryKey: verifyMessageQueryKey(options)
	};
}
function verifyMessageQueryKey(options) {
	return ["verifyMessage", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/verifyTypedData.js
function verifyTypedDataQueryOptions(config, options = {}) {
	return {
		async queryFn({ queryKey }) {
			const { address, message, primaryType, signature, types, scopeKey: _, ...parameters } = queryKey[1];
			if (!address) throw new Error("address is required");
			if (!message) throw new Error("message is required");
			if (!primaryType) throw new Error("primaryType is required");
			if (!signature) throw new Error("signature is required");
			if (!types) throw new Error("types is required");
			return await verifyTypedData(config, {
				...parameters,
				address,
				message,
				primaryType,
				signature,
				types
			}) ?? null;
		},
		queryKey: verifyTypedDataQueryKey(options)
	};
}
function verifyTypedDataQueryKey(options) {
	return ["verifyTypedData", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/waitForCallsStatus.js
function waitForCallsStatusQueryOptions(config, options) {
	return {
		async queryFn({ queryKey }) {
			const { scopeKey: _, id, ...parameters } = queryKey[1];
			if (!id) throw new Error("id is required");
			return await waitForCallsStatus(config, {
				...parameters,
				id
			});
		},
		queryKey: waitForCallsStatusQueryKey(options),
		retry(failureCount, error) {
			if (error instanceof ConnectorNotConnectedError) return false;
			return failureCount < 3;
		}
	};
}
function waitForCallsStatusQueryKey(options) {
	return ["callsStatus", filterQueryOptions(options)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/waitForTransactionReceipt.js
function waitForTransactionReceiptQueryOptions(config, options = {}) {
	return {
		async queryFn({ queryKey }) {
			const { hash, ...parameters } = queryKey[1];
			if (!hash) throw new Error("hash is required");
			return waitForTransactionReceipt(config, {
				...parameters,
				onReplaced: options.onReplaced,
				hash
			});
		},
		queryKey: waitForTransactionReceiptQueryKey(options)
	};
}
function waitForTransactionReceiptQueryKey(options = {}) {
	const { onReplaced: _, ...rest } = options;
	return ["waitForTransactionReceipt", filterQueryOptions(rest)];
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/watchAsset.js
function watchAssetMutationOptions(config) {
	return {
		mutationFn(variables) {
			return watchAsset(config, variables);
		},
		mutationKey: ["watchAsset"]
	};
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/writeContract.js
function writeContractMutationOptions(config) {
	return {
		mutationFn(variables) {
			return writeContract(config, variables);
		},
		mutationKey: ["writeContract"]
	};
}
//#endregion
//#region node_modules/wagmi/dist/esm/utils/query.js
function useQuery(parameters) {
	const result = useQuery$1({
		...parameters,
		queryKeyHashFn: hashFn
	});
	result.queryKey = parameters.queryKey;
	return result;
}
function useInfiniteQuery(parameters) {
	const result = useInfiniteQuery$1({
		...parameters,
		queryKeyHashFn: hashFn
	});
	result.queryKey = parameters.queryKey;
	return result;
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useChainId.js
/** https://wagmi.sh/react/api/hooks/useChainId */
function useChainId(parameters = {}) {
	const config = useConfig(parameters);
	return (0, import_react.useSyncExternalStore)((onChange) => watchChainId(config, { onChange }), () => getChainId(config), () => getChainId(config));
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useBalance.js
/** https://wagmi.sh/react/api/hooks/useBalance */
function useBalance(parameters = {}) {
	const { address, query = {} } = parameters;
	const config = useConfig(parameters);
	const chainId = useChainId({ config });
	const options = getBalanceQueryOptions(config, {
		...parameters,
		chainId: parameters.chainId ?? chainId
	});
	const enabled = Boolean(address && (query.enabled ?? true));
	return useQuery({
		...query,
		...options,
		enabled
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useWatchBlocks.js
/** https://wagmi.sh/react/hooks/useWatchBlocks */
function useWatchBlocks(parameters = {}) {
	const { enabled = true, onBlock, config: _, ...rest } = parameters;
	const config = useConfig(parameters);
	const configChainId = useChainId({ config });
	const chainId = parameters.chainId ?? configChainId;
	(0, import_react.useEffect)(() => {
		if (!enabled) return;
		if (!onBlock) return;
		return watchBlocks(config, {
			...rest,
			chainId,
			onBlock
		});
	}, [
		chainId,
		config,
		enabled,
		onBlock,
		rest.blockTag,
		rest.emitMissed,
		rest.emitOnBegin,
		rest.includeTransactions,
		rest.onError,
		rest.poll,
		rest.pollingInterval,
		rest.syncConnectedChain
	]);
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useBlock.js
/** https://wagmi.sh/react/hooks/useBlock */
function useBlock(parameters = {}) {
	const { query = {}, watch } = parameters;
	const config = useConfig(parameters);
	const queryClient = useQueryClient();
	const configChainId = useChainId({ config });
	const chainId = parameters.chainId ?? configChainId;
	const options = getBlockQueryOptions(config, {
		...parameters,
		chainId
	});
	const enabled = Boolean(query.enabled ?? true);
	useWatchBlocks({
		config: parameters.config,
		chainId: parameters.chainId,
		...typeof watch === "object" ? watch : {},
		enabled: Boolean(enabled && (typeof watch === "object" ? watch.enabled : watch)),
		onBlock(block) {
			queryClient.setQueryData(options.queryKey, block);
		}
	});
	return useQuery({
		...query,
		...options,
		enabled
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useWatchBlockNumber.js
/** https://wagmi.sh/react/api/hooks/useWatchBlockNumber */
function useWatchBlockNumber(parameters = {}) {
	const { enabled = true, onBlockNumber, config: _, ...rest } = parameters;
	const config = useConfig(parameters);
	const configChainId = useChainId({ config });
	const chainId = parameters.chainId ?? configChainId;
	(0, import_react.useEffect)(() => {
		if (!enabled) return;
		if (!onBlockNumber) return;
		return watchBlockNumber(config, {
			...rest,
			chainId,
			onBlockNumber
		});
	}, [
		chainId,
		config,
		enabled,
		onBlockNumber,
		rest.onError,
		rest.emitMissed,
		rest.emitOnBegin,
		rest.poll,
		rest.pollingInterval,
		rest.syncConnectedChain
	]);
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useBlockNumber.js
/** https://wagmi.sh/react/api/hooks/useBlockNumber */
function useBlockNumber(parameters = {}) {
	const { query = {}, watch } = parameters;
	const config = useConfig(parameters);
	const queryClient = useQueryClient();
	const configChainId = useChainId({ config });
	const chainId = parameters.chainId ?? configChainId;
	const options = getBlockNumberQueryOptions(config, {
		...parameters,
		chainId
	});
	useWatchBlockNumber({
		config: parameters.config,
		chainId: parameters.chainId,
		...typeof watch === "object" ? watch : {},
		enabled: Boolean((query.enabled ?? true) && (typeof watch === "object" ? watch.enabled : watch)),
		onBlockNumber(blockNumber) {
			queryClient.setQueryData(options.queryKey, blockNumber);
		}
	});
	return useQuery({
		...query,
		...options
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useBlockTransactionCount.js
/** https://wagmi.sh/react/api/hooks/useBlockTransactionCount */
function useBlockTransactionCount(parameters = {}) {
	const { query = {} } = parameters;
	const config = useConfig(parameters);
	const configChainId = useChainId({ config });
	const chainId = parameters.chainId ?? configChainId;
	const options = getBlockTransactionCountQueryOptions(config, {
		...parameters,
		chainId
	});
	return useQuery({
		...query,
		...options
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useBytecode.js
/** https://wagmi.sh/react/api/hooks/useBytecode */
function useBytecode(parameters = {}) {
	const { address, query = {} } = parameters;
	const config = useConfig(parameters);
	const chainId = useChainId({ config });
	const options = getBytecodeQueryOptions(config, {
		...parameters,
		chainId: parameters.chainId ?? chainId
	});
	const enabled = Boolean(address && (query.enabled ?? true));
	return useQuery({
		...query,
		...options,
		enabled
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useCall.js
/** https://wagmi.sh/react/api/hooks/useCall */
function useCall(parameters = {}) {
	const { query = {} } = parameters;
	const config = useConfig(parameters);
	const chainId = useChainId({ config });
	const options = callQueryOptions(config, {
		...parameters,
		chainId: parameters.chainId ?? chainId
	});
	return useQuery({
		...query,
		...options
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useCallsStatus.js
/** https://wagmi.sh/react/api/hooks/useCallsStatus */
function useCallsStatus(parameters) {
	const { query = {} } = parameters;
	const options = getCallsStatusQueryOptions(useConfig(parameters), parameters);
	return useQuery({
		...query,
		...options
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useCapabilities.js
/** https://wagmi.sh/react/api/hooks/useCapabilities */
function useCapabilities(parameters = {}) {
	const { account, query = {} } = parameters;
	const { address } = useAccount();
	const options = getCapabilitiesQueryOptions(useConfig(parameters), {
		...parameters,
		account: account ?? address
	});
	return useQuery({
		...query,
		...options
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useChains.js
/** https://wagmi.sh/react/api/hooks/useChains */
function useChains(parameters = {}) {
	const config = useConfig(parameters);
	return (0, import_react.useSyncExternalStore)((onChange) => watchChains(config, { onChange }), () => getChains(config), () => getChains(config));
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useClient.js
/** https://wagmi.sh/react/api/hooks/useClient */
function useClient(parameters = {}) {
	const config = useConfig(parameters);
	return (0, import_with_selector.useSyncExternalStoreWithSelector)((onChange) => watchClient(config, { onChange }), () => getClient(config, parameters), () => getClient(config, parameters), (x) => x, (a, b) => a?.uid === b?.uid);
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useConnectors.js
/** https://wagmi.sh/react/api/hooks/useConnectors */
function useConnectors(parameters = {}) {
	const config = useConfig(parameters);
	return (0, import_react.useSyncExternalStore)((onChange) => watchConnectors(config, { onChange }), () => getConnectors(config), () => getConnectors(config));
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useConnect.js
/** https://wagmi.sh/react/api/hooks/useConnect */
function useConnect(parameters = {}) {
	const { mutation } = parameters;
	const config = useConfig(parameters);
	const mutationOptions = connectMutationOptions(config);
	const { mutate, mutateAsync, ...result } = useMutation({
		...mutation,
		...mutationOptions
	});
	(0, import_react.useEffect)(() => {
		return config.subscribe(({ status }) => status, (status, previousStatus) => {
			if (previousStatus === "connected" && status === "disconnected") result.reset();
		});
	}, [config, result.reset]);
	return {
		...result,
		connect: mutate,
		connectAsync: mutateAsync,
		connectors: useConnectors({ config })
	};
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useConnections.js
/** https://wagmi.sh/react/api/hooks/useConnections */
function useConnections(parameters = {}) {
	const config = useConfig(parameters);
	return (0, import_react.useSyncExternalStore)((onChange) => watchConnections(config, { onChange }), () => getConnections(config), () => getConnections(config));
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useConnectorClient.js
/** https://wagmi.sh/react/api/hooks/useConnectorClient */
function useConnectorClient(parameters = {}) {
	const { query = {}, ...rest } = parameters;
	const config = useConfig(rest);
	const queryClient = useQueryClient();
	const { address, connector, status } = useAccount({ config });
	const chainId = useChainId({ config });
	const activeConnector = parameters.connector ?? connector;
	const { queryKey, ...options } = getConnectorClientQueryOptions(config, {
		...parameters,
		chainId: parameters.chainId ?? chainId,
		connector: activeConnector
	});
	const enabled = Boolean((status === "connected" || status === "reconnecting" && activeConnector?.getProvider) && (query.enabled ?? true));
	const addressRef = (0, import_react.useRef)(address);
	(0, import_react.useEffect)(() => {
		const previousAddress = addressRef.current;
		if (!address && previousAddress) {
			queryClient.removeQueries({ queryKey });
			addressRef.current = void 0;
		} else if (address !== previousAddress) {
			queryClient.invalidateQueries({ queryKey });
			addressRef.current = address;
		}
	}, [address, queryClient]);
	return useQuery({
		...query,
		...options,
		queryKey,
		enabled,
		staleTime: Number.POSITIVE_INFINITY
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useDeployContract.js
/** https://wagmi.sh/react/api/hooks/useDeployContract */
function useDeployContract(parameters = {}) {
	const { mutation } = parameters;
	const mutationOptions = deployContractMutationOptions(useConfig(parameters));
	const { mutate, mutateAsync, ...result } = useMutation({
		...mutation,
		...mutationOptions
	});
	return {
		...result,
		deployContract: mutate,
		deployContractAsync: mutateAsync
	};
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useDisconnect.js
/** https://wagmi.sh/react/api/hooks/useDisconnect */
function useDisconnect(parameters = {}) {
	const { mutation } = parameters;
	const config = useConfig(parameters);
	const mutationOptions = disconnectMutationOptions(config);
	const { mutate, mutateAsync, ...result } = useMutation({
		...mutation,
		...mutationOptions
	});
	return {
		...result,
		connectors: useConnections({ config }).map((connection) => connection.connector),
		disconnect: mutate,
		disconnectAsync: mutateAsync
	};
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useEnsAddress.js
/** https://wagmi.sh/react/api/hooks/useEnsAddress */
function useEnsAddress(parameters = {}) {
	const { name, query = {} } = parameters;
	const config = useConfig(parameters);
	const chainId = useChainId({ config });
	const options = getEnsAddressQueryOptions(config, {
		...parameters,
		chainId: parameters.chainId ?? chainId
	});
	const enabled = Boolean(name && (query.enabled ?? true));
	return useQuery({
		...query,
		...options,
		enabled
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useEnsAvatar.js
/** https://wagmi.sh/react/api/hooks/useEnsAvatar */
function useEnsAvatar(parameters = {}) {
	const { name, query = {} } = parameters;
	const config = useConfig(parameters);
	const chainId = useChainId({ config });
	const options = getEnsAvatarQueryOptions(config, {
		...parameters,
		chainId: parameters.chainId ?? chainId
	});
	const enabled = Boolean(name && (query.enabled ?? true));
	return useQuery({
		...query,
		...options,
		enabled
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useEnsName.js
/** https://wagmi.sh/react/api/hooks/useEnsName */
function useEnsName(parameters = {}) {
	const { address, query = {} } = parameters;
	const config = useConfig(parameters);
	const chainId = useChainId({ config });
	const options = getEnsNameQueryOptions(config, {
		...parameters,
		chainId: parameters.chainId ?? chainId
	});
	const enabled = Boolean(address && (query.enabled ?? true));
	return useQuery({
		...query,
		...options,
		enabled
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useEnsResolver.js
/** https://wagmi.sh/react/api/hooks/useEnsResolver */
function useEnsResolver(parameters = {}) {
	const { name, query = {} } = parameters;
	const config = useConfig(parameters);
	const chainId = useChainId({ config });
	const options = getEnsResolverQueryOptions(config, {
		...parameters,
		chainId: parameters.chainId ?? chainId
	});
	const enabled = Boolean(name && (query.enabled ?? true));
	return useQuery({
		...query,
		...options,
		enabled
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useEnsText.js
/** https://wagmi.sh/react/api/hooks/useEnsText */
function useEnsText(parameters = {}) {
	const { key, name, query = {} } = parameters;
	const config = useConfig(parameters);
	const chainId = useChainId({ config });
	const options = getEnsTextQueryOptions(config, {
		...parameters,
		chainId: parameters.chainId ?? chainId
	});
	const enabled = Boolean(key && name && (query.enabled ?? true));
	return useQuery({
		...query,
		...options,
		enabled
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useEstimateFeesPerGas.js
/** https://wagmi.sh/react/api/hooks/useEstimateFeesPerGas */
function useEstimateFeesPerGas(parameters = {}) {
	const { query = {} } = parameters;
	const config = useConfig(parameters);
	const chainId = useChainId({ config });
	const options = estimateFeesPerGasQueryOptions(config, {
		...parameters,
		chainId: parameters.chainId ?? chainId
	});
	return useQuery({
		...query,
		...options
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useEstimateGas.js
function useEstimateGas(parameters = {}) {
	const { connector, query = {} } = parameters;
	const config = useConfig(parameters);
	const { data: connectorClient } = useConnectorClient({
		config,
		connector,
		query: { enabled: parameters.account === void 0 }
	});
	const account = parameters.account ?? connectorClient?.account;
	const chainId = useChainId({ config });
	const options = estimateGasQueryOptions(config, {
		...parameters,
		account,
		chainId: parameters.chainId ?? chainId,
		connector
	});
	const enabled = Boolean((account || connector) && (query.enabled ?? true));
	return useQuery({
		...query,
		...options,
		enabled
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useEstimateMaxPriorityFeePerGas.js
/** https://wagmi.sh/react/api/hooks/useEstimateMaxPriorityFeePerGas */
function useEstimateMaxPriorityFeePerGas(parameters = {}) {
	const { query = {} } = parameters;
	const config = useConfig(parameters);
	const chainId = useChainId({ config });
	const options = estimateMaxPriorityFeePerGasQueryOptions(config, {
		...parameters,
		chainId: parameters.chainId ?? chainId
	});
	return useQuery({
		...query,
		...options
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useFeeHistory.js
/** https://wagmi.sh/react/api/hooks/useFeeHistory */
function useFeeHistory(parameters = {}) {
	const { blockCount, rewardPercentiles, query = {} } = parameters;
	const config = useConfig(parameters);
	const chainId = useChainId({ config });
	const options = getFeeHistoryQueryOptions(config, {
		...parameters,
		chainId: parameters.chainId ?? chainId
	});
	const enabled = Boolean(blockCount && rewardPercentiles && (query.enabled ?? true));
	return useQuery({
		...query,
		...options,
		enabled
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useGasPrice.js
/** https://wagmi.sh/react/api/hooks/useGasPrice */
function useGasPrice(parameters = {}) {
	const { query = {} } = parameters;
	const config = useConfig(parameters);
	const configChainId = useChainId({ config });
	const chainId = parameters.chainId ?? configChainId;
	const options = getGasPriceQueryOptions(config, {
		...parameters,
		chainId
	});
	return useQuery({
		...query,
		...options
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useInfiniteReadContracts.js
/** https://wagmi.sh/react/api/hooks/useInfiniteReadContracts */
function useInfiniteReadContracts(parameters) {
	const { contracts = [], query } = parameters;
	const config = useConfig(parameters);
	const chainId = useChainId({ config });
	const options = infiniteReadContractsQueryOptions(config, {
		...parameters,
		chainId,
		contracts,
		query
	});
	return useInfiniteQuery({
		...query,
		...options,
		initialPageParam: options.initialPageParam,
		structuralSharing: query.structuralSharing ?? structuralSharing
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/usePrepareTransactionRequest.js
/** https://wagmi.sh/react/api/hooks/usePrepareTransactionRequest */
function usePrepareTransactionRequest(parameters = {}) {
	const { to, query = {} } = parameters;
	const config = useConfig(parameters);
	const chainId = useChainId({ config });
	const options = prepareTransactionRequestQueryOptions(config, {
		...parameters,
		chainId: parameters.chainId ?? chainId
	});
	const enabled = Boolean(to && (query.enabled ?? true));
	return useQuery({
		...query,
		...options,
		enabled
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useProof.js
/** https://wagmi.sh/react/api/hooks/useProof */
function useProof(parameters = {}) {
	const { address, storageKeys, query = {} } = parameters;
	const config = useConfig(parameters);
	const chainId = useChainId({ config });
	const options = getProofQueryOptions(config, {
		...parameters,
		chainId: parameters.chainId ?? chainId
	});
	const enabled = Boolean(address && storageKeys && (query.enabled ?? true));
	return useQuery({
		...query,
		...options,
		enabled
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/usePublicClient.js
/** https://wagmi.sh/react/api/hooks/usePublicClient */
function usePublicClient(parameters = {}) {
	const config = useConfig(parameters);
	return (0, import_with_selector.useSyncExternalStoreWithSelector)((onChange) => watchPublicClient(config, { onChange }), () => getPublicClient(config, parameters), () => getPublicClient(config, parameters), (x) => x, (a, b) => a?.uid === b?.uid);
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useReadContract.js
/** https://wagmi.sh/react/api/hooks/useReadContract */
function useReadContract(parameters = {}) {
	const { abi, address, functionName, query = {} } = parameters;
	const code = parameters.code;
	const config = useConfig(parameters);
	const chainId = useChainId({ config });
	const options = readContractQueryOptions(config, {
		...parameters,
		chainId: parameters.chainId ?? chainId
	});
	const enabled = Boolean((address || code) && abi && functionName && (query.enabled ?? true));
	return useQuery({
		...query,
		...options,
		enabled,
		structuralSharing: query.structuralSharing ?? structuralSharing
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useReadContracts.js
/** https://wagmi.sh/react/api/hooks/useReadContracts */
function useReadContracts(parameters = {}) {
	const { contracts = [], query = {} } = parameters;
	const config = useConfig(parameters);
	const chainId = useChainId({ config });
	const contractsChainId = (0, import_react.useMemo)(() => {
		if (contracts.length === 0) return void 0;
		const firstChainId = contracts[0].chainId;
		if (contracts.every((contract) => contract.chainId === firstChainId)) return firstChainId;
	}, [contracts]);
	const options = readContractsQueryOptions(config, {
		...parameters,
		chainId: contractsChainId ?? chainId
	});
	const enabled = (0, import_react.useMemo)(() => {
		let isContractsValid = false;
		for (const contract of contracts) {
			const { abi, address, functionName } = contract;
			if (!abi || !address || !functionName) {
				isContractsValid = false;
				break;
			}
			isContractsValid = true;
		}
		return Boolean(isContractsValid && (query.enabled ?? true));
	}, [contracts, query.enabled]);
	return useQuery({
		...options,
		...query,
		enabled,
		structuralSharing: query.structuralSharing ?? structuralSharing
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useReconnect.js
/** https://wagmi.sh/react/api/hooks/useReconnect */
function useReconnect(parameters = {}) {
	const { mutation } = parameters;
	const config = useConfig(parameters);
	const mutationOptions = reconnectMutationOptions(config);
	const { mutate, mutateAsync, ...result } = useMutation({
		...mutation,
		...mutationOptions
	});
	return {
		...result,
		connectors: config.connectors,
		reconnect: mutate,
		reconnectAsync: mutateAsync
	};
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useSendCalls.js
/** https://wagmi.sh/react/api/hooks/useSendCalls */
function useSendCalls(parameters = {}) {
	const { mutation } = parameters;
	const mutationOptions = sendCallsMutationOptions(useConfig(parameters));
	const { mutate, mutateAsync, ...result } = useMutation({
		...mutation,
		...mutationOptions
	});
	return {
		...result,
		sendCalls: mutate,
		sendCallsAsync: mutateAsync
	};
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useSendCallsSync.js
/** https://wagmi.sh/react/api/hooks/useSendCallsSync */
function useSendCallsSync(parameters = {}) {
	const { mutation } = parameters;
	const mutationOptions = sendCallsSyncMutationOptions(useConfig(parameters));
	const { mutate, mutateAsync, ...result } = useMutation({
		...mutation,
		...mutationOptions
	});
	return {
		...result,
		sendCallsSync: mutate,
		sendCallsSyncAsync: mutateAsync
	};
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useSendTransaction.js
/** https://wagmi.sh/react/api/hooks/useSendTransaction */
function useSendTransaction(parameters = {}) {
	const { mutation } = parameters;
	const mutationOptions = sendTransactionMutationOptions(useConfig(parameters));
	const { mutate, mutateAsync, ...result } = useMutation({
		...mutation,
		...mutationOptions
	});
	return {
		...result,
		sendTransaction: mutate,
		sendTransactionAsync: mutateAsync
	};
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useSendTransactionSync.js
/** https://wagmi.sh/react/api/hooks/useSendTransactionSync */
function useSendTransactionSync(parameters = {}) {
	const { mutation } = parameters;
	const mutationOptions = sendTransactionSyncMutationOptions(useConfig(parameters));
	const { mutate, mutateAsync, ...result } = useMutation({
		...mutation,
		...mutationOptions
	});
	return {
		...result,
		sendTransactionSync: mutate,
		sendTransactionSyncAsync: mutateAsync
	};
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useShowCallsStatus.js
/** https://wagmi.sh/react/api/hooks/useShowCallsStatus */
function useShowCallsStatus(parameters = {}) {
	const { mutation } = parameters;
	const mutationOptions = showCallsStatusMutationOptions(useConfig(parameters));
	const { mutate, mutateAsync, ...result } = useMutation({
		...mutation,
		...mutationOptions
	});
	return {
		...result,
		showCallsStatus: mutate,
		showCallsStatusAsync: mutateAsync
	};
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useSignMessage.js
/** https://wagmi.sh/react/api/hooks/useSignMessage */
function useSignMessage(parameters = {}) {
	const { mutation } = parameters;
	const mutationOptions = signMessageMutationOptions(useConfig(parameters));
	const { mutate, mutateAsync, ...result } = useMutation({
		...mutation,
		...mutationOptions
	});
	return {
		...result,
		signMessage: mutate,
		signMessageAsync: mutateAsync
	};
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useSignTypedData.js
/** https://wagmi.sh/react/api/hooks/useSignTypedData */
function useSignTypedData(parameters = {}) {
	const { mutation } = parameters;
	const mutationOptions = signTypedDataMutationOptions(useConfig(parameters));
	const { mutate, mutateAsync, ...result } = useMutation({
		...mutation,
		...mutationOptions
	});
	return {
		...result,
		signTypedData: mutate,
		signTypedDataAsync: mutateAsync
	};
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useSimulateContract.js
/** https://wagmi.sh/react/api/hooks/useSimulateContract */
function useSimulateContract(parameters = {}) {
	const { abi, address, connector, functionName, query = {} } = parameters;
	const config = useConfig(parameters);
	const { data: connectorClient } = useConnectorClient({
		config,
		connector,
		query: { enabled: parameters.account === void 0 }
	});
	const chainId = useChainId({ config });
	const options = simulateContractQueryOptions(config, {
		...parameters,
		account: parameters.account ?? connectorClient?.account,
		chainId: parameters.chainId ?? chainId
	});
	const enabled = Boolean(abi && address && functionName && (query.enabled ?? true));
	return useQuery({
		...query,
		...options,
		enabled
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useStorageAt.js
/** https://wagmi.sh/react/api/hooks/useStorageAt */
function useStorageAt(parameters = {}) {
	const { address, slot, query = {} } = parameters;
	const config = useConfig(parameters);
	const chainId = useChainId({ config });
	const options = getStorageAtQueryOptions(config, {
		...parameters,
		chainId: parameters.chainId ?? chainId
	});
	const enabled = Boolean(address && slot && (query.enabled ?? true));
	return useQuery({
		...query,
		...options,
		enabled
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useSwitchAccount.js
/** https://wagmi.sh/react/api/hooks/useSwitchAccount */
function useSwitchAccount(parameters = {}) {
	const { mutation } = parameters;
	const config = useConfig(parameters);
	const mutationOptions = switchAccountMutationOptions(config);
	const { mutate, mutateAsync, ...result } = useMutation({
		...mutation,
		...mutationOptions
	});
	return {
		...result,
		connectors: useConnections({ config }).map((connection) => connection.connector),
		switchAccount: mutate,
		switchAccountAsync: mutateAsync
	};
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useSwitchChain.js
/** https://wagmi.sh/react/api/hooks/useSwitchChain */
function useSwitchChain(parameters = {}) {
	const { mutation } = parameters;
	const config = useConfig(parameters);
	const mutationOptions = switchChainMutationOptions(config);
	const { mutate, mutateAsync, ...result } = useMutation({
		...mutation,
		...mutationOptions
	});
	return {
		...result,
		chains: useChains({ config }),
		switchChain: mutate,
		switchChainAsync: mutateAsync
	};
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useToken.js
/**
* @deprecated
*
* https://wagmi.sh/react/api/hooks/useToken
*/
function useToken(parameters = {}) {
	const { address, query = {} } = parameters;
	const config = useConfig(parameters);
	const chainId = useChainId({ config });
	const options = getTokenQueryOptions(config, {
		...parameters,
		chainId: parameters.chainId ?? chainId
	});
	const enabled = Boolean(address && (query.enabled ?? true));
	return useQuery({
		...query,
		...options,
		enabled
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useTransaction.js
/** https://wagmi.sh/react/api/hooks/useTransaction */
function useTransaction(parameters = {}) {
	const { blockHash, blockNumber, blockTag, hash, query = {} } = parameters;
	const config = useConfig(parameters);
	const chainId = useChainId({ config });
	const options = getTransactionQueryOptions(config, {
		...parameters,
		chainId: parameters.chainId ?? chainId
	});
	const enabled = Boolean(!(blockHash && blockNumber && blockTag && hash) && (query.enabled ?? true));
	return useQuery({
		...query,
		...options,
		enabled
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useTransactionConfirmations.js
/** https://wagmi.sh/react/api/hooks/useTransactionConfirmations */
function useTransactionConfirmations(parameters = {}) {
	const { hash, transactionReceipt, query = {} } = parameters;
	const config = useConfig(parameters);
	const chainId = useChainId({ config });
	const options = getTransactionConfirmationsQueryOptions(config, {
		...parameters,
		chainId: parameters.chainId ?? chainId
	});
	const enabled = Boolean(!(hash && transactionReceipt) && (hash || transactionReceipt) && (query.enabled ?? true));
	return useQuery({
		...query,
		...options,
		enabled
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useTransactionCount.js
/** https://wagmi.sh/react/api/hooks/useTransactionCount */
function useTransactionCount(parameters = {}) {
	const { address, query = {} } = parameters;
	const config = useConfig(parameters);
	const chainId = useChainId({ config });
	const options = getTransactionCountQueryOptions(config, {
		...parameters,
		chainId: parameters.chainId ?? chainId
	});
	const enabled = Boolean(address && (query.enabled ?? true));
	return useQuery({
		...query,
		...options,
		enabled
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useTransactionReceipt.js
/** https://wagmi.sh/react/api/hooks/useTransactionReceipt */
function useTransactionReceipt(parameters = {}) {
	const { hash, query = {} } = parameters;
	const config = useConfig(parameters);
	const chainId = useChainId({ config });
	const options = getTransactionReceiptQueryOptions(config, {
		...parameters,
		chainId: parameters.chainId ?? chainId
	});
	const enabled = Boolean(hash && (query.enabled ?? true));
	return useQuery({
		...query,
		...options,
		enabled
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useVerifyMessage.js
/** https://wagmi.sh/react/api/hooks/useVerifyMessage */
function useVerifyMessage(parameters = {}) {
	const { address, message, signature, query = {} } = parameters;
	const config = useConfig(parameters);
	const chainId = useChainId({ config });
	const options = verifyMessageQueryOptions(config, {
		...parameters,
		chainId: parameters.chainId ?? chainId
	});
	const enabled = Boolean(address && message && signature && (query.enabled ?? true));
	return useQuery({
		...query,
		...options,
		enabled
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useVerifyTypedData.js
/** https://wagmi.sh/react/api/hooks/useVerifyTypedData */
function useVerifyTypedData(parameters = {}) {
	const { address, message, primaryType, signature, types, query = {} } = parameters;
	const config = useConfig(parameters);
	const chainId = useChainId({ config });
	const options = verifyTypedDataQueryOptions(config, {
		...parameters,
		chainId: parameters.chainId ?? chainId
	});
	const enabled = Boolean(address && message && primaryType && signature && types && (query.enabled ?? true));
	return useQuery({
		...query,
		...options,
		enabled
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useWaitForCallsStatus.js
/** https://wagmi.sh/react/api/hooks/useWaitForCallsStatus */
function useWaitForCallsStatus(parameters) {
	const { id, query = {} } = parameters;
	const options = waitForCallsStatusQueryOptions(useConfig(parameters), parameters);
	const enabled = Boolean(id && (query.enabled ?? true));
	return useQuery({
		...query,
		...options,
		enabled
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useWaitForTransactionReceipt.js
/** https://wagmi.sh/react/api/hooks/useWaitForTransactionReceipt */
function useWaitForTransactionReceipt(parameters = {}) {
	const { hash, query = {} } = parameters;
	const config = useConfig(parameters);
	const chainId = useChainId({ config });
	const options = waitForTransactionReceiptQueryOptions(config, {
		...parameters,
		chainId: parameters.chainId ?? chainId
	});
	const enabled = Boolean(hash && (query.enabled ?? true));
	return useQuery({
		...query,
		...options,
		enabled
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useWalletClient.js
/** https://wagmi.sh/react/api/hooks/useWalletClient */
function useWalletClient(parameters = {}) {
	const { query = {}, ...rest } = parameters;
	const config = useConfig(rest);
	const queryClient = useQueryClient();
	const { address, connector, status } = useAccount({ config });
	const chainId = useChainId({ config });
	const activeConnector = parameters.connector ?? connector;
	const { queryKey, ...options } = getWalletClientQueryOptions(config, {
		...parameters,
		chainId: parameters.chainId ?? chainId,
		connector: parameters.connector ?? connector
	});
	const enabled = Boolean((status === "connected" || status === "reconnecting" && activeConnector?.getProvider) && (query.enabled ?? true));
	const addressRef = (0, import_react.useRef)(address);
	(0, import_react.useEffect)(() => {
		const previousAddress = addressRef.current;
		if (!address && previousAddress) {
			queryClient.removeQueries({ queryKey });
			addressRef.current = void 0;
		} else if (address !== previousAddress) {
			queryClient.invalidateQueries({ queryKey });
			addressRef.current = address;
		}
	}, [address, queryClient]);
	return useQuery({
		...query,
		...options,
		queryKey,
		enabled,
		staleTime: Number.POSITIVE_INFINITY
	});
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useWatchAsset.js
/** https://wagmi.sh/react/api/hooks/useWatchAsset */
function useWatchAsset(parameters = {}) {
	const { mutation } = parameters;
	const mutationOptions = watchAssetMutationOptions(useConfig(parameters));
	const { mutate, mutateAsync, ...result } = useMutation({
		...mutation,
		...mutationOptions
	});
	return {
		...result,
		watchAsset: mutate,
		watchAssetAsync: mutateAsync
	};
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useWatchContractEvent.js
/** https://wagmi.sh/react/api/hooks/useWatchContractEvent */
function useWatchContractEvent(parameters = {}) {
	const { enabled = true, onLogs, config: _, ...rest } = parameters;
	const config = useConfig(parameters);
	const configChainId = useChainId({ config });
	const chainId = parameters.chainId ?? configChainId;
	(0, import_react.useEffect)(() => {
		if (!enabled) return;
		if (!onLogs) return;
		return watchContractEvent(config, {
			...rest,
			chainId,
			onLogs
		});
	}, [
		chainId,
		config,
		enabled,
		onLogs,
		rest.abi,
		rest.address,
		rest.args,
		rest.batch,
		rest.eventName,
		rest.fromBlock,
		rest.onError,
		rest.poll,
		rest.pollingInterval,
		rest.strict,
		rest.syncConnectedChain
	]);
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useWatchPendingTransactions.js
/** https://wagmi.sh/react/api/hooks/useWatchPendingTransactions */
function useWatchPendingTransactions(parameters = {}) {
	const { enabled = true, onTransactions, config: _, ...rest } = parameters;
	const config = useConfig(parameters);
	const configChainId = useChainId({ config });
	const chainId = parameters.chainId ?? configChainId;
	(0, import_react.useEffect)(() => {
		if (!enabled) return;
		if (!onTransactions) return;
		return watchPendingTransactions(config, {
			...rest,
			chainId,
			onTransactions
		});
	}, [
		chainId,
		config,
		enabled,
		onTransactions,
		rest.batch,
		rest.onError,
		rest.poll,
		rest.pollingInterval,
		rest.syncConnectedChain
	]);
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useWriteContract.js
/** https://wagmi.sh/react/api/hooks/useWriteContract */
function useWriteContract(parameters = {}) {
	const { mutation } = parameters;
	const mutationOptions = writeContractMutationOptions(useConfig(parameters));
	const { mutate, mutateAsync, ...result } = useMutation({
		...mutation,
		...mutationOptions
	});
	return {
		...result,
		writeContract: mutate,
		writeContractAsync: mutateAsync
	};
}
//#endregion
export { useCall as $, useProof as A, useEnsName as B, useSendTransaction as C, useReadContracts as D, useReconnect as E, useEstimateMaxPriorityFeePerGas as F, useConnectorClient as G, useEnsAddress as H, useEstimateGas as I, useConnectors as J, useConnections as K, useEstimateFeesPerGas as L, useInfiniteReadContracts as M, useGasPrice as N, useReadContract as O, useFeeHistory as P, useCallsStatus as Q, useEnsText as R, useSendTransactionSync as S, useSendCalls as T, useDisconnect as U, useEnsAvatar as V, useDeployContract as W, useChains as X, useClient as Y, useCapabilities as Z, useStorageAt as _, useWalletClient as a, useWatchBlocks as at, useSignMessage as b, useVerifyTypedData as c, useAccountEffect as ct, useTransactionCount as d, WagmiProviderNotFoundError as dt, useBytecode as et, useTransactionConfirmations as f, BaseError as ft, useSwitchAccount as g, Hydrate as gt, useSwitchChain as h, WagmiProvider as ht, useWatchAsset as i, useBlock as it, usePrepareTransactionRequest as j, usePublicClient as k, useVerifyMessage as l, useAccount as lt, useToken as m, WagmiContext as mt, useWatchPendingTransactions as n, useBlockNumber as nt, useWaitForTransactionReceipt as o, useBalance as ot, useTransaction as p, version as pt, useConnect as q, useWatchContractEvent as r, useWatchBlockNumber as rt, useWaitForCallsStatus as s, useChainId as st, useWriteContract as t, useBlockTransactionCount as tt, useTransactionReceipt as u, useConfig as ut, useSimulateContract as v, useSendCallsSync as w, useShowCallsStatus as x, useSignTypedData as y, useEnsResolver as z };

//# sourceMappingURL=exports-CFL2tFBu.js.map