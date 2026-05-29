/**
 * Blotter Management Utilities
 * CRUD operations for complaint/blotter reports
 */

export interface BlotterData {
  id: string
  type: string
  description: string
  location: string
  complainant: string
  respondent: string
  status: 'pending-review' | 'under-investigation' | 'scheduled-mediation' | 'ongoing-hearing' | 'resolved' | 'dismissed' | 'escalated'
  filedDate: string
  investigationDate?: string
  mediationScheduledDate?: string
  hearingDate?: string
  actionTaken?: string
  resolution?: string
  resolutionDate?: string
}

/**
 * Create a new blotter report
 */
export async function createBlotter(data: Omit<BlotterData, 'id' | 'status' | 'filedDate'>) {
  try {
    const response = await fetch('/api/blotters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: data.type,
        description: data.description,
        location: data.location,
        complainant: data.complainant,
        respondent: data.respondent,
        filedDate: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
      }),
    })

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.error || 'Failed to create blotter')
    }

    return result
  } catch (error) {
    console.error('Error creating blotter:', error)
    throw error
  }
}

/**
 * Update blotter status and details
 */
export async function updateBlotter(
  id: string,
  updates: Partial<Omit<BlotterData, 'id'>>
) {
  try {
    const response = await fetch('/api/blotters', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    })

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.error || 'Failed to update blotter')
    }

    return result
  } catch (error) {
    console.error('Error updating blotter:', error)
    throw error
  }
}

/**
 * Update blotter to under investigation status
 */
export async function markUnderInvestigation(id: string) {
  return updateBlotter(id, {
    status: 'under-investigation',
    investigationDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  })
}

/**
 * Schedule mediation for blotter
 */
export async function scheduleMediation(id: string, mediationDate: string) {
  return updateBlotter(id, {
    status: 'scheduled-mediation',
    mediationScheduledDate: mediationDate,
  })
}

/**
 * Mark blotter as ongoing hearing
 */
export async function markOngoingHearing(id: string, hearingDate: string) {
  return updateBlotter(id, {
    status: 'ongoing-hearing',
    hearingDate,
  })
}

/**
 * Resolve blotter complaint
 */
export async function resolveBlotter(
  id: string,
  resolution: string,
  actionTaken: string
) {
  return updateBlotter(id, {
    status: 'resolved',
    resolution,
    actionTaken,
    resolutionDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  })
}

/**
 * Dismiss blotter complaint
 */
export async function dismissBlotter(id: string, reason: string) {
  return updateBlotter(id, {
    status: 'dismissed',
    resolution: `Dismissed: ${reason}`,
    resolutionDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  })
}

/**
 * Escalate blotter to higher authority
 */
export async function escalateBlotter(id: string, reason: string) {
  return updateBlotter(id, {
    status: 'escalated',
    actionTaken: `Escalated to higher authority: ${reason}`,
  })
}

/**
 * Delete a blotter report
 */
export async function deleteBlotter(id: string) {
  try {
    const response = await fetch(`/api/blotters?id=${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.error || 'Failed to delete blotter')
    }

    return result
  } catch (error) {
    console.error('Error deleting blotter:', error)
    throw error
  }
}

/**
 * Get blotter status label and color
 */
export function getStatusInfo(status: string) {
  const statusMap: Record<string, { label: string; color: string; bgColor: string }> = {
    'pending-review': {
      label: 'Pending Review',
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
    },
    'under-investigation': {
      label: 'Under Investigation',
      color: 'text-amber-700',
      bgColor: 'bg-amber-100',
    },
    'scheduled-mediation': {
      label: 'Scheduled for Mediation',
      color: 'text-purple-700',
      bgColor: 'bg-purple-100',
    },
    'ongoing-hearing': {
      label: 'Ongoing Hearing',
      color: 'text-red-700',
      bgColor: 'bg-red-100',
    },
    'resolved': {
      label: 'Resolved',
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-100',
    },
    'dismissed': {
      label: 'Dismissed',
      color: 'text-gray-700',
      bgColor: 'bg-gray-100',
    },
    'escalated': {
      label: 'Escalated',
      color: 'text-orange-700',
      bgColor: 'bg-orange-100',
    },
  }

  return statusMap[status] || { label: status, color: 'text-gray-700', bgColor: 'bg-gray-100' }
}
