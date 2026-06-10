import { Pool } from 'pg'
import fs from 'fs'
import path from 'path'

const postgresUrl = process.env.POSTGRES_URL

if (!postgresUrl) {
  console.error('❌ POSTGRES_URL not set')
  process.exit(1)
}

async function fixSchema() {
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
    console.log('🚀 Fixing Supabase Schema\n')
    const connection = await pool.connect()
    console.log('✓ Connected to database\n')

    // Create profiles table that mirrors users table
    const createProfilesTable = `
      -- Drop existing profiles table if it exists
      DROP TABLE IF EXISTS public.profiles CASCADE;

      -- Create profiles table with RLS
      CREATE TABLE public.profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        email TEXT UNIQUE NOT NULL,
        full_name TEXT,
        first_name TEXT,
        last_name TEXT,
        middle_name TEXT,
        suffix TEXT,
        role TEXT CHECK (role IN ('resident', 'official', 'admin')) DEFAULT 'resident',
        phone_number TEXT,
        contact_number TEXT,
        profile_image_url TEXT,
        address TEXT,
        purok VARCHAR(50),
        bio TEXT,
        gender TEXT,
        occupation TEXT,
        civil_status TEXT,
        date_of_birth DATE,
        position TEXT,
        verification_status TEXT CHECK (verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
        is_active BOOLEAN DEFAULT true,
        id_type TEXT,
        id_path TEXT,
        household_id UUID,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create index on email for faster lookups
      CREATE INDEX idx_profiles_email ON public.profiles(email);
      CREATE INDEX idx_profiles_role ON public.profiles(role);
      CREATE INDEX idx_profiles_verification_status ON public.profiles(verification_status);

      -- Enable RLS
      ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

      -- RLS Policy: Users can view their own profile
      CREATE POLICY "Users can view own profile"
        ON public.profiles
        FOR SELECT
        USING (auth.uid() = id);

      -- RLS Policy: Users can update their own profile
      CREATE POLICY "Users can update own profile"
        ON public.profiles
        FOR UPDATE
        USING (auth.uid() = id);

      -- RLS Policy: Admins can view all profiles
      CREATE POLICY "Admins can view all profiles"
        ON public.profiles
        FOR SELECT
        USING (
          (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'official')
        );

      -- RLS Policy: Admins can update all profiles
      CREATE POLICY "Admins can update all profiles"
        ON public.profiles
        FOR UPDATE
        USING (
          (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
        );

      -- RLS Policy: Service role (server-side) can perform all operations
      CREATE POLICY "Service role can manage all profiles"
        ON public.profiles
        FOR ALL
        USING (auth.role() = 'service_role');

      -- RLS Policy: Users can insert their own profile during registration
      CREATE POLICY "Users can insert their own profile"
        ON public.profiles
        FOR INSERT
        WITH CHECK (auth.uid() = id);
    `

    console.log('Step 1: Creating profiles table...')
    await connection.query(createProfilesTable)
    console.log('✓ Profiles table created with RLS policies\n')

    // Verify the table exists
    const tableCheck = await connection.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles'"
    )
    console.log('Step 2: Verifying profiles table...')
    if (tableCheck.rows.length > 0) {
      console.log('✓ Profiles table verified\n')
    } else {
      throw new Error('Profiles table was not created')
    }

    // Check policies
    const policyCheck = await connection.query(
      "SELECT policyname FROM pg_policies WHERE tablename = 'profiles' ORDER BY policyname"
    )
    console.log('Step 3: Verifying RLS policies...')
    console.log(`✓ ${policyCheck.rows.length} RLS policies created:`)
    policyCheck.rows.forEach((row) => {
      console.log(`  - ${row.policyname}`)
    })

    connection.release()
    await pool.end()

    console.log('\n✨ Schema fix completed successfully!')
    console.log('\n📋 Summary:')
    console.log('  - profiles table created')
    console.log('  - RLS policies enabled')
    console.log('  - Service role access configured')
    console.log('  - Indexes created for performance')
    console.log('\n✅ The application can now use the profiles table!\n')
  } catch (error) {
    console.error('❌ Error:', error.message)
    await pool.end()
    process.exit(1)
  }
}

fixSchema()
