"use client";

import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
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

export default function BrowsePage() {
  const [category, setCategory] = useState("all");
  const [availableOnly, setAvailableOnly] = useState(true);
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
      .filter((item) => (availableOnly ? item.isAvailable : true))
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
  }, [category, availableOnly, search]);

  const availableCount = SEED_EQUIPMENT.filter((item) => item.isAvailable).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-water-700">
            Find tools
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-green-950 sm:text-5xl">
            Nearest climate-smart equipment
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            Browse owner listings sorted by distance from {ELDORET_CENTER.label}.
            Book online with clear start and return dates.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:min-w-[280px]">
          <div className="rounded-2xl border border-[color:var(--line)] bg-white px-4 py-3">
            <p className="text-xs text-ink-muted">Available now</p>
            <p className="mt-1 text-2xl font-semibold text-green-900">
              {availableCount}
            </p>
          </div>
          <div className="rounded-2xl border border-[color:var(--line)] bg-white px-4 py-3">
            <p className="text-xs text-ink-muted">Sorted from</p>
            <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-green-900">
              <MapPin size={14} />
              {ELDORET_CENTER.label}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <FindToolsFilterBar
          category={category}
          onCategoryChange={setCategory}
          availableOnly={availableOnly}
          onAvailableOnlyChange={setAvailableOnly}
          search={search}
          onSearchChange={setSearch}
          resultCount={listings.length}
        />
      </div>

      {listings.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-[color:var(--line)] bg-white/70 px-6 py-16 text-center">
          <p className="text-2xl font-semibold text-green-950">
            No tools match these filters
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
            Try another category, clear your search, or include reserved
            listings.
          </p>
          <button
            type="button"
            onClick={() => {
              setCategory("all");
              setSearch("");
              setAvailableOnly(true);
            }}
            className="mt-6 inline-flex items-center justify-center rounded-xl border border-[color:var(--line)] bg-white px-5 py-3 text-sm font-semibold text-green-900 hover:bg-[color:var(--cream-field)]"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((item, index) => (
            <EquipmentCard
              key={item.id}
              item={item}
              index={index}
              href={`/equipment/${item.id}`}
              ctaLabel="View details"
            />
          ))}
        </div>
      )}

      <div className="mt-12 rounded-2xl bg-gradient-to-br from-green-950 via-green-800 to-water-700 px-6 py-8 text-white sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Own idle equipment?
            </h2>
            <p className="mt-2 max-w-xl text-sm text-white/80">
              List your climate-smart tools and earn when nearby farmers book
              them through the portal.
            </p>
          </div>
          <ButtonLink
            href="/join?intent=owner"
            variant="on-dark"
            className="shrink-0 rounded-xl"
          >
            Share your equipment
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
