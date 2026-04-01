import { useCallback, useEffect, useState } from "react";
import { usePublicClient } from "wagmi";

import { TARGET_CHAIN_ID } from "../../../config/network";
import {
  arePassportContractsConfigured,
  PASSPORT_AUTHORITY_ABI,
  PASSPORT_AUTHORITY_ADDRESS,
} from "../../../config/passport";
import { usePassportLocale } from "../i18n";
import {
  getActiveIssuerPolicyStates,
  type GlobalIssuerPolicySetLog,
  type IssuerPolicySnapshot,
  type PassportIssuerPolicySetLog,
  type TypeIssuerPolicySetLog,
} from "../utils/passportIssuerPolicyIndex";

type IssuerPolicyListGroups = {
  global: IssuerPolicySnapshot[];
  passport: IssuerPolicySnapshot[];
  type: IssuerPolicySnapshot[];
};

type UsePassportIssuerPolicyListResult = {
  activePolicyCount: number;
  error: string;
  isConfigured: boolean;
  isLoading: boolean;
  policies: IssuerPolicyListGroups;
  refreshPolicyList: () => Promise<void>;
};

const EMPTY_GROUPS: IssuerPolicyListGroups = {
  global: [],
  passport: [],
  type: [],
};

export function usePassportIssuerPolicyList(): UsePassportIssuerPolicyListResult {
  const { t } = usePassportLocale();
  const publicClient = usePublicClient({ chainId: TARGET_CHAIN_ID });
  const isConfigured = arePassportContractsConfigured();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [policies, setPolicies] = useState<IssuerPolicyListGroups>(EMPTY_GROUPS);

  const loadPolicyList = useCallback(async () => {
    if (!publicClient || !isConfigured) {
      setPolicies(EMPTY_GROUPS);
      setError("");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const [globalLogs, typeLogs, passportLogs] = await Promise.all([
        publicClient.getContractEvents({
          address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
          abi: PASSPORT_AUTHORITY_ABI,
          eventName: "GlobalIssuerPolicySet",
          fromBlock: 0n,
          toBlock: "latest",
        }),
        publicClient.getContractEvents({
          address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
          abi: PASSPORT_AUTHORITY_ABI,
          eventName: "TypeIssuerPolicySet",
          fromBlock: 0n,
          toBlock: "latest",
        }),
        publicClient.getContractEvents({
          address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
          abi: PASSPORT_AUTHORITY_ABI,
          eventName: "PassportIssuerPolicySet",
          fromBlock: 0n,
          toBlock: "latest",
        }),
      ]);

      const activePolicies = getActiveIssuerPolicyStates({
        globalLogs: globalLogs as GlobalIssuerPolicySetLog[],
        passportLogs: passportLogs as PassportIssuerPolicySetLog[],
        typeLogs: typeLogs as TypeIssuerPolicySetLog[],
      });

      setPolicies({
        global: activePolicies.filter((policy) => policy.scope === "global"),
        passport: activePolicies.filter((policy) => policy.scope === "passport"),
        type: activePolicies.filter((policy) => policy.scope === "type"),
      });
    } catch (loadError) {
      setPolicies(EMPTY_GROUPS);
      setError(
        loadError instanceof Error
          ? loadError.message
          : t("加载已授权地址列表失败。", "Failed to load the authorized issuer lists."),
      );
    } finally {
      setIsLoading(false);
    }
  }, [isConfigured, publicClient, t]);

  useEffect(() => {
    void loadPolicyList();
  }, [loadPolicyList]);

  return {
    activePolicyCount: policies.global.length + policies.type.length + policies.passport.length,
    error,
    isConfigured,
    isLoading,
    policies,
    refreshPolicyList: loadPolicyList,
  };
}
