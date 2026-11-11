import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  // Load every var (empty prefix) so the non-VITE_ names set on Vercel/.env are visible here.
  // Only the two public Supabase values below are injected into the client bundle;
  // GEMINI_API_KEY and any other secret stay server-side (Edge Function secrets).
  const fileEnv = loadEnv(mode, process.cwd(), '')
  const pick = (...keys: string[]) =>
    keys.map((k) => process.env[k] ?? fileEnv[k]).find((v) => v && v.trim()) ?? ''

  return {
    define: {
      'import.meta.env.SUPABASE_URL': JSON.stringify(pick('SUPABASE_URL', 'VITE_SUPABASE_URL')),
      'import.meta.env.SUPABASE_ANON_KEY': JSON.stringify(
        pick('SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY'),
      ),
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(self), geolocation=()',
      },
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            supabase: ['@supabase/supabase-js'],
          },
        },
      },
    },
  }
})
