import { supabase } from './supabase';
import { hashPassword } from './auth-service';

export interface UserForApproval {
  id: string;
  email: string;
  fullName: string;
  contactNumber?: string;
  userType: 'resident' | 'official';
  status: 'pending' | 'active' | 'inactive' | 'rejected';
  isActivated: boolean;
  createdAt: string;
  residentData?: any;
  officialData?: any;
}

/**
 * Get all pending users for approval
 */
export async function getPendingUsers() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        residents(*),
        officials(*)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch pending users: ${error.message}`);
    }

    return data.map((user: any) => ({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      contactNumber: user.contact_number,
      userType: user.user_type,
      status: user.status,
      isActivated: user.is_activated,
      createdAt: user.created_at,
      residentData: user.residents?.[0] || null,
      officialData: user.officials?.[0] || null,
    }));
  } catch (error) {
    console.error('Get pending users error:', error);
    throw error;
  }
}

/**
 * Approve a user and activate their account
 */
export async function approveUser(userId: string) {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        status: 'active',
        is_activated: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      throw new Error(`Failed to approve user: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Approve user error:', error);
    throw error;
  }
}

/**
 * Reject a user
 */
export async function rejectUser(userId: string, reason?: string) {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        status: 'rejected',
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      throw new Error(`Failed to reject user: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Reject user error:', error);
    throw error;
  }
}

/**
 * Delete a user completely
 */
export async function deleteUser(userId: string) {
  try {
    // User deletion will cascade to resident/official records
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
}

/**
 * Create a new official user (by admin)
 */
export async function createOfficialUser(email: string, fullName: string, position: string, contactNumber?: string) {
  try {
    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-12);
    const passwordHash = await hashPassword(tempPassword);

    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          email,
          password_hash: passwordHash,
          full_name: fullName,
          contact_number: contactNumber || null,
          user_type: 'official',
          status: 'active',
          is_activated: true,
        },
      ])
      .select()
      .single();

    if (userError) {
      throw new Error(`Failed to create official: ${userError.message}`);
    }

    // Create official profile
    const { error: officialError } = await supabase
      .from('officials')
      .insert([
        {
          user_id: userData.id,
          position,
          approved_at: new Date().toISOString(),
        },
      ]);

    if (officialError) {
      // Clean up if profile creation fails
      await supabase.from('users').delete().eq('id', userData.id);
      throw new Error(`Failed to create official profile: ${officialError.message}`);
    }

    return {
      success: true,
      userId: userData.id,
      tempPassword,
    };
  } catch (error) {
    console.error('Create official user error:', error);
    throw error;
  }
}

/**
 * Get all users (with filtering)
 */
export async function getAllUsers(userType?: string, status?: string) {
  try {
    let query = supabase
      .from('users')
      .select(`
        *,
        residents(*),
        officials(*)
      `)
      .order('created_at', { ascending: false });

    if (userType) {
      query = query.eq('user_type', userType);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return data.map((user: any) => ({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      contactNumber: user.contact_number,
      userType: user.user_type,
      status: user.status,
      isActivated: user.is_activated,
      createdAt: user.created_at,
      residentData: user.residents?.[0] || null,
      officialData: user.officials?.[0] || null,
    }));
  } catch (error) {
    console.error('Get all users error:', error);
    throw error;
  }
}

/**
 * Update resident approval
 */
export async function approveResident(residentId: string) {
  try {
    const { error } = await supabase
      .from('residents')
      .update({
        approved_at: new Date().toISOString(),
      })
      .eq('id', residentId);

    if (error) {
      throw new Error(`Failed to approve resident: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Approve resident error:', error);
    throw error;
  }
}

/**
 * Update official approval
 */
export async function approveOfficial(officialId: string) {
  try {
    const { error } = await supabase
      .from('officials')
      .update({
        approved_at: new Date().toISOString(),
      })
      .eq('id', officialId);

    if (error) {
      throw new Error(`Failed to approve official: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Approve official error:', error);
    throw error;
  }
}
