export type GlobalIssuerPolicySetLog = {
  args: {
    enabled?: boolean;
    issuer?: string;
    policyCID?: string;
  };
  blockNumber?: bigint | null;
  logIndex?: number | null;
  transactionHash?: `0x${string}` | null;
};

export type TypeIssuerPolicySetLog = {
  args: {
    enabled?: boolean;
    issuer?: string;
    policyCID?: string;
    stampTypeId?: bigint;
  };
  blockNumber?: bigint | null;
  logIndex?: number | null;
  transactionHash?: `0x${string}` | null;
};

export type PassportIssuerPolicySetLog = {
  args: {
    enabled?: boolean;
    issuer?: string;
    passportId?: bigint;
    policyCID?: string;
  };
  blockNumber?: bigint | null;
  logIndex?: number | null;
  transactionHash?: `0x${string}` | null;
};

export type IssuerPolicyScope = "global" | "type" | "passport";

export type IssuerPolicySnapshot = {
  address: string;
  blockNumber: bigint | null;
  enabled: boolean;
  logIndex: number | null;
  passportId: bigint | null;
  policyCID: string;
  scope: IssuerPolicyScope;
  stampTypeId: bigint | null;
  transactionHash: `0x${string}` | null;
};

type IssuerPolicyLogBundle = {
  globalLogs: GlobalIssuerPolicySetLog[];
  passportLogs: PassportIssuerPolicySetLog[];
  typeLogs: TypeIssuerPolicySetLog[];
};

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

const sortLogsAscending = <
  TLog extends { blockNumber?: bigint | null; logIndex?: number | null },
>(
  left: TLog,
  right: TLog,
) => {
  const blockComparison = compareNullableBigIntAscending(left.blockNumber, right.blockNumber);
  if (blockComparison !== 0) {
    return blockComparison;
  }

  return compareNullableNumberAscending(left.logIndex, right.logIndex);
};

const sortSnapshotsDescending = (left: IssuerPolicySnapshot, right: IssuerPolicySnapshot) => {
  const scopeOrder = { global: 0, type: 1, passport: 2 } as const;
  const scopeComparison = scopeOrder[left.scope] - scopeOrder[right.scope];
  if (scopeComparison !== 0) {
    return scopeComparison;
  }

  if (left.scope === "type" && right.scope === "type") {
    const stampTypeComparison = compareNullableBigIntAscending(left.stampTypeId, right.stampTypeId);
    if (stampTypeComparison !== 0) {
      return stampTypeComparison;
    }
  }

  if (left.scope === "passport" && right.scope === "passport") {
    const passportComparison = compareNullableBigIntAscending(left.passportId, right.passportId);
    if (passportComparison !== 0) {
      return passportComparison;
    }
  }

  const addressComparison = left.address.localeCompare(right.address);
  if (addressComparison !== 0) {
    return addressComparison;
  }

  const blockComparison = compareNullableBigIntDescending(left.blockNumber, right.blockNumber);
  if (blockComparison !== 0) {
    return blockComparison;
  }

  return compareNullableNumberDescending(left.logIndex, right.logIndex);
};

export const buildLatestIssuerPolicyStates = (
  logs: IssuerPolicyLogBundle,
): IssuerPolicySnapshot[] => {
  const latestPolicies = new Map<string, IssuerPolicySnapshot>();

  for (const log of [...logs.globalLogs].sort(sortLogsAscending)) {
    const issuer = log.args.issuer;
    if (!issuer) {
      continue;
    }

    latestPolicies.set(`global:${issuer.toLowerCase()}`, {
      address: issuer,
      blockNumber: log.blockNumber ?? null,
      enabled: log.args.enabled ?? false,
      logIndex: log.logIndex ?? null,
      passportId: null,
      policyCID: log.args.policyCID ?? "",
      scope: "global",
      stampTypeId: null,
      transactionHash: log.transactionHash ?? null,
    });
  }

  for (const log of [...logs.typeLogs].sort(sortLogsAscending)) {
    const issuer = log.args.issuer;
    const stampTypeId = log.args.stampTypeId;
    if (!issuer || stampTypeId === undefined) {
      continue;
    }

    latestPolicies.set(`type:${stampTypeId.toString()}:${issuer.toLowerCase()}`, {
      address: issuer,
      blockNumber: log.blockNumber ?? null,
      enabled: log.args.enabled ?? false,
      logIndex: log.logIndex ?? null,
      passportId: null,
      policyCID: log.args.policyCID ?? "",
      scope: "type",
      stampTypeId,
      transactionHash: log.transactionHash ?? null,
    });
  }

  for (const log of [...logs.passportLogs].sort(sortLogsAscending)) {
    const issuer = log.args.issuer;
    const passportId = log.args.passportId;
    if (!issuer || passportId === undefined) {
      continue;
    }

    latestPolicies.set(`passport:${passportId.toString()}:${issuer.toLowerCase()}`, {
      address: issuer,
      blockNumber: log.blockNumber ?? null,
      enabled: log.args.enabled ?? false,
      logIndex: log.logIndex ?? null,
      passportId,
      policyCID: log.args.policyCID ?? "",
      scope: "passport",
      stampTypeId: null,
      transactionHash: log.transactionHash ?? null,
    });
  }

  return Array.from(latestPolicies.values()).sort(sortSnapshotsDescending);
};

export const getActiveIssuerPolicyStates = (logs: IssuerPolicyLogBundle) =>
  buildLatestIssuerPolicyStates(logs).filter((snapshot) => snapshot.enabled);
