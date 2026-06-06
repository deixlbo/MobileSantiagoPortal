// Mock authentication system using localStorage
// Demo accounts: admin@demo.com, official@demo.com, resident@demo.com (all with password: demo123)

interface MockUser {
  id: string
  email: string
  role: 'admin' | 'official' | 'resident'
  firstName: string
  lastName: string
  purok?: string
  position?: string
  verified?: boolean
}

interface MockSession {
  user: MockUser
  accessToken: string
  expiresAt: number
}

const DEMO_ACCOUNTS = {
  'admin@demo.com': {
    id: 'admin-001',
    email: 'admin@demo.com',
    password: 'demo123',
    role: 'admin' as const,
    firstName: 'Admin',
    lastName: 'Account',
  },
  'official@demo.com': {
    id: 'official-001',
    email: 'official@demo.com',
    password: 'demo123',
    role: 'official' as const,
    firstName: 'Brgy. Captain',
    lastName: 'Santiago',
    position: 'Barangay Captain',
  },
  'resident@demo.com': {
    id: 'resident-001',
    email: 'resident@demo.com',
    password: 'demo123',
    role: 'resident' as const,
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    purok: 'Purok 1',
    verified: true,
  },
}

const SESSION_KEY = 'mock_session'
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours

function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export async function mockSignIn(email: string, password: string) {
  const account = DEMO_ACCOUNTS[email as keyof typeof DEMO_ACCOUNTS]

  if (!account || account.password !== password) {
    return { error: new Error('Invalid email or password') }
  }

  const session: MockSession = {
    user: {
      id: account.id,
      email: account.email,
      role: account.role,
      firstName: account.firstName,
      lastName: account.lastName,
      purok: (account as any).purok,
      position: (account as any).position,
      verified: (account as any).verified,
    },
    accessToken: generateToken(),
    expiresAt: Date.now() + TOKEN_EXPIRY,
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  }

  return { data: { session }, error: null }
}

export async function mockSignOut() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY)
  }
  return { error: null }
}

export async function mockGetSession() {
  if (typeof window === 'undefined') return null

  const sessionStr = localStorage.getItem(SESSION_KEY)
  if (!sessionStr) return null

  try {
    const session: MockSession = JSON.parse(sessionStr)
    if (session.expiresAt < Date.now()) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return session
  } catch {
    return null
  }
}

export async function mockGetCurrentUser() {
  const session = await mockGetSession()
  return session?.user || null
}

export async function mockGetProfile(userId?: string) {
  const session = await mockGetSession()
  const user = session?.user

  if (!user) {
    return { profile: null, error: new Error('Not authenticated') }
  }

  return {
    profile: {
      id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.firstName,
      last_name: user.lastName,
      purok: user.purok,
      position: user.position,
      verification_status: user.verified ? 'verified' : 'pending',
    },
    error: null,
  }
}

export async function mockGetUserRole(user: any) {
  return user?.role || null
}

export async function mockSendPasswordResetEmail(email: string) {
  // Mock implementation - just return success
  return { error: null }
}

export async function mockUpdatePassword(password: string) {
  // Mock implementation - just return success
  return { error: null }
}

export async function mockSignUpResident(data: any) {
  // Mock implementation - create a new resident
  const newUser = {
    id: 'resident-' + Date.now(),
    email: data.email,
    role: 'resident' as const,
    firstName: data.firstName,
    lastName: data.lastName,
    purok: data.purok,
    verified: false,
  }

  const session: MockSession = {
    user: newUser,
    accessToken: generateToken(),
    expiresAt: Date.now() + TOKEN_EXPIRY,
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  }

  return { data: { session, user: newUser }, error: null }
}
