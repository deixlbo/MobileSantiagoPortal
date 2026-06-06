'use client'

import React from 'react'
import { getMockComplaints, getMockDocuments, getMockAppointments } from '../../lib/mock-data'

export default function MockPage() {
  const complaints = getMockComplaints()
  const documents = getMockDocuments()
  const appointments = getMockAppointments()

  const mockData = { complaints, documents, appointments }

  return (
    <div style={{ padding: 16 }}>
      <h1>Mock Data</h1>
      <pre style={{ whiteSpace: 'pre-wrap', background: '#f7f7f7', padding: 12 }}>
        {JSON.stringify(mockData, null, 2)}
      </pre>
    </div>
  )
}
