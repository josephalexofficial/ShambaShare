"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ELDORET_CENTER,
  SEED_EQUIPMENT,
  haversineKm,
} from "@/lib/seed-equipment";
import { EQUIPMENT_CATEGORIES } from "@/lib/constants";

function categoryLabel(value: string) {
  return (
    EQUIPMENT_CATEGORIES.find((item) => item.value === value)?.label ?? value
  );
}

export default function BrowsePage() {
  const [category, setCategory] = useState<string>("all");
  const [availableOnly, setAvailableOnly] = useState(true);

  const listings = useMemo(() => {
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
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [category, availableOnly]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-water-700">
          Find tools
        </p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-green-950 sm:text-5xl">
          Nearest climate-smart equipment
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-muted">
          Showing results sorted from {ELDORET_CENTER.label}. Distance-first
          discovery keeps transport practical for smallholders.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-xl border border-[color:var(--line)] bg-white/70 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${
              category === "all"
                ? "bg-green-800 text-white"
                : "bg-white text-green-900 hover:bg-green-800/10"
            }`}
          >
            All
          </button>
          {EQUIPMENT_CATEGORIES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setCategory(item.value)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                category === item.value
                  ? "bg-green-800 text-white"
                  : "bg-white text-green-900 hover:bg-green-800/10"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(event) => setAvailableOnly(event.target.checked)}
            className="size-4 accent-green-700"
          />
          Available only
        </label>
      </div>

      {listings.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-[color:var(--line)] bg-white/50 px-6 py-16 text-center">
          <p className="font-display text-2xl font-semibold text-green-950">
            No tools match these filters
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            Try another category or include unavailable listings.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((item, index) => (
            <Link
              key={item.id}
              href={`/equipment/${item.id}`}
              className={`field-panel-strong group overflow-hidden rounded-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(18,32,24,0.12)] animate-stagger animate-delay-${Math.min(index + 1, 4)}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {!item.isAvailable ? (
                  <span className="absolute left-3 top-3 rounded-md bg-soil-700 px-2 py-1 text-xs font-semibold text-white">
                    Reserved
                  </span>
                ) : null}
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-water-700">
                  {categoryLabel(item.category)}
                </p>
                <h2 className="font-display mt-2 text-xl font-semibold text-green-950">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm text-ink-muted">
                  {item.locationLabel} · {item.distanceKm.toFixed(1)} km away
                </p>
                <p className="mt-3 text-sm font-semibold text-green-800">
                  {item.ratePerDay.toLocaleString()} KES / day
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
