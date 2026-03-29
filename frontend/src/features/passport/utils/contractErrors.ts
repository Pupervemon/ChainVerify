type TranslateFn = (zh: string, en: string) => string;

type NormalizePassportContractErrorOptions = {
  contractAddress?: string;
  contractName: string;
  fallback: string;
  t: TranslateFn;
};

const looksLikeMissingContract = (message: string) => {
  const normalized = message.toLowerCase();

  return (
    normalized.includes("returned no data") ||
    normalized.includes("address is not a contract") ||
    normalized.includes("the contract does not have the function")
  );
};

const formatAddress = (value: string) =>
  /^0x[a-fA-F0-9]{40}$/.test(value) ? `${value.slice(0, 8)}...${value.slice(-6)}` : value;

export const normalizePassportContractError = (
  error: unknown,
  options: NormalizePassportContractErrorOptions,
) => {
  const { contractAddress, contractName, fallback, t } = options;

  if (!(error instanceof Error)) {
    return fallback;
  }

  if (looksLikeMissingContract(error.message)) {
    const addressLabel = contractAddress ? ` (${formatAddress(contractAddress)})` : "";

    return t(
      `当前链上的 ${contractName}${addressLabel} 没有部署有效合约。通常是钱包网络不正确，或者前端读取到了错误的部署地址。`,
      `No valid ${contractName} contract was found on the current chain${addressLabel}. This usually means the wallet is on the wrong network or the frontend is using the wrong deployment address.`,
    );
  }

  return error.message || fallback;
};
