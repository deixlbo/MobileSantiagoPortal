import { createClient } from '@supabase/supabase-js'

let supabaseInstance: any = null

function getSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return proxy to prevent errors at import time
    return new Proxy({}, {
      get: () => {
        throw new Error('Supabase client is not configured')
      }
    })
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}

// Lazy-load the client
export const supabase = new Proxy({}, {
  get: (target, prop) => {
    const instance = getSupabaseClient()
    return (instance as any)[prop]
  }
}) as any

// =====================================================
// DATABASE TYPES AND SCHEMAS
// Barangay Santiago Mobile Portal
// =====================================================

export type UserRole = 'admin' | 'official' | 'resident'
export type DocumentStatus = 'pending' | 'approved' | 'rejected' | 'issued' | 'archived'
export type ComplaintStatus = 'open' | 'in_progress' | 'resolved' | 'closed' | 'pending_review'
export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent'
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled'
export type NotificationStatus = 'unread' | 'read' | 'archived'
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
export type AnnouncementStatus = 'draft' | 'published' | 'archived'

// =====================================================
// USERS FUNCTIONS
// =====================================================
export const users = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw new Error(`Failed to fetch user: ${error.message}`)
    return data
  },

  async updateProfile(userId: string, updates: Record<string, any>) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw new Error(`Failed to update user: ${error.message}`)
    return data
  },

  async listUsers(role?: string, limit = 50, offset = 0) {
    let query = supabase.from('profiles').select('*')
    if (role) query = query.eq('role', role)
    
    const { data, error, count } = await query
      .range(offset, offset + limit - 1)
    
    if (error) throw new Error(`Failed to list users: ${error.message}`)
    return { data, count }
  }
}

// =====================================================
// DOCUMENTS FUNCTIONS
// =====================================================
export const documents = {
  async getDocuments(residentId: string, limit = 50, offset = 0) {
    const { data, error, count } = await supabase
      .from('document_requests')
      .select('*')
      .eq('resident_id', residentId)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(`Failed to fetch documents: ${error.message}`)
    return { data, count }
  },

  async getDocumentsByStatus(status: DocumentStatus, limit = 50, offset = 0) {
    const { data, error, count } = await supabase
      .from('document_requests')
      .select('*')
      .eq('status', status)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(`Failed to fetch documents: ${error.message}`)
    return { data, count }
  },

  async searchDocuments(searchTerm: string, limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('document_requests')
      .select('*')
      .or(`control_number.ilike.%${searchTerm}%,purpose.ilike.%${searchTerm}%`)
      .range(offset, offset + limit - 1)
    
    if (error) throw new Error(`Failed to search documents: ${error.message}`)
    return data
  },

  async createDocument(residentId: string, documentData: Record<string, any>) {
    const { data, error } = await supabase
      .from('document_requests')
      .insert([{ resident_id: residentId, ...documentData }])
      .select()
      .single()
    
    if (error) throw new Error(`Failed to create document: ${error.message}`)
    return data
  },

  async updateDocument(documentId: string, updates: Record<string, any>) {
    const { data, error } = await supabase
      .from('document_requests')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', documentId)
      .select()
      .single()
    
    if (error) throw new Error(`Failed to update document: ${error.message}`)
    return data
  }
}

// =====================================================
// COMPLAINTS FUNCTIONS
// =====================================================
export const complaints = {
  async getComplaints(residentId?: string, limit = 50, offset = 0) {
    let query = supabase.from('complaints').select('*')
    if (residentId) query = query.eq('resident_id', residentId)
    
    const { data, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(`Failed to fetch complaints: ${error.message}`)
    return { data, count }
  },

  async getComplaintsByStatus(status: ComplaintStatus, limit = 50, offset = 0) {
    const { data, error, count } = await supabase
      .from('complaints')
      .select('*')
      .eq('status', status)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(`Failed to fetch complaints: ${error.message}`)
    return { data, count }
  },

  async createComplaint(residentId: string, complaintData: Record<string, any>) {
    const { data, error } = await supabase
      .from('complaints')
      .insert([{ resident_id: residentId, ...complaintData }])
      .select()
      .single()
    
    if (error) throw new Error(`Failed to create complaint: ${error.message}`)
    return data
  },

  async updateComplaint(complaintId: string, updates: Record<string, any>) {
    const { data, error } = await supabase
      .from('complaints')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', complaintId)
      .select()
      .single()
    
    if (error) throw new Error(`Failed to update complaint: ${error.message}`)
    return data
  }
}

// =====================================================
// NOTIFICATIONS FUNCTIONS
// =====================================================
export const notifications = {
  async getUserNotifications(userId: string, limit = 50, offset = 0) {
    const { data, error, count } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(`Failed to fetch notifications: ${error.message}`)
    return { data, count }
  },

  async markAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ status: 'read', read_at: new Date().toISOString() })
      .eq('id', notificationId)
      .select()
      .single()
    
    if (error) throw new Error(`Failed to mark notification as read: ${error.message}`)
    return data
  },

  async createNotification(userId: string, notificationData: Record<string, any>) {
    const { data, error } = await supabase
      .from('notifications')
      .insert([{ user_id: userId, ...notificationData }])
      .select()
      .single()
    
    if (error) throw new Error(`Failed to create notification: ${error.message}`)
    return data
  }
}

