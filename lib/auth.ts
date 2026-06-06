// Use mock auth system - no Supabase required
export { 
  mockSignIn as signIn,
  mockSignOut as signOut,
  mockGetSession as getSession,
  mockGetCurrentUser as getCurrentUser,
  mockGetProfile as getProfile,
  mockGetUserRole as getUserRole,
  mockSendPasswordResetEmail as sendPasswordResetEmail,
  mockUpdatePassword as updatePassword,
  mockSignUpResident as signUpResident,
} from './mock-auth'

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

// Stub functions for API calls that still use auth
export async function createAdmin(data: {
  email: string
  password: string
  firstName: string
  lastName: string
}) {
  // Mock implementation
  return { success: true, message: 'Admin account created' }
}

export async function createOfficial(data: {
  email: string
  password: string
  firstName: string
  lastName: string
  position: string
}) {
  // Mock implementation
  return { success: true, message: 'Official account created' }
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
  // Mock implementation
  return { success: true, message: 'Resident account created' }
}
