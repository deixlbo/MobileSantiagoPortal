"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
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
  ArrowDown,
  Calendar,
  Bell,
  RefreshCw,
  ChevronRight,
  MapPin,
  UserCheck,
  FileCheck,
  Scale,
  Sparkles,
} from "lucide-react"

// Enhanced mock data
const trendsData = [
  { date: "Week 1", requests: 45, approvals: 38, rejections: 4, pending: 3 },
  { date: "Week 2", requests: 52, approvals: 44, rejections: 5, pending: 3 },
  { date: "Week 3", requests: 48, approvals: 41, rejections: 3, pending: 4 },
  { date: "Week 4", requests: 61, approvals: 52, rejections: 6, pending: 3 },
]

const documentTypeData = [
  { name: "Clearance", value: 145, fill: "#10b981" },
  { name: "Residency", value: 89, fill: "#3b82f6" },
  { name: "Indigency", value: 67, fill: "#f59e0b" },
  { name: "Business", value: 42, fill: "#8b5cf6" },
]

const purokData = [
  { purok: "Purok 1", population: 285, verified: 248 },
  { purok: "Purok 2", population: 243, verified: 215 },
  { purok: "Purok 3", population: 212, verified: 190 },
  { purok: "Purok 4", population: 198, verified: 180 },
  { purok: "Purok 5", population: 252, verified: 220 },
  { purok: "Purok 6", population: 178, verified: 156 },
]

const alertsData = [
  { id: 1, type: "overdue", message: "5 document requests overdue (>7 days)", priority: "high", action: "Review Now" },
  { id: 2, type: "pending", message: "12 pending requests awaiting review", priority: "medium", action: "Process" },
  { id: 3, type: "blotter", message: "3 unresolved blotter cases need attention", priority: "high", action: "View Cases" },
  { id: 4, type: "verification", message: "8 residents pending verification", priority: "medium", action: "Verify" },
]

const recentActivities = [
  { id: 1, user: "Maria Santos", action: "submitted document request", type: "request", time: "5 mins ago", avatar: "MS" },
  { id: 2, user: "Admin", action: "approved clearance for Juan Dela Cruz", type: "approval", time: "15 mins ago", avatar: "AD" },
  { id: 3, user: "Pedro Reyes", action: "filed blotter report #BLT-2024-047", type: "blotter", time: "1 hour ago", avatar: "PR" },
  { id: 4, user: "Admin", action: "verified resident account", type: "verification", time: "2 hours ago", avatar: "AD" },
  { id: 5, user: "Elena Store", action: "applied for business permit", type: "business", time: "3 hours ago", avatar: "ES" },
  { id: 6, user: "Roberto Cruz", action: "updated profile information", type: "profile", time: "4 hours ago", avatar: "RC" },
]

