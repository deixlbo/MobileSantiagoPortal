"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, House, Users } from "lucide-react"

const initialHouseholds = [
  { id: "h-1", head: "Juan Dela Cruz", address: "Purok 1, Brgy. Santiago", members: 5 },
  { id: "h-2", head: "Maria Santos", address: "Purok 3, Brgy. Santiago", members: 4 },
]

export default function AdminHouseholdsPage() {
  const [households, setHouseholds] = useState(initialHouseholds)
  const [head, setHead] = useState("")
  const [address, setAddress] = useState("")

  const addHousehold = () => {
    if (!head || !address) return
    setHouseholds((current) => [
      ...current,
      { id: `h-${Date.now()}`, head, address, members: 1 },
    ])
    setHead("")
    setAddress("")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Household Management</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Manage households</h1>
          <p className="max-w-2xl text-sm text-slate-600 mt-2">
            Create households, assign heads, and view household member details.
          </p>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-[0.9fr_0.7fr]">
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>Household directory</CardTitle>
            <CardDescription>All household records and member counts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {households.map((household) => (
                <div key={household.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{household.head}</p>
                      <p className="text-sm text-slate-600">{household.address}</p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                      <Users className="h-4 w-4" /> {household.members} members
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>Create household</CardTitle>
            <CardDescription>Assign a household head and address.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="household-head">Household Head</Label>
              <Input id="household-head" value={head} onChange={(e) => setHead(e.target.value)} placeholder="Name of head" />
            </div>
            <div>
              <Label htmlFor="household-address">Address</Label>
              <Input id="household-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Household address" />
            </div>
          </CardContent>
          <div className="p-4">
            <Button className="w-full" onClick={addHousehold}>
              <Plus className="mr-2 h-4 w-4" /> Create household
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
