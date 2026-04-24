'use client';

import { useAuth } from '@/lib/context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>My Profile</h1>
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
        <p><strong>Name:</strong> {user.fullName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
        {user.address && <p><strong>Address:</strong> {user.address}</p>}
      </div>
    </div>
  );
}
