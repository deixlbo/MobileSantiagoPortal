export type UserRole = 'resident' | 'official';

export interface User {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  address?: string;
  phone?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Resident {
  id: string;
  email: string;
  fullName: string;
  address?: string;
  phone?: string;
  purok?: string;
  status: 'active' | 'inactive';
  registeredAt: Date;
}

export interface Announcement {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  author?: string;
}

export interface Document {
  id: string;
  title: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  completedAt?: Date;
  residentId?: string;
}

export interface BlotterEntry {
  id: string;
  title: string;
  description: string;
  location?: string;
  date: Date;
  severity: 'low' | 'medium' | 'high';
}
