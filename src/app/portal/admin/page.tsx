"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { isAdmin } from "@/lib/constants";
import { StatCard } from "@/components/portal/StatCard";
import { ButtonLink } from "@/components/ui/Button";
import { SEED_EQUIPMENT } from "@/lib/seed-equipment";

export default function AdminHomePage() {
  const { user } = useAuth();

  if (!user || !isAdmin(user.role)) {
    return (
      <div className="field-panel-strong rounded-xl p-8 text-center">
        <h1 className="font-display text-2xl font-semibold text-green-950">
          Admin access only
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
          Admin home
        </h1>
        <p className="mt-2 text-ink-muted">
          Operate ShambaShare for resilient farming communities.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value="128" />
        <StatCard label="Listings" value={String(SEED_EQUIPMENT.length)} />
        <StatCard label="Open disputes" value="0" hint="None right now" />
        <StatCard label="Counties live" value="1" hint="Uasin Gishu first" />
      </div>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/portal/admin/users">Users</ButtonLink>
        <ButtonLink href="/portal/admin/listings" variant="secondary">
          Listings
        </ButtonLink>
        <ButtonLink href="/portal/admin/impact" variant="secondary">
          Impact
        </ButtonLink>
      </div>
    </div>
  );
}
