import React from 'react'
import { mockData } from '../../lib/mock-data'

export default function MockPage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Mock Data</h1>
      <pre style={{ whiteSpace: 'pre-wrap', background: '#f7f7f7', padding: 12 }}>
        {JSON.stringify(mockData, null, 2)}
      </pre>
    </div>
  )
}
