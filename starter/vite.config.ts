import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 纯离线站点：不使用任何外部 CDN，照片与字体均来自 public/ 本地资源。
export default defineConfig({
  plugins: [react()],
})
