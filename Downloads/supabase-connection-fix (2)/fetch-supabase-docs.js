const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function fetchTable(name) {
  const { data, error } = await supabase
    .from(name)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  console.log(`TABLE ${name}`);
  if (error) {
    console.log(JSON.stringify({ error: { message: error.message, code: error.code, details: error.details, hint: error.hint } }, null, 2));
    return;
  }

  console.log(JSON.stringify({ count: data?.length ?? 0, rows: data ?? [] }, null, 2));
}

(async () => {
  await fetchTable('document_requests');
  await fetchTable('document_uploads');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
