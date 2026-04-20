import { useState } from "react";
import { createContext, useContext } from "react";
import { Sidebar } from "./sidebar";
import { NotificationsProvider } from "@/lib/notifications-context";
import { useAuth } from "@/lib/auth-context";

export const SidebarToggleContext = createContext({ toggle: () => {} });
export const useSidebarToggle = () => useContext(SidebarToggleContext);

export function PortalLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userData } = useAuth();

  return (
    <NotificationsProvider role={userData?.role ?? null}>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto flex flex-col animate-in fade-in duration-300">
          <SidebarToggleContext.Provider value={{ toggle: () => setSidebarOpen(true) }}>
            <div className="animate-in slide-in-from-bottom-4 duration-300">
              {children}
            </div>
          </SidebarToggleContext.Provider>
        </main>
      </div>
    </NotificationsProvider>
  );
}
