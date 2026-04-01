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
  const formatTimestamp = (value: string) =>
    new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  const filteredProofs = proofs.filter((proof) =>
    proof.file_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="space-y-8 lg:space-y-12">
        <ProfileHeader address={address} />

        <div className="space-y-5 sm:space-y-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Recent Proofs
              </h3>
              <p className="max-w-2xl text-sm font-medium text-slate-500 sm:text-base">
                Manage and verify your notarized digital assets
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:self-start lg:self-auto">
              <div className="group relative min-w-0 flex-1 sm:min-w-[18rem]">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-orange-500"
                />
                <input
                  type="text"
                  placeholder="Search by file name..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-2xl border border-transparent bg-slate-100 py-3 pl-12 pr-4 text-sm font-bold placeholder:text-slate-400 transition-all focus:border-orange-500/20 focus:bg-white focus:outline-none sm:pr-6 lg:w-80"
                />
              </div>
              <button
                onClick={() => onRefresh(currentPage)}
                disabled={isLoadingProofs}
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center self-start rounded-2xl border border-slate-200 bg-white text-slate-600 transition-all hover:border-orange-100 hover:bg-slate-50 hover:text-orange-500 active:scale-95 disabled:opacity-50 sm:self-auto"
                title="Refresh data"
              >
                <RefreshCw size={20} className={isLoadingProofs ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm sm:rounded-[2.5rem]">
            <div className="hidden overflow-x-auto lg:block">
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
                          {formatTimestamp(proof.timestamp)}
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

            <div className="divide-y divide-slate-100 lg:hidden">
              {filteredProofs.length > 0 ? (
                filteredProofs.map((proof) => (
                  <article
                    key={proof.file_hash}
                    className="space-y-5 px-4 py-5 sm:px-6 sm:py-6"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <ShieldCheck size={20} />
                      </div>
                      <div className="min-w-0 space-y-2">
                        <p className="line-clamp-2 text-sm font-bold text-slate-900 sm:text-base">
                          {proof.file_name}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-orange-600">
                            Proof Record
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-500">
                            {formatTimestamp(proof.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <dl className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <dt className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                          File Hash
                        </dt>
                        <dd className="mt-2 font-mono text-xs text-slate-600">
                          {truncateAddress(proof.file_hash)}
                        </dd>
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <dt className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                          Timestamp
                        </dt>
                        <dd className="mt-2 text-sm font-semibold text-slate-600">
                          {formatTimestamp(proof.timestamp)}
                        </dd>
                      </div>
                    </dl>

                    <button
                      onClick={() => navigate(`/proof/${proof.file_hash}`)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-[11px] font-black uppercase tracking-widest text-slate-500 transition-all hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 active:scale-95 sm:w-auto"
                    >
                      View Details
                      <ChevronRight size={14} />
                    </button>
                  </article>
                ))
              ) : (
                <div className="px-6 py-16">
                  <div className="flex flex-col items-center gap-4 text-center">
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
