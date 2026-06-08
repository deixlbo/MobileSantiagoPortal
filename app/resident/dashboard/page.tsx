"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import {
  Megaphone,
  ArrowRight,
  FolderKanban,
  Scroll,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronLeft,
  ChevronRight,
  Bell,
  X,
  FileText,
  Loader2,
} from "lucide-react"

export default function ResidentDashboard() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const slideInterval = useRef<NodeJS.Timeout | null>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [loading, setLoading] = useState(true)
  const [barangayInfo, setBarangayInfo] = useState<any | null>(null)
  
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [ordinances, setOrdinances] = useState<any[]>([])
  
  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    setLoading(true)
    try {
      const { data: announcementsData } = await supabase
        .from('announcements')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(3)

      setAnnouncements(announcementsData || [])

      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3)

      setProjects(projectsData || [])

      const { data: ordinancesData } = await supabase
        .from('ordinances')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3)

      setOrdinances(ordinancesData || [])

      const notifs: any[] = []
      
      if (announcementsData && announcementsData.length > 0) {
        announcementsData.slice(0, 2).forEach((ann, idx) => {
          notifs.push({
            id: `ann-${idx}`,
            type: "announcement",
            message: `New announcement: ${ann.title}`,
            time: formatTimeAgo(ann.created_at),
            read: false,
            route: "/resident/announcements"
          })
        })
      }

      setNotifications(notifs)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 60) return `${diffMins} mins ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`
    return `${Math.floor(diffMins / 1440)} days ago`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleNotificationClick = (notification: any) => {
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    )
    setShowNotifications(false)
    router.push(notification.route)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "announcement":
        return <Megaphone className="h-4 w-4 mt-0.5 text-orange-500" />
      case "project":
        return <FolderKanban className="h-4 w-4 mt-0.5 text-blue-500" />
      case "document":
        return <FileText className="h-4 w-4 mt-0.5 text-green-500" />
      default:
        return <Bell className="h-4 w-4 mt-0.5 text-slate-500" />
    }
  }

  const slides = [
    { type: "announcements", data: announcements },
    { type: "projects", data: projects },
    { type: "ordinances", data: ordinances },
  ]

  useEffect(() => {
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current)
    }
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    if (slideInterval.current) clearInterval(slideInterval.current)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    if (slideInterval.current) clearInterval(slideInterval.current)
  }

  const renderSlideContent = () => {
    const slide = slides[currentSlide]
    
    if (slide.type === "announcements") {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Latest Announcements</h3>
            </div>
            <Link href="/resident/announcements">
              <Button variant="ghost" size="sm" className="text-xs">
                View All <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
          {announcements.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p className="text-sm">No announcements yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {announcements.slice(0, 2).map((ann) => (
                <div key={ann.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">{ann.category || 'General'}</Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(ann.created_at)}</span>
                  </div>
                  <p className="font-medium text-sm">{ann.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{ann.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }
    
    if (slide.type === "projects") {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Community Projects</h3>
            </div>
            <Link href="/resident/projects">
              <Button variant="ghost" size="sm" className="text-xs">
                View All <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
          {projects.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p className="text-sm">No projects yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {projects.slice(0, 2).map((proj) => (
                <div key={proj.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm">{proj.title}</p>
                    <Badge 
                      className={`text-xs ${
                        proj.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                        proj.status === "ongoing" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {proj.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{proj.location}</p>
                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ width: `${proj.progress || 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }
    
    if (slide.type === "ordinances") {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scroll className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Barangay Ordinances</h3>
            </div>
            <Link href="/resident/ordinances">
              <Button variant="ghost" size="sm" className="text-xs">
                View All <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
          {ordinances.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p className="text-sm">No ordinances yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {ordinances.slice(0, 2).map((ord) => (
                <div key={ord.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      No. {ord.ordinance_number} - {ord.year}
                    </Badge>
                  </div>
                  <p className="font-medium text-sm">{ord.title}</p>
                  <p className="text-xs text-muted-foreground">{ord.date_enacted ? formatDate(ord.date_enacted) : ''}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Welcome, Resident</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Barangay Santiago Resident Dashboard</p>
        </div>
        
        {/* Notification Bell */}
        <div className="relative w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="icon" 
            className="relative w-full sm:w-auto"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </Button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-full sm:w-80 bg-white rounded-lg shadow-lg border z-50">
              <div className="p-3 border-b flex items-center justify-between">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowNotifications(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-4 text-sm text-slate-500 text-center">No new notifications</p>
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
                        {getNotificationIcon(notif.type)}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!notif.read ? "font-medium" : ""}`}>{notif.message}</p>
                          <span className="text-xs text-slate-500">{notif.time}</span>
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

      {/* Sliding Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-4 sm:p-6 relative">
          <div className="min-h-[200px]">
            {renderSlideContent()}
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <Button variant="ghost" size="sm" onClick={prevSlide}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentSlide(idx)
                    if (slideInterval.current) clearInterval(slideInterval.current)
                  }}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === idx ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={nextSlide}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Barangay Information */}
      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <Image
              src="/logos/santiago-logo.png"
              alt="Barangay Santiago"
              width={24}
              height={24}
              className="rounded-full w-6 h-6"
            />
            About Barangay Santiago
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Punong Barangay</p>
                <p className="font-medium">{barangayInfo?.punongBarangay || ""}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-medium">{barangayInfo ? `${barangayInfo.municipality}, ${barangayInfo.province}` : ""}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Region</p>
                <p className="font-medium">{barangayInfo?.region || ""}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-xs">{barangayInfo?.address || ""}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs">{barangayInfo?.phone || ""}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs">{barangayInfo?.email || ""}</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs">{barangayInfo?.officeHours || ""}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
