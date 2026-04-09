import { useCallback, useEffect, useState } from "react";

type UsePassportTransactionSuccessNoticeOptions = {
  error: string;
  isSubmitting: boolean;
  statusMessage: string;
};

type UsePassportTransactionSuccessNoticeResult = {
  clearSuccessNotice: () => void;
  successNoticeMessage: string;
};

export function usePassportTransactionSuccessNotice(
  options: UsePassportTransactionSuccessNoticeOptions,
): UsePassportTransactionSuccessNoticeResult {
  const { error, isSubmitting, statusMessage } = options;
  const [successNoticeMessage, setSuccessNoticeMessage] = useState("");

  useEffect(() => {
    if (isSubmitting || error) {
      setSuccessNoticeMessage("");
      return;
    }

    if (statusMessage) {
      setSuccessNoticeMessage(statusMessage);
    }
  }, [error, isSubmitting, statusMessage]);

  const clearSuccessNotice = useCallback(() => {
    setSuccessNoticeMessage("");
  }, []);

  return {
    clearSuccessNotice,
    successNoticeMessage,
  };
}