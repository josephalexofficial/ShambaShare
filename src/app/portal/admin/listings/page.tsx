"use client";

import { useEffect, useMemo, useState } from "react";
import { Boxes, Search, Trash2 } from "lucide-react";
import { AdminGuard } from "@/components/portal/AdminGuard";
import {
  adminRemoveListing,
  adminToggleListingAvailability,
  readOwnerListings,
  type OwnerListing,
} from "@/lib/listings-store";
import { SEED_EQUIPMENT, type SeedEquipment } from "@/lib/seed-equipment";

type Row = {
  id: string;
  title: string;
  ownerName: string;
  locationLabel: string;
  ratePerDay: number;
  isAvailable: boolean;
  source: "seed" | "owner";
};

export default function AdminListingsPage() {
  return (
    <AdminGuard>
      <AdminListingsInner />
    </AdminGuard>
  );
}

function AdminListingsInner() {
  const [ownerListings, setOwnerListings] = useState<OwnerListing[]>([]);
  const [query, setQuery] = useState("");

  function refresh() {
    setOwnerListings(readOwnerListings());
  }

  useEffect(() => {
    refresh();
  }, []);

  const rows = useMemo<Row[]>(() => {
    const seed: Row[] = SEED_EQUIPMENT.map((item: SeedEquipment) => ({
      id: item.id,
      title: item.title,
      ownerName: item.ownerName,
      locationLabel: item.locationLabel,
      ratePerDay: item.ratePerDay,
      isAvailable: item.isAvailable,
      source: "seed",
    }));
    const owned: Row[] = ownerListings.map((item) => ({
      id: item.id,
      title: item.title,
      ownerName: item.ownerName,
      locationLabel: item.locationLabel,
      ratePerDay: item.ratePerDay,
      isAvailable: item.isAvailable,
      source: "owner",
    }));
    const all = [...owned, ...seed];
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.ownerName.toLowerCase().includes(q) ||
        item.locationLabel.toLowerCase().includes(q),
    );
  }, [ownerListings, query]);

  function handleToggle(row: Row) {
    if (row.source !== "owner") return;
    setOwnerListings(adminToggleListingAvailability(row.id));
  }

  function handleRemove(row: Row) {
    if (row.source !== "owner") return;
    if (!window.confirm(`Remove listing “${row.title}”?`)) return;
    setOwnerListings(adminRemoveListing(row.id));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-green-950">
            All listings
          </h1>
          <p className="mt-2 text-ink-muted">
            Moderate climate-smart equipment across the platform. Owner posts
            can be paused or removed.
          </p>
        </div>
        <p className="text-sm font-semibold text-green-800">
          {rows.length} listings
        </p>
      </div>

      <div className="relative">
        <Search
          size={17}
          className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-muted"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tool, owner, location…"
          className="w-full rounded-xl border border-[color:var(--line)] bg-white py-3 pr-3 pl-10 text-sm outline-none ring-green-700 focus:ring-2"
        />
      </div>

      {rows.length === 0 ? (
        <div className="field-panel-strong rounded-2xl px-6 py-14 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-800/10 text-green-800">
            <Boxes size={26} />
          </span>
          <p className="mt-5 text-xl font-semibold text-green-950">
            No listings found
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((item) => (
            <article
              key={`${item.source}-${item.id}`}
              className="field-panel-strong flex flex-col gap-3 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-green-950">{item.title}</h2>
                  <span className="rounded-md bg-green-800/8 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-800">
                    {item.source === "seed" ? "Demo" : "Owner"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink-muted">
                  {item.ownerName} · {item.locationLabel} ·{" "}
                  {item.ratePerDay.toLocaleString()} KES/day
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                    item.isAvailable
                      ? "bg-green-100 text-green-900"
                      : "bg-amber-100 text-amber-900"
                  }`}
                >
                  {item.isAvailable ? "Live" : "Paused"}
                </span>
                {item.source === "owner" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleToggle(item)}
                      className="rounded-lg border border-[color:var(--line)] bg-white px-3 py-1.5 text-xs font-semibold text-green-900 hover:bg-[color:var(--cream-field)]"
                    >
                      {item.isAvailable ? "Pause" : "Make live"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(item)}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={13} />
                      Remove
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-ink-muted">Demo catalogue</span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
