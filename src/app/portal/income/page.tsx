"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { usePortalMode } from "@/components/portal/PortalModeProvider";
import { canList } from "@/lib/constants";
import { SEED_INCOME_ROWS } from "@/lib/seed-portal";
import {
  ensureSeedBookings,
  readBookingsForOwner,
} from "@/lib/bookings-store";
import { StatCard } from "@/components/portal/StatCard";
import { ButtonLink } from "@/components/ui/Button";

type IncomeRow = {
  id: string;
  date: string;
  tool: string;
  renter: string;
  days: number;
  amount: number;
};

export default function PortalIncomePage() {
  const { user } = useAuth();
  const { effectiveRole } = usePortalMode();
  const [rows, setRows] = useState<IncomeRow[]>([]);

  useEffect(() => {
    if (!user) return;
    ensureSeedBookings();
    const returned = readBookingsForOwner(user.id)
      .filter((b) => b.status === "returned")
      .map((b) => ({
        id: b.id,
        date: b.returnDate,
        tool: b.equipmentTitle,
        renter: b.renterName,
        days: Math.max(
          1,
          Math.ceil(
            (new Date(b.returnDate).getTime() -
              new Date(b.startDate).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        ),
        amount: b.totalKes,
      }));

    const seeded = SEED_INCOME_ROWS.filter((row) => row.ownerId === user.id).map(
      (row) => ({
        id: row.id,
        date: row.date,
        tool: row.tool,
        renter: row.renter,
        days: row.days,
        amount: row.amount,
      }),
    );

    const merged = [...returned, ...seeded].sort((a, b) =>
      b.date.localeCompare(a.date),
    );
    setRows(merged);
  }, [user]);

  const total = useMemo(
    () => rows.reduce((sum, row) => sum + row.amount, 0),
    [rows],
  );

  if (!user || !canList(effectiveRole)) {
    return (
      <div className="field-panel-strong rounded-xl p-8 text-center">
        <h1 className="font-display text-2xl font-semibold text-green-950">
          Income is for owners
        </h1>
        <ButtonLink href="/portal/overview" className="mt-6" variant="secondary">
          Back to overview
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-green-950">
          Income
        </h1>
        <p className="mt-2 text-ink-muted">
          Earnings from renters on your climate-smart tools (pay on delivery).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total earned"
          value={`${total.toLocaleString()} KES`}
          hint="Completed rentals"
        />
        <StatCard
          label="Rentals completed"
          value={String(rows.length)}
          hint="Returned tools"
        />
        <StatCard
          label="Avg per rental"
          value={
            rows.length
              ? `${Math.round(total / rows.length).toLocaleString()} KES`
              : "0 KES"
          }
          hint="Across returned tools"
        />
      </div>

      {rows.length === 0 ? (
        <div className="field-panel-strong rounded-2xl px-6 py-12 text-center text-sm text-ink-muted">
          No completed rentals yet. When you mark a request as returned, income
          appears here.
        </div>
      ) : (
        <div className="field-panel-strong overflow-hidden rounded-xl">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[color:var(--line)] bg-green-800/5 text-xs uppercase tracking-[0.12em] text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Tool</th>
                <th className="px-4 py-3 font-semibold">Renter</th>
                <th className="px-4 py-3 font-semibold">Days</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-[color:var(--line)]">
                  <td className="px-4 py-3 text-ink-muted">{row.date}</td>
                  <td className="px-4 py-3 font-medium text-green-950">
                    {row.tool}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{row.renter}</td>
                  <td className="px-4 py-3 text-ink-muted">{row.days}</td>
                  <td className="px-4 py-3 font-semibold text-green-800">
                    {row.amount.toLocaleString()} KES
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
