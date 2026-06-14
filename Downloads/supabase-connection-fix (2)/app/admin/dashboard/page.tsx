"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  ClipboardList,
  Home,
  ShieldCheck,
  UserCheck,
  Users,
  FileText,
  Loader2,
} from "lucide-react"
interface DashboardStats {
  totalResidents: number
  totalHouseholds: number
  pendingVerifications: number
  pendingDocuments: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalResidents: 0,
    totalHouseholds: 0,
    pendingVerifications: 0,
    pendingDocuments: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/admin/dashboard')
        if (!response.ok) {
          throw new Error('Failed to load dashboard stats')
        }

        const data = await response.json()
        setStats({
          totalResidents: data.totalResidents || 0,
          totalHouseholds: data.totalHouseholds || 0,
          pendingVerifications: data.pendingVerifications || 0,
          pendingDocuments: data.pendingDocuments || 0,
        })
      } catch (error) {
        console.error('[v0] Error fetching admin dashboard data:', error)
        setStats({
          totalResidents: 0,
          totalHouseholds: 0,
          pendingVerifications: 0,
          pendingDocuments: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statsConfig = [
    { label: "Total Residents", value: stats.totalResidents.toLocaleString(), icon: Users, color: "bg-sky-500/10 text-sky-700" },
    { label: "Total Households", value: stats.totalHouseholds.toLocaleString(), icon: Home, color: "bg-emerald-500/10 text-emerald-700" },
    { label: "Pending Verifications", value: stats.pendingVerifications.toLocaleString(), icon: UserCheck, color: "bg-amber-500/10 text-amber-700" },
    { label: "Pending Document Requests", value: stats.pendingDocuments.toLocaleString(), icon: FileText, color: "bg-violet-500/10 text-violet-700" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-slate-500">Admin Dashboard</p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">Barangay Administration Overview</h1>
          <p className="max-w-2xl text-xs sm:text-sm text-slate-600 mt-2">
            Manage residents, household records, verification workflows, document requests, and barangay settings.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/admin/register">Create Admin Account</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.label} className="overflow-hidden">
              <CardContent className="space-y-4 p-4 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className={"rounded-2xl p-3 shadow-sm " + item.color}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-slate-500">{item.label}</p>
                  <p className="mt-2 text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="space-y-6">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Admin workflows</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Quick access to the key admin features and status areas.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-3 sm:space-y-4 rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3 text-slate-900">
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 shrink-0" />
                <p className="font-semibold text-sm sm:text-base">Resident Verification</p>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">Review pending accounts, view IDs, approve or decline registrations, and manage verification status.</p>
              <Button variant="secondary" className="w-full text-xs sm:text-sm" asChild>
                <Link href="/admin/resident-verification">Open verification</Link>
              </Button>
            </div>
            <div className="space-y-3 sm:space-y-4 rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3 text-slate-900">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 shrink-0" />
                <p className="font-semibold text-sm sm:text-base">Resident Management</p>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">View residents, update details, search records, delete entries, and export CSV/Excel.</p>
              <Button variant="secondary" className="w-full text-xs sm:text-sm" asChild>
                <Link href="/admin/resident-management">Open resident list</Link>
              </Button>
            </div>
            <div className="space-y-3 sm:space-y-4 rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3 text-slate-900">
                <Home className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 shrink-0" />
                <p className="font-semibold text-sm sm:text-base">Household Management</p>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">Create households, assign heads, track members, and view household address details.</p>
              <Button variant="secondary" className="w-full text-xs sm:text-sm" asChild>
                <Link href="/admin/households">Open households</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="space-y-4">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Pending verification summary</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Residents waiting for admin approval and upcoming actions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3">
            <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-medium text-slate-800">Pending Residents</span>
                <span className="rounded-full bg-amber-100 px-2 sm:px-3 py-1 text-xs font-semibold text-amber-800 shrink-0">{stats.pendingVerifications} pending</span>
              </div>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-600">Review valid IDs, confirm identity, and update verification status.</p>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
