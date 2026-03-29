import axios from "axios";

import { BACKEND_URL } from "../../../config/app";
import type { Proof } from "../../../types/proof";

export async function uploadProofFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${BACKEND_URL}/ipfs/upload?scene=proof`, formData);
  return response.data.data as {
    cid: string;
    file_name: string;
    file_size: number;
    file_hash: `0x${string}`;
  };
}

export async function fetchProofsByWallet(address: string, page = 1) {
  const response = await axios.get(
    `${BACKEND_URL}/proofs?wallet_address=${address}&page=${page}&page_size=10`,
  );

  return response.data?.data as
    | {
        items?: Proof[];
        pagination: {
          page: number;
        };
      }
    | undefined;
}

export async function fetchProofByHash(hash: string) {
  const response = await axios.get(`${BACKEND_URL}/proofs/${encodeURIComponent(hash)}`);
  return response.data?.data as Proof | undefined;
}
