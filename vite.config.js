import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Vite 8's Rolldown optimizer can hang on heavy PDF/canvas deps during first dev boot.
  optimizeDeps: {
    exclude: ['jspdf', 'html2canvas'],
  },
  server: {
    host: true,
    port: 5173,
    strictPort: false, // fall to 5174 if occupied, but CorsConfig covers both
  },
})
