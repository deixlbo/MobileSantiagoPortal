import { Link, useLocation } from "wouter";
import { 
  Leaf, LayoutDashboard, Megaphone, Scale, 
  FileText, FileWarning, FolderOpen, LogOut, Menu, User, HardHat
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { useResident } from "@/lib/use-resident";

const sidebarLinks = [
  { href: "/resident", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/resident/announcements", icon: Megaphone, label: "Announcements" },
  { href: "/resident/ordinances", icon: Scale, label: "Ordinances" },
  { href: "/resident/projects", icon: HardHat, label: "Projects" },
  { href: "/resident/documents", icon: FileText, label: "Documents" },
  { href: "/resident/blotter", icon: FileWarning, label: "Blotter Reports" },
  { href: "/resident/assets", icon: FolderOpen, label: "Assets" },
];

export function ResidentLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { resident, signOut } = useResident();

  if (!resident) return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>;

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border text-sidebar-foreground">
      <div className="p-6 border-b border-sidebar-border bg-sidebar-primary/5">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary mb-6">
          <Leaf className="h-6 w-6" />
          <span>Brgy. Santiago</span>
        </Link>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary">{getInitials(resident.fullName)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sidebar-primary-foreground leading-none">{resident.fullName}</span>
            <span className="text-xs text-sidebar-foreground/70 mt-1">{resident.purok}</span>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 py-4">
        <nav className="px-3 space-y-1">
          {sidebarLinks.map((link) => {
            const active = link.exact ? location === link.href : location.startsWith(link.href);
            const Icon = link.icon;
            
            return (
              <Link key={link.href} href={link.href}>
                <div className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium cursor-pointer",
                  active 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                onClick={() => setMobileOpen(false)}
                >
                  <Icon className={cn("h-5 w-5", active ? "text-primary-foreground" : "text-sidebar-foreground/50")} />
                  {link.label}
                </div>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-sidebar-border">
        <div 
          className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium text-destructive hover:bg-destructive/10 cursor-pointer"
          onClick={signOut}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] flex bg-muted/20">
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>

      <div className="flex-1 lg:pl-64 flex flex-col min-h-[100dvh]">
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b bg-background sticky top-0 z-40">
          <div className="flex items-center gap-4 lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 bg-sidebar">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <span className="font-semibold text-foreground">Resident Portal</span>
          </div>

          <div className="hidden lg:flex items-center">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              {sidebarLinks.find(l => (l.exact ? location === l.href : location.startsWith(l.href)))?.label || "Resident Portal"}
            </h1>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
