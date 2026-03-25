import { f as chainConfig } from "./sepolia-8_St3NiF.js";
import { t as defineChain } from "./defineChain-DOrIgftx.js";
//#region node_modules/viem/_esm/chains/definitions/avalanche.js
var avalanche = /* @__PURE__ */ defineChain({
	id: 43114,
	name: "Avalanche",
	blockTime: 1700,
	nativeCurrency: {
		decimals: 18,
		name: "Avalanche",
		symbol: "AVAX"
	},
	rpcUrls: { default: { http: ["https://api.avax.network/ext/bc/C/rpc"] } },
	blockExplorers: { default: {
		name: "SnowTrace",
		url: "https://snowtrace.io",
		apiUrl: "https://api.snowtrace.io"
	} },
	contracts: { multicall3: {
		address: "0xca11bde05977b3631167028862be2a173976ca11",
		blockCreated: 11907934
	} }
});
//#endregion
//#region node_modules/viem/_esm/chains/definitions/zora.js
var sourceId = 1;
var zora = /* @__PURE__ */ defineChain({
	...chainConfig,
	id: 7777777,
	name: "Zora",
	nativeCurrency: {
		decimals: 18,
		name: "Ether",
		symbol: "ETH"
	},
	rpcUrls: { default: {
		http: ["https://rpc.zora.energy"],
		webSocket: ["wss://rpc.zora.energy"]
	} },
	blockExplorers: { default: {
		name: "Explorer",
		url: "https://explorer.zora.energy",
		apiUrl: "https://explorer.zora.energy/api"
	} },
	contracts: {
		...chainConfig.contracts,
		l2OutputOracle: { [sourceId]: { address: "0x9E6204F750cD866b299594e2aC9eA824E2e5f95c" } },
		multicall3: {
			address: "0xcA11bde05977b3631167028862bE2a173976CA11",
			blockCreated: 5882
		},
		portal: { [sourceId]: { address: "0x1a0ad011913A150f69f6A19DF447A0CfD9551054" } },
		l1StandardBridge: { [sourceId]: { address: "0x3e2Ea9B92B7E48A52296fD261dc26fd995284631" } }
	},
	sourceId
});
//#endregion
export { avalanche as n, zora as t };

//# sourceMappingURL=zora-BFce2pkS.js.map