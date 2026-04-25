'use client';

import { useState } from 'react';

export default function AdminUsersPage() {
  const [users] = useState([
    { id: 1, name: 'Juan Dela Cruz', email: 'juan@email.com', type: 'Resident', status: 'Active', joinDate: '2024-01-15' },
    { id: 2, name: 'Maria Santos', email: 'maria@email.com', type: 'Resident', status: 'Pending', joinDate: '2024-04-20' },
    { id: 3, name: 'Hon. Rolando Borja', email: 'mayor@santiago.gov.ph', type: 'Official', status: 'Active', joinDate: '2024-01-01' },
    { id: 4, name: 'Barangay Secretary', email: 'secretary@santiago.gov.ph', type: 'Official', status: 'Active', joinDate: '2024-01-05' },
    { id: 5, name: 'System Admin', email: 'admin@santiago.gov.ph', type: 'Admin', status: 'Active', joinDate: '2024-01-01' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Admin':
        return 'text-purple-600';
      case 'Official':
        return 'text-green-600';
      case 'Resident':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-600 mt-2">View and manage all system users</p>
        </div>
        <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition">
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Join Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`font-medium ${getTypeColor(user.type)}`}>{user.type}</span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.joinDate}</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 font-medium">Edit</button>
                    <button className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Total Users</p>
          <p className="text-3xl font-bold text-gray-900">5</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Active</p>
          <p className="text-3xl font-bold text-green-600">4</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">1</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Administrators</p>
          <p className="text-3xl font-bold text-purple-600">1</p>
        </div>
      </div>
    </div>
  );
}
