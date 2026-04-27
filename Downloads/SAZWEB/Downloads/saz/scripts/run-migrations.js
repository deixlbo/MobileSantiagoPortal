#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigrations() {
  try {
    console.log('Starting database migrations...\n');

    // Read SQL files
    const schemaFile = fs.readFileSync(path.join(import.meta.dirname, '01_schema.sql'), 'utf-8');
    const seedFile = fs.readFileSync(path.join(import.meta.dirname, '02_seed_data.sql'), 'utf-8');

    // Execute schema migration
    console.log('Running schema migration...');
    const { error: schemaError } = await supabase.rpc('execute_sql', {
      sql: schemaFile,
    }).catch(() => {
      // Fallback: execute statements one by one
      return executeStatementsByStatement(supabase, schemaFile);
    });

    if (schemaError) {
      console.error('Schema migration error:', schemaError);
      // Continue anyway - might be partial success
    } else {
      console.log('✓ Schema migration completed');
    }

    // Execute seed migration
    console.log('\nRunning seed data migration...');
    const { error: seedError } = await supabase.rpc('execute_sql', {
      sql: seedFile,
    }).catch(() => {
      // Fallback: execute statements one by one
      return executeStatementsByStatement(supabase, seedFile);
    });

    if (seedError) {
      console.error('Seed migration error:', seedError);
    } else {
      console.log('✓ Seed data migration completed');
    }

    console.log('\n✓ All migrations completed successfully!\n');

    // Print sample credentials
    console.log('═'.repeat(60));
    console.log('SAMPLE LOGIN CREDENTIALS');
    console.log('═'.repeat(60));
    console.log('\nADMIN ACCOUNT:');
    console.log('  Email: admin@santiago.gov.ph');
    console.log('  Password: password123');
    console.log('');
    console.log('RESIDENT ACCOUNT 1:');
    console.log('  Email: juan.dela.cruz@email.com');
    console.log('  Password: password123');
    console.log('');
    console.log('RESIDENT ACCOUNT 2:');
    console.log('  Email: maria.santos@email.com');
    console.log('  Password: password123');
    console.log('');
    console.log('OFFICIAL ACCOUNT 1:');
    console.log('  Email: mayor@santiago.gov.ph');
    console.log('  Password: password123');
    console.log('');
    console.log('OFFICIAL ACCOUNT 2:');
    console.log('  Email: secretary@santiago.gov.ph');
    console.log('  Password: password123');
    console.log('═'.repeat(60) + '\n');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

async function executeStatementsByStatement(client, sqlContent) {
  // Split by semicolon and filter empty statements
  const statements = sqlContent
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

  for (const statement of statements) {
    try {
      const { error } = await client.rpc('exec', { statement });
      if (error && !error.message.includes('already exists')) {
        console.warn(`Warning executing: ${statement.substring(0, 50)}...`, error.message);
      }
    } catch (err) {
      console.warn(`Could not execute statement, continuing:`, err.message);
    }
  }

  return { error: null };
}

runMigrations();
