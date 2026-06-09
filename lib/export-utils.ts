import * as XLSX from "xlsx"

// Barangay header info
const BARANGAY_HEADER = {
  line1: "Republic of the Philippines",
  line2: "Province of Zambales",
  line3: "Municipality of San Antonio",
  line4: "BARANGAY SANTIAGO"
}

// Type definitions
export interface ResidentData {
  id?: string
  name: string
  purok: string
  age: number
  gender: string
  familyMembers?: number
  status: string
  occupation?: string
}

export interface HouseholdData {
  id?: string
  householdNumber: string
  headOfFamily: string
  address: string
  purok: string
  totalMembers: number
  members: {
    name: string
    relationship: string
    age: number
    gender: string
    occupation?: string
  }[]
}

export interface BlotterData {
  id: string
  type: string
  description: string
  location: string
  complainant: string
  complainantAddress?: string
  respondent: string
  respondentAddress?: string
  status: string
  filedDate: string
  investigationDate?: string | null
  mediationScheduledDate?: string | null
  hearingDate?: string | null
  actionTaken?: string | null
  resolution?: string | null
  resolutionDate?: string | null
}

/**
 * Apply borders to all cells in a worksheet
 */
function applyBordersToRange(ws: XLSX.WorkSheet, startRow: number, endRow: number, startCol: number, endCol: number) {
  const borderStyle = {
    top: { style: 'thin', color: { rgb: '000000' } },
    bottom: { style: 'thin', color: { rgb: '000000' } },
    left: { style: 'thin', color: { rgb: '000000' } },
    right: { style: 'thin', color: { rgb: '000000' } }
  }

  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: col })
      if (!ws[cellRef]) {
        ws[cellRef] = { v: '', t: 's' }
      }
      ws[cellRef].s = {
        border: borderStyle,
        alignment: { vertical: 'center', horizontal: 'center', wrapText: true }
      }
    }
  }
}

/**
 * Create header rows with barangay information (centered)
 */
function createHeaderRows(): string[][] {
  return [
    ['', BARANGAY_HEADER.line1, ''],
    ['', BARANGAY_HEADER.line2, ''],
    ['', BARANGAY_HEADER.line3, ''],
    ['', BARANGAY_HEADER.line4, ''],
    [''], // Empty row for spacing
  ]
}

/**
 * Add document header to worksheet with proper formatting
 */
function addDocumentHeader(ws: XLSX.WorkSheet, title: string, colCount: number) {
  // Header text rows
  const headerData = [
    ['Republic of the Philippines'],
    ['Province of Zambales'],
    ['Municipality of San Antonio'],
    ['BARANGAY SANTIAGO'],
    [''],
    [title],
    [''],
  ]
  
  // Add header data at top
  XLSX.utils.sheet_add_aoa(ws, headerData, { origin: 'A1' })
  
  // Merge cells for centered header (span all columns)
  if (!ws['!merges']) ws['!merges'] = []
  
  for (let i = 0; i < 4; i++) {
    ws['!merges'].push({ s: { r: i, c: 0 }, e: { r: i, c: colCount - 1 } })
  }
  // Merge title row
  ws['!merges'].push({ s: { r: 5, c: 0 }, e: { r: 5, c: colCount - 1 } })
  
  // Apply header styles
  for (let i = 0; i < 7; i++) {
    const cellRef = XLSX.utils.encode_cell({ r: i, c: 0 })
    if (ws[cellRef]) {
      ws[cellRef].s = {
        font: { bold: i === 3 || i === 5, sz: i === 3 || i === 5 ? 14 : 11 },
        alignment: { horizontal: 'center', vertical: 'center' }
      }
    }
  }
}

/**
 * Export Census data to Excel with multiple tabs
 * Tab 1: Residents - Name, Purok, Age, Gender, Family Members, Status
 * Tab 2: Housing Census - Household information with members
 * Tab 3+: Purok 1, Purok 2, etc. - Residents grouped by purok
 */
