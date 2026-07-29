"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  MapPin,
  Package,
  Plus,
  Wrench,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { usePortalMode } from "@/components/portal/PortalModeProvider";
import { Button, ButtonLink } from "@/components/ui/Button";
import {
  EQUIPMENT_CATEGORIES,
  canList,
  type EquipmentCategory,
} from "@/lib/constants";
import {
  addOwnerListing,
  readOwnerListingsForUser,
  toggleOwnerListingAvailability,
  type OwnerListing,
} from "@/lib/listings-store";

const inputClass =
  "w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--cream-field)]/40 px-3.5 py-3 text-[0.9375rem] text-green-950 outline-none ring-green-700 transition placeholder:text-ink-muted/70 focus:bg-white focus:ring-2";

export default function ListingsClient() {
  const { user } = useAuth();
  const { effectiveRole } = usePortalMode();
  const router = useRouter();
  const searchParams = useSearchParams();
  const wantNew = searchParams.get("new") === "1";

  const [mode, setMode] = useState<"list" | "create">(
    wantNew ? "create" : "list",
  );
  const [listings, setListings] = useState<OwnerListing[]>([]);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    setListings(readOwnerListingsForUser(user.id));
  }, [user]);

  useEffect(() => {
    setMode(wantNew ? "create" : "list");
  }, [wantNew]);

  const categoryLabel = useMemo(() => {
    return Object.fromEntries(
      EQUIPMENT_CATEGORIES.map((item) => [item.value, item.label]),
    ) as Record<EquipmentCategory, string>;
  }, []);

  if (!user || !canList(effectiveRole)) {
    return (
      <div className="field-panel-strong rounded-2xl p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-800/10 text-green-800">
          <Wrench size={26} />
        </span>
        <h1 className="mt-5 text-2xl font-semibold text-green-950">
          Listings are for owners
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
          Switch your role to Owner or Both in Settings, or create an owner
          account to share idle tools.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <ButtonLink href="/portal/settings" className="rounded-xl">
            Open Settings
          </ButtonLink>
          <ButtonLink
            href="/join?intent=owner"
            variant="secondary"
            className="rounded-xl"
          >
            Join as Owner
          </ButtonLink>
        </div>
      </div>
    );
  }

  function openCreate() {
    setSaved(false);
    setMode("create");
    router.replace("/portal/listings?new=1");
  }

  function openList() {
    setMode("list");
    router.replace("/portal/listings");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const imageFile = form.get("image");
    const fallbackImage =
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80";

    const finish = (imageUrl: string) => {
      addOwnerListing({
        title: String(form.get("title") ?? "").trim(),
        category: String(form.get("category") ?? "other") as EquipmentCategory,
        description: String(form.get("description") ?? "").trim(),
        ratePerDay: Number(form.get("rate") ?? 0),
        locationLabel: String(form.get("locationLabel") ?? "").trim(),
        locationLat: Number(form.get("lat") ?? 0.5143),
        locationLng: Number(form.get("lng") ?? 35.2698),
        imageUrl,
        ownerName: user.fullName,
        ownerId: user.id,
        isAvailable: true,
      });
      setListings(readOwnerListingsForUser(user.id));
      setSaved(true);
      setSubmitting(false);
      setMode("list");
      router.replace("/portal/listings");
    };

    if (imageFile instanceof File && imageFile.size > 0) {
      const reader = new FileReader();
      reader.onload = () => finish(String(reader.result || fallbackImage));
      reader.onerror = () => finish(fallbackImage);
      reader.readAsDataURL(imageFile);
      return;
    }

    finish(fallbackImage);
  }

  function handleToggle(id: string) {
    if (!user) return;
    setListings(toggleOwnerListingAvailability(id, user.id));
  }

  if (mode === "create") {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <button
            type="button"
            onClick={openList}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-water-700 hover:text-green-800"
          >
            <ArrowLeft size={16} />
            Back to my listings
          </button>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-green-950">
            Add a listing
          </h1>
          <p className="mt-2 text-ink-muted">
            Share an idle climate-smart tool. Renters nearby can request it from
            Find tools.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="field-panel-strong space-y-4 rounded-2xl p-5 sm:p-6"
        >
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-green-950">
              Tool title
            </span>
            <input
              required
              name="title"
              placeholder="Solar Irrigation Pump"
              className={inputClass}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-green-950">
                Category
              </span>
              <select
                required
                name="category"
                defaultValue="irrigation"
                className={inputClass}
              >
                {EQUIPMENT_CATEGORIES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-green-950">
                Daily rate (KES)
              </span>
              <input
                required
                type="number"
                min={1}
                name="rate"
                placeholder="500"
                className={inputClass}
              />
            </label>
          </div>

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-green-950">
              Location
            </span>
            <input
              required
              name="locationLabel"
              defaultValue={user.county || "Turbo, Uasin Gishu"}
              placeholder="Turbo, Uasin Gishu"
              className={inputClass}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-green-950">
                Latitude
              </span>
              <input
                required
                name="lat"
                defaultValue="0.5143"
                className={inputClass}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-green-950">
                Longitude
              </span>
              <input
                required
                name="lng"
                defaultValue="35.2698"
                className={inputClass}
              />
            </label>
          </div>

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-green-950">
              Description
            </span>
            <textarea
              required
              name="description"
              rows={4}
              placeholder="Condition, what renters should know, and pickup notes."
              className={inputClass}
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-green-950">
              Photo (optional)
            </span>
            <input
              type="file"
              accept="image/*"
              name="image"
              className="w-full rounded-xl border border-[color:var(--line)] bg-white px-3 py-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-green-800 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white"
            />
          </label>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              className="rounded-xl"
              onClick={openList}
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl" disabled={submitting}>
              {submitting ? "Publishing…" : "Publish listing"}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-green-950">
            My listings
          </h1>
          <p className="mt-2 text-ink-muted">
            Manage climate-smart tools you share with nearby farmers.
          </p>
        </div>
        <Button type="button" className="rounded-xl" onClick={openCreate}>
          <Plus size={16} />
          Add listing
        </Button>
      </div>

      {saved ? (
        <div className="flex items-start gap-3 rounded-2xl border border-green-700/20 bg-green-800/10 px-4 py-3.5 text-sm text-green-900">
          <Check size={18} className="mt-0.5 shrink-0 text-green-800" />
          <p>
            Listing published. You can pause it anytime or add another tool.
          </p>
        </div>
      ) : null}

      {listings.length === 0 ? (
        <div className="field-panel-strong rounded-2xl px-6 py-14 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-800/10 text-green-800">
            <Package size={26} />
          </span>
          <p className="mt-5 text-2xl font-semibold text-green-950">
            No listings yet
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
            Add your first idle tool — set a daily rate, location, and
            description so nearby renters can request it.
          </p>
          <Button type="button" className="mt-6 rounded-xl" onClick={openCreate}>
            <Plus size={16} />
            Add your first listing
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((item) => (
            <article
              key={item.id}
              className="field-panel-strong rounded-2xl p-5 transition hover:border-green-700/20"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-green-800/10 text-green-800">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package size={20} />
                    )}
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-green-950">
                      {item.title}
                    </h2>
                    <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-muted">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={14} />
                        {item.locationLabel}
                      </span>
                      <span>·</span>
                      <span>
                        {categoryLabel[item.category] ?? item.category}
                      </span>
                      <span>·</span>
                      <span className="font-semibold text-green-900">
                        {item.ratePerDay.toLocaleString()} KES / day
                      </span>
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-ink-muted">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <span
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                      item.isAvailable
                        ? "bg-green-100 text-green-900"
                        : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    {item.isAvailable ? "Available" : "Paused"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    className="rounded-lg border border-[color:var(--line)] bg-white px-3 py-1.5 text-xs font-semibold text-green-900 hover:bg-[color:var(--cream-field)]"
                  >
                    {item.isAvailable ? "Pause" : "Make available"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
