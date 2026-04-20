import { FileText, ClipboardList, Megaphone, UserCheck, Info, Bell, CheckCheck, Trash2 } from "lucide-react";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { useNotifications, type Notification, type NotificationCategory } from "@/lib/notifications-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

function categoryIcon(cat: NotificationCategory) {
  const cls = "w-5 h-5";
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
    case "document": return "bg-blue-50 border-blue-100";
    case "blotter": return "bg-red-50 border-red-100";
    case "announcement": return "bg-amber-50 border-amber-100";
    case "registration": return "bg-green-50 border-green-100";
    default: return "bg-gray-50 border-gray-100";
  }
}

function categoryLabel(cat: NotificationCategory) {
  switch (cat) {
    case "document": return "Document";
    case "blotter": return "Blotter";
    case "announcement": return "Announcement";
    case "registration": return "Registration";
    default: return "General";
  }
}

function categoryBadge(cat: NotificationCategory) {
  switch (cat) {
    case "document": return "bg-blue-100 text-blue-700";
    case "blotter": return "bg-red-100 text-red-700";
    case "announcement": return "bg-amber-100 text-amber-700";
    case "registration": return "bg-green-100 text-green-700";
    default: return "bg-gray-100 text-gray-700";
  }
}

function NotificationCard({ n }: { n: Notification }) {
  const { markAsRead } = useNotifications();

  return (
    <div
      onClick={() => markAsRead(n.id)}
      className={cn(
        "flex gap-4 p-4 rounded-xl border cursor-pointer hover:shadow-sm transition-all",
        !n.read ? "border-primary/20 bg-primary/5 hover:bg-primary/8" : "border-border bg-white hover:bg-gray-50"
      )}
    >
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border", categoryBg(n.category))}>
        {categoryIcon(n.category)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", categoryBadge(n.category))}>
            {categoryLabel(n.category)}
          </span>
          {!n.read && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              NEW
            </span>
          )}
        </div>
        <p className={cn("text-sm mt-1.5 leading-snug", !n.read ? "font-semibold text-foreground" : "font-medium text-foreground/80")}>
          {n.title}
        </p>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
        <p className="text-xs text-muted-foreground/60 mt-2">{timeAgo(n.timestamp)}</p>
      </div>
    </div>
  );
}

export default function OfficialNotificationsPage() {
  const { toggle } = useSidebarToggle();
  const { notifications, unreadCount, markAllRead, clearAll } = useNotifications();

  const grouped = {
    registration: notifications.filter((n) => n.category === "registration"),
    document: notifications.filter((n) => n.category === "document"),
    blotter: notifications.filter((n) => n.category === "blotter"),
  };

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Notifications"
        description="All incoming requests and updates from residents"
        onMenuClick={toggle}
        actions={
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllRead} className="text-xs gap-1.5">
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs gap-1.5 text-muted-foreground">
                <Trash2 className="w-3.5 h-3.5" />
                Clear all
              </Button>
            )}
          </div>
        }
      />

      <div className="p-4 sm:p-6 animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6 max-w-3xl mx-auto w-full">
        {unreadCount > 0 && (
          <div className="p-3 bg-primary/5 border border-primary/15 rounded-xl text-sm">
            You have <span className="text-primary font-bold">{unreadCount}</span> unread notification{unreadCount !== 1 ? "s" : ""}. Click on any notification to mark it as read.
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <p className="text-lg font-semibold text-foreground/70">No notifications</p>
            <p className="text-sm text-muted-foreground mt-1">All clear! Notifications from residents will appear here.</p>
          </div>
        ) : (
          <>
            {grouped.registration.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <UserCheck className="w-4 h-4 text-green-600" />
                  <h3 className="font-semibold text-sm text-foreground">Resident Registration</h3>
                  {grouped.registration.filter((n) => !n.read).length > 0 && (
                    <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 font-bold rounded-full">
                      {grouped.registration.filter((n) => !n.read).length} new
                    </span>
                  )}
                </div>
                <div className="space-y-2.5">
                  {grouped.registration.map((n) => <NotificationCard key={n.id} n={n} />)}
                </div>
              </section>
            )}

            {grouped.document.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-sm text-foreground">Document Requests</h3>
                  {grouped.document.filter((n) => !n.read).length > 0 && (
                    <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 font-bold rounded-full">
                      {grouped.document.filter((n) => !n.read).length} new
                    </span>
                  )}
                </div>
                <div className="space-y-2.5">
                  {grouped.document.map((n) => <NotificationCard key={n.id} n={n} />)}
                </div>
              </section>
            )}

            {grouped.blotter.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <ClipboardList className="w-4 h-4 text-red-600" />
                  <h3 className="font-semibold text-sm text-foreground">Blotter Cases</h3>
                  {grouped.blotter.filter((n) => !n.read).length > 0 && (
                    <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-700 font-bold rounded-full">
                      {grouped.blotter.filter((n) => !n.read).length} new
                    </span>
                  )}
                </div>
                <div className="space-y-2.5">
                  {grouped.blotter.map((n) => <NotificationCard key={n.id} n={n} />)}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
