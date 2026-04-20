import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, logoutUser, getUserById } from "./auth-service";

export type UserRole = "admin" | "official" | "resident";

export interface UserData {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: 'pending' | 'active' | 'inactive' | 'rejected';
  isActivated: boolean;
  address?: string;
  phone?: string;
  purok?: string;
}

interface AuthContextType {
  user: { uid: string; email: string } | null;
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ uid: string; email: string } | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("barangay_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser({ uid: parsed.uid, email: parsed.email });
        setUserData(parsed);
      } catch {}
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await loginUser({ email, password });
      
      if (result.success && result.user) {
        const user = result.user;
        setUser({ uid: user.id, email: user.email });
        const userData: UserData = {
          uid: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.userType as UserRole,
          status: user.status,
          isActivated: user.isActivated,
        };
        setUserData(userData);
        localStorage.setItem("barangay_user", JSON.stringify(userData));
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setUserData(null);
    logoutUser();
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, userData, loading, error, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
