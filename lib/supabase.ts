import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  ''

if (!supabaseUrl || !supabaseAnonKey) {
  // Avoid throwing here so the client can render pages even when env vars
  // are not set (developer may be running in an environment without .env).
  // Auth and other Supabase features will be disabled until these are set.
  // Log a clear warning to help with debugging.
  // eslint-disable-next-line no-console
  console.warn(
    'Supabase public client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local or your deployment environment.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
