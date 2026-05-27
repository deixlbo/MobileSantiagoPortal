'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle2, AlertCircle, Info, Trash2 } from "lucide-react"
import { useState } from "react"

const allNotifications = [
  {
    id: 1,
    type: "approval",
    message: "Your Barangay Clearance has been approved and is ready for release",
    time: "2 hours ago",
    read: false,
    icon: CheckCircle2,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 2,
    type: "announcement",
    message: "New announcement: Community Health Drive scheduled for May 10",
    time: "5 hours ago",
    read: true,
    icon: Info,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: 3,
    type: "rejection",
    message: "Your Certificate of Indigency request was rejected. Please resubmit with updated documents.",
    time: "1 day ago",
    read: true,
    icon: AlertCircle,
    color: "bg-red-100 text-red-700",
  },
  {
    id: 4,
    type: "update",
    message: "Your property dispute blotter case is now in processing status",
    time: "2 days ago",
    read: true,
    icon: Bell,
    color: "bg-amber-100 text-amber-700",
  },
  {
    id: 5,
    type: "announcement",
    message: "Free medical check-up available at the barangay health center",
    time: "3 days ago",
    read: true,
    icon: Info,
    color: "bg-blue-100 text-blue-700",
  },
]

function getNotificationBadge(type: string) {
  switch (type) {
    case "approval":
      return <Badge className="bg-emerald-100 text-emerald-700">Approved</Badge>
    case "rejection":
      return <Badge className="bg-red-100 text-red-700">Rejected</Badge>
    case "announcement":
      return <Badge className="bg-blue-100 text-blue-700">Announcement</Badge>
    case "update":
      return <Badge className="bg-amber-100 text-amber-700">Update</Badge>
    default:
      return <Badge variant="secondary">Notification</Badge>
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(allNotifications)
  const [selectedFilter, setSelectedFilter] = useState("all")

  const filtered = selectedFilter === "all" 
    ? notifications 
    : notifications.filter(n => !n.read || selectedFilter === "unread" ? !n.read : n.read)

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button 
          variant={selectedFilter === "all" ? "default" : "outline"}
          onClick={() => setSelectedFilter("all")}
        >
          All ({notifications.length})
        </Button>
        <Button 
          variant={selectedFilter === "unread" ? "default" : "outline"}
          onClick={() => setSelectedFilter("unread")}
        >
          Unread ({unreadCount})
        </Button>
        <Button 
          variant={selectedFilter === "approval" ? "default" : "outline"}
          onClick={() => setSelectedFilter("approval")}
        >
          Approvals
        </Button>
        <Button 
          variant={selectedFilter === "announcement" ? "default" : "outline"}
          onClick={() => setSelectedFilter("announcement")}
        >
          Announcements
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((notification) => {
            const Icon = notification.icon
            return (
              <Card 
                key={notification.id}
                className={notification.read ? "" : "border-primary/50 bg-primary/5"}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className={`rounded-lg p-2 h-fit ${notification.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium">{notification.message}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.time}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getNotificationBadge(notification.type)}
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No notifications to display</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
