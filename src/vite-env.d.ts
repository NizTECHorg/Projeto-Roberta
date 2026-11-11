/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Injected by vite.config.ts define (from SUPABASE_URL). */
  readonly SUPABASE_URL: string
  /** Injected by vite.config.ts define (from SUPABASE_ANON_KEY). */
  readonly SUPABASE_ANON_KEY: string
  /** Public SPA origin for Auth email redirects (optional; defaults to production). */
  readonly VITE_APP_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
