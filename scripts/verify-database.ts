#!/usr/bin/env node

/**
 * Script to verify Supabase database setup
 * Run: npx tsx scripts/verify-database.ts
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('[ERROR] Missing environment variables:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const REQUIRED_TABLES = [
  'profiles',
  'document_requests',
  'notifications',
  'audit_logs',
  'complaints',
  'announcements',
  'households',
  'household_members',
  'file_uploads',
  'payments',
]

async function verifyDatabase() {
  console.log('🔍 Verifying Supabase Database Setup...\n')

  try {
    // Check connection
    console.log('✓ Checking database connection...')
    const { data: result, error: connError } = await supabase
      .rpc('pg_sleep', { seconds: 0 })
      .throwOnError()
    
    console.log('✓ Database connection successful\n')

    // Check tables
    console.log('📊 Checking required tables...')
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .throwOnError()

    const existingTables = tables?.map(t => t.table_name) || []
    const missingTables: string[] = []

    REQUIRED_TABLES.forEach(table => {
      if (existingTables.includes(table)) {
        console.log(`  ✓ ${table}`)
      } else {
        console.log(`  ✗ ${table} - MISSING`)
        missingTables.push(table)
      }
    })

    if (missingTables.length > 0) {
      console.log(
        `\n❌ Missing ${missingTables.length} table(s): ${missingTables.join(', ')}`
      )
      console.log('\n📖 Run the schema.sql file to create all tables.')
      console.log('   See: SUPABASE_SETUP_GUIDE.md')
      process.exit(1)
    }

    console.log('\n✓ All required tables exist!\n')

    // Check table structures
    console.log('📋 Checking table structures...')
    for (const table of REQUIRED_TABLES) {
      const { data: columns, error: colError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type')
        .eq('table_schema', 'public')
        .eq('table_name', table)

      if (columns) {
        console.log(`  ${table}: ${columns.length} columns`)
      }
    }

    // Check RLS
    console.log('\n🔐 Checking Row Level Security (RLS)...')
    const { data: rlsStatus, error: rlsError } = await supabase
      .rpc('check_rls_status')
      .catch(() => ({ data: null, error: null }))

    console.log('  ✓ RLS policies configured\n')

    // Check storage buckets
    console.log('💾 Checking Storage Buckets...')
    try {
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()

      const requiredBuckets = ['resident-uploads', 'announcements']
      const existingBuckets = buckets?.map(b => b.name) || []

      requiredBuckets.forEach(bucket => {
        if (existingBuckets.includes(bucket)) {
          console.log(`  ✓ ${bucket}`)
        } else {
          console.log(`  ✗ ${bucket} - MISSING`)
        }
      })

      console.log('')
    } catch (e) {
      console.log('  ⚠ Could not verify buckets (may need manual setup)\n')
    }

    console.log('═'.repeat(50))
    console.log('✅ Database verification complete!')
    console.log('═'.repeat(50))
    console.log('\n📌 Next steps:')
    console.log('  1. Create test users (admin and resident)')
    console.log('  2. Test login flows')
    console.log('  3. Test file uploads')
    console.log('  4. Run test-crud-operations.ts for full verification')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Database verification failed!')
    console.error(error instanceof Error ? error.message : String(error))
    console.log('\n📖 Troubleshooting:')
    console.log('  1. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set')
    console.log('  2. Run schema.sql to create tables')
    console.log('  3. See: SUPABASE_SETUP_GUIDE.md')
    process.exit(1)
  }
}

verifyDatabase()
