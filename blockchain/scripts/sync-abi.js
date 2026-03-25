import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARTIFACT_PATH = path.join(__dirname, '../artifacts/contracts/ProofStore.sol/ProofStore.json');
const ABI_OUTPUT = path.join(__dirname, '../ProofStore.abi');
const BIN_OUTPUT = path.join(__dirname, '../ProofStore.bin');
const FRONTEND_JSON_OUTPUT = path.join(__dirname, '../../frontend/src/contracts/ProofStore.json');

async function sync() {
  try {
    if (!fs.existsSync(ARTIFACT_PATH)) {
      console.error('Error: Artifacts not found. Please run "npx hardhat compile" first.');
      process.exit(1);
    }

    const artifact = JSON.parse(fs.readFileSync(ARTIFACT_PATH, 'utf8'));
    
    // 1. Sync to root for backend (abigen)
    fs.writeFileSync(ABI_OUTPUT, JSON.stringify(artifact.abi, null, 2));
    fs.writeFileSync(BIN_OUTPUT, artifact.bytecode);
    console.log('✅ Updated ProofStore.abi and ProofStore.bin for backend.');

    // 2. Sync to frontend
    const frontendDir = path.dirname(FRONTEND_JSON_OUTPUT);
    if (!fs.existsSync(frontendDir)) {
      fs.mkdirSync(frontendDir, { recursive: true });
    }
    
    // For frontend, we export as a standard JSON that can be imported
    fs.writeFileSync(FRONTEND_JSON_OUTPUT, JSON.stringify({
      address: process.env.VITE_CONTRACT_ADDRESS || "", // Optional: store deployed address
      abi: artifact.abi
    }, null, 2));
    console.log('✅ Updated frontend/src/contracts/ProofStore.json for frontend.');

  } catch (err) {
    console.error('Failed to sync ABI:', err);
    process.exit(1);
  }
}

sync();
