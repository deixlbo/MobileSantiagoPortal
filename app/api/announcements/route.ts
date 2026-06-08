import { NextRequest, NextResponse } from 'next/server'
import { Announcement } from '@/lib/database'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      content,
      priority,
      status,
      category,
      targetAudience,
      publishDate,
      expiryDate,
      createdBy,
      author,
    } = body

    if (!title || !content || !createdBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data: announcement, error } = await supabaseServer
      .from('announcements')
      .insert([
        {
          title,
          content,
          priority: priority || 'normal',
          status: status || 'draft',
          category: category || null,
          target_audience: targetAudience || 'all',
          publish_date: publishDate ? new Date(publishDate) : null,
          expiry_date: expiryDate ? new Date(expiryDate) : null,
          author: author || createdBy,
          created_by: createdBy,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      announcement,
    })
  } catch (error) {
    console.error('Error creating announcement:', error)
    return NextResponse.json(
      { error: 'Failed to create announcement' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const announcementId = searchParams.get('id')
    const targetAudience = searchParams.get('targetAudience')

    if (announcementId) {
      const { data: announcement, error } = await supabaseServer
        .from('announcements')
        .select('*')
        .eq('id', announcementId)
        .single()

      if (error) {
        return NextResponse.json(
          { error: error.message || 'Announcement not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(announcement)
    }

    let query = supabaseServer
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (targetAudience) {
      query = query.in('target_audience', ['all', targetAudience])
    }

    const { data: announcements, error } = await query
    if (error) throw error

    return NextResponse.json(announcements)
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      id,
      title,
      content,
      priority,
      status,
      category,
      targetAudience,
      publishDate,
      expiryDate,
      isActive,
      createdBy,
      author,
    } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Announcement id required' },
        { status: 400 }
      )
    }

    const updateBody: any = {}
    if (title !== undefined) updateBody.title = title
    if (content !== undefined) updateBody.content = content
    if (priority !== undefined) updateBody.priority = priority
    if (status !== undefined) updateBody.status = status
    if (category !== undefined) updateBody.category = category
    if (targetAudience !== undefined)
      updateBody.target_audience = targetAudience
    if (publishDate !== undefined)
      updateBody.publish_date = publishDate ? new Date(publishDate) : null
    if (expiryDate !== undefined)
      updateBody.expiry_date = expiryDate ? new Date(expiryDate) : null
    if (isActive !== undefined) updateBody.is_active = isActive
    if (createdBy !== undefined) updateBody.created_by = createdBy
    if (author !== undefined) updateBody.author = author

    const { data: announcement, error } = await supabaseServer
      .from('announcements')
      .update(updateBody)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Announcement not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      announcement,
    })
  } catch (error) {
    console.error('Error updating announcement:', error)
    return NextResponse.json(
      { error: 'Failed to update announcement' },
      { status: 500 }
    )
  }
}
