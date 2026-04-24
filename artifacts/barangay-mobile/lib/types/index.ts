export type UserRole = 'resident' | 'official';

export interface User {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  address?: string;
  phone?: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  category: 'Event' | 'Maintenance' | 'Notice' | 'Urgent';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  author: string;
}

export interface Document {
  id: string;
  title: string;
  type: 'Barangay Clearance' | 'Barangay ID' | 'Residency' | 'Business Permit' | 'Other';
  status: 'pending' | 'approved' | 'rejected' | 'ready-for-pickup';
  requestedAt: Date;
  completedAt?: Date;
  notes?: string;
  residentId?: string;
}

export interface BlotterEntry {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  status: 'open' | 'investigation' | 'resolved' | 'closed';
  reporter: string;
  reportedAt: Date;
  updatedAt: Date;
  priority: 'low' | 'medium' | 'high';
  assignedOfficer?: string;
}

export interface Resident {
  id: string;
  email: string;
  fullName: string;
  address: string;
  phone: string;
  purok: string;
  status: 'active' | 'inactive';
  registeredAt: Date;
}

export interface ResidentRequest {
  id: string;
  residentId: string;
  type: 'document' | 'complaint' | 'inquiry' | 'other';
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
