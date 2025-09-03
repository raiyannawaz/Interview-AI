import path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/Interview-AI/',
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})