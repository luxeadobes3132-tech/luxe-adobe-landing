import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Stable vendor splits for HTTP caching: core React rarely changes; motion/GSAP/lenis
 * ship separately so route chunks stay smaller and initial parse is lighter.
 */
function manualChunks(id) {
  if (!id.includes('node_modules')) return undefined

  if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
    return 'vendor-react'
  }
  if (id.includes('node_modules/scheduler')) {
    return 'vendor-react'
  }
  if (id.includes('node_modules/react-router')) {
    return 'vendor-router'
  }
  if (id.includes('node_modules/framer-motion')) {
    return 'vendor-motion'
  }
  if (id.includes('node_modules/gsap') || id.includes('node_modules/@gsap')) {
    return 'vendor-gsap'
  }
  if (id.includes('node_modules/lenis')) {
    return 'vendor-lenis'
  }
  if (id.includes('node_modules/react-helmet-async')) {
    return 'vendor-helmet'
  }

  return 'vendor-misc'
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks,
      },
    },
  },
})
