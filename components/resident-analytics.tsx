"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts"
import { Users, FileText, Calendar, TrendingUp, Download } from "lucide-react"

const monthlyData = [
  { month: "Jan", requests: 240, completed: 220 },
  { month: "Feb", requests: 290, completed: 250 },
  { month: "Mar", requests: 340, completed: 310 },
  { month: "Apr", requests: 290, completed: 270 },
  { month: "May", requests: 420, completed: 400 },
  { month: "Jun", requests: 480, completed: 450 }
]

const serviceData = [
  { name: "Barangay Clearance", value: 45, percentage: 35 },
  { name: "Certificate of Residency", value: 35, percentage: 27 },
  { name: "Blotter Report", value: 20, percentage: 15 },
  { name: "Business Permit", value: 18, percentage: 14 },
  { name: "Certificate of Indigency", value: 12, percentage: 9 }
]

const ageGroupData = [
  { group: "18-25", count: 120 },
  { group: "26-35", count: 280 },
  { group: "36-45", count: 320 },
  { group: "46-55", count: 240 },
  { group: "55+", count: 180 }
]

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]

export function ResidentAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month")

  const stats = [
    { title: "Total Requests", value: "1,248", change: "+12.5%", icon: FileText, color: "bg-blue-50" },
    { title: "Active Residents", value: "2,340", change: "+8.2%", icon: Users, color: "bg-green-50" },
    { title: "Avg. Response Time", value: "2.5 days", change: "-15%", icon: Calendar, color: "bg-orange-50" },
    { title: "Satisfaction Rate", value: "94.8%", change: "+3.1%", icon: TrendingUp, color: "bg-purple-50" }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Resident Analytics</h2>
          <p className="text-muted-foreground">Community insights and statistics</p>
        </div>
        <Button variant="outline" className="rounded-lg">
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {(["week", "month", "year"] as const).map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? "default" : "outline"}
            onClick={() => setTimeRange(range)}
            className="rounded-lg capitalize"
            size="sm"
          >
            {range}
          </Button>
        ))}
      </div>

      {/* Key Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`${stat.color} rounded-2xl border border-slate-200/70`}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs font-semibold text-green-600">{stat.change}</span>
                </div>
                <p className="text-xs font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Requests Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="rounded-2xl border border-slate-200/70">
            <CardHeader>
              <CardTitle>Request Trends</CardTitle>
              <CardDescription>Requests submitted vs completed</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="requests" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRequests)" />
                  <Area type="monotone" dataKey="completed" stroke="#10b981" fillOpacity={1} fill="url(#colorCompleted)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Service Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="rounded-2xl border border-slate-200/70">
            <CardHeader>
              <CardTitle>Service Distribution</CardTitle>
              <CardDescription>Breakdown by service type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resident Demographics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="rounded-2xl border border-slate-200/70">
            <CardHeader>
              <CardTitle>Resident Demographics</CardTitle>
              <CardDescription>Age group distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ageGroupData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="group" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Service Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="rounded-2xl border border-slate-200/70">
            <CardHeader>
              <CardTitle>Service Performance</CardTitle>
              <CardDescription>Request completion rate by service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {serviceData.map((service, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">{service.name}</p>
                    <span className="text-xs font-semibold text-muted-foreground">{service.percentage}%</span>
                  </div>
                  <Progress value={service.percentage * 10} className="h-2 rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
