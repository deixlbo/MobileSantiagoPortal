// Ordinance CRUD Operations

import { supabase } from './supabase'

interface Ordinance {
  id: string
  number: string
  year: string
  title: string
  fullTitle: string
  status: "Draft" | "Published" | "Repealed"
  date: string
  author: string
  whereas: string[]
  sections: Array<{ title: string; content: string }>
}

async function parseApiError(response: Response, fallbackMessage: string): Promise<never> {
  let errorMessage = fallbackMessage

  try {
    const errorBody = await response.json()
    errorMessage = errorBody?.error || errorBody?.message || errorMessage
    if (errorBody?.code) {
      errorMessage += ` (code: ${errorBody.code})`
    }
  } catch {
    // ignore parse failures and keep generic message
  }

  throw new Error(errorMessage)
}

async function getAuthHeaders() {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }

  if (typeof window !== 'undefined') {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`
      }
    } catch {
      // ignore and fall back to stored token
    }

    if (!headers.Authorization) {
      const token = window.localStorage.getItem('auth_token') || window.sessionStorage.getItem('auth_token')
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
    }
  }

  return headers
}

export async function createOrdinance(ordinance: Omit<Ordinance, 'id'>): Promise<Ordinance> {
  try {
    const response = await fetch('/api/ordinances', {
      method: 'POST',
      headers: await getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(ordinance),
    })
    if (!response.ok) {
      await parseApiError(response, 'Failed to create ordinance')
    }
    return response.json()
  } catch (error) {
    console.error('Error creating ordinance:', error)
    throw error
  }
}

export async function updateOrdinance(id: string, updates: Partial<Ordinance>): Promise<Ordinance> {
  try {
    const response = await fetch('/api/ordinances', {
      method: 'PUT',
      headers: await getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ id, ...updates }),
    })
    if (!response.ok) {
      await parseApiError(response, 'Failed to update ordinance')
    }
    return response.json()
  } catch (error) {
    console.error('Error updating ordinance:', error)
    throw error
  }
}

export async function deleteOrdinance(id: string): Promise<void> {
  try {
    const response = await fetch('/api/ordinances?id=' + id, {
      method: 'DELETE',
      headers: await getAuthHeaders(),
      credentials: 'include',
    })
    if (!response.ok) {
      await parseApiError(response, 'Failed to delete ordinance')
    }
  } catch (error) {
    console.error('Error deleting ordinance:', error)
    throw error
  }
}

export async function publishOrdinance(id: string): Promise<Ordinance> {
  return updateOrdinance(id, { status: 'Published' })
}

export async function draftOrdinance(id: string): Promise<Ordinance> {
  return updateOrdinance(id, { status: 'Draft' })
}

export async function repealOrdinance(id: string): Promise<Ordinance> {
  return updateOrdinance(id, { status: 'Repealed' })
}
