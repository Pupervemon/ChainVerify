import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  cacheDir: '.vite-deproof',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('@rainbow-me') ||
              id.includes('wagmi') ||
              id.includes('viem') ||
              id.includes('@tanstack')
            ) {
              return 'wallet-vendor'
            }

            if (id.includes('react-router') || id.includes('react-dom') || id.includes('react')) {
              return 'react-vendor'
            }
          }

          if (id.includes('/src/features/passport/')) {
            return 'passport-module'
          }

          if (id.includes('/src/features/proof/') || id.includes('/src/pages/ProofPage')) {
            return 'proof-module'
          }
        },
      },
    },
  },
})
