import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { Upload, FileText, Database, RefreshCw } from "lucide-react";
import "./App.css";

const CONTRACT_ADDRESS = "0x5e74A5EC199636B5ECda49fEf0A15Ce06bFcdE5D";
const BACKEND_URL = "http://localhost:8080/api/v1";

const ABI = [
  "function storeProof(string _fileHash, string _fileName, uint256 _fileSize, string _contentType, string _cid) public",
  "function getProof(string _fileHash) public view returns (tuple(address walletAddress, string fileHash, string fileName, uint256 fileSize, string contentType, string cid, uint256 timestamp))",
  "function totalProofs() public view returns (uint256)"
];

async function computeSHA256Hex(file: File) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return `0x${hashHex}`;
}

function App() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [totalProofs, setTotalProofs] = useState("0");
  const [proofs, setProofs] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, [walletAddress]);

  const connectWallet = async () => {
    if ((window as any).ethereum) {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]);
        fetchProofs(accounts[0]);
      } catch (err) {
        console.error("Failed to connect wallet", err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/stats`);
      setTotalProofs(res.data.total_proofs || "0");
    } catch {
      if ((window as any).ethereum) {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        const total = await contract.totalProofs();
        setTotalProofs(total.toString());
      }
    }
  };

  const fetchProofs = async (addr = walletAddress) => {
    if (!addr) return;
    try {
      const res = await axios.get(`${BACKEND_URL}/proofs?wallet_address=${addr}`);
      setProofs(res.data.proofs || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a file first");
    if (!walletAddress) return alert("Connect wallet first");

    setIsUploading(true);
    setUploadStatus("Uploading to backend...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await axios.post(`${BACKEND_URL}/store/upload`, formData);
      const { cid, file_name, file_size } = uploadRes.data;

      setUploadStatus("Calculating Hash...");
      const fileHash = await computeSHA256Hex(file);

      setUploadStatus("Awaiting MetaMask confirmation...");
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const contentType = file.type || "application/octet-stream";

      const tx = await contract.storeProof(fileHash, file_name, file_size, contentType, cid);
      setUploadStatus(`Blockchain tx sent! Wait... (${tx.hash})`);
      
      await tx.wait();
      setUploadStatus("Success! File proof recorded on blockchain.");
      
      fetchStats();
      fetchProofs();
    } catch (error: any) {
      console.error(error);
      setUploadStatus(`Error: ${error.message || "Failed"}`);
    } finally {
      setIsUploading(false);
      setFile(null);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>?? ChainVerify</h1>
        {walletAddress ? (
          <div>Connected: {walletAddress.substring(0, 6)}...{walletAddress.substring(38)}</div>
        ) : (
          <button onClick={connectWallet} style={{ padding: "10px 20px" }}>Connect MetaMask</button>
        )}
      </header>
      <div style={{ background: "#f9fafb", padding: "1.5rem" }}>
        <h2><Upload size={20} /> Upload New Proof</h2>
        <input type="file" onChange={handleFileChange} disabled={isUploading} />
        <button onClick={handleUpload} disabled={isUploading || !file}>Submit</button>
        {uploadStatus && <p>{uploadStatus}</p>}
      </div>
      <div>
        <h3><Database size={20} /> Platform Total Proofs: {totalProofs}</h3>
      </div>
    </div>
  );
}

export default App;
