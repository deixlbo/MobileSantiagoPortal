import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { uploadAssetImage, deleteAssetImage } from '@/lib/storage'

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

      return NextResponse.json(asset)
    }

    const { data: assets, error } = await supabaseServer
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching assets:', error)
      return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 })
    }

    return NextResponse.json(assets || [])
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
      serial_number,
      assigned_to,
      last_maintenance,
      status,
    } = assetData

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

    const parsedQuantity = quantity != null && String(quantity).trim() !== '' ? parseInt(String(quantity), 10) : 1
    const parsedAcquisitionCost = acquisition_cost != null && String(acquisition_cost).trim() !== ''
      ? parseFloat(String(acquisition_cost))
      : null
    const parsedSerialNumber = serial_number != null && String(serial_number).trim() !== ''
      ? String(serial_number).trim()
      : null
    const parsedAssignedTo = assigned_to != null && String(assigned_to).trim() !== ''
      ? String(assigned_to).trim()
      : null
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
      current_value: parsedAcquisitionCost,
      status: status || 'Active',
    }

    if (parsedSerialNumber) insertPayload.serial_number = parsedSerialNumber
    if (parsedAssignedTo) insertPayload.assigned_to = parsedAssignedTo
    if (parsedLastMaintenance) insertPayload.last_maintenance = parsedLastMaintenance

    let asset: any = null
    let error: any = null

    ({ data: asset, error } = await supabaseServer
      .from('assets')
      .insert([insertPayload])
      .select()
      .single())

    if (error && (insertPayload.serial_number || insertPayload.assigned_to || insertPayload.last_maintenance)) {
      console.warn('Retrying asset create without optional columns due to error:', error)
      const fallbackPayload = { ...insertPayload }
      delete fallbackPayload.serial_number
      delete fallbackPayload.assigned_to
      delete fallbackPayload.last_maintenance

      ({ data: asset, error } = await supabaseServer
        .from('assets')
        .insert([fallbackPayload])
        .select()
        .single())
    }

    if (error) {
      console.error('FULL ASSET ERROR:', JSON.stringify(error, null, 2))

      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
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
      })

      if (uploadResult.error) {
        console.error('Error uploading asset image:', uploadResult.error)
        // Continue without image rather than failing entirely
      } else {
        imageUrl = uploadResult.publicUrl
        if (imageUrl) {
          const { error: updateError } = await supabaseServer
            .from('assets')
            .update({ image_url: imageUrl })
            .eq('id', asset.id)

          if (updateError) {
            console.error('Error updating asset image URL:', updateError)
          }
        }
      }
    }

    const finalAsset = { ...asset, image_url: imageUrl || asset.image_url }
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
      if (formData.get('quantity')) updateBody.quantity = parseInt(formData.get('quantity'), 10)
      if (formData.get('acquisition_date')) updateBody.acquisition_date = new Date(formData.get('acquisition_date') as string)
      if (formData.get('acquisition_cost')) updateBody.acquisition_cost = parseFloat(formData.get('acquisition_cost') as string)
      if (formData.get('acquisition_cost')) updateBody.current_value = parseFloat(formData.get('acquisition_cost') as string)
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
      if (body.acquisition_cost !== undefined) updateBody.current_value = parseFloat(body.acquisition_cost)
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
      })

      if (uploadResult.error) {
        console.error('Error uploading asset image:', uploadResult.error)
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
      }

      updateBody.image_url = uploadResult.publicUrl
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
