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
import { usePassportLocale } from "../i18n";

type UsePassportCreatePassportOptions = {
  address?: string;
  ensureSupportedChain: () => Promise<boolean>;
  hasCorrectChain: boolean;
  isConnected: boolean;
};

type CreatePassportForm = {
  assetFingerprint: `0x${string}`;
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
  const publicClient = usePublicClient();
  const isConfigured = arePassportContractsConfigured();
  const [canCreatePassport, setCanCreatePassport] = useState(false);
  const [createdPassportId, setCreatedPassportId] = useState<bigint | null>(null);
  const [createdSubjectAccount, setCreatedSubjectAccount] = useState("");
  const [error, setError] = useState("");
  const [isLoadingPermission, setIsLoadingPermission] = useState(false);
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
    if (!publicClient || !isConfigured || !address) {
      setCanCreatePassport(false);
      return;
    }

    setIsLoadingPermission(true);

    try {
      const allowed = (await publicClient.readContract({
        address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
        abi: PASSPORT_AUTHORITY_ABI,
        functionName: "canCreatePassport",
        args: [address as `0x${string}`],
      })) as boolean;

      setCanCreatePassport(allowed);
    } catch (loadError) {
      setCanCreatePassport(false);
      setError(
        loadError instanceof Error
          ? loadError.message
          : t("检查护照创建权限失败。", "Failed to check passport creation permission."),
      );
    } finally {
      setIsLoadingPermission(false);
    }
  }, [address, isConfigured, publicClient]);

  const submitCreatePassport = useCallback(
    async (form: CreatePassportForm) => {
      if (!isConnected) {
        setError(t("请先连接钱包再提交。", "Connect a wallet before submitting."));
        return;
      }

      if (!isConfigured) {
        setError(t("资产护照合约尚未配置。", "Passport contracts are not configured."));
        return;
      }

      if (!isPassportAddress(form.initialHolder)) {
        setError(t("初始持有人必须是有效地址。", "Initial holder must be a valid address."));
        return;
      }

      if (!/^0x[a-fA-F0-9]{64}$/.test(form.assetFingerprint)) {
        setError(t("资产指纹必须是 bytes32 十六进制值。", "Asset fingerprint must be a bytes32 hex value."));
        return;
      }

      if (!hasCorrectChain && !(await ensureSupportedChain())) {
        return;
      }

      setError("");
      setCreatedPassportId(null);
      setCreatedSubjectAccount("");
      setStatusMessage(t("正在提交护照创建交易...", "Submitting passport creation transaction..."));

      try {
        await writeContractAsync({
          address: PASSPORT_FACTORY_ADDRESS as `0x${string}`,
          abi: PASSPORT_FACTORY_ABI,
          functionName: "createPassport",
          args: [
            {
              assetFingerprint: form.assetFingerprint,
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
            : t("提交护照创建交易失败。", "Failed to submit passport creation transaction."),
        );
      }
    },
    [
      ensureSupportedChain,
      hasCorrectChain,
      isConfigured,
      isConnected,
      writeContractAsync,
    ],
  );

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
        ? t(`护照 #${parsedPassportId.toString()} 创建成功。`, `Passport #${parsedPassportId.toString()} created successfully.`)
        : t("护照创建交易已确认。", "Passport creation confirmed."),
    );
  }, [isConfirmed, receipt]);

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
