"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { canRent } from "@/lib/constants";
import {
  ELDORET_CENTER,
  SEED_EQUIPMENT,
  haversineKm,
} from "@/lib/seed-equipment";
import {
  EquipmentCard,
  FindToolsFilterBar,
} from "@/components/tools/EquipmentCard";
import { ButtonLink } from "@/components/ui/Button";

export default function PortalFindPage() {
  const { user } = useAuth();
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const listings = useMemo(() => {
    const query = search.trim().toLowerCase();
    return SEED_EQUIPMENT.map((item) => ({
      ...item,
      distanceKm: haversineKm(
        ELDORET_CENTER.lat,
        ELDORET_CENTER.lng,
        item.locationLat,
        item.locationLng,
      ),
    }))
      .filter((item) => item.isAvailable)
      .filter((item) => (category === "all" ? true : item.category === category))
      .filter((item) => {
        if (!query) return true;
        return (
          item.title.toLowerCase().includes(query) ||
          item.locationLabel.toLowerCase().includes(query) ||
          item.ownerName.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [category, search]);

  if (!user || !canRent(user.role)) {
    return (
      <div className="rounded-2xl border border-[color:var(--line)] bg-white p-8 text-center shadow-[0_8px_30px_rgba(18,32,24,0.04)]">
        <h1 className="text-2xl font-semibold text-green-950">
          Find tools is for renters
        </h1>
        <p className="mt-2 text-ink-muted">
          Switch to a Renter or Both account to book climate-smart equipment.
        </p>
        <ButtonLink href="/portal/overview" className="mt-6" variant="secondary">
          Back to overview
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-green-950">
            Find tools
          </h1>
          <p className="mt-2 max-w-2xl text-ink-muted">
            Nearby owner posts around {ELDORET_CENTER.label}, nearest first.
            Pick a tool, set dates, and request to rent.
          </p>
        </div>
        <p className="text-sm font-semibold text-green-800">
          {listings.length} available
        </p>
      </div>

      <FindToolsFilterBar
        category={category}
        onCategoryChange={setCategory}
        search={search}
        onSearchChange={setSearch}
        resultCount={listings.length}
      />

      {listings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[color:var(--line)] bg-white px-6 py-14 text-center">
          <p className="text-2xl font-semibold text-green-950">No tools found</p>
          <p className="mt-2 text-sm text-ink-muted">
            Try another category or clear your search.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((item, index) => (
            <EquipmentCard
              key={item.id}
              item={item}
              index={index}
              href={`/portal/book/${item.id}`}
              ctaLabel="Book this tool"
            />
          ))}
        </div>
      )}
    </div>
  );
}
