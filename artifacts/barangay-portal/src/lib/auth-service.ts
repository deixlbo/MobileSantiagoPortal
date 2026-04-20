import { supabase } from './supabase';

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  contactNumber?: string;
  userType: 'resident' | 'official';
  purok?: string;
  position?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  userType: 'admin' | 'official' | 'resident';
  status: 'pending' | 'active' | 'inactive' | 'rejected';
  isActivated: boolean;
  createdAt: string;
}

/**
 * Simple hash function for client-side (not cryptographically secure for production)
 * In production, use Supabase Auth or secure backend hashing
 */
export async function hashPassword(password: string): Promise<string> {
  // Use Web Crypto API for simple hashing
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const newHash = await hashPassword(password);
  return newHash === hash;
}

/**
 * Register a new user (resident or official)
 */
export async function registerUser(payload: RegisterPayload) {
  try {
    // Hash the password
    const passwordHash = await hashPassword(payload.password);

    // Create user in users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          email: payload.email,
          password_hash: passwordHash,
          full_name: payload.fullName,
          contact_number: payload.contactNumber,
          user_type: payload.userType,
          status: 'pending', // Admin must approve
          is_activated: false,
        },
      ])
      .select()
      .single();

    if (userError) {
      throw new Error(`User creation failed: ${userError.message}`);
    }

    // Create resident or official record
    if (payload.userType === 'resident' && userData) {
      const { error: residentError } = await supabase
        .from('residents')
        .insert([
          {
            user_id: userData.id,
            purok: payload.purok || '',
          },
        ]);

      if (residentError) {
        // Clean up user if resident creation fails
        await supabase.from('users').delete().eq('id', userData.id);
        throw new Error(`Resident profile creation failed: ${residentError.message}`);
      }
    } else if (payload.userType === 'official' && userData) {
      const { error: officialError } = await supabase
        .from('officials')
        .insert([
          {
            user_id: userData.id,
            position: payload.position || '',
          },
        ]);

      if (officialError) {
        // Clean up user if official creation fails
        await supabase.from('users').delete().eq('id', userData.id);
        throw new Error(`Official profile creation failed: ${officialError.message}`);
      }
    }

    return { success: true, userId: userData?.id };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

/**
 * Login user with email and password
 */
export async function loginUser(payload: LoginPayload) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', payload.email)
      .single();

    if (error || !data) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await verifyPassword(payload.password, data.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Check if account is activated
    if (!data.is_activated) {
      throw new Error('Account not activated. Please wait for admin approval.');
    }

    // Check if account is active
    if (data.status !== 'active') {
      throw new Error(`Account status: ${data.status}. Please contact admin.`);
    }

    return {
      success: true,
      user: {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        userType: data.user_type,
        status: data.status,
        isActivated: data.is_activated,
        createdAt: data.created_at,
      } as AuthUser,
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Get current user by ID
 */
export async function getUserById(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      userType: data.user_type,
      status: data.status,
      isActivated: data.is_activated,
      createdAt: data.created_at,
    } as AuthUser;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
}

/**
 * Logout user (client-side only as there's no server session)
 */
export function logoutUser() {
  // Clear local storage or session storage
  localStorage.removeItem('authUser');
  localStorage.removeItem('authToken');
}

/**
 * Get resident profile
 */
export async function getResidentProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('residents')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch resident profile: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Get resident profile error:', error);
    throw error;
  }
}

/**
 * Get official profile
 */
export async function getOfficialProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('officials')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch official profile: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Get official profile error:', error);
    throw error;
  }
}
