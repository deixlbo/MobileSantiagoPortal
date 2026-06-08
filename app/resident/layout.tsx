"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  Scroll,
  FolderKanban,
  Megaphone,
  User,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"
import { LogOut } from "lucide-react"
import { ResidentChatbot } from "./resident-chatbot"
import { getCurrentUser, getUserRole, signOut } from "@/lib/auth"

const navigation = [
  { name: "Dashboard", href: "/resident/dashboard", icon: LayoutDashboard },
  { name: "Documents", href: "/resident/documents", icon: FileText },
  { name: "Blotter", href: "/resident/blotter", icon: AlertTriangle },
  { name: "Ordinances", href: "/resident/ordinances", icon: Scroll },
  { name: "Projects", href: "/resident/projects", icon: FolderKanban },
  { name: "Announcements", href: "/resident/announcements", icon: Megaphone },
  { name: "Profile", href: "/resident/profile", icon: User },
]

export default function ResidentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [checkedAuth, setCheckedAuth] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        if (pathname === "/resident/login" || pathname === "/resident/register") {
          const currentUser = await getCurrentUser()
          const role = await getUserRole(currentUser)
          const userIsVerifiedResident = currentUser && role === 'resident' && (currentUser as any).verified !== false
          if (userIsVerifiedResident) {
            router.push('/resident/dashboard')
            return
          }
          setCheckedAuth(true)
          return
        }

        const currentUser = await getCurrentUser()
        const role = await getUserRole(currentUser)
        if (currentUser && role === 'resident') {
          setUser(currentUser)
          setIsAuthorized(true)
        } else {
          router.push('/resident/login')
        }
      } catch (error: any) {
        setAuthError('Unable to verify session. Please check your network or Supabase connection.')
        router.push('/resident/login')
      } finally {
        setCheckedAuth(true)
      }
    }

    verifyAuth()
  }, [pathname, router])

  if (!checkedAuth) {
    return null
  }

  // Skip layout for login and register pages
  if (pathname === "/resident/login" || pathname === "/resident/register") {
    return <>{children}</>
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 text-center">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800 shadow-sm">
          <p className="font-semibold">Authentication error</p>
          <p className="mt-2 text-sm">{authError}</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  const handleLogout = async () => {
    await signOut()
    router.push("/resident/login")
  }

  const SidebarContent = () => (
    <>
      {/* Header with Logo */}
      <div className="px-4 py-5 bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-white shadow-sm overflow-hidden border-2 border-emerald-200 p-1">
            <Image
              src="/logos/santiago-logo.png"
              alt="Santiago Portal Logo"
              width={72}
              height={72}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="space-y-1 text-center">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">SANTIAGO PORTAL</p>
            <p className="text-sm font-semibold text-slate-900">Resident Portal</p>
          </div>
        </div>
      </div>
      
      {/* Divider */}
      <div className="mx-4 h-px bg-slate-200" />

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-4 pt-2">
        {navigation.map((item, index) => {
          const isActive = pathname === item.href || 
            (item.href !== "/resident/dashboard" && pathname.startsWith(item.href))
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                prefetch={false}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-emerald-100 text-emerald-900 shadow-sm"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-emerald-700" : "text-slate-500")} />
                {item.name}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200"
        >
          <LogOut className="h-5 w-5 text-white" />
          Logout
        </button>
      </div>
    </>
  )

  const MobileSidebarContent = () => (
    <>
      {/* Header with Logo */}
      <div className="px-4 py-5 bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-white shadow-sm overflow-hidden border-2 border-emerald-200 p-1">
            <Image
              src="/logos/santiago-logo.png"
              alt="Santiago Portal Logo"
              width={72}
              height={72}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="space-y-1 text-center">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">SANTIAGO PORTAL</p>
            <p className="text-sm font-semibold text-slate-900">Resident Portal</p>
          </div>
        </div>
      </div>
      
      {/* Divider */}
      <div className="mx-4 h-px bg-slate-200" />

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-4 pt-2">
        {navigation.map((item, index) => {
          const isActive = pathname === item.href || 
            (item.href !== "/resident/dashboard" && pathname.startsWith(item.href))
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                prefetch={false}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-emerald-100 text-emerald-900 shadow-sm"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-emerald-700" : "text-slate-500")} />
                {item.name}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-200 space-y-2 bg-slate-50">
        <div className="text-xs text-slate-500 px-2">
          Logged in as Resident
        </div>
        <button
          onClick={() => {
            setSidebarOpen(false)
            handleLogout()
          }}
          className="w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 active:scale-95"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <motion.aside 
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className="hidden md:flex w-72 flex-col fixed inset-y-0 left-0 z-20 bg-white/95 border-r border-slate-200 shadow-lg"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 flex w-64 max-w-[75vw] flex-col md:hidden bg-white/95 border-r border-slate-200 shadow-lg"
          >
            <MobileSidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:ml-72">
        {/* Mobile Header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden"
        >
          <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 gap-3">
            <button 
              className="rounded-lg p-2 hover:bg-muted active:scale-95 transition-transform"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <span className="text-xs sm:text-sm font-semibold text-muted-foreground truncate">Resident Portal</span>
          </div>
        </motion.header>

        {/* Main Content with Animation */}
        <AnimatePresence mode="wait">
          <motion.main 
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6 overflow-x-hidden"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
      
      {/* AI Chatbot */}
      <ResidentChatbot />
    </div>
  )
}
