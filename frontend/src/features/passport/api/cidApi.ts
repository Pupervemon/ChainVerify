import axios from "axios";

import { BACKEND_URL } from "../../../config/app";

type UploadCidOptions = {
  metadata?: Record<string, string>;
};

export type UploadCidResult = {
  cid: string;
  file_hash: `0x${string}`;
  file_name: string;
  file_size: number;
  gateway_url: string;
};

export async function uploadCidFile(file: File, options: UploadCidOptions = {}) {
  const formData = new FormData();
  formData.append("file", file);

  if (options.metadata && Object.keys(options.metadata).length > 0) {
    formData.append("metadata", JSON.stringify(options.metadata));
  }

  const response = await axios.post(`${BACKEND_URL}/ipfs/upload`, formData);
  return response.data.data as UploadCidResult;
}
