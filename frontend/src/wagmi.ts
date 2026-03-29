import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { injectedWallet, metaMaskWallet, okxWallet, rabbyWallet, walletConnectWallet } from "@rainbow-me/rainbowkit/wallets";
import { http } from "wagmi";
import { hardhat, sepolia } from "wagmi/chains";

import { LOCAL_RPC_URL, SEPOLIA_RPC_URL, SUPPORTED_CHAINS } from "./config/network";

export const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "3fcc6b144415893d5f22f036720f7796";

const appOrigin = typeof window !== "undefined" ? window.location.origin : "http://localhost:5173";

const cleanupWalletConnectStorage = () => {
  if (typeof window === "undefined") return;

  const cleanupFlag = "deproof:walletconnect-cleanup-v1";
  if (window.localStorage.getItem(cleanupFlag) === "done") return;

  const keysToRemove: string[] = [];
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key) continue;

    if (
      key.startsWith("wc@2:") ||
      key.startsWith("WALLETCONNECT_") ||
      key.startsWith("@appkit/") ||
      key.startsWith("_walletConnectCore_") ||
      key.startsWith("reown:") ||
      key.includes("walletconnect")
    ) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => window.localStorage.removeItem(key));
  window.localStorage.setItem(cleanupFlag, "done");
};

cleanupWalletConnectStorage();

export const browserExtensionConnectorIds = ["metaMask", "rabby", "okxWallet", "injected"] as const;

export const wagmiConfig = getDefaultConfig({
  appName: "DeProof",
  appDescription: "Decentralized proof notarization",
  appUrl: appOrigin,
  projectId: walletConnectProjectId,
  chains: SUPPORTED_CHAINS,
  wallets: [
    {
      groupName: "Recommended",
      wallets: [
        metaMaskWallet,
        rabbyWallet,
        okxWallet,
        injectedWallet,
        walletConnectWallet,
      ],
    },
  ],
  transports: {
    [hardhat.id]: http(LOCAL_RPC_URL),
    [sepolia.id]: http(SEPOLIA_RPC_URL),
  },
});
