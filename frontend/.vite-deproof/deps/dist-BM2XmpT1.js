import { s as __toESM, t as __commonJSMin } from "./chunk-t8Qwt55I.js";
import { Zt as decodeAbiParameters, rn as erc20Abi, t as isAddressEqual } from "./isAddressEqual-DXU8Mzf0.js";
import { C as isAddress, S as getAddress, d as encodeAbiParameters, t as encodeFunctionData, v as slice$2, w as keccak256 } from "./encodeFunctionData-YLQ8NBAq.js";
import { E as isHex, T as size$2, _ as trim, b as pad$1, c as numberToHex, g as hexToString, h as hexToNumber$2, i as stringToBytes, l as stringToHex, p as hexToBigInt, r as hexToBytes$2, u as toHex$2, w as BaseError$1 } from "./stringify-Bm23iD_D.js";
import "./utils-DmXAPd06.js";
import { r as waitForCallsStatus, t as import_eventemitter3 } from "./eventemitter3-Big23LkK.js";
import { W as getCode, ot as readContract } from "./account-r4vEt8f4.js";
import { r as decodeFunctionData } from "./localBatchGatewayRequest-B2i6dG49.js";
import "./secp256k1-C6EqCcUM.js";
import { a as entryPoint06Abi, c as encodePacked, i as entryPoint06Address, n as toSmartAccount, o as parseSignature, r as getUserOperationHash, s as createPublicClient, t as createBundlerClient } from "./createBundlerClient-DvvmTeAH.js";
import { t as http } from "./http-DRuaSs_V.js";
import { t as defineChain } from "./defineChain-DOrIgftx.js";
import { i as persist, n as createJSONStorage, t as createStore } from "./vanilla-D9FQEqm8.js";
import { a as hashMessage, t as hashTypedData } from "./hashTypedData-DplZ1g8o.js";
import "./eventemitter3--nuI5ZCb.js";
import { i as get$1, n as createStore$1, o as set, r as del } from "./dist-S5eNstYC.js";
import { a as y, c as init_preact_module, i as init_hooks_module, n as h, o as B, s as _ } from "./hooks.module-5GJgYZAT.js";
//#region node_modules/@coinbase/wallet-sdk/dist/sdk-info.js
var VERSION = "4.3.6";
var NAME = "@coinbase/wallet-sdk";
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/store/store.js
var createChainSlice = () => {
	return { chains: [] };
};
var createKeysSlice = () => {
	return { keys: {} };
};
var createAccountSlice = () => {
	return { account: {} };
};
var createSubAccountSlice = () => {
	return { subAccount: void 0 };
};
var createSubAccountConfigSlice = () => {
	return { subAccountConfig: {} };
};
var createSpendPermissionsSlice = () => {
	return { spendPermissions: [] };
};
var createConfigSlice = () => {
	return { config: { version: VERSION } };
};
var sdkstore = createStore(persist((...args) => Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, createChainSlice(...args)), createKeysSlice(...args)), createAccountSlice(...args)), createSubAccountSlice(...args)), createSpendPermissionsSlice(...args)), createConfigSlice(...args)), createSubAccountConfigSlice(...args)), {
	name: "cbwsdk.store",
	storage: createJSONStorage(() => localStorage),
	partialize: (state) => {
		return {
			chains: state.chains,
			keys: state.keys,
			account: state.account,
			subAccount: state.subAccount,
			spendPermissions: state.spendPermissions,
			config: state.config
		};
	}
}));
var subAccountsConfig = {
	get: () => sdkstore.getState().subAccountConfig,
	set: (subAccountConfig) => {
		sdkstore.setState((state) => ({ subAccountConfig: Object.assign(Object.assign({}, state.subAccountConfig), subAccountConfig) }));
	},
	clear: () => {
		sdkstore.setState({ subAccountConfig: {} });
	}
};
var subAccounts = {
	get: () => sdkstore.getState().subAccount,
	set: (subAccount) => {
		sdkstore.setState((state) => ({ subAccount: state.subAccount ? Object.assign(Object.assign({}, state.subAccount), subAccount) : Object.assign({ address: subAccount.address }, subAccount) }));
	},
	clear: () => {
		sdkstore.setState({ subAccount: void 0 });
	}
};
var spendPermissions = {
	get: () => sdkstore.getState().spendPermissions,
	set: (spendPermissions) => {
		sdkstore.setState({ spendPermissions });
	},
	clear: () => {
		sdkstore.setState({ spendPermissions: [] });
	}
};
var account = {
	get: () => sdkstore.getState().account,
	set: (account) => {
		sdkstore.setState((state) => ({ account: Object.assign(Object.assign({}, state.account), account) }));
	},
	clear: () => {
		sdkstore.setState({ account: {} });
	}
};
var chains = {
	get: () => sdkstore.getState().chains,
	set: (chains) => {
		sdkstore.setState({ chains });
	},
	clear: () => {
		sdkstore.setState({ chains: [] });
	}
};
var keys = {
	get: (key) => sdkstore.getState().keys[key],
	set: (key, value) => {
		sdkstore.setState((state) => ({ keys: Object.assign(Object.assign({}, state.keys), { [key]: value }) }));
	},
	clear: () => {
		sdkstore.setState({ keys: {} });
	}
};
var config = {
	get: () => sdkstore.getState().config,
	set: (config) => {
		sdkstore.setState((state) => ({ config: Object.assign(Object.assign({}, state.config), config) }));
	}
};
var actions = {
	subAccounts,
	subAccountsConfig,
	spendPermissions,
	account,
	chains,
	keys,
	config
};
var store = Object.assign(Object.assign({}, sdkstore), actions);
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/telemetry/telemetry-content.js
var TELEMETRY_SCRIPT_CONTENT = `!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.ClientAnalytics=t():e.ClientAnalytics=t()}(this,(function(){return(()=>{var e={792:e=>{var t={utf8:{stringToBytes:function(e){return t.bin.stringToBytes(unescape(encodeURIComponent(e)))},bytesToString:function(e){return decodeURIComponent(escape(t.bin.bytesToString(e)))}},bin:{stringToBytes:function(e){for(var t=[],n=0;n<e.length;n++)t.push(255&e.charCodeAt(n));return t},bytesToString:function(e){for(var t=[],n=0;n<e.length;n++)t.push(String.fromCharCode(e[n]));return t.join("")}}};e.exports=t},562:e=>{var t,n;t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",n={rotl:function(e,t){return e<<t|e>>>32-t},rotr:function(e,t){return e<<32-t|e>>>t},endian:function(e){if(e.constructor==Number)return 16711935&n.rotl(e,8)|4278255360&n.rotl(e,24);for(var t=0;t<e.length;t++)e[t]=n.endian(e[t]);return e},randomBytes:function(e){for(var t=[];e>0;e--)t.push(Math.floor(256*Math.random()));return t},bytesToWords:function(e){for(var t=[],n=0,r=0;n<e.length;n++,r+=8)t[r>>>5]|=e[n]<<24-r%32;return t},wordsToBytes:function(e){for(var t=[],n=0;n<32*e.length;n+=8)t.push(e[n>>>5]>>>24-n%32&255);return t},bytesToHex:function(e){for(var t=[],n=0;n<e.length;n++)t.push((e[n]>>>4).toString(16)),t.push((15&e[n]).toString(16));return t.join("")},hexToBytes:function(e){for(var t=[],n=0;n<e.length;n+=2)t.push(parseInt(e.substr(n,2),16));return t},bytesToBase64:function(e){for(var n=[],r=0;r<e.length;r+=3)for(var i=e[r]<<16|e[r+1]<<8|e[r+2],a=0;a<4;a++)8*r+6*a<=8*e.length?n.push(t.charAt(i>>>6*(3-a)&63)):n.push("=");return n.join("")},base64ToBytes:function(e){e=e.replace(/[^A-Z0-9+\\/]/gi,"");for(var n=[],r=0,i=0;r<e.length;i=++r%4)0!=i&&n.push((t.indexOf(e.charAt(r-1))&Math.pow(2,-2*i+8)-1)<<2*i|t.indexOf(e.charAt(r))>>>6-2*i);return n}},e.exports=n},335:e=>{function t(e){return!!e.constructor&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)}e.exports=function(e){return null!=e&&(t(e)||function(e){return"function"==typeof e.readFloatLE&&"function"==typeof e.slice&&t(e.slice(0,0))}(e)||!!e._isBuffer)}},762:(e,t,n)=>{var r,i,a,o,s;r=n(562),i=n(792).utf8,a=n(335),o=n(792).bin,(s=function(e,t){e.constructor==String?e=t&&"binary"===t.encoding?o.stringToBytes(e):i.stringToBytes(e):a(e)?e=Array.prototype.slice.call(e,0):Array.isArray(e)||e.constructor===Uint8Array||(e=e.toString());for(var n=r.bytesToWords(e),c=8*e.length,u=1732584193,l=-271733879,d=-1732584194,p=271733878,m=0;m<n.length;m++)n[m]=16711935&(n[m]<<8|n[m]>>>24)|4278255360&(n[m]<<24|n[m]>>>8);n[c>>>5]|=128<<c%32,n[14+(c+64>>>9<<4)]=c;var f=s._ff,v=s._gg,g=s._hh,b=s._ii;for(m=0;m<n.length;m+=16){var h=u,w=l,y=d,T=p;u=f(u,l,d,p,n[m+0],7,-680876936),p=f(p,u,l,d,n[m+1],12,-389564586),d=f(d,p,u,l,n[m+2],17,606105819),l=f(l,d,p,u,n[m+3],22,-1044525330),u=f(u,l,d,p,n[m+4],7,-176418897),p=f(p,u,l,d,n[m+5],12,1200080426),d=f(d,p,u,l,n[m+6],17,-1473231341),l=f(l,d,p,u,n[m+7],22,-45705983),u=f(u,l,d,p,n[m+8],7,1770035416),p=f(p,u,l,d,n[m+9],12,-1958414417),d=f(d,p,u,l,n[m+10],17,-42063),l=f(l,d,p,u,n[m+11],22,-1990404162),u=f(u,l,d,p,n[m+12],7,1804603682),p=f(p,u,l,d,n[m+13],12,-40341101),d=f(d,p,u,l,n[m+14],17,-1502002290),u=v(u,l=f(l,d,p,u,n[m+15],22,1236535329),d,p,n[m+1],5,-165796510),p=v(p,u,l,d,n[m+6],9,-1069501632),d=v(d,p,u,l,n[m+11],14,643717713),l=v(l,d,p,u,n[m+0],20,-373897302),u=v(u,l,d,p,n[m+5],5,-701558691),p=v(p,u,l,d,n[m+10],9,38016083),d=v(d,p,u,l,n[m+15],14,-660478335),l=v(l,d,p,u,n[m+4],20,-405537848),u=v(u,l,d,p,n[m+9],5,568446438),p=v(p,u,l,d,n[m+14],9,-1019803690),d=v(d,p,u,l,n[m+3],14,-187363961),l=v(l,d,p,u,n[m+8],20,1163531501),u=v(u,l,d,p,n[m+13],5,-1444681467),p=v(p,u,l,d,n[m+2],9,-51403784),d=v(d,p,u,l,n[m+7],14,1735328473),u=g(u,l=v(l,d,p,u,n[m+12],20,-1926607734),d,p,n[m+5],4,-378558),p=g(p,u,l,d,n[m+8],11,-2022574463),d=g(d,p,u,l,n[m+11],16,1839030562),l=g(l,d,p,u,n[m+14],23,-35309556),u=g(u,l,d,p,n[m+1],4,-1530992060),p=g(p,u,l,d,n[m+4],11,1272893353),d=g(d,p,u,l,n[m+7],16,-155497632),l=g(l,d,p,u,n[m+10],23,-1094730640),u=g(u,l,d,p,n[m+13],4,681279174),p=g(p,u,l,d,n[m+0],11,-358537222),d=g(d,p,u,l,n[m+3],16,-722521979),l=g(l,d,p,u,n[m+6],23,76029189),u=g(u,l,d,p,n[m+9],4,-640364487),p=g(p,u,l,d,n[m+12],11,-421815835),d=g(d,p,u,l,n[m+15],16,530742520),u=b(u,l=g(l,d,p,u,n[m+2],23,-995338651),d,p,n[m+0],6,-198630844),p=b(p,u,l,d,n[m+7],10,1126891415),d=b(d,p,u,l,n[m+14],15,-1416354905),l=b(l,d,p,u,n[m+5],21,-57434055),u=b(u,l,d,p,n[m+12],6,1700485571),p=b(p,u,l,d,n[m+3],10,-1894986606),d=b(d,p,u,l,n[m+10],15,-1051523),l=b(l,d,p,u,n[m+1],21,-2054922799),u=b(u,l,d,p,n[m+8],6,1873313359),p=b(p,u,l,d,n[m+15],10,-30611744),d=b(d,p,u,l,n[m+6],15,-1560198380),l=b(l,d,p,u,n[m+13],21,1309151649),u=b(u,l,d,p,n[m+4],6,-145523070),p=b(p,u,l,d,n[m+11],10,-1120210379),d=b(d,p,u,l,n[m+2],15,718787259),l=b(l,d,p,u,n[m+9],21,-343485551),u=u+h>>>0,l=l+w>>>0,d=d+y>>>0,p=p+T>>>0}return r.endian([u,l,d,p])})._ff=function(e,t,n,r,i,a,o){var s=e+(t&n|~t&r)+(i>>>0)+o;return(s<<a|s>>>32-a)+t},s._gg=function(e,t,n,r,i,a,o){var s=e+(t&r|n&~r)+(i>>>0)+o;return(s<<a|s>>>32-a)+t},s._hh=function(e,t,n,r,i,a,o){var s=e+(t^n^r)+(i>>>0)+o;return(s<<a|s>>>32-a)+t},s._ii=function(e,t,n,r,i,a,o){var s=e+(n^(t|~r))+(i>>>0)+o;return(s<<a|s>>>32-a)+t},s._blocksize=16,s._digestsize=16,e.exports=function(e,t){if(null==e)throw new Error("Illegal argument "+e);var n=r.wordsToBytes(s(e,t));return t&&t.asBytes?n:t&&t.asString?o.bytesToString(n):r.bytesToHex(n)}},2:(e,t,n)=>{"use strict";n.r(t),n.d(t,{Perfume:()=>ze,incrementUjNavigation:()=>Le,markStep:()=>Re,markStepOnce:()=>qe});var r,i,a={isResourceTiming:!1,isElementTiming:!1,maxTime:3e4,reportOptions:{},enableNavigationTracking:!0},o=window,s=o.console,c=o.navigator,u=o.performance,l=function(){return c.deviceMemory},d=function(){return c.hardwareConcurrency},p="mark.",m=function(){return u&&!!u.getEntriesByType&&!!u.now&&!!u.mark},f="4g",v=!1,g={},b={value:0},h={value:{beacon:0,css:0,fetch:0,img:0,other:0,script:0,total:0,xmlhttprequest:0}},w={value:0},y={value:0},T={},k={isHidden:!1,didChange:!1},_=function(){k.isHidden=!1,document.hidden&&(k.isHidden=document.hidden,k.didChange=!0)},S=function(e,t){try{var n=new PerformanceObserver((function(e){t(e.getEntries())}));return n.observe({type:e,buffered:!0}),n}catch(e){s.warn("Perfume.js:",e)}return null},E=function(){return!!(d()&&d()<=4)||!!(l()&&l()<=4)},x=function(e,t){switch(e){case"slow-2g":case"2g":case"3g":return!0;default:return E()||t}},O=function(e){return parseFloat(e.toFixed(4))},j=function(e){return"number"!=typeof e?null:O(e/Math.pow(1024,2))},N=function(e,t,n,r,i){var s,u=function(){a.analyticsTracker&&(k.isHidden&&!["CLS","INP"].includes(e)||a.analyticsTracker({attribution:r,metricName:e,data:t,navigatorInformation:c?{deviceMemory:l()||0,hardwareConcurrency:d()||0,serviceWorkerStatus:"serviceWorker"in c?c.serviceWorker.controller?"controlled":"supported":"unsupported",isLowEndDevice:E(),isLowEndExperience:x(f,v)}:{},rating:n,navigationType:i}))};["CLS","INP"].includes(e)?u():(s=u,"requestIdleCallback"in o?o.requestIdleCallback(s,{timeout:3e3}):s())},I=function(e){e.forEach((function(e){if(!("self"!==e.name||e.startTime<b.value)){var t=e.duration-50;t>0&&(w.value+=t,y.value+=t)}}))};!function(e){e.instant="instant",e.quick="quick",e.moderate="moderate",e.slow="slow",e.unavoidable="unavoidable"}(r||(r={}));var P,M,B,C,D,A=((i={})[r.instant]={vitalsThresholds:[100,200],maxOutlierThreshold:1e4},i[r.quick]={vitalsThresholds:[200,500],maxOutlierThreshold:1e4},i[r.moderate]={vitalsThresholds:[500,1e3],maxOutlierThreshold:1e4},i[r.slow]={vitalsThresholds:[1e3,2e3],maxOutlierThreshold:1e4},i[r.unavoidable]={vitalsThresholds:[2e3,5e3],maxOutlierThreshold:2e4},i),L={RT:[100,200],TBT:[200,600],NTBT:[200,600]},U=function(e,t){return L[e]?t<=L[e][0]?"good":t<=L[e][1]?"needsImprovement":"poor":null},R=function(e,t,n){Object.keys(t).forEach((function(e){"number"==typeof t[e]&&(t[e]=O(t[e]))})),N(e,t,null,n||{})},q=function(e){var t=e.attribution,n=e.name,r=e.rating,i=e.value,o=e.navigationType;"FCP"===n&&(b.value=i),["FCP","LCP"].includes(n)&&!T[0]&&(T[0]=S("longtask",I)),"FID"===n&&setTimeout((function(){k.didChange||(q({attribution:t,name:"TBT",rating:U("TBT",w.value),value:w.value,navigationType:o}),R("dataConsumption",h.value))}),1e4);var s=O(i);s<=a.maxTime&&s>=0&&N(n,s,r,t,o)},F=function(){return window.performance&&performance.getEntriesByType&&performance.getEntriesByType("navigation")[0]},z=function(e){if("loading"===document.readyState)return"loading";var t=F();if(t){if(e<t.domInteractive)return"loading";if(0===t.domContentLoadedEventStart||e<t.domContentLoadedEventStart)return"dom-interactive";if(0===t.domComplete||e<t.domComplete)return"dom-content-loaded"}return"complete"},K=function(e){var t=e.nodeName;return 1===e.nodeType?t.toLowerCase():t.toUpperCase().replace(/^#/,"")},$=function(e,t){var n="";try{for(;e&&9!==e.nodeType;){var r=e,i=r.id?"#"+r.id:K(r)+(r.className&&r.className.length?"."+r.className.replace(/\\s+/g,"."):"");if(n.length+i.length>(t||100)-1)return n||i;if(n=n?i+">"+n:i,r.id)break;e=r.parentNode}}catch(e){}return n},Q=-1,W=function(){return Q},H=function(e){addEventListener("pageshow",(function(t){t.persisted&&(Q=t.timeStamp,e(t))}),!0)},V=function(){var e=F();return e&&e.activationStart||0},J=function(e,t){var n=F(),r="navigate";return W()>=0?r="back-forward-cache":n&&(r=document.prerendering||V()>0?"prerender":document.wasDiscarded?"restore":n.type.replace(/_/g,"-")),{name:e,value:void 0===t?-1:t,rating:"good",delta:0,entries:[],id:"v3-".concat(Date.now(),"-").concat(Math.floor(8999999999999*Math.random())+1e12),navigationType:r}},X=function(e,t,n){try{if(PerformanceObserver.supportedEntryTypes.includes(e)){var r=new PerformanceObserver((function(e){Promise.resolve().then((function(){t(e.getEntries())}))}));return r.observe(Object.assign({type:e,buffered:!0},n||{})),r}}catch(e){}},G=function(e,t){var n=function n(r){"pagehide"!==r.type&&"hidden"!==document.visibilityState||(e(r),t&&(removeEventListener("visibilitychange",n,!0),removeEventListener("pagehide",n,!0)))};addEventListener("visibilitychange",n,!0),addEventListener("pagehide",n,!0)},Z=function(e,t,n,r){var i,a;return function(o){t.value>=0&&(o||r)&&((a=t.value-(i||0))||void 0===i)&&(i=t.value,t.delta=a,t.rating=function(e,t){return e>t[1]?"poor":e>t[0]?"needs-improvement":"good"}(t.value,n),e(t))}},Y=function(e){requestAnimationFrame((function(){return requestAnimationFrame((function(){return e()}))}))},ee=function(e){document.prerendering?addEventListener("prerenderingchange",(function(){return e()}),!0):e()},te=-1,ne=function(){return"hidden"!==document.visibilityState||document.prerendering?1/0:0},re=function(e){"hidden"===document.visibilityState&&te>-1&&(te="visibilitychange"===e.type?e.timeStamp:0,ae())},ie=function(){addEventListener("visibilitychange",re,!0),addEventListener("prerenderingchange",re,!0)},ae=function(){removeEventListener("visibilitychange",re,!0),removeEventListener("prerenderingchange",re,!0)},oe=function(){return te<0&&(te=ne(),ie(),H((function(){setTimeout((function(){te=ne(),ie()}),0)}))),{get firstHiddenTime(){return te}}},se=function(e,t){t=t||{},ee((function(){var n,r=[1800,3e3],i=oe(),a=J("FCP"),o=X("paint",(function(e){e.forEach((function(e){"first-contentful-paint"===e.name&&(o.disconnect(),e.startTime<i.firstHiddenTime&&(a.value=Math.max(e.startTime-V(),0),a.entries.push(e),n(!0)))}))}));o&&(n=Z(e,a,r,t.reportAllChanges),H((function(i){a=J("FCP"),n=Z(e,a,r,t.reportAllChanges),Y((function(){a.value=performance.now()-i.timeStamp,n(!0)}))})))}))},ce={passive:!0,capture:!0},ue=new Date,le=function(e,t){P||(P=t,M=e,B=new Date,me(removeEventListener),de())},de=function(){if(M>=0&&M<B-ue){var e={entryType:"first-input",name:P.type,target:P.target,cancelable:P.cancelable,startTime:P.timeStamp,processingStart:P.timeStamp+M};C.forEach((function(t){t(e)})),C=[]}},pe=function(e){if(e.cancelable){var t=(e.timeStamp>1e12?new Date:performance.now())-e.timeStamp;"pointerdown"==e.type?function(e,t){var n=function(){le(e,t),i()},r=function(){i()},i=function(){removeEventListener("pointerup",n,ce),removeEventListener("pointercancel",r,ce)};addEventListener("pointerup",n,ce),addEventListener("pointercancel",r,ce)}(t,e):le(t,e)}},me=function(e){["mousedown","keydown","touchstart","pointerdown"].forEach((function(t){return e(t,pe,ce)}))},fe=0,ve=1/0,ge=0,be=function(e){e.forEach((function(e){e.interactionId&&(ve=Math.min(ve,e.interactionId),ge=Math.max(ge,e.interactionId),fe=ge?(ge-ve)/7+1:0)}))},he=function(){return D?fe:performance.interactionCount||0},we=0,ye=function(){return he()-we},Te=[],ke={},_e=function(e){var t=Te[Te.length-1],n=ke[e.interactionId];if(n||Te.length<10||e.duration>t.latency){if(n)n.entries.push(e),n.latency=Math.max(n.latency,e.duration);else{var r={id:e.interactionId,latency:e.duration,entries:[e]};ke[r.id]=r,Te.push(r)}Te.sort((function(e,t){return t.latency-e.latency})),Te.splice(10).forEach((function(e){delete ke[e.id]}))}},Se={},Ee=function e(t){document.prerendering?ee((function(){return e(t)})):"complete"!==document.readyState?addEventListener("load",(function(){return e(t)}),!0):setTimeout(t,0)},xe=function(e,t){t=t||{};var n=[800,1800],r=J("TTFB"),i=Z(e,r,n,t.reportAllChanges);Ee((function(){var a=F();if(a){var o=a.responseStart;if(o<=0||o>performance.now())return;r.value=Math.max(o-V(),0),r.entries=[a],i(!0),H((function(){r=J("TTFB",0),(i=Z(e,r,n,t.reportAllChanges))(!0)}))}}))},Oe=function(e){e.forEach((function(e){e.identifier&&q({attribution:{identifier:e.identifier},name:"ET",rating:null,value:e.startTime})}))},je=function(e){e.forEach((function(e){if(a.isResourceTiming&&R("resourceTiming",e),e.decodedBodySize&&e.initiatorType){var t=e.decodedBodySize/1e3;h.value[e.initiatorType]+=t,h.value.total+=t}}))},Ne=function(){!function(e,t){xe((function(e){!function(e){if(e.entries.length){var t=e.entries[0],n=t.activationStart||0,r=Math.max(t.domainLookupStart-n,0),i=Math.max(t.connectStart-n,0),a=Math.max(t.requestStart-n,0);e.attribution={waitingTime:r,dnsTime:i-r,connectionTime:a-i,requestTime:e.value-a,navigationEntry:t}}else e.attribution={waitingTime:0,dnsTime:0,connectionTime:0,requestTime:0}}(e),function(e){e.value>0&&q(e)}(e)}),t)}(0,a.reportOptions.ttfb),function(e,t){!function(e,t){t=t||{},ee((function(){var e,n=[.1,.25],r=J("CLS"),i=-1,a=0,o=[],s=function(e){i>-1&&function(e){!function(e){if(e.entries.length){var t=e.entries.reduce((function(e,t){return e&&e.value>t.value?e:t}));if(t&&t.sources&&t.sources.length){var n=(r=t.sources).find((function(e){return e.node&&1===e.node.nodeType}))||r[0];if(n)return void(e.attribution={largestShiftTarget:$(n.node),largestShiftTime:t.startTime,largestShiftValue:t.value,largestShiftSource:n,largestShiftEntry:t,loadState:z(t.startTime)})}}var r;e.attribution={}}(e),function(e){q(e)}(e)}(e)},c=function(t){t.forEach((function(t){if(!t.hadRecentInput){var n=o[0],i=o[o.length-1];a&&t.startTime-i.startTime<1e3&&t.startTime-n.startTime<5e3?(a+=t.value,o.push(t)):(a=t.value,o=[t]),a>r.value&&(r.value=a,r.entries=o,e())}}))},u=X("layout-shift",c);u&&(e=Z(s,r,n,t.reportAllChanges),se((function(t){i=t.value,r.value<0&&(r.value=0,e())})),G((function(){c(u.takeRecords()),e(!0)})),H((function(){a=0,i=-1,r=J("CLS",0),e=Z(s,r,n,t.reportAllChanges),Y((function(){return e()}))})))}))}(0,t)}(0,a.reportOptions.cls),function(e,t){se((function(e){!function(e){if(e.entries.length){var t=F(),n=e.entries[e.entries.length-1];if(t){var r=t.activationStart||0,i=Math.max(0,t.responseStart-r);return void(e.attribution={timeToFirstByte:i,firstByteToFCP:e.value-i,loadState:z(e.entries[0].startTime),navigationEntry:t,fcpEntry:n})}}e.attribution={timeToFirstByte:0,firstByteToFCP:e.value,loadState:z(W())}}(e),function(e){q(e)}(e)}),t)}(0,a.reportOptions.fcp),function(e,t){!function(e,t){t=t||{},ee((function(){var n,r=[100,300],i=oe(),a=J("FID"),o=function(e){e.startTime<i.firstHiddenTime&&(a.value=e.processingStart-e.startTime,a.entries.push(e),n(!0))},s=function(e){e.forEach(o)},c=X("first-input",s);n=Z(e,a,r,t.reportAllChanges),c&&G((function(){s(c.takeRecords()),c.disconnect()}),!0),c&&H((function(){var i;a=J("FID"),n=Z(e,a,r,t.reportAllChanges),C=[],M=-1,P=null,me(addEventListener),i=o,C.push(i),de()}))}))}((function(e){!function(e){var t=e.entries[0];e.attribution={eventTarget:$(t.target),eventType:t.name,eventTime:t.startTime,eventEntry:t,loadState:z(t.startTime)}}(e),function(e){q(e)}(e)}),t)}(0,a.reportOptions.fid),function(e,t){!function(e,t){t=t||{},ee((function(){var n,r=[2500,4e3],i=oe(),a=J("LCP"),o=function(e){var t=e[e.length-1];if(t){var r=Math.max(t.startTime-V(),0);r<i.firstHiddenTime&&(a.value=r,a.entries=[t],n())}},s=X("largest-contentful-paint",o);if(s){n=Z(e,a,r,t.reportAllChanges);var c=function(){Se[a.id]||(o(s.takeRecords()),s.disconnect(),Se[a.id]=!0,n(!0))};["keydown","click"].forEach((function(e){addEventListener(e,c,{once:!0,capture:!0})})),G(c,!0),H((function(i){a=J("LCP"),n=Z(e,a,r,t.reportAllChanges),Y((function(){a.value=performance.now()-i.timeStamp,Se[a.id]=!0,n(!0)}))}))}}))}((function(e){!function(e){if(e.entries.length){var t=F();if(t){var n=t.activationStart||0,r=e.entries[e.entries.length-1],i=r.url&&performance.getEntriesByType("resource").filter((function(e){return e.name===r.url}))[0],a=Math.max(0,t.responseStart-n),o=Math.max(a,i?(i.requestStart||i.startTime)-n:0),s=Math.max(o,i?i.responseEnd-n:0),c=Math.max(s,r?r.startTime-n:0),u={element:$(r.element),timeToFirstByte:a,resourceLoadDelay:o-a,resourceLoadTime:s-o,elementRenderDelay:c-s,navigationEntry:t,lcpEntry:r};return r.url&&(u.url=r.url),i&&(u.lcpResourceEntry=i),void(e.attribution=u)}}e.attribution={timeToFirstByte:0,resourceLoadDelay:0,resourceLoadTime:0,elementRenderDelay:e.value}}(e),function(e){q(e)}(e)}),t)}(0,a.reportOptions.lcp),function(e,t){!function(e,t){t=t||{},ee((function(){var n=[200,500];"interactionCount"in performance||D||(D=X("event",be,{type:"event",buffered:!0,durationThreshold:0}));var r,i=J("INP"),a=function(e){e.forEach((function(e){e.interactionId&&_e(e),"first-input"===e.entryType&&!Te.some((function(t){return t.entries.some((function(t){return e.duration===t.duration&&e.startTime===t.startTime}))}))&&_e(e)}));var t,n=(t=Math.min(Te.length-1,Math.floor(ye()/50)),Te[t]);n&&n.latency!==i.value&&(i.value=n.latency,i.entries=n.entries,r())},o=X("event",a,{durationThreshold:t.durationThreshold||40});r=Z(e,i,n,t.reportAllChanges),o&&(o.observe({type:"first-input",buffered:!0}),G((function(){a(o.takeRecords()),i.value<0&&ye()>0&&(i.value=0,i.entries=[]),r(!0)})),H((function(){Te=[],we=he(),i=J("INP"),r=Z(e,i,n,t.reportAllChanges)})))}))}((function(t){!function(e){if(e.entries.length){var t=e.entries.sort((function(e,t){return t.duration-e.duration||t.processingEnd-t.processingStart-(e.processingEnd-e.processingStart)}))[0];e.attribution={eventTarget:$(t.target),eventType:t.name,eventTime:t.startTime,eventEntry:t,loadState:z(t.startTime)}}else e.attribution={}}(t),e(t)}),t)}((function(e){return q(e)}),a.reportOptions.inp),a.isResourceTiming&&S("resource",je),a.isElementTiming&&S("element",Oe)},Ie=function(e){var t="usageDetails"in e?e.usageDetails:{};R("storageEstimate",{quota:j(e.quota),usage:j(e.usage),caches:j(t.caches),indexedDB:j(t.indexedDB),serviceWorker:j(t.serviceWorkerRegistrations)})},Pe={finalMarkToStepsMap:{},startMarkToStepsMap:{},active:{},navigationSteps:{}},Me=function(e){delete Pe.active[e]},Be=function(){return Pe.navigationSteps},Ce=function(e){var t;return null!==(t=Be()[e])&&void 0!==t?t:{}},De=function(e,t,n){var r="step."+e,i=u.getEntriesByName(p+t).length>0;if(u.getEntriesByName(p+n).length>0&&a.steps){var o=A[a.steps[e].threshold],s=o.maxOutlierThreshold,c=o.vitalsThresholds;if(i){var l=u.measure(r,p+t,p+n),d=l.duration;if(d<=s){var m=function(e,t){return e<=t[0]?"good":e<=t[1]?"needsImprovement":"poor"}(d,c);d>=0&&(N("userJourneyStep",d,m,{stepName:e},void 0),u.measure("step.".concat(e,"_vitals_").concat(m),{start:l.startTime+l.duration,end:l.startTime+l.duration,detail:{type:"stepVital",duration:d}}))}}}},Ae=function(){var e=Be(),t=Pe.startMarkToStepsMap,n=Object.keys(e).length;if(0===n)return{};var r={},i=n-1,a=Ce(i);if(Object.keys(a).forEach((function(e){var n,i=null!==(n=t[e])&&void 0!==n?n:[];Object.keys(i).forEach((function(e){r[e]=!0}))})),n>1){var o=Ce(i-1);Object.keys(o).forEach((function(e){var n,i=null!==(n=t[e])&&void 0!==n?n:[];Object.keys(i).forEach((function(e){r[e]=!0}))}))}return r},Le=function(){var e,t=Object.keys(Pe.navigationSteps).length;Pe.navigationSteps[t]={};var n=Ae();null===(e=a.onMarkStep)||void 0===e||e.call(a,"",Object.keys(n))},Ue=function(e){var t,n,r,i,o,s,c;if(Pe.finalMarkToStepsMap[e]){!function(e){var t=Pe.navigationSteps,n=Pe.finalMarkToStepsMap,r=Object.keys(t).length;if(0!==r){var i=r-1,a=Ce(i);if(a&&n[e]){var o=n[e];o&&Object.keys(o).forEach((function(e){if(a[e]){var n=Ce(i)||{};n[e]=!1,t[i]=n}if(r>1){var o=i-1,s=Ce(o);s[e]&&(s[e]=!1,t[o]=s)}}))}}}(e);var u=Pe.finalMarkToStepsMap[e];Object.keys(u).forEach((function(t){var n=u[t];n.forEach(Me),Promise.all(n.map((function(n){return function(e,t,n,r){return new(n||(n=Promise))((function(e,t){function i(e){try{o(r.next(e))}catch(e){t(e)}}function a(e){try{o(r.throw(e))}catch(e){t(e)}}function o(t){var r;t.done?e(t.value):(r=t.value,r instanceof n?r:new n((function(e){e(r)}))).then(i,a)}o((r=r.apply(undefined,[])).next())}))}(0,0,void 0,(function(){return function(e,t){var n,r,i,a,o={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return a={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function s(a){return function(s){return function(a){if(n)throw new TypeError("Generator is already executing.");for(;o;)try{if(n=1,r&&(i=2&a[0]?r.return:a[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,a[1])).done)return i;switch(r=0,i&&(a=[2&a[0],i.value]),a[0]){case 0:case 1:i=a;break;case 4:return o.label++,{value:a[1],done:!1};case 5:o.label++,r=a[1],a=[0];continue;case 7:a=o.ops.pop(),o.trys.pop();continue;default:if(!((i=(i=o.trys).length>0&&i[i.length-1])||6!==a[0]&&2!==a[0])){o=0;continue}if(3===a[0]&&(!i||a[1]>i[0]&&a[1]<i[3])){o.label=a[1];break}if(6===a[0]&&o.label<i[1]){o.label=i[1],i=a;break}if(i&&o.label<i[2]){o.label=i[2],o.ops.push(a);break}i[2]&&o.ops.pop(),o.trys.pop();continue}a=t.call(e,o)}catch(e){a=[6,e],r=0}finally{n=i=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,s])}}}(this,(function(r){switch(r.label){case 0:return[4,De(n,t,e)];case 1:return r.sent(),[2]}}))}))}))).catch((function(){}))}))}else r=e,i=Pe.navigationSteps,o=Object.keys(i).length,(c=Ce(s=(o>0?o:1)-1)||[])[r]=!0,i[s]=c,function(e){var t,n=null!==(t=Pe.startMarkToStepsMap[e])&&void 0!==t?t:[];Object.keys(n).forEach((function(e){Pe.active[e]||(Pe.active[e]=!0)}))}(e);if(a.enableNavigationTracking){var l=Ae();null===(t=a.onMarkStep)||void 0===t||t.call(a,e,Object.keys(l))}else null===(n=a.onMarkStep)||void 0===n||n.call(a,e,Object.keys(Pe.active))},Re=function(e){u.mark(p+e),Ue(e)},qe=function(e){0===u.getEntriesByName(p+e).length&&(u.mark(p+e),Ue(e))},Fe=0,ze=function(){function e(e){if(void 0===e&&(e={}),this.v="9.0.0-rc.3",a.analyticsTracker=e.analyticsTracker,a.isResourceTiming=!!e.resourceTiming,a.isElementTiming=!!e.elementTiming,a.maxTime=e.maxMeasureTime||a.maxTime,a.reportOptions=e.reportOptions||a.reportOptions,a.steps=e.steps,a.onMarkStep=e.onMarkStep,a.enableNavigationTracking=e.enableNavigationTracking,m()){"PerformanceObserver"in o&&Ne(),void 0!==document.hidden&&document.addEventListener("visibilitychange",_);var t=function(){if(!m())return{};var e=u.getEntriesByType("navigation")[0];if(!e)return{};var t=e.responseStart,n=e.responseEnd;return{fetchTime:n-e.fetchStart,workerTime:e.workerStart>0?n-e.workerStart:0,totalTime:n-e.requestStart,downloadTime:n-t,timeToFirstByte:t-e.requestStart,headerSize:e.transferSize-e.encodedBodySize||0,dnsLookupTime:e.domainLookupEnd-e.domainLookupStart,redirectTime:e.redirectEnd-e.redirectStart}}();R("navigationTiming",t),t.redirectTime&&q({attribution:{},name:"RT",rating:U("RT",t.redirectTime),value:t.redirectTime}),R("networkInformation",function(){if("connection"in c){var e=c.connection;return"object"!=typeof e?{}:(f=e.effectiveType,v=!!e.saveData,{downlink:e.downlink,effectiveType:e.effectiveType,rtt:e.rtt,saveData:!!e.saveData})}return{}}()),c&&c.storage&&"function"==typeof c.storage.estimate&&c.storage.estimate().then(Ie),a.steps&&a.steps&&(Pe.startMarkToStepsMap={},Pe.finalMarkToStepsMap={},Pe.active={},Pe.navigationSteps={},Object.entries(a.steps).forEach((function(e){var t,n,r=e[0],i=e[1].marks,a=i[0],o=i[1],s=null!==(n=Pe.startMarkToStepsMap[a])&&void 0!==n?n:{};if(s[r]=!0,Pe.startMarkToStepsMap[a]=s,Pe.finalMarkToStepsMap[o]){var c=Pe.finalMarkToStepsMap[o][a]||[];c.push(r),Pe.finalMarkToStepsMap[o][a]=c}else Pe.finalMarkToStepsMap[o]=((t={})[a]=[r],t)})))}}return e.prototype.start=function(e){m()&&!g[e]&&(g[e]=!0,u.mark("mark_".concat(e,"_start")))},e.prototype.end=function(e,t,n){if(void 0===t&&(t={}),void 0===n&&(n=!0),m()&&g[e]){u.mark("mark_".concat(e,"_end")),delete g[e];var r=function(e){u.measure(e,"mark_".concat(e,"_start"),"mark_".concat(e,"_end"));var t=u.getEntriesByName(e).pop();return t&&"measure"===t.entryType?t.duration:-1}(e);n&&R(e,O(r),t)}},e.prototype.endPaint=function(e,t){var n=this;setTimeout((function(){n.end(e,t)}))},e.prototype.clear=function(e){delete g[e],u.clearMarks&&(u.clearMarks("mark_".concat(e,"_start")),u.clearMarks("mark_".concat(e,"_end")))},e.prototype.markNTBT=function(){var e=this;this.start("ntbt"),y.value=0,clearTimeout(Fe),Fe=setTimeout((function(){e.end("ntbt",{},!1),q({attribution:{},name:"NTBT",rating:U("NTBT",y.value),value:y.value}),y.value=0}),2e3)},e}()},426:(e,t)=>{"use strict";Symbol.for("react.element"),Symbol.for("react.portal"),Symbol.for("react.fragment"),Symbol.for("react.strict_mode"),Symbol.for("react.profiler"),Symbol.for("react.provider"),Symbol.for("react.context"),Symbol.for("react.forward_ref"),Symbol.for("react.suspense"),Symbol.for("react.memo"),Symbol.for("react.lazy"),Symbol.iterator;var n={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},r=Object.assign,i={};function a(e,t,r){this.props=e,this.context=t,this.refs=i,this.updater=r||n}function o(){}function s(e,t,r){this.props=e,this.context=t,this.refs=i,this.updater=r||n}a.prototype.isReactComponent={},a.prototype.setState=function(e,t){if("object"!=typeof e&&"function"!=typeof e&&null!=e)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")},a.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},o.prototype=a.prototype;var c=s.prototype=new o;c.constructor=s,r(c,a.prototype),c.isPureReactComponent=!0;Array.isArray,Object.prototype.hasOwnProperty;var u={current:null};t.useCallback=function(e,t){return u.current.useCallback(e,t)},t.useEffect=function(e,t){return u.current.useEffect(e,t)},t.useRef=function(e){return u.current.useRef(e)}},784:(e,t,n)=>{"use strict";e.exports=n(426)},353:function(e,t,n){var r;!function(i,a){"use strict";var o="function",s="undefined",c="object",u="string",l="major",d="model",p="name",m="type",f="vendor",v="version",g="architecture",b="console",h="mobile",w="tablet",y="smarttv",T="wearable",k="embedded",_="Amazon",S="Apple",E="ASUS",x="BlackBerry",O="Browser",j="Chrome",N="Firefox",I="Google",P="Huawei",M="LG",B="Microsoft",C="Motorola",D="Opera",A="Samsung",L="Sharp",U="Sony",R="Xiaomi",q="Zebra",F="Facebook",z="Chromium OS",K="Mac OS",$=function(e){for(var t={},n=0;n<e.length;n++)t[e[n].toUpperCase()]=e[n];return t},Q=function(e,t){return typeof e===u&&-1!==W(t).indexOf(W(e))},W=function(e){return e.toLowerCase()},H=function(e,t){if(typeof e===u)return e=e.replace(/^\\s\\s*/,""),typeof t===s?e:e.substring(0,350)},V=function(e,t){for(var n,r,i,s,u,l,d=0;d<t.length&&!u;){var p=t[d],m=t[d+1];for(n=r=0;n<p.length&&!u&&p[n];)if(u=p[n++].exec(e))for(i=0;i<m.length;i++)l=u[++r],typeof(s=m[i])===c&&s.length>0?2===s.length?typeof s[1]==o?this[s[0]]=s[1].call(this,l):this[s[0]]=s[1]:3===s.length?typeof s[1]!==o||s[1].exec&&s[1].test?this[s[0]]=l?l.replace(s[1],s[2]):a:this[s[0]]=l?s[1].call(this,l,s[2]):a:4===s.length&&(this[s[0]]=l?s[3].call(this,l.replace(s[1],s[2])):a):this[s]=l||a;d+=2}},J=function(e,t){for(var n in t)if(typeof t[n]===c&&t[n].length>0){for(var r=0;r<t[n].length;r++)if(Q(t[n][r],e))return"?"===n?a:n}else if(Q(t[n],e))return"?"===n?a:n;return e},X={ME:"4.90","NT 3.11":"NT3.51","NT 4.0":"NT4.0",2e3:"NT 5.0",XP:["NT 5.1","NT 5.2"],Vista:"NT 6.0",7:"NT 6.1",8:"NT 6.2",8.1:"NT 6.3",10:["NT 6.4","NT 10.0"],RT:"ARM"},G={browser:[[/\\b(?:crmo|crios)\\/([\\w\\.]+)/i],[v,[p,"Chrome"]],[/edg(?:e|ios|a)?\\/([\\w\\.]+)/i],[v,[p,"Edge"]],[/(opera mini)\\/([-\\w\\.]+)/i,/(opera [mobiletab]{3,6})\\b.+version\\/([-\\w\\.]+)/i,/(opera)(?:.+version\\/|[\\/ ]+)([\\w\\.]+)/i],[p,v],[/opios[\\/ ]+([\\w\\.]+)/i],[v,[p,D+" Mini"]],[/\\bopr\\/([\\w\\.]+)/i],[v,[p,D]],[/(kindle)\\/([\\w\\.]+)/i,/(lunascape|maxthon|netfront|jasmine|blazer)[\\/ ]?([\\w\\.]*)/i,/(avant |iemobile|slim)(?:browser)?[\\/ ]?([\\w\\.]*)/i,/(ba?idubrowser)[\\/ ]?([\\w\\.]+)/i,/(?:ms|\\()(ie) ([\\w\\.]+)/i,/(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\\/([-\\w\\.]+)/i,/(heytap|ovi)browser\\/([\\d\\.]+)/i,/(weibo)__([\\d\\.]+)/i],[p,v],[/(?:\\buc? ?browser|(?:juc.+)ucweb)[\\/ ]?([\\w\\.]+)/i],[v,[p,"UC"+O]],[/microm.+\\bqbcore\\/([\\w\\.]+)/i,/\\bqbcore\\/([\\w\\.]+).+microm/i],[v,[p,"WeChat(Win) Desktop"]],[/micromessenger\\/([\\w\\.]+)/i],[v,[p,"WeChat"]],[/konqueror\\/([\\w\\.]+)/i],[v,[p,"Konqueror"]],[/trident.+rv[: ]([\\w\\.]{1,9})\\b.+like gecko/i],[v,[p,"IE"]],[/ya(?:search)?browser\\/([\\w\\.]+)/i],[v,[p,"Yandex"]],[/(avast|avg)\\/([\\w\\.]+)/i],[[p,/(.+)/,"$1 Secure "+O],v],[/\\bfocus\\/([\\w\\.]+)/i],[v,[p,N+" Focus"]],[/\\bopt\\/([\\w\\.]+)/i],[v,[p,D+" Touch"]],[/coc_coc\\w+\\/([\\w\\.]+)/i],[v,[p,"Coc Coc"]],[/dolfin\\/([\\w\\.]+)/i],[v,[p,"Dolphin"]],[/coast\\/([\\w\\.]+)/i],[v,[p,D+" Coast"]],[/miuibrowser\\/([\\w\\.]+)/i],[v,[p,"MIUI "+O]],[/fxios\\/([-\\w\\.]+)/i],[v,[p,N]],[/\\bqihu|(qi?ho?o?|360)browser/i],[[p,"360 "+O]],[/(oculus|samsung|sailfish|huawei)browser\\/([\\w\\.]+)/i],[[p,/(.+)/,"$1 "+O],v],[/(comodo_dragon)\\/([\\w\\.]+)/i],[[p,/_/g," "],v],[/(electron)\\/([\\w\\.]+) safari/i,/(tesla)(?: qtcarbrowser|\\/(20\\d\\d\\.[-\\w\\.]+))/i,/m?(qqbrowser|baiduboxapp|2345Explorer)[\\/ ]?([\\w\\.]+)/i],[p,v],[/(metasr)[\\/ ]?([\\w\\.]+)/i,/(lbbrowser)/i,/\\[(linkedin)app\\]/i],[p],[/((?:fban\\/fbios|fb_iab\\/fb4a)(?!.+fbav)|;fbav\\/([\\w\\.]+);)/i],[[p,F],v],[/(kakao(?:talk|story))[\\/ ]([\\w\\.]+)/i,/(naver)\\(.*?(\\d+\\.[\\w\\.]+).*\\)/i,/safari (line)\\/([\\w\\.]+)/i,/\\b(line)\\/([\\w\\.]+)\\/iab/i,/(chromium|instagram)[\\/ ]([-\\w\\.]+)/i],[p,v],[/\\bgsa\\/([\\w\\.]+) .*safari\\//i],[v,[p,"GSA"]],[/musical_ly(?:.+app_?version\\/|_)([\\w\\.]+)/i],[v,[p,"TikTok"]],[/headlesschrome(?:\\/([\\w\\.]+)| )/i],[v,[p,j+" Headless"]],[/ wv\\).+(chrome)\\/([\\w\\.]+)/i],[[p,j+" WebView"],v],[/droid.+ version\\/([\\w\\.]+)\\b.+(?:mobile safari|safari)/i],[v,[p,"Android "+O]],[/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\\/v?([\\w\\.]+)/i],[p,v],[/version\\/([\\w\\.\\,]+) .*mobile\\/\\w+ (safari)/i],[v,[p,"Mobile Safari"]],[/version\\/([\\w(\\.|\\,)]+) .*(mobile ?safari|safari)/i],[v,p],[/webkit.+?(mobile ?safari|safari)(\\/[\\w\\.]+)/i],[p,[v,J,{"1.0":"/8",1.2:"/1",1.3:"/3","2.0":"/412","2.0.2":"/416","2.0.3":"/417","2.0.4":"/419","?":"/"}]],[/(webkit|khtml)\\/([\\w\\.]+)/i],[p,v],[/(navigator|netscape\\d?)\\/([-\\w\\.]+)/i],[[p,"Netscape"],v],[/mobile vr; rv:([\\w\\.]+)\\).+firefox/i],[v,[p,N+" Reality"]],[/ekiohf.+(flow)\\/([\\w\\.]+)/i,/(swiftfox)/i,/(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\\/ ]?([\\w\\.\\+]+)/i,/(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\\/([-\\w\\.]+)$/i,/(firefox)\\/([\\w\\.]+)/i,/(mozilla)\\/([\\w\\.]+) .+rv\\:.+gecko\\/\\d+/i,/(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\\. ]?browser)[-\\/ ]?v?([\\w\\.]+)/i,/(links) \\(([\\w\\.]+)/i,/panasonic;(viera)/i],[p,v],[/(cobalt)\\/([\\w\\.]+)/i],[p,[v,/master.|lts./,""]]],cpu:[[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\\)]/i],[[g,"amd64"]],[/(ia32(?=;))/i],[[g,W]],[/((?:i[346]|x)86)[;\\)]/i],[[g,"ia32"]],[/\\b(aarch64|arm(v?8e?l?|_?64))\\b/i],[[g,"arm64"]],[/\\b(arm(?:v[67])?ht?n?[fl]p?)\\b/i],[[g,"armhf"]],[/windows (ce|mobile); ppc;/i],[[g,"arm"]],[/((?:ppc|powerpc)(?:64)?)(?: mac|;|\\))/i],[[g,/ower/,"",W]],[/(sun4\\w)[;\\)]/i],[[g,"sparc"]],[/((?:avr32|ia64(?=;))|68k(?=\\))|\\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\\b|pa-risc)/i],[[g,W]]],device:[[/\\b(sch-i[89]0\\d|shw-m380s|sm-[ptx]\\w{2,4}|gt-[pn]\\d{2,4}|sgh-t8[56]9|nexus 10)/i],[d,[f,A],[m,w]],[/\\b((?:s[cgp]h|gt|sm)-\\w+|sc[g-]?[\\d]+a?|galaxy nexus)/i,/samsung[- ]([-\\w]+)/i,/sec-(sgh\\w+)/i],[d,[f,A],[m,h]],[/(?:\\/|\\()(ip(?:hone|od)[\\w, ]*)(?:\\/|;)/i],[d,[f,S],[m,h]],[/\\((ipad);[-\\w\\),; ]+apple/i,/applecoremedia\\/[\\w\\.]+ \\((ipad)/i,/\\b(ipad)\\d\\d?,\\d\\d?[;\\]].+ios/i],[d,[f,S],[m,w]],[/(macintosh);/i],[d,[f,S]],[/\\b(sh-?[altvz]?\\d\\d[a-ekm]?)/i],[d,[f,L],[m,h]],[/\\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\\d{2})\\b(?!.+d\\/s)/i],[d,[f,P],[m,w]],[/(?:huawei|honor)([-\\w ]+)[;\\)]/i,/\\b(nexus 6p|\\w{2,4}e?-[atu]?[ln][\\dx][012359c][adn]?)\\b(?!.+d\\/s)/i],[d,[f,P],[m,h]],[/\\b(poco[\\w ]+)(?: bui|\\))/i,/\\b; (\\w+) build\\/hm\\1/i,/\\b(hm[-_ ]?note?[_ ]?(?:\\d\\w)?) bui/i,/\\b(redmi[\\-_ ]?(?:note|k)?[\\w_ ]+)(?: bui|\\))/i,/\\b(mi[-_ ]?(?:a\\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\\d?\\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\\))/i],[[d,/_/g," "],[f,R],[m,h]],[/\\b(mi[-_ ]?(?:pad)(?:[\\w_ ]+))(?: bui|\\))/i],[[d,/_/g," "],[f,R],[m,w]],[/; (\\w+) bui.+ oppo/i,/\\b(cph[12]\\d{3}|p(?:af|c[al]|d\\w|e[ar])[mt]\\d0|x9007|a101op)\\b/i],[d,[f,"OPPO"],[m,h]],[/vivo (\\w+)(?: bui|\\))/i,/\\b(v[12]\\d{3}\\w?[at])(?: bui|;)/i],[d,[f,"Vivo"],[m,h]],[/\\b(rmx[12]\\d{3})(?: bui|;|\\))/i],[d,[f,"Realme"],[m,h]],[/\\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\\b[\\w ]+build\\//i,/\\bmot(?:orola)?[- ](\\w*)/i,/((?:moto[\\w\\(\\) ]+|xt\\d{3,4}|nexus 6)(?= bui|\\)))/i],[d,[f,C],[m,h]],[/\\b(mz60\\d|xoom[2 ]{0,2}) build\\//i],[d,[f,C],[m,w]],[/((?=lg)?[vl]k\\-?\\d{3}) bui| 3\\.[-\\w; ]{10}lg?-([06cv9]{3,4})/i],[d,[f,M],[m,w]],[/(lm(?:-?f100[nv]?|-[\\w\\.]+)(?= bui|\\))|nexus [45])/i,/\\blg[-e;\\/ ]+((?!browser|netcast|android tv)\\w+)/i,/\\blg-?([\\d\\w]+) bui/i],[d,[f,M],[m,h]],[/(ideatab[-\\w ]+)/i,/lenovo ?(s[56]000[-\\w]+|tab(?:[\\w ]+)|yt[-\\d\\w]{6}|tb[-\\d\\w]{6})/i],[d,[f,"Lenovo"],[m,w]],[/(?:maemo|nokia).*(n900|lumia \\d+)/i,/nokia[-_ ]?([-\\w\\.]*)/i],[[d,/_/g," "],[f,"Nokia"],[m,h]],[/(pixel c)\\b/i],[d,[f,I],[m,w]],[/droid.+; (pixel[\\daxl ]{0,6})(?: bui|\\))/i],[d,[f,I],[m,h]],[/droid.+ (a?\\d[0-2]{2}so|[c-g]\\d{4}|so[-gl]\\w+|xq-a\\w[4-7][12])(?= bui|\\).+chrome\\/(?![1-6]{0,1}\\d\\.))/i],[d,[f,U],[m,h]],[/sony tablet [ps]/i,/\\b(?:sony)?sgp\\w+(?: bui|\\))/i],[[d,"Xperia Tablet"],[f,U],[m,w]],[/ (kb2005|in20[12]5|be20[12][59])\\b/i,/(?:one)?(?:plus)? (a\\d0\\d\\d)(?: b|\\))/i],[d,[f,"OnePlus"],[m,h]],[/(alexa)webm/i,/(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\\))/i,/(kf[a-z]+)( bui|\\)).+silk\\//i],[d,[f,_],[m,w]],[/((?:sd|kf)[0349hijorstuw]+)( bui|\\)).+silk\\//i],[[d,/(.+)/g,"Fire Phone $1"],[f,_],[m,h]],[/(playbook);[-\\w\\),; ]+(rim)/i],[d,f,[m,w]],[/\\b((?:bb[a-f]|st[hv])100-\\d)/i,/\\(bb10; (\\w+)/i],[d,[f,x],[m,h]],[/(?:\\b|asus_)(transfo[prime ]{4,10} \\w+|eeepc|slider \\w+|nexus 7|padfone|p00[cj])/i],[d,[f,E],[m,w]],[/ (z[bes]6[027][012][km][ls]|zenfone \\d\\w?)\\b/i],[d,[f,E],[m,h]],[/(nexus 9)/i],[d,[f,"HTC"],[m,w]],[/(htc)[-;_ ]{1,2}([\\w ]+(?=\\)| bui)|\\w+)/i,/(zte)[- ]([\\w ]+?)(?: bui|\\/|\\))/i,/(alcatel|geeksphone|nexian|panasonic(?!(?:;|\\.))|sony(?!-bra))[-_ ]?([-\\w]*)/i],[f,[d,/_/g," "],[m,h]],[/droid.+; ([ab][1-7]-?[0178a]\\d\\d?)/i],[d,[f,"Acer"],[m,w]],[/droid.+; (m[1-5] note) bui/i,/\\bmz-([-\\w]{2,})/i],[d,[f,"Meizu"],[m,h]],[/(blackberry|benq|palm(?=\\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\\w]*)/i,/(hp) ([\\w ]+\\w)/i,/(asus)-?(\\w+)/i,/(microsoft); (lumia[\\w ]+)/i,/(lenovo)[-_ ]?([-\\w]+)/i,/(jolla)/i,/(oppo) ?([\\w ]+) bui/i],[f,d,[m,h]],[/(kobo)\\s(ereader|touch)/i,/(archos) (gamepad2?)/i,/(hp).+(touchpad(?!.+tablet)|tablet)/i,/(kindle)\\/([\\w\\.]+)/i,/(nook)[\\w ]+build\\/(\\w+)/i,/(dell) (strea[kpr\\d ]*[\\dko])/i,/(le[- ]+pan)[- ]+(\\w{1,9}) bui/i,/(trinity)[- ]*(t\\d{3}) bui/i,/(gigaset)[- ]+(q\\w{1,9}) bui/i,/(vodafone) ([\\w ]+)(?:\\)| bui)/i],[f,d,[m,w]],[/(surface duo)/i],[d,[f,B],[m,w]],[/droid [\\d\\.]+; (fp\\du?)(?: b|\\))/i],[d,[f,"Fairphone"],[m,h]],[/(u304aa)/i],[d,[f,"AT&T"],[m,h]],[/\\bsie-(\\w*)/i],[d,[f,"Siemens"],[m,h]],[/\\b(rct\\w+) b/i],[d,[f,"RCA"],[m,w]],[/\\b(venue[\\d ]{2,7}) b/i],[d,[f,"Dell"],[m,w]],[/\\b(q(?:mv|ta)\\w+) b/i],[d,[f,"Verizon"],[m,w]],[/\\b(?:barnes[& ]+noble |bn[rt])([\\w\\+ ]*) b/i],[d,[f,"Barnes & Noble"],[m,w]],[/\\b(tm\\d{3}\\w+) b/i],[d,[f,"NuVision"],[m,w]],[/\\b(k88) b/i],[d,[f,"ZTE"],[m,w]],[/\\b(nx\\d{3}j) b/i],[d,[f,"ZTE"],[m,h]],[/\\b(gen\\d{3}) b.+49h/i],[d,[f,"Swiss"],[m,h]],[/\\b(zur\\d{3}) b/i],[d,[f,"Swiss"],[m,w]],[/\\b((zeki)?tb.*\\b) b/i],[d,[f,"Zeki"],[m,w]],[/\\b([yr]\\d{2}) b/i,/\\b(dragon[- ]+touch |dt)(\\w{5}) b/i],[[f,"Dragon Touch"],d,[m,w]],[/\\b(ns-?\\w{0,9}) b/i],[d,[f,"Insignia"],[m,w]],[/\\b((nxa|next)-?\\w{0,9}) b/i],[d,[f,"NextBook"],[m,w]],[/\\b(xtreme\\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i],[[f,"Voice"],d,[m,h]],[/\\b(lvtel\\-)?(v1[12]) b/i],[[f,"LvTel"],d,[m,h]],[/\\b(ph-1) /i],[d,[f,"Essential"],[m,h]],[/\\b(v(100md|700na|7011|917g).*\\b) b/i],[d,[f,"Envizen"],[m,w]],[/\\b(trio[-\\w\\. ]+) b/i],[d,[f,"MachSpeed"],[m,w]],[/\\btu_(1491) b/i],[d,[f,"Rotor"],[m,w]],[/(shield[\\w ]+) b/i],[d,[f,"Nvidia"],[m,w]],[/(sprint) (\\w+)/i],[f,d,[m,h]],[/(kin\\.[onetw]{3})/i],[[d,/\\./g," "],[f,B],[m,h]],[/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\\)/i],[d,[f,q],[m,w]],[/droid.+; (ec30|ps20|tc[2-8]\\d[kx])\\)/i],[d,[f,q],[m,h]],[/smart-tv.+(samsung)/i],[f,[m,y]],[/hbbtv.+maple;(\\d+)/i],[[d,/^/,"SmartTV"],[f,A],[m,y]],[/(nux; netcast.+smarttv|lg (netcast\\.tv-201\\d|android tv))/i],[[f,M],[m,y]],[/(apple) ?tv/i],[f,[d,S+" TV"],[m,y]],[/crkey/i],[[d,j+"cast"],[f,I],[m,y]],[/droid.+aft(\\w)( bui|\\))/i],[d,[f,_],[m,y]],[/\\(dtv[\\);].+(aquos)/i,/(aquos-tv[\\w ]+)\\)/i],[d,[f,L],[m,y]],[/(bravia[\\w ]+)( bui|\\))/i],[d,[f,U],[m,y]],[/(mitv-\\w{5}) bui/i],[d,[f,R],[m,y]],[/Hbbtv.*(technisat) (.*);/i],[f,d,[m,y]],[/\\b(roku)[\\dx]*[\\)\\/]((?:dvp-)?[\\d\\.]*)/i,/hbbtv\\/\\d+\\.\\d+\\.\\d+ +\\([\\w\\+ ]*; *([\\w\\d][^;]*);([^;]*)/i],[[f,H],[d,H],[m,y]],[/\\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\\b/i],[[m,y]],[/(ouya)/i,/(nintendo) ([wids3utch]+)/i],[f,d,[m,b]],[/droid.+; (shield) bui/i],[d,[f,"Nvidia"],[m,b]],[/(playstation [345portablevi]+)/i],[d,[f,U],[m,b]],[/\\b(xbox(?: one)?(?!; xbox))[\\); ]/i],[d,[f,B],[m,b]],[/((pebble))app/i],[f,d,[m,T]],[/(watch)(?: ?os[,\\/]|\\d,\\d\\/)[\\d\\.]+/i],[d,[f,S],[m,T]],[/droid.+; (glass) \\d/i],[d,[f,I],[m,T]],[/droid.+; (wt63?0{2,3})\\)/i],[d,[f,q],[m,T]],[/(quest( 2| pro)?)/i],[d,[f,F],[m,T]],[/(tesla)(?: qtcarbrowser|\\/[-\\w\\.]+)/i],[f,[m,k]],[/(aeobc)\\b/i],[d,[f,_],[m,k]],[/droid .+?; ([^;]+?)(?: bui|\\) applew).+? mobile safari/i],[d,[m,h]],[/droid .+?; ([^;]+?)(?: bui|\\) applew).+?(?! mobile) safari/i],[d,[m,w]],[/\\b((tablet|tab)[;\\/]|focus\\/\\d(?!.+mobile))/i],[[m,w]],[/(phone|mobile(?:[;\\/]| [ \\w\\/\\.]*safari)|pda(?=.+windows ce))/i],[[m,h]],[/(android[-\\w\\. ]{0,9});.+buil/i],[d,[f,"Generic"]]],engine:[[/windows.+ edge\\/([\\w\\.]+)/i],[v,[p,"EdgeHTML"]],[/webkit\\/537\\.36.+chrome\\/(?!27)([\\w\\.]+)/i],[v,[p,"Blink"]],[/(presto)\\/([\\w\\.]+)/i,/(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\\/([\\w\\.]+)/i,/ekioh(flow)\\/([\\w\\.]+)/i,/(khtml|tasman|links)[\\/ ]\\(?([\\w\\.]+)/i,/(icab)[\\/ ]([23]\\.[\\d\\.]+)/i,/\\b(libweb)/i],[p,v],[/rv\\:([\\w\\.]{1,9})\\b.+(gecko)/i],[v,p]],os:[[/microsoft (windows) (vista|xp)/i],[p,v],[/(windows) nt 6\\.2; (arm)/i,/(windows (?:phone(?: os)?|mobile))[\\/ ]?([\\d\\.\\w ]*)/i,/(windows)[\\/ ]?([ntce\\d\\. ]+\\w)(?!.+xbox)/i],[p,[v,J,X]],[/(win(?=3|9|n)|win 9x )([nt\\d\\.]+)/i],[[p,"Windows"],[v,J,X]],[/ip[honead]{2,4}\\b(?:.*os ([\\w]+) like mac|; opera)/i,/ios;fbsv\\/([\\d\\.]+)/i,/cfnetwork\\/.+darwin/i],[[v,/_/g,"."],[p,"iOS"]],[/(mac os x) ?([\\w\\. ]*)/i,/(macintosh|mac_powerpc\\b)(?!.+haiku)/i],[[p,K],[v,/_/g,"."]],[/droid ([\\w\\.]+)\\b.+(android[- ]x86|harmonyos)/i],[v,p],[/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\\/ ]?([\\w\\.]*)/i,/(blackberry)\\w*\\/([\\w\\.]*)/i,/(tizen|kaios)[\\/ ]([\\w\\.]+)/i,/\\((series40);/i],[p,v],[/\\(bb(10);/i],[v,[p,x]],[/(?:symbian ?os|symbos|s60(?=;)|series60)[-\\/ ]?([\\w\\.]*)/i],[v,[p,"Symbian"]],[/mozilla\\/[\\d\\.]+ \\((?:mobile|tablet|tv|mobile; [\\w ]+); rv:.+ gecko\\/([\\w\\.]+)/i],[v,[p,N+" OS"]],[/web0s;.+rt(tv)/i,/\\b(?:hp)?wos(?:browser)?\\/([\\w\\.]+)/i],[v,[p,"webOS"]],[/watch(?: ?os[,\\/]|\\d,\\d\\/)([\\d\\.]+)/i],[v,[p,"watchOS"]],[/crkey\\/([\\d\\.]+)/i],[v,[p,j+"cast"]],[/(cros) [\\w]+(?:\\)| ([\\w\\.]+)\\b)/i],[[p,z],v],[/panasonic;(viera)/i,/(netrange)mmh/i,/(nettv)\\/(\\d+\\.[\\w\\.]+)/i,/(nintendo|playstation) ([wids345portablevuch]+)/i,/(xbox); +xbox ([^\\);]+)/i,/\\b(joli|palm)\\b ?(?:os)?\\/?([\\w\\.]*)/i,/(mint)[\\/\\(\\) ]?(\\w*)/i,/(mageia|vectorlinux)[; ]/i,/([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\\/ ]?(?!chrom|package)([-\\w\\.]*)/i,/(hurd|linux) ?([\\w\\.]*)/i,/(gnu) ?([\\w\\.]*)/i,/\\b([-frentopcghs]{0,5}bsd|dragonfly)[\\/ ]?(?!amd|[ix346]{1,2}86)([\\w\\.]*)/i,/(haiku) (\\w+)/i],[p,v],[/(sunos) ?([\\w\\.\\d]*)/i],[[p,"Solaris"],v],[/((?:open)?solaris)[-\\/ ]?([\\w\\.]*)/i,/(aix) ((\\d)(?=\\.|\\)| )[\\w\\.])*/i,/\\b(beos|os\\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i,/(unix) ?([\\w\\.]*)/i],[p,v]]},Z=function(e,t){if(typeof e===c&&(t=e,e=a),!(this instanceof Z))return new Z(e,t).getResult();var n=typeof i!==s&&i.navigator?i.navigator:a,r=e||(n&&n.userAgent?n.userAgent:""),b=n&&n.userAgentData?n.userAgentData:a,y=t?function(e,t){var n={};for(var r in e)t[r]&&t[r].length%2==0?n[r]=t[r].concat(e[r]):n[r]=e[r];return n}(G,t):G,T=n&&n.userAgent==r;return this.getBrowser=function(){var e,t={};return t[p]=a,t[v]=a,V.call(t,r,y.browser),t[l]=typeof(e=t[v])===u?e.replace(/[^\\d\\.]/g,"").split(".")[0]:a,T&&n&&n.brave&&typeof n.brave.isBrave==o&&(t[p]="Brave"),t},this.getCPU=function(){var e={};return e[g]=a,V.call(e,r,y.cpu),e},this.getDevice=function(){var e={};return e[f]=a,e[d]=a,e[m]=a,V.call(e,r,y.device),T&&!e[m]&&b&&b.mobile&&(e[m]=h),T&&"Macintosh"==e[d]&&n&&typeof n.standalone!==s&&n.maxTouchPoints&&n.maxTouchPoints>2&&(e[d]="iPad",e[m]=w),e},this.getEngine=function(){var e={};return e[p]=a,e[v]=a,V.call(e,r,y.engine),e},this.getOS=function(){var e={};return e[p]=a,e[v]=a,V.call(e,r,y.os),T&&!e[p]&&b&&"Unknown"!=b.platform&&(e[p]=b.platform.replace(/chrome os/i,z).replace(/macos/i,K)),e},this.getResult=function(){return{ua:this.getUA(),browser:this.getBrowser(),engine:this.getEngine(),os:this.getOS(),device:this.getDevice(),cpu:this.getCPU()}},this.getUA=function(){return r},this.setUA=function(e){return r=typeof e===u&&e.length>350?H(e,350):e,this},this.setUA(r),this};Z.VERSION="1.0.35",Z.BROWSER=$([p,v,l]),Z.CPU=$([g]),Z.DEVICE=$([d,f,m,b,h,y,w,T,k]),Z.ENGINE=Z.OS=$([p,v]),typeof t!==s?(e.exports&&(t=e.exports=Z),t.UAParser=Z):n.amdO?(r=function(){return Z}.call(t,n,t,e))===a||(e.exports=r):typeof i!==s&&(i.UAParser=Z);var Y=typeof i!==s&&(i.jQuery||i.Zepto);if(Y&&!Y.ua){var ee=new Z;Y.ua=ee.getResult(),Y.ua.get=function(){return ee.getUA()},Y.ua.set=function(e){ee.setUA(e);var t=ee.getResult();for(var n in t)Y.ua[n]=t[n]}}}("object"==typeof window?window:this)}},t={};function n(r){var i=t[r];if(void 0!==i)return i.exports;var a=t[r]={exports:{}};return e[r].call(a.exports,a,a.exports,n),a.exports}n.amdO={},n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var r={};return(()=>{"use strict";n.r(r),n.d(r,{ActionType:()=>f,AmplitudePlatformName:()=>g,AnalyticsEventImportance:()=>l,AnalyticsQueries:()=>e,AuthStatus:()=>b,ComponentType:()=>m,IThresholdTier:()=>Jt,MetricType:()=>d,PlatformName:()=>v,SessionActions:()=>h,SessionAutomatedEvents:()=>w,SessionRank:()=>y,SubjectType:()=>p,UserTypeCommerce:()=>c,UserTypeInsto:()=>i,UserTypeRetail:()=>t,UserTypeRetailBusinessBanking:()=>s,UserTypeRetailEmployeeInternal:()=>a,UserTypeRetailEmployeePersonal:()=>o,UserTypeWallet:()=>u,automatedEvents:()=>xn,automatedMappingConfig:()=>In,clearMarkEntry:()=>Vn,clearPerformanceMarkEntries:()=>Xn,config:()=>A,createEventConfig:()=>On,createNewSpan:()=>Ln,createNewTrace:()=>Un,device:()=>W,endPerfMark:()=>Jn,exposeExperiment:()=>wn,flushQueue:()=>or,generateUUID:()=>V,getAnalyticsHeaders:()=>sr,getReferrerData:()=>le,getTracingHeaders:()=>An,getTracingId:()=>Dn,getUrlHostname:()=>pe,getUrlParams:()=>me,getUrlPathname:()=>fe,getUserContext:()=>ar,identify:()=>Tn,identifyFlow:()=>xe,identity:()=>H,identityFlow:()=>Se,incrementUjNavigation:()=>an,init:()=>yn,initNextJsTrackPageview:()=>_n,initTrackPageview:()=>kn,isEventKeyFormatValid:()=>we,isSessionEnded:()=>pt,location:()=>re,logEvent:()=>$t,logMetric:()=>Ht,logPageView:()=>on,logTrace:()=>Rn,markNTBT:()=>tn,markStep:()=>nn,markStepOnce:()=>rn,onVisibilityChange:()=>ln,optIn:()=>En,optOut:()=>Sn,perfMark:()=>Wn,persistentData:()=>oe,postMessage:()=>K,recordSessionDuration:()=>pn,removeFromIdentifyFlow:()=>Ee,savePersistentData:()=>st,sendScheduledEvents:()=>Bt,setBreadcrumbs:()=>ie,setConfig:()=>U,setLocation:()=>ae,setPagePath:()=>ve,setPageview:()=>Kt,setPersistentData:()=>se,setSessionStart:()=>dt,setTime:()=>Ue,startPerfMark:()=>Hn,timeStone:()=>Le,useEventLogger:()=>Yn,useLogEventOnMount:()=>tr,usePerformanceMarks:()=>rr});let e=function(e){return e.fbclid="fbclid",e.gclid="gclid",e.msclkid="msclkid",e.ptclid="ptclid",e.ttclid="ttclid",e.utm_source="utm_source",e.utm_medium="utm_medium",e.utm_campaign="utm_campaign",e.utm_term="utm_term",e.utm_content="utm_content",e}({});const t=0,i=1,a=2,o=3,s=4,c=5,u=6;let l=function(e){return e.low="low",e.high="high",e}({}),d=function(e){return e.count="count",e.rate="rate",e.gauge="gauge",e.distribution="distribution",e.histogram="histogram",e}({}),p=function(e){return e.commerce_merchant="commerce_merchant",e.device="device",e.edp_fingerprint_id="edp_fingerprint_id",e.nft_user="nft_user",e.user="user",e.wallet_user="wallet_user",e.uuid="user_uuid",e}({}),m=function(e){return e.unknown="unknown",e.banner="banner",e.button="button",e.card="card",e.chart="chart",e.content_script="content_script",e.dropdown="dropdown",e.link="link",e.page="page",e.modal="modal",e.table="table",e.search_bar="search_bar",e.service_worker="service_worker",e.text="text",e.text_input="text_input",e.tray="tray",e.checkbox="checkbox",e.icon="icon",e}({}),f=function(e){return e.unknown="unknown",e.blur="blur",e.click="click",e.change="change",e.dismiss="dismiss",e.focus="focus",e.hover="hover",e.select="select",e.measurement="measurement",e.move="move",e.process="process",e.render="render",e.scroll="scroll",e.view="view",e.search="search",e.keyPress="keyPress",e}({}),v=function(e){return e.unknown="unknown",e.web="web",e.android="android",e.ios="ios",e.mobile_web="mobile_web",e.tablet_web="tablet_web",e.server="server",e.windows="windows",e.macos="macos",e.extension="extension",e}({}),g=function(e){return e.web="Web",e.ios="iOS",e.android="Android",e}({}),b=function(e){return e[e.notLoggedIn=0]="notLoggedIn",e[e.loggedIn=1]="loggedIn",e}({}),h=function(e){return e.ac="ac",e.af="af",e.ah="ah",e.al="al",e.am="am",e.ar="ar",e.as="as",e}({}),w=function(e){return e.pv="pv",e}({}),y=function(e){return e.xs="xs",e.s="s",e.m="m",e.l="l",e.xl="xl",e.xxl="xxl",e}({});const T="https://analytics-service-dev.cbhq.net",k=3e5,_=5e3,S="analytics-db",E="experiment-exposure-db",x="Analytics SDK:",O=Object.values(e),j="pageview",N="session_duration",I={navigationTiming:{eventName:"perf_navigation_timing"},redirectTime:{eventName:"perf_redirect_time"},RT:{eventName:"perf_redirect_time"},TTFB:{eventName:"perf_time_to_first_byte"},networkInformation:{eventName:"perf_network_information"},storageEstimate:{eventName:"perf_storage_estimate"},FCP:{eventName:"perf_first_contentful_paint"},FID:{eventName:"perf_first_input_delay"},LCP:{eventName:"perf_largest_contentful_paint"},CLS:{eventName:"perf_cumulative_layout_shift"},TBT:{eventName:"perf_total_blocking_time"},NTBT:{eventName:"perf_navigation_total_blocking_time"},INP:{eventName:"perf_interact_to_next_paint"},ET:{eventName:"perf_element_timing"},userJourneyStep:{eventName:"perf_user_journey_step"}},P="1",M="web";function B(){return B=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},B.apply(this,arguments)}const C=/^(https?:\\/\\/)/;function D(e){return{eventsEndpoint:e+"/amp",metricsEndPoint:e+"/metrics",exposureEndpoint:e+"/track-exposures",tracesEndpoint:e+"/traces"}}const A=B({authCookie:"logged_in",amplitudeApiKey:"",batchEventsPeriod:_,batchEventsThreshold:30,batchMetricsPeriod:_,batchMetricsThreshold:30,batchTracesPeriod:_,batchTracesThreshold:30,headers:{},interactionManager:null,isAlwaysAuthed:!1,isProd:!1,isInternalApplication:!1,onError:(e,t)=>{console.error(x,e,t)},platform:v.unknown,projectName:"",ricTimeoutScheduleEvent:1e3,ricTimeoutSetDevice:500,showDebugLogging:!1,trackUserId:!1,version:null,apiEndpoint:T},D(T),{steps:{}}),L=[].reduce(((e,t)=>n=>e(t(n))),(e=>{if(!e.isProd)return e.isInternalApplication?(e.apiEndpoint="https://analytics-service-internal-dev.cbhq.net",B({},e,D(e.apiEndpoint))):e;const t=(e=>e.apiEndpoint?C.test(e.apiEndpoint)?e.apiEndpoint:\`https://\${e.apiEndpoint}\`:e.isInternalApplication?"https://analytics-service-internal.cbhq.net":"https://as.coinbase.com")(e);return B({},e,{apiEndpoint:t},D(t))})),U=e=>{const{batchEventsThreshold:t,batchMetricsThreshold:n,batchTracesThreshold:r}=e,i=[t,n,r];for(const e of i)if((e||0)>30){console.warn("You are setting the threshhold for the batch limit to be greater than 30. This may cause request overload.");break}Object.assign(A,L(e))},R=[v.web,v.mobile_web,v.tablet_web];function q(){return"android"===A.platform}function F(){return"ios"===A.platform}function z(){return R.includes(A.platform)}function K(e){if(z()&&navigator&&"serviceWorker"in navigator&&navigator.serviceWorker.controller)try{navigator.serviceWorker.controller.postMessage(e)}catch(e){e instanceof Error&&A.onError(e)}}var $=n(353),Q=n.n($);const W={amplitudeOSName:null,amplitudeOSVersion:null,amplitudeDeviceModel:null,amplitudePlatform:null,browserName:null,browserMajor:null,osName:null,userAgent:null,width:null,height:null},H={countryCode:null,deviceId:null,device_os:null,isOptOut:!1,languageCode:null,locale:null,jwt:null,session_lcc_id:null,userAgent:null,userId:null},V=e=>e?(e^16*Math.random()>>e/4).toString(16):"10000000-1000-4000-8000-100000000000".replace(/[018]/g,V),J=()=>A.isAlwaysAuthed||!!H.userId,X=()=>{const e={};return H.countryCode&&(e.country_code=H.countryCode),e},G=()=>{const{platform:e}=A;if(e===v.web)switch(!0){case window.matchMedia("(max-width: 560px)").matches:return v.mobile_web;case window.matchMedia("(max-width: 1024px, min-width: 561px)").matches:return v.tablet_web}return e},Z=()=>{var e,t,n,r,i;z()?("requestIdleCallback"in window?window.requestIdleCallback(ne,{timeout:A.ricTimeoutSetDevice}):ne(),W.amplitudePlatform=g.web,W.userAgent=(null==(e=window)||null==(e=e.navigator)?void 0:e.userAgent)||null,ee({height:null!=(t=null==(n=window)?void 0:n.innerHeight)?t:null,width:null!=(r=null==(i=window)?void 0:i.innerWidth)?r:null})):F()?(W.amplitudePlatform=g.ios,W.userAgent=H.userAgent,W.userAgent&&ne()):q()&&(W.userAgent=H.userAgent,W.amplitudePlatform=g.android,W.userAgent&&ne())},Y=e=>{Object.assign(H,e),z()&&K({identity:{isAuthed:!!H.userId,locale:H.locale||null}})},ee=e=>{W.height=e.height,W.width=e.width},te=()=>{U({platform:G()}),z()&&K({config:{platform:A.platform}})},ne=()=>{var e;performance.mark&&performance.mark("ua_parser_start");const t=new(Q())(null!=(e=W.userAgent)?e:"").getResult();W.browserName=t.browser.name||null,W.browserMajor=t.browser.major||null,W.osName=t.os.name||null,W.amplitudeOSName=W.browserName,W.amplitudeOSVersion=W.browserMajor,W.amplitudeDeviceModel=W.osName,K({device:{browserName:W.browserName,osName:W.osName}}),performance.mark&&(performance.mark("ua_parser_end"),performance.measure("ua_parser","ua_parser_start","ua_parser_end"))},re={breadcrumbs:[],initialUAAData:{},pageKey:"",pageKeyRegex:{},pagePath:"",prevPageKey:"",prevPagePath:""};function ie(e){Object.assign(re,{breadcrumbs:e})}function ae(e){Object.assign(re,e)}const oe={eventId:0,sequenceNumber:0,sessionId:0,lastEventTime:0,sessionStart:0,sessionUUID:null,userId:null,ac:0,af:0,ah:0,al:0,am:0,ar:0,as:0,pv:0};function se(e){Object.assign(oe,e)}function ce(){var e,t;return null!=(e=null==(t=document)?void 0:t.referrer)?e:""}function ue(){return ue=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},ue.apply(this,arguments)}const le=()=>{const e=ce();if(!e)return{};const t=new URL(e);return t.hostname===pe()?{}:{referrer:e,referring_domain:t.hostname}},de=()=>{const e=new URLSearchParams(me()),t={};return O.forEach((n=>{e.has(n)&&(t[n]=(e.get(n)||"").toLowerCase())})),t},pe=()=>{var e;return(null==(e=window)||null==(e=e.location)?void 0:e.hostname)||""},me=()=>{var e;return(null==(e=window)||null==(e=e.location)?void 0:e.search)||""},fe=()=>{var e;return(null==(e=window)||null==(e=e.location)?void 0:e.pathname)||""},ve=()=>{const e=A.overrideWindowLocation?re.pagePath:fe()+me();e&&e!==re.pagePath&&(e!==re.pagePath&&ge(),re.pagePath=e,re.pageKeyRegex&&Object.keys(re.pageKeyRegex).some((e=>{if(re.pageKeyRegex[e].test(re.pagePath))return re.pageKey=e,!0})))},ge=()=>{if(z()){const e=ce();if(!re.prevPagePath&&e){const t=new URL(e);if(t.hostname===pe())return void(re.prevPagePath=t.pathname)}}re.prevPagePath=re.pagePath,re.prevPageKey=re.pageKey},be=e=>{z()&&Object.assign(e,z()?(Object.keys(re.initialUAAData).length>0||(new URLSearchParams(me()),re.initialUAAData=ue({},(()=>{const e={};return O.forEach((t=>{oe[t]&&(e[t]=oe[t])})),e})(),de(),le())),re.initialUAAData):re.initialUAAData)},he=/^[a-zd]+(_[a-zd]+)*$/;function we(e){return he.test(e)}function ye(){return ye=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},ye.apply(this,arguments)}const Te=["action","component_type","component_name","context","logging_id"],ke=["num_non_hardware_accounts","ujs"],_e="ujs_",Se={};function Ee(e){e.forEach((e=>{ke.includes(e)&&delete Se[e]}))}function xe(e){var t;const n=Object.entries(e).reduce(((e,t)=>{const[n,r]=t;return!Te.includes(n)&&ke.includes(n)?we(n)?ye({},e,{[n]:r}):(A.onError(new Error("IdentityFlow property names must have snake case format"),{[n]:r}),e):e}),{});null!=(t=n.ujs)&&t.length&&(n.ujs=n.ujs.map((e=>\`\${_e}\${e}\`))),Object.assign(Se,n)}function Oe(){return A.platform!==v.unknown||(A.onError(new Error("SDK platform not initialized")),!1)}const je={eventsQueue:[],eventsScheduled:!1,metricsQueue:[],metricsScheduled:!1,tracesQueue:[],tracesScheduled:!1};function Ne(e){Object.assign(je,e)}const Ie={ac:0,af:0,ah:0,al:0,am:0,ar:0,as:0,pv:0,sqs:0},Pe={ac:20,af:5,ah:1,al:1,am:0,ar:10,as:20},Me={pv:25},Be={xs:0,s:1,m:1,l:2,xl:2,xxl:2},Ce=e=>e<15?y.xs:e<60?y.s:e<240?y.m:e<960?y.l:e<3840?y.xl:y.xxl,De=e=>{Object.assign(Ie,e)};function Ae(){return(new Date).getTime()}const Le={timeStart:Ae(),timeOnPagePath:0,timeOnPageKey:0,prevTimeOnPagePath:0,prevTimeOnPageKey:0,sessionDuration:0,sessionEnd:0,sessionStart:0,prevSessionDuration:0};function Ue(e){Object.assign(Le,e)}const Re=(e,t)=>t.some((t=>e instanceof t));let qe,Fe;const ze=new WeakMap,Ke=new WeakMap,$e=new WeakMap,Qe=new WeakMap,We=new WeakMap;let He={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return Ke.get(e);if("objectStoreNames"===t)return e.objectStoreNames||$e.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Je(e[t])},set:(e,t,n)=>(e[t]=n,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function Ve(e){return"function"==typeof e?(t=e)!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(Fe||(Fe=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(t)?function(...e){return t.apply(Xe(this),e),Je(ze.get(this))}:function(...e){return Je(t.apply(Xe(this),e))}:function(e,...n){const r=t.call(Xe(this),e,...n);return $e.set(r,e.sort?e.sort():[e]),Je(r)}:(e instanceof IDBTransaction&&function(e){if(Ke.has(e))return;const t=new Promise(((t,n)=>{const r=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",a),e.removeEventListener("abort",a)},i=()=>{t(),r()},a=()=>{n(e.error||new DOMException("AbortError","AbortError")),r()};e.addEventListener("complete",i),e.addEventListener("error",a),e.addEventListener("abort",a)}));Ke.set(e,t)}(e),Re(e,qe||(qe=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction]))?new Proxy(e,He):e);var t}function Je(e){if(e instanceof IDBRequest)return function(e){const t=new Promise(((t,n)=>{const r=()=>{e.removeEventListener("success",i),e.removeEventListener("error",a)},i=()=>{t(Je(e.result)),r()},a=()=>{n(e.error),r()};e.addEventListener("success",i),e.addEventListener("error",a)}));return t.then((t=>{t instanceof IDBCursor&&ze.set(t,e)})).catch((()=>{})),We.set(t,e),t}(e);if(Qe.has(e))return Qe.get(e);const t=Ve(e);return t!==e&&(Qe.set(e,t),We.set(t,e)),t}const Xe=e=>We.get(e),Ge=["get","getKey","getAll","getAllKeys","count"],Ze=["put","add","delete","clear"],Ye=new Map;function et(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(Ye.get(t))return Ye.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,i=Ze.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!i&&!Ge.includes(n))return;const a=async function(e,...t){const a=this.transaction(e,i?"readwrite":"readonly");let o=a.store;return r&&(o=o.index(t.shift())),(await Promise.all([o[n](...t),i&&a.done]))[0]};return Ye.set(t,a),a}var tt;tt=He,He={...tt,get:(e,t,n)=>et(e,t)||tt.get(e,t,n),has:(e,t)=>!!et(e,t)||tt.has(e,t)};const nt={isReady:!1,idbKeyval:null};function rt(e){Object.assign(nt,e)}const it={},at=async e=>{if(!nt.idbKeyval)return Promise.resolve(null);try{return await nt.idbKeyval.get(e)}catch(e){return A.onError(new Error("IndexedDB:Get:InternalError")),Promise.resolve(null)}},ot=async(e,t)=>{if(nt.idbKeyval)try{await nt.idbKeyval.set(e,t)}catch(e){A.onError(new Error("IndexedDB:Set:InternalError"))}},st=()=>{"server"!==A.platform&&(se({sessionStart:Le.sessionStart,ac:Ie.ac,af:Ie.af,ah:Ie.ah,al:Ie.al,am:Ie.am,ar:Ie.ar,as:Ie.as,pv:Ie.pv}),H.userId&&se({userId:H.userId}),ot(S,oe))},ct="rgb(5,177,105)",ut=e=>{const{metricName:t,data:n}=e,r=e.importance||l.low;if(!A.showDebugLogging||!console)return;const i=\`%c \${x}\`,a=\`color:\${ct};font-size:11px;\`,o=\`Importance: \${r}\`;console.group(i,a,t,o),n.forEach((e=>{e.event_type?console.log(e.event_type,e):console.log(e)})),console.groupEnd()},lt=e=>{const{metricName:t,data:n}=e,r=e.importance||l.low;if(!A.showDebugLogging||!console)return;const i=\`color:\${ct};font-size:11px;\`,a=\`%c \${x}\`,o=\`Importance: \${r}\`;console.log(a,i,t,n,o)},dt=()=>{const e=Ae();oe.sessionId&&oe.lastEventTime&&oe.sessionUUID&&!pt(e)||(oe.sessionId=e,oe.sessionUUID=V(),Ue({sessionStart:e}),lt({metricName:"Started new session:",data:{persistentData:oe,timeStone:Le}})),oe.lastEventTime=e},pt=e=>e-oe.lastEventTime>18e5;function mt(){return mt=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},mt.apply(this,arguments)}const ft=e=>{var t;(e=>{switch(e.action){case f.click:Ie.ac+=1;break;case f.focus:Ie.af+=1;break;case f.hover:Ie.ah+=1;break;case f.move:Ie.am+=1;break;case f.scroll:Ie.al+=1;break;case f.search:Ie.ar+=1;break;case f.select:Ie.as+=1}})(t=e),t.event_type!==j?t.event_type===N&&((e=>{if(!e.session_rank)return;const t=e.session_rank;Object.values(h).forEach((e=>{Ie.sqs+=Ie[e]*Pe[e]})),Object.values(w).forEach((e=>{Ie.sqs+=Ie[e]*Me[e]})),Ie.sqs*=Be[t]})(t),Object.assign(t,Ie),De({ac:0,af:0,ah:0,al:0,am:0,ar:0,as:0,pv:0,sqs:0})):Ie.pv+=1;const n=e.event_type;delete e.event_type;const r=e.deviceId?e.deviceId:null,i=e.timestamp;return delete e.timestamp,se({eventId:oe.eventId+1}),se({sequenceNumber:oe.sequenceNumber+1}),dt(),st(),{device_id:H.deviceId||r||null,user_id:H.userId,timestamp:i,event_id:oe.eventId,session_id:oe.sessionId||-1,event_type:n,version_name:A.version||null,platform:W.amplitudePlatform,os_name:W.amplitudeOSName,os_version:W.amplitudeOSVersion,device_model:W.amplitudeDeviceModel,language:H.languageCode,event_properties:mt({},e,{session_uuid:oe.sessionUUID,height:W.height,width:W.width}),user_properties:X(),uuid:V(),library:{name:"@cbhq/client-analytics",version:"10.6.0"},sequence_number:oe.sequenceNumber,user_agent:W.userAgent||H.userAgent}},vt=e=>e.map((e=>ft(e)));function gt(){return gt=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},gt.apply(this,arguments)}const bt=e=>e.map((e=>(e=>{const t=e.tags||{},n=gt({authed:J()?"true":"false",platform:A.platform},t,{project_name:A.projectName,version_name:A.version||null});return{metric_name:e.metricName,page_path:e.pagePath||null,value:e.value,tags:n,type:e.metricType}})(e))),ht=e=>0!==je.metricsQueue.length&&(je.metricsQueue.length>=A.batchMetricsThreshold||(je.metricsScheduled||(je.metricsScheduled=!0,setTimeout((()=>{je.metricsScheduled=!1,e(bt(je.metricsQueue)),je.metricsQueue=[]}),A.batchMetricsPeriod)),!1)),wt=e=>0!==je.tracesQueue.length&&(je.tracesQueue.length>=A.batchTracesThreshold||(je.tracesScheduled||(je.tracesScheduled=!0,setTimeout((()=>{je.tracesScheduled=!1,e(je.tracesQueue),je.tracesQueue=[]}),A.batchTracesPeriod)),!1)),yt=e=>{var t;z()&&null!=(t=window)&&t.requestIdleCallback?window.requestIdleCallback(e,{timeout:A.ricTimeoutScheduleEvent}):(q()||F())&&A.interactionManager?A.interactionManager.runAfterInteractions(e):e()};function Tt(){return Tt=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},Tt.apply(this,arguments)}const kt="application/x-www-form-urlencoded; charset=UTF-8",_t=e=>{const{data:t,importance:n,isJSON:r,onError:i,url:a}=e,o=r?"application/json":kt,s=n||l.low,c=r?JSON.stringify(t):new URLSearchParams(t).toString();function u(){const e=new XMLHttpRequest;e.open("POST",a,!0),Object.keys(A.headers||{}).forEach((t=>{e.setRequestHeader(t,A.headers[t])})),e.setRequestHeader("Content-Type",kt),H.jwt&&e.setRequestHeader("authorization",\`Bearer \${H.jwt}\`),e.send(c)}if(!z()||r||!("sendBeacon"in navigator)||s!==l.low||A.headers&&0!==Object.keys(A.headers).length)if(z()&&!r)u();else{const e=Tt({},A.headers,{"Content-Type":o});H.jwt&&(e.Authorization=\`Bearer \${H.jwt}\`),fetch(a,{method:"POST",mode:"no-cors",headers:e,body:c}).catch((e=>{i(e,{context:"AnalyticsSDKApiError"})}))}else{const e=new Blob([c],{type:kt});try{navigator.sendBeacon.bind(navigator)(a,e)||u()}catch(e){console.error(e),u()}}};var St=n(762),Et=n.n(St);const xt=(e,t,n)=>{const r=e||"";return Et()("2"+r+t+n)};function Ot(){return Ot=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},Ot.apply(this,arguments)}class jt extends Error{constructor(e){super(e),this.name="CircularJsonReference",this.message=e,"function"==typeof Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error(e).stack}}class Nt extends jt{constructor(...e){super(...e),this.name="DomReferenceInAnalyticsEvent"}}function It(){return It=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},It.apply(this,arguments)}const Pt=(e,t=l.low)=>{var n;e&&je.eventsQueue.push(e),nt.isReady&&(!A.trackUserId||H.userId?(t===l.high||(n=Mt,0!==je.eventsQueue.length&&(je.eventsQueue.length>=A.batchEventsThreshold||(je.eventsScheduled||(je.eventsScheduled=!0,setTimeout((()=>{je.eventsScheduled=!1,n(vt(je.eventsQueue)),je.eventsQueue=[]}),A.batchEventsPeriod)),0))))&&Bt():je.eventsQueue.length>10&&(A.trackUserId=!1,A.onError(new Error("userId not set in Logged-in"))))},Mt=(e,t=l.low)=>{if(H.isOptOut||0===e.length)return;let n;try{n=JSON.stringify(e)}catch(t){const r=e.map((e=>e.event_type)).join(", "),[i,a]=(e=>{try{const n=[];for(const r of e){const e=Ot({},r);r.event_properties&&(e.event_properties=Ot({},e.event_properties,{currentTarget:null,target:null,relatedTarget:null,_dispatchInstances:null,_targetInst:null,view:(t=r.event_properties.view,["string","number","boolean"].includes(typeof t)?r.event_properties.view:null)})),n.push(e)}return[!0,JSON.stringify(n)]}catch(e){return[!1,""]}var t})(e);if(!i)return void A.onError(new jt(t instanceof Error?t.message:"unknown"),{listEventType:r});n=a,A.onError(new Nt("Found DOM element reference"),{listEventType:r,stringifiedEventData:n})}const r=Ae().toString(),i=It({},{e:n,v:"2",upload_time:r},{client:A.amplitudeApiKey,checksum:xt(A.amplitudeApiKey,n,r)});_t({url:A.eventsEndpoint,data:i,importance:t,onError:A.onError}),ut({metricName:"Batch Events",data:e,importance:t})},Bt=()=>{Mt(vt(je.eventsQueue)),Ne({eventsQueue:[]})};function Ct(){return Ct=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},Ct.apply(this,arguments)}const Dt=Object.values(f),At=Object.values(m),Lt=e=>Dt.includes(e)?e:f.unknown,Ut=e=>At.includes(e)?e:m.unknown,Rt=(e,t,n)=>{const r={auth:J()?b.loggedIn:b.notLoggedIn,action:Lt(e),component_type:Ut(t),logging_id:n,platform:A.platform,project_name:A.projectName};return"number"==typeof H.userTypeEnum&&(r.user_type_enum=H.userTypeEnum),r},qt=e=>{const t=Ae();if(!e)return A.onError(new Error("missing logData")),Ct({},Rt(f.unknown,m.unknown),{locale:H.locale,session_lcc_id:H.session_lcc_id,timestamp:t,time_start:Le.timeStart});const n=Ct({},e,Rt(e.action,e.componentType,e.loggingId),{locale:H.locale,session_lcc_id:H.session_lcc_id,timestamp:t,time_start:Le.timeStart});return delete n.componentType,delete n.loggingId,n},Ft={blacklistRegex:[],isEnabled:!1};function zt(){return{page_key:re.pageKey,page_path:re.pagePath,prev_page_key:re.prevPageKey,prev_page_path:re.prevPagePath}}function Kt(e){Object.assign(Ft,e)}function $t(e,t,n=l.low){if(H.isOptOut)return;if(!Oe())return;const r=qt(t);!function(e){Ft.isEnabled&&(ve(),Object.assign(e,zt()))}(r),be(r),function(e){Object.keys(Se).length>0&&Object.assign(e,Se)}(r),r.has_double_fired=!1,r.event_type=e,n===l.high?Pt(r,n):yt((()=>{Pt(r)}))}function Qt(e,t=!1){t?_t({url:A.metricsEndPoint,data:{metrics:e},isJSON:!0,onError:A.onError}):yt((()=>{_t({url:A.metricsEndPoint,data:{metrics:e},isJSON:!0,onError:A.onError})})),ut({metricName:"Batch Metrics",data:e})}function Wt(){return Wt=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},Wt.apply(this,arguments)}function Ht(e){if(!Oe())return;v.server!==A.platform&&!e.pagePath&&re.pagePath&&(e.pagePath=re.pagePath);const t=Object.keys(Se).length?Wt({},e.tags,Se):e.tags;t&&Object.assign(e,{tags:t}),je.metricsQueue.push(e),ht(Qt)&&(Qt(bt(je.metricsQueue)),je.metricsQueue=[])}function Vt(){return Vt=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},Vt.apply(this,arguments)}let Jt=function(e){return e.instant="instant",e.quick="quick",e.moderate="moderate",e.slow="slow",e.unavoidable="unavoidable",e}({});function Xt(e){return e.toLowerCase()}let Gt={};const Zt=(e,t)=>{null!=A&&A.onMarkStep&&A.onMarkStep(e,t),xe({ujs:t})};let Yt;const en={Perfume:()=>{},markStep:e=>{},markStepOnce:e=>{},incrementUjNavigation:()=>{}},tn=()=>{z()&&Yt&&Yt.markNTBT&&Yt.markNTBT()},nn=e=>{z()&&Yt&&en.markStep&&en.markStep(e)},rn=e=>{z()&&Yt&&en.markStepOnce&&en.markStepOnce(e)},an=()=>{z()&&Yt&&en.incrementUjNavigation&&en.incrementUjNavigation()};function on(e={callMarkNTBT:!0}){"unknown"!==A.platform&&(Ft.blacklistRegex.some((e=>e.test(fe())))||($t(j,{action:f.render,componentType:m.page}),e.callMarkNTBT&&tn()))}let sn=!1,cn=!1;const un=e=>{sn=!e.persisted},ln=(e,t="hidden",n=!1)=>{cn||(addEventListener("pagehide",un),addEventListener("beforeunload",(()=>{})),cn=!0),addEventListener("visibilitychange",(({timeStamp:n})=>{document.visibilityState===t&&e({timeStamp:n,isUnloading:sn})}),{capture:!0,once:n})},dn=36e3;function pn(){const e=pt(Ae());if(e&&(O.forEach((e=>{oe[e]&&delete oe[e]})),st()),!oe.lastEventTime||!Le.sessionStart||!e)return;const t=Math.round((oe.lastEventTime-Le.sessionStart)/1e3);if(t<1||t>dn)return;const n=Ce(t);$t(N,{action:f.measurement,componentType:m.page,session_duration:t,session_end:oe.lastEventTime,session_start:Le.sessionStart,session_rank:n})}function mn(){return mn=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},mn.apply(this,arguments)}const fn=[],vn=[],gn=()=>{const e=fn.shift();e&&e()},bn=()=>{const e=vn.shift();e&&e()};let hn={};function wn(e){const t=function(e){return{test_name:e.testName,group_name:e.group,subject_id:e.subjectId,exposed_at:Ae(),subject_type:e.subjectType,platform:A.platform}}(e);hn[e.testName]=hn[e.testName]||0,hn[e.testName]+k>Ae()?lt({metricName:\`Event: exposeExperiment \${e.testName} not sent\`,data:t}):(hn[e.testName]=Ae(),ot(E,hn),lt({metricName:\`Event: exposeExperiment \${e.testName} sent\`,data:t}),_t({url:A.exposureEndpoint,data:[t],onError:(t,n)=>{hn[e.testName]=0,ot(E,hn),A.onError(t,n)},isJSON:!0,importance:l.high}))}const yn=e=>{var t,r,i;U(e),z()&&(H.languageCode=(null==(t=navigator)?void 0:t.languages[0])||(null==(r=navigator)?void 0:r.language)||""),te(),(()=>{var e;if(z()&&null!=(e=window)&&e.indexedDB){const e=function(e,t,{blocked:n,upgrade:r,blocking:i,terminated:a}={}){const o=indexedDB.open(e,t),s=Je(o);return r&&o.addEventListener("upgradeneeded",(e=>{r(Je(o.result),e.oldVersion,e.newVersion,Je(o.transaction),e)})),n&&o.addEventListener("blocked",(e=>n(e.oldVersion,e.newVersion,e))),s.then((e=>{a&&e.addEventListener("close",(()=>a())),i&&e.addEventListener("versionchange",(e=>i(e.oldVersion,e.newVersion,e)))})).catch((()=>{})),s}("keyval-store",1,{upgrade(e){e.createObjectStore("keyval")}});rt({idbKeyval:{get:async t=>(await e).get("keyval",t),set:async(t,n)=>(await e).put("keyval",n,t),delete:async t=>(await e).delete("keyval",t),keys:async()=>(await e).getAllKeys("keyval")}})}else rt({idbKeyval:{get:async e=>new Promise((t=>{t(it[e])})),set:async(e,t)=>new Promise((n=>{it[e]=t,n(e)})),delete:async e=>new Promise((()=>{delete it[e]})),keys:async()=>new Promise((e=>{e(Object.keys(it))}))}})})(),lt({metricName:"Initialized Analytics:",data:{deviceId:H.deviceId}}),fn.push((()=>{Pt()})),(async()=>{const e=await at(S);rt({isReady:!0}),gn(),e&&(bn(),se({eventId:e.eventId||oe.eventId,sequenceNumber:e.sequenceNumber||oe.sequenceNumber,sessionId:e.sessionId||oe.sessionId,lastEventTime:e.lastEventTime||oe.lastEventTime,sessionUUID:e.sessionUUID||oe.sessionUUID}),function(e){se(mn({},function(e){const t={};return O.forEach((n=>{e[n]&&(t[n]=e[n])})),t}(e),de()))}(e),Ue({sessionStart:e.sessionStart||oe.sessionStart}),De({ac:e.ac||Ie.ac,af:e.af||Ie.af,ah:e.ah||Ie.ah,al:e.al||Ie.al,am:e.am||Ie.am,ar:e.ar||Ie.ar,as:e.as||Ie.as,pv:e.pv||Ie.pv}),A.trackUserId&&Y({userId:e.userId||H.userId}),pn(),lt({metricName:"Initialized Analytics IndexedDB:",data:e}))})(),async function(){at(E).then((e=>{hn=null!=e?e:{}})).catch((e=>{e instanceof Error&&A.onError(e)}))}(),Z(),z()&&(ln((()=>{se({lastEventTime:Ae()}),st(),Bt()}),"hidden"),ln((()=>{pn()}),"visible")),z()&&(i=()=>{var e,t,n,r;te(),ee({width:null!=(e=null==(t=window)?void 0:t.innerWidth)?e:null,height:null!=(n=null==(r=window)?void 0:r.innerHeight)?n:null})},addEventListener("resize",(()=>{requestAnimationFrame((()=>{i()}))}))),(()=>{if(z())try{const e=n(2);en.markStep=e.markStep,en.markStepOnce=e.markStepOnce,en.incrementUjNavigation=e.incrementUjNavigation,Yt=new e.Perfume({analyticsTracker:e=>{const{data:t,attribution:n,metricName:r,navigatorInformation:i,rating:a}=e,o=I[r],s=(null==n?void 0:n.category)||null;if(!o&&!s)return;const c=(null==i?void 0:i.deviceMemory)||0,u=(null==i?void 0:i.hardwareConcurrency)||0,l=(null==i?void 0:i.isLowEndDevice)||!1,p=(null==i?void 0:i.isLowEndExperience)||!1,v=(null==i?void 0:i.serviceWorkerStatus)||"unsupported",g=Vt({deviceMemory:c,hardwareConcurrency:u,isLowEndDevice:l,isLowEndExperience:p,serviceWorkerStatus:v},Gt),b={is_low_end_device:l,is_low_end_experience:p,page_key:re.pageKey||"",save_data:t.saveData||!1,service_worker:v,is_perf_metric:!0};if("navigationTiming"===r)t&&"number"==typeof t.redirectTime&&Ht({metricName:I.redirectTime.eventName,metricType:d.histogram,tags:b,value:t.redirectTime||0});else if("TTFB"===r)$t(o.eventName,Vt({action:f.measurement,componentType:m.page,duration:t||null,vitalsScore:a||null},g)),Ht({metricName:I.TTFB.eventName,metricType:d.histogram,tags:Vt({},b),value:t}),a&&Ht({metricName:\`perf_web_vitals_ttfb_\${a}\`,metricType:d.count,tags:b,value:1});else if("networkInformation"===r)null!=t&&t.effectiveType&&(Gt=t,$t(o.eventName,{action:f.measurement,componentType:m.page,networkInformationDownlink:t.downlink,networkInformationEffectiveType:t.effectiveType,networkInformationRtt:t.rtt,networkInformationSaveData:t.saveData,navigatorDeviceMemory:c,navigatorHardwareConcurrency:u}));else if("storageEstimate"===r)$t(o.eventName,Vt({action:f.measurement,componentType:m.page},t,g)),Ht({metricName:"perf_storage_estimate_caches",metricType:d.histogram,tags:b,value:t.caches}),Ht({metricName:"perf_storage_estimate_indexed_db",metricType:d.histogram,tags:b,value:t.indexedDB});else if("CLS"===r)$t(o.eventName,Vt({action:f.measurement,componentType:m.page,score:100*t||null,vitalsScore:a||null},g)),a&&Ht({metricName:\`perf_web_vitals_cls_\${a}\`,metricType:d.count,tags:b,value:1});else if("FID"===r){const e=(null==n?void 0:n.performanceEntry)||null,r=parseInt((null==e?void 0:e.processingStart)||"");$t(o.eventName,Vt({action:f.measurement,componentType:m.page,duration:t||null,processingStart:null!=e&&e.processingStart?r:null,startTime:null!=e&&e.startTime?parseInt(e.startTime):null,vitalsScore:a||null},g)),a&&Ht({metricName:\`perf_web_vitals_fidVitals_\${a}\`,metricType:d.count,tags:b,value:1})}else"userJourneyStep"===r?($t("perf_user_journey_step",Vt({action:f.measurement,componentType:m.page,duration:t||null,rating:null!=a?a:null,step_name:(null==n?void 0:n.stepName)||""},g)),Ht({metricName:\`user_journey_step.\${A.projectName}.\${A.platform}.\${(null==n?void 0:n.stepName)||""}_vitals_\${a}\`,metricType:d.count,tags:b,value:1}),Ht({metricName:\`user_journey_step.\${A.projectName}.\${A.platform}.\${(null==n?void 0:n.stepName)||""}\`,metricType:d.distribution,tags:b,value:t||null})):I[r]&&t&&($t(o.eventName,Vt({action:f.measurement,componentType:m.page,duration:t||null,vitalsScore:a||null},g)),a&&(Ht({metricName:\`perf_web_vitals_\${Xt(r)}_\${a}\`,metricType:d.count,tags:b,value:1}),"LCP"===r&&Ht({metricName:\`perf_web_vitals_\${Xt(r)}\`,metricType:d.distribution,tags:b,value:t})))},maxMeasureTime:3e4,steps:A.steps,onMarkStep:Zt})}catch(e){e instanceof Error&&A.onError(e)}})()},Tn=e=>{Y(e),e.userAgent&&Z(),lt({metricName:"Identify:",data:{countryCode:H.countryCode,deviceId:H.deviceId,userId:H.userId}})},kn=({blacklistRegex:e,pageKeyRegex:t,browserHistory:n})=>{Kt({blacklistRegex:e||[],isEnabled:!0}),ae({pageKeyRegex:t}),on({callMarkNTBT:!1}),n.listen((()=>{on()}))},_n=({blacklistRegex:e,pageKeyRegex:t,nextJsRouter:n})=>{Kt({blacklistRegex:e||[],isEnabled:!0}),ae({pageKeyRegex:t}),on({callMarkNTBT:!1}),n.events.on("routeChangeComplete",(()=>{on()}))},Sn=()=>{Y({isOptOut:!0}),ot(S,{})},En=()=>{Y({isOptOut:!1})},xn={Button:{label:"cb_button",uuid:"e921a074-40e6-4371-8700-134d5cd633e6",componentType:m.button}};function On(e,t,n){return{componentName:e,actions:t,data:n}}function jn(){return jn=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},jn.apply(this,arguments)}function Nn(e,t,n){const{componentName:r,data:i}=n;$t(e.label,jn({componentType:e.componentType,action:t,loggingId:e.uuid,component_name:r},i))}const In={actionMapping:{onPress:f.click,onHover:f.hover},handlers:{Button:{[f.click]:e=>Nn(xn.Button,f.click,e),[f.hover]:e=>Nn(xn.Button,f.hover,e)}}};function Pn(e,t=!1){t?_t({url:A.tracesEndpoint,data:{traces:e},isJSON:!0,onError:A.onError}):yt((()=>{_t({url:A.tracesEndpoint,data:{traces:e},isJSON:!0,onError:A.onError})})),ut({metricName:"Batch Traces",data:e})}function Mn(){return Mn=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},Mn.apply(this,arguments)}const Bn=1e6;function Cn(e){return e*Bn}function Dn(e=function(){var e;return null==(e=window)?void 0:e.crypto}()){const t=new Uint32Array(2);return null==e||e.getRandomValues(t),((BigInt(t[0])<<BigInt(32))+BigInt(t[1])).toString()}function An(e,t){return{"x-datadog-origin":"rum","x-datadog-parent-id":t,"x-datadog-sampling-priority":"1","x-datadog-trace-id":e}}function Ln(e){var t;const{name:n,traceId:r,spanId:i,start:a,duration:o,resource:s,meta:c}=e;return{duration:o?Cn(o):0,name:n,resource:s,service:A.projectName,span_id:null!=i?i:Dn(),start:a?Cn(a):0,trace_id:null!=r?r:Dn(),parent_id:P,type:M,meta:Mn({platform:A.platform},re.pageKey?{page_key:re.pageKey}:{},null!=(t=Se.ujs)&&t.length?{last_ujs:Se.ujs[Se.ujs.length-1]}:{},null!=c?c:{})}}function Un(e){return[Ln(e)]}function Rn(e,t){Oe()&&function(e){return e.length>0}(e)&&(t&&function(e,t){e.forEach((e=>function(e,t){const n=Mn({},e.meta,t.meta),r={start:t.start?Cn(t.start):e.start,duration:t.duration?Cn(t.duration):e.duration};Object.assign(e,t,Mn({meta:n},r))}(e,t)))}(e,t),je.tracesQueue.push(e),wt(Pn)&&(Pn(je.tracesQueue),je.tracesQueue=[]))}function qn(e){var t=function(e,t){if("object"!=typeof e||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,"string");if("object"!=typeof r)return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==typeof t?t:String(t)}function Fn(){return Fn=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},Fn.apply(this,arguments)}function zn(){return void 0!==typeof window&&"performance"in window&&"mark"in performance&&"getEntriesByName"in performance}function Kn(e,t){return\`perf_\${e}\${null!=t&&t.label?\`_\${t.label}\`:""}\`}function $n(e,t,n){return\`\${Kn(e,n)}__\${t}\`}let Qn={};function Wn(e,t,n){if(!zn())return;const r=$n(e,t,n);if(performance.mark(r),"end"===t){const t=Kn(e,n);!function(e,t,n){try{performance.measure(e,t,n)}catch(e){A.onError(e)}}(t,$n(e,"start",n),r);const i=performance.getEntriesByName(t).pop();i&&Ht(Fn({metricName:e,metricType:d.distribution,value:i.duration},null!=n&&n.tags?{tags:n.tags}:{}))}}function Hn(e,t){if(!zn())return;const n=$n(e,"start",t);Qn[n]||(Wn(e,"start",t),Qn[n]=!0)}function Vn(e,t){const n=$n(e,"start",t),r=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(Qn,[n].map(qn));Qn=r}function Jn(e,t){if(!zn())return;const n=$n(e,"start",t);Qn[n]&&(Wn(e,"end",t),Vn(e,t))}function Xn(){zn()&&(performance.clearMarks(),Qn={})}var Gn=n(784);function Zn(){return Zn=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},Zn.apply(this,arguments)}function Yn(e,t,n=l.low){const r=(0,Gn.useRef)(t);return(0,Gn.useEffect)((()=>{r.current=t}),[t]),(0,Gn.useCallback)((t=>{$t(e,Zn({},r.current,t),n)}),[e,n])}function er(){return er=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},er.apply(this,arguments)}function tr(e,t,n=l.low){(0,Gn.useEffect)((()=>{const r=er({},t,{action:f.render});$t(e,r,n)}),[])}function nr(){return nr=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},nr.apply(this,arguments)}const rr=function(e,t){return{markStartPerf:(0,Gn.useCallback)((()=>Hn(e,t)),[e,t]),markEndPerf:(0,Gn.useCallback)((n=>Jn(e,nr({},t,n))),[e,t])}};function ir(){return ir=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},ir.apply(this,arguments)}function ar(){return Object.entries(ir({},Se,zt(),{sessionUUID:oe.sessionUUID,userId:oe.userId})).reduce(((e,t)=>{return null!=(n=t[1])&&""!==n?ir({},e,{[t[0]]:t[1]}):e;var n}),{})}async function or(){return new Promise((e=>{Mt(vt(je.eventsQueue)),Qt(bt(je.metricsQueue),!0),Pn(je.tracesQueue,!0),Ne({eventsQueue:[],metricsQueue:[],tracesQueue:[]}),e()}))}function sr(){return{"X-CB-Device-ID":H.deviceId||"unknown","X-CB-Is-Logged-In":H.userId?"true":"false","X-CB-Pagekey":re.pageKey||"unknown","X-CB-UJS":(e=Se.ujs,void 0===e||0===e.length?"":e.join(",")),"X-CB-Platform":A.platform||"unknown","X-CB-Project-Name":A.projectName||"unknown","X-CB-Session-UUID":oe.sessionUUID||"unknown","X-CB-Version-Name":A.version?String(A.version):"unknown"};var e}})(),r})()}));`;
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/telemetry/initCCA.js
var loadTelemetryScript = () => {
	return new Promise((resolve, reject) => {
		if (window.ClientAnalytics) return resolve();
		try {
			const script = document.createElement("script");
			script.textContent = TELEMETRY_SCRIPT_CONTENT;
			script.type = "text/javascript";
			document.head.appendChild(script);
			initCCA();
			document.head.removeChild(script);
			resolve();
		} catch (_a) {
			console.error("Failed to execute inlined telemetry script");
			reject();
		}
	});
};
var initCCA = () => {
	var _a, _b, _c;
	if (typeof window !== "undefined") {
		const deviceId = (_c = (_a = store.config.get().deviceId) !== null && _a !== void 0 ? _a : (_b = window.crypto) === null || _b === void 0 ? void 0 : _b.randomUUID()) !== null && _c !== void 0 ? _c : "";
		if (window.ClientAnalytics) {
			const { init, identify, PlatformName } = window.ClientAnalytics;
			init({
				isProd: true,
				amplitudeApiKey: "c66737ad47ec354ced777935b0af822e",
				platform: PlatformName.web,
				projectName: "base_account_sdk",
				showDebugLogging: false,
				version: "1.0.0",
				apiEndpoint: "https://cca-lite.coinbase.com"
			});
			identify({ deviceId });
			store.config.set({ deviceId });
		}
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/error/constants.js
var standardErrorCodes = {
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
		chainDisconnected: 4901,
		unsupportedChain: 4902
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
	},
	"4902": {
		standard: "EIP-3085",
		message: "Unrecognized chain ID."
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/error/utils.js
var FALLBACK_MESSAGE = "Unspecified error message.";
var JSON_RPC_SERVER_ERROR_MESSAGE = "Unspecified server error.";
/**
* Gets the message for a given code, or a fallback message if the code has
* no corresponding message.
*/
function getMessageFromCode(code, fallbackMessage = FALLBACK_MESSAGE) {
	if (code && Number.isInteger(code)) {
		const codeString = code.toString();
		if (hasKey(errorValues, codeString)) return errorValues[codeString].message;
		if (isJsonRpcServerError(code)) return JSON_RPC_SERVER_ERROR_MESSAGE;
	}
	return fallbackMessage;
}
/**
* Returns whether the given code is valid.
* A code is only valid if it has a message.
*/
function isValidCode(code) {
	if (!Number.isInteger(code)) return false;
	if (errorValues[code.toString()]) return true;
	if (isJsonRpcServerError(code)) return true;
	return false;
}
function serialize(error, { shouldIncludeStack = false } = {}) {
	const serialized = {};
	if (error && typeof error === "object" && !Array.isArray(error) && hasKey(error, "code") && isValidCode(error.code)) {
		const _error = error;
		serialized.code = _error.code;
		if (_error.message && typeof _error.message === "string") {
			serialized.message = _error.message;
			if (hasKey(_error, "data")) serialized.data = _error.data;
		} else {
			serialized.message = getMessageFromCode(serialized.code);
			serialized.data = { originalError: assignOriginalError(error) };
		}
	} else {
		serialized.code = standardErrorCodes.rpc.internal;
		serialized.message = hasStringProperty(error, "message") ? error.message : FALLBACK_MESSAGE;
		serialized.data = { originalError: assignOriginalError(error) };
	}
	if (shouldIncludeStack) serialized.stack = hasStringProperty(error, "stack") ? error.stack : void 0;
	return serialized;
}
function isJsonRpcServerError(code) {
	return code >= -32099 && code <= -32e3;
}
function assignOriginalError(error) {
	if (error && typeof error === "object" && !Array.isArray(error)) return Object.assign({}, error);
	return error;
}
function hasKey(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
}
function hasStringProperty(obj, prop) {
	return typeof obj === "object" && obj !== null && prop in obj && typeof obj[prop] === "string";
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/error/errors.js
var standardErrors = {
	rpc: {
		parse: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.parse, arg),
		invalidRequest: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.invalidRequest, arg),
		invalidParams: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.invalidParams, arg),
		methodNotFound: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.methodNotFound, arg),
		internal: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.internal, arg),
		server: (opts) => {
			if (!opts || typeof opts !== "object" || Array.isArray(opts)) throw new Error("Ethereum RPC Server errors must provide single object argument.");
			const { code } = opts;
			if (!Number.isInteger(code) || code > -32005 || code < -32099) throw new Error("\"code\" must be an integer such that: -32099 <= code <= -32005");
			return getEthJsonRpcError(code, opts);
		},
		invalidInput: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.invalidInput, arg),
		resourceNotFound: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.resourceNotFound, arg),
		resourceUnavailable: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.resourceUnavailable, arg),
		transactionRejected: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.transactionRejected, arg),
		methodNotSupported: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.methodNotSupported, arg),
		limitExceeded: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.limitExceeded, arg)
	},
	provider: {
		userRejectedRequest: (arg) => {
			return getEthProviderError(standardErrorCodes.provider.userRejectedRequest, arg);
		},
		unauthorized: (arg) => {
			return getEthProviderError(standardErrorCodes.provider.unauthorized, arg);
		},
		unsupportedMethod: (arg) => {
			return getEthProviderError(standardErrorCodes.provider.unsupportedMethod, arg);
		},
		disconnected: (arg) => {
			return getEthProviderError(standardErrorCodes.provider.disconnected, arg);
		},
		chainDisconnected: (arg) => {
			return getEthProviderError(standardErrorCodes.provider.chainDisconnected, arg);
		},
		unsupportedChain: (arg) => {
			return getEthProviderError(standardErrorCodes.provider.unsupportedChain, arg);
		},
		custom: (opts) => {
			if (!opts || typeof opts !== "object" || Array.isArray(opts)) throw new Error("Ethereum Provider custom errors must provide single object argument.");
			const { code, message, data } = opts;
			if (!message || typeof message !== "string") throw new Error("\"message\" must be a nonempty string");
			return new EthereumProviderError(code, message, data);
		}
	}
};
function getEthJsonRpcError(code, arg) {
	const [message, data] = parseOpts(arg);
	return new EthereumRpcError(code, message || getMessageFromCode(code), data);
}
function getEthProviderError(code, arg) {
	const [message, data] = parseOpts(arg);
	return new EthereumProviderError(code, message || getMessageFromCode(code), data);
}
function parseOpts(arg) {
	if (arg) {
		if (typeof arg === "string") return [arg];
		if (typeof arg === "object" && !Array.isArray(arg)) {
			const { message, data } = arg;
			if (message && typeof message !== "string") throw new Error("Must specify string message.");
			return [message || void 0, data];
		}
	}
	return [];
}
var EthereumRpcError = class extends Error {
	constructor(code, message, data) {
		if (!Number.isInteger(code)) throw new Error("\"code\" must be an integer.");
		if (!message || typeof message !== "string") throw new Error("\"message\" must be a nonempty string.");
		super(message);
		this.code = code;
		if (data !== void 0) this.data = data;
	}
};
var EthereumProviderError = class extends EthereumRpcError {
	/**
	* Create an Ethereum Provider JSON-RPC error.
	* `code` must be an integer in the 1000 <= 4999 range.
	*/
	constructor(code, message, data) {
		if (!isValidEthProviderCode(code)) throw new Error("\"code\" must be an integer such that: 1000 <= code <= 4999");
		super(code, message, data);
	}
};
function isValidEthProviderCode(code) {
	return Number.isInteger(code) && code >= 1e3 && code <= 4999;
}
function isActionableHttpRequestError(errorObject) {
	return typeof errorObject === "object" && errorObject !== null && "code" in errorObject && "data" in errorObject && errorObject.code === -32090 && typeof errorObject.data === "object" && errorObject.data !== null && "type" in errorObject.data && errorObject.data.type === "INSUFFICIENT_FUNDS";
}
function isViemError(error) {
	return typeof error === "object" && error !== null && "details" in error;
}
function viemHttpErrorToProviderError(error) {
	try {
		const details = JSON.parse(error.details);
		return new EthereumRpcError(details.code, details.message, details.data);
	} catch (_) {
		return null;
	}
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/type/index.js
init_hooks_module();
init_preact_module();
function OpaqueType() {
	return (value) => value;
}
var HexString = OpaqueType();
var BigIntString = OpaqueType();
function IntNumber(num) {
	return Math.floor(num);
}
OpaqueType();
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/type/util.js
var INT_STRING_REGEX = /^[0-9]*$/;
var HEXADECIMAL_STRING_REGEX = /^[a-f0-9]*$/;
/**
* @param length number of bytes
*/
function randomBytesHex(length) {
	return uint8ArrayToHex(crypto.getRandomValues(new Uint8Array(length)));
}
function uint8ArrayToHex(value) {
	return [...value].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function hexStringToUint8Array(hexString) {
	return new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => Number.parseInt(byte, 16)));
}
function hexStringFromBuffer(buf, includePrefix = false) {
	const hex = buf.toString("hex");
	return HexString(includePrefix ? `0x${hex}` : hex);
}
function encodeToHexString(str) {
	return hexStringFromBuffer(ensureBuffer(str), true);
}
function bigIntStringFromBigInt(bi) {
	return BigIntString(bi.toString(10));
}
function hexStringFromNumber(num) {
	return HexString(`0x${BigInt(num).toString(16)}`);
}
function has0xPrefix(str) {
	return str.startsWith("0x") || str.startsWith("0X");
}
function strip0x(hex) {
	if (has0xPrefix(hex)) return hex.slice(2);
	return hex;
}
function prepend0x(hex) {
	if (has0xPrefix(hex)) return `0x${hex.slice(2)}`;
	return `0x${hex}`;
}
function isHexString(hex) {
	if (typeof hex !== "string") return false;
	const s = strip0x(hex).toLowerCase();
	return HEXADECIMAL_STRING_REGEX.test(s);
}
function ensureHexString(hex, includePrefix = false) {
	if (typeof hex === "string") {
		const s = strip0x(hex).toLowerCase();
		if (HEXADECIMAL_STRING_REGEX.test(s)) return HexString(includePrefix ? `0x${s}` : s);
	}
	throw standardErrors.rpc.invalidParams(`"${String(hex)}" is not a hexadecimal string`);
}
function ensureEvenLengthHexString(hex, includePrefix = false) {
	let h = ensureHexString(hex, false);
	if (h.length % 2 === 1) h = HexString(`0${h}`);
	return includePrefix ? HexString(`0x${h}`) : h;
}
function ensureAddressString(str) {
	if (typeof str === "string") {
		const s = strip0x(str).toLowerCase();
		if (isHexString(s) && s.length === 40) return prepend0x(s);
	}
	throw standardErrors.rpc.invalidParams(`Invalid Ethereum address: ${String(str)}`);
}
function ensureBuffer(str) {
	if (Buffer.isBuffer(str)) return str;
	if (typeof str === "string") {
		if (isHexString(str)) {
			const s = ensureEvenLengthHexString(str, false);
			return Buffer.from(s, "hex");
		}
		return Buffer.from(str, "utf8");
	}
	throw standardErrors.rpc.invalidParams(`Not binary data: ${String(str)}`);
}
function ensureIntNumber(num) {
	if (typeof num === "number" && Number.isInteger(num)) return IntNumber(num);
	if (typeof num === "string") {
		if (INT_STRING_REGEX.test(num)) return IntNumber(Number(num));
		if (isHexString(num)) return IntNumber(Number(BigInt(ensureEvenLengthHexString(num, true))));
	}
	throw standardErrors.rpc.invalidParams(`Not an integer: ${String(num)}`);
}
function ensureBigInt(val) {
	if (val !== null && (typeof val === "bigint" || isBigNumber(val))) return BigInt(val.toString(10));
	if (typeof val === "number") return BigInt(ensureIntNumber(val));
	if (typeof val === "string") {
		if (INT_STRING_REGEX.test(val)) return BigInt(val);
		if (isHexString(val)) return BigInt(ensureEvenLengthHexString(val, true));
	}
	throw standardErrors.rpc.invalidParams(`Not an integer: ${String(val)}`);
}
function ensureParsedJSONObject(val) {
	if (typeof val === "string") return JSON.parse(val);
	if (typeof val === "object") return val;
	throw standardErrors.rpc.invalidParams(`Not a JSON string or an object: ${String(val)}`);
}
function isBigNumber(val) {
	if (val == null || typeof val.constructor !== "function") return false;
	const { constructor: constructor_ } = val;
	return typeof constructor_.config === "function" && typeof constructor_.EUCLID === "number";
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/util/checkCrossOriginOpenerPolicy.js
var COOP_ERROR_MESSAGE = `Coinbase Wallet SDK requires the Cross-Origin-Opener-Policy header to not be set to 'same-origin'. This is to ensure that the SDK can communicate with the Coinbase Smart Wallet app.

Please see https://www.smartwallet.dev/guides/tips/popup-tips#cross-origin-opener-policy for more information.`;
/**
* Creates a checker for the Cross-Origin-Opener-Policy (COOP).
*
* @returns An object with methods to get and check the Cross-Origin-Opener-Policy.
*
* @method getCrossOriginOpenerPolicy
* Retrieves current Cross-Origin-Opener-Policy.
* @throws Will throw an error if the policy has not been checked yet.
*
* @method checkCrossOriginOpenerPolicy
* Checks the Cross-Origin-Opener-Policy of the current environment.
* If in a non-browser environment, sets the policy to 'non-browser-env'.
* If in a browser environment, fetches the policy from the current origin.
* Logs an error if the policy is 'same-origin'.
*/
var createCoopChecker = () => {
	let crossOriginOpenerPolicy;
	return {
		getCrossOriginOpenerPolicy: () => {
			if (crossOriginOpenerPolicy === void 0) return "undefined";
			return crossOriginOpenerPolicy;
		},
		checkCrossOriginOpenerPolicy: async () => {
			if (typeof window === "undefined") {
				crossOriginOpenerPolicy = "non-browser-env";
				return;
			}
			try {
				const url = `${window.location.origin}${window.location.pathname}`;
				const response = await fetch(url, { method: "HEAD" });
				if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
				const result = response.headers.get("Cross-Origin-Opener-Policy");
				crossOriginOpenerPolicy = result !== null && result !== void 0 ? result : "null";
				if (crossOriginOpenerPolicy === "same-origin") console.error(COOP_ERROR_MESSAGE);
			} catch (error) {
				console.error("Error checking Cross-Origin-Opener-Policy:", error.message);
				crossOriginOpenerPolicy = "error";
			}
		}
	};
};
var { checkCrossOriginOpenerPolicy, getCrossOriginOpenerPolicy } = createCoopChecker();
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/util/provider.js
async function fetchRPCRequest(request, rpcUrl) {
	const requestBody = Object.assign(Object.assign({}, request), {
		jsonrpc: "2.0",
		id: crypto.randomUUID()
	});
	const { result, error } = await (await window.fetch(rpcUrl, {
		method: "POST",
		body: JSON.stringify(requestBody),
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
			"X-Cbw-Sdk-Version": VERSION,
			"X-Cbw-Sdk-Platform": NAME
		}
	})).json();
	if (error) throw error;
	return result;
}
function getCoinbaseInjectedLegacyProvider() {
	return globalThis.coinbaseWalletExtension;
}
function getInjectedEthereum() {
	var _a, _b;
	try {
		const window = globalThis;
		return (_a = window.ethereum) !== null && _a !== void 0 ? _a : (_b = window.top) === null || _b === void 0 ? void 0 : _b.ethereum;
	} catch (_c) {
		return;
	}
}
function getCoinbaseInjectedProvider({ metadata, preference }) {
	var _a, _b;
	const { appName, appLogoUrl, appChainIds } = metadata;
	if (preference.options !== "smartWalletOnly") {
		const extension = getCoinbaseInjectedLegacyProvider();
		if (extension) {
			(_a = extension.setAppInfo) === null || _a === void 0 || _a.call(extension, appName, appLogoUrl, appChainIds, preference);
			return extension;
		}
	}
	const ethereum = getInjectedEthereum();
	if (ethereum === null || ethereum === void 0 ? void 0 : ethereum.isCoinbaseBrowser) {
		(_b = ethereum.setAppInfo) === null || _b === void 0 || _b.call(ethereum, appName, appLogoUrl, appChainIds, preference);
		return ethereum;
	}
}
/**
* Validates the arguments for an invalid request and returns an error if any validation fails.
* Valid request args are defined here: https://eips.ethereum.org/EIPS/eip-1193#request
* @param args The request arguments to validate.
* @returns An error object if the arguments are invalid, otherwise undefined.
*/
function checkErrorForInvalidRequestArgs(args) {
	if (!args || typeof args !== "object" || Array.isArray(args)) throw standardErrors.rpc.invalidParams({
		message: "Expected a single, non-array, object argument.",
		data: args
	});
	const { method, params } = args;
	if (typeof method !== "string" || method.length === 0) throw standardErrors.rpc.invalidParams({
		message: "'args.method' must be a non-empty string.",
		data: args
	});
	if (params !== void 0 && !Array.isArray(params) && (typeof params !== "object" || params === null)) throw standardErrors.rpc.invalidParams({
		message: "'args.params' must be an object or array if provided.",
		data: args
	});
	switch (method) {
		case "eth_sign":
		case "eth_signTypedData_v2":
		case "eth_subscribe":
		case "eth_unsubscribe": throw standardErrors.provider.unsupportedMethod();
	}
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/util/validatePreferences.js
/**
* Validates user supplied preferences. Throws if keys are not valid.
* @param preference
*/
function validatePreferences(preference) {
	if (!preference) return;
	if (![
		"all",
		"smartWalletOnly",
		"eoaOnly"
	].includes(preference.options)) throw new Error(`Invalid options: ${preference.options}`);
	if (preference.attribution) {
		if (preference.attribution.auto !== void 0 && preference.attribution.dataSuffix !== void 0) throw new Error(`Attribution cannot contain both auto and dataSuffix properties`);
	}
	if (preference.telemetry) {
		if (typeof preference.telemetry !== "boolean") throw new Error(`Telemetry must be a boolean`);
	}
}
/**
* Validates user supplied toSubAccountSigner function. Throws if keys are not valid.
* @param toAccount
*/
function validateSubAccount(toAccount) {
	if (typeof toAccount !== "function") throw new Error(`toAccount is not a function`);
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/constants.js
var CB_KEYS_URL = "https://keys.coinbase.com/connect";
var CB_WALLET_RPC_URL = "https://rpc.wallet.coinbase.com";
var WALLETLINK_URL = "https://www.walletlink.org";
var CBW_MOBILE_DEEPLINK_URL = "https://go.cb-w.com/walletlink";
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/telemetry/logEvent.js
var ComponentType;
(function(ComponentType) {
	ComponentType["unknown"] = "unknown";
	ComponentType["banner"] = "banner";
	ComponentType["button"] = "button";
	ComponentType["card"] = "card";
	ComponentType["chart"] = "chart";
	ComponentType["content_script"] = "content_script";
	ComponentType["dropdown"] = "dropdown";
	ComponentType["link"] = "link";
	ComponentType["page"] = "page";
	ComponentType["modal"] = "modal";
	ComponentType["table"] = "table";
	ComponentType["search_bar"] = "search_bar";
	ComponentType["service_worker"] = "service_worker";
	ComponentType["text"] = "text";
	ComponentType["text_input"] = "text_input";
	ComponentType["tray"] = "tray";
	ComponentType["checkbox"] = "checkbox";
	ComponentType["icon"] = "icon";
})(ComponentType || (ComponentType = {}));
var ActionType;
(function(ActionType) {
	ActionType["unknown"] = "unknown";
	ActionType["blur"] = "blur";
	ActionType["click"] = "click";
	ActionType["change"] = "change";
	ActionType["dismiss"] = "dismiss";
	ActionType["focus"] = "focus";
	ActionType["hover"] = "hover";
	ActionType["select"] = "select";
	ActionType["measurement"] = "measurement";
	ActionType["move"] = "move";
	ActionType["process"] = "process";
	ActionType["render"] = "render";
	ActionType["scroll"] = "scroll";
	ActionType["view"] = "view";
	ActionType["search"] = "search";
	ActionType["keyPress"] = "keyPress";
	ActionType["error"] = "error";
})(ActionType || (ActionType = {}));
var AnalyticsEventImportance;
(function(AnalyticsEventImportance) {
	AnalyticsEventImportance["low"] = "low";
	AnalyticsEventImportance["high"] = "high";
})(AnalyticsEventImportance || (AnalyticsEventImportance = {}));
function logEvent(name, event, importance) {
	var _a, _b, _c, _d;
	if (window.ClientAnalytics) (_a = window.ClientAnalytics) === null || _a === void 0 || _a.logEvent(name, Object.assign(Object.assign({}, event), {
		sdkVersion: "4.3.6",
		appName: (_c = (_b = store.config.get().metadata) === null || _b === void 0 ? void 0 : _b.appName) !== null && _c !== void 0 ? _c : "",
		appOrigin: window.location.origin,
		appPreferredSigner: (_d = store.config.get().preference) === null || _d === void 0 ? void 0 : _d.options
	}), importance);
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/telemetry/events/communicator.js
var logPopupSetupStarted = () => {
	logEvent("communicator.popup_setup.started", {
		action: ActionType.unknown,
		componentType: ComponentType.unknown
	}, AnalyticsEventImportance.high);
};
var logPopupSetupCompleted = () => {
	logEvent("communicator.popup_setup.completed", {
		action: ActionType.unknown,
		componentType: ComponentType.unknown
	}, AnalyticsEventImportance.high);
};
var logPopupUnloadReceived = () => {
	logEvent("communicator.popup_unload.received", {
		action: ActionType.unknown,
		componentType: ComponentType.unknown
	}, AnalyticsEventImportance.high);
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/telemetry/events/snackbar.js
var logSnackbarShown = ({ snackbarContext }) => {
	logEvent(`snackbar.${snackbarContext}.shown`, {
		action: ActionType.render,
		componentType: ComponentType.modal,
		snackbarContext
	}, AnalyticsEventImportance.high);
};
var logSnackbarActionClicked = ({ snackbarContext, snackbarAction }) => {
	logEvent(`snackbar.${snackbarContext}.action_clicked`, {
		action: ActionType.click,
		componentType: ComponentType.button,
		snackbarContext,
		snackbarAction
	}, AnalyticsEventImportance.high);
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/components/cssReset/cssReset-css.js
var cssReset_css_default = `@namespace svg "http://www.w3.org/2000/svg";.-cbwsdk-css-reset,.-cbwsdk-css-reset *{animation:none;animation-delay:0;animation-direction:normal;animation-duration:0;animation-fill-mode:none;animation-iteration-count:1;animation-name:none;animation-play-state:running;animation-timing-function:ease;backface-visibility:visible;background:0;background-attachment:scroll;background-clip:border-box;background-color:rgba(0,0,0,0);background-image:none;background-origin:padding-box;background-position:0 0;background-position-x:0;background-position-y:0;background-repeat:repeat;background-size:auto auto;border:0;border-style:none;border-width:medium;border-color:inherit;border-bottom:0;border-bottom-color:inherit;border-bottom-left-radius:0;border-bottom-right-radius:0;border-bottom-style:none;border-bottom-width:medium;border-collapse:separate;border-image:none;border-left:0;border-left-color:inherit;border-left-style:none;border-left-width:medium;border-radius:0;border-right:0;border-right-color:inherit;border-right-style:none;border-right-width:medium;border-spacing:0;border-top:0;border-top-color:inherit;border-top-left-radius:0;border-top-right-radius:0;border-top-style:none;border-top-width:medium;box-shadow:none;box-sizing:border-box;caption-side:top;clear:none;clip:auto;color:inherit;columns:auto;column-count:auto;column-fill:balance;column-gap:normal;column-rule:medium none currentColor;column-rule-color:currentColor;column-rule-style:none;column-rule-width:none;column-span:1;column-width:auto;counter-increment:none;counter-reset:none;direction:ltr;empty-cells:show;float:none;font:normal;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif;font-size:medium;font-style:normal;font-variant:normal;font-weight:normal;height:auto;hyphens:none;letter-spacing:normal;line-height:normal;list-style:none;list-style-image:none;list-style-position:outside;list-style-type:disc;margin:0;margin-bottom:0;margin-left:0;margin-right:0;margin-top:0;opacity:1;orphans:0;outline:0;outline-color:invert;outline-style:none;outline-width:medium;overflow:visible;overflow-x:visible;overflow-y:visible;padding:0;padding-bottom:0;padding-left:0;padding-right:0;padding-top:0;page-break-after:auto;page-break-before:auto;page-break-inside:auto;perspective:none;perspective-origin:50% 50%;pointer-events:auto;position:static;quotes:"\\201C" "\\201D" "\\2018" "\\2019";tab-size:8;table-layout:auto;text-align:inherit;text-align-last:auto;text-decoration:none;text-decoration-color:inherit;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-shadow:none;text-transform:none;transform:none;transform-style:flat;transition:none;transition-delay:0s;transition-duration:0s;transition-property:none;transition-timing-function:ease;unicode-bidi:normal;vertical-align:baseline;visibility:visible;white-space:normal;widows:0;word-spacing:normal;z-index:auto}.-cbwsdk-css-reset strong{font-weight:bold}.-cbwsdk-css-reset *{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif;line-height:1}.-cbwsdk-css-reset [class*=container]{margin:0;padding:0}.-cbwsdk-css-reset style{display:none}`;
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/components/cssReset/cssReset.js
function injectCssReset() {
	const styleEl = document.createElement("style");
	styleEl.type = "text/css";
	styleEl.appendChild(document.createTextNode(cssReset_css_default));
	document.documentElement.appendChild(styleEl);
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/clsx/dist/clsx.m.js
function r(e) {
	var t, f, n = "";
	if ("string" == typeof e || "number" == typeof e) n += e;
	else if ("object" == typeof e) if (Array.isArray(e)) for (t = 0; t < e.length; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
	else for (t in e) e[t] && (n && (n += " "), n += t);
	return n;
}
function clsx() {
	for (var e, t, f = 0, n = ""; f < arguments.length;) (e = arguments[f++]) && (t = r(e)) && (n && (n += " "), n += t);
	return n;
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/components/util.js
function isInIFrame() {
	try {
		return window.frameElement !== null;
	} catch (_) {
		return false;
	}
}
function getLocation() {
	try {
		if (isInIFrame() && window.top) return window.top.location;
		return window.location;
	} catch (_) {
		return window.location;
	}
}
function isMobileWeb() {
	var _a;
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test((_a = window === null || window === void 0 ? void 0 : window.navigator) === null || _a === void 0 ? void 0 : _a.userAgent);
}
function isDarkMode() {
	var _a, _b;
	return (_b = (_a = window === null || window === void 0 ? void 0 : window.matchMedia) === null || _a === void 0 ? void 0 : _a.call(window, "(prefers-color-scheme: dark)").matches) !== null && _b !== void 0 ? _b : false;
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/components/Snackbar/Snackbar-css.js
var Snackbar_css_default = `.-cbwsdk-css-reset .-gear-container{margin-left:16px !important;margin-right:9px !important;display:flex;align-items:center;justify-content:center;width:24px;height:24px;transition:opacity .25s}.-cbwsdk-css-reset .-gear-container *{user-select:none}.-cbwsdk-css-reset .-gear-container svg{opacity:0;position:absolute}.-cbwsdk-css-reset .-gear-icon{height:12px;width:12px;z-index:10000}.-cbwsdk-css-reset .-cbwsdk-snackbar{align-items:flex-end;display:flex;flex-direction:column;position:fixed;right:0;top:0;z-index:2147483647}.-cbwsdk-css-reset .-cbwsdk-snackbar *{user-select:none}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance{display:flex;flex-direction:column;margin:8px 16px 0 16px;overflow:visible;text-align:left;transform:translateX(0);transition:opacity .25s,transform .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-header:hover .-gear-container svg{opacity:1}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-header{display:flex;align-items:center;background:#fff;overflow:hidden;border:1px solid #e7ebee;box-sizing:border-box;border-radius:8px;cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-header-cblogo{margin:8px 8px 8px 8px}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-header *{cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-header-message{color:#000;font-size:13px;line-height:1.5;user-select:none}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu{background:#fff;transition:opacity .25s ease-in-out,transform .25s linear,visibility 0s;visibility:hidden;border:1px solid #e7ebee;box-sizing:border-box;border-radius:8px;opacity:0;flex-direction:column;padding-left:8px;padding-right:8px}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item:last-child{margin-bottom:8px !important}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item:hover{background:#f5f7f8;border-radius:6px;transition:background .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item:hover span{color:#050f19;transition:color .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item:hover svg path{fill:#000;transition:fill .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item{visibility:inherit;height:35px;margin-top:8px;margin-bottom:0;display:flex;flex-direction:row;align-items:center;padding:8px;cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item *{visibility:inherit;cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item-is-red:hover{background:rgba(223,95,103,.2);transition:background .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item-is-red:hover *{cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item-is-red:hover svg path{fill:#df5f67;transition:fill .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item-is-red:hover span{color:#df5f67;transition:color .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item-info{color:#aaa;font-size:13px;margin:0 8px 0 32px;position:absolute}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-hidden{opacity:0;text-align:left;transform:translateX(25%);transition:opacity .5s linear}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-expanded .-cbwsdk-snackbar-instance-menu{opacity:1;display:flex;transform:translateY(8px);visibility:visible}`;
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/components/Snackbar/Snackbar.js
var cblogo = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEuNDkyIDEwLjQxOWE4LjkzIDguOTMgMCAwMTguOTMtOC45M2gxMS4xNjNhOC45MyA4LjkzIDAgMDE4LjkzIDguOTN2MTEuMTYzYTguOTMgOC45MyAwIDAxLTguOTMgOC45M0gxMC40MjJhOC45MyA4LjkzIDAgMDEtOC45My04LjkzVjEwLjQxOXoiIGZpbGw9IiMxNjUyRjAiLz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEwLjQxOSAwSDIxLjU4QzI3LjMzNSAwIDMyIDQuNjY1IDMyIDEwLjQxOVYyMS41OEMzMiAyNy4zMzUgMjcuMzM1IDMyIDIxLjU4MSAzMkgxMC40MkM0LjY2NSAzMiAwIDI3LjMzNSAwIDIxLjU4MVYxMC40MkMwIDQuNjY1IDQuNjY1IDAgMTAuNDE5IDB6bTAgMS40ODhhOC45MyA4LjkzIDAgMDAtOC45MyA4LjkzdjExLjE2M2E4LjkzIDguOTMgMCAwMDguOTMgOC45M0gyMS41OGE4LjkzIDguOTMgMCAwMDguOTMtOC45M1YxMC40MmE4LjkzIDguOTMgMCAwMC04LjkzLTguOTNIMTAuNDJ6IiBmaWxsPSIjZmZmIi8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNS45OTggMjYuMDQ5Yy01LjU0OSAwLTEwLjA0Ny00LjQ5OC0xMC4wNDctMTAuMDQ3IDAtNS41NDggNC40OTgtMTAuMDQ2IDEwLjA0Ny0xMC4wNDYgNS41NDggMCAxMC4wNDYgNC40OTggMTAuMDQ2IDEwLjA0NiAwIDUuNTQ5LTQuNDk4IDEwLjA0Ny0xMC4wNDYgMTAuMDQ3eiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0xMi43NjIgMTQuMjU0YzAtLjgyMi42NjctMS40ODkgMS40ODktMS40ODloMy40OTdjLjgyMiAwIDEuNDg4LjY2NiAxLjQ4OCAxLjQ4OXYzLjQ5N2MwIC44MjItLjY2NiAxLjQ4OC0xLjQ4OCAxLjQ4OGgtMy40OTdhMS40ODggMS40ODggMCAwMS0xLjQ4OS0xLjQ4OHYtMy40OTh6IiBmaWxsPSIjMTY1MkYwIi8+PC9zdmc+`;
var gearIcon = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDYuNzV2LTEuNWwtMS43Mi0uNTdjLS4wOC0uMjctLjE5LS41Mi0uMzItLjc3bC44MS0xLjYyLTEuMDYtMS4wNi0xLjYyLjgxYy0uMjQtLjEzLS41LS4yNC0uNzctLjMyTDYuNzUgMGgtMS41bC0uNTcgMS43MmMtLjI3LjA4LS41My4xOS0uNzcuMzJsLTEuNjItLjgxLTEuMDYgMS4wNi44MSAxLjYyYy0uMTMuMjQtLjI0LjUtLjMyLjc3TDAgNS4yNXYxLjVsMS43Mi41N2MuMDguMjcuMTkuNTMuMzIuNzdsLS44MSAxLjYyIDEuMDYgMS4wNiAxLjYyLS44MWMuMjQuMTMuNS4yMy43Ny4zMkw1LjI1IDEyaDEuNWwuNTctMS43MmMuMjctLjA4LjUyLS4xOS43Ny0uMzJsMS42Mi44MSAxLjA2LTEuMDYtLjgxLTEuNjJjLjEzLS4yNC4yMy0uNS4zMi0uNzdMMTIgNi43NXpNNiA4LjVhMi41IDIuNSAwIDAxMC01IDIuNSAyLjUgMCAwMTAgNXoiIGZpbGw9IiMwNTBGMTkiLz48L3N2Zz4=`;
var Snackbar = class {
	constructor() {
		this.items = /* @__PURE__ */ new Map();
		this.nextItemKey = 0;
		this.root = null;
		this.darkMode = isDarkMode();
	}
	attach(el) {
		this.root = document.createElement("div");
		this.root.className = "-cbwsdk-snackbar-root";
		el.appendChild(this.root);
		this.render();
	}
	presentItem(itemProps) {
		const key = this.nextItemKey++;
		this.items.set(key, itemProps);
		this.render();
		return () => {
			this.items.delete(key);
			this.render();
		};
	}
	clear() {
		this.items.clear();
		this.render();
	}
	render() {
		if (!this.root) return;
		B(_("div", null, _(SnackbarContainer, { darkMode: this.darkMode }, Array.from(this.items.entries()).map(([key, itemProps]) => _(SnackbarInstance, Object.assign({}, itemProps, { key }))))), this.root);
	}
};
var SnackbarContainer = (props) => _("div", { class: clsx("-cbwsdk-snackbar-container") }, _("style", null, Snackbar_css_default), _("div", { class: "-cbwsdk-snackbar" }, props.children));
var SnackbarInstance = ({ autoExpand, message, menuItems }) => {
	const [hidden, setHidden] = h(true);
	const [expanded, setExpanded] = h(autoExpand !== null && autoExpand !== void 0 ? autoExpand : false);
	y(() => {
		const timers = [window.setTimeout(() => {
			setHidden(false);
		}, 1), window.setTimeout(() => {
			setExpanded(true);
		}, 1e4)];
		return () => {
			timers.forEach(window.clearTimeout);
		};
	});
	const toggleExpanded = () => {
		setExpanded(!expanded);
	};
	return _("div", { class: clsx("-cbwsdk-snackbar-instance", hidden && "-cbwsdk-snackbar-instance-hidden", expanded && "-cbwsdk-snackbar-instance-expanded") }, _("div", {
		class: "-cbwsdk-snackbar-instance-header",
		onClick: toggleExpanded
	}, _("img", {
		src: cblogo,
		class: "-cbwsdk-snackbar-instance-header-cblogo"
	}), " ", _("div", { class: "-cbwsdk-snackbar-instance-header-message" }, message), _("div", { class: "-gear-container" }, !expanded && _("svg", {
		width: "24",
		height: "24",
		viewBox: "0 0 24 24",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg"
	}, _("circle", {
		cx: "12",
		cy: "12",
		r: "12",
		fill: "#F5F7F8"
	})), _("img", {
		src: gearIcon,
		class: "-gear-icon",
		title: "Expand"
	}))), menuItems && menuItems.length > 0 && _("div", { class: "-cbwsdk-snackbar-instance-menu" }, menuItems.map((action, i) => _("div", {
		class: clsx("-cbwsdk-snackbar-instance-menu-item", action.isRed && "-cbwsdk-snackbar-instance-menu-item-is-red"),
		onClick: action.onClick,
		key: i
	}, _("svg", {
		width: action.svgWidth,
		height: action.svgHeight,
		viewBox: "0 0 10 11",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg"
	}, _("path", {
		"fill-rule": action.defaultFillRule,
		"clip-rule": action.defaultClipRule,
		d: action.path,
		fill: "#AAAAAA"
	})), _("span", { class: clsx("-cbwsdk-snackbar-instance-menu-item-info", action.isRed && "-cbwsdk-snackbar-instance-menu-item-info-is-red") }, action.info)))));
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/WalletLinkRelayUI.js
var RETRY_SVG_PATH = "M5.00008 0.96875C6.73133 0.96875 8.23758 1.94375 9.00008 3.375L10.0001 2.375V5.5H9.53133H7.96883H6.87508L7.80633 4.56875C7.41258 3.3875 6.31258 2.53125 5.00008 2.53125C3.76258 2.53125 2.70633 3.2875 2.25633 4.36875L0.812576 3.76875C1.50008 2.125 3.11258 0.96875 5.00008 0.96875ZM2.19375 6.43125C2.5875 7.6125 3.6875 8.46875 5 8.46875C6.2375 8.46875 7.29375 7.7125 7.74375 6.63125L9.1875 7.23125C8.5 8.875 6.8875 10.0312 5 10.0312C3.26875 10.0312 1.7625 9.05625 1 7.625L0 8.625V5.5H0.46875H2.03125H3.125L2.19375 6.43125Z";
var WalletLinkRelayUI = class {
	constructor() {
		this.attached = false;
		this.snackbar = new Snackbar();
	}
	attach() {
		if (this.attached) throw new Error("Coinbase Wallet SDK UI is already attached");
		const el = document.documentElement;
		const container = document.createElement("div");
		container.className = "-cbwsdk-css-reset";
		el.appendChild(container);
		this.snackbar.attach(container);
		this.attached = true;
		injectCssReset();
	}
	showConnecting(options) {
		let snackbarProps;
		if (options.isUnlinkedErrorState) snackbarProps = {
			autoExpand: true,
			message: "Connection lost",
			menuItems: [{
				isRed: false,
				info: "Reset connection",
				svgWidth: "10",
				svgHeight: "11",
				path: "M5.00008 0.96875C6.73133 0.96875 8.23758 1.94375 9.00008 3.375L10.0001 2.375V5.5H9.53133H7.96883H6.87508L7.80633 4.56875C7.41258 3.3875 6.31258 2.53125 5.00008 2.53125C3.76258 2.53125 2.70633 3.2875 2.25633 4.36875L0.812576 3.76875C1.50008 2.125 3.11258 0.96875 5.00008 0.96875ZM2.19375 6.43125C2.5875 7.6125 3.6875 8.46875 5 8.46875C6.2375 8.46875 7.29375 7.7125 7.74375 6.63125L9.1875 7.23125C8.5 8.875 6.8875 10.0312 5 10.0312C3.26875 10.0312 1.7625 9.05625 1 7.625L0 8.625V5.5H0.46875H2.03125H3.125L2.19375 6.43125Z",
				defaultFillRule: "evenodd",
				defaultClipRule: "evenodd",
				onClick: options.onResetConnection
			}]
		};
		else snackbarProps = {
			message: "Confirm on phone",
			menuItems: [{
				isRed: true,
				info: "Cancel transaction",
				svgWidth: "11",
				svgHeight: "11",
				path: "M10.3711 1.52346L9.21775 0.370117L5.37109 4.21022L1.52444 0.370117L0.371094 1.52346L4.2112 5.37012L0.371094 9.21677L1.52444 10.3701L5.37109 6.53001L9.21775 10.3701L10.3711 9.21677L6.53099 5.37012L10.3711 1.52346Z",
				defaultFillRule: "inherit",
				defaultClipRule: "inherit",
				onClick: options.onCancel
			}, {
				isRed: false,
				info: "Reset connection",
				svgWidth: "10",
				svgHeight: "11",
				path: RETRY_SVG_PATH,
				defaultFillRule: "evenodd",
				defaultClipRule: "evenodd",
				onClick: options.onResetConnection
			}]
		};
		return this.snackbar.presentItem(snackbarProps);
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/util/web.js
var POPUP_WIDTH = 420;
var POPUP_HEIGHT = 700;
var RETRY_BUTTON = {
	isRed: false,
	info: "Retry",
	svgWidth: "10",
	svgHeight: "11",
	path: RETRY_SVG_PATH,
	defaultFillRule: "evenodd",
	defaultClipRule: "evenodd"
};
var POPUP_BLOCKED_MESSAGE = "Popup was blocked. Try again.";
var snackbar = null;
function openPopup(url) {
	const left = (window.innerWidth - POPUP_WIDTH) / 2 + window.screenX;
	const top = (window.innerHeight - POPUP_HEIGHT) / 2 + window.screenY;
	appendAppInfoQueryParams(url);
	function tryOpenPopup() {
		const popupId = `wallet_${crypto.randomUUID()}`;
		const popup = window.open(url, popupId, `width=${POPUP_WIDTH}, height=${POPUP_HEIGHT}, left=${left}, top=${top}`);
		popup === null || popup === void 0 || popup.focus();
		if (!popup) return null;
		return popup;
	}
	let popup = tryOpenPopup();
	if (!popup) {
		const sb = initSnackbar();
		return new Promise((resolve, reject) => {
			logSnackbarShown({ snackbarContext: "popup_blocked" });
			sb.presentItem({
				autoExpand: true,
				message: POPUP_BLOCKED_MESSAGE,
				menuItems: [Object.assign(Object.assign({}, RETRY_BUTTON), { onClick: () => {
					logSnackbarActionClicked({
						snackbarContext: "popup_blocked",
						snackbarAction: "confirm"
					});
					popup = tryOpenPopup();
					if (popup) resolve(popup);
					else reject(standardErrors.rpc.internal("Popup window was blocked"));
					sb.clear();
				} })]
			});
		});
	}
	return Promise.resolve(popup);
}
function closePopup(popup) {
	if (popup && !popup.closed) popup.close();
}
function appendAppInfoQueryParams(url) {
	const params = {
		sdkName: NAME,
		sdkVersion: VERSION,
		origin: window.location.origin,
		coop: getCrossOriginOpenerPolicy()
	};
	for (const [key, value] of Object.entries(params)) if (!url.searchParams.has(key)) url.searchParams.append(key, value.toString());
}
function initSnackbar() {
	if (!snackbar) {
		const root = document.createElement("div");
		root.className = "-cbwsdk-css-reset";
		document.body.appendChild(root);
		snackbar = new Snackbar();
		snackbar.attach(root);
	}
	return snackbar;
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/communicator/Communicator.js
/**
* Communicates with a popup window for Coinbase keys.coinbase.com (or another url)
* to send and receive messages.
*
* This class is responsible for opening a popup window, posting messages to it,
* and listening for responses.
*
* It also handles cleanup of event listeners and the popup window itself when necessary.
*/
var Communicator = class {
	constructor({ url = CB_KEYS_URL, metadata, preference }) {
		this.popup = null;
		this.listeners = /* @__PURE__ */ new Map();
		/**
		* Posts a message to the popup window
		*/
		this.postMessage = async (message) => {
			(await this.waitForPopupLoaded()).postMessage(message, this.url.origin);
		};
		/**
		* Posts a request to the popup window and waits for a response
		*/
		this.postRequestAndWaitForResponse = async (request) => {
			const responsePromise = this.onMessage(({ requestId }) => requestId === request.id);
			this.postMessage(request);
			return await responsePromise;
		};
		/**
		* Listens for messages from the popup window that match a given predicate.
		*/
		this.onMessage = async (predicate) => {
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
		/**
		* Closes the popup, rejects all requests and clears the listeners
		*/
		this.disconnect = () => {
			closePopup(this.popup);
			this.popup = null;
			this.listeners.forEach(({ reject }, listener) => {
				reject(standardErrors.provider.userRejectedRequest("Request rejected"));
				window.removeEventListener("message", listener);
			});
			this.listeners.clear();
		};
		/**
		* Waits for the popup window to fully load and then sends a version message.
		*/
		this.waitForPopupLoaded = async () => {
			if (this.popup && !this.popup.closed) {
				this.popup.focus();
				return this.popup;
			}
			logPopupSetupStarted();
			this.popup = await openPopup(this.url);
			this.onMessage(({ event }) => event === "PopupUnload").then(() => {
				this.disconnect();
				logPopupUnloadReceived();
			}).catch(() => {});
			return this.onMessage(({ event }) => event === "PopupLoaded").then((message) => {
				this.postMessage({
					requestId: message.id,
					data: {
						version: VERSION,
						metadata: this.metadata,
						preference: this.preference,
						location: window.location.toString()
					}
				});
			}).then(() => {
				if (!this.popup) throw standardErrors.rpc.internal();
				logPopupSetupCompleted();
				return this.popup;
			});
		};
		this.url = new URL(url);
		this.metadata = metadata;
		this.preference = preference;
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/type/Web3Response.js
function isErrorResponse(response) {
	return response.errorMessage !== void 0;
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/error/serialize.js
/**
* Serializes an error to a format that is compatible with the Ethereum JSON RPC error format.
* See https://docs.cloud.coinbase.com/wallet-sdk/docs/errors
* for more information.
*/
function serializeError(error) {
	const serialized = serialize(getErrorObject(error), { shouldIncludeStack: true });
	const docUrl = new URL("https://docs.cloud.coinbase.com/wallet-sdk/docs/errors");
	docUrl.searchParams.set("version", VERSION);
	docUrl.searchParams.set("code", serialized.code.toString());
	docUrl.searchParams.set("message", serialized.message);
	return Object.assign(Object.assign({}, serialized), { docUrl: docUrl.href });
}
/**
* Converts an error to a serializable object.
*/
function getErrorObject(error) {
	var _a;
	if (typeof error === "string") return {
		message: error,
		code: standardErrorCodes.rpc.internal
	};
	if (isErrorResponse(error)) {
		const message = error.errorMessage;
		const code = (_a = error.errorCode) !== null && _a !== void 0 ? _a : message.match(/(denied|rejected)/i) ? standardErrorCodes.provider.userRejectedRequest : void 0;
		return Object.assign(Object.assign({}, error), {
			message,
			code,
			data: { method: error.method }
		});
	}
	return error;
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/provider/interface.js
var ProviderEventEmitter = class extends import_eventemitter3.default {};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/storage/ScopedLocalStorage.js
var ScopedLocalStorage = class ScopedLocalStorage {
	constructor(scope, module) {
		this.scope = scope;
		this.module = module;
	}
	storeObject(key, item) {
		this.setItem(key, JSON.stringify(item));
	}
	loadObject(key) {
		const item = this.getItem(key);
		return item ? JSON.parse(item) : void 0;
	}
	setItem(key, value) {
		localStorage.setItem(this.scopedKey(key), value);
	}
	getItem(key) {
		return localStorage.getItem(this.scopedKey(key));
	}
	removeItem(key) {
		localStorage.removeItem(this.scopedKey(key));
	}
	clear() {
		const prefix = this.scopedKey("");
		const keysToRemove = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (typeof key === "string" && key.startsWith(prefix)) keysToRemove.push(key);
		}
		keysToRemove.forEach((key) => localStorage.removeItem(key));
	}
	scopedKey(key) {
		return `-${this.scope}${this.module ? `:${this.module}` : ""}:${key}`;
	}
	static clearAll() {
		new ScopedLocalStorage("CBWSDK").clear();
		new ScopedLocalStorage("walletlink").clear();
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/telemetry/events/provider.js
var logSignerLoadedFromStorage = ({ signerType }) => {
	logEvent("provider.signer.loaded_from_storage", {
		action: ActionType.measurement,
		componentType: ComponentType.unknown,
		signerType
	}, AnalyticsEventImportance.low);
};
var logRequestStarted$2 = ({ method, correlationId }) => {
	logEvent("provider.request.started", {
		action: ActionType.unknown,
		componentType: ComponentType.unknown,
		method,
		correlationId
	}, AnalyticsEventImportance.high);
};
var logRequestError$2 = ({ method, correlationId, signerType, errorMessage }) => {
	logEvent("provider.request.error", {
		action: ActionType.error,
		componentType: ComponentType.unknown,
		method,
		signerType,
		correlationId,
		errorMessage
	}, AnalyticsEventImportance.high);
};
var logRequestResponded = ({ method, signerType, correlationId }) => {
	logEvent("provider.request.responded", {
		action: ActionType.unknown,
		componentType: ComponentType.unknown,
		method,
		signerType,
		correlationId
	}, AnalyticsEventImportance.high);
};
var logEnableFunctionCalled = () => {
	logEvent("provider.enable_function.called", {
		action: ActionType.measurement,
		componentType: ComponentType.unknown
	}, AnalyticsEventImportance.high);
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/telemetry/events/signer-selection.js
var logSignerSelectionRequested = () => {
	logEvent("signer.selection.requested", {
		action: ActionType.unknown,
		componentType: ComponentType.unknown
	}, AnalyticsEventImportance.high);
};
var logSignerSelectionResponded = (signerType) => {
	logEvent("signer.selection.responded", {
		action: ActionType.unknown,
		componentType: ComponentType.unknown,
		signerType
	}, AnalyticsEventImportance.high);
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/store/correlation-ids/store.js
var correlationIdsStore = createStore(() => ({ correlationIds: /* @__PURE__ */ new Map() }));
var correlationIds = {
	get: (key) => {
		return correlationIdsStore.getState().correlationIds.get(key);
	},
	set: (key, correlationId) => {
		correlationIdsStore.setState((state) => {
			const newMap = new Map(state.correlationIds);
			newMap.set(key, correlationId);
			return { correlationIds: newMap };
		});
	},
	delete: (key) => {
		correlationIdsStore.setState((state) => {
			const newMap = new Map(state.correlationIds);
			newMap.delete(key);
			return { correlationIds: newMap };
		});
	},
	clear: () => {
		correlationIdsStore.setState({ correlationIds: /* @__PURE__ */ new Map() });
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/telemetry/events/scw-signer.js
var logHandshakeStarted$1 = ({ method, correlationId }) => {
	var _a;
	logEvent("scw_signer.handshake.started", {
		action: ActionType.unknown,
		componentType: ComponentType.unknown,
		method,
		correlationId,
		enableAutoSubAccounts: (_a = store.subAccountsConfig.get()) === null || _a === void 0 ? void 0 : _a.enableAutoSubAccounts
	}, AnalyticsEventImportance.high);
};
var logHandshakeError$1 = ({ method, correlationId, errorMessage }) => {
	var _a;
	logEvent("scw_signer.handshake.error", {
		action: ActionType.error,
		componentType: ComponentType.unknown,
		method,
		correlationId,
		errorMessage,
		enableAutoSubAccounts: (_a = store.subAccountsConfig.get()) === null || _a === void 0 ? void 0 : _a.enableAutoSubAccounts
	}, AnalyticsEventImportance.high);
};
var logHandshakeCompleted$1 = ({ method, correlationId }) => {
	var _a;
	logEvent("scw_signer.handshake.completed", {
		action: ActionType.unknown,
		componentType: ComponentType.unknown,
		method,
		correlationId,
		enableAutoSubAccounts: (_a = store.subAccountsConfig.get()) === null || _a === void 0 ? void 0 : _a.enableAutoSubAccounts
	}, AnalyticsEventImportance.high);
};
var logRequestStarted$1 = ({ method, correlationId }) => {
	var _a;
	logEvent("scw_signer.request.started", {
		action: ActionType.unknown,
		componentType: ComponentType.unknown,
		method,
		correlationId,
		enableAutoSubAccounts: (_a = store.subAccountsConfig.get()) === null || _a === void 0 ? void 0 : _a.enableAutoSubAccounts
	}, AnalyticsEventImportance.high);
};
var logRequestError$1 = ({ method, correlationId, errorMessage }) => {
	var _a;
	logEvent("scw_signer.request.error", {
		action: ActionType.error,
		componentType: ComponentType.unknown,
		method,
		correlationId,
		errorMessage,
		enableAutoSubAccounts: (_a = store.subAccountsConfig.get()) === null || _a === void 0 ? void 0 : _a.enableAutoSubAccounts
	}, AnalyticsEventImportance.high);
};
var logRequestCompleted$1 = ({ method, correlationId }) => {
	var _a;
	logEvent("scw_signer.request.completed", {
		action: ActionType.unknown,
		componentType: ComponentType.unknown,
		method,
		correlationId,
		enableAutoSubAccounts: (_a = store.subAccountsConfig.get()) === null || _a === void 0 ? void 0 : _a.enableAutoSubAccounts
	}, AnalyticsEventImportance.high);
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/telemetry/events/scw-sub-account.js
var logSubAccountRequestStarted = ({ method, correlationId }) => {
	var _a;
	logEvent("scw_sub_account.request.started", {
		action: ActionType.unknown,
		componentType: ComponentType.unknown,
		method,
		correlationId,
		enableAutoSubAccounts: (_a = store.subAccountsConfig.get()) === null || _a === void 0 ? void 0 : _a.enableAutoSubAccounts
	}, AnalyticsEventImportance.high);
};
var logSubAccountRequestCompleted = ({ method, correlationId }) => {
	var _a;
	logEvent("scw_sub_account.request.completed", {
		action: ActionType.unknown,
		componentType: ComponentType.unknown,
		method,
		correlationId,
		enableAutoSubAccounts: (_a = store.subAccountsConfig.get()) === null || _a === void 0 ? void 0 : _a.enableAutoSubAccounts
	}, AnalyticsEventImportance.high);
};
var logSubAccountRequestError = ({ method, correlationId, errorMessage }) => {
	var _a;
	logEvent("scw_sub_account.request.error", {
		action: ActionType.error,
		componentType: ComponentType.unknown,
		method,
		correlationId,
		errorMessage,
		enableAutoSubAccounts: (_a = store.subAccountsConfig.get()) === null || _a === void 0 ? void 0 : _a.enableAutoSubAccounts
	}, AnalyticsEventImportance.high);
};
var logAddOwnerStarted = ({ method, correlationId }) => {
	var _a;
	logEvent("scw_sub_account.add_owner.started", {
		action: ActionType.unknown,
		componentType: ComponentType.unknown,
		method,
		correlationId,
		enableAutoSubAccounts: (_a = store.subAccountsConfig.get()) === null || _a === void 0 ? void 0 : _a.enableAutoSubAccounts
	}, AnalyticsEventImportance.high);
};
var logAddOwnerCompleted = ({ method, correlationId }) => {
	var _a;
	logEvent("scw_sub_account.add_owner.completed", {
		action: ActionType.unknown,
		componentType: ComponentType.unknown,
		method,
		correlationId,
		enableAutoSubAccounts: (_a = store.subAccountsConfig.get()) === null || _a === void 0 ? void 0 : _a.enableAutoSubAccounts
	}, AnalyticsEventImportance.high);
};
var logAddOwnerError = ({ method, correlationId, errorMessage }) => {
	var _a;
	logEvent("scw_sub_account.add_owner.error", {
		action: ActionType.error,
		componentType: ComponentType.unknown,
		method,
		correlationId,
		errorMessage,
		enableAutoSubAccounts: (_a = store.subAccountsConfig.get()) === null || _a === void 0 ? void 0 : _a.enableAutoSubAccounts
	}, AnalyticsEventImportance.high);
};
var logInsufficientBalanceErrorHandlingStarted = ({ method, correlationId }) => {
	var _a;
	logEvent("scw_sub_account.insufficient_balance.error_handling.started", {
		action: ActionType.unknown,
		componentType: ComponentType.unknown,
		method,
		correlationId,
		enableAutoSubAccounts: (_a = store.subAccountsConfig.get()) === null || _a === void 0 ? void 0 : _a.enableAutoSubAccounts
	}, AnalyticsEventImportance.high);
};
var logInsufficientBalanceErrorHandlingCompleted = ({ method, correlationId }) => {
	var _a;
	logEvent("scw_sub_account.insufficient_balance.error_handling.completed", {
		action: ActionType.unknown,
		componentType: ComponentType.unknown,
		method,
		correlationId,
		enableAutoSubAccounts: (_a = store.subAccountsConfig.get()) === null || _a === void 0 ? void 0 : _a.enableAutoSubAccounts
	}, AnalyticsEventImportance.high);
};
var logInsufficientBalanceErrorHandlingError = ({ method, correlationId, errorMessage }) => {
	var _a;
	logEvent("scw_sub_account.insufficient_balance.error_handling.error", {
		action: ActionType.error,
		componentType: ComponentType.unknown,
		method,
		correlationId,
		errorMessage,
		enableAutoSubAccounts: (_a = store.subAccountsConfig.get()) === null || _a === void 0 ? void 0 : _a.enableAutoSubAccounts
	}, AnalyticsEventImportance.high);
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/telemetry/utils.js
var parseErrorMessageFromAny = (errorOrAny) => {
	return "message" in errorOrAny && typeof errorOrAny.message === "string" ? errorOrAny.message : "";
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/store/chain-clients/store.js
var ChainClients = createStore(() => ({}));
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/store/chain-clients/utils.js
function createClients(chains) {
	chains.forEach((c) => {
		var _a, _b, _c, _d, _e, _f, _g, _h;
		if (!c.rpcUrl) return;
		const client = createPublicClient({
			chain: defineChain({
				id: c.id,
				rpcUrls: { default: { http: [c.rpcUrl] } },
				name: (_b = (_a = c.nativeCurrency) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "",
				nativeCurrency: {
					name: (_d = (_c = c.nativeCurrency) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : "",
					symbol: (_f = (_e = c.nativeCurrency) === null || _e === void 0 ? void 0 : _e.symbol) !== null && _f !== void 0 ? _f : "",
					decimals: (_h = (_g = c.nativeCurrency) === null || _g === void 0 ? void 0 : _g.decimal) !== null && _h !== void 0 ? _h : 18
				}
			}),
			transport: http(c.rpcUrl)
		});
		const bundlerClient = createBundlerClient({
			client,
			transport: http(c.rpcUrl)
		});
		ChainClients.setState({ [c.id]: {
			client,
			bundlerClient
		} });
	});
}
function getClient(chainId) {
	var _a;
	return (_a = ChainClients.getState()[chainId]) === null || _a === void 0 ? void 0 : _a.client;
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/util/assertPresence.js
function assertPresence(value, error, message) {
	if (value === null || value === void 0) throw error !== null && error !== void 0 ? error : standardErrors.rpc.invalidParams({
		message: message !== null && message !== void 0 ? message : "value must be present",
		data: value
	});
}
function assertArrayPresence(value, message) {
	if (!Array.isArray(value)) throw standardErrors.rpc.invalidParams({
		message: message !== null && message !== void 0 ? message : "value must be an array",
		data: value
	});
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/util/assertSubAccount.js
function assertSubAccount(info) {
	if (typeof info !== "object" || info === null) throw standardErrors.rpc.internal("sub account info is not an object");
	if (!("address" in info)) throw standardErrors.rpc.internal("sub account is invalid");
	if ("address" in info && typeof info.address === "string" && !isAddress(info.address)) throw standardErrors.rpc.internal("sub account address is invalid");
	if ("factory" in info && typeof info.factory === "string" && !isAddress(info.factory)) throw standardErrors.rpc.internal("sub account factory address is invalid");
	if ("factoryData" in info && typeof info.factoryData === "string" && !isHex(info.factoryData)) throw standardErrors.rpc.internal("sub account factory data is invalid");
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/util/cipher.js
async function generateKeyPair$1() {
	return crypto.subtle.generateKey({
		name: "ECDH",
		namedCurve: "P-256"
	}, true, ["deriveKey"]);
}
async function deriveSharedSecret(ownPrivateKey, peerPublicKey) {
	return crypto.subtle.deriveKey({
		name: "ECDH",
		public: peerPublicKey
	}, ownPrivateKey, {
		name: "AES-GCM",
		length: 256
	}, false, ["encrypt", "decrypt"]);
}
async function encrypt(sharedSecret, plainText) {
	const iv = crypto.getRandomValues(new Uint8Array(12));
	return {
		iv,
		cipherText: await crypto.subtle.encrypt({
			name: "AES-GCM",
			iv
		}, sharedSecret, new TextEncoder().encode(plainText))
	};
}
async function decrypt(sharedSecret, { iv, cipherText }) {
	const plainText = await crypto.subtle.decrypt({
		name: "AES-GCM",
		iv
	}, sharedSecret, cipherText);
	return new TextDecoder().decode(plainText);
}
function getFormat(keyType) {
	switch (keyType) {
		case "public": return "spki";
		case "private": return "pkcs8";
	}
}
async function exportKeyToHexString(type, key) {
	const format = getFormat(type);
	const exported = await crypto.subtle.exportKey(format, key);
	return uint8ArrayToHex(new Uint8Array(exported));
}
async function importKeyFromHexString(type, hexString) {
	const format = getFormat(type);
	const arrayBuffer = hexStringToUint8Array(hexString).buffer;
	return await crypto.subtle.importKey(format, new Uint8Array(arrayBuffer), {
		name: "ECDH",
		namedCurve: "P-256"
	}, true, type === "private" ? ["deriveKey"] : []);
}
async function encryptContent(content, sharedSecret) {
	return encrypt(sharedSecret, JSON.stringify(content, (_, value) => {
		if (!(value instanceof Error)) return value;
		const error = value;
		return Object.assign(Object.assign({}, error.code ? { code: error.code } : {}), { message: error.message });
	}));
}
async function decryptContent(encryptedData, sharedSecret) {
	return JSON.parse(await decrypt(sharedSecret, encryptedData));
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/ox/_esm/core/version.js
/** @internal */
var version = "0.1.1";
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/ox/_esm/core/internal/errors.js
/** @internal */
function getVersion() {
	return version;
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/ox/_esm/core/Errors.js
/**
* Base error class inherited by all errors thrown by ox.
*
* @example
* ```ts
* import { Errors } from 'ox'
* throw new Errors.BaseError('An error occurred')
* ```
*/
var BaseError = class BaseError extends Error {
	constructor(shortMessage, options = {}) {
		const details = (() => {
			if (options.cause instanceof BaseError) {
				if (options.cause.details) return options.cause.details;
				if (options.cause.shortMessage) return options.cause.shortMessage;
			}
			if (options.cause?.message) return options.cause.message;
			return options.details;
		})();
		const docsPath = (() => {
			if (options.cause instanceof BaseError) return options.cause.docsPath || options.docsPath;
			return options.docsPath;
		})();
		const docs = `https://oxlib.sh${docsPath ?? ""}`;
		const message = [
			shortMessage || "An error occurred.",
			...options.metaMessages ? ["", ...options.metaMessages] : [],
			...details || docsPath ? [
				"",
				details ? `Details: ${details}` : void 0,
				docsPath ? `See: ${docs}` : void 0
			] : []
		].filter((x) => typeof x === "string").join("\n");
		super(message, options.cause ? { cause: options.cause } : void 0);
		Object.defineProperty(this, "details", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "docs", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "docsPath", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "shortMessage", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "cause", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "BaseError"
		});
		Object.defineProperty(this, "version", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: `ox@${getVersion()}`
		});
		this.cause = options.cause;
		this.details = details;
		this.docs = docs;
		this.docsPath = docsPath;
		this.shortMessage = shortMessage;
	}
	walk(fn) {
		return walk(this, fn);
	}
};
/** @internal */
function walk(err, fn) {
	if (fn?.(err)) return err;
	if (err && typeof err === "object" && "cause" in err && err.cause) return walk(err.cause, fn);
	return fn ? null : err;
}
typeof globalThis === "object" && "crypto" in globalThis && globalThis.crypto;
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/ox/node_modules/@noble/hashes/esm/utils.js
/** Checks if something is Uint8Array. Be careful: nodejs Buffer will return true. */
function isBytes$3(a) {
	return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
/** Asserts something is positive integer. */
function anumber$2(n) {
	if (!Number.isSafeInteger(n) || n < 0) throw new Error("positive integer expected, got " + n);
}
/** Asserts something is Uint8Array. */
function abytes$2(b, ...lengths) {
	if (!isBytes$3(b)) throw new Error("Uint8Array expected");
	if (lengths.length > 0 && !lengths.includes(b.length)) throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
}
/** Asserts a hash instance has not been destroyed / finished */
function aexists$1(instance, checkFinished = true) {
	if (instance.destroyed) throw new Error("Hash instance has been destroyed");
	if (checkFinished && instance.finished) throw new Error("Hash#digest() has already been called");
}
/** Asserts output is properly-sized byte array */
function aoutput$1(out, instance) {
	abytes$2(out);
	const min = instance.outputLen;
	if (out.length < min) throw new Error("digestInto() expects output buffer of length at least " + min);
}
/** Cast u8 / u16 / u32 to u32. */
function u32(arr) {
	return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
/** Zeroize a byte array. Warning: JS provides no guarantees. */
function clean$1(...arrays) {
	for (let i = 0; i < arrays.length; i++) arrays[i].fill(0);
}
/** Create DataView of an array for easy byte-level manipulation. */
function createView$2(arr) {
	return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
/** The rotate right (circular right shift) operation for uint32 */
function rotr$2(word, shift) {
	return word << 32 - shift | word >>> shift;
}
/** Is current platform little-endian? Most are. Big-Endian platform: IBM */
var isLE$2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
/** The byte swap operation for uint32 */
function byteSwap(word) {
	return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
}
/** In place byte swap for Uint32Array */
function byteSwap32(arr) {
	for (let i = 0; i < arr.length; i++) arr[i] = byteSwap(arr[i]);
	return arr;
}
var swap32IfBE = isLE$2 ? (u) => u : byteSwap32;
typeof Uint8Array.from([]).toHex === "function" && Uint8Array.fromHex;
/**
* Converts string to bytes using UTF8 encoding.
* @example utf8ToBytes('abc') // Uint8Array.from([97, 98, 99])
*/
function utf8ToBytes$3(str) {
	if (typeof str !== "string") throw new Error("string expected");
	return new Uint8Array(new TextEncoder().encode(str));
}
/**
* Normalizes (non-hex) string or Uint8Array to Uint8Array.
* Warning: when Uint8Array is passed, it would NOT get copied.
* Keep in mind for future mutable operations.
*/
function toBytes$2(data) {
	if (typeof data === "string") data = utf8ToBytes$3(data);
	abytes$2(data);
	return data;
}
/** For runtime check if class implements interface */
var Hash$2 = class {};
/** Wraps hash function, creating an interface on top of it */
function createHasher$2(hashCons) {
	const hashC = (msg) => hashCons().update(toBytes$2(msg)).digest();
	const tmp = hashCons();
	hashC.outputLen = tmp.outputLen;
	hashC.blockLen = tmp.blockLen;
	hashC.create = () => hashCons();
	return hashC;
}
function createXOFer(hashCons) {
	const hashC = (msg, opts) => hashCons(opts).update(toBytes$2(msg)).digest();
	const tmp = hashCons({});
	hashC.outputLen = tmp.outputLen;
	hashC.blockLen = tmp.blockLen;
	hashC.create = (opts) => hashCons(opts);
	return hashC;
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/ox/node_modules/@noble/hashes/esm/_md.js
/**
* Internal Merkle-Damgard hash utils.
* @module
*/
/** Polyfill for Safari 14. https://caniuse.com/mdn-javascript_builtins_dataview_setbiguint64 */
function setBigUint64$2(view, byteOffset, value, isLE) {
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
function Chi$2(a, b, c) {
	return a & b ^ ~a & c;
}
/** Majority function, true if any two inputs is true. */
function Maj$2(a, b, c) {
	return a & b ^ a & c ^ b & c;
}
/**
* Merkle-Damgard hash construction base class.
* Could be used to create MD5, RIPEMD, SHA1, SHA2.
*/
var HashMD$2 = class extends Hash$2 {
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
		this.view = createView$2(this.buffer);
	}
	update(data) {
		aexists$1(this);
		data = toBytes$2(data);
		abytes$2(data);
		const { view, buffer, blockLen } = this;
		const len = data.length;
		for (let pos = 0; pos < len;) {
			const take = Math.min(blockLen - this.pos, len - pos);
			if (take === blockLen) {
				const dataView = createView$2(data);
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
		aexists$1(this);
		aoutput$1(out, this);
		this.finished = true;
		const { buffer, view, blockLen, isLE } = this;
		let { pos } = this;
		buffer[pos++] = 128;
		clean$1(this.buffer.subarray(pos));
		if (this.padOffset > blockLen - pos) {
			this.process(view, 0);
			pos = 0;
		}
		for (let i = pos; i < blockLen; i++) buffer[i] = 0;
		setBigUint64$2(view, blockLen - 8, BigInt(this.length * 8), isLE);
		this.process(view, 0);
		const oview = createView$2(out);
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
var SHA256_IV$2 = /* @__PURE__ */ Uint32Array.from([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]);
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/ox/node_modules/@noble/hashes/esm/_u64.js
/**
* Internal helpers for u64. BigUint64Array is too slow as per 2025, so we implement it using Uint32Array.
* @todo re-check https://issues.chromium.org/issues/42212588
* @module
*/
var U32_MASK64$1 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
var _32n$1 = /* @__PURE__ */ BigInt(32);
function fromBig$1(n, le = false) {
	if (le) return {
		h: Number(n & U32_MASK64$1),
		l: Number(n >> _32n$1 & U32_MASK64$1)
	};
	return {
		h: Number(n >> _32n$1 & U32_MASK64$1) | 0,
		l: Number(n & U32_MASK64$1) | 0
	};
}
function split$1(lst, le = false) {
	const len = lst.length;
	let Ah = new Uint32Array(len);
	let Al = new Uint32Array(len);
	for (let i = 0; i < len; i++) {
		const { h, l } = fromBig$1(lst[i], le);
		[Ah[i], Al[i]] = [h, l];
	}
	return [Ah, Al];
}
var rotlSH = (h, l, s) => h << s | l >>> 32 - s;
var rotlSL = (h, l, s) => l << s | h >>> 32 - s;
var rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
var rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/ox/node_modules/@noble/hashes/esm/sha3.js
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
var _7n$1 = BigInt(7);
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
		R = (R << _1n$4 ^ (R >> _7n$1) * _0x71n) % _256n;
		if (R & _2n$3) t ^= _1n$4 << (_1n$4 << /* @__PURE__ */ BigInt(j)) - _1n$4;
	}
	_SHA3_IOTA.push(t);
}
var IOTAS = split$1(_SHA3_IOTA, true);
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
	clean$1(B);
}
/** Keccak sponge function. */
var Keccak = class Keccak extends Hash$2 {
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
		anumber$2(outputLen);
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
		aexists$1(this);
		data = toBytes$2(data);
		abytes$2(data);
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
		aexists$1(this, false);
		abytes$2(out);
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
		anumber$2(bytes);
		return this.xofInto(new Uint8Array(bytes));
	}
	digestInto(out) {
		aoutput$1(out, this);
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
		clean$1(this.state);
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
var gen = (suffix, blockLen, outputLen) => createHasher$2(() => new Keccak(blockLen, suffix, outputLen));
gen(6, 144, 224 / 8);
gen(6, 136, 256 / 8);
gen(6, 104, 384 / 8);
gen(6, 72, 512 / 8);
gen(1, 144, 224 / 8);
gen(1, 136, 256 / 8);
gen(1, 104, 384 / 8);
gen(1, 72, 512 / 8);
var genShake = (suffix, blockLen, outputLen) => createXOFer((opts = {}) => new Keccak(blockLen, suffix, opts.dkLen === void 0 ? outputLen : opts.dkLen, true));
genShake(31, 168, 128 / 8);
genShake(31, 136, 256 / 8);
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/ox/node_modules/@noble/hashes/esm/sha2.js
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
var SHA256_K$2 = /* @__PURE__ */ Uint32Array.from([
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
var SHA256_W$2 = /* @__PURE__ */ new Uint32Array(64);
var SHA256$2 = class extends HashMD$2 {
	constructor(outputLen = 32) {
		super(64, outputLen, 8, false);
		this.A = SHA256_IV$2[0] | 0;
		this.B = SHA256_IV$2[1] | 0;
		this.C = SHA256_IV$2[2] | 0;
		this.D = SHA256_IV$2[3] | 0;
		this.E = SHA256_IV$2[4] | 0;
		this.F = SHA256_IV$2[5] | 0;
		this.G = SHA256_IV$2[6] | 0;
		this.H = SHA256_IV$2[7] | 0;
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
		for (let i = 0; i < 16; i++, offset += 4) SHA256_W$2[i] = view.getUint32(offset, false);
		for (let i = 16; i < 64; i++) {
			const W15 = SHA256_W$2[i - 15];
			const W2 = SHA256_W$2[i - 2];
			const s0 = rotr$2(W15, 7) ^ rotr$2(W15, 18) ^ W15 >>> 3;
			SHA256_W$2[i] = (rotr$2(W2, 17) ^ rotr$2(W2, 19) ^ W2 >>> 10) + SHA256_W$2[i - 7] + s0 + SHA256_W$2[i - 16] | 0;
		}
		let { A, B, C, D, E, F, G, H } = this;
		for (let i = 0; i < 64; i++) {
			const sigma1 = rotr$2(E, 6) ^ rotr$2(E, 11) ^ rotr$2(E, 25);
			const T1 = H + sigma1 + Chi$2(E, F, G) + SHA256_K$2[i] + SHA256_W$2[i] | 0;
			const T2 = (rotr$2(A, 2) ^ rotr$2(A, 13) ^ rotr$2(A, 22)) + Maj$2(A, B, C) | 0;
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
		clean$1(SHA256_W$2);
	}
	destroy() {
		this.set(0, 0, 0, 0, 0, 0, 0, 0);
		clean$1(this.buffer);
	}
};
var K512$1 = split$1([
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
K512$1[0];
K512$1[1];
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/ox/node_modules/@noble/hashes/esm/sha256.js
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
var sha256$3 = /* @__PURE__ */ createHasher$2(() => new SHA256$2());
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/curves/node_modules/@noble/hashes/esm/crypto.js
var crypto$2 = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/curves/node_modules/@noble/hashes/esm/utils.js
/**
* Utilities for hex, bytes, CSPRNG.
* @module
*/
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
/** Checks if something is Uint8Array. Be careful: nodejs Buffer will return true. */
function isBytes$2(a) {
	return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
/** Asserts something is positive integer. */
function anumber$1(n) {
	if (!Number.isSafeInteger(n) || n < 0) throw new Error("positive integer expected, got " + n);
}
/** Asserts something is Uint8Array. */
function abytes$1(b, ...lengths) {
	if (!isBytes$2(b)) throw new Error("Uint8Array expected");
	if (lengths.length > 0 && !lengths.includes(b.length)) throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
}
/** Asserts something is hash */
function ahash(h) {
	if (typeof h !== "function" || typeof h.create !== "function") throw new Error("Hash should be wrapped by utils.createHasher");
	anumber$1(h.outputLen);
	anumber$1(h.blockLen);
}
/** Asserts a hash instance has not been destroyed / finished */
function aexists(instance, checkFinished = true) {
	if (instance.destroyed) throw new Error("Hash instance has been destroyed");
	if (checkFinished && instance.finished) throw new Error("Hash#digest() has already been called");
}
/** Asserts output is properly-sized byte array */
function aoutput(out, instance) {
	abytes$1(out);
	const min = instance.outputLen;
	if (out.length < min) throw new Error("digestInto() expects output buffer of length at least " + min);
}
/** Zeroize a byte array. Warning: JS provides no guarantees. */
function clean(...arrays) {
	for (let i = 0; i < arrays.length; i++) arrays[i].fill(0);
}
/** Create DataView of an array for easy byte-level manipulation. */
function createView$1(arr) {
	return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
/** The rotate right (circular right shift) operation for uint32 */
function rotr$1(word, shift) {
	return word << 32 - shift | word >>> shift;
}
new Uint8Array(new Uint32Array([287454020]).buffer)[0];
var hasHexBuiltin = typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function";
var hexes$2 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
/**
* Convert byte array to hex string. Uses built-in function, when available.
* @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
*/
function bytesToHex$2(bytes) {
	abytes$1(bytes);
	if (hasHexBuiltin) return bytes.toHex();
	let hex = "";
	for (let i = 0; i < bytes.length; i++) hex += hexes$2[bytes[i]];
	return hex;
}
var asciis = {
	_0: 48,
	_9: 57,
	A: 65,
	F: 70,
	a: 97,
	f: 102
};
function asciiToBase16(ch) {
	if (ch >= asciis._0 && ch <= asciis._9) return ch - asciis._0;
	if (ch >= asciis.A && ch <= asciis.F) return ch - (asciis.A - 10);
	if (ch >= asciis.a && ch <= asciis.f) return ch - (asciis.a - 10);
}
/**
* Convert hex string to byte array. Uses built-in function, when available.
* @example hexToBytes('cafe0123') // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
*/
function hexToBytes$1(hex) {
	if (typeof hex !== "string") throw new Error("hex string expected, got " + typeof hex);
	if (hasHexBuiltin) return Uint8Array.fromHex(hex);
	const hl = hex.length;
	const al = hl / 2;
	if (hl % 2) throw new Error("hex string expected, got unpadded hex of length " + hl);
	const array = new Uint8Array(al);
	for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
		const n1 = asciiToBase16(hex.charCodeAt(hi));
		const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
		if (n1 === void 0 || n2 === void 0) {
			const char = hex[hi] + hex[hi + 1];
			throw new Error("hex string expected, got non-hex character \"" + char + "\" at index " + hi);
		}
		array[ai] = n1 * 16 + n2;
	}
	return array;
}
/**
* Converts string to bytes using UTF8 encoding.
* @example utf8ToBytes('abc') // Uint8Array.from([97, 98, 99])
*/
function utf8ToBytes$2(str) {
	if (typeof str !== "string") throw new Error("string expected");
	return new Uint8Array(new TextEncoder().encode(str));
}
/**
* Normalizes (non-hex) string or Uint8Array to Uint8Array.
* Warning: when Uint8Array is passed, it would NOT get copied.
* Keep in mind for future mutable operations.
*/
function toBytes$1(data) {
	if (typeof data === "string") data = utf8ToBytes$2(data);
	abytes$1(data);
	return data;
}
/** Copies several Uint8Arrays into one. */
function concatBytes$1(...arrays) {
	let sum = 0;
	for (let i = 0; i < arrays.length; i++) {
		const a = arrays[i];
		abytes$1(a);
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
var Hash$1 = class {};
/** Wraps hash function, creating an interface on top of it */
function createHasher$1(hashCons) {
	const hashC = (msg) => hashCons().update(toBytes$1(msg)).digest();
	const tmp = hashCons();
	hashC.outputLen = tmp.outputLen;
	hashC.blockLen = tmp.blockLen;
	hashC.create = () => hashCons();
	return hashC;
}
/** Cryptographically secure PRNG. Uses internal OS-level `crypto.getRandomValues`. */
function randomBytes$1(bytesLength = 32) {
	if (crypto$2 && typeof crypto$2.getRandomValues === "function") return crypto$2.getRandomValues(new Uint8Array(bytesLength));
	if (crypto$2 && typeof crypto$2.randomBytes === "function") return Uint8Array.from(crypto$2.randomBytes(bytesLength));
	throw new Error("crypto.getRandomValues must be defined");
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/curves/esm/utils.js
/**
* Hex, bytes and number utilities.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n$3 = /* @__PURE__ */ BigInt(0);
var _1n$3 = /* @__PURE__ */ BigInt(1);
function _abool2(value, title = "") {
	if (typeof value !== "boolean") {
		const prefix = title && `"${title}"`;
		throw new Error(prefix + "expected boolean, got type=" + typeof value);
	}
	return value;
}
/** Asserts something is Uint8Array. */
function _abytes2(value, length, title = "") {
	const bytes = isBytes$2(value);
	const len = value?.length;
	const needsLen = length !== void 0;
	if (!bytes || needsLen && len !== length) {
		const prefix = title && `"${title}" `;
		const ofLen = needsLen ? ` of length ${length}` : "";
		const got = bytes ? `length=${len}` : `type=${typeof value}`;
		throw new Error(prefix + "expected Uint8Array" + ofLen + ", got " + got);
	}
	return value;
}
function numberToHexUnpadded$1(num) {
	const hex = num.toString(16);
	return hex.length & 1 ? "0" + hex : hex;
}
function hexToNumber$1(hex) {
	if (typeof hex !== "string") throw new Error("hex string expected, got " + typeof hex);
	return hex === "" ? _0n$3 : BigInt("0x" + hex);
}
function bytesToNumberBE$1(bytes) {
	return hexToNumber$1(bytesToHex$2(bytes));
}
function bytesToNumberLE$1(bytes) {
	abytes$1(bytes);
	return hexToNumber$1(bytesToHex$2(Uint8Array.from(bytes).reverse()));
}
function numberToBytesBE$1(n, len) {
	return hexToBytes$1(n.toString(16).padStart(len * 2, "0"));
}
function numberToBytesLE$1(n, len) {
	return numberToBytesBE$1(n, len).reverse();
}
/**
* Takes hex string or Uint8Array, converts to Uint8Array.
* Validates output length.
* Will throw error for other types.
* @param title descriptive title for an error e.g. 'secret key'
* @param hex hex string or Uint8Array
* @param expectedLength optional, will compare to result array's length
* @returns
*/
function ensureBytes$1(title, hex, expectedLength) {
	let res;
	if (typeof hex === "string") try {
		res = hexToBytes$1(hex);
	} catch (e) {
		throw new Error(title + " must be hex string or Uint8Array, cause: " + e);
	}
	else if (isBytes$2(hex)) res = Uint8Array.from(hex);
	else throw new Error(title + " must be hex string or Uint8Array");
	const len = res.length;
	if (typeof expectedLength === "number" && len !== expectedLength) throw new Error(title + " of length " + expectedLength + " expected, got " + len);
	return res;
}
/**
* @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
*/
/**
* Converts bytes to string using UTF8 encoding.
* @example bytesToUtf8(Uint8Array.from([97, 98, 99])) // 'abc'
*/
var isPosBig = (n) => typeof n === "bigint" && _0n$3 <= n;
function inRange$1(n, min, max) {
	return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
/**
* Asserts min <= n < max. NOTE: It's < max and not <= max.
* @example
* aInRange('x', x, 1n, 256n); // would assume x is in (1n..255n)
*/
function aInRange$1(title, n, min, max) {
	if (!inRange$1(n, min, max)) throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
}
/**
* Calculates amount of bits in a bigint.
* Same as `n.toString(2).length`
* TODO: merge with nLength in modular
*/
function bitLen$1(n) {
	let len;
	for (len = 0; n > _0n$3; n >>= _1n$3, len += 1);
	return len;
}
/**
* Calculate mask for N bits. Not using ** operator with bigints because of old engines.
* Same as BigInt(`0b${Array(i).fill('1').join('')}`)
*/
var bitMask$1 = (n) => (_1n$3 << BigInt(n)) - _1n$3;
/**
* Minimal HMAC-DRBG from NIST 800-90 for RFC6979 sigs.
* @returns function that will call DRBG until 2nd arg returns something meaningful
* @example
*   const drbg = createHmacDRBG<Key>(32, 32, hmac);
*   drbg(seed, bytesToKey); // bytesToKey must return Key or undefined
*/
function createHmacDrbg$1(hashLen, qByteLen, hmacFn) {
	if (typeof hashLen !== "number" || hashLen < 2) throw new Error("hashLen must be a number");
	if (typeof qByteLen !== "number" || qByteLen < 2) throw new Error("qByteLen must be a number");
	if (typeof hmacFn !== "function") throw new Error("hmacFn must be a function");
	const u8n = (len) => new Uint8Array(len);
	const u8of = (byte) => Uint8Array.of(byte);
	let v = u8n(hashLen);
	let k = u8n(hashLen);
	let i = 0;
	const reset = () => {
		v.fill(1);
		k.fill(0);
		i = 0;
	};
	const h = (...b) => hmacFn(k, v, ...b);
	const reseed = (seed = u8n(0)) => {
		k = h(u8of(0), seed);
		v = h();
		if (seed.length === 0) return;
		k = h(u8of(1), seed);
		v = h();
	};
	const gen = () => {
		if (i++ >= 1e3) throw new Error("drbg: tried 1000 values");
		let len = 0;
		const out = [];
		while (len < qByteLen) {
			v = h();
			const sl = v.slice();
			out.push(sl);
			len += v.length;
		}
		return concatBytes$1(...out);
	};
	const genUntil = (seed, pred) => {
		reset();
		reseed(seed);
		let res = void 0;
		while (!(res = pred(gen()))) reseed();
		reset();
		return res;
	};
	return genUntil;
}
function isHash$1(val) {
	return typeof val === "function" && Number.isSafeInteger(val.outputLen);
}
function _validateObject(object, fields, optFields = {}) {
	if (!object || typeof object !== "object") throw new Error("expected valid options object");
	function checkField(fieldName, expectedType, isOpt) {
		const val = object[fieldName];
		if (isOpt && val === void 0) return;
		const current = typeof val;
		if (current !== expectedType || val === null) throw new Error(`param "${fieldName}" is invalid: expected ${expectedType}, got ${current}`);
	}
	Object.entries(fields).forEach(([k, v]) => checkField(k, v, false));
	Object.entries(optFields).forEach(([k, v]) => checkField(k, v, true));
}
/**
* Memoizes (caches) computation result.
* Uses WeakMap: the value is going auto-cleaned by GC after last reference is removed.
*/
function memoized$1(fn) {
	const map = /* @__PURE__ */ new WeakMap();
	return (arg, ...args) => {
		const val = map.get(arg);
		if (val !== void 0) return val;
		const computed = fn(arg, ...args);
		map.set(arg, computed);
		return computed;
	};
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/ox/_esm/core/Json.js
var bigIntSuffix = "#__bigint";
/**
* Stringifies a value to its JSON representation, with support for `bigint`.
*
* @example
* ```ts twoslash
* import { Json } from 'ox'
*
* const json = Json.stringify({
*   foo: 'bar',
*   baz: 69420694206942069420694206942069420694206942069420n,
* })
* // @log: '{"foo":"bar","baz":"69420694206942069420694206942069420694206942069420#__bigint"}'
* ```
*
* @param value - The value to stringify.
* @param replacer - A function that transforms the results. It is passed the key and value of the property, and must return the value to be used in the JSON string. If this function returns `undefined`, the property is not included in the resulting JSON string.
* @param space - A string or number that determines the indentation of the JSON string. If it is a number, it indicates the number of spaces to use as indentation; if it is a string (e.g. `'\t'`), it uses the string as the indentation character.
* @returns The JSON string.
*/
function stringify(value, replacer, space) {
	return JSON.stringify(value, (key, value) => {
		if (typeof replacer === "function") return replacer(key, value);
		if (typeof value === "bigint") return value.toString() + bigIntSuffix;
		return value;
	}, space);
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/ox/_esm/core/internal/bytes.js
/** @internal */
function assertSize$1(bytes, size_) {
	if (size(bytes) > size_) throw new SizeOverflowError({
		givenSize: size(bytes),
		maxSize: size_
	});
}
/** @internal */
function assertStartOffset$1(value, start) {
	if (typeof start === "number" && start > 0 && start > size(value) - 1) throw new SliceOffsetOutOfBoundsError({
		offset: start,
		position: "start",
		size: size(value)
	});
}
/** @internal */
function assertEndOffset$1(value, start, end) {
	if (typeof start === "number" && typeof end === "number" && size(value) !== end - start) throw new SliceOffsetOutOfBoundsError({
		offset: end,
		position: "end",
		size: size(value)
	});
}
/** @internal */
var charCodeMap = {
	zero: 48,
	nine: 57,
	A: 65,
	F: 70,
	a: 97,
	f: 102
};
/** @internal */
function charCodeToBase16(char) {
	if (char >= charCodeMap.zero && char <= charCodeMap.nine) return char - charCodeMap.zero;
	if (char >= charCodeMap.A && char <= charCodeMap.F) return char - (charCodeMap.A - 10);
	if (char >= charCodeMap.a && char <= charCodeMap.f) return char - (charCodeMap.a - 10);
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/ox/_esm/core/internal/hex.js
/** @internal */
function assertSize(hex, size_) {
	if (size$1(hex) > size_) throw new SizeOverflowError$1({
		givenSize: size$1(hex),
		maxSize: size_
	});
}
/** @internal */
function assertStartOffset(value, start) {
	if (typeof start === "number" && start > 0 && start > size$1(value) - 1) throw new SliceOffsetOutOfBoundsError$1({
		offset: start,
		position: "start",
		size: size$1(value)
	});
}
/** @internal */
function assertEndOffset(value, start, end) {
	if (typeof start === "number" && typeof end === "number" && size$1(value) !== end - start) throw new SliceOffsetOutOfBoundsError$1({
		offset: end,
		position: "end",
		size: size$1(value)
	});
}
/** @internal */
function pad(hex_, options = {}) {
	const { dir, size = 32 } = options;
	if (size === 0) return hex_;
	const hex = hex_.replace("0x", "");
	if (hex.length > size * 2) throw new SizeExceedsPaddingSizeError({
		size: Math.ceil(hex.length / 2),
		targetSize: size,
		type: "Hex"
	});
	return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size * 2, "0")}`;
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/ox/_esm/core/Hex.js
var encoder = /* @__PURE__ */ new TextEncoder();
var hexes$1 = /* @__PURE__ */ Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, "0"));
/**
* Asserts if the given value is {@link ox#Hex.Hex}.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.assert('abc')
* // @error: InvalidHexValueTypeError:
* // @error: Value `"abc"` of type `string` is an invalid hex type.
* // @error: Hex types must be represented as `"0x\${string}"`.
* ```
*
* @param value - The value to assert.
* @param options - Options.
*/
function assert$3(value, options = {}) {
	const { strict = false } = options;
	if (!value) throw new InvalidHexTypeError(value);
	if (typeof value !== "string") throw new InvalidHexTypeError(value);
	if (strict) {
		if (!/^0x[0-9a-fA-F]*$/.test(value)) throw new InvalidHexValueError(value);
	}
	if (!value.startsWith("0x")) throw new InvalidHexValueError(value);
}
/**
* Concatenates two or more {@link ox#Hex.Hex}.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.concat('0x123', '0x456')
* // @log: '0x123456'
* ```
*
* @param values - The {@link ox#Hex.Hex} values to concatenate.
* @returns The concatenated {@link ox#Hex.Hex} value.
*/
function concat(...values) {
	return `0x${values.reduce((acc, x) => acc + x.replace("0x", ""), "")}`;
}
/**
* Instantiates a {@link ox#Hex.Hex} value from a hex string or {@link ox#Bytes.Bytes} value.
*
* :::tip
*
* To instantiate from a **Boolean**, **String**, or **Number**, use one of the following:
*
* - `Hex.fromBoolean`
*
* - `Hex.fromString`
*
* - `Hex.fromNumber`
*
* :::
*
* @example
* ```ts twoslash
* import { Bytes, Hex } from 'ox'
*
* Hex.from('0x48656c6c6f20576f726c6421')
* // @log: '0x48656c6c6f20576f726c6421'
*
* Hex.from(Bytes.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]))
* // @log: '0x48656c6c6f20576f726c6421'
* ```
*
* @param value - The {@link ox#Bytes.Bytes} value to encode.
* @returns The encoded {@link ox#Hex.Hex} value.
*/
function from$2(value) {
	if (value instanceof Uint8Array) return fromBytes$2(value);
	if (Array.isArray(value)) return fromBytes$2(new Uint8Array(value));
	return value;
}
/**
* Encodes a {@link ox#Bytes.Bytes} value into a {@link ox#Hex.Hex} value.
*
* @example
* ```ts twoslash
* import { Bytes, Hex } from 'ox'
*
* Hex.fromBytes(Bytes.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]))
* // @log: '0x48656c6c6f20576f726c6421'
* ```
*
* @param value - The {@link ox#Bytes.Bytes} value to encode.
* @param options - Options.
* @returns The encoded {@link ox#Hex.Hex} value.
*/
function fromBytes$2(value, options = {}) {
	let string = "";
	for (let i = 0; i < value.length; i++) string += hexes$1[value[i]];
	const hex = `0x${string}`;
	if (typeof options.size === "number") {
		assertSize(hex, options.size);
		return padRight(hex, options.size);
	}
	return hex;
}
/**
* Encodes a number or bigint into a {@link ox#Hex.Hex} value.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.fromNumber(420)
* // @log: '0x1a4'
*
* Hex.fromNumber(420, { size: 32 })
* // @log: '0x00000000000000000000000000000000000000000000000000000000000001a4'
* ```
*
* @param value - The number or bigint value to encode.
* @param options - Options.
* @returns The encoded {@link ox#Hex.Hex} value.
*/
function fromNumber(value, options = {}) {
	const { signed, size } = options;
	const value_ = BigInt(value);
	let maxValue;
	if (size) if (signed) maxValue = (1n << BigInt(size) * 8n - 1n) - 1n;
	else maxValue = 2n ** (BigInt(size) * 8n) - 1n;
	else if (typeof value === "number") maxValue = BigInt(Number.MAX_SAFE_INTEGER);
	const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
	if (maxValue && value_ > maxValue || value_ < minValue) {
		const suffix = typeof value === "bigint" ? "n" : "";
		throw new IntegerOutOfRangeError({
			max: maxValue ? `${maxValue}${suffix}` : void 0,
			min: `${minValue}${suffix}`,
			signed,
			size,
			value: `${value}${suffix}`
		});
	}
	const hex = `0x${(signed && value_ < 0 ? (1n << BigInt(size * 8)) + BigInt(value_) : value_).toString(16)}`;
	if (size) return padLeft(hex, size);
	return hex;
}
/**
* Encodes a string into a {@link ox#Hex.Hex} value.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
* Hex.fromString('Hello World!')
* // '0x48656c6c6f20576f726c6421'
*
* Hex.fromString('Hello World!', { size: 32 })
* // '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
* ```
*
* @param value - The string value to encode.
* @param options - Options.
* @returns The encoded {@link ox#Hex.Hex} value.
*/
function fromString(value, options = {}) {
	return fromBytes$2(encoder.encode(value), options);
}
/**
* Pads a {@link ox#Hex.Hex} value to the left with zero bytes until it reaches the given `size` (default: 32 bytes).
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.padLeft('0x1234', 4)
* // @log: '0x00001234'
* ```
*
* @param value - The {@link ox#Hex.Hex} value to pad.
* @param size - The size (in bytes) of the output hex value.
* @returns The padded {@link ox#Hex.Hex} value.
*/
function padLeft(value, size) {
	return pad(value, {
		dir: "left",
		size
	});
}
/**
* Pads a {@link ox#Hex.Hex} value to the right with zero bytes until it reaches the given `size` (default: 32 bytes).
*
* @example
* ```ts
* import { Hex } from 'ox'
*
* Hex.padRight('0x1234', 4)
* // @log: '0x12340000'
* ```
*
* @param value - The {@link ox#Hex.Hex} value to pad.
* @param size - The size (in bytes) of the output hex value.
* @returns The padded {@link ox#Hex.Hex} value.
*/
function padRight(value, size) {
	return pad(value, {
		dir: "right",
		size
	});
}
/**
* Returns a section of a {@link ox#Bytes.Bytes} value given a start/end bytes offset.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.slice('0x0123456789', 1, 4)
* // @log: '0x234567'
* ```
*
* @param value - The {@link ox#Hex.Hex} value to slice.
* @param start - The start offset (in bytes).
* @param end - The end offset (in bytes).
* @param options - Options.
* @returns The sliced {@link ox#Hex.Hex} value.
*/
function slice$1(value, start, end, options = {}) {
	const { strict } = options;
	assertStartOffset(value, start);
	const value_ = `0x${value.replace("0x", "").slice((start ?? 0) * 2, (end ?? value.length) * 2)}`;
	if (strict) assertEndOffset(value_, start, end);
	return value_;
}
/**
* Retrieves the size of a {@link ox#Hex.Hex} value (in bytes).
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.size('0xdeadbeef')
* // @log: 4
* ```
*
* @param value - The {@link ox#Hex.Hex} value to get the size of.
* @returns The size of the {@link ox#Hex.Hex} value (in bytes).
*/
function size$1(value) {
	return Math.ceil((value.length - 2) / 2);
}
/**
* Decodes a {@link ox#Hex.Hex} value into a BigInt.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.toBigInt('0x1a4')
* // @log: 420n
*
* Hex.toBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
* // @log: 420n
* ```
*
* @param hex - The {@link ox#Hex.Hex} value to decode.
* @param options - Options.
* @returns The decoded BigInt.
*/
function toBigInt$1(hex, options = {}) {
	const { signed } = options;
	if (options.size) assertSize(hex, options.size);
	const value = BigInt(hex);
	if (!signed) return value;
	const size = (hex.length - 2) / 2;
	const max_unsigned = (1n << BigInt(size) * 8n) - 1n;
	if (value <= max_unsigned >> 1n) return value;
	return value - max_unsigned - 1n;
}
/**
* Checks if the given value is {@link ox#Hex.Hex}.
*
* @example
* ```ts twoslash
* import { Bytes, Hex } from 'ox'
*
* Hex.validate('0xdeadbeef')
* // @log: true
*
* Hex.validate(Bytes.from([1, 2, 3]))
* // @log: false
* ```
*
* @param value - The value to check.
* @param options - Options.
* @returns `true` if the value is a {@link ox#Hex.Hex}, `false` otherwise.
*/
function validate$1(value, options = {}) {
	const { strict = false } = options;
	try {
		assert$3(value, { strict });
		return true;
	} catch {
		return false;
	}
}
/**
* Thrown when the provided integer is out of range, and cannot be represented as a hex value.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.fromNumber(420182738912731283712937129)
* // @error: Hex.IntegerOutOfRangeError: Number \`4.2018273891273126e+26\` is not in safe unsigned integer range (`0` to `9007199254740991`)
* ```
*/
var IntegerOutOfRangeError = class extends BaseError {
	constructor({ max, min, signed, size, value }) {
		super(`Number \`${value}\` is not in safe${size ? ` ${size * 8}-bit` : ""}${signed ? " signed" : " unsigned"} integer range ${max ? `(\`${min}\` to \`${max}\`)` : `(above \`${min}\`)`}`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Hex.IntegerOutOfRangeError"
		});
	}
};
/**
* Thrown when the provided value is not a valid hex type.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.assert(1)
* // @error: Hex.InvalidHexTypeError: Value `1` of type `number` is an invalid hex type.
* ```
*/
var InvalidHexTypeError = class extends BaseError {
	constructor(value) {
		super(`Value \`${typeof value === "object" ? stringify(value) : value}\` of type \`${typeof value}\` is an invalid hex type.`, { metaMessages: ["Hex types must be represented as `\"0x${string}\"`."] });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Hex.InvalidHexTypeError"
		});
	}
};
/**
* Thrown when the provided hex value is invalid.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.assert('0x0123456789abcdefg')
* // @error: Hex.InvalidHexValueError: Value `0x0123456789abcdefg` is an invalid hex value.
* // @error: Hex values must start with `"0x"` and contain only hexadecimal characters (0-9, a-f, A-F).
* ```
*/
var InvalidHexValueError = class extends BaseError {
	constructor(value) {
		super(`Value \`${value}\` is an invalid hex value.`, { metaMessages: ["Hex values must start with `\"0x\"` and contain only hexadecimal characters (0-9, a-f, A-F)."] });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Hex.InvalidHexValueError"
		});
	}
};
/**
* Thrown when the size of the value exceeds the expected max size.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.fromString('Hello World!', { size: 8 })
* // @error: Hex.SizeOverflowError: Size cannot exceed `8` bytes. Given size: `12` bytes.
* ```
*/
var SizeOverflowError$1 = class extends BaseError {
	constructor({ givenSize, maxSize }) {
		super(`Size cannot exceed \`${maxSize}\` bytes. Given size: \`${givenSize}\` bytes.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Hex.SizeOverflowError"
		});
	}
};
/**
* Thrown when the slice offset exceeds the bounds of the value.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.slice('0x0123456789', 6)
* // @error: Hex.SliceOffsetOutOfBoundsError: Slice starting at offset `6` is out-of-bounds (size: `5`).
* ```
*/
var SliceOffsetOutOfBoundsError$1 = class extends BaseError {
	constructor({ offset, position, size }) {
		super(`Slice ${position === "start" ? "starting" : "ending"} at offset \`${offset}\` is out-of-bounds (size: \`${size}\`).`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Hex.SliceOffsetOutOfBoundsError"
		});
	}
};
/**
* Thrown when the size of the value exceeds the pad size.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.padLeft('0x1a4e12a45a21323123aaa87a897a897a898a6567a578a867a98778a667a85a875a87a6a787a65a675a6a9', 32)
* // @error: Hex.SizeExceedsPaddingSizeError: Hex size (`43`) exceeds padding size (`32`).
* ```
*/
var SizeExceedsPaddingSizeError = class extends BaseError {
	constructor({ size, targetSize, type }) {
		super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (\`${size}\`) exceeds padding size (\`${targetSize}\`).`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Hex.SizeExceedsPaddingSizeError"
		});
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/ox/_esm/core/Bytes.js
/**
* Asserts if the given value is {@link ox#Bytes.Bytes}.
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* Bytes.assert('abc')
* // @error: Bytes.InvalidBytesTypeError:
* // @error: Value `"abc"` of type `string` is an invalid Bytes value.
* // @error: Bytes values must be of type `Uint8Array`.
* ```
*
* @param value - Value to assert.
*/
function assert$2(value) {
	if (value instanceof Uint8Array) return;
	if (!value) throw new InvalidBytesTypeError(value);
	if (typeof value !== "object") throw new InvalidBytesTypeError(value);
	if (!("BYTES_PER_ELEMENT" in value)) throw new InvalidBytesTypeError(value);
	if (value.BYTES_PER_ELEMENT !== 1 || value.constructor.name !== "Uint8Array") throw new InvalidBytesTypeError(value);
}
/**
* Instantiates a {@link ox#Bytes.Bytes} value from a `Uint8Array`, a hex string, or an array of unsigned 8-bit integers.
*
* :::tip
*
* To instantiate from a **Boolean**, **String**, or **Number**, use one of the following:
*
* - `Bytes.fromBoolean`
*
* - `Bytes.fromString`
*
* - `Bytes.fromNumber`
*
* :::
*
* @example
* ```ts twoslash
* // @noErrors
* import { Bytes } from 'ox'
*
* const data = Bytes.from([255, 124, 5, 4])
* // @log: Uint8Array([255, 124, 5, 4])
*
* const data = Bytes.from('0xdeadbeef')
* // @log: Uint8Array([222, 173, 190, 239])
* ```
*
* @param value - Value to convert.
* @returns A {@link ox#Bytes.Bytes} instance.
*/
function from$1(value) {
	if (value instanceof Uint8Array) return value;
	if (typeof value === "string") return fromHex$3(value);
	return fromArray(value);
}
/**
* Converts an array of unsigned 8-bit integers into {@link ox#Bytes.Bytes}.
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* const data = Bytes.fromArray([255, 124, 5, 4])
* // @log: Uint8Array([255, 124, 5, 4])
* ```
*
* @param value - Value to convert.
* @returns A {@link ox#Bytes.Bytes} instance.
*/
function fromArray(value) {
	return value instanceof Uint8Array ? value : new Uint8Array(value);
}
/**
* Encodes a {@link ox#Hex.Hex} value into {@link ox#Bytes.Bytes}.
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* const data = Bytes.fromHex('0x48656c6c6f20776f726c6421')
* // @log: Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
* ```
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* const data = Bytes.fromHex('0x48656c6c6f20776f726c6421', { size: 32 })
* // @log: Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
* ```
*
* @param value - {@link ox#Hex.Hex} value to encode.
* @param options - Encoding options.
* @returns Encoded {@link ox#Bytes.Bytes}.
*/
function fromHex$3(value, options = {}) {
	const { size } = options;
	let hex = value;
	if (size) {
		assertSize(value, size);
		hex = padRight(value, size);
	}
	let hexString = hex.slice(2);
	if (hexString.length % 2) hexString = `0${hexString}`;
	const length = hexString.length / 2;
	const bytes = new Uint8Array(length);
	for (let index = 0, j = 0; index < length; index++) {
		const nibbleLeft = charCodeToBase16(hexString.charCodeAt(j++));
		const nibbleRight = charCodeToBase16(hexString.charCodeAt(j++));
		if (nibbleLeft === void 0 || nibbleRight === void 0) throw new BaseError(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
		bytes[index] = nibbleLeft * 16 + nibbleRight;
	}
	return bytes;
}
/**
* Retrieves the size of a {@link ox#Bytes.Bytes} value.
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* Bytes.size(Bytes.from([1, 2, 3, 4]))
* // @log: 4
* ```
*
* @param value - {@link ox#Bytes.Bytes} value.
* @returns Size of the {@link ox#Bytes.Bytes} value.
*/
function size(value) {
	return value.length;
}
/**
* Returns a section of a {@link ox#Bytes.Bytes} value given a start/end bytes offset.
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* Bytes.slice(
*   Bytes.from([1, 2, 3, 4, 5, 6, 7, 8, 9]),
*   1,
*   4,
* )
* // @log: Uint8Array([2, 3, 4])
* ```
*
* @param value - The {@link ox#Bytes.Bytes} value.
* @param start - Start offset.
* @param end - End offset.
* @param options - Slice options.
* @returns Sliced {@link ox#Bytes.Bytes} value.
*/
function slice(value, start, end, options = {}) {
	const { strict } = options;
	assertStartOffset$1(value, start);
	const value_ = value.slice(start, end);
	if (strict) assertEndOffset$1(value_, start, end);
	return value_;
}
/**
* Decodes a {@link ox#Bytes.Bytes} into a bigint.
*
* @example
* ```ts
* import { Bytes } from 'ox'
*
* Bytes.toBigInt(Bytes.from([1, 164]))
* // @log: 420n
* ```
*
* @param bytes - The {@link ox#Bytes.Bytes} to decode.
* @param options - Decoding options.
* @returns Decoded bigint.
*/
function toBigInt(bytes, options = {}) {
	const { size } = options;
	if (typeof size !== "undefined") assertSize$1(bytes, size);
	return toBigInt$1(fromBytes$2(bytes, options), options);
}
/**
* Checks if the given value is {@link ox#Bytes.Bytes}.
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* Bytes.validate('0x')
* // @log: false
*
* Bytes.validate(Bytes.from([1, 2, 3]))
* // @log: true
* ```
*
* @param value - Value to check.
* @returns `true` if the value is {@link ox#Bytes.Bytes}, otherwise `false`.
*/
function validate(value) {
	try {
		assert$2(value);
		return true;
	} catch {
		return false;
	}
}
/**
* Thrown when a value cannot be converted to bytes.
*
* @example
* ```ts twoslash
* // @noErrors
* import { Bytes } from 'ox'
*
* Bytes.from('foo')
* // @error: Bytes.InvalidBytesTypeError: Value `foo` of type `string` is an invalid Bytes value.
* ```
*/
var InvalidBytesTypeError = class extends BaseError {
	constructor(value) {
		super(`Value \`${typeof value === "object" ? stringify(value) : value}\` of type \`${typeof value}\` is an invalid Bytes value.`, { metaMessages: ["Bytes values must be of type `Bytes`."] });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Bytes.InvalidBytesTypeError"
		});
	}
};
/**
* Thrown when a size exceeds the maximum allowed size.
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* Bytes.fromString('Hello World!', { size: 8 })
* // @error: Bytes.SizeOverflowError: Size cannot exceed `8` bytes. Given size: `12` bytes.
* ```
*/
var SizeOverflowError = class extends BaseError {
	constructor({ givenSize, maxSize }) {
		super(`Size cannot exceed \`${maxSize}\` bytes. Given size: \`${givenSize}\` bytes.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Bytes.SizeOverflowError"
		});
	}
};
/**
* Thrown when a slice offset is out-of-bounds.
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* Bytes.slice(Bytes.from([1, 2, 3]), 4)
* // @error: Bytes.SliceOffsetOutOfBoundsError: Slice starting at offset `4` is out-of-bounds (size: `3`).
* ```
*/
var SliceOffsetOutOfBoundsError = class extends BaseError {
	constructor({ offset, position, size }) {
		super(`Slice ${position === "start" ? "starting" : "ending"} at offset \`${offset}\` is out-of-bounds (size: \`${size}\`).`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Bytes.SliceOffsetOutOfBoundsError"
		});
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/ox/_esm/core/Hash.js
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
function sha256$2(value, options = {}) {
	const { as = typeof value === "string" ? "Hex" : "Bytes" } = options;
	const bytes = sha256$3(from$1(value));
	if (as === "Bytes") return bytes;
	return fromBytes$2(bytes);
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/ox/_esm/core/PublicKey.js
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
function assert$1(publicKey, options = {}) {
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
function from(value) {
	const publicKey = (() => {
		if (validate$1(value)) return fromHex$2(value);
		if (validate(value)) return fromBytes$1(value);
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
	assert$1(publicKey);
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
		x: BigInt(slice$1(publicKey, 0, 32)),
		y: BigInt(slice$1(publicKey, 32, 64))
	};
	if (publicKey.length === 132) return {
		prefix: Number(slice$1(publicKey, 0, 1)),
		x: BigInt(slice$1(publicKey, 1, 33)),
		y: BigInt(slice$1(publicKey, 33, 65))
	};
	return {
		prefix: Number(slice$1(publicKey, 0, 1)),
		x: BigInt(slice$1(publicKey, 1, 33))
	};
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
function toHex$1(publicKey, options = {}) {
	assert$1(publicKey);
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
		super(`Value \`${publicKey}\` is an invalid public key size.`, { metaMessages: ["Expected: 33 bytes (compressed + prefix), 64 bytes (uncompressed) or 65 bytes (uncompressed + prefix).", `Received ${size$1(from$2(publicKey))} bytes.`] });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "PublicKey.InvalidSerializedSizeError"
		});
	}
};
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
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/curves/node_modules/@noble/hashes/esm/_md.js
/**
* Internal Merkle-Damgard hash utils.
* @module
*/
/** Polyfill for Safari 14. https://caniuse.com/mdn-javascript_builtins_dataview_setbiguint64 */
function setBigUint64$1(view, byteOffset, value, isLE) {
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
function Chi$1(a, b, c) {
	return a & b ^ ~a & c;
}
/** Majority function, true if any two inputs is true. */
function Maj$1(a, b, c) {
	return a & b ^ a & c ^ b & c;
}
/**
* Merkle-Damgard hash construction base class.
* Could be used to create MD5, RIPEMD, SHA1, SHA2.
*/
var HashMD$1 = class extends Hash$1 {
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
		this.view = createView$1(this.buffer);
	}
	update(data) {
		aexists(this);
		data = toBytes$1(data);
		abytes$1(data);
		const { view, buffer, blockLen } = this;
		const len = data.length;
		for (let pos = 0; pos < len;) {
			const take = Math.min(blockLen - this.pos, len - pos);
			if (take === blockLen) {
				const dataView = createView$1(data);
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
		setBigUint64$1(view, blockLen - 8, BigInt(this.length * 8), isLE);
		this.process(view, 0);
		const oview = createView$1(out);
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
var SHA256_IV$1 = /* @__PURE__ */ Uint32Array.from([
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
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/curves/node_modules/@noble/hashes/esm/_u64.js
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
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/curves/node_modules/@noble/hashes/esm/sha2.js
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
var SHA256_K$1 = /* @__PURE__ */ Uint32Array.from([
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
var SHA256_W$1 = /* @__PURE__ */ new Uint32Array(64);
var SHA256$1 = class extends HashMD$1 {
	constructor(outputLen = 32) {
		super(64, outputLen, 8, false);
		this.A = SHA256_IV$1[0] | 0;
		this.B = SHA256_IV$1[1] | 0;
		this.C = SHA256_IV$1[2] | 0;
		this.D = SHA256_IV$1[3] | 0;
		this.E = SHA256_IV$1[4] | 0;
		this.F = SHA256_IV$1[5] | 0;
		this.G = SHA256_IV$1[6] | 0;
		this.H = SHA256_IV$1[7] | 0;
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
		for (let i = 0; i < 16; i++, offset += 4) SHA256_W$1[i] = view.getUint32(offset, false);
		for (let i = 16; i < 64; i++) {
			const W15 = SHA256_W$1[i - 15];
			const W2 = SHA256_W$1[i - 2];
			const s0 = rotr$1(W15, 7) ^ rotr$1(W15, 18) ^ W15 >>> 3;
			SHA256_W$1[i] = (rotr$1(W2, 17) ^ rotr$1(W2, 19) ^ W2 >>> 10) + SHA256_W$1[i - 7] + s0 + SHA256_W$1[i - 16] | 0;
		}
		let { A, B, C, D, E, F, G, H } = this;
		for (let i = 0; i < 64; i++) {
			const sigma1 = rotr$1(E, 6) ^ rotr$1(E, 11) ^ rotr$1(E, 25);
			const T1 = H + sigma1 + Chi$1(E, F, G) + SHA256_K$1[i] + SHA256_W$1[i] | 0;
			const T2 = (rotr$1(A, 2) ^ rotr$1(A, 13) ^ rotr$1(A, 22)) + Maj$1(A, B, C) | 0;
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
		clean(SHA256_W$1);
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
var SHA512 = class extends HashMD$1 {
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
var sha256$1 = /* @__PURE__ */ createHasher$1(() => new SHA256$1());
/** SHA2-512 hash function from RFC 4634. */
var sha512 = /* @__PURE__ */ createHasher$1(() => new SHA512());
/** SHA2-384 hash function from RFC 4634. */
var sha384 = /* @__PURE__ */ createHasher$1(() => new SHA384());
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/curves/node_modules/@noble/hashes/esm/hmac.js
/**
* HMAC: RFC2104 message authentication code.
* @module
*/
var HMAC = class extends Hash$1 {
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
		abytes$1(out, this.outputLen);
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
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/curves/esm/abstract/modular.js
/**
* Utils for modular division and fields.
* Field over 11 is a finite (Galois) field is integer number operations `mod 11`.
* There is no division: it is replaced by modular multiplicative inverse.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n$2 = BigInt(0), _1n$2 = BigInt(1), _2n$2 = /* @__PURE__ */ BigInt(2), _3n$1 = /* @__PURE__ */ BigInt(3);
var _4n$1 = /* @__PURE__ */ BigInt(4), _5n = /* @__PURE__ */ BigInt(5), _7n = /* @__PURE__ */ BigInt(7);
var _8n = /* @__PURE__ */ BigInt(8), _9n = /* @__PURE__ */ BigInt(9), _16n = /* @__PURE__ */ BigInt(16);
function mod(a, b) {
	const result = a % b;
	return result >= _0n$2 ? result : b + result;
}
/** Does `x^(2^power)` mod p. `pow2(30, 4)` == `30^(2^4)` */
function pow2(x, power, modulo) {
	let res = x;
	while (power-- > _0n$2) {
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
	if (number === _0n$2) throw new Error("invert: expected non-zero number");
	if (modulo <= _0n$2) throw new Error("invert: expected positive modulus, got " + modulo);
	let a = mod(number, modulo);
	let b = modulo;
	let x = _0n$2, y = _1n$2, u = _1n$2, v = _0n$2;
	while (a !== _0n$2) {
		const q = b / a;
		const r = b % a;
		const m = x - u * q;
		const n = y - v * q;
		b = a, a = r, x = u, y = v, u = m, v = n;
	}
	if (b !== _1n$2) throw new Error("invert: does not exist");
	return mod(x, modulo);
}
function assertIsSquare(Fp, root, n) {
	if (!Fp.eql(Fp.sqr(root), n)) throw new Error("Cannot find square root");
}
function sqrt3mod4(Fp, n) {
	const p1div4 = (Fp.ORDER + _1n$2) / _4n$1;
	const root = Fp.pow(n, p1div4);
	assertIsSquare(Fp, root, n);
	return root;
}
function sqrt5mod8(Fp, n) {
	const p5div8 = (Fp.ORDER - _5n) / _8n;
	const n2 = Fp.mul(n, _2n$2);
	const v = Fp.pow(n2, p5div8);
	const nv = Fp.mul(n, v);
	const i = Fp.mul(Fp.mul(nv, _2n$2), v);
	const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
	assertIsSquare(Fp, root, n);
	return root;
}
function sqrt9mod16(P) {
	const Fp_ = Field(P);
	const tn = tonelliShanks(P);
	const c1 = tn(Fp_, Fp_.neg(Fp_.ONE));
	const c2 = tn(Fp_, c1);
	const c3 = tn(Fp_, Fp_.neg(c1));
	const c4 = (P + _7n) / _16n;
	return (Fp, n) => {
		let tv1 = Fp.pow(n, c4);
		let tv2 = Fp.mul(tv1, c1);
		const tv3 = Fp.mul(tv1, c2);
		const tv4 = Fp.mul(tv1, c3);
		const e1 = Fp.eql(Fp.sqr(tv2), n);
		const e2 = Fp.eql(Fp.sqr(tv3), n);
		tv1 = Fp.cmov(tv1, tv2, e1);
		tv2 = Fp.cmov(tv4, tv3, e2);
		const e3 = Fp.eql(Fp.sqr(tv2), n);
		const root = Fp.cmov(tv1, tv2, e3);
		assertIsSquare(Fp, root, n);
		return root;
	};
}
/**
* Tonelli-Shanks square root search algorithm.
* 1. https://eprint.iacr.org/2012/685.pdf (page 12)
* 2. Square Roots from 1; 24, 51, 10 to Dan Shanks
* @param P field order
* @returns function that takes field Fp (created from P) and number n
*/
function tonelliShanks(P) {
	if (P < _3n$1) throw new Error("sqrt is not defined for small field");
	let Q = P - _1n$2;
	let S = 0;
	while (Q % _2n$2 === _0n$2) {
		Q /= _2n$2;
		S++;
	}
	let Z = _2n$2;
	const _Fp = Field(P);
	while (FpLegendre(_Fp, Z) === 1) if (Z++ > 1e3) throw new Error("Cannot find square root: probably non-prime P");
	if (S === 1) return sqrt3mod4;
	let cc = _Fp.pow(Z, Q);
	const Q1div2 = (Q + _1n$2) / _2n$2;
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
			const exponent = _1n$2 << BigInt(M - i - 1);
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
* 3. P ≡ 9 (mod 16)
* 4. Tonelli-Shanks algorithm
*
* Different algorithms can give different roots, it is up to user to decide which one they want.
* For example there is FpSqrtOdd/FpSqrtEven to choice root based on oddness (used for hash-to-curve).
*/
function FpSqrt(P) {
	if (P % _4n$1 === _3n$1) return sqrt3mod4;
	if (P % _8n === _5n) return sqrt5mod8;
	if (P % _16n === _9n) return sqrt9mod16(P);
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
	_validateObject(field, FIELD_FIELDS.reduce((map, val) => {
		map[val] = "function";
		return map;
	}, {
		ORDER: "bigint",
		MASK: "bigint",
		BYTES: "number",
		BITS: "number"
	}));
	return field;
}
/**
* Same as `pow` but for Fp: non-constant-time.
* Unsafe in some contexts: uses ladder, so can expose bigint bits.
*/
function FpPow(Fp, num, power) {
	if (power < _0n$2) throw new Error("invalid exponent, negatives unsupported");
	if (power === _0n$2) return Fp.ONE;
	if (power === _1n$2) return num;
	let p = Fp.ONE;
	let d = num;
	while (power > _0n$2) {
		if (power & _1n$2) p = Fp.mul(p, d);
		d = Fp.sqr(d);
		power >>= _1n$2;
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
	const p1mod2 = (Fp.ORDER - _1n$2) / _2n$2;
	const powered = Fp.pow(n, p1mod2);
	const yes = Fp.eql(powered, Fp.ONE);
	const zero = Fp.eql(powered, Fp.ZERO);
	const no = Fp.eql(powered, Fp.neg(Fp.ONE));
	if (!yes && !zero && !no) throw new Error("invalid Legendre symbol result");
	return yes ? 1 : zero ? 0 : -1;
}
function nLength(n, nBitLength) {
	if (nBitLength !== void 0) anumber$1(nBitLength);
	const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
	return {
		nBitLength: _nBitLength,
		nByteLength: Math.ceil(_nBitLength / 8)
	};
}
/**
* Creates a finite field. Major performance optimizations:
* * 1. Denormalized operations like mulN instead of mul.
* * 2. Identical object shape: never add or remove keys.
* * 3. `Object.freeze`.
* Fragile: always run a benchmark on a change.
* Security note: operations don't check 'isValid' for all elements for performance reasons,
* it is caller responsibility to check this.
* This is low-level code, please make sure you know what you're doing.
*
* Note about field properties:
* * CHARACTERISTIC p = prime number, number of elements in main subgroup.
* * ORDER q = similar to cofactor in curves, may be composite `q = p^m`.
*
* @param ORDER field order, probably prime, or could be composite
* @param bitLen how many bits the field consumes
* @param isLE (default: false) if encoding / decoding should be in little-endian
* @param redef optional faster redefinitions of sqrt and other methods
*/
function Field(ORDER, bitLenOrOpts, isLE = false, opts = {}) {
	if (ORDER <= _0n$2) throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
	let _nbitLength = void 0;
	let _sqrt = void 0;
	let modFromBytes = false;
	let allowedLengths = void 0;
	if (typeof bitLenOrOpts === "object" && bitLenOrOpts != null) {
		if (opts.sqrt || isLE) throw new Error("cannot specify opts in two arguments");
		const _opts = bitLenOrOpts;
		if (_opts.BITS) _nbitLength = _opts.BITS;
		if (_opts.sqrt) _sqrt = _opts.sqrt;
		if (typeof _opts.isLE === "boolean") isLE = _opts.isLE;
		if (typeof _opts.modFromBytes === "boolean") modFromBytes = _opts.modFromBytes;
		allowedLengths = _opts.allowedLengths;
	} else {
		if (typeof bitLenOrOpts === "number") _nbitLength = bitLenOrOpts;
		if (opts.sqrt) _sqrt = opts.sqrt;
	}
	const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, _nbitLength);
	if (BYTES > 2048) throw new Error("invalid field: expected ORDER of <= 2048 bytes");
	let sqrtP;
	const f = Object.freeze({
		ORDER,
		isLE,
		BITS,
		BYTES,
		MASK: bitMask$1(BITS),
		ZERO: _0n$2,
		ONE: _1n$2,
		allowedLengths,
		create: (num) => mod(num, ORDER),
		isValid: (num) => {
			if (typeof num !== "bigint") throw new Error("invalid field element: expected bigint, got " + typeof num);
			return _0n$2 <= num && num < ORDER;
		},
		is0: (num) => num === _0n$2,
		isValidNot0: (num) => !f.is0(num) && f.isValid(num),
		isOdd: (num) => (num & _1n$2) === _1n$2,
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
		sqrt: _sqrt || ((n) => {
			if (!sqrtP) sqrtP = FpSqrt(ORDER);
			return sqrtP(f, n);
		}),
		toBytes: (num) => isLE ? numberToBytesLE$1(num, BYTES) : numberToBytesBE$1(num, BYTES),
		fromBytes: (bytes, skipValidation = true) => {
			if (allowedLengths) {
				if (!allowedLengths.includes(bytes.length) || bytes.length > BYTES) throw new Error("Field.fromBytes: expected " + allowedLengths + " bytes, got " + bytes.length);
				const padded = new Uint8Array(BYTES);
				padded.set(bytes, isLE ? 0 : padded.length - bytes.length);
				bytes = padded;
			}
			if (bytes.length !== BYTES) throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
			let scalar = isLE ? bytesToNumberLE$1(bytes) : bytesToNumberBE$1(bytes);
			if (modFromBytes) scalar = mod(scalar, ORDER);
			if (!skipValidation) {
				if (!f.isValid(scalar)) throw new Error("invalid field element: outside of range 0..ORDER");
			}
			return scalar;
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
	const reduced = mod(isLE ? bytesToNumberLE$1(key) : bytesToNumberBE$1(key), fieldOrder - _1n$2) + _1n$2;
	return isLE ? numberToBytesLE$1(reduced, fieldLen) : numberToBytesBE$1(reduced, fieldLen);
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/curves/esm/abstract/curve.js
/**
* Methods for elliptic curve multiplication by scalars.
* Contains wNAF, pippenger.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n$1 = BigInt(0);
var _1n$1 = BigInt(1);
function negateCt(condition, item) {
	const neg = item.negate();
	return condition ? neg : item;
}
/**
* Takes a bunch of Projective Points but executes only one
* inversion on all of them. Inversion is very slow operation,
* so this improves performance massively.
* Optimization: converts a list of projective points to a list of identical points with Z=1.
*/
function normalizeZ(c, points) {
	const invertedZs = FpInvertBatch(c.Fp, points.map((p) => p.Z));
	return points.map((p, i) => c.fromAffine(p.toAffine(invertedZs[i])));
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
		mask: bitMask$1(W),
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
		nextN += _1n$1;
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
function assert0(n) {
	if (n !== _0n$1) throw new Error("invalid wNAF");
}
/**
* Elliptic curve multiplication of Point by scalar. Fragile.
* Table generation takes **30MB of ram and 10ms on high-end CPU**,
* but may take much longer on slow devices. Actual generation will happen on
* first call of `multiply()`. By default, `BASE` point is precomputed.
*
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
var wNAF = class {
	constructor(Point, bits) {
		this.BASE = Point.BASE;
		this.ZERO = Point.ZERO;
		this.Fn = Point.Fn;
		this.bits = bits;
	}
	_unsafeLadder(elm, n, p = this.ZERO) {
		let d = elm;
		while (n > _0n$1) {
			if (n & _1n$1) p = p.add(d);
			d = d.double();
			n >>= _1n$1;
		}
		return p;
	}
	/**
	* Creates a wNAF precomputation window. Used for caching.
	* Default window size is set by `utils.precompute()` and is equal to 8.
	* Number of precomputed points depends on the curve size:
	* 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
	* - 𝑊 is the window size
	* - 𝑛 is the bitlength of the curve order.
	* For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
	* @param point Point instance
	* @param W window size
	* @returns precomputed point tables flattened to a single array
	*/
	precomputeWindow(point, W) {
		const { windows, windowSize } = calcWOpts(W, this.bits);
		const points = [];
		let p = point;
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
	}
	/**
	* Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
	* More compact implementation:
	* https://github.com/paulmillr/noble-secp256k1/blob/47cb1669b6e506ad66b35fe7d76132ae97465da2/index.ts#L502-L541
	* @returns real and fake (for const-time) points
	*/
	wNAF(W, precomputes, n) {
		if (!this.Fn.isValid(n)) throw new Error("invalid scalar");
		let p = this.ZERO;
		let f = this.BASE;
		const wo = calcWOpts(W, this.bits);
		for (let window = 0; window < wo.windows; window++) {
			const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n, window, wo);
			n = nextN;
			if (isZero) f = f.add(negateCt(isNegF, precomputes[offsetF]));
			else p = p.add(negateCt(isNeg, precomputes[offset]));
		}
		assert0(n);
		return {
			p,
			f
		};
	}
	/**
	* Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
	* @param acc accumulator point to add result of multiplication
	* @returns point
	*/
	wNAFUnsafe(W, precomputes, n, acc = this.ZERO) {
		const wo = calcWOpts(W, this.bits);
		for (let window = 0; window < wo.windows; window++) {
			if (n === _0n$1) break;
			const { nextN, offset, isZero, isNeg } = calcOffsets(n, window, wo);
			n = nextN;
			if (isZero) continue;
			else {
				const item = precomputes[offset];
				acc = acc.add(isNeg ? item.negate() : item);
			}
		}
		assert0(n);
		return acc;
	}
	getPrecomputes(W, point, transform) {
		let comp = pointPrecomputes.get(point);
		if (!comp) {
			comp = this.precomputeWindow(point, W);
			if (W !== 1) {
				if (typeof transform === "function") comp = transform(comp);
				pointPrecomputes.set(point, comp);
			}
		}
		return comp;
	}
	cached(point, scalar, transform) {
		const W = getW(point);
		return this.wNAF(W, this.getPrecomputes(W, point, transform), scalar);
	}
	unsafe(point, scalar, transform, prev) {
		const W = getW(point);
		if (W === 1) return this._unsafeLadder(point, scalar, prev);
		return this.wNAFUnsafe(W, this.getPrecomputes(W, point, transform), scalar, prev);
	}
	createCache(P, W) {
		validateW(W, this.bits);
		pointWindowSizes.set(P, W);
		pointPrecomputes.delete(P);
	}
	hasCache(elm) {
		return getW(elm) !== 1;
	}
};
/**
* Endomorphism-specific multiplication for Koblitz curves.
* Cost: 128 dbl, 0-256 adds.
*/
function mulEndoUnsafe(Point, point, k1, k2) {
	let acc = point;
	let p1 = Point.ZERO;
	let p2 = Point.ZERO;
	while (k1 > _0n$1 || k2 > _0n$1) {
		if (k1 & _1n$1) p1 = p1.add(acc);
		if (k2 & _1n$1) p2 = p2.add(acc);
		acc = acc.double();
		k1 >>= _1n$1;
		k2 >>= _1n$1;
	}
	return {
		p1,
		p2
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
* @param scalars array of L scalars (aka secret keys / bigints)
*/
function pippenger(c, fieldN, points, scalars) {
	validateMSMPoints(points, c);
	validateMSMScalars(scalars, fieldN);
	const plength = points.length;
	const slength = scalars.length;
	if (plength !== slength) throw new Error("arrays of points and scalars must have equal length");
	const zero = c.ZERO;
	const wbits = bitLen$1(BigInt(plength));
	let windowSize = 1;
	if (wbits > 12) windowSize = wbits - 3;
	else if (wbits > 4) windowSize = wbits - 2;
	else if (wbits > 0) windowSize = 2;
	const MASK = bitMask$1(windowSize);
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
function createField(order, field, isLE) {
	if (field) {
		if (field.ORDER !== order) throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
		validateField(field);
		return field;
	} else return Field(order, { isLE });
}
/** Validates CURVE opts and creates fields */
function _createCurveFields(type, CURVE, curveOpts = {}, FpFnLE) {
	if (FpFnLE === void 0) FpFnLE = type === "edwards";
	if (!CURVE || typeof CURVE !== "object") throw new Error(`expected valid ${type} CURVE object`);
	for (const p of [
		"p",
		"n",
		"h"
	]) {
		const val = CURVE[p];
		if (!(typeof val === "bigint" && val > _0n$1)) throw new Error(`CURVE.${p} must be positive bigint`);
	}
	const Fp = createField(CURVE.p, curveOpts.Fp, FpFnLE);
	const Fn = createField(CURVE.n, curveOpts.Fn, FpFnLE);
	const params = [
		"Gx",
		"Gy",
		"a",
		type === "weierstrass" ? "b" : "d"
	];
	for (const p of params) if (!Fp.isValid(CURVE[p])) throw new Error(`CURVE.${p} must be valid field element of CURVE.Fp`);
	CURVE = Object.freeze(Object.assign({}, CURVE));
	return {
		CURVE,
		Fp,
		Fn
	};
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/curves/esm/abstract/weierstrass.js
/**
* Short Weierstrass curve methods. The formula is: y² = x³ + ax + b.
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
var divNearest = (num, den) => (num + (num >= 0 ? den : -den) / _2n$1) / den;
/**
* Splits scalar for GLV endomorphism.
*/
function _splitEndoScalar(k, basis, n) {
	const [[a1, b1], [a2, b2]] = basis;
	const c1 = divNearest(b2 * k, n);
	const c2 = divNearest(-b1 * k, n);
	let k1 = k - c1 * a1 - c2 * a2;
	let k2 = -c1 * b1 - c2 * b2;
	const k1neg = k1 < _0n;
	const k2neg = k2 < _0n;
	if (k1neg) k1 = -k1;
	if (k2neg) k2 = -k2;
	const MAX_NUM = bitMask$1(Math.ceil(bitLen$1(n) / 2)) + _1n;
	if (k1 < _0n || k1 >= MAX_NUM || k2 < _0n || k2 >= MAX_NUM) throw new Error("splitScalar (endomorphism): failed, k=" + k);
	return {
		k1neg,
		k1,
		k2neg,
		k2
	};
}
function validateSigFormat(format) {
	if (![
		"compact",
		"recovered",
		"der"
	].includes(format)) throw new Error("Signature format must be \"compact\", \"recovered\", or \"der\"");
	return format;
}
function validateSigOpts(opts, def) {
	const optsn = {};
	for (let optName of Object.keys(def)) optsn[optName] = opts[optName] === void 0 ? def[optName] : opts[optName];
	_abool2(optsn.lowS, "lowS");
	_abool2(optsn.prehash, "prehash");
	if (optsn.format !== void 0) validateSigFormat(optsn.format);
	return optsn;
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
			const len = numberToHexUnpadded$1(dataLen);
			if (len.length / 2 & 128) throw new E("tlv.encode: long form length too big");
			const lenLen = dataLen > 127 ? numberToHexUnpadded$1(len.length / 2 | 128) : "";
			return numberToHexUnpadded$1(tag) + lenLen + len + data;
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
			if (num < _0n) throw new E("integer: negative integers are not allowed");
			let hex = numberToHexUnpadded$1(num);
			if (Number.parseInt(hex[0], 16) & 8) hex = "00" + hex;
			if (hex.length & 1) throw new E("unexpected DER parsing assertion: unpadded hex");
			return hex;
		},
		decode(data) {
			const { Err: E } = DER;
			if (data[0] & 128) throw new E("invalid signature integer: negative");
			if (data[0] === 0 && !(data[1] & 128)) throw new E("invalid signature integer: unnecessary leading zero");
			return bytesToNumberBE$1(data);
		}
	},
	toSig(hex) {
		const { Err: E, _int: int, _tlv: tlv } = DER;
		const data = ensureBytes$1("signature", hex);
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
var _0n = BigInt(0), _1n = BigInt(1), _2n$1 = BigInt(2), _3n = BigInt(3), _4n = BigInt(4);
function _normFnElement(Fn, key) {
	const { BYTES: expected } = Fn;
	let num;
	if (typeof key === "bigint") num = key;
	else {
		let bytes = ensureBytes$1("private key", key);
		try {
			num = Fn.fromBytes(bytes);
		} catch (error) {
			throw new Error(`invalid private key: expected ui8a of size ${expected}, got ${typeof key}`);
		}
	}
	if (!Fn.isValidNot0(num)) throw new Error("invalid private key: out of range [1..N-1]");
	return num;
}
/**
* Creates weierstrass Point constructor, based on specified curve options.
*
* @example
```js
const opts = {
p: BigInt('0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff'),
n: BigInt('0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551'),
h: BigInt(1),
a: BigInt('0xffffffff00000001000000000000000000000000fffffffffffffffffffffffc'),
b: BigInt('0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b'),
Gx: BigInt('0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296'),
Gy: BigInt('0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5'),
};
const p256_Point = weierstrass(opts);
```
*/
function weierstrassN(params, extraOpts = {}) {
	const validated = _createCurveFields("weierstrass", params, extraOpts);
	const { Fp, Fn } = validated;
	let CURVE = validated.CURVE;
	const { h: cofactor, n: CURVE_ORDER } = CURVE;
	_validateObject(extraOpts, {}, {
		allowInfinityPoint: "boolean",
		clearCofactor: "function",
		isTorsionFree: "function",
		fromBytes: "function",
		toBytes: "function",
		endo: "object",
		wrapPrivateKey: "boolean"
	});
	const { endo } = extraOpts;
	if (endo) {
		if (!Fp.is0(CURVE.a) || typeof endo.beta !== "bigint" || !Array.isArray(endo.basises)) throw new Error("invalid endo: expected \"beta\": bigint and \"basises\": array");
	}
	const lengths = getWLengths(Fp, Fn);
	function assertCompressionIsSupported() {
		if (!Fp.isOdd) throw new Error("compression is not supported: Field does not have .isOdd()");
	}
	function pointToBytes(_c, point, isCompressed) {
		const { x, y } = point.toAffine();
		const bx = Fp.toBytes(x);
		_abool2(isCompressed, "isCompressed");
		if (isCompressed) {
			assertCompressionIsSupported();
			return concatBytes$1(pprefix(!Fp.isOdd(y)), bx);
		} else return concatBytes$1(Uint8Array.of(4), bx, Fp.toBytes(y));
	}
	function pointFromBytes(bytes) {
		_abytes2(bytes, void 0, "Point");
		const { publicKey: comp, publicKeyUncompressed: uncomp } = lengths;
		const length = bytes.length;
		const head = bytes[0];
		const tail = bytes.subarray(1);
		if (length === comp && (head === 2 || head === 3)) {
			const x = Fp.fromBytes(tail);
			if (!Fp.isValid(x)) throw new Error("bad point: is not on curve, wrong x");
			const y2 = weierstrassEquation(x);
			let y;
			try {
				y = Fp.sqrt(y2);
			} catch (sqrtError) {
				const err = sqrtError instanceof Error ? ": " + sqrtError.message : "";
				throw new Error("bad point: is not on curve, sqrt error" + err);
			}
			assertCompressionIsSupported();
			const isYOdd = Fp.isOdd(y);
			if ((head & 1) === 1 !== isYOdd) y = Fp.neg(y);
			return {
				x,
				y
			};
		} else if (length === uncomp && head === 4) {
			const L = Fp.BYTES;
			const x = Fp.fromBytes(tail.subarray(0, L));
			const y = Fp.fromBytes(tail.subarray(L, L * 2));
			if (!isValidXY(x, y)) throw new Error("bad point: is not on curve");
			return {
				x,
				y
			};
		} else throw new Error(`bad point: got length ${length}, expected compressed=${comp} or uncompressed=${uncomp}`);
	}
	const encodePoint = extraOpts.toBytes || pointToBytes;
	const decodePoint = extraOpts.fromBytes || pointFromBytes;
	function weierstrassEquation(x) {
		const x2 = Fp.sqr(x);
		const x3 = Fp.mul(x2, x);
		return Fp.add(Fp.add(x3, Fp.mul(x, CURVE.a)), CURVE.b);
	}
	/** Checks whether equation holds for given x, y: y² == x³ + ax + b */
	function isValidXY(x, y) {
		const left = Fp.sqr(y);
		const right = weierstrassEquation(x);
		return Fp.eql(left, right);
	}
	if (!isValidXY(CURVE.Gx, CURVE.Gy)) throw new Error("bad curve params: generator point");
	const _4a3 = Fp.mul(Fp.pow(CURVE.a, _3n), _4n);
	const _27b2 = Fp.mul(Fp.sqr(CURVE.b), BigInt(27));
	if (Fp.is0(Fp.add(_4a3, _27b2))) throw new Error("bad curve params: a or b");
	/** Asserts coordinate is valid: 0 <= n < Fp.ORDER. */
	function acoord(title, n, banZero = false) {
		if (!Fp.isValid(n) || banZero && Fp.is0(n)) throw new Error(`bad point coordinate ${title}`);
		return n;
	}
	function aprjpoint(other) {
		if (!(other instanceof Point)) throw new Error("ProjectivePoint expected");
	}
	function splitEndoScalarN(k) {
		if (!endo || !endo.basises) throw new Error("no endo");
		return _splitEndoScalar(k, endo.basises, Fn.ORDER);
	}
	const toAffineMemo = memoized$1((p, iz) => {
		const { X, Y, Z } = p;
		if (Fp.eql(Z, Fp.ONE)) return {
			x: X,
			y: Y
		};
		const is0 = p.is0();
		if (iz == null) iz = is0 ? Fp.ONE : Fp.inv(Z);
		const x = Fp.mul(X, iz);
		const y = Fp.mul(Y, iz);
		const zz = Fp.mul(Z, iz);
		if (is0) return {
			x: Fp.ZERO,
			y: Fp.ZERO
		};
		if (!Fp.eql(zz, Fp.ONE)) throw new Error("invZ was invalid");
		return {
			x,
			y
		};
	});
	const assertValidMemo = memoized$1((p) => {
		if (p.is0()) {
			if (extraOpts.allowInfinityPoint && !Fp.is0(p.Y)) return;
			throw new Error("bad point: ZERO");
		}
		const { x, y } = p.toAffine();
		if (!Fp.isValid(x) || !Fp.isValid(y)) throw new Error("bad point: x or y not field elements");
		if (!isValidXY(x, y)) throw new Error("bad point: equation left != right");
		if (!p.isTorsionFree()) throw new Error("bad point: not in prime-order subgroup");
		return true;
	});
	function finishEndo(endoBeta, k1p, k2p, k1neg, k2neg) {
		k2p = new Point(Fp.mul(k2p.X, endoBeta), k2p.Y, k2p.Z);
		k1p = negateCt(k1neg, k1p);
		k2p = negateCt(k2neg, k2p);
		return k1p.add(k2p);
	}
	/**
	* Projective Point works in 3d / projective (homogeneous) coordinates:(X, Y, Z) ∋ (x=X/Z, y=Y/Z).
	* Default Point works in 2d / affine coordinates: (x, y).
	* We're doing calculations in projective, because its operations don't require costly inversion.
	*/
	class Point {
		/** Does NOT validate if the point is valid. Use `.assertValidity()`. */
		constructor(X, Y, Z) {
			this.X = acoord("x", X);
			this.Y = acoord("y", Y, true);
			this.Z = acoord("z", Z);
			Object.freeze(this);
		}
		static CURVE() {
			return CURVE;
		}
		/** Does NOT validate if the point is valid. Use `.assertValidity()`. */
		static fromAffine(p) {
			const { x, y } = p || {};
			if (!p || !Fp.isValid(x) || !Fp.isValid(y)) throw new Error("invalid affine point");
			if (p instanceof Point) throw new Error("projective point not allowed");
			if (Fp.is0(x) && Fp.is0(y)) return Point.ZERO;
			return new Point(x, y, Fp.ONE);
		}
		static fromBytes(bytes) {
			const P = Point.fromAffine(decodePoint(_abytes2(bytes, void 0, "point")));
			P.assertValidity();
			return P;
		}
		static fromHex(hex) {
			return Point.fromBytes(ensureBytes$1("pointHex", hex));
		}
		get x() {
			return this.toAffine().x;
		}
		get y() {
			return this.toAffine().y;
		}
		/**
		*
		* @param windowSize
		* @param isLazy true will defer table computation until the first multiplication
		* @returns
		*/
		precompute(windowSize = 8, isLazy = true) {
			wnaf.createCache(this, windowSize);
			if (!isLazy) this.multiply(_3n);
			return this;
		}
		/** A point on curve is valid if it conforms to equation. */
		assertValidity() {
			assertValidMemo(this);
		}
		hasEvenY() {
			const { y } = this.toAffine();
			if (!Fp.isOdd) throw new Error("Field doesn't support isOdd");
			return !Fp.isOdd(y);
		}
		/** Compare one point to another. */
		equals(other) {
			aprjpoint(other);
			const { X: X1, Y: Y1, Z: Z1 } = this;
			const { X: X2, Y: Y2, Z: Z2 } = other;
			const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
			const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
			return U1 && U2;
		}
		/** Flips point to one corresponding to (x, -y) in Affine coordinates. */
		negate() {
			return new Point(this.X, Fp.neg(this.Y), this.Z);
		}
		double() {
			const { a, b } = CURVE;
			const b3 = Fp.mul(b, _3n);
			const { X: X1, Y: Y1, Z: Z1 } = this;
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
			const { X: X1, Y: Y1, Z: Z1 } = this;
			const { X: X2, Y: Y2, Z: Z2 } = other;
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
			const { endo } = extraOpts;
			if (!Fn.isValidNot0(scalar)) throw new Error("invalid scalar: out of range");
			let point, fake;
			const mul = (n) => wnaf.cached(this, n, (p) => normalizeZ(Point, p));
			/** See docs for {@link EndomorphismOpts} */
			if (endo) {
				const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(scalar);
				const { p: k1p, f: k1f } = mul(k1);
				const { p: k2p, f: k2f } = mul(k2);
				fake = k1f.add(k2f);
				point = finishEndo(endo.beta, k1p, k2p, k1neg, k2neg);
			} else {
				const { p, f } = mul(scalar);
				point = p;
				fake = f;
			}
			return normalizeZ(Point, [point, fake])[0];
		}
		/**
		* Non-constant-time multiplication. Uses double-and-add algorithm.
		* It's faster, but should only be used when you don't care about
		* an exposed secret key e.g. sig verification, which works over *public* keys.
		*/
		multiplyUnsafe(sc) {
			const { endo } = extraOpts;
			const p = this;
			if (!Fn.isValid(sc)) throw new Error("invalid scalar: out of range");
			if (sc === _0n || p.is0()) return Point.ZERO;
			if (sc === _1n) return p;
			if (wnaf.hasCache(this)) return this.multiply(sc);
			if (endo) {
				const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(sc);
				const { p1, p2 } = mulEndoUnsafe(Point, p, k1, k2);
				return finishEndo(endo.beta, p1, p2, k1neg, k2neg);
			} else return wnaf.unsafe(p, sc);
		}
		multiplyAndAddUnsafe(Q, a, b) {
			const sum = this.multiplyUnsafe(a).add(Q.multiplyUnsafe(b));
			return sum.is0() ? void 0 : sum;
		}
		/**
		* Converts Projective point to affine (x, y) coordinates.
		* @param invertedZ Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
		*/
		toAffine(invertedZ) {
			return toAffineMemo(this, invertedZ);
		}
		/**
		* Checks whether Point is free of torsion elements (is in prime subgroup).
		* Always torsion-free for cofactor=1 curves.
		*/
		isTorsionFree() {
			const { isTorsionFree } = extraOpts;
			if (cofactor === _1n) return true;
			if (isTorsionFree) return isTorsionFree(Point, this);
			return wnaf.unsafe(this, CURVE_ORDER).is0();
		}
		clearCofactor() {
			const { clearCofactor } = extraOpts;
			if (cofactor === _1n) return this;
			if (clearCofactor) return clearCofactor(Point, this);
			return this.multiplyUnsafe(cofactor);
		}
		isSmallOrder() {
			return this.multiplyUnsafe(cofactor).is0();
		}
		toBytes(isCompressed = true) {
			_abool2(isCompressed, "isCompressed");
			this.assertValidity();
			return encodePoint(Point, this, isCompressed);
		}
		toHex(isCompressed = true) {
			return bytesToHex$2(this.toBytes(isCompressed));
		}
		toString() {
			return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
		}
		get px() {
			return this.X;
		}
		get py() {
			return this.X;
		}
		get pz() {
			return this.Z;
		}
		toRawBytes(isCompressed = true) {
			return this.toBytes(isCompressed);
		}
		_setWindowSize(windowSize) {
			this.precompute(windowSize);
		}
		static normalizeZ(points) {
			return normalizeZ(Point, points);
		}
		static msm(points, scalars) {
			return pippenger(Point, Fn, points, scalars);
		}
		static fromPrivateKey(privateKey) {
			return Point.BASE.multiply(_normFnElement(Fn, privateKey));
		}
	}
	Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
	Point.ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO);
	Point.Fp = Fp;
	Point.Fn = Fn;
	const bits = Fn.BITS;
	const wnaf = new wNAF(Point, extraOpts.endo ? Math.ceil(bits / 2) : bits);
	Point.BASE.precompute(8);
	return Point;
}
function pprefix(hasEvenY) {
	return Uint8Array.of(hasEvenY ? 2 : 3);
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
	let l = _0n;
	for (let o = q - _1n; o % _2n$1 === _0n; o /= _2n$1) l += _1n;
	const c1 = l;
	const _2n_pow_c1_1 = _2n$1 << c1 - _1n - _1n;
	const _2n_pow_c1 = _2n_pow_c1_1 * _2n$1;
	const c2 = (q - _1n) / _2n_pow_c1;
	const c3 = (c2 - _1n) / _2n$1;
	const c4 = _2n_pow_c1 - _1n;
	const c5 = _2n_pow_c1_1;
	const c6 = Fp.pow(Z, c2);
	const c7 = Fp.pow(Z, (c2 + _1n) / _2n$1);
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
		for (let i = c1; i > _1n; i--) {
			let tv5 = i - _2n$1;
			tv5 = _2n$1 << tv5 - _1n;
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
	const { A, B, Z } = opts;
	if (!Fp.isValid(A) || !Fp.isValid(B) || !Fp.isValid(Z)) throw new Error("mapToCurveSimpleSWU: invalid opts");
	const sqrtRatio = SWUFpSqrtRatio(Fp, Z);
	if (!Fp.isOdd) throw new Error("Field does not have .isOdd()");
	return (u) => {
		let tv1, tv2, tv3, tv4, tv5, tv6, x, y;
		tv1 = Fp.sqr(u);
		tv1 = Fp.mul(tv1, Z);
		tv2 = Fp.sqr(tv1);
		tv2 = Fp.add(tv2, tv1);
		tv3 = Fp.add(tv2, Fp.ONE);
		tv3 = Fp.mul(tv3, B);
		tv4 = Fp.cmov(Z, Fp.neg(tv2), !Fp.eql(tv2, Fp.ZERO));
		tv4 = Fp.mul(tv4, A);
		tv2 = Fp.sqr(tv3);
		tv6 = Fp.sqr(tv4);
		tv5 = Fp.mul(tv6, A);
		tv2 = Fp.add(tv2, tv5);
		tv2 = Fp.mul(tv2, tv3);
		tv6 = Fp.mul(tv6, tv4);
		tv5 = Fp.mul(tv6, B);
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
function getWLengths(Fp, Fn) {
	return {
		secretKey: Fn.BYTES,
		publicKey: 1 + Fp.BYTES,
		publicKeyUncompressed: 1 + 2 * Fp.BYTES,
		publicKeyHasPrefix: true,
		signature: 2 * Fn.BYTES
	};
}
/**
* Sometimes users only need getPublicKey, getSharedSecret, and secret key handling.
* This helper ensures no signature functionality is present. Less code, smaller bundle size.
*/
function ecdh(Point, ecdhOpts = {}) {
	const { Fn } = Point;
	const randomBytes_ = ecdhOpts.randomBytes || randomBytes$1;
	const lengths = Object.assign(getWLengths(Point.Fp, Fn), { seed: getMinHashLength(Fn.ORDER) });
	function isValidSecretKey(secretKey) {
		try {
			return !!_normFnElement(Fn, secretKey);
		} catch (error) {
			return false;
		}
	}
	function isValidPublicKey(publicKey, isCompressed) {
		const { publicKey: comp, publicKeyUncompressed } = lengths;
		try {
			const l = publicKey.length;
			if (isCompressed === true && l !== comp) return false;
			if (isCompressed === false && l !== publicKeyUncompressed) return false;
			return !!Point.fromBytes(publicKey);
		} catch (error) {
			return false;
		}
	}
	/**
	* Produces cryptographically secure secret key from random of size
	* (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
	*/
	function randomSecretKey(seed = randomBytes_(lengths.seed)) {
		return mapHashToField(_abytes2(seed, lengths.seed, "seed"), Fn.ORDER);
	}
	/**
	* Computes public key for a secret key. Checks for validity of the secret key.
	* @param isCompressed whether to return compact (default), or full key
	* @returns Public key, full when isCompressed=false; short when isCompressed=true
	*/
	function getPublicKey(secretKey, isCompressed = true) {
		return Point.BASE.multiply(_normFnElement(Fn, secretKey)).toBytes(isCompressed);
	}
	function keygen(seed) {
		const secretKey = randomSecretKey(seed);
		return {
			secretKey,
			publicKey: getPublicKey(secretKey)
		};
	}
	/**
	* Quick and dirty check for item being public key. Does not validate hex, or being on-curve.
	*/
	function isProbPub(item) {
		if (typeof item === "bigint") return false;
		if (item instanceof Point) return true;
		const { secretKey, publicKey, publicKeyUncompressed } = lengths;
		if (Fn.allowedLengths || secretKey === publicKey) return void 0;
		const l = ensureBytes$1("key", item).length;
		return l === publicKey || l === publicKeyUncompressed;
	}
	/**
	* ECDH (Elliptic Curve Diffie Hellman).
	* Computes shared public key from secret key A and public key B.
	* Checks: 1) secret key validity 2) shared key is on-curve.
	* Does NOT hash the result.
	* @param isCompressed whether to return compact (default), or full key
	* @returns shared public key
	*/
	function getSharedSecret(secretKeyA, publicKeyB, isCompressed = true) {
		if (isProbPub(secretKeyA) === true) throw new Error("first arg must be private key");
		if (isProbPub(publicKeyB) === false) throw new Error("second arg must be public key");
		const s = _normFnElement(Fn, secretKeyA);
		return Point.fromHex(publicKeyB).multiply(s).toBytes(isCompressed);
	}
	const utils = {
		isValidSecretKey,
		isValidPublicKey,
		randomSecretKey,
		isValidPrivateKey: isValidSecretKey,
		randomPrivateKey: randomSecretKey,
		normPrivateKeyToScalar: (key) => _normFnElement(Fn, key),
		precompute(windowSize = 8, point = Point.BASE) {
			return point.precompute(windowSize, false);
		}
	};
	return Object.freeze({
		getPublicKey,
		getSharedSecret,
		keygen,
		Point,
		utils,
		lengths
	});
}
/**
* Creates ECDSA signing interface for given elliptic curve `Point` and `hash` function.
* We need `hash` for 2 features:
* 1. Message prehash-ing. NOT used if `sign` / `verify` are called with `prehash: false`
* 2. k generation in `sign`, using HMAC-drbg(hash)
*
* ECDSAOpts are only rarely needed.
*
* @example
* ```js
* const p256_Point = weierstrass(...);
* const p256_sha256 = ecdsa(p256_Point, sha256);
* const p256_sha224 = ecdsa(p256_Point, sha224);
* const p256_sha224_r = ecdsa(p256_Point, sha224, { randomBytes: (length) => { ... } });
* ```
*/
function ecdsa(Point, hash, ecdsaOpts = {}) {
	ahash(hash);
	_validateObject(ecdsaOpts, {}, {
		hmac: "function",
		lowS: "boolean",
		randomBytes: "function",
		bits2int: "function",
		bits2int_modN: "function"
	});
	const randomBytes = ecdsaOpts.randomBytes || randomBytes$1;
	const hmac$1 = ecdsaOpts.hmac || ((key, ...msgs) => hmac(hash, key, concatBytes$1(...msgs)));
	const { Fp, Fn } = Point;
	const { ORDER: CURVE_ORDER, BITS: fnBits } = Fn;
	const { keygen, getPublicKey, getSharedSecret, utils, lengths } = ecdh(Point, ecdsaOpts);
	const defaultSigOpts = {
		prehash: false,
		lowS: typeof ecdsaOpts.lowS === "boolean" ? ecdsaOpts.lowS : false,
		format: void 0,
		extraEntropy: false
	};
	const defaultSigOpts_format = "compact";
	function isBiggerThanHalfOrder(number) {
		return number > CURVE_ORDER >> _1n;
	}
	function validateRS(title, num) {
		if (!Fn.isValidNot0(num)) throw new Error(`invalid signature ${title}: out of range 1..Point.Fn.ORDER`);
		return num;
	}
	function validateSigLength(bytes, format) {
		validateSigFormat(format);
		const size = lengths.signature;
		return _abytes2(bytes, format === "compact" ? size : format === "recovered" ? size + 1 : void 0, `${format} signature`);
	}
	/**
	* ECDSA signature with its (r, s) properties. Supports compact, recovered & DER representations.
	*/
	class Signature {
		constructor(r, s, recovery) {
			this.r = validateRS("r", r);
			this.s = validateRS("s", s);
			if (recovery != null) this.recovery = recovery;
			Object.freeze(this);
		}
		static fromBytes(bytes, format = defaultSigOpts_format) {
			validateSigLength(bytes, format);
			let recid;
			if (format === "der") {
				const { r, s } = DER.toSig(_abytes2(bytes));
				return new Signature(r, s);
			}
			if (format === "recovered") {
				recid = bytes[0];
				format = "compact";
				bytes = bytes.subarray(1);
			}
			const L = Fn.BYTES;
			const r = bytes.subarray(0, L);
			const s = bytes.subarray(L, L * 2);
			return new Signature(Fn.fromBytes(r), Fn.fromBytes(s), recid);
		}
		static fromHex(hex, format) {
			return this.fromBytes(hexToBytes$1(hex), format);
		}
		addRecoveryBit(recovery) {
			return new Signature(this.r, this.s, recovery);
		}
		recoverPublicKey(messageHash) {
			const FIELD_ORDER = Fp.ORDER;
			const { r, s, recovery: rec } = this;
			if (rec == null || ![
				0,
				1,
				2,
				3
			].includes(rec)) throw new Error("recovery id invalid");
			if (CURVE_ORDER * _2n$1 < FIELD_ORDER && rec > 1) throw new Error("recovery id is ambiguous for h>1 curve");
			const radj = rec === 2 || rec === 3 ? r + CURVE_ORDER : r;
			if (!Fp.isValid(radj)) throw new Error("recovery id 2 or 3 invalid");
			const x = Fp.toBytes(radj);
			const R = Point.fromBytes(concatBytes$1(pprefix((rec & 1) === 0), x));
			const ir = Fn.inv(radj);
			const h = bits2int_modN(ensureBytes$1("msgHash", messageHash));
			const u1 = Fn.create(-h * ir);
			const u2 = Fn.create(s * ir);
			const Q = Point.BASE.multiplyUnsafe(u1).add(R.multiplyUnsafe(u2));
			if (Q.is0()) throw new Error("point at infinify");
			Q.assertValidity();
			return Q;
		}
		hasHighS() {
			return isBiggerThanHalfOrder(this.s);
		}
		toBytes(format = defaultSigOpts_format) {
			validateSigFormat(format);
			if (format === "der") return hexToBytes$1(DER.hexFromSig(this));
			const r = Fn.toBytes(this.r);
			const s = Fn.toBytes(this.s);
			if (format === "recovered") {
				if (this.recovery == null) throw new Error("recovery bit must be present");
				return concatBytes$1(Uint8Array.of(this.recovery), r, s);
			}
			return concatBytes$1(r, s);
		}
		toHex(format) {
			return bytesToHex$2(this.toBytes(format));
		}
		assertValidity() {}
		static fromCompact(hex) {
			return Signature.fromBytes(ensureBytes$1("sig", hex), "compact");
		}
		static fromDER(hex) {
			return Signature.fromBytes(ensureBytes$1("sig", hex), "der");
		}
		normalizeS() {
			return this.hasHighS() ? new Signature(this.r, Fn.neg(this.s), this.recovery) : this;
		}
		toDERRawBytes() {
			return this.toBytes("der");
		}
		toDERHex() {
			return bytesToHex$2(this.toBytes("der"));
		}
		toCompactRawBytes() {
			return this.toBytes("compact");
		}
		toCompactHex() {
			return bytesToHex$2(this.toBytes("compact"));
		}
	}
	const bits2int = ecdsaOpts.bits2int || function bits2int_def(bytes) {
		if (bytes.length > 8192) throw new Error("input is too large");
		const num = bytesToNumberBE$1(bytes);
		const delta = bytes.length * 8 - fnBits;
		return delta > 0 ? num >> BigInt(delta) : num;
	};
	const bits2int_modN = ecdsaOpts.bits2int_modN || function bits2int_modN_def(bytes) {
		return Fn.create(bits2int(bytes));
	};
	const ORDER_MASK = bitMask$1(fnBits);
	/** Converts to bytes. Checks if num in `[0..ORDER_MASK-1]` e.g.: `[0..2^256-1]`. */
	function int2octets(num) {
		aInRange$1("num < 2^" + fnBits, num, _0n, ORDER_MASK);
		return Fn.toBytes(num);
	}
	function validateMsgAndHash(message, prehash) {
		_abytes2(message, void 0, "message");
		return prehash ? _abytes2(hash(message), void 0, "prehashed message") : message;
	}
	/**
	* Steps A, D of RFC6979 3.2.
	* Creates RFC6979 seed; converts msg/privKey to numbers.
	* Used only in sign, not in verify.
	*
	* Warning: we cannot assume here that message has same amount of bytes as curve order,
	* this will be invalid at least for P521. Also it can be bigger for P224 + SHA256.
	*/
	function prepSig(message, privateKey, opts) {
		if (["recovered", "canonical"].some((k) => k in opts)) throw new Error("sign() legacy options not supported");
		const { lowS, prehash, extraEntropy } = validateSigOpts(opts, defaultSigOpts);
		message = validateMsgAndHash(message, prehash);
		const h1int = bits2int_modN(message);
		const d = _normFnElement(Fn, privateKey);
		const seedArgs = [int2octets(d), int2octets(h1int)];
		if (extraEntropy != null && extraEntropy !== false) {
			const e = extraEntropy === true ? randomBytes(lengths.secretKey) : extraEntropy;
			seedArgs.push(ensureBytes$1("extraEntropy", e));
		}
		const seed = concatBytes$1(...seedArgs);
		const m = h1int;
		function k2sig(kBytes) {
			const k = bits2int(kBytes);
			if (!Fn.isValidNot0(k)) return;
			const ik = Fn.inv(k);
			const q = Point.BASE.multiply(k).toAffine();
			const r = Fn.create(q.x);
			if (r === _0n) return;
			const s = Fn.create(ik * Fn.create(m + r * d));
			if (s === _0n) return;
			let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n);
			let normS = s;
			if (lowS && isBiggerThanHalfOrder(s)) {
				normS = Fn.neg(s);
				recovery ^= 1;
			}
			return new Signature(r, normS, recovery);
		}
		return {
			seed,
			k2sig
		};
	}
	/**
	* Signs message hash with a secret key.
	*
	* ```
	* sign(m, d) where
	*   k = rfc6979_hmac_drbg(m, d)
	*   (x, y) = G × k
	*   r = x mod n
	*   s = (m + dr) / k mod n
	* ```
	*/
	function sign(message, secretKey, opts = {}) {
		message = ensureBytes$1("message", message);
		const { seed, k2sig } = prepSig(message, secretKey, opts);
		return createHmacDrbg$1(hash.outputLen, Fn.BYTES, hmac$1)(seed, k2sig);
	}
	function tryParsingSig(sg) {
		let sig = void 0;
		const isHex = typeof sg === "string" || isBytes$2(sg);
		const isObj = !isHex && sg !== null && typeof sg === "object" && typeof sg.r === "bigint" && typeof sg.s === "bigint";
		if (!isHex && !isObj) throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");
		if (isObj) sig = new Signature(sg.r, sg.s);
		else if (isHex) {
			try {
				sig = Signature.fromBytes(ensureBytes$1("sig", sg), "der");
			} catch (derError) {
				if (!(derError instanceof DER.Err)) throw derError;
			}
			if (!sig) try {
				sig = Signature.fromBytes(ensureBytes$1("sig", sg), "compact");
			} catch (error) {
				return false;
			}
		}
		if (!sig) return false;
		return sig;
	}
	/**
	* Verifies a signature against message and public key.
	* Rejects lowS signatures by default: see {@link ECDSAVerifyOpts}.
	* Implements section 4.1.4 from https://www.secg.org/sec1-v2.pdf:
	*
	* ```
	* verify(r, s, h, P) where
	*   u1 = hs^-1 mod n
	*   u2 = rs^-1 mod n
	*   R = u1⋅G + u2⋅P
	*   mod(R.x, n) == r
	* ```
	*/
	function verify(signature, message, publicKey, opts = {}) {
		const { lowS, prehash, format } = validateSigOpts(opts, defaultSigOpts);
		publicKey = ensureBytes$1("publicKey", publicKey);
		message = validateMsgAndHash(ensureBytes$1("message", message), prehash);
		if ("strict" in opts) throw new Error("options.strict was renamed to lowS");
		const sig = format === void 0 ? tryParsingSig(signature) : Signature.fromBytes(ensureBytes$1("sig", signature), format);
		if (sig === false) return false;
		try {
			const P = Point.fromBytes(publicKey);
			if (lowS && sig.hasHighS()) return false;
			const { r, s } = sig;
			const h = bits2int_modN(message);
			const is = Fn.inv(s);
			const u1 = Fn.create(h * is);
			const u2 = Fn.create(r * is);
			const R = Point.BASE.multiplyUnsafe(u1).add(P.multiplyUnsafe(u2));
			if (R.is0()) return false;
			return Fn.create(R.x) === r;
		} catch (e) {
			return false;
		}
	}
	function recoverPublicKey(signature, message, opts = {}) {
		const { prehash } = validateSigOpts(opts, defaultSigOpts);
		message = validateMsgAndHash(message, prehash);
		return Signature.fromBytes(signature, "recovered").recoverPublicKey(message).toBytes();
	}
	return Object.freeze({
		keygen,
		getPublicKey,
		getSharedSecret,
		utils,
		lengths,
		Point,
		sign,
		verify,
		recoverPublicKey,
		Signature,
		hash
	});
}
function _weierstrass_legacy_opts_to_new(c) {
	const CURVE = {
		a: c.a,
		b: c.b,
		p: c.Fp.ORDER,
		n: c.n,
		h: c.h,
		Gx: c.Gx,
		Gy: c.Gy
	};
	const Fp = c.Fp;
	let allowedLengths = c.allowedPrivateKeyLengths ? Array.from(new Set(c.allowedPrivateKeyLengths.map((l) => Math.ceil(l / 2)))) : void 0;
	return {
		CURVE,
		curveOpts: {
			Fp,
			Fn: Field(CURVE.n, {
				BITS: c.nBitLength,
				allowedLengths,
				modFromBytes: c.wrapPrivateKey
			}),
			allowInfinityPoint: c.allowInfinityPoint,
			endo: c.endo,
			isTorsionFree: c.isTorsionFree,
			clearCofactor: c.clearCofactor,
			fromBytes: c.fromBytes,
			toBytes: c.toBytes
		}
	};
}
function _ecdsa_legacy_opts_to_new(c) {
	const { CURVE, curveOpts } = _weierstrass_legacy_opts_to_new(c);
	const ecdsaOpts = {
		hmac: c.hmac,
		randomBytes: c.randomBytes,
		lowS: c.lowS,
		bits2int: c.bits2int,
		bits2int_modN: c.bits2int_modN
	};
	return {
		CURVE,
		curveOpts,
		hash: c.hash,
		ecdsaOpts
	};
}
function _ecdsa_new_output_to_legacy(c, _ecdsa) {
	const Point = _ecdsa.Point;
	return Object.assign({}, _ecdsa, {
		ProjectivePoint: Point,
		CURVE: Object.assign({}, c, nLength(Point.Fn.ORDER, Point.Fn.BITS))
	});
}
function weierstrass(c) {
	const { CURVE, curveOpts, hash, ecdsaOpts } = _ecdsa_legacy_opts_to_new(c);
	return _ecdsa_new_output_to_legacy(c, ecdsa(weierstrassN(CURVE, curveOpts), hash, ecdsaOpts));
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/curves/esm/_shortw_utils.js
/**
* Utilities for short weierstrass curves, combined with noble-hashes.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
/** @deprecated use new `weierstrass()` and `ecdsa()` methods */
function createCurve(curveDef, defHash) {
	const create = (hash) => weierstrass({
		...curveDef,
		hash
	});
	return {
		...create(defHash),
		create
	};
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/curves/esm/abstract/hash-to-curve.js
var os2ip = bytesToNumberBE$1;
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
function normDST(DST) {
	if (!isBytes$2(DST) && typeof DST !== "string") throw new Error("DST must be Uint8Array or string");
	return typeof DST === "string" ? utf8ToBytes$2(DST) : DST;
}
/**
* Produces a uniformly random byte string using a cryptographic hash function H that outputs b bits.
* [RFC 9380 5.3.1](https://www.rfc-editor.org/rfc/rfc9380#section-5.3.1).
*/
function expand_message_xmd(msg, DST, lenInBytes, H) {
	abytes$1(msg);
	anum(lenInBytes);
	DST = normDST(DST);
	if (DST.length > 255) DST = H(concatBytes$1(utf8ToBytes$2("H2C-OVERSIZE-DST-"), DST));
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
	anum(lenInBytes);
	DST = normDST(DST);
	if (DST.length > 255) {
		const dkLen = Math.ceil(2 * k / 8);
		DST = H.create({ dkLen }).update(utf8ToBytes$2("H2C-OVERSIZE-DST-")).update(DST).digest();
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
	_validateObject(options, {
		p: "bigint",
		m: "number",
		k: "number",
		hash: "function"
	});
	const { p, k, m, hash, expand, DST } = options;
	if (!isHash$1(options.hash)) throw new Error("expected valid hash");
	abytes$1(msg);
	anum(count);
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
var _DST_scalar = utf8ToBytes$2("HashToScalar-");
/** Creates hash-to-curve methods from EC Point and mapToCurve function. See {@link H2CHasher}. */
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
			const u = hash_to_field(msg, 2, Object.assign({}, defaults, options));
			const u0 = map(u[0]);
			const u1 = map(u[1]);
			return clear(u0.add(u1));
		},
		encodeToCurve(msg, options) {
			const optsDst = defaults.encodeDST ? { DST: defaults.encodeDST } : {};
			return clear(map(hash_to_field(msg, 1, Object.assign({}, defaults, optsDst, options))[0]));
		},
		mapToCurve(scalars) {
			if (!Array.isArray(scalars)) throw new Error("expected array of bigints");
			for (const i of scalars) if (typeof i !== "bigint") throw new Error("expected array of bigints");
			return clear(map(scalars));
		},
		hashToScalar(msg, options) {
			const N = Point.Fn.ORDER;
			return hash_to_field(msg, 1, Object.assign({}, defaults, {
				p: N,
				m: 1,
				DST: _DST_scalar
			}, options))[0][0];
		}
	};
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/curves/esm/secp256k1.js
/**
* SECG secp256k1. See [pdf](https://www.secg.org/sec2-v2.pdf).
*
* Belongs to Koblitz curves: it has efficiently-computable GLV endomorphism ψ,
* check out {@link EndomorphismOpts}. Seems to be rigid (not backdoored).
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var secp256k1_CURVE = {
	p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
	n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
	h: BigInt(1),
	a: BigInt(0),
	b: BigInt(7),
	Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
	Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
};
var secp256k1_ENDO = {
	beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
	basises: [[BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")], [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]]
};
var _2n = /* @__PURE__ */ BigInt(2);
/**
* √n = n^((p+1)/4) for fields p = 3 mod 4. We unwrap the loop and multiply bit-by-bit.
* (P+1n/4n).toString(2) would produce bits [223x 1, 0, 22x 1, 4x 0, 11, 00]
*/
function sqrtMod(y) {
	const P = secp256k1_CURVE.p;
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
var Fpk1 = Field(secp256k1_CURVE.p, { sqrt: sqrtMod });
/**
* secp256k1 curve, ECDSA and ECDH methods.
*
* Field: `2n**256n - 2n**32n - 2n**9n - 2n**8n - 2n**7n - 2n**6n - 2n**4n - 1n`
*
* @example
* ```js
* import { secp256k1 } from '@noble/curves/secp256k1';
* const { secretKey, publicKey } = secp256k1.keygen();
* const msg = new TextEncoder().encode('hello');
* const sig = secp256k1.sign(msg, secretKey);
* const isValid = secp256k1.verify(sig, msg, publicKey) === true;
* ```
*/
var secp256k1 = createCurve({
	...secp256k1_CURVE,
	Fp: Fpk1,
	lowS: true,
	endo: secp256k1_ENDO
}, sha256$1);
secp256k1.Point;
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
var secp256k1_hasher = createHasher(secp256k1.Point, (scalars) => {
	const { x, y } = mapSWU(Fpk1.create(scalars[0]));
	return isoMap(x, y);
}, {
	DST: "secp256k1_XMD:SHA-256_SSWU_RO_",
	encodeDST: "secp256k1_XMD:SHA-256_SSWU_NU_",
	p: Fpk1.ORDER,
	m: 1,
	k: 128,
	expand: "xmd",
	hash: sha256$1
});
secp256k1_hasher.hashToCurve;
secp256k1_hasher.encodeToCurve;
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/ox/_esm/core/Signature.js
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
function assert(signature, options = {}) {
	const { recovered } = options;
	if (typeof signature.r === "undefined") throw new MissingPropertiesError({ signature });
	if (typeof signature.s === "undefined") throw new MissingPropertiesError({ signature });
	if (recovered && typeof signature.yParity === "undefined") throw new MissingPropertiesError({ signature });
	if (signature.r < 0n || signature.r > maxUint256) throw new InvalidRError({ value: signature.r });
	if (signature.s < 0n || signature.s > maxUint256) throw new InvalidSError({ value: signature.s });
	if (typeof signature.yParity === "number" && signature.yParity !== 0 && signature.yParity !== 1) throw new InvalidYParityError({ value: signature.yParity });
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
function fromHex$1(signature) {
	if (signature.length !== 130 && signature.length !== 132) throw new InvalidSerializedSizeError({ signature });
	const r = BigInt(slice$1(signature, 0, 32));
	const s = BigInt(slice$1(signature, 32, 64));
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
	assert(signature);
	const r = signature.r;
	const s = signature.s;
	return concat(fromNumber(r, { size: 32 }), fromNumber(s, { size: 32 }), typeof signature.yParity === "number" ? fromNumber(yParityToV(signature.yParity), { size: 1 }) : "0x");
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
		super(`Value \`${signature}\` is an invalid signature size.`, { metaMessages: ["Expected: 64 bytes or 65 bytes.", `Received ${size$1(from$2(signature))} bytes.`] });
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
//#region node_modules/@coinbase/wallet-sdk/node_modules/ox/_esm/core/Base64.js
var decoder = /* @__PURE__ */ new TextDecoder();
var integerToCharacter = /* @__PURE__ */ Object.fromEntries(Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/").map((a, i) => [i, a.charCodeAt(0)]));
({ ...Object.fromEntries(Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/").map((a, i) => [a.charCodeAt(0), i])) }), "=".charCodeAt(0), "-".charCodeAt(0), "_".charCodeAt(0);
/**
* Encodes a {@link ox#Bytes.Bytes} to a Base64-encoded string (with optional padding and/or URL-safe characters).
*
* @example
* ```ts twoslash
* import { Base64, Bytes } from 'ox'
*
* const value = Base64.fromBytes(Bytes.fromString('hello world'))
* // @log: 'aGVsbG8gd29ybGQ='
* ```
*
* @example
* ### No Padding
*
* Turn off [padding of encoded data](https://datatracker.ietf.org/doc/html/rfc4648#section-3.2) with the `pad` option:
*
* ```ts twoslash
* import { Base64, Bytes } from 'ox'
*
* const value = Base64.fromBytes(Bytes.fromString('hello world'), { pad: false })
* // @log: 'aGVsbG8gd29ybGQ'
* ```
*
* ### URL-safe Encoding
*
* Turn on [URL-safe encoding](https://datatracker.ietf.org/doc/html/rfc4648#section-5) (Base64 URL) with the `url` option:
*
* ```ts twoslash
* import { Base64, Bytes } from 'ox'
*
* const value = Base64.fromBytes(Bytes.fromString('hello wod'), { url: true })
* // @log: 'aGVsbG8gd29_77-9ZA=='
* ```
*
* @param value - The byte array to encode.
* @param options - Encoding options.
* @returns The Base64 encoded string.
*/
function fromBytes(value, options = {}) {
	const { pad = true, url = false } = options;
	const encoded = new Uint8Array(Math.ceil(value.length / 3) * 4);
	for (let i = 0, j = 0; j < value.length; i += 4, j += 3) {
		const y = (value[j] << 16) + (value[j + 1] << 8) + (value[j + 2] | 0);
		encoded[i] = integerToCharacter[y >> 18];
		encoded[i + 1] = integerToCharacter[y >> 12 & 63];
		encoded[i + 2] = integerToCharacter[y >> 6 & 63];
		encoded[i + 3] = integerToCharacter[y & 63];
	}
	const k = value.length % 3;
	const end = Math.floor(value.length / 3) * 4 + (k && k + 1);
	let base64 = decoder.decode(new Uint8Array(encoded.buffer, 0, end));
	if (pad && k === 1) base64 += "==";
	if (pad && k === 2) base64 += "=";
	if (url) base64 = base64.replaceAll("+", "-").replaceAll("/", "_");
	return base64;
}
/**
* Encodes a {@link ox#Hex.Hex} to a Base64-encoded string (with optional padding and/or URL-safe characters).
*
* @example
* ```ts twoslash
* import { Base64, Hex } from 'ox'
*
* const value = Base64.fromHex(Hex.fromString('hello world'))
* // @log: 'aGVsbG8gd29ybGQ='
* ```
*
* @example
* ### No Padding
*
* Turn off [padding of encoded data](https://datatracker.ietf.org/doc/html/rfc4648#section-3.2) with the `pad` option:
*
* ```ts twoslash
* import { Base64, Hex } from 'ox'
*
* const value = Base64.fromHex(Hex.fromString('hello world'), { pad: false })
* // @log: 'aGVsbG8gd29ybGQ'
* ```
*
* ### URL-safe Encoding
*
* Turn on [URL-safe encoding](https://datatracker.ietf.org/doc/html/rfc4648#section-5) (Base64 URL) with the `url` option:
*
* ```ts twoslash
* import { Base64, Hex } from 'ox'
*
* const value = Base64.fromHex(Hex.fromString('hello wod'), { url: true })
* // @log: 'aGVsbG8gd29_77-9ZA=='
* ```
*
* @param value - The hex value to encode.
* @param options - Encoding options.
* @returns The Base64 encoded string.
*/
function fromHex(value, options = {}) {
	return fromBytes(fromHex$3(value), options);
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/curves/esm/nist.js
/**
* Internal module for NIST P256, P384, P521 curves.
* Do not use for now.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var p256_CURVE = {
	p: BigInt("0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff"),
	n: BigInt("0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551"),
	h: BigInt(1),
	a: BigInt("0xffffffff00000001000000000000000000000000fffffffffffffffffffffffc"),
	b: BigInt("0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b"),
	Gx: BigInt("0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296"),
	Gy: BigInt("0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5")
};
var p384_CURVE = {
	p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffff0000000000000000ffffffff"),
	n: BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffc7634d81f4372ddf581a0db248b0a77aecec196accc52973"),
	h: BigInt(1),
	a: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffff0000000000000000fffffffc"),
	b: BigInt("0xb3312fa7e23ee7e4988e056be3f82d19181d9c6efe8141120314088f5013875ac656398d8a2ed19d2a85c8edd3ec2aef"),
	Gx: BigInt("0xaa87ca22be8b05378eb1c71ef320ad746e1d3b628ba79b9859f741e082542a385502f25dbf55296c3a545e3872760ab7"),
	Gy: BigInt("0x3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f")
};
var p521_CURVE = {
	p: BigInt("0x1ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"),
	n: BigInt("0x01fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa51868783bf2f966b7fcc0148f709a5d03bb5c9b8899c47aebb6fb71e91386409"),
	h: BigInt(1),
	a: BigInt("0x1fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc"),
	b: BigInt("0x0051953eb9618e1c9a1f929a21a0b68540eea2da725b99b315f3b8b489918ef109e156193951ec7e937b1652c0bd3bb1bf073573df883d2c34f1ef451fd46b503f00"),
	Gx: BigInt("0x00c6858e06b70404e9cd9e3ecb662395b4429c648139053fb521f828af606b4d3dbaa14b5e77efe75928fe1dc127a2ffa8de3348b3c1856a429bf97e7e31c2e5bd66"),
	Gy: BigInt("0x011839296a789a3bc0045c8a5fb42c7d1bd998f54449579b446817afbd17273e662c97ee72995ef42640c550b9013fad0761353c7086a272c24088be94769fd16650")
};
var Fp256 = Field(p256_CURVE.p);
var Fp384 = Field(p384_CURVE.p);
var Fp521 = Field(p521_CURVE.p);
function createSWU(Point, opts) {
	const map = mapToCurveSimpleSWU(Point.Fp, opts);
	return (scalars) => map(scalars[0]);
}
/** NIST P256 (aka secp256r1, prime256v1) curve, ECDSA and ECDH methods. */
var p256$1 = createCurve({
	...p256_CURVE,
	Fp: Fp256,
	lowS: false
}, sha256$1);
/** Hashing / encoding to p256 points / field. RFC 9380 methods. */
var p256_hasher = createHasher(p256$1.Point, createSWU(p256$1.Point, {
	A: p256_CURVE.a,
	B: p256_CURVE.b,
	Z: p256$1.Point.Fp.create(BigInt("-10"))
}), {
	DST: "P256_XMD:SHA-256_SSWU_RO_",
	encodeDST: "P256_XMD:SHA-256_SSWU_NU_",
	p: p256_CURVE.p,
	m: 1,
	k: 128,
	expand: "xmd",
	hash: sha256$1
});
/** NIST P384 (aka secp384r1) curve, ECDSA and ECDH methods. */
var p384 = createCurve({
	...p384_CURVE,
	Fp: Fp384,
	lowS: false
}, sha384);
createHasher(p384.Point, createSWU(p384.Point, {
	A: p384_CURVE.a,
	B: p384_CURVE.b,
	Z: p384.Point.Fp.create(BigInt("-12"))
}), {
	DST: "P384_XMD:SHA-384_SSWU_RO_",
	encodeDST: "P384_XMD:SHA-384_SSWU_NU_",
	p: p384_CURVE.p,
	m: 1,
	k: 192,
	expand: "xmd",
	hash: sha384
});
/** NIST P521 (aka secp521r1) curve, ECDSA and ECDH methods. */
var p521 = createCurve({
	...p521_CURVE,
	Fp: Fp521,
	lowS: false,
	allowedPrivateKeyLengths: [
		130,
		131,
		132
	]
}, sha512);
createHasher(p521.Point, createSWU(p521.Point, {
	A: p521_CURVE.a,
	B: p521_CURVE.b,
	Z: p521.Point.Fp.create(BigInt("-4"))
}), {
	DST: "P521_XMD:SHA-512_SSWU_RO_",
	encodeDST: "P521_XMD:SHA-512_SSWU_NU_",
	p: p521_CURVE.p,
	m: 1,
	k: 256,
	expand: "xmd",
	hash: sha512
});
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/curves/esm/p256.js
/** @deprecated use `import { p256 } from '@noble/curves/nist.js';` */
var p256 = p256$1;
p256_hasher.hashToCurve;
p256_hasher.encodeToCurve;
Uint8Array.from([
	105,
	171,
	180,
	181,
	160,
	222,
	75,
	198,
	42,
	42,
	32,
	31,
	141,
	37,
	186,
	233
]);
/**
* Gets the authenticator data which contains information about the
* processing of an authenticator request (ie. from `WebAuthnP256.sign`).
*
* :::warning
*
* This function is mainly for testing purposes or for manually constructing
* autenticator data. In most cases you will not need this function.
* `authenticatorData` is typically returned as part of the
* {@link ox#WebAuthnP256.(sign:function)} response (ie. an authenticator response).
*
* :::
*
* @example
* ```ts twoslash
* import { WebAuthnP256 } from 'ox'
*
* const authenticatorData = WebAuthnP256.getAuthenticatorData({
*   rpId: 'example.com',
*   signCount: 420,
* })
* // @log: "0xa379a6f6eeafb9a55e378c118034e2751e682fab9f2d30ab13d2125586ce194705000001a4"
* ```
*
* @param options - Options to construct the authenticator data.
* @returns The authenticator data.
*/
function getAuthenticatorData(options = {}) {
	const { flag = 5, rpId = window.location.hostname, signCount = 0 } = options;
	return concat(sha256$2(fromString(rpId)), fromNumber(flag, { size: 1 }), fromNumber(signCount, { size: 4 }));
}
/**
* Constructs the Client Data in stringified JSON format which represents client data that
* was passed to `credentials.get()` in {@link ox#WebAuthnP256.(sign:function)}.
*
* :::warning
*
* This function is mainly for testing purposes or for manually constructing
* client data. In most cases you will not need this function.
* `clientDataJSON` is typically returned as part of the
* {@link ox#WebAuthnP256.(sign:function)} response (ie. an authenticator response).
*
* :::
*
* @example
* ```ts twoslash
* import { WebAuthnP256 } from 'ox'
*
* const clientDataJSON = WebAuthnP256.getClientDataJSON({
*   challenge: '0xdeadbeef',
*   origin: 'https://example.com',
* })
* // @log: "{"type":"webauthn.get","challenge":"3q2-7w","origin":"https://example.com","crossOrigin":false}"
* ```
*
* @param options - Options to construct the client data.
* @returns The client data.
*/
function getClientDataJSON(options) {
	const { challenge, crossOrigin = false, extraClientData, origin = window.location.origin } = options;
	return JSON.stringify({
		type: "webauthn.get",
		challenge: fromHex(challenge, {
			url: true,
			pad: false
		}),
		origin,
		crossOrigin,
		...extraClientData
	});
}
/**
* Constructs the final digest that was signed and computed by the authenticator. This payload includes
* the cryptographic `challenge`, as well as authenticator metadata (`authenticatorData` + `clientDataJSON`).
* This value can be also used with raw P256 verification (such as {@link ox#P256.(verify:function)} or
* {@link ox#WebCryptoP256.(verify:function)}).
*
* :::warning
*
* This function is mainly for testing purposes or for manually constructing
* signing payloads. In most cases you will not need this function and
* instead use {@link ox#WebAuthnP256.(sign:function)}.
*
* :::
*
* @example
* ```ts twoslash
* import { WebAuthnP256, WebCryptoP256 } from 'ox'
*
* const { metadata, payload } = WebAuthnP256.getSignPayload({ // [!code focus]
*   challenge: '0xdeadbeef', // [!code focus]
* }) // [!code focus]
* // @log: {
* // @log:   metadata: {
* // @log:     authenticatorData: "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000",
* // @log:     challengeIndex: 23,
* // @log:     clientDataJSON: "{"type":"webauthn.get","challenge":"9jEFijuhEWrM4SOW-tChJbUEHEP44VcjcJ-Bqo1fTM8","origin":"http://localhost:5173","crossOrigin":false}",
* // @log:     typeIndex: 1,
* // @log:     userVerificationRequired: true,
* // @log:   },
* // @log:   payload: "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d9763050000000045086dcb06a5f234db625bcdc94e657f86b76b6fd3eb9c30543eabc1e577a4b0",
* // @log: }
*
* const { publicKey, privateKey } = await WebCryptoP256.createKeyPair()
*
* const signature = await WebCryptoP256.sign({
*   payload,
*   privateKey,
* })
* ```
*
* @param options - Options to construct the signing payload.
* @returns The signing payload.
*/
function getSignPayload(options) {
	const { challenge, crossOrigin, extraClientData, flag, origin, rpId, signCount, userVerification = "required" } = options;
	const authenticatorData = getAuthenticatorData({
		flag,
		rpId,
		signCount
	});
	const clientDataJSON = getClientDataJSON({
		challenge,
		crossOrigin,
		extraClientData,
		origin
	});
	const clientDataJSONHash = sha256$2(fromString(clientDataJSON));
	return {
		metadata: {
			authenticatorData,
			clientDataJSON,
			challengeIndex: clientDataJSON.indexOf("\"challenge\""),
			typeIndex: clientDataJSON.indexOf("\"type\""),
			userVerificationRequired: userVerification === "required"
		},
		payload: concat(authenticatorData, clientDataJSONHash)
	};
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/ox/_esm/core/WebCryptoP256.js
/**
* Generates an ECDSA P256 key pair that includes:
*
* - a `privateKey` of type [`CryptoKey`](https://developer.mozilla.org/en-US/docs/Web/API/CryptoKey)
*
* - a `publicKey` of type {@link ox#Hex.Hex} or {@link ox#Bytes.Bytes}
*
* @example
* ```ts twoslash
* import { WebCryptoP256 } from 'ox'
*
* const { publicKey, privateKey } = await WebCryptoP256.createKeyPair()
* // @log: {
* // @log:   privateKey: CryptoKey {},
* // @log:   publicKey: {
* // @log:     x: 59295962801117472859457908919941473389380284132224861839820747729565200149877n,
* // @log:     y: 24099691209996290925259367678540227198235484593389470330605641003500238088869n,
* // @log:     prefix: 4,
* // @log:   },
* // @log: }
* ```
*
* @param options - Options for creating the key pair.
* @returns The key pair.
*/
async function createKeyPair(options = {}) {
	const { extractable = false } = options;
	const keypair = await globalThis.crypto.subtle.generateKey({
		name: "ECDSA",
		namedCurve: "P-256"
	}, extractable, ["sign", "verify"]);
	const publicKey_raw = await globalThis.crypto.subtle.exportKey("raw", keypair.publicKey);
	const publicKey = from(new Uint8Array(publicKey_raw));
	return {
		privateKey: keypair.privateKey,
		publicKey
	};
}
/**
* Signs a payload with the provided `CryptoKey` private key and returns a P256 signature.
*
* @example
* ```ts twoslash
* import { WebCryptoP256 } from 'ox'
*
* const { privateKey } = await WebCryptoP256.createKeyPair()
*
* const signature = await WebCryptoP256.sign({ // [!code focus]
*   payload: '0xdeadbeef', // [!code focus]
*   privateKey, // [!code focus]
* }) // [!code focus]
* // @log: {
* // @log:   r: 151231...4423n,
* // @log:   s: 516123...5512n,
* // @log: }
* ```
*
* @param options - Options for signing the payload.
* @returns The P256 ECDSA {@link ox#Signature.Signature}.
*/
async function sign$1(options) {
	const { payload, privateKey } = options;
	const signature = await globalThis.crypto.subtle.sign({
		name: "ECDSA",
		hash: "SHA-256"
	}, privateKey, from$1(payload));
	const signature_bytes = fromArray(new Uint8Array(signature));
	const r = toBigInt(slice(signature_bytes, 0, 32));
	let s = toBigInt(slice(signature_bytes, 32, 64));
	if (s > p256.CURVE.n / 2n) s = p256.CURVE.n - s;
	return {
		r,
		s
	};
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/kms/crypto-key/storage.js
function createStorage(scope, name) {
	const store = typeof indexedDB !== "undefined" ? createStore$1(scope, name) : void 0;
	return {
		getItem: async (key) => {
			const value = await get$1(key, store);
			if (!value) return null;
			return value;
		},
		removeItem: async (key) => {
			return del(key, store);
		},
		setItem: async (key, value) => {
			return set(key, value, store);
		}
	};
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/kms/crypto-key/index.js
var STORAGE_SCOPE = "cbwsdk";
var STORAGE_NAME = "keys";
var ACTIVE_ID_KEY = "activeId";
var storage$1 = createStorage(STORAGE_SCOPE, STORAGE_NAME);
async function generateKeyPair() {
	const keypair = await createKeyPair({ extractable: false });
	const publicKey = slice$1(toHex$1(keypair.publicKey), 1);
	await storage$1.setItem(publicKey, keypair);
	await storage$1.setItem(ACTIVE_ID_KEY, publicKey);
	return keypair;
}
async function getKeypair() {
	const id = await storage$1.getItem(ACTIVE_ID_KEY);
	if (!id) return null;
	const keypair = await storage$1.getItem(id);
	if (!keypair) return null;
	return keypair;
}
async function getOrCreateKeypair() {
	const keypair = await getKeypair();
	if (!keypair) {
		const kp = await generateKeyPair();
		const pubKey = slice$1(toHex$1(kp.publicKey), 1);
		await storage$1.setItem(pubKey, kp);
		await storage$1.setItem(ACTIVE_ID_KEY, pubKey);
		return kp;
	}
	return keypair;
}
async function getAccount() {
	const keypair = await getOrCreateKeypair();
	/**
	* public key / address
	*/
	const publicKey = slice$1(toHex$1(keypair.publicKey), 1);
	const sign = async (payload) => {
		const { payload: message, metadata } = getSignPayload({
			challenge: payload,
			origin: "https://keys.coinbase.com",
			userVerification: "preferred"
		});
		return {
			signature: toHex(await sign$1({
				payload: message,
				privateKey: keypair.privateKey
			})),
			raw: {},
			webauthn: metadata
		};
	};
	return {
		id: publicKey,
		publicKey,
		async sign({ hash }) {
			return sign(hash);
		},
		async signMessage({ message }) {
			return sign(hashMessage(message));
		},
		async signTypedData(parameters) {
			return sign(hashTypedData(parameters));
		},
		type: "webAuthn"
	};
}
async function getCryptoKeyAccount() {
	return { account: await getAccount() };
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/scw/SCWKeyManager.js
var OWN_PRIVATE_KEY = {
	storageKey: "ownPrivateKey",
	keyType: "private"
};
var OWN_PUBLIC_KEY = {
	storageKey: "ownPublicKey",
	keyType: "public"
};
var PEER_PUBLIC_KEY = {
	storageKey: "peerPublicKey",
	keyType: "public"
};
var SCWKeyManager = class {
	constructor() {
		this.ownPrivateKey = null;
		this.ownPublicKey = null;
		this.peerPublicKey = null;
		this.sharedSecret = null;
	}
	async getOwnPublicKey() {
		await this.loadKeysIfNeeded();
		return this.ownPublicKey;
	}
	async getSharedSecret() {
		await this.loadKeysIfNeeded();
		return this.sharedSecret;
	}
	async setPeerPublicKey(key) {
		this.sharedSecret = null;
		this.peerPublicKey = key;
		await this.storeKey(PEER_PUBLIC_KEY, key);
		await this.loadKeysIfNeeded();
	}
	async clear() {
		this.ownPrivateKey = null;
		this.ownPublicKey = null;
		this.peerPublicKey = null;
		this.sharedSecret = null;
		store.keys.clear();
	}
	async generateKeyPair() {
		const newKeyPair = await generateKeyPair$1();
		this.ownPrivateKey = newKeyPair.privateKey;
		this.ownPublicKey = newKeyPair.publicKey;
		await this.storeKey(OWN_PRIVATE_KEY, newKeyPair.privateKey);
		await this.storeKey(OWN_PUBLIC_KEY, newKeyPair.publicKey);
	}
	async loadKeysIfNeeded() {
		if (this.ownPrivateKey === null) this.ownPrivateKey = await this.loadKey(OWN_PRIVATE_KEY);
		if (this.ownPublicKey === null) this.ownPublicKey = await this.loadKey(OWN_PUBLIC_KEY);
		if (this.ownPrivateKey === null || this.ownPublicKey === null) await this.generateKeyPair();
		if (this.peerPublicKey === null) this.peerPublicKey = await this.loadKey(PEER_PUBLIC_KEY);
		if (this.sharedSecret === null) {
			if (this.ownPrivateKey === null || this.peerPublicKey === null) return;
			this.sharedSecret = await deriveSharedSecret(this.ownPrivateKey, this.peerPublicKey);
		}
	}
	async loadKey(item) {
		const key = store.keys.get(item.storageKey);
		if (!key) return null;
		return importKeyFromHexString(item.keyType, key);
	}
	async storeKey(item, key) {
		const hexString = await exportKeyToHexString(item.keyType, key);
		store.keys.set(item.storageKey, hexString);
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/util/get.js
function get(obj, path) {
	if (typeof obj !== "object" || obj === null) return void 0;
	return path.split(/[.[\]]+/).filter(Boolean).reduce((value, key) => {
		if (typeof value === "object" && value !== null) return value[key];
	}, obj);
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/scw/utils/constants.js
/**********************************************************************
* Constants
**********************************************************************/
var factoryAddress = "0x0ba5ed0c6aa8c49038f819e587e2633c4a9f428a";
var spendPermissionManagerAddress = "0xf85210B21cC50302F477BA56686d2019dC9b67Ad";
var abi = [
	{
		inputs: [],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		inputs: [{
			name: "owner",
			type: "bytes"
		}],
		name: "AlreadyOwner",
		type: "error"
	},
	{
		inputs: [],
		name: "Initialized",
		type: "error"
	},
	{
		inputs: [{
			name: "owner",
			type: "bytes"
		}],
		name: "InvalidEthereumAddressOwner",
		type: "error"
	},
	{
		inputs: [{
			name: "key",
			type: "uint256"
		}],
		name: "InvalidNonceKey",
		type: "error"
	},
	{
		inputs: [{
			name: "owner",
			type: "bytes"
		}],
		name: "InvalidOwnerBytesLength",
		type: "error"
	},
	{
		inputs: [],
		name: "LastOwner",
		type: "error"
	},
	{
		inputs: [{
			name: "index",
			type: "uint256"
		}],
		name: "NoOwnerAtIndex",
		type: "error"
	},
	{
		inputs: [{
			name: "ownersRemaining",
			type: "uint256"
		}],
		name: "NotLastOwner",
		type: "error"
	},
	{
		inputs: [{
			name: "selector",
			type: "bytes4"
		}],
		name: "SelectorNotAllowed",
		type: "error"
	},
	{
		inputs: [],
		name: "Unauthorized",
		type: "error"
	},
	{
		inputs: [],
		name: "UnauthorizedCallContext",
		type: "error"
	},
	{
		inputs: [],
		name: "UpgradeFailed",
		type: "error"
	},
	{
		inputs: [
			{
				name: "index",
				type: "uint256"
			},
			{
				name: "expectedOwner",
				type: "bytes"
			},
			{
				name: "actualOwner",
				type: "bytes"
			}
		],
		name: "WrongOwnerAtIndex",
		type: "error"
	},
	{
		anonymous: false,
		inputs: [{
			indexed: true,
			name: "index",
			type: "uint256"
		}, {
			indexed: false,
			name: "owner",
			type: "bytes"
		}],
		name: "AddOwner",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [{
			indexed: true,
			name: "index",
			type: "uint256"
		}, {
			indexed: false,
			name: "owner",
			type: "bytes"
		}],
		name: "RemoveOwner",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [{
			indexed: true,
			name: "implementation",
			type: "address"
		}],
		name: "Upgraded",
		type: "event"
	},
	{
		stateMutability: "payable",
		type: "fallback"
	},
	{
		inputs: [],
		name: "REPLAYABLE_NONCE_KEY",
		outputs: [{
			name: "",
			type: "uint256"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			name: "owner",
			type: "address"
		}],
		name: "addOwnerAddress",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{
			name: "x",
			type: "bytes32"
		}, {
			name: "y",
			type: "bytes32"
		}],
		name: "addOwnerPublicKey",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{
			name: "functionSelector",
			type: "bytes4"
		}],
		name: "canSkipChainIdValidation",
		outputs: [{
			name: "",
			type: "bool"
		}],
		stateMutability: "pure",
		type: "function"
	},
	{
		inputs: [],
		name: "domainSeparator",
		outputs: [{
			name: "",
			type: "bytes32"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
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
	},
	{
		inputs: [],
		name: "entryPoint",
		outputs: [{
			name: "",
			type: "address"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				name: "target",
				type: "address"
			},
			{
				name: "value",
				type: "uint256"
			},
			{
				name: "data",
				type: "bytes"
			}
		],
		name: "execute",
		outputs: [],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [{
			components: [
				{
					name: "target",
					type: "address"
				},
				{
					name: "value",
					type: "uint256"
				},
				{
					name: "data",
					type: "bytes"
				}
			],
			name: "calls",
			type: "tuple[]"
		}],
		name: "executeBatch",
		outputs: [],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [{
			name: "calls",
			type: "bytes[]"
		}],
		name: "executeWithoutChainIdValidation",
		outputs: [],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [{
			components: [
				{
					name: "sender",
					type: "address"
				},
				{
					name: "nonce",
					type: "uint256"
				},
				{
					name: "initCode",
					type: "bytes"
				},
				{
					name: "callData",
					type: "bytes"
				},
				{
					name: "callGasLimit",
					type: "uint256"
				},
				{
					name: "verificationGasLimit",
					type: "uint256"
				},
				{
					name: "preVerificationGas",
					type: "uint256"
				},
				{
					name: "maxFeePerGas",
					type: "uint256"
				},
				{
					name: "maxPriorityFeePerGas",
					type: "uint256"
				},
				{
					name: "paymasterAndData",
					type: "bytes"
				},
				{
					name: "signature",
					type: "bytes"
				}
			],
			name: "userOp",
			type: "tuple"
		}],
		name: "getUserOpHashWithoutChainId",
		outputs: [{
			name: "",
			type: "bytes32"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "implementation",
		outputs: [{
			name: "$",
			type: "address"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			name: "owners",
			type: "bytes[]"
		}],
		name: "initialize",
		outputs: [],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [{
			name: "account",
			type: "address"
		}],
		name: "isOwnerAddress",
		outputs: [{
			name: "",
			type: "bool"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			name: "account",
			type: "bytes"
		}],
		name: "isOwnerBytes",
		outputs: [{
			name: "",
			type: "bool"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			name: "x",
			type: "bytes32"
		}, {
			name: "y",
			type: "bytes32"
		}],
		name: "isOwnerPublicKey",
		outputs: [{
			name: "",
			type: "bool"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			name: "hash",
			type: "bytes32"
		}, {
			name: "signature",
			type: "bytes"
		}],
		name: "isValidSignature",
		outputs: [{
			name: "result",
			type: "bytes4"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "nextOwnerIndex",
		outputs: [{
			name: "",
			type: "uint256"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			name: "index",
			type: "uint256"
		}],
		name: "ownerAtIndex",
		outputs: [{
			name: "",
			type: "bytes"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "ownerCount",
		outputs: [{
			name: "",
			type: "uint256"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "proxiableUUID",
		outputs: [{
			name: "",
			type: "bytes32"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			name: "index",
			type: "uint256"
		}, {
			name: "owner",
			type: "bytes"
		}],
		name: "removeLastOwner",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{
			name: "index",
			type: "uint256"
		}, {
			name: "owner",
			type: "bytes"
		}],
		name: "removeOwnerAtIndex",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [],
		name: "removedOwnersCount",
		outputs: [{
			name: "",
			type: "uint256"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			name: "hash",
			type: "bytes32"
		}],
		name: "replaySafeHash",
		outputs: [{
			name: "",
			type: "bytes32"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			name: "newImplementation",
			type: "address"
		}, {
			name: "data",
			type: "bytes"
		}],
		name: "upgradeToAndCall",
		outputs: [],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						name: "sender",
						type: "address"
					},
					{
						name: "nonce",
						type: "uint256"
					},
					{
						name: "initCode",
						type: "bytes"
					},
					{
						name: "callData",
						type: "bytes"
					},
					{
						name: "callGasLimit",
						type: "uint256"
					},
					{
						name: "verificationGasLimit",
						type: "uint256"
					},
					{
						name: "preVerificationGas",
						type: "uint256"
					},
					{
						name: "maxFeePerGas",
						type: "uint256"
					},
					{
						name: "maxPriorityFeePerGas",
						type: "uint256"
					},
					{
						name: "paymasterAndData",
						type: "bytes"
					},
					{
						name: "signature",
						type: "bytes"
					}
				],
				name: "userOp",
				type: "tuple"
			},
			{
				name: "userOpHash",
				type: "bytes32"
			},
			{
				name: "missingAccountFunds",
				type: "uint256"
			}
		],
		name: "validateUserOp",
		outputs: [{
			name: "validationData",
			type: "uint256"
		}],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		stateMutability: "payable",
		type: "receive"
	}
];
var factoryAbi = [
	{
		inputs: [{
			name: "implementation_",
			type: "address"
		}],
		stateMutability: "payable",
		type: "constructor"
	},
	{
		inputs: [],
		name: "OwnerRequired",
		type: "error"
	},
	{
		inputs: [{
			name: "owners",
			type: "bytes[]"
		}, {
			name: "nonce",
			type: "uint256"
		}],
		name: "createAccount",
		outputs: [{
			name: "account",
			type: "address"
		}],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [{
			name: "owners",
			type: "bytes[]"
		}, {
			name: "nonce",
			type: "uint256"
		}],
		name: "getAddress",
		outputs: [{
			name: "",
			type: "address"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "implementation",
		outputs: [{
			name: "",
			type: "address"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "initCodeHash",
		outputs: [{
			name: "",
			type: "bytes32"
		}],
		stateMutability: "view",
		type: "function"
	}
];
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/scw/utils.js
function getSenderFromRequest(request) {
	var _a;
	if (!Array.isArray(request.params)) return null;
	switch (request.method) {
		case "personal_sign": return request.params[1];
		case "eth_signTypedData_v4": return request.params[0];
		case "eth_signTransaction":
		case "eth_sendTransaction":
		case "wallet_sendCalls": return (_a = request.params[0]) === null || _a === void 0 ? void 0 : _a.from;
		default: return null;
	}
}
function addSenderToRequest(request, sender) {
	if (!Array.isArray(request.params)) throw standardErrors.rpc.invalidParams();
	const params = [...request.params];
	switch (request.method) {
		case "eth_signTransaction":
		case "eth_sendTransaction":
		case "wallet_sendCalls":
			params[0].from = sender;
			break;
		case "eth_signTypedData_v4":
			params[0] = sender;
			break;
		case "personal_sign":
			params[1] = sender;
			break;
		default: break;
	}
	return Object.assign(Object.assign({}, request), { params });
}
function assertParamsChainId(params) {
	var _a;
	if (!params || !Array.isArray(params) || !((_a = params[0]) === null || _a === void 0 ? void 0 : _a.chainId)) throw standardErrors.rpc.invalidParams();
	if (typeof params[0].chainId !== "string" && typeof params[0].chainId !== "number") throw standardErrors.rpc.invalidParams();
}
function assertGetCapabilitiesParams(params) {
	if (!params || !Array.isArray(params) || params.length !== 1 && params.length !== 2) throw standardErrors.rpc.invalidParams();
	if (typeof params[0] !== "string" || !isAddress(params[0])) throw standardErrors.rpc.invalidParams();
	if (params.length === 2) {
		if (!Array.isArray(params[1])) throw standardErrors.rpc.invalidParams();
		for (const param of params[1]) if (typeof param !== "string" || !param.startsWith("0x")) throw standardErrors.rpc.invalidParams();
	}
}
function injectRequestCapabilities(request, capabilities) {
	const modifiedRequest = Object.assign({}, request);
	if (capabilities && request.method.startsWith("wallet_")) {
		let requestCapabilities = get(modifiedRequest, "params.0.capabilities");
		if (typeof requestCapabilities === "undefined") requestCapabilities = {};
		if (typeof requestCapabilities !== "object") throw standardErrors.rpc.invalidParams();
		requestCapabilities = Object.assign(Object.assign({}, capabilities), requestCapabilities);
		if (modifiedRequest.params && Array.isArray(modifiedRequest.params)) modifiedRequest.params[0] = Object.assign(Object.assign({}, modifiedRequest.params[0]), { capabilities: requestCapabilities });
	}
	return modifiedRequest;
}
/**
* Initializes the `subAccountConfig` store with the owner account function and capabilities
* @returns void
*/
async function initSubAccountConfig() {
	var _a;
	const config = (_a = store.subAccountsConfig.get()) !== null && _a !== void 0 ? _a : {};
	const capabilities = {};
	if (config.enableAutoSubAccounts) {
		const { account: owner } = config.toOwnerAccount ? await config.toOwnerAccount() : await getCryptoKeyAccount();
		if (!owner) throw standardErrors.provider.unauthorized("No owner account found");
		capabilities.addSubAccount = { account: {
			type: "create",
			keys: [{
				type: owner.address ? "address" : "webauthn-p256",
				publicKey: owner.address || owner.publicKey
			}]
		} };
	}
	store.subAccountsConfig.set({ capabilities });
}
function assertFetchPermissionsRequest(request) {
	if (request.method === "coinbase_fetchPermissions" && request.params === void 0) return;
	if (request.method === "coinbase_fetchPermissions" && Array.isArray(request.params) && request.params.length === 1 && typeof request.params[0] === "object") {
		if (typeof request.params[0].account !== "string" || !request.params[0].chainId.startsWith("0x")) throw standardErrors.rpc.invalidParams("FetchPermissions - Invalid params: params[0].account must be a hex string");
		if (typeof request.params[0].chainId !== "string" || !request.params[0].chainId.startsWith("0x")) throw standardErrors.rpc.invalidParams("FetchPermissions - Invalid params: params[0].chainId must be a hex string");
		if (typeof request.params[0].spender !== "string" || !request.params[0].spender.startsWith("0x")) throw standardErrors.rpc.invalidParams("FetchPermissions - Invalid params: params[0].spender must be a hex string");
		return;
	}
	throw standardErrors.rpc.invalidParams();
}
function fillMissingParamsForFetchPermissions(request) {
	var _a, _b, _c;
	if (request.params !== void 0) return request;
	const accountFromStore = (_a = store.getState().account.accounts) === null || _a === void 0 ? void 0 : _a[0];
	const chainId = (_b = store.getState().account.chain) === null || _b === void 0 ? void 0 : _b.id;
	const subAccountFromStore = (_c = store.getState().subAccount) === null || _c === void 0 ? void 0 : _c.address;
	if (!accountFromStore || !subAccountFromStore || !chainId) throw standardErrors.rpc.invalidParams("FetchPermissions - one or more of account, sub account, or chain id is missing, connect to sub account via wallet_connect first");
	return {
		method: "coinbase_fetchPermissions",
		params: [{
			account: accountFromStore,
			chainId: numberToHex(chainId),
			spender: subAccountFromStore
		}]
	};
}
function createSpendPermissionMessage({ spendPermission, chainId }) {
	return {
		domain: {
			name: "Spend Permission Manager",
			version: "1",
			chainId,
			verifyingContract: spendPermissionManagerAddress
		},
		types: { SpendPermission: [
			{
				name: "account",
				type: "address"
			},
			{
				name: "spender",
				type: "address"
			},
			{
				name: "token",
				type: "address"
			},
			{
				name: "allowance",
				type: "uint160"
			},
			{
				name: "period",
				type: "uint48"
			},
			{
				name: "start",
				type: "uint48"
			},
			{
				name: "end",
				type: "uint48"
			},
			{
				name: "salt",
				type: "uint256"
			},
			{
				name: "extraData",
				type: "bytes"
			}
		] },
		primaryType: "SpendPermission",
		message: {
			account: spendPermission.account,
			spender: spendPermission.spender,
			token: spendPermission.token,
			allowance: spendPermission.allowance,
			period: spendPermission.period,
			start: spendPermission.start,
			end: spendPermission.end,
			salt: spendPermission.salt,
			extraData: spendPermission.extraData
		}
	};
}
function createSpendPermissionBatchMessage({ spendPermissionBatch, chainId }) {
	return {
		domain: {
			name: "Spend Permission Manager",
			version: "1",
			chainId,
			verifyingContract: spendPermissionManagerAddress
		},
		types: {
			SpendPermissionBatch: [
				{
					name: "account",
					type: "address"
				},
				{
					name: "period",
					type: "uint48"
				},
				{
					name: "start",
					type: "uint48"
				},
				{
					name: "end",
					type: "uint48"
				},
				{
					name: "permissions",
					type: "PermissionDetails[]"
				}
			],
			PermissionDetails: [
				{
					name: "spender",
					type: "address"
				},
				{
					name: "token",
					type: "address"
				},
				{
					name: "allowance",
					type: "uint160"
				},
				{
					name: "salt",
					type: "uint256"
				},
				{
					name: "extraData",
					type: "bytes"
				}
			]
		},
		primaryType: "SpendPermissionBatch",
		message: {
			account: spendPermissionBatch.account,
			period: spendPermissionBatch.period,
			start: spendPermissionBatch.start,
			end: spendPermissionBatch.end,
			permissions: spendPermissionBatch.permissions.map((p) => ({
				spender: p.spender,
				token: p.token,
				allowance: p.allowance,
				salt: p.salt,
				extraData: p.extraData
			}))
		}
	};
}
async function waitForCallsTransactionHash({ client, id }) {
	var _a;
	const result = await waitForCallsStatus(client, { id });
	if (result.status === "success") return (_a = result.receipts) === null || _a === void 0 ? void 0 : _a[0].transactionHash;
	throw standardErrors.rpc.internal("failed to send transaction");
}
function createWalletSendCallsRequest({ calls, from, chainId, capabilities }) {
	const paymasterUrls = config.get().paymasterUrls;
	let request = {
		method: "wallet_sendCalls",
		params: [{
			version: "1.0",
			calls,
			chainId: numberToHex(chainId),
			from,
			atomicRequired: true,
			capabilities
		}]
	};
	if (paymasterUrls === null || paymasterUrls === void 0 ? void 0 : paymasterUrls[chainId]) request = injectRequestCapabilities(request, { paymasterService: { url: paymasterUrls === null || paymasterUrls === void 0 ? void 0 : paymasterUrls[chainId] } });
	return request;
}
async function presentSubAccountFundingDialog() {
	const snackbar = initSnackbar();
	return await new Promise((resolve) => {
		logSnackbarShown({ snackbarContext: "sub_account_insufficient_balance" });
		snackbar.presentItem({
			autoExpand: true,
			message: "Insufficient spend permission. Choose how to proceed:",
			menuItems: [
				{
					isRed: false,
					info: "Create new Spend Permission",
					svgWidth: "10",
					svgHeight: "11",
					path: "",
					defaultFillRule: "evenodd",
					defaultClipRule: "evenodd",
					onClick: () => {
						logSnackbarActionClicked({
							snackbarContext: "sub_account_insufficient_balance",
							snackbarAction: "create_permission"
						});
						snackbar.clear();
						resolve("update_permission");
					}
				},
				{
					isRed: false,
					info: "Continue in Popup",
					svgWidth: "10",
					svgHeight: "11",
					path: "",
					defaultFillRule: "evenodd",
					defaultClipRule: "evenodd",
					onClick: () => {
						logSnackbarActionClicked({
							snackbarContext: "sub_account_insufficient_balance",
							snackbarAction: "continue_in_popup"
						});
						snackbar.clear();
						resolve("continue_popup");
					}
				},
				{
					isRed: true,
					info: "Cancel",
					svgWidth: "10",
					svgHeight: "11",
					path: "",
					defaultFillRule: "evenodd",
					defaultClipRule: "evenodd",
					onClick: () => {
						logSnackbarActionClicked({
							snackbarContext: "sub_account_insufficient_balance",
							snackbarAction: "cancel"
						});
						snackbar.clear();
						resolve("cancel");
					}
				}
			]
		});
	});
}
function parseFundingOptions({ errorData, sourceAddress }) {
	var _a;
	const spendPermissionRequests = [];
	for (const [token, { amount, sources }] of Object.entries((_a = errorData === null || errorData === void 0 ? void 0 : errorData.required) !== null && _a !== void 0 ? _a : {})) {
		if (sources.filter((source) => {
			return hexToBigInt(source.balance) >= hexToBigInt(amount) && source.address.toLowerCase() === (sourceAddress === null || sourceAddress === void 0 ? void 0 : sourceAddress.toLowerCase());
		}).length === 0) throw new Error("Source address has insufficient balance for a token");
		spendPermissionRequests.push({
			token,
			requiredAmount: hexToBigInt(amount)
		});
	}
	return spendPermissionRequests;
}
function isSendCallsParams(params) {
	return typeof params === "object" && params !== null && "calls" in params;
}
function isEthSendTransactionParams(params) {
	return Array.isArray(params) && params.length === 1 && typeof params[0] === "object" && params[0] !== null && "to" in params[0];
}
function compute16ByteHash(input) {
	return slice$2(keccak256(toHex$2(input)), 0, 16);
}
function makeDataSuffix({ attribution, dappOrigin }) {
	if (!attribution) return;
	if ("auto" in attribution && attribution.auto && dappOrigin) return compute16ByteHash(dappOrigin);
	if ("dataSuffix" in attribution) return attribution.dataSuffix;
}
/**
* Checks if a specific capability is present in a request's params
* @param request The request object to check
* @param capabilityName The name of the capability to check for
* @returns boolean indicating if the capability is present
*/
function requestHasCapability(request, capabilityName) {
	var _a;
	if (!Array.isArray(request === null || request === void 0 ? void 0 : request.params)) return false;
	const capabilities = (_a = request.params[0]) === null || _a === void 0 ? void 0 : _a.capabilities;
	if (!capabilities || typeof capabilities !== "object") return false;
	return capabilityName in capabilities;
}
/**
* Prepends an item to an array without duplicates
* @param array The array to prepend to
* @param item The item to prepend
* @returns The array with the item prepended
*/
function prependWithoutDuplicates(array, item) {
	return [item, ...array.filter((i) => i !== item)];
}
/**
* Appends an item to an array without duplicates
* @param array The array to append to
* @param item The item to append
* @returns The array with the item appended
*/
function appendWithoutDuplicates(array, item) {
	return [...array.filter((i) => i !== item), item];
}
async function getCachedWalletConnectResponse() {
	const spendPermissions = store.spendPermissions.get();
	const subAccount = store.subAccounts.get();
	const accounts = store.account.get().accounts;
	if (!accounts) return null;
	return { accounts: accounts === null || accounts === void 0 ? void 0 : accounts.map((account) => ({
		address: account,
		capabilities: {
			subAccounts: subAccount ? [subAccount] : void 0,
			spendPermissions: spendPermissions.length > 0 ? { permissions: spendPermissions } : void 0
		}
	})) };
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/util/encoding.js
function base64ToBase64Url(base64) {
	return base64.replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}
function arrayBufferToBase64Url(buffer) {
	return base64ToBase64Url(btoa(String.fromCharCode(...new Uint8Array(buffer))));
}
function convertCredentialToJSON({ webauthn, signature, id }) {
	const signatureRaw = fromHex$1(signature);
	return {
		id,
		rawId: arrayBufferToBase64Url(stringToBytes(id)),
		response: {
			authenticatorData: arrayBufferToBase64Url(hexToBytes$2(webauthn.authenticatorData)),
			clientDataJSON: arrayBufferToBase64Url(stringToBytes(webauthn.clientDataJSON)),
			signature: arrayBufferToBase64Url(asn1EncodeSignature(signatureRaw.r, signatureRaw.s))
		},
		type: JSON.parse(webauthn.clientDataJSON).type
	};
}
function asn1EncodeSignature(r, s) {
	const rBytes = hexToBytes$2(trim(numberToHex(r)));
	const sBytes = hexToBytes$2(trim(numberToHex(s)));
	const rLength = rBytes.length;
	const sLength = sBytes.length;
	const totalLength = rLength + sLength + 4;
	const signature = new Uint8Array(totalLength + 2);
	signature[0] = 48;
	signature[1] = totalLength;
	signature[2] = 2;
	signature[3] = rLength;
	signature.set(rBytes, 4);
	signature[rLength + 4] = 2;
	signature[rLength + 5] = sLength;
	signature.set(sBytes, rLength + 6);
	return signature;
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/scw/utils/createSmartAccount.js
var __rest$1 = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
/**
* @description Create a Coinbase Smart Account.
*
* @param parameters - {@link CreateSmartAccountParameters}
* @returns Coinbase Smart Account. {@link CreateSmartAccountReturnType}
*
* @example
*
* const account = createSmartAccount({
*   client,
*   owner: privateKeyToAccount('0x...'),
*   ownerIndex: 0,
*   address: '0x...',
*   factoryData: '0x...',
* })
*/
async function createSmartAccount(parameters) {
	const { owner, ownerIndex, address, client, factoryData } = parameters;
	const entryPoint = {
		abi: entryPoint06Abi,
		address: entryPoint06Address,
		version: "0.6"
	};
	const factory = {
		abi: factoryAbi,
		address: factoryAddress
	};
	return toSmartAccount({
		client,
		entryPoint,
		extend: {
			abi,
			factory
		},
		async decodeCalls(data) {
			const result = decodeFunctionData({
				abi,
				data
			});
			if (result.functionName === "execute") return [{
				to: result.args[0],
				value: result.args[1],
				data: result.args[2]
			}];
			if (result.functionName === "executeBatch") return result.args[0].map((arg) => ({
				to: arg.target,
				value: arg.value,
				data: arg.data
			}));
			throw new BaseError$1(`unable to decode calls for "${result.functionName}"`);
		},
		async encodeCalls(calls) {
			var _a, _b;
			if (calls.length === 1) return encodeFunctionData({
				abi,
				functionName: "execute",
				args: [
					calls[0].to,
					(_a = calls[0].value) !== null && _a !== void 0 ? _a : BigInt(0),
					(_b = calls[0].data) !== null && _b !== void 0 ? _b : "0x"
				]
			});
			return encodeFunctionData({
				abi,
				functionName: "executeBatch",
				args: [calls.map((call) => {
					var _a, _b;
					return {
						data: (_a = call.data) !== null && _a !== void 0 ? _a : "0x",
						target: call.to,
						value: (_b = call.value) !== null && _b !== void 0 ? _b : BigInt(0)
					};
				})]
			});
		},
		async getAddress() {
			return address;
		},
		async getFactoryArgs() {
			if (factoryData) return {
				factory: factory.address,
				factoryData
			};
			return {
				factory: factory.address,
				factoryData
			};
		},
		async getStubSignature() {
			if (owner.type === "webAuthn") return "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000000170000000000000000000000000000000000000000000000000000000000000001949fc7c88032b9fcb5f6efc7a7b8c63668eae9871b765e23123bb473ff57aa831a7c0d9276168ebcc29f2875a0239cffdf2a9cd1c2007c5c77c071db9264df1d000000000000000000000000000000000000000000000000000000000000002549960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008a7b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a2273496a396e6164474850596759334b7156384f7a4a666c726275504b474f716d59576f4d57516869467773222c226f726967696e223a2268747470733a2f2f7369676e2e636f696e626173652e636f6d222c2263726f73734f726967696e223a66616c73657d00000000000000000000000000000000000000000000";
			return wrapSignature({
				ownerIndex,
				signature: "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c"
			});
		},
		async sign(parameters) {
			return wrapSignature({
				ownerIndex,
				signature: await sign({
					hash: toReplaySafeHash({
						address: await this.getAddress(),
						chainId: client.chain.id,
						hash: parameters.hash
					}),
					owner
				})
			});
		},
		async signMessage(parameters) {
			const { message } = parameters;
			return wrapSignature({
				ownerIndex,
				signature: await sign({
					hash: toReplaySafeHash({
						address: await this.getAddress(),
						chainId: client.chain.id,
						hash: hashMessage(message)
					}),
					owner
				})
			});
		},
		async signTypedData(parameters) {
			const { domain, types, primaryType, message } = parameters;
			return wrapSignature({
				ownerIndex,
				signature: await sign({
					hash: toReplaySafeHash({
						address: await this.getAddress(),
						chainId: client.chain.id,
						hash: hashTypedData({
							domain,
							message,
							primaryType,
							types
						})
					}),
					owner
				})
			});
		},
		async signUserOperation(parameters) {
			const { chainId = client.chain.id } = parameters, userOperation = __rest$1(parameters, ["chainId"]);
			const address = await this.getAddress();
			return wrapSignature({
				ownerIndex,
				signature: await sign({
					hash: getUserOperationHash({
						chainId,
						entryPointAddress: entryPoint.address,
						entryPointVersion: entryPoint.version,
						userOperation: Object.assign(Object.assign({}, userOperation), { sender: address })
					}),
					owner
				})
			});
		},
		userOperation: { async estimateGas(userOperation) {
			var _a;
			if (owner.type !== "webAuthn") return;
			return { verificationGasLimit: BigInt(Math.max(Number((_a = userOperation.verificationGasLimit) !== null && _a !== void 0 ? _a : BigInt(0)), 8e5)) };
		} }
	});
}
/** @internal */
async function sign({ hash, owner }) {
	if (owner.type === "webAuthn") {
		const { signature, webauthn } = await owner.sign({ hash });
		return toWebAuthnSignature({
			signature,
			webauthn
		});
	}
	if (owner.sign) return owner.sign({ hash });
	throw new BaseError$1("`owner` does not support raw sign.");
}
/** @internal */
function toReplaySafeHash({ address, chainId, hash }) {
	return hashTypedData({
		domain: {
			chainId,
			name: "Coinbase Smart Wallet",
			verifyingContract: address,
			version: "1"
		},
		types: { CoinbaseSmartWalletMessage: [{
			name: "hash",
			type: "bytes32"
		}] },
		primaryType: "CoinbaseSmartWalletMessage",
		message: { hash }
	});
}
/** @internal */
function toWebAuthnSignature({ webauthn, signature }) {
	const { r, s } = fromHex$1(signature);
	return encodeAbiParameters([{
		components: [
			{
				name: "authenticatorData",
				type: "bytes"
			},
			{
				name: "clientDataJSON",
				type: "bytes"
			},
			{
				name: "challengeIndex",
				type: "uint256"
			},
			{
				name: "typeIndex",
				type: "uint256"
			},
			{
				name: "r",
				type: "uint256"
			},
			{
				name: "s",
				type: "uint256"
			}
		],
		type: "tuple"
	}], [{
		authenticatorData: webauthn.authenticatorData,
		clientDataJSON: stringToHex(webauthn.clientDataJSON),
		challengeIndex: BigInt(webauthn.challengeIndex),
		typeIndex: BigInt(webauthn.typeIndex),
		r,
		s
	}]);
}
/** @internal */
function wrapSignature(parameters) {
	const { ownerIndex = 0 } = parameters;
	return encodeAbiParameters([{
		components: [{
			name: "ownerIndex",
			type: "uint8"
		}, {
			name: "signatureData",
			type: "bytes"
		}],
		type: "tuple"
	}], [{
		ownerIndex,
		signatureData: (() => {
			if (size$2(parameters.signature) !== 65) return parameters.signature;
			const signature = parseSignature(parameters.signature);
			return encodePacked([
				"bytes32",
				"bytes32",
				"uint8"
			], [
				signature.r,
				signature.s,
				signature.yParity === 0 ? 27 : 28
			]);
		})()
	}]);
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/scw/utils/createSubAccountSigner.js
async function createSubAccountSigner({ address, client, factory, factoryData, owner, ownerIndex, parentAddress, attribution }) {
	var _a;
	const subAccount = {
		address,
		factory,
		factoryData
	};
	const chainId = (_a = client.chain) === null || _a === void 0 ? void 0 : _a.id;
	if (!chainId) throw standardErrors.rpc.internal("chainId not found");
	const account = await createSmartAccount({
		owner,
		ownerIndex: ownerIndex !== null && ownerIndex !== void 0 ? ownerIndex : 1,
		address,
		client,
		factoryData
	});
	const request = async (args) => {
		var _a, _b, _c, _d, _e, _f;
		try {
			switch (args.method) {
				case "wallet_addSubAccount": return subAccount;
				case "eth_accounts": return [subAccount.address];
				case "eth_coinbase": return subAccount.address;
				case "net_version": return chainId.toString();
				case "eth_chainId": return numberToHex(chainId);
				case "eth_sendTransaction": {
					assertArrayPresence(args.params);
					const rawParams = args.params[0];
					assertPresence(rawParams.to, standardErrors.rpc.invalidParams("to is required"));
					const params = {
						to: rawParams.to,
						data: ensureHexString((_a = rawParams.data) !== null && _a !== void 0 ? _a : "0x", true),
						value: ensureHexString((_b = rawParams.value) !== null && _b !== void 0 ? _b : "0x", true),
						from: (_c = rawParams.from) !== null && _c !== void 0 ? _c : subAccount.address
					};
					return waitForCallsTransactionHash({
						client,
						id: await request(createWalletSendCallsRequest({
							calls: [params],
							chainId,
							from: params.from
						}))
					});
				}
				case "wallet_sendCalls": {
					assertArrayPresence(args.params);
					const chainId = get(args.params[0], "chainId");
					if (!chainId) throw standardErrors.rpc.invalidParams("chainId is required");
					if (!isHex(chainId)) throw standardErrors.rpc.invalidParams("chainId must be a hex encoded integer");
					if (!args.params[0]) throw standardErrors.rpc.invalidParams("params are required");
					if (!("calls" in args.params[0])) throw standardErrors.rpc.invalidParams("calls are required");
					let prepareCallsRequest = {
						method: "wallet_prepareCalls",
						params: [{
							version: "1.0",
							calls: args.params[0].calls,
							chainId,
							from: subAccount.address,
							capabilities: "capabilities" in args.params[0] ? args.params[0].capabilities : {}
						}]
					};
					if (parentAddress) prepareCallsRequest = injectRequestCapabilities(prepareCallsRequest, { funding: [{
						type: "spendPermission",
						data: {
							autoApply: true,
							sources: [parentAddress],
							preference: "PREFER_DIRECT_BALANCE"
						}
					}] });
					let prepareCallsResponse = await request(prepareCallsRequest);
					const signResponse = await ((_e = (_d = owner).sign) === null || _e === void 0 ? void 0 : _e.call(_d, { hash: hexToString(prepareCallsResponse.signatureRequest.hash) }));
					let signatureData;
					if (!signResponse) throw standardErrors.rpc.internal("signature not found");
					if (isHex(signResponse)) signatureData = {
						type: "secp256k1",
						data: {
							address: owner.address,
							signature: signResponse
						}
					};
					else signatureData = {
						type: "webauthn",
						data: {
							signature: JSON.stringify(convertCredentialToJSON(Object.assign({ id: (_f = owner.id) !== null && _f !== void 0 ? _f : "1" }, signResponse))),
							publicKey: owner.publicKey
						}
					};
					return (await request({
						method: "wallet_sendPreparedCalls",
						params: [{
							version: "1.0",
							type: prepareCallsResponse.type,
							data: prepareCallsResponse.userOp,
							chainId: prepareCallsResponse.chainId,
							signature: signatureData
						}]
					}))[0];
				}
				case "wallet_sendPreparedCalls": {
					assertArrayPresence(args.params);
					const chainId = get(args.params[0], "chainId");
					if (!chainId) throw standardErrors.rpc.invalidParams("chainId is required");
					if (!isHex(chainId)) throw standardErrors.rpc.invalidParams("chainId must be a hex encoded integer");
					return await client.request({
						method: "wallet_sendPreparedCalls",
						params: args.params
					});
				}
				case "wallet_prepareCalls": {
					assertArrayPresence(args.params);
					const chainId = get(args.params[0], "chainId");
					if (!chainId) throw standardErrors.rpc.invalidParams("chainId is required");
					if (!isHex(chainId)) throw standardErrors.rpc.invalidParams("chainId must be a hex encoded integer");
					if (!args.params[0]) throw standardErrors.rpc.invalidParams("params are required");
					if (!get(args.params[0], "calls")) throw standardErrors.rpc.invalidParams("calls are required");
					const prepareCallsParams = args.params[0];
					if (attribution && prepareCallsParams.capabilities && !("attribution" in prepareCallsParams.capabilities)) prepareCallsParams.capabilities.attribution = attribution;
					return await client.request({
						method: "wallet_prepareCalls",
						params: [Object.assign(Object.assign({}, args.params[0]), { chainId })]
					});
				}
				case "personal_sign": {
					assertArrayPresence(args.params);
					if (!isHex(args.params[0])) throw standardErrors.rpc.invalidParams("message must be a hex encoded string");
					const message = hexToString(args.params[0]);
					return account.signMessage({ message });
				}
				case "eth_signTypedData_v4": {
					assertArrayPresence(args.params);
					const typedData = typeof args.params[1] === "string" ? JSON.parse(args.params[1]) : args.params[1];
					return account.signTypedData(typedData);
				}
				default: throw standardErrors.rpc.methodNotSupported();
			}
		} catch (error) {
			if (isViemError(error)) {
				const newError = viemHttpErrorToProviderError(error);
				if (newError) throw newError;
			}
			throw error;
		}
	};
	return { request };
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/scw/utils/findOwnerIndex.js
async function findOwnerIndex({ address, client, publicKey, factory, factoryData }) {
	if (!await getCode(client, { address }) && factory && factoryData) {
		if (getAddress(factory) !== getAddress("0x0ba5ed0c6aa8c49038f819e587e2633c4a9f428a")) throw standardErrors.rpc.internal("unknown factory address");
		const initData = decodeFunctionData({
			abi: factoryAbi,
			data: factoryData
		});
		if (initData.functionName !== "createAccount") throw standardErrors.rpc.internal("unknown factory function");
		const [owners] = initData.args;
		return owners.findIndex((owner) => {
			return owner.toLowerCase() === formatPublicKey(publicKey).toLowerCase();
		});
	}
	const ownerCount = await readContract(client, {
		address,
		abi,
		functionName: "ownerCount"
	});
	for (let i = Number(ownerCount) - 1; i >= 0; i--) {
		const owner = await readContract(client, {
			address,
			abi,
			functionName: "ownerAtIndex",
			args: [BigInt(i)]
		});
		const formatted = formatPublicKey(publicKey);
		if (owner.toLowerCase() === formatted.toLowerCase()) return i;
	}
	return -1;
}
/**
* Formats 20 byte addresses to 32 byte public keys. Contract uses 32 byte keys for owners.
* @param publicKey - The public key to format
* @returns The formatted public key
*/
function formatPublicKey(publicKey) {
	if (isAddress(publicKey)) return pad$1(publicKey);
	return publicKey;
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/scw/utils/presentAddOwnerDialog.js
async function presentAddOwnerDialog() {
	const snackbar = initSnackbar();
	return new Promise((resolve) => {
		logSnackbarShown({ snackbarContext: "sub_account_add_owner" });
		snackbar.presentItem({
			autoExpand: true,
			message: "App requires a signer update",
			menuItems: [{
				isRed: false,
				info: "Confirm",
				svgWidth: "10",
				svgHeight: "11",
				path: "",
				defaultFillRule: "evenodd",
				defaultClipRule: "evenodd",
				onClick: () => {
					logSnackbarActionClicked({
						snackbarContext: "sub_account_add_owner",
						snackbarAction: "confirm"
					});
					snackbar.clear();
					resolve("authenticate");
				}
			}, {
				isRed: true,
				info: "Cancel",
				svgWidth: "10",
				svgHeight: "11",
				path: "",
				defaultFillRule: "evenodd",
				defaultClipRule: "evenodd",
				onClick: () => {
					logSnackbarActionClicked({
						snackbarContext: "sub_account_add_owner",
						snackbarAction: "cancel"
					});
					snackbar.clear();
					resolve("cancel");
				}
			}]
		});
	});
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/scw/utils/handleAddSubAccountOwner.js
async function handleAddSubAccountOwner({ ownerAccount, globalAccountRequest }) {
	var _a, _b;
	const account = store.account.get();
	const subAccount = store.subAccounts.get();
	const globalAccount = (_a = account.accounts) === null || _a === void 0 ? void 0 : _a.find((account) => account.toLowerCase() !== (subAccount === null || subAccount === void 0 ? void 0 : subAccount.address.toLowerCase()));
	assertPresence(globalAccount, standardErrors.provider.unauthorized("no global account"));
	assertPresence((_b = account.chain) === null || _b === void 0 ? void 0 : _b.id, standardErrors.provider.unauthorized("no chain id"));
	assertPresence(subAccount === null || subAccount === void 0 ? void 0 : subAccount.address, standardErrors.provider.unauthorized("no sub account"));
	const calls = [];
	if (ownerAccount.type === "local" && ownerAccount.address) calls.push({
		to: subAccount.address,
		data: encodeFunctionData({
			abi,
			functionName: "addOwnerAddress",
			args: [ownerAccount.address]
		}),
		value: toHex$2(0)
	});
	if (ownerAccount.publicKey) {
		const [x, y] = decodeAbiParameters([{ type: "bytes32" }, { type: "bytes32" }], ownerAccount.publicKey);
		calls.push({
			to: subAccount.address,
			data: encodeFunctionData({
				abi,
				functionName: "addOwnerPublicKey",
				args: [x, y]
			}),
			value: toHex$2(0)
		});
	}
	const request = {
		method: "wallet_sendCalls",
		params: [{
			version: "1",
			calls,
			chainId: numberToHex(84532),
			from: globalAccount
		}]
	};
	if (await presentAddOwnerDialog() === "cancel") throw standardErrors.provider.unauthorized("user cancelled");
	const callsId = await globalAccountRequest(request);
	const client = getClient(account.chain.id);
	assertPresence(client, standardErrors.rpc.internal(`client not found for chainId ${account.chain.id}`));
	if ((await waitForCallsStatus(client, { id: callsId })).status !== "success") throw standardErrors.rpc.internal("add owner call failed");
	const ownerIndex = await findOwnerIndex({
		address: subAccount.address,
		publicKey: ownerAccount.type === "local" && ownerAccount.address ? ownerAccount.address : ownerAccount.publicKey,
		client
	});
	if (ownerIndex === -1) throw standardErrors.rpc.internal("failed to find owner index");
	return ownerIndex;
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/scw/utils/handleInsufficientBalance.js
async function handleInsufficientBalanceError({ errorData, globalAccountAddress, subAccountAddress, client, request, subAccountRequest, globalAccountRequest }) {
	var _a;
	const chainId = (_a = client.chain) === null || _a === void 0 ? void 0 : _a.id;
	assertPresence(chainId, standardErrors.rpc.internal(`invalid chainId`));
	const spendPermissionRequests = parseFundingOptions({
		errorData,
		sourceAddress: globalAccountAddress
	});
	const userChoice = await presentSubAccountFundingDialog();
	if (userChoice === "cancel") throw new Error("User cancelled funding");
	let signatureRequest;
	const defaultPeriod = 3600 * 24;
	const defaultMultiplier = 3;
	if (userChoice === "update_permission") {
		if (spendPermissionRequests.length === 1) {
			const spendPermission = spendPermissionRequests[0];
			signatureRequest = {
				method: "eth_signTypedData_v4",
				params: [globalAccountAddress, createSpendPermissionMessage({
					spendPermission: {
						token: spendPermission.token,
						allowance: numberToHex(spendPermission.requiredAmount * BigInt(defaultMultiplier)),
						period: defaultPeriod,
						account: globalAccountAddress,
						spender: subAccountAddress,
						start: 0,
						end: 0xffffffffffff,
						salt: numberToHex(BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))),
						extraData: "0x"
					},
					chainId
				})]
			};
		} else signatureRequest = {
			method: "eth_signTypedData_v4",
			params: [globalAccountAddress, createSpendPermissionBatchMessage({
				spendPermissionBatch: {
					account: globalAccountAddress,
					period: defaultPeriod,
					start: 0,
					end: 0xffffffffffff,
					permissions: spendPermissionRequests.map((spendPermission) => ({
						token: spendPermission.token,
						allowance: numberToHex(spendPermission.requiredAmount * BigInt(defaultMultiplier)),
						period: defaultPeriod,
						account: globalAccountAddress,
						spender: subAccountAddress,
						salt: "0x0",
						extraData: "0x"
					}))
				},
				chainId
			})]
		};
		try {
			await globalAccountRequest(signatureRequest);
		} catch (error) {
			console.error(error);
			throw new Error("User denied spend permission request");
		}
		return subAccountRequest(request);
	}
	const transferCalls = spendPermissionRequests.map((spendPermission) => {
		if (spendPermission.token.toLowerCase() === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE".toLowerCase()) return {
			to: subAccountAddress,
			value: numberToHex(spendPermission.requiredAmount),
			data: "0x"
		};
		return {
			to: spendPermission.token,
			value: "0x0",
			data: encodeFunctionData({
				abi: erc20Abi,
				functionName: "transfer",
				args: [subAccountAddress, spendPermission.requiredAmount]
			})
		};
	});
	let originalSendCallsParams;
	if (request.method === "wallet_sendCalls" && isSendCallsParams(request.params)) originalSendCallsParams = request.params[0];
	else if (request.method === "eth_sendTransaction" && isEthSendTransactionParams(request.params)) originalSendCallsParams = createWalletSendCallsRequest({
		calls: [request.params[0]],
		chainId,
		from: request.params[0].from
	}).params[0];
	else throw new Error("Could not get original call");
	const subAccountCallData = encodeFunctionData({
		abi,
		functionName: "executeBatch",
		args: [originalSendCallsParams.calls.map((call) => {
			var _a, _b;
			return {
				target: call.to,
				value: hexToBigInt((_a = call.value) !== null && _a !== void 0 ? _a : "0x0"),
				data: (_b = call.data) !== null && _b !== void 0 ? _b : "0x"
			};
		})]
	});
	const calls = [...transferCalls, {
		data: subAccountCallData,
		to: subAccountAddress,
		value: "0x0"
	}];
	const result = await globalAccountRequest({
		method: "wallet_sendCalls",
		params: [Object.assign(Object.assign({}, originalSendCallsParams), {
			calls,
			from: globalAccountAddress
		})]
	});
	if (request.method === "eth_sendTransaction") return waitForCallsTransactionHash({
		client,
		id: result
	});
	return result;
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/scw/SCWSigner.js
var SCWSigner = class {
	constructor(params) {
		var _a, _b, _c, _d;
		this.communicator = params.communicator;
		this.callback = params.callback;
		this.keyManager = new SCWKeyManager();
		const { account, chains } = store.getState();
		this.accounts = (_a = account.accounts) !== null && _a !== void 0 ? _a : [];
		this.chain = (_b = account.chain) !== null && _b !== void 0 ? _b : { id: (_d = (_c = params.metadata.appChainIds) === null || _c === void 0 ? void 0 : _c[0]) !== null && _d !== void 0 ? _d : 1 };
		if (chains) createClients(chains);
	}
	async handshake(args) {
		var _a, _b, _c;
		const correlationId = correlationIds.get(args);
		logHandshakeStarted$1({
			method: args.method,
			correlationId
		});
		try {
			await ((_b = (_a = this.communicator).waitForPopupLoaded) === null || _b === void 0 ? void 0 : _b.call(_a));
			const handshakeMessage = await this.createRequestMessage({ handshake: {
				method: args.method,
				params: (_c = args.params) !== null && _c !== void 0 ? _c : []
			} }, correlationId);
			const response = await this.communicator.postRequestAndWaitForResponse(handshakeMessage);
			if ("failure" in response.content) throw response.content.failure;
			const peerPublicKey = await importKeyFromHexString("public", response.sender);
			await this.keyManager.setPeerPublicKey(peerPublicKey);
			const decrypted = await this.decryptResponseMessage(response);
			this.handleResponse(args, decrypted);
			logHandshakeCompleted$1({
				method: args.method,
				correlationId
			});
		} catch (error) {
			logHandshakeError$1({
				method: args.method,
				correlationId,
				errorMessage: parseErrorMessageFromAny(error)
			});
			throw error;
		}
	}
	async request(request) {
		const correlationId = correlationIds.get(request);
		logRequestStarted$1({
			method: request.method,
			correlationId
		});
		try {
			const result = await this._request(request);
			logRequestCompleted$1({
				method: request.method,
				correlationId
			});
			return result;
		} catch (error) {
			logRequestError$1({
				method: request.method,
				correlationId,
				errorMessage: parseErrorMessageFromAny(error)
			});
			throw error;
		}
	}
	async _request(request) {
		var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
		if (this.accounts.length === 0) switch (request.method) {
			case "eth_requestAccounts":
				await ((_b = (_a = this.communicator).waitForPopupLoaded) === null || _b === void 0 ? void 0 : _b.call(_a));
				await initSubAccountConfig();
				await this.request({
					method: "wallet_connect",
					params: [{
						version: "1",
						capabilities: Object.assign({}, (_d = (_c = store.subAccountsConfig.get()) === null || _c === void 0 ? void 0 : _c.capabilities) !== null && _d !== void 0 ? _d : {})
					}]
				});
				return this.accounts;
			case "wallet_switchEthereumChain":
				assertParamsChainId(request.params);
				this.chain.id = Number(request.params[0].chainId);
				return;
			case "wallet_connect": {
				await ((_f = (_e = this.communicator).waitForPopupLoaded) === null || _f === void 0 ? void 0 : _f.call(_e));
				await initSubAccountConfig();
				let capabilitiesToInject = {};
				if (requestHasCapability(request, "addSubAccount")) capabilitiesToInject = (_h = (_g = store.subAccountsConfig.get()) === null || _g === void 0 ? void 0 : _g.capabilities) !== null && _h !== void 0 ? _h : {};
				const modifiedRequest = injectRequestCapabilities(request, capabilitiesToInject);
				return this.sendRequestToPopup(modifiedRequest);
			}
			case "wallet_sendCalls":
			case "wallet_sign": return this.sendRequestToPopup(request);
			default: throw standardErrors.provider.unauthorized();
		}
		if (this.shouldRequestUseSubAccountSigner(request)) {
			const correlationId = correlationIds.get(request);
			logSubAccountRequestStarted({
				method: request.method,
				correlationId
			});
			try {
				const result = await this.sendRequestToSubAccountSigner(request);
				logSubAccountRequestCompleted({
					method: request.method,
					correlationId
				});
				return result;
			} catch (error) {
				logSubAccountRequestError({
					method: request.method,
					correlationId,
					errorMessage: parseErrorMessageFromAny(error)
				});
				throw error;
			}
		}
		switch (request.method) {
			case "eth_requestAccounts":
			case "eth_accounts": {
				const subAccount = store.subAccounts.get();
				const subAccountsConfig = store.subAccountsConfig.get();
				if (subAccount === null || subAccount === void 0 ? void 0 : subAccount.address) this.accounts = (subAccountsConfig === null || subAccountsConfig === void 0 ? void 0 : subAccountsConfig.enableAutoSubAccounts) ? prependWithoutDuplicates(this.accounts, subAccount.address) : appendWithoutDuplicates(this.accounts, subAccount.address);
				(_j = this.callback) === null || _j === void 0 || _j.call(this, "connect", { chainId: numberToHex(this.chain.id) });
				return this.accounts;
			}
			case "eth_coinbase": return this.accounts[0];
			case "net_version": return this.chain.id;
			case "eth_chainId": return numberToHex(this.chain.id);
			case "wallet_getCapabilities": return this.handleGetCapabilitiesRequest(request);
			case "wallet_switchEthereumChain": return this.handleSwitchChainRequest(request);
			case "eth_ecRecover":
			case "personal_sign":
			case "wallet_sign":
			case "personal_ecRecover":
			case "eth_signTransaction":
			case "eth_sendTransaction":
			case "eth_signTypedData_v1":
			case "eth_signTypedData_v3":
			case "eth_signTypedData_v4":
			case "eth_signTypedData":
			case "wallet_addEthereumChain":
			case "wallet_watchAsset":
			case "wallet_sendCalls":
			case "wallet_showCallsStatus":
			case "wallet_grantPermissions": return this.sendRequestToPopup(request);
			case "wallet_connect": {
				const cachedResponse = await getCachedWalletConnectResponse();
				if (cachedResponse) return cachedResponse;
				await ((_l = (_k = this.communicator).waitForPopupLoaded) === null || _l === void 0 ? void 0 : _l.call(_k));
				await initSubAccountConfig();
				const subAccountsConfig = store.subAccountsConfig.get();
				const modifiedRequest = injectRequestCapabilities(request, (_m = subAccountsConfig === null || subAccountsConfig === void 0 ? void 0 : subAccountsConfig.capabilities) !== null && _m !== void 0 ? _m : {});
				(_o = this.callback) === null || _o === void 0 || _o.call(this, "connect", { chainId: numberToHex(this.chain.id) });
				return this.sendRequestToPopup(modifiedRequest);
			}
			case "wallet_getSubAccounts": {
				const subAccount = store.subAccounts.get();
				if (subAccount === null || subAccount === void 0 ? void 0 : subAccount.address) return { subAccounts: [subAccount] };
				if (!this.chain.rpcUrl) throw standardErrors.rpc.internal("No RPC URL set for chain");
				const response = await fetchRPCRequest(request, this.chain.rpcUrl);
				assertArrayPresence(response.subAccounts, "subAccounts");
				if (response.subAccounts.length > 0) {
					assertSubAccount(response.subAccounts[0]);
					const subAccount = response.subAccounts[0];
					store.subAccounts.set({
						address: subAccount.address,
						factory: subAccount.factory,
						factoryData: subAccount.factoryData
					});
				}
				return response;
			}
			case "wallet_addSubAccount": return this.addSubAccount(request);
			case "coinbase_fetchPermissions": {
				assertFetchPermissionsRequest(request);
				const completeRequest = fillMissingParamsForFetchPermissions(request);
				const permissions = await fetchRPCRequest(completeRequest, CB_WALLET_RPC_URL);
				const requestedChainId = hexToNumber$2((_p = completeRequest.params) === null || _p === void 0 ? void 0 : _p[0].chainId);
				store.spendPermissions.set(permissions.permissions.map((permission) => Object.assign(Object.assign({}, permission), { chainId: requestedChainId })));
				return permissions;
			}
			default:
				if (!this.chain.rpcUrl) throw standardErrors.rpc.internal("No RPC URL set for chain");
				return fetchRPCRequest(request, this.chain.rpcUrl);
		}
	}
	async sendRequestToPopup(request) {
		var _a, _b;
		await ((_b = (_a = this.communicator).waitForPopupLoaded) === null || _b === void 0 ? void 0 : _b.call(_a));
		const response = await this.sendEncryptedRequest(request);
		const decrypted = await this.decryptResponseMessage(response);
		return this.handleResponse(request, decrypted);
	}
	async handleResponse(request, decrypted) {
		var _a, _b, _c, _d, _e;
		const result = decrypted.result;
		if ("error" in result) throw result.error;
		switch (request.method) {
			case "eth_requestAccounts": {
				const accounts = result.value;
				this.accounts = accounts;
				store.account.set({
					accounts,
					chain: this.chain
				});
				(_a = this.callback) === null || _a === void 0 || _a.call(this, "accountsChanged", accounts);
				break;
			}
			case "wallet_connect": {
				const response = result.value;
				const accounts = response.accounts.map((account) => account.address);
				this.accounts = accounts;
				store.account.set({ accounts });
				const account = response.accounts.at(0);
				const capabilities = account === null || account === void 0 ? void 0 : account.capabilities;
				if (capabilities === null || capabilities === void 0 ? void 0 : capabilities.subAccounts) {
					const capabilityResponse = capabilities === null || capabilities === void 0 ? void 0 : capabilities.subAccounts;
					assertArrayPresence(capabilityResponse, "subAccounts");
					assertSubAccount(capabilityResponse[0]);
					store.subAccounts.set({
						address: capabilityResponse[0].address,
						factory: capabilityResponse[0].factory,
						factoryData: capabilityResponse[0].factoryData
					});
				}
				let accounts_ = [this.accounts[0]];
				const subAccount = store.subAccounts.get();
				const subAccountsConfig = store.subAccountsConfig.get();
				if (subAccount === null || subAccount === void 0 ? void 0 : subAccount.address) this.accounts = (subAccountsConfig === null || subAccountsConfig === void 0 ? void 0 : subAccountsConfig.enableAutoSubAccounts) ? prependWithoutDuplicates(this.accounts, subAccount.address) : appendWithoutDuplicates(this.accounts, subAccount.address);
				const spendPermissions = (_c = (_b = response === null || response === void 0 ? void 0 : response.accounts) === null || _b === void 0 ? void 0 : _b[0].capabilities) === null || _c === void 0 ? void 0 : _c.spendPermissions;
				if (spendPermissions && "permissions" in spendPermissions) store.spendPermissions.set(spendPermissions === null || spendPermissions === void 0 ? void 0 : spendPermissions.permissions);
				(_d = this.callback) === null || _d === void 0 || _d.call(this, "accountsChanged", accounts_);
				break;
			}
			case "wallet_addSubAccount": {
				assertSubAccount(result.value);
				const subAccount = result.value;
				store.subAccounts.set(subAccount);
				const subAccountsConfig = store.subAccountsConfig.get();
				this.accounts = (subAccountsConfig === null || subAccountsConfig === void 0 ? void 0 : subAccountsConfig.enableAutoSubAccounts) ? prependWithoutDuplicates(this.accounts, subAccount.address) : appendWithoutDuplicates(this.accounts, subAccount.address);
				(_e = this.callback) === null || _e === void 0 || _e.call(this, "accountsChanged", this.accounts);
				break;
			}
			default: break;
		}
		return result.value;
	}
	async cleanup() {
		var _a, _b;
		const metadata = store.config.get().metadata;
		await this.keyManager.clear();
		store.account.clear();
		store.subAccounts.clear();
		store.spendPermissions.clear();
		store.chains.clear();
		this.accounts = [];
		this.chain = { id: (_b = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.appChainIds) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : 1 };
	}
	/**
	* @returns `null` if the request was successful.
	* https://eips.ethereum.org/EIPS/eip-3326#wallet_switchethereumchain
	*/
	async handleSwitchChainRequest(request) {
		assertParamsChainId(request.params);
		const chainId = ensureIntNumber(request.params[0].chainId);
		if (this.updateChain(chainId)) return null;
		const popupResult = await this.sendRequestToPopup(request);
		if (popupResult === null) this.updateChain(chainId);
		return popupResult;
	}
	async handleGetCapabilitiesRequest(request) {
		assertGetCapabilitiesParams(request.params);
		const requestedAccount = request.params[0];
		const filterChainIds = request.params[1];
		if (!this.accounts.some((account) => isAddressEqual(account, requestedAccount))) throw standardErrors.provider.unauthorized("no active account found when getting capabilities");
		const capabilities = store.getState().account.capabilities;
		if (!capabilities) return {};
		if (!filterChainIds || filterChainIds.length === 0) return capabilities;
		const filterChainNumbers = new Set(filterChainIds.map((chainId) => hexToNumber$2(chainId)));
		return Object.fromEntries(Object.entries(capabilities).filter(([capabilityKey]) => {
			try {
				const capabilityChainNumber = hexToNumber$2(capabilityKey);
				return filterChainNumbers.has(capabilityChainNumber);
			} catch (_a) {
				return false;
			}
		}));
	}
	async sendEncryptedRequest(request) {
		const sharedSecret = await this.keyManager.getSharedSecret();
		if (!sharedSecret) throw standardErrors.provider.unauthorized("No shared secret found when encrypting request");
		const encrypted = await encryptContent({
			action: request,
			chainId: this.chain.id
		}, sharedSecret);
		const correlationId = correlationIds.get(request);
		const message = await this.createRequestMessage({ encrypted }, correlationId);
		return this.communicator.postRequestAndWaitForResponse(message);
	}
	async createRequestMessage(content, correlationId) {
		const publicKey = await exportKeyToHexString("public", await this.keyManager.getOwnPublicKey());
		return {
			id: crypto.randomUUID(),
			correlationId,
			sender: publicKey,
			content,
			timestamp: /* @__PURE__ */ new Date()
		};
	}
	async decryptResponseMessage(message) {
		var _a, _b, _c;
		const content = message.content;
		if ("failure" in content) throw content.failure;
		const sharedSecret = await this.keyManager.getSharedSecret();
		if (!sharedSecret) throw standardErrors.provider.unauthorized("Invalid session: no shared secret found when decrypting response");
		const response = await decryptContent(content.encrypted, sharedSecret);
		const availableChains = (_a = response.data) === null || _a === void 0 ? void 0 : _a.chains;
		if (availableChains) {
			const nativeCurrencies = (_b = response.data) === null || _b === void 0 ? void 0 : _b.nativeCurrencies;
			const chains = Object.entries(availableChains).map(([id, rpcUrl]) => {
				const nativeCurrency = nativeCurrencies === null || nativeCurrencies === void 0 ? void 0 : nativeCurrencies[Number(id)];
				return Object.assign({
					id: Number(id),
					rpcUrl
				}, nativeCurrency ? { nativeCurrency } : {});
			});
			store.chains.set(chains);
			this.updateChain(this.chain.id, chains);
			createClients(chains);
		}
		const walletCapabilities = (_c = response.data) === null || _c === void 0 ? void 0 : _c.capabilities;
		if (walletCapabilities) store.account.set({ capabilities: walletCapabilities });
		return response;
	}
	updateChain(chainId, newAvailableChains) {
		var _a;
		const state = store.getState();
		const chains = newAvailableChains !== null && newAvailableChains !== void 0 ? newAvailableChains : state.chains;
		const chain = chains === null || chains === void 0 ? void 0 : chains.find((chain) => chain.id === chainId);
		if (!chain) return false;
		if (chain !== this.chain) {
			this.chain = chain;
			store.account.set({ chain });
			(_a = this.callback) === null || _a === void 0 || _a.call(this, "chainChanged", hexStringFromNumber(chain.id));
		}
		return true;
	}
	async addSubAccount(request) {
		var _a, _b, _c, _d;
		const subAccount = store.getState().subAccount;
		const subAccountsConfig = store.subAccountsConfig.get();
		if (subAccount === null || subAccount === void 0 ? void 0 : subAccount.address) {
			this.accounts = (subAccountsConfig === null || subAccountsConfig === void 0 ? void 0 : subAccountsConfig.enableAutoSubAccounts) ? prependWithoutDuplicates(this.accounts, subAccount.address) : appendWithoutDuplicates(this.accounts, subAccount.address);
			(_a = this.callback) === null || _a === void 0 || _a.call(this, "accountsChanged", this.accounts);
			return subAccount;
		}
		await ((_c = (_b = this.communicator).waitForPopupLoaded) === null || _c === void 0 ? void 0 : _c.call(_b));
		if (Array.isArray(request.params) && request.params.length > 0 && request.params[0].account && request.params[0].account.type === "create") {
			let keys;
			if (request.params[0].account.keys && request.params[0].account.keys.length > 0) keys = request.params[0].account.keys;
			else {
				const config = (_d = store.subAccountsConfig.get()) !== null && _d !== void 0 ? _d : {};
				const { account: ownerAccount } = config.toOwnerAccount ? await config.toOwnerAccount() : await getCryptoKeyAccount();
				if (!ownerAccount) throw standardErrors.provider.unauthorized("could not get subaccount owner account when adding sub account");
				keys = [{
					type: ownerAccount.address ? "address" : "webauthn-p256",
					publicKey: ownerAccount.address || ownerAccount.publicKey
				}];
			}
			request.params[0].account.keys = keys;
		}
		const response = await this.sendRequestToPopup(request);
		assertSubAccount(response);
		return response;
	}
	shouldRequestUseSubAccountSigner(request) {
		const sender = getSenderFromRequest(request);
		const subAccount = store.subAccounts.get();
		if (sender) return sender.toLowerCase() === (subAccount === null || subAccount === void 0 ? void 0 : subAccount.address.toLowerCase());
		return false;
	}
	async sendRequestToSubAccountSigner(request) {
		var _a;
		const subAccount = store.subAccounts.get();
		const subAccountsConfig = store.subAccountsConfig.get();
		const config = store.config.get();
		assertPresence(subAccount === null || subAccount === void 0 ? void 0 : subAccount.address, standardErrors.provider.unauthorized("no active sub account when sending request to sub account signer"));
		const ownerAccount = (subAccountsConfig === null || subAccountsConfig === void 0 ? void 0 : subAccountsConfig.toOwnerAccount) ? await subAccountsConfig.toOwnerAccount() : await getCryptoKeyAccount();
		assertPresence(ownerAccount === null || ownerAccount === void 0 ? void 0 : ownerAccount.account, standardErrors.provider.unauthorized("no active sub account owner when sending request to sub account signer"));
		if (getSenderFromRequest(request) === void 0) request = addSenderToRequest(request, subAccount.address);
		const client = getClient(this.chain.id);
		assertPresence(client, standardErrors.rpc.internal(`client not found for chainId ${this.chain.id} when sending request to sub account signer`));
		const globalAccountAddress = this.accounts.find((account) => account.toLowerCase() !== subAccount.address.toLowerCase());
		assertPresence(globalAccountAddress, standardErrors.provider.unauthorized("no global account found when sending request to sub account signer"));
		const dataSuffix = makeDataSuffix({
			attribution: (_a = config.preference) === null || _a === void 0 ? void 0 : _a.attribution,
			dappOrigin: window.location.origin
		});
		const publicKey = ownerAccount.account.type === "local" ? ownerAccount.account.address : ownerAccount.account.publicKey;
		let ownerIndex = await findOwnerIndex({
			address: subAccount.address,
			factory: subAccount.factory,
			factoryData: subAccount.factoryData,
			publicKey,
			client
		});
		if (ownerIndex === -1) {
			const correlationId = correlationIds.get(request);
			logAddOwnerStarted({
				method: request.method,
				correlationId
			});
			try {
				ownerIndex = await handleAddSubAccountOwner({
					ownerAccount: ownerAccount.account,
					globalAccountRequest: this.sendRequestToPopup.bind(this)
				});
				logAddOwnerCompleted({
					method: request.method,
					correlationId
				});
			} catch (error) {
				logAddOwnerError({
					method: request.method,
					correlationId,
					errorMessage: parseErrorMessageFromAny(error)
				});
				return standardErrors.provider.unauthorized("failed to add sub account owner when sending request to sub account signer");
			}
		}
		const { request: subAccountRequest } = await createSubAccountSigner({
			address: subAccount.address,
			owner: ownerAccount.account,
			client,
			factory: subAccount.factory,
			factoryData: subAccount.factoryData,
			parentAddress: globalAccountAddress,
			attribution: dataSuffix ? { suffix: dataSuffix } : void 0,
			ownerIndex
		});
		try {
			return await subAccountRequest(request);
		} catch (error) {
			let errorObject;
			if (isViemError(error)) errorObject = JSON.parse(error.details);
			else if (isActionableHttpRequestError(error)) errorObject = error;
			else throw error;
			if (!(isActionableHttpRequestError(errorObject) && errorObject.data)) throw error;
			if (!errorObject.data) throw error;
			const correlationId = correlationIds.get(request);
			logInsufficientBalanceErrorHandlingStarted({
				method: request.method,
				correlationId
			});
			try {
				const result = await handleInsufficientBalanceError({
					errorData: errorObject.data,
					globalAccountAddress,
					subAccountAddress: subAccount.address,
					client,
					request,
					subAccountRequest,
					globalAccountRequest: this.request.bind(this)
				});
				logInsufficientBalanceErrorHandlingCompleted({
					method: request.method,
					correlationId
				});
				return result;
			} catch (handlingError) {
				console.error(handlingError);
				logInsufficientBalanceErrorHandlingError({
					method: request.method,
					correlationId,
					errorMessage: parseErrorMessageFromAny(handlingError)
				});
				throw error;
			}
		}
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/telemetry/events/walletlink-signer.js
var logHandshakeStarted = ({ method, correlationId }) => {
	logEvent("walletlink_signer.handshake.started", {
		action: ActionType.unknown,
		componentType: ComponentType.unknown,
		method,
		correlationId
	}, AnalyticsEventImportance.high);
};
var logHandshakeError = ({ method, correlationId, errorMessage }) => {
	logEvent("walletlink_signer.handshake.error", {
		action: ActionType.error,
		componentType: ComponentType.unknown,
		method,
		correlationId,
		errorMessage
	}, AnalyticsEventImportance.high);
};
var logHandshakeCompleted = ({ method, correlationId }) => {
	logEvent("walletlink_signer.handshake.completed", {
		action: ActionType.unknown,
		componentType: ComponentType.unknown,
		method,
		correlationId
	}, AnalyticsEventImportance.high);
};
var logRequestStarted = ({ method, correlationId }) => {
	logEvent("walletlink_signer.request.started", {
		action: ActionType.unknown,
		componentType: ComponentType.unknown,
		method,
		correlationId
	}, AnalyticsEventImportance.high);
};
var logRequestError = ({ method, correlationId, errorMessage }) => {
	logEvent("walletlink_signer.request.error", {
		action: ActionType.error,
		componentType: ComponentType.unknown,
		method,
		correlationId,
		errorMessage
	}, AnalyticsEventImportance.high);
};
var logRequestCompleted = ({ method, correlationId }) => {
	logEvent("walletlink_signer.request.completed", {
		action: ActionType.unknown,
		componentType: ComponentType.unknown,
		method,
		correlationId
	}, AnalyticsEventImportance.high);
};
var logWalletLinkConnectionConnectionFailed = () => {
	logEvent("walletlink_signer.walletlink_connection.connection_failed", {
		action: ActionType.measurement,
		componentType: ComponentType.unknown
	}, AnalyticsEventImportance.high);
};
var logWalletLinkConnectionFetchUnseenEventsFailed = () => {
	logEvent("walletlink_signer.walletlink_connection.fetch_unseen_events_failed", {
		action: ActionType.measurement,
		componentType: ComponentType.unknown
	}, AnalyticsEventImportance.high);
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/hashes/_assert.js
var require__assert = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.output = exports.exists = exports.hash = exports.bytes = exports.bool = exports.number = exports.isBytes = void 0;
	function number(n) {
		if (!Number.isSafeInteger(n) || n < 0) throw new Error(`positive integer expected, not ${n}`);
	}
	exports.number = number;
	function bool(b) {
		if (typeof b !== "boolean") throw new Error(`boolean expected, not ${b}`);
	}
	exports.bool = bool;
	function isBytes(a) {
		return a instanceof Uint8Array || a != null && typeof a === "object" && a.constructor.name === "Uint8Array";
	}
	exports.isBytes = isBytes;
	function bytes(b, ...lengths) {
		if (!isBytes(b)) throw new Error("Uint8Array expected");
		if (lengths.length > 0 && !lengths.includes(b.length)) throw new Error(`Uint8Array expected of length ${lengths}, not of length=${b.length}`);
	}
	exports.bytes = bytes;
	function hash(h) {
		if (typeof h !== "function" || typeof h.create !== "function") throw new Error("Hash should be wrapped by utils.wrapConstructor");
		number(h.outputLen);
		number(h.blockLen);
	}
	exports.hash = hash;
	function exists(instance, checkFinished = true) {
		if (instance.destroyed) throw new Error("Hash instance has been destroyed");
		if (checkFinished && instance.finished) throw new Error("Hash#digest() has already been called");
	}
	exports.exists = exists;
	function output(out, instance) {
		bytes(out);
		const min = instance.outputLen;
		if (out.length < min) throw new Error(`digestInto() expects output buffer of length at least ${min}`);
	}
	exports.output = output;
	exports.default = {
		number,
		bool,
		bytes,
		hash,
		exists,
		output
	};
}));
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/hashes/_u64.js
var require__u64 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.add5L = exports.add5H = exports.add4H = exports.add4L = exports.add3H = exports.add3L = exports.add = exports.rotlBL = exports.rotlBH = exports.rotlSL = exports.rotlSH = exports.rotr32L = exports.rotr32H = exports.rotrBL = exports.rotrBH = exports.rotrSL = exports.rotrSH = exports.shrSL = exports.shrSH = exports.toBig = exports.split = exports.fromBig = void 0;
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
	exports.fromBig = fromBig;
	function split(lst, le = false) {
		let Ah = new Uint32Array(lst.length);
		let Al = new Uint32Array(lst.length);
		for (let i = 0; i < lst.length; i++) {
			const { h, l } = fromBig(lst[i], le);
			[Ah[i], Al[i]] = [h, l];
		}
		return [Ah, Al];
	}
	exports.split = split;
	var toBig = (h, l) => BigInt(h >>> 0) << _32n | BigInt(l >>> 0);
	exports.toBig = toBig;
	var shrSH = (h, _l, s) => h >>> s;
	exports.shrSH = shrSH;
	var shrSL = (h, l, s) => h << 32 - s | l >>> s;
	exports.shrSL = shrSL;
	var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
	exports.rotrSH = rotrSH;
	var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
	exports.rotrSL = rotrSL;
	var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
	exports.rotrBH = rotrBH;
	var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
	exports.rotrBL = rotrBL;
	var rotr32H = (_h, l) => l;
	exports.rotr32H = rotr32H;
	var rotr32L = (h, _l) => h;
	exports.rotr32L = rotr32L;
	var rotlSH = (h, l, s) => h << s | l >>> 32 - s;
	exports.rotlSH = rotlSH;
	var rotlSL = (h, l, s) => l << s | h >>> 32 - s;
	exports.rotlSL = rotlSL;
	var rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
	exports.rotlBH = rotlBH;
	var rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
	exports.rotlBL = rotlBL;
	function add(Ah, Al, Bh, Bl) {
		const l = (Al >>> 0) + (Bl >>> 0);
		return {
			h: Ah + Bh + (l / 2 ** 32 | 0) | 0,
			l: l | 0
		};
	}
	exports.add = add;
	var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
	exports.add3L = add3L;
	var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
	exports.add3H = add3H;
	var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
	exports.add4L = add4L;
	var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
	exports.add4H = add4H;
	var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
	exports.add5L = add5L;
	var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
	exports.add5H = add5H;
	exports.default = {
		fromBig,
		split,
		toBig,
		shrSH,
		shrSL,
		rotrSH,
		rotrSL,
		rotrBH,
		rotrBL,
		rotr32H,
		rotr32L,
		rotlSH,
		rotlSL,
		rotlBH,
		rotlBL,
		add,
		add3L,
		add3H,
		add4L,
		add4H,
		add5H,
		add5L
	};
}));
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/hashes/crypto.js
var require_crypto = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.crypto = void 0;
	exports.crypto = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
}));
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/hashes/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.randomBytes = exports.wrapXOFConstructorWithOpts = exports.wrapConstructorWithOpts = exports.wrapConstructor = exports.checkOpts = exports.Hash = exports.concatBytes = exports.toBytes = exports.utf8ToBytes = exports.asyncLoop = exports.nextTick = exports.hexToBytes = exports.bytesToHex = exports.byteSwap32 = exports.byteSwapIfBE = exports.byteSwap = exports.isLE = exports.rotl = exports.rotr = exports.createView = exports.u32 = exports.u8 = exports.isBytes = void 0;
	var crypto_1 = require_crypto();
	var _assert_js_1 = require__assert();
	function isBytes(a) {
		return a instanceof Uint8Array || a != null && typeof a === "object" && a.constructor.name === "Uint8Array";
	}
	exports.isBytes = isBytes;
	var u8 = (arr) => new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
	exports.u8 = u8;
	var u32 = (arr) => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
	exports.u32 = u32;
	var createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
	exports.createView = createView;
	var rotr = (word, shift) => word << 32 - shift | word >>> shift;
	exports.rotr = rotr;
	var rotl = (word, shift) => word << shift | word >>> 32 - shift >>> 0;
	exports.rotl = rotl;
	exports.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
	var byteSwap = (word) => word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
	exports.byteSwap = byteSwap;
	exports.byteSwapIfBE = exports.isLE ? (n) => n : (n) => (0, exports.byteSwap)(n);
	function byteSwap32(arr) {
		for (let i = 0; i < arr.length; i++) arr[i] = (0, exports.byteSwap)(arr[i]);
	}
	exports.byteSwap32 = byteSwap32;
	var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
	/**
	* @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
	*/
	function bytesToHex(bytes) {
		(0, _assert_js_1.bytes)(bytes);
		let hex = "";
		for (let i = 0; i < bytes.length; i++) hex += hexes[bytes[i]];
		return hex;
	}
	exports.bytesToHex = bytesToHex;
	var asciis = {
		_0: 48,
		_9: 57,
		_A: 65,
		_F: 70,
		_a: 97,
		_f: 102
	};
	function asciiToBase16(char) {
		if (char >= asciis._0 && char <= asciis._9) return char - asciis._0;
		if (char >= asciis._A && char <= asciis._F) return char - (asciis._A - 10);
		if (char >= asciis._a && char <= asciis._f) return char - (asciis._a - 10);
	}
	/**
	* @example hexToBytes('cafe0123') // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
	*/
	function hexToBytes(hex) {
		if (typeof hex !== "string") throw new Error("hex string expected, got " + typeof hex);
		const hl = hex.length;
		const al = hl / 2;
		if (hl % 2) throw new Error("padded hex string expected, got unpadded hex of length " + hl);
		const array = new Uint8Array(al);
		for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
			const n1 = asciiToBase16(hex.charCodeAt(hi));
			const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
			if (n1 === void 0 || n2 === void 0) {
				const char = hex[hi] + hex[hi + 1];
				throw new Error("hex string expected, got non-hex character \"" + char + "\" at index " + hi);
			}
			array[ai] = n1 * 16 + n2;
		}
		return array;
	}
	exports.hexToBytes = hexToBytes;
	var nextTick = async () => {};
	exports.nextTick = nextTick;
	async function asyncLoop(iters, tick, cb) {
		let ts = Date.now();
		for (let i = 0; i < iters; i++) {
			cb(i);
			const diff = Date.now() - ts;
			if (diff >= 0 && diff < tick) continue;
			await (0, exports.nextTick)();
			ts += diff;
		}
	}
	exports.asyncLoop = asyncLoop;
	/**
	* @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
	*/
	function utf8ToBytes(str) {
		if (typeof str !== "string") throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
		return new Uint8Array(new TextEncoder().encode(str));
	}
	exports.utf8ToBytes = utf8ToBytes;
	/**
	* Normalizes (non-hex) string or Uint8Array to Uint8Array.
	* Warning: when Uint8Array is passed, it would NOT get copied.
	* Keep in mind for future mutable operations.
	*/
	function toBytes(data) {
		if (typeof data === "string") data = utf8ToBytes(data);
		(0, _assert_js_1.bytes)(data);
		return data;
	}
	exports.toBytes = toBytes;
	/**
	* Copies several Uint8Arrays into one.
	*/
	function concatBytes(...arrays) {
		let sum = 0;
		for (let i = 0; i < arrays.length; i++) {
			const a = arrays[i];
			(0, _assert_js_1.bytes)(a);
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
	exports.concatBytes = concatBytes;
	var Hash = class {
		clone() {
			return this._cloneInto();
		}
	};
	exports.Hash = Hash;
	var toStr = {}.toString;
	function checkOpts(defaults, opts) {
		if (opts !== void 0 && toStr.call(opts) !== "[object Object]") throw new Error("Options should be object or undefined");
		return Object.assign(defaults, opts);
	}
	exports.checkOpts = checkOpts;
	function wrapConstructor(hashCons) {
		const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
		const tmp = hashCons();
		hashC.outputLen = tmp.outputLen;
		hashC.blockLen = tmp.blockLen;
		hashC.create = () => hashCons();
		return hashC;
	}
	exports.wrapConstructor = wrapConstructor;
	function wrapConstructorWithOpts(hashCons) {
		const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
		const tmp = hashCons({});
		hashC.outputLen = tmp.outputLen;
		hashC.blockLen = tmp.blockLen;
		hashC.create = (opts) => hashCons(opts);
		return hashC;
	}
	exports.wrapConstructorWithOpts = wrapConstructorWithOpts;
	function wrapXOFConstructorWithOpts(hashCons) {
		const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
		const tmp = hashCons({});
		hashC.outputLen = tmp.outputLen;
		hashC.blockLen = tmp.blockLen;
		hashC.create = (opts) => hashCons(opts);
		return hashC;
	}
	exports.wrapXOFConstructorWithOpts = wrapXOFConstructorWithOpts;
	/**
	* Secure PRNG. Uses `crypto.getRandomValues`, which defers to OS.
	*/
	function randomBytes(bytesLength = 32) {
		if (crypto_1.crypto && typeof crypto_1.crypto.getRandomValues === "function") return crypto_1.crypto.getRandomValues(new Uint8Array(bytesLength));
		throw new Error("crypto.getRandomValues must be defined");
	}
	exports.randomBytes = randomBytes;
}));
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/hashes/sha3.js
var require_sha3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.shake256 = exports.shake128 = exports.keccak_512 = exports.keccak_384 = exports.keccak_256 = exports.keccak_224 = exports.sha3_512 = exports.sha3_384 = exports.sha3_256 = exports.sha3_224 = exports.Keccak = exports.keccakP = void 0;
	var _assert_js_1 = require__assert();
	var _u64_js_1 = require__u64();
	var utils_js_1 = require_utils();
	var SHA3_PI = [];
	var SHA3_ROTL = [];
	var _SHA3_IOTA = [];
	var _0n = /* @__PURE__ */ BigInt(0);
	var _1n = /* @__PURE__ */ BigInt(1);
	var _2n = /* @__PURE__ */ BigInt(2);
	var _7n = /* @__PURE__ */ BigInt(7);
	var _256n = /* @__PURE__ */ BigInt(256);
	var _0x71n = /* @__PURE__ */ BigInt(113);
	for (let round = 0, R = _1n, x = 1, y = 0; round < 24; round++) {
		[x, y] = [y, (2 * x + 3 * y) % 5];
		SHA3_PI.push(2 * (5 * y + x));
		SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
		let t = _0n;
		for (let j = 0; j < 7; j++) {
			R = (R << _1n ^ (R >> _7n) * _0x71n) % _256n;
			if (R & _2n) t ^= _1n << (_1n << /* @__PURE__ */ BigInt(j)) - _1n;
		}
		_SHA3_IOTA.push(t);
	}
	var [SHA3_IOTA_H, SHA3_IOTA_L] = /* @__PURE__ */ (0, _u64_js_1.split)(_SHA3_IOTA, true);
	var rotlH = (h, l, s) => s > 32 ? (0, _u64_js_1.rotlBH)(h, l, s) : (0, _u64_js_1.rotlSH)(h, l, s);
	var rotlL = (h, l, s) => s > 32 ? (0, _u64_js_1.rotlBL)(h, l, s) : (0, _u64_js_1.rotlSL)(h, l, s);
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
		B.fill(0);
	}
	exports.keccakP = keccakP;
	var Keccak = class Keccak extends utils_js_1.Hash {
		constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
			super();
			this.blockLen = blockLen;
			this.suffix = suffix;
			this.outputLen = outputLen;
			this.enableXOF = enableXOF;
			this.rounds = rounds;
			this.pos = 0;
			this.posOut = 0;
			this.finished = false;
			this.destroyed = false;
			(0, _assert_js_1.number)(outputLen);
			if (0 >= this.blockLen || this.blockLen >= 200) throw new Error("Sha3 supports only keccak-f1600 function");
			this.state = new Uint8Array(200);
			this.state32 = (0, utils_js_1.u32)(this.state);
		}
		keccak() {
			if (!utils_js_1.isLE) (0, utils_js_1.byteSwap32)(this.state32);
			keccakP(this.state32, this.rounds);
			if (!utils_js_1.isLE) (0, utils_js_1.byteSwap32)(this.state32);
			this.posOut = 0;
			this.pos = 0;
		}
		update(data) {
			(0, _assert_js_1.exists)(this);
			const { blockLen, state } = this;
			data = (0, utils_js_1.toBytes)(data);
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
			(0, _assert_js_1.exists)(this, false);
			(0, _assert_js_1.bytes)(out);
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
			(0, _assert_js_1.number)(bytes);
			return this.xofInto(new Uint8Array(bytes));
		}
		digestInto(out) {
			(0, _assert_js_1.output)(out, this);
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
			this.state.fill(0);
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
	exports.Keccak = Keccak;
	var gen = (suffix, blockLen, outputLen) => (0, utils_js_1.wrapConstructor)(() => new Keccak(blockLen, suffix, outputLen));
	exports.sha3_224 = gen(6, 144, 224 / 8);
	/**
	* SHA3-256 hash function
	* @param message - that would be hashed
	*/
	exports.sha3_256 = gen(6, 136, 256 / 8);
	exports.sha3_384 = gen(6, 104, 384 / 8);
	exports.sha3_512 = gen(6, 72, 512 / 8);
	exports.keccak_224 = gen(1, 144, 224 / 8);
	/**
	* keccak-256 hash function. Different from SHA3-256.
	* @param message - that would be hashed
	*/
	exports.keccak_256 = gen(1, 136, 256 / 8);
	exports.keccak_384 = gen(1, 104, 384 / 8);
	exports.keccak_512 = gen(1, 72, 512 / 8);
	var genShake = (suffix, blockLen, outputLen) => (0, utils_js_1.wrapXOFConstructorWithOpts)((opts = {}) => new Keccak(blockLen, suffix, opts.dkLen === void 0 ? outputLen : opts.dkLen, true));
	exports.shake128 = genShake(31, 168, 128 / 8);
	exports.shake256 = genShake(31, 136, 256 / 8);
}));
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/vendor-js/eth-eip712-util/util.cjs
var require_util = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { keccak_256 } = require_sha3();
	/**
	* Returns a buffer filled with 0s
	* @method zeros
	* @param {Number} bytes  the number of bytes the buffer should be
	* @return {Buffer}
	*/
	function zeros(bytes) {
		return Buffer.allocUnsafe(bytes).fill(0);
	}
	/**
	* Converts a `Number` into a hex `String` (https://github.com/ethjs/ethjs-util/blob/master/src/index.js)
	* @param {Number} i
	* @return {String}
	*/
	function intToHex(i) {
		return `0x${i.toString(16)}`;
	}
	/**
	* Converts an `Number` to a `Buffer` (https://github.com/ethjs/ethjs-util/blob/master/src/index.js)
	* @param {Number} i
	* @return {Buffer}
	*/
	function intToBuffer(i) {
		const hex = intToHex(i);
		return new Buffer(padToEven(hex.slice(2)), "hex");
	}
	function bitLengthFromBigInt(num) {
		return num.toString(2).length;
	}
	function bufferBEFromBigInt(num, length) {
		let hex = num.toString(16);
		if (hex.length % 2 !== 0) hex = "0" + hex;
		const byteArray = hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16));
		while (byteArray.length < length) byteArray.unshift(0);
		return Buffer.from(byteArray);
	}
	function twosFromBigInt(value, width) {
		const isNegative = value < 0n;
		let result;
		if (isNegative) {
			const mask = (1n << BigInt(width)) - 1n;
			result = (~value & mask) + 1n;
		} else result = value;
		result &= (1n << BigInt(width)) - 1n;
		return result;
	}
	/**
	* Left Pads an `Array` or `Buffer` with leading zeros till it has `length` bytes.
	* Or it truncates the beginning if it exceeds.
	* @method setLength
	* @param {Buffer|Array} msg the value to pad
	* @param {Number} length the number of bytes the output should be
	* @param {Boolean} [right=false] whether to start padding form the left or right
	* @return {Buffer|Array}
	*/
	function setLength(msg, length, right) {
		const buf = zeros(length);
		msg = toBuffer(msg);
		if (right) {
			if (msg.length < length) {
				msg.copy(buf);
				return buf;
			}
			return msg.slice(0, length);
		} else {
			if (msg.length < length) {
				msg.copy(buf, length - msg.length);
				return buf;
			}
			return msg.slice(-length);
		}
	}
	/**
	* Right Pads an `Array` or `Buffer` with leading zeros till it has `length` bytes.
	* Or it truncates the beginning if it exceeds.
	* @param {Buffer|Array} msg the value to pad
	* @param {Number} length the number of bytes the output should be
	* @return {Buffer|Array}
	*/
	function setLengthRight(msg, length) {
		return setLength(msg, length, true);
	}
	/**
	* Attempts to turn a value into a `Buffer`. As input it supports `Buffer`, `String`, `Number`, null/undefined, `BIgInt` and other objects with a `toArray()` method.
	* @param {*} v the value
	*/
	function toBuffer(v) {
		if (!Buffer.isBuffer(v)) if (Array.isArray(v)) v = Buffer.from(v);
		else if (typeof v === "string") if (isHexString(v)) v = Buffer.from(padToEven(stripHexPrefix(v)), "hex");
		else v = Buffer.from(v);
		else if (typeof v === "number") v = intToBuffer(v);
		else if (v === null || v === void 0) v = Buffer.allocUnsafe(0);
		else if (typeof v === "bigint") v = bufferBEFromBigInt(v);
		else if (v.toArray) v = Buffer.from(v.toArray());
		else throw new Error("invalid type");
		return v;
	}
	/**
	* Converts a `Buffer` into a hex `String`
	* @param {Buffer} buf
	* @return {String}
	*/
	function bufferToHex(buf) {
		buf = toBuffer(buf);
		return "0x" + buf.toString("hex");
	}
	/**
	* Creates Keccak hash of the input
	* @param {Buffer|Array|String|Number} a the input data
	* @param {Number} [bits=256] the Keccak width
	* @return {Buffer}
	*/
	function keccak(a, bits) {
		a = toBuffer(a);
		if (!bits) bits = 256;
		if (bits !== 256) throw new Error("unsupported");
		return Buffer.from(keccak_256(new Uint8Array(a)));
	}
	function padToEven(str) {
		return str.length % 2 ? "0" + str : str;
	}
	function isHexString(str) {
		return typeof str === "string" && str.match(/^0x[0-9A-Fa-f]*$/);
	}
	function stripHexPrefix(str) {
		if (typeof str === "string" && str.startsWith("0x")) return str.slice(2);
		return str;
	}
	module.exports = {
		zeros,
		setLength,
		setLengthRight,
		isHexString,
		stripHexPrefix,
		toBuffer,
		bufferToHex,
		keccak,
		bitLengthFromBigInt,
		bufferBEFromBigInt,
		twosFromBigInt
	};
}));
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/vendor-js/eth-eip712-util/abi.cjs
var require_abi = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var util = require_util();
	function elementaryName(name) {
		if (name.startsWith("int[")) return "int256" + name.slice(3);
		else if (name === "int") return "int256";
		else if (name.startsWith("uint[")) return "uint256" + name.slice(4);
		else if (name === "uint") return "uint256";
		else if (name.startsWith("fixed[")) return "fixed128x128" + name.slice(5);
		else if (name === "fixed") return "fixed128x128";
		else if (name.startsWith("ufixed[")) return "ufixed128x128" + name.slice(6);
		else if (name === "ufixed") return "ufixed128x128";
		return name;
	}
	function parseTypeN(type) {
		return Number.parseInt(/^\D+(\d+)$/.exec(type)[1], 10);
	}
	function parseTypeNxM(type) {
		var tmp = /^\D+(\d+)x(\d+)$/.exec(type);
		return [Number.parseInt(tmp[1], 10), Number.parseInt(tmp[2], 10)];
	}
	function parseTypeArray(type) {
		var tmp = type.match(/(.*)\[(.*?)\]$/);
		if (tmp) return tmp[2] === "" ? "dynamic" : Number.parseInt(tmp[2], 10);
		return null;
	}
	function parseNumber(arg) {
		var type = typeof arg;
		if (type === "string" || type === "number") return BigInt(arg);
		else if (type === "bigint") return arg;
		else throw new Error("Argument is not a number");
	}
	function encodeSingle(type, arg) {
		var size, num, ret, i;
		if (type === "address") return encodeSingle("uint160", parseNumber(arg));
		else if (type === "bool") return encodeSingle("uint8", arg ? 1 : 0);
		else if (type === "string") return encodeSingle("bytes", new Buffer(arg, "utf8"));
		else if (isArray(type)) {
			if (typeof arg.length === "undefined") throw new Error("Not an array?");
			size = parseTypeArray(type);
			if (size !== "dynamic" && size !== 0 && arg.length > size) throw new Error("Elements exceed array size: " + size);
			ret = [];
			type = type.slice(0, type.lastIndexOf("["));
			if (typeof arg === "string") arg = JSON.parse(arg);
			for (i in arg) ret.push(encodeSingle(type, arg[i]));
			if (size === "dynamic") {
				var length = encodeSingle("uint256", arg.length);
				ret.unshift(length);
			}
			return Buffer.concat(ret);
		} else if (type === "bytes") {
			arg = new Buffer(arg);
			ret = Buffer.concat([encodeSingle("uint256", arg.length), arg]);
			if (arg.length % 32 !== 0) ret = Buffer.concat([ret, util.zeros(32 - arg.length % 32)]);
			return ret;
		} else if (type.startsWith("bytes")) {
			size = parseTypeN(type);
			if (size < 1 || size > 32) throw new Error("Invalid bytes<N> width: " + size);
			return util.setLengthRight(arg, 32);
		} else if (type.startsWith("uint")) {
			size = parseTypeN(type);
			if (size % 8 || size < 8 || size > 256) throw new Error("Invalid uint<N> width: " + size);
			num = parseNumber(arg);
			const bitLength = util.bitLengthFromBigInt(num);
			if (bitLength > size) throw new Error("Supplied uint exceeds width: " + size + " vs " + bitLength);
			if (num < 0) throw new Error("Supplied uint is negative");
			return util.bufferBEFromBigInt(num, 32);
		} else if (type.startsWith("int")) {
			size = parseTypeN(type);
			if (size % 8 || size < 8 || size > 256) throw new Error("Invalid int<N> width: " + size);
			num = parseNumber(arg);
			const bitLength = util.bitLengthFromBigInt(num);
			if (bitLength > size) throw new Error("Supplied int exceeds width: " + size + " vs " + bitLength);
			const twos = util.twosFromBigInt(num, 256);
			return util.bufferBEFromBigInt(twos, 32);
		} else if (type.startsWith("ufixed")) {
			size = parseTypeNxM(type);
			num = parseNumber(arg);
			if (num < 0) throw new Error("Supplied ufixed is negative");
			return encodeSingle("uint256", num * BigInt(2) ** BigInt(size[1]));
		} else if (type.startsWith("fixed")) {
			size = parseTypeNxM(type);
			return encodeSingle("int256", parseNumber(arg) * BigInt(2) ** BigInt(size[1]));
		}
		throw new Error("Unsupported or invalid type: " + type);
	}
	function isDynamic(type) {
		return type === "string" || type === "bytes" || parseTypeArray(type) === "dynamic";
	}
	function isArray(type) {
		return type.lastIndexOf("]") === type.length - 1;
	}
	function rawEncode(types, values) {
		var output = [];
		var data = [];
		var headLength = 32 * types.length;
		for (var i in types) {
			var type = elementaryName(types[i]);
			var value = values[i];
			var cur = encodeSingle(type, value);
			if (isDynamic(type)) {
				output.push(encodeSingle("uint256", headLength));
				data.push(cur);
				headLength += cur.length;
			} else output.push(cur);
		}
		return Buffer.concat(output.concat(data));
	}
	function solidityPack(types, values) {
		if (types.length !== values.length) throw new Error("Number of types are not matching the values");
		var size, num;
		var ret = [];
		for (var i = 0; i < types.length; i++) {
			var type = elementaryName(types[i]);
			var value = values[i];
			if (type === "bytes") ret.push(value);
			else if (type === "string") ret.push(new Buffer(value, "utf8"));
			else if (type === "bool") ret.push(new Buffer(value ? "01" : "00", "hex"));
			else if (type === "address") ret.push(util.setLength(value, 20));
			else if (type.startsWith("bytes")) {
				size = parseTypeN(type);
				if (size < 1 || size > 32) throw new Error("Invalid bytes<N> width: " + size);
				ret.push(util.setLengthRight(value, size));
			} else if (type.startsWith("uint")) {
				size = parseTypeN(type);
				if (size % 8 || size < 8 || size > 256) throw new Error("Invalid uint<N> width: " + size);
				num = parseNumber(value);
				const bitLength = util.bitLengthFromBigInt(num);
				if (bitLength > size) throw new Error("Supplied uint exceeds width: " + size + " vs " + bitLength);
				ret.push(util.bufferBEFromBigInt(num, size / 8));
			} else if (type.startsWith("int")) {
				size = parseTypeN(type);
				if (size % 8 || size < 8 || size > 256) throw new Error("Invalid int<N> width: " + size);
				num = parseNumber(value);
				const bitLength = util.bitLengthFromBigInt(num);
				if (bitLength > size) throw new Error("Supplied int exceeds width: " + size + " vs " + bitLength);
				const twos = util.twosFromBigInt(num, size);
				ret.push(util.bufferBEFromBigInt(twos, size / 8));
			} else throw new Error("Unsupported or invalid type: " + type);
		}
		return Buffer.concat(ret);
	}
	function soliditySHA3(types, values) {
		return util.keccak(solidityPack(types, values));
	}
	module.exports = {
		rawEncode,
		solidityPack,
		soliditySHA3
	};
}));
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/constants.js
var import_eth_eip712_util = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var util = require_util();
	var abi = require_abi();
	var TYPED_MESSAGE_SCHEMA = {
		type: "object",
		properties: {
			types: {
				type: "object",
				additionalProperties: {
					type: "array",
					items: {
						type: "object",
						properties: {
							name: { type: "string" },
							type: { type: "string" }
						},
						required: ["name", "type"]
					}
				}
			},
			primaryType: { type: "string" },
			domain: { type: "object" },
			message: { type: "object" }
		},
		required: [
			"types",
			"primaryType",
			"domain",
			"message"
		]
	};
	/**
	* A collection of utility functions used for signing typed data
	*/
	var TypedDataUtils = {
		encodeData(primaryType, data, types, useV4 = true) {
			const encodedTypes = ["bytes32"];
			const encodedValues = [this.hashType(primaryType, types)];
			if (useV4) {
				const encodeField = (name, type, value) => {
					if (types[type] !== void 0) return ["bytes32", value == null ? "0x0000000000000000000000000000000000000000000000000000000000000000" : util.keccak(this.encodeData(type, value, types, useV4))];
					if (value === void 0) throw new Error(`missing value for field ${name} of type ${type}`);
					if (type === "bytes") return ["bytes32", util.keccak(value)];
					if (type === "string") {
						if (typeof value === "string") value = Buffer.from(value, "utf8");
						return ["bytes32", util.keccak(value)];
					}
					if (type.lastIndexOf("]") === type.length - 1) {
						const parsedType = type.slice(0, type.lastIndexOf("["));
						const typeValuePairs = value.map((item) => encodeField(name, parsedType, item));
						return ["bytes32", util.keccak(abi.rawEncode(typeValuePairs.map(([type]) => type), typeValuePairs.map(([, value]) => value)))];
					}
					return [type, value];
				};
				for (const field of types[primaryType]) {
					const [type, value] = encodeField(field.name, field.type, data[field.name]);
					encodedTypes.push(type);
					encodedValues.push(value);
				}
			} else for (const field of types[primaryType]) {
				let value = data[field.name];
				if (value !== void 0) if (field.type === "bytes") {
					encodedTypes.push("bytes32");
					value = util.keccak(value);
					encodedValues.push(value);
				} else if (field.type === "string") {
					encodedTypes.push("bytes32");
					if (typeof value === "string") value = Buffer.from(value, "utf8");
					value = util.keccak(value);
					encodedValues.push(value);
				} else if (types[field.type] !== void 0) {
					encodedTypes.push("bytes32");
					value = util.keccak(this.encodeData(field.type, value, types, useV4));
					encodedValues.push(value);
				} else if (field.type.lastIndexOf("]") === field.type.length - 1) throw new Error("Arrays currently unimplemented in encodeData");
				else {
					encodedTypes.push(field.type);
					encodedValues.push(value);
				}
			}
			return abi.rawEncode(encodedTypes, encodedValues);
		},
		encodeType(primaryType, types) {
			let result = "";
			let deps = this.findTypeDependencies(primaryType, types).filter((dep) => dep !== primaryType);
			deps = [primaryType].concat(deps.sort());
			for (const type of deps) {
				if (!types[type]) throw new Error("No type definition specified: " + type);
				result += type + "(" + types[type].map(({ name, type }) => type + " " + name).join(",") + ")";
			}
			return result;
		},
		findTypeDependencies(primaryType, types, results = []) {
			primaryType = primaryType.match(/^\w*/)[0];
			if (results.includes(primaryType) || types[primaryType] === void 0) return results;
			results.push(primaryType);
			for (const field of types[primaryType]) for (const dep of this.findTypeDependencies(field.type, types, results)) !results.includes(dep) && results.push(dep);
			return results;
		},
		hashStruct(primaryType, data, types, useV4 = true) {
			return util.keccak(this.encodeData(primaryType, data, types, useV4));
		},
		hashType(primaryType, types) {
			return util.keccak(this.encodeType(primaryType, types));
		},
		sanitizeData(data) {
			const sanitizedData = {};
			for (const key in TYPED_MESSAGE_SCHEMA.properties) data[key] && (sanitizedData[key] = data[key]);
			if (sanitizedData.types) sanitizedData.types = Object.assign({ EIP712Domain: [] }, sanitizedData.types);
			return sanitizedData;
		},
		hash(typedData, useV4 = true) {
			const sanitizedData = this.sanitizeData(typedData);
			const parts = [Buffer.from("1901", "hex")];
			parts.push(this.hashStruct("EIP712Domain", sanitizedData.domain, sanitizedData.types, useV4));
			if (sanitizedData.primaryType !== "EIP712Domain") parts.push(this.hashStruct(sanitizedData.primaryType, sanitizedData.message, sanitizedData.types, useV4));
			return util.keccak(Buffer.concat(parts));
		}
	};
	module.exports = {
		TYPED_MESSAGE_SCHEMA,
		TypedDataUtils,
		hashForSignTypedDataLegacy: function(msgParams) {
			return typedSignatureHashLegacy(msgParams.data);
		},
		hashForSignTypedData_v3: function(msgParams) {
			return TypedDataUtils.hash(msgParams.data, false);
		},
		hashForSignTypedData_v4: function(msgParams) {
			return TypedDataUtils.hash(msgParams.data);
		}
	};
	/**
	* @param typedData - Array of data along with types, as per EIP712.
	* @returns Buffer
	*/
	function typedSignatureHashLegacy(typedData) {
		const error = /* @__PURE__ */ new Error("Expect argument to be non-empty array");
		if (typeof typedData !== "object" || !typedData.length) throw error;
		const data = typedData.map(function(e) {
			return e.type === "bytes" ? util.toBuffer(e.value) : e.value;
		});
		const types = typedData.map(function(e) {
			return e.type;
		});
		const schema = typedData.map(function(e) {
			if (!e.name) throw error;
			return e.type + " " + e.name;
		});
		return abi.soliditySHA3(["bytes32", "bytes32"], [abi.soliditySHA3(new Array(typedData.length).fill("string"), schema), abi.soliditySHA3(types, data)]);
	}
})))(), 1);
var WALLET_USER_NAME_KEY = "walletUsername";
var LOCAL_STORAGE_ADDRESSES_KEY = "Addresses";
var APP_VERSION_KEY = "AppVersion";
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/connection/WalletLinkCipher.js
var WalletLinkCipher = class {
	constructor(secret) {
		this.secret = secret;
	}
	/**
	*
	* @param plainText string to be encrypted
	* returns hex string representation of bytes in the order: initialization vector (iv),
	* auth tag, encrypted plaintext. IV is 12 bytes. Auth tag is 16 bytes. Remaining bytes are the
	* encrypted plainText.
	*/
	async encrypt(plainText) {
		const secret = this.secret;
		if (secret.length !== 64) throw new Error(`secret must be 256 bits`);
		const ivBytes = crypto.getRandomValues(new Uint8Array(12));
		const secretKey = await crypto.subtle.importKey("raw", hexStringToUint8Array(secret), { name: "aes-gcm" }, false, ["encrypt", "decrypt"]);
		const enc = new TextEncoder();
		const encryptedResult = await window.crypto.subtle.encrypt({
			name: "AES-GCM",
			iv: ivBytes
		}, secretKey, enc.encode(plainText));
		const tagLength = 16;
		const authTag = encryptedResult.slice(encryptedResult.byteLength - tagLength);
		const encryptedPlaintext = encryptedResult.slice(0, encryptedResult.byteLength - tagLength);
		const authTagBytes = new Uint8Array(authTag);
		const encryptedPlaintextBytes = new Uint8Array(encryptedPlaintext);
		return uint8ArrayToHex(new Uint8Array([
			...ivBytes,
			...authTagBytes,
			...encryptedPlaintextBytes
		]));
	}
	/**
	*
	* @param cipherText hex string representation of bytes in the order: initialization vector (iv),
	* auth tag, encrypted plaintext. IV is 12 bytes. Auth tag is 16 bytes.
	*/
	async decrypt(cipherText) {
		const secret = this.secret;
		if (secret.length !== 64) throw new Error(`secret must be 256 bits`);
		return new Promise((resolve, reject) => {
			(async () => {
				const secretKey = await crypto.subtle.importKey("raw", hexStringToUint8Array(secret), { name: "aes-gcm" }, false, ["encrypt", "decrypt"]);
				const encrypted = hexStringToUint8Array(cipherText);
				const ivBytes = encrypted.slice(0, 12);
				const authTagBytes = encrypted.slice(12, 28);
				const encryptedPlaintextBytes = encrypted.slice(28);
				const concatenatedBytes = new Uint8Array([...encryptedPlaintextBytes, ...authTagBytes]);
				const algo = {
					name: "AES-GCM",
					iv: new Uint8Array(ivBytes)
				};
				try {
					const decrypted = await window.crypto.subtle.decrypt(algo, secretKey, concatenatedBytes);
					resolve(new TextDecoder().decode(decrypted));
				} catch (err) {
					reject(err);
				}
			})();
		});
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/connection/WalletLinkHTTP.js
var WalletLinkHTTP = class {
	constructor(linkAPIUrl, sessionId, sessionKey) {
		this.linkAPIUrl = linkAPIUrl;
		this.sessionId = sessionId;
		const credentials = `${sessionId}:${sessionKey}`;
		this.auth = `Basic ${btoa(credentials)}`;
	}
	async markUnseenEventsAsSeen(events) {
		return Promise.all(events.map((e) => fetch(`${this.linkAPIUrl}/events/${e.eventId}/seen`, {
			method: "POST",
			headers: { Authorization: this.auth }
		}))).catch((error) => console.error("Unable to mark events as seen:", error));
	}
	async fetchUnseenEvents() {
		var _a;
		const response = await fetch(`${this.linkAPIUrl}/events?unseen=true`, { headers: { Authorization: this.auth } });
		if (response.ok) {
			const { events, error } = await response.json();
			if (error) throw new Error(`Check unseen events failed: ${error}`);
			const responseEvents = (_a = events === null || events === void 0 ? void 0 : events.filter((e) => e.event === "Web3Response").map((e) => ({
				type: "Event",
				sessionId: this.sessionId,
				eventId: e.id,
				event: e.event,
				data: e.data
			}))) !== null && _a !== void 0 ? _a : [];
			this.markUnseenEventsAsSeen(responseEvents);
			return responseEvents;
		}
		throw new Error(`Check unseen events failed: ${response.status}`);
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/connection/WalletLinkWebSocket.js
var ConnectionState;
(function(ConnectionState) {
	ConnectionState[ConnectionState["DISCONNECTED"] = 0] = "DISCONNECTED";
	ConnectionState[ConnectionState["CONNECTING"] = 1] = "CONNECTING";
	ConnectionState[ConnectionState["CONNECTED"] = 2] = "CONNECTED";
})(ConnectionState || (ConnectionState = {}));
var WalletLinkWebSocket = class WalletLinkWebSocket {
	setConnectionStateListener(listener) {
		this.connectionStateListener = listener;
	}
	setIncomingDataListener(listener) {
		this.incomingDataListener = listener;
	}
	/**
	* Constructor
	* @param url WebSocket server URL
	* @param [WebSocketClass] Custom WebSocket implementation
	*/
	constructor(url, WebSocketClass = WebSocket) {
		this.WebSocketClass = WebSocketClass;
		this.webSocket = null;
		this.isDisconnecting = false;
		this.url = url.replace(/^http/, "ws");
		this.instanceId = WalletLinkWebSocket.instanceCounter++;
		WalletLinkWebSocket.activeInstances.add(this.instanceId);
	}
	/**
	* Make a websocket connection
	* @returns a Promise that resolves when connected
	*/
	async connect() {
		if (this.webSocket) throw new Error("webSocket object is not null");
		if (this.isDisconnecting) throw new Error("WebSocket is disconnecting, cannot reconnect on same instance");
		return new Promise((resolve, reject) => {
			var _a;
			let webSocket;
			try {
				this.webSocket = webSocket = new this.WebSocketClass(this.url);
			} catch (err) {
				reject(err);
				return;
			}
			(_a = this.connectionStateListener) === null || _a === void 0 || _a.call(this, ConnectionState.CONNECTING);
			webSocket.onclose = (evt) => {
				var _a;
				this.clearWebSocket();
				if (webSocket.readyState !== WebSocket.OPEN) reject(/* @__PURE__ */ new Error(`websocket error ${evt.code}: ${evt.reason}`));
				(_a = this.connectionStateListener) === null || _a === void 0 || _a.call(this, ConnectionState.DISCONNECTED);
			};
			webSocket.onopen = (_) => {
				var _a;
				resolve();
				(_a = this.connectionStateListener) === null || _a === void 0 || _a.call(this, ConnectionState.CONNECTED);
				if (WalletLinkWebSocket.pendingData.length > 0) {
					[...WalletLinkWebSocket.pendingData].forEach((data) => this.sendData(data));
					WalletLinkWebSocket.pendingData = [];
				}
			};
			webSocket.onmessage = (evt) => {
				var _a, _b;
				if (evt.data === "h") (_a = this.incomingDataListener) === null || _a === void 0 || _a.call(this, { type: "Heartbeat" });
				else try {
					const message = JSON.parse(evt.data);
					(_b = this.incomingDataListener) === null || _b === void 0 || _b.call(this, message);
				} catch (_c) {}
			};
		});
	}
	/**
	* Disconnect from server
	*/
	disconnect() {
		var _a;
		const { webSocket } = this;
		if (!webSocket) return;
		this.isDisconnecting = true;
		this.clearWebSocket();
		(_a = this.connectionStateListener) === null || _a === void 0 || _a.call(this, ConnectionState.DISCONNECTED);
		this.connectionStateListener = void 0;
		this.incomingDataListener = void 0;
		try {
			webSocket.close();
		} catch (_b) {}
	}
	/**
	* Send data to server
	* @param data text to send
	*/
	sendData(data) {
		const { webSocket } = this;
		if (!webSocket) {
			WalletLinkWebSocket.pendingData.push(data);
			if (!this.isDisconnecting) this.connect();
			return;
		}
		if (webSocket.readyState !== WebSocket.OPEN) {
			WalletLinkWebSocket.pendingData.push(data);
			return;
		}
		webSocket.send(data);
	}
	clearWebSocket() {
		const { webSocket } = this;
		if (!webSocket) return;
		this.webSocket = null;
		webSocket.onclose = null;
		webSocket.onerror = null;
		webSocket.onmessage = null;
		webSocket.onopen = null;
	}
	/**
	* remove ws from active instances
	*/
	cleanup() {
		WalletLinkWebSocket.activeInstances.delete(this.instanceId);
	}
};
WalletLinkWebSocket.instanceCounter = 0;
WalletLinkWebSocket.activeInstances = /* @__PURE__ */ new Set();
WalletLinkWebSocket.pendingData = [];
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/connection/WalletLinkConnection.js
var HEARTBEAT_INTERVAL = 1e4;
var REQUEST_TIMEOUT = 6e4;
/**
* Coinbase Wallet Connection
*/
var WalletLinkConnection = class {
	/**
	* Constructor
	* @param session Session
	* @param linkAPIUrl Coinbase Wallet link server URL
	* @param listener WalletLinkConnectionUpdateListener
	* @param [WebSocketClass] Custom WebSocket implementation
	*/
	constructor({ session, linkAPIUrl, listener }) {
		this.destroyed = false;
		this.lastHeartbeatResponse = 0;
		this.nextReqId = IntNumber(1);
		this.reconnectAttempts = 0;
		this.isReconnecting = false;
		/**
		* true if connected and authenticated, else false
		* runs listener when connected status changes
		*/
		this._connected = false;
		/**
		* true if linked (a guest has joined before)
		* runs listener when linked status changes
		*/
		this._linked = false;
		this.requestResolutions = /* @__PURE__ */ new Map();
		this.handleSessionMetadataUpdated = (metadata) => {
			if (!metadata) return;
			new Map([
				["__destroyed", this.handleDestroyed],
				["EthereumAddress", this.handleAccountUpdated],
				["WalletUsername", this.handleWalletUsernameUpdated],
				["AppVersion", this.handleAppVersionUpdated],
				["ChainId", (v) => metadata.JsonRpcUrl && this.handleChainUpdated(v, metadata.JsonRpcUrl)]
			]).forEach((handler, key) => {
				const value = metadata[key];
				if (value === void 0) return;
				handler(value);
			});
		};
		this.handleDestroyed = (__destroyed) => {
			var _a;
			if (__destroyed !== "1") return;
			(_a = this.listener) === null || _a === void 0 || _a.resetAndReload();
		};
		this.handleAccountUpdated = async (encryptedEthereumAddress) => {
			var _a;
			try {
				const address = await this.cipher.decrypt(encryptedEthereumAddress);
				(_a = this.listener) === null || _a === void 0 || _a.accountUpdated(address);
			} catch (_b) {}
		};
		this.handleMetadataUpdated = async (key, encryptedMetadataValue) => {
			var _a;
			try {
				const decryptedValue = await this.cipher.decrypt(encryptedMetadataValue);
				(_a = this.listener) === null || _a === void 0 || _a.metadataUpdated(key, decryptedValue);
			} catch (_b) {}
		};
		this.handleWalletUsernameUpdated = async (walletUsername) => {
			this.handleMetadataUpdated(WALLET_USER_NAME_KEY, walletUsername);
		};
		this.handleAppVersionUpdated = async (appVersion) => {
			this.handleMetadataUpdated(APP_VERSION_KEY, appVersion);
		};
		this.handleChainUpdated = async (encryptedChainId, encryptedJsonRpcUrl) => {
			var _a;
			try {
				const chainId = await this.cipher.decrypt(encryptedChainId);
				const jsonRpcUrl = await this.cipher.decrypt(encryptedJsonRpcUrl);
				(_a = this.listener) === null || _a === void 0 || _a.chainUpdated(chainId, jsonRpcUrl);
			} catch (_b) {}
		};
		this.session = session;
		this.cipher = new WalletLinkCipher(session.secret);
		this.listener = listener;
		this.linkAPIUrl = linkAPIUrl;
		this.WebSocketClass = WebSocket;
		this.ws = this.createWebSocket();
		this.http = new WalletLinkHTTP(linkAPIUrl, session.id, session.key);
		this.setupVisibilityChangeHandler();
	}
	createWebSocket() {
		const ws = new WalletLinkWebSocket(`${this.linkAPIUrl}/rpc`, this.WebSocketClass);
		this.activeWsInstance = ws;
		ws.setConnectionStateListener(async (state) => {
			if (ws !== this.activeWsInstance) return;
			let connected = false;
			switch (state) {
				case ConnectionState.DISCONNECTED:
					if (this.heartbeatIntervalId) {
						clearInterval(this.heartbeatIntervalId);
						this.heartbeatIntervalId = void 0;
					}
					this.lastHeartbeatResponse = 0;
					connected = false;
					if (!this.destroyed) {
						const reconnect = async () => {
							if (this.isReconnecting) return;
							this.isReconnecting = true;
							const delay = this.reconnectAttempts === 0 ? 0 : 3e3;
							await new Promise((resolve) => setTimeout(resolve, delay));
							if (!this.destroyed && ws === this.activeWsInstance) {
								this.reconnectAttempts++;
								if ("cleanup" in this.ws && typeof this.ws.cleanup === "function") this.ws.cleanup();
								this.ws = this.createWebSocket();
								this.ws.connect().catch(() => {
									logWalletLinkConnectionConnectionFailed();
								}).finally(() => {
									this.isReconnecting = false;
								});
							} else this.isReconnecting = false;
						};
						reconnect();
					}
					break;
				case ConnectionState.CONNECTED:
					this.reconnectAttempts = 0;
					try {
						connected = await this.handleConnected();
						this.fetchUnseenEventsAPI().catch(() => {});
					} catch (_error) {
						break;
					}
					this.connected = connected;
					this.updateLastHeartbeat();
					if (this.heartbeatIntervalId) clearInterval(this.heartbeatIntervalId);
					this.heartbeatIntervalId = window.setInterval(() => {
						this.heartbeat();
					}, HEARTBEAT_INTERVAL);
					setTimeout(() => {
						this.heartbeat();
					}, 100);
					break;
				case ConnectionState.CONNECTING: break;
			}
			if (state !== ConnectionState.CONNECTED) this.connected = connected;
		});
		ws.setIncomingDataListener((m) => {
			var _a;
			switch (m.type) {
				case "Heartbeat":
					this.updateLastHeartbeat();
					return;
				case "IsLinkedOK":
				case "Linked":
					this.linked = (m.type === "IsLinkedOK" ? m.linked : void 0) || m.onlineGuests > 0;
					break;
				case "GetSessionConfigOK":
				case "SessionConfigUpdated":
					this.handleSessionMetadataUpdated(m.metadata);
					break;
				case "Event":
					this.handleIncomingEvent(m);
					break;
			}
			if (m.id !== void 0) (_a = this.requestResolutions.get(m.id)) === null || _a === void 0 || _a(m);
		});
		return ws;
	}
	setupVisibilityChangeHandler() {
		this.visibilityChangeHandler = () => {
			if (!document.hidden && !this.destroyed) if (!this.connected) this.reconnectWithFreshWebSocket();
			else this.heartbeat();
		};
		this.focusHandler = () => {
			if (!this.destroyed && !this.connected) this.reconnectWithFreshWebSocket();
		};
		document.addEventListener("visibilitychange", this.visibilityChangeHandler);
		window.addEventListener("focus", this.focusHandler);
		window.addEventListener("pageshow", (event) => {
			if (event.persisted) {
				if (this.focusHandler) this.focusHandler();
			}
		});
	}
	reconnectWithFreshWebSocket() {
		if (this.destroyed) return;
		const oldWs = this.ws;
		this.activeWsInstance = void 0;
		oldWs.disconnect();
		if ("cleanup" in oldWs && typeof oldWs.cleanup === "function") oldWs.cleanup();
		this.ws = this.createWebSocket();
		this.ws.connect().catch(() => {
			logWalletLinkConnectionConnectionFailed();
		});
	}
	/**
	* Make a connection to the server
	*/
	connect() {
		if (this.destroyed) throw new Error("instance is destroyed");
		this.ws.connect();
	}
	/**
	* Terminate connection, and mark as destroyed. To reconnect, create a new
	* instance of WalletSDKConnection
	*/
	async destroy() {
		if (this.destroyed) return;
		await this.makeRequest({
			type: "SetSessionConfig",
			id: IntNumber(this.nextReqId++),
			sessionId: this.session.id,
			metadata: { __destroyed: "1" }
		}, { timeout: 1e3 });
		this.destroyed = true;
		this.activeWsInstance = void 0;
		if (this.heartbeatIntervalId) {
			clearInterval(this.heartbeatIntervalId);
			this.heartbeatIntervalId = void 0;
		}
		if (this.visibilityChangeHandler) document.removeEventListener("visibilitychange", this.visibilityChangeHandler);
		if (this.focusHandler) window.removeEventListener("focus", this.focusHandler);
		this.ws.disconnect();
		if ("cleanup" in this.ws && typeof this.ws.cleanup === "function") this.ws.cleanup();
		this.listener = void 0;
	}
	get connected() {
		return this._connected;
	}
	set connected(connected) {
		this._connected = connected;
	}
	get linked() {
		return this._linked;
	}
	set linked(linked) {
		var _a, _b;
		this._linked = linked;
		if (linked) (_a = this.onceLinked) === null || _a === void 0 || _a.call(this);
		(_b = this.listener) === null || _b === void 0 || _b.linkedUpdated(linked);
	}
	setOnceLinked(callback) {
		return new Promise((resolve) => {
			if (this.linked) callback().then(resolve);
			else this.onceLinked = () => {
				callback().then(resolve);
				this.onceLinked = void 0;
			};
		});
	}
	async handleIncomingEvent(m) {
		var _a;
		if (m.type !== "Event" || m.event !== "Web3Response") return;
		try {
			const decryptedData = await this.cipher.decrypt(m.data);
			const message = JSON.parse(decryptedData);
			if (message.type !== "WEB3_RESPONSE") return;
			(_a = this.listener) === null || _a === void 0 || _a.handleWeb3ResponseMessage(message.id, message.response);
		} catch (_error) {}
	}
	async checkUnseenEvents() {
		await new Promise((resolve) => setTimeout(resolve, 250));
		try {
			await this.fetchUnseenEventsAPI();
		} catch (e) {
			console.error("Unable to check for unseen events", e);
		}
	}
	async fetchUnseenEventsAPI() {
		try {
			(await this.http.fetchUnseenEvents()).forEach((e) => {
				this.handleIncomingEvent(e);
			});
		} catch (_error) {
			logWalletLinkConnectionFetchUnseenEventsFailed();
		}
	}
	/**
	* Publish an event and emit event ID when successful
	* @param event event name
	* @param unencryptedData unencrypted event data
	* @param callWebhook whether the webhook should be invoked
	* @returns a Promise that emits event ID when successful
	*/
	async publishEvent(event, unencryptedData, callWebhook = false) {
		const data = await this.cipher.encrypt(JSON.stringify(Object.assign(Object.assign({}, unencryptedData), {
			origin: location.origin,
			location: location.href,
			relaySource: "coinbaseWalletExtension" in window && window.coinbaseWalletExtension ? "injected_sdk" : "sdk"
		})));
		const message = {
			type: "PublishEvent",
			id: IntNumber(this.nextReqId++),
			sessionId: this.session.id,
			event,
			data,
			callWebhook
		};
		return this.setOnceLinked(async () => {
			const res = await this.makeRequest(message);
			if (res.type === "Fail") throw new Error(res.error || "failed to publish event");
			return res.eventId;
		});
	}
	sendData(message) {
		this.ws.sendData(JSON.stringify(message));
	}
	updateLastHeartbeat() {
		this.lastHeartbeatResponse = Date.now();
	}
	heartbeat() {
		if (Date.now() - this.lastHeartbeatResponse > HEARTBEAT_INTERVAL * 2) {
			this.ws.disconnect();
			return;
		}
		if (!this.connected) return;
		try {
			this.ws.sendData("h");
		} catch (_error) {}
	}
	async makeRequest(message, options = { timeout: REQUEST_TIMEOUT }) {
		const reqId = message.id;
		this.sendData(message);
		let timeoutId;
		return Promise.race([new Promise((_, reject) => {
			timeoutId = window.setTimeout(() => {
				reject(/* @__PURE__ */ new Error(`request ${reqId} timed out`));
			}, options.timeout);
		}), new Promise((resolve) => {
			this.requestResolutions.set(reqId, (m) => {
				clearTimeout(timeoutId);
				resolve(m);
				this.requestResolutions.delete(reqId);
			});
		})]);
	}
	async handleConnected() {
		if ((await this.makeRequest({
			type: "HostSession",
			id: IntNumber(this.nextReqId++),
			sessionId: this.session.id,
			sessionKey: this.session.key
		})).type === "Fail") return false;
		this.sendData({
			type: "IsLinked",
			id: IntNumber(this.nextReqId++),
			sessionId: this.session.id
		});
		this.sendData({
			type: "GetSessionConfig",
			id: IntNumber(this.nextReqId++),
			sessionId: this.session.id
		});
		return true;
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/RelayEventManager.js
var RelayEventManager = class {
	constructor() {
		this._nextRequestId = 0;
		this.callbacks = /* @__PURE__ */ new Map();
	}
	makeRequestId() {
		this._nextRequestId = (this._nextRequestId + 1) % 2147483647;
		const id = this._nextRequestId;
		const idStr = prepend0x(id.toString(16));
		if (this.callbacks.get(idStr)) this.callbacks.delete(idStr);
		return id;
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/hashes/esm/_assert.js
function isBytes(a) {
	return a instanceof Uint8Array || a != null && typeof a === "object" && a.constructor.name === "Uint8Array";
}
function bytes(b, ...lengths) {
	if (!isBytes(b)) throw new Error("Uint8Array expected");
	if (lengths.length > 0 && !lengths.includes(b.length)) throw new Error(`Uint8Array expected of length ${lengths}, not of length=${b.length}`);
}
function exists(instance, checkFinished = true) {
	if (instance.destroyed) throw new Error("Hash instance has been destroyed");
	if (checkFinished && instance.finished) throw new Error("Hash#digest() has already been called");
}
function output(out, instance) {
	bytes(out);
	const min = instance.outputLen;
	if (out.length < min) throw new Error(`digestInto() expects output buffer of length at least ${min}`);
}
typeof globalThis === "object" && "crypto" in globalThis && globalThis.crypto;
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/hashes/esm/utils.js
var createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
var rotr = (word, shift) => word << 32 - shift | word >>> shift;
new Uint8Array(new Uint32Array([287454020]).buffer)[0];
var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
/**
* @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
*/
function bytesToHex(bytes$1) {
	bytes(bytes$1);
	let hex = "";
	for (let i = 0; i < bytes$1.length; i++) hex += hexes[bytes$1[i]];
	return hex;
}
/**
* @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
*/
function utf8ToBytes(str) {
	if (typeof str !== "string") throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
	return new Uint8Array(new TextEncoder().encode(str));
}
/**
* Normalizes (non-hex) string or Uint8Array to Uint8Array.
* Warning: when Uint8Array is passed, it would NOT get copied.
* Keep in mind for future mutable operations.
*/
function toBytes(data) {
	if (typeof data === "string") data = utf8ToBytes(data);
	bytes(data);
	return data;
}
var Hash = class {
	clone() {
		return this._cloneInto();
	}
};
({}).toString;
function wrapConstructor(hashCons) {
	const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
	const tmp = hashCons();
	hashC.outputLen = tmp.outputLen;
	hashC.blockLen = tmp.blockLen;
	hashC.create = () => hashCons();
	return hashC;
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/hashes/esm/_md.js
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
var Chi = (a, b, c) => a & b ^ ~a & c;
var Maj = (a, b, c) => a & b ^ a & c ^ b & c;
/**
* Merkle-Damgard hash construction base class.
* Could be used to create MD5, RIPEMD, SHA1, SHA2.
*/
var HashMD = class extends Hash {
	constructor(blockLen, outputLen, padOffset, isLE) {
		super();
		this.blockLen = blockLen;
		this.outputLen = outputLen;
		this.padOffset = padOffset;
		this.isLE = isLE;
		this.finished = false;
		this.length = 0;
		this.pos = 0;
		this.destroyed = false;
		this.buffer = new Uint8Array(blockLen);
		this.view = createView(this.buffer);
	}
	update(data) {
		exists(this);
		const { view, buffer, blockLen } = this;
		data = toBytes(data);
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
		exists(this);
		output(out, this);
		this.finished = true;
		const { buffer, view, blockLen, isLE } = this;
		let { pos } = this;
		buffer[pos++] = 128;
		this.buffer.subarray(pos).fill(0);
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
		to.length = length;
		to.pos = pos;
		to.finished = finished;
		to.destroyed = destroyed;
		if (length % blockLen) to.buffer.set(buffer);
		return to;
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/hashes/esm/sha256.js
var SHA256_K = /* @__PURE__ */ new Uint32Array([
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
var SHA256_IV = /* @__PURE__ */ new Uint32Array([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]);
var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
var SHA256 = class extends HashMD {
	constructor() {
		super(64, 32, 8, false);
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
		SHA256_W.fill(0);
	}
	destroy() {
		this.set(0, 0, 0, 0, 0, 0, 0, 0);
		this.buffer.fill(0);
	}
};
/**
* SHA2-256 hash function
* @param message - data that would be hashed
*/
var sha256 = /* @__PURE__ */ wrapConstructor(() => new SHA256());
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/type/WalletLinkSession.js
var STORAGE_KEY_SESSION_ID = "session:id";
var STORAGE_KEY_SESSION_SECRET = "session:secret";
var STORAGE_KEY_SESSION_LINKED = "session:linked";
var WalletLinkSession = class WalletLinkSession {
	constructor(storage, id, secret, linked = false) {
		this.storage = storage;
		this.id = id;
		this.secret = secret;
		this.key = bytesToHex(sha256(`${id}, ${secret} WalletLink`));
		this._linked = !!linked;
	}
	static create(storage) {
		return new WalletLinkSession(storage, randomBytesHex(16), randomBytesHex(32)).save();
	}
	static load(storage) {
		const id = storage.getItem(STORAGE_KEY_SESSION_ID);
		const linked = storage.getItem(STORAGE_KEY_SESSION_LINKED);
		const secret = storage.getItem(STORAGE_KEY_SESSION_SECRET);
		if (id && secret) return new WalletLinkSession(storage, id, secret, linked === "1");
		return null;
	}
	get linked() {
		return this._linked;
	}
	set linked(val) {
		this._linked = val;
		this.persistLinked();
	}
	save() {
		this.storage.setItem(STORAGE_KEY_SESSION_ID, this.id);
		this.storage.setItem(STORAGE_KEY_SESSION_SECRET, this.secret);
		this.persistLinked();
		return this;
	}
	persistLinked() {
		this.storage.setItem(STORAGE_KEY_SESSION_LINKED, this._linked ? "1" : "0");
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/components/RedirectDialog/RedirectDialog-css.js
var RedirectDialog_css_default = `.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-backdrop{position:fixed;top:0;left:0;right:0;bottom:0;transition:opacity .25s;background-color:rgba(10,11,13,.5)}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-backdrop-hidden{opacity:0}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box{display:block;position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);padding:20px;border-radius:8px;background-color:#fff;color:#0a0b0d}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box p{display:block;font-weight:400;font-size:14px;line-height:20px;padding-bottom:12px;color:#5b636e}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box button{appearance:none;border:none;background:none;color:#0052ff;padding:0;text-decoration:none;display:block;font-weight:600;font-size:16px;line-height:24px}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box.dark{background-color:#0a0b0d;color:#fff}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box.dark button{color:#0052ff}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box.light{background-color:#fff;color:#0a0b0d}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box.light button{color:#0052ff}`;
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/components/RedirectDialog/RedirectDialog.js
init_preact_module();
var RedirectDialog = class {
	constructor() {
		this.root = null;
		this.darkMode = isDarkMode();
	}
	attach() {
		const el = document.documentElement;
		this.root = document.createElement("div");
		this.root.className = "-cbwsdk-css-reset";
		el.appendChild(this.root);
		injectCssReset();
	}
	present(props) {
		this.render(props);
	}
	clear() {
		this.render(null);
	}
	render(props) {
		if (!this.root) return;
		B(null, this.root);
		if (!props) return;
		B(_(RedirectDialogContent, Object.assign({}, props, {
			onDismiss: () => {
				this.clear();
			},
			darkMode: this.darkMode
		})), this.root);
	}
};
var RedirectDialogContent = ({ title, buttonText, darkMode, onButtonClick, onDismiss }) => {
	const theme = darkMode ? "dark" : "light";
	return _(SnackbarContainer, { darkMode }, _("div", { class: "-cbwsdk-redirect-dialog" }, _("style", null, RedirectDialog_css_default), _("div", {
		class: "-cbwsdk-redirect-dialog-backdrop",
		onClick: onDismiss
	}), _("div", { class: clsx("-cbwsdk-redirect-dialog-box", theme) }, _("p", null, title), _("button", { onClick: onButtonClick }, buttonText))));
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/WLMobileRelayUI.js
var WLMobileRelayUI = class {
	constructor() {
		this.attached = false;
		this.redirectDialog = new RedirectDialog();
	}
	attach() {
		if (this.attached) throw new Error("Coinbase Wallet SDK UI is already attached");
		this.redirectDialog.attach();
		this.attached = true;
	}
	redirectToCoinbaseWallet(walletLinkUrl) {
		const url = new URL(CBW_MOBILE_DEEPLINK_URL);
		url.searchParams.append("redirect_url", getLocation().href);
		if (walletLinkUrl) url.searchParams.append("wl_url", walletLinkUrl);
		const anchorTag = document.createElement("a");
		anchorTag.target = "cbw-opener";
		anchorTag.href = url.href;
		anchorTag.rel = "noreferrer noopener";
		anchorTag.click();
	}
	openCoinbaseWalletDeeplink(walletLinkUrl) {
		this.redirectToCoinbaseWallet(walletLinkUrl);
		setTimeout(() => {
			this.redirectDialog.present({
				title: "Redirecting to Coinbase Wallet...",
				buttonText: "Open",
				onButtonClick: () => {
					this.redirectToCoinbaseWallet(walletLinkUrl);
				}
			});
		}, 99);
	}
	showConnecting(_options) {
		return () => {
			this.redirectDialog.clear();
		};
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/WalletLinkRelay.js
var WalletLinkRelay = class WalletLinkRelay {
	constructor(options) {
		this.chainCallbackParams = {
			chainId: "",
			jsonRpcUrl: ""
		};
		this.isMobileWeb = isMobileWeb();
		this.linkedUpdated = (linked) => {
			this.isLinked = linked;
			const cachedAddresses = this.storage.getItem(LOCAL_STORAGE_ADDRESSES_KEY);
			if (linked) this._session.linked = linked;
			this.isUnlinkedErrorState = false;
			if (cachedAddresses) {
				const addresses = cachedAddresses.split(" ");
				const wasConnectedViaStandalone = this.storage.getItem("IsStandaloneSigning") === "true";
				if (addresses[0] !== "" && !linked && this._session.linked && !wasConnectedViaStandalone) this.isUnlinkedErrorState = true;
			}
		};
		this.metadataUpdated = (key, value) => {
			this.storage.setItem(key, value);
		};
		this.chainUpdated = (chainId, jsonRpcUrl) => {
			if (this.chainCallbackParams.chainId === chainId && this.chainCallbackParams.jsonRpcUrl === jsonRpcUrl) return;
			this.chainCallbackParams = {
				chainId,
				jsonRpcUrl
			};
			if (this.chainCallback) this.chainCallback(jsonRpcUrl, Number.parseInt(chainId, 10));
		};
		this.accountUpdated = (selectedAddress) => {
			if (this.accountsCallback) this.accountsCallback([selectedAddress]);
			if (WalletLinkRelay.accountRequestCallbackIds.size > 0) {
				Array.from(WalletLinkRelay.accountRequestCallbackIds.values()).forEach((id) => {
					this.invokeCallback(id, {
						method: "requestEthereumAccounts",
						result: [selectedAddress]
					});
				});
				WalletLinkRelay.accountRequestCallbackIds.clear();
			}
		};
		this.resetAndReload = this.resetAndReload.bind(this);
		this.linkAPIUrl = options.linkAPIUrl;
		this.storage = options.storage;
		this.metadata = options.metadata;
		this.accountsCallback = options.accountsCallback;
		this.chainCallback = options.chainCallback;
		const { session, ui, connection } = this.subscribe();
		this._session = session;
		this.connection = connection;
		this.relayEventManager = new RelayEventManager();
		this.ui = ui;
		this.ui.attach();
	}
	subscribe() {
		const session = WalletLinkSession.load(this.storage) || WalletLinkSession.create(this.storage);
		const { linkAPIUrl } = this;
		const connection = new WalletLinkConnection({
			session,
			linkAPIUrl,
			listener: this
		});
		const ui = this.isMobileWeb ? new WLMobileRelayUI() : new WalletLinkRelayUI();
		connection.connect();
		return {
			session,
			ui,
			connection
		};
	}
	resetAndReload() {
		this.connection.destroy().then(() => {
			/**
			* Only clear storage if the session id we have in memory matches the one on disk
			* Otherwise, in the case where we have 2 tabs, another tab might have cleared
			* storage already.  In that case if we clear storage again, the user will be in
			* a state where the first tab allows the user to connect but the session that
			* was used isn't persisted.  This leaves the user in a state where they aren't
			* connected to the mobile app.
			*/
			const storedSession = WalletLinkSession.load(this.storage);
			if ((storedSession === null || storedSession === void 0 ? void 0 : storedSession.id) === this._session.id) ScopedLocalStorage.clearAll();
			document.location.reload();
		}).catch((_) => {});
	}
	signEthereumTransaction(params) {
		return this.sendRequest({
			method: "signEthereumTransaction",
			params: {
				fromAddress: params.fromAddress,
				toAddress: params.toAddress,
				weiValue: bigIntStringFromBigInt(params.weiValue),
				data: hexStringFromBuffer(params.data, true),
				nonce: params.nonce,
				gasPriceInWei: params.gasPriceInWei ? bigIntStringFromBigInt(params.gasPriceInWei) : null,
				maxFeePerGas: params.gasPriceInWei ? bigIntStringFromBigInt(params.gasPriceInWei) : null,
				maxPriorityFeePerGas: params.gasPriceInWei ? bigIntStringFromBigInt(params.gasPriceInWei) : null,
				gasLimit: params.gasLimit ? bigIntStringFromBigInt(params.gasLimit) : null,
				chainId: params.chainId,
				shouldSubmit: false
			}
		});
	}
	signAndSubmitEthereumTransaction(params) {
		return this.sendRequest({
			method: "signEthereumTransaction",
			params: {
				fromAddress: params.fromAddress,
				toAddress: params.toAddress,
				weiValue: bigIntStringFromBigInt(params.weiValue),
				data: hexStringFromBuffer(params.data, true),
				nonce: params.nonce,
				gasPriceInWei: params.gasPriceInWei ? bigIntStringFromBigInt(params.gasPriceInWei) : null,
				maxFeePerGas: params.maxFeePerGas ? bigIntStringFromBigInt(params.maxFeePerGas) : null,
				maxPriorityFeePerGas: params.maxPriorityFeePerGas ? bigIntStringFromBigInt(params.maxPriorityFeePerGas) : null,
				gasLimit: params.gasLimit ? bigIntStringFromBigInt(params.gasLimit) : null,
				chainId: params.chainId,
				shouldSubmit: true
			}
		});
	}
	submitEthereumTransaction(signedTransaction, chainId) {
		return this.sendRequest({
			method: "submitEthereumTransaction",
			params: {
				signedTransaction: hexStringFromBuffer(signedTransaction, true),
				chainId
			}
		});
	}
	getWalletLinkSession() {
		return this._session;
	}
	sendRequest(request) {
		let hideSnackbarItem = null;
		const id = randomBytesHex(8);
		const cancel = (error) => {
			this.publishWeb3RequestCanceledEvent(id);
			this.handleErrorResponse(id, request.method, error);
			hideSnackbarItem === null || hideSnackbarItem === void 0 || hideSnackbarItem();
		};
		return new Promise((resolve, reject) => {
			hideSnackbarItem = this.ui.showConnecting({
				isUnlinkedErrorState: this.isUnlinkedErrorState,
				onCancel: cancel,
				onResetConnection: this.resetAndReload
			});
			this.relayEventManager.callbacks.set(id, (response) => {
				hideSnackbarItem === null || hideSnackbarItem === void 0 || hideSnackbarItem();
				if (isErrorResponse(response)) return reject(new Error(response.errorMessage));
				resolve(response);
			});
			this.publishWeb3RequestEvent(id, request);
		});
	}
	publishWeb3RequestEvent(id, request) {
		const message = {
			type: "WEB3_REQUEST",
			id,
			request
		};
		this.publishEvent("Web3Request", message, true).then((_) => {}).catch((err) => {
			this.handleWeb3ResponseMessage(message.id, {
				method: request.method,
				errorMessage: err.message
			});
		});
		if (this.isMobileWeb) this.openCoinbaseWalletDeeplink(request.method);
	}
	openCoinbaseWalletDeeplink(method) {
		if (!(this.ui instanceof WLMobileRelayUI)) return;
		switch (method) {
			case "requestEthereumAccounts":
			case "switchEthereumChain": return;
			default:
				window.addEventListener("blur", () => {
					window.addEventListener("focus", () => {
						this.connection.checkUnseenEvents();
					}, { once: true });
				}, { once: true });
				this.ui.openCoinbaseWalletDeeplink();
				break;
		}
	}
	publishWeb3RequestCanceledEvent(id) {
		const message = {
			type: "WEB3_REQUEST_CANCELED",
			id
		};
		this.publishEvent("Web3RequestCanceled", message, false).then();
	}
	publishEvent(event, message, callWebhook) {
		return this.connection.publishEvent(event, message, callWebhook);
	}
	handleWeb3ResponseMessage(id, response) {
		if (response.method === "requestEthereumAccounts") {
			WalletLinkRelay.accountRequestCallbackIds.forEach((id) => this.invokeCallback(id, response));
			WalletLinkRelay.accountRequestCallbackIds.clear();
			return;
		}
		this.invokeCallback(id, response);
	}
	handleErrorResponse(id, method, error) {
		var _a;
		const errorMessage = (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Unspecified error message.";
		this.handleWeb3ResponseMessage(id, {
			method,
			errorMessage
		});
	}
	invokeCallback(id, response) {
		const callback = this.relayEventManager.callbacks.get(id);
		if (callback) {
			callback(response);
			this.relayEventManager.callbacks.delete(id);
		}
	}
	requestEthereumAccounts() {
		const { appName, appLogoUrl } = this.metadata;
		const request = {
			method: "requestEthereumAccounts",
			params: {
				appName,
				appLogoUrl
			}
		};
		const hideSnackbarItem = null;
		const id = randomBytesHex(8);
		return new Promise((resolve, reject) => {
			this.relayEventManager.callbacks.set(id, (response) => {
				hideSnackbarItem === null || hideSnackbarItem === void 0 || hideSnackbarItem();
				if (isErrorResponse(response)) return reject(new Error(response.errorMessage));
				resolve(response);
			});
			WalletLinkRelay.accountRequestCallbackIds.add(id);
			this.publishWeb3RequestEvent(id, request);
		});
	}
	watchAsset(type, address, symbol, decimals, image, chainId) {
		const request = {
			method: "watchAsset",
			params: {
				type,
				options: {
					address,
					symbol,
					decimals,
					image
				},
				chainId
			}
		};
		let hideSnackbarItem = null;
		const id = randomBytesHex(8);
		const cancel = (error) => {
			this.publishWeb3RequestCanceledEvent(id);
			this.handleErrorResponse(id, request.method, error);
			hideSnackbarItem === null || hideSnackbarItem === void 0 || hideSnackbarItem();
		};
		hideSnackbarItem = this.ui.showConnecting({
			isUnlinkedErrorState: this.isUnlinkedErrorState,
			onCancel: cancel,
			onResetConnection: this.resetAndReload
		});
		return new Promise((resolve, reject) => {
			this.relayEventManager.callbacks.set(id, (response) => {
				hideSnackbarItem === null || hideSnackbarItem === void 0 || hideSnackbarItem();
				if (isErrorResponse(response)) return reject(new Error(response.errorMessage));
				resolve(response);
			});
			this.publishWeb3RequestEvent(id, request);
		});
	}
	addEthereumChain(chainId, rpcUrls, iconUrls, blockExplorerUrls, chainName, nativeCurrency) {
		const request = {
			method: "addEthereumChain",
			params: {
				chainId,
				rpcUrls,
				blockExplorerUrls,
				chainName,
				iconUrls,
				nativeCurrency
			}
		};
		let hideSnackbarItem = null;
		const id = randomBytesHex(8);
		const cancel = (error) => {
			this.publishWeb3RequestCanceledEvent(id);
			this.handleErrorResponse(id, request.method, error);
			hideSnackbarItem === null || hideSnackbarItem === void 0 || hideSnackbarItem();
		};
		hideSnackbarItem = this.ui.showConnecting({
			isUnlinkedErrorState: this.isUnlinkedErrorState,
			onCancel: cancel,
			onResetConnection: this.resetAndReload
		});
		return new Promise((resolve, reject) => {
			this.relayEventManager.callbacks.set(id, (response) => {
				hideSnackbarItem === null || hideSnackbarItem === void 0 || hideSnackbarItem();
				if (isErrorResponse(response)) return reject(new Error(response.errorMessage));
				resolve(response);
			});
			this.publishWeb3RequestEvent(id, request);
		});
	}
	switchEthereumChain(chainId, address) {
		const request = {
			method: "switchEthereumChain",
			params: Object.assign({ chainId }, { address })
		};
		let hideSnackbarItem = null;
		const id = randomBytesHex(8);
		const cancel = (error) => {
			this.publishWeb3RequestCanceledEvent(id);
			this.handleErrorResponse(id, request.method, error);
			hideSnackbarItem === null || hideSnackbarItem === void 0 || hideSnackbarItem();
		};
		hideSnackbarItem = this.ui.showConnecting({
			isUnlinkedErrorState: this.isUnlinkedErrorState,
			onCancel: cancel,
			onResetConnection: this.resetAndReload
		});
		return new Promise((resolve, reject) => {
			this.relayEventManager.callbacks.set(id, (response) => {
				hideSnackbarItem === null || hideSnackbarItem === void 0 || hideSnackbarItem();
				if (isErrorResponse(response) && response.errorCode) return reject(standardErrors.provider.custom({
					code: response.errorCode,
					message: `Unrecognized chain ID. Try adding the chain using addEthereumChain first.`
				}));
				if (isErrorResponse(response)) return reject(new Error(response.errorMessage));
				resolve(response);
			});
			this.publishWeb3RequestEvent(id, request);
		});
	}
};
WalletLinkRelay.accountRequestCallbackIds = /* @__PURE__ */ new Set();
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/WalletLinkSigner.js
var DEFAULT_CHAIN_ID_KEY = "DefaultChainId";
var DEFAULT_JSON_RPC_URL = "DefaultJsonRpcUrl";
var WalletLinkSigner = class {
	constructor(options) {
		this._relay = null;
		this._addresses = [];
		this.metadata = options.metadata;
		this._storage = new ScopedLocalStorage("walletlink", WALLETLINK_URL);
		this.callback = options.callback || null;
		const cachedAddresses = this._storage.getItem(LOCAL_STORAGE_ADDRESSES_KEY);
		if (cachedAddresses) {
			const addresses = cachedAddresses.split(" ");
			if (addresses[0] !== "") this._addresses = addresses.map((address) => ensureAddressString(address));
		}
		this.initializeRelay();
	}
	getSession() {
		const { id, secret } = this.initializeRelay().getWalletLinkSession();
		return {
			id,
			secret
		};
	}
	async handshake(args) {
		const method = "eth_requestAccounts";
		const correlationId = correlationIds.get(args);
		logHandshakeStarted({
			method,
			correlationId
		});
		try {
			await this._eth_requestAccounts();
			logHandshakeCompleted({
				method,
				correlationId
			});
		} catch (error) {
			logHandshakeError({
				method,
				correlationId,
				errorMessage: parseErrorMessageFromAny(error)
			});
			throw error;
		}
	}
	get selectedAddress() {
		return this._addresses[0] || void 0;
	}
	get jsonRpcUrl() {
		var _a;
		return (_a = this._storage.getItem(DEFAULT_JSON_RPC_URL)) !== null && _a !== void 0 ? _a : void 0;
	}
	set jsonRpcUrl(value) {
		this._storage.setItem(DEFAULT_JSON_RPC_URL, value);
	}
	updateProviderInfo(jsonRpcUrl, chainId) {
		var _a;
		this.jsonRpcUrl = jsonRpcUrl;
		const originalChainId = this.getChainId();
		this._storage.setItem(DEFAULT_CHAIN_ID_KEY, chainId.toString(10));
		if (ensureIntNumber(chainId) !== originalChainId) (_a = this.callback) === null || _a === void 0 || _a.call(this, "chainChanged", hexStringFromNumber(chainId));
	}
	async watchAsset(params) {
		const request = Array.isArray(params) ? params[0] : params;
		if (!request.type) throw standardErrors.rpc.invalidParams("Type is required");
		if ((request === null || request === void 0 ? void 0 : request.type) !== "ERC20") throw standardErrors.rpc.invalidParams(`Asset of type '${request.type}' is not supported`);
		if (!(request === null || request === void 0 ? void 0 : request.options)) throw standardErrors.rpc.invalidParams("Options are required");
		if (!(request === null || request === void 0 ? void 0 : request.options.address)) throw standardErrors.rpc.invalidParams("Address is required");
		const chainId = this.getChainId();
		const { address, symbol, image, decimals } = request.options;
		const result = await this.initializeRelay().watchAsset(request.type, address, symbol, decimals, image, chainId === null || chainId === void 0 ? void 0 : chainId.toString());
		if (isErrorResponse(result)) return false;
		return !!result.result;
	}
	async addEthereumChain(params) {
		var _a, _b;
		const request = params[0];
		if (((_a = request.rpcUrls) === null || _a === void 0 ? void 0 : _a.length) === 0) throw standardErrors.rpc.invalidParams("please pass in at least 1 rpcUrl");
		if (!request.chainName || request.chainName.trim() === "") throw standardErrors.rpc.invalidParams("chainName is a required field");
		if (!request.nativeCurrency) throw standardErrors.rpc.invalidParams("nativeCurrency is a required field");
		const chainIdNumber = Number.parseInt(request.chainId, 16);
		if (chainIdNumber === this.getChainId()) return false;
		const relay = this.initializeRelay();
		const { rpcUrls = [], blockExplorerUrls = [], chainName, iconUrls = [], nativeCurrency } = request;
		const res = await relay.addEthereumChain(chainIdNumber.toString(), rpcUrls, iconUrls, blockExplorerUrls, chainName, nativeCurrency);
		if (isErrorResponse(res)) return false;
		if (((_b = res.result) === null || _b === void 0 ? void 0 : _b.isApproved) === true) {
			this.updateProviderInfo(rpcUrls[0], chainIdNumber);
			return null;
		}
		throw standardErrors.rpc.internal("unable to add ethereum chain");
	}
	async switchEthereumChain(params) {
		const request = params[0];
		const chainId = Number.parseInt(request.chainId, 16);
		const res = await this.initializeRelay().switchEthereumChain(chainId.toString(10), this.selectedAddress || void 0);
		if (isErrorResponse(res)) throw res;
		const switchResponse = res.result;
		if (switchResponse.isApproved && switchResponse.rpcUrl.length > 0) this.updateProviderInfo(switchResponse.rpcUrl, chainId);
		return null;
	}
	async cleanup() {
		this.callback = null;
		if (this._relay) this._relay.resetAndReload();
		this._storage.clear();
	}
	_setAddresses(addresses, _) {
		var _a;
		if (!Array.isArray(addresses)) throw new Error("addresses is not an array");
		const newAddresses = addresses.map((address) => ensureAddressString(address));
		if (JSON.stringify(newAddresses) === JSON.stringify(this._addresses)) return;
		this._addresses = newAddresses;
		(_a = this.callback) === null || _a === void 0 || _a.call(this, "accountsChanged", newAddresses);
		this._storage.setItem(LOCAL_STORAGE_ADDRESSES_KEY, newAddresses.join(" "));
	}
	async request(request) {
		const correlationId = correlationIds.get(request);
		logRequestStarted({
			method: request.method,
			correlationId
		});
		try {
			const result = await this._request(request);
			logRequestCompleted({
				method: request.method,
				correlationId
			});
			return result;
		} catch (error) {
			logRequestError({
				method: request.method,
				correlationId,
				errorMessage: parseErrorMessageFromAny(error)
			});
			throw error;
		}
	}
	async _request(request) {
		const params = request.params || [];
		switch (request.method) {
			case "eth_accounts": return [...this._addresses];
			case "eth_coinbase": return this.selectedAddress || null;
			case "net_version": return this.getChainId().toString(10);
			case "eth_chainId": return hexStringFromNumber(this.getChainId());
			case "eth_requestAccounts": return this._eth_requestAccounts();
			case "eth_ecRecover":
			case "personal_ecRecover": return this.ecRecover(request);
			case "personal_sign": return this.personalSign(request);
			case "eth_signTransaction": return this._eth_signTransaction(params);
			case "eth_sendRawTransaction": return this._eth_sendRawTransaction(params);
			case "eth_sendTransaction": return this._eth_sendTransaction(params);
			case "eth_signTypedData_v1":
			case "eth_signTypedData_v3":
			case "eth_signTypedData_v4":
			case "eth_signTypedData": return this.signTypedData(request);
			case "wallet_addEthereumChain": return this.addEthereumChain(params);
			case "wallet_switchEthereumChain": return this.switchEthereumChain(params);
			case "wallet_watchAsset": return this.watchAsset(params);
			default:
				if (!this.jsonRpcUrl) throw standardErrors.rpc.internal("No RPC URL set for chain");
				return fetchRPCRequest(request, this.jsonRpcUrl);
		}
	}
	_ensureKnownAddress(addressString) {
		const addressStr = ensureAddressString(addressString);
		if (!this._addresses.map((address) => ensureAddressString(address)).includes(addressStr)) throw new Error("Unknown Ethereum address");
	}
	_prepareTransactionParams(tx) {
		const fromAddress = tx.from ? ensureAddressString(tx.from) : this.selectedAddress;
		if (!fromAddress) throw new Error("Ethereum address is unavailable");
		this._ensureKnownAddress(fromAddress);
		return {
			fromAddress,
			toAddress: tx.to ? ensureAddressString(tx.to) : null,
			weiValue: tx.value != null ? ensureBigInt(tx.value) : BigInt(0),
			data: tx.data ? ensureBuffer(tx.data) : Buffer.alloc(0),
			nonce: tx.nonce != null ? ensureIntNumber(tx.nonce) : null,
			gasPriceInWei: tx.gasPrice != null ? ensureBigInt(tx.gasPrice) : null,
			maxFeePerGas: tx.maxFeePerGas != null ? ensureBigInt(tx.maxFeePerGas) : null,
			maxPriorityFeePerGas: tx.maxPriorityFeePerGas != null ? ensureBigInt(tx.maxPriorityFeePerGas) : null,
			gasLimit: tx.gas != null ? ensureBigInt(tx.gas) : null,
			chainId: tx.chainId ? ensureIntNumber(tx.chainId) : this.getChainId()
		};
	}
	async ecRecover(request) {
		const { method, params } = request;
		if (!Array.isArray(params)) throw standardErrors.rpc.invalidParams();
		const res = await this.initializeRelay().sendRequest({
			method: "ethereumAddressFromSignedMessage",
			params: {
				message: encodeToHexString(params[0]),
				signature: encodeToHexString(params[1]),
				addPrefix: method === "personal_ecRecover"
			}
		});
		if (isErrorResponse(res)) throw res;
		return res.result;
	}
	getChainId() {
		var _a;
		return Number.parseInt((_a = this._storage.getItem(DEFAULT_CHAIN_ID_KEY)) !== null && _a !== void 0 ? _a : "1", 10);
	}
	async _eth_requestAccounts() {
		var _a, _b;
		if (this._addresses.length > 0) {
			(_a = this.callback) === null || _a === void 0 || _a.call(this, "connect", { chainId: hexStringFromNumber(this.getChainId()) });
			return this._addresses;
		}
		const res = await this.initializeRelay().requestEthereumAccounts();
		if (isErrorResponse(res)) throw res;
		if (!res.result) throw new Error("accounts received is empty");
		this._setAddresses(res.result);
		(_b = this.callback) === null || _b === void 0 || _b.call(this, "connect", { chainId: hexStringFromNumber(this.getChainId()) });
		return this._addresses;
	}
	async personalSign({ params }) {
		if (!Array.isArray(params)) throw standardErrors.rpc.invalidParams();
		const address = params[1];
		const rawData = params[0];
		this._ensureKnownAddress(address);
		const res = await this.initializeRelay().sendRequest({
			method: "signEthereumMessage",
			params: {
				address: ensureAddressString(address),
				message: encodeToHexString(rawData),
				addPrefix: true,
				typedDataJson: null
			}
		});
		if (isErrorResponse(res)) throw res;
		return res.result;
	}
	async _eth_signTransaction(params) {
		const tx = this._prepareTransactionParams(params[0] || {});
		const res = await this.initializeRelay().signEthereumTransaction(tx);
		if (isErrorResponse(res)) throw res;
		return res.result;
	}
	async _eth_sendRawTransaction(params) {
		const signedTransaction = ensureBuffer(params[0]);
		const res = await this.initializeRelay().submitEthereumTransaction(signedTransaction, this.getChainId());
		if (isErrorResponse(res)) throw res;
		return res.result;
	}
	async _eth_sendTransaction(params) {
		const tx = this._prepareTransactionParams(params[0] || {});
		const res = await this.initializeRelay().signAndSubmitEthereumTransaction(tx);
		if (isErrorResponse(res)) throw res;
		return res.result;
	}
	async signTypedData(request) {
		const { method, params } = request;
		if (!Array.isArray(params)) throw standardErrors.rpc.invalidParams();
		const encode = (input) => {
			return hexStringFromBuffer({
				eth_signTypedData_v1: import_eth_eip712_util.default.hashForSignTypedDataLegacy,
				eth_signTypedData_v3: import_eth_eip712_util.default.hashForSignTypedData_v3,
				eth_signTypedData_v4: import_eth_eip712_util.default.hashForSignTypedData_v4,
				eth_signTypedData: import_eth_eip712_util.default.hashForSignTypedData_v4
			}[method]({ data: ensureParsedJSONObject(input) }), true);
		};
		const address = params[method === "eth_signTypedData_v1" ? 1 : 0];
		const rawData = params[method === "eth_signTypedData_v1" ? 0 : 1];
		this._ensureKnownAddress(address);
		const res = await this.initializeRelay().sendRequest({
			method: "signEthereumMessage",
			params: {
				address: ensureAddressString(address),
				message: encode(rawData),
				typedDataJson: JSON.stringify(rawData, null, 2),
				addPrefix: false
			}
		});
		if (isErrorResponse(res)) throw res;
		return res.result;
	}
	initializeRelay() {
		if (!this._relay) this._relay = new WalletLinkRelay({
			linkAPIUrl: WALLETLINK_URL,
			storage: this._storage,
			metadata: this.metadata,
			accountsCallback: this._setAddresses.bind(this),
			chainCallback: this.updateProviderInfo.bind(this)
		});
		return this._relay;
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/util.js
var SIGNER_TYPE_KEY = "SignerType";
var storage = new ScopedLocalStorage("CBWSDK", "SignerConfigurator");
function loadSignerType() {
	return storage.getItem(SIGNER_TYPE_KEY);
}
function storeSignerType(signerType) {
	storage.setItem(SIGNER_TYPE_KEY, signerType);
}
function signerToSignerType(signer) {
	if (!signer) return;
	return signer instanceof SCWSigner ? "scw" : "walletlink";
}
async function fetchSignerType(params) {
	const { communicator, metadata, handshakeRequest, callback } = params;
	listenForWalletLinkSessionRequest(communicator, metadata, callback, handshakeRequest).catch(() => {});
	const request = {
		id: crypto.randomUUID(),
		event: "selectSignerType",
		data: Object.assign(Object.assign({}, params.preference), { handshakeRequest })
	};
	const { data } = await communicator.postRequestAndWaitForResponse(request);
	return data;
}
function createSigner(params) {
	const { signerType, metadata, communicator, callback } = params;
	switch (signerType) {
		case "scw": return new SCWSigner({
			metadata,
			callback,
			communicator
		});
		case "walletlink": return new WalletLinkSigner({
			metadata,
			callback
		});
	}
}
async function listenForWalletLinkSessionRequest(communicator, metadata, callback, handshakeRequest) {
	await communicator.onMessage(({ event }) => event === "WalletLinkSessionRequest");
	const walletlink = new WalletLinkSigner({
		metadata,
		callback
	});
	communicator.postMessage({
		event: "WalletLinkUpdate",
		data: { session: walletlink.getSession() }
	});
	await walletlink.handshake(handshakeRequest);
	communicator.postMessage({
		event: "WalletLinkUpdate",
		data: { connected: true }
	});
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/CoinbaseWalletProvider.js
var __rest = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
var CoinbaseWalletProvider = class extends ProviderEventEmitter {
	constructor(_a) {
		var { metadata } = _a, _b = _a.preference, { keysUrl } = _b, preference = __rest(_b, ["keysUrl"]);
		super();
		this.signer = null;
		this.isCoinbaseWallet = true;
		this.metadata = metadata;
		this.preference = preference;
		this.communicator = new Communicator({
			url: keysUrl,
			metadata,
			preference
		});
		const signerType = loadSignerType();
		if (signerType) {
			this.signer = this.initSigner(signerType);
			logSignerLoadedFromStorage({ signerType });
		}
	}
	async request(args) {
		const correlationId = crypto.randomUUID();
		correlationIds.set(args, correlationId);
		logRequestStarted$2({
			method: args.method,
			correlationId
		});
		try {
			const result = await this._request(args);
			logRequestResponded({
				method: args.method,
				signerType: signerToSignerType(this.signer),
				correlationId
			});
			return result;
		} catch (error) {
			logRequestError$2({
				method: args.method,
				correlationId,
				signerType: signerToSignerType(this.signer),
				errorMessage: error instanceof Error ? error.message : ""
			});
			throw error;
		} finally {
			correlationIds.delete(args);
		}
	}
	async _request(args) {
		try {
			checkErrorForInvalidRequestArgs(args);
			if (!this.signer) switch (args.method) {
				case "eth_requestAccounts": {
					let signerType;
					const subAccountsConfig = store.subAccountsConfig.get();
					if (subAccountsConfig === null || subAccountsConfig === void 0 ? void 0 : subAccountsConfig.enableAutoSubAccounts) signerType = "scw";
					else signerType = await this.requestSignerSelection(args);
					const signer = this.initSigner(signerType);
					if (signerType === "scw" && (subAccountsConfig === null || subAccountsConfig === void 0 ? void 0 : subAccountsConfig.enableAutoSubAccounts)) {
						await signer.handshake({ method: "handshake" });
						await signer.request(args);
					} else await signer.handshake(args);
					this.signer = signer;
					storeSignerType(signerType);
					break;
				}
				case "wallet_connect": {
					const signer = this.initSigner("scw");
					await signer.handshake({ method: "handshake" });
					const result = await signer.request(args);
					this.signer = signer;
					return result;
				}
				case "wallet_sendCalls":
				case "wallet_sign": {
					const ephemeralSigner = this.initSigner("scw");
					await ephemeralSigner.handshake({ method: "handshake" });
					const result = await ephemeralSigner.request(args);
					await ephemeralSigner.cleanup();
					return result;
				}
				case "wallet_getCallsStatus": return await fetchRPCRequest(args, CB_WALLET_RPC_URL);
				case "net_version": return 1;
				case "eth_chainId": return hexStringFromNumber(1);
				default: throw standardErrors.provider.unauthorized("Must call 'eth_requestAccounts' before other methods");
			}
			return await this.signer.request(args);
		} catch (error) {
			const { code } = error;
			if (code === standardErrorCodes.provider.unauthorized) this.disconnect();
			return Promise.reject(serializeError(error));
		}
	}
	/** @deprecated Use `.request({ method: 'eth_requestAccounts' })` instead. */
	async enable() {
		console.warn(`.enable() has been deprecated. Please use .request({ method: "eth_requestAccounts" }) instead.`);
		logEnableFunctionCalled();
		return await this.request({ method: "eth_requestAccounts" });
	}
	async disconnect() {
		var _a;
		await ((_a = this.signer) === null || _a === void 0 ? void 0 : _a.cleanup());
		this.signer = null;
		ScopedLocalStorage.clearAll();
		correlationIds.clear();
		this.emit("disconnect", standardErrors.provider.disconnected("User initiated disconnection"));
	}
	async requestSignerSelection(handshakeRequest) {
		logSignerSelectionRequested();
		const signerType = await fetchSignerType({
			communicator: this.communicator,
			preference: this.preference,
			metadata: this.metadata,
			handshakeRequest,
			callback: this.emit.bind(this)
		});
		logSignerSelectionResponded(signerType);
		return signerType;
	}
	initSigner(signerType) {
		return createSigner({
			signerType,
			metadata: this.metadata,
			communicator: this.communicator,
			callback: this.emit.bind(this)
		});
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/createCoinbaseWalletProvider.js
function createCoinbaseWalletProvider(options) {
	var _a;
	const params = {
		metadata: options.metadata,
		preference: options.preference
	};
	return (_a = getCoinbaseInjectedProvider(params)) !== null && _a !== void 0 ? _a : new CoinbaseWalletProvider(params);
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/createCoinbaseWalletSDK.js
var DEFAULT_PREFERENCE = { options: "all" };
/**
* Create a Coinbase Wallet SDK instance.
* @param params - Options to create a Coinbase Wallet SDK instance.
* @returns A Coinbase Wallet SDK object.
*/
function createCoinbaseWalletSDK(params) {
	var _a, _b, _c, _d;
	const options = {
		metadata: {
			appName: params.appName || "Dapp",
			appLogoUrl: params.appLogoUrl || "",
			appChainIds: params.appChainIds || []
		},
		preference: Object.assign(DEFAULT_PREFERENCE, (_a = params.preference) !== null && _a !== void 0 ? _a : {}),
		paymasterUrls: params.paymasterUrls
	};
	if ((_b = params.subAccounts) === null || _b === void 0 ? void 0 : _b.toOwnerAccount) validateSubAccount(params.subAccounts.toOwnerAccount);
	store.subAccountsConfig.set({
		toOwnerAccount: (_c = params.subAccounts) === null || _c === void 0 ? void 0 : _c.toOwnerAccount,
		enableAutoSubAccounts: (_d = params.subAccounts) === null || _d === void 0 ? void 0 : _d.enableAutoSubAccounts
	});
	store.config.set(options);
	store.persist.rehydrate();
	checkCrossOriginOpenerPolicy();
	if (options.preference.telemetry !== false) loadTelemetryScript();
	validatePreferences(options.preference);
	let provider = null;
	const sdk = {
		getProvider() {
			if (!provider) provider = createCoinbaseWalletProvider(options);
			provider.sdk = sdk;
			return provider;
		},
		subAccount: {
			async create(account) {
				var _a, _b;
				assertPresence((_a = store.getState().subAccount) === null || _a === void 0 ? void 0 : _a.address, /* @__PURE__ */ new Error("subaccount already exists"));
				return await ((_b = sdk.getProvider()) === null || _b === void 0 ? void 0 : _b.request({
					method: "wallet_addSubAccount",
					params: [{
						version: "1",
						account
					}]
				}));
			},
			async get() {
				var _a, _b;
				const subAccount = store.subAccounts.get();
				if (subAccount === null || subAccount === void 0 ? void 0 : subAccount.address) return subAccount;
				const subAccounts = (_b = (await ((_a = sdk.getProvider()) === null || _a === void 0 ? void 0 : _a.request({
					method: "wallet_connect",
					params: [{
						version: "1",
						capabilities: {}
					}]
				}))).accounts[0].capabilities) === null || _b === void 0 ? void 0 : _b.subAccounts;
				if (!Array.isArray(subAccounts)) return null;
				return subAccounts[0];
			},
			async addOwner({ address, publicKey, chainId }) {
				var _a, _b;
				const subAccount = store.subAccounts.get();
				const account = store.account.get();
				assertPresence(account, /* @__PURE__ */ new Error("account does not exist"));
				assertPresence(subAccount === null || subAccount === void 0 ? void 0 : subAccount.address, /* @__PURE__ */ new Error("subaccount does not exist"));
				const calls = [];
				if (publicKey) {
					const [x, y] = decodeAbiParameters([{ type: "bytes32" }, { type: "bytes32" }], publicKey);
					calls.push({
						to: subAccount.address,
						data: encodeFunctionData({
							abi,
							functionName: "addOwnerPublicKey",
							args: [x, y]
						}),
						value: toHex$2(0)
					});
				}
				if (address) calls.push({
					to: subAccount.address,
					data: encodeFunctionData({
						abi,
						functionName: "addOwnerAddress",
						args: [address]
					}),
					value: toHex$2(0)
				});
				return await ((_a = sdk.getProvider()) === null || _a === void 0 ? void 0 : _a.request({
					method: "wallet_sendCalls",
					params: [{
						calls,
						chainId: toHex$2(chainId),
						from: (_b = account.accounts) === null || _b === void 0 ? void 0 : _b[0],
						version: "1"
					}]
				}));
			},
			setToOwnerAccount(toSubAccountOwner) {
				validateSubAccount(toSubAccountOwner);
				store.subAccountsConfig.set({ toOwnerAccount: toSubAccountOwner });
			}
		}
	};
	return sdk;
}
//#endregion
export { createCoinbaseWalletSDK };

//# sourceMappingURL=dist-BM2XmpT1.js.map