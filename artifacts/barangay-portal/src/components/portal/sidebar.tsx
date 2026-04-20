import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, FileText, Megaphone, ClipboardList, Users, FolderKanban,
  Package, BookOpen, Building2, User, LogOut, X, Home
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const residentNavItems: NavItem[] = [
  { label: "Dashboard", href: "/resident/dashboard", icon: LayoutDashboard },
  { label: "Document Requests", href: "/resident/documents", icon: FileText },
  { label: "Announcements", href: "/resident/announcements", icon: Megaphone },
  { label: "Blotter Report", href: "/resident/blotter", icon: ClipboardList },
  { label: "Ordinances", href: "/resident/ordinances", icon: BookOpen },
  { label: "My Profile", href: "/resident/profile", icon: User },
];

const officialNavItems: NavItem[] = [
  { label: "Dashboard", href: "/official/dashboard", icon: LayoutDashboard },
  { label: "Document Requests", href: "/official/documents", icon: FileText },
  { label: "Announcements", href: "/official/announcements", icon: Megaphone },
  { label: "Blotter Cases", href: "/official/blotter", icon: ClipboardList },
  { label: "Residents", href: "/official/residents", icon: Users },
  { label: "Projects", href: "/official/projects", icon: FolderKanban },
  { label: "Assets", href: "/official/assets", icon: Package },
  { label: "Ordinances", href: "/official/ordinances", icon: BookOpen },
  { label: "Businesses", href: "/official/businesses", icon: Building2 },
  { label: "My Profile", href: "/official/profile", icon: User },
];

function SantiagoSeal({ size = 40 }: { size?: number }) {
  return (
    <div
      className="rounded-full overflow-hidden border-2 border-sidebar-border bg-white flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <img
        src="/santiago.jpg"
        alt="Barangay Santiago"
        className="w-full h-full object-cover"
        onError={e => {
          const target = e.currentTarget as HTMLImageElement;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `<span style="font-size:${Math.round(size * 0.3)}px;font-weight:700;color:#1a6b3c;">BSG</span>`;
          }
        }}
      />
    </div>
  );
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { userData, logout } = useAuth();
  const [location] = useLocation();

  const navItems = userData?.role === "official" ? officialNavItems : residentNavItems;
  const isOfficial = userData?.role === "official";

  const nameInitial = (() => {
    const name = userData?.fullName ?? "U";
    const stripped = name.replace(/^(Hon\.|Dr\.|Atty\.|Engr\.|Mr\.|Mrs\.|Ms\.)\s*/i, "");
    return stripped.charAt(0).toUpperCase();
  })();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full z-50 flex flex-col transition-all duration-300
          bg-sidebar border-r border-sidebar-border shadow-xl
          w-72
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:relative md:z-auto md:shadow-none
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            {isOfficial
              ? <SantiagoSeal size={40} />
              : (
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Home className="w-5 h-5 text-primary-foreground" />
                </div>
              )
            }
            <div>
              <p className="text-sidebar-foreground font-bold text-sm leading-tight">Brgy. Santiago</p>
              <p className="text-sidebar-foreground/60 text-xs">
                {isOfficial ? "Official Portal" : "Resident Portal"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-sidebar-foreground/70 hover:text-sidebar-foreground p-1.5 rounded-md hover:bg-sidebar-accent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-sidebar-border/50 bg-sidebar-accent/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              {nameInitial}
            </div>
            <div className="min-w-0">
              <p className="text-sidebar-foreground font-semibold text-sm truncate">{userData?.fullName ?? "User"}</p>
              <p className="text-sidebar-foreground/60 text-xs capitalize">{userData?.role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const active = location === item.href || location.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
                  }`}
              >
                <item.icon className="w-4.5 h-4.5 shrink-0" />
                <span className="truncate flex-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/60 text-sm"
            onClick={() => { logout(); onClose(); }}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  );
}
