// Announcement CRUD Operations

export type AnnouncementPriority = "urgent" | "important" | "normal"
export type AnnouncementStatus = "draft" | "published" | "archived"

export interface Announcement {
  id: string
  title: string
  content: string
  priority: AnnouncementPriority
  status: AnnouncementStatus
  category: string
  publishDate: string
  expiryDate: string
  author: string
  views: number
}

export async function createAnnouncement(announcement: Omit<Announcement, 'id' | 'views'>): Promise<Announcement> {
  try {
    const response = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(announcement),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create announcement')
    }
    return data
  } catch (error) {
    let errorMessage = 'Unknown error'
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (error && typeof error === 'object') {
      errorMessage = (error as any).message || (error as any).error_description || JSON.stringify(error)
    }
    console.error('Error creating announcement:', errorMessage)
    throw error
  }
}

export async function updateAnnouncement(id: string, updates: Partial<Announcement>): Promise<Announcement> {
  try {
    const response = await fetch('/api/announcements', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update announcement')
    }
    return data
  } catch (error) {
    let errorMessage = 'Unknown error'
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (error && typeof error === 'object') {
      errorMessage = (error as any).message || (error as any).error_description || JSON.stringify(error)
    }
    console.error('Error updating announcement:', errorMessage)
    throw error
  }
}

export async function deleteAnnouncement(id: string): Promise<void> {
  try {
    const response = await fetch('/api/announcements?id=' + id, {
      method: 'DELETE',
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete announcement')
    }
  } catch (error) {
    let errorMessage = 'Unknown error'
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (error && typeof error === 'object') {
      errorMessage = (error as any).message || (error as any).error_description || JSON.stringify(error)
    }
    console.error('Error deleting announcement:', errorMessage)
    throw error
  }
}

export async function publishAnnouncement(id: string): Promise<Announcement> {
  return updateAnnouncement(id, { status: 'published' })
}

export async function draftAnnouncement(id: string): Promise<Announcement> {
  return updateAnnouncement(id, { status: 'draft' })
}

export async function archiveAnnouncement(id: string): Promise<Announcement> {
  return updateAnnouncement(id, { status: 'archived' })
}

export async function recordAnnouncementView(id: string): Promise<void> {
  try {
    await fetch('/api/announcements/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
  } catch (error) {
    console.error('Error recording view:', error)
  }
}
