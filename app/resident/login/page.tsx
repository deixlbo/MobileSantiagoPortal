"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, ShieldCheck, Eye as EyeIcon, Users } from "lucide-react"
import { signIn } from "@/lib/auth"
import { toast } from "sonner"

export default function ResidentLoginPage() {
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
      if (error || !data.session) {
        toast.error(error?.message || "Invalid email or password.")
        setIsLoading(false)
        return
      }
      router.push("/resident/dashboard")
    } catch (error) {
      toast.error("Unable to sign in. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-950">
      <div className="pointer-events-none absolute left-0 top-0 h-[30rem] w-[30rem] -translate-x-1/3 -translate-y-1/3 rounded-full bg-[radial-gradient(circle_at_top_left,_rgba(159,230,163,0.28),transparent_55%)] blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle_at_top_right,_rgba(120,187,113,0.20),transparent_55%)] blur-3xl" />
      <div className="pointer-events-none absolute left-0 bottom-0 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle_at_bottom_left,_rgba(143,214,178,0.18),transparent_55%)] blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-[1800px] flex-col justify-center gap-6 px-4 py-8 sm:gap-8 sm:px-6 md:gap-10 md:px-8 lg:flex-row lg:items-center lg:gap-12 lg:px-10 xl:px-12">
        <motion.section
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex-1 hidden lg:block"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl border border-emerald-200/70 bg-emerald-50/80 p-3 sm:p-4 shadow-sm shadow-emerald-100/60 backdrop-blur-sm max-w-max">
              <div className="flex h-12 sm:h-16 w-12 sm:w-16 items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-sm flex-shrink-0">
                <Image
                  src="/images/santiagologo.jpg"
                  alt="Barangay Santiago Logo"
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-emerald-700 font-semibold">Barangay Santiago</p>
                <p className="text-xs sm:text-sm text-slate-600">Resident access portal</p>
              </div>
            </div>

            <div className="mt-8 sm:mt-12 max-w-2xl space-y-4 sm:space-y-6">
              <h1 className="heading-h1">Sign in to your account</h1>
              <p className="text-body-lg text-slate-700">
                Secure access for authorized personnel. Manage community services with clarity, integrity, and a people-first government approach.
              </p>
            </div>

            <div className="mt-10 sm:mt-14 grid max-w-3xl grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="rounded-2xl sm:rounded-3xl border border-slate-200/70 bg-white/80 p-4 sm:p-5 shadow-sm shadow-slate-100">
                <div className="flex h-10 sm:h-11 w-10 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-100 text-emerald-700">
                  <EyeIcon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 sm:mt-4 text-sm sm:text-base font-semibold text-slate-950">Transparency</h3>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">Open workflows and clear access for residents.</p>
              </div>
              <div className="rounded-2xl sm:rounded-3xl border border-slate-200/70 bg-white/80 p-4 sm:p-5 shadow-sm shadow-slate-100">
                <div className="flex h-10 sm:h-11 w-10 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-100 text-emerald-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-3 sm:mt-4 text-sm sm:text-base font-semibold text-slate-950">Integrity</h3>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">Secure sign-in for resident services and records.</p>
              </div>
              <div className="rounded-2xl sm:rounded-3xl border border-slate-200/70 bg-white/80 p-4 sm:p-5 shadow-sm shadow-slate-100">
                <div className="flex h-10 sm:h-11 w-10 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-100 text-emerald-700">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="mt-3 sm:mt-4 text-sm sm:text-base font-semibold text-slate-950">Community</h3>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">A portal designed to connect residents and barangay services.</p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="w-full rounded-2xl sm:rounded-3xl lg:rounded-[38px] border border-slate-200/70 bg-white/95 p-5 sm:p-8 md:p-10 shadow-lg sm:shadow-2xl lg:shadow-[0_40px_120px_-60px_rgba(15,23,42,0.18)] backdrop-blur-xl lg:w-[38rem]"
        >
          <div className="mb-6 sm:mb-8 md:mb-10">
            <p className="text-xs uppercase tracking-widest text-emerald-700 font-semibold">Resident sign in</p>
            <h2 className="mt-2 sm:mt-4 heading-h2">Barangay Santiago</h2>
            <p className="mt-2 sm:mt-3 max-w-xl text-sm sm:text-base leading-6 text-slate-600">
              Authorized personnel can access resident services, track requests, and stay informed with community updates.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="email" className="text-base sm:text-lg font-semibold">Email Address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@barangaysantiago.gov.ph"
                  className="pl-12 text-base h-12 sm:h-14"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="password" className="text-base sm:text-lg font-semibold">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-12 pr-12 text-base h-12 sm:h-14"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 p-2"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-2">
              <label className="inline-flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 cursor-pointer"
                  disabled={isLoading}
                />
                <span className="text-sm font-medium">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-700 text-white shadow-lg shadow-emerald-700/20 hover:bg-emerald-800 h-12 sm:h-14 text-base sm:text-lg font-semibold mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>

            <p className="text-sm text-center text-slate-600 pt-2">
              Don&apos;t have an account?{' '}
              <Link href="/resident/register" className="font-semibold text-emerald-700 hover:text-emerald-800 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
                Register here
              </Link>
            </p>
          </form>

          {/* Demo credentials info for testing */}
          <div className="mt-6 sm:mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg sm:rounded-xl">
            <p className="text-xs sm:text-sm font-semibold text-amber-900 mb-2">Demo Credentials</p>
            <p className="text-xs text-amber-800"><strong>Email:</strong> resident@demo.com</p>
            <p className="text-xs text-amber-800"><strong>Password:</strong> demo123</p>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
