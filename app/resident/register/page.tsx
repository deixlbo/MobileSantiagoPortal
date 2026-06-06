"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, User, MapPin, Briefcase, Users, Check, X, ShieldCheck } from "lucide-react"
import { signUpResident } from "@/lib/auth"
import { toast } from "sonner"

export default function ResidentRegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    purok: "",
    gender: "",
    occupation: "",
    documentType: "",
    contactNumber: "",
    address: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  })

  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [documentPreview, setDocumentPreview] = useState<string | null>(null)

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all required fields")
      return
    }

    if (!formData.contactNumber || !formData.dateOfBirth || !formData.address) {
      toast.error("Please provide contact number, address, and date of birth")
      return
    }

    if (!formData.gender || !(formData.gender === 'male' || formData.gender === 'female')) {
      toast.error('Please select gender: male or female')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    if (!privacyAccepted) {
      toast.error("Please accept the Data Privacy statement")
      return
    }

    setIsLoading(true)
    try {
      const result = await signUpResident({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        purok: formData.purok,
        gender: formData.gender,
        occupation: formData.occupation,
        documentType: formData.documentType,
        documentFile: documentFile ?? undefined,
        contactNumber: formData.contactNumber,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
      })
      if (result.error) {
        toast.error(result.error.message || "Registration failed. Please try again.")
        setIsLoading(false)
        return
      }
      toast.success("Registration successful! Please check your email to verify your account.")
      router.push("/resident/login")
    } catch (error) {
      toast.error("Unable to register. Please try again.")
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
              <p className="text-sm text-slate-600">Resident registration</p>
            </div>
          </div>

          <div className="mt-12 max-w-2xl space-y-6">
            <h1 className="text-6xl font-semibold tracking-tight text-slate-950 sm:text-7xl">Create your account</h1>
            <p className="text-lg leading-8 text-slate-700">
              Register for Barangay Santiago’s resident portal to access services, announcements, and official records.
            </p>
          </div>

          <div className="mt-14 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-sm shadow-slate-100">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <User className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-950">Transparency</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Open resident registration and service updates.</p>
            </div>
            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-sm shadow-slate-100">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-950">Integrity</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Secure verification of residents and identity details.</p>
            </div>
            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-sm shadow-slate-100">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-950">Community</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Connected access for residents and local government services.</p>
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
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Resident account</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">Register securely</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Create a registered account to request documents, view records, and receive community announcements.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="firstName">First name</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="firstName"
                    placeholder="First name"
                    className="pl-11"
                    value={formData.firstName}
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
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-11"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="purok">Purok</Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="purok"
                    placeholder="Your purok"
                    className="pl-11"
                    value={formData.purok}
                    onChange={(e) => handleChange('purok', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="occupation">Occupation</Label>
                <div className="relative">
                  <Briefcase className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="occupation"
                    placeholder="Your occupation"
                    className="pl-11"
                    value={formData.occupation}
                    onChange={(e) => handleChange('occupation', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="documentType">ID card type</Label>
                <select
                  id="documentType"
                  value={formData.documentType}
                  onChange={(e) => handleChange('documentType', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">Select ID type</option>
                  <option value="drivers_license">Driver's License</option>
                  <option value="umid">UMID</option>
                  <option value="passport">Passport</option>
                  <option value="voter_id">Voter ID</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="contactNumber">Contact number</Label>
                <Input
                  id="contactNumber"
                  type="tel"
                  placeholder="09xx-xxx-xxxx"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  value={formData.contactNumber}
                  onChange={(e) => handleChange('contactNumber', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="dateOfBirth">Date of birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="House number, street, barangay"
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    className="pl-11 pr-11"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    required
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
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="pl-11 pr-11"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Professional verification</Label>
              <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                {(() => {
                  const pwd = formData.password || ""
                  const checks = {
                    length: pwd.length >= 6,
                    number: /\d/.test(pwd),
                    upper: /[A-Z]/.test(pwd),
                    special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
                  }
                  return (
                    <>
                      <div className="flex items-center gap-2">
                        {checks.length ? <Check className="h-4 w-4 text-emerald-600" /> : <X className="h-4 w-4 text-slate-400" />}
                        <span>At least 6 characters</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {checks.number ? <Check className="h-4 w-4 text-emerald-600" /> : <X className="h-4 w-4 text-slate-400" />}
                        <span>Contains a number</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {checks.upper ? <Check className="h-4 w-4 text-emerald-600" /> : <X className="h-4 w-4 text-slate-400" />}
                        <span>Contains uppercase</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {checks.special ? <Check className="h-4 w-4 text-emerald-600" /> : <X className="h-4 w-4 text-slate-400" />}
                        <span>Contains special char</span>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                id="privacy"
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <div className="text-sm text-slate-600">
                <label htmlFor="privacy" className="font-medium">I agree to the Data Privacy statement</label>
                <p className="mt-1">I acknowledge that the personal data I provide will be used solely for portal purposes and will not be used for any other purpose.</p>
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
              <Link href="/resident/login" className="font-medium text-emerald-700 hover:text-emerald-800">
                Sign in
              </Link>
            </p>
          </form>
        </motion.section>
      </div>
    </div>
  )
}