// =====================================================
// APPOINTMENTS FUNCTIONS
// =====================================================
export const appointments = {
  async getAppointments(residentId?: string, limit = 50, offset = 0) {
    let query = supabase.from('appointments').select('*')
    if (residentId) query = query.eq('resident_id', residentId)
    
    const { data, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('appointment_date', { ascending: true })
    
    if (error) throw new Error(`Failed to fetch appointments: ${error.message}`)
    return { data, count }
  },

  async createAppointment(residentId: string, appointmentData: Record<string, any>) {
    const { data, error } = await supabase
      .from('appointments')
      .insert([{ resident_id: residentId, ...appointmentData }])
      .select()
      .single()
    
    if (error) throw new Error(`Failed to create appointment: ${error.message}`)
    return data
  },

  async updateAppointment(appointmentId: string, updates: Record<string, any>) {
    const { data, error } = await supabase
      .from('appointments')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', appointmentId)
      .select()
      .single()
    
    if (error) throw new Error(`Failed to update appointment: ${error.message}`)
    return data
  }
}

// =====================================================
// ANNOUNCEMENTS FUNCTIONS
// =====================================================
export const announcements = {
  async getAnnouncements(limit = 50, offset = 0) {
    const { data, error, count } = await supabase
      .from('announcements')
      .select('*')
      .eq('status', 'published')
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(`Failed to fetch announcements: ${error.message}`)
    return { data, count }
  },

  async createAnnouncement(authorId: string, announcementData: Record<string, any>) {
    const { data, error } = await supabase
      .from('announcements')
      .insert([{ author_id: authorId, ...announcementData }])
      .select()
      .single()
    
    if (error) throw new Error(`Failed to create announcement: ${error.message}`)
    return data
  }
}

// =====================================================
// ANALYTICS FUNCTIONS
// =====================================================
export const analytics = {
  async getMetrics(metricName?: string, days = 30) {
    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - days)
    
    let query = supabase
      .from('analytics')
      .select('*')
      .gte('metric_date', fromDate.toISOString().split('T')[0])
    
    if (metricName) query = query.eq('metric_name', metricName)
    
    const { data, error } = await query.order('metric_date', { ascending: true })
    
    if (error) throw new Error(`Failed to fetch analytics: ${error.message}`)
    return data
  },

  async recordMetric(metricName: string, value: number, category?: string) {
    const today = new Date().toISOString().split('T')[0]
    
    const { data: existing, error: fetchError } = await supabase
      .from('analytics')
      .select('id, metric_value')
      .eq('metric_name', metricName)
      .eq('metric_date', today)
      .single()
    
    if (existing) {
      const { data, error } = await supabase
        .from('analytics')
        .update({ metric_value: value })
        .eq('id', existing.id)
        .select()
        .single()
      
      if (error) throw new Error(`Failed to update metric: ${error.message}`)
      return data
    } else {
      const { data, error } = await supabase
        .from('analytics')
        .insert([{ metric_name: metricName, metric_value: value, category, metric_date: today }])
        .select()
        .single()
      
      if (error) throw new Error(`Failed to record metric: ${error.message}`)
      return data
    }
  }
}

// =====================================================
// PAYMENTS FUNCTIONS
// =====================================================
export const payments = {
  async getPayments(residentId?: string, status?: PaymentStatus, limit = 50, offset = 0) {
    let query = supabase.from('payments').select('*')
    if (residentId) query = query.eq('resident_id', residentId)
    if (status) query = query.eq('status', status)
    
    const { data, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(`Failed to fetch payments: ${error.message}`)
    return { data, count }
  },

  async createPayment(residentId: string, paymentData: Record<string, any>) {
    const { data, error } = await supabase
      .from('payments')
      .insert([{ resident_id: residentId, ...paymentData }])
      .select()
      .single()
    
    if (error) throw new Error(`Failed to create payment: ${error.message}`)
    return data
  },

  async updatePayment(paymentId: string, updates: Record<string, any>) {
    const { data, error } = await supabase
      .from('payments')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', paymentId)
      .select()
      .single()
    
    if (error) throw new Error(`Failed to update payment: ${error.message}`)
    return data
  }
}

// =====================================================
// SETTINGS FUNCTIONS
// =====================================================
export const settings = {
  async getSetting(key: string) {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('setting_key', key)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch setting: ${error.message}`)
    }
    return data?.setting_value || null
  },

  async updateSetting(key: string, value: string) {
    const { data, error } = await supabase
      .from('settings')
      .upsert({ setting_key: key, setting_value: value, updated_at: new Date().toISOString() })
      .select()
      .single()
    
    if (error) throw new Error(`Failed to update setting: ${error.message}`)
    return data
  },

  async getAllSettings() {
    const { data, error } = await supabase.from('settings').select('*')
    
    if (error) throw new Error(`Failed to fetch settings: ${error.message}`)
    return data
  }
}

// =====================================================
// AUDIT LOGS FUNCTIONS
// =====================================================
export const auditLogs = {
  async log(userId: string, action: string, entityType: string, entityId?: string, changes?: Record<string, any>) {
    const { data, error } = await supabase
      .from('audit_logs')
      .insert([{
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        changes: changes || {},
        ip_address: 'N/A',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'
      }])
      .select()
      .single()
    
    if (error) console.error(`Failed to log audit: ${error.message}`)
    return data
  },

  async getLogs(userId?: string, limit = 50, offset = 0) {
    let query = supabase.from('audit_logs').select('*')
    if (userId) query = query.eq('user_id', userId)
    
    const { data, error } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(`Failed to fetch audit logs: ${error.message}`)
    return data
  }
}
