import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type NotificationCategory = "document" | "blotter" | "registration" | "announcement" | "general";

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  read: boolean;
  timestamp: Date;
  link?: string;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, "id" | "read" | "timestamp">) => void;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

function notif(
  title: string,
  message: string,
  category: NotificationCategory,
  minutesAgo: number,
  link?: string,
  read = false
): Notification {
  const ts = new Date(Date.now() - minutesAgo * 60 * 1000);
  return { id: makeId(), title, message, category, read, timestamp: ts, link };
}

function seedResidentNotifications(): Notification[] {
  return [
    notif(
      "Document Request Approved",
      "Your Barangay Clearance request has been approved. You may now pick it up at the barangay hall.",
      "document", 15, "/resident/documents"
    ),
    notif(
      "Additional Requirements Needed",
      "Your Certificate of Indigency request requires additional documents. Please upload a Proof of Income.",
      "document", 120, "/resident/documents"
    ),
    notif(
      "Blotter Case Update",
      "Your blotter report BLT-0030 has been scheduled for mediation on April 14, 2026 at 9:00 AM at the Barangay Office.",
      "blotter", 360, "/resident/blotter"
    ),
    notif(
      "Invitation to Barangay",
      "You are invited to appear at the barangay for a blotter case mediation. Date: April 14, 2026, Time: 9:00 AM, Location: Barangay Office.",
      "blotter", 480, "/resident/blotter"
    ),
    notif(
      "Incident Report Available",
      "An incident report for your blotter case BLT-0028 has been created. You may now view the details in your account.",
      "blotter", 1440, "/resident/blotter", true
    ),
    notif(
      "Document Request Received",
      "Your request for Certificate of Residency has been received and is now under review.",
      "document", 2880, "/resident/documents", true
    ),
    notif(
      "New Announcement",
      "Barangay Santiago Saz Health Day on April 20, 2026. Free medical check-up for all residents.",
      "announcement", 4320, "/resident/announcements", true
    ),
    notif(
      "Account Approved",
      "Congratulations! Your barangay resident account has been approved. You can now access all portal services.",
      "registration", 10080, "/resident/dashboard", true
    ),
  ];
}

function seedOfficialNotifications(): Notification[] {
  return [
    notif(
      "New Resident Registration",
      "A new resident 'Elena Soriano' has submitted a registration request and is awaiting approval.",
      "registration", 10, "/official/residents"
    ),
    notif(
      "New Document Request",
      "Juan dela Cruz has requested a Barangay Clearance and requires your action.",
      "document", 30, "/official/documents"
    ),
    notif(
      "New Blotter Report Filed",
      "A new blotter report (BLT-0032) was filed by Maria Santos regarding a Noise Complaint in Purok 1.",
      "blotter", 45, "/official/blotter"
    ),
    notif(
      "Cancellation Request",
      "Resident Ana Torres has requested to cancel blotter case BLT-0029. Reason: Issue resolved.",
      "blotter", 90, "/official/blotter"
    ),
    notif(
      "Additional Requirements Uploaded",
      "Rosa Magtoto has uploaded the required documents for her Certificate of Indigency request.",
      "document", 200, "/official/documents"
    ),
    notif(
      "New Resident Registration",
      "Carlos Mañago submitted a registration request awaiting your approval.",
      "registration", 720, "/official/residents", undefined, true
    ),
    notif(
      "New Document Request",
      "Ana Torres has requested a Certificate of Good Moral Character.",
      "document", 1440, "/official/documents", undefined, true
    ),
    notif(
      "Blotter Report Filed",
      "A new blotter report (BLT-0031) was filed by Ana Torres regarding a Theft in Purok 3.",
      "blotter", 2880, "/official/blotter", undefined, true
    ),
  ];
}

export function NotificationsProvider({
  children,
  role,
}: {
  children: ReactNode;
  role: "resident" | "official" | null;
}) {
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    role === "official" ? seedOfficialNotifications() : seedResidentNotifications()
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback((n: Omit<Notification, "id" | "read" | "timestamp">) => {
    setNotifications((prev) => [
      { ...n, id: makeId(), read: false, timestamp: new Date() },
      ...prev,
    ]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, addNotification, markAsRead, markAllRead, clearAll }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationsProvider");
  return ctx;
}
