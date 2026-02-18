import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://94.241.141.229:8000',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://94.241.141.229:8000',
        changeOrigin: true,
      },
    },
  },
})