export function exportCensusToExcel(
  residents: ResidentData[],
  households: HouseholdData[],
  filename: string = 'Census_Report.xlsx'
) {
  const wb = XLSX.utils.book_new()
  
  // ========== TAB 1: RESIDENTS ==========
  const residentsHeaders = ['Name', 'Purok', 'Age', 'Gender', 'Family Members', 'Status']
  const residentsData = residents.map(r => [
    r.name,
    r.purok,
    r.age,
    r.gender,
    r.familyMembers || 0,
    r.status
  ])
  
  // Create worksheet with header first
  const wsResidents = XLSX.utils.aoa_to_sheet([])
  addDocumentHeader(wsResidents, 'RESIDENTS LIST', residentsHeaders.length)
  
  // Add table headers and data starting from row 8
  XLSX.utils.sheet_add_aoa(wsResidents, [residentsHeaders], { origin: 'A8' })
  XLSX.utils.sheet_add_aoa(wsResidents, residentsData, { origin: 'A9' })
  
  // Apply borders to data area
  const residentsEndRow = 8 + residentsData.length
  applyBordersToRange(wsResidents, 7, residentsEndRow, 0, residentsHeaders.length - 1)
  
  // Set column widths
  wsResidents['!cols'] = [
    { wch: 25 }, // Name
    { wch: 12 }, // Purok
    { wch: 8 },  // Age
    { wch: 10 }, // Gender
    { wch: 15 }, // Family Members
    { wch: 12 }, // Status
  ]
  
  XLSX.utils.book_append_sheet(wb, wsResidents, 'Residents')
  
  // ========== TAB 2: HOUSING CENSUS ==========
  const wsHousing = XLSX.utils.aoa_to_sheet([])
  addDocumentHeader(wsHousing, 'HOUSEHOLD CENSUS', 5)
  
  // Add description
  XLSX.utils.sheet_add_aoa(wsHousing, [['Complete household information and members']], { origin: 'A8' })
  if (!wsHousing['!merges']) wsHousing['!merges'] = []
  wsHousing['!merges'].push({ s: { r: 7, c: 0 }, e: { r: 7, c: 4 } })
  
  let currentRow = 10
  
  households.forEach((household, index) => {
    // Household header section
    const householdInfo = [
      ['Household Number', household.householdNumber],
      ['Head of Family', household.headOfFamily],
      ['Address', `${household.address}, ${household.purok}`],
      ['Household Members', `${household.totalMembers} total`],
      [''], // Spacing
      ['Name', 'Relationship', 'Age', 'Gender', 'Occupation'], // Member headers
    ]
    
    XLSX.utils.sheet_add_aoa(wsHousing, householdInfo, { origin: `A${currentRow}` })
    
    // Apply borders to household info
    applyBordersToRange(wsHousing, currentRow - 1, currentRow + 3, 0, 1)
    
    currentRow += householdInfo.length
    
    // Add household members
    const memberData = household.members.map(m => [
      m.name,
      m.relationship,
      m.age,
      m.gender,
      m.occupation || ''
    ])
    
    XLSX.utils.sheet_add_aoa(wsHousing, memberData, { origin: `A${currentRow}` })
    
    // Apply borders to member table
    applyBordersToRange(wsHousing, currentRow - 2, currentRow - 1 + memberData.length, 0, 4)
    
    currentRow += memberData.length + 3 // Add spacing between households
  })
  
  // Set column widths for housing
  wsHousing['!cols'] = [
    { wch: 25 }, // Name/Label
    { wch: 20 }, // Value/Relationship
    { wch: 8 },  // Age
    { wch: 10 }, // Gender
    { wch: 20 }, // Occupation
  ]
  
  XLSX.utils.book_append_sheet(wb, wsHousing, 'Housing Census')
  
  // ========== TAB 3+: PUROK TABS ==========
  // Get unique puroks and sort them
  const puroks = [...new Set(residents.map(r => r.purok))].sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, '')) || 0
    const numB = parseInt(b.replace(/\D/g, '')) || 0
    return numA - numB
  })
  
  puroks.forEach(purok => {
    const purokResidents = residents.filter(r => r.purok === purok)
    const purokHeaders = ['Name', 'Age', 'Gender', 'Family Members', 'Status', 'Occupation']
    const purokData = purokResidents.map(r => [
      r.name,
      r.age,
      r.gender,
      r.familyMembers || 0,
      r.status,
      r.occupation || ''
    ])
    
    const wsPurok = XLSX.utils.aoa_to_sheet([])
    addDocumentHeader(wsPurok, `${purok.toUpperCase()} RESIDENTS`, purokHeaders.length)
    
    // Add summary
    XLSX.utils.sheet_add_aoa(wsPurok, [[`Total Residents: ${purokResidents.length}`]], { origin: 'A8' })
    
    // Add table headers and data
    XLSX.utils.sheet_add_aoa(wsPurok, [purokHeaders], { origin: 'A10' })
    XLSX.utils.sheet_add_aoa(wsPurok, purokData, { origin: 'A11' })
    
    // Apply borders
    applyBordersToRange(wsPurok, 9, 10 + purokData.length, 0, purokHeaders.length - 1)
    
    // Set column widths
    wsPurok['!cols'] = [
      { wch: 25 }, // Name
      { wch: 8 },  // Age
      { wch: 10 }, // Gender
      { wch: 15 }, // Family Members
      { wch: 12 }, // Status
      { wch: 20 }, // Occupation
    ]
    
    // Sheet name max 31 chars
    const sheetName = purok.length > 31 ? purok.substring(0, 31) : purok
    XLSX.utils.book_append_sheet(wb, wsPurok, sheetName)
  })
  
  // Write file
  XLSX.writeFile(wb, filename)
}

