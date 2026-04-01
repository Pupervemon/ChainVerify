import {
  ASSET_PASSPORT_ADDRESS,
  CHRONICLE_STAMP_ADDRESS,
  PASSPORT_AUTHORITY_ADDRESS,
} from "../../../config/passport";
import { TARGET_CHAIN_ID } from "../../../config/network";

export const PASSPORT_READ_CACHE_STALE_TIME = 60_000;

const normalizeCacheAddress = (value: string) => value.trim().toLowerCase();

export const getPassportAuthorityOwnerQueryKey = () =>
  [
    "passport",
    TARGET_CHAIN_ID,
    "authority-owner",
    normalizeCacheAddress(PASSPORT_AUTHORITY_ADDRESS),
  ] as const;

export const getAssetPassportOwnerQueryKey = () =>
  [
    "passport",
    TARGET_CHAIN_ID,
    "asset-passport-owner",
    normalizeCacheAddress(ASSET_PASSPORT_ADDRESS),
  ] as const;

export const getPassportCreatePermissionQueryKey = (address: string) =>
  [
    "passport",
    TARGET_CHAIN_ID,
    "create-permission",
    normalizeCacheAddress(PASSPORT_AUTHORITY_ADDRESS),
    normalizeCacheAddress(address),
  ] as const;

export const getPassportIssueContextQueryKey = (
  address: string,
  passportId: bigint,
  stampTypeId: bigint,
) =>
  [
    "passport",
    TARGET_CHAIN_ID,
    "issue-context",
    normalizeCacheAddress(PASSPORT_AUTHORITY_ADDRESS),
    normalizeCacheAddress(CHRONICLE_STAMP_ADDRESS),
    normalizeCacheAddress(address),
    passportId.toString(),
    stampTypeId.toString(),
  ] as const;

export const getPassportRevokeContextQueryKey = (address: string, stampId: bigint) =>
  [
    "passport",
    TARGET_CHAIN_ID,
    "revoke-context",
    normalizeCacheAddress(PASSPORT_AUTHORITY_ADDRESS),
    normalizeCacheAddress(CHRONICLE_STAMP_ADDRESS),
    normalizeCacheAddress(address),
    stampId.toString(),
  ] as const;
