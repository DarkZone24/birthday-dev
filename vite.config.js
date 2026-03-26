import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: 'src/index',
  plugins: [react()],
  assetsInclude: ['**/*.JPG'],
  build: {
    outDir: '../../dist',
    emptyOutDir: true
  }
})
