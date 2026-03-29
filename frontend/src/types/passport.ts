export type PassportStatus = "uninitialized" | "active" | "frozen" | "retired";

export type PassportSummary = {
  passportId: bigint;
  assetFingerprint: string;
  owner: string;
  subjectAccount: string;
  passportMetadataCID: string;
  assetMetadataCID: string;
  status: PassportStatus;
};

export type StampTypeConfig = {
  stampTypeId: bigint;
  code: string;
  name: string;
  schemaCID: string;
  active: boolean;
  singleton: boolean;
};

export type StampRecord = {
  stampId: bigint;
  passportId: bigint;
  stampTypeId: bigint;
  issuer: string;
  occurredAt: number;
  issuedAt: number;
  metadataCID: string;
  revoked: boolean;
  supersedesStampId: bigint;
  revokedByStampId: bigint;
  type?: StampTypeConfig;
};

export type PassportDetail = {
  passport: PassportSummary;
  stamps: StampRecord[];
};
