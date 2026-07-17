import type { Metadata } from "next";
import {
  ArrowRight,
  Handshake,
  MapPin,
  Search,
  ShieldCheck,
  Sprout,
  Users,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why ShambaShare exists — bridging idle climate-smart tools with the farmers who need them.",
};

const pillars = [
  {
    icon: Search,
    title: "Discover nearby",
    text: "Find climate-smart tools sorted by distance so transport stays practical.",
  },
  {
    icon: Handshake,
    title: "Book online",
    text: "Request equipment with clear start and return dates inside your portal.",
  },
  {
    icon: ShieldCheck,
    title: "Share with trust",
    text: "Owners approve requests online. Pickup and payment happen locally on delivery.",
  },
];

const beliefs = [
  {
    title: "Access beats ownership",
    text: "Farmers should not need to buy every climate-smart tool outright to stay resilient.",
  },
  {
    title: "Idle assets should work",
    text: "Equipment already in the community can earn again when it is shared well.",
  },
  {
    title: "Keep it simple",
    text: "The portal should be clear enough to use in the field — list, find, request, manage.",
  },
];

export default function AboutPage() {
  return (
    <div className="pb-16 sm:pb-20">
      {/* Header */}
      <section className="border-b border-[color:var(--line)] bg-white/55">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-water-700">
              About {SITE.name}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-green-950 sm:text-5xl">
              Practical climate resilience, shared locally
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
              We built ShambaShare for communities where climate-smart tools
              already exist — but remain out of reach for the farmers who need
              them most.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/browse" className="rounded-xl">
                Find tools nearby
                <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink href="/join" variant="secondary" className="rounded-xl">
                Join ShambaShare
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Problem + approach */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-[color:var(--line)] bg-white p-6 shadow-[0_8px_30px_rgba(18,32,24,0.04)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-water-700">
              The problem
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-green-950 sm:text-3xl">
              The tools exist. Access does not.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
              Droughts, erratic rains, and declining soil health make farming
              harder every season. Tools that help — solar irrigation pumps, soil
              testing kits, conservation tillers — are highly effective, but too
              expensive for many smallholders to buy.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
              At the same time, cooperatives and larger farms often leave the
              same equipment idle between uses. That mismatch is costly for
              households and wasteful for communities.
            </p>
          </article>

          <article className="rounded-2xl border border-[color:var(--line)] bg-white p-6 shadow-[0_8px_30px_rgba(18,32,24,0.04)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-water-700">
              Our approach
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-green-950 sm:text-3xl">
              An online portal for local sharing
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
              ShambaShare helps farmers discover nearby climate-smart equipment
              and book it with clear start and return dates. Location-based
              sorting keeps transport practical.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
              Renters and owners each get a focused workspace to manage requests,
              listings, and updates — then coordinate pickup and pay on delivery.
            </p>
          </article>
        </div>
      </section>

      {/* How we work pillars */}
      <section className="border-y border-[color:var(--line)] bg-white/45">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-water-700">
              How we work
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-green-950 sm:text-4xl">
              One clear job, done well
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-muted">
              We stay focused on connecting idle climate-smart tools with the
              people who need them nearby.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {pillars.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-[color:var(--line)] bg-white p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-green-700 to-green-900 text-white shadow-[0_8px_20px_rgba(27,77,50,0.25)]">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-green-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {item.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Beliefs */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-water-700">
            What we believe
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-green-950 sm:text-4xl">
            Principles that shape the product
          </h2>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {beliefs.map((item, index) => (
            <article
              key={item.title}
              className="rounded-2xl border border-[color:var(--line)] bg-white p-6 shadow-[0_8px_30px_rgba(18,32,24,0.04)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-water-700">
                0{index + 1}
              </p>
              <h3 className="mt-3 text-xl font-semibold text-green-950">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Location */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 rounded-2xl border border-[color:var(--line)] bg-white p-6 shadow-[0_8px_30px_rgba(18,32,24,0.04)] sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-800/10 text-green-800">
              <MapPin size={22} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-green-950 sm:text-2xl">
                Starting in {SITE.location}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
                We are focused first on highland farming communities around
                Eldoret — where climate pressure is real and local sharing can
                make an immediate difference.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl bg-green-800/8 px-3 py-2 text-sm font-medium text-green-900">
            <Users size={16} />
            Farmers & cooperatives
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto mt-14 max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-950 via-green-800 to-water-700 px-6 py-10 text-white sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_45%)]" />
          <div className="relative max-w-2xl">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white">
              <Sprout size={22} />
            </div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Join the local sharing network
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white sm:text-lg">
              Whether you need a tool for the next dry week or have equipment
              sitting idle, ShambaShare connects both sides online.
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
