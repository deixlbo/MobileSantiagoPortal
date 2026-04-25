import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper functions for database operations
export const db = {
  // User queries
  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    return { data, error };
  },

  // Resident queries
  async getResident(residentId: string) {
    const { data, error } = await supabase
      .from('residents')
      .select('*')
      .eq('id', residentId)
      .single();
    return { data, error };
  },

  async getResidents(status?: string) {
    let query = supabase.from('residents').select('*');
    if (status) {
      query = query.eq('status', status);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  },

  // Documents queries
  async getDocuments(residentId: string) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('resident_id', residentId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getDocumentRequests(residentId: string) {
    const { data, error } = await supabase
      .from('document_requests')
      .select('*')
      .eq('resident_id', residentId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Announcements queries
  async getAnnouncements() {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Blotter queries
  async getBlotterReports() {
    const { data, error } = await supabase
      .from('blotter')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Ordinances queries
  async getOrdinances() {
    const { data, error } = await supabase
      .from('ordinances')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Projects queries
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Activity logs
  async logActivity(userId: string, action: string, entityType?: string, entityId?: string, details?: any) {
    const { error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        details
      });
    return { error };
  }
};
