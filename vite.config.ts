import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React and related libraries into a separate chunk
          'react-vendor': ['react', 'react-dom', 'react/jsx-runtime'],
          // Split GSAP animation library into its own chunk
          'gsap-vendor': ['gsap'],
          // Split Framer Motion into its own chunk
          'framer-vendor': ['framer-motion'],
          // Split Three.js and React Three Fiber into their own chunk
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
        },
      },
    },
    chunkSizeWarningLimit: 600, // Increase warning limit slightly
  },
})
