import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('[v0] Starting database setup...');

    // Read schema SQL
    const schemaPath = path.join(process.cwd(), 'scripts', '01_schema.sql');
    const seedPath = path.join(process.cwd(), 'scripts', '02_seed_data.sql');

    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    const seedSql = fs.readFileSync(seedPath, 'utf-8');

    // Split SQL statements (simple split by semicolon)
    const schemaStatements = schemaSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const seedStatements = seedSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Execute schema statements
    console.log('[v0] Creating tables...');
    for (const statement of schemaStatements) {
      try {
        const { error } = await supabase.rpc('execute_sql', { sql: statement });
        if (error && !error.message.includes('already exists')) {
          console.warn('[v0] Schema warning:', error.message);
        }
      } catch (e) {
        console.warn('[v0] Statement execution skipped:', e.message);
      }
    }

    // Execute seed statements
    console.log('[v0] Seeding data...');
    for (const statement of seedStatements) {
      try {
        const { error } = await supabase.rpc('execute_sql', { sql: statement });
        if (error) {
          console.warn('[v0] Seed warning:', error.message);
        }
      } catch (e) {
        console.warn('[v0] Seed statement skipped:', e.message);
      }
    }

    console.log('[v0] Database setup completed!');
    
    // Display sample credentials
    console.log('\n=== SAMPLE LOGIN CREDENTIALS ===\n');
    console.log('Admin User:');
    console.log('  Email: admin@santiago.gov');
    console.log('  Password: Admin@123456\n');
    console.log('Official User:');
    console.log('  Email: official@santiago.gov');
    console.log('  Password: Official@123456\n');
    console.log('Resident User:');
    console.log('  Email: resident@example.com');
    console.log('  Password: Resident@123456\n');

  } catch (error) {
    console.error('[v0] Database setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
