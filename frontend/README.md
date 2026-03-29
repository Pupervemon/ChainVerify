# DeProof Frontend

This is the frontend application for DeProof, built with React, TypeScript, and Vite.

## Stack

- React 19
- TypeScript
- Vite
- wagmi
- viem
- React Router
- TanStack Query

## Environment

Create `frontend/.env` from `frontend/.env.example`:

```env
VITE_BACKEND_URL=http://localhost:8080/api/v1
VITE_CONTRACT_ADDRESS=0x...
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Type Check

```bash
./node_modules/.bin/tsc --noEmit -p tsconfig.app.json
```

## Notes

- The Vite cache directory is `frontend/.vite-deproof/`.
- This cache directory should not be committed to Git.
- Wallet connection is configured in `src/wagmi.ts`.
