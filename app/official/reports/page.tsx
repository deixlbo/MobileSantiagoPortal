"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { exportToXLSXMultiSheet } from "@/lib/export-utils"
import {
  BarChart3,
  Download,
  Filter,
  Calendar,
  Users,
  FileText,
  AlertTriangle,
} from "lucide-react"

const populationData: any[] = []
const requestsTrendData: any[] = []
const blotterStatusData: any[] = []
const monthlyRequestsData: any[] = []
const reportSummary: any[] = []

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

// Export function for reports
const handleExportReport = () => {
  const sheets = [
    {
      name: 'Population Summary',
      data: populationData.map(p => ({
        'Purok': p.purok,
        'Verified Residents': p.verified,
        'Unverified Residents': p.unverified,
        'Total': p.verified + p.unverified
      }))
    },
    {
      name: 'Weekly Requests',
      data: requestsTrendData.map(r => ({
        'Week': r.week,
        'Barangay Clearance': r.clearance,
        'Certificate of Residency': r.residency,
        'Certificate of Indigency': r.indigency,
        'Business Clearance': r.business
      }))
    },
    {
      name: 'Monthly Requests',
      data: monthlyRequestsData.map(m => ({
        'Month': m.month,
        'Approved': m.approved,
        'Declined': m.declined,
        'Pending': m.pending
      }))
    },
    {
      name: 'Blotter Status',
      data: blotterStatusData.map(b => ({
        'Status': b.name,
        'Count': b.value
      }))
    }
  ]

  const today = new Date().toISOString().split('T')[0]
  exportToXLSXMultiSheet(sheets, `Reports_Analytics_${today}.xlsx`)
}

export default function ReportsPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">System-wide insights and statistics</p>
        </div>
        <Button className="w-full md:w-auto gap-2" onClick={handleExportReport}>
          <Download className="h-4 w-4" />
          Export
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportSummary.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-2">{stat.subtitle}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Population by Purok */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Population by Purok</CardTitle>
              <CardDescription>Verified and unverified residents</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={populationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="purok" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="verified" fill="#10b981" name="Verified" />
                  <Bar dataKey="unverified" fill="#f59e0b" name="Unverified" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Requests Trend */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Monthly Requests Trend</CardTitle>
              <CardDescription>Request status distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyRequestsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} name="Approved" />
                  <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} name="Pending" />
                  <Line type="monotone" dataKey="declined" stroke="#ef4444" strokeWidth={2} name="Declined" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Requests by Type */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Weekly Requests by Type</CardTitle>
              <CardDescription>Document request breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={requestsTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="clearance" fill="#3b82f6" name="Barangay Clearance" />
                  <Bar dataKey="residency" fill="#10b981" name="Residency Cert" />
                  <Bar dataKey="indigency" fill="#f59e0b" name="Indigency Cert" />
                  <Bar dataKey="business" fill="#8b5cf6" name="Business Permit" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Blotter Status Distribution */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Blotter Status</CardTitle>
              <CardDescription>Case resolution breakdown</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={blotterStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {blotterStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Key Performance Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Avg Processing Time</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">3.2 days</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Approval Rate</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">89%</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Pending Cases</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">23</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">1,045</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
