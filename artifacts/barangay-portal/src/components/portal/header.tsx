import { Menu } from "lucide-react";
import { NotificationBell } from "./notification-bell";

interface PortalHeaderProps {
  title: string;
  description?: string;
  onMenuClick?: () => void;
  actions?: React.ReactNode;
  showNotifications?: boolean;
}

export function PortalHeader({ title, description, onMenuClick, actions, showNotifications = false }: PortalHeaderProps) {
  return (
    <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center gap-3 px-4 sm:px-6 py-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition"
            data-testid="button-mobile-menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-foreground truncate">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5 truncate">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {showNotifications && <NotificationBell />}
          {actions && (
            <div className="flex items-center gap-2">{actions}</div>
          )}
        </div>
      </div>
    </div>
  );
}
