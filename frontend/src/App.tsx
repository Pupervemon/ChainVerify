import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Upload, Loader2, ShieldCheck, RefreshCw, LogOut, X, ChevronRight, Search } from "lucide-react";
import { useAccount, useAccountEffect, useChainId, useConnect, useWriteContract, useWaitForTransactionReceipt, usePublicClient, useDisconnect, useSwitchChain } from "wagmi";
import { getAccount, watchAccount } from "@wagmi/core";
import { Routes, Route, useNavigate, useLocation, Link } from "react-router-dom";
import { sepolia } from "wagmi/chains";
import Banner from "./components/Banner";
import ProfileHeader from "./components/ProfileHeader";
import ProofStoreContract from "./contracts/ProofStore.json";
import Toast from "./components/Toast";
import ProofPage from "./pages/ProofPage";
import type { Proof } from "./types/proof";
import { browserExtensionConnectorIds, wagmiConfig } from "./wagmi";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1";
const LAST_WALLET_ADDRESS_KEY = "deproof:last-wallet-address";
const walletOptionOrder = [
  { id: "metaMask", title: "MetaMask", description: "Connect with the MetaMask browser extension" },
  { id: "rabby", title: "Rabby", description: "Connect with the Rabby browser extension" },
  { id: "okxWallet", title: "OKX Wallet", description: "Connect with the OKX browser extension" },
  { id: "injected", title: "Other Browser Wallet", description: "Use another injected wallet extension detected in this browser" },
  { id: "walletConnect", title: "WalletConnect", description: "Use QR code or a mobile wallet to connect" },
] as const;

type EthereumProvider = { isMetaMask?: boolean; isRabby?: boolean; isOkxWallet?: boolean; isOKExWallet?: boolean; providers?: EthereumProvider[] };
type EthereumWindow = Window & { ethereum?: EthereumProvider };

const isValidAddress = (value: string) => /^0x[a-fA-F0-9]{40}$/.test(value);
const ABI = ProofStoreContract.abi;

async function computeSHA256Hex(file: File) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return `0x${hashHex}`;
}

