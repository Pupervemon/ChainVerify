import React, { useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  ExternalLink,
  FileCode,
  ShieldCheck,
} from "lucide-react";

import type { Proof } from "../types/proof";

interface ProofExplorerProps {
  proof: Proof;
  onBack: () => void;
}

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x...";

const statusBadges = [
  { label: "Match", tone: "success" as const },
  { label: "Runtime Bytecode", tone: "neutral" as const },
  { label: "Immutable Record", tone: "neutral" as const },
];

export default function ProofExplorer({ proof, onBack }: ProofExplorerProps) {
  const [isMetadataExpanded, setIsMetadataExpanded] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const InfoRow = ({
    label,
    value,
    isLink = false,
    href = "",
    copyValue = "",
    rowIndex = 0,
  }: {
    label: string;
    value: string | number;
    isLink?: boolean;
    href?: string;
    copyValue?: string;
    rowIndex?: number;
  }) => (
    <div
      className={`grid grid-cols-1 items-start gap-2 border-b border-slate-100 px-4 py-4 last:border-0 sm:px-6 md:min-h-[48px] md:grid-cols-[180px_minmax(0,1fr)] md:items-center md:gap-5 md:px-8 md:py-3 ${
        rowIndex % 2 === 0 ? "bg-white" : "bg-slate-50/70"
      }`}
    >
      <div className="text-sm font-bold leading-6 text-slate-900 sm:text-base">{label}</div>
      <div className="mt-1 flex min-w-0 items-start gap-3 md:mt-0 md:items-center">
        {isLink ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-w-0 items-center gap-1.5 break-all text-sm text-gray-900 transition-colors group sm:text-base md:truncate"
          >
            {value}
            <ExternalLink size={12} className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
          </a>
        ) : (
          <span className="min-w-0 break-all text-sm text-gray-900 sm:text-base md:truncate">
            {value}
          </span>
        )}
        {copyValue ? (
          <button
            onClick={() => copyToClipboard(copyValue, label)}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-700"
            title={`Copy ${label}`}
          >
            {copiedField === label ? (
              <CheckCircle2 size={14} className="text-emerald-600" />
            ) : (
              <Copy size={14} />
            )}
          </button>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans selection:bg-primary-100">
      <div className="absolute left-0 top-0 -z-10 h-[400px] w-full bg-gradient-to-b from-white to-[#F8FAFC]" />

      <main className="mx-auto max-w-[1408px] px-4 pb-16 pt-6 sm:px-6 sm:pb-20 md:pb-24">
        <div className="mb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600 transition-all hover:border-orange-200 hover:text-orange-600"
          >
            <ArrowLeft size={14} />
            Back
          </button>
        </div>

        <div className="mb-6 flex flex-col items-start text-left sm:mb-8">
          <div className="mb-2 flex w-full items-start gap-3">
            <h1 className="break-all font-mono text-sm font-bold tracking-tight text-gray-900 sm:text-lg md:text-2xl">
              {proof.file_hash}
            </h1>
            <button
              onClick={() => copyToClipboard(proof.file_hash, "hero-hash")}
              className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-700"
              title="Copy proof hash"
            >
              {copiedField === "hero-hash" ? (
                <CheckCircle2 size={16} className="text-emerald-600" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>

          <p className="mb-3 text-sm font-medium text-slate-500 sm:text-base">On Ethereum Sepolia</p>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-5">
            {statusBadges.map(({ label, tone }) => (
              <div
                key={label}
                className={
                  tone === "success"
                    ? "inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-800 sm:px-4"
                    : "inline-flex items-center gap-2 text-slate-500"
                }
              >
                {tone === "success" ? (
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700 text-white">
                    <Check size={14} strokeWidth={3} />
                  </span>
                ) : (
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
                <span
                  className={
                    tone === "success"
                      ? "text-[13px] font-bold tracking-tight sm:text-[14px]"
                      : "text-[11px] font-medium tracking-tight sm:text-[12px]"
                  }
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 overflow-hidden rounded-[1.75rem] bg-white shadow-sm sm:mb-10 sm:rounded-2xl">
          <div className="grid grid-cols-1">
            <InfoRow label="Asset Name" value={proof.file_name} rowIndex={0} />
            <InfoRow label="Content Type" value={proof.content_type || "application/octet-stream"} rowIndex={1} />
            <InfoRow label="File Size" value={formatSize(proof.file_size)} rowIndex={2} />
            <InfoRow
              label="On-Chain Transaction"
              value={
                proof.tx_hash
                  ? `${proof.tx_hash.slice(0, 18)}...${proof.tx_hash.slice(-12)}`
                  : "Awaiting Confirmation"
              }
              isLink={!!proof.tx_hash}
              href={`https://sepolia.etherscan.io/tx/${proof.tx_hash}`}
              copyValue={proof.tx_hash}
              rowIndex={3}
            />
            <InfoRow label="Block Number" value={proof.block_number || "Awaiting Confirmation"} rowIndex={4} />
            <InfoRow
              label="IPFS Storage (CID)"
              value={proof.cid}
              isLink
              href={`https://gateway.pinata.cloud/ipfs/${proof.cid}`}
              copyValue={proof.cid}
              rowIndex={5}
            />
            <InfoRow
              label="Notarized By"
              value={proof.wallet_address}
              isLink
              href={`https://sepolia.etherscan.io/address/${proof.wallet_address}`}
              copyValue={proof.wallet_address}
              rowIndex={6}
            />
            <InfoRow
              label="Timestamp"
              value={new Date(proof.timestamp).toLocaleString(undefined, {
                dateStyle: "full",
                timeStyle: "medium",
              })}
              rowIndex={7}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm sm:rounded-2xl">
          <button
            onClick={() => setIsMetadataExpanded(!isMetadataExpanded)}
            className="group flex w-full items-center justify-between px-4 py-4 transition-colors hover:bg-slate-50 sm:px-6 md:px-8 md:py-5"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-hover:text-primary-400">
                <FileCode size={20} />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">ABI</h3>
                <p className="text-xs font-bold text-slate-500">Expand to view</p>
              </div>
            </div>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-all ${
                isMetadataExpanded ? "rotate-180" : ""
              }`}
            >
              <ChevronDown size={16} />
            </div>
          </button>

          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isMetadataExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="border-t border-slate-100 px-4 pb-6 sm:px-6 sm:pb-8 md:px-8">
              <div className="relative">
                <pre className="scrollbar-hide mt-6 overflow-x-auto rounded-xl bg-slate-50 p-4 font-mono text-[11px] leading-relaxed text-slate-700 sm:p-6 sm:text-[12px]">
{`{
  "protocol": "DeProof-V1",
  "hashing_algorithm": "SHA-256",
  "storage": "IPFS",
  "file_identity": {
    "hash": "${proof.file_hash}",
    "cid": "${proof.cid}"
  },
  "blockchain_context": {
    "chain_id": 11155111,
    "network": "Ethereum Sepolia",
    "contract": "${CONTRACT_ADDRESS}"
  }
}`}
                </pre>
                <button
                  onClick={() =>
                    copyToClipboard(
                      JSON.stringify(
                        { protocol: "DeProof-V1", hash: proof.file_hash, cid: proof.cid },
                        null,
                        2,
                      ),
                      "metadata",
                    )
                  }
                  className="absolute right-3 top-8 p-2 text-slate-400 transition-colors hover:text-slate-700 sm:right-4 sm:top-10"
                >
                  <Copy size={16} />
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <button className="rounded-xl bg-slate-900 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-slate-800 sm:px-6 sm:py-2.5">
                  Download JSON Proof
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all hover:border-slate-300 hover:text-slate-900 sm:px-6 sm:py-2.5">
                  <ShieldCheck size={14} />
                  Verify Contract
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-6 sm:mt-16">
          <div className="flex items-center gap-2 text-slate-300">
            <div className="h-px w-10 bg-slate-200" />
            <ShieldCheck size={20} className="opacity-20" />
            <div className="h-px w-10 bg-slate-200" />
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
            Secured by DeProof Protocol 2026
          </p>
        </div>
      </main>
    </div>
  );
}
