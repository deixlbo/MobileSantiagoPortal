'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, AlertCircle, FileText, Users, FileCheck, XCircle } from 'lucide-react'

export type ComplaintStatus = 
  | 'pending-review' 
  | 'under-investigation' 
  | 'scheduled-mediation' 
  | 'ongoing-hearing' 
  | 'resolved' 
  | 'dismissed' 
  | 'escalated'

interface TimelineStep {
  status: ComplaintStatus
  label: string
  description: string
  date?: string
  icon: React.ReactNode
}

interface ComplaintStatusTimelineProps {
  currentStatus: ComplaintStatus
  filedDate: string
  reviewDate?: string
  investigationDate?: string
  mediationScheduledDate?: string
  hearingDate?: string
  resolutionDate?: string
  notes?: string
}

const statusLabels: Record<ComplaintStatus, { label: string; color: string }> = {
  'pending-review': { label: 'Pending Review', color: 'bg-blue-100 text-blue-700' },
  'under-investigation': { label: 'Under Investigation', color: 'bg-amber-100 text-amber-700' },
  'scheduled-mediation': { label: 'Scheduled for Mediation', color: 'bg-purple-100 text-purple-700' },
  'ongoing-hearing': { label: 'Ongoing Hearing', color: 'bg-red-100 text-red-700' },
  'resolved': { label: 'Resolved', color: 'bg-emerald-100 text-emerald-700' },
  'dismissed': { label: 'Dismissed', color: 'bg-gray-100 text-gray-700' },
  'escalated': { label: 'Escalated', color: 'bg-orange-100 text-orange-700' },
}

export function ComplaintStatusTimeline({
  currentStatus,
  filedDate,
  reviewDate,
  investigationDate,
  mediationScheduledDate,
  hearingDate,
  resolutionDate,
  notes,
}: ComplaintStatusTimelineProps) {
  const statusOrder: ComplaintStatus[] = [
    'pending-review',
    'under-investigation',
    'scheduled-mediation',
    'ongoing-hearing',
    'resolved',
  ]

  const currentIndex = statusOrder.indexOf(currentStatus)

  const steps: TimelineStep[] = [
    {
      status: 'pending-review',
      label: 'Pending Review',
      description: 'Your complaint is pending initial review',
      date: filedDate,
      icon: <FileText className="h-5 w-5" />,
    },
    {
      status: 'under-investigation',
      label: 'Under Investigation',
      description: 'Officials are investigating your complaint',
      date: investigationDate,
      icon: <Clock className="h-5 w-5" />,
    },
    {
      status: 'scheduled-mediation',
      label: 'Scheduled for Mediation',
      description: 'Mediation hearing has been scheduled',
      date: mediationScheduledDate,
      icon: <Users className="h-5 w-5" />,
    },
    {
      status: 'ongoing-hearing',
      label: 'Ongoing Hearing',
      description: 'Mediation/Hearing in progress',
      date: hearingDate,
      icon: <AlertCircle className="h-5 w-5" />,
    },
    {
      status: 'resolved',
      label: 'Resolved',
      description: 'Case has been resolved',
      date: resolutionDate,
      icon: <CheckCircle2 className="h-5 w-5" />,
    },
  ]

  const getStatusIcon = (status: ComplaintStatus) => {
    switch (status) {
      case 'dismissed':
        return <XCircle className="h-5 w-5" />
      case 'escalated':
        return <AlertCircle className="h-5 w-5" />
      default:
        return null
    }
  }

  return (
    <Card className="border-0 bg-card/60 backdrop-blur overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Complaint Timeline</CardTitle>
            <CardDescription>Track your complaint status</CardDescription>
          </div>
          <Badge className={`${statusLabels[currentStatus].color}`}>
            {statusLabels[currentStatus].label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Special status badges for dismissed/escalated */}
          {(currentStatus === 'dismissed' || currentStatus === 'escalated') && (
            <div className="p-3 rounded-lg bg-muted border border-border">
              <div className="flex items-start gap-3">
                {getStatusIcon(currentStatus)}
                <div>
                  <p className="font-semibold text-sm">
                    {currentStatus === 'dismissed' ? 'Case Dismissed' : 'Case Escalated'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {currentStatus === 'dismissed'
                      ? 'This complaint was dismissed after review.'
                      : 'This complaint has been escalated for further action.'}
                  </p>
                  {notes && <p className="text-xs mt-2 text-foreground">{notes}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Timeline steps */}
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex || (index === currentIndex && currentStatus !== 'dismissed')
            const isCurrent = index === currentIndex && !['dismissed', 'escalated'].includes(currentStatus)
            const isUpcoming = index > currentIndex

            return (
              <div key={step.status} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-5 top-12 h-8 w-0.5 transition-colors ${
                      isCompleted || isCurrent
                        ? 'bg-primary'
                        : 'bg-muted'
                    }`}
                  />
                )}

                {/* Timeline item */}
                <div className="flex gap-4">
                  {/* Icon circle */}
                  <div
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors flex-shrink-0 ${
                      isCompleted
                        ? 'border-primary bg-primary text-primary-foreground'
                        : isCurrent
                          ? 'border-primary bg-background text-primary animate-pulse'
                          : 'border-muted bg-background text-muted-foreground'
                    }`}
                  >
                    {step.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`font-semibold text-sm ${
                          isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {step.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    {step.date && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {step.date}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
