import { Pool } from 'pg'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function fixRLSPolicies() {
  const postgresUrl = process.env.POSTGRES_URL
  if (!postgresUrl) {
    console.error('❌ POSTGRES_URL environment variable not set')
    process.exit(1)
  }

  const pool = new Pool({
    connectionString: postgresUrl,
    ssl: { rejectUnauthorized: false },
  })

  try {
    const client = await pool.connect()
    console.log('Connected to database\n')

    // Ensure profiles table has proper INSERT policy for residents
    const insertPolicy = `
      CREATE POLICY "Residents can insert own profile on registration"
      ON public.profiles
      FOR INSERT
      WITH CHECK (auth.uid() = id);
    `

    try {
      await client.query(insertPolicy)
      console.log('✓ Added INSERT policy for profiles')
    } catch (e) {
      if (e.message.includes('already exists')) {
        console.log('✓ INSERT policy already exists')
      } else {
        console.error('Error adding INSERT policy:', e.message)
      }
    }

    // Enable RLS on profiles if not already
    await client.query('ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;')
    console.log('✓ RLS enabled on profiles\n')

    client.release()
    await pool.end()
    console.log('✅ RLS policies fixed successfully!')
  } catch (error) {
    console.error('❌ Error:', error.message)
    await pool.end()
    process.exit(1)
  }
}

fixRLSPolicies()
