"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Mail, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sendPasswordResetEmail } from "@/lib/auth"
import { toast } from "sonner"

const PASSWORD_RESET_COOLDOWN_KEY = "password-reset-cooldown-until"
const PASSWORD_RESET_COOLDOWN_SECONDS = 60

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    const storedUntil = localStorage.getItem(PASSWORD_RESET_COOLDOWN_KEY)
    if (storedUntil) {
      const until = Number(storedUntil)
      const remaining = Math.max(0, Math.ceil((until - Date.now()) / 1000))
      if (remaining > 0) {
        setCooldown(remaining)
      } else {
        localStorage.removeItem(PASSWORD_RESET_COOLDOWN_KEY)
      }
    }

    const interval = window.setInterval(() => {
      setCooldown((current) => {
        if (current <= 1) {
          localStorage.removeItem(PASSWORD_RESET_COOLDOWN_KEY)
          window.clearInterval(interval)
          return 0
        }
        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [])

  const startCooldown = () => {
    const until = Date.now() + PASSWORD_RESET_COOLDOWN_SECONDS * 1000
    localStorage.setItem(PASSWORD_RESET_COOLDOWN_KEY, until.toString())
    setCooldown(PASSWORD_RESET_COOLDOWN_SECONDS)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cooldown > 0) {
      toast.error(`Please wait ${cooldown} seconds before requesting another link.`)
      return
    }

    setIsLoading(true)

    try {
      const redirectTo = `${window.location.origin}/reset-password`
      const { data, error } = await sendPasswordResetEmail(email, redirectTo)
      if (error) {
        const isRateLimit = error.status === 429 || /rate limit/i.test(error.message || "")
        const message = isRateLimit
          ? "You have requested too many reset emails. Please try again shortly."
          : error.message || "Unable to send reset email."
        toast.error(message)
        if (isRateLimit) {
          startCooldown()
        }
        setIsLoading(false)
        return
      }

      toast.success("Password reset link sent. Check your email.")
      setEmail("")
      startCooldown()
      setIsLoading(false)
    } catch (err) {
      toast.error("Unable to send reset email. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-950">
      <div className="pointer-events-none absolute left-0 top-0 h-[30rem] w-[30rem] -translate-x-1/3 -translate-y-1/3 rounded-full bg-[radial-gradient(circle_at_top_left,_rgba(159,230,163,0.28),transparent_55%)] blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle_at_top_right,_rgba(120,187,113,0.20),transparent_55%)] blur-3xl" />
      <div className="pointer-events-none absolute left-0 bottom-0 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle_at_bottom_left,_rgba(143,214,178,0.18),transparent_55%)] blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-[1200px] flex-col justify-center px-8 py-10 sm:px-10 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-3xl rounded-[38px] border border-slate-200/70 bg-white/95 p-10 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
          <div className="mb-10 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-3xl bg-emerald-50 shadow-sm shadow-emerald-100">
              <Image
                src="/images/santiagologo.jpg"
                alt="Barangay Santiago Logo"
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Password recovery</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Forgot your password?</h1>
            </div>
          </div>

          <p className="mb-8 max-w-2xl text-sm leading-6 text-slate-600">
            Enter the email address for your account and we&apos;ll send a secure password reset link. Use the link to set a new password and sign in again.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-700 text-white hover:bg-emerald-800"
              disabled={isLoading || cooldown > 0}
            >
              {isLoading ? (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : cooldown > 0 ? (
                `Wait ${cooldown}s`
              ) : (
                "Send reset link"
              )}
            </Button>
            {cooldown > 0 && (
              <p className="text-sm text-amber-700">You can request another link in {cooldown} seconds.</p>
            )}
          </form>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-600">
            <p>
              Remembered your password?{' '}
              <Link href="/" className="font-medium text-emerald-700 hover:text-emerald-800">
                Back to sign in
              </Link>
            </p>
            <p className="inline-flex items-center gap-2 text-slate-500">
              <ShieldCheck className="h-4 w-4" />
              Secure reset via email
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
