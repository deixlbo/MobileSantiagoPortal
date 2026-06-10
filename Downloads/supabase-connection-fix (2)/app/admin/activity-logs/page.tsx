"use client"

export default function AdminActivityLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-500">Activity Logs Removed</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">This feature has been removed</h1>
        <p className="max-w-2xl text-sm text-slate-600 mt-2">
          Activity logs are no longer tracked or displayed in the admin portal.
        </p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm text-slate-700">
          The activity log page remains in the app for legacy URL compatibility, but it no longer shows audit events.
        </p>
      </div>
    </div>
  )
}
