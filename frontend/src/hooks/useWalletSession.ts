import { useCallback, useEffect, useRef, useState } from "react";
import {
  useAccount,
  useAccountEffect,
  useBlockNumber,
  useChainId,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { getAccount } from "@wagmi/core";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import { LAST_WALLET_ADDRESS_KEY } from "../config/app";
import {
  getSupportedChainName,
  TARGET_CHAIN,
  TARGET_CHAIN_NAME,
} from "../config/network";
import { wagmiConfig } from "../wagmi";

type UseWalletSessionOptions = {
  onStatusChange?: (message: string) => void;
};

export function useWalletSession(options: UseWalletSessionOptions = {}) {
  const { onStatusChange } = options;
  const { isConnected, address, connector: activeConnector } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const chainId = useChainId();
  const { switchChainAsync, isPending: isSwitchingChain } = useSwitchChain();
  const { data: blockNumber } = useBlockNumber({
    watch: true,
    chainId: chainId,
  });

  const [displayAddress, setDisplayAddress] = useState(() => {
    const currentAccount = getAccount(wagmiConfig);
    if (currentAccount.address) return currentAccount.address;
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(LAST_WALLET_ADDRESS_KEY) || "";
  });
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const hasPromptedChainSwitchRef = useRef(false);

  const connectedAddress = isConnected ? address || displayAddress : "";
  const hasCorrectChain = chainId === TARGET_CHAIN.id;
  const currentChainName = isConnected ? getSupportedChainName(chainId) : "Disconnected";

  useEffect(() => {
    if (!isAccountMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isAccountMenuOpen]);

  useEffect(() => {
    if (!address) {
      return;
    }

    setDisplayAddress(address);
    window.localStorage.setItem(LAST_WALLET_ADDRESS_KEY, address);
  }, [address]);

  const truncateAddress = useCallback(
    (value: string) => `${value.slice(0, 6)}...${value.slice(-4)}`,
    [],
  );

  const getSwitchChainErrorMessage = useCallback((error: unknown) => {
    const message = error instanceof Error ? error.message : "";
    const normalizedMessage = message.toLowerCase();

    if (
      normalizedMessage.includes("user rejected") ||
      normalizedMessage.includes("user denied")
    ) {
      return `Please switch your wallet network to ${TARGET_CHAIN_NAME}.`;
    }

    return message || `Failed to switch wallet network to ${TARGET_CHAIN_NAME}.`;
  }, []);

  const revokeWalletAuthorization = useCallback(async () => {
    if (typeof window === "undefined") {
      return;
    }

    const provider = (window as Window & {
      ethereum?: {
        request?: (args: {
          method: string;
          params?: unknown[] | object;
        }) => Promise<unknown>;
      };
    }).ethereum;

    if (!provider?.request) {
      return;
    }

    await Promise.allSettled([
      provider.request({
        method: "wallet_revokePermissions",
        params: [{ eth_accounts: {} }],
      }),
    ]);
  }, []);

  const ensureSupportedChain = useCallback(async () => {
    if (!isConnected || chainId === TARGET_CHAIN.id) {
      hasPromptedChainSwitchRef.current = false;
      return true;
    }

    if (hasPromptedChainSwitchRef.current) {
      return false;
    }

    hasPromptedChainSwitchRef.current = true;
    onStatusChange?.(`Wrong network detected. Switching to ${TARGET_CHAIN_NAME}...`);

    try {
      await switchChainAsync({ chainId: TARGET_CHAIN.id });
      onStatusChange?.(`Connected to ${TARGET_CHAIN_NAME}.`);
      hasPromptedChainSwitchRef.current = false;
      return true;
    } catch (error) {
      onStatusChange?.(getSwitchChainErrorMessage(error));
      return false;
    }
  }, [chainId, getSwitchChainErrorMessage, isConnected, onStatusChange, switchChainAsync]);

  useEffect(() => {
    void ensureSupportedChain();
  }, [ensureSupportedChain]);

  useAccountEffect({
    onConnect({ address: connectedWalletAddress }) {
      if (!connectedWalletAddress) {
        return;
      }

      setDisplayAddress(connectedWalletAddress);
      window.localStorage.setItem(LAST_WALLET_ADDRESS_KEY, connectedWalletAddress);
      onStatusChange?.(`Wallet connected: ${truncateAddress(connectedWalletAddress)}`);
    },
    onDisconnect() {
      setIsAccountMenuOpen(false);
      setDisplayAddress("");
      window.localStorage.removeItem(LAST_WALLET_ADDRESS_KEY);
      onStatusChange?.("");
    },
  });

  return {
    activeWalletIcon: "",
    activeWalletName: activeConnector?.name || "Wallet",
    accountMenuRef,
    blockNumber: blockNumber?.toString() || "",
    connectedAddress,
    currentChainId: chainId,
    currentChainName,
    disconnect,
    ensureSupportedChain,
    hasCorrectChain,
    isAccountMenuOpen,
    isConnected,
    isSwitchingChain,
    openConnectModal,
    revokeWalletAuthorization,
    setIsAccountMenuOpen,
    targetChainId: TARGET_CHAIN.id,
    targetChainName: TARGET_CHAIN_NAME,
    truncateAddress,
  };
}
