#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'

const url = 'https://ehpaitpvykqkgpvtmbvb.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVocGFpdHB2eWtxa2dwdnRtYnZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDk1MDM1MiwiZXhwIjoyMDk2NTI2MzUyfQ.LH2DCiY9XiqypKzKshnkzBj8dCA2LKSoRpg-Pfa_Azs'

const supabase = createClient(url, key)

try {
  const { data, error } = await supabase.from('document_uploads').select('*').limit(1)
  
  if (error) {
    console.log('❌ Error querying table:', error.message)
  } else {
    if (data && data.length > 0) {
      console.log('✅ Table exists. Columns:', Object.keys(data[0]).join(', '))
    } else {
      console.log('✅ Table exists but is empty. Testing insert with test data...')
      const { error: insertError, data: insertData } = await supabase
        .from('document_uploads')
        .insert({
          document_id: '00000000-0000-0000-0000-000000000000',
          resident_id: '00000000-0000-0000-0000-000000000000',
          requirement_name: 'test',
          file_url: 'test',
          file_name: 'test.txt',
          file_type: 'text/plain',
          file_size: 0,
          storage_path: 'test/path'
        })
        .select()
        
      if (insertError) {
        console.log('Insert error:', insertError.message)
      } else {
        console.log('Insert data structure:', Object.keys(insertData?.[0] || {}).join(', '))
      }
    }
  }
} catch (err) {
  console.log('Error:', err.message)
 
 // Also check with rpc for schema info
 try {
   const { data, error } = await supabase.rpc('get_table_schema', { table_name: 'document_uploads' })
   if (!error && data) {
     console.log('\n📊 Schema Info:', data)
   }
 } catch (e) {
   // Try alternative method
   const { data } = await supabase
     .from('information_schema.columns')
     .select('column_name, data_type')
     .eq('table_name', 'document_uploads')
     .eq('table_schema', 'public')
   
   if (data) {
     console.log('\n📊 Table Columns:')
     data.forEach(col => console.log(`  - ${col.column_name}: ${col.data_type}`))
   }
 }
}
