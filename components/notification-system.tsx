"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mail, MessageSquare, Bell, Send, Clock, CheckCircle, AlertCircle, Repeat2 } from "lucide-react"

interface Notification {
  id: string
  type: "sms" | "email" | "push"
  recipient: string
  subject?: string
  message: string
  status: "pending" | "sent" | "failed"
  sentDate?: string
  openedDate?: string
  clickCount?: number
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "sms",
    recipient: "+63 9171234567",
    message: "Your Barangay Clearance is ready for pickup. Ref: BC-2606-001",
    status: "sent",
    sentDate: "2026-06-05 10:30 AM",
    clickCount: 1
  },
  {
    id: "2",
    type: "email",
    recipient: "juan@email.com",
    subject: "Appointment Confirmation",
    message: "Your appointment has been confirmed for June 8, 2026 at 2:00 PM",
    status: "sent",
    sentDate: "2026-06-04 03:45 PM",
    openedDate: "2026-06-04 04:15 PM"
  },
  {
    id: "3",
    type: "push",
    recipient: "All Users",
    message: "Community Clean-up Drive happening this weekend at the plaza!",
    status: "sent",
    sentDate: "2026-06-03 09:00 AM"
  }
]

const notificationTemplates = [
  { name: "Document Ready", message: "Your {{documentType}} is ready for pickup at the Barangay Hall." },
  { name: "Appointment Reminder", message: "Reminder: Your appointment is scheduled for {{date}} at {{time}}." },
  { name: "Event Notice", message: "You're invited to {{eventName}} on {{date}}. Location: {{location}}" },
  { name: "Urgent Alert", message: "⚠️ {{alertType}}: {{alertMessage}}" }
]

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [notificationType, setNotificationType] = useState<"sms" | "email" | "push">("email")
  const [recipient, setRecipient] = useState<string>("")
  const [subject, setSubject] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [isSending, setIsSending] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

  const handleSendNotification = async () => {
    if (!recipient || !message) return

    setIsSending(true)
    setTimeout(() => {
      const newNotification: Notification = {
        id: String(notifications.length + 1),
        type: notificationType,
        recipient,
        subject: notificationType === "email" ? subject : undefined,
        message,
        status: "sent",
        sentDate: new Date().toLocaleString()
      }
      setNotifications([newNotification, ...notifications])
      setRecipient("")
      setSubject("")
      setMessage("")
      setSelectedTemplate("")
      setIsSending(false)
    }, 1500)
  }

  const filteredNotifications = notifications.filter((n) => {
    let typeMatch = filterType === "all" || n.type === filterType
    let statusMatch = filterStatus === "all" || n.status === filterStatus
    return typeMatch && statusMatch
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sms":
        return <MessageSquare className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "push":
        return <Bell className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const stats = [
    { label: "Total Sent", value: notifications.filter(n => n.status === "sent").length, icon: CheckCircle },
    { label: "Pending", value: notifications.filter(n => n.status === "pending").length, icon: Clock },
    { label: "Failed", value: notifications.filter(n => n.status === "failed").length, icon: AlertCircle }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notification System</h2>
          <p className="text-muted-foreground">SMS, Email & Push Notifications</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-lg">
              <Send className="mr-2 h-4 w-4" /> Send Notification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Send Notification</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                {(["sms", "email", "push"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setNotificationType(type)}
                    className={`p-4 rounded-2xl border-2 transition-all text-center ${
                      notificationType === type
                        ? "border-primary bg-primary/5"
                        : "border-slate-200/70 hover:border-primary/50"
                    }`}
                  >
                    <div className="mb-2 flex justify-center">
                      {getTypeIcon(type)}
                    </div>
                    <p className="font-semibold text-sm capitalize">{type}</p>
                  </button>
                ))}
              </div>

              <div>
                <Label htmlFor="recipient">Recipient</Label>
                <Input
                  id="recipient"
                  placeholder={notificationType === "sms" ? "+63 9XX XXXX XXX" : notificationType === "email" ? "email@example.com" : "All Users"}
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="mt-2 rounded-lg"
                />
              </div>

              {notificationType === "email" && (
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Email subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-2 rounded-lg"
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="message">Message</Label>
                  <Select value={selectedTemplate} onValueChange={(template) => {
                    const found = notificationTemplates.find(t => t.name === template)
                    if (found) setMessage(found.message)
                    setSelectedTemplate(template)
                  }}>
                    <SelectTrigger className="w-auto">
                      <SelectValue placeholder="Use template" />
                    </SelectTrigger>
                    <SelectContent>
                      {notificationTemplates.map((template) => (
                        <SelectItem key={template.name} value={template.name}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  id="message"
                  placeholder="Enter your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-2 rounded-lg"
                  rows={4}
                />
              </div>

              <Button
                onClick={handleSendNotification}
                disabled={!recipient || !message || isSending}
                className="w-full rounded-lg"
              >
                {isSending ? (
                  <>
                    <Repeat2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Send Now
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="rounded-2xl border border-slate-200/70">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-muted-foreground/40" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex gap-2">
          <span className="text-sm font-medium text-muted-foreground self-center">Type:</span>
          {["all", "sms", "email", "push"].map((type) => (
            <Button
              key={type}
              variant={filterType === type ? "default" : "outline"}
              onClick={() => setFilterType(type)}
              className="rounded-lg capitalize"
              size="sm"
            >
              {type}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <span className="text-sm font-medium text-muted-foreground self-center">Status:</span>
          {["all", "sent", "pending", "failed"].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              onClick={() => setFilterStatus(status)}
              className="rounded-lg capitalize"
              size="sm"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="grid gap-4">
        {filteredNotifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Dialog open={selectedNotification?.id === notification.id} onOpenChange={() => setSelectedNotification(null)}>
              <DialogTrigger asChild>
                <Card
                  className="cursor-pointer rounded-2xl border border-slate-200/70 transition-all hover:shadow-lg"
                  onClick={() => setSelectedNotification(notification)}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="text-primary mt-0.5">{getTypeIcon(notification.type)}</div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="capitalize text-xs">{notification.type}</Badge>
                            <Badge variant={getStatusColor(notification.status)} className="capitalize text-xs">
                              {notification.status}
                            </Badge>
                          </div>
                          {notification.subject && (
                            <p className="font-semibold text-sm">{notification.subject}</p>
                          )}
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">{notification.recipient}</p>
                        </div>
                      </div>
                      <div className="text-right text-xs text-muted-foreground shrink-0">
                        <p>{notification.sentDate}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Notification Details</DialogTitle>
                </DialogHeader>
                {selectedNotification && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground">TYPE</p>
                      <Badge variant="outline" className="capitalize w-fit">{selectedNotification.type}</Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground">RECIPIENT</p>
                      <p className="text-sm">{selectedNotification.recipient}</p>
                    </div>
                    {selectedNotification.subject && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground">SUBJECT</p>
                        <p className="text-sm">{selectedNotification.subject}</p>
                      </div>
                    )}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground">MESSAGE</p>
                      <p className="text-sm leading-relaxed">{selectedNotification.message}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <Badge variant={getStatusColor(selectedNotification.status)} className="mt-1 capitalize">
                          {selectedNotification.status}
                        </Badge>
                      </div>
                      {selectedNotification.openedDate && (
                        <div>
                          <p className="text-xs text-muted-foreground">Opened</p>
                          <p className="text-sm mt-1">{selectedNotification.openedDate}</p>
                        </div>
                      )}
                      {selectedNotification.clickCount !== undefined && (
                        <div>
                          <p className="text-xs text-muted-foreground">Clicks</p>
                          <p className="text-sm mt-1">{selectedNotification.clickCount}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
