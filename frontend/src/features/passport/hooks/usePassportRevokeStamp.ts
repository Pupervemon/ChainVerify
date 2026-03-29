import { useCallback, useEffect, useState } from "react";
import { decodeEventLog } from "viem";
import { usePublicClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import {
  arePassportContractsConfigured,
  CHRONICLE_STAMP_ABI,
  CHRONICLE_STAMP_ADDRESS,
  PASSPORT_AUTHORITY_ABI,
  PASSPORT_AUTHORITY_ADDRESS,
} from "../../../config/passport";
import { usePassportLocale } from "../i18n";

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
  isConnected: boolean;
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
  const { address, ensureSupportedChain, hasCorrectChain, isConnected } = options;
  const publicClient = usePublicClient();
  const isConfigured = arePassportContractsConfigured();
  const [canRevoke, setCanRevoke] = useState(false);
  const [error, setError] = useState("");
  const [isLoadingContext, setIsLoadingContext] = useState(false);
  const [revokedStampId, setRevokedStampId] = useState<bigint | null>(null);
  const [stampRecord, setStampRecord] = useState<StampRecordPreview | null>(null);
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
      if (!publicClient || !isConfigured || !address) {
        setCanRevoke(false);
        setStampRecord(null);
        return;
      }

      setIsLoadingContext(true);
      setError("");

      try {
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

        setCanRevoke(allowed);
        setStampRecord(record);
      } catch (loadError) {
        setCanRevoke(false);
        setStampRecord(null);
        setError(
          loadError instanceof Error
            ? loadError.message
            : t("加载印章撤销上下文失败。", "Failed to load stamp revoke context."),
        );
      } finally {
        setIsLoadingContext(false);
      }
    },
    [address, isConfigured, publicClient],
  );

  const submitRevokeStamp = useCallback(
    async (stampId: bigint, reasonCID: string) => {
      if (!isConnected) {
        setError(t("请先连接钱包再提交。", "Connect a wallet before submitting."));
        return;
      }

      if (!isConfigured) {
        setError(t("资产护照合约尚未配置。", "Passport contracts are not configured."));
        return;
      }

      if (!reasonCID.trim()) {
        setError(t("必须填写原因 CID。", "Reason CID is required."));
        return;
      }

      if (!hasCorrectChain && !(await ensureSupportedChain())) {
        return;
      }

      setError("");
      setRevokedStampId(null);
      setStatusMessage(t("正在提交印章撤销交易...", "Submitting stamp revocation transaction..."));

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
            : t("提交印章撤销交易失败。", "Failed to submit stamp revocation transaction."),
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
        ? t(`印章 #${parsedStampId.toString()} 撤销成功。`, `Stamp #${parsedStampId.toString()} revoked successfully.`)
        : t("印章撤销交易已确认。", "Stamp revocation confirmed."),
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
