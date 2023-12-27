import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

let keyFile = null;
let certFile = null;
try {
  keyFile = fs.readFileSync('./dev_rxight_web_certs/localhost.key');
  certFile = fs.readFileSync('./dev_rxight_web_certs/localhost.cer');
} catch (err){
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    css: true,
  },
  server: {
    port: 3101,
    https: {
      key: keyFile,
      cert: certFile,
    }
  }
})
