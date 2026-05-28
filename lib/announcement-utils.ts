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
    if (!response.ok) throw new Error('Failed to create announcement')
    return response.json()
  } catch (error) {
    console.error('Error creating announcement:', error)
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
    if (!response.ok) throw new Error('Failed to update announcement')
    return response.json()
  } catch (error) {
    console.error('Error updating announcement:', error)
    throw error
  }
}

export async function deleteAnnouncement(id: string): Promise<void> {
  try {
    const response = await fetch('/api/announcements?id=' + id, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete announcement')
  } catch (error) {
    console.error('Error deleting announcement:', error)
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
