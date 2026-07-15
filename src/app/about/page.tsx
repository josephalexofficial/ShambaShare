import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why ShambaShare exists — bridging idle climate-smart tools with the farmers who need them.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <PageHeader
        eyebrow="About ShambaShare"
        title="Practical climate resilience, shared locally"
        description="We built ShambaShare for communities where climate-smart tools already exist — but remain out of reach for the farmers who need them most."
      />

      <div className="mx-auto mt-14 grid max-w-4xl gap-10 text-base leading-relaxed text-ink-muted">
        <section className="animate-rise">
          <h2 className="font-display text-2xl font-semibold text-green-950">
            The problem we see
          </h2>
          <p className="mt-3">
            Droughts, erratic rains, and declining soil health make farming harder
            every season. Tools that help — solar irrigation pumps, soil testing
            kits, conservation tillers — are highly effective, but too expensive
            for many smallholders to buy. At the same time, cooperatives and
            larger farms often leave the same equipment idle between uses.
          </p>
        </section>

        <section className="animate-rise animate-delay-1">
          <h2 className="font-display text-2xl font-semibold text-green-950">
            Our approach
          </h2>
          <p className="mt-3">
            ShambaShare is a mobile-first sharing platform focused on one job:
            help farmers discover nearby climate-smart equipment and connect with
            owners instantly. We use location-based sorting and SMS alerts — not
            complex escrow — so coordination stays realistic for rural workflows.
          </p>
        </section>

        <section className="animate-rise animate-delay-2">
          <h2 className="font-display text-2xl font-semibold text-green-950">
            Built for Eldoret and beyond
          </h2>
          <p className="mt-3">
            We are starting in Uasin Gishu, where highland farming meets growing
            AgriTech energy. Our aim is a product judges and farmers can both
            understand in seconds: find a tool, request it, get an SMS, arrange
            pickup, and pay on delivery.
          </p>
        </section>
      </div>

      <div className="mt-14 flex justify-center gap-3">
        <ButtonLink href="/browse">Find tools</ButtonLink>
        <ButtonLink href="/join" variant="secondary">
          Join
        </ButtonLink>
      </div>
    </div>
  );
}
