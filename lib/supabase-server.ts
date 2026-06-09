import { createClient } from '@supabase/supabase-js'

let supabaseServerInstance: any = null

export function getSupabaseServer() {
  if (supabaseServerInstance) {
    return supabaseServerInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    // eslint-disable-next-line no-console
    console.warn(
      '[Supabase Server] Missing configuration. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment variables.'
    )
    // Return a proxy that logs errors instead of crashing
    return new Proxy({}, {
      get: () => {
        throw new Error('Supabase server is not configured')
      }
    })
  }

  supabaseServerInstance = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return supabaseServerInstance
}

// Lazy export - only create when accessed
export const supabaseServer = new Proxy({}, {
  get: (target, prop) => {
    const instance = getSupabaseServer()
    return (instance as any)[prop]
  }
}) as any
