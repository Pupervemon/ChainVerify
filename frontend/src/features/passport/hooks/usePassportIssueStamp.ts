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
import { normalizePassportContractError } from "../utils/contractErrors";

type UsePassportIssueStampOptions = {
  address?: string;
  ensureSupportedChain: () => Promise<boolean>;
  hasCorrectChain: boolean;
  isConnected: boolean;
};

type StampTypePreview = {
  active: boolean;
  code: string;
  name: string;
  schemaCID: string;
  singleton: boolean;
};

type AvailableStampType = StampTypePreview & {
  stampTypeId: bigint;
};

type IssueStampForm = {
  metadataCID: string;
  occurredAt: number;
  passportId: bigint;
  stampTypeId: bigint;
  supersedesStampId: bigint;
};

type UsePassportIssueStampResult = {
  availableStampTypes: AvailableStampType[];
  canIssue: boolean;
  error: string;
  isConfigured: boolean;
  isLoadingAvailableStampTypes: boolean;
  isLoadingPermission: boolean;
  isSubmitting: boolean;
  issuedStampId: bigint | null;
  latestEffectiveStampId: bigint | null;
  loadAvailableStampTypes: () => Promise<void>;
  loadPermission: (passportId: bigint, stampTypeId: bigint) => Promise<void>;
  stampType: StampTypePreview | null;
  statusMessage: string;
  submitIssueStamp: (form: IssueStampForm) => Promise<void>;
};

