import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
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

  const { writeContractAsync, data: txHash, isPending } = useWriteContract();
  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isTxError,
    error: txError,
  } = useWaitForTransactionReceipt({ hash: txHash });

  const isSubmitting = isPending || isConfirming;

  const loadContext = useCallback(
    async (stampId: bigint) => {
      if (!isConfigured || !address) {
        setCanRevoke(false);
        setStampRecord(null);
        setIsLoadingContext(false);
        return;
      }

      if (!publicClient) {
        return;
      }

      const queryKey = getPassportRevokeContextQueryKey(address, stampId);
      const cachedStampContext = queryClient.getQueryData<RevokeContext>(queryKey);

      if (cachedStampContext !== undefined) {
        setCanRevoke(cachedStampContext.canRevoke);
        setStampRecord(cachedStampContext.stampRecord);
        setIsLoadingContext(false);
      } else {
        setIsLoadingContext(true);
      }

      setError("");

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

        setCanRevoke(context.canRevoke);
        setStampRecord(context.stampRecord);
      } catch (loadError) {
        setCanRevoke(false);
        setStampRecord(null);
        setError(
          loadError instanceof Error
            ? loadError.message
            : t("鍔犺浇鍗扮珷鎾ら攢涓婁笅鏂囧け璐ャ€?, "Failed to load stamp revoke context."),
        );
      } finally {
        setIsLoadingContext(false);
      }
    },
    [address, isConfigured, publicClient, queryClient, t],
  );

  useEffect(() => {
    if (!isConfigured || !address || initialStampId === null) {
      setCanRevoke(false);
      setStampRecord(null);
      setIsLoadingContext(false);
      return;
    }

    const cachedStampContext = queryClient.getQueryData<RevokeContext>(
      getPassportRevokeContextQueryKey(address, initialStampId),
    );

    setCanRevoke(cachedStampContext?.canRevoke ?? false);
    setStampRecord(cachedStampContext?.stampRecord ?? null);
    setIsLoadingContext(cachedStampContext === undefined);
  }, [address, initialStampId, isConfigured, queryClient]);

  const submitRevokeStamp = useCallback(
    async (stampId: bigint, reasonCID: string) => {
      if (!isConnected) {
        setError(t("璇峰厛杩炴帴閽卞寘鍐嶆彁浜ゃ€?, "Connect a wallet before submitting."));
        return;
      }

      if (!isConfigured) {
        setError(t("璧勪骇鎶ょ収鍚堢害灏氭湭閰嶇疆銆?, "Passport contracts are not configured."));
        return;
      }

      if (!reasonCID.trim()) {
        setError(t("蹇呴』濉啓鍘熷洜 CID銆?, "Reason CID is required."));
        return;
      }

      if (!hasCorrectChain && !(await ensureSupportedChain())) {
        return;
      }

      setError("");
      setRevokedStampId(null);
      setStatusMessage(t("姝ｅ湪鎻愪氦鍗扮珷鎾ら攢浜ゆ槗...", "Submitting stamp revocation transaction..."));

      try {
        await writeContractAsync({
          address: CHRONICLE_STAMP_ADDRESS as `0x${string}`,
          abi: CHRONICLE_STAMP_ABI,
          functionName: "revokeStamp",
          args: [stampId, reasonCID.trim()],
        });
      } catch (submitError) {
        setStatusMessage("");
        setError(
          submitError instanceof Error
            ? submitError.message
            : t("鎻愪氦鍗扮珷鎾ら攢浜ゆ槗澶辫触銆?, "Failed to submit stamp revocation transaction."),
        );
      }
    },
    [ensureSupportedChain, hasCorrectChain, isConfigured, isConnected, writeContractAsync],
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

    setRevokedStampId(parsedStampId);
    setStatusMessage(
      parsedStampId !== null
        ? t(`鍗扮珷 #${parsedStampId.toString()} 鎾ら攢鎴愬姛銆俙, `Stamp #${parsedStampId.toString()} revoked successfully.`)
        : t("鍗扮珷鎾ら攢浜ゆ槗宸茬‘璁ゃ€?, "Stamp revocation confirmed."),
    );
  }, [isConfirmed, receipt]);

  useEffect(() => {
    if (!isTxError || !txError) {
      return;
    }

    setStatusMessage("");
    setError(txError.message);
  }, [isTxError, txError]);

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


