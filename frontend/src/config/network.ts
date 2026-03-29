import PassportDeployment from "../contracts/passport/deployment.json";
import type { Chain } from "wagmi/chains";
import { hardhat, sepolia } from "wagmi/chains";

const SUPPORTED_CHAINS_BY_ID: Record<number, Chain> = {
  [hardhat.id]: hardhat,
  [sepolia.id]: sepolia,
};

const parseChainId = (value: string | undefined) => {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
};

const isSupportedChainId = (value: number | null): value is number =>
  value !== null && SUPPORTED_CHAINS_BY_ID[value] !== undefined;

const runtimeHostname = typeof window !== "undefined" ? window.location.hostname : "";
const isLocalRuntimeHost = runtimeHostname === "localhost" || runtimeHostname === "127.0.0.1";

const explicitTargetChainId =
  parseChainId(import.meta.env.VITE_TARGET_CHAIN_ID) ??
  parseChainId(import.meta.env.VITE_PASSPORT_CHAIN_ID);

const syncedPassportChainId =
  typeof PassportDeployment.chainId === "number" ? PassportDeployment.chainId : null;

const inferredTargetChainId = (() => {
  if (isSupportedChainId(explicitTargetChainId)) {
    return explicitTargetChainId;
  }

  if (isLocalRuntimeHost && isSupportedChainId(syncedPassportChainId)) {
    return syncedPassportChainId;
  }

  return sepolia.id;
})();

export const TARGET_CHAIN = SUPPORTED_CHAINS_BY_ID[inferredTargetChainId] ?? sepolia;
export const TARGET_CHAIN_ID = TARGET_CHAIN.id;
export const TARGET_CHAIN_NAME = TARGET_CHAIN.name;
export const SYNCED_PASSPORT_CHAIN_ID = syncedPassportChainId;
export const CAN_USE_SYNCED_PASSPORT_DEPLOYMENT =
  SYNCED_PASSPORT_CHAIN_ID === TARGET_CHAIN_ID;

export const SUPPORTED_CHAINS = [
  TARGET_CHAIN,
  ...Object.values(SUPPORTED_CHAINS_BY_ID).filter((chain) => chain.id !== TARGET_CHAIN_ID),
];

export const LOCAL_RPC_URL =
  import.meta.env.VITE_LOCAL_RPC_URL || hardhat.rpcUrls.default.http[0] || "http://127.0.0.1:8545";

export const SEPOLIA_RPC_URL =
  import.meta.env.VITE_SEPOLIA_RPC_URL || sepolia.rpcUrls.default.http[0];

export const getSupportedChainName = (chainId?: number) => {
  if (chainId === undefined) {
    return "Unknown";
  }

  return SUPPORTED_CHAINS_BY_ID[chainId]?.name || `Chain ${chainId}`;
};
