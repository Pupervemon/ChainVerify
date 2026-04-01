import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";

import { TARGET_CHAIN } from "../../../config/network";

type UseTargetChainHealthResult = {
  blockNumber: string;
  error: string;
  isReachable: boolean;
};

export function useTargetChainHealth(): UseTargetChainHealthResult {
  const publicClient = usePublicClient({ chainId: TARGET_CHAIN.id });
  const [blockNumber, setBlockNumber] = useState("");
  const [error, setError] = useState("");
  const [isReachable, setIsReachable] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const checkHealth = async () => {
      if (!publicClient) {
        setBlockNumber("");
        setError("Target chain public client is unavailable.");
        setIsReachable(false);
        return;
      }

      try {
        const latestBlock = await publicClient.getBlockNumber();
        if (isCancelled) {
          return;
        }

        setBlockNumber(latestBlock.toString());
        setError("");
        setIsReachable(true);
      } catch (healthError) {
        if (isCancelled) {
          return;
        }

        setBlockNumber("");
        setError(
          healthError instanceof Error
            ? healthError.message
            : "Failed to reach the target chain RPC.",
        );
        setIsReachable(false);
      } finally {
        return;
      }
    };

    void checkHealth();

    const intervalId = window.setInterval(() => {
      void checkHealth();
    }, 10000);

    return () => {
      isCancelled = true;
      window.clearInterval(intervalId);
    };
  }, [publicClient]);

  return {
    blockNumber,
    error,
    isReachable,
  };
}