/**
 * Export Blotter records to Excel with proper formatting
 */
export function exportBlotterToExcel(
  blotters: BlotterData[],
  filename: string = 'Blotter_Report.xlsx'
) {
  const wb = XLSX.utils.book_new()
  
  // Summary sheet
  const wsSummary = XLSX.utils.aoa_to_sheet([])
  const summaryHeaders = ['Reference No.', 'Type', 'Complainant', 'Respondent', 'Location', 'Status', 'Filed Date']
  
  addDocumentHeader(wsSummary, 'BLOTTER RECORDS SUMMARY', summaryHeaders.length)
  
  const summaryData = blotters.map(b => [
    b.id,
    b.type,
    b.complainant,
    b.respondent,
    b.location,
    formatStatus(b.status),
    b.filedDate
  ])
  
  XLSX.utils.sheet_add_aoa(wsSummary, [summaryHeaders], { origin: 'A8' })
  XLSX.utils.sheet_add_aoa(wsSummary, summaryData, { origin: 'A9' })
  
  // Apply borders
  applyBordersToRange(wsSummary, 7, 8 + summaryData.length, 0, summaryHeaders.length - 1)
  
  wsSummary['!cols'] = [
    { wch: 15 }, // Reference
    { wch: 20 }, // Type
    { wch: 20 }, // Complainant
    { wch: 20 }, // Respondent
    { wch: 25 }, // Location
    { wch: 18 }, // Status
    { wch: 15 }, // Filed Date
  ]
  
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary')
  
  // Individual blotter detail sheets
  blotters.forEach((blotter, index) => {
    const wsDetail = XLSX.utils.aoa_to_sheet([])
    addDocumentHeader(wsDetail, 'BLOTTER REPORT', 2)
    
    const detailData = [
      ['Reference Number:', blotter.id],
      ['Type of Complaint:', blotter.type],
      [''],
      ['COMPLAINANT INFORMATION'],
      ['Name:', blotter.complainant],
      ['Address:', blotter.complainantAddress || 'N/A'],
      [''],
      ['RESPONDENT INFORMATION'],
      ['Name:', blotter.respondent],
      ['Address:', blotter.respondentAddress || 'N/A'],
      [''],
      ['INCIDENT DETAILS'],
      ['Location:', blotter.location],
      ['Date Filed:', blotter.filedDate],
      ['Description:', blotter.description],
      [''],
      ['CASE STATUS'],
      ['Current Status:', formatStatus(blotter.status)],
      ['Investigation Date:', blotter.investigationDate || 'N/A'],
      ['Mediation Scheduled:', blotter.mediationScheduledDate || 'N/A'],
      ['Hearing Date:', blotter.hearingDate || 'N/A'],
      [''],
      ['RESOLUTION'],
      ['Action Taken:', blotter.actionTaken || 'N/A'],
      ['Resolution:', blotter.resolution || 'N/A'],
      ['Resolution Date:', blotter.resolutionDate || 'N/A'],
    ]
    
    XLSX.utils.sheet_add_aoa(wsDetail, detailData, { origin: 'A8' })
    
    // Apply borders to key sections
    applyBordersToRange(wsDetail, 7, 8, 0, 1) // Reference
    applyBordersToRange(wsDetail, 11, 13, 0, 1) // Complainant
    applyBordersToRange(wsDetail, 15, 17, 0, 1) // Respondent
    applyBordersToRange(wsDetail, 19, 22, 0, 1) // Incident
    applyBordersToRange(wsDetail, 24, 28, 0, 1) // Status
    applyBordersToRange(wsDetail, 30, 33, 0, 1) // Resolution
    
    wsDetail['!cols'] = [
      { wch: 20 },
      { wch: 50 },
    ]
    
    // Sheet name: max 31 chars
    const sheetName = blotter.id.length > 31 ? blotter.id.substring(0, 31) : blotter.id
    XLSX.utils.book_append_sheet(wb, wsDetail, sheetName)
  })
  
  XLSX.writeFile(wb, filename)
}

