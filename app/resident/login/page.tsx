"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ShieldCheck, Users } from "lucide-react"
import { signIn } from "@/lib/auth"
import { getErrorMessage } from "@/lib/utils"
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
      if (error || !data?.session) {
        toast.error(getErrorMessage(error, "Invalid email or password."))
        setIsLoading(false)
        return
      }
      router.push("/resident/dashboard")
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to sign in. Please try again."))
      setIsLoading(false)
    }
  }

  return (
    <div className="main-card-container relative min-h-screen overflow-auto bg-white text-slate-950 flex items-center justify-center py-3 sm:py-6">
      <div className="pointer-events-none hidden lg:block absolute left-0 top-0 h-[30rem] w-[30rem] -translate-x-1/3 -translate-y-1/3 rounded-full bg-[radial-gradient(circle_at_top_left,_rgba(159,230,163,0.28),transparent_55%)] blur-3xl" />
      <div className="pointer-events-none hidden lg:block absolute right-0 top-24 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle_at_top_right,_rgba(120,187,113,0.20),transparent_55%)] blur-3xl" />
      <div className="pointer-events-none hidden lg:block absolute left-0 bottom-0 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle_at_bottom_left,_rgba(143,214,178,0.18),transparent_55%)] blur-3xl" />

      <div className="relative w-full max-w-[1800px] flex flex-col lg:flex-row lg:items-center lg:gap-8 px-3 sm:px-6 md:px-8 lg:px-10 xl:px-12 gap-0">
        <motion.section
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex-1 mb-8 lg:mb-0"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl border border-emerald-200/70 bg-emerald-50/80 p-3 sm:p-4 shadow-sm shadow-emerald-100/60 backdrop-blur-sm max-w-max">
              <div className="flex h-12 sm:h-16 w-12 sm:w-16 items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-sm flex-shrink-0">
                <Image
                  src="/logos/santiago-logo.png"
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

            <div className="mt-6 sm:mt-8 max-w-2xl space-y-3 sm:space-y-5">
              <h1 className="heading-h1">Sign in to your account</h1>
              <p className="text-body-lg text-slate-700">
                Secure access for authorized personnel. Manage community services with clarity, integrity, and a people-first government approach.
              </p>
            </div>

          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="w-full rounded-2xl sm:rounded-3xl lg:rounded-[38px] border border-slate-200/70 bg-white/95 p-4 sm:p-6 md:p-8 shadow-lg sm:shadow-2xl lg:shadow-[0_40px_120px_-60px_rgba(15,23,42,0.18)] backdrop-blur-xl lg:w-[38rem]"
        >
          <div className="mb-4 sm:mb-6 md:mb-8">
            <p className="text-xs uppercase tracking-widest text-emerald-700 font-semibold">Resident sign in</p>
            <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-bold">Barangay Santiago</h2>
            <p className="mt-2 sm:mt-2 max-w-xl text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">
              Access resident services, track requests, and stay informed.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="email" className="text-sm sm:text-base font-semibold">Email Address</Label>
              <div>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@barangaysantiago.gov.ph"
                  className="text-sm sm:text-base h-11 sm:h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="password" className="text-sm sm:text-base font-semibold">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pr-11 text-sm sm:text-base h-11 sm:h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:justify-between py-1 sm:py-2">
              <label className="inline-flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 sm:h-5 sm:w-5 rounded border-slate-300 text-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 cursor-pointer"
                  disabled={isLoading}
                />
                <span className="text-xs sm:text-sm font-medium">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-700 text-white shadow-lg shadow-emerald-700/20 hover:bg-emerald-800 h-11 sm:h-12 text-sm sm:text-base font-semibold mt-2 sm:mt-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>

            <p className="text-xs sm:text-sm text-center text-slate-600 pt-1 sm:pt-2">
              Don&apos;t have an account?{' '}
              <Link href="/resident/register" className="font-semibold text-emerald-700 hover:text-emerald-800 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
                Register here
              </Link>
            </p>
          </form>
        </motion.section>
      </div>
    </div>
  )
}
