import React, { useState } from "react";
import { 
  Copy, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  FileCode, 
  Info,
  ShieldCheck,
  Globe,
  ArrowLeft,
  Share2,
  Printer
} from "lucide-react";
import type { Proof } from "../types/proof";

interface ProofExplorerProps {
  proof: Proof;
  onBack: () => void;
}

const ProofExplorer: React.FC<ProofExplorerProps> = ({ proof, onBack }) => {
  const [isMetadataExpanded, setIsMetadataExpanded] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const InfoRow = ({ label, value, isLink = false, href = "", copyValue = "" }: { 
    label: string; 
    value: string | number; 
    isLink?: boolean; 
    href?: string;
    copyValue?: string;
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] py-4 border-b border-slate-100 last:border-0 group">
      <div className="flex items-center gap-2 text-slate-500 font-medium text-[13px]">
        <Info size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
        {label}
      </div>
      <div className="flex items-center gap-2 min-w-0">
        {isLink ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-semibold text-[13px] truncate">
            {value}
          </a>
        ) : (
          <span className="text-slate-900 font-semibold text-[13px] truncate">{value}</span>
        )}
        {copyValue && (
          <button 
            onClick={() => copyToClipboard(copyValue, label)}
            className="p-1 hover:bg-slate-100 text-slate-300 hover:text-slate-600 rounded transition-all"
          >
            <Copy size={12} className={copiedField === label ? "text-emerald-500" : ""} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      {/* 顶部导航与 Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-wider mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 font-mono tracking-tight flex items-center gap-2 min-w-0">
              <span className="truncate">{proof.file_hash}</span>
              <button 
                onClick={() => copyToClipboard(proof.file_hash, "hash")}
                className="p-1.5 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-all shadow-sm"
              >
                <Copy size={16} />
              </button>
            </h1>
            <span className="text-slate-400 text-sm font-medium">(Sepolia Network)</span>
          </div>

          {/* 状态栏 Status Bar */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500 text-white rounded-md text-[11px] font-bold shadow-sm shadow-emerald-100">
              <CheckCircle2 size={12} />
              Exact Match
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 border border-emerald-500 text-emerald-600 rounded-md text-[11px] font-bold bg-white">
              <ShieldCheck size={12} />
              Verified On-Chain
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 border border-slate-200 text-slate-500 rounded-md text-[11px] font-bold bg-white">
              <Globe size={12} />
              IPFS Available
            </div>
          </div>
        </div>
      </div>

      {/* 主数据卡片 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="p-6 md:p-8">
            <InfoRow label="Asset Name" value={proof.file_name} />
            <InfoRow label="Content Type" value={proof.content_type || "application/octet-stream"} />
            <InfoRow label="File Size" value={formatSize(proof.file_size)} />
            <InfoRow 
              label="Transaction Hash" 
              value={proof.tx_hash || "Pending..."} 
              isLink={!!proof.tx_hash}
              href={`https://sepolia.etherscan.io/tx/${proof.tx_hash}`}
              copyValue={proof.tx_hash}
            />
            <InfoRow label="Block Number" value={proof.block_number || "Awaiting Confirmation"} />
            <InfoRow 
              label="IPFS CID" 
              value={proof.cid} 
              isLink 
              href={`https://gateway.pinata.cloud/ipfs/${proof.cid}`}
              copyValue={proof.cid}
            />
            <InfoRow 
              label="Wallet Address" 
              value={proof.wallet_address} 
              isLink
              href={`https://sepolia.etherscan.io/address/${proof.wallet_address}`}
              copyValue={proof.wallet_address}
            />
            <InfoRow 
              label="Proof Timestamp" 
              value={new Date(proof.timestamp).toLocaleString(undefined, { 
                dateStyle: 'full', 
                timeStyle: 'medium' 
              })} 
            />
          </div>
        </div>

        {/* 折叠面板 (Accordion) - 元数据/源码部分 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <button 
            onClick={() => setIsMetadataExpanded(!isMetadataExpanded)}
            className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors border-b border-transparent group"
          >
            <div className="flex items-center gap-2.5">
              <FileCode size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
              <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Proof Metadata & Integration ABI</span>
            </div>
            {isMetadataExpanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
          </button>
          
          <div className={`transition-all duration-300 ease-in-out ${isMetadataExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden bg-slate-900`}>
            <div className="p-6">
              <pre className="text-[12px] font-mono text-slate-300 bg-slate-800/50 p-6 rounded-lg border border-slate-700 overflow-x-auto leading-relaxed">
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
              <div className="mt-4 flex gap-3">
                <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors border border-slate-700 px-3 py-1.5 rounded-md hover:border-slate-500">
                  Copy Metadata
                </button>
                <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors border border-slate-700 px-3 py-1.5 rounded-md hover:border-slate-500">
                  Verify Contract Source
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 悬浮圆形功能按钮 (Floating Action Buttons) */}
        <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-50">
          <button 
            title="Print Proof"
            className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 hover:shadow-lg transition-all shadow-md group"
            onClick={() => window.print()}
          >
            <Printer size={20} />
          </button>
          <button 
            title="Share"
            className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 hover:shadow-xl transition-all shadow-lg"
          >
            <Share2 size={20} />
          </button>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-200">
        <p className="text-center text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">
          Secured by DeProof Protocol © 2026
        </p>
      </footer>
    </div>
  );
};

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x...";

export default ProofExplorer;
