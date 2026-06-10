#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  console.error('Please set these environment variables and try again.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function setupStorageBuckets() {
  try {
    console.log('🔧 Setting up Supabase Storage Buckets...\n')

    // Read the storage migration file
    const migrationPath = path.join(
      __dirname,
      '../supabase/migrations/20260609150000_create_storage_buckets.sql'
    )

    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Migration file not found:', migrationPath)
      process.exit(1)
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')

    // Split into individual statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`📝 Found ${statements.length} SQL statements\n`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i] + ';'
      console.log(`[${i + 1}/${statements.length}] Executing statement...`)

      try {
        // Execute via RPC
        const { error } = await supabase.rpc('execute_sql', {
          query: stmt,
        })

        if (error) {
          // If RPC fails, log but continue
          console.warn(`⚠️  Statement might need manual execution:`, error.message)
        } else {
          console.log(`✅ Statement ${i + 1} executed`)
        }
      } catch (err) {
        console.warn(`⚠️  Could not execute statement ${i + 1}:`, err)
      }
    }

    // Verify bucket was created
    console.log('\n🔍 Verifying bucket setup...')
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      console.error('❌ Error listing buckets:', listError)
      process.exit(1)
    }

    const residentUploadsBucket = buckets?.find(b => b.name === 'resident-uploads')
    const assetsBucket = buckets?.find(b => b.name === 'assets')

    if (residentUploadsBucket) {
      console.log('✅ resident-uploads bucket is configured')
      console.log(`   ID: ${residentUploadsBucket.id}`)
      console.log(`   Public: ${residentUploadsBucket.public}`)
    } else {
      console.warn('⚠️  resident-uploads bucket not found.')
    }

    if (assetsBucket) {
      console.log('✅ assets bucket is configured')
      console.log(`   ID: ${assetsBucket.id}`)
      console.log(`   Public: ${assetsBucket.public}`)
    } else {
      console.warn('⚠️  assets bucket not found.')
    }

    if (residentUploadsBucket && assetsBucket) {
      console.log('\n✨ Storage setup completed successfully!')
    } else {
      console.warn('\n⚠️  One or more storage buckets are missing. Please create any missing buckets manually or rerun setup.')
    }
  } catch (error) {
    console.error('❌ Fatal error:', error.message)
    process.exit(1)
  }
}

setupStorageBuckets()