export function usePassportIssueStamp(
  options: UsePassportIssueStampOptions,
): UsePassportIssueStampResult {
  const { t } = usePassportLocale();
  const { address, ensureSupportedChain, hasCorrectChain, isConnected } = options;
  const publicClient = usePublicClient();
  const isConfigured = arePassportContractsConfigured();
  const [availableStampTypes, setAvailableStampTypes] = useState<AvailableStampType[]>([]);
  const [canIssue, setCanIssue] = useState(false);
  const [error, setError] = useState("");
  const [isLoadingAvailableStampTypes, setIsLoadingAvailableStampTypes] = useState(false);
  const [isLoadingPermission, setIsLoadingPermission] = useState(false);
  const [issuedStampId, setIssuedStampId] = useState<bigint | null>(null);
  const [latestEffectiveStampId, setLatestEffectiveStampId] = useState<bigint | null>(null);
  const [stampType, setStampType] = useState<StampTypePreview | null>(null);
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

  const loadAvailableStampTypes = useCallback(async () => {
    if (!publicClient || !isConfigured) {
      setAvailableStampTypes([]);
      return;
    }

    setIsLoadingAvailableStampTypes(true);
    setError("");

    try {
      const logs = await publicClient.getContractEvents({
        address: CHRONICLE_STAMP_ADDRESS as `0x${string}`,
        abi: CHRONICLE_STAMP_ABI,
        eventName: "StampTypeConfigured",
        fromBlock: 0n,
        toBlock: "latest",
      });

      const latestById = new Map<bigint, AvailableStampType>();

      for (const log of logs) {
        const args = log.args as {
          active?: boolean;
          code?: string;
          name?: string;
          schemaCID?: string;
          singleton?: boolean;
          stampTypeId?: bigint;
        };

        if (args.stampTypeId === undefined) {
          continue;
        }

        latestById.set(args.stampTypeId, {
          active: args.active ?? false,
          code: args.code ?? "",
          name: args.name ?? "",
          schemaCID: args.schemaCID ?? "",
          singleton: args.singleton ?? false,
          stampTypeId: args.stampTypeId,
        });
      }

      setAvailableStampTypes(
        Array.from(latestById.values()).sort((left, right) =>
          left.stampTypeId < right.stampTypeId ? -1 : 1,
        ),
      );
    } catch (loadError) {
      setAvailableStampTypes([]);
      setError(
        normalizePassportContractError(loadError, {
          contractAddress: CHRONICLE_STAMP_ADDRESS,
          contractName: "ChronicleStamp",
          fallback: t("加载印章类型列表失败。", "Failed to load configured stamp types."),
          t,
        }),
      );
    } finally {
      setIsLoadingAvailableStampTypes(false);
    }
  }, [isConfigured, publicClient, t]);

  const loadPermission = useCallback(
    async (passportId: bigint, stampTypeId: bigint) => {
      if (!publicClient || !isConfigured || !address) {
        setCanIssue(false);
        setStampType(null);
        setLatestEffectiveStampId(null);
        return;
      }

      setIsLoadingPermission(true);
      setError("");

      try {
        const [allowed, typeRecord, latestId] = await Promise.all([
          publicClient.readContract({
            address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
            abi: PASSPORT_AUTHORITY_ABI,
            functionName: "canIssue",
            args: [address as `0x${string}`, stampTypeId, passportId],
          }) as Promise<boolean>,
          publicClient.readContract({
            address: CHRONICLE_STAMP_ADDRESS as `0x${string}`,
            abi: CHRONICLE_STAMP_ABI,
            functionName: "stampTypeOf",
            args: [stampTypeId],
          }) as Promise<StampTypePreview>,
          publicClient.readContract({
            address: CHRONICLE_STAMP_ADDRESS as `0x${string}`,
            abi: CHRONICLE_STAMP_ABI,
            functionName: "latestEffectiveStampId",
            args: [passportId, stampTypeId],
          }) as Promise<bigint>,
        ]);

        setCanIssue(allowed);
        setStampType(typeRecord);
        setLatestEffectiveStampId(latestId === 0n ? null : latestId);
      } catch (loadError) {
        setCanIssue(false);
        setStampType(null);
        setLatestEffectiveStampId(null);
        setError(
          normalizePassportContractError(loadError, {
            contractAddress: CHRONICLE_STAMP_ADDRESS,
            contractName: "ChronicleStamp",
            fallback: t("加载印章签发上下文失败。", "Failed to load stamp issue context."),
            t,
          }),
        );
      } finally {
        setIsLoadingPermission(false);
      }
    },
    [address, isConfigured, publicClient, t],
  );

  useEffect(() => {
    void loadAvailableStampTypes();
  }, [loadAvailableStampTypes]);

  const submitIssueStamp = useCallback(
    async (form: IssueStampForm) => {
      if (!isConnected) {
        setError(t("请先连接钱包再提交。", "Connect a wallet before submitting."));
        return;
      }

      if (!isConfigured) {
        setError(t("资产护照合约尚未配置。", "Passport contracts are not configured."));
        return;
      }

      if (!form.metadataCID.trim()) {
        setError(t("必须填写元数据 CID。", "Metadata CID is required."));
        return;
      }

      if (form.occurredAt <= 0) {
        setError(t("发生时间无效。", "Occurred time must be valid."));
        return;
      }

      if (!hasCorrectChain && !(await ensureSupportedChain())) {
        return;
      }

      setError("");
      setIssuedStampId(null);
      setStatusMessage(t("正在提交印章签发交易...", "Submitting stamp issuance transaction..."));

      try {
        await writeContractAsync({
          address: CHRONICLE_STAMP_ADDRESS as `0x${string}`,
          abi: CHRONICLE_STAMP_ABI,
          functionName: "issueStamp",
          args: [
            form.passportId,
            form.stampTypeId,
            BigInt(form.occurredAt),
            form.metadataCID.trim(),
            form.supersedesStampId,
          ],
        });
      } catch (submitError) {
        setStatusMessage("");
        setError(
          submitError instanceof Error
            ? submitError.message
            : t("提交印章签发交易失败。", "Failed to submit stamp issuance transaction."),
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

        if (decoded.eventName === "StampIssued") {
          parsedStampId = decoded.args.stampId as bigint;
          break;
        }
      } catch {
        // Ignore unrelated logs.
      }
    }

    setIssuedStampId(parsedStampId);
    setStatusMessage(
      parsedStampId !== null
        ? t(`印章 #${parsedStampId.toString()} 签发成功。`, `Stamp #${parsedStampId.toString()} issued successfully.`)
        : t("印章签发交易已确认。", "Stamp issuance confirmed."),
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
    availableStampTypes,
    canIssue,
    error,
    isConfigured,
    isLoadingAvailableStampTypes,
    isLoadingPermission,
    isSubmitting,
    issuedStampId,
    latestEffectiveStampId,
    loadAvailableStampTypes,
    loadPermission,
    stampType,
    statusMessage,
    submitIssueStamp,
  };
}
