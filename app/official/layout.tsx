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
import { useState } from "react"
import { OfficialChatbot } from "./official-chatbot"


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

  // Skip layout for login page
  if (pathname === "/official/login") {
    return <>{children}</>
  }

  const handleLogout = () => {
    router.push("/official/login")
  }

  const SidebarContent = () => (
    <>
      {/* Header with Logo */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 ring-2 ring-white/30">
          <Image
            src="/santiago-logo.png"
            alt="Barangay Santiago"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
        <div className="min-w-0">
          <h1 className="font-semibold text-white truncate">Barangay Santiago</h1>
          <p className="text-xs text-white/70">Admin Portal</p>
        </div>
      </div>

      {/* Divider line */}
      <div className="mx-4 h-0.5 bg-gradient-to-r from-white/20 via-white/20 to-transparent" />

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
                  ? "bg-white/90 text-emerald-800 shadow-lg"
                  : "text-white/90 hover:bg-white/10"
              )}
            >
              {item.icon && <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-emerald-700" : "text-white/80")} />}
              <span className="truncate">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Profile at Bottom */}
      <div className="mt-auto border-t border-white/10 p-4 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <Avatar className="h-12 w-12 ring-2 ring-white/30">
            <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
            <AvatarFallback className="bg-emerald-700 text-white font-semibold">RB</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Rolando C. Borja</p>
            <p className="text-xs text-white/70 truncate">Barangay Captain</p>
          </div>
        </div>
        <button 
          className="w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2 bg-white/10 text-white hover:bg-white/20 transition-colors text-sm font-medium"
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
    <div className="min-h-screen bg-muted/30">
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
            className="fixed inset-y-0 left-0 z-50 flex w-[60vw] max-w-64 flex-col lg:hidden"
            style={{
              background: "linear-gradient(180deg, #166534 0%, #14532d 50%, #0f3d1f 100%)"
            }}
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Always visible */}
      <aside 
        className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col lg:flex"
        style={{
          background: "linear-gradient(180deg, #166534 0%, #14532d 50%, #0f3d1f 100%)"
        }}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Page Content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
      
      {/* AI Chatbot */}
      <OfficialChatbot />
    </div>
  )
}
