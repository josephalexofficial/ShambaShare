"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { canList } from "@/lib/constants";
import { SEED_INCOME_ROWS } from "@/lib/seed-portal";
import { StatCard } from "@/components/portal/StatCard";
import { ButtonLink } from "@/components/ui/Button";

export default function PortalIncomePage() {
  const { user } = useAuth();
  const total = SEED_INCOME_ROWS.reduce((sum, row) => sum + row.amount, 0);

  if (!user || !canList(user.role)) {
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
          Track earnings from shared climate-smart tools (pay on delivery).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total earned"
          value={`${total.toLocaleString()} KES`}
          hint="Completed demo rentals"
        />
        <StatCard
          label="Rentals completed"
          value={String(SEED_INCOME_ROWS.length)}
          hint="This season"
        />
        <StatCard
          label="Avg per rental"
          value={`${Math.round(total / SEED_INCOME_ROWS.length).toLocaleString()} KES`}
          hint="Across returned tools"
        />
      </div>

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
            {SEED_INCOME_ROWS.map((row) => (
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
    </div>
  );
}
