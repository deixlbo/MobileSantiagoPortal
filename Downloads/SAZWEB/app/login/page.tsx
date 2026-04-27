<<<<<<< HEAD
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import type { UserRole } from '@/lib/types';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { login, authError, clearError } = useAuth();
  const [role, setRole] = useState<UserRole>('resident');
  const [email, setEmail] = useState('juan@email.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRoleSwitch = (r: UserRole) => {
    setRole(r);
    clearError();
    setEmail(r === 'resident' ? 'juan@email.com' : 'captain@brgy-santiago.gov.ph');
    setPassword('password');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    const success = await login(email, password, role);
    setLoading(false);
    if (success) {
      router.push(role === 'resident' ? '/resident/dashboard' : '/official/dashboard');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.scroll}>
        <div className={styles.content}>
          <div className={styles.logoWrap}>
            <div className={styles.logoCircle}>
              <span className={styles.logoEmoji}>🏛️</span>
            </div>
            <h1 className={styles.logoTitle}>Barangay Santiago</h1>
            <p className={styles.logoSub}>Community Portal</p>
          </div>

          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.roleSwitch}>
              <button
                type="button"
                className={`${styles.roleBtn} ${role === 'resident' ? styles.active : ''}`}
                onClick={() => handleRoleSwitch('resident')}
              >
                Resident
              </button>
              <button
                type="button"
                className={`${styles.roleBtn} ${role === 'official' ? styles.active : ''}`}
                onClick={() => handleRoleSwitch('official')}
              >
                Official
              </button>
            </div>

            {authError && (
              <div className={styles.error}>
                {authError}
              </div>
            )}

            <div className={styles.inputGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Password</label>
              <div className={styles.passwordInput}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.eyeBtn}
                  disabled={loading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className={styles.submitBtn}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className={styles.helpText}>
              {role === 'resident'
                ? 'Demo account: juan@email.com'
                : 'Demo account: captain@brgy-santiago.gov.ph'}
              <br />
              Password: password (4+ chars)
            </p>
          </form>
        </div>
      </div>
    </div>
  );
=======
"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Shield, Eye, EyeOff, ArrowLeft, Info } from "lucide-react"
import { useAuth, mockUsers } from "@/lib/auth"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isAuthenticated, user } = useAuth()
  
  const [activeTab, setActiveTab] = useState<string>("resident")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const portal = searchParams.get("portal")
    if (portal === "official") {
      setActiveTab("official")
    }
  }, [searchParams])

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/resident")
      }
    }
  }, [isAuthenticated, user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const users = activeTab === "official" ? mockUsers.officials : mockUsers.residents
    const foundUser = users.find(u => u.email === email && u.password === password)

    if (foundUser) {
      login({
        id: foundUser.id,
        email: foundUser.email,
        fullName: foundUser.fullName,
        role: foundUser.role,
        residentId: 'residentId' in foundUser ? foundUser.residentId : undefined,
        position: 'position' in foundUser ? foundUser.position : undefined,
      })
    } else {
      setError("Invalid email or password. Please try again.")
    }

    setIsLoading(false)
  }

  const fillDemoCredentials = (type: "official" | "resident") => {
    if (type === "official") {
      setEmail(mockUsers.officials[0].email)
      setPassword(mockUsers.officials[0].password)
    } else {
      setEmail(mockUsers.residents[0].email)
      setPassword(mockUsers.residents[0].password)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 py-8 md:py-12">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-xl font-bold">Barangay Santiago</h1>
            <p className="text-sm text-muted-foreground">Sign in to access barangay services</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger value="resident" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Resident</span>
              </TabsTrigger>
              <TabsTrigger value="official" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Official</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resident" className="mt-4">
              <Card>
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-xl">Resident Portal</CardTitle>
                  <CardDescription>
                    Access your document requests, blotter reports, and community updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="resident-email">Email</Label>
                      <Input
                        id="resident-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resident-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="resident-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex-col gap-4 border-t pt-4">
                  <div className="w-full">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Info className="w-3 h-3" />
                      <span>Demo Credentials</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => fillDemoCredentials("resident")}
                    >
                      Fill Demo Credentials
                    </Button>
                    <div className="mt-2 p-2 rounded bg-muted text-xs space-y-1">
                      <p><span className="text-muted-foreground">Email:</span> juan.delacruz@email.com</p>
                      <p><span className="text-muted-foreground">Password:</span> resident123</p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="official" className="mt-4">
              <Card>
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-xl">Official Portal</CardTitle>
                  <CardDescription>
                    Manage residents, documents, blotters, and barangay operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="official-email">Email</Label>
                      <Input
                        id="official-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="official-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="official-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex-col gap-4 border-t pt-4">
                  <div className="w-full">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Info className="w-3 h-3" />
                      <span>Demo Credentials</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => fillDemoCredentials("official")}
                    >
                      Fill Demo Credentials
                    </Button>
                    <div className="mt-2 p-2 rounded bg-muted text-xs space-y-1">
                      <p><span className="text-muted-foreground">Email:</span> captain@barangaysantiago.gov.ph</p>
                      <p><span className="text-muted-foreground">Password:</span> admin123</p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
}
