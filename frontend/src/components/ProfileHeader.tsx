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
    <div className="group relative mb-8 overflow-hidden rounded-[2rem] border border-slate-100 bg-gradient-to-br from-white to-slate-50/50 p-5 shadow-sm sm:mb-10 sm:rounded-[2.5rem] sm:p-8 lg:mb-12 lg:p-10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-orange-500/10 transition-colors" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/5 rounded-full -ml-32 -mb-32 blur-3xl group-hover:bg-red-500/10 transition-colors" />
      
      <div className="relative flex flex-col gap-6">
        <div className="flex items-center gap-3 text-orange-500">
          <div className="rounded-lg bg-orange-100 p-2">
            <Fingerprint size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.28em] sm:text-[11px]">
            Account Identity
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <h2 className="break-all font-mono text-sm leading-tight font-black tracking-tight text-slate-900 sm:text-base">
                {address || "Not Connected"}
              </h2>
              <button
                onClick={copyToClipboard}
                className="group/btn inline-flex w-fit items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition-all hover:border-orange-200 hover:bg-slate-50 active:scale-95"
              >
                {copied ? (
                  <Check size={16} className="text-emerald-500" />
                ) : (
                  <Copy size={16} className="group-hover/btn:text-orange-500 transition-colors" />
                )}
              </button>
            </div>
            <p className="text-sm font-medium text-slate-400">
              Secured by Ethereum Smart Contracts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
