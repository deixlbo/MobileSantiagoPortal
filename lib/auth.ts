"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  fullName: string
  role: 'admin' | 'resident'
  residentId?: string
  position?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'barangay-auth',
    }
  )
)

// Mock users for login
export const mockUsers = {
  officials: [
    {
      id: 'admin-001',
      email: 'captain@barangaysantiago.gov.ph',
      password: 'admin123',
      fullName: 'Hon. Roberto S. Dela Cruz',
      role: 'admin' as const,
      position: 'Punong Barangay'
    },
    {
      id: 'admin-002',
      email: 'secretary@barangaysantiago.gov.ph',
      password: 'admin123',
      fullName: 'Maria Santos',
      role: 'admin' as const,
      position: 'Barangay Secretary'
    }
  ],
  residents: [
    {
      id: 'res-001',
      email: 'juan.delacruz@email.com',
      password: 'resident123',
      fullName: 'Juan Dela Cruz',
      role: 'resident' as const,
      residentId: 'RES-2024-001'
    },
    {
      id: 'res-002',
      email: 'maria.clara@email.com',
      password: 'resident123',
      fullName: 'Maria Clara Reyes',
      role: 'resident' as const,
      residentId: 'RES-2024-002'
    },
    {
      id: 'res-003',
      email: 'pedro.penduko@email.com',
      password: 'resident123',
      fullName: 'Pedro Penduko',
      role: 'resident' as const,
      residentId: 'RES-2024-003'
    }
  ]
}
