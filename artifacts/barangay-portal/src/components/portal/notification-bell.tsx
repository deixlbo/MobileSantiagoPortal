import { useState, useRef, useEffect } from "react";
import { Bell, FileText, ClipboardList, Megaphone, UserCheck, Info, CheckCheck } from "lucide-react";
import { useNotifications, type Notification, type NotificationCategory } from "@/lib/notifications-context";
import { cn } from "@/lib/utils";

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-PH", { month: "short", day: "numeric" });
}

function categoryIcon(cat: NotificationCategory) {
  const cls = "w-4 h-4";
  switch (cat) {
    case "document": return <FileText className={cn(cls, "text-blue-500")} />;
    case "blotter": return <ClipboardList className={cn(cls, "text-red-500")} />;
    case "announcement": return <Megaphone className={cn(cls, "text-amber-500")} />;
    case "registration": return <UserCheck className={cn(cls, "text-green-500")} />;
    default: return <Info className={cn(cls, "text-gray-400")} />;
  }
}

function categoryBg(cat: NotificationCategory) {
  switch (cat) {
    case "document": return "bg-blue-50";
    case "blotter": return "bg-red-50";
    case "announcement": return "bg-amber-50";
    case "registration": return "bg-green-50";
    default: return "bg-gray-50";
  }
}

function NotificationItem({ n, onClick }: { n: Notification; onClick: () => void }) {
  const { markAsRead } = useNotifications();

  function handleClick() {
    markAsRead(n.id);
    onClick();
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors",
        !n.read && "bg-primary/5 hover:bg-primary/8"
      )}
    >
      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5", categoryBg(n.category))}>
        {categoryIcon(n.category)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm leading-snug", !n.read ? "font-semibold text-foreground" : "font-medium text-foreground/80")}>
            {n.title}
          </p>
          {!n.read && (
            <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
        <p className="text-[10px] text-muted-foreground/60 mt-1">{timeAgo(n.timestamp)}</p>
      </div>
    </div>
  );
}

export function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const recent = notifications.slice(0, 5);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-border rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm text-foreground">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
            {recent.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              recent.map((n) => (
                <NotificationItem key={n.id} n={n} onClick={() => setOpen(false)} />
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
}
