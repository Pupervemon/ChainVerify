import { useCallback, useEffect, useState } from "react";
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

type UsePassportStampTypeAdminOptions = {
  address?: string;
  ensureSupportedChain: () => Promise<boolean>;
  hasCorrectChain: boolean;
  isConnected: boolean;
};

type StampTypeConfig = {
  active: boolean;
  code: string;
  name: string;
  schemaCID: string;
  singleton: boolean;
};

type AvailableStampType = StampTypeConfig & {
  stampTypeId: bigint;
};

type UsePassportStampTypeAdminResult = {
  availableStampTypes: AvailableStampType[];
  canManageStampType: boolean;
  chronicleOwner: string;
  currentConfig: StampTypeConfig | null;
  error: string;
  isConfigured: boolean;
  isLoadingAvailableStampTypes: boolean;
  isLoadingChronicleOwner: boolean;
  isLoadingStampType: boolean;
  isSubmitting: boolean;
  isStampTypeAdmin: boolean;
  loadAvailableStampTypes: () => Promise<void>;
  loadStampTypeContext: (stampTypeId: bigint) => Promise<void>;
  statusMessage: string;
  submitConfigureStampType: (stampTypeId: bigint, config: StampTypeConfig) => Promise<void>;
};

export function usePassportStampTypeAdmin(
  options: UsePassportStampTypeAdminOptions,
): UsePassportStampTypeAdminResult {
  const { t } = usePassportLocale();
  const { address, ensureSupportedChain, hasCorrectChain, isConnected } = options;
  const publicClient = usePublicClient();
  const isConfigured = arePassportContractsConfigured();
  const [availableStampTypes, setAvailableStampTypes] = useState<AvailableStampType[]>([]);
  const [chronicleOwner, setChronicleOwner] = useState("");
  const [currentConfig, setCurrentConfig] = useState<StampTypeConfig | null>(null);
  const [error, setError] = useState("");
  const [isLoadingAvailableStampTypes, setIsLoadingAvailableStampTypes] = useState(false);
  const [isLoadingChronicleOwner, setIsLoadingChronicleOwner] = useState(false);
  const [isLoadingStampType, setIsLoadingStampType] = useState(false);
  const [isStampTypeAdmin, setIsStampTypeAdmin] = useState(false);
  const [lastConfiguredStampTypeId, setLastConfiguredStampTypeId] = useState<bigint | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const { writeContractAsync, data: txHash, isPending } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isTxError,
    error: txError,
  } = useWaitForTransactionReceipt({ hash: txHash });

  const isSubmitting = isPending || isConfirming;
  const isChronicleOwner =
    Boolean(address) &&
    Boolean(chronicleOwner) &&
    address.toLowerCase() === chronicleOwner.toLowerCase();
  const canManageStampType = isChronicleOwner || isStampTypeAdmin;

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
          fallback: t("加载已配置印章类型失败。", "Failed to load configured stamp types."),
          t,
        }),
      );
    } finally {
      setIsLoadingAvailableStampTypes(false);
    }
  }, [isConfigured, publicClient, t]);

  const loadChronicleOwner = useCallback(async () => {
    if (!publicClient || !isConfigured) {
      setChronicleOwner("");
      return;
    }

    setIsLoadingChronicleOwner(true);
    setError("");

    try {
      const owner = (await publicClient.readContract({
        address: CHRONICLE_STAMP_ADDRESS as `0x${string}`,
        abi: CHRONICLE_STAMP_ABI,
        functionName: "owner",
      })) as string;

      setChronicleOwner(owner);
    } catch (loadError) {
      setChronicleOwner("");
      setError(
        normalizePassportContractError(loadError, {
          contractAddress: CHRONICLE_STAMP_ADDRESS,
          contractName: "ChronicleStamp",
          fallback: t("加载 ChronicleStamp owner 失败。", "Failed to load ChronicleStamp owner."),
          t,
        }),
      );
    } finally {
      setIsLoadingChronicleOwner(false);
    }
  }, [isConfigured, publicClient, t]);

  const loadStampTypeContext = useCallback(
    async (stampTypeId: bigint) => {
      if (!publicClient || !isConfigured) {
        setCurrentConfig(null);
        setIsStampTypeAdmin(false);
        return;
      }

      setIsLoadingStampType(true);
      setError("");

      try {
        const [config, adminFlag] = await Promise.all([
          publicClient.readContract({
            address: CHRONICLE_STAMP_ADDRESS as `0x${string}`,
            abi: CHRONICLE_STAMP_ABI,
            functionName: "stampTypeOf",
            args: [stampTypeId],
          }) as Promise<StampTypeConfig>,
          address
            ? (publicClient.readContract({
                address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
                abi: PASSPORT_AUTHORITY_ABI,
                functionName: "isStampTypeAdmin",
                args: [stampTypeId, address as `0x${string}`],
              }) as Promise<boolean>)
            : Promise.resolve(false),
        ]);

        setCurrentConfig(config);
        setIsStampTypeAdmin(adminFlag);
      } catch (loadError) {
        setCurrentConfig(null);
        setIsStampTypeAdmin(false);
        setError(
          normalizePassportContractError(loadError, {
            contractAddress: CHRONICLE_STAMP_ADDRESS,
            contractName: "ChronicleStamp",
            fallback: t("加载印章类型上下文失败。", "Failed to load stamp type context."),
            t,
          }),
        );
      } finally {
        setIsLoadingStampType(false);
      }
    },
    [address, isConfigured, publicClient, t],
  );

  const submitConfigureStampType = useCallback(
    async (stampTypeId: bigint, config: StampTypeConfig) => {
      if (!isConnected) {
        setError(t("请先连接钱包再提交。", "Connect a wallet before submitting."));
        return;
      }

      if (!isConfigured) {
        setError(t("资产护照合约尚未配置。", "Passport contracts are not configured."));
        return;
      }

      if (!config.code.trim() || !config.name.trim()) {
        setError(t("印章类型编码和名称不能为空。", "Stamp type code and name are required."));
        return;
      }

      if (!hasCorrectChain && !(await ensureSupportedChain())) {
        return;
      }

      setError("");
      setStatusMessage(t("正在提交印章类型配置交易...", "Submitting stamp type configuration transaction..."));
      setLastConfiguredStampTypeId(stampTypeId);

      try {
        await writeContractAsync({
          address: CHRONICLE_STAMP_ADDRESS as `0x${string}`,
          abi: CHRONICLE_STAMP_ABI,
          functionName: "configureStampType",
          args: [
            stampTypeId,
            {
              code: config.code.trim(),
              name: config.name.trim(),
              schemaCID: config.schemaCID.trim(),
              active: config.active,
              singleton: config.singleton,
            },
          ],
        });
      } catch (submitError) {
        setStatusMessage("");
        setError(
          submitError instanceof Error
            ? submitError.message
            : t(
                "提交印章类型配置交易失败。",
                "Failed to submit stamp type configuration transaction.",
              ),
        );
      }
    },
    [ensureSupportedChain, hasCorrectChain, isConfigured, isConnected, writeContractAsync],
  );

  useEffect(() => {
    void loadChronicleOwner();
  }, [loadChronicleOwner]);

  useEffect(() => {
    void loadAvailableStampTypes();
  }, [loadAvailableStampTypes]);

  useEffect(() => {
    if (!isConfirmed || lastConfiguredStampTypeId === null) {
      return;
    }

    setStatusMessage(
      t(
        `印章类型 #${lastConfiguredStampTypeId.toString()} 配置成功。`,
        `Stamp type #${lastConfiguredStampTypeId.toString()} configured successfully.`,
      ),
    );
    void loadAvailableStampTypes();
    void loadStampTypeContext(lastConfiguredStampTypeId);
  }, [isConfirmed, lastConfiguredStampTypeId, loadAvailableStampTypes, loadStampTypeContext, t]);

  useEffect(() => {
    if (!isTxError || !txError) {
      return;
    }

    setStatusMessage("");
    setError(txError.message);
  }, [isTxError, txError]);

  return {
    availableStampTypes,
    canManageStampType,
    chronicleOwner,
    currentConfig,
    error,
    isConfigured,
    isLoadingAvailableStampTypes,
    isLoadingChronicleOwner,
    isLoadingStampType,
    isSubmitting,
    isStampTypeAdmin,
    loadAvailableStampTypes,
    loadStampTypeContext,
    statusMessage,
    submitConfigureStampType,
  };
}
