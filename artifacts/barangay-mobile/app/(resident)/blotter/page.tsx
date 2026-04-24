'use client';

import styles from './blotter.module.css';

const blotterEntries = [
  {
    id: 'BLT-2024-001',
    incidentType: 'Lost Property',
    description: 'Lost mobile phone near barangay hall',
    dateReported: '2024-01-20',
    status: 'Reported',
    icon: '📱',
  },
  {
    id: 'BLT-2024-002',
    incidentType: 'Noise Complaint',
    description: 'Excessive noise from karaoke business',
    dateReported: '2024-01-18',
    status: 'Investigating',
    icon: '🔊',
  },
  {
    id: 'BLT-2024-003',
    incidentType: 'Dispute Resolution',
    description: 'Property boundary dispute between neighbors',
    dateReported: '2024-01-15',
    status: 'Mediation',
    icon: '⚖️',
  },
];

export default function BlotterPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Incident Reports</h1>
      <p className={styles.subtitle}>View and manage your incident reports</p>

      <button className={styles.reportBtn}>File New Report</button>

      <div className={styles.listContainer}>
        {blotterEntries.map((entry) => (
          <div key={entry.id} className={styles.card}>
            <div className={styles.header}>
              <div className={styles.icon}>{entry.icon}</div>
              <div className={styles.titleSection}>
                <h3 className={styles.cardTitle}>{entry.incidentType}</h3>
                <p className={styles.id}>{entry.id}</p>
              </div>
            </div>
            <p className={styles.description}>{entry.description}</p>
            <div className={styles.footer}>
              <span className={styles.date}>{new Date(entry.dateReported).toLocaleDateString()}</span>
              <span className={`${styles.status} ${styles[`status-${entry.status.toLowerCase()}`]}`}>
                {entry.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
