'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useColors } from '@/lib/context/ThemeContext';
import type { UserRole } from '@/lib/types';
import styles from './sidebar.module.css';

interface SidebarProps {
  userRole: UserRole;
}

const residentNav = [
  { label: 'Dashboard', href: '/resident/dashboard', icon: '📊' },
  { label: 'Announcements', href: '/resident/announcements', icon: '📢' },
  { label: 'Documents', href: '/resident/documents', icon: '📄' },
  { label: 'Blotter', href: '/resident/blotter', icon: '📋' },
  { label: 'Profile', href: '/resident/profile', icon: '👤' },
];

const officialNav = [
  { label: 'Dashboard', href: '/official/dashboard', icon: '📊' },
  { label: 'Residents', href: '/official/residents', icon: '👥' },
  { label: 'Announcements', href: '/official/announcements', icon: '📢' },
  { label: 'Documents', href: '/official/documents', icon: '📄' },
  { label: 'Blotter', href: '/official/blotter', icon: '📋' },
  { label: 'Profile', href: '/official/profile', icon: '👤' },
];

export default function Sidebar({ userRole }: SidebarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const colors = useColors();

  const navItems = userRole === 'resident' ? residentNav : officialNav;

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <aside
      className={styles.sidebar}
      style={{
        backgroundColor: colors.sidebar,
        color: colors.sidebarForeground,
      }}
    >
      <div className={styles.header}>
        <div className={styles.logo}>🏛️</div>
        <h1 className={styles.title}>Barangay Santiago</h1>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={styles.navItem}
            style={{
              color: colors.sidebarForeground,
            }}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>{user?.fullName?.charAt(0)}</div>
          <div className={styles.userDetails}>
            <p className={styles.userName}>{user?.fullName}</p>
            <p className={styles.userRole}>
              {userRole === 'resident' ? 'Resident' : 'Official'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className={styles.logoutBtn}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: colors.sidebarForeground,
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
