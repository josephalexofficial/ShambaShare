"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { usePortalMode } from "@/components/portal/PortalModeProvider";
import { canRent } from "@/lib/constants";
import {
  getMarketplaceListingById,
  isOwnListing,
  type MarketplaceListing,
} from "@/lib/marketplace";
import { addBooking, daysBetween } from "@/lib/bookings-store";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function PortalBookPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { effectiveRole } = usePortalMode();
  const [item, setItem] = useState<MarketplaceListing | null | undefined>(
    undefined,
  );
  const [error, setError] = useState<string | null>(null);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useEffect(() => {
    setItem(getMarketplaceListingById(params.id));
  }, [params.id]);

  if (!user || !canRent(effectiveRole)) {
    return (
      <div className="field-panel-strong rounded-xl p-8 text-center">
        <h1 className="font-display text-2xl font-semibold text-green-950">
          Sign in as a renter to book
        </h1>
        <ButtonLink href="/join?intent=renter" className="mt-6">
          Join as Renter
        </ButtonLink>
      </div>
    );
  }

  if (item === undefined) {
    return (
      <div className="field-panel-strong rounded-xl p-8 text-center">
        <p className="text-ink-muted">Loading tool…</p>
      </div>
    );
  }

  // Guard: a member can never rent their own tool.
  if (item && isOwnListing(item, user.id)) {
    return (
      <div className="field-panel-strong rounded-xl p-8 text-center">
        <h1 className="font-display text-2xl font-semibold text-green-950">
          This is your own tool
        </h1>
        <p className="mx-auto mt-2 max-w-md text-ink-muted">
          You can’t rent equipment you own. Manage it from My listings instead.
        </p>
        <ButtonLink href="/portal/listings" className="mt-6" variant="secondary">
          Go to My listings
        </ButtonLink>
      </div>
    );
  }

  if (!item || !item.isAvailable) {
    return (
      <div className="field-panel-strong rounded-xl p-8 text-center">
        <h1 className="font-display text-2xl font-semibold text-green-950">
          Tool unavailable
        </h1>
        <ButtonLink href="/portal/find" className="mt-6" variant="secondary">
          Back to Find tools
        </ButtonLink>
      </div>
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const startDate = String(form.get("startDate"));
    const returnDate = String(form.get("returnDate"));

    if (returnDate <= startDate) {
      setError("Return date must be after the start date.");
      return;
    }

    const days = daysBetween(startDate, returnDate);
    const totalKes = days * item!.ratePerDay;

    addBooking({
      id: `bk-${Date.now()}`,
      equipmentId: item!.id,
      equipmentTitle: item!.title,
      ownerName: item!.ownerName,
      renterName: user!.fullName,
      renterPhone: user!.phone,
      startDate,
      returnDate,
      ratePerDay: item!.ratePerDay,
      totalKes,
      status: "pending",
      locationLabel: item!.locationLabel,
      createdAt: new Date().toISOString(),
    });

    router.push("/portal/bookings?booked=1");
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-green-950">
          Book {item.title}
        </h1>
        <p className="mt-2 text-ink-muted">
          {item.ownerName} · {item.locationLabel} · {item.ratePerDay.toLocaleString()}{" "}
          KES / day · Pay on delivery
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="field-panel-strong space-y-4 rounded-xl p-6"
      >
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-green-950">
            Start date
          </span>
          <input
            required
            type="date"
            name="startDate"
            min={today}
            defaultValue={today}
            className="w-full rounded-md border border-[color:var(--line)] bg-white px-3 py-2.5 outline-none ring-green-700 focus:ring-2"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-green-950">
            Return date
          </span>
          <input
            required
            type="date"
            name="returnDate"
            min={today}
            className="w-full rounded-md border border-[color:var(--line)] bg-white px-3 py-2.5 outline-none ring-green-700 focus:ring-2"
          />
        </label>
        <p className="text-xs text-ink-muted">
          After you book, the request appears in the owner’s portal. Your phone (
          {user.phone || "add phone in Settings"}) stays available so you can
          coordinate pickup once approved.
        </p>
        {error ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="w-full">
          Confirm booking request
        </Button>
      </form>
    </div>
  );
}
