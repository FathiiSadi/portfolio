import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/portfolio/',
  build: {
    chunkSizeWarningLimit: 1000, // Increase warning limit since we're using a single vendor chunk
  },
})
