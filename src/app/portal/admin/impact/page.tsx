"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { isAdmin } from "@/lib/constants";
import { StatCard } from "@/components/portal/StatCard";
import { ButtonLink } from "@/components/ui/Button";

export default function AdminImpactPage() {
  const { user } = useAuth();
  if (!user || !isAdmin(user.role)) {
    return (
      <div className="field-panel-strong rounded-xl p-8 text-center">
        <h1 className="font-display text-2xl font-semibold text-green-950">
          Admin access only
        </h1>
        <ButtonLink href="/portal/overview" className="mt-6" variant="secondary">
          Back
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-green-950">
          Impact snapshot
        </h1>
        <p className="mt-2 text-ink-muted">
          Numbers that show climate adaptation and shared access across the network.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Farmers reached" value="1,240" hint="Demo projection" />
        <StatCard label="Tools shared" value="86" hint="Climate-smart assets" />
        <StatCard label="Idle days reused" value="410" hint="Circular use" />
        <StatCard label="Counties" value="1 → 3" hint="24-month path" />
      </div>
      <div className="field-panel-strong rounded-xl p-6 text-sm leading-relaxed text-ink-muted">
        ShambaShare turns idle solar pumps, soil kits, and conservation tools into
        on-demand resilience for smallholders — tracked here for operations and
        community growth.
      </div>
    </div>
  );
}
