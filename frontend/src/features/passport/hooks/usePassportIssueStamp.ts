import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { decodeEventLog } from "viem";
import { usePublicClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import { TARGET_CHAIN_ID } from "../../../config/network";
import {
  ASSET_PASSPORT_ABI,
  ASSET_PASSPORT_ADDRESS,
  arePassportContractsConfigured,
  CHRONICLE_STAMP_ABI,
  CHRONICLE_STAMP_ADDRESS,
  PASSPORT_AUTHORITY_ABI,
  PASSPORT_AUTHORITY_ADDRESS,
} from "../../../config/passport";
import { usePassportLocale } from "../i18n";
import { normalizePassportContractError } from "../utils/contractErrors";
import {
  getPassportIssueContextQueryKey,
  PASSPORT_READ_CACHE_STALE_TIME,
} from "../utils/passportReadCache";

type UsePassportIssueStampOptions = {
  address?: string;
  ensureSupportedChain: () => Promise<boolean>;
  hasCorrectChain: boolean;
  initialPassportId?: bigint | null;
  initialStampTypeId?: bigint | null;
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

type IssuePermissionContext = {
  canIssue: boolean;
  latestEffectiveStampId: bigint | null;
  passportExists: boolean;
  passportStatus: bigint | number | null;
  stampType: StampTypePreview | null;
};

type AssetPassportRecordPreview = {
  status: bigint | number;
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
  passportExists: boolean | null;
  passportStatus: bigint | number | null;
  stampType: StampTypePreview | null;
  statusMessage: string;
  submitIssueStamp: (form: IssueStampForm) => Promise<void>;
};

export function usePassportIssueStamp(
  options: UsePassportIssueStampOptions,
): UsePassportIssueStampResult {
  const { t } = usePassportLocale();
  const {
    address,
    ensureSupportedChain,
    hasCorrectChain,
    initialPassportId = null,
    initialStampTypeId = null,
    isConnected,
  } = options;
  const queryClient = useQueryClient();
  const publicClient = usePublicClient({ chainId: TARGET_CHAIN_ID });
  const isConfigured = arePassportContractsConfigured();
  const cachedPermissionContext =
    address && initialPassportId !== null && initialStampTypeId !== null && isConfigured
      ? queryClient.getQueryData<IssuePermissionContext>(
          getPassportIssueContextQueryKey(address, initialPassportId, initialStampTypeId),
        )
      : undefined;
  const [availableStampTypes, setAvailableStampTypes] = useState<AvailableStampType[]>([]);
  const [canIssue, setCanIssue] = useState(cachedPermissionContext?.canIssue ?? false);
  const [error, setError] = useState("");
  const [isLoadingAvailableStampTypes, setIsLoadingAvailableStampTypes] = useState(false);
  const [isLoadingPermission, setIsLoadingPermission] = useState(
    () =>
      Boolean(address) &&
      isConfigured &&
      initialPassportId !== null &&
      initialStampTypeId !== null &&
      cachedPermissionContext === undefined,
  );
  const [issuedStampId, setIssuedStampId] = useState<bigint | null>(null);
  const [latestEffectiveStampId, setLatestEffectiveStampId] = useState<bigint | null>(
    cachedPermissionContext?.latestEffectiveStampId ?? null,
  );
  const [passportExists, setPassportExists] = useState<boolean | null>(
    cachedPermissionContext?.passportExists ?? null,
  );
  const [passportStatus, setPassportStatus] = useState<bigint | number | null>(
    cachedPermissionContext?.passportStatus ?? null,
  );
  const [stampType, setStampType] = useState<StampTypePreview | null>(
    cachedPermissionContext?.stampType ?? null,
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
          fallback: t(
            "Failed to load configured stamp types.",
            "Failed to load configured stamp types.",
          ),
          t,
        }),
      );
    } finally {
      setIsLoadingAvailableStampTypes(false);
    }
  }, [isConfigured, publicClient, t]);

  const loadPermission = useCallback(
    async (passportId: bigint, stampTypeId: bigint) => {
      if (!isConfigured || !address) {
        setCanIssue(false);
        setPassportExists(null);
        setPassportStatus(null);
        setStampType(null);
        setLatestEffectiveStampId(null);
        setIsLoadingPermission(false);
        return;
      }

      if (!publicClient) {
        return;
      }

      const queryKey = getPassportIssueContextQueryKey(address, passportId, stampTypeId);
      const cachedContext = queryClient.getQueryData<IssuePermissionContext>(queryKey);

      if (cachedContext !== undefined) {
        setCanIssue(cachedContext.canIssue);
        setPassportExists(cachedContext.passportExists);
        setPassportStatus(cachedContext.passportStatus);
        setStampType(cachedContext.stampType);
        setLatestEffectiveStampId(cachedContext.latestEffectiveStampId);
        setIsLoadingPermission(false);
      } else {
        setIsLoadingPermission(true);
      }

      setError("");

      try {
        const context = await queryClient.fetchQuery({
          queryKey,
          queryFn: async () => {
            const [allowed, passportExistsResult, typeRecord, latestId] = await Promise.all([
              publicClient.readContract({
                address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
                abi: PASSPORT_AUTHORITY_ABI,
                functionName: "canIssue",
                args: [address as `0x${string}`, stampTypeId, passportId],
              }) as Promise<boolean>,
              publicClient.readContract({
                address: ASSET_PASSPORT_ADDRESS as `0x${string}`,
                abi: ASSET_PASSPORT_ABI,
                functionName: "exists",
                args: [passportId],
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

            const passportRecord = passportExistsResult
              ? ((await publicClient.readContract({
                  address: ASSET_PASSPORT_ADDRESS as `0x${string}`,
                  abi: ASSET_PASSPORT_ABI,
                  functionName: "recordOf",
                  args: [passportId],
                })) as AssetPassportRecordPreview)
              : null;

            return {
              canIssue: allowed,
              latestEffectiveStampId: latestId === 0n ? null : latestId,
              passportExists: passportExistsResult,
              passportStatus: passportRecord?.status ?? null,
              stampType: typeRecord,
            };
          },
          staleTime: PASSPORT_READ_CACHE_STALE_TIME,
        });

        setCanIssue(context.canIssue);
        setPassportExists(context.passportExists);
        setPassportStatus(context.passportStatus);
        setStampType(context.stampType);
        setLatestEffectiveStampId(context.latestEffectiveStampId);
      } catch (loadError) {
        setCanIssue(false);
        setPassportExists(null);
        setPassportStatus(null);
        setStampType(null);
        setLatestEffectiveStampId(null);
        setError(
          normalizePassportContractError(loadError, {
            contractAddress: CHRONICLE_STAMP_ADDRESS,
            contractName: "ChronicleStamp",
            fallback: t(
              "Failed to load stamp issue context.",
              "Failed to load stamp issue context.",
            ),
            t,
          }),
        );
      } finally {
        setIsLoadingPermission(false);
      }
    },
    [address, isConfigured, publicClient, queryClient, t],
  );

  useEffect(() => {
    if (!isConfigured || !address || initialPassportId === null || initialStampTypeId === null) {
      setCanIssue(false);
      setPassportExists(null);
      setPassportStatus(null);
      setStampType(null);
      setLatestEffectiveStampId(null);
      setIsLoadingPermission(false);
      return;
    }

    const cachedContext = queryClient.getQueryData<IssuePermissionContext>(
      getPassportIssueContextQueryKey(address, initialPassportId, initialStampTypeId),
    );

    setCanIssue(cachedContext?.canIssue ?? false);
    setPassportExists(cachedContext?.passportExists ?? null);
    setPassportStatus(cachedContext?.passportStatus ?? null);
    setStampType(cachedContext?.stampType ?? null);
    setLatestEffectiveStampId(cachedContext?.latestEffectiveStampId ?? null);
    setIsLoadingPermission(cachedContext === undefined);
  }, [address, initialPassportId, initialStampTypeId, isConfigured, queryClient]);

  useEffect(() => {
    void loadAvailableStampTypes();
  }, [loadAvailableStampTypes]);

  const submitIssueStamp = useCallback(
    async (form: IssueStampForm) => {
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

      if (!form.metadataCID.trim()) {
        setError(t("Metadata CID is required.", "Metadata CID is required."));
        return;
      }

      if (form.occurredAt <= 0) {
        setError(t("Occurred time must be valid.", "Occurred time must be valid."));
        return;
      }

      if (!hasCorrectChain && !(await ensureSupportedChain())) {
        return;
      }

      setError("");
      setIssuedStampId(null);
      setStatusMessage(
        t(
          "Submitting stamp issuance to the chain...",
          "Submitting stamp issuance to the chain...",
        ),
      );

      try {
        if (!publicClient) {
          setStatusMessage("");
          setError(t("Public client is not ready.", "Public client is not ready."));
          return;
        }

        const estimatedGas = await publicClient.estimateContractGas({
          account: address as `0x${string}`,
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

        const gas = estimatedGas < 21_000n ? 21_000n : estimatedGas + estimatedGas / 5n;

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
          gas,
        });
      } catch (submitError) {
        setStatusMessage("");
        setError(
          normalizePassportContractError(submitError, {
            contractAddress: CHRONICLE_STAMP_ADDRESS,
            contractName: "ChronicleStamp",
            fallback: t(
              "Failed to submit stamp issuance transaction.",
              "Failed to submit stamp issuance transaction.",
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
        ? t(
            `Stamp #${parsedStampId.toString()} was issued on-chain.`,
            `Stamp #${parsedStampId.toString()} was issued on-chain.`,
          )
        : t("Stamp issuance was confirmed on-chain.", "Stamp issuance was confirmed on-chain."),
    );
  }, [isConfirmed, receipt, t]);

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
    passportExists,
    passportStatus,
    stampType,
    statusMessage,
    submitIssueStamp,
  };
}
