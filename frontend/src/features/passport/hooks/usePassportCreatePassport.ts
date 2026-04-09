import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { decodeEventLog, zeroAddress } from "viem";
import { usePublicClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import {
  arePassportContractsConfigured,
  isPassportAddress,
  PASSPORT_AUTHORITY_ABI,
  PASSPORT_AUTHORITY_ADDRESS,
  PASSPORT_FACTORY_ABI,
  PASSPORT_FACTORY_ADDRESS,
} from "../../../config/passport";
import { TARGET_CHAIN_ID, TARGET_CHAIN_NAME } from "../../../config/network";
import { usePassportLocale } from "../i18n";
import { deriveAssetFingerprint, normalizeAssetIdentifier } from "../utils/assetFingerprint";
import {
  getPassportCreatePermissionQueryKey,
  PASSPORT_READ_CACHE_STALE_TIME,
} from "../utils/passportReadCache";

type UsePassportCreatePassportOptions = {
  address?: string;
  ensureSupportedChain: () => Promise<boolean>;
  hasCorrectChain: boolean;
  isConnected: boolean;
};

type CreatePassportForm = {
  assetIdentifier: string;
  assetMetadataCID: string;
  initialHolder: `0x${string}`;
  passportMetadataCID: string;
};

type UsePassportCreatePassportResult = {
  canCreatePassport: boolean;
  createdPassportId: bigint | null;
  createdSubjectAccount: string;
  error: string;
  isConfigured: boolean;
  isLoadingPermission: boolean;
  isSubmitting: boolean;
  statusMessage: string;
  submitCreatePassport: (form: CreatePassportForm) => Promise<void>;
};

export function usePassportCreatePassport(
  options: UsePassportCreatePassportOptions,
): UsePassportCreatePassportResult {
  const { t } = usePassportLocale();
  const { address, ensureSupportedChain, hasCorrectChain, isConnected } = options;
  const queryClient = useQueryClient();
  const publicClient = usePublicClient({ chainId: TARGET_CHAIN_ID });
  const isConfigured = arePassportContractsConfigured();
  const cachedCreatePermission =
    address && isConfigured && isConnected && hasCorrectChain
      ? queryClient.getQueryData<boolean>(getPassportCreatePermissionQueryKey(address))
      : undefined;
  const [canCreatePassport, setCanCreatePassport] = useState(cachedCreatePermission ?? false);
  const [createdPassportId, setCreatedPassportId] = useState<bigint | null>(null);
  const [createdSubjectAccount, setCreatedSubjectAccount] = useState("");
  const [error, setError] = useState("");
  const [isLoadingPermission, setIsLoadingPermission] = useState(
    () =>
      Boolean(address) &&
      isConfigured &&
      isConnected &&
      hasCorrectChain &&
      cachedCreatePermission === undefined,
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

  const loadCreatePermission = useCallback(async () => {
    if (!isConfigured || !address || !isConnected) {
      setCanCreatePassport(false);
      setIsLoadingPermission(false);
      return;
    }

    if (!hasCorrectChain) {
      setCanCreatePassport(false);
      setError("");
      setIsLoadingPermission(false);
      return;
    }

    if (!publicClient) {
      return;
    }

    const queryKey = getPassportCreatePermissionQueryKey(address);
    const cachedPermission = queryClient.getQueryData<boolean>(queryKey);

    if (cachedPermission !== undefined) {
      setCanCreatePassport(cachedPermission);
      setIsLoadingPermission(false);
    } else {
      setIsLoadingPermission(true);
    }

    setError("");

    try {
      const allowed = await queryClient.fetchQuery({
        queryKey,
        queryFn: async () => {
          const authorityCode = await publicClient.getBytecode({
            address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
          });

          if (!authorityCode) {
            throw new Error(
              `No contract code found at ${PASSPORT_AUTHORITY_ADDRESS} on ${TARGET_CHAIN_NAME} (${TARGET_CHAIN_ID}).`,
            );
          }

          return (await publicClient.readContract({
            address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
            abi: PASSPORT_AUTHORITY_ABI,
            functionName: "canCreatePassport",
            args: [address as `0x${string}`],
          })) as boolean;
        },
        staleTime: PASSPORT_READ_CACHE_STALE_TIME,
      });

      setCanCreatePassport(allowed);
    } catch (loadError) {
      setCanCreatePassport(false);
      setError(
        loadError instanceof Error
          ? loadError.message
          : t(
              "Failed to check passport creation permission.",
              "Failed to check passport creation permission.",
            ),
      );
    } finally {
      setIsLoadingPermission(false);
    }
  }, [
    address,
    hasCorrectChain,
    isConfigured,
    isConnected,
    publicClient,
    queryClient,
    t,
  ]);

  const submitCreatePassport = useCallback(
    async (form: CreatePassportForm) => {
      if (!isConnected) {
        setError(t("Connect a wallet before submitting.", "Connect a wallet before submitting."));
        return;
      }

      if (!isConfigured) {
        setError(t("Passport contracts are not configured.", "Passport contracts are not configured."));
        return;
      }

      if (!isPassportAddress(form.initialHolder)) {
        setError(t("Initial holder must be a valid address.", "Initial holder must be a valid address."));
        return;
      }

      const normalizedAssetIdentifier = normalizeAssetIdentifier(form.assetIdentifier);

      if (!normalizedAssetIdentifier) {
        setError(
          t(
            "Asset identifier is required to derive the fingerprint.",
            "Asset identifier is required to derive the fingerprint.",
          ),
        );
        return;
      }

      const assetFingerprint = deriveAssetFingerprint(normalizedAssetIdentifier);

      if (!form.passportMetadataCID.trim()) {
        setError(t("Passport Metadata CID is required.", "Passport Metadata CID is required."));
        return;
      }

      if (!form.assetMetadataCID.trim()) {
        setError(t("Asset Metadata CID is required.", "Asset Metadata CID is required."));
        return;
      }

      if (!hasCorrectChain && !(await ensureSupportedChain())) {
        return;
      }

      setError("");
      setCreatedPassportId(null);
      setCreatedSubjectAccount("");
      setStatusMessage(
        t(
          "Submitting passport creation to the chain...",
          "Submitting passport creation to the chain...",
        ),
      );

      try {
        await writeContractAsync({
          address: PASSPORT_FACTORY_ADDRESS as `0x${string}`,
          abi: PASSPORT_FACTORY_ABI,
          functionName: "createPassport",
          args: [
            {
              assetFingerprint,
              passportMetadataCID: form.passportMetadataCID,
              assetMetadataCID: form.assetMetadataCID,
              initialHolder: form.initialHolder,
            },
          ],
        });
      } catch (submitError) {
        setStatusMessage("");
        setError(
          submitError instanceof Error
            ? submitError.message
            : t(
                "Failed to submit passport creation transaction.",
                "Failed to submit passport creation transaction.",
              ),
        );
      }
    },
    [
      ensureSupportedChain,
      hasCorrectChain,
      isConfigured,
      isConnected,
      t,
      writeContractAsync,
    ],
  );

  useEffect(() => {
    if (!isConfigured || !address || !isConnected) {
      setCanCreatePassport(false);
      setIsLoadingPermission(false);
      return;
    }

    if (!hasCorrectChain) {
      setCanCreatePassport(false);
      setIsLoadingPermission(false);
      return;
    }

    const cachedPermission = queryClient.getQueryData<boolean>(
      getPassportCreatePermissionQueryKey(address),
    );

    setCanCreatePassport(cachedPermission ?? false);
    setIsLoadingPermission(cachedPermission === undefined);
  }, [address, hasCorrectChain, isConfigured, isConnected, queryClient]);

  useEffect(() => {
    void loadCreatePermission();
  }, [loadCreatePermission]);

  useEffect(() => {
    if (!isConfirmed || !receipt) {
      return;
    }

    let parsedPassportId: bigint | null = null;
    let parsedSubjectAccount = "";

    for (const log of receipt.logs) {
      try {
        const decoded = decodeEventLog({
          abi: PASSPORT_FACTORY_ABI,
          data: log.data,
          topics: log.topics,
        });

        if (decoded.eventName === "PassportCreated") {
          parsedPassportId = decoded.args.passportId as bigint;
          parsedSubjectAccount = decoded.args.subjectAccount as string;
          break;
        }
      } catch {
        // Ignore unrelated logs in the receipt.
      }
    }

    setCreatedPassportId(parsedPassportId);
    setCreatedSubjectAccount(parsedSubjectAccount);
    setStatusMessage(
      parsedPassportId !== null
        ? t(
            `Passport #${parsedPassportId.toString()} was created on-chain.`,
            `Passport #${parsedPassportId.toString()} was created on-chain.`,
          )
        : t("Passport creation was confirmed on-chain.", "Passport creation was confirmed on-chain."),
    );
  }, [isConfirmed, receipt, t]);

  useEffect(() => {
    if (!isTxError || !txError) {
      return;
    }

    setStatusMessage("");
    setError(txError.message);
  }, [isTxError, txError]);

  useEffect(() => {
    if (!createdSubjectAccount) {
      return;
    }

    if (createdSubjectAccount.toLowerCase() === zeroAddress) {
      setCreatedSubjectAccount("");
    }
  }, [createdSubjectAccount]);

  return {
    canCreatePassport,
    createdPassportId,
    createdSubjectAccount,
    error,
    isConfigured,
    isLoadingPermission,
    isSubmitting,
    statusMessage,
    submitCreatePassport,
  };
}
