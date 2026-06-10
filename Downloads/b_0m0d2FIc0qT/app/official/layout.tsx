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
  Building2,
  Scroll,
  FolderKanban,
  Megaphone,
  Package,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"


const navigation = [
  { name: "Dashboard", href: "/official", icon: LayoutDashboard },
  { name: "Residents", href: "/official/residents", icon: Users },
  { name: "Documents", href: "/official/documents", icon: FileText },
  { name: "Blotters", href: "/official/blotters", icon: AlertTriangle },
  { name: "Business", href: "/official/business", icon: Building2 },
  { name: "Ordinances", href: "/official/ordinances", icon: Scroll },
  { name: "Projects", href: "/official/projects", icon: FolderKanban },
  { name: "Announcements", href: "/official/announcements", icon: Megaphone },
  { name: "Assets", href: "/official/assets", icon: Package },
  { name: "Reports", href: "/official/reports", icon: BarChart3 },
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
      <div className="relative flex items-center gap-3 px-4 py-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 ring-2 ring-yellow-400/50">
          <Image
            src="/santiago-logo.png"
            alt="Barangay Santiago"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
        <div>
          <h1 className="font-semibold text-white">Barangay Santiago</h1>
          <p className="text-xs text-white/70">Admin Portal</p>
        </div>
        <button 
          className="absolute right-4 top-5 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Yellow divider line */}
      <div className="mx-4 h-0.5 bg-gradient-to-r from-yellow-400 via-yellow-400 to-transparent" />

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navigation.map((item, index) => {
          const isActive = pathname === item.href || 
            (item.href !== "/official" && pathname.startsWith(item.href))
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
                {/* Yellow accent bar for active item */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -left-4 top-1 bottom-1 w-1 rounded-r-full bg-yellow-400"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon className={cn("h-5 w-5", isActive ? "text-green-700" : "text-white/80")} />
                {item.name}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* User Profile at Bottom */}
      <div className="mt-auto border-t border-white/10 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/10">
              <Avatar className="h-10 w-10 ring-2 ring-white/20">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                <AvatarFallback className="bg-green-600 text-white">AU</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Admin User</p>
                <p className="text-xs text-white/60 truncate">Super Administrator</p>
              </div>
              <ChevronDown className="h-4 w-4 text-white/60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/official/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
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
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col lg:hidden"
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
        {/* Header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          <button 
            className="rounded-lg p-2 hover:bg-muted lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold">Official Portal</h1>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                    <AvatarFallback className="bg-muted text-foreground">RB</AvatarFallback>
                  </Avatar>
                  <div className="hidden text-left md:block">
                    <p className="text-sm font-medium">Rolando C. Borja</p>
                    <p className="text-xs text-muted-foreground">Barangay Captain</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/official/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.header>

        {/* Page Content with Animation */}
        <AnimatePresence mode="wait">
          <motion.main 
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-4 md:p-6"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  )
}
