'use client';

import Link from 'next/link';

export default function OfficialDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome, Official!</h1>
        <p>Manage your barangay operations and oversight responsibilities.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Total Residents</p>
          <p className="text-3xl font-bold text-green-600">1,247</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Pending Documents</p>
          <p className="text-3xl font-bold text-orange-600">12</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Active Projects</p>
          <p className="text-3xl font-bold text-blue-600">5</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Recent Incidents</p>
          <p className="text-3xl font-bold text-red-600">8</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/web/official/residents" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-xl mb-4">
            👥
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Manage Residents</h3>
          <p className="text-gray-600 text-sm mb-4">View and manage resident database</p>
          <span className="text-green-600 font-medium text-sm">View Residents →</span>
        </Link>

        <Link href="/web/official/documents" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-xl mb-4">
            📄
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Documents</h3>
          <p className="text-gray-600 text-sm mb-4">Manage barangay documents</p>
          <span className="text-blue-600 font-medium text-sm">View Documents →</span>
        </Link>

        <Link href="/web/official/blotter" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center text-xl mb-4">
            📋
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Blotter Records</h3>
          <p className="text-gray-600 text-sm mb-4">View incident reports</p>
          <span className="text-red-600 font-medium text-sm">View Incidents →</span>
        </Link>
      </div>
    </div>
  );
}
