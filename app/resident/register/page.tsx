"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUpResident } from "@/lib/auth"
import { getErrorMessage } from "@/lib/utils"
import { toast } from "sonner"

export default function ResidentRegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    email: "",
    purok: "",
    gender: "",
    civilStatus: "",
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image or PDF file (JPEG, PNG, WebP, PDF)')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    setDocumentFile(file)
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setDocumentPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setDocumentPreview(null)
    }

    toast.success(`File "${file.name}" uploaded successfully`)
  }

  const removeDocument = () => {
    setDocumentFile(null)
    setDocumentPreview(null)
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
      toast.error('Please select a valid gender')
      return
    }

    if (!formData.civilStatus) {
      toast.error('Please select your civil status')
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

    if (formData.documentType && !documentFile) {
      toast.error("Please upload an ID document for verification")
      return
    }

    setIsLoading(true)
    try {
      const result = await signUpResident({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        suffix: formData.suffix,
        civilStatus: formData.civilStatus,
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
        toast.error(getErrorMessage(result.error, "Registration failed. Please try again."))
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
      <div className="pointer-events-none hidden lg:block absolute left-0 top-0 h-[30rem] w-[30rem] -translate-x-1/3 -translate-y-1/3 rounded-full bg-[radial-gradient(circle_at_top_left,_rgba(159,230,163,0.28),transparent_55%)] blur-3xl" />
      <div className="pointer-events-none hidden lg:block absolute right-0 top-24 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle_at_top_right,_rgba(120,187,113,0.20),transparent_55%)] blur-3xl" />
      <div className="pointer-events-none hidden lg:block absolute left-0 bottom-0 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle_at_bottom_left,_rgba(143,214,178,0.18),transparent_55%)] blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-[1400px] flex-col justify-center gap-10 px-4 py-8 sm:px-6 sm:py-10 lg:flex-row lg:items-start lg:px-12 xl:px-16">
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
              <p className="text-sm text-slate-600">Resident registration</p>
            </div>
          </div>

          <div className="mt-12 max-w-2xl space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">Create your account</h1>
            <p className="text-lg leading-8 text-slate-700">
              Register for Barangay Santiago’s resident portal to access services, announcements, and official records.
            </p>
          </div>

          {/* Info cards removed per request */}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="w-full rounded-[38px] border border-slate-200/70 bg-white/95 p-6 sm:p-8 lg:p-10 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.18)] backdrop-blur-xl lg:w-[38rem]"
        >
          <div className="mb-10">
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Resident account</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">Register securely</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Create a registered account to request documents, view records, and receive community announcements.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-3">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="middleName">Middle name</Label>
                <Input
                  id="middleName"
                  placeholder="Middle name"
                  value={formData.middleName}
                  onChange={(e) => handleChange('middleName', e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="suffix">Suffix</Label>
                <select
                  id="suffix"
                  value={formData.suffix}
                  onChange={(e) => handleChange('suffix', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">N/A</option>
                  <option value="Jr.">Jr.</option>
                  <option value="Sr.">Sr.</option>
                  <option value="III">III</option>
                  <option value="IV">IV</option>
                  <option value="V">V</option>
                  <option value="PhD">PhD</option>
                  <option value="MD">MD</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-3">
                <Label htmlFor="dateOfBirth">Birth date</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  required
                />
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
              <div className="space-y-3">
                <Label htmlFor="civilStatus">Civil status</Label>
                <select
                  id="civilStatus"
                  value={formData.civilStatus}
                  onChange={(e) => handleChange('civilStatus', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">Select civil status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="widowed">Widowed</option>
                  <option value="separated">Separated</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="contactNumber">Phone number</Label>
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
                <Label htmlFor="purok">Purok</Label>
                <select
                  id="purok"
                  value={formData.purok}
                  onChange={(e) => handleChange('purok', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">Select Purok</option>
                  <option value="Purok 1">Purok 1</option>
                  <option value="Purok 2">Purok 2</option>
                  <option value="Purok 3">Purok 3</option>
                  <option value="Purok 4">Purok 4</option>
                  <option value="Purok 5">Purok 5</option>
                  <option value="Purok 6">Purok 6</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="address">Complete address</Label>
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
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  placeholder="Your occupation"
                  value={formData.occupation}
                  onChange={(e) => handleChange('occupation', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="documentType">ID document type</Label>
                <select
                  id="documentType"
                  value={formData.documentType}
                  onChange={(e) => handleChange('documentType', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">Select ID document</option>
                  <option value="valid_id">Valid ID</option>
                  <option value="cedula">Cedula</option>
                  <option value="proof_of_residency">Proof of Residency</option>
                  <option value="business_registration">Business Registration</option>
                </select>
              </div>
            </div>

            {/* Conditional Document Upload Section */}
            {formData.documentType && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="space-y-3 rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-50/50 p-6"
              >
                <Label htmlFor="documentFile" className="flex items-center gap-2">
                  <span>Upload {formData.documentType.replace('_', ' ').toUpperCase()} (Required)</span>
                </Label>

                {!documentFile ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        id="documentFile"
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,.pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                      <div className="rounded-xl border-2 border-dashed border-emerald-300 bg-white p-8 text-center transition hover:border-emerald-500 hover:bg-emerald-50">
                        <p className="text-sm font-medium text-slate-900">Click to upload or drag and drop</p>
                        <p className="mt-1 text-xs text-slate-500">JPEG, PNG, WebP or PDF (max. 10MB)</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">
                      Upload a clear photo of your {formData.documentType.replace('_', ' ').toLowerCase()} for verification.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="rounded-xl border border-emerald-300 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          {documentPreview && (
                            <div className="flex-shrink-0">
                              <img
                                src={documentPreview}
                                alt="ID Preview"
                                className="h-20 w-20 rounded-lg object-cover border border-slate-200"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 break-words">{documentFile.name}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              {(documentFile.size / 1024).toFixed(2)} KB
                            </p>
                            <p className="text-xs text-emerald-600 mt-2">
                              Ready for submission
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeDocument}
                          className="flex-shrink-0 rounded bg-slate-100 px-3 py-1 text-slate-600 hover:bg-red-100 hover:text-red-600 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    className="pr-11"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
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
              <div className="space-y-3">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="pr-11"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-slate-600 transition hover:text-slate-900"
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            </div>

            {formData.password.length > 0 && (
              <div className="space-y-3">
                <Label>Professional verification</Label>
                <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                  {(() => {
                    const pwd = formData.password
                    const checks = {
                      length: pwd.length >= 6,
                      number: /\d/.test(pwd),
                      upper: /[A-Z]/.test(pwd),
                      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
                    }
                    return (
                      <>
                        <div className="space-y-2">
                          <p className={checks.length ? 'text-emerald-600' : ''}>At least 6 characters</p>
                          <p className={checks.number ? 'text-emerald-600' : ''}>Contains a number</p>
                          <p className={checks.upper ? 'text-emerald-600' : ''}>Contains uppercase</p>
                          <p className={checks.special ? 'text-emerald-600' : ''}>Contains special char</p>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <input
                id="privacy"
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <div className="text-sm text-slate-600">
                <label htmlFor="privacy" className="font-medium">
                  I agree to the Privacy Policy and Terms of Service
                </label>
                <p className="mt-1">
                  I understand how my information will be used. Read the{' '}
                  <Link href="/privacy-policy" className="font-medium text-emerald-700 underline hover:text-emerald-800">
                    Privacy Policy
                  </Link>{' '}
                  and{' '}
                  <Link href="/terms-of-service" className="font-medium text-emerald-700 underline hover:text-emerald-800">
                    Terms of Service
                  </Link>{' '}
                  before submitting.
                </p>
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

            <div className="space-y-3 text-sm text-slate-600">
              <p>
                Already have an account?{' '}
                <Link href="/resident/login" className="font-medium text-emerald-700 hover:text-emerald-800">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </motion.section>
      </div>
    </div>
  )
}
