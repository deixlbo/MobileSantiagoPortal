'use client';

import { useAuth } from '@/lib/context/AuthContext';
import styles from './dashboard.module.css';

const mockAnnouncements = [
  { id: '1', title: 'Clean-Up Drive - April 13', category: 'Event', priority: 'medium' },
  { id: '2', title: 'Free Medical Mission', category: 'Event', priority: 'high' },
  { id: '3', title: 'Water Supply Interruption', category: 'Maintenance', priority: 'high' },
];

const mockStats = [
  { label: 'Pending Requests', value: '2', icon: '📄', color: '#FACC15' },
  { label: 'Active Cases', value: '1', icon: '📋', color: '#ef4444' },
  { label: 'Announcements', value: '5', icon: '📢', color: '#3b82f6' },
  { label: 'Programs', value: '4', icon: '📁', color: '#8b5cf6' },
];

export default function ResidentDashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Welcome back, {user.fullName.split(' ')[0]}!</h1>
        <p>Here&apos;s what&apos;s happening in your barangay</p>
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
        <h2 className={styles.sectionTitle}>Recent Announcements</h2>
        <div className={styles.announcementsList}>
          {mockAnnouncements.map((announcement) => (
            <div key={announcement.id} className={styles.announcementCard}>
              <div className={styles.announcementHeader}>
                <h3>{announcement.title}</h3>
                <span className={`${styles.badge} ${styles[`priority${announcement.priority}`]}`}>
                  {announcement.priority}
                </span>
              </div>
              <p className={styles.category}>{announcement.category}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.quickActions}>
          <button className={styles.actionBtn}>
            <span className={styles.actionIcon}>📄</span>
            <span>Request Document</span>
          </button>
          <button className={styles.actionBtn}>
            <span className={styles.actionIcon}>📧</span>
            <span>Send Feedback</span>
          </button>
          <button className={styles.actionBtn}>
            <span className={styles.actionIcon}>📞</span>
            <span>Contact Officials</span>
          </button>
        </div>
      </div>
    </div>
  );
}
