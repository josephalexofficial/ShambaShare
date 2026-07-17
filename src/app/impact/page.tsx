import type { Metadata } from "next";
import {
  ArrowRight,
  Droplets,
  Leaf,
  MapPinned,
  Recycle,
  Sprout,
  Target,
  Users,
  Wallet,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Impact",
  description:
    "How ShambaShare supports climate adaptation, shared green assets, and stronger rural livelihoods.",
};

const outcomes = [
  {
    icon: Leaf,
    title: "Climate adaptation",
    text: "Faster access to irrigation and soil tools helps farmers respond to dry spells and unpredictable rains.",
  },
  {
    icon: Droplets,
    title: "Water stewardship",
    text: "Shared solar pumps and moisture tools encourage smarter watering instead of costly guesswork.",
  },
  {
    icon: Recycle,
    title: "Circular equipment use",
    text: "Idle machines earn again. Communities get more value from assets already on the ground.",
  },
  {
    icon: Users,
    title: "Shared livelihoods",
    text: "Owners gain supplementary income. Smallholders avoid heavy debt while still using modern tools.",
  },
];

const metrics = [
  {
    value: "Lower cost",
    label: "to access climate-smart tools",
    hint: "Rent instead of buy",
  },
  {
    value: "Less waste",
    label: "from idle farm machinery",
    hint: "Assets stay in use",
  },
  {
    value: "Local first",
    label: "discovery around Eldoret",
    hint: "Nearest tools first",
  },
  {
    value: "Portal-led",
    label: "requests and approvals",
    hint: "Trackable online",
  },
];

const beneficiaries = [
  {
    icon: Sprout,
    title: "Smallholder farmers",
    text: "Affordable, on-demand access to pumps, soil kits, and conservation tools when weather turns uncertain.",
  },
  {
    icon: Wallet,
    title: "Equipment owners & co-ops",
    text: "Earn from underused assets and keep climate-smart tools circulating in the community.",
  },
  {
    icon: MapPinned,
    title: "Rural communities",
    text: "Stronger local food security through shared resilience infrastructure — not one-off purchases.",
  },
];

const milestones = [
  {
    when: "0–6 months",
    title: "Prove the model in Uasin Gishu",
    text: "Launch the portal, list real tools, and complete bookings with clear return dates.",
  },
  {
    when: "6–12 months",
    title: "Grow co-op partnerships",
    text: "Onboard more owners, expand verified listings, and tighten the rental workflow.",
  },
  {
    when: "12–24 months",
    title: "Scale across counties",
    text: "Extend nearest-first sharing beyond Eldoret while keeping the experience simple.",
  },
];

export default function ImpactPage() {
  return (
    <div className="pb-16 sm:pb-20">
      {/* Header */}
      <section className="border-b border-[color:var(--line)] bg-white/55">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-water-700">
              Climate impact
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-green-950 sm:text-5xl">
              Resilience grows when tools move
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
              ShambaShare makes climate-smart equipment affordable through local
              online sharing — so adaptation tools reach the farmers who need
              them most.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/browse" className="rounded-xl">
                Find tools nearby
                <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink
                href="/how-it-works"
                variant="secondary"
                className="rounded-xl"
              >
                See how it works
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics strip */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((item) => (
            <div
              key={item.value}
              className="rounded-2xl border border-[color:var(--line)] bg-white px-5 py-5 shadow-[0_8px_30px_rgba(18,32,24,0.04)]"
            >
              <p className="text-xl font-semibold tracking-tight text-green-900">
                {item.value}
              </p>
              <p className="mt-1 text-sm text-ink-muted">{item.label}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-water-700">
                {item.hint}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Outcomes */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-water-700">
            Outcomes
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-green-950 sm:text-4xl">
            What ShambaShare changes on the ground
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-muted">
            Impact is not abstract here. It is about access, water, circular use,
            and livelihoods in farming communities.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {outcomes.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-2xl border border-[color:var(--line)] bg-white p-6 shadow-[0_8px_30px_rgba(18,32,24,0.04)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(18,32,24,0.1)] sm:p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-water-700 to-green-800 text-white shadow-[0_8px_20px_rgba(26,95,115,0.25)]">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-2xl font-semibold tracking-tight text-green-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
                  {item.text}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Beneficiaries */}
      <section className="border-y border-[color:var(--line)] bg-white/45">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-water-700">
              Who benefits
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-green-950 sm:text-4xl">
              Built for people who grow food
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {beneficiaries.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-[color:var(--line)] bg-white p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-800/10 text-green-800">
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

      {/* Roadmap */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-water-700">
              Path forward
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-green-950 sm:text-4xl">
              What success looks like
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-muted">
              A practical growth path from Eldoret outward — built to serve
              farmers today and scale with community demand.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl bg-green-800/8 px-3 py-2 text-sm font-medium text-green-900">
            <Target size={16} />
            24-month outlook
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {milestones.map((item, index) => (
            <article
              key={item.when}
              className="relative rounded-2xl border border-[color:var(--line)] bg-white p-6 shadow-[0_8px_30px_rgba(18,32,24,0.04)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-water-700">
                Phase {index + 1} · {item.when}
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

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-950 via-green-800 to-water-700 px-6 py-10 text-white sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_45%)]" />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Put climate-smart tools within reach
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white sm:text-lg">
              Join as a renter to book nearby equipment, or as an owner to share
              idle tools with your community online.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/browse" variant="on-dark" className="rounded-xl">
                Find tools nearby
                <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink
                href="/join"
                variant="on-dark-outline"
                className="rounded-xl"
              >
                Join ShambaShare
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
