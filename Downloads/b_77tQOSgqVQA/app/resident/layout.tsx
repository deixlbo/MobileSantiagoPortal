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
import { toast } from "sonner"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/resident", icon: LayoutDashboard },
  { name: "Documents", href: "/resident/documents", icon: FileText },
  { name: "Blotter", href: "/resident/blotter", icon: AlertTriangle },
  { name: "Ordinances", href: "/resident/ordinances", icon: Scroll },
  { name: "Projects", href: "/resident/projects", icon: FolderKanban },
  { name: "Announcements", href: "/resident/announcements", icon: Megaphone },
]

export default function ResidentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Skip layout for login and register pages
  if (pathname === "/resident/login" || pathname === "/resident/register") {
    return <>{children}</>
  }

  const handleLogout = () => {
    toast.success("Logged out successfully")
    router.push("/resident/login")
  }

  const MobileSidebarContent = () => (
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
          <p className="text-xs text-white/70">Resident Portal</p>
        </div>
        <button 
          className="absolute right-4 top-5" 
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
            (item.href !== "/resident" && pathname.startsWith(item.href))
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
                    layoutId="residentActiveIndicator"
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
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <Avatar className="h-10 w-10 ring-2 ring-white/20">
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback className="bg-green-600 text-white">JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Juan Dela Cruz</p>
            <p className="text-xs text-white/60 truncate">Resident</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="mt-2 w-full justify-start text-white/80 hover:bg-white/10 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
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
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col md:hidden"
            style={{
              background: "linear-gradient(180deg, #166534 0%, #14532d 50%, #0f3d1f 100%)"
            }}
          >
            <MobileSidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button 
              className="rounded-lg p-2 hover:bg-muted md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <Link href="/resident" className="flex items-center gap-2">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
              >
                <Image
                  src="/santiago-logo.png"
                  alt="Barangay Santiago"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
              </motion.div>
              <span className="hidden font-semibold sm:inline-block">
                Barangay Santiago
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href || 
                (item.href !== "/resident" && pathname.startsWith(item.href))
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                  <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Juan Dela Cruz</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    juan@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/resident/profile">
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

      {/* Main Content with Animation */}
      <AnimatePresence mode="wait">
        <motion.main 
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto px-4 py-6 md:px-6"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  )
}
