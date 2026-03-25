import React, { useState } from "react";
import { Copy, Check, Fingerprint } from "lucide-react";

interface ProfileHeaderProps {
  address: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ address }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateAddress = (addr: string) => {
    if (!addr) return "Wallet not connected";
    if (addr.length <= 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="mb-12 p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Fingerprint size={18} />
          <span className="text-xs font-black uppercase tracking-[0.2em]">Wallet Address</span>
        </div>

        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-black text-[#1a1a1a] font-mono tracking-tight break-all">
            {truncateAddress(address)}
          </h2>
          <button
            onClick={copyToClipboard}
            className="flex-shrink-0 p-3 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-200 cursor-pointer group"
            title="Copy address"
          >
            {copied ? (
              <Check size={20} className="text-emerald-500" />
            ) : (
              <Copy size={20} className="text-slate-400 group-hover:text-[#1677ff]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
