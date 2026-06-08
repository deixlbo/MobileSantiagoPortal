import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY

let supabaseServerInstance: any = null

function getSupabaseServer() {
  // Return mock object at build time if env vars not set
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.warn('[v0] Supabase not configured - using mock client for build')
    return {
      auth: { 
        admin: { 
          createUser: async () => ({ 
            data: null,
            error: { message: 'Supabase not configured' } 
          }) 
        } 
      },
      from: () => ({ 
        select: () => ({ 
          eq: () => ({ 
            single: () => ({ 
              data: null,
              error: { message: 'Supabase not configured' } 
            }) 
          }),
          range: () => ({ 
            data: null, 
            error: { message: 'Supabase not configured' } 
          })
        }),
        insert: () => ({
          select: () => ({
            single: () => ({
              data: null,
              error: { message: 'Supabase not configured' }
            })
          })
        }),
        upsert: () => ({
          select: () => ({
            single: () => ({
              data: null,
              error: { message: 'Supabase not configured' }
            })
          })
        })
      })
    }
  }

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
