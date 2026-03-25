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
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 animate-pulse">
          <ShieldCheck size={32} />
        </div>
        <div className="flex items-center gap-3 text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">
          <Loader2 size={16} className="animate-spin" />
          Synchronizing Ledger Data
        </div>
      </div>
    );
  }

  if (error || !proof) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-red-50 rounded-[2.5rem] flex items-center justify-center text-red-500 mb-8">
          <AlertCircle size={40} strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4">Verification Error</h2>
        <p className="text-slate-500 text-center max-w-md font-medium leading-relaxed mb-10">
          {error || "We couldn't find any record matching this cryptographic fingerprint."}
        </p>
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl"
        >
          <ArrowLeft size={16} />
          Return to Notary
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部简单的面包屑导航 */}
      <nav className="border-b border-slate-50 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/")}>
             <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                <ShieldCheck size={18} />
             </div>
             <span className="font-black tracking-tighter text-xl text-slate-900">DeProof <span className="text-primary-600">Explorer</span></span>
          </div>
          <div className="flex items-center gap-6">
             <button 
               onClick={() => navigate("/zkp")}
               className="text-[11px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors"
             >
               ZKP
             </button>
             <button 
               onClick={() => navigate("/doc")}
               className="text-[11px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors"
             >
               DOC
             </button>
             <button 
               onClick={() => navigate("/dashboard")}
               className="text-[11px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors"
             >
               Dashboard
             </button>
             <button 
               onClick={() => navigate("/")}
               className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
             >
               New Proof
             </button>
          </div>
        </div>
      </nav>

      <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <ProofExplorer proof={proof} onBack={() => navigate(-1)} />
      </main>
      
      {/* 底部装饰 */}
      <footer className="max-w-6xl mx-auto px-4 py-20 border-t border-slate-50">
         <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="space-y-4 text-center md:text-left">
               <p className="text-xs font-black text-slate-300 uppercase tracking-[0.3em]">Institutional Grade Security</p>
               <h4 className="text-slate-900 font-bold max-w-sm">Every document secured via DeProof is permanently etched into the Ethereum blockchain.</h4>
            </div>
            <div className="flex gap-10">
               <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol</p>
                  <p className="text-sm font-bold text-slate-600">IPFS / Filecoin</p>
               </div>
               <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network</p>
                  <p className="text-sm font-bold text-slate-600">Sepolia (Testnet)</p>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default ProofPage;
