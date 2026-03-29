import React, { useState } from "react";
import { 
  Copy, 
  CheckCircle2, 
  Check,
  ChevronDown, 
  FileCode,
  ShieldCheck,
  Globe,
  ExternalLink,
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

  const statusBadges = [
    { label: "Match", icon: CheckCircle2 },
    { label: "Runtime Bytecode", icon: ShieldCheck },
    { label: "Immutable Record", icon: Globe },
  ];

  const InfoRow = ({ label, value, isLink = false, href = "", copyValue = "", isMonospace = false, isEmphasized = false, rowIndex = 0 }: { 
    label: string; 
    value: string | number; 
    isLink?: boolean; 
    href?: string;
    copyValue?: string;
    isMonospace?: boolean;
    isEmphasized?: boolean;
    rowIndex?: number;
  }) => (
    <div className={`grid grid-cols-1 md:grid-cols-[180px_minmax(0,1fr)] gap-2 md:gap-5 px-6 md:px-8 py-2 md:min-h-[48px] border-b border-slate-100 last:border-0 items-start md:items-center ${rowIndex % 2 === 0 ? "bg-white" : "bg-slate-50/70"}`}>
      <div className="font-['IBM_Plex_Sans',sans-serif] text-[16px] font-bold leading-6 text-[oklch(0.21_0.034_264.665)]">
        {label}
      </div>
      <div className="flex items-center gap-3 min-w-0 mt-1 md:mt-0">
        {isLink ? (
          <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="truncate flex items-center gap-1.5 transition-colors group text-[16px] font-['IBM_Plex_Sans',sans-serif] text-gray-900"
          >
            {value}
            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ) : (
          <span className="truncate text-[16px] font-['IBM_Plex_Sans',sans-serif] text-gray-900">{value}</span>
        )}
        {copyValue && (
          <button 
            onClick={() => copyToClipboard(copyValue, label)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200 hover:text-slate-700 transition-all shrink-0"
            title={`Copy ${label}`}
          >
            {copiedField === label ? <CheckCircle2 size={14} className="text-emerald-600" /> : <Copy size={14} />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-primary-100 pb-20">
      {/* 顶部纯净背景装饰 */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-white to-[#F8FAFC] -z-10" />
      
      {/* 顶部操作条 */}
      <main className="max-w-[1408px] mx-auto px-6 pt-[24px] pb-[96px]">
        {/* 核心认证状态展示 (Hero Success Section) */}
        <div className="flex flex-col items-start text-left mb-6">
          <div className="flex items-start gap-3 mb-1">
            <h1 className="text-base break-all md:text-2xl font-bold font-mono text-gray-900 tracking-tight">
              {proof.file_hash}
            </h1>
            <button
              onClick={() => copyToClipboard(proof.file_hash, "hero-hash")}
              className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200 hover:text-slate-700 transition-all"
              title="Copy proof hash"
            >
              {copiedField === "hero-hash" ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Copy size={16} />}
            </button>
          </div>
          <p className="text-slate-500 text-base font-medium mb-2">On Ethereum Sepolia</p>
          <div className="flex flex-wrap items-center gap-5">
            {statusBadges.map(({ label, icon: Icon }) => (
              <div key={label} className={label === "Match" ? "inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800" : "inline-flex items-center gap-2 text-slate-500"}>
                {label === "Match" ? (
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700 text-white">
                    <Check size={14} strokeWidth={3} />
                  </span>
                ) : (
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
                <span className={label === "Match" ? "text-[14px] font-bold tracking-tight" : "text-[12px] font-medium tracking-tight"}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 认证卡片 */}
        <div className="bg-white rounded-2xl border-0 shadow-sm overflow-hidden mb-10">
          {/* 卡片头部：主要哈希展示 */}
          {/* 卡片详情 */}
          <div>
            <div className="grid grid-cols-1">
              <InfoRow label="Asset Name" value={proof.file_name} rowIndex={0} />
              <InfoRow label="Content Type" value={proof.content_type || "application/octet-stream"} rowIndex={1} />
              <InfoRow label="File Size" value={formatSize(proof.file_size)} rowIndex={2} />
              <InfoRow 
                label="On-Chain Transaction" 
                value={proof.tx_hash ? `${proof.tx_hash.slice(0, 18)}...${proof.tx_hash.slice(-12)}` : "Awaiting Confirmation"} 
                isLink={!!proof.tx_hash}
                href={`https://sepolia.etherscan.io/tx/${proof.tx_hash}`}
                copyValue={proof.tx_hash}
                isMonospace={!!proof.tx_hash}
                isEmphasized={!!proof.tx_hash}
                rowIndex={3}
              />
              <InfoRow label="Block Number" value={proof.block_number || "Awaiting Confirmation"} rowIndex={4} />
              <InfoRow 
                label="IPFS Storage (CID)" 
                value={proof.cid} 
                isLink 
                href={`https://gateway.pinata.cloud/ipfs/${proof.cid}`}
                copyValue={proof.cid}
                isMonospace
                isEmphasized
                rowIndex={5}
              />
              <InfoRow 
                label="Notarized By" 
                value={proof.wallet_address} 
                isLink
                href={`https://sepolia.etherscan.io/address/${proof.wallet_address}`}
                copyValue={proof.wallet_address}
                isMonospace
                isEmphasized
                rowIndex={6}
              />
              <InfoRow 
                label="Timestamp" 
                value={new Date(proof.timestamp).toLocaleString(undefined, { 
                  dateStyle: 'full', 
                  timeStyle: 'medium' 
                })} 
                rowIndex={7}
              />
            </div>
          </div>
        </div>

        {/* 元数据与 ABI (高级视图) */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border-0">
          <button 
            onClick={() => setIsMetadataExpanded(!isMetadataExpanded)}
            className="w-full flex items-center justify-between px-6 md:px-8 py-5 hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-primary-400 transition-colors">
                <FileCode size={20} />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">ABI</h3>
                <p className="text-xs text-slate-500 font-bold">Expand to view</p>
              </div>
            </div>
            <div className={`w-8 h-8 rounded-full border-0 flex items-center justify-center text-slate-500 transition-all ${isMetadataExpanded ? "rotate-180" : ""}`}>
              <ChevronDown size={16} />
            </div>
          </button>
          
          <div className={`transition-all duration-500 ease-in-out ${isMetadataExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}>
            <div className="px-6 pb-8 border-t border-slate-100">
              <div className="relative">
                <pre className="mt-6 text-[12px] font-mono text-slate-700 bg-slate-50 p-6 rounded-xl border-0 overflow-x-auto leading-relaxed scrollbar-hide">
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
                  onClick={() => copyToClipboard(JSON.stringify({ protocol: "DeProof-V1", hash: proof.file_hash, cid: proof.cid }, null, 2), "metadata")}
                  className="absolute top-10 right-4 p-2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <Copy size={16} />
                </button>
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <button className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                  Download JSON Proof
                </button>
                <button className="px-6 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2">
                  <ShieldCheck size={14} /> Verify Contract
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 底部版权/装饰 */}
        <div className="mt-16 flex flex-col items-center gap-6">
           <div className="flex items-center gap-2 text-slate-300">
              <div className="w-10 h-px bg-slate-200" />
              <ShieldCheck size={20} className="opacity-20" />
              <div className="w-10 h-px bg-slate-200" />
           </div>
           <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
             Secured by DeProof Protocol © 2026
           </p>
        </div>
      </main>

      {/* 悬浮功能按钮 (Floating Action Buttons) - 更加现代 */}
    </div>
  );
};

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x...";

export default ProofExplorer;
