"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { UserRole } from "@/lib/constants";
import type { PortalNotification } from "@/lib/seed-portal";
import {
  countUnread,
  listNotifications,
  markAllNotificationsRead as storeMarkAllRead,
  markNotificationRead as storeMarkRead,
} from "@/lib/notifications-store";

type NotificationsContextValue = {
  notifications: PortalNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(
  null,
);

export function NotificationsProvider({
  userId,
  role,
  children,
}: {
  userId: string;
  role: UserRole;
  children: ReactNode;
}) {
  const [version, setVersion] = useState(0);

  const notifications = useMemo(() => {
    void version;
    return listNotifications(userId, role);
  }, [userId, role, version]);

  const unreadCount = useMemo(() => {
    void version;
    return countUnread(userId, role);
  }, [userId, role, version]);

  const markAsRead = useCallback(
    (id: string) => {
      storeMarkRead(userId, id);
      setVersion((v) => v + 1);
    },
    [userId],
  );

  const markAllAsRead = useCallback(() => {
    storeMarkAllRead(userId, role);
    setVersion((v) => v + 1);
  }, [userId, role]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
    }),
    [notifications, unreadCount, markAsRead, markAllAsRead],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationsProvider");
  }
  return ctx;
}
