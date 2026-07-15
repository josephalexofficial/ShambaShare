import type { Metadata } from "next";
import { MapPinned, MessageSquareText, Sprout, Handshake } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "List climate-smart tools, find the nearest option, and connect by SMS with pay on delivery.",
};

const steps = [
  {
    icon: Sprout,
    title: "Owners list equipment",
    text: "Cooperatives, vendors, or farmers publish idle assets with a daily rate, photo, and location pin.",
  },
  {
    icon: MapPinned,
    title: "Farmers search nearby",
    text: "Browse available tools sorted by distance so the first options are the easiest to reach.",
  },
  {
    icon: MessageSquareText,
    title: "Request triggers SMS",
    text: "Both parties receive an automated SMS with contact details to coordinate pickup.",
  },
  {
    icon: Handshake,
    title: "Reserve & pay on delivery",
    text: "Payment happens locally when the tool changes hands — no escrow needed for the MVP.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <PageHeader
        eyebrow="How it works"
        title="From idle tools to active resilience"
        description="ShambaShare is designed to be finished well — not overloaded. Every step supports a live, trustworthy demo."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <article
              key={step.title}
              className={`field-panel-strong rounded-xl p-6 sm:p-7 animate-stagger animate-delay-${index + 1}`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-green-800 text-white">
                <Icon size={20} />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-soil-500">
                Step {index + 1}
              </p>
              <h2 className="font-display mt-2 text-2xl font-semibold text-green-950">
                {step.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
                {step.text}
              </p>
            </article>
          );
        })}
      </div>

      <div className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <ButtonLink href="/browse">Find tools nearby</ButtonLink>
        <ButtonLink href="/join?intent=owner" variant="secondary">
          Share your equipment
        </ButtonLink>
      </div>
    </div>
  );
}
