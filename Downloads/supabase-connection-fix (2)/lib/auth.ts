import { supabase } from './supabase'
import { RESIDENT_UPLOAD_BUCKET, ID_STORAGE_PREFIX } from './storage'

export async function signIn(email: string, password: string) {
  try {
    const result = await supabase.auth.signInWithPassword({ email, password })

    if (!result.error && typeof window !== 'undefined' && result.data?.session?.access_token) {
      window.localStorage.setItem('auth_token', result.data.session.access_token)
    }

    return { data: result.data, error: result.error }
  } catch (err) {
    return { data: null, error: err as Error }
  }
}

const clearSupabaseSessionStorage = () => {
  if (typeof window === 'undefined') return

  const clearStoredKeys = (storage: Storage) => {
    for (let i = storage.length - 1; i >= 0; i -= 1) {
      const key = storage.key(i)
      if (!key) continue
      if (key.startsWith('supabase.') || key.includes('supabase.auth') || key.startsWith('sb-')) {
        storage.removeItem(key)
      }
    }
  }

  clearStoredKeys(window.localStorage)
  clearStoredKeys(window.sessionStorage)
  window.localStorage.removeItem('auth_token')
}

export const signOut = async () => {
  try {
    const res = await supabase.auth.signOut()
    clearSupabaseSessionStorage()
    return { error: res.error }
  } catch (err) {
    clearSupabaseSessionStorage()
    return { error: err as Error }
  }
}

export const getSession = async () => {
  try {
    const { data } = await supabase.auth.getSession()
    return data.session || null
  } catch {
    return null
  }
}

export const getCurrentUser = async () => {
  try {
    const { data } = await supabase.auth.getUser()
    return data?.user || null
  } catch {
    return null
  }
}

export const getUserRole = async (user: any) => {
  if (!user) return null

  const metadataRole = user.user_metadata?.role || user.app_metadata?.role
  if (metadataRole) return metadataRole

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (error || !profile) return null
    return profile.role
  } catch {
    return null
  }
}

export const getProfile = async (userId?: string) => {
  try {
    let uid = userId
    if (!uid) {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user) {
        const err = userError || new Error('Not authenticated')
        return { profile: null, error: err }
      }
      uid = userData.user.id
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single()

    if (error) {
      // Wrap Supabase error with better context
      const errorMessage = error.message || JSON.stringify(error) || 'Unknown error fetching profile'
      return { profile: null, error: new Error(errorMessage) }
    }

    return { profile, error: null }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : JSON.stringify(err)
    return { profile: null, error: new Error(`Profile fetch failed: ${errorMessage}`) }
  }
}

export async function getResidentDocument(residentId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id_type, id_path, created_at')
      .eq('id', residentId)
      .single()

    if (error || !data || !data.id_path) {
      return null
    }

    return {
      data: data.id_path,
      fileName: data.id_type || 'resident-id',
      uploadedAt: data.created_at || null,
    }
  } catch {
    return null
  }
}

export async function sendPasswordResetEmail(email: string, redirectTo: string) {
  try {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, redirectTo }),
    })
    const result = await response.json()
    return {
      data: response.ok ? result : null,
      error: response.ok ? null : new Error(result.error || 'Failed to send reset link'),
    }
  } catch (err) {
    return { data: null, error: err as Error }
  }
}

export async function updatePassword(token: string, password: string) {
  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword: password }),
    })
    const result = await response.json()
    return {
      data: response.ok ? result : null,
      error: response.ok ? null : new Error(result.error || 'Failed to update password'),
    }
  } catch (err) {
    return { data: null, error: err as Error }
  }
}

export const signUpResident = async (data: any) => {
  const {
    email,
    password,
    firstName,
    middleName,
    lastName,
    suffix,
    civilStatus,
    purok,
    gender,
    occupation,
    contactNumber,
    address,
    dateOfBirth,
    documentType,
    documentFile,
  } = data

  try {
    // First, sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'resident',
        },
      },
    })

    if (authError) {
      return { data: null, error: authError }
    }

    const user = authData.user
    if (!user) {
      return { data: null, error: new Error('Failed to create user') }
    }

    // Prepare file upload if provided
    let idPath: string | null = null
    let idType: string | null = null
    let storagePath: string | null = null

    if (documentFile) {
      idType = documentType || documentFile.name
      storagePath = `${ID_STORAGE_PREFIX}/${user.id}/${Date.now()}-${documentFile.name}`
      const { error: uploadError } = await supabase.storage
        .from(RESIDENT_UPLOAD_BUCKET)
        .upload(storagePath, documentFile, {
          contentType: documentFile.type,
          cacheControl: '3600',
        })

      if (uploadError) {
        return { data: null, error: uploadError }
      }

      const { data: publicUrl } = supabase.storage
        .from(RESIDENT_UPLOAD_BUCKET)
        .getPublicUrl(storagePath)

      idPath = publicUrl.publicUrl || null
    }

    // Call server API to create profile (uses service role, bypasses RLS)
    const response = await fetch('/api/auth/register-resident', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        email,
        firstName,
        middleName,
        lastName,
        suffix,
        civilStatus,
        purok,
        gender,
        occupation,
        contactNumber,
        address,
        dateOfBirth,
        idType,
        idPath,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      // If profile creation fails, clean up the file upload
      if (storagePath) {
        await supabase.storage.from(RESIDENT_UPLOAD_BUCKET).remove([storagePath])
      }
      return { data: null, error: new Error(result.error || 'Failed to create profile') }
    }

    return { data: { user, profile: result.profile }, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export type ProfileRow = {
  id: string
  email: string
  role: string
  first_name: string
  last_name: string
  purok?: string | null
  gender?: string | null
  address?: string | null
  date_of_birth?: string | null
  contact_number?: string | null
  occupation?: string | null
  position?: string | null
  verification_status?: string | null
  id_path?: string | null
  id_type?: string | null
  household_id?: string | null
  middle_name?: string | null
  suffix?: string | null
  civil_status?: string | null
  created_at?: string | null
  updated_at?: string | null
}

async function postToAdminRegister(body: Record<string, any>) {
  const response = await fetch('/api/admin/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const result = await response.json()
  return { data: response.ok ? result : null, error: response.ok ? null : new Error(result.error || 'Failed to create account') }
}

export async function createAdmin(data: {
  email: string
  password: string
  firstName: string
  lastName: string
}) {
  return postToAdminRegister({ ...data, role: 'admin' })
}

export async function createOfficial(data: {
  email: string
  password: string
  firstName: string
  lastName: string
  position: string
}) {
  return postToAdminRegister({ ...data, role: 'official' })
}

export async function createResident(data: {
  email: string
  password: string
  firstName: string
  lastName: string
  purok?: string
  gender?: string
  occupation?: string
  contactNumber?: string
  address?: string
  dateOfBirth?: string
  civilStatus?: string
}) {
  return postToAdminRegister({ ...data, role: 'resident' })
}
