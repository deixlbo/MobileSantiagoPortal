"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react"
import { createAdmin } from "@/lib/auth"
import { toast } from "sonner"

export default function AdminRegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const result = await createAdmin({
        email,
        password,
        firstName,
        lastName,
      })

      if (result.error) {
        toast.error(result.error)
        setIsLoading(false)
        return
      }

      toast.success("Admin account created successfully!")
      router.push("/admin/login")
    } catch (error) {
      toast.error("Failed to create admin account")
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Mobile Layout */}
      <div className="flex min-h-screen flex-col md:hidden">
        <div 
          className="relative h-[45vh] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/bg.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-red-700/60 via-red-600/40 to-red-500/20" />
          
          <Link 
            href="/admin/login"
            className="absolute top-4 left-4 z-20"
          >
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="relative flex-1 -mt-6 rounded-t-3xl bg-background px-6 pb-8 pt-14">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-background bg-red-600 shadow-lg overflow-hidden">
              <Image
                src="/images/santiagologo.jpg"
                alt="Barangay Santiago Logo"
                width={60}
                height={60}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </motion.div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight">CREATE ADMIN</h1>
            <p className="text-sm text-muted-foreground mt-1">System Administrator Setup</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  placeholder="First name" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  placeholder="Last name" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@barangaysantiago.gov.ph"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password (min 6 chars)"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  minLength={6}
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
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  id="confirmPassword" 
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm password"
                  className="pl-10 pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full text-base font-semibold bg-red-600 hover:bg-red-700" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                />
              ) : (
                "CREATE ACCOUNT"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link href="/admin/login" className="font-medium text-primary hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="relative hidden min-h-screen items-center justify-center overflow-hidden md:flex">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/bg.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-800/80 via-red-700/60 to-transparent" />
        </div>

        <Link 
          href="/admin/login"
          className="absolute top-6 left-6 z-20"
        >
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute left-16 top-1/2 -translate-y-1/2 text-white lg:left-24"
        >
          <h1 className="text-5xl font-bold lg:text-6xl">Admin Setup</h1>
          <p className="mt-4 max-w-xs text-lg text-white/90">
            Create your admin account for the system
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10 mx-4 w-full max-w-md ml-auto mr-16 lg:mr-24"
        >
          <Card className="border-0 shadow-2xl">
            <CardHeader className="pb-4 text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-600 shadow-lg overflow-hidden"
              >
                <Image
                  src="/images/santiagologo.jpg"
                  alt="Barangay Santiago Logo"
                  width={80}
                  height={80}
                  className="h-full w-full rounded-full object-cover"
                />
              </motion.div>
              <CardTitle className="text-2xl font-bold tracking-tight">CREATE ADMIN ACCOUNT</CardTitle>
              <CardDescription>System Administrator Setup</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="desktop-firstName">First Name</Label>
                    <Input 
                      id="desktop-firstName" 
                      placeholder="First name" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desktop-lastName">Last Name</Label>
                    <Input 
                      id="desktop-lastName" 
                      placeholder="Last name" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desktop-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      id="desktop-email" 
                      type="email" 
                      placeholder="admin@barangaysantiago.gov.ph"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desktop-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      id="desktop-password" 
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 6 characters"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                      minLength={6}
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
                  <Label htmlFor="desktop-confirm">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      id="desktop-confirm" 
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm password"
                      className="pl-10 pr-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required 
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </CardContent>
              <div className="px-6 pb-6 space-y-3">
                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "CREATE ADMIN ACCOUNT"}
                </Button>
                <Link href="/admin/login" className="block">
                  <Button variant="outline" className="w-full">Back to Login</Button>
                </Link>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </>
  )
}
