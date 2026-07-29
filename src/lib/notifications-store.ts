import type { PortalBooking, PortalNotification } from "@/lib/seed-portal";
import { DEMO_OWNERS, DEMO_RENTERS } from "@/lib/auth/seed-users";
import { SEED_EQUIPMENT } from "@/lib/seed-equipment";

const READ_KEY = "shambashare_notif_read_v1";
const CUSTOM_KEY = "shambashare_notif_custom_v1";

type ReadMap = Record<string, string[]>;
type CustomMap = Record<string, PortalNotification[]>;

function readMap(): ReadMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(READ_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ReadMap;
  } catch {
    return {};
  }
}

function writeMap(map: ReadMap) {
  window.localStorage.setItem(READ_KEY, JSON.stringify(map));
}

function readCustomMap(): CustomMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(CUSTOM_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as CustomMap;
  } catch {
    return {};
  }
}

function writeCustomMap(map: CustomMap) {
  window.localStorage.setItem(CUSTOM_KEY, JSON.stringify(map));
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

function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

function readBookingsSafe(): PortalBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem("shambashare_bookings_v1");
    if (!raw) return [];
    return JSON.parse(raw) as PortalBooking[];
  } catch {
    return [];
  }
}

/** Push a live notification for a specific user (owner or renter). */
export function pushNotification(
  userId: string,
  note: PortalNotification,
): void {
  if (typeof window === "undefined" || !userId) return;
  const map = readCustomMap();
  const existing = map[userId] ?? [];
  map[userId] = [note, ...existing.filter((item) => item.id !== note.id)].slice(
    0,
    40,
  );
  writeCustomMap(map);
}

function bookingDerivedForOwner(userId: string): PortalNotification[] {
  return readBookingsSafe()
    .filter((b) => b.ownerId === userId)
    .slice(0, 8)
    .map((b) => {
      if (b.status === "pending") {
        return {
          id: `derived-own-pending-${b.id}`,
          title: "Rental request waiting",
          body: `${b.renterName} requested your ${b.equipmentTitle} (${b.startDate} → ${b.returnDate}).`,
          time: relativeTime(b.createdAt),
          read: false,
          href: "/portal/rentals",
        };
      }
      if (b.status === "active") {
        return {
          id: `derived-own-active-${b.id}`,
          title: "Tool currently out",
          body: `${b.renterName} has your ${b.equipmentTitle} until ${b.returnDate}.`,
          time: relativeTime(b.createdAt),
          read: true,
          href: "/portal/rentals",
        };
      }
      if (b.status === "returned") {
        return {
          id: `derived-own-returned-${b.id}`,
          title: "Rental completed",
          body: `${b.renterName} returned ${b.equipmentTitle} · KES ${b.totalKes.toLocaleString()}.`,
          time: relativeTime(b.createdAt),
          read: true,
          href: "/portal/income",
        };
      }
      return {
        id: `derived-own-${b.status}-${b.id}`,
        title: `Request ${b.status}`,
        body: `${b.renterName} · ${b.equipmentTitle}`,
        time: relativeTime(b.createdAt),
        read: b.status !== "confirmed",
        href: "/portal/rentals",
      };
    });
}

