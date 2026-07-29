import {
  SEED_NETWORK_BOOKINGS,
  type PortalBooking,
} from "@/lib/seed-portal";
import { pushNotification } from "@/lib/notifications-store";

const KEY = "shambashare_bookings_v1";
const SEEDED_KEY = "shambashare_bookings_seeded_v2";

export function readBookings(): PortalBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PortalBooking[];
  } catch {
    return [];
  }
}

export function writeBookings(bookings: PortalBooking[]) {
  window.localStorage.setItem(KEY, JSON.stringify(bookings));
}

/** Seed starter rentals between real demo owners and renters (once). */
export function ensureSeedBookings() {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(SEEDED_KEY) === "1") return;

  const existing = readBookings();
  // Keep real user-created bookings that already have owner/renter ids.
  const live = existing.filter(
    (item) =>
      item.ownerId &&
      item.renterId &&
      !item.id.startsWith("bk-seed-") &&
      !item.id.startsWith("bk-00"),
  );
  writeBookings([...live, ...SEED_NETWORK_BOOKINGS]);
  window.localStorage.setItem(SEEDED_KEY, "1");
}

export function readBookingsForRenter(renterId: string): PortalBooking[] {
  return readBookings()
    .filter((item) => item.renterId === renterId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export function readBookingsForOwner(ownerId: string): PortalBooking[] {
  return readBookings()
    .filter((item) => item.ownerId === ownerId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export function addBooking(booking: PortalBooking) {
  ensureSeedBookings();
  const next = [booking, ...readBookings()];
  writeBookings(next);

  // Owner sees the request immediately in Notifications + Rentals.
  if (booking.ownerId) {
    pushNotification(booking.ownerId, {
      id: `n-req-${booking.id}`,
      title: "New rental request",
      body: `${booking.renterName} wants your ${booking.equipmentTitle} (${booking.startDate} → ${booking.returnDate}).`,
      time: "Just now",
      read: false,
      href: "/portal/rentals",
    });
  }

  return next;
}

export function updateBookingStatus(
  id: string,
  status: PortalBooking["status"],
) {
  const previous = readBookings().find((item) => item.id === id);
  const next = readBookings().map((item) =>
    item.id === id ? { ...item, status } : item,
  );
  writeBookings(next);

  const booking = next.find((item) => item.id === id);
  if (booking && previous && previous.status !== status) {
    notifyRenterOfStatus(booking, status);
  }

  return next;
}

function notifyRenterOfStatus(
  booking: PortalBooking,
  status: PortalBooking["status"],
) {
  if (!booking.renterId) return;

  if (status === "confirmed") {
    pushNotification(booking.renterId, {
      id: `n-ok-${booking.id}-${Date.now()}`,
      title: "Booking approved",
      body: `${booking.ownerName} approved your request for ${booking.equipmentTitle}. Coordinate pickup and pay on delivery.`,
      time: "Just now",
      read: false,
      href: "/portal/bookings",
    });
  } else if (status === "declined") {
    pushNotification(booking.renterId, {
      id: `n-no-${booking.id}-${Date.now()}`,
      title: "Booking declined",
      body: `${booking.ownerName} declined your request for ${booking.equipmentTitle}. Browse Find tools for another option.`,
      time: "Just now",
      read: false,
      href: "/portal/find",
    });
  } else if (status === "active") {
    pushNotification(booking.renterId, {
      id: `n-act-${booking.id}-${Date.now()}`,
      title: "Tool picked up",
      body: `Your rental of ${booking.equipmentTitle} is now active. Return by ${booking.returnDate}.`,
      time: "Just now",
      read: false,
      href: "/portal/bookings",
    });
  } else if (status === "returned") {
    pushNotification(booking.renterId, {
      id: `n-ret-${booking.id}-${Date.now()}`,
      title: "Rental completed",
      body: `${booking.equipmentTitle} was marked returned. Asante for sharing climate-smart tools.`,
      time: "Just now",
      read: false,
      href: "/portal/bookings",
    });
    pushNotification(booking.ownerId, {
      id: `n-inc-${booking.id}-${Date.now()}`,
      title: "Income recorded",
      body: `KES ${booking.totalKes.toLocaleString()} from ${booking.renterName} for ${booking.equipmentTitle}.`,
      time: "Just now",
      read: false,
      href: "/portal/income",
    });
  }
}

export function daysBetween(start: string, end: string) {
  const a = new Date(start);
  const b = new Date(end);
  const ms = b.getTime() - a.getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}
