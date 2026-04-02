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
  lastConfirmedTxHash: string;
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
  const queryClient = useQueryClient();
  const publicClient = usePublicClient({ chainId: TARGET_CHAIN_ID });
  const isConfigured = arePassportContractsConfigured();
  const cachedAuthorityOwner = isConfigured
    ? queryClient.getQueryData<string>(getPassportAuthorityOwnerQueryKey())
    : undefined;
  const [authorityOwner, setAuthorityOwner] = useState(cachedAuthorityOwner ?? "");
  const [currentPolicy, setCurrentPolicy] = useState<IssuerPolicyRecord | null>(null);
  const [error, setError] = useState("");
  const [isLoadingAuthorityOwner, setIsLoadingAuthorityOwner] = useState(
    () => isConfigured && cachedAuthorityOwner === undefined,
  );
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
            : t("鍔犺浇鍙戠珷鎺堟潈涓婁笅鏂囧け璐ャ€?, "Failed to load issuer authorization context."),
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
        setError(t("璇峰厛杩炴帴閽卞寘鍐嶆彁浜ゃ€?, "Connect a wallet before submitting."));
        return;
      }

      if (!isConfigured) {
        setError(t("璧勪骇鎶ょ収鍚堢害灏氭湭閰嶇疆銆?, "Passport contracts are not configured."));
        return;
      }

      if (!isPassportAddress(query.issuerAddress)) {
        setError(t("璇疯緭鍏ユ湁鏁堢殑鍙戣鏂瑰湴鍧€銆?, "Enter a valid issuer address."));
        return;
      }

      if (!hasCorrectChain && !(await ensureSupportedChain())) {
        return;
      }

      setError("");
      setStatusMessage(t("姝ｅ湪鎻愪氦鍙戠珷鎺堟潈浜ゆ槗...", "Submitting issuer authorization transaction..."));
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
            : t("鎻愪氦鍙戠珷鎺堟潈浜ゆ槗澶辫触銆?, "Failed to submit issuer authorization transaction."),
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
        setError(t("璇峰厛杩炴帴閽卞寘鍐嶆彁浜ゃ€?, "Connect a wallet before submitting."));
        return;
      }

      if (!isConfigured) {
        setError(t("璧勪骇鎶ょ収鍚堢害灏氭湭閰嶇疆銆?, "Passport contracts are not configured."));
        return;
      }

      if (!hasCorrectChain && !(await ensureSupportedChain())) {
        return;
      }

      setError("");
      setStatusMessage(
        enabled
          ? t(
              "姝ｅ湪鎻愪氦寮€鍚?Passport 鐧藉悕鍗曞己鍒舵ā寮忎氦鏄?..",
              "Submitting transaction to enable passport allowlist enforcement...",
            )
          : t(
              "姝ｅ湪鎻愪氦鍏抽棴 Passport 鐧藉悕鍗曞己鍒舵ā寮忎氦鏄?..",
              "Submitting transaction to disable passport allowlist enforcement...",
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
                "鎻愪氦 Passport 鐧藉悕鍗曞己鍒舵ā寮忎氦鏄撳け璐ャ€?,
                "Failed to submit passport allowlist enforcement transaction.",
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
    if (!isConfirmed || !pendingAction) {
      return;
    }

    if (pendingAction.kind === "policy") {
      const scopeLabel =
        pendingAction.query.scope === "global"
          ? t("鍏ㄥ眬", "Global")
          : pendingAction.query.scope === "type"
            ? t("绫诲瀷绾?, "Type")
            : t("鎶ょ収绾?, "Passport");

      setStatusMessage(
        t(`${scopeLabel} 鍙戠珷鎺堟潈鏇存柊鎴愬姛銆俙, `${scopeLabel} issuer authorization updated successfully.`),
      );
      void loadPolicyContext(pendingAction.query);
    } else {
      setStatusMessage(
        pendingAction.value
          ? t(
              `Passport #${pendingAction.passportId.toString()} 鐧藉悕鍗曞己鍒舵ā寮忓凡寮€鍚€俙,
              `Passport #${pendingAction.passportId.toString()} allowlist enforcement enabled.`,
            )
          : t(
              `Passport #${pendingAction.passportId.toString()} 鐧藉悕鍗曞己鍒舵ā寮忓凡鍏抽棴銆俙,
              `Passport #${pendingAction.passportId.toString()} allowlist enforcement disabled.`,
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
    lastConfirmedTxHash: isConfirmed && txHash ? txHash : "",
    loadPolicyContext,
    passportAllowlistMode,
    setIssuerPolicy,
    setPassportAllowlistMode,
    statusMessage,
  };
}



