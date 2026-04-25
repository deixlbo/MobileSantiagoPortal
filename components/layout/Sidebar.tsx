'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import styles from './Sidebar.module.css';

interface SidebarProps {
  userRole: 'resident' | 'official';
}

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/residents', label: 'Manage Residents', icon: '👥' },
  { href: '/admin/documents', label: 'Documents', icon: '📄' },
  { href: '/admin/announcements', label: 'Announcements', icon: '📢' },
  { href: '/admin/blotter', label: 'Blotter', icon: '📋' },
  { href: '/admin/profile', label: 'Profile', icon: '⚙️' },
];

const residentLinks = [
  { href: '/user/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/user/documents', label: 'Documents', icon: '📄' },
  { href: '/user/announcements', label: 'Announcements', icon: '📢' },
  { href: '/user/blotter', label: 'Blotter', icon: '📋' },
  { href: '/user/profile', label: 'Profile', icon: '⚙️' },
];

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const links = userRole === 'official' ? adminLinks : residentLinks;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>Barangay Santiago</h2>
        <p className={styles.subtitle}>{userRole === 'official' ? 'Admin Portal' : 'Resident Portal'}</p>
      </div>

      <nav className={styles.nav}>
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.icon}>{link.icon}</span>
              <span className={styles.label}>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        {user && (
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user.fullName}</p>
            <p className={styles.userRole}>{userRole === 'official' ? 'Administrator' : 'Resident'}</p>
          </div>
        )}
        <button onClick={logout} className={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </aside>
  );
}
