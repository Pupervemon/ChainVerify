export type Proof = {
  file_hash: string;
  file_name: string;
  file_size: number;
  content_type: string;
  cid: string;
  wallet_address: string;
  tx_hash: string;
  block_number: number;
  timestamp: string;
  source?: "backend" | "chain";
};
