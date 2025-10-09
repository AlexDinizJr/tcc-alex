import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // ✅ Configurações importantes para SPA
  server: {
    port: 3000,
    host: true, // Permite acesso externo
    proxy: {
      '/api': {
        target: 'https://mediahubapi.up.railway.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  
  // ✅ Configuração crucial para produção
  base: './', // Usa caminhos relativos
  
  build: {
    outDir: 'dist',
    sourcemap: false, // Melhor performance em produção
    
    // ✅ Configuração para SPA - fallback para index.html
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        // Garante que os arquivos tenham nomes consistentes
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  
  // ✅ Preview configuration para testar build local
  preview: {
    port: 3000,
    host: true
  }
})