import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize chunk size strategy for production
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'react': ['react', 'react-dom', 'react-router-dom']
        }
      }
    },
    // Use default esbuild minifier for better compatibility
    minify: 'esbuild',
    target: 'esnext',
    sourcemap: false,
    // Optimize chunk size reporting
    reportCompressedSize: false
  },
  // Enable optimizeDeps for faster rebuilds
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
