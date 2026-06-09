import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import * as fs from 'fs/promises'
import * as path from 'path'
import { Client } from 'pg'

export async function POST(request: NextRequest) {
  try {
    // This endpoint initializes the database schema by executing supabase-schema.sql.
    // Only allow this from authenticated admin users or localhost during development.

    const authHeader = request.headers.get('authorization')
    const localhost = request.headers.get('host')?.includes('localhost')

    if (!localhost && !authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if profiles table already exists
    const { data: existingTable, error: checkError } = await supabaseServer
      .from('profiles')
      .select('id')
      .limit(1)
      .maybeSingle()

    if (!checkError) {
      return NextResponse.json({
        message: 'Database schema already initialized',
        success: true,
      })
    }

    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      return NextResponse.json(
        { error: 'DATABASE_URL is not configured' },
        { status: 500 }
      )
    }

    const schemaPath = path.join(process.cwd(), 'supabase-schema.sql')
    const schemaSql = await fs.readFile(schemaPath, 'utf-8')

    const client = new Client({ connectionString: databaseUrl })
    await client.connect()

    try {
      await client.query(schemaSql)
    } finally {
      await client.end()
    }

    return NextResponse.json({
      message: 'Database schema initialized successfully',
      success: true,
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
