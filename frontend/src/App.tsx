import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { 
  Upload, 
  FileText, 
  Loader2,
  AlertCircle,
  LayoutDashboard,
  Globe,
  BookOpen,
  Briefcase,
  ShieldCheck,
  Box,
  Clock,
  ChevronRight,
  ExternalLink,
  Copy,
  CheckCircle2,
  Database,
  Search,
  Wallet,
  RefreshCw,
  LogOut,
  X
} from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { 
  useAccount, 
  useWriteContract, 
  useWaitForTransactionReceipt,
  usePublicClient,
  useDisconnect
} from "wagmi";
import Banner from "./components/Banner";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1";

const ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_fileHash", "type": "string" },
      { "internalType": "string", "name": "_fileName", "type": "string" },
      { "internalType": "uint256", "name": "_fileSize", "type": "uint256" },
      { "internalType": "string", "name": "_contentType", "type": "string" },
      { "internalType": "string", "name": "_cid", "type": "string" }
    ],
    "name": "storeProof",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

interface Proof {
  file_hash: string;
  file_name: string;
  file_size: number;
  content_type: string;
  cid: string;
  wallet_address: string;
  tx_hash: string;
  block_number: number;
  timestamp: string;
}

interface Pagination {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

async function computeSHA256Hex(file: File) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return `0x${hashHex}`;
}

