import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: 'src/index',
  plugins: [react()],
  assetsInclude: ['**/*.JPG', '**/*.mp3', '**/*.m4a'],
  build: {
    outDir: '../../dist',
    emptyOutDir: true
  }
})
