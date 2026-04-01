import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";

import {
  arePassportContractsConfigured,
  ASSET_PASSPORT_ABI,
  ASSET_PASSPORT_ADDRESS,
  CHRONICLE_STAMP_ABI,
  CHRONICLE_STAMP_ADDRESS,
  PASSPORT_AUTHORITY_ABI,
  PASSPORT_AUTHORITY_ADDRESS,
} from "../../../config/passport";
import {
  getActivePassportCreators,
  type PassportCreatorSetLog,
} from "../utils/passportCreatorIndex";
import {
  getActiveIssuerPolicyStates,
  type GlobalIssuerPolicySetLog,
  type PassportIssuerPolicySetLog,
  type TypeIssuerPolicySetLog,
} from "../utils/passportIssuerPolicyIndex";

type PassportDashboardOverview = {
  activeCreatorCount: number;
  activeRevocationOperatorCount: number;
  activeStampTypeAdminCount: number;
  activeStampTypeCount: number;
  assetPassportOwner: string;
  authorityOwner: string;
  chronicleOwner: string;
  enabledPolicyCount: number;
  passportCount: number | null;
  stampIssueCount: number;
  stampRevocationCount: number;
  stampTypeCount: number;
};

type UsePassportDashboardOverviewResult = {
  error: string;
  isConfigured: boolean;
  isLoading: boolean;
  overview: PassportDashboardOverview | null;
};

const INITIAL_OVERVIEW: PassportDashboardOverview = {
  activeCreatorCount: 0,
  activeRevocationOperatorCount: 0,
  activeStampTypeAdminCount: 0,
  activeStampTypeCount: 0,
  assetPassportOwner: "",
  authorityOwner: "",
  chronicleOwner: "",
  enabledPolicyCount: 0,
  passportCount: null,
  stampIssueCount: 0,
  stampRevocationCount: 0,
  stampTypeCount: 0,
};

export function usePassportDashboardOverview(): UsePassportDashboardOverviewResult {
  const publicClient = usePublicClient();
  const isConfigured = arePassportContractsConfigured();
  const [overview, setOverview] = useState<PassportDashboardOverview | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const load = async () => {
      if (!publicClient || !isConfigured) {
        setOverview(null);
        setError("");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const [
          assetPassportOwner,
          chronicleOwner,
          authorityOwner,
          totalSupply,
          stampTypeLogs,
          stampIssuedLogs,
          stampRevokedLogs,
          creatorLogs,
          revocationOperatorLogs,
          stampTypeAdminLogs,
          globalPolicyLogs,
          typePolicyLogs,
          passportPolicyLogs,
        ] = await Promise.all([
          publicClient.readContract({
            address: ASSET_PASSPORT_ADDRESS as `0x${string}`,
            abi: ASSET_PASSPORT_ABI,
            functionName: "owner",
          }) as Promise<string>,
          publicClient.readContract({
            address: CHRONICLE_STAMP_ADDRESS as `0x${string}`,
            abi: CHRONICLE_STAMP_ABI,
            functionName: "owner",
          }) as Promise<string>,
          publicClient.readContract({
            address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
            abi: PASSPORT_AUTHORITY_ABI,
            functionName: "owner",
          }) as Promise<string>,
          publicClient.readContract({
            address: ASSET_PASSPORT_ADDRESS as `0x${string}`,
            abi: ASSET_PASSPORT_ABI,
            functionName: "totalSupply",
          }) as Promise<bigint>,
          publicClient.getContractEvents({
            address: CHRONICLE_STAMP_ADDRESS as `0x${string}`,
            abi: CHRONICLE_STAMP_ABI,
            eventName: "StampTypeConfigured",
            fromBlock: 0n,
            toBlock: "latest",
          }),
          publicClient.getContractEvents({
            address: CHRONICLE_STAMP_ADDRESS as `0x${string}`,
            abi: CHRONICLE_STAMP_ABI,
            eventName: "StampIssued",
            fromBlock: 0n,
            toBlock: "latest",
          }),
          publicClient.getContractEvents({
            address: CHRONICLE_STAMP_ADDRESS as `0x${string}`,
            abi: CHRONICLE_STAMP_ABI,
            eventName: "StampRevoked",
            fromBlock: 0n,
            toBlock: "latest",
          }),
          // Temporary frontend-side full-chain scan. Replace this with indexed backend
          // creator snapshots when an access-control read API becomes available.
          publicClient.getContractEvents({
            address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
            abi: PASSPORT_AUTHORITY_ABI,
            eventName: "PassportCreatorSet",
            fromBlock: 0n,
            toBlock: "latest",
          }),
          publicClient.getContractEvents({
            address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
            abi: PASSPORT_AUTHORITY_ABI,
            eventName: "RevocationOperatorSet",
            fromBlock: 0n,
            toBlock: "latest",
          }),
          publicClient.getContractEvents({
            address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
            abi: PASSPORT_AUTHORITY_ABI,
            eventName: "StampTypeAdminSet",
            fromBlock: 0n,
            toBlock: "latest",
          }),
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

        const latestStampTypes = new Map<string, boolean>();
        for (const log of stampTypeLogs) {
          const args = log.args as { active?: boolean; stampTypeId?: bigint };
          if (args.stampTypeId === undefined) {
            continue;
          }
          latestStampTypes.set(args.stampTypeId.toString(), args.active ?? false);
        }

        const activeCreators = getActivePassportCreators(creatorLogs as PassportCreatorSetLog[]);

        const latestRevocationOperators = new Map<string, boolean>();
        for (const log of revocationOperatorLogs) {
          const args = log.args as { enabled?: boolean; operator?: string };
          if (!args.operator) {
            continue;
          }
          latestRevocationOperators.set(args.operator.toLowerCase(), args.enabled ?? false);
        }

        const latestStampTypeAdmins = new Map<string, boolean>();
        for (const log of stampTypeAdminLogs) {
          const args = log.args as { admin?: string; enabled?: boolean; stampTypeId?: bigint };
          if (!args.admin || args.stampTypeId === undefined) {
            continue;
          }
          latestStampTypeAdmins.set(
            `${args.stampTypeId.toString()}:${args.admin.toLowerCase()}`,
            args.enabled ?? false,
          );
        }

        const activePolicies = getActiveIssuerPolicyStates({
          globalLogs: globalPolicyLogs as GlobalIssuerPolicySetLog[],
          passportLogs: passportPolicyLogs as PassportIssuerPolicySetLog[],
          typeLogs: typePolicyLogs as TypeIssuerPolicySetLog[],
        });

        if (!isCancelled) {
          setOverview({
            activeCreatorCount: activeCreators.length,
            activeRevocationOperatorCount: Array.from(latestRevocationOperators.values()).filter(Boolean)
              .length,
            activeStampTypeAdminCount: Array.from(latestStampTypeAdmins.values()).filter(Boolean)
              .length,
            activeStampTypeCount: Array.from(latestStampTypes.values()).filter(Boolean).length,
            assetPassportOwner,
            authorityOwner,
            chronicleOwner,
            enabledPolicyCount: activePolicies.length,
            passportCount: Number(totalSupply),
            stampIssueCount: stampIssuedLogs.length,
            stampRevocationCount: stampRevokedLogs.length,
            stampTypeCount: latestStampTypes.size,
          });
        }
      } catch (loadError) {
        if (!isCancelled) {
          setOverview(INITIAL_OVERVIEW);
          setError(loadError instanceof Error ? loadError.message : "Failed to load dashboard overview.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isCancelled = true;
    };
  }, [isConfigured, publicClient]);

  return {
    error,
    isConfigured,
    isLoading,
    overview,
  };
}
