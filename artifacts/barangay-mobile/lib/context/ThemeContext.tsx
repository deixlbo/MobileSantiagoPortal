'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Colors {
  background: string;
  foreground: string;
  sidebar: string;
  sidebarForeground: string;
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  border: string;
  textSecondary: string;
}

interface ThemeContextType {
  isDark: boolean;
  colors: Colors;
  toggleTheme: () => void;
}

const lightColors: Colors = {
  background: '#f8fafc',
  foreground: '#1e293b',
  sidebar: '#10b981',
  sidebarForeground: '#f0fdf4',
  primary: '#06b6d4',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  border: '#e2e8f0',
  textSecondary: '#64748b',
};

const darkColors: Colors = {
  background: '#0f172a',
  foreground: '#f1f5f9',
  sidebar: '#059669',
  sidebarForeground: '#ecfdf5',
  primary: '#06b6d4',
  secondary: '#a78bfa',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#f87171',
  border: '#1e293b',
  textSecondary: '#94a3b8',
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('barangay_theme');
    if (saved === 'dark') {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem('barangay_theme', newDark ? 'dark' : 'light');
  };

  if (!mounted) {
    return <>{children}</>;
  }

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      <div style={{ backgroundColor: colors.background, color: colors.foreground }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export function useColors() {
  const { colors } = useTheme();
  return colors;
}
