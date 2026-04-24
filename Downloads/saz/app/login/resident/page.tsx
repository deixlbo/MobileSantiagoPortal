'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import styles from '../login.module.css';

export default function ResidentLoginPage() {
  const router = useRouter();
  const { login, authError, clearError } = useAuth();
  const [email, setEmail] = useState('juan@email.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLoading(true);

    try {
      const success = await login(email, password, 'resident');
      if (success) {
        router.push('/(resident)/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Resident Login</h1>
        <p className={styles.subtitle}>
          Access your barangay resident account
        </p>

        <form onSubmit={handleLogin} className={styles.form}>
          {authError && (
            <div className={styles.errorAlert}>
              <span>⚠️ {authError}</span>
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juan@email.com"
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
          <p className={styles.demoTitle}>Demo Account</p>
          <p className={styles.demoText}>Email: juan@email.com</p>
          <p className={styles.demoText}>Any password (4+ chars)</p>
        </div>

        <div className={styles.footer}>
          <p>
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/register/resident')}
              className={styles.link}
            >
              Register here
            </button>
          </p>
          <p>
            <button
              type="button"
              onClick={() => router.push('/login/official')}
              className={styles.link}
            >
              Official login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
