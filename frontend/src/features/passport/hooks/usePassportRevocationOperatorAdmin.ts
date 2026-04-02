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
  const publicClient = usePublicClient({ chainId: TARGET_CHAIN_ID });
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
          : t("鍔犺浇 PassportAuthority owner 澶辫触銆?, "Failed to load PassportAuthority owner."),
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
            : t("鍔犺浇鎾ら攢鎿嶄綔鍛樼姸鎬佸け璐ャ€?, "Failed to load revocation operator status."),
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
          ? t(
              "姝ｅ湪鎻愪氦鎾ら攢鎿嶄綔鍛樻巿鏉冧氦鏄?..",
              "Submitting revocation-operator grant transaction...",
            )
          : t(
              "姝ｅ湪鎻愪氦鎾ら攢鎿嶄綔鍛樻挙閿€浜ゆ槗...",
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
                "鎻愪氦鎾ら攢鎿嶄綔鍛樻潈闄愪氦鏄撳け璐ャ€?,
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
        ? t("鎾ら攢鎿嶄綔鍛樻巿鏉冩垚鍔熴€?, "Revocation operator granted successfully.")
        : t("鎾ら攢鎿嶄綔鍛樻挙閿€鎴愬姛銆?, "Revocation operator revoked successfully."),
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