function App() {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const publicClient = usePublicClient();
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"notary" | "dashboard">("notary");
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  
  // Dashboard state
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [isLoadingProofs, setIsLoadingProofs] = useState(false);
  const [stats, setStats] = useState({ total: 0, storage: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const { writeContractAsync, data: txHash, isPending: isTxPending } = useWriteContract();
  const { data: receipt, isLoading: isTxConfirming, isSuccess: isTxConfirmed, isError: isTxError, error: txError } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const isUploading = isTxPending || isTxConfirming;

  const fetchProofs = useCallback(async (page = 1) => {
    if (!address) return;
    setIsLoadingProofs(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/proofs?wallet_address=${address}&page=${page}&page_size=10`);
      if (res.data && res.data.data) {
        setProofs(res.data.data.items || []);
        setPagination(res.data.data.pagination);
        setCurrentPage(res.data.data.pagination.page);
        setStats(prev => ({
          ...prev,
          total: res.data.data.pagination.total
        }));
        if (page === 1) {
          const totalSize = (res.data.data.items || []).reduce((acc: number, item: Proof) => acc + item.file_size, 0);
          setStats(prev => ({ ...prev, storage: totalSize }));
        }
      }
    } catch (err) {
      console.error("Failed to fetch proofs:", err);
    } finally {
      setIsLoadingProofs(false);
    }
  }, [address]);

  useEffect(() => {
    if (activeTab === "dashboard" && isConnected) {
      fetchProofs(1);
    }
  }, [activeTab, isConnected, fetchProofs]);

  useEffect(() => {
    if (isTxConfirmed) {
      if (receipt?.status === 'success') {
        setUploadStatus("Success! Your proof is permanently stored.");
        setTimeout(() => setUploadStatus(""), 5000);
        setFile(null);
        if (activeTab === "dashboard") fetchProofs(currentPage);
      } else {
        setUploadStatus("Transaction reverted on-chain. Please check the explorer.");
      }
    }
  }, [isTxConfirmed, receipt, activeTab, fetchProofs, currentPage]);

  useEffect(() => {
    if (isTxError) {
      setUploadStatus(`Transaction failed: ${txError?.message || "Unknown error"}`);
    }
  }, [isTxError, txError]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    if (!isConnected || !address) return alert("Please connect your wallet first.");

    setUploadStatus("Uploading to IPFS via backend...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const uploadRes = await axios.post(`${BACKEND_URL}/store/upload`, formData);
      
      if (!uploadRes.data || !uploadRes.data.data) {
        throw new Error("Invalid response from server");
      }

      const { cid, file_name, file_size } = uploadRes.data.data;

      setUploadStatus("Calculating cryptographic hash...");
      const fileHash = await computeSHA256Hex(file);

      if (publicClient) {
        setUploadStatus("Simulating transaction...");
        try {
          await publicClient.simulateContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: ABI,
            functionName: 'storeProof',
            args: [fileHash, file_name, BigInt(file_size), file.type || "application/octet-stream", cid],
            account: address,
          });
          setUploadStatus("Simulation successful! Preparing for signature...");
        } catch (simError: any) {
          console.error("Simulation failed:", simError);
          throw new Error(`Simulation failed: ${simError.shortMessage || simError.message || "The transaction is likely to revert."}`);
        }
      }

      setUploadStatus("Awaiting MetaMask confirmation...");
      
      await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: ABI,
        functionName: 'storeProof',
        args: [fileHash, file_name, BigInt(file_size), file.type || "application/octet-stream", cid],
      });

      setUploadStatus("Transaction sent! Waiting for blockchain confirmation...");
    } catch (error: any) {
      console.error("Upload process error:", error);
      setUploadStatus(`Error: ${error.shortMessage || error.message || "Something went wrong"}`);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;

  const filteredProofs = proofs.filter(p => 
    p.file_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.file_hash.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white overflow-x-hidden selection:bg-primary-100 selection:text-primary-900 font-sans text-[#111827]">
      <Banner />
      {/* Navigation */}
      <nav className="bg-white/60 backdrop-blur-xl sticky top-0 z-50 select-none border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-12">
              <div className="flex items-center cursor-pointer group" onClick={() => setActiveTab("notary")}>
                <span className="text-2xl font-black tracking-tighter group-hover:text-primary-600 transition-colors">DeProof</span>
              </div>
              
              <div className="hidden md:flex items-center gap-10">
                <button 
                  onClick={() => { setActiveTab("notary"); setIsAccountMenuOpen(false); }}
                  className={`flex items-center gap-2 text-[15px] font-bold transition-all relative ${
                    activeTab === "notary" 
                    ? "text-primary-600 after:absolute after:bottom-[-28px] after:left-0 after:w-full after:h-[3px] after:bg-primary-600 after:rounded-full" 
                    : "text-slate-400 hover:text-primary-600"
                  }`}
                >
                  Notary
                </button>
                <button 
                  onClick={() => { setActiveTab("dashboard"); setIsAccountMenuOpen(false); }}
                  className={`flex items-center gap-2 text-[15px] font-bold transition-all relative ${
                    activeTab === "dashboard" 
                    ? "text-primary-600 after:absolute after:bottom-[-28px] after:left-0 after:w-full after:h-[3px] after:bg-primary-600 after:rounded-full" 
                    : "text-slate-400 hover:text-primary-600"
                  }`}
                >
                  Dashboard
                </button>
                <a href="#" className="flex items-center gap-2 text-[15px] font-bold text-slate-400 hover:text-primary-600 transition-all">
                  Explorer
                </a>
                <a href="#" className="flex items-center gap-2 text-[15px] font-bold text-slate-400 hover:text-primary-600 transition-all">
                  Docs
                </a>
              </div>
            </div>

            <div className="flex items-center">
              <ConnectButton.Custom>
                {({ account, openConnectModal, mounted }) => {
                  const ready = mounted;
                  const connected = ready && account;
                  return (
                    <div {...(!ready && { 'aria-hidden': true, 'style': { opacity: 0, pointerEvents: 'none', userSelect: 'none' } })}>
                      {(() => {
                        if (!connected) {
                          return (
                            <button onClick={openConnectModal} type="button" className="text-primary-600 font-extrabold text-sm hover:text-primary-700 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-primary-600/30 after:transition-all hover:after:bg-primary-700 cursor-pointer">
                              Connect Wallet
                            </button>
                          );
                        }
                        return (
                          <div className="relative">
                            <button 
                              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)} 
                              type="button" 
                              className="flex items-center gap-3 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-full transition-all group"
                            >
                              <div className="w-6 h-6 rounded-lg overflow-hidden shadow-sm bg-white flex items-center justify-center border border-slate-100 transition-none">
                                {account.iconUrl ? (
                                  <img alt={account.displayName} src={account.iconUrl} className="w-full h-full object-cover" />
                                ) : (
                                  <Wallet size={14} className="text-primary-600" />
                                )}
                              </div>
                              <span className="text-primary-600 font-bold text-sm uppercase tracking-tight">
                                {account.address ? truncateAddress(account.address) : account.displayName}
                              </span>
                            </button>

                            {isAccountMenuOpen && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsAccountMenuOpen(false)} />
                                <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-100 rounded-xl shadow-lg shadow-slate-200/40 p-1.5 z-20 animate-in fade-in zoom-in-95 duration-200">
                                  <button
                                    onClick={() => {
                                      disconnect();
                                      setIsAccountMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs font-bold group/item"
                                  >
                                    <div className="w-6 h-6 bg-red-100/50 rounded-md flex items-center justify-center text-red-600 group-hover/item:bg-red-100 transition-colors">
                                      <LogOut size={14} />
                                    </div>
                                    Disconnect
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          </div>
        </div>
      </nav>

      {activeTab === "notary" ? (
        <main className="relative flex flex-col items-center pt-32 pb-48 px-4 min-h-[calc(100vh-80px)]">
          {uploadStatus && (
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-top-4 duration-300">
              <div className={`flex items-center gap-3 px-4 py-2 rounded-full border shadow-xl backdrop-blur-xl ${
                uploadStatus.includes("Error") 
                ? "bg-red-50/90 border-red-100 text-red-700" 
                : "bg-white/90 border-slate-100 text-slate-700"
              }`}>
                {uploadStatus.includes("Error") ? (
                  <AlertCircle size={14} />
                ) : (
                  <Loader2 size={14} className="animate-spin text-primary-600" />
                )}
                <span className="text-xs font-bold whitespace-nowrap">{uploadStatus}</span>
                <button 
                  onClick={() => setUploadStatus("")}
                  className="ml-2 p-1 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          )}

          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] rounded-full bg-primary-100/30 blur-[160px] opacity-60" />
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-50/40 blur-[120px]" />
            <div className="absolute top-[15%] right-[15%] w-24 h-24 border border-primary-600/5 rounded-3xl rotate-12" />
            <div className="absolute bottom-[20%] left-[10%] w-32 h-32 border border-blue-600/5 rounded-full" />
          </div>

          <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
            <div className="relative w-72 h-72 mb-24 animate-in fade-in slide-in-from-bottom-12 duration-1000">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-60 bg-white rounded-2xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border border-slate-50 p-8 flex flex-col gap-4 transform rotate-6 -translate-x-4 -translate-y-4 z-20">
                 <div className="w-full h-2.5 bg-slate-100 rounded-full" />
                 <div className="w-5/6 h-2.5 bg-slate-100 rounded-full" />
                 <div className="w-full h-2.5 bg-slate-100 rounded-full" />
                 <div className="w-2/3 h-2.5 bg-slate-100 rounded-full" />
                 <div className="mt-auto self-end bg-primary-50 p-3 rounded-2xl">
                   <ShieldCheck size={32} className="text-primary-600" strokeWidth={2} />
                 </div>
              </div>
              <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-56 h-56 bg-primary-600/[0.03] rounded-[3rem] blur-2xl z-10" />
              <div className="absolute top-[10%] right-[-10%] w-24 h-24 bg-white rounded-3xl shadow-lg flex items-center justify-center text-primary-600 z-30 transform -rotate-12 animate-pulse duration-[3000ms]">
                 <Box size={40} strokeWidth={1.5} />
              </div>
              <div className="absolute bottom-[5%] left-[-5%] w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-400 z-30 transform rotate-12">
                 <Clock size={36} strokeWidth={1.5} />
              </div>
            </div>

            <header className="text-center mb-24 max-w-4xl">
              <h1 className="text-[3.5rem] md:text-[4.5rem] font-extrabold text-[#111827] tracking-[-0.03em] leading-[1.1] mb-10 animate-in fade-in slide-in-from-top-6 duration-1000">
                Your Immutable Digital Notary.
              </h1>
              <p className="text-[#6B7280] text-xl md:text-[1.35rem] font-medium leading-relaxed animate-in fade-in slide-in-from-top-4 duration-1000 delay-300">
                Verify and timestamp any digital asset—from documents to art—with cryptographic certainty on the blockchain.
              </p>
            </header>

            <div className="w-full max-w-2xl flex flex-col gap-12 animate-in fade-in zoom-in duration-1000 delay-500">
              <div className="group relative">
                <div className={`relative z-10 flex flex-col items-center justify-center gap-8 py-20 px-12 transition-all duration-500 rounded-[3rem] ${
                  file ? 'bg-primary-50/40 backdrop-blur-sm shadow-inner' : 'bg-transparent hover:bg-slate-50/50 backdrop-blur-[2px]'
                }`}>
                  <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center transition-all duration-700 shadow-2xl ${file ? 'bg-primary-600 text-white shadow-primary-200' : 'bg-white text-slate-300 group-hover:text-primary-500'}`}>
                    <Upload size={56} strokeWidth={1.2} />
                  </div>
                  <div className="text-center space-y-2 relative">
                    <p className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center justify-center gap-3">
                      {file ? (
                        <>
                          {file.name}
                          {!isUploading && (
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                setFile(null);
                                setUploadStatus("");
                              }}
                              className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-all"
                              title="Remove file"
                            >
                              <X size={18} />
                            </button>
                          )}
                        </>
                      ) : "Drag and drop file here"}
                    </p>
                    <p className="text-[15px] font-bold text-slate-400 uppercase tracking-widest">
                      {file ? `${(file.size / 1024).toFixed(2)} KB` : "or click to upload from computer"}
                    </p>
                  </div>

                  <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} disabled={isUploading} />
                  <label htmlFor="file-upload" className="absolute inset-0 cursor-pointer rounded-[3rem]" />
                </div>
                {!file && <div className="absolute inset-0 border border-slate-100/50 rounded-[3.5rem] -m-4 pointer-events-none" />}
              </div>

              <button
                onClick={handleUpload}
                disabled={isUploading || !file || !isConnected}
                className="relative w-full bg-primary-600 hover:bg-primary-700 disabled:bg-slate-100 disabled:text-slate-400 text-white py-7 text-[1.1rem] font-black tracking-[0.05em] uppercase shadow-[0_25px_50px_-12px_rgba(79,70,229,0.4)] hover:shadow-[0_30px_60px_-12px_rgba(79,70,229,0.5)] transition-all duration-500 cursor-pointer rounded-3xl active:scale-[0.99] flex items-center justify-center gap-4 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                {isUploading ? (
                  <>
                    <Loader2 size={28} className="animate-spin" />
                    {isTxConfirming ? "Securing Proof..." : "Processing..."}
                  </>
                ) : (
                  <>
                    Notarize on Blockchain
                    <ShieldCheck size={24} className="opacity-80" />
                  </>
                )}
              </button>
              
              {!isConnected && (
                <div className="p-8 text-[13px] text-amber-700 bg-amber-50/30 backdrop-blur-sm rounded-[2rem] border border-amber-100/50 text-center font-black tracking-[0.1em] uppercase">
                  Connect Wallet to Access Blockchain Notary
                </div>
              )}
            </div>
          </div>
        </main>
      ) : (
        /* Dashboard View */
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-700">
          <header className="mb-12">
            <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Personal Dashboard</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Manage your immutable cryptographic proofs</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-6">
                <ShieldCheck size={24} />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-tighter text-[10px] mb-1">Total Proofs</p>
              <p className="text-3xl font-black text-slate-900">{stats.total}</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <Database size={24} />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-tighter text-[10px] mb-1">Storage Used</p>
              <p className="text-3xl font-black text-slate-900">{formatSize(stats.storage)}</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                <Globe size={24} />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-tighter text-[10px] mb-1">Network Status</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-xl font-black text-slate-900">Mainnet Ready</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h3 className="text-xl font-extrabold text-slate-900">Recent Proofs</h3>
              <div className="flex gap-4">
                 <div className="relative">
                   <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input 
                    type="text" 
                    placeholder="Search name or hash..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11 pr-6 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-medium focus:outline-none focus:border-primary-300 transition-all w-64" 
                   />
                 </div>
                 <button onClick={() => fetchProofs(currentPage)} disabled={isLoadingProofs} className="p-2.5 bg-white border border-slate-200 rounded-full hover:bg-slate-50 text-slate-600 transition-all disabled:opacity-50">
                   <RefreshCw size={18} className={isLoadingProofs ? "animate-spin" : ""} />
                 </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-400 font-black uppercase tracking-widest text-[10px] bg-slate-50/50">
                    <th className="px-10 py-5">Document</th>
                    <th className="px-6 py-5">File Hash</th>
                    <th className="px-6 py-5">IPFS CID</th>
                    <th className="px-6 py-5">Timestamp</th>
                    <th className="px-10 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {isLoadingProofs ? (
                    <tr>
                      <td colSpan={5} className="px-10 py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <Loader2 className="animate-spin text-primary-600" size={32} />
                          <p className="text-slate-400 font-bold">Synchronizing blockchain data...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredProofs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-10 py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <FileText className="text-slate-200" size={48} />
                          <p className="text-slate-400 font-bold">
                            {searchQuery ? "No matching records found." : "No proofs found for this wallet."}
                          </p>
                          {!searchQuery && (
                            <button onClick={() => setActiveTab("notary")} className="text-primary-600 font-black text-sm uppercase tracking-widest hover:underline mt-2">Create your first proof</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : filteredProofs.map((proof) => (
                    <tr key={proof.file_hash} className="group hover:bg-slate-50/50 transition-all">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 truncate max-w-[160px]">{proof.file_name}</p>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">{formatSize(proof.file_size)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 font-mono text-xs text-slate-400 group-hover:text-slate-600">
                        <div className="flex items-center gap-2">
                          {truncateAddress(proof.file_hash)}
                          <button onClick={() => navigator.clipboard.writeText(proof.file_hash)} className="opacity-0 group-hover:opacity-100 p-1 hover:text-primary-600 transition-all">
                            <Copy size={12} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-6 font-mono text-xs text-slate-400 group-hover:text-slate-600">
                         <a href={`https://gateway.pinata.cloud/ipfs/${proof.cid}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary-600 transition-colors">
                            {proof.cid.slice(0, 10)}...
                            <ExternalLink size={12} />
                         </a>
                      </td>
                      <td className="px-6 py-6 text-sm font-medium text-slate-500">
                        {new Date(proof.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-10 py-6 text-right">
                        <a href={`https://sepolia.etherscan.io/tx/${proof.tx_hash}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 text-slate-400 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 transition-all">
                          <Globe size={18} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center">
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Showing {filteredProofs.length} of {pagination?.total || 0} entries
               </p>
               <div className="flex gap-2">
                  <button onClick={() => fetchProofs(currentPage - 1)} disabled={currentPage <= 1 || isLoadingProofs} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black uppercase text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm">Previous</button>
                  <div className="flex items-center px-4 text-xs font-bold text-slate-400 uppercase">Page {currentPage} of {pagination?.total_pages || 1}</div>
                  <button onClick={() => fetchProofs(currentPage + 1)} disabled={!pagination || currentPage >= pagination.total_pages || isLoadingProofs} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black uppercase text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm">Next</button>
               </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
