'use client';

import Link from 'next/link';

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Total Users', value: '1,247', icon: '👥', color: 'bg-blue-100', textColor: 'text-blue-600' },
    { label: 'Pending Approvals', value: '23', icon: '⏳', color: 'bg-yellow-100', textColor: 'text-yellow-600' },
    { label: 'Documents', value: '456', icon: '📄', color: 'bg-green-100', textColor: 'text-green-600' },
    { label: 'Blotter Records', value: '89', icon: '📋', color: 'bg-red-100', textColor: 'text-red-600' },
  ];

  const recentActivities = [
    { user: 'Juan Dela Cruz', action: 'Registered as resident', time: '2 hours ago' },
    { user: 'Maria Santos', action: 'Updated profile', time: '4 hours ago' },
    { user: 'Admin', action: 'Approved document', time: '1 day ago' },
    { user: 'Official', action: 'Posted announcement', time: '1 day ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6">
            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-2xl mb-4`}>
              {stat.icon}
            </div>
            <h3 className="text-gray-600 text-sm font-medium">{stat.label}</h3>
            <p className={`text-3xl font-bold ${stat.textColor} mt-2`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Actions Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/web/admin/users" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-xl mb-4">
            👥
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Manage Users</h3>
          <p className="text-gray-600 text-sm mb-4">View and manage all system users</p>
          <span className="text-blue-600 font-medium text-sm">View Users →</span>
        </Link>

        <Link href="/web/admin/documents" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-xl mb-4">
            📄
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Approve Documents</h3>
          <p className="text-gray-600 text-sm mb-4">Review and approve pending documents</p>
          <span className="text-green-600 font-medium text-sm">Pending: 23</span>
        </Link>

        <Link href="/web/admin/announcements" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center text-xl mb-4">
            📢
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Announcements</h3>
          <p className="text-gray-600 text-sm mb-4">Create and manage announcements</p>
          <span className="text-yellow-600 font-medium text-sm">Create New →</span>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivities.map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
              <div>
                <p className="font-medium text-gray-900">{activity.user}</p>
                <p className="text-sm text-gray-600">{activity.action}</p>
              </div>
              <p className="text-sm text-gray-500">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">System Health</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 font-medium">Database Status</span>
              <span className="text-green-600 font-medium">Healthy</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-600 w-full"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 font-medium">Server Load</span>
              <span className="text-green-600 font-medium">Normal</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-600 w-3/4"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 font-medium">Storage</span>
              <span className="text-yellow-600 font-medium">75%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-600 w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
