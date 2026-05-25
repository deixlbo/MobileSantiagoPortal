"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
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

import { useState } from "react"
import { LogOut } from "lucide-react"

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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Skip layout for login and register pages
  if (pathname === "/resident/login" || pathname === "/resident/register") {
    return <>{children}</>
  }

  const SidebarContent = () => (
    <>
      {/* Header with Logo */}
      <div className="relative flex items-center gap-3 px-4 py-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 overflow-hidden">
          <Image
            src="/images/santiagologo.jpg"
            alt="Barangay Santiago"
            width={40}
            height={40}
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div>
          <h1 className="font-semibold text-white">Barangay Santiago</h1>
          <p className="text-xs text-white/70">Resident Portal</p>
        </div>
      </div>

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
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/90 text-green-800 shadow-lg"
                    : "text-white/90 hover:bg-white/10"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-green-700" : "text-white/80")} />
                {item.name}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/20">
        <Link
          href="/resident/login"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10 transition-all duration-200"
        >
          <LogOut className="h-5 w-5 text-white/80" />
          Logout
        </Link>
      </div>
    </>
  )

  const MobileSidebarContent = () => (
    <>
      {/* Header with Logo */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 overflow-hidden">
          <Image
            src="/images/santiagologo.jpg"
            alt="Barangay Santiago"
            width={40}
            height={40}
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div>
          <h1 className="font-semibold text-white">Barangay Santiago</h1>
          <p className="text-xs text-white/70">Resident Portal</p>
        </div>
      </div>

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
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/90 text-green-800 shadow-lg"
                    : "text-white/90 hover:bg-white/10"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-green-700" : "text-white/80")} />
                {item.name}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/20 space-y-2">
        <div className="text-xs text-white/60 px-2">
          Logged in as Resident
        </div>
        <Link
          href="/resident/login"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-white/90 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 transition-all duration-200 active:scale-95"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Link>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Desktop Sidebar */}
      <motion.aside 
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className="hidden md:flex w-72 flex-col fixed inset-y-0 left-0 z-20"
        style={{ backgroundColor: "#4ADE80" }}
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
            className="fixed inset-y-0 left-0 z-50 flex w-64 max-w-[75vw] flex-col md:hidden"
            style={{ backgroundColor: "#4ADE80" }}
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
          <div className="flex h-14 items-center justify-start px-4">
            <button 
              className="rounded-lg p-2 hover:bg-muted"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
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
            className="flex-1 container mx-auto px-4 py-6 md:px-6"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  )
}
