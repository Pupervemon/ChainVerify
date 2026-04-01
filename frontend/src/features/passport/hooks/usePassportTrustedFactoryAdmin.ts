import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { usePublicClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import {
  ASSET_PASSPORT_ABI,
  ASSET_PASSPORT_ADDRESS,
  isPassportAddress,
} from "../../../config/passport";
import { usePassportLocale } from "../i18n";
import { normalizePassportContractError } from "../utils/contractErrors";
import {
  getAssetPassportOwnerQueryKey,
  PASSPORT_READ_CACHE_STALE_TIME,
} from "../utils/passportReadCache";

type UsePassportTrustedFactoryAdminOptions = {
  address?: string;
  ensureSupportedChain: () => Promise<boolean>;
  hasCorrectChain: boolean;
  isConnected: boolean;
};

type UsePassportTrustedFactoryAdminResult = {
  assetPassportOwner: string;
  error: string;
  factoryStatus: boolean | null;
  isAssetPassportOwner: boolean;
  isCheckingFactory: boolean;
  isConfigured: boolean;
  isLoadingAssetPassportOwner: boolean;
  isSubmitting: boolean;
  lastConfirmedTxHash: string;
  loadFactoryStatus: (factoryAddress: string) => Promise<void>;
  setTrustedFactory: (factoryAddress: string, enabled: boolean) => Promise<void>;
  statusMessage: string;
};

export function usePassportTrustedFactoryAdmin(
  options: UsePassportTrustedFactoryAdminOptions,
): UsePassportTrustedFactoryAdminResult {
  const { t } = usePassportLocale();
  const { address, ensureSupportedChain, hasCorrectChain, isConnected } = options;
  const queryClient = useQueryClient();
  const publicClient = usePublicClient();
  const isConfigured = isPassportAddress(ASSET_PASSPORT_ADDRESS);
  const cachedAssetPassportOwner = isConfigured
    ? queryClient.getQueryData<string>(getAssetPassportOwnerQueryKey())
    : undefined;
  const [assetPassportOwner, setAssetPassportOwner] = useState(cachedAssetPassportOwner ?? "");
  const [error, setError] = useState("");
  const [factoryStatus, setFactoryStatus] = useState<boolean | null>(null);
  const [isCheckingFactory, setIsCheckingFactory] = useState(false);
  const [isLoadingAssetPassportOwner, setIsLoadingAssetPassportOwner] = useState(
    () => isConfigured && cachedAssetPassportOwner === undefined,
  );
  const [lastSubmittedEnabled, setLastSubmittedEnabled] = useState<boolean | null>(null);
  const [lastSubmittedFactory, setLastSubmittedFactory] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const { writeContractAsync, data: txHash, isPending } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isTxError,
    error: txError,
  } = useWaitForTransactionReceipt({ hash: txHash });

  const isSubmitting = isPending || isConfirming;
  const isAssetPassportOwner =
    Boolean(address) &&
    Boolean(assetPassportOwner) &&
    address.toLowerCase() === assetPassportOwner.toLowerCase();

  const loadAssetPassportOwner = useCallback(async () => {
    if (!isConfigured) {
      setAssetPassportOwner("");
      setIsLoadingAssetPassportOwner(false);
      return;
    }

    if (!publicClient) {
      return;
    }

    const queryKey = getAssetPassportOwnerQueryKey();
    const cachedOwner = queryClient.getQueryData<string>(queryKey);

    if (cachedOwner !== undefined) {
      setAssetPassportOwner(cachedOwner);
      setIsLoadingAssetPassportOwner(false);
    } else {
      setIsLoadingAssetPassportOwner(true);
    }

    try {
      const owner = await queryClient.fetchQuery({
        queryKey,
        queryFn: async () =>
          (await publicClient.readContract({
            address: ASSET_PASSPORT_ADDRESS as `0x${string}`,
            abi: ASSET_PASSPORT_ABI,
            functionName: "owner",
          })) as string,
        staleTime: PASSPORT_READ_CACHE_STALE_TIME,
      });

      setAssetPassportOwner(owner);
    } catch (loadError) {
      setAssetPassportOwner("");
      setError(
        normalizePassportContractError(loadError, {
          contractAddress: ASSET_PASSPORT_ADDRESS,
          contractName: "AssetPassport",
          fallback: t("加载 AssetPassport owner 失败。", "Failed to load AssetPassport owner."),
          t,
        }),
      );
    } finally {
      setIsLoadingAssetPassportOwner(false);
    }
  }, [isConfigured, publicClient, queryClient, t]);

  const loadFactoryStatus = useCallback(
    async (factoryAddress: string) => {
      if (!publicClient || !isConfigured || !isPassportAddress(factoryAddress)) {
        setFactoryStatus(null);
        return;
      }

      setIsCheckingFactory(true);
      setError("");

      try {
        const enabled = (await publicClient.readContract({
          address: ASSET_PASSPORT_ADDRESS as `0x${string}`,
          abi: ASSET_PASSPORT_ABI,
          functionName: "isFactory",
          args: [factoryAddress as `0x${string}`],
        })) as boolean;

        setFactoryStatus(enabled);
      } catch (loadError) {
        setFactoryStatus(null);
        setError(
          normalizePassportContractError(loadError, {
            contractAddress: ASSET_PASSPORT_ADDRESS,
            contractName: "AssetPassport",
            fallback: t("加载可信工厂状态失败。", "Failed to load trusted factory status."),
            t,
          }),
        );
      } finally {
        setIsCheckingFactory(false);
      }
    },
    [isConfigured, publicClient, t],
  );

  const setTrustedFactory = useCallback(
    async (factoryAddress: string, enabled: boolean) => {
      if (!isConnected || !address) {
        setError(t("请先连接钱包再提交。", "Connect a wallet before submitting."));
        return;
      }

      if (!isConfigured) {
        setError(t("AssetPassport 合约尚未配置。", "AssetPassport is not configured."));
        return;
      }

      if (!isPassportAddress(factoryAddress)) {
        setError(t("请输入有效的工厂合约地址。", "Enter a valid factory contract address."));
        return;
      }

      if (!hasCorrectChain && !(await ensureSupportedChain())) {
        return;
      }

      setError("");
      setStatusMessage(
        enabled
          ? t("正在提交可信工厂授权交易...", "Submitting trusted factory authorization transaction...")
          : t("正在提交可信工厂移除交易...", "Submitting trusted factory removal transaction..."),
      );
      setLastSubmittedEnabled(enabled);
      setLastSubmittedFactory(factoryAddress);

      try {
        await writeContractAsync({
          address: ASSET_PASSPORT_ADDRESS as `0x${string}`,
          abi: ASSET_PASSPORT_ABI,
          functionName: "setFactory",
          args: [factoryAddress as `0x${string}`, enabled],
        });
      } catch (submitError) {
        setStatusMessage("");
        setError(
          submitError instanceof Error
            ? submitError.message
            : t("提交可信工厂交易失败。", "Failed to submit trusted factory transaction."),
        );
      }
    },
    [
      address,
      ensureSupportedChain,
      hasCorrectChain,
      isConfigured,
      isConnected,
      t,
      writeContractAsync,
    ],
  );

  useEffect(() => {
    if (!isConfigured) {
      setAssetPassportOwner("");
      setIsLoadingAssetPassportOwner(false);
      return;
    }

    const cachedOwner = queryClient.getQueryData<string>(getAssetPassportOwnerQueryKey());

    setAssetPassportOwner(cachedOwner ?? "");
    setIsLoadingAssetPassportOwner(cachedOwner === undefined);
  }, [isConfigured, queryClient]);

  useEffect(() => {
    void loadAssetPassportOwner();
  }, [loadAssetPassportOwner]);

  useEffect(() => {
    if (!isConfirmed || !lastSubmittedFactory || lastSubmittedEnabled === null) {
      return;
    }

    setStatusMessage(
      lastSubmittedEnabled
        ? t("可信工厂授权成功。", "Trusted factory authorized successfully.")
        : t("可信工厂已移除。", "Trusted factory removed successfully."),
    );
    void loadFactoryStatus(lastSubmittedFactory);
  }, [isConfirmed, lastSubmittedEnabled, lastSubmittedFactory, loadFactoryStatus, t]);

  useEffect(() => {
    if (!isTxError || !txError) {
      return;
    }

    setStatusMessage("");
    setError(txError.message);
  }, [isTxError, txError]);

  return {
    assetPassportOwner,
    error,
    factoryStatus,
    isAssetPassportOwner,
    isCheckingFactory,
    isConfigured,
    isLoadingAssetPassportOwner,
    isSubmitting,
    lastConfirmedTxHash: isConfirmed && txHash ? txHash : "",
    loadFactoryStatus,
    setTrustedFactory,
    statusMessage,
  };
}
