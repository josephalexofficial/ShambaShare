"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CalendarRange,
  CheckCircle2,
  MapPin,
  Package,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { canRent } from "@/lib/constants";
import { readBookings } from "@/lib/bookings-store";
import type { PortalBooking } from "@/lib/seed-portal";
import { ButtonLink } from "@/components/ui/Button";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-900",
  confirmed: "bg-green-100 text-green-900",
  active: "bg-sky-100 text-sky-900",
  returned: "bg-gray-100 text-gray-700",
  declined: "bg-red-100 text-red-800",
};

const statusHints: Record<string, string> = {
  pending: "Waiting for the owner to review your request",
  confirmed: "Approved — coordinate pickup with the owner",
  active: "Tool is with you — return by the end date",
  returned: "Rental completed",
  declined: "Owner declined this request",
};

export default function BookingsClient() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<PortalBooking[]>([]);

  useEffect(() => {
    setBookings(readBookings());
  }, []);

  if (!user || !canRent(user.role)) {
    return (
      <div className="field-panel-strong rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-semibold text-green-950">
          Bookings are for renters
        </h1>
        <ButtonLink href="/portal/overview" className="mt-6" variant="secondary">
          Back to overview
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-green-950">
            My bookings
          </h1>
          <p className="mt-2 text-ink-muted">
            Track requests, return dates, and coordination with owners.
          </p>
        </div>
        <ButtonLink href="/portal/find" className="rounded-xl">
          Book another tool
          <ArrowRight size={16} />
        </ButtonLink>
      </div>

      {searchParams.get("booked") ? (
        <div className="flex items-start gap-3 rounded-2xl border border-green-700/20 bg-green-800/10 px-4 py-3.5 text-sm text-green-900">
          <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-green-800" />
          <p>
            Booking request sent. The owner can review and approve it in their
            portal. Coordinate pickup when confirmed, then pay on delivery.
          </p>
        </div>
      ) : null}

      {bookings.length === 0 ? (
        <div className="field-panel-strong rounded-2xl px-6 py-14 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-800/10 text-green-800">
            <CalendarRange size={26} />
          </span>
          <p className="mt-5 text-2xl font-semibold text-green-950">
            No bookings yet
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
            Find a nearby climate-smart tool, set your start and return dates,
            and your request will show up here.
          </p>
          <ButtonLink href="/portal/find" className="mt-6 rounded-xl">
            Find tools
            <ArrowRight size={16} />
          </ButtonLink>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <article
              key={booking.id}
              className="field-panel-strong rounded-2xl p-5 transition hover:border-green-700/20"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-800/10 text-green-800">
                    <Package size={20} />
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-green-950">
                      {booking.equipmentTitle}
                    </h2>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted">
                      <MapPin size={14} className="shrink-0" />
                      {booking.ownerName} · {booking.locationLabel}
                    </p>
                    <p className="mt-1.5 text-sm text-ink-muted">
                      {booking.startDate} → {booking.returnDate}
                      <span className="mx-1.5 text-[color:var(--line)]">·</span>
                      <span className="font-semibold text-green-900">
                        {booking.totalKes.toLocaleString()} KES
                      </span>
                    </p>
                    <p className="mt-2 text-xs text-ink-muted">
                      {statusHints[booking.status] ?? ""}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex w-fit rounded-lg px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[booking.status]}`}
                >
                  {booking.status}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
