import { useCallback, useEffect, useState } from "react";
import { usePublicClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import {
  arePassportContractsConfigured,
  isPassportAddress,
  PASSPORT_AUTHORITY_ABI,
  PASSPORT_AUTHORITY_ADDRESS,
} from "../../../config/passport";
import { usePassportLocale } from "../i18n";

type UsePassportStampTypePermissionAdminOptions = {
  address?: string;
  ensureSupportedChain: () => Promise<boolean>;
  hasCorrectChain: boolean;
  isConnected: boolean;
};

type UsePassportStampTypePermissionAdminResult = {
  adminStatus: boolean | null;
  authorityOwner: string;
  error: string;
  isAuthorityOwner: boolean;
  isCheckingAdmin: boolean;
  isConfigured: boolean;
  isLoadingAuthorityOwner: boolean;
  isSubmitting: boolean;
  loadStampTypeAdminStatus: (stampTypeId: bigint, adminAddress: string) => Promise<void>;
  setStampTypeAdmin: (stampTypeId: bigint, adminAddress: string, enabled: boolean) => Promise<void>;
  statusMessage: string;
};

export function usePassportStampTypePermissionAdmin(
  options: UsePassportStampTypePermissionAdminOptions,
): UsePassportStampTypePermissionAdminResult {
  const { t } = usePassportLocale();
  const { address, ensureSupportedChain, hasCorrectChain, isConnected } = options;
  const publicClient = usePublicClient();
  const isConfigured = arePassportContractsConfigured();
  const [adminStatus, setAdminStatus] = useState<boolean | null>(null);
  const [authorityOwner, setAuthorityOwner] = useState("");
  const [error, setError] = useState("");
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);
  const [isLoadingAuthorityOwner, setIsLoadingAuthorityOwner] = useState(false);
  const [lastSubmittedAdmin, setLastSubmittedAdmin] = useState("");
  const [lastSubmittedEnabled, setLastSubmittedEnabled] = useState<boolean | null>(null);
  const [lastSubmittedStampTypeId, setLastSubmittedStampTypeId] = useState<bigint | null>(null);
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

  const loadStampTypeAdminStatus = useCallback(
    async (stampTypeId: bigint, adminAddress: string) => {
      if (!publicClient || !isConfigured || !isPassportAddress(adminAddress)) {
        setAdminStatus(null);
        return;
      }

      setIsCheckingAdmin(true);
      setError("");

      try {
        const enabled = (await publicClient.readContract({
          address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
          abi: PASSPORT_AUTHORITY_ABI,
          functionName: "isStampTypeAdmin",
          args: [stampTypeId, adminAddress as `0x${string}`],
        })) as boolean;

        setAdminStatus(enabled);
      } catch (loadError) {
        setAdminStatus(null);
        setError(
          loadError instanceof Error
            ? loadError.message
            : t("加载印章类型管理员状态失败。", "Failed to load stamp type admin status."),
        );
      } finally {
        setIsCheckingAdmin(false);
      }
    },
    [isConfigured, publicClient],
  );

  const setStampTypeAdmin = useCallback(
    async (stampTypeId: bigint, adminAddress: string, enabled: boolean) => {
      if (!isConnected || !address) {
        setError(t("请先连接钱包再提交。", "Connect a wallet before submitting."));
        return;
      }

      if (!isConfigured) {
        setError(t("资产护照合约尚未配置。", "Passport contracts are not configured."));
        return;
      }

      if (!isPassportAddress(adminAddress)) {
        setError(t("请输入有效的管理员地址。", "Enter a valid admin address."));
        return;
      }

      if (!hasCorrectChain && !(await ensureSupportedChain())) {
        return;
      }

      setError("");
      setStatusMessage(
        enabled
          ? t(
              "正在提交印章类型管理员授权交易...",
              "Submitting stamp type admin grant transaction...",
            )
          : t(
              "正在提交印章类型管理员撤销交易...",
              "Submitting stamp type admin revoke transaction...",
            ),
      );
      setLastSubmittedAdmin(adminAddress);
      setLastSubmittedEnabled(enabled);
      setLastSubmittedStampTypeId(stampTypeId);

      try {
        await writeContractAsync({
          address: PASSPORT_AUTHORITY_ADDRESS as `0x${string}`,
          abi: PASSPORT_AUTHORITY_ABI,
          functionName: "setStampTypeAdmin",
          args: [stampTypeId, adminAddress as `0x${string}`, enabled],
        });
      } catch (submitError) {
        setStatusMessage("");
        setError(
          submitError instanceof Error
            ? submitError.message
            : t("提交印章类型管理员交易失败。", "Failed to submit stamp type admin transaction."),
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
    if (
      !isConfirmed ||
      lastSubmittedStampTypeId === null ||
      !lastSubmittedAdmin ||
      lastSubmittedEnabled === null
    ) {
      return;
    }

    setStatusMessage(
      lastSubmittedEnabled
        ? t(
            `印章类型 #${lastSubmittedStampTypeId.toString()} 的管理员授权成功。`,
            `Admin granted for stamp type #${lastSubmittedStampTypeId.toString()}.`,
          )
        : t(
            `印章类型 #${lastSubmittedStampTypeId.toString()} 的管理员已撤销。`,
            `Admin revoked for stamp type #${lastSubmittedStampTypeId.toString()}.`,
          ),
    );
    void loadStampTypeAdminStatus(lastSubmittedStampTypeId, lastSubmittedAdmin);
  }, [
    isConfirmed,
    lastSubmittedAdmin,
    lastSubmittedEnabled,
    lastSubmittedStampTypeId,
    loadStampTypeAdminStatus,
    t,
  ]);

  useEffect(() => {
    if (!isTxError || !txError) {
      return;
    }

    setStatusMessage("");
    setError(txError.message);
  }, [isTxError, txError]);

  return {
    adminStatus,
    authorityOwner,
    error,
    isAuthorityOwner,
    isCheckingAdmin,
    isConfigured,
    isLoadingAuthorityOwner,
    isSubmitting,
    loadStampTypeAdminStatus,
    setStampTypeAdmin,
    statusMessage,
  };
}
