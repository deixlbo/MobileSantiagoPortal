import { NextRequest, NextResponse } from 'next/server'
import { generateDocumentHTML, generateControlNumber, DocumentData } from '@/lib/document-generator'
import { DocumentType } from '@/lib/database'
import { supabaseServer } from '@/lib/supabase-server'

function sanitizeFileName(fileName: string) {
  return fileName
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-_.]/g, '')
}

function parseDocumentPath(raw: any) {
  if (!raw) return null
  if (typeof raw === 'object') return raw

  try {
    return JSON.parse(raw)
  } catch {
    return raw
  }
}

async function uploadDocumentFile(file: File, residentId: string, requestId: string) {
  const sanitizedFileName = sanitizeFileName(file.name)
  const filePath = `${residentId}/${requestId}/${Date.now()}-${sanitizedFileName}`

  const { error } = await supabaseServer.storage
    .from('documents')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw error
  }

  const publicUrl = supabaseServer.storage.from('documents').getPublicUrl(filePath).data.publicUrl
  return { path: filePath, url: publicUrl }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let residentId = ''
    let residentName = ''
    let address = ''
    let documentType = ''
    let purpose = ''
    let barangayCaptan = ''
    let uploadedFiles: Array<Record<string, any>> = []

    const requestId = crypto.randomUUID()

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      residentId = formData.get('residentId')?.toString() || ''
      documentType = formData.get('documentType')?.toString() || ''
      purpose = formData.get('purpose')?.toString() || ''
      barangayCaptan = formData.get('barangayCaptan')?.toString() || ''

      if (!residentId || !documentType) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        )
      }

      for (const [key, value] of formData.entries()) {
        if (typeof key === 'string' && key.startsWith('file_') && value instanceof File) {
          const requirement = key.replace(/^file_/, '')
          const uploaded = await uploadDocumentFile(value, residentId, requestId)
          uploadedFiles.push({
            requirement,
            name: value.name,
            type: value.type,
            size: value.size,
            bucket: 'documents',
            path: uploaded.path,
            url: uploaded.url,
          })
        }
      }
    } else {
      const body = await request.json()
      residentId = body.residentId
      residentName = body.residentName
      address = body.address
      documentType = body.documentType
      purpose = body.purpose
      barangayCaptan = body.barangayCaptan
      uploadedFiles = body.uploadedFiles || []
    }

    if (!residentId || !documentType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!residentName) {
      const { data: profile, error: profileError } = await supabaseServer
        .from('profiles')
        .select('first_name, last_name, address')
        .eq('id', residentId)
        .single()

      if (profileError) {
        throw profileError
      }

      residentName = `${profile.first_name} ${profile.last_name}`
      address = address || profile.address || 'Barangay Santiago'
    }

    const controlNumber = generateControlNumber()
    const now = new Date()

    const documentData: DocumentData = {
      residentName,
      address: address || 'Barangay Santiago',
      controlNumber,
      issuedDate: now,
      barangayCaptan: barangayCaptan || 'Rolando C. Borja',
      purpose,
    }

    const documentHTML = generateDocumentHTML(documentType as DocumentType, documentData)

    const { data: docRequest, error } = await supabaseServer
      .from('document_requests')
      .insert([
        {
          id: requestId,
          resident_id: residentId,
          document_type: documentType as DocumentType,
          status: 'pending',
          control_number: controlNumber,
          purpose: purpose || '',
          document_path: uploadedFiles.length ? JSON.stringify(uploadedFiles) : null,
          created_at: now,
          created_by: residentId,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      documentRequest: docRequest,
      documentHTML,
    })
  } catch (error) {
    console.error('Error creating document request:', error)
    return NextResponse.json(
      { error: 'Failed to create document request' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const requestId = searchParams.get('id')
    const residentId = searchParams.get('residentId')

    if (requestId) {
      const { data: docRequest, error } = await supabaseServer
        .from('document_requests')
        .select('*')
        .eq('id', requestId)
        .single()

      if (error) {
        return NextResponse.json(
          { error: error.message || 'Document request not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        ...docRequest,
        document_path: parseDocumentPath(docRequest?.document_path),
      })
    }

    if (residentId) {
      const { data: requests, error } = await supabaseServer
        .from('document_requests')
        .select('*')
        .eq('resident_id', residentId)
      if (error) throw error

      return NextResponse.json(
        requests.map((request) => ({
          ...request,
          document_path: parseDocumentPath(request?.document_path),
        }))
      )
    }

    const { data: allRequests, error } = await supabaseServer
      .from('document_requests')
      .select('*')
    if (error) throw error

    return NextResponse.json(
      allRequests.map((request) => ({
        ...request,
        document_path: parseDocumentPath(request?.document_path),
      }))
    )
  } catch (error) {
    console.error('Error fetching document requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch document requests' },
      { status: 500 }
    )
  }
}
