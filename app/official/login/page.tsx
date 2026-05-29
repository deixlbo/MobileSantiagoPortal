"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert, Users, ChevronRight } from "lucide-react"

export default function OfficialLoginPage() {
  const roles = [
    {
      id: "official",
      title: "Official Portal",
      description: "For Barangay officials (Captain, Secretary, Kagawad)",
      icon: Users,
      href: "/official/login-form",
    },
    {
      id: "admin",
      title: "Admin Dashboard",
      description: "For system administrators and super users",
      icon: ShieldAlert,
      href: "/admin/login",
    },
  ]

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
          <div className="absolute inset-0 bg-gradient-to-b from-green-700/60 via-green-600/40 to-green-500/20" />
        </div>

        <div className="relative flex-1 -mt-6 rounded-t-3xl bg-background px-6 pb-8 pt-14">
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

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Portal Login</h1>
            <p className="text-sm text-muted-foreground mt-1">Barangay Santiago Management System</p>
          </div>

          <div className="space-y-4">
            {roles.map((role, index) => {
              const Icon = role.icon
              return (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={role.href}>
                    <Card className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border-2">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="rounded-lg bg-primary/10 p-3">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{role.title}</h3>
                            <p className="text-sm text-muted-foreground">{role.description}</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground mt-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          <Link href="/" className="mt-8">
            <Button variant="ghost" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative hidden min-h-screen items-center justify-center overflow-hidden md:flex">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/bg.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-800/80 via-green-700/60 to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute left-16 top-1/2 -translate-y-1/2 text-white lg:left-24"
        >
          <h1 className="text-5xl font-bold lg:text-6xl">Portal Access</h1>
          <p className="mt-4 max-w-xs text-lg text-white/90">Barangay Santiago Management System</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10 mx-4 w-full max-w-2xl ml-auto mr-16 lg:mr-24"
        >
          <Card className="border-0 shadow-2xl">
            <CardHeader className="pb-6 text-center">
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
              <CardTitle className="text-2xl font-bold tracking-tight">Portal Login</CardTitle>
              <CardDescription>Select your login type to proceed</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {roles.map((role, index) => {
                const Icon = role.icon
                return (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Link href={role.href}>
                      <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 border-2">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div className="rounded-lg bg-primary/10 p-3">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{role.title}</h3>
                              <p className="text-sm text-muted-foreground">{role.description}</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground mt-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                )
              })}
            </CardContent>
            <CardFooter>
              <Link href="/" className="w-full">
                <Button variant="outline" className="w-full">Back to Home</Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </>
  )
}
