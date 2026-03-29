import { useCallback, useEffect, useState } from "react";
import { usePublicClient } from "wagmi";

import {
  arePassportContractsConfigured,
  ASSET_PASSPORT_ABI,
  ASSET_PASSPORT_ADDRESS,
  CHRONICLE_STAMP_ABI,
  CHRONICLE_STAMP_ADDRESS,
} from "../../../config/passport";
import type { PassportDetail } from "../../../types/passport";
import {
  normalizePassportRecord,
  normalizeStampRecord,
  normalizeStampType,
} from "../utils/normalizers";
import { usePassportLocale } from "../i18n";

type UsePassportDetailResult = {
  detail: PassportDetail | null;
  error: string;
  isConfigured: boolean;
  isLoading: boolean;
  notFound: boolean;
  refresh: () => Promise<void>;
};

type AssetPassportRecordResult = {
  assetFingerprint: string;
  subjectAccount: string;
  passportMetadataCID: string;
  assetMetadataCID: string;
  status: bigint | number;
};

type ChronicleStampRecordResult = {
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
};

type StampTypeConfigResult = {
  code: string;
  name: string;
  schemaCID: string;
  active: boolean;
  singleton: boolean;
};

const sortStampsByLatest = (left: ChronicleStampRecordResult, right: ChronicleStampRecordResult) =>
  Number(right.occurredAt || right.issuedAt) - Number(left.occurredAt || left.issuedAt);

export function usePassportDetail(passportId?: bigint): UsePassportDetailResult {
  const { t } = usePassportLocale();
  const publicClient = usePublicClient();
  const isConfigured = arePassportContractsConfigured();
  const [detail, setDetail] = useState<PassportDetail | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const refresh = useCallback(async () => {
    if (!passportId || !publicClient) {
      setDetail(null);
      setError("");
      setNotFound(false);
      return;
    }

    if (!isConfigured) {
      setDetail(null);
      setError("");
      setIsLoading(false);
      setNotFound(false);
      return;
    }

    setIsLoading(true);
    setError("");
    setNotFound(false);

    try {
      const exists = (await publicClient.readContract({
        address: ASSET_PASSPORT_ADDRESS as `0x${string}`,
        abi: ASSET_PASSPORT_ABI,
        functionName: "exists",
        args: [passportId],
      })) as boolean;

      if (!exists) {
        setDetail(null);
        setNotFound(true);
        return;
      }

      const [owner, passportRecord, stampCount] = await Promise.all([
        publicClient.readContract({
          address: ASSET_PASSPORT_ADDRESS as `0x${string}`,
          abi: ASSET_PASSPORT_ABI,
          functionName: "ownerOf",
          args: [passportId],
        }) as Promise<string>,
        publicClient.readContract({
          address: ASSET_PASSPORT_ADDRESS as `0x${string}`,
          abi: ASSET_PASSPORT_ABI,
          functionName: "recordOf",
          args: [passportId],
        }) as Promise<AssetPassportRecordResult>,
        publicClient.readContract({
          address: CHRONICLE_STAMP_ADDRESS as `0x${string}`,
          abi: CHRONICLE_STAMP_ABI,
          functionName: "stampCountByPassport",
          args: [passportId],
        }) as Promise<bigint>,
      ]);

      const stampIds = await Promise.all(
        Array.from({ length: Number(stampCount) }, (_, index) =>
          publicClient.readContract({
            address: CHRONICLE_STAMP_ADDRESS as `0x${string}`,
            abi: CHRONICLE_STAMP_ABI,
            functionName: "stampIdByPassportAndIndex",
            args: [passportId, BigInt(index)],
          }) as Promise<bigint>,
        ),
      );

      const rawStamps = (
        await Promise.all(
          stampIds.map(
            (stampId) =>
              publicClient.readContract({
                address: CHRONICLE_STAMP_ADDRESS as `0x${string}`,
                abi: CHRONICLE_STAMP_ABI,
                functionName: "stampRecordOf",
                args: [stampId],
              }) as Promise<ChronicleStampRecordResult>,
          ),
        )
      ).sort(sortStampsByLatest);

      const uniqueTypeIds = Array.from(
        new Set(rawStamps.map((stamp) => stamp.stampTypeId.toString())),
      ).map((value) => BigInt(value));

      const stampTypes = new Map<string, ReturnType<typeof normalizeStampType>>();
      await Promise.all(
        uniqueTypeIds.map(async (stampTypeId) => {
          const config = (await publicClient.readContract({
            address: CHRONICLE_STAMP_ADDRESS as `0x${string}`,
            abi: CHRONICLE_STAMP_ABI,
            functionName: "stampTypeOf",
            args: [stampTypeId],
          })) as StampTypeConfigResult;

          stampTypes.set(stampTypeId.toString(), normalizeStampType(stampTypeId, config));
        }),
      );

      setDetail({
        passport: normalizePassportRecord(passportId, owner, passportRecord),
        stamps: rawStamps.map((stamp) =>
          normalizeStampRecord(stamp, stampTypes.get(stamp.stampTypeId.toString())),
        ),
      });
    } catch (loadError) {
      setDetail(null);
      setNotFound(false);
      setError(
        loadError instanceof Error
          ? loadError.message
          : t("加载护照数据时发生未知错误。", "An unknown error occurred while loading passport data."),
      );
    } finally {
      setIsLoading(false);
    }
  }, [isConfigured, passportId, publicClient]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    detail,
    error,
    isConfigured,
    isLoading,
    notFound,
    refresh,
  };
}
