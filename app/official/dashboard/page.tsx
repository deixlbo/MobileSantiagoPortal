"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"
import Link from "next/link"
import {
  Users,
  FileText,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
  Activity,
  ArrowUp,
  Bell,
  X,
} from "lucide-react"

import { useRouter } from "next/navigation"

const trendsData: any[] = []
const alertsData: any[] = []
const recentActivities: any[] = []

export default function AdminDashboard() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  
  const unreadCount = notifications.filter(n => !n.read).length

  const handleNotificationClick = (notification: any) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    )
    setShowNotifications(false)
    // Navigate to documents page
    router.push("/official/documents")
  }

  const [stats, setStats] = useState([
    { name: "Total Residents", value: "1,245", change: "+12%", icon: Users, color: "bg-emerald-100 text-emerald-600" },
    { name: "Pending Documents", value: "23", change: "-5%", icon: FileText, color: "bg-blue-100 text-blue-600" },
    { name: "Active Blotters", value: "8", change: "+2%", icon: AlertTriangle, color: "bg-amber-100 text-amber-600" },
    { name: "Verified Accounts", value: "987", change: "+18%", icon: CheckCircle2, color: "bg-green-100 text-green-600" },
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2">Welcome, Juan</h1>
            <p className="text-sm sm:text-base text-slate-600">Barangay Santiago Official Dashboard</p>
          </div>
          
          {/* Notification Bell */}
          <div className="relative">
            <Button 
              variant="outline" 
              size="icon" 
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
            
            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                <div className="p-3 border-b flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Document Requests</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowNotifications(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-slate-500 text-center">No notifications</p>
                  ) : (
                    notifications.map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`w-full text-left p-3 hover:bg-slate-50 border-b last:border-b-0 transition-colors ${
                          !notif.read ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <FileText className={`h-4 w-4 mt-0.5 ${!notif.read ? "text-blue-600" : "text-slate-400"}`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${!notif.read ? "font-medium" : ""}`}>{notif.message}</p>
                            <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                          </div>
                          {!notif.read && (
                            <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 sm:pt-6 sm:px-6">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-slate-600 truncate">{stat.name}</p>
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mt-1 sm:mt-2">{stat.value}</p>
                        <p className="text-xs text-emerald-600 mt-1 sm:mt-2 font-semibold">{stat.change}</p>
                      </div>
                      <div className={`p-2 sm:p-3 rounded-lg ${stat.color} shrink-0`}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Charts and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Trends Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Request Trends</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Requests, approvals, and declines over time</CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <ResponsiveContainer width="100%" height={250} className="sm:!h-[300px]">
                <LineChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="approvals" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="declines" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              {alertsData.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-2 sm:p-3 rounded-lg border-l-4 ${
                    alert.priority === "high"
                      ? "bg-red-50 border-red-500"
                      : "bg-yellow-50 border-yellow-500"
                  }`}
                >
                  <p className="text-xs font-semibold text-slate-900">{alert.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <div className="grid gap-4 sm:gap-6">
          <Card>
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 sm:gap-4 pb-3 sm:pb-4 border-b last:border-b-0"
                  >
                    <div className="p-1.5 sm:p-2 rounded-full bg-blue-100 shrink-0">
                      <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm sm:text-base">
                        <span className="truncate">{activity.user}</span> <span className="text-slate-600 font-normal">{activity.action}</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>


        </div>
      </div>
    </div>
  )
}
