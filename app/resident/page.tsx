'use client';

import Link from 'next/link';

export default function ResidentDashboardPage() {
  const announcements = [
    { id: 1, title: 'Barangay Fiesta 2024', date: '2024-06-15', category: 'Event' },
    { id: 2, title: 'Road Maintenance Schedule', date: '2024-04-20', category: 'Infrastructure' },
    { id: 3, title: 'Health Camp Schedule', date: '2024-04-18', category: 'Health' },
  ];

  const documents = [
    { id: 1, title: 'Barangay Budget 2024', category: 'Financial' },
    { id: 2, title: 'Ordinance No. 45-2024', category: 'Legal' },
    { id: 3, title: 'Barangay Development Plan', category: 'Planning' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Resident!</h1>
        <p>Here&apos;s what&apos;s happening in your barangay today.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">New Announcements</p>
          <p className="text-3xl font-bold text-blue-600">3</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Available Documents</p>
          <p className="text-3xl font-bold text-green-600">8</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Recent Incidents</p>
          <p className="text-3xl font-bold text-orange-600">2</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">My Documents</p>
          <p className="text-3xl font-bold text-purple-600">5</p>
        </div>
      </div>

      {/* Recent Announcements */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Announcements</h2>
          <Link href="/web/resident/announcements" className="text-blue-600 font-medium hover:underline">
            View All →
          </Link>
        </div>
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <div>
                <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                <p className="text-sm text-gray-600">{announcement.date}</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {announcement.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Available Documents */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Available Documents</h2>
          <Link href="/web/resident/documents" className="text-blue-600 font-medium hover:underline">
            View All →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer">
              <p className="font-medium text-gray-900">{doc.title}</p>
              <p className="text-sm text-gray-600 mt-2">{doc.category}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
