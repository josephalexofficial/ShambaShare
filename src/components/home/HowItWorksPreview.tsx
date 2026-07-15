import { MapPinned, MessageSquareText, Sprout } from "lucide-react";

const steps = [
  {
    icon: Sprout,
    title: "List idle climate-smart tools",
    text: "Owners and cooperatives publish solar pumps, soil kits, and tillers with a daily rate and location.",
  },
  {
    icon: MapPinned,
    title: "Find the nearest option",
    text: "Farmers browse available equipment sorted by distance to keep transport simple and affordable.",
  },
  {
    icon: MessageSquareText,
    title: "Connect instantly by SMS",
    text: "A rental request alerts both sides by SMS so they can coordinate pickup and pay on delivery.",
  },
];

export function HowItWorksPreview() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-water-700">
          How it works
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-green-950 sm:text-4xl">
          Three steps from idle tools to active resilience
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink-muted">
          ShambaShare keeps the flow simple on purpose — discovery and trust
          first, not complex escrow.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              className={`animate-stagger animate-delay-${index + 1}`}
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-green-800 text-white">
                <Icon size={20} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-soil-500">
                Step {index + 1}
              </p>
              <h3 className="font-display mt-2 text-xl font-semibold text-green-950">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {step.text}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
