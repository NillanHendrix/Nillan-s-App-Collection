import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Lokal gibt es keine Vercel Functions: /api optional an ein Deployment weiterleiten
// (API_PROXY_TARGET=https://<projekt>.vercel.app in .env) oder `npx vercel dev` nutzen.
export default defineConfig(({ mode }) => {
  const apiTarget = loadEnv(mode, '.', '').API_PROXY_TARGET
  return {
    plugins: [react()],
    server: apiTarget ? { proxy: { '/api': { target: apiTarget, changeOrigin: true } } } : undefined,
  }
})
