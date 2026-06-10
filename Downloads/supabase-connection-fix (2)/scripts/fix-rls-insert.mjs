import { Pool } from 'pg'

const postgresUrl = process.env.POSTGRES_URL

if (!postgresUrl) {
  console.error('❌ POSTGRES_URL environment variable not set')
  process.exit(1)
}

async function fixRLS() {
  const pool = new Pool({
    connectionString: postgresUrl,
    ssl: { rejectUnauthorized: false },
  })

  try {
    const client = await pool.connect()
    console.log('🔧 Fixing RLS INSERT policy for profiles table...\n')

    // Drop the old permissive policy
    await client.query(`
      DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles
    `)
    console.log('✓ Removed old policy\n')

    // Create a new policy that allows authenticated users to insert their own profile
    await client.query(`
      CREATE POLICY "Users can insert their own profile for registration"
      ON profiles
      FOR INSERT
      WITH CHECK (auth.uid() = id)
    `)
    console.log('✓ Created new INSERT policy with proper WITH CHECK\n')

    console.log('✅ RLS INSERT policy fixed successfully!')
    client.release()
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await pool.end()
  }
}

fixRLS()
