import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { usePublicClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import { TARGET_CHAIN_ID } from "../../../config/network";
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

type UsePassportCreatorAdminOptions = {
  address?: string;
  ensureSupportedChain: () => Promise<boolean>;
  hasCorrectChain: boolean;
  isConnected: boolean;
};

type UsePassportCreatorAdminResult = {
  authorityOwner: string;
  creatorStatus: boolean | null;
  error: string;
  isAuthorityOwner: boolean;
  isCheckingCreator: boolean;
  isConfigured: boolean;
  isLoadingAuthorityOwner: boolean;
  isSubmitting: boolean;
  lastConfirmedTxHash: string;
  statusMessage: string;
  loadCreatorStatus: (operatorAddress: string) => Promise<void>;
  setPassportCreator: (operatorAddress: string, enabled: boolean) => Promise<void>;
};

export function usePassportCreatorAdmin(
  options: UsePassportCreatorAdminOptions,
): UsePassportCreatorAdminResult {
  const { t } = usePassportLocale();
  const { address, ensureSupportedChain, hasCorrectChain, isConnected } = options;
  const queryClient = useQueryClient();
  const publicClient = usePublicClient({ chainId: TARGET_CHAIN_ID });
  const isConfigured = arePassportContractsConfigured();
  const cachedAuthorityOwner = isConfigured
    ? queryClient.getQueryData<string>(getPassportAuthorityOwnerQueryKey())
    : undefined;
  const [authorityOwner, setAuthorityOwner] = useState(cachedAuthorityOwner ?? "");
  const [creatorStatus, setCreatorStatus] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [isCheckingCreator, setIsCheckingCreator] = useState(false);
  const [isLoadingAuthorityOwner, setIsLoadingAuthorityOwner] = useState(
    () => isConfigured && cachedAuthorityOwner === undefined,
  );
  const [statusMessage, setStatusMessage] = useState("");
  const [lastSubmittedOperator, setLastSubmittedOperator] = useState("");
  const [lastSubmittedEnabled, setLastSubmittedEnabled] = useState<boolean | null>(null);

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
          : t("鍔犺浇 PassportAuthority owner 澶辫触銆?, "Failed to load PassportAuthority owner."),
      );
    } finally {
      setIsLoadingAuthorityOwner(false);
    }
  }, [isConfigured, publicClient, queryClient, t]);

  const loadCreatorStatus = useCallback(
    async (operatorAddress: string) => {
      if (!publicClient || !isConfigured || !isPassportAddress(operatorAddress)) {
        setCreatorStatus(null);
        return;
      }

      setIsCheckingCreator(true);
      setError("");

      try {
        const enabled = (await publicClient.readContract({
          address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
          abi: PASSPORT_AUTHORITY_ABI,
          functionName: "isPassportCreator",
          args: [operatorAddress as `0x${string}`],
        })) as boolean;

        setCreatorStatus(enabled);
      } catch (loadError) {
        setCreatorStatus(null);
        setError(
          loadError instanceof Error
            ? loadError.message
            : t("鍔犺浇鎶ょ収鍒涘缓鑰呯姸鎬佸け璐ャ€?, "Failed to load passport creator status."),
        );
      } finally {
        setIsCheckingCreator(false);
      }
    },
    [isConfigured, publicClient],
  );

  const setPassportCreator = useCallback(
    async (operatorAddress: string, enabled: boolean) => {
      if (!isConnected || !address) {
        setError(t("璇峰厛杩炴帴閽卞寘鍐嶆彁浜ゃ€?, "Connect a wallet before submitting."));
        return;
      }

      if (!isConfigured) {
        setError(t("璧勪骇鎶ょ収鍚堢害灏氭湭閰嶇疆銆?, "Passport contracts are not configured."));
        return;
      }

      if (!isPassportAddress(operatorAddress)) {
        setError(t("璇疯緭鍏ユ湁鏁堢殑鎿嶄綔鍛樺湴鍧€銆?, "Enter a valid operator address."));
        return;
      }

      if (!hasCorrectChain && !(await ensureSupportedChain())) {
        return;
      }

      setError("");
      setStatusMessage(
        enabled
          ? t("姝ｅ湪鎻愪氦鍒涘缓鏉冮檺鎺堟潈浜ゆ槗...", "Submitting creator grant transaction...")
          : t("姝ｅ湪鎻愪氦鍒涘缓鏉冮檺鎾ら攢浜ゆ槗...", "Submitting creator revoke transaction..."),
      );
      setLastSubmittedOperator(operatorAddress);
      setLastSubmittedEnabled(enabled);

      try {
        await writeContractAsync({
          address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
          abi: PASSPORT_AUTHORITY_ABI,
          functionName: "setPassportCreator",
          args: [operatorAddress as `0x${string}`, enabled],
        });
      } catch (submitError) {
        setStatusMessage("");
        setError(
          submitError instanceof Error
            ? submitError.message
            : t("鎻愪氦鎶ょ収鍒涘缓鑰呮潈闄愪氦鏄撳け璐ャ€?, "Failed to submit passport creator transaction."),
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
        ? t("鎶ょ収鍒涘缓鑰呮巿鏉冩垚鍔熴€?, "Passport creator granted successfully.")
        : t("鎶ょ収鍒涘缓鑰呮挙閿€鎴愬姛銆?, "Passport creator revoked successfully."),
    );
    void loadCreatorStatus(lastSubmittedOperator);
  }, [isConfirmed, lastSubmittedEnabled, lastSubmittedOperator, loadCreatorStatus]);

  useEffect(() => {
    if (!isTxError || !txError) {
      return;
    }

    setStatusMessage("");
    setError(txError.message);
  }, [isTxError, txError]);

  return {
    authorityOwner,
    creatorStatus,
    error,
    isAuthorityOwner,
    isCheckingCreator,
    isConfigured,
    isLoadingAuthorityOwner,
    isSubmitting,
    lastConfirmedTxHash: isConfirmed && txHash ? txHash : "",
    statusMessage,
    loadCreatorStatus,
    setPassportCreator,
  };
}



