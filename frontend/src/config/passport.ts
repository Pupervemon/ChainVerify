import AssetPassportContract from "../contracts/passport/AssetPassport.json";
import ChronicleStampContract from "../contracts/passport/ChronicleStamp.json";
import PassportAuthorityContract from "../contracts/passport/PassportAuthority.json";
import PassportFactoryContract from "../contracts/passport/PassportFactory.json";
import { CAN_USE_SYNCED_PASSPORT_DEPLOYMENT } from "./network";

export const ASSET_PASSPORT_ADDRESS =
  import.meta.env.VITE_ASSET_PASSPORT_ADDRESS ||
  (CAN_USE_SYNCED_PASSPORT_DEPLOYMENT ? AssetPassportContract.address || "" : "");
export const CHRONICLE_STAMP_ADDRESS =
  import.meta.env.VITE_CHRONICLE_STAMP_ADDRESS ||
  (CAN_USE_SYNCED_PASSPORT_DEPLOYMENT ? ChronicleStampContract.address || "" : "");
export const PASSPORT_AUTHORITY_ADDRESS =
  import.meta.env.VITE_PASSPORT_AUTHORITY_ADDRESS ||
  (CAN_USE_SYNCED_PASSPORT_DEPLOYMENT ? PassportAuthorityContract.address || "" : "");
export const PASSPORT_FACTORY_ADDRESS =
  import.meta.env.VITE_PASSPORT_FACTORY_ADDRESS ||
  (CAN_USE_SYNCED_PASSPORT_DEPLOYMENT ? PassportFactoryContract.address || "" : "");

export const ASSET_PASSPORT_ABI = AssetPassportContract.abi;
export const CHRONICLE_STAMP_ABI = ChronicleStampContract.abi;
export const PASSPORT_AUTHORITY_ABI = PassportAuthorityContract.abi;
export const PASSPORT_FACTORY_ABI = PassportFactoryContract.abi;

export const PASSPORT_CONTRACTS = {
  assetPassport: ASSET_PASSPORT_ADDRESS,
  chronicleStamp: CHRONICLE_STAMP_ADDRESS,
  passportAuthority: PASSPORT_AUTHORITY_ADDRESS,
  passportFactory: PASSPORT_FACTORY_ADDRESS,
};

export const isPassportAddress = (value: string) => /^0x[a-fA-F0-9]{40}$/.test(value);

export const arePassportContractsConfigured = () =>
  Object.values(PASSPORT_CONTRACTS).every((address) => isPassportAddress(address));
