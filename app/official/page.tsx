"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Users,
  FileText,
  AlertTriangle,
  Building2,
  ArrowRight,
  TrendingUp,
  Clock,
  Eye,
  Bell,
  X,
} from "lucide-react"

// Stats data
const stats = [
  { name: "Total Residents", value: "1,245", change: "+12", icon: Users, href: "/official/residents", color: "bg-emerald-100 text-emerald-600" },
  { name: "Pending Documents", value: "23", change: "-5", icon: FileText, href: "/official/documents", color: "bg-blue-100 text-blue-600" },
  { name: "Active Blotters", value: "8", change: "+2", icon: AlertTriangle, href: "/official/blotters", color: "bg-amber-100 text-amber-600" },
  { name: "Business Permits", value: "45", change: "+3", icon: Building2, href: "/official/business", color: "bg-purple-100 text-purple-600" },
]

// Recent activities
const recentActivities = [
  { id: 1, type: "document", action: "New document request", name: "Juan Dela Cruz", time: "5 minutes ago" },
  { id: 2, type: "blotter", action: "Blotter filed", name: "Maria Santos", time: "15 minutes ago" },
  { id: 3, type: "business", action: "Business permit approved", name: "Pedro Store", time: "1 hour ago" },
  { id: 4, type: "resident", action: "New resident registered", name: "Ana Reyes", time: "2 hours ago" },
]

// Pending approvals
const pendingApprovals = [
  { id: 1, type: "Document Request", name: "Certificate of Residency", requester: "Juan Dela Cruz", date: "April 28, 2026" },
  { id: 2, type: "Business Permit", name: "Sari-sari Store", requester: "Maria Santos", date: "April 27, 2026" },
  { id: 3, type: "Verification", name: "Account Verification", requester: "Pedro Reyes", date: "April 26, 2026" },
]

// Ongoing projects
const ongoingProjects = [
  { id: 1, title: "Road Improvement", progress: 65, location: "Purok 3" },
  { id: 2, title: "Community Watch", progress: 45, location: "All Puroks" },
]

// Mock notifications for document requests
const initialNotifications = [
  { id: 1, type: "document", message: "New clearance request from Maria Santos", time: "5 mins ago", read: false },
  { id: 2, type: "document", message: "New residency certificate request from Pedro Reyes", time: "15 mins ago", read: false },
  { id: 3, type: "document", message: "New indigency certificate request from Ana Cruz", time: "1 hour ago", read: false },
  { id: 4, type: "document", message: "New business permit request from Elena Store", time: "2 hours ago", read: false },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function OfficialDashboard() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(initialNotifications)
  const [showNotifications, setShowNotifications] = useState(false)
  
  const unreadCount = notifications.filter(n => !n.read).length

  const handleNotificationClick = (notification: typeof initialNotifications[0]) => {
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    )
    setShowNotifications(false)
    router.push("/official/documents")
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 md:space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-2 flex items-start justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Welcome, Juan</h1>
          <p className="text-sm text-slate-600">Barangay Santiago Official Dashboard</p>
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
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <Card className="transition-shadow hover:shadow-lg h-full">
              <CardContent className="p-3 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <div className={`p-2 md:p-3 rounded-xl ${stat.color} w-fit`}>
                    <stat.icon className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] md:text-sm text-muted-foreground truncate">{stat.name}</p>
                    <div className="flex items-center gap-1 md:gap-2">
                      <p className="text-lg md:text-2xl font-bold">{stat.value}</p>
                    </div>
                    <p className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-2 w-2 md:h-3 md:w-3 text-emerald-500" />
                      <span className="text-emerald-500">{stat.change}</span>
                      <span className="hidden sm:inline">from last month</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </motion.div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        {/* Pending Approvals */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="p-3 md:p-6 pb-2 md:pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base md:text-lg">Pending Approvals</CardTitle>
                  <CardDescription className="text-xs md:text-sm">Items requiring your action</CardDescription>
                </div>
                <Badge variant="secondary" className="text-[10px] md:text-xs">{pendingApprovals.length} pending</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
              <div className="space-y-2 md:space-y-3">
                {pendingApprovals.map((item) => (
                  <div 
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border p-2 md:p-3"
                  >
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-1 md:gap-2">
                        <Clock className="h-2.5 w-2.5 md:h-3 md:w-3 text-amber-500 flex-shrink-0" />
                        <span className="text-[10px] md:text-xs text-muted-foreground truncate">{item.type}</span>
                      </div>
                      <p className="font-medium text-sm md:text-base truncate">{item.name}</p>
                      <p className="text-[10px] md:text-sm text-muted-foreground truncate">
                        {item.requester} | {item.date}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button size="sm" variant="outline" className="h-7 md:h-8 text-xs px-2 md:px-3">
                        <Eye className="h-3 w-3 md:mr-1" />
                        <span className="hidden md:inline">View</span>
                      </Button>
                      <Button size="sm" className="h-7 md:h-8 text-xs px-2 md:px-3 bg-emerald-600 hover:bg-emerald-700">
                        <span className="hidden sm:inline">Approve</span>
                        <span className="sm:hidden">OK</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="p-3 md:p-6 pb-2 md:pb-4">
              <CardTitle className="text-base md:text-lg">Recent Activity</CardTitle>
              <CardDescription className="text-xs md:text-sm">Latest actions in the system</CardDescription>
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
              <div className="space-y-2 md:space-y-3">
                {recentActivities.map((activity) => (
                  <div 
                    key={activity.id}
                    className="flex items-start gap-2 md:gap-3 rounded-lg border p-2 md:p-3"
                  >
                    <div className="mt-0.5 rounded-full bg-primary/10 p-1 md:p-1.5 flex-shrink-0">
                      {activity.type === "document" && <FileText className="h-3 w-3 text-primary" />}
                      {activity.type === "blotter" && <AlertTriangle className="h-3 w-3 text-amber-500" />}
                      {activity.type === "business" && <Building2 className="h-3 w-3 text-emerald-500" />}
                      {activity.type === "resident" && <Users className="h-3 w-3 text-blue-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-medium truncate">{activity.action}</p>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">{activity.name}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Ongoing Projects */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="p-3 md:p-6 pb-2 md:pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base md:text-lg">Ongoing Projects</CardTitle>
              <CardDescription className="text-xs md:text-sm">Current community projects</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-xs h-7 md:h-8">
              <Link href="/official/projects">
                <span className="hidden sm:inline">View all</span>
                <ArrowRight className="h-3 w-3 sm:ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
            <div className="space-y-3 md:space-y-4">
              {ongoingProjects.map((project) => (
                <div key={project.id} className="space-y-1.5 md:space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm md:text-base">{project.title}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">{project.location}</p>
                    </div>
                    <span className="text-xs md:text-sm font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-1.5 md:h-2 overflow-hidden rounded-full bg-muted">
                    <div 
                      className="h-full bg-emerald-500 transition-all" 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
