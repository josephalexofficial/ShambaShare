"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { isAdmin } from "@/lib/constants";
import { SEED_EQUIPMENT } from "@/lib/seed-equipment";
import { ButtonLink } from "@/components/ui/Button";

export default function AdminListingsPage() {
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
          All listings
        </h1>
        <p className="mt-2 text-ink-muted">
          Moderate climate-smart equipment posted across the platform.
        </p>
      </div>
      <div className="space-y-3">
        {SEED_EQUIPMENT.map((item) => (
          <article
            key={item.id}
            className="field-panel-strong flex flex-col gap-2 rounded-xl p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 className="font-semibold text-green-950">{item.title}</h2>
              <p className="mt-1 text-sm text-ink-muted">
                {item.ownerName} · {item.locationLabel} ·{" "}
                {item.ratePerDay.toLocaleString()} KES/day
              </p>
            </div>
            <span
              className={`text-sm font-semibold ${
                item.isAvailable ? "text-green-700" : "text-amber-800"
              }`}
            >
              {item.isAvailable ? "Live" : "Reserved"}
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}
