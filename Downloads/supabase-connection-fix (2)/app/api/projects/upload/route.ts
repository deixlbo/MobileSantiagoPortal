import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    const fileName = typeof body?.fileName === 'string' ? body.fileName : 'project-image'
    const storagePath = typeof body?.storagePath === 'string' && body.storagePath.trim()
      ? body.storagePath
      : `projects/${Date.now()}-${fileName.replace(/\s+/g, '-')}`

    const fallbackUrl = `https://placehold.co/800x450?text=${encodeURIComponent(fileName || 'Project Image')}`

    return NextResponse.json({
      success: true,
      data: {
        url: fallbackUrl,
        storagePath,
      },
      error: null,
    })
  } catch (error) {
    console.error('Project upload route error:', error)
    return NextResponse.json(
      { error: 'Failed to prepare upload' },
      { status: 500 }
    )
  }
}
