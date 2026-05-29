"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  Users,
  FileText,
  Layers,
  ShieldCheck,
  UserCheck,
  Clock3,
  Settings,
  LogOut,
  Menu,
} from "lucide-react"
import { useEffect, useState } from "react"
import { getCurrentUser, signOut } from "@/lib/auth"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Resident Verification", href: "/admin/resident-verification", icon: Users },
  { name: "Resident Management", href: "/admin/resident-management", icon: UserCheck },
  { name: "Document Requests", href: "/admin/document-requests", icon: FileText },
  { name: "Household Management", href: "/admin/households", icon: Layers },
  { name: "Official Accounts", href: "/admin/official-accounts", icon: ShieldCheck },
  { name: "Activity Logs", href: "/admin/activity-logs", icon: Clock3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [checkedAuth, setCheckedAuth] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    if (pathname === "/admin/login" || pathname === "/admin/register") {
      setCheckedAuth(true)
      return
    }
    getCurrentUser()
      .then((user) => {
        if (user && user.user_metadata?.role === 'admin') {
          setUserRole(user.user_metadata.role)
          setIsAuthorized(true)
        } else {
          router.push('/admin/login')
        }
      })
      .catch(() => {
        router.push('/admin/login')
      })
      .finally(() => setCheckedAuth(true))

  }, [pathname, router])

  if (!checkedAuth) {
    return null
  }

  if (pathname === "/admin/login" || pathname === "/admin/register") {
    return <>{children}</>
  }

  if (!isAuthorized) {
    return null
  }

  const handleLogout = () => {
    signOut()
    router.push("/admin/login")
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-emerald-950 text-emerald-100">
      <div className="flex flex-col items-center gap-3 px-4 py-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-800/70 ring-1 ring-emerald-400/20">
          <Image
            src="/images/santiagologo.jpg"
            alt="Barangay Santiago Logo"
            width={72}
            height={72}
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Barangay Santiago</p>
          <p className="text-sm font-semibold">Admin Portal</p>
        </div>
      </div>

      <div className="mx-4 h-px bg-emerald-700/40" />

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald-100 text-emerald-950 shadow-lg shadow-emerald-900/20"
                  : "text-emerald-200 hover:bg-emerald-800/90 hover:text-emerald-50"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-emerald-900" : "text-emerald-300")} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-emerald-800/60 p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
          <Avatar className="h-11 w-11 ring-1 ring-white/10">
            <AvatarImage src="/placeholder-avatar.jpg" alt="Admin user" />
            <AvatarFallback>SA</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold">Super Admin</p>
            <p className="truncate text-xs text-slate-400">System Administrator</p>
          </div>
        </div>
        <Button
          variant="secondary"
          className="mt-4 w-full"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 22, stiffness: 180 }}
            className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto lg:hidden"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="lg:flex">
        <aside className="hidden lg:block lg:w-72">
          <SidebarContent />
        </aside>

        <div className="flex-1 lg:pl-72">
          <header className="sticky top-0 z-20 border-b border-emerald-200/20 bg-white/95 px-4 py-3 shadow-sm shadow-emerald-900/10 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-200 bg-white text-emerald-800 shadow-sm"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="text-sm font-semibold text-emerald-900">Admin Portal</div>
            </div>
          </header>
          <main className="min-h-screen bg-slate-50 px-4 py-6 md:px-6">
            <div className="w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
