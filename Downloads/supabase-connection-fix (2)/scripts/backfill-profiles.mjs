import { Pool } from 'pg'

const postgresUrl = process.env.POSTGRES_URL

if (!postgresUrl) {
  console.error('❌ POSTGRES_URL not set')
  process.exit(1)
}

async function backfillProfiles() {
  const pool = new Pool({ connectionString: postgresUrl })
  const client = await pool.connect()
  try {
    console.log('🚀 Ensuring trigger/function to create profiles for new auth users')

    const createFunction = `
CREATE OR REPLACE FUNCTION public.ensure_profile_for_new_user()
RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.user_metadata ->> 'role', NEW.app_metadata ->> 'role', 'resident'),
    now()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
`

    const createTrigger = `
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'auth_users_insert_profile'
  ) THEN
    CREATE TRIGGER auth_users_insert_profile
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.ensure_profile_for_new_user();
  END IF;
END$$;
`

    await client.query(createFunction)
    await client.query(createTrigger)
    console.log('✓ Trigger and function ensured')

    console.log('🚀 Backfilling missing profiles from auth.users')
    const backfillSql = `
INSERT INTO public.profiles (id, email, role, created_at)
SELECT u.id, u.email,
  COALESCE(u.user_metadata ->> 'role', u.app_metadata ->> 'role', 'resident') AS role,
  now()
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;
`

    const res = await client.query(backfillSql)
    console.log(`✓ Backfilled ${res.rowCount} missing profile(s)`)

    client.release()
    await pool.end()
    console.log('✨ Backfill complete')
  } catch (err) {
    console.error('❌ Error during backfill:', err)
    client.release()
    await pool.end()
    process.exit(1)
  }
}

backfillProfiles()
