"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Building2,
  LayoutDashboard,
  Users,
  FileText,
  AlertTriangle,
  Megaphone,
  Scale,
  Menu,
  LogOut,
  Home,
  Shield,
  FolderKanban,
  FolderOpen,
  Settings,
  ChevronDown,
  ClipboardList
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/residents", label: "Residents", icon: Users },
  { href: "/admin/blotter", label: "Blotter Reports", icon: AlertTriangle },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/ordinances", label: "Ordinances", icon: Scale },
  { href: "/admin/documents", label: "Documents", icon: FileText },
  { href: "/admin/assets", label: "Assets", icon: FolderOpen },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login?portal=official")
    }
  }, [isAuthenticated, user, router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border-2 border-border flex items-center justify-center bg-background">
            <Building2 className="w-5 h-5 text-muted-foreground" />
          </div>
          {(!sidebarCollapsed || mobile) && (
            <div>
              <div className="font-semibold text-sm">Barangay Santiago</div>
              <div className="text-[10px] text-muted-foreground">Admin Portal</div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/admin" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => mobile && setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {(!sidebarCollapsed || mobile) && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Settings & Logout */}
      <div className="border-t p-3 space-y-1">
        <Link
          href="/admin/settings"
          onClick={() => mobile && setIsMobileMenuOpen(false)}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
            "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          <Settings className="w-4 h-4 shrink-0" />
          {(!sidebarCollapsed || mobile) && <span>Settings</span>}
        </Link>
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors w-full",
            "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {(!sidebarCollapsed || mobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col border-r bg-card transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="px-4 lg:px-6 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Toggle */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <SidebarContent mobile />
                </SheetContent>
              </Sheet>

              {/* Admin Info with Logo */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg border flex items-center justify-center bg-muted/50">
                  <span className="text-xs font-semibold">HRSDC</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold">{user?.fullName}</p>
                  <p className="text-[10px] text-muted-foreground">{user?.position}</p>
                </div>
              </div>
            </div>

            {/* Right Side - User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {user?.fullName?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm">Admin</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user?.fullName}</span>
                    <span className="text-xs font-normal text-muted-foreground">{user?.position}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/" className="cursor-pointer">
                    <Home className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
