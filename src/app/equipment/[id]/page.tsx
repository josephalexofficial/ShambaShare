"use client";

import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import {
  ELDORET_CENTER,
  getEquipmentById,
  haversineKm,
} from "@/lib/seed-equipment";
import { EQUIPMENT_CATEGORIES, canRent } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";

type Props = {
  params: Promise<{ id: string }>;
};

export default function EquipmentDetailPage({ params }: Props) {
  const { id } = use(params);
  const item = getEquipmentById(id);
  const { user } = useAuth();

  if (!item) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold text-green-950">
          Tool not found
        </h1>
        <ButtonLink href="/browse" className="mt-6">
          Find tools
        </ButtonLink>
      </div>
    );
  }

  const category =
    EQUIPMENT_CATEGORIES.find((entry) => entry.value === item.category)
      ?.label ?? item.category;
  const distanceKm = haversineKm(
    ELDORET_CENTER.lat,
    ELDORET_CENTER.lng,
    item.locationLat,
    item.locationLng,
  );

  const rentHref = !user
    ? `/join?intent=renter&next=/equipment/${item.id}`
    : canRent(user.role)
      ? `/dashboard?request=${item.id}`
      : "/join?intent=both";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href="/browse"
        className="text-sm font-medium text-water-700 hover:text-green-800"
      >
        ← Back to find tools
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        </div>

        <div className="field-panel-strong rounded-2xl p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-water-700">
            {category}
          </p>
          <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-green-950 sm:text-4xl">
            {item.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            {item.description}
          </p>

          <dl className="mt-8 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4 border-b border-[color:var(--line)] pb-3">
              <dt className="text-ink-muted">Daily rate</dt>
              <dd className="font-semibold text-green-800">
                {item.ratePerDay.toLocaleString()} KES
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-[color:var(--line)] pb-3">
              <dt className="text-ink-muted">Location</dt>
              <dd className="font-medium text-green-950">{item.locationLabel}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-[color:var(--line)] pb-3">
              <dt className="text-ink-muted">Distance</dt>
              <dd className="font-medium text-green-950">
                {distanceKm.toFixed(1)} km from {ELDORET_CENTER.label}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-[color:var(--line)] pb-3">
              <dt className="text-ink-muted">Owner</dt>
              <dd className="font-medium text-green-950">{item.ownerName}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-ink-muted">Availability</dt>
              <dd
                className={`font-semibold ${item.isAvailable ? "text-green-700" : "text-soil-700"}`}
              >
                {item.isAvailable ? "Available" : "Currently reserved"}
              </dd>
            </div>
          </dl>

          <div className="mt-8 space-y-3">
            {item.isAvailable ? (
              <ButtonLink href={rentHref} className="w-full">
                {!user
                  ? "Join to request rent"
                  : canRent(user.role)
                    ? "Request to rent"
                    : "Switch to Renter/Both to rent"}
              </ButtonLink>
            ) : (
              <ButtonLink href="/browse" variant="secondary" className="w-full">
                Find other tools
              </ButtonLink>
            )}
            <p className="text-center text-xs leading-relaxed text-ink-muted">
              Reserve & pay on delivery. A request notifies the owner by SMS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
