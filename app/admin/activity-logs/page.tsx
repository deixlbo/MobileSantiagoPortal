"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const logs = [
  { time: "Today 2:15 PM", action: "Verified resident account", actor: "Admin" },
  { time: "Today 1:05 PM", action: "Approved document request", actor: "Admin" },
  { time: "Yesterday 9:20 AM", action: "Created official account", actor: "Admin" },
  { time: "Yesterday 8:30 AM", action: "Updated barangay info", actor: "Admin" },
]

export default function AdminActivityLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-500">Activity Logs</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Track admin actions</h1>
        <p className="max-w-2xl text-sm text-slate-600 mt-2">
          View who verified residents, approved documents, and all login activity with timestamped logs.
        </p>
      </div>

      <Card className="space-y-4">
        <CardHeader>
          <CardTitle>Recent actions</CardTitle>
          <CardDescription>Ordered by most recent activity.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {logs.map((log) => (
              <div key={log.time} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{log.action}</p>
                    <p className="text-sm text-slate-500">{log.actor}</p>
                  </div>
                  <Badge variant="outline">{log.time}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
