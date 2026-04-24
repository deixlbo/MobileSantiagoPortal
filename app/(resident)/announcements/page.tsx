'use client';

import styles from './announcements.module.css';

const announcements = [
  {
    id: 1,
    title: 'Community Clean-Up Drive',
    content: 'Join us for a community clean-up on Saturday, April 13. Meeting point at the barangay plaza at 8:00 AM.',
    category: 'Event',
    priority: 'Medium',
    date: '2024-04-10',
    icon: '🧹',
  },
  {
    id: 2,
    title: 'Free Medical Mission',
    content: 'A free medical consultation and check-up for all residents. Bring your ID for registration.',
    category: 'Event',
    priority: 'High',
    date: '2024-04-08',
    icon: '⚕️',
  },
  {
    id: 3,
    title: 'Water Supply Interruption Notice',
    content: 'Water supply will be interrupted on April 15-16 for maintenance. Please prepare accordingly.',
    category: 'Notice',
    priority: 'High',
    date: '2024-04-05',
    icon: '💧',
  },
  {
    id: 4,
    title: 'Scholarship Program Now Open',
    content: 'Barangay scholarship application period is now open for deserving students. Deadline: April 30.',
    category: 'Opportunity',
    priority: 'Medium',
    date: '2024-04-01',
    icon: '🎓',
  },
];

export default function AnnouncementsPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Announcements</h1>
      <p className={styles.subtitle}>Stay updated with barangay news and events</p>

      <div className={styles.list}>
        {announcements.map((announcement) => (
          <div key={announcement.id} className={styles.card}>
            <div className={styles.header}>
              <div className={styles.icon}>{announcement.icon}</div>
              <div className={styles.info}>
                <h3 className={styles.cardTitle}>{announcement.title}</h3>
                <div className={styles.badges}>
                  <span className={styles.category}>{announcement.category}</span>
                  <span className={`${styles.priority} ${styles[`priority-${announcement.priority.toLowerCase()}`]}`}>
                    {announcement.priority}
                  </span>
                </div>
              </div>
            </div>
            <p className={styles.content}>{announcement.content}</p>
            <p className={styles.date}>{new Date(announcement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
