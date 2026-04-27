"use client"

import Link from "next/link"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  FileText,
  AlertTriangle,
  Megaphone,
  Scale,
  ChevronRight,
  Clock,
  TrendingUp
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import {
  mockDocumentRequests,
  mockBlotterReports,
  mockAnnouncements,
  mockOrdinances,
  mockProjects
} from "@/lib/mock-data"

export default function AdminDashboard() {
  const { user } = useAuth()

  const pendingDocuments = mockDocumentRequests.filter(d => d.status === 'pending').length
  const pendingBlotters = mockBlotterReports.filter(b => b.status === 'pending').length
  const publishedAnnouncements = mockAnnouncements.filter(a => a.published).length
  const enactedOrdinances = mockOrdinances.filter(o => o.status === 'enacted').length

  const stats = [
    {
      title: "Total Residents",
      value: 3,
      description: "Registered residents",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      href: "/admin/residents"
    },
    {
      title: "Pending Documents",
      value: pendingDocuments,
      description: `${mockDocumentRequests.length} total requests`,
      icon: FileText,
      color: "text-emerald-600",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      href: "/admin/documents"
    },
    {
      title: "Pending Blotters",
      value: pendingBlotters,
      description: `${mockBlotterReports.length} total reports`,
      icon: AlertTriangle,
      color: "text-rose-600",
      bg: "bg-rose-100 dark:bg-rose-900/30",
      href: "/admin/blotter"
    },
    {
      title: "Announcements",
      value: publishedAnnouncements,
      description: "Published announcements",
      icon: Megaphone,
      color: "text-amber-600",
      bg: "bg-amber-100 dark:bg-amber-900/30",
      href: "/admin/announcements"
    }
  ]

  const recentActivity = [
    {
      id: 1,
      title: "New Document Request",
      description: "Juan Dela Cruz requested Certificate of Residency",
      timestamp: new Date().toISOString(),
      type: "document"
    },
    {
      id: 2,
      title: "Blotter Report Filed",
      description: "Animal complaint in Purok 1",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: "blotter"
    },
    {
      id: 3,
      title: "Document Approved",
      description: "Barangay Clearance for Juan Dela Cruz",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      type: "document"
    }
  ]

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.position || user?.fullName}. Here&apos;s what&apos;s happening in Barangay Santiago.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.href}>
            <Card className="hover:shadow-md transition-all cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest actions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(activity.timestamp), 'h:mm a')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/documents" className="block">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Process Document Requests
                </span>
                <Badge variant="secondary">{pendingDocuments}</Badge>
              </Button>
            </Link>
            <Link href="/admin/blotter" className="block">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Review Blotter Reports
                </span>
                <Badge variant="secondary">{pendingBlotters}</Badge>
              </Button>
            </Link>
            <Link href="/admin/announcements" className="block">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4" />
                  Post Announcement
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/admin/ordinances" className="block">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Scale className="w-4 h-4" />
                  Manage Ordinances
                </span>
                <Badge variant="secondary">{enactedOrdinances}</Badge>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Projects Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Ongoing Projects
          </CardTitle>
          <CardDescription>Track barangay development projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockProjects.filter(p => p.status === 'ongoing').map((project) => (
              <div key={project.id} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">{project.name}</h4>
                  <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                    {project.progress}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{project.description}</p>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Target: {format(new Date(project.targetCompletion), 'MMM d, yyyy')}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
