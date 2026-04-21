import React from 'react';
import { MapPin, Bell, Calendar, AlertCircle, Users, FileText } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Mobile Santiago Portal</h1>
          </div>
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome to Santiago</h2>
          <p className="text-blue-100">Your portal for city services and information</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Services</p>
                <p className="text-3xl font-bold text-gray-900">24</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Requests</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Community Events</p>
                <p className="text-3xl font-bold text-gray-900">8</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Residents</p>
                <p className="text-3xl font-bold text-gray-900">5.2K</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Featured Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Services */}
          <div className="bg-white rounded-lg shadow p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">City Services</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">License & Permits</span>
              </li>
              <li className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">Bill Payment</span>
              </li>
              <li className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">Request Support</span>
              </li>
              <li className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">Report Issue</span>
              </li>
            </ul>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-lg shadow p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Latest Updates</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-600 pl-4 py-2">
                <p className="font-semibold text-gray-900">System Maintenance</p>
                <p className="text-sm text-gray-500">This weekend 2:00 AM - 6:00 AM</p>
              </div>
              <div className="border-l-4 border-green-600 pl-4 py-2">
                <p className="font-semibold text-gray-900">New Service Available</p>
                <p className="text-sm text-gray-500">Online appointment booking now live</p>
              </div>
              <div className="border-l-4 border-orange-600 pl-4 py-2">
                <p className="font-semibold text-gray-900">Schedule Change</p>
                <p className="text-sm text-gray-500">City hall closed Monday for holiday</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Get Started</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
              Access Services
            </button>
            <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition">
              Learn More
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="text-gray-400 space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About Santiago</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="text-gray-400 space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">City Services</a></li>
                <li><a href="#" className="hover:text-white">Permits</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="text-gray-400 space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Accessibility</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow</h4>
              <ul className="text-gray-400 space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">Facebook</a></li>
                <li><a href="#" className="hover:text-white">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-gray-400 text-sm">
              © 2024 Mobile Santiago Portal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
