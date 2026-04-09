import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { decodeEventLog } from "viem";
import { usePublicClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { TARGET_CHAIN_ID } from "../../../config/network";

import {
  arePassportContractsConfigured,
  CHRONICLE_STAMP_ABI,
  CHRONICLE_STAMP_ADDRESS,
  PASSPORT_AUTHORITY_ABI,
  PASSPORT_AUTHORITY_ADDRESS,
} from "../../../config/passport";
import { usePassportLocale } from "../i18n";
import { normalizePassportContractError } from "../utils/contractErrors";
import {
  getPassportRevokeContextQueryKey,
  PASSPORT_READ_CACHE_STALE_TIME,
} from "../utils/passportReadCache";

type StampRecordPreview = {
  issuer: string;
  metadataCID: string;
  occurredAt: bigint;
  passportId: bigint;
  revoked: boolean;
  revokedByStampId: bigint;
  stampId: bigint;
  stampTypeId: bigint;
  supersedesStampId: bigint;
};

type UsePassportRevokeStampOptions = {
  address?: string;
  ensureSupportedChain: () => Promise<boolean>;
  hasCorrectChain: boolean;
  initialStampId?: bigint | null;
  isConnected: boolean;
};

type RevokeContext = {
  canRevoke: boolean;
  stampRecord: StampRecordPreview | null;
};

type UsePassportRevokeStampResult = {
  canRevoke: boolean;
  error: string;
  isConfigured: boolean;
  isLoadingContext: boolean;
  isSubmitting: boolean;
  loadContext: (stampId: bigint) => Promise<void>;
  revokedStampId: bigint | null;
  stampRecord: StampRecordPreview | null;
  statusMessage: string;
  submitRevokeStamp: (stampId: bigint, reasonCID: string) => Promise<void>;
};

export function usePassportRevokeStamp(
  options: UsePassportRevokeStampOptions,
): UsePassportRevokeStampResult {
  const { t } = usePassportLocale();
  const {
    address,
    ensureSupportedChain,
    hasCorrectChain,
    initialStampId = null,
    isConnected,
  } = options;
  const queryClient = useQueryClient();
  const publicClient = usePublicClient({ chainId: TARGET_CHAIN_ID });
  const isConfigured = arePassportContractsConfigured();
  const cachedContext =
    address && initialStampId !== null && isConfigured
      ? queryClient.getQueryData<RevokeContext>(
          getPassportRevokeContextQueryKey(address, initialStampId),
        )
      : undefined;
  const [canRevoke, setCanRevoke] = useState(cachedContext?.canRevoke ?? false);
  const [error, setError] = useState("");
  const [isLoadingContext, setIsLoadingContext] = useState(
    () => Boolean(address) && isConfigured && initialStampId !== null && cachedContext === undefined,
  );
  const [revokedStampId, setRevokedStampId] = useState<bigint | null>(null);
  const [stampRecord, setStampRecord] = useState<StampRecordPreview | null>(
    cachedContext?.stampRecord ?? null,
  );
  const [statusMessage, setStatusMessage] = useState("");
  const latestLoadRequestRef = useRef(0);

  const { writeContractAsync, data: txHash, isPending } = useWriteContract();
  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isTxError,
    error: txError,
  } = useWaitForTransactionReceipt({ hash: txHash });

  const isSubmitting = isPending || isConfirming;

  const clearLoadedContext = useCallback(() => {
    setCanRevoke(false);
    setStampRecord(null);
    setIsLoadingContext(false);
  }, []);

  const loadContext = useCallback(
    async (stampId: bigint) => {
      latestLoadRequestRef.current += 1;
      const requestId = latestLoadRequestRef.current;

      setError("");
      setStatusMessage("");
      setRevokedStampId(null);

      if (!isConfigured || !address) {
        clearLoadedContext();
        return;
      }

      if (!publicClient) {
        clearLoadedContext();
        setError(t("Public client is not ready.", "Public client is not ready."));
        return;
      }

      const queryKey = getPassportRevokeContextQueryKey(address, stampId);
      const cachedStampContext = queryClient.getQueryData<RevokeContext>(queryKey);

      if (cachedStampContext !== undefined) {
        if (latestLoadRequestRef.current !== requestId) {
          return;
        }

        setCanRevoke(cachedStampContext.canRevoke);
        setStampRecord(cachedStampContext.stampRecord);
        setIsLoadingContext(false);
      } else {
        setCanRevoke(false);
        setStampRecord(null);
        setIsLoadingContext(true);
      }

      try {
        const context = await queryClient.fetchQuery({
          queryKey,
          queryFn: async () => {
            const [allowed, record] = await Promise.all([
              publicClient.readContract({
                address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
                abi: PASSPORT_AUTHORITY_ABI,
                functionName: "canRevoke",
                args: [address as `0x${string}`, stampId],
              }) as Promise<boolean>,
              publicClient.readContract({
                address: CHRONICLE_STAMP_ADDRESS as `0x${string}`,
                abi: CHRONICLE_STAMP_ABI,
                functionName: "stampRecordOf",
                args: [stampId],
              }) as Promise<StampRecordPreview>,
            ]);

            return {
              canRevoke: allowed,
              stampRecord: record,
            };
          },
          staleTime: PASSPORT_READ_CACHE_STALE_TIME,
        });

        if (latestLoadRequestRef.current !== requestId) {
          return;
        }

        setCanRevoke(context.canRevoke);
        setStampRecord(context.stampRecord);
      } catch (loadError) {
        if (latestLoadRequestRef.current !== requestId) {
          return;
        }

        clearLoadedContext();
        setError(
          normalizePassportContractError(loadError, {
            contractAddress: CHRONICLE_STAMP_ADDRESS,
            contractName: "ChronicleStamp",
            fallback: t(
              "Failed to load stamp revoke context.",
              "Failed to load stamp revoke context.",
            ),
            t,
          }),
        );
      } finally {
        if (latestLoadRequestRef.current === requestId) {
          setIsLoadingContext(false);
        }
      }
    },
    [address, clearLoadedContext, isConfigured, publicClient, queryClient, t],
  );

  useEffect(() => {
    latestLoadRequestRef.current += 1;
    setError("");
    setStatusMessage("");
    setRevokedStampId(null);

    if (!isConfigured || !address || initialStampId === null) {
      clearLoadedContext();
      return;
    }

    const cachedStampContext = queryClient.getQueryData<RevokeContext>(
      getPassportRevokeContextQueryKey(address, initialStampId),
    );

    setCanRevoke(cachedStampContext?.canRevoke ?? false);
    setStampRecord(cachedStampContext?.stampRecord ?? null);
    setIsLoadingContext(cachedStampContext === undefined);
  }, [address, clearLoadedContext, initialStampId, isConfigured, queryClient]);

  const submitRevokeStamp = useCallback(
    async (stampId: bigint, reasonCID: string) => {
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

      const normalizedReasonCID = reasonCID.trim();
      if (!normalizedReasonCID) {
        setError(t("Reason CID is required.", "Reason CID is required."));
        return;
      }

      if (!publicClient) {
        setError(t("Public client is not ready.", "Public client is not ready."));
        return;
      }

      if (!hasCorrectChain && !(await ensureSupportedChain())) {
        return;
      }

      setError("");
      setRevokedStampId(null);
      setStatusMessage(
        t(
          "Submitting stamp revocation to the chain...",
          "Submitting stamp revocation to the chain...",
        ),
      );

      try {
        const estimatedGas = await publicClient.estimateContractGas({
          account: address as `0x${string}`,
          address: CHRONICLE_STAMP_ADDRESS as `0x${string}`,
          abi: CHRONICLE_STAMP_ABI,
          functionName: "revokeStamp",
          args: [stampId, normalizedReasonCID],
        });
        const gas = estimatedGas < 21_000n ? 21_000n : estimatedGas + estimatedGas / 5n;

        await writeContractAsync({
          address: CHRONICLE_STAMP_ADDRESS as `0x${string}`,
          abi: CHRONICLE_STAMP_ABI,
          functionName: "revokeStamp",
          args: [stampId, normalizedReasonCID],
          gas,
        });
      } catch (submitError) {
        setStatusMessage("");
        setError(
          normalizePassportContractError(submitError, {
            contractAddress: CHRONICLE_STAMP_ADDRESS,
            contractName: "ChronicleStamp",
            fallback: t(
              "Failed to submit stamp revocation transaction.",
              "Failed to submit stamp revocation transaction.",
            ),
            t,
          }),
        );
      }
    },
    [
      address,
      ensureSupportedChain,
      hasCorrectChain,
      isConfigured,
      isConnected,
      publicClient,
      t,
      writeContractAsync,
    ],
  );

  useEffect(() => {
    if (!isConfirmed || !receipt) {
      return;
    }

    let parsedStampId: bigint | null = null;

    for (const log of receipt.logs) {
      try {
        const decoded = decodeEventLog({
          abi: CHRONICLE_STAMP_ABI,
          data: log.data,
          topics: log.topics,
        });

        if (decoded.eventName === "StampRevoked") {
          parsedStampId = decoded.args.stampId as bigint;
          break;
        }
      } catch {
        // Ignore unrelated logs.
      }
    }

    if (address && parsedStampId !== null) {
      const queryKey = getPassportRevokeContextQueryKey(address, parsedStampId);

      queryClient.setQueryData<RevokeContext>(queryKey, (cachedStampContext) => {
        if (!cachedStampContext?.stampRecord) {
          return cachedStampContext;
        }

        return {
          ...cachedStampContext,
          stampRecord:
            cachedStampContext.stampRecord.stampId === parsedStampId
              ? {
                  ...cachedStampContext.stampRecord,
                  revoked: true,
                }
              : cachedStampContext.stampRecord,
        };
      });
    }

    setRevokedStampId(parsedStampId);
    setStampRecord((currentRecord) =>
      currentRecord && parsedStampId !== null && currentRecord.stampId === parsedStampId
        ? {
            ...currentRecord,
            revoked: true,
          }
        : currentRecord,
    );
    setStatusMessage(
      parsedStampId !== null
        ? t(
            `Stamp #${parsedStampId.toString()} was revoked on-chain.`,
            `Stamp #${parsedStampId.toString()} was revoked on-chain.`,
          )
        : t("Stamp revocation was confirmed on-chain.", "Stamp revocation was confirmed on-chain."),
    );
  }, [address, isConfirmed, queryClient, receipt, t]);

  useEffect(() => {
    if (!isTxError || !txError) {
      return;
    }

    setStatusMessage("");
    setError(
      normalizePassportContractError(txError, {
        contractAddress: CHRONICLE_STAMP_ADDRESS,
        contractName: "ChronicleStamp",
        fallback: t(
          "Failed to submit stamp revocation transaction.",
          "Failed to submit stamp revocation transaction.",
        ),
        t,
      }),
    );
  }, [isTxError, t, txError]);

  return {
    canRevoke,
    error,
    isConfigured,
    isLoadingContext,
    isSubmitting,
    loadContext,
    revokedStampId,
    stampRecord,
    statusMessage,
    submitRevokeStamp,
  };
}



