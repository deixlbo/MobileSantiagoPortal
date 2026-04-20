import { supabase } from './supabase';

/**
 * Unified API interface for Supabase
 * All CRUD operations go directly to Supabase tables
 */
export const api = {
  announcements: {
    list: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    get: async (id: string) => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    create: async (data: any) => {
      const { data: result, error } = await supabase
        .from('announcements')
        .insert([data])
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    update: async (id: string, data: any) => {
      const { data: result, error } = await supabase
        .from('announcements')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  ordinances: {
    list: async () => {
      const { data, error } = await supabase
        .from('ordinances')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    get: async (id: string) => {
      const { data, error } = await supabase
        .from('ordinances')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    create: async (data: any) => {
      const { data: result, error } = await supabase
        .from('ordinances')
        .insert([data])
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    update: async (id: string, data: any) => {
      const { data: result, error } = await supabase
        .from('ordinances')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('ordinances')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  documents: {
    list: async (residentId?: string) => {
      let query = supabase
        .from('document_requests')
        .select('*, document_types(*), officials(*)');
      
      if (residentId) {
        query = query.eq('resident_id', residentId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    get: async (id: string) => {
      const { data, error } = await supabase
        .from('document_requests')
        .select('*, document_types(*), officials(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    create: async (data: any) => {
      const { data: result, error } = await supabase
        .from('document_requests')
        .insert([data])
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    update: async (id: string, data: any) => {
      const { data: result, error } = await supabase
        .from('document_requests')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('document_requests')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  blotter: {
    list: async (reportedById?: string) => {
      let query = supabase
        .from('blotter')
        .select('*, residents(*), officials(*)');
      
      if (reportedById) {
        query = query.eq('complainant_id', reportedById);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    get: async (id: string) => {
      const { data, error } = await supabase
        .from('blotter')
        .select('*, residents(*), officials(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    create: async (data: any) => {
      const { data: result, error } = await supabase
        .from('blotter')
        .insert([data])
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    update: async (id: string, data: any) => {
      const { data: result, error } = await supabase
        .from('blotter')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('blotter')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  projects: {
    list: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    get: async (id: string) => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    create: async (data: any) => {
      const { data: result, error } = await supabase
        .from('projects')
        .insert([data])
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    update: async (id: string, data: any) => {
      const { data: result, error } = await supabase
        .from('projects')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  residents: {
    list: async () => {
      const { data, error } = await supabase
        .from('residents')
        .select('*, users(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    get: async (id: string) => {
      const { data, error } = await supabase
        .from('residents')
        .select('*, users(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    create: async (data: any) => {
      const { data: result, error } = await supabase
        .from('residents')
        .insert([data])
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    update: async (id: string, data: any) => {
      const { data: result, error } = await supabase
        .from('residents')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('residents')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  assets: {
    list: async () => {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    get: async (id: string) => {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    create: async (data: any) => {
      const { data: result, error } = await supabase
        .from('assets')
        .insert([data])
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    update: async (id: string, data: any) => {
      const { data: result, error } = await supabase
        .from('assets')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  businesses: {
    list: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    get: async (id: string) => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    create: async (data: any) => {
      const { data: result, error } = await supabase
        .from('businesses')
        .insert([data])
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    update: async (id: string, data: any) => {
      const { data: result, error } = await supabase
        .from('businesses')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  users: {
    list: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    get: async (id: string) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    create: async (data: any) => {
      const { data: result, error } = await supabase
        .from('users')
        .insert([data])
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    update: async (id: string, data: any) => {
      const { data: result, error } = await supabase
        .from('users')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },
};