function App() {
  const { isConnected, address } = useAccount();
  const { connectAsync, connectors, isPending: isConnecting } = useConnect();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const [displayAddress, setDisplayAddress] = useState(() => {
    const currentAccount = getAccount(wagmiConfig);
    if (currentAccount.address) return currentAccount.address;
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(LAST_WALLET_ADDRESS_KEY) || "";
  });
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();
  const location = useLocation();
  const publicClient = usePublicClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState("");
  const [availableConnectorIds, setAvailableConnectorIds] = useState<Record<string, boolean>>({});
  const [hasAnyInjectedWallet, setHasAnyInjectedWallet] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ status: "idle" | "verifying" | "success" | "mismatch" | "error"; proof?: Proof; message?: string }>({ status: "idle" });
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [isLoadingProofs, setIsLoadingProofs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { writeContractAsync, data: txHash, isPending: isTxPending } = useWriteContract();
  const { isLoading: isTxConfirming, isSuccess: isTxConfirmed, isError: isTxError, error: txError } = useWaitForTransactionReceipt({ hash: txHash });
  const isUploading = isTxPending || isTxConfirming;
  const connectedAddress = isConnected ? address || displayAddress : "";
  const hasCorrectChain = chainId === sepolia.id;
  const hasPromptedChainSwitchRef = useRef(false);
  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  useEffect(() => {
    if (address) {
      setDisplayAddress(address);
      window.localStorage.setItem(LAST_WALLET_ADDRESS_KEY, address);
    }
  }, [address]);

  useEffect(() => watchAccount(wagmiConfig, {
    onChange(account) {
      if (account.address) {
        setDisplayAddress(account.address);
        window.localStorage.setItem(LAST_WALLET_ADDRESS_KEY, account.address);
        return;
      }
      setDisplayAddress("");
      window.localStorage.removeItem(LAST_WALLET_ADDRESS_KEY);
    },
  }), []);

  const getEthereumProviders = useCallback(() => {
    if (typeof window === "undefined") return [];
    const ethereum = (window as EthereumWindow).ethereum;
    if (!ethereum) return [];
    return Array.isArray(ethereum.providers) && ethereum.providers.length > 0 ? ethereum.providers : [ethereum];
  }, []);

  const detectInjectedWalletAvailability = useCallback(() => {
    const providers = getEthereumProviders();
    const availability: Record<string, boolean> = {
      walletConnect: true,
      injected: providers.length > 0,
      metaMask: providers.some((provider: EthereumProvider) => Boolean(provider.isMetaMask)),
      rabby: providers.some((provider: EthereumProvider) => Boolean(provider.isRabby)),
      okxWallet: providers.some((provider: EthereumProvider) => Boolean(provider.isOkxWallet || provider.isOKExWallet)),
    };
    setHasAnyInjectedWallet(providers.length > 0);
    setAvailableConnectorIds((current) => ({ ...current, ...availability }));
    return availability;
  }, [getEthereumProviders]);

  const getConnectErrorMessage = (error: unknown, connectorName: string) => {
    const message = error instanceof Error ? error.message : "";
    const normalizedMessage = message.toLowerCase();
    if (normalizedMessage.includes("user rejected") || normalizedMessage.includes("user denied")) return `Connection cancelled in ${connectorName}.`;
    if (normalizedMessage.includes("connector not found")) return `${connectorName} is not available in this browser.`;
    if (normalizedMessage.includes("no injected provider found")) return "No browser wallet extension was detected.";
    if (normalizedMessage.includes("provider not found")) return `${connectorName} is not installed in this browser.`;
    return message || `Failed to connect with ${connectorName}.`;
  };

  const waitForInjectedWallets = useCallback(async (timeoutMs = 2000) => {
    if (detectInjectedWalletAvailability().injected) return true;
    await new Promise<void>((resolve) => {
      if (typeof window === "undefined") return resolve();
      let finished = false;
      const complete = () => {
        if (finished) return;
        finished = true;
        window.clearTimeout(timeoutId);
        window.removeEventListener("ethereum#initialized", onInitialized as EventListener);
        resolve();
      };
      const onInitialized = () => {
        detectInjectedWalletAvailability();
        complete();
      };
      const timeoutId = window.setTimeout(() => {
        detectInjectedWalletAvailability();
        complete();
      }, timeoutMs);
      window.addEventListener("ethereum#initialized", onInitialized as EventListener, { once: true });
    });
    return detectInjectedWalletAvailability().injected;
  }, [detectInjectedWalletAvailability]);

  const getSwitchChainErrorMessage = (error: unknown) => {
    const message = error instanceof Error ? error.message : "";
    const normalizedMessage = message.toLowerCase();
    if (normalizedMessage.includes("user rejected") || normalizedMessage.includes("user denied")) return `Please switch your wallet network to ${sepolia.name}.`;
    return message || `Failed to switch wallet network to ${sepolia.name}.`;
  };

  const ensureSupportedChain = useCallback(async () => {
    if (!isConnected || chainId === sepolia.id) {
      hasPromptedChainSwitchRef.current = false;
      return true;
    }
    if (hasPromptedChainSwitchRef.current) return false;
    hasPromptedChainSwitchRef.current = true;
    setUploadStatus(`Wrong network detected. Switching to ${sepolia.name}...`);
    try {
      await switchChainAsync({ chainId: sepolia.id });
      setUploadStatus(`Connected to ${sepolia.name}.`);
      hasPromptedChainSwitchRef.current = false;
      return true;
    } catch (error) {
      setUploadStatus(getSwitchChainErrorMessage(error));
      return false;
    }
  }, [chainId, isConnected, switchChainAsync]);

  const connectWithConnectorId = async (connectorId: string) => {
    const connector = connectors.find((item) => item.id === connectorId);
    if (!connector) {
      setUploadStatus(connectorId === "injected" ? "No browser wallet extension connector is configured." : `Wallet connector "${connectorId}" is not configured.`);
      setIsWalletMenuOpen(false);
      return;
    }
    setIsWalletMenuOpen(false);
    if (browserExtensionConnectorIds.includes(connectorId as (typeof browserExtensionConnectorIds)[number])) {
      const hasInjectedWallet = await waitForInjectedWallets();
      if (!hasInjectedWallet) {
        setUploadStatus("No browser wallet extension was detected.");
        return;
      }
    }
    try {
      await connectAsync({ connector });
    } catch (error) {
      setUploadStatus(getConnectErrorMessage(error, connector.name));
      detectInjectedWalletAvailability();
    }
  };

  useEffect(() => {
    detectInjectedWalletAvailability();
    if (typeof window === "undefined") return;
    const onInitialized = () => detectInjectedWalletAvailability();
    window.addEventListener("ethereum#initialized", onInitialized as EventListener);
    const intervalId = window.setInterval(() => detectInjectedWalletAvailability(), 1500);
    return () => {
      window.removeEventListener("ethereum#initialized", onInitialized as EventListener);
      window.clearInterval(intervalId);
    };
  }, [connectors, detectInjectedWalletAvailability]);

  useEffect(() => {
    void ensureSupportedChain();
  }, [ensureSupportedChain]);

  useAccountEffect({
    onConnect({ address: connectedAddress }) {
      if (connectedAddress) {
        setDisplayAddress(connectedAddress);
        setUploadStatus(`Wallet connected: ${truncateAddress(connectedAddress)}`);
      }
      if (location.pathname === "/dashboard") void fetchProofs(1);
    },
    onDisconnect() {
      setIsAccountMenuOpen(false);
      setDisplayAddress("");
      window.localStorage.removeItem(LAST_WALLET_ADDRESS_KEY);
      setUploadStatus("");
    },
  });

  const loadOnChainProofs = useCallback(async (): Promise<Proof[]> => {
    if (!publicClient || !address || !isValidAddress(CONTRACT_ADDRESS)) return [];
    try {
      const hashes = (await publicClient.readContract({ address: CONTRACT_ADDRESS as `0x${string}`, abi: ABI, functionName: "getUserProofs", args: [address] })) as string[];
      const uniqueHashes = Array.from(new Set(hashes));
      const chainProofs = await Promise.all(uniqueHashes.map(async (hash): Promise<Proof | null> => {
        try {
          const proof = (await publicClient.readContract({ address: CONTRACT_ADDRESS as `0x${string}`, abi: ABI, functionName: "getProofForUser", args: [address, hash] })) as any;
          return { file_hash: proof.fileHash, file_name: proof.fileName, file_size: Number(proof.fileSize), content_type: proof.contentType, cid: proof.cid, wallet_address: proof.walletAddress, tx_hash: "", block_number: 0, timestamp: new Date(Number(proof.timestamp) * 1000).toISOString(), source: "chain" } as Proof;
        } catch {
          return null;
        }
      }));
      return chainProofs.filter((p): p is Proof => p !== null);
    } catch {
      return [];
    }
  }, [publicClient, address]);

  const fetchProofs = useCallback(async (page = 1) => {
    if (!address) return;
    setIsLoadingProofs(true);
    let fetchedFromBackend = false;
    try {
      const res = await axios.get(`${BACKEND_URL}/proofs?wallet_address=${address}&page=${page}&page_size=10`);
      if (res.data && res.data.data) {
        const backendItems: Proof[] = res.data.data.items || [];
        if (backendItems.length > 0) {
          setProofs(backendItems.map((item: Proof) => ({ ...item, source: "backend" })));
          setCurrentPage(res.data.data.pagination.page);
          fetchedFromBackend = true;
        }
      }
    } catch {}
    if (!fetchedFromBackend) setProofs(await loadOnChainProofs());
    setIsLoadingProofs(false);
  }, [address, loadOnChainProofs]);

  useEffect(() => {
    if (location.pathname === "/dashboard" && isConnected) fetchProofs(1);
  }, [location.pathname, isConnected, fetchProofs]);
  useEffect(() => {
    if (!uploadStatus) return;
    const timer = setTimeout(() => setUploadStatus(""), 3000);
    return () => clearTimeout(timer);
  }, [uploadStatus]);
  useEffect(() => {
    if (isTxConfirmed) fetchProofs(1);
  }, [isTxConfirmed, fetchProofs]);
  useEffect(() => {
    if (isTxConfirmed) {
      setUploadStatus("Proof stored successfully. The record is now on-chain.");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [isTxConfirmed]);
  useEffect(() => {
    if (isTxError && txError) setUploadStatus(`Transaction failed: ${txError.message}`);
  }, [isTxError, txError]);
  useEffect(() => {
    if (uploadStatus && (isTxConfirmed || isTxError)) {
      const timer = setTimeout(() => setUploadStatus(""), isTxConfirmed ? 5000 : 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadStatus, isTxConfirmed, isTxError]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setFile(e.target.files[0]);
  };
  const handleClearFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleUpload = async () => {
    if (!file || !isConnected || !address) return;
    if (!hasCorrectChain && !(await ensureSupportedChain())) return;
    setUploadStatus("Uploading file to IPFS through the backend...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await axios.post(`${BACKEND_URL}/store/upload`, formData);
      const { cid, file_name, file_size, file_hash: fileHash } = uploadRes.data.data;
      await writeContractAsync({ address: CONTRACT_ADDRESS as `0x${string}`, abi: ABI, functionName: "storeProof", args: [fileHash, cid, file_name, BigInt(file_size), file.type || "application/octet-stream"] });
      setUploadStatus("Transaction submitted.");
    } catch (error: any) {
      setUploadStatus(`Error: ${error.message}`);
    }
  };
  const handleVerify = async () => {
    if (!file) return;
    setVerificationResult({ status: "verifying" });
    try {
      const fileHash = await computeSHA256Hex(file);
      const res = await axios.get(`${BACKEND_URL}/proofs/${encodeURIComponent(fileHash)}`);
      if (res.data && res.data.data) {
        setVerificationResult({ status: "success", message: "Verification succeeded. Record found. Redirecting..." });
        setTimeout(() => navigate(`/proof/${fileHash}`), 1500);
      } else {
        setVerificationResult({ status: "mismatch", message: "Verification failed: no matching proof record was found." });
      }
    } catch {
      setVerificationResult({ status: "mismatch", message: "Verification failed: the record does not exist or the network request failed." });
    }
  };

  const walletOptions = walletOptionOrder.map((option) => {
    const connector = connectors.find((item) => item.id === option.id);
    const isDetected = option.id === "walletConnect" ? true : (availableConnectorIds[option.id] ?? false);
    const isAvailable = option.id === "walletConnect" ? true : option.id === "injected" ? hasAnyInjectedWallet : (availableConnectorIds[option.id] ?? hasAnyInjectedWallet);
    return { ...option, connector, isDetected, isAvailable };
  });

  return (
    <div className="min-h-screen bg-white font-sans text-[#111827]">
      <Banner />
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 selection:bg-orange-100 font-nav">
        <div className="max-w-7xl mx-auto px-6 h-[65px] flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/" className="text-xl font-black tracking-tighter text-black flex items-center gap-2">DeProof</Link>
            <div className="hidden md:flex items-center gap-[40px]">
              {[{ label: "Notary", path: "/" }, { label: "Dashboard", path: "/dashboard" }, { label: "ZKP", path: "/zkp" }, { label: "DOC", path: "/doc" }].map((item) => (
                <Link key={item.path} to={item.path} className={`text-[16px] font-bold transition-all relative py-2 ${location.pathname === item.path ? "text-black after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-orange-500 after:rounded-full" : "text-slate-400 hover:text-black"}`}>{item.label}</Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative hidden lg:block group">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
              <input type="text" placeholder="Search hash..." value={navSearchQuery} onChange={(e) => setNavSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 bg-slate-100/50 border border-transparent rounded-full text-sm font-bold w-48 focus:outline-none focus:bg-white focus:border-orange-500/30 focus:w-64 transition-all duration-300 placeholder:text-slate-400" />
            </div>
            {connectedAddress ? (
              <div className="relative">
                <button onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)} className="flex items-center gap-2.5 h-10 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full transition-all group active:scale-[0.98]">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-orange-400 to-red-400" />
                  <span className="text-black font-bold text-sm uppercase tracking-tight">{truncateAddress(connectedAddress)}</span>
                </button>
                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button onClick={() => { disconnect(); setIsAccountMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-xl text-sm font-bold transition-colors"><LogOut size={16} />Disconnect</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <button onClick={() => setIsWalletMenuOpen((open) => !open)} disabled={isConnecting} className="h-10 px-6 bg-gradient-to-r from-[#FF8C00] to-[#FF6B6B] hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-black uppercase rounded-full transition-all shadow-sm shadow-orange-200">{isConnecting ? "Connecting..." : "Connect Wallet"}</button>
                {isWalletMenuOpen && !isConnecting && (
                  <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 pt-2 pb-3"><div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Select Wallet</div></div>
                    {walletOptions.map((option) => (
                      <button key={option.id} onClick={() => connectWithConnectorId(option.id)} disabled={!option.connector || !option.isAvailable} className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${option.isAvailable ? "hover:bg-slate-50" : "opacity-60 cursor-not-allowed bg-slate-50/80"}`}>
                        <div className="flex items-center justify-between gap-3">
                          <div><div className="text-sm font-bold text-slate-900">{option.title}</div><div className="text-xs text-slate-500">{option.description}</div></div>
                          <div className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-wider ${option.isDetected ? "bg-emerald-50 text-emerald-600" : option.isAvailable ? "bg-amber-50 text-amber-600" : "bg-slate-200 text-slate-500"}`}>{option.isDetected ? "Detected" : option.isAvailable ? "Try Connect" : "Not Installed"}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
      <Toast message={uploadStatus} onClose={() => setUploadStatus("")} />
      <Toast message={verificationResult.status === "verifying" ? "Verifying file fingerprint..." : verificationResult.status !== "idle" ? (verificationResult.message ?? "") : ""} onClose={() => setVerificationResult({ status: "idle" })} />
      <Routes>
        <Route path="/" element={
          <main className="relative flex flex-col items-center pt-32 pb-48 px-4">
            <div className="relative z-10 w-full max-w-2xl flex flex-col gap-12">
              <header className="text-center mb-12">
                <h1 className="text-[3.5rem] font-extrabold tracking-[-0.03em] leading-[1.1] mb-6">Your Immutable Digital Notary.</h1>
                <p className="text-slate-500 text-xl font-medium">Verify and timestamp any digital asset with cryptographic certainty.</p>
              </header>
              <div className={`relative flex flex-col items-center justify-center gap-8 py-20 px-12 rounded-[3rem] border-2 border-dashed transition-all ${file ? "bg-primary-50/40 border-primary-200" : "bg-transparent border-slate-100 hover:bg-slate-50/50 group"}`}>
                {file && <button onClick={handleClearFile} className="absolute top-6 right-6 p-2 bg-white border border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-100 rounded-full shadow-sm z-20 transition-all flex items-center justify-center" title="Remove file"><X size={20} /></button>}
                <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center shadow-2xl transition-all ${file ? "bg-primary-600 text-white scale-105" : "bg-white text-slate-300 group-hover:scale-105 group-hover:text-primary-400"}`}><Upload size={56} /></div>
                <div className="text-center space-y-2">
                  <p className="text-2xl font-extrabold text-slate-900 line-clamp-1 px-4">{file ? file.name : "Drag and drop file here"}</p>
                  <p className="text-[15px] font-bold text-slate-400 uppercase tracking-widest">{file ? `${(file.size / 1024).toFixed(2)} KB` : "or click to upload"}</p>
                </div>
                <input type="file" ref={fileInputRef} id="file-upload" className="hidden" onChange={handleFileChange} />
                <label htmlFor="file-upload" className="absolute inset-0 cursor-pointer z-10" />
              </div>
              <div className="flex gap-4">
                <button onClick={handleUpload} disabled={isUploading || !file || !isConnected} className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-100 text-white py-6 rounded-2xl font-black uppercase shadow-lg transition-all flex items-center justify-center gap-3">{isUploading ? <Loader2 className="animate-spin" /> : <ShieldCheck />}{isTxConfirming ? "Securing..." : "Notarize"}</button>
                <button onClick={handleVerify} disabled={isUploading || !file} className="flex-1 bg-white border-2 border-slate-100 hover:border-primary-600 text-slate-900 py-6 rounded-2xl font-black uppercase transition-all flex items-center justify-center gap-3"><Search /> Verify</button>
              </div>
            </div>
          </main>
        } />
        <Route path="/dashboard" element={
          <main className="max-w-7xl mx-auto px-4 py-12">
            <ProfileHeader address={connectedAddress} />
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden mt-12">
              <div className="px-10 py-8 bg-slate-50/30 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-xl font-extrabold text-slate-900">Recent Proofs</h3>
                <div className="flex gap-4">
                  <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-6 pr-6 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-medium w-64 focus:outline-none focus:border-primary-300" />
                  <button onClick={() => fetchProofs(currentPage)} disabled={isLoadingProofs} className="p-2.5 bg-white border border-slate-200 rounded-full hover:bg-slate-50 text-slate-600"><RefreshCw size={18} className={isLoadingProofs ? "animate-spin" : ""} /></button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead><tr className="text-slate-400 font-black uppercase tracking-widest text-[10px] bg-slate-50/50"><th className="px-10 py-5">Document</th><th className="px-6 py-5">File Hash</th><th className="px-6 py-5">Timestamp</th><th className="px-10 py-5 text-right">Action</th></tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {proofs.filter((p) => p.file_name.includes(searchQuery)).map((proof) => (
                      <tr key={proof.file_hash} className="group hover:bg-slate-50/50 transition-all">
                        <td className="px-10 py-6 font-bold text-slate-900">{proof.file_name}</td>
                        <td className="px-6 py-6 font-mono text-xs text-slate-400">{truncateAddress(proof.file_hash)}</td>
                        <td className="px-6 py-6 text-sm text-slate-500">{new Date(proof.timestamp).toLocaleDateString()}</td>
                        <td className="px-10 py-6 text-right"><button onClick={() => navigate(`/proof/${proof.file_hash}`)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2 ml-auto">Details <ChevronRight size={14} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        } />
        <Route path="/proof/:hash" element={<ProofPage />} />
      </Routes>
    </div>
  );
}

export default App;
