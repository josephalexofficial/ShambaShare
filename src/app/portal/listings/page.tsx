"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { canList } from "@/lib/constants";
import { SEED_EQUIPMENT } from "@/lib/seed-equipment";
import { ButtonLink } from "@/components/ui/Button";

export default function PortalListingsPage() {
  const { user } = useAuth();
  const listings = SEED_EQUIPMENT.slice(0, 4);

  if (!user || !canList(user.role)) {
    return (
      <div className="field-panel-strong rounded-xl p-8 text-center">
        <h1 className="font-display text-2xl font-semibold text-green-950">
          Listings are for owners
        </h1>
        <ButtonLink href="/join?intent=owner" className="mt-6">
          Join as Owner
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-green-950">
            My listings
          </h1>
          <p className="mt-2 text-ink-muted">
            Manage climate-smart tools you share with nearby farmers.
          </p>
        </div>
        <ButtonLink href="/list">Add listing</ButtonLink>
      </div>

      <div className="space-y-3">
        {listings.map((item) => (
          <article
            key={item.id}
            className="field-panel-strong flex flex-col gap-3 rounded-xl p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 className="font-semibold text-green-950">{item.title}</h2>
              <p className="mt-1 text-sm text-ink-muted">
                {item.locationLabel} · {item.ratePerDay.toLocaleString()} KES /
                day ·{" "}
                {item.isAvailable ? (
                  <span className="text-green-700">Available</span>
                ) : (
                  <span className="text-amber-800">Reserved</span>
                )}
              </p>
            </div>
            <Link
              href={`/equipment/${item.id}`}
              className="text-sm font-semibold text-water-700 hover:text-green-800"
            >
              View public page
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
