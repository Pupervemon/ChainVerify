import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Loader2, 
  AlertCircle, 
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import ProofExplorer from "../components/ProofExplorer";
import type { Proof } from "../types/proof";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1";

const ProofPage: React.FC = () => {
  const { hash } = useParams<{ hash: string }>();
  const navigate = useNavigate();
  const [proof, setProof] = useState<Proof | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProof = async () => {
      if (!hash) return;
      setLoading(true);
      try {
        const res = await axios.get(`${BACKEND_URL}/proofs/${encodeURIComponent(hash)}`);
        if (res.data && res.data.data) {
          setProof(res.data.data);
        } else {
          setError("Proof not found.");
        }
      } catch (err: any) {
        console.error("Failed to fetch proof:", err);
        setError(err.response?.status === 404 ? "The requested proof does not exist on the blockchain." : "Failed to load proof data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProof();
  }, [hash]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary-100 blur-2xl rounded-full scale-150 animate-pulse" />
          <div className="relative w-20 h-20 bg-primary-50 rounded-[2rem] flex items-center justify-center text-primary-600">
            <ShieldCheck size={40} className="animate-bounce" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-[0.3em] text-[10px]">
            <Loader2 size={14} className="animate-spin text-primary-600" />
            Synchronizing Ledger
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Querying Ethereum Node...</p>
        </div>
      </div>
    );
  }

  if (error || !proof) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl shadow-red-100 flex items-center justify-center text-red-500 mb-10 border border-red-50">
          <AlertCircle size={44} strokeWidth={1.5} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Verification Error</h2>
        <p className="text-slate-500 text-center max-w-md font-medium leading-relaxed mb-12">
          {error || "We couldn't find any record matching this cryptographic fingerprint in our decentralized database."}
        </p>
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-primary-600 transition-all shadow-2xl hover:shadow-primary-200 active:scale-95"
        >
          <ArrowLeft size={16} />
          Return to Notary
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 独立布局 (Blank Layout) - 不包含全局导航，由 ProofExplorer 提供内部导航 */}
      <main className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
        <ProofExplorer proof={proof} onBack={() => navigate("/")} />
      </main>
    </div>
  );
};

export default ProofPage;
