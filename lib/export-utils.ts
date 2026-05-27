import * as XLSX from "xlsx"

/**
 * Export data to CSV format
 */
export function exportToCSV(data: Record<string, any>[], filename: string) {
  const csv = convertToCSV(data)
  downloadFile(csv, filename, 'text/csv')
}

/**
 * Export data to XLSX format
 */
export function exportToXLSX(data: Record<string, any>[], filename: string, sheetName: string = 'Sheet1') {
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(data)
  
  // Auto-fit columns
  const colWidths = calculateColumnWidths(data)
  ws['!cols'] = colWidths
  
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  XLSX.writeFile(wb, filename)
}

/**
 * Export multiple sheets to XLSX
 */
export function exportToXLSXMultiSheet(
  sheets: { name: string; data: Record<string, any>[] }[],
  filename: string
) {
  const wb = XLSX.utils.book_new()
  
  sheets.forEach(sheet => {
    const ws = XLSX.utils.json_to_sheet(sheet.data)
    const colWidths = calculateColumnWidths(sheet.data)
    ws['!cols'] = colWidths
    XLSX.utils.book_append_sheet(wb, ws, sheet.name)
  })
  
  XLSX.writeFile(wb, filename)
}

/**
 * Convert array of objects to CSV string
 */
function convertToCSV(data: Record<string, any>[]): string {
  if (!data || data.length === 0) return ''
  
  // Get headers from first object
  const headers = Object.keys(data[0])
  
  // Create CSV content
  const csvContent = [
    headers.map(h => `"${h}"`).join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header]
        // Escape quotes and wrap in quotes if contains comma or quote
        const stringValue = String(value || '')
        return `"${stringValue.replace(/"/g, '""')}"`
      }).join(',')
    )
  ].join('\n')
  
  return csvContent
}

/**
 * Download file from data URI
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const element = document.createElement('a')
  element.setAttribute('href', `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`)
  element.setAttribute('download', filename)
  element.style.display = 'none'
  
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

/**
 * Calculate optimal column widths based on data
 */
function calculateColumnWidths(data: Record<string, any>[]): Array<{ wch: number }> {
  if (!data || data.length === 0) return []
  
  const headers = Object.keys(data[0])
  
  return headers.map(header => {
    let maxWidth = header.length
    
    data.forEach(row => {
      const value = String(row[header] || '')
      if (value.length > maxWidth) {
        maxWidth = value.length
      }
    })
    
    // Add some padding and limit max width
    return { wch: Math.min(maxWidth + 2, 50) }
  })
}

/**
 * Transform data for export (flatten nested objects, format dates, etc.)
 */
export function prepareDataForExport(
  data: Record<string, any>[],
  columnMap?: Record<string, string>
): Record<string, any>[] {
  return data.map(item => {
    const flatItem: Record<string, any> = {}
    
    Object.keys(item).forEach(key => {
      const displayKey = columnMap?.[key] || key
      let value = item[key]
      
      // Format dates
      if (value instanceof Date) {
        value = value.toLocaleDateString()
      }
      
      // Format booleans
      if (typeof value === 'boolean') {
        value = value ? 'Yes' : 'No'
      }
      
      // Flatten nested objects (simple case)
      if (value && typeof value === 'object' && !(value instanceof Date)) {
        value = JSON.stringify(value)
      }
      
      flatItem[displayKey] = value
    })
    
    return flatItem
  })
}

/**
 * Generate report with title and metadata
 */
export function generateReport(
  title: string,
  data: Record<string, any>[],
  metadata?: { generatedAt?: Date; generatedBy?: string; period?: string }
): { title: string; data: Record<string, any>[]; metadata?: typeof metadata } {
  return {
    title,
    data,
    metadata: metadata || {
      generatedAt: new Date(),
    },
  }
}
