'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function OfficialDashboard() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Role</CardTitle>
          <CardDescription>You are logged in as an official.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold text-primary">Official</p>
        </CardContent>
      </Card>
    </div>
  )
}
