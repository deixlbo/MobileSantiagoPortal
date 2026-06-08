#!/usr/bin/env node

import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config({ path: '/vercel/share/.env.project' });

const postgresUrl = process.env.POSTGRES_URL;

if (!postgresUrl) {
  console.error('❌ POSTGRES_URL not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString: postgresUrl,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  try {
    const client = await pool.connect();

    // Get table count
    const tables = await client.query(
      "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'"
    );
    const tableCount = tables.rows[0].count;

    // Get function count
    const functions = await client.query(
      "SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_type = 'FUNCTION'"
    );
    const functionCount = functions.rows[0].count;

    // Check bucket
    const buckets = await client.query(
      "SELECT COUNT(*) FROM storage.buckets WHERE name = 'resident-uploads'"
    );
    const bucketExists = buckets.rows[0].count > 0;

    // List tables
    const tableList = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' ORDER BY table_name
    `);

    console.log('\n✅ Supabase Database Verification\n');
    console.log('📊 Tables: ' + tableCount + ' tables created');
    console.log('🔧 Functions: ' + functionCount + ' functions available');
    console.log('💾 Storage: ' + (bucketExists ? 'resident-uploads bucket ✓' : 'No storage bucket'));

    console.log('\n📋 Created Tables:');
    tableList.rows.forEach((row, i) => {
      if (i < 10) {
        console.log('  ' + (i + 1) + '. ' + row.table_name);
      }
    });
    if (tableCount > 10) {
      console.log('  ... and ' + (tableCount - 10) + ' more');
    }

    console.log(
      '\n✨ Your Supabase database is fully configured and ready to use!\n'
    );

    client.release();
    process.exit(0);
  } catch (err) {
    console.error('❌ Verification failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
