export type PassportCreatorSetLog = {
  args: {
    enabled?: boolean;
    operator?: string;
  };
  blockNumber?: bigint | null;
  logIndex?: number | null;
  transactionHash?: `0x${string}` | null;
};

export type PassportCreatorSnapshot = {
  address: string;
  blockNumber: bigint | null;
  enabled: boolean;
  logIndex: number | null;
  transactionHash: `0x${string}` | null;
};

// Temporary frontend-side creator indexing. PassportAuthority exposes single-address reads,
// but no enumerable creator list, so until a backend indexer exists we rebuild the latest
// creator snapshot by replaying PassportCreatorSet logs in the browser.

const compareNullableBigIntAscending = (
  left: bigint | null | undefined,
  right: bigint | null | undefined,
) => {
  if (left === right) {
    return 0;
  }

  if (left === null || left === undefined) {
    return -1;
  }

  if (right === null || right === undefined) {
    return 1;
  }

  return left < right ? -1 : 1;
};

const compareNullableBigIntDescending = (
  left: bigint | null | undefined,
  right: bigint | null | undefined,
) => compareNullableBigIntAscending(right, left);

const compareNullableNumberAscending = (
  left: number | null | undefined,
  right: number | null | undefined,
) => {
  if (left === right) {
    return 0;
  }

  if (left === null || left === undefined) {
    return -1;
  }

  if (right === null || right === undefined) {
    return 1;
  }

  return left - right;
};

const compareNullableNumberDescending = (
  left: number | null | undefined,
  right: number | null | undefined,
) => compareNullableNumberAscending(right, left);

export const buildLatestPassportCreatorStates = (
  logs: PassportCreatorSetLog[],
): PassportCreatorSnapshot[] => {
  const orderedLogs = [...logs].sort((left, right) => {
    const blockComparison = compareNullableBigIntAscending(left.blockNumber, right.blockNumber);
    if (blockComparison !== 0) {
      return blockComparison;
    }

    return compareNullableNumberAscending(left.logIndex, right.logIndex);
  });

  const latestCreators = new Map<string, PassportCreatorSnapshot>();

  for (const log of orderedLogs) {
    const operator = log.args.operator;
    if (!operator) {
      continue;
    }

    latestCreators.set(operator.toLowerCase(), {
      address: operator,
      blockNumber: log.blockNumber ?? null,
      enabled: log.args.enabled ?? false,
      logIndex: log.logIndex ?? null,
      transactionHash: log.transactionHash ?? null,
    });
  }

  return Array.from(latestCreators.values()).sort((left, right) => {
    const blockComparison = compareNullableBigIntDescending(left.blockNumber, right.blockNumber);
    if (blockComparison !== 0) {
      return blockComparison;
    }

    const logIndexComparison = compareNullableNumberDescending(left.logIndex, right.logIndex);
    if (logIndexComparison !== 0) {
      return logIndexComparison;
    }

    return left.address.localeCompare(right.address);
  });
};

export const getActivePassportCreators = (logs: PassportCreatorSetLog[]) =>
  buildLatestPassportCreatorStates(logs).filter((snapshot) => snapshot.enabled);
