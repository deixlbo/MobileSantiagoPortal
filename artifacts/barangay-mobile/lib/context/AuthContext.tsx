'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, UserRole } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authError: string | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  createResidentUser: (userData: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    purok: string;
  }) => Promise<boolean>;
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

    if (role === 'official') {
      // Officials can only use demo accounts
      const found = DEMO_OFFICIALS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (found && password.length >= 4) {
        setUser(found);
        localStorage.setItem('barangay_user', JSON.stringify(found));
        return true;
      }

      setAuthError(
        found ? 'Invalid password' : 'Official account not found'
      );
      return false;
    } else {
      // Residents: check demo accounts first, then registered
      const demoFound = DEMO_RESIDENTS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (demoFound && password.length >= 4) {
        setUser(demoFound);
        localStorage.setItem('barangay_user', JSON.stringify(demoFound));
        return true;
      }

      // Check registered residents
      const registered = loadRegisteredResidents();
      const regFound = registered.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (regFound && regFound.password === password) {
        const userToSet = { ...regFound };
        delete (userToSet as any).password;
        setUser(userToSet as User);
        localStorage.setItem('barangay_user', JSON.stringify(userToSet));
        return true;
      }

      setAuthError(
        demoFound || regFound ? 'Invalid password' : 'Resident account not found'
      );
      return false;
    }
  };

  const createResidentUser = async (userData: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    purok: string;
  }): Promise<boolean> => {
    setAuthError(null);

    // Validation
    if (!userData.fullName.trim()) {
      setAuthError('Full name is required');
      return false;
    }
    if (!userData.email.includes('@')) {
      setAuthError('Invalid email format');
      return false;
    }
    if (userData.password.length < 6) {
      setAuthError('Password must be at least 6 characters');
      return false;
    }
    if (!userData.phone.trim()) {
      setAuthError('Phone number is required');
      return false;
    }
    if (!userData.address.trim()) {
      setAuthError('Address is required');
      return false;
    }
    if (!userData.purok.trim()) {
      setAuthError('Purok is required');
      return false;
    }

    // Check if email already exists
    const allResidents = [...DEMO_RESIDENTS, ...loadRegisteredResidents()];
    if (
      allResidents.some(
        (u) => u.email.toLowerCase() === userData.email.toLowerCase()
      )
    ) {
      setAuthError('Email already registered');
      return false;
    }

    // Create new resident
    const newResident: User = {
      uid: `res-${Date.now()}`,
      email: userData.email,
      fullName: userData.fullName,
      role: 'resident',
      address: userData.address,
      phone: userData.phone,
    };

    // Save to localStorage
    const registered = loadRegisteredResidents();
    registered.push({
      ...newResident,
      password: userData.password, // Store password for demo (NOT production!)
    });
    localStorage.setItem(
      'barangay_registered_residents',
      JSON.stringify(registered)
    );

    // Auto-login the new user
    setUser(newResident);
    localStorage.setItem('barangay_user', JSON.stringify(newResident));
    return true;
  };

  const loadRegisteredResidents = (): (User & { password: string })[] => {
    try {
      const stored = localStorage.getItem('barangay_registered_residents');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('barangay_user');
  };

  const clearError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        login,
        createResidentUser,
        logout,
        clearError,
      }}
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
