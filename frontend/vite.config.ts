import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            '/upload': {
                target: 'http://localhost:8088',
                changeOrigin: true,
            },
            '/job': {
                target: 'http://localhost:8088',
                changeOrigin: true,
            },
            '/result': {
                target: 'http://localhost:8088',
                changeOrigin: true,
            }
        }
    }
})
