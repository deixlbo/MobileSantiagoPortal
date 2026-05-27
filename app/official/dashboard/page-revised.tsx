'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import Link from "next/link"
import {
  Users,
  FileText,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
  Activity,
  ArrowRight,
} from "lucide-react"

// Mock data
const dashboardStats = [
  {
    label: "Total Verified Residents",
    value: "342",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    label: "Pending Document Requests",
    value: "12",
    icon: FileText,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    label: "Active Blotter Cases",
    value: "5",
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    label: "Processed This Month",
    value: "89",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
]

const requestTrendData = [
  { date: "Apr 1", requests: 4 },
  { date: "Apr 5", requests: 8 },
  { date: "Apr 10", requests: 6 },
  { date: "Apr 15", requests: 12 },
  { date: "Apr 20", requests: 9 },
  { date: "Apr 25", requests: 15 },
  { date: "Apr 30", requests: 10 },
]

const documentTypeData = [
  { name: "Clearance", count: 45 },
  { name: "Residency", count: 38 },
  { name: "Indigency", count: 22 },
  { name: "Business", count: 15 },
  { name: "Other", count: 12 },
]

const recentActivities = [
  {
    id: 1,
    type: "approval",
    description: "Approved Barangay Clearance for Juan Dela Cruz",
    time: "2 hours ago",
    user: "Admin - Maria Santos",
  },
  {
    id: 2,
    type: "rejection",
    description: "Rejected Certificate of Indigency for Pedro Santos",
    time: "4 hours ago",
    user: "Admin - Maria Santos",
  },
  {
    id: 3,
    type: "registration",
    description: "New resident registration from Rose Garcia",
    time: "6 hours ago",
    user: "System",
  },
  {
    id: 4,
    type: "blotter",
    description: "New blotter report filed - Noise Complaint",
    time: "8 hours ago",
    user: "Resident - John Reyes",
  },
  {
    id: 5,
    type: "announcement",
    description: "New announcement posted - Community Health Drive",
    time: "1 day ago",
    user: "Admin - Maria Santos",
  },
]

const pendingRequests = [
  {
    id: 1,
    resident: "Juan Dela Cruz",
    document: "Barangay Clearance",
    date: "April 28, 2026",
    status: "pending",
  },
  {
    id: 2,
    resident: "Maria Santos",
    document: "Certificate of Residency",
    date: "April 27, 2026",
    status: "pending",
  },
  {
    id: 3,
    resident: "Pedro Gonzales",
    document: "Certificate of Indigency",
    date: "April 26, 2026",
    status: "pending",
  },
]

function getActivityBadge(type: string) {
  switch (type) {
    case "approval":
      return <Badge className="bg-emerald-100 text-emerald-700">Approved</Badge>
    case "rejection":
      return <Badge className="bg-red-100 text-red-700">Rejected</Badge>
    case "registration":
      return <Badge className="bg-blue-100 text-blue-700">Registration</Badge>
    case "blotter":
      return <Badge className="bg-amber-100 text-amber-700">Blotter</Badge>
    case "announcement":
      return <Badge className="bg-purple-100 text-purple-700">Announcement</Badge>
    default:
      return <Badge variant="secondary">Activity</Badge>
  }
}

export default function OfficialDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-6 border">
        <h2 className="text-2xl font-bold mb-2">Welcome to Barangay Santiago Admin</h2>
        <p className="text-muted-foreground">Manage residents, documents, and community services</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className={`rounded-lg ${stat.bgColor} p-3 w-fit mb-4`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Document Request Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Document Request Trends</CardTitle>
            <CardDescription>Requests processed over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={requestTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="#166534" 
                  strokeWidth={2}
                  dot={{ fill: "#166534", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Document Types Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Documents by Type</CardTitle>
            <CardDescription>Total processed requests</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={documentTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#166534" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests & Recent Activities */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Document Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Requests
              </CardTitle>
              <CardDescription>Awaiting approval</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/official/documents">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div 
                  key={request.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">{request.resident}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-muted-foreground">
                        {request.document}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {request.date}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Review
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activities
              </CardTitle>
              <CardDescription>Latest actions in the system</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/official/activities">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.slice(0, 5).map((activity) => (
                <div 
                  key={activity.id}
                  className="flex items-start gap-3 pb-3 border-b last:border-b-0 last:pb-0"
                >
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2">
                      {getActivityBadge(activity.type)}
                      <p className="font-medium text-sm">{activity.description}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{activity.time}</span>
                      <span>•</span>
                      <span>{activity.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Access common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start h-auto flex-col items-start p-4" asChild>
              <Link href="/official/documents">
                <FileText className="h-5 w-5 mb-2" />
                <span className="font-semibold">Approve Documents</span>
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-auto flex-col items-start p-4" asChild>
              <Link href="/official/residents">
                <Users className="h-5 w-5 mb-2" />
                <span className="font-semibold">Manage Residents</span>
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-auto flex-col items-start p-4" asChild>
              <Link href="/official/blotters">
                <AlertTriangle className="h-5 w-5 mb-2" />
                <span className="font-semibold">View Blotters</span>
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-auto flex-col items-start p-4" asChild>
              <Link href="/official/announcements">
                <TrendingUp className="h-5 w-5 mb-2" />
                <span className="font-semibold">Post Announcement</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
