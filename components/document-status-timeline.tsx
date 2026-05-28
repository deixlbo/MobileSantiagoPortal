'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, AlertCircle, FileCheck } from 'lucide-react'

export type DocumentStatus = 'submitted' | 'processing' | 'approved' | 'ready' | 'declined'

interface TimelineStep {
  status: DocumentStatus
  label: string
  description: string
  date?: Date
  icon: React.ReactNode
}

interface DocumentStatusTimelineProps {
  currentStatus: DocumentStatus
  submittedDate: Date
  processingDate?: Date
  approvedDate?: Date
  readyDate?: Date
  rejectionReason?: string
}

export function DocumentStatusTimeline({
  currentStatus,
  submittedDate,
  processingDate,
  approvedDate,
  readyDate,
  rejectionReason,
}: DocumentStatusTimelineProps) {
  const statusOrder: DocumentStatus[] = ['submitted', 'processing', 'approved', 'ready']
  const currentIndex = statusOrder.indexOf(currentStatus)

  const steps: TimelineStep[] = [
    {
      status: 'submitted',
      label: 'Submitted',
      description: 'Your request has been received',
      date: submittedDate,
      icon: <FileCheck className="h-5 w-5" />,
    },
    {
      status: 'processing',
      label: 'Processing',
      description: 'Your request is being reviewed',
      date: processingDate,
      icon: <Clock className="h-5 w-5" />,
    },
    {
      status: 'approved',
      label: 'Approved',
      description: 'Your request has been approved',
      date: approvedDate,
      icon: <CheckCircle2 className="h-5 w-5" />,
    },
    {
      status: 'ready',
      label: 'Ready for Pickup',
      description: 'Your document is ready',
      date: readyDate,
      icon: <FileCheck className="h-5 w-5" />,
    },
  ]

  return (
    <Card className="border-0 bg-card/60 backdrop-blur overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Request Timeline</CardTitle>
            <CardDescription>Track your document request status</CardDescription>
          </div>
          <Badge
            variant={currentStatus === 'ready' ? 'default' : currentStatus === 'declined' ? 'destructive' : 'secondary'}
          >
            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
            {steps.map((step, index) => {
            const isCompleted = index < currentIndex || (index === currentIndex && currentStatus !== 'declined')
            const isCurrent = index === currentIndex
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

                {/* Step */}
                <div className="flex gap-4">
                  {/* Icon circle */}
                  <div
                    className={`mt-1 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      isCompleted
                        ? 'bg-primary text-primary-foreground'
                        : isCurrent
                          ? 'bg-primary/20 text-primary ring-2 ring-primary ring-offset-2 ring-offset-background'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                      <div>
                        <p className={`font-semibold ${isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.label}
                        </p>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                      {step.date && (
                        <div className="text-sm font-medium text-right whitespace-nowrap">
                          {step.date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Rejection message */}
          {currentStatus === 'declined' && rejectionReason && (
            <div className="mt-6 rounded-lg bg-destructive/10 border border-destructive/30 p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-destructive mb-1">Request Declined</p>
                  <p className="text-sm text-muted-foreground">{rejectionReason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Status indicator at bottom */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current Status</span>
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    currentStatus === 'ready'
                      ? 'bg-emerald-500'
                      : currentStatus === 'declined'
                        ? 'bg-destructive'
                        : 'bg-amber-500'
                  }`}
                />
                <span className="font-semibold capitalize">{currentStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
