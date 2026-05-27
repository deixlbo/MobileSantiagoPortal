/**
 * OCR and document processing utilities
 * Provides functions for document classification, field extraction, and validation
 */

export type DocumentType = 
  | 'barangay_clearance'
  | 'certificate_of_residency'
  | 'certificate_of_indigency'
  | 'barangay_business_clearance'
  | 'certificate_of_solo_parent'
  | 'medical_assistance_certificate'
  | 'blotter_report'
  | 'unknown'

export interface DocumentField {
  label: string
  value: string
  confidence: number
  fieldType: 'text' | 'date' | 'number' | 'phone' | 'email' | 'address'
}

export interface ExtractedDocument {
  documentType: DocumentType
  fields: Record<string, DocumentField>
  confidence: number
  rawText: string
  metadata: {
    processedAt: Date
    fileSize: number
    fileName: string
  }
}

/**
 * Classify document type based on content and filename
 */
export function classifyDocument(
  filename: string,
  text: string
): DocumentType {
  const lowerFilename = filename.toLowerCase()
  const lowerText = text.toLowerCase()

  // Check filename first
  if (lowerFilename.includes('clearance')) return 'barangay_clearance'
  if (lowerFilename.includes('residency')) return 'certificate_of_residency'
  if (lowerFilename.includes('indigency')) return 'certificate_of_indigency'
  if (lowerFilename.includes('business')) return 'barangay_business_clearance'
  if (lowerFilename.includes('solo parent')) return 'certificate_of_solo_parent'
  if (lowerFilename.includes('medical')) return 'medical_assistance_certificate'
  if (lowerFilename.includes('blotter')) return 'blotter_report'

  // Check document text content
  if (lowerText.includes('barangay clearance')) return 'barangay_clearance'
  if (lowerText.includes('certificate of residency')) return 'certificate_of_residency'
  if (lowerText.includes('indigency')) return 'certificate_of_indigency'
  if (lowerText.includes('business clearance')) return 'barangay_business_clearance'
  if (lowerText.includes('solo parent')) return 'certificate_of_solo_parent'
  if (lowerText.includes('medical assistance')) return 'medical_assistance_certificate'

  return 'unknown'
}

/**
 * Extract standard fields from document text
 */
export function extractFields(text: string): Record<string, DocumentField> {
  const fields: Record<string, DocumentField> = {}

  // Helper function to find field with patterns
  const findField = (
    patterns: string[],
    fieldType: DocumentField['fieldType'] = 'text'
  ): DocumentField | null => {
    for (const pattern of patterns) {
      const regex = new RegExp(pattern, 'i')
      const match = text.match(regex)
      if (match) {
        return {
          label: pattern.substring(0, 20),
          value: match[1]?.trim() || match[0]?.trim() || '',
          confidence: 0.8,
          fieldType,
        }
      }
    }
    return null
  }

  // Extract common fields
  const firstNameMatch = findField([
    'first\\s+name[:\\s]+([^,\\n]+)',
    'given\\s+name[:\\s]+([^,\\n]+)',
  ])
  if (firstNameMatch) fields.firstName = firstNameMatch

  const lastNameMatch = findField([
    'last\\s+name[:\\s]+([^,\\n]+)',
    'family\\s+name[:\\s]+([^,\\n]+)',
  ])
  if (lastNameMatch) fields.lastName = lastNameMatch

  const dobMatch = findField([
    'date\\s+of\\s+birth[:\\s]+([^,\\n]+)',
    'dob[:\\s]+([^,\\n]+)',
    'birth\\s+date[:\\s]+([^,\\n]+)',
  ], 'date')
  if (dobMatch) fields.dateOfBirth = dobMatch

  const addressMatch = findField([
    'address[:\\s]+([^,\\n]+)',
    'residenc[es]?[:\\s]+([^,\\n]+)',
  ], 'address')
  if (addressMatch) fields.address = addressMatch

  const phoneMatch = findField([
    'phone[:\\s]+([^,\\n]+)',
    'contact[:\\s]+([^,\\n]+)',
    '(09\\d{2}-?\\d{3}-?\\d{4})',
  ], 'phone')
  if (phoneMatch) fields.phone = phoneMatch

  const emailMatch = findField([
    'email[:\\s]+([^,\\n]+)',
    '([\\w.-]+@[\\w.-]+\\.\\w+)',
  ], 'email')
  if (emailMatch) fields.email = emailMatch

  const controlNumberMatch = findField([
    'control\\s+number[:\\s]+([^,\\n]+)',
    'control[:#\\s]+([^,\\n]+)',
  ], 'text')
  if (controlNumberMatch) fields.controlNumber = controlNumberMatch

  const issuedDateMatch = findField([
    'issued[\\s:]*(on|at)?[:\\s]+([^,\\n]+)',
    'date\\s+issued[:\\s]+([^,\\n]+)',
  ], 'date')
  if (issuedDateMatch) fields.issuedDate = issuedDateMatch

  return fields
}

/**
 * Validate extracted data for completeness
 */
export function validateExtraction(
  documentType: DocumentType,
  fields: Record<string, DocumentField>
): {
  isValid: boolean
  missingFields: string[]
  confidence: number
} {
  const requiredFieldsByType: Record<DocumentType, string[]> = {
    barangay_clearance: ['firstName', 'lastName', 'address'],
    certificate_of_residency: ['firstName', 'lastName', 'address', 'purok'],
    certificate_of_indigency: ['firstName', 'lastName', 'address'],
    barangay_business_clearance: ['firstName', 'lastName', 'address'],
    certificate_of_solo_parent: ['firstName', 'lastName', 'address', 'dateOfBirth'],
    medical_assistance_certificate: ['firstName', 'lastName'],
    blotter_report: ['firstName', 'lastName', 'address'],
    unknown: [],
  }

  const required = requiredFieldsByType[documentType] || []
  const missing = required.filter(field => !fields[field])

  const filledFields = Object.keys(fields).length
  const totalFields = Object.keys(required).length || 1
  const confidence = Math.min(1, filledFields / Math.max(totalFields, 1))

  return {
    isValid: missing.length === 0,
    missingFields: missing,
    confidence,
  }
}

/**
 * Format extracted data for form prefilling
 */
export function formatForForm(
  fields: Record<string, DocumentField>
): Record<string, string> {
  const formatted: Record<string, string> = {}

  for (const [key, field] of Object.entries(fields)) {
    formatted[key] = field.value
  }

  return formatted
}

/**
 * Calculate overall confidence of extraction
 */
export function calculateConfidence(
  fields: Record<string, DocumentField>
): number {
  if (Object.keys(fields).length === 0) return 0

  const avgConfidence = Object.values(fields).reduce(
    (sum, field) => sum + field.confidence,
    0
  ) / Object.keys(fields).length

  return Math.round(avgConfidence * 100) / 100
}
