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
          : t(
              "Failed to load PassportAuthority owner.",
              "Failed to load PassportAuthority owner.",
            ),
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
            : t(
                "Failed to load stamp type admin status.",
                "Failed to load stamp type admin status.",
              ),
        );
      } finally {
        setIsCheckingAdmin(false);
      }
    },
    [isConfigured, publicClient, t],
  );

  const setStampTypeAdmin = useCallback(
    async (stampTypeId: bigint, adminAddress: string, enabled: boolean) => {
      if (!isConnected || !address) {
        setError(
          t("Connect a wallet before submitting.", "Connect a wallet before submitting."),
        );
        return;
      }

      if (!isConfigured) {
        setError(
          t(
            "Passport contracts are not configured.",
            "Passport contracts are not configured.",
          ),
        );
        return;
      }

      if (!isPassportAddress(adminAddress)) {
        setError(t("Enter a valid admin address.", "Enter a valid admin address."));
        return;
      }

      if (!hasCorrectChain && !(await ensureSupportedChain())) {
        return;
      }

      setError("");
      setStatusMessage(
        enabled
          ? t(
              "Submitting stamp type admin grant...",
              "Submitting stamp type admin grant...",
            )
          : t(
              "Submitting stamp type admin revocation...",
              "Submitting stamp type admin revocation...",
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
            : t(
                "Failed to submit stamp type admin transaction.",
                "Failed to submit stamp type admin transaction.",
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
      t,
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
            `Stamp type #${lastSubmittedStampTypeId.toString()} admin access was granted.`,
            `Stamp type #${lastSubmittedStampTypeId.toString()} admin access was granted.`,
          )
        : t(
            `Stamp type #${lastSubmittedStampTypeId.toString()} admin access was revoked.`,
            `Stamp type #${lastSubmittedStampTypeId.toString()} admin access was revoked.`,
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
