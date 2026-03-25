import { t as defineChain } from "./defineChain-DOrIgftx.js";
//#region node_modules/viem/_esm/chains/definitions/polygonAmoy.js
var polygonAmoy = /* @__PURE__ */ defineChain({
	id: 80002,
	name: "Polygon Amoy",
	nativeCurrency: {
		name: "POL",
		symbol: "POL",
		decimals: 18
	},
	rpcUrls: { default: { http: ["https://rpc-amoy.polygon.technology"] } },
	blockExplorers: { default: {
		name: "PolygonScan",
		url: "https://amoy.polygonscan.com",
		apiUrl: "https://api.etherscan.io/v2/api"
	} },
	contracts: { multicall3: {
		address: "0xca11bde05977b3631167028862be2a173976ca11",
		blockCreated: 3127388
	} },
	testnet: true
});
//#endregion
export { polygonAmoy as t };

//# sourceMappingURL=polygonAmoy-YRPSwb-H.js.map