import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { uploadAssetImage, deleteAssetImage } from '@/lib/storage'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function getBearerToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization')
  return authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader
}

async function getCookieSupabase() {
  const cookieStore = await cookies()
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        )
      },
    },
  })
}

async function getCurrentUser(request: NextRequest) {
  const cookieSupabase = await getCookieSupabase()
  const { data: sessionData } = await cookieSupabase.auth.getSession()
  let user = sessionData?.session?.user

  if (!user) {
    const token = await getBearerToken(request)
    if (token) {
      const { data: userData, error } = await supabaseServer.auth.getUser(token)
      if (!error && userData?.user) {
        user = userData.user
      }
    }
  }

  return user
}

async function isOfficial(userId: string): Promise<boolean> {
  const { data: profile } = await supabaseServer
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  return profile?.role === 'official' || profile?.role === 'admin'
}

function formatDateValue(value: unknown) {
  if (value == null || value === '') return ''

  const parsedDate = new Date(String(value))
  if (Number.isNaN(parsedDate.getTime())) return ''

  return parsedDate.toISOString().split('T')[0]
}

function normalizeAssetRecord(asset: any) {
  if (!asset) return asset

  return {
    ...asset,
    name: asset.name ?? '',
    category: asset.category ?? 'equipment',
    description: asset.description ?? '',
    location: asset.location ?? '',
    condition: asset.condition ?? 'Good',
    quantity: asset.quantity ?? 1,
    acquisition_date: formatDateValue(asset.acquisition_date),
    acquisition_cost: asset.acquisition_cost ?? null,
    current_value: asset.current_value ?? asset.acquisition_cost ?? 0,
    status: asset.status ?? 'Active',
    serial_number: asset.serial_number ?? '',
    assigned_to: asset.assigned_to ?? '',
    last_maintenance: formatDateValue(asset.last_maintenance),
    image_url: asset.image_url ?? asset.image ?? null,
  }
}

