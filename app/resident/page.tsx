"use client"

import { useMemo } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, AlertTriangle, Megaphone, Calendar, ChevronRight, Clock } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { mockDocumentRequests, mockBlotterReports, mockAnnouncements } from "@/lib/mock-data"

export default function ResidentDashboard() {
  const { user } = useAuth()
  const residentId = user?.residentId || ""

  // Filter data for this resident only
  const myDocuments = useMemo(() => 
    mockDocumentRequests.filter(d => d.residentId === residentId),
    [residentId]
  )
  
  const myBlotters = useMemo(() => 
    mockBlotterReports.filter(b => b.residentId === residentId),
    [residentId]
  )

  const pendingDocuments = myDocuments.filter(d => d.status === 'pending' || d.status === 'processing').length
  const pendingBlotters = myBlotters.filter(b => b.status !== 'resolved').length

  const stats = [
    {
      title: "My Documents",
      value: myDocuments.length,
      description: `${pendingDocuments} pending`,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      href: "/resident/documents"
    },
    {
      title: "My Incidents",
      value: myBlotters.length,
      description: `${pendingBlotters} active`,
      icon: AlertTriangle,
      color: "text-rose-600",
      bg: "bg-rose-100 dark:bg-rose-900/30",
      href: "/resident/blotter"
    },
    {
      title: "Announcements",
      value: mockAnnouncements.filter(a => a.published).length,
      description: "in the community",
      icon: Megaphone,
      color: "text-amber-600",
      bg: "bg-amber-100 dark:bg-amber-900/30",
      href: "/#announcements"
    }
  ]

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Welcome, {user?.fullName?.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s your summary of interactions with Barangay Santiago.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Request documents or file reports</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/resident/documents">
            <Button className="gap-2">
              <FileText className="w-4 h-4" />
              Request Document
            </Button>
          </Link>
          <Link href="/resident/blotter">
            <Button variant="destructive" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              Report Incident
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Activity Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Documents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Recent Document Requests
              </CardTitle>
              <CardDescription>Your latest document requests</CardDescription>
            </div>
            <Link href="/resident/documents">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {myDocuments.length > 0 ? (
              <div className="space-y-3">
                {myDocuments.slice(0, 3).map((doc) => (
                  <div 
                    key={doc.id} 
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{doc.documentType}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {format(new Date(doc.createdAt), 'MMM d, yyyy')}
                      </div>
                    </div>
                    <Badge 
                      variant={
                        doc.status === 'approved' ? 'default' : 
                        doc.status === 'pending' ? 'secondary' : 
                        doc.status === 'processing' ? 'outline' : 'destructive'
                      }
                      className="ml-2 shrink-0"
                    >
                      {doc.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No document requests yet</p>
                <Link href="/resident/documents">
                  <Button variant="link" size="sm" className="mt-2">
                    Request your first document
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Blotters */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                My Incident Reports
              </CardTitle>
              <CardDescription>Your filed blotter reports</CardDescription>
            </div>
            <Link href="/resident/blotter">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {myBlotters.length > 0 ? (
              <div className="space-y-3">
                {myBlotters.slice(0, 3).map((blotter) => (
                  <div 
                    key={blotter.id} 
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{blotter.incidentType}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(blotter.incidentDate), 'MMM d, yyyy')}
                      </div>
                    </div>
                    <Badge 
                      variant={
                        blotter.status === 'resolved' ? 'default' : 
                        blotter.status === 'pending' ? 'secondary' : 
                        blotter.status === 'investigating' ? 'outline' : 'destructive'
                      }
                      className="ml-2 shrink-0"
                    >
                      {blotter.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No incident reports filed</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Latest Announcements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-amber-600" />
            Latest Announcements
          </CardTitle>
          <CardDescription>Stay informed about barangay activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockAnnouncements.filter(a => a.published).slice(0, 3).map((announcement) => (
              <div 
                key={announcement.id} 
                className="p-4 rounded-lg border hover:border-primary/50 transition-colors"
              >
                <Badge variant="secondary" className="mb-2">{announcement.category}</Badge>
                <h4 className="font-semibold text-sm line-clamp-1">{announcement.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{announcement.body}</p>
                {announcement.scheduledDate && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(announcement.scheduledDate), 'MMM d, yyyy')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
