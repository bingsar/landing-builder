import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  define: {
    __API_BASE__: JSON.stringify(process.env.VITE_API_URL || 'http://127.0.0.1:8000'),
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': process.env.VITE_API_URL || 'http://127.0.0.1:8000',
    },
  },
})
