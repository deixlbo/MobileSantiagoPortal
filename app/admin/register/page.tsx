"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, User, ShieldCheck, Users } from "lucide-react"
import { createAdmin } from "@/lib/auth"
import { toast } from "sonner"

export default function AdminRegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' })

  const handleChange = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      const result = await createAdmin({ email: form.email, password: form.password, firstName: form.firstName, lastName: form.lastName })
      if (result.error) {
        toast.error(result.error || 'Failed to create admin')
        setIsLoading(false)
        return
      }
      toast.success('Admin account created successfully!')
      router.push('/admin/login')
    } catch (err) {
      toast.error('Failed to create admin account')
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-950">
      <div className="pointer-events-none absolute left-0 top-0 h-[30rem] w-[30rem] -translate-x-1/3 -translate-y-1/3 rounded-full bg-[radial-gradient(circle_at_top_left,_rgba(159,230,163,0.28),transparent_55%)] blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle_at_top_right,_rgba(120,187,113,0.20),transparent_55%)] blur-3xl" />
      <div className="pointer-events-none absolute left-0 bottom-0 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle_at_bottom_left,_rgba(143,214,178,0.18),transparent_55%)] blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-[1800px] flex-col justify-center gap-12 px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:px-16 xl:px-24">
        <motion.section
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex-1"
        >
          <div className="flex items-center gap-4 rounded-3xl border border-emerald-200/70 bg-emerald-50/80 p-4 shadow-sm shadow-emerald-100/60 backdrop-blur-sm max-w-max">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-3xl bg-white shadow-sm">
              <Image
                src="/images/santiagologo.jpg"
                alt="Barangay Santiago Logo"
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-emerald-700">Barangay Santiago</p>
              <p className="text-sm text-slate-600">Admin registration</p>
            </div>
          </div>

          <div className="mt-12 max-w-2xl space-y-6">
            <h1 className="text-6xl font-semibold tracking-tight text-slate-950 sm:text-7xl">Create your admin account</h1>
            <p className="text-lg leading-8 text-slate-700">
              Register secure admin access with Barangay Santiago’s portal for government services and resident support.
            </p>
          </div>

          <div className="mt-14 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-sm shadow-slate-100">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Eye className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-950">Transparency</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Clear admin workflows and audit-ready access.</p>
            </div>
            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-sm shadow-slate-100">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-950">Integrity</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Secure admin permissions for trustworthy governance.</p>
            </div>
            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-sm shadow-slate-100">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-950">Community</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Account setup focused on barangay service delivery.</p>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="w-full rounded-[38px] border border-slate-200/70 bg-white/95 p-10 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.18)] backdrop-blur-xl lg:w-[38rem]"
        >
          <div className="mb-10">
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Admin account</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">Create account</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Add a secure administrative account to manage barangay services, residents, and approvals.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="firstName">First name</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="firstName"
                    placeholder="First name"
                    className="pl-11"
                    value={form.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="lastName">Last name</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="lastName"
                    placeholder="Last name"
                    className="pl-11"
                    value={form.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@barangaysantiago.gov.ph"
                  className="pl-11"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    className="pl-11 pr-11"
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm password"
                    className="pl-11 pr-11"
                    value={form.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-700 text-white shadow-lg shadow-emerald-700/20 hover:bg-emerald-800"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>

            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link href="/admin/login" className="font-medium text-emerald-700 hover:text-emerald-800">
                Sign in
              </Link>
            </p>
          </form>
        </motion.section>
      </div>
    </div>
  )
}
