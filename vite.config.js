import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': { // 匹配以 /api 开头的请求路径
        target: 'http://8.148.73.253:80', // 后端服务的地址，例如: 'https://api.example.com'
        changeOrigin: true, // 是否启用代理路径重写，通常需要设置为true。
        // rewrite: (path) => path.replace(/^\/api/, '') // 重写路径，去掉 /api 前缀。
      }
    },
  }
});

