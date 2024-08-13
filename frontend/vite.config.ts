import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true, // 모든 네트워크 인터페이스에서 접근 가능하게 설정
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://3.34.171.35:5002',
        changeOrigin: true,
        secure: false,
      }
    },
    hmr: {
      host: '3.34.171.35',
      protocol: 'ws',
      port: 5173
    }
  },
  plugins: [react()],
})
