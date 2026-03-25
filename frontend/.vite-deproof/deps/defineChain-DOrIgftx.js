//#region node_modules/viem/_esm/utils/chain/defineChain.js
function defineChain(chain) {
	const chainInstance = {
		formatters: void 0,
		fees: void 0,
		serializers: void 0,
		...chain
	};
	function extend(base) {
		return (fnOrExtended) => {
			const properties = typeof fnOrExtended === "function" ? fnOrExtended(base) : fnOrExtended;
			const combined = {
				...base,
				...properties
			};
			return Object.assign(combined, { extend: extend(combined) });
		};
	}
	return Object.assign(chainInstance, { extend: extend(chainInstance) });
}
function extendSchema() {
	return {};
}
//#endregion
export { extendSchema as n, defineChain as t };

//# sourceMappingURL=defineChain-DOrIgftx.js.map