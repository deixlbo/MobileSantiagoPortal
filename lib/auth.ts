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

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser()
  return data.user
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
  const response = await fetch('/api/admin/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return response.json()
}
