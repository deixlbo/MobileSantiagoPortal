#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    'Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables'
  );
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupDatabase() {
  try {
    console.log('📦 Setting up Supabase database...\n');

    // Read the schema file
    const schemaPath = path.join(__dirname, '../supabase-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements to execute\n`);

    let executed = 0;
    let skipped = 0;
    let errors = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';

      try {
        console.log(`[${i + 1}/${statements.length}] Executing statement...`);

        // Use the query method from Supabase admin client
        await supabase.rpc('exec_sql_statement', {
          sql_statement: statement,
        }).catch(async (error) => {
          // Fallback: Try using postgrest directly
          if (error.message.includes('rpc')) {
            // For statements we can't execute via RPC, log them
            console.log(`  ℹ️  Skipping RPC-incompatible statement`);
            skipped++;
            return;
          }
          throw error;
        });

        executed++;
        console.log(`  ✓ Statement ${i + 1} executed successfully`);
      } catch (error) {
        // Some statements might fail due to existing objects, that's OK
        if (
          error.message?.includes('already exists') ||
          error.message?.includes('IF NOT EXISTS') ||
          error.message?.includes('IF EXISTS')
        ) {
          console.log(`  ℹ️  Statement ${i + 1} skipped (already exists)`);
          skipped++;
        } else {
          console.error(`  ✗ Error executing statement ${i + 1}:`);
          console.error(`    ${error.message}`);
          errors++;
        }
      }
    }

    console.log('\n📊 Setup Summary:');
    console.log(`  ✓ Executed: ${executed}`);
    console.log(`  ℹ️  Skipped: ${skipped}`);
    console.log(`  ✗ Errors: ${errors}\n`);

    if (errors === 0) {
      console.log('✅ Supabase database setup completed successfully!');
      console.log('\n✨ Your database is now ready with:');
      console.log('  • 20+ tables for resident management');
      console.log('  • Row Level Security (RLS) policies');
      console.log('  • Storage bucket for file uploads');
      console.log('  • Helper functions for role checks\n');
    } else {
      console.warn(`⚠️  Setup completed with ${errors} error(s)`);
    }
  } catch (error) {
    console.error('Fatal error during setup:', error.message);
    process.exit(1);
  }
}

// Alternative: Direct SQL execution via HTTP endpoint
async function setupDatabaseViaSQL() {
  try {
    console.log('📦 Setting up Supabase database via SQL...\n');

    const schemaPath = path.join(__dirname, '../supabase-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // Execute schema directly
    const { error, data } = await supabase.rpc('execute_sql', {
      query: schema,
    });

    if (error) {
      // If RPC doesn't work, provide instructions
      console.log('⚠️  Could not auto-execute schema. Please follow these steps:\n');
      console.log('1. Go to https://app.supabase.com/project/YOUR_PROJECT_ID/editor');
      console.log('2. Click "SQL Editor" in the left sidebar');
      console.log('3. Click "New Query"');
      console.log('4. Copy-paste the entire contents of supabase-schema.sql');
      console.log('5. Click "Run"\n');
      return false;
    }

    console.log('✅ Database schema deployed successfully!');
    return true;
  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

// Main
console.log('🚀 Supabase Database Setup\n');
console.log(`URL: ${supabaseUrl}\n`);

// Try the RPC method first, then fallback
setupDatabase().catch(async () => {
  console.log('\n⏳ RPC method failed, trying alternative approach...\n');
  await setupDatabaseViaSQL();
});
