# DeProof

DeProof is a decentralized proof notarization project with three parts:

- `frontend/`: React + TypeScript + Vite web app
- `backend/`: Go API service for upload, proof query, and integration logic
- `blockchain/`: Hardhat contract workspace for `ProofStore`

## Repo Structure

```text
DeProof/
|- frontend/    # Web app
|- backend/     # Go backend
|- blockchain/  # Smart contracts and scripts
|- docs/        # Project documents
```

## Requirements

- Node.js 20+
- npm
- Go 1.22+
- MySQL 8+ (optional if you only want limited backend startup)

## Frontend

Path: `frontend/`

### Environment

Create `frontend/.env` from `frontend/.env.example`:

```env
VITE_BACKEND_URL=http://localhost:8080/api/v1
VITE_CONTRACT_ADDRESS=0x...
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

### Run

```bash
cd frontend
npm install
npm run dev
```

### Type Check

```bash
./node_modules/.bin/tsc --noEmit -p tsconfig.app.json
```

## Backend

Path: `backend/`

### Environment

Create `backend/.env` from `backend/.env.example`.

Common variables:

- `PORT`: backend port, default `8080`
- `BASE_PATH`: API prefix, default `/api/v1`
- `MYSQL_DSN`: MySQL connection string
- `PINATA_JWT`: Pinata upload token
- `ETH_RPC_URL`: EVM RPC endpoint
- `CONTRACT_ADDRESS`: deployed `ProofStore` contract address

### Run

```bash
cd backend
go mod tidy
go run ./cmd/server
```

### Health Check

```bash
curl http://localhost:8080/healthz
```

## Blockchain

Path: `blockchain/`

### Install

```bash
cd blockchain
npm install
```

### Compile

```bash
npm run compile
```

### Compile And Sync ABI

```bash
npm run compile:sync
```

This updates the contract artifacts and synchronizes ABI output to:

- `blockchain/ProofStore.abi`
- `blockchain/ProofStore.bin`
- `frontend/src/contracts/ProofStore.json`

If you change the contract or redeploy locally, run this command again so the frontend and backend keep using the latest ABI.

### Run Local Hardhat Node

Start a local JSON-RPC node on `http://127.0.0.1:8545`:

```bash
cd blockchain
npx hardhat node
```

### Deploy Contract To Local Node

With the local Hardhat node running in another terminal:

```bash
cd blockchain
npx hardhat run --network localhost scripts/deploy.ts
```

### Local Deploy With ABI Sync

After deployment, synchronize the ABI for frontend/backend usage:

```bash
cd blockchain
npm run compile:sync
```

## API Overview

Base URL:

```text
http://localhost:8080/api/v1
```

Main endpoints:

- `POST /store/upload`
- `GET /proofs`
- `GET /proofs/:file_hash`
- `GET /stats`

## Git Notes

The frontend uses a custom Vite cache directory:

- `frontend/.vite-deproof/`

This directory is local build cache and should not be committed. It is already ignored in the root `.gitignore`.

If it was committed before, remove it from Git tracking without deleting local files:

```bash
git rm -r --cached frontend/.vite-deproof
git add .gitignore
git commit -m "chore: remove vite cache from repo"
```

## Notes

- Root `README.md` is the main project entry document.
