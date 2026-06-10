/**
 * Form validation schema and utilities
 */

export type ValidationResult = {
  isValid: boolean
  errors: Record<string, string>
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number format (Philippine numbers)
 */
export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+63|0)[0-9]{9,10}$/
  return phoneRegex.test(phone.replace(/\s|-/g, ''))
}

/**
 * Validate required field
 */
export function validateRequired(value: string | undefined | null, fieldName: string): string | null {
  if (!value || value.trim().length === 0) {
    return `${fieldName} is required`
  }
  return null
}

/**
 * Validate minimum length
 */
export function validateMinLength(value: string, minLength: number, fieldName: string): string | null {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`
  }
  return null
}

/**
 * Validate maximum length
 */
export function validateMaxLength(value: string, maxLength: number, fieldName: string): string | null {
  if (value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`
  }
  return null
}

/**
 * Validate number range
 */
export function validateNumberRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): string | null {
  if (value < min || value > max) {
    return `${fieldName} must be between ${min} and ${max}`
  }
  return null
}

/**
 * Validate date is in future
 */
export function validateFutureDate(date: Date, fieldName: string): string | null {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0)

  if (checkDate <= now) {
    return `${fieldName} must be a future date`
  }
  return null
}

/**
 * Validate date is in past
 */
export function validatePastDate(date: Date, fieldName: string): string | null {
  const now = new Date()
  now.setHours(23, 59, 59, 999)
  const checkDate = new Date(date)
  checkDate.setHours(23, 59, 59, 999)

  if (checkDate > now) {
    return `${fieldName} must be a past date`
  }
  return null
}

/**
 * Validate date range
 */
export function validateDateRange(
  startDate: Date,
  endDate: Date,
  fieldName: string
): string | null {
  if (startDate > endDate) {
    return `${fieldName} start date must be before end date`
  }
  return null
}

/**
 * Create a validator object for complex forms
 */
export class FormValidator {
  private errors: Record<string, string> = {}

  addError(fieldName: string, error: string): void {
    if (!this.errors[fieldName]) {
      this.errors[fieldName] = error
    }
  }

  validateRequired(value: string | undefined | null, fieldName: string): void {
    const error = validateRequired(value, fieldName)
    if (error) {
      this.addError(fieldName, error)
    }
  }

  validateEmail(value: string, fieldName: string = 'Email'): void {
    this.validateRequired(value, fieldName)
    if (!validateEmail(value)) {
      this.addError(fieldName, `${fieldName} format is invalid`)
    }
  }

  validatePhoneNumber(value: string, fieldName: string = 'Phone'): void {
    this.validateRequired(value, fieldName)
    if (!validatePhoneNumber(value)) {
      this.addError(fieldName, `${fieldName} format is invalid`)
    }
  }

  validateMinLength(value: string, minLength: number, fieldName: string): void {
    this.validateRequired(value, fieldName)
    const error = validateMinLength(value, minLength, fieldName)
    if (error) {
      this.addError(fieldName, error)
    }
  }

  validateMaxLength(value: string, maxLength: number, fieldName: string): void {
    const error = validateMaxLength(value, maxLength, fieldName)
    if (error) {
      this.addError(fieldName, error)
    }
  }

  validateMatch(value1: string, value2: string, fieldName: string): void {
    if (value1 !== value2) {
      this.addError(fieldName, `${fieldName} do not match`)
    }
  }

  isValid(): boolean {
    return Object.keys(this.errors).length === 0
  }

  getErrors(): Record<string, string> {
    return this.errors
  }

  getError(fieldName: string): string | undefined {
    return this.errors[fieldName]
  }

  clear(): void {
    this.errors = {}
  }
}

/**
 * Validate document request form
 */
export function validateDocumentRequest(data: {
  type?: string
  purpose?: string
  requesterName?: string
  requesterEmail?: string
}): ValidationResult {
  const validator = new FormValidator()

  validator.validateRequired(data.type, 'Document Type')
  validator.validateRequired(data.purpose, 'Purpose')
  validator.validateRequired(data.requesterName, 'Requester Name')
  validator.validateEmail(data.requesterEmail || '', 'Email')

  return {
    isValid: validator.isValid(),
    errors: validator.getErrors(),
  }
}

/**
 * Validate blotter report form
 */
export function validateBlotterReport(data: {
  type?: string
  description?: string
  location?: string
  respondentName?: string
}): ValidationResult {
  const validator = new FormValidator()

  validator.validateRequired(data.type, 'Incident Type')
  validator.validateMinLength(data.description || '', 10, 'Description')
  validator.validateRequired(data.location, 'Location')
  validator.validateRequired(data.respondentName, 'Respondent Name')

  return {
    isValid: validator.isValid(),
    errors: validator.getErrors(),
  }
}
