import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'API_')
  const apiUrl = `http://${env.API_HOST || 'backend'}`

  return {
    plugins: [
      vue(), 
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              console.log('[PROXY]', proxyReq.method, '→', proxyReq.path)
            })
          },
        },
      },
    },
    preview: {
      host: true,
      strictPort: true,
      proxy: {
        '/api': {
          rewrite: (path) => path,
        },
      },
    },
    optimizeDeps: {
      exclude: ['js-big-decimal'],
    },
  }
})
