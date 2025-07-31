import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,  // React 개발서버 포트
    proxy: {
      // '/api'로 시작하는 요청은 Spring 서버(8080)로 프록시
      '/api': {
        target: 'http://localhost:8080', // 백엔드 서버 주소
        changeOrigin: true,
        secure: false,
      }
    }
  }
})