async function recordAssetImageUpload(assetId: string, userId: string, file: File, storagePath: string) {
  try {
    const payload = {
      document_request_id: assetId,
      file_name: file.name,
      file_path: storagePath,
      file_size: file.size,
      file_type: file.type,
      uploaded_by: userId,
      uploaded_at: new Date().toISOString(),
      upload_status: 'uploaded',
    }

    const { error } = await supabaseServer
      .from('document_uploads')
      .insert([payload])

    if (error) {
      console.warn('Unable to record asset image audit entry; continuing without it:', error.message)
    }
  } catch (error) {
    console.warn('Unable to record asset image audit entry; continuing without it:', error)
  }

  return { data: null, error: null }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const assetId = searchParams.get('id')

    if (assetId) {
      const { data: asset, error } = await supabaseServer
        .from('assets')
        .select('*')
        .eq('id', assetId)
        .single()

      if (error) {
        return NextResponse.json({ error: error.message || 'Asset not found' }, { status: 404 })
      }

      return NextResponse.json(normalizeAssetRecord(asset))
    }

    const { data: assets, error } = await supabaseServer
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching assets:', error)
      return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 })
    }

    return NextResponse.json((assets || []).map(normalizeAssetRecord))
  } catch (error) {
    console.error('Error fetching assets:', error)
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''

    let assetData: any = {}
    let file: File | null = null

    if (contentType.includes('multipart/form-data')) {
      // Handle FormData with file
      const formData = await request.formData()
      assetData = {
        name: formData.get('name'),
        category: formData.get('category'),
        description: formData.get('description'),
        location: formData.get('location'),
        condition: formData.get('condition'),
        quantity: formData.get('quantity'),
        acquisition_date: formData.get('acquisition_date'),
        acquisition_cost: formData.get('acquisition_cost'),
        current_value: formData.get('current_value') ?? formData.get('acquisition_cost'),
        serial_number: formData.get('serial_number'),
        assigned_to: formData.get('assigned_to'),
        last_maintenance: formData.get('last_maintenance'),
        status: formData.get('status'),
      }
      file = formData.get('image') as File | null
    } else {
      // Handle JSON
      assetData = await request.json()
    }

    const {
      name,
      category,
      description,
      location,
      condition,
      quantity,
      acquisition_date,
      acquisition_cost,
      current_value,
      serial_number,
      assigned_to,
      last_maintenance,
      status,
    } = assetData

    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isOfficialUser = await isOfficial(user.id)
    if (!isOfficialUser) {
      return NextResponse.json({ error: 'Only officials can create assets' }, { status: 403 })
    }

    if (!name) {
      return NextResponse.json({ error: 'Asset name is required' }, { status: 400 })
    }

    // Validate file size if image exists (max 5MB)
    if (file && file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      )
    }

    const parseOptionalNumber = (value: unknown) => {
      if (value == null) return null
      const normalized = String(value).trim()
      return normalized === '' ? null : Number(normalized)
    }

    const parseOptionalString = (value: unknown) => {
      if (value == null) return null
      const normalized = String(value).trim()
      return normalized === '' ? null : normalized
    }

    const parsedQuantity = quantity != null && String(quantity).trim() !== '' ? parseInt(String(quantity), 10) : 1
    const parsedAcquisitionCost = parseOptionalNumber(acquisition_cost)
    const parsedCurrentValue = parseOptionalNumber(current_value) ?? parsedAcquisitionCost
    const parsedSerialNumber = parseOptionalString(serial_number)
    const parsedAssignedTo = parseOptionalString(assigned_to)
    const parsedLastMaintenance = last_maintenance != null && String(last_maintenance).trim() !== ''
      ? new Date(String(last_maintenance))
      : null

    const insertPayload: any = {
      name,
      category: category || null,
      description: description || null,
      location: location || null,
      condition: condition || 'Good',
      quantity: Number.isNaN(parsedQuantity) ? 1 : parsedQuantity,
      acquisition_date: acquisition_date ? new Date(String(acquisition_date)) : null,
      acquisition_cost: parsedAcquisitionCost,
      current_value: parsedCurrentValue,
      status: status || 'Active',
    }

    if (parsedSerialNumber) insertPayload.serial_number = parsedSerialNumber
    if (parsedAssignedTo) insertPayload.assigned_to = parsedAssignedTo
    if (parsedLastMaintenance) insertPayload.last_maintenance = parsedLastMaintenance

    let asset: any = null
    let insertError: any = null

    const insertResult = await supabaseServer
      .from('assets')
      .insert([insertPayload])
      .select()
      .single()

    asset = insertResult.data
    insertError = insertResult.error

    if (insertError && (insertPayload.serial_number || insertPayload.assigned_to || insertPayload.last_maintenance)) {
      console.warn('Retrying asset create without optional columns due to error:', insertError)
      const { serial_number: _serialNumber, assigned_to: _assignedTo, last_maintenance: _lastMaintenance, ...fallbackPayload } = insertPayload

      const fallbackResult = await supabaseServer
        .from('assets')
        .insert([fallbackPayload])
        .select()
        .single()

      asset = fallbackResult.data
      insertError = fallbackResult.error
    }

    if (insertError) {
      console.error('FULL ASSET ERROR:', JSON.stringify(insertError, null, 2))

      return NextResponse.json(
        {
          error: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code,
        },
        { status: 500 }
      )
    }

    // Upload image if provided
    let imageUrl: string | null = null
    if (file && asset) {
      const buffer = await file.arrayBuffer()
      const uploadResult = await uploadAssetImage(asset.id, buffer, {
        contentType: file.type,
        fileName: `${Date.now()}-${file.name}`,
      })

      if (uploadResult.error) {
        console.error('Error uploading asset image:', uploadResult.error)
        const fallbackAsset = { ...asset, image_url: asset.image_url || null }
        return NextResponse.json({ success: true, asset: fallbackAsset }, { status: 201 })
      }

      imageUrl = uploadResult.publicUrl
      if (imageUrl) {
        const { error: updateError } = await supabaseServer
          .from('assets')
          .update({ image_url: imageUrl })
          .eq('id', asset.id)

        if (updateError) {
          console.error('Error updating asset image URL:', updateError)
          return NextResponse.json({ error: 'Failed to save asset image' }, { status: 500 })
        }

        await recordAssetImageUpload(asset.id, user.id, file, uploadResult.storagePath || `${imageUrl}`)
      }
    }

    const finalAsset = { ...asset, image_url: imageUrl || asset?.image_url || null }
    return NextResponse.json({ success: true, asset: finalAsset }, { status: 201 })
  } catch (error) {
    console.error('Error creating asset:', error)
    return NextResponse.json({ error: 'Failed to create asset' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const assetId = searchParams.get('id')
    const contentType = request.headers.get('content-type') || ''

    if (!assetId) {
      return NextResponse.json({ error: 'Asset id is required' }, { status: 400 })
    }

    let updateBody: any = {}
    let file: File | null = null

    if (contentType.includes('multipart/form-data')) {
      // Handle FormData with file
      const formData = await request.formData()
      if (formData.get('name')) updateBody.name = formData.get('name')
      if (formData.get('category')) updateBody.category = formData.get('category')
      if (formData.get('description')) updateBody.description = formData.get('description')
      if (formData.get('location')) updateBody.location = formData.get('location')
      if (formData.get('condition')) updateBody.condition = formData.get('condition')
      const quantityValue = formData.get('quantity')
      if (quantityValue != null) updateBody.quantity = parseInt(String(quantityValue), 10)
      const acquisitionDateValue = formData.get('acquisition_date')
      if (acquisitionDateValue != null) updateBody.acquisition_date = new Date(String(acquisitionDateValue))
      if (formData.get('acquisition_cost')) updateBody.acquisition_cost = parseFloat(formData.get('acquisition_cost') as string)
      if (formData.get('current_value')) updateBody.current_value = parseFloat(formData.get('current_value') as string)
      else if (formData.get('acquisition_cost')) updateBody.current_value = parseFloat(formData.get('acquisition_cost') as string)
      if (formData.get('serial_number')) updateBody.serial_number = formData.get('serial_number')
      if (formData.get('assigned_to')) updateBody.assigned_to = formData.get('assigned_to')
      if (formData.get('last_maintenance')) updateBody.last_maintenance = new Date(formData.get('last_maintenance') as string)
      if (formData.get('status')) updateBody.status = formData.get('status')
      file = formData.get('image') as File | null
    } else {
      // Handle JSON
      const body = await request.json()
      if (body.name !== undefined) updateBody.name = body.name
      if (body.category !== undefined) updateBody.category = body.category
      if (body.description !== undefined) updateBody.description = body.description
      if (body.location !== undefined) updateBody.location = body.location
      if (body.condition !== undefined) updateBody.condition = body.condition
      if (body.quantity !== undefined) updateBody.quantity = parseInt(body.quantity, 10)
      if (body.acquisition_date !== undefined) updateBody.acquisition_date = body.acquisition_date ? new Date(body.acquisition_date) : null
      if (body.acquisition_cost !== undefined) updateBody.acquisition_cost = parseFloat(body.acquisition_cost)
      if (body.current_value !== undefined) updateBody.current_value = parseFloat(body.current_value)
      else if (body.acquisition_cost !== undefined) updateBody.current_value = parseFloat(body.acquisition_cost)
      if (body.serial_number !== undefined) updateBody.serial_number = body.serial_number
      if (body.assigned_to !== undefined) updateBody.assigned_to = body.assigned_to
      if (body.last_maintenance !== undefined) updateBody.last_maintenance = body.last_maintenance ? new Date(body.last_maintenance) : null
      if (body.status !== undefined) updateBody.status = body.status
    }

    // Validate file size if image exists (max 5MB)
    if (file && file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      )
    }

    // Upload image if provided
    if (file) {
      const buffer = await file.arrayBuffer()
      const uploadResult = await uploadAssetImage(assetId, buffer, {
        contentType: file.type,
        fileName: `${Date.now()}-${file.name}`,
      })

      if (uploadResult.error) {
        console.error('Error uploading asset image:', uploadResult.error)
        const existingAsset = await supabaseServer.from('assets').select('*').eq('id', assetId).maybeSingle()
        return NextResponse.json({ success: true, asset: existingAsset.data }, { status: 200 })
      }

      updateBody.image_url = uploadResult.publicUrl

      const user = await getCurrentUser(request)
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      await recordAssetImageUpload(assetId, user.id, file, uploadResult.storagePath || `${uploadResult.publicUrl}`)
    }

    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isOfficialUser = await isOfficial(user.id)
    if (!isOfficialUser) {
      return NextResponse.json({ error: 'Only officials can update assets' }, { status: 403 })
    }

    const { data: asset, error } = await supabaseServer
      .from('assets')
      .update(updateBody)
      .eq('id', assetId)
      .select()
      .single()

    if (error) {
      console.error('Error updating asset:', error)
      return NextResponse.json({ error: error.message || 'Failed to update asset' }, { status: 500 })
    }

    return NextResponse.json({ success: true, asset })
  } catch (error) {
    console.error('Error updating asset:', error)
    return NextResponse.json({ error: 'Failed to update asset' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isOfficialUser = await isOfficial(user.id)
    if (!isOfficialUser) {
      return NextResponse.json({ error: 'Only officials can delete assets' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const assetId = searchParams.get('id')

    if (!assetId) {
      return NextResponse.json({ error: 'Asset id required' }, { status: 400 })
    }

    // Get asset to check for image
    const { data: asset, error: assetFetchError } = await supabaseServer
      .from('assets')
      .select('image_url')
      .eq('id', assetId)
      .single()

    if (assetFetchError) {
      console.warn('Could not load asset image_url for deletion:', assetFetchError)
    }

    // Delete image from storage if it exists
    if (asset?.image_url) {
      try {
        const fileName = asset.image_url.split('/').pop()
        if (fileName) {
          await deleteAssetImage(assetId, fileName)
        }
      } catch (imgError) {
        console.error('Error deleting asset image:', imgError)
        // Continue with asset deletion even if image deletion fails
      }
    }

    // Delete asset record
    const { data: deletedRows, error } = await supabaseServer
      .from('assets')
      .delete()
      .eq('id', assetId)
      .select()

    if (error) {
      console.error('Error deleting asset:', error)
      return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 })
    }

    if (!deletedRows || deletedRows.length === 0) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting asset:', error)
    return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 })
  }
}
