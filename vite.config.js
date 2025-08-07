import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // ✅ 웹소켓 프록시 설정 추가
      '/ws-chat': {
        target: 'http://localhost:8080',
        ws: true, // ✅ 웹소켓 프록시 활성화
        changeOrigin: true,
        secure: false,
      },
    }
  }
})