"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Search } from "lucide-react";
import { EQUIPMENT_CATEGORIES } from "@/lib/constants";
function categoryLabel(value: string) {
  return (
    EQUIPMENT_CATEGORIES.find((item) => item.value === value)?.label ?? value
  );
}

type CardListing = {
  id: string;
  title: string;
  category: string;
  ratePerDay: number;
  locationLabel: string;
  imageUrl: string;
  ownerName: string;
  isAvailable: boolean;
  distanceKm: number;
};

type EquipmentCardProps = {
  item: CardListing;
  href: string;
  ctaLabel?: string;
  index?: number;
};

export function EquipmentCard({
  item,
  href,
  ctaLabel = "View details",
  index = 0,
}: EquipmentCardProps) {
  return (
    <Link
      href={href}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--line)] bg-white shadow-[0_8px_30px_rgba(18,32,24,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(18,32,24,0.12)] animate-stagger animate-delay-${Math.min(index + 1, 4)}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-green-950/35 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-lg bg-white/95 px-2.5 py-1 text-xs font-semibold text-green-900 shadow-sm">
            {item.distanceKm.toFixed(1)} km
          </span>
          <span
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold text-white shadow-sm ${
              item.isAvailable ? "bg-green-700" : "bg-soil-700"
            }`}
          >
            {item.isAvailable ? "Available" : "Reserved"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-water-700">
          {categoryLabel(item.category)}
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-green-950">
          {item.title}
        </h2>
        <p className="mt-2 flex items-start gap-1.5 text-sm text-ink-muted">
          <MapPin size={15} className="mt-0.5 shrink-0 text-green-700" />
          <span>
            {item.locationLabel}
            <span className="text-ink-muted/80"> · {item.ownerName}</span>
          </span>
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-xs text-ink-muted">Daily rate</p>
            <p className="text-base font-semibold text-green-800">
              {item.ratePerDay.toLocaleString()}{" "}
              <span className="text-sm font-medium">KES</span>
            </p>
          </div>
          <span className="inline-flex items-center rounded-xl bg-green-800 px-3 py-2 text-xs font-semibold text-white transition group-hover:bg-green-900">
            {ctaLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}

type FilterBarProps = {
  category: string;
  onCategoryChange: (value: string) => void;
  availableOnly?: boolean;
  onAvailableOnlyChange?: (value: boolean) => void;
  search: string;
  onSearchChange: (value: string) => void;
  resultCount: number;
};

export function FindToolsFilterBar({
  category,
  onCategoryChange,
  availableOnly,
  onAvailableOnlyChange,
  search,
  onSearchChange,
  resultCount,
}: FilterBarProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-[color:var(--line)] bg-white/90 p-4 shadow-[0_8px_30px_rgba(18,32,24,0.04)] backdrop-blur sm:p-5">
      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
        />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search pumps, soil kits, tillers…"
          className="w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--cream-field)]/60 py-3 pr-4 pl-11 text-sm text-green-950 outline-none ring-green-700 transition placeholder:text-ink-muted/70 focus:bg-white focus:ring-2"
        />
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={`rounded-xl px-3.5 py-2 text-sm font-medium transition ${
              category === "all"
                ? "bg-green-800 text-white shadow-[0_8px_18px_rgba(27,77,50,0.22)]"
                : "bg-[color:var(--cream-field)] text-green-900 hover:bg-green-800/10"
            }`}
          >
            All
          </button>
          {EQUIPMENT_CATEGORIES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onCategoryChange(item.value)}
              className={`rounded-xl px-3.5 py-2 text-sm font-medium transition ${
                category === item.value
                  ? "bg-green-800 text-white shadow-[0_8px_18px_rgba(27,77,50,0.22)]"
                  : "bg-[color:var(--cream-field)] text-green-900 hover:bg-green-800/10"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {typeof availableOnly === "boolean" && onAvailableOnlyChange ? (
            <label className="flex items-center gap-2 text-sm text-ink-muted">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(event) => onAvailableOnlyChange(event.target.checked)}
                className="size-4 accent-green-700"
              />
              Available only
            </label>
          ) : null}
          <p className="text-sm font-medium text-green-900">
            {resultCount} {resultCount === 1 ? "tool" : "tools"}
          </p>
        </div>
      </div>
    </div>
  );
}
