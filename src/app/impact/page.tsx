import type { Metadata } from "next";
import { Droplets, Leaf, Users, Recycle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
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

export default function ImpactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <PageHeader
        eyebrow="Climate impact"
        title="Resilience grows when tools move"
        description="ShambaShare is built for measurable adaptation — affordable access to climate-smart equipment, less waste, and stronger local coordination."
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {outcomes.map((item, index) => {
          const Icon = item.icon;
          return (
            <article
              key={item.title}
              className={`rounded-xl border border-[color:var(--line)] bg-gradient-to-br from-white/80 to-green-800/5 p-6 animate-stagger animate-delay-${index + 1}`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-water-700 text-white">
                <Icon size={20} />
              </div>
              <h2 className="font-display mt-5 text-2xl font-semibold text-green-950">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
                {item.text}
              </p>
            </article>
          );
        })}
      </div>

      <div className="mt-14 rounded-2xl bg-green-950 px-6 py-10 text-white sm:px-10">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
          What success looks like
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/75 sm:text-base">
          In the next seasons we aim to help farmers reach nearby climate-smart
          tools within their own wards, help cooperatives monetize idle assets,
          and prove that SMS-first coordination can unlock adaptation without
          forcing every farmer to buy expensive equipment outright.
        </p>
        <div className="mt-8">
          <ButtonLink href="/browse" variant="on-dark">
            Find tools nearby
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
