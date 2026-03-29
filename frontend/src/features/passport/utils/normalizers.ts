import type {
  PassportStatus,
  PassportSummary,
  StampRecord,
  StampTypeConfig,
} from "../../../types/passport";

const passportStatusMap: PassportStatus[] = [
  "uninitialized",
  "active",
  "frozen",
  "retired",
];

export function normalizePassportRecord(
  passportId: bigint,
  owner: string,
  record: {
    assetFingerprint: string;
    subjectAccount: string;
    passportMetadataCID: string;
    assetMetadataCID: string;
    status: number | bigint;
  },
): PassportSummary {
  const statusIndex = Number(record.status);

  return {
    passportId,
    assetFingerprint: record.assetFingerprint,
    owner,
    subjectAccount: record.subjectAccount,
    passportMetadataCID: record.passportMetadataCID,
    assetMetadataCID: record.assetMetadataCID,
    status: passportStatusMap[statusIndex] ?? "uninitialized",
  };
}

export function normalizeStampRecord(
  stamp: {
    stampId: bigint;
    passportId: bigint;
    stampTypeId: bigint;
    issuer: string;
    occurredAt: bigint | number;
    issuedAt: bigint | number;
    metadataCID: string;
    revoked: boolean;
    supersedesStampId: bigint;
    revokedByStampId: bigint;
  },
  type?: StampTypeConfig,
): StampRecord {
  return {
    stampId: BigInt(stamp.stampId),
    passportId: BigInt(stamp.passportId),
    stampTypeId: BigInt(stamp.stampTypeId),
    issuer: stamp.issuer,
    occurredAt: Number(stamp.occurredAt),
    issuedAt: Number(stamp.issuedAt),
    metadataCID: stamp.metadataCID,
    revoked: stamp.revoked,
    supersedesStampId: BigInt(stamp.supersedesStampId),
    revokedByStampId: BigInt(stamp.revokedByStampId),
    type,
  };
}

export function normalizeStampType(
  stampTypeId: bigint,
  config: {
    code: string;
    name: string;
    schemaCID: string;
    active: boolean;
    singleton: boolean;
  },
): StampTypeConfig {
  return {
    stampTypeId,
    code: config.code,
    name: config.name,
    schemaCID: config.schemaCID,
    active: config.active,
    singleton: config.singleton,
  };
}
