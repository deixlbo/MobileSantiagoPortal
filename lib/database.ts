// Database types and schemas for the Barangay Management System
export type UserRole = 'admin' | 'staff' | 'captain' | 'resident'
export type DocumentType = 'barangay_clearance' | 'certificate_of_residency' | 'certificate_of_indigency' | 'certificate_of_solo_parent' | 'barangay_business_clearance' | 'certificate_of_business_closure' | 'certificate_to_file_action' | 'medical_assistance_certificate' | 'blotter_report' | 'settlement_agreement'
export type RequestStatus = 'pending' | 'approved' | 'rejected'
export type BlotterStatus = 'pending' | 'ongoing' | 'resolved'

// User schemas
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface Resident extends User {
  role: 'resident'
  purok: string
  gender: 'male' | 'female' | 'other'
  address: string
  dateOfBirth: Date
  contactNumber: string
  verificationStatus: 'pending' | 'verified' | 'rejected'
  idPath?: string
  householdHead?: string
}

export interface Official extends User {
  role: 'admin' | 'staff' | 'captain'
  position: string
}

// Document request schema
export interface DocumentRequest {
  id: string
  residentId: string
  documentType: DocumentType
  status: RequestStatus
  controlNumber: string
  purpose: string
  createdAt: Date
  approvedAt?: Date
  approvedBy?: string
  rejectionReason?: string
  documentPath?: string
  downloadedAt?: Date
  createdBy: string
}

// Blotter schema
export interface BlotterReport {
  id: string
  residentId: string
  complainantName: string
  respondentName: string
  natureOfCase: string
  dateOfIncident: Date
  status: BlotterStatus
  scheduledHearingDate?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

// Announcement schema
export interface Announcement {
  id: string
  title: string
  content: string
  targetAudience: 'all' | 'residents' | 'officials'
  scheduledDate?: Date
  postedAt: Date
  createdBy: string
  isActive: boolean
}

// Ordinance schema
export interface Ordinance {
  id: string
  title: string
  content: string
  category: string
  filePath: string
  uploadedAt: Date
  uploadedBy: string
}

// Project schema
export interface Project {
  id: string
  title: string
  description: string
  startDate: Date
  endDate?: Date
  progress: number
  budget?: number
  spent?: number
  location: string
  status: 'planning' | 'ongoing' | 'completed'
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

// Activity log schema
export interface ActivityLog {
  id: string
  userId: string
  action: string
  targetType: string
  targetId: string
  details: Record<string, any>
  createdAt: Date
}

// Notification schema
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'approval' | 'rejection' | 'announcement' | 'blotter_update' | 'general'
  link?: string
  read: boolean
  createdAt: Date
}

// Mock data storage (will be replaced with actual Supabase)
export const mockData = {
  users: new Map<string, User>(),
  residents: new Map<string, Resident>(),
  officials: new Map<string, Official>(),
  documentRequests: new Map<string, DocumentRequest>(),
  blotterReports: new Map<string, BlotterReport>(),
  announcements: new Map<string, Announcement>(),
  ordinances: new Map<string, Ordinance>(),
  projects: new Map<string, Project>(),
  activityLogs: new Map<string, ActivityLog>(),
  notifications: new Map<string, Notification>(),
}
