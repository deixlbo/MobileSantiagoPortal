'use client';

import styles from './documents.module.css';

const documents = [
  { id: 1, type: 'Barangay Clearance', status: 'Approved', date: '2024-01-15', icon: '✅' },
  { id: 2, type: 'Residency Certificate', status: 'Processing', date: '2024-01-10', icon: '⏳' },
  { id: 3, type: 'Good Moral Character', status: 'Pending', date: '2024-01-05', icon: '📋' },
];

const documentTypes = [
  { name: 'Barangay Clearance', icon: '📄', description: 'Official clearance document' },
  { name: 'Residency Certificate', icon: '🏠', description: 'Proof of residence' },
  { name: 'Good Moral Character', icon: '⭐', description: 'Character reference' },
  { name: 'Business Permit', icon: '🏪', description: 'For business purposes' },
  { name: 'Travel Authority', icon: '✈️', description: 'Travel authorization' },
  { name: 'Special Request', icon: '📝', description: 'Custom document request' },
];

export default function DocumentsPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Document Requests</h1>
      <p className={styles.subtitle}>Request and track your barangay documents</p>

      {/* My Requests */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>My Requests</h2>
        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <th>Document Type</th>
                <th>Status</th>
                <th>Requested</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.type}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[`status-${doc.status.toLowerCase()}`]}`}>
                      {doc.icon} {doc.status}
                    </span>
                  </td>
                  <td>{new Date(doc.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Request New Document */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Request New Document</h2>
        <div className={styles.grid}>
          {documentTypes.map((doc, i) => (
            <div key={i} className={styles.documentCard}>
              <div className={styles.documentIcon}>{doc.icon}</div>
              <h3 className={styles.documentName}>{doc.name}</h3>
              <p className={styles.documentDesc}>{doc.description}</p>
              <button className={styles.requestBtn}>Request</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
