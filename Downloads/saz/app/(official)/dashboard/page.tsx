'use client';

import { useAuth } from '@/lib/context/AuthContext';
import styles from './dashboard.module.css';

const mockStats = [
  { label: 'Pending Documents', value: '3', icon: '📄', color: '#FACC15' },
  { label: 'Active Cases', value: '4', icon: '📋', color: '#ef4444' },
  { label: 'Total Residents', value: '4,825', icon: '👥', color: '#3b82f6' },
  { label: 'Projects', value: '4', icon: '📁', color: '#8b5cf6' },
];

export default function OfficialDashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user.fullName}</p>
      </div>

      <div className={styles.stats}>
        {mockStats.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <div className={styles.statIcon}>{stat.icon}</div>
            <h3 className={styles.statLabel}>{stat.label}</h3>
            <p className={styles.statValue}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Administrative Actions</h2>
        <div className={styles.quickActions}>
          <button className={styles.actionBtn}>
            <span className={styles.actionIcon}>📄</span>
            <span>Process Documents</span>
          </button>
          <button className={styles.actionBtn}>
            <span className={styles.actionIcon}>👥</span>
            <span>Manage Residents</span>
          </button>
          <button className={styles.actionBtn}>
            <span className={styles.actionIcon}>📢</span>
            <span>Post Announcement</span>
          </button>
          <button className={styles.actionBtn}>
            <span className={styles.actionIcon}>📋</span>
            <span>View Blotter</span>
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Activity</h2>
        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <span className={styles.badge}>Document</span>
            <p>Barangay Clearance request approved</p>
            <small>2 hours ago</small>
          </div>
          <div className={styles.activityItem}>
            <span className={styles.badge}>Resident</span>
            <p>New resident registration completed</p>
            <small>5 hours ago</small>
          </div>
          <div className={styles.activityItem}>
            <span className={styles.badge}>Announcement</span>
            <p>Posted community clean-up announcement</p>
            <small>1 day ago</small>
          </div>
        </div>
      </div>
    </div>
  );
}
