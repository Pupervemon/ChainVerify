import { keccak256, stringToHex } from "viem";

export function normalizeAssetIdentifier(value: string): string {
  return value.trim();
}

export function deriveAssetFingerprint(assetIdentifier: string): `0x${string}` {
  return keccak256(stringToHex(normalizeAssetIdentifier(assetIdentifier)));
}
