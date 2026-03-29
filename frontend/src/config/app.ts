import ProofStoreContract from "../contracts/ProofStore.json";

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";
export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1";
export const LAST_WALLET_ADDRESS_KEY = "deproof:last-wallet-address";
export const PROOF_STORE_ABI = ProofStoreContract.abi;

export const isValidAddress = (value: string) => /^0x[a-fA-F0-9]{40}$/.test(value);
