import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseServiceRoleKey) {
  // eslint-disable-next-line no-console
  console.error(
    '[Supabase Server] Missing configuration. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment variables.'
  )
}

let supabaseServerInstance: any = null

function getSupabaseServer() {
  if (!supabaseServerInstance) {
    supabaseServerInstance = createClient(supabaseUrl, supabaseServiceRoleKey)
  }
  return supabaseServerInstance
}

export const supabaseServer = new Proxy({}, {
  get: (target, prop) => {
    const instance = getSupabaseServer()
    return (instance as any)[prop]
  }
}) as any
