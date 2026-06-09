import { Pool } from 'pg'

const postgresUrl = process.env.POSTGRES_URL
if (!postgresUrl) {
  console.error('POSTGRES_URL not set')
  process.exit(1)
}

const pool = new Pool({
  connectionString: postgresUrl,
  ssl: { rejectUnauthorized: false }
})

async function fixCrudRLS() {
  const client = await pool.connect()
  try {
    console.log('🔧 Fixing CRUD table RLS policies...\n')

    const tables = ['ordinances', 'projects', 'assets']
    
    for (const table of tables) {
      console.log(`Processing ${table}...`)
      
      try {
        // Drop existing policies individually
        const dropPolicies = [
          `DROP POLICY IF EXISTS "admins_all" ON public.${table}`,
          `DROP POLICY IF EXISTS "public_read" ON public.${table}`,
          `DROP POLICY IF EXISTS "officials_crud" ON public.${table}`
        ]
        
        for (const dropSql of dropPolicies) {
          try {
            await client.query(dropSql)
          } catch (e) {
            // Ignore if policy doesn't exist
          }
        }
        
        // Enable RLS
        await client.query(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY`)
        
        // Create new policies for admins (full access)
        const adminPolicy = `
          CREATE POLICY admins_all ON public.${table}
          USING (auth.role() = 'service_role' OR auth.uid()::text IN (
            SELECT id::text FROM public.profiles WHERE role = 'admin'
          ))
          WITH CHECK (auth.role() = 'service_role' OR auth.uid()::text IN (
            SELECT id::text FROM public.profiles WHERE role = 'admin'
          ))
        `
        await client.query(adminPolicy)
        
        // Create policy for public read
        const readPolicy = `
          CREATE POLICY public_read ON public.${table}
          FOR SELECT USING (true)
        `
        await client.query(readPolicy)
        
        // Create policy for officials to create/update
        const officialPolicy = `
          CREATE POLICY officials_crud ON public.${table}
          FOR INSERT, UPDATE USING (
            auth.uid()::text IN (
              SELECT id::text FROM public.profiles WHERE role IN ('admin', 'official')
            )
          )
          WITH CHECK (
            auth.uid()::text IN (
              SELECT id::text FROM public.profiles WHERE role IN ('admin', 'official')
            )
          )
        `
        await client.query(officialPolicy)
        
        console.log(`✓ ${table} policies created`)
      } catch (error) {
        console.warn(`⚠️  ${table}: ${error.message}`)
      }
    }

    console.log('\n✅ CRUD RLS policies fixed!')
  } finally {
    client.release()
    await pool.end()
  }
}

fixCrudRLS().catch(err => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
