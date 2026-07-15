"use client";

import { FormEvent, useState } from "react";
import { EQUIPMENT_CATEGORIES, canList } from "@/lib/constants";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";

export default function ListEquipmentPage() {
  const { user, loading } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-ink-muted">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold text-green-950">
          Join as an Owner to share equipment
        </h1>
        <p className="mt-3 text-ink-muted">
          Create an Owner or Both account, then list idle climate-smart tools for
          nearby farmers.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/join?intent=owner">Join as Owner</ButtonLink>
          <ButtonLink href="/auth" variant="secondary">
            Sign in
          </ButtonLink>
        </div>
      </div>
    );
  }

  if (!canList(user.role)) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold text-green-950">
          Your account is set to Renter
        </h1>
        <p className="mt-3 text-ink-muted">
          To list equipment, join with an Owner or Both role. You can still find
          and request tools nearby.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/browse">Find tools</ButtonLink>
          <ButtonLink href="/join?intent=owner" variant="secondary">
            Create owner account
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-water-700">
        Owners
      </p>
      <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-green-950">
        Share your climate-smart equipment
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
        List idle solar pumps, soil kits, and farm tools. Set a daily rate and
        location — renters will reach you by SMS.
      </p>

      {submitted ? (
        <div className="field-panel-strong mt-10 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-green-950">
            Listing captured
          </h2>
          <p className="mt-3 text-sm text-ink-muted">
            This form is ready for Supabase insert + image upload. For now your
            listing is saved in the demo flow only.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <ButtonLink href="/browse">Find tools</ButtonLink>
            <ButtonLink href="/dashboard" variant="secondary">
              Go to dashboard
            </ButtonLink>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="field-panel-strong mt-10 space-y-4 rounded-2xl p-6 sm:p-8"
        >
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-green-950">
              Tool title
            </span>
            <input
              required
              name="title"
              placeholder="Solar Irrigation Pump"
              className="w-full rounded-md border border-[color:var(--line)] bg-white/90 px-3 py-2.5 outline-none ring-green-700 focus:ring-2"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-green-950">
              Category
            </span>
            <select
              required
              name="category"
              className="w-full rounded-md border border-[color:var(--line)] bg-white/90 px-3 py-2.5 outline-none ring-green-700 focus:ring-2"
              defaultValue="irrigation"
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
              className="w-full rounded-md border border-[color:var(--line)] bg-white/90 px-3 py-2.5 outline-none ring-green-700 focus:ring-2"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-green-950">
              Location label
            </span>
            <input
              required
              name="locationLabel"
              placeholder="Turbo, Uasin Gishu"
              className="w-full rounded-md border border-[color:var(--line)] bg-white/90 px-3 py-2.5 outline-none ring-green-700 focus:ring-2"
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
                className="w-full rounded-md border border-[color:var(--line)] bg-white/90 px-3 py-2.5 outline-none ring-green-700 focus:ring-2"
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
                className="w-full rounded-md border border-[color:var(--line)] bg-white/90 px-3 py-2.5 outline-none ring-green-700 focus:ring-2"
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
              placeholder="What the tool is, condition, and what renters should know."
              className="w-full rounded-md border border-[color:var(--line)] bg-white/90 px-3 py-2.5 outline-none ring-green-700 focus:ring-2"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-green-950">Photo</span>
            <input
              type="file"
              accept="image/*"
              name="image"
              className="w-full rounded-md border border-[color:var(--line)] bg-white/90 px-3 py-2.5 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-green-800 file:px-3 file:py-1.5 file:text-white"
            />
          </label>

          <Button type="submit" className="w-full sm:w-auto">
            Publish listing
          </Button>
        </form>
      )}
    </div>
  );
}
