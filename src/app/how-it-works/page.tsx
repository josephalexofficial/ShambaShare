import type { Metadata } from "next";
import {
  ArrowRight,
  CalendarRange,
  CheckCircle2,
  Handshake,
  LayoutDashboard,
  MapPinned,
  Sprout,
  Users,
  Wrench,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "List climate-smart tools, find the nearest option, book online, and manage rentals in your portal.",
};

const steps = [
  {
    icon: Sprout,
    title: "Owners list equipment",
    text: "Publish idle climate-smart tools with a daily rate, photo, and location so nearby farmers can discover them.",
    detail: "Solar pumps, soil kits, tillers, and more",
  },
  {
    icon: MapPinned,
    title: "Farmers find nearby tools",
    text: "Browse listings sorted by distance from Eldoret and filter by category to keep transport practical.",
    detail: "Nearest-first discovery",
  },
  {
    icon: CalendarRange,
    title: "Request with clear dates",
    text: "Choose start and return dates, then send the request. The owner reviews and approves it in their portal.",
    detail: "Tracked online end to end",
  },
  {
    icon: Handshake,
    title: "Pickup & pay on delivery",
    text: "Coordinate pickup locally and pay when the tool changes hands — simple, trust-based, and built for the field.",
    detail: "No complex escrow in the MVP",
  },
];

const renterPerks = [
  "Search climate-smart tools near you",
  "Book with start and return dates",
  "Track requests in your portal",
];

const ownerPerks = [
  "List idle equipment in minutes",
  "Approve rental requests online",
  "Track usage and income clearly",
];

export default function HowItWorksPage() {
  return (
    <div className="pb-16 sm:pb-20">
      {/* Header band */}
      <section className="border-b border-[color:var(--line)] bg-white/55">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-water-700">
              How it works
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-green-950 sm:text-5xl">
              From idle tools to active resilience
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
              ShambaShare is an online portal for sharing climate-smart farm
              equipment — discover nearby tools, book dates, and manage rentals
              from your dashboard.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/browse" className="rounded-xl">
                Find tools nearby
                <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink
                href="/join?intent=owner"
                variant="secondary"
                className="rounded-xl"
              >
                Share your equipment
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-water-700">
            The flow
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-green-950 sm:text-4xl">
            Four simple steps
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-muted">
            Built to stay simple for farmers and cooperatives — a clean path from
            listing to rental.
          </p>
        </div>

        <div className="relative mt-10 grid gap-5 md:grid-cols-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article
                key={step.title}
                className="group relative overflow-hidden rounded-2xl border border-[color:var(--line)] bg-white p-6 shadow-[0_8px_30px_rgba(18,32,24,0.04)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(18,32,24,0.1)] sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-700 to-green-900 text-white shadow-[0_8px_20px_rgba(27,77,50,0.25)]">
                    <Icon size={22} />
                  </div>
                  <span className="rounded-lg bg-green-800/8 px-2.5 py-1 text-xs font-semibold text-green-800">
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-2xl font-semibold tracking-tight text-green-950">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
                  {step.text}
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-water-700">
                  {step.detail}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Two sides */}
      <section className="border-y border-[color:var(--line)] bg-white/45">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-water-700">
              Who it’s for
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-green-950 sm:text-4xl">
              One portal, two clear sides
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-muted">
              Whether you need a tool or have one sitting idle, ShambaShare gives
              each side a focused workspace.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <article className="rounded-2xl border border-[color:var(--line)] bg-white p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-water-700 text-white">
                <Users size={22} />
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-green-950">
                For renters
              </h3>
              <p className="mt-2 text-sm text-ink-muted">
                Access climate-smart tools without buying them outright.
              </p>
              <ul className="mt-5 space-y-3">
                {renterPerks.map((perk) => (
                  <li
                    key={perk}
                    className="flex items-start gap-2.5 text-sm text-green-950"
                  >
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-green-700"
                    />
                    {perk}
                  </li>
                ))}
              </ul>
              <ButtonLink href="/join?intent=renter" className="mt-7 rounded-xl">
                Join as Renter
              </ButtonLink>
            </article>

            <article className="rounded-2xl border border-[color:var(--line)] bg-white p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-800 text-white">
                <Wrench size={22} />
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-green-950">
                For owners
              </h3>
              <p className="mt-2 text-sm text-ink-muted">
                Turn idle equipment into useful income for your farm or co-op.
              </p>
              <ul className="mt-5 space-y-3">
                {ownerPerks.map((perk) => (
                  <li
                    key={perk}
                    className="flex items-start gap-2.5 text-sm text-green-950"
                  >
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-green-700"
                    />
                    {perk}
                  </li>
                ))}
              </ul>
              <ButtonLink href="/join?intent=owner" className="mt-7 rounded-xl">
                Join as Owner
              </ButtonLink>
            </article>
          </div>
        </div>
      </section>

      {/* Portal note */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-6 rounded-2xl border border-[color:var(--line)] bg-white p-6 shadow-[0_8px_30px_rgba(18,32,24,0.04)] sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-800/10 text-green-800">
              <LayoutDashboard size={22} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-green-950 sm:text-2xl">
                Everything lives in your portal
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
                After you join, you get a role-based workspace for bookings,
                listings, requests, notifications, and settings — not just a
                public website.
              </p>
            </div>
          </div>
          <ButtonLink href="/join" variant="secondary" className="shrink-0 rounded-xl">
            Create account
          </ButtonLink>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-950 via-green-800 to-water-700 px-6 py-10 text-white sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_45%)]" />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to share or rent climate-smart tools?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white sm:text-lg">
              Start with Find tools, or join as an owner and list equipment your
              community can book online.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/browse" variant="on-dark" className="rounded-xl">
                Find tools nearby
                <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink
                href="/join?intent=owner"
                variant="on-dark-outline"
                className="rounded-xl"
              >
                Share your equipment
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
