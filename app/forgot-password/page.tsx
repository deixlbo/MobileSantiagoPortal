"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sendPasswordResetEmail } from "@/lib/auth"
import { getErrorMessage } from "@/lib/utils"
import { toast } from "sonner"
import { checkRateLimit, setRateLimit } from "@/lib/rate-limit"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  // Start cooldown timer if stored in localStorage
  useEffect(() => {
    const { secondsRemaining } = checkRateLimit('forgot-password', email || 'general')
    if (secondsRemaining > 0) {
      setCooldown(secondsRemaining)
    }
  }, [email])

  // Update cooldown timer every second
  useEffect(() => {
    if (cooldown <= 0) return

    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [cooldown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check client-side rate limit
    const { allowed, secondsRemaining } = checkRateLimit('forgot-password', email)
    if (!allowed) {
      toast.error(`Please wait ${secondsRemaining} seconds before trying again.`)
      return
    }

    setIsLoading(true)

    try {
      const redirectTo = `${window.location.origin}/reset-password`
      const { data, error } = await sendPasswordResetEmail(email, redirectTo)

      if (error) {
        const message = getErrorMessage(error, "Unable to send reset email. Please try again.")
        
        // Check if it's a rate limit error
        if (message.includes('Too many') || message.includes('rate')) {
          // Set rate limit for 1 hour (3600 seconds)
          setRateLimit('forgot-password', email, 3600)
          setCooldown(3600)
          toast.error('Too many attempts. Please try again in 1 hour.')
        } else {
          toast.error(message)
        }
        
        setIsLoading(false)
        return
      }

      // Set rate limit for 5 minutes on success
      setRateLimit('forgot-password', email, 300)
      setCooldown(300)
      
      toast.success("Password reset link sent. Check your email.")
      setEmail("")
    } catch (err) {
      toast.error("Unable to send reset email. Please try again.")
    } finally {
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
                src="/logos/santiago-logo.png"
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
              <div>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
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
              <p className="text-sm text-amber-700">
                {cooldown > 300 
                  ? `Rate limited. Please try again in ${Math.ceil(cooldown / 60)} minutes.`
                  : `You can request another link in ${cooldown} seconds.`
                }
              </p>
            )}
          </form>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-600">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <p>
                Remembered your password?{' '}
                <Link href="/resident/login" className="font-medium text-emerald-700 hover:text-emerald-800">
                  Return to sign in
                </Link>
              </p>
            </div>
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
