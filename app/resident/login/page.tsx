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
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { authenticateResident } from "@/lib/mock-auth"
import { toast } from "sonner"

export default function ResidentLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const user = authenticateResident(email, password)
    
    if (user) {
      router.push("/resident")
    } else {
      toast.error("Invalid email or password. Try: juan@example.com / password123")
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Mobile Layout */}
      <div className="flex min-h-screen flex-col md:hidden">
        {/* Top Half - Background Image */}
        <div 
          className="relative h-[45vh] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/bg.jpg')",
          }}
        />


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
            <h1 className="text-2xl font-bold tracking-tight">RESIDENT LOGIN</h1>
            <p className="text-sm text-muted-foreground mt-1">Access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-mobile">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  id="email-mobile" 
                  type="email" 
                  placeholder="Enter your email"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password-mobile">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  id="password-mobile" 
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Demo credentials hint */}
            <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              <p className="font-medium">Demo Credentials:</p>
              <p>Email: juan@example.com</p>
              <p>Password: password123</p>
            </div>

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
                "SIGN IN"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/resident/register" className="font-medium text-primary hover:underline">
                Register here
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
        />

        {/* Login Card */}
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
                className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-lg overflow-hidden"
              >
                <Image
                  src="/images/santiagologo.jpg"
                  alt="Barangay Santiago Logo"
                  width={80}
                  height={80}
                  className="h-full w-full rounded-full object-cover"
                />
              </motion.div>
              <CardTitle className="text-2xl font-bold tracking-tight">RESIDENT LOGIN</CardTitle>
              <CardDescription>
                Access your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                </motion.div>
                
                {/* Demo credentials hint */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground"
                >
                  <p className="font-medium">Demo Credentials:</p>
                  <p>Email: juan@example.com</p>
                  <p>Password: password123</p>
                </motion.div>
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
                      "SIGN IN"
                    )}
                  </Button>
                </motion.div>
                <p className="text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link href="/resident/register" className="font-medium text-primary hover:underline">
                    Register here
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