function bookingDerivedForRenter(userId: string): PortalNotification[] {
  return readBookingsSafe()
    .filter((b) => b.renterId === userId)
    .slice(0, 8)
    .map((b) => {
      if (b.status === "pending") {
        return {
          id: `derived-rent-pending-${b.id}`,
          title: "Waiting on owner",
          body: `${b.ownerName} hasn’t reviewed your ${b.equipmentTitle} request yet.`,
          time: relativeTime(b.createdAt),
          read: false,
          href: "/portal/bookings",
        };
      }
      if (b.status === "confirmed") {
        return {
          id: `derived-rent-ok-${b.id}`,
          title: "Booking confirmed",
          body: `${b.ownerName} approved your ${b.equipmentTitle}. Coordinate pickup — pay on delivery.`,
          time: relativeTime(b.createdAt),
          read: false,
          href: "/portal/bookings",
        };
      }
      if (b.status === "declined") {
        return {
          id: `derived-rent-no-${b.id}`,
          title: "Request declined",
          body: `${b.ownerName} declined ${b.equipmentTitle}. Try another tool nearby.`,
          time: relativeTime(b.createdAt),
          read: false,
          href: "/portal/find",
        };
      }
      if (b.status === "active") {
        return {
          id: `derived-rent-active-${b.id}`,
          title: "Return reminder",
          body: `Return ${b.equipmentTitle} to ${b.ownerName} by ${b.returnDate}.`,
          time: relativeTime(b.createdAt),
          read: false,
          href: "/portal/bookings",
        };
      }
      return {
        id: `derived-rent-${b.status}-${b.id}`,
        title: "Booking update",
        body: `${b.equipmentTitle} with ${b.ownerName} is ${b.status}.`,
        time: relativeTime(b.createdAt),
        read: true,
        href: "/portal/bookings",
      };
    });
}

function roleBaseline(role: string): PortalNotification[] {
  const nearby = SEED_EQUIPMENT.find((item) => item.isAvailable);
  const owner = DEMO_OWNERS[0];
  const renter = DEMO_RENTERS[0];

  if (role === "admin" || role === "subadmin") {
    return [
      {
        id: "n-a1",
        title: "Demo network is live",
        body: `${DEMO_OWNERS.length} owners and ${DEMO_RENTERS.length} renters are ready for the hackathon demo.`,
        time: "2h ago",
        read: false,
        href: "/portal/admin/users",
      },
      {
        id: "n-a2",
        title: "Listings to review",
        body: "Check owner posts and rates before featuring them on Find tools.",
        time: "Yesterday",
        read: false,
        href: "/portal/admin/listings",
      },
    ];
  }

  if (role === "owner") {
    return [
      {
        id: "n-o-welcome",
        title: "Your tools are visible",
        body: `Renters like ${renter.fullName} can find your climate-smart equipment on Find tools.`,
        time: "Yesterday",
        read: true,
        href: "/portal/listings",
      },
    ];
  }

  if (role === "renter") {
    return [
      {
        id: "n-r-nearby",
        title: "New tool near you",
        body: nearby
          ? `${nearby.title} from ${nearby.ownerName} is available in ${nearby.locationLabel}.`
          : `${owner.fullName} has climate-smart tools ready to rent nearby.`,
        time: "Yesterday",
        read: false,
        href: "/portal/find",
      },
    ];
  }

  // both
  return [
    {
      id: "n-b-tip",
      title: "Switch sides anytime",
      body: "Use the sidebar to act as a renter or owner — bookings and listings stay separate.",
      time: "2 days ago",
      read: true,
      href: "/portal/overview",
    },
  ];
}

function dedupeNotes(notes: PortalNotification[]): PortalNotification[] {
  const seen = new Set<string>();
  const out: PortalNotification[] = [];
  for (const note of notes) {
    if (seen.has(note.id)) continue;
    seen.add(note.id);
    out.push(note);
  }
  return out;
}

export function listNotifications(
  userId: string,
  role: string,
): PortalNotification[] {
  const custom = readCustomMap()[userId] ?? [];
  const derived =
    role === "owner" || role === "both"
      ? bookingDerivedForOwner(userId)
      : [];
  const derivedRenter =
    role === "renter" || role === "both"
      ? bookingDerivedForRenter(userId)
      : [];

  // Prefer custom (live events), then booking-derived, then light role baseline.
  const merged = dedupeNotes([
    ...custom,
    ...derived,
    ...derivedRenter,
    ...roleBaseline(role),
  ]);

  return merged.map((note) => ({
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
  for (const note of listNotifications(userId, role)) {
    next.add(note.id);
  }
  persistReadIds(userId, next);
}
