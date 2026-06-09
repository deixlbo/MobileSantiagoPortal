// ========================================================
// SUPABASE CRUD FIXES - COPY/PASTE SNIPPETS
// ========================================================
// Use these snippets to quickly apply the same patterns
// to remaining API routes
// ========================================================

// ========================================================
// 1. STANDARD POST ENDPOINT TEMPLATE
// ========================================================
import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      // List all required fields
      field1,
      field2,
      optionalField = null 
    } = body

    // VALIDATION: Check required fields
    if (!field1 || !field2) {
      return NextResponse.json(
        { error: 'Missing required fields: field1, field2' },
        { status: 400 }
      )
    }

    // TIMESTAMPS: Add timestamps
    const now = new Date().toISOString()

    // INSERT: Create record with timestamps
    const { data: record, error } = await supabaseServer
      .from('table_name')
      .insert([
        {
          field1,
          field2,
          optional_field: optionalField,
          created_at: now,
          updated_at: now,
        },
      ])
      .select()
      .single()

    // ERROR HANDLING: Check for errors
    if (error) {
      console.error('[YourRoute POST Error]', error.message)
      return NextResponse.json(
        { error: 'Failed to create record: ' + error.message },
        { status: 500 }
      )
    }

    // RETURN: Always include success flag and HTTP status
    return NextResponse.json({
      success: true,
      record,
    }, { status: 201 })
  } catch (error) {
    console.error('[YourRoute POST Exception]', error)
    return NextResponse.json(
      { error: 'Failed to create record' },
      { status: 500 }
    )
  }
}

// ========================================================
// 2. STANDARD GET ENDPOINT TEMPLATE
// ========================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const status = searchParams.get('status')

    // SINGLE RECORD: By ID
    if (id) {
      const { data: record, error } = await supabaseServer
        .from('table_name')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('[YourRoute GET by ID Error]', error.message)
        return NextResponse.json(
          { error: 'Record not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(record)
    }

    // MULTIPLE RECORDS: With optional filtering
    let query = supabaseServer.from('table_name').select('*')
    if (status) {
      query = query.eq('status', status)
    }

    const { data: records, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('[YourRoute GET All Error]', error.message)
      return NextResponse.json(
        { error: 'Failed to fetch records' },
        { status: 500 }
      )
    }

    return NextResponse.json(records || [])
  } catch (error) {
    console.error('[YourRoute GET Exception]', error)
    return NextResponse.json(
      { error: 'Failed to fetch records' },
      { status: 500 }
    )
  }
}

// ========================================================
// 3. STANDARD PUT (UPDATE) ENDPOINT TEMPLATE
// ========================================================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    // VALIDATION: ID is required
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    // TIMESTAMP: Update the updated_at field
    updates.updated_at = new Date().toISOString()

    // UPDATE: Execute update
    const { data: record, error } = await supabaseServer
      .from('table_name')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[YourRoute PUT Error]', error.message)
      return NextResponse.json(
        { error: 'Record not found or update failed' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      record,
    })
  } catch (error) {
    console.error('[YourRoute PUT Exception]', error)
    return NextResponse.json(
      { error: 'Failed to update record' },
      { status: 500 }
    )
  }
}

// ========================================================
// 4. VALIDATION FUNCTIONS (REUSABLE)
// ========================================================

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// URL validation
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Phone validation (Philippine format)
function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+63|0)?[0-9]{10}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

// Date validation
function isValidDate(dateString: string): boolean {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}

// ========================================================
// 5. COMMON FIELD VALIDATION EXAMPLES
// ========================================================

// Email field
if (!email || !isValidEmail(email)) {
  return NextResponse.json(
    { error: 'Invalid email address' },
    { status: 400 }
  )
}

// Phone number field
if (contactNumber && !isValidPhoneNumber(contactNumber)) {
  return NextResponse.json(
    { error: 'Invalid phone number format' },
    { status: 400 }
  )
}

// URL field
if (link && !isValidUrl(link)) {
  return NextResponse.json(
    { error: 'Invalid URL format' },
    { status: 400 }
  )
}

// Date field
if (dateOfBirth && !isValidDate(dateOfBirth)) {
  return NextResponse.json(
    { error: 'Invalid date format' },
    { status: 400 }
  )
}

// ========================================================
// 6. DELETE ENDPOINT TEMPLATE
// ========================================================
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabaseServer
      .from('table_name')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[YourRoute DELETE Error]', error.message)
      return NextResponse.json(
        { error: 'Failed to delete record' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Record deleted successfully',
    })
  } catch (error) {
    console.error('[YourRoute DELETE Exception]', error)
    return NextResponse.json(
      { error: 'Failed to delete record' },
      { status: 500 }
    )
  }
}

// ========================================================
// 7. PAGINATION HELPER (For large result sets)
// ========================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')

    // Validate pagination params
    if (page < 1 || pageSize < 1 || pageSize > 500) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      )
    }

    const offset = (page - 1) * pageSize

    const { data: records, error, count } = await supabaseServer
      .from('table_name')
      .select('*', { count: 'exact' })
      .range(offset, offset + pageSize - 1)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[YourRoute Pagination Error]', error.message)
      return NextResponse.json(
        { error: 'Failed to fetch records' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: records || [],
      pagination: {
        page,
        pageSize,
        total: count || 0,
        pages: Math.ceil((count || 0) / pageSize),
      },
    })
  } catch (error) {
    console.error('[YourRoute GET Exception]', error)
    return NextResponse.json(
      { error: 'Failed to fetch records' },
      { status: 500 }
    )
  }
}

// ========================================================
// 8. AUDIT LOGGING HELPER
// ========================================================
async function logAction(userId: string, action: string, entityType: string, entityId?: string, changes?: any) {
  try {
    const now = new Date().toISOString()
    const { error } = await supabaseServer
      .from('audit_logs')
      .insert([{
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        changes: changes || {},
        ip_address: 'N/A',
        created_at: now,
      }])

    if (error) {
      console.error('[Audit Log Error]', error.message)
    }
  } catch (err) {
    console.error('[Audit Log Exception]', err)
  }
}

// Usage in your routes:
// await logAction(userId, 'CREATE', 'documents', documentId, { type, status })
// await logAction(userId, 'UPDATE', 'profiles', profileId, { verification_status: 'verified' })

// ========================================================
// 9. QUICK REFERENCE: HTTP STATUS CODES
// ========================================================
// 200 OK - GET successful
// 201 CREATED - POST successful
// 204 NO CONTENT - DELETE successful
// 400 BAD REQUEST - Invalid input/validation failed
// 404 NOT FOUND - Record not found
// 409 CONFLICT - Duplicate/conflict error
// 500 INTERNAL SERVER ERROR - Database/server error

// ========================================================
// 10. LOGGING BEST PRACTICES
// ========================================================

// Always prefix logs with [Route Name]:
console.error('[YourRoute POST Error]', error.message)
console.error('[YourRoute GET Exception]', error)
console.warn('[YourRoute] Fallback behavior triggered')

// Include relevant context:
console.log('[DocumentAPI POST] Creating document for resident:', residentId)
console.log('[DocumentAPI POST] Control number generated:', controlNumber)

// Never log sensitive data:
// ❌ console.log('User password:', password)
// ✅ console.log('[Auth POST] User registration initiated')
