import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: '698f-125-22-74-12.ngrok-free.app',   
    host: true            
  }
})
