'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authError: string | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  createResidentUser?: (data: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check for stored auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setAuthError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Login failed' }));
        setAuthError(errorData.error || 'Login failed');
        return false;
      }

      const data = await response.json().catch(() => {
        setAuthError('Invalid server response');
        return null;
      });

      if (!data || !data.success || !data.data) {
        setAuthError(data?.error || 'Login failed');
        return false;
      }

      setUser(data.data);
      localStorage.setItem('user', JSON.stringify(data.data));
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error';
      setAuthError(errorMessage);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setAuthError(null);
  };

  const clearError = () => {
    setAuthError(null);
  };

  const createResidentUser = async (data: any): Promise<boolean> => {
    setAuthError(null);
    try {
      const response = await fetch('/api/residents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Registration failed' }));
        setAuthError(errorData.error || 'Registration failed');
        return false;
      }

      // Auto-login after registration
      return await login(data.email, data.password, 'resident');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error';
      setAuthError(errorMessage);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, authError, login, logout, clearError, createResidentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
