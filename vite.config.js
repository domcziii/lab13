import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { glob } from 'glob'
import tailwindcss from '@tailwindcss/vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

const inputs = glob.sync('src/**/*.html').map(entry => resolve(__dirname, entry));


export default defineConfig({
  base: '/lab13/',
  plugins: [
    tailwindcss(),
  ],

  root: resolve(__dirname, 'src'),
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: inputs,
    },
    outDir: resolve(__dirname, 'docs'),
  },
})
