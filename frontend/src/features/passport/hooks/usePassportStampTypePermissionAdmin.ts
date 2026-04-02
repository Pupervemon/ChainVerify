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

type UsePassportStampTypePermissionAdminOptions = {
  address?: string;
  ensureSupportedChain: () => Promise<boolean>;
  hasCorrectChain: boolean;
  isConnected: boolean;
};

type UsePassportStampTypePermissionAdminResult = {
  adminStatus: boolean | null;
  authorityOwner: string;
  error: string;
  isAuthorityOwner: boolean;
  isCheckingAdmin: boolean;
  isConfigured: boolean;
  isLoadingAuthorityOwner: boolean;
  isSubmitting: boolean;
  loadStampTypeAdminStatus: (stampTypeId: bigint, adminAddress: string) => Promise<void>;
  setStampTypeAdmin: (stampTypeId: bigint, adminAddress: string, enabled: boolean) => Promise<void>;
  statusMessage: string;
};

export function usePassportStampTypePermissionAdmin(
  options: UsePassportStampTypePermissionAdminOptions,
): UsePassportStampTypePermissionAdminResult {
  const { t } = usePassportLocale();
  const { address, ensureSupportedChain, hasCorrectChain, isConnected } = options;
  const queryClient = useQueryClient();
  const publicClient = usePublicClient({ chainId: TARGET_CHAIN_ID });
  const isConfigured = arePassportContractsConfigured();
  const [adminStatus, setAdminStatus] = useState<boolean | null>(null);
  const cachedAuthorityOwner = isConfigured
    ? queryClient.getQueryData<string>(getPassportAuthorityOwnerQueryKey())
    : undefined;
  const [authorityOwner, setAuthorityOwner] = useState(cachedAuthorityOwner ?? "");
  const [error, setError] = useState("");
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);
  const [isLoadingAuthorityOwner, setIsLoadingAuthorityOwner] = useState(
    () => isConfigured && cachedAuthorityOwner === undefined,
  );
  const [lastSubmittedAdmin, setLastSubmittedAdmin] = useState("");
  const [lastSubmittedEnabled, setLastSubmittedEnabled] = useState<boolean | null>(null);
  const [lastSubmittedStampTypeId, setLastSubmittedStampTypeId] = useState<bigint | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

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

  const loadStampTypeAdminStatus = useCallback(
    async (stampTypeId: bigint, adminAddress: string) => {
      if (!publicClient || !isConfigured || !isPassportAddress(adminAddress)) {
        setAdminStatus(null);
        return;
      }

      setIsCheckingAdmin(true);
      setError("");

      try {
        const enabled = (await publicClient.readContract({
          address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
          abi: PASSPORT_AUTHORITY_ABI,
          functionName: "isStampTypeAdmin",
          args: [stampTypeId, adminAddress as `0x${string}`],
        })) as boolean;

        setAdminStatus(enabled);
      } catch (loadError) {
        setAdminStatus(null);
        setError(
          loadError instanceof Error
            ? loadError.message
            : t("鍔犺浇鍗扮珷绫诲瀷绠＄悊鍛樼姸鎬佸け璐ャ€?, "Failed to load stamp type admin status."),
        );
      } finally {
        setIsCheckingAdmin(false);
      }
    },
    [isConfigured, publicClient],
  );

  const setStampTypeAdmin = useCallback(
    async (stampTypeId: bigint, adminAddress: string, enabled: boolean) => {
      if (!isConnected || !address) {
        setError(t("璇峰厛杩炴帴閽卞寘鍐嶆彁浜ゃ€?, "Connect a wallet before submitting."));
        return;
      }

      if (!isConfigured) {
        setError(t("璧勪骇鎶ょ収鍚堢害灏氭湭閰嶇疆銆?, "Passport contracts are not configured."));
        return;
      }

      if (!isPassportAddress(adminAddress)) {
        setError(t("璇疯緭鍏ユ湁鏁堢殑绠＄悊鍛樺湴鍧€銆?, "Enter a valid admin address."));
        return;
      }

      if (!hasCorrectChain && !(await ensureSupportedChain())) {
        return;
      }

      setError("");
      setStatusMessage(
        enabled
          ? t(
              "姝ｅ湪鎻愪氦鍗扮珷绫诲瀷绠＄悊鍛樻巿鏉冧氦鏄?..",
              "Submitting stamp type admin grant transaction...",
            )
          : t(
              "姝ｅ湪鎻愪氦鍗扮珷绫诲瀷绠＄悊鍛樻挙閿€浜ゆ槗...",
              "Submitting stamp type admin revoke transaction...",
            ),
      );
      setLastSubmittedAdmin(adminAddress);
      setLastSubmittedEnabled(enabled);
      setLastSubmittedStampTypeId(stampTypeId);

      try {
        await writeContractAsync({
          address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
          abi: PASSPORT_AUTHORITY_ABI,
          functionName: "setStampTypeAdmin",
          args: [stampTypeId, adminAddress as `0x${string}`, enabled],
        });
      } catch (submitError) {
        setStatusMessage("");
        setError(
          submitError instanceof Error
            ? submitError.message
            : t("鎻愪氦鍗扮珷绫诲瀷绠＄悊鍛樹氦鏄撳け璐ャ€?, "Failed to submit stamp type admin transaction."),
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
    if (
      !isConfirmed ||
      lastSubmittedStampTypeId === null ||
      !lastSubmittedAdmin ||
      lastSubmittedEnabled === null
    ) {
      return;
    }

    setStatusMessage(
      lastSubmittedEnabled
        ? t(
            `鍗扮珷绫诲瀷 #${lastSubmittedStampTypeId.toString()} 鐨勭鐞嗗憳鎺堟潈鎴愬姛銆俙,
            `Admin granted for stamp type #${lastSubmittedStampTypeId.toString()}.`,
          )
        : t(
            `鍗扮珷绫诲瀷 #${lastSubmittedStampTypeId.toString()} 鐨勭鐞嗗憳宸叉挙閿€銆俙,
            `Admin revoked for stamp type #${lastSubmittedStampTypeId.toString()}.`,
          ),
    );
    void loadStampTypeAdminStatus(lastSubmittedStampTypeId, lastSubmittedAdmin);
  }, [
    isConfirmed,
    lastSubmittedAdmin,
    lastSubmittedEnabled,
    lastSubmittedStampTypeId,
    loadStampTypeAdminStatus,
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
    adminStatus,
    authorityOwner,
    error,
    isAuthorityOwner,
    isCheckingAdmin,
    isConfigured,
    isLoadingAuthorityOwner,
    isSubmitting,
    loadStampTypeAdminStatus,
    setStampTypeAdmin,
    statusMessage,
  };
}



