'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import styles from './layout.module.css';

export default function OfficialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'official' && user.role !== 'admin'))) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user || (user.role !== 'official' && user.role !== 'admin')) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar userRole="official" />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
