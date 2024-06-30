import { adorableCSS } from "adorable-css/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [adorableCSS(), react()],
  define: {
    global: 'window',
  },
})

