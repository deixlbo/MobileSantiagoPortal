// Ordinance CRUD Operations

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

export async function createOrdinance(ordinance: Omit<Ordinance, 'id'>): Promise<Ordinance> {
  try {
    const response = await fetch('/api/ordinances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ordinance),
    })
    if (!response.ok) throw new Error('Failed to create ordinance')
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    })
    if (!response.ok) throw new Error('Failed to update ordinance')
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
    })
    if (!response.ok) throw new Error('Failed to delete ordinance')
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
