import { supabase } from './supabase'

function sanitizeFileName(fileName: string) {
  return fileName
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-_.]/g, '')
}

async function uploadResidentIdFile(file: File, userId: string) {
  const sanitizedFileName = sanitizeFileName(file.name)
  const filePath = `${userId}/${Date.now()}-${sanitizedFileName}`
  const { data, error } = await supabase.storage
    .from('resident-ids')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw error
  }

  const publicUrl = supabase.storage.from('resident-ids').getPublicUrl(filePath).data.publicUrl
  return publicUrl
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function sendPasswordResetEmail(email: string, redirectTo?: string) {
  return supabase.auth.resetPasswordForEmail(email, redirectTo ? { redirectTo } : undefined)
}

export async function getSessionFromUrl() {
  return supabase.auth.getSessionFromUrl()
}

export async function updatePassword(password: string) {
  return supabase.auth.updateUser({ password })
}

export async function signUpResident(data: {
  email: string
  password: string
  firstName: string
  lastName: string
  purok: string
  gender: string
  occupation?: string
  documentType?: string
  documentFile?: File
}) {
  const { email, password, firstName, lastName, purok, gender, occupation, documentFile } = data
  const result = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'resident',
        firstName,
        lastName,
        purok,
        gender,
        occupation,
      },
    },
  })

  if (result.error || !result.data.user) {
    return result
  }

  const userId = result.data.user.id
  let idPath: string | undefined

  if (documentFile) {
    idPath = await uploadResidentIdFile(documentFile, userId)
  }

  const profilePayload: Record<string, any> = {
    id: userId,
    email,
    role: 'resident',
    first_name: firstName,
    last_name: lastName,
    purok,
    gender,
    occupation,
  }

  if (idPath) {
    profilePayload.id_path = idPath
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert([profilePayload])

  if (profileError) {
    return { error: profileError }
  }

  return result
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getUserRole(user: any) {
  const metadataRole =
    user?.user_metadata?.role ??
    user?.app_metadata?.role ??
    user?.role ??
    null

  if (typeof metadataRole === 'string' && metadataRole.trim()) {
    return metadataRole.toLowerCase()
  }

  if (!user?.id) {
    return null
  }

  const { profile } = await getProfile(user.id)
  if (profile?.role && typeof profile.role === 'string') {
    return profile.role.toLowerCase()
  }

  return null
}

export async function getCurrentUser() {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      const { data, error } = await supabase.auth.getUser()
      if (error) return null
      return data.user ?? null
    }
    return sessionData?.session?.user ?? null
  } catch (error) {
    return null
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
  household_id?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export async function getProfile(userId?: string) {
  const id = userId ?? (await getCurrentUser())?.id
  if (!id) {
    return { profile: null, error: new Error('No authenticated user found') }
  }

  const { data, error } = await supabase
    .from<ProfileRow>('profiles')
    .select('*')
    .eq('id', id)
    .single()

  return { profile: data, error }
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function createAdmin(data: {
  email: string
  password: string
  firstName: string
  lastName: string
}) {
  const session = await getSession()
  const token = session?.access_token
  const response = await fetch('/api/admin/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ ...data, role: 'admin' }),
  })
  return response.json()
}

export async function createOfficial(data: {
  email: string
  password: string
  firstName: string
  lastName: string
  position: string
}) {
  const session = await getSession()
  const token = session?.access_token
  const response = await fetch('/api/admin/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ ...data, role: 'official' }),
  })
  return response.json()
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
}) {
  const session = await getSession()
  const token = session?.access_token
  const response = await fetch('/api/admin/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ ...data, role: 'resident' }),
  })
  return response.json()
}
