'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Santiago Portal</h1>
          </div>
          <nav className="flex gap-4">
            <Link href="/web/auth/login" className="text-gray-600 hover:text-gray-900 font-medium">
              Resident Login
            </Link>
            <Link href="/web/auth/official-login" className="text-gray-600 hover:text-gray-900 font-medium">
              Official Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Barangay Santiago Portal
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Your gateway to accessing barangay services, announcements, documents, and important information all in one place.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Resident Card */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">For Residents</h3>
              <p className="text-gray-600 mb-6">Access announcements, documents, blotter records, and manage your profile.</p>
              <Link href="/web/auth/login" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                Resident Login
              </Link>
            </div>

            {/* Official Card */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">For Officials</h3>
              <p className="text-gray-600 mb-6">Manage residents, approve documents, and oversee barangay operations.</p>
              <Link href="/web/auth/official-login" className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition">
                Official Login
              </Link>
            </div>

            {/* Admin Card */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">For Administrators</h3>
              <p className="text-gray-600 mb-6">Manage system, users, content, and view comprehensive reports.</p>
              <Link href="/web/auth/admin-login" className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition">
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '📢', title: 'Announcements', desc: 'Stay updated with latest news' },
              { icon: '📄', title: 'Documents', desc: 'Access official documents' },
              { icon: '📋', title: 'Blotter Records', desc: 'View incident reports' },
              { icon: '👥', title: 'Resident Management', desc: 'Manage resident database' },
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Barangay Santiago. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
