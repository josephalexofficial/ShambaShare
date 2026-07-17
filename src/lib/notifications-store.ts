import {
  seedNotificationsFor,
  type PortalNotification,
} from "@/lib/seed-portal";

const STORAGE_KEY = "shambashare_notif_read_v1";

type ReadMap = Record<string, string[]>;

function readMap(): ReadMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ReadMap;
  } catch {
    return {};
  }
}

function writeMap(map: ReadMap) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

function readIdsForUser(userId: string): Set<string> {
  return new Set(readMap()[userId] ?? []);
}

function persistReadIds(userId: string, ids: Set<string>) {
  const map = readMap();
  map[userId] = Array.from(ids);
  writeMap(map);
}

function isRead(userId: string, note: PortalNotification): boolean {
  if (note.read) return true;
  return readIdsForUser(userId).has(note.id);
}

export function listNotifications(
  userId: string,
  role: string,
): PortalNotification[] {
  return seedNotificationsFor(role).map((note) => ({
    ...note,
    read: isRead(userId, note),
  }));
}

export function countUnread(userId: string, role: string): number {
  return listNotifications(userId, role).filter((note) => !note.read).length;
}

export function markNotificationRead(userId: string, id: string): void {
  const next = readIdsForUser(userId);
  next.add(id);
  persistReadIds(userId, next);
}

export function markAllNotificationsRead(userId: string, role: string): void {
  const next = readIdsForUser(userId);
  for (const note of seedNotificationsFor(role)) {
    next.add(note.id);
  }
  persistReadIds(userId, next);
}
