import type { PortalBooking } from "@/lib/seed-portal";

const KEY = "shambashare_bookings_v1";

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

export function addBooking(booking: PortalBooking) {
  const next = [booking, ...readBookings()];
  writeBookings(next);
  return next;
}

export function updateBookingStatus(id: string, status: PortalBooking["status"]) {
  const next = readBookings().map((item) =>
    item.id === id ? { ...item, status } : item,
  );
  writeBookings(next);
  return next;
}

export function daysBetween(start: string, end: string) {
  const a = new Date(start);
  const b = new Date(end);
  const ms = b.getTime() - a.getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}
