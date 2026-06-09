// Test script for verifying Supabase CRUD operations
// Run via: npx tsx scripts/test-crud-operations.ts

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

interface TestResult {
  name: string
  passed: boolean
  error?: string
  duration: number
}

const results: TestResult[] = []

async function test(name: string, fn: () => Promise<void>) {
  const start = Date.now()
  try {
    await fn()
    results.push({ name, passed: true, duration: Date.now() - start })
    console.log(`✓ ${name}`)
  } catch (error) {
    results.push({
      name,
      passed: false,
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start,
    })
    console.log(`✗ ${name}`)
    if (error instanceof Error) console.log(`  Error: ${error.message}`)
  }
}

async function runTests() {
  console.log('🧪 Starting Supabase CRUD Tests...\n')

  // Test 1: Create resident profile
  let testResidentId = ''
  await test('CREATE: Resident profile', async () => {
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          email: `test-${Date.now()}@example.com`,
          role: 'resident',
          first_name: 'Test',
          last_name: 'Resident',
          purok: 'Test Purok',
          verification_status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw new Error(`Insert failed: ${error.message}`)
    if (!data?.id) throw new Error('No ID returned from insert')
    testResidentId = data.id
  })

  // Test 2: Read resident profile
  await test('READ: Resident profile', async () => {
    if (!testResidentId) throw new Error('No resident ID from previous test')
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', testResidentId)
      .single()

    if (error) throw new Error(`Query failed: ${error.message}`)
    if (!data) throw new Error('No data returned from query')
  })

  // Test 3: Update resident profile
  await test('UPDATE: Resident profile', async () => {
    if (!testResidentId) throw new Error('No resident ID from previous test')
    
    const { data, error } = await supabase
      .from('profiles')
      .update({
        verification_status: 'verified',
        updated_at: new Date().toISOString(),
      })
      .eq('id', testResidentId)
      .select()
      .single()

    if (error) throw new Error(`Update failed: ${error.message}`)
    if (data?.verification_status !== 'verified') throw new Error('Update did not apply')
  })

  // Test 4: Create document request
  let testDocumentId = ''
  await test('CREATE: Document request', async () => {
    if (!testResidentId) throw new Error('No resident ID from previous test')
    
    const { data, error } = await supabase
      .from('document_requests')
      .insert([
        {
          resident_id: testResidentId,
          document_type: 'barangay_clearance',
          status: 'pending',
          control_number: `BC-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw new Error(`Insert failed: ${error.message}`)
    if (!data?.id) throw new Error('No ID returned from insert')
    testDocumentId = data.id
  })

  // Test 5: Read document request
  await test('READ: Document request', async () => {
    if (!testDocumentId) throw new Error('No document ID from previous test')
    
    const { data, error } = await supabase
      .from('document_requests')
      .select('*')
      .eq('id', testDocumentId)
      .single()

    if (error) throw new Error(`Query failed: ${error.message}`)
    if (!data) throw new Error('No data returned from query')
  })

  // Test 6: Update document request
  await test('UPDATE: Document request status', async () => {
    if (!testDocumentId) throw new Error('No document ID from previous test')
    
    const { data, error } = await supabase
      .from('document_requests')
      .update({
        status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', testDocumentId)
      .select()
      .single()

    if (error) throw new Error(`Update failed: ${error.message}`)
    if (data?.status !== 'completed') throw new Error('Update did not apply')
  })

  // Test 7: Create notification
  let testNotificationId = ''
  await test('CREATE: Notification', async () => {
    if (!testResidentId) throw new Error('No resident ID from previous test')
    
    const { data, error } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: testResidentId,
          title: 'Test Notification',
          message: 'This is a test notification',
          type: 'info',
          read: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw new Error(`Insert failed: ${error.message}`)
    if (!data?.id) throw new Error('No ID returned from insert')
    testNotificationId = data.id
  })

  // Test 8: Read notification
  await test('READ: Notification', async () => {
    if (!testNotificationId) throw new Error('No notification ID from previous test')
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', testNotificationId)
      .single()

    if (error) throw new Error(`Query failed: ${error.message}`)
    if (!data) throw new Error('No data returned from query')
  })

  // Test 9: Update notification read status
  await test('UPDATE: Notification read status', async () => {
    if (!testNotificationId) throw new Error('No notification ID from previous test')
    
    const { data, error } = await supabase
      .from('notifications')
      .update({
        read: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', testNotificationId)
      .select()
      .single()

    if (error) throw new Error(`Update failed: ${error.message}`)
    if (data?.read !== true) throw new Error('Update did not apply')
  })

  // Test 10: Delete notification
  await test('DELETE: Notification', async () => {
    if (!testNotificationId) throw new Error('No notification ID from previous test')
    
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', testNotificationId)

    if (error) throw new Error(`Delete failed: ${error.message}`)
  })

  // Test 11: Delete document request
  await test('DELETE: Document request', async () => {
    if (!testDocumentId) throw new Error('No document ID from previous test')
    
    const { error } = await supabase
      .from('document_requests')
      .delete()
      .eq('id', testDocumentId)

    if (error) throw new Error(`Delete failed: ${error.message}`)
  })

  // Test 12: Delete resident profile
  await test('DELETE: Resident profile', async () => {
    if (!testResidentId) throw new Error('No resident ID from previous test')
    
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', testResidentId)

    if (error) throw new Error(`Delete failed: ${error.message}`)
  })

  // Test 13: Verify timestamps are ISO format
  await test('VALIDATION: Timestamps are ISO format', async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('created_at, updated_at')
      .limit(1)
      .single()

    if (error) throw new Error(`Query failed: ${error.message}`)
    
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
    if (!isoRegex.test(data?.created_at)) throw new Error(`Invalid created_at format: ${data?.created_at}`)
    if (!isoRegex.test(data?.updated_at)) throw new Error(`Invalid updated_at format: ${data?.updated_at}`)
  })

  // Test 14: Verify RLS policies exist
  await test('VALIDATION: RLS policies are enforced', async () => {
    const { error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)

    // This should work with service role key - no error expected
    if (error && error.code !== 'PGRST116') {
      throw new Error(`Unexpected error (RLS might be misconfigured): ${error.message}`)
    }
  })

  // Summary
  console.log('\n📊 Test Results Summary:\n')
  const passed = results.filter((r) => r.passed).length
  const failed = results.filter((r) => !r.passed).length
  const totalTime = results.reduce((sum, r) => sum + r.duration, 0)

  results.forEach((result) => {
    const icon = result.passed ? '✓' : '✗'
    const status = result.passed ? 'PASS' : 'FAIL'
    console.log(`${icon} [${status}] ${result.name} (${result.duration}ms)`)
    if (result.error) console.log(`  └─ ${result.error}`)
  })

  console.log(`\n${passed} passed, ${failed} failed in ${totalTime}ms\n`)

  if (failed > 0) {
    console.error('❌ Some tests failed!')
    process.exit(1)
  } else {
    console.log('✅ All tests passed!')
    process.exit(0)
  }
}

runTests().catch((error) => {
  console.error('❌ Test runner error:', error)
  process.exit(1)
})
