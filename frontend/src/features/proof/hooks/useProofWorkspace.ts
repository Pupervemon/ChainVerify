import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { usePublicClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import {
  CONTRACT_ADDRESS,
  PROOF_STORE_ABI,
  isValidAddress,
} from "../../../config/app";
import { computeSHA256Hex } from "../../../lib/crypto";
import type { Proof } from "../../../types/proof";
import { fetchProofByHash, fetchProofsByWallet, uploadProofFile } from "../api/proofApi";

type VerificationResult = {
  status: "idle" | "verifying" | "success" | "mismatch" | "error";
  proof?: Proof;
  message?: string;
};

type UseProofWorkspaceOptions = {
  address?: string;
  isConnected: boolean;
  onStatusChange?: (message: string) => void;
  ensureSupportedChain: () => Promise<boolean>;
  hasCorrectChain: boolean;
};

export function useProofWorkspace(options: UseProofWorkspaceOptions) {
  const { address, ensureSupportedChain, hasCorrectChain, isConnected, onStatusChange } =
    options;
  const publicClient = usePublicClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [isLoadingProofs, setIsLoadingProofs] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [verificationResult, setVerificationResult] = useState<VerificationResult>({
    status: "idle",
  });

  const { writeContractAsync, data: txHash, isPending: isTxPending } = useWriteContract();
  const {
    isLoading: isTxConfirming,
    isSuccess: isTxConfirmed,
    isError: isTxError,
    error: txError,
  } = useWaitForTransactionReceipt({ hash: txHash });

  const isUploading = isTxPending || isTxConfirming;

  const resetSelectedFile = useCallback(() => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const loadOnChainProofs = useCallback(async (): Promise<Proof[]> => {
    if (!publicClient || !address || !isValidAddress(CONTRACT_ADDRESS)) {
      return [];
    }

    try {
      const hashes = (await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: PROOF_STORE_ABI,
        functionName: "getUserProofs",
        args: [address],
      })) as string[];

      const uniqueHashes = Array.from(new Set(hashes));
      const chainProofs = await Promise.all(
        uniqueHashes.map(async (hash): Promise<Proof | null> => {
          try {
            const proof = (await publicClient.readContract({
              address: CONTRACT_ADDRESS as `0x${string}`,
              abi: PROOF_STORE_ABI,
              functionName: "getProofForUser",
              args: [address, hash],
            })) as {
              fileHash: string;
              fileName: string;
              fileSize: bigint;
              contentType: string;
              cid: string;
              walletAddress: string;
              timestamp: bigint;
            };

            return {
              file_hash: proof.fileHash,
              file_name: proof.fileName,
              file_size: Number(proof.fileSize),
              content_type: proof.contentType,
              cid: proof.cid,
              wallet_address: proof.walletAddress,
              tx_hash: "",
              block_number: 0,
              timestamp: new Date(Number(proof.timestamp) * 1000).toISOString(),
              source: "chain",
            };
          } catch {
            return null;
          }
        }),
      );

      return chainProofs.filter((item): item is Proof => item !== null);
    } catch {
      return [];
    }
  }, [address, publicClient]);

  const fetchProofs = useCallback(
    async (page = 1) => {
      if (!address) {
        return;
      }

      setIsLoadingProofs(true);
      let fetchedFromBackend = false;

      try {
        const result = await fetchProofsByWallet(address, page);
        const backendItems = result?.items || [];

        if (backendItems.length > 0) {
          setProofs(backendItems.map((item) => ({ ...item, source: "backend" })));
          setCurrentPage(result?.pagination.page ?? page);
          fetchedFromBackend = true;
        }
      } catch {
        // Preserve the current silent fallback behavior.
      }

      if (!fetchedFromBackend) {
        setProofs(await loadOnChainProofs());
      }

      setIsLoadingProofs(false);
    },
    [address, loadOnChainProofs],
  );

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (!file || !isConnected || !address) {
      return;
    }

    if (!hasCorrectChain && !(await ensureSupportedChain())) {
      return;
    }

    onStatusChange?.("Uploading file to IPFS through the backend...");

    try {
      const { cid, file_name, file_size, file_hash } = await uploadProofFile(file);

      await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: PROOF_STORE_ABI,
        functionName: "storeProof",
        args: [
          file_hash,
          cid,
          file_name,
          BigInt(file_size),
          file.type || "application/octet-stream",
        ],
      });

      onStatusChange?.("Transaction submitted.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed.";
      onStatusChange?.(`Error: ${message}`);
    }
  }, [
    address,
    ensureSupportedChain,
    file,
    hasCorrectChain,
    isConnected,
    onStatusChange,
    writeContractAsync,
  ]);

  const handleVerify = useCallback(async () => {
    if (!file) {
      return;
    }

    setVerificationResult({ status: "verifying" });

    try {
      const fileHash = await computeSHA256Hex(file);
      const proof = await fetchProofByHash(fileHash);

      if (proof) {
        setVerificationResult({
          status: "success",
          proof,
          message: "Verification succeeded. Record found. Redirecting...",
        });
        return;
      }

      setVerificationResult({
        status: "mismatch",
        message: "Verification failed: no matching proof record was found.",
      });
    } catch {
      setVerificationResult({
        status: "mismatch",
        message: "Verification failed: the record does not exist or the network request failed.",
      });
    }
  }, [file]);

  useEffect(() => {
    if (!onStatusChange) {
      return;
    }

    if (isTxConfirmed) {
      onStatusChange("Proof stored successfully. The record is now on-chain.");
    }
  }, [isTxConfirmed, onStatusChange]);

  useEffect(() => {
    if (isTxConfirmed) {
      void fetchProofs(1);
      resetSelectedFile();
    }
  }, [fetchProofs, isTxConfirmed, resetSelectedFile]);

  useEffect(() => {
    if (isTxError && txError) {
      onStatusChange?.(`Transaction failed: ${txError.message}`);
    }
  }, [isTxError, onStatusChange, txError]);

  return {
    currentPage,
    fetchProofs,
    file,
    fileInputRef,
    handleFileChange,
    handleUpload,
    handleVerify,
    isLoadingProofs,
    isTxConfirming,
    isUploading,
    proofs,
    resetSelectedFile,
    setVerificationResult,
    verificationResult,
  };
}
