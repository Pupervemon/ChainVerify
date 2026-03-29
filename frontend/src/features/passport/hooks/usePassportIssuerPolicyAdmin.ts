import { useCallback, useEffect, useState } from "react";
import { usePublicClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import {
  arePassportContractsConfigured,
  isPassportAddress,
  PASSPORT_AUTHORITY_ABI,
  PASSPORT_AUTHORITY_ADDRESS,
} from "../../../config/passport";
import { usePassportLocale } from "../i18n";

export type IssuerPolicyScope = "global" | "type" | "passport";

export type IssuerPolicyRecord = {
  enabled: boolean;
  policyCID: string;
  restrictToExplicitPassportList: boolean;
  validAfter: bigint;
  validUntil: bigint;
};

type PolicyQuery = {
  issuerAddress: string;
  passportId?: bigint;
  scope: IssuerPolicyScope;
  stampTypeId?: bigint;
};

type UsePassportIssuerPolicyAdminOptions = {
  address?: string;
  ensureSupportedChain: () => Promise<boolean>;
  hasCorrectChain: boolean;
  isConnected: boolean;
};

type PendingAction =
  | {
      kind: "allowlist";
      passportId: bigint;
      value: boolean;
    }
  | {
      kind: "policy";
      query: PolicyQuery;
    }
  | null;

type UsePassportIssuerPolicyAdminResult = {
  authorityOwner: string;
  currentPolicy: IssuerPolicyRecord | null;
  error: string;
  isAuthorityOwner: boolean;
  isConfigured: boolean;
  isLoadingAuthorityOwner: boolean;
  isLoadingPolicy: boolean;
  isSubmitting: boolean;
  loadPolicyContext: (query: PolicyQuery) => Promise<void>;
  passportAllowlistMode: boolean | null;
  setIssuerPolicy: (query: PolicyQuery, policy: IssuerPolicyRecord) => Promise<void>;
  setPassportAllowlistMode: (passportId: bigint, enabled: boolean) => Promise<void>;
  statusMessage: string;
};

export function usePassportIssuerPolicyAdmin(
  options: UsePassportIssuerPolicyAdminOptions,
): UsePassportIssuerPolicyAdminResult {
  const { t } = usePassportLocale();
  const { address, ensureSupportedChain, hasCorrectChain, isConnected } = options;
  const publicClient = usePublicClient();
  const isConfigured = arePassportContractsConfigured();
  const [authorityOwner, setAuthorityOwner] = useState("");
  const [currentPolicy, setCurrentPolicy] = useState<IssuerPolicyRecord | null>(null);
  const [error, setError] = useState("");
  const [isLoadingAuthorityOwner, setIsLoadingAuthorityOwner] = useState(false);
  const [isLoadingPolicy, setIsLoadingPolicy] = useState(false);
  const [lastLoadedQuery, setLastLoadedQuery] = useState<PolicyQuery | null>(null);
  const [passportAllowlistMode, setPassportAllowlistModeState] = useState<boolean | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
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
    if (!publicClient || !isConfigured) {
      setAuthorityOwner("");
      return;
    }

    setIsLoadingAuthorityOwner(true);

    try {
      const owner = (await publicClient.readContract({
        address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
        abi: PASSPORT_AUTHORITY_ABI,
        functionName: "owner",
      })) as string;

      setAuthorityOwner(owner);
    } catch (loadError) {
      setAuthorityOwner("");
      setError(
        loadError instanceof Error
          ? loadError.message
          : t("加载 PassportAuthority owner 失败。", "Failed to load PassportAuthority owner."),
      );
    } finally {
      setIsLoadingAuthorityOwner(false);
    }
  }, [isConfigured, publicClient]);

  const loadPolicyContext = useCallback(
    async (query: PolicyQuery) => {
      if (!publicClient || !isConfigured || !isPassportAddress(query.issuerAddress)) {
        setCurrentPolicy(null);
        setPassportAllowlistModeState(null);
        return;
      }

      setIsLoadingPolicy(true);
      setError("");

      try {
        let policyPromise: Promise<IssuerPolicyRecord>;

        if (query.scope === "global") {
          policyPromise = publicClient.readContract({
            address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
            abi: PASSPORT_AUTHORITY_ABI,
            functionName: "globalIssuerPolicyOf",
            args: [query.issuerAddress as `0x${string}`],
          }) as Promise<IssuerPolicyRecord>;
        } else if (query.scope === "type") {
          policyPromise = publicClient.readContract({
            address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
            abi: PASSPORT_AUTHORITY_ABI,
            functionName: "typeIssuerPolicyOf",
            args: [query.issuerAddress as `0x${string}`, query.stampTypeId as bigint],
          }) as Promise<IssuerPolicyRecord>;
        } else {
          policyPromise = publicClient.readContract({
            address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
            abi: PASSPORT_AUTHORITY_ABI,
            functionName: "passportIssuerPolicyOf",
            args: [query.issuerAddress as `0x${string}`, query.passportId as bigint],
          }) as Promise<IssuerPolicyRecord>;
        }

        const [policy, allowlistMode] = await Promise.all([
          policyPromise,
          query.scope === "passport"
            ? (publicClient.readContract({
                address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
                abi: PASSPORT_AUTHORITY_ABI,
                functionName: "passportAllowlistMode",
                args: [query.passportId as bigint],
              }) as Promise<boolean>)
            : Promise.resolve(null),
        ]);

        setCurrentPolicy(policy);
        setPassportAllowlistModeState(allowlistMode);
        setLastLoadedQuery(query);
      } catch (loadError) {
        setCurrentPolicy(null);
        setPassportAllowlistModeState(null);
        setError(
          loadError instanceof Error
            ? loadError.message
            : t("加载发行策略上下文失败。", "Failed to load issuer policy context."),
        );
      } finally {
        setIsLoadingPolicy(false);
      }
    },
    [isConfigured, publicClient],
  );

  const setIssuerPolicy = useCallback(
    async (query: PolicyQuery, policy: IssuerPolicyRecord) => {
      if (!isConnected || !address) {
        setError(t("请先连接钱包再提交。", "Connect a wallet before submitting."));
        return;
      }

      if (!isConfigured) {
        setError(t("资产护照合约尚未配置。", "Passport contracts are not configured."));
        return;
      }

      if (!isPassportAddress(query.issuerAddress)) {
        setError(t("请输入有效的发行方地址。", "Enter a valid issuer address."));
        return;
      }

      if (!hasCorrectChain && !(await ensureSupportedChain())) {
        return;
      }

      setError("");
      setStatusMessage(t("正在提交发行策略交易...", "Submitting issuer policy transaction..."));
      setPendingAction({ kind: "policy", query });

      const policyArgs = {
        enabled: policy.enabled,
        policyCID: policy.policyCID.trim(),
        restrictToExplicitPassportList: policy.restrictToExplicitPassportList,
        validAfter: policy.validAfter,
        validUntil: policy.validUntil,
      };

      try {
        if (query.scope === "global") {
          await writeContractAsync({
            address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
            abi: PASSPORT_AUTHORITY_ABI,
            functionName: "setGlobalIssuerPolicy",
            args: [query.issuerAddress as `0x${string}`, policyArgs],
          });
        } else if (query.scope === "type") {
          await writeContractAsync({
            address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
            abi: PASSPORT_AUTHORITY_ABI,
            functionName: "setTypeIssuerPolicy",
            args: [query.issuerAddress as `0x${string}`, query.stampTypeId as bigint, policyArgs],
          });
        } else {
          await writeContractAsync({
            address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
            abi: PASSPORT_AUTHORITY_ABI,
            functionName: "setPassportIssuerPolicy",
            args: [query.issuerAddress as `0x${string}`, query.passportId as bigint, policyArgs],
          });
        }
      } catch (submitError) {
        setPendingAction(null);
        setStatusMessage("");
        setError(
          submitError instanceof Error
            ? submitError.message
            : t("提交发行策略交易失败。", "Failed to submit issuer policy transaction."),
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

  const setPassportAllowlistMode = useCallback(
    async (passportId: bigint, enabled: boolean) => {
      if (!isConnected || !address) {
        setError(t("请先连接钱包再提交。", "Connect a wallet before submitting."));
        return;
      }

      if (!isConfigured) {
        setError(t("资产护照合约尚未配置。", "Passport contracts are not configured."));
        return;
      }

      if (!hasCorrectChain && !(await ensureSupportedChain())) {
        return;
      }

      setError("");
      setStatusMessage(
        enabled
          ? t(
              "正在提交开启护照白名单模式交易...",
              "Submitting transaction to enable passport allowlist mode...",
            )
          : t(
              "正在提交关闭护照白名单模式交易...",
              "Submitting transaction to disable passport allowlist mode...",
            ),
      );
      setPendingAction({ kind: "allowlist", passportId, value: enabled });

      try {
        await writeContractAsync({
          address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
          abi: PASSPORT_AUTHORITY_ABI,
          functionName: "setPassportAllowlistMode",
          args: [passportId, enabled],
        });
      } catch (submitError) {
        setPendingAction(null);
        setStatusMessage("");
        setError(
          submitError instanceof Error
            ? submitError.message
            : t(
                "提交护照白名单模式交易失败。",
                "Failed to submit passport allowlist mode transaction.",
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
    void loadAuthorityOwner();
  }, [loadAuthorityOwner]);

  useEffect(() => {
    if (!isConfirmed || !pendingAction) {
      return;
    }

    if (pendingAction.kind === "policy") {
      const scopeLabel =
        pendingAction.query.scope === "global"
          ? t("全局", "Global")
          : pendingAction.query.scope === "type"
            ? t("类型级", "Type")
            : t("护照级", "Passport");

      setStatusMessage(
        t(`${scopeLabel} 发行策略更新成功。`, `${scopeLabel} issuer policy updated successfully.`),
      );
      void loadPolicyContext(pendingAction.query);
    } else {
      setStatusMessage(
        pendingAction.value
          ? t(
              `护照 #${pendingAction.passportId.toString()} 白名单模式已开启。`,
              `Passport #${pendingAction.passportId.toString()} allowlist mode enabled.`,
            )
          : t(
              `护照 #${pendingAction.passportId.toString()} 白名单模式已关闭。`,
              `Passport #${pendingAction.passportId.toString()} allowlist mode disabled.`,
            ),
      );

      if (
        lastLoadedQuery &&
        lastLoadedQuery.scope === "passport" &&
        lastLoadedQuery.passportId === pendingAction.passportId
      ) {
        void loadPolicyContext(lastLoadedQuery);
      }
    }

    setPendingAction(null);
  }, [isConfirmed, lastLoadedQuery, loadPolicyContext, pendingAction, t]);

  useEffect(() => {
    if (!isTxError || !txError) {
      return;
    }

    setPendingAction(null);
    setStatusMessage("");
    setError(txError.message);
  }, [isTxError, txError]);

  return {
    authorityOwner,
    currentPolicy,
    error,
    isAuthorityOwner,
    isConfigured,
    isLoadingAuthorityOwner,
    isLoadingPolicy,
    isSubmitting,
    loadPolicyContext,
    passportAllowlistMode,
    setIssuerPolicy,
    setPassportAllowlistMode,
    statusMessage,
  };
}
