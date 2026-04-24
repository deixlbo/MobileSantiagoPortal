'use client';

import { useAuth } from '@/lib/context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Official Profile</h1>
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
        <p><strong>Name:</strong> {user.fullName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Position:</strong> Barangay Official</p>
        {user.address && <p><strong>Office Location:</strong> {user.address}</p>}
      </div>
    </div>
  );
}
