import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl'

export default defineConfig({
  plugins: [react(), glsl()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-dom': ['react-dom'],
          '@react-three/fiber': ['@react-three/fiber'],
          '@react-three/drei': ['@react-three/drei'],
          'three': ['three']
        }
      }
    },
    chunkSizeWarningLimit: 700
  }
})
