"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { canList } from "@/lib/constants";
import { SEED_OWNER_BOOKINGS, type PortalBooking } from "@/lib/seed-portal";
import { ButtonLink } from "@/components/ui/Button";

export default function PortalRentalsPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<PortalBooking[]>(SEED_OWNER_BOOKINGS);

  if (!user || !canList(user.role)) {
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
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, status } : row)),
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-green-950">
          Rental requests
        </h1>
        <p className="mt-2 text-ink-muted">
          See who wants your tools, approve requests, and track return dates.
        </p>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <article key={row.id} className="field-panel-strong rounded-xl p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-semibold text-green-950">
                  {row.equipmentTitle}
                </h2>
                <p className="mt-1 text-sm text-ink-muted">
                  Renter: {row.renterName} · {row.renterPhone}
                </p>
                <p className="mt-1 text-sm text-ink-muted">
                  {row.startDate} → {row.returnDate} ·{" "}
                  {row.totalKes.toLocaleString()} KES ·{" "}
                  <span className="capitalize font-medium text-green-800">
                    {row.status}
                  </span>
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
    </div>
  );
}
