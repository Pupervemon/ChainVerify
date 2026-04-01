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
  getActivePassportCreators,
  type PassportCreatorSetLog,
} from "../utils/passportCreatorIndex";

export type PassportCreatorListItem = {
  address: string;
  blockNumber: bigint | null;
  transactionHash: string;
};

type UsePassportCreatorListResult = {
  creators: PassportCreatorListItem[];
  error: string;
  isConfigured: boolean;
  isLoading: boolean;
  refreshCreatorList: () => Promise<void>;
};

export function usePassportCreatorList(): UsePassportCreatorListResult {
  const { t } = usePassportLocale();
  const publicClient = usePublicClient({ chainId: TARGET_CHAIN_ID });
  const isConfigured = arePassportContractsConfigured();
  const [creators, setCreators] = useState<PassportCreatorListItem[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadCreatorList = useCallback(async () => {
    if (!publicClient || !isConfigured) {
      setCreators([]);
      setError("");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const creatorLogs = await publicClient.getContractEvents({
        address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
        abi: PASSPORT_AUTHORITY_ABI,
        eventName: "PassportCreatorSet",
        fromBlock: 0n,
        toBlock: "latest",
      });

      setCreators(
        getActivePassportCreators(creatorLogs as PassportCreatorSetLog[]).map((creator) => ({
          address: creator.address,
          blockNumber: creator.blockNumber,
          transactionHash: creator.transactionHash ?? "",
        })),
      );
    } catch (loadError) {
      setCreators([]);
      setError(
        loadError instanceof Error
          ? loadError.message
          : t("加载授权钱包列表失败。", "Failed to load creator wallet list."),
      );
    } finally {
      setIsLoading(false);
    }
  }, [isConfigured, publicClient, t]);

  useEffect(() => {
    void loadCreatorList();
  }, [loadCreatorList]);

  return {
    creators,
    error,
    isConfigured,
    isLoading,
    refreshCreatorList: loadCreatorList,
  };
}
