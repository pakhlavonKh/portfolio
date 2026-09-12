import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize chunk size strategy for production
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'three';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'motion';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }
          if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next') || id.includes('node_modules/i18next-browser-languagedetector')) {
            return 'i18n';
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }
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
