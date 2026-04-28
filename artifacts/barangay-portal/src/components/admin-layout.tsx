import { Link, useLocation } from "wouter";
import { 
  Leaf, LayoutDashboard, Users, FileWarning, 
  HardHat, Megaphone, Scale, FileText, 
  FolderOpen, Settings, LogOut, Menu,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const sidebarLinks = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/residents", icon: Users, label: "Residents" },
  { href: "/admin/blotter", icon: FileWarning, label: "Blotter Reports" },
  { href: "/admin/projects", icon: HardHat, label: "Projects" },
  { href: "/admin/announcements", icon: Megaphone, label: "Announcements" },
  { href: "/admin/ordinances", icon: Scale, label: "Ordinances" },
  { href: "/admin/documents", icon: FileText, label: "Documents" },
  { href: "/admin/assets", icon: FolderOpen, label: "Assets" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuth");
    setLocation("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border text-sidebar-foreground">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border bg-sidebar-primary/5">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-lg text-sidebar-primary-foreground hover:opacity-90 transition-opacity">
          <Leaf className="h-6 w-6 text-primary" />
          <span>Brgy. Santiago Admin</span>
        </Link>
      </div>
      
      <ScrollArea className="flex-1 py-4">
        <nav className="px-3 space-y-1">
          {sidebarLinks.map((link) => {
            const active = location === link.href || (link.href !== "/admin" && location.startsWith(link.href));
            const Icon = link.icon;
            
            return (
              <Link key={link.href} href={link.href}>
                <div className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium cursor-pointer",
                  active 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
                onClick={() => setMobileOpen(false)}
                >
                  <Icon className={cn("h-5 w-5", active ? "text-primary" : "text-sidebar-foreground/50")} />
                  {link.label}
                </div>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-sidebar-border">
        <div className="space-y-1">
          <Link href="/admin/settings">
            <div className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium cursor-pointer",
              location.startsWith("/admin/settings")
                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
            onClick={() => setMobileOpen(false)}
            >
              <Settings className="h-5 w-5 text-sidebar-foreground/50" />
              Settings
            </div>
          </Link>
          <div 
            className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium text-destructive hover:bg-destructive/10 cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] flex bg-muted/20">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-[100dvh]">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b bg-background sticky top-0 z-40">
          <div className="flex items-center gap-4 lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 bg-sidebar border-r-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <span className="font-semibold text-foreground">Barangay Santiago</span>
          </div>

          <div className="hidden lg:flex items-center">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              {sidebarLinks.find(l => location === l.href || (l.href !== "/admin" && location.startsWith(l.href)))?.label || "Admin Portal"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-auto flex items-center gap-3 rounded-full hover:bg-accent/50 pl-2 pr-4">
                  <Avatar className="h-8 w-8 border border-primary/20">
                    <AvatarImage src="/official-1.png" alt="Admin" className="object-cover" />
                    <AvatarFallback>RD</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start text-sm">
                    <span className="font-semibold leading-none text-foreground">Hon. Roberto S. Dela Cruz</span>
                    <span className="text-xs text-muted-foreground mt-1">Punong Barangay</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Hon. Roberto S. Dela Cruz</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      roberto.delacruz@santiago.gov.ph
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings" className="cursor-pointer flex w-full items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
