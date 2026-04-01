import { useCallback, useEffect, useState } from "react";
import { usePublicClient } from "wagmi";

import {
  ASSET_PASSPORT_ABI,
  ASSET_PASSPORT_ADDRESS,
  isPassportAddress,
} from "../../../config/passport";
import { usePassportLocale } from "../i18n";
import { normalizePassportContractError } from "../utils/contractErrors";

export type PassportTrustedFactoryListItem = {
  address: string;
  index: number;
};

type UsePassportTrustedFactoryListResult = {
  error: string;
  factories: PassportTrustedFactoryListItem[];
  isConfigured: boolean;
  isLoading: boolean;
  refreshFactoryList: () => Promise<void>;
};

export function usePassportTrustedFactoryList(): UsePassportTrustedFactoryListResult {
  const { t } = usePassportLocale();
  const publicClient = usePublicClient();
  const isConfigured = isPassportAddress(ASSET_PASSPORT_ADDRESS);
  const [error, setError] = useState("");
  const [factories, setFactories] = useState<PassportTrustedFactoryListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadFactoryList = useCallback(async () => {
    if (!publicClient || !isConfigured) {
      setFactories([]);
      setError("");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const factoryCount = (await publicClient.readContract({
        address: ASSET_PASSPORT_ADDRESS as `0x${string}`,
        abi: ASSET_PASSPORT_ABI,
        functionName: "factoryCount",
      })) as bigint;

      if (factoryCount === 0n) {
        setFactories([]);
        return;
      }

      const nextFactories = await Promise.all(
        Array.from({ length: Number(factoryCount) }, (_, index) => index).map(async (index) => ({
          address: (await publicClient.readContract({
            address: ASSET_PASSPORT_ADDRESS as `0x${string}`,
            abi: ASSET_PASSPORT_ABI,
            functionName: "factoryAt",
            args: [BigInt(index)],
          })) as string,
          index,
        })),
      );

      setFactories(nextFactories);
    } catch (loadError) {
      setFactories([]);
      setError(
        normalizePassportContractError(loadError, {
          contractAddress: ASSET_PASSPORT_ADDRESS,
          contractName: "AssetPassport",
          fallback: t("加载可信工厂列表失败。", "Failed to load trusted factory list."),
          t,
        }),
      );
    } finally {
      setIsLoading(false);
    }
  }, [isConfigured, publicClient, t]);

  useEffect(() => {
    void loadFactoryList();
  }, [loadFactoryList]);

  return {
    error,
    factories,
    isConfigured,
    isLoading,
    refreshFactoryList: loadFactoryList,
  };
}
