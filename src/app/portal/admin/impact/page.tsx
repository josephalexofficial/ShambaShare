"use client";

import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/portal/AdminGuard";
import { StatCard } from "@/components/portal/StatCard";
import { listLocalAccounts } from "@/lib/auth/local-accounts";
import { readBookings } from "@/lib/bookings-store";
import { readOwnerListings } from "@/lib/listings-store";
import { SEED_EQUIPMENT } from "@/lib/seed-equipment";

export default function AdminImpactPage() {
  return (
    <AdminGuard>
      <AdminImpactInner />
    </AdminGuard>
  );
}

function AdminImpactInner() {
  const [stats, setStats] = useState({
    farmers: 0,
    tools: 0,
    bookings: 0,
    available: 0,
  });

  useEffect(() => {
    const owners = readOwnerListings();
    const tools = SEED_EQUIPMENT.length + owners.length;
    const available =
      SEED_EQUIPMENT.filter((item) => item.isAvailable).length +
      owners.filter((item) => item.isAvailable).length;
    setStats({
      farmers: listLocalAccounts().length,
      tools,
      bookings: readBookings().length,
      available,
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-green-950">
          Impact snapshot
        </h1>
        <p className="mt-2 text-ink-muted">
          Numbers that show climate adaptation and shared access across the
          network.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Farmers reached"
          value={String(Math.max(stats.farmers, 1))}
          hint="Accounts on the platform"
        />
        <StatCard
          label="Tools shared"
          value={String(stats.tools)}
          hint="Climate-smart assets listed"
        />
        <StatCard
          label="Available now"
          value={String(stats.available)}
          hint="Ready to rent nearby"
        />
        <StatCard
          label="Booking requests"
          value={String(stats.bookings)}
          hint="Demand for shared tools"
        />
      </div>

      <div className="field-panel-strong space-y-3 rounded-2xl p-6 text-sm leading-relaxed text-ink-muted">
        <p className="text-base font-semibold text-green-950">
          What this means for climate resilience
        </p>
        <p>
          ShambaShare turns idle solar pumps, soil kits, and conservation tools
          into on-demand resilience for smallholders. Sharing lowers the cost of
          adapting to drought and erratic rains, while keeping fewer machines
          sitting unused.
        </p>
        <p>
          Use these figures in demos, mentor check-ins, and community growth
          conversations — then keep listings and users healthy from the admin
          tools.
        </p>
      </div>
    </div>
  );
}
