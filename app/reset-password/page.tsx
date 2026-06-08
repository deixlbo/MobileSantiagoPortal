'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ShieldCheck, AlertCircle, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { getErrorMessage } from '@/lib/utils'

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const token = searchParams.get('token')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  if (!token) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-white text-slate-950">
        <div className="pointer-events-none absolute left-0 top-0 h-[30rem] w-[30rem] -translate-x-1/3 -translate-y-1/3 rounded-full bg-[radial-gradient(circle_at_top_left,_rgba(159,230,163,0.28),transparent_55%)] blur-3xl" />

        <div className="relative mx-auto flex min-h-screen max-w-[1200px] flex-col justify-center px-8 py-10 sm:px-10 lg:px-16 xl:px-24">
          <div className="mx-auto w-full max-w-3xl rounded-[38px] border border-red-200/70 bg-red-50/95 p-10 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.18)]">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-red-900">Invalid reset link</h1>
                <p className="text-sm text-red-700 mt-1">The password reset link is missing or invalid.</p>
              </div>
            </div>

            <p className="mb-6 text-sm text-red-800">
              Please request a new password reset email from the login page.
            </p>

            <Link href="/forgot-password">
              <Button className="w-full bg-red-600 hover:bg-red-700">
                Request a new reset link
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const validatePassword = (): boolean => {
    const newErrors: string[] = []

    if (!newPassword) {
      newErrors.push('New password is required')
    } else if (newPassword.length < 8) {
      newErrors.push('Password must be at least 8 characters')
    }

    if (!confirmPassword) {
      newErrors.push('Confirm password is required')
    } else if (newPassword !== confirmPassword) {
      newErrors.push('Passwords do not match')
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePassword()) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword
        })
      })

      const result = await response.json()

      if (!response.ok) {
        const errorMessage = getErrorMessage(result.error, 'Failed to reset password')
        setErrors([errorMessage])
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive'
        })
        return
      }

      toast({
        title: 'Success',
        description: 'Password reset successfully!'
      })

      setTimeout(() => {
        router.push('/resident/login')
      }, 2000)
    } catch (err) {
      console.error('[v0] Reset password error:', err)
      setErrors(['An error occurred. Please try again.'])
      toast({
        title: 'Error',
        description: 'An error occurred while resetting your password'
      })
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
              <ShieldCheck className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Reset your password</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Create a new password</h1>
            </div>
          </div>

          <p className="mb-8 max-w-2xl text-sm leading-6 text-slate-600">
            Use the secure link from your email to choose a new password. After resetting, you can sign in again with your updated credentials.
          </p>

          {errors.length > 0 && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 space-y-2">
              {errors.map((error, idx) => (
                <p key={idx} className="text-sm text-red-700 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </p>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="new-password">New password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value)
                    setErrors([])
                  }}
                  minLength={8}
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-slate-500">Minimum 8 characters</p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setErrors([])
                  }}
                  minLength={8}
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-emerald-700 text-white hover:bg-emerald-800" 
              disabled={isLoading || !newPassword || !confirmPassword}
            >
              {isLoading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Resetting password...
                </>
              ) : (
                'Set new password'
              )}
            </Button>
          </form>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-600">
            <p>
              Ready to login?{' '}
              <Link href="/resident/login" className="font-medium text-emerald-700 hover:text-emerald-800">
                Back to sign in
              </Link>
            </p>
            <p className="text-sm text-slate-600">
              Or{' '}
              <Link href="/resident/login" className="font-medium text-emerald-700 hover:text-emerald-800">
                Return to sign in
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader className="h-8 w-8 animate-spin" /></div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
