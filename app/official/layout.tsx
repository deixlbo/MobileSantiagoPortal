"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  FileText,
  AlertTriangle,
  Scroll,
  FolderKanban,
  Megaphone,
  Package,
  LogOut,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import { OfficialChatbot } from "./official-chatbot"
import { getCurrentUser, getUserRole, signOut } from "@/lib/auth"


const navigation = [
  { name: "Dashboard", href: "/official", icon: LayoutDashboard },
  { name: "Residents", href: "/official/residents", icon: Users },
  { name: "Documents", href: "/official/documents", icon: FileText },
  { name: "Blotters", href: "/official/blotters", icon: AlertTriangle },
  { name: "Ordinances", href: "/official/ordinances", icon: Scroll },
  { name: "Projects", href: "/official/projects", icon: FolderKanban },
  { name: "Announcements", href: "/official/announcements", icon: Megaphone },
  { name: "Assets", href: "/official/assets", icon: Package },
]

export default function OfficialLayout({
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
        if (pathname === "/official/login" || pathname === "/official/login-form") {
          const currentUser = await getCurrentUser()
          const role = await getUserRole(currentUser)
          if (currentUser && (role === 'official' || role === 'admin')) {
            router.push('/official')
            return
          }
          setCheckedAuth(true)
          return
        }

        const currentUser = await getCurrentUser()
        const role = await getUserRole(currentUser)
        if (currentUser && (role === 'official' || role === 'admin')) {
          setUser(currentUser)
          setIsAuthorized(true)
        } else {
          router.push('/official/login-form')
        }
      } catch (error: any) {
        setAuthError('Unable to verify session. Please check your network or Supabase connection.')
        router.push('/official/login-form')
      } finally {
        setCheckedAuth(true)
      }
    }

    verifyAuth()
  }, [pathname, router])

  if (!checkedAuth) {
    return null
  }

  // Skip layout for login pages
  if (pathname === "/official/login" || pathname === "/official/login-form") {
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
    router.push("/official/login-form")
  }

  const SidebarContent = () => (
    <>
      {/* Header with Logo */}
      <div className="px-4 py-5 bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white overflow-hidden shadow-sm">
            <Image
              src="/images/santiagologo.jpg"
              alt="Santiago Portal Logo"
              width={72}
              height={72}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <div className="space-y-1 text-center">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">SANTIAGO PORTAL</p>
            <p className="text-sm font-semibold text-slate-900">Official Portal</p>
          </div>
        </div>
      </div>
      
      {/* Divider */}
      <div className="mx-4 h-px bg-slate-200" />

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/official" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              prefetch={true}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                isActive
                  ? "bg-emerald-100 text-emerald-900 shadow-sm"
                  : "text-slate-700 hover:bg-slate-100"
              )}
            >
              {item.icon && <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-emerald-700" : "text-slate-500")} />}
              <span className="truncate">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Profile at Bottom */}
      <div className="mt-auto border-t border-slate-200 p-4 space-y-3 bg-slate-50">
        <Link 
          href="/official/profile"
          className="flex items-center gap-3 px-2 rounded-lg hover:bg-slate-100 transition-colors py-2 cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        >
          <Avatar className="h-12 w-12 ring-2 ring-slate-200">
            <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
            <AvatarFallback className="bg-emerald-700 text-white font-semibold">RB</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">Rolando C. Borja</p>
            <p className="text-xs text-slate-500 truncate">Barangay Captain</p>
          </div>
        </Link>
        <button 
          className="w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors text-sm font-medium"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay - Click to close */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden cursor-pointer"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
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
            className="fixed inset-y-0 left-0 z-50 flex w-[60vw] max-w-64 flex-col lg:hidden overflow-y-auto bg-white/95 border-r border-slate-200 shadow-lg"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Always visible */}
      <aside 
        className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col lg:flex overflow-y-auto bg-white/95 border-r border-slate-200 shadow-lg"
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Mobile Header for small screens */}
        <header className="fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-b lg:hidden">
          <div className="flex h-14 sm:h-16 items-center gap-2 sm:gap-3 px-3 sm:px-4">
            <button
              className="rounded-lg p-2 hover:bg-slate-100 active:scale-95 transition-transform lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-slate-700" />
            </button>
            <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate">Official Portal</span>
          </div>
        </header>
        
        {/* Page Content with top padding for mobile header */}
        <main className="pt-14 sm:pt-16 lg:pt-0 p-3 sm:p-4 md:p-6">
          {children}
        </main>
      </div>
      
      {/* AI Chatbot */}
      <OfficialChatbot />
    </div>
  )
}
