import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-purple-900 text-white shadow-lg">
        <div className="p-6 border-b border-purple-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-700 flex items-center justify-center font-bold">
              A
            </div>
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
        </div>
        <nav className="p-6 space-y-2">
          <Link href="/admin" className="block px-4 py-3 rounded-lg hover:bg-purple-800 transition font-medium">
            Dashboard
          </Link>
          <Link href="/admin/users" className="block px-4 py-3 rounded-lg hover:bg-purple-800 transition font-medium">
            Manage Users
          </Link>
          <Link href="/admin/documents" className="block px-4 py-3 rounded-lg hover:bg-purple-800 transition font-medium">
            Approve Documents
          </Link>
          <Link href="/admin/announcements" className="block px-4 py-3 rounded-lg hover:bg-purple-800 transition font-medium">
            Announcements
          </Link>
          <Link href="/admin/blotter" className="block px-4 py-3 rounded-lg hover:bg-purple-800 transition font-medium">
            Blotter Records
          </Link>
          <Link href="/admin/settings" className="block px-4 py-3 rounded-lg hover:bg-purple-800 transition font-medium">
            Settings
          </Link>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-purple-800">
          <Link href="/" className="block px-4 py-2 bg-purple-800 rounded-lg hover:bg-purple-700 transition text-center font-medium">
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Administrator</span>
              <button className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
