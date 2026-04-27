'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import styles from './profile.module.css';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    router.push('/login/resident');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Profile</h1>

      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userInfo}>
            <h2 className={styles.name}>{user.fullName}</h2>
            <p className={styles.role}>Resident</p>
          </div>
        </div>

        <div className={styles.details}>
          <div className={styles.detail}>
            <label className={styles.label}>Email Address</label>
            <p className={styles.value}>{user.email}</p>
          </div>

          {user.phone && (
            <div className={styles.detail}>
              <label className={styles.label}>Phone Number</label>
              <p className={styles.value}>{user.phone}</p>
            </div>
          )}

          {user.address && (
            <div className={styles.detail}>
              <label className={styles.label}>Address</label>
              <p className={styles.value}>{user.address}</p>
            </div>
          )}

          <div className={styles.detail}>
            <label className={styles.label}>Account Status</label>
            <p className={styles.status}>Active</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.editBtn}>Edit Profile</button>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Account Settings</h3>
        <div className={styles.settingItem}>
          <span>Change Password</span>
          <button className={styles.settingBtn}>Update</button>
        </div>
        <div className={styles.settingItem}>
          <span>Notification Preferences</span>
          <button className={styles.settingBtn}>Configure</button>
        </div>
        <div className={styles.settingItem}>
          <span>Privacy Settings</span>
          <button className={styles.settingBtn}>Manage</button>
        </div>
      </div>
    </div>
  );
}
