"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Lock, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSession, updatePassword } from "@/lib/auth"
import { toast } from "sonner"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [hasLinkError, setHasLinkError] = useState(false)

  useEffect(() => {
    const prepareSession = async () => {
      const search = window.location.search || (window.location.hash ? `?${window.location.hash.slice(1)}` : "")
      const params = new URLSearchParams(search)
      const urlHasToken = params.get("access_token") || params.get("type") === "recovery"
      if (!urlHasToken) {
        setHasLinkError(true)
        setIsReady(true)
        return
      }

      const { data, error } = await getSessionFromUrl()
      if (error || !data?.session) {
        setHasLinkError(true)
      }
      setIsReady(true)
    }

    prepareSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await updatePassword(newPassword)
      if (error) {
        toast.error(error.message || "Unable to update password.")
        setIsLoading(false)
        return
      }
      toast.success("Password reset successfully. Please sign in.")
      setIsLoading(false)
      await router.push("/")
    } catch (err) {
      toast.error("Unable to update password. Please try again.")
      setIsLoading(false)
    }
  }

  if (!isReady) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6">
        <div className="rounded-3xl bg-white p-10 shadow-lg shadow-slate-200/80">
          <p className="text-lg font-medium">Preparing secure password reset...</p>
        </div>
      </div>
    )
  }

  if (hasLinkError) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-[32px] border border-slate-200 bg-white p-10 shadow-lg shadow-slate-200/80">
          <div className="mb-6 flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-emerald-700" />
            <div>
              <h1 className="text-2xl font-semibold text-slate-950">Invalid reset link</h1>
              <p className="text-sm text-slate-600">Please request a new password reset email and follow the link from your inbox.</p>
            </div>
          </div>
          <Link href="/forgot-password" className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-white hover:bg-emerald-800">
            Request a new reset link
          </Link>
        </div>
      </div>
    )
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
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Reset your password</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Create a new password</h1>
            </div>
          </div>

          <p className="mb-8 max-w-2xl text-sm leading-6 text-slate-600">
            Use the secure link from your email to choose a new password. After resetting, sign in again with your updated credentials.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="new-password">New password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  className="pl-12"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  className="pl-12"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-emerald-700 text-white hover:bg-emerald-800" disabled={isLoading}>
              {isLoading ? (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                "Set new password"
              )}
            </Button>
          </form>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-600">
            <p>
              Already have a password?{' '}
              <Link href="/" className="font-medium text-emerald-700 hover:text-emerald-800">
                Back to sign in
              </Link>
            </p>
            <p className="inline-flex items-center gap-2 text-slate-500">
              <ShieldCheck className="h-4 w-4" />
              Secure password reset
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
