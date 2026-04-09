import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
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
  lastLoadedQuery: PolicyQuery | null;
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
  const loadRequestIdRef = useRef(0);

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
          : t("Failed to load PassportAuthority owner.", "Failed to load PassportAuthority owner."),
      );
    } finally {
      setIsLoadingAuthorityOwner(false);
    }
  }, [isConfigured, publicClient, queryClient, t]);

  const loadPolicyContext = useCallback(
    async (query: PolicyQuery) => {
      const requestId = loadRequestIdRef.current + 1;
      loadRequestIdRef.current = requestId;

      if (!publicClient || !isConfigured || !isPassportAddress(query.issuerAddress)) {
        setCurrentPolicy(null);
        setPassportAllowlistModeState(null);
        setLastLoadedQuery(null);
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

        if (loadRequestIdRef.current !== requestId) {
          return;
        }

        setCurrentPolicy(policy);
        setPassportAllowlistModeState(allowlistMode);
        setLastLoadedQuery(query);
      } catch (loadError) {
        if (loadRequestIdRef.current !== requestId) {
          return;
        }

        setCurrentPolicy(null);
        setPassportAllowlistModeState(null);
        setLastLoadedQuery(null);
        setError(
          loadError instanceof Error
            ? loadError.message
            : t("Failed to load issuer access context.", "Failed to load issuer access context."),
        );
      } finally {
        if (loadRequestIdRef.current === requestId) {
          setIsLoadingPolicy(false);
        }
      }
    },
    [isConfigured, publicClient, t],
  );

  const setIssuerPolicy = useCallback(
    async (query: PolicyQuery, policy: IssuerPolicyRecord) => {
      if (!isConnected || !address) {
        setError(t("Connect a wallet before submitting.", "Connect a wallet before submitting."));
        return;
      }

      if (!isConfigured) {
        setError(t("Passport contracts are not configured.", "Passport contracts are not configured."));
        return;
      }

      if (!isPassportAddress(query.issuerAddress)) {
        setError(t("Enter a valid issuer address.", "Enter a valid issuer address."));
        return;
      }

      if (!hasCorrectChain && !(await ensureSupportedChain())) {
        return;
      }

      setError("");
      setStatusMessage(t("Submitting issuer access update...", "Submitting issuer access update..."));
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
            : t("Failed to submit issuer access transaction.", "Failed to submit issuer access transaction."),
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

  const setPassportAllowlistMode = useCallback(
    async (passportId: bigint, enabled: boolean) => {
      if (!isConnected || !address) {
        setError(t("Connect a wallet before submitting.", "Connect a wallet before submitting."));
        return;
      }

      if (!isConfigured) {
        setError(t("Passport contracts are not configured.", "Passport contracts are not configured."));
        return;
      }

      if (!hasCorrectChain && !(await ensureSupportedChain())) {
        return;
      }

      setError("");
      setStatusMessage(
        enabled
          ? t(
              "Submitting allowlist enforcement enable...",
              "Submitting allowlist enforcement enable...",
            )
          : t(
              "Submitting allowlist enforcement disable...",
              "Submitting allowlist enforcement disable...",
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
                "Failed to submit passport allowlist enforcement transaction.",
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
    if (!isConfirmed || !pendingAction) {
      return;
    }

    if (pendingAction.kind === "policy") {
      const scopeLabel =
        pendingAction.query.scope === "global"
          ? t("Global", "Global")
          : pendingAction.query.scope === "type"
            ? t("Stamp type", "Stamp type")
            : t("Passport", "Passport");

      setStatusMessage(
        t(`${scopeLabel} issuer access was updated.`, `${scopeLabel} issuer access was updated.`),
      );
      void loadPolicyContext(pendingAction.query);
    } else {
      setStatusMessage(
        pendingAction.value
          ? t(
              `Passport #${pendingAction.passportId.toString()} allowlist enforcement was enabled.`,
              `Passport #${pendingAction.passportId.toString()} allowlist enforcement was enabled.`,
            )
          : t(
              `Passport #${pendingAction.passportId.toString()} allowlist enforcement was disabled.`,
              `Passport #${pendingAction.passportId.toString()} allowlist enforcement was disabled.`,
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
    lastLoadedQuery,
    lastConfirmedTxHash: isConfirmed && txHash ? txHash : "",
    loadPolicyContext,
    passportAllowlistMode,
    setIssuerPolicy,
    setPassportAllowlistMode,
    statusMessage,
  };
}




