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

  return (
    <div className="mb-12 p-10 bg-gradient-to-br from-white to-slate-50/50 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-orange-500/10 transition-colors" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/5 rounded-full -ml-32 -mb-32 blur-3xl group-hover:bg-red-500/10 transition-colors" />
      
      <div className="relative flex flex-col gap-6">
        <div className="flex items-center gap-3 text-orange-500">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Fingerprint size={20} />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.3em]">Account Identity</span>
        </div>

        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm md:text-base font-black text-slate-900 font-mono tracking-tight break-all leading-tight">
                {address || "Not Connected"}
              </h2>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center justify-center p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-xl transition-all border border-slate-200 hover:border-orange-200 shadow-sm active:scale-95 group/btn"
              >
                {copied ? (
                  <Check size={16} className="text-emerald-500" />
                ) : (
                  <Copy size={16} className="group-hover/btn:text-orange-500 transition-colors" />
                )}
              </button>
            </div>
            <p className="text-slate-400 text-sm font-medium">Secured by Ethereum Smart Contracts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
