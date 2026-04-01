import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { usePublicClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import {
  arePassportContractsConfigured,
  isPassportAddress,
  PASSPORT_AUTHORITY_ABI,
  PASSPORT_AUTHORITY_ADDRESS,
} from "../../../config/passport";
import { usePassportLocale } from "../i18n";
import {
  getPassportAuthorityOwnerQueryKey,
  PASSPORT_READ_CACHE_STALE_TIME,
} from "../utils/passportReadCache";

type UsePassportRevocationOperatorAdminOptions = {
  address?: string;
  ensureSupportedChain: () => Promise<boolean>;
  hasCorrectChain: boolean;
  isConnected: boolean;
};

type UsePassportRevocationOperatorAdminResult = {
  authorityOwner: string;
  error: string;
  isAuthorityOwner: boolean;
  isCheckingOperator: boolean;
  isConfigured: boolean;
  isLoadingAuthorityOwner: boolean;
  isSubmitting: boolean;
  loadRevocationOperatorStatus: (operatorAddress: string) => Promise<void>;
  operatorStatus: boolean | null;
  setRevocationOperator: (operatorAddress: string, enabled: boolean) => Promise<void>;
  statusMessage: string;
};

export function usePassportRevocationOperatorAdmin(
  options: UsePassportRevocationOperatorAdminOptions,
): UsePassportRevocationOperatorAdminResult {
  const { t } = usePassportLocale();
  const { address, ensureSupportedChain, hasCorrectChain, isConnected } = options;
  const queryClient = useQueryClient();
  const publicClient = usePublicClient();
  const isConfigured = arePassportContractsConfigured();
  const cachedAuthorityOwner = isConfigured
    ? queryClient.getQueryData<string>(getPassportAuthorityOwnerQueryKey())
    : undefined;
  const [authorityOwner, setAuthorityOwner] = useState(cachedAuthorityOwner ?? "");
  const [error, setError] = useState("");
  const [isCheckingOperator, setIsCheckingOperator] = useState(false);
  const [isLoadingAuthorityOwner, setIsLoadingAuthorityOwner] = useState(
    () => isConfigured && cachedAuthorityOwner === undefined,
  );
  const [operatorStatus, setOperatorStatus] = useState<boolean | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [lastSubmittedEnabled, setLastSubmittedEnabled] = useState<boolean | null>(null);
  const [lastSubmittedOperator, setLastSubmittedOperator] = useState("");

  const { writeContractAsync, data: txHash, isPending } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isTxError,
    error: txError,
  } = useWaitForTransactionReceipt({ hash: txHash });

  const isSubmitting = isPending || isConfirming;
  const isAuthorityOwner =
    Boolean(address) &&
    Boolean(authorityOwner) &&
    address.toLowerCase() === authorityOwner.toLowerCase();

  const loadAuthorityOwner = useCallback(async () => {
    if (!isConfigured) {
      setAuthorityOwner("");
      setIsLoadingAuthorityOwner(false);
      return;
    }

    if (!publicClient) {
      return;
    }

    const queryKey = getPassportAuthorityOwnerQueryKey();
    const cachedOwner = queryClient.getQueryData<string>(queryKey);

    if (cachedOwner !== undefined) {
      setAuthorityOwner(cachedOwner);
      setIsLoadingAuthorityOwner(false);
    } else {
      setIsLoadingAuthorityOwner(true);
    }

    try {
      const owner = await queryClient.fetchQuery({
        queryKey,
        queryFn: async () =>
          (await publicClient.readContract({
            address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
            abi: PASSPORT_AUTHORITY_ABI,
            functionName: "owner",
          })) as string,
        staleTime: PASSPORT_READ_CACHE_STALE_TIME,
      });

      setAuthorityOwner(owner);
    } catch (loadError) {
      setAuthorityOwner("");
      setError(
        loadError instanceof Error
          ? loadError.message
          : t("加载 PassportAuthority owner 失败。", "Failed to load PassportAuthority owner."),
      );
    } finally {
      setIsLoadingAuthorityOwner(false);
    }
  }, [isConfigured, publicClient, queryClient, t]);

  const loadRevocationOperatorStatus = useCallback(
    async (operatorAddress: string) => {
      if (!publicClient || !isConfigured || !isPassportAddress(operatorAddress)) {
        setOperatorStatus(null);
        return;
      }

      setIsCheckingOperator(true);
      setError("");

      try {
        const enabled = (await publicClient.readContract({
          address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
          abi: PASSPORT_AUTHORITY_ABI,
          functionName: "isRevocationOperator",
          args: [operatorAddress as `0x${string}`],
        })) as boolean;

        setOperatorStatus(enabled);
      } catch (loadError) {
        setOperatorStatus(null);
        setError(
          loadError instanceof Error
            ? loadError.message
            : t("加载撤销操作员状态失败。", "Failed to load revocation operator status."),
        );
      } finally {
        setIsCheckingOperator(false);
      }
    },
    [isConfigured, publicClient],
  );

  const setRevocationOperator = useCallback(
    async (operatorAddress: string, enabled: boolean) => {
      if (!isConnected || !address) {
        setError(t("请先连接钱包再提交。", "Connect a wallet before submitting."));
        return;
      }

      if (!isConfigured) {
        setError(t("资产护照合约尚未配置。", "Passport contracts are not configured."));
        return;
      }

      if (!isPassportAddress(operatorAddress)) {
        setError(t("请输入有效的操作员地址。", "Enter a valid operator address."));
        return;
      }

      if (!hasCorrectChain && !(await ensureSupportedChain())) {
        return;
      }

      setError("");
      setStatusMessage(
        enabled
          ? t(
              "正在提交撤销操作员授权交易...",
              "Submitting revocation-operator grant transaction...",
            )
          : t(
              "正在提交撤销操作员撤销交易...",
              "Submitting revocation-operator revoke transaction...",
            ),
      );
      setLastSubmittedEnabled(enabled);
      setLastSubmittedOperator(operatorAddress);

      try {
        await writeContractAsync({
          address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
          abi: PASSPORT_AUTHORITY_ABI,
          functionName: "setRevocationOperator",
          args: [operatorAddress as `0x${string}`, enabled],
        });
      } catch (submitError) {
        setStatusMessage("");
        setError(
          submitError instanceof Error
            ? submitError.message
            : t(
                "提交撤销操作员权限交易失败。",
                "Failed to submit revocation operator permission transaction.",
              ),
        );
      }
    },
    [
      address,
      ensureSupportedChain,
      hasCorrectChain,
      isConfigured,
      isConnected,
      writeContractAsync,
    ],
  );

  useEffect(() => {
    if (!isConfigured) {
      setAuthorityOwner("");
      setIsLoadingAuthorityOwner(false);
      return;
    }

    const cachedOwner = queryClient.getQueryData<string>(getPassportAuthorityOwnerQueryKey());

    setAuthorityOwner(cachedOwner ?? "");
    setIsLoadingAuthorityOwner(cachedOwner === undefined);
  }, [isConfigured, queryClient]);

  useEffect(() => {
    void loadAuthorityOwner();
  }, [loadAuthorityOwner]);

  useEffect(() => {
    if (!isConfirmed || !lastSubmittedOperator || lastSubmittedEnabled === null) {
      return;
    }

    setStatusMessage(
      lastSubmittedEnabled
        ? t("撤销操作员授权成功。", "Revocation operator granted successfully.")
        : t("撤销操作员撤销成功。", "Revocation operator revoked successfully."),
    );
    void loadRevocationOperatorStatus(lastSubmittedOperator);
  }, [
    isConfirmed,
    lastSubmittedEnabled,
    lastSubmittedOperator,
    loadRevocationOperatorStatus,
    t,
  ]);

  useEffect(() => {
    if (!isTxError || !txError) {
      return;
    }

    setStatusMessage("");
    setError(txError.message);
  }, [isTxError, txError]);

  return {
    authorityOwner,
    error,
    isAuthorityOwner,
    isCheckingOperator,
    isConfigured,
    isLoadingAuthorityOwner,
    isSubmitting,
    loadRevocationOperatorStatus,
    operatorStatus,
    setRevocationOperator,
    statusMessage,
  };
}
