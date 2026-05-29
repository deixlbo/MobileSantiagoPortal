// =====================================================
// DATABASE TYPES AND SCHEMAS
// Barangay Santiago Mobile Portal
// =====================================================
// These types match the Supabase database schema.
// See supabase-schema.sql for the full SQL schema.
// =====================================================

export type UserRole = 'admin' | 'official' | 'resident'
export type DocumentType = 
  | 'barangay_clearance' 
  | 'certificate_of_residency' 
  | 'certificate_of_indigency' 
  | 'certificate_of_solo_parent' 
  | 'barangay_business_clearance' 
  | 'certificate_of_business_closure' 
  | 'certificate_to_file_action' 
  | 'medical_assistance_certificate' 
  | 'blotter_report' 
  | 'settlement_agreement'

export type RequestStatus = 'pending' | 'approved' | 'declined' | 'ready_to_print' | 'released'
export type BlotterStatus = 
  | 'pending-review' 
  | 'under-investigation' 
  | 'scheduled-mediation' 
  | 'ongoing-hearing' 
  | 'resolved' 
  | 'dismissed' 
  | 'escalated'

export type AnnouncementPriority = 'urgent' | 'important' | 'normal'
export type AnnouncementStatus = 'draft' | 'published' | 'archived'
export type ProjectStatus = 'Planned' | 'Ongoing' | 'Completed' | 'On Hold' | 'Cancelled'
export type VerificationStatus = 'pending' | 'verified' | 'declined'

// =====================================================
// Profile / User Types
// =====================================================
export interface Profile {
  id: string
  email: string
  role: UserRole
  first_name: string
  last_name: string
  purok?: string
  gender?: 'male' | 'female' | 'other'
  address?: string
  date_of_birth?: string
  contact_number?: string
  occupation?: string
  position?: string
  verification_status?: VerificationStatus
  id_path?: string
  household_id?: string
  created_at?: string
  updated_at?: string
}

// =====================================================
// Household Types
// =====================================================
export interface Household {
  id: string
  name: string
  address: string
  purok?: string
  head_id?: string
  member_count?: number
  created_at?: string
  updated_at?: string
}

// =====================================================
// Document Request Types
// =====================================================
export interface DocumentRequest {
  id: string
  resident_id: string
  document_type: DocumentType
  status: RequestStatus
  control_number?: string
  purpose?: string
  approved_at?: string
  approved_by?: string
  rejection_reason?: string
  document_path?: string
  downloaded_at?: string
  created_at?: string
  updated_at?: string
  created_by?: string
  // Joined data
  profiles?: {
    first_name: string
    last_name: string
  }
}

// =====================================================
// Blotter / Incident Report Types
// =====================================================
export interface Blotter {
  id: string
  resident_id?: string
  case_number?: string
  type: string
  description: string
  location?: string
  location_coords?: { lat: number; lng: number }
  complainant: string
  complainant_address?: string
  respondent: string
  respondent_address?: string
  status: BlotterStatus
  filed_date?: string
  investigation_date?: string
  mediation_scheduled_date?: string
  hearing_date?: string
  action_taken?: string
  resolution?: string
  resolution_date?: string
  resolution_document?: string
  created_at?: string
  updated_at?: string
  created_by?: string
}

// =====================================================
// Announcement Types
// =====================================================
export interface Announcement {
  id: string
  title: string
  content: string
  priority: AnnouncementPriority
  status: AnnouncementStatus
  category?: string
  target_audience?: 'all' | 'residents' | 'officials'
  publish_date?: string
  expiry_date?: string
  author?: string
  views?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
  created_by?: string
}

// =====================================================
// Project Types
// =====================================================
export interface Project {
  id: string
  title: string
  type: string
  description?: string
  location?: string
  start_date?: string
  target_completion?: string
  status: ProjectStatus
  progress: number
  budget?: number
  spent?: number
  source?: string
  project_head?: string
  project_head_position?: string
  beneficiaries?: string
  remarks?: string
  created_at?: string
  updated_at?: string
  created_by?: string
}

// =====================================================
// Ordinance Types
// =====================================================
export interface Ordinance {
  id: string
  title: string
  content?: string
  category?: string
  file_path?: string
  uploaded_at?: string
  uploaded_by?: string
}

// =====================================================
// Notification Types
// =====================================================
export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'approval' | 'decline' | 'announcement' | 'blotter_update' | 'general'
  link?: string
  read: boolean
  created_at?: string
}

// =====================================================
// Activity Log Types
// =====================================================
export interface ActivityLog {
  id: string
  user_id?: string
  action: string
  target_type?: string
  target_id?: string
  details?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at?: string
}

// =====================================================
// Appointment Types
// =====================================================
export interface Appointment {
  id: string
  resident_id: string
  type: string
  purpose?: string
  scheduled_date: string
  scheduled_time?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  created_at?: string
  updated_at?: string
}

// =====================================================
// Asset Types
// =====================================================
export interface Asset {
  id: string
  name: string
  category?: string
  description?: string
  quantity: number
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'For Disposal'
  location?: string
  acquisition_date?: string
  acquisition_cost?: number
  current_value?: number
  status: 'Active' | 'In Use' | 'Under Maintenance' | 'Disposed'
  created_at?: string
  updated_at?: string
}

// =====================================================
// Supabase Database Type Definitions
// Use this with supabase-js for type-safe queries
// =====================================================
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id'>>
      }
      households: {
        Row: Household
        Insert: Omit<Household, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Household, 'id'>>
      }
      document_requests: {
        Row: DocumentRequest
        Insert: Omit<DocumentRequest, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<DocumentRequest, 'id'>>
      }
      blotters: {
        Row: Blotter
        Insert: Omit<Blotter, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Blotter, 'id'>>
      }
      announcements: {
        Row: Announcement
        Insert: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Announcement, 'id'>>
      }
      projects: {
        Row: Project
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Project, 'id'>>
      }
      ordinances: {
        Row: Ordinance
        Insert: Omit<Ordinance, 'id' | 'uploaded_at'>
        Update: Partial<Omit<Ordinance, 'id'>>
      }
      notifications: {
        Row: Notification
        Insert: Omit<Notification, 'id' | 'created_at'>
        Update: Partial<Omit<Notification, 'id'>>
      }
      activity_logs: {
        Row: ActivityLog
        Insert: Omit<ActivityLog, 'id' | 'created_at'>
        Update: Partial<Omit<ActivityLog, 'id'>>
      }
      appointments: {
        Row: Appointment
        Insert: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Appointment, 'id'>>
      }
      assets: {
        Row: Asset
        Insert: Omit<Asset, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Asset, 'id'>>
      }
    }
  }
}