/**
 * Export single blotter to Excel
 */
export function exportSingleBlotterToExcel(
  blotter: BlotterData,
  filename?: string
) {
  exportBlotterToExcel([blotter], filename || `Blotter_${blotter.id}.xlsx`)
}

/**
 * Format status for display
 */
function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'pending-review': 'Pending Review',
    'under-investigation': 'Under Investigation',
    'scheduled-mediation': 'Scheduled for Mediation',
    'ongoing-hearing': 'Ongoing Hearing',
    'resolved': 'Resolved',
    'dismissed': 'Dismissed',
    'escalated': 'Escalated',
    'pending': 'Pending',
    'verified': 'Verified',
    'declined': 'Declined'
  }
  return statusMap[status] || status
}

/**
 * Export data to CSV format (legacy support)
 */
export function exportToCSV(data: Record<string, any>[], filename: string) {
  const csv = convertToCSV(data)
  downloadFile(csv, filename, 'text/csv')
}

/**
 * Export data to XLSX format (simple single sheet)
 */
export function exportToXLSX(data: Record<string, any>[], filename: string, sheetName: string = 'Sheet1') {
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet([])
  
  // Add document header
  if (data.length > 0) {
    const headers = Object.keys(data[0])
    addDocumentHeader(ws, sheetName.toUpperCase(), headers.length)
    
    // Add data headers
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A8' })
    
    // Add data rows
    const dataRows = data.map(row => headers.map(h => row[h]))
    XLSX.utils.sheet_add_aoa(ws, dataRows, { origin: 'A9' })
    
    // Apply borders
    applyBordersToRange(ws, 7, 8 + dataRows.length, 0, headers.length - 1)
    
    // Auto-fit columns
    ws['!cols'] = calculateColumnWidths(data)
  }
  
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
    const ws = XLSX.utils.aoa_to_sheet([])
    
    if (sheet.data.length > 0) {
      const headers = Object.keys(sheet.data[0])
      addDocumentHeader(ws, sheet.name.toUpperCase(), headers.length)
      
      XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A8' })
      
      const dataRows = sheet.data.map(row => headers.map(h => row[h]))
      XLSX.utils.sheet_add_aoa(ws, dataRows, { origin: 'A9' })
      
      applyBordersToRange(ws, 7, 8 + dataRows.length, 0, headers.length - 1)
      ws['!cols'] = calculateColumnWidths(sheet.data)
    }
    
    const sheetName = sheet.name.length > 31 ? sheet.name.substring(0, 31) : sheet.name
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
  })
  
  XLSX.writeFile(wb, filename)
}

/**
 * Convert array of objects to CSV string
 */
function convertToCSV(data: Record<string, any>[]): string {
  if (!data || data.length === 0) return ''
  
  const headers = Object.keys(data[0])
  
  const csvContent = [
    headers.map(h => `"${h}"`).join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header]
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
      
      if (value instanceof Date) {
        value = value.toLocaleDateString()
      }
      
      if (typeof value === 'boolean') {
        value = value ? 'Yes' : 'No'
      }
      
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
