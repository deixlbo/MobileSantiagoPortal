"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Mail, Lock, User, MapPin, Upload } from "lucide-react"
import { signUpResident } from "@/lib/auth"
import { toast } from "sonner"

const purokOptions = [
  "Purok 1",
  "Purok 2",
  "Purok 3",
  "Purok 4",
  "Purok 5",
  "Purok 6",
  "Purok 7",
]

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
]

export default function ResidentRegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    purok: "",
    gender: "",
    occupation: "",
  })
  
  const [documentFile, setDocumentFile] = useState<File | null>(null)

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters")
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
        documentFile: documentFile || undefined,
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

  const FormFields = ({ idPrefix }: { idPrefix: string }) => (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-firstName`}>First Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              id={`${idPrefix}-firstName`}
              type="text" 
              placeholder="First name"
              className="pl-10"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              required 
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-lastName`}>Last Name</Label>
          <Input 
            id={`${idPrefix}-lastName`}
            type="text" 
            placeholder="Last name"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            required 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-email`}>Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            id={`${idPrefix}-email`}
            type="email" 
            placeholder="Enter your email"
            className="pl-10"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-purok`}>Purok</Label>
          <Select value={formData.purok} onValueChange={(value) => handleChange("purok", value)}>
            <SelectTrigger id={`${idPrefix}-purok`}>
              <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
              <SelectValue placeholder="Select purok" />
            </SelectTrigger>
            <SelectContent>
              {purokOptions.map((purok) => (
                <SelectItem key={purok} value={purok}>{purok}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-gender`}>Gender</Label>
          <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
            <SelectTrigger id={`${idPrefix}-gender`}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {genderOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-occupation`}>Occupation (Optional)</Label>
        <Input 
          id={`${idPrefix}-occupation`}
          type="text" 
          placeholder="Enter your occupation"
          value={formData.occupation}
          onChange={(e) => handleChange("occupation", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-document`}>Valid ID (Optional)</Label>
        <div className="relative">
          <Input 
            id={`${idPrefix}-document`}
            type="file" 
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
        </div>
        {documentFile && (
          <p className="text-xs text-muted-foreground">
            Selected: {documentFile.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-password`}>Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            id={`${idPrefix}-password`}
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            className="pl-10 pr-10"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required 
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-confirmPassword`}>Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            id={`${idPrefix}-confirmPassword`}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            className="pl-10 pr-10"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            required 
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Layout */}
      <div className="flex min-h-screen flex-col md:hidden">
        {/* Top Half - Background Image */}
        <div 
          className="relative h-[30vh] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/bg.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-green-700/60 via-green-600/40 to-green-500/20" />
        </div>

        {/* Bottom Half - Form */}
        <div className="relative flex-1 -mt-6 rounded-t-3xl bg-background px-6 pb-8 pt-14">
          {/* Floating Logo */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-background bg-primary shadow-lg overflow-hidden">
              <Image
                src="/images/santiagologo.jpg"
                alt="Barangay Santiago Logo"
                width={60}
                height={60}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </motion.div>

          {/* Form Content */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight">RESIDENT REGISTRATION</h1>
            <p className="text-sm text-muted-foreground mt-1">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormFields idPrefix="mobile" />

            <Button 
              type="submit" 
              className="w-full text-base font-semibold" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-5 w-5 rounded-full border-2 border-primary-foreground border-t-transparent"
                />
              ) : (
                "REGISTER"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/resident/login" className="font-medium text-primary hover:underline">
                Sign in here
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="relative hidden min-h-screen items-center justify-center overflow-hidden md:flex">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/bg.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-800/80 via-green-700/60 to-transparent" />
        </div>

        {/* Welcome Text */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute left-16 top-1/2 -translate-y-1/2 text-white lg:left-24"
        >
          <h1 className="text-5xl font-bold lg:text-6xl">Join Us</h1>
          <p className="mt-4 max-w-xs text-lg text-white/90">
            Barangay Santiago Resident Portal
          </p>
        </motion.div>

        {/* Registration Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10 mx-4 w-full max-w-md ml-auto mr-16 lg:mr-24 my-8"
        >
          <Card className="border-0 shadow-2xl">
            <CardHeader className="pb-4 text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg overflow-hidden"
              >
                <Image
                  src="/images/santiagologo.jpg"
                  alt="Barangay Santiago Logo"
                  width={64}
                  height={64}
                  className="h-full w-full rounded-full object-cover"
                />
              </motion.div>
              <CardTitle className="text-xl font-bold tracking-tight">RESIDENT REGISTRATION</CardTitle>
              <CardDescription>
                Create your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-3">
                <FormFields idPrefix="desktop" />
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="w-full"
                >
                  <Button 
                    type="submit" 
                    className="w-full text-base font-semibold" 
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-5 w-5 rounded-full border-2 border-primary-foreground border-t-transparent"
                      />
                    ) : (
                      "REGISTER"
                    )}
                  </Button>
                </motion.div>
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/resident/login" className="font-medium text-primary hover:underline">
                    Sign in here
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </>
  )
}