const quickActions = [
  { label: "New Document Request", icon: FileText, href: "/official/documents", color: "bg-emerald-500" },
  { label: "File Blotter", icon: Scale, href: "/official/blotters", color: "bg-amber-500" },
  { label: "Verify Resident", icon: UserCheck, href: "/official/residents", color: "bg-blue-500" },
  { label: "View Reports", icon: TrendingUp, href: "/official/reports", color: "bg-purple-500" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => {
      clearTimeout(timer)
      clearInterval(timeInterval)
    }
  }, [])

  const stats = [
    { name: "Total Residents", value: "1,368", change: "+12%", trend: "up", icon: Users, color: "from-emerald-500 to-teal-500", bgColor: "bg-emerald-500/10" },
    { name: "Pending Documents", value: "23", change: "-5%", trend: "down", icon: FileText, color: "from-blue-500 to-cyan-500", bgColor: "bg-blue-500/10" },
    { name: "Active Blotters", value: "8", change: "+2", trend: "up", icon: AlertTriangle, color: "from-amber-500 to-orange-500", bgColor: "bg-amber-500/10" },
    { name: "Verified Accounts", value: "1,209", change: "+18%", trend: "up", icon: CheckCircle2, color: "from-green-500 to-emerald-500", bgColor: "bg-green-500/10" },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <p className="text-slate-400 text-sm sm:text-base">Welcome back! Here&apos;s what&apos;s happening in Barangay Santiago</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-300">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <Button variant="outline" size="icon" className="border-slate-700 bg-slate-800/50 hover:bg-slate-700">
              <Bell className="w-4 h-4 text-slate-400" />
            </Button>
            <Button variant="outline" size="icon" className="border-slate-700 bg-slate-800/50 hover:bg-slate-700">
              <RefreshCw className="w-4 h-4 text-slate-400" />
            </Button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer group"
              >
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{action.label}</p>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Key Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02, y: -4 }}
                className="relative overflow-hidden"
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-slate-400 font-medium">{stat.name}</p>
                        <p className="text-2xl sm:text-3xl font-bold text-white mt-2">{stat.value}</p>
                        <div className={`flex items-center gap-1 mt-2 ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {stat.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                          <span className="text-xs font-semibold">{stat.change}</span>
                          <span className="text-xs text-slate-500">vs last month</span>
                        </div>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} style={{ color: stat.color.includes('emerald') ? '#10b981' : stat.color.includes('blue') ? '#3b82f6' : stat.color.includes('amber') ? '#f59e0b' : '#22c55e' }} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={75 + idx * 5} className="h-1 bg-slate-700" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">Request Trends</CardTitle>
                    <CardDescription className="text-slate-400">Weekly document request analytics</CardDescription>
                  </div>
                  <Tabs defaultValue="area" className="w-auto">
                    <TabsList className="bg-slate-700/50">
                      <TabsTrigger value="area" className="text-xs data-[state=active]:bg-emerald-500">Area</TabsTrigger>
                      <TabsTrigger value="bar" className="text-xs data-[state=active]:bg-emerald-500">Bar</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendsData}>
                    <defs>
                      <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorApprovals" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                      labelStyle={{ color: '#f1f5f9' }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="requests" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRequests)" strokeWidth={2} />
                    <Area type="monotone" dataKey="approvals" stroke="#10b981" fillOpacity={1} fill="url(#colorApprovals)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Document Types Pie Chart */}
          <motion.div variants={itemVariants}>
            <Card className="bg-slate-800/50 border-slate-700 h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Document Types</CardTitle>
                <CardDescription className="text-slate-400">Distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={documentTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {documentTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {documentTypeData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                      <span className="text-xs text-slate-400">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alerts */}
          <motion.div variants={itemVariants}>
            <Card className="bg-slate-800/50 border-slate-700 h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">Alerts</CardTitle>
                  <Badge variant="outline" className="border-red-500/50 text-red-400">
                    {alertsData.filter(a => a.priority === 'high').length} urgent
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {alertsData.map((alert) => (
                  <motion.div
                    key={alert.id}
                    whileHover={{ x: 4 }}
                    className={`p-3 rounded-lg border-l-4 cursor-pointer transition-colors ${
                      alert.priority === "high"
                        ? "bg-red-500/10 border-red-500 hover:bg-red-500/20"
                        : "bg-amber-500/10 border-amber-500 hover:bg-amber-500/20"
                    }`}
                  >
                    <p className="text-xs text-slate-300 font-medium">{alert.message}</p>
                    <Button variant="ghost" size="sm" className="mt-2 h-7 text-xs text-slate-400 hover:text-white p-0">
                      {alert.action} <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Population by Purok */}
          <motion.div variants={itemVariants}>
            <Card className="bg-slate-800/50 border-slate-700 h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Population by Purok</CardTitle>
                <CardDescription className="text-slate-400">Resident distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={purokData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" stroke="#64748b" fontSize={11} />
                    <YAxis dataKey="purok" type="category" stroke="#64748b" fontSize={11} width={60} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    />
                    <Bar dataKey="population" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="verified" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activities */}
          <motion.div variants={itemVariants}>
            <Card className="bg-slate-800/50 border-slate-700 h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">Recent Activity</CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs text-slate-400 hover:text-white">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
                  {recentActivities.map((activity, idx) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-3 pb-3 border-b border-slate-700/50 last:border-0"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {activity.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-300">
                          <span className="font-medium text-white">{activity.user}</span>{' '}
                          {activity.action}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
