"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "@/lib/auth"
import { getErrorMessage } from "@/lib/utils"
import { toast } from "sonner"

export default function AdminLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { data, error } = await signIn(email, password)
      if (error || !data?.session) {
        toast.error(getErrorMessage(error, "Invalid credentials."))
        setIsLoading(false)
        return
      }
      router.push("/admin/dashboard")
    } catch (error) {
      toast.error("Unable to sign in. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="main-card-container relative min-h-screen overflow-hidden bg-white text-slate-950">
      <div className="pointer-events-none absolute left-0 top-0 h-[30rem] w-[30rem] -translate-x-1/3 -translate-y-1/3 rounded-full bg-[radial-gradient(circle_at_top_left,_rgba(159,230,163,0.28),transparent_55%)] blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle_at_top_right,_rgba(120,187,113,0.20),transparent_55%)] blur-3xl" />
      <div className="pointer-events-none absolute left-0 bottom-0 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle_at_bottom_left,_rgba(143,214,178,0.18),transparent_55%)] blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-[1800px] flex-col justify-center gap-8 px-6 py-8 sm:px-10 lg:flex-row lg:items-center lg:px-16 xl:px-24">
        <motion.section
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex-1"
        >
          <div className="flex items-center gap-4 rounded-3xl border border-emerald-200/70 bg-emerald-50/80 p-4 shadow-sm shadow-emerald-100/60 backdrop-blur-sm max-w-max">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-3xl bg-white shadow-sm">
              <Image
                src="/logos/santiago-logo.png"
                alt="Barangay Santiago Logo"
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-emerald-700">Barangay Santiago</p>
              <p className="text-sm text-slate-600">Government management suite</p>
            </div>
          </div>

          <div className="mt-8 max-w-2xl space-y-5">
            <h1 className="text-6xl font-semibold tracking-tight text-slate-950 sm:text-7xl">Sign in to your account</h1>
            <p className="text-lg leading-8 text-slate-700">
              Secure access for authorized personnel. Manage community services with clarity, integrity, and a people-first government approach.
            </p>
          </div>

        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="w-full rounded-[38px] border border-slate-200/70 bg-white/95 p-8 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.18)] backdrop-blur-xl lg:w-[38rem]"
        >
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Admin sign in</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">Barangay Santiago</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Authorized personnel can access the barangay management system to coordinate services, review reports, and support residents.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              <Label htmlFor="email">Email</Label>
              <div>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@barangaysantiago.gov.ph"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-slate-600 transition hover:text-slate-900"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="inline-flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
                />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-sm font-medium text-emerald-700 hover:text-emerald-800">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-700 text-white shadow-lg shadow-emerald-700/20 hover:bg-emerald-800"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>

            <p className="text-sm text-slate-600">
              Need admin access?{' '}
              <Link href="/admin/register" className="font-medium text-emerald-700 hover:text-emerald-800">
                Create account
              </Link>
            </p>
          </form>
        </motion.section>
      </div>
    </div>
  )
}
