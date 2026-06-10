import { Pool } from 'pg'

const postgresUrl = process.env.POSTGRES_URL

if (!postgresUrl) {
  console.error('❌ POSTGRES_URL environment variable not set')
  process.exit(1)
}

async function fixServiceRole() {
  const pool = new Pool({
    connectionString: postgresUrl,
    ssl: { rejectUnauthorized: false },
  })

  try {
    const client = await pool.connect()
    console.log('🔧 Ensuring service role can manage profiles...\n')

    // Drop if exists
    await client.query(`
      DROP POLICY IF EXISTS "Service role can manage all profiles" ON profiles
    `)
    console.log('✓ Cleaned up existing policy\n')

    // Create comprehensive service role policy for INSERT, UPDATE, DELETE
    await client.query(`
      CREATE POLICY "Service role full access"
      ON profiles
      USING (auth.role() = 'service_role')
      WITH CHECK (auth.role() = 'service_role')
    `)
    console.log('✓ Created service role full access policy\n')

    console.log('✅ Service role access secured!')
    client.release()
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await pool.end()
  }
}

fixServiceRole()
