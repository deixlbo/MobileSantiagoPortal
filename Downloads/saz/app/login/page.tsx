'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import type { UserRole } from '@/lib/types';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { login, authError, clearError } = useAuth();
  const [role, setRole] = useState<UserRole>('resident');
  const [email, setEmail] = useState('juan@email.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRoleSwitch = (r: UserRole) => {
    setRole(r);
    clearError();
    setEmail(r === 'resident' ? 'juan@email.com' : 'captain@brgy-santiago.gov.ph');
    setPassword('password');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    const success = await login(email, password, role);
    setLoading(false);
    if (success) {
      router.push(role === 'resident' ? '/resident/dashboard' : '/official/dashboard');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.scroll}>
        <div className={styles.content}>
          <div className={styles.logoWrap}>
            <div className={styles.logoCircle}>
              <span className={styles.logoEmoji}>🏛️</span>
            </div>
            <h1 className={styles.logoTitle}>Barangay Santiago</h1>
            <p className={styles.logoSub}>Community Portal</p>
          </div>

          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.roleSwitch}>
              <button
                type="button"
                className={`${styles.roleBtn} ${role === 'resident' ? styles.active : ''}`}
                onClick={() => handleRoleSwitch('resident')}
              >
                Resident
              </button>
              <button
                type="button"
                className={`${styles.roleBtn} ${role === 'official' ? styles.active : ''}`}
                onClick={() => handleRoleSwitch('official')}
              >
                Official
              </button>
            </div>

            {authError && (
              <div className={styles.error}>
                {authError}
              </div>
            )}

            <div className={styles.inputGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Password</label>
              <div className={styles.passwordInput}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.eyeBtn}
                  disabled={loading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className={styles.submitBtn}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className={styles.helpText}>
              {role === 'resident'
                ? 'Demo account: juan@email.com'
                : 'Demo account: captain@brgy-santiago.gov.ph'}
              <br />
              Password: password (4+ chars)
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
