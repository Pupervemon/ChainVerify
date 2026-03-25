import React from "react";
import { 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Hash, 
  Database, 
  Link as LinkIcon, 
  ExternalLink, 
  Copy,
  Info
} from "lucide-react";
import type { Proof } from "../types/proof";

interface ProofDetailProps {
  proof: Proof;
  onDismiss?: () => void;
  className?: string;
}

const ProofDetail: React.FC<ProofDetailProps> = ({ proof, onDismiss, className = "" }) => {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const truncateAddress = (addr: string) => 
    addr ? `${addr.slice(0, 10)}...${addr.slice(-8)}` : "N/A";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // 这里可以添加一个小的成功提示
  };

  return (
    <div className={`mt-8 animate-in fade-in slide-in-from-top-4 duration-500 ${className}`}>
      <div className="bg-emerald-50/50 backdrop-blur-md rounded-[2.5rem] border-2 border-emerald-100 p-8 relative overflow-hidden group shadow-sm">
        {/* 背景装饰图标 */}
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
          <CheckCircle2 size={160} className="text-emerald-600" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-200/50">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 className="text-lg font-black text-emerald-900 uppercase tracking-tight">Authenticity Verified</h3>
                <p className="text-xs font-bold text-emerald-600/70 uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Secured on Ethereum via DeProof
                </p>
              </div>
            </div>
            
            {onDismiss && (
              <button 
                onClick={onDismiss}
                className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors py-2 px-4 rounded-xl hover:bg-red-50"
              >
                Dismiss
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* 左侧：文件元数据 */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Info size={12} className="opacity-70" />
                    File Identity
                  </span>
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-2xl border border-emerald-100/50 shadow-inner">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-800 truncate">{proof.file_name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {formatSize(proof.file_size)} • {proof.content_type || "Unknown Type"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Timestamp</span>
                  <div className="flex items-center gap-2.5 text-slate-700 bg-white/40 self-start px-3 py-2 rounded-xl border border-emerald-100/30">
                    <Calendar size={16} className="text-emerald-500" />
                    <span className="font-bold text-sm">
                      {new Date(proof.timestamp).toLocaleString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cryptographic Fingerprint</span>
                  <div className="flex items-center gap-2 group/hash">
                    <Hash size={16} className="text-emerald-500 shrink-0" />
                    <code className="text-[11px] font-mono bg-white/80 px-3 py-2 rounded-xl border border-emerald-100 text-emerald-900 shadow-sm break-all">
                      {proof.file_hash}
                    </code>
                    <button 
                      onClick={() => copyToClipboard(proof.file_hash)}
                      className="p-2 hover:bg-emerald-100/50 hover:text-emerald-600 text-slate-300 rounded-lg transition-all shrink-0"
                      title="Copy Hash"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：区块链与存储证明 */}
            <div className="space-y-6">
              <div className="space-y-5">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Storage Proof (IPFS)</span>
                  <div className="p-4 bg-primary-50/30 border border-primary-100 rounded-2xl group/link relative">
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-2 text-primary-700">
                          <Database size={18} />
                          <span className="font-black text-xs uppercase tracking-tight">IPFS CID</span>
                       </div>
                       <a 
                        href={`https://gateway.pinata.cloud/ipfs/${proof.cid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-white rounded-lg border border-primary-100 text-primary-600 hover:bg-primary-600 hover:text-white transition-all shadow-sm"
                        title="View on IPFS"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                    <code className="block text-[10px] font-mono text-primary-800/80 break-all bg-white/40 p-2 rounded-lg">
                      {proof.cid}
                    </code>
                  </div>
                </div>

                {proof.tx_hash ? (
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">On-Chain Transaction</span>
                    <a 
                      href={`https://sepolia.etherscan.io/tx/${proof.tx_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-white/60 border border-slate-100 rounded-2xl hover:border-primary-200 transition-all group/tx shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100/50 rounded-lg flex items-center justify-center text-primary-600">
                          <LinkIcon size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-slate-900 truncate">Transaction Hash</p>
                          <p className="font-mono text-[10px] text-slate-400">{truncateAddress(proof.tx_hash)}</p>
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-slate-300 group-hover/tx:text-primary-500 group-hover/tx:translate-x-0.5 group-hover/tx:-translate-y-0.5 transition-all" />
                    </a>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">On-Chain Status</span>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-400 italic text-[11px]">
                      <Info size={14} />
                      Synced via smart contract event
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span>Block Height</span>
                    <span className="text-slate-900">{proof.block_number || "Pending"}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-emerald-500 w-full opacity-30"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProofDetail;
