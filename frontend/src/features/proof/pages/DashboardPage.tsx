import { ChevronRight, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import ProfileHeader from "../../../components/ProfileHeader";
import type { Proof } from "../../../types/proof";

type DashboardPageProps = {
  address: string;
  currentPage: number;
  isLoadingProofs: boolean;
  onRefresh: (page: number) => void | Promise<void>;
  proofs: Proof[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};

export default function DashboardPage(props: DashboardPageProps) {
  const { address, currentPage, isLoadingProofs, onRefresh, proofs, searchQuery, setSearchQuery } =
    props;
  const navigate = useNavigate();

  const truncateAddress = (value: string) => `${value.slice(0, 6)}...${value.slice(-4)}`;
  const filteredProofs = proofs.filter((proof) =>
    proof.file_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="space-y-12">
        <ProfileHeader address={address} />

        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="space-y-2">
              <h3 className="text-3xl font-black tracking-tight text-slate-900">
                Recent Proofs
              </h3>
              <p className="font-medium text-slate-500">
                Manage and verify your notarized digital assets
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="group relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-orange-500"
                />
                <input
                  type="text"
                  placeholder="Search by file name..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-2xl border border-transparent bg-slate-100 py-3 pl-12 pr-6 text-sm font-bold placeholder:text-slate-400 transition-all focus:border-orange-500/20 focus:bg-white focus:outline-none md:w-80"
                />
              </div>
              <button
                onClick={() => onRefresh(currentPage)}
                disabled={isLoadingProofs}
                className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 transition-all hover:border-orange-100 hover:bg-slate-50 hover:text-orange-500 active:scale-95 disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw size={20} className={isLoadingProofs ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="border-b border-slate-100 px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Document
                    </th>
                    <th className="border-b border-slate-100 px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                      File Hash
                    </th>
                    <th className="border-b border-slate-100 px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Timestamp
                    </th>
                    <th className="border-b border-slate-100 px-8 py-5 text-right text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredProofs.length > 0 ? (
                    filteredProofs.map((proof) => (
                      <tr
                        key={proof.file_hash}
                        className="group transition-all hover:bg-orange-50/30"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition-colors group-hover:bg-white group-hover:text-orange-500">
                              <ShieldCheck size={20} />
                            </div>
                            <span className="line-clamp-1 font-bold text-slate-900">
                              {proof.file_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-6 font-mono text-xs text-slate-400 transition-colors group-hover:text-slate-600">
                          {truncateAddress(proof.file_hash)}
                        </td>
                        <td className="px-6 py-6 text-sm font-medium text-slate-500">
                          {new Date(proof.timestamp).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button
                            onClick={() => navigate(`/proof/${proof.file_hash}`)}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-slate-500 transition-all hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 active:scale-95"
                          >
                            View Details
                            <ChevronRight size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                            <Search size={32} />
                          </div>
                          <div className="space-y-1">
                            <p className="font-bold text-slate-900">No proofs found</p>
                            <p className="text-sm text-slate-400">
                              Start by notarizing your first document on the home page.
                            </p>
                          </div>
                          <Link
                            to="/"
                            className="mt-4 rounded-full border border-orange-200 bg-white px-6 py-2 text-xs font-black uppercase tracking-widest text-orange-600 transition-colors hover:bg-orange-50"
                          >
                            Go to Notary
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
