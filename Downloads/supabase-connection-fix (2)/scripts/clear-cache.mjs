import { Pool } from 'pg'

const postgresUrl = process.env.POSTGRES_URL

if (!postgresUrl) {
  console.error('❌ POSTGRES_URL not set')
  process.exit(1)
}

async function clearCache() {
  const pool = new Pool({
    connectionString: postgresUrl,
    ssl: postgresUrl.includes('localhost')
      ? false
      : {
          rejectUnauthorized: false,
          sslmode: 'require',
        },
  })

  try {
    console.log('🚀 Clearing Supabase Cache\n')
    const connection = await pool.connect()
    console.log('✓ Connected to database\n')

    // Clear schema cache by calling pg_reload_conf() and restarting the schema cache
    console.log('Step 1: Notifying schema changes...')

    // Notify all connections about schema changes
    await connection.query("NOTIFY pgrst, 'reload schema'")
    console.log('✓ Schema change notification sent\n')

    // Verify profiles table exists
    console.log('Step 2: Verifying profiles table...')
    const tableCheck = await connection.query(
      "SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') as exists"
    )

    if (tableCheck.rows[0].exists) {
      console.log('✓ Profiles table exists\n')

      // Get column info
      const columns = await connection.query(
        "SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' ORDER BY ordinal_position LIMIT 10"
      )

      console.log('Step 3: Profile table columns:')
      columns.rows.forEach((col) => {
        console.log(`  - ${col.column_name}: ${col.data_type}`)
      })
    } else {
      console.error('❌ Profiles table does not exist!')
      await pool.end()
      process.exit(1)
    }

    connection.release()
    await pool.end()

    console.log('\n✨ Cache cleared successfully!')
    console.log('\n✅ Supabase should now recognize the profiles table!\n')
  } catch (error) {
    console.error('❌ Error:', error.message)
    await pool.end()
    process.exit(1)
  }
}

clearCache()
