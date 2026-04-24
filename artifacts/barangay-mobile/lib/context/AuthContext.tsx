'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, UserRole } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authError: string | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_RESIDENTS: User[] = [
  {
    uid: 'res-001',
    email: 'juan@email.com',
    fullName: 'Juan dela Cruz',
    role: 'resident',
    address: 'Purok 1, Barangay Santiago',
    phone: '09123456789',
  },
  {
    uid: 'res-002',
    email: 'maria@email.com',
    fullName: 'Maria Santos',
    role: 'resident',
    address: 'Purok 2, Barangay Santiago',
    phone: '09987654321',
  },
];

const DEMO_OFFICIALS: User[] = [
  {
    uid: 'off-001',
    email: 'captain@brgy-santiago.gov.ph',
    fullName: 'Hon. Rolando C. Borja',
    role: 'official',
    address: 'Barangay Hall, Santiago',
  },
  {
    uid: 'off-002',
    email: 'secretary@brgy-santiago.gov.ph',
    fullName: 'Sec. Maria D. Santos',
    role: 'official',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Load user from localStorage
    const stored = localStorage.getItem('barangay_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string,
    role: UserRole
  ): Promise<boolean> => {
    setAuthError(null);
    const pool = role === 'official' ? DEMO_OFFICIALS : DEMO_RESIDENTS;
    const found = pool.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (found && password.length >= 4) {
      setUser(found);
      localStorage.setItem('barangay_user', JSON.stringify(found));
      return true;
    }

    setAuthError(
      found
        ? 'Invalid password (4+ chars)'
        : `No ${role} account: ${pool[0].email}`
    );
    return false;
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('barangay_user');
  };

  const clearError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{ user, loading, authError, login, logout, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
