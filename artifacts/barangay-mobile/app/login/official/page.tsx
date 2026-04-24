'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import styles from '../login.module.css';

export default function OfficialLoginPage() {
  const router = useRouter();
  const { login, authError, clearError } = useAuth();
  const [email, setEmail] = useState('captain@brgy-santiago.gov.ph');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLoading(true);

    try {
      const success = await login(email, password, 'official');
      if (success) {
        router.push('/(official)/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Official Login</h1>
        <p className={styles.subtitle}>
          Barangay Officials Portal
        </p>

        <form onSubmit={handleLogin} className={styles.form}>
          {authError && (
            <div className={styles.errorAlert}>
              <span>⚠️ {authError}</span>
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Official Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="captain@brgy-santiago.gov.ph"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={styles.input}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.divider}>or</div>

        <div className={styles.demoSection}>
          <p className={styles.demoTitle}>Demo Accounts</p>
          <p className={styles.demoText}>🏛️ captain@brgy-santiago.gov.ph</p>
          <p className={styles.demoText}>📋 secretary@brgy-santiago.gov.ph</p>
          <p className={styles.demoText}>👤 kagawad@brgy-santiago.gov.ph</p>
          <p className={styles.demoSubtext}>Any password (4+ chars)</p>
        </div>

        <div className={styles.footer}>
          <p>
            <button
              type="button"
              onClick={() => router.push('/login/resident')}
              className={styles.link}
            >
              Resident login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
