"use client";

import { useEffect, useState } from "react";
import { Handshake } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { usePortalMode } from "@/components/portal/PortalModeProvider";
import { canList } from "@/lib/constants";
import {
  ensureSeedBookings,
  readBookingsForOwner,
  updateBookingStatus,
} from "@/lib/bookings-store";
import type { PortalBooking } from "@/lib/seed-portal";
import { ButtonLink } from "@/components/ui/Button";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-900",
  confirmed: "bg-green-100 text-green-900",
  active: "bg-sky-100 text-sky-900",
  returned: "bg-gray-100 text-gray-700",
  declined: "bg-red-100 text-red-800",
};

export default function PortalRentalsPage() {
  const { user } = useAuth();
  const { effectiveRole } = usePortalMode();
  const [rows, setRows] = useState<PortalBooking[]>([]);

  function refresh() {
    if (!user) return;
    ensureSeedBookings();
    setRows(readBookingsForOwner(user.id));
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (!user || !canList(effectiveRole)) {
    return (
      <div className="field-panel-strong rounded-xl p-8 text-center">
        <h1 className="font-display text-2xl font-semibold text-green-950">
          Rental requests are for owners
        </h1>
        <ButtonLink href="/portal/overview" className="mt-6" variant="secondary">
          Back to overview
        </ButtonLink>
      </div>
    );
  }

  function setStatus(id: string, status: PortalBooking["status"]) {
    updateBookingStatus(id, status);
    refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-green-950">
          Rental requests
        </h1>
        <p className="mt-2 text-ink-muted">
          See who wants your tools, approve or decline, and track return dates.
          Renters get notified when you decide.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="field-panel-strong rounded-2xl px-6 py-14 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-800/10 text-green-800">
            <Handshake size={26} />
          </span>
          <p className="mt-5 text-2xl font-semibold text-green-950">
            No requests yet
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
            When a renter books one of your tools from Find tools, the request
            appears here for you to approve or decline.
          </p>
          <ButtonLink href="/portal/listings" className="mt-6" variant="secondary">
            Manage my listings
          </ButtonLink>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <article key={row.id} className="field-panel-strong rounded-xl p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-green-950">
                      {row.equipmentTitle}
                    </h2>
                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[row.status]}`}
                    >
                      {row.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink-muted">
                    Renter: {row.renterName} · {row.renterPhone || "No phone"}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {row.startDate} → {row.returnDate} ·{" "}
                    {row.totalKes.toLocaleString()} KES · {row.locationLabel}
                  </p>
                </div>
                {row.status === "pending" ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStatus(row.id, "confirmed")}
                      className="rounded-md bg-green-800 px-3 py-2 text-sm font-semibold text-white hover:bg-green-900"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus(row.id, "declined")}
                      className="rounded-md border border-[color:var(--line)] bg-white px-3 py-2 text-sm font-semibold text-ink-muted hover:bg-red-50 hover:text-red-700"
                    >
                      Decline
                    </button>
                  </div>
                ) : row.status === "confirmed" ? (
                  <button
                    type="button"
                    onClick={() => setStatus(row.id, "active")}
                    className="rounded-md bg-green-800 px-3 py-2 text-sm font-semibold text-white"
                  >
                    Mark picked up
                  </button>
                ) : row.status === "active" ? (
                  <button
                    type="button"
                    onClick={() => setStatus(row.id, "returned")}
                    className="rounded-md bg-green-800 px-3 py-2 text-sm font-semibold text-white"
                  >
                    Mark returned
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
