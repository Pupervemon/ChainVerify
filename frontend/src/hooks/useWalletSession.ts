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
import type { ToastState } from "../types/toast";
import { clearWalletSessionStorage, wagmiConfig } from "../wagmi";

type UseWalletSessionOptions = {
  onStatusChange?: (toast: ToastState | null) => void;
  onWalletConnected?: (message: string) => void;
};

type WalletIconSource = string | (() => Promise<string>);

type WalletConnectorWithDetails = {
  icon?: string;
  rkDetails?: {
    iconUrl?: WalletIconSource;
  };
};

export function useWalletSession(options: UseWalletSessionOptions = {}) {
  const { onStatusChange, onWalletConnected } = options;
  const { isConnected, address, connector: activeConnector } = useAccount();
  const { disconnectAsync, isPending: isDisconnecting } = useDisconnect();
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
  const [activeWalletIcon, setActiveWalletIcon] = useState("");
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

  useEffect(() => {
    let isCancelled = false;

    const resolveActiveWalletIcon = async () => {
      if (!isConnected || !activeConnector) {
        setActiveWalletIcon("");
        return;
      }

      const connectorDetails = activeConnector as typeof activeConnector & WalletConnectorWithDetails;
      const iconSource = connectorDetails.rkDetails?.iconUrl ?? connectorDetails.icon;

      if (!iconSource) {
        setActiveWalletIcon("");
        return;
      }

      if (typeof iconSource === "string") {
        setActiveWalletIcon(iconSource);
        return;
      }

      try {
        const resolvedIcon = await iconSource();
        if (!isCancelled) {
          setActiveWalletIcon(resolvedIcon);
        }
      } catch {
        if (!isCancelled) {
          setActiveWalletIcon("");
        }
      }
    };

    void resolveActiveWalletIcon();

    return () => {
      isCancelled = true;
    };
  }, [activeConnector, isConnected]);

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

  const disconnectWallet = useCallback(async () => {
    setIsAccountMenuOpen(false);

    try {
      await disconnectAsync();
    } catch (error) {
      onStatusChange?.({
        message: error instanceof Error ? error.message : "Failed to disconnect wallet.",
        variant: "error",
      });
    } finally {
      clearWalletSessionStorage();
    }
  }, [disconnectAsync, onStatusChange]);

  const ensureSupportedChain = useCallback(async () => {
    if (!isConnected || chainId === TARGET_CHAIN.id) {
      hasPromptedChainSwitchRef.current = false;
      return true;
    }

    if (hasPromptedChainSwitchRef.current) {
      return false;
    }

    hasPromptedChainSwitchRef.current = true;
    onStatusChange?.({
      message: `Wrong network detected. Switching to ${TARGET_CHAIN_NAME}...`,
      variant: "loading",
    });

    try {
      await switchChainAsync({ chainId: TARGET_CHAIN.id });
      onStatusChange?.({
        message: `Connected to ${TARGET_CHAIN_NAME}.`,
        variant: "success",
      });
      hasPromptedChainSwitchRef.current = false;
      return true;
    } catch (error) {
      onStatusChange?.({
        message: getSwitchChainErrorMessage(error),
        variant: "error",
      });
      return false;
    }
  }, [chainId, getSwitchChainErrorMessage, isConnected, onStatusChange, switchChainAsync]);

  useEffect(() => {
    void ensureSupportedChain();
  }, [ensureSupportedChain]);

  useAccountEffect({
    onConnect({ address: connectedWalletAddress, isReconnected }) {
      if (!connectedWalletAddress) {
        return;
      }

      setDisplayAddress(connectedWalletAddress);
      window.localStorage.setItem(LAST_WALLET_ADDRESS_KEY, connectedWalletAddress);

      if (isReconnected) {
        return;
      }

      const walletConnectedMessage = `Wallet connected: ${truncateAddress(connectedWalletAddress)}`;
      if (onWalletConnected) {
        onWalletConnected(walletConnectedMessage);
        return;
      }

      onStatusChange?.({
        message: walletConnectedMessage,
        variant: "success",
      });
    },
    onDisconnect() {
      setIsAccountMenuOpen(false);
      setDisplayAddress("");
      window.localStorage.removeItem(LAST_WALLET_ADDRESS_KEY);
      clearWalletSessionStorage();
      onStatusChange?.(null);
    },
  });

  return {
    activeWalletIcon,
    activeWalletName: activeConnector?.name || "Wallet",
    accountMenuRef,
    blockNumber: blockNumber?.toString() || "",
    connectedAddress,
    currentChainId: chainId,
    currentChainName,
    disconnectWallet,
    ensureSupportedChain,
    hasCorrectChain,
    isAccountMenuOpen,
    isConnected,
    isDisconnecting,
    isSwitchingChain,
    openConnectModal,
    setIsAccountMenuOpen,
    targetChainId: TARGET_CHAIN.id,
    targetChainName: TARGET_CHAIN_NAME,
    truncateAddress,
  };
}
