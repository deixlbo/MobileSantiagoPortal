"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ResidentFeedbackPage() {
  return (
    <div className="rounded-3xl border border-border bg-white p-10 text-center shadow-sm">
      <h1 className="text-2xl font-semibold">Resident Feedback</h1>
      <p className="mt-2 text-sm text-slate-600">Feedback submissions are currently unavailable in this portal.</p>
      <div className="mt-6">
        <Link href="/resident/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
