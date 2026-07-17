import { ArrowRight, Sprout } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export function HomeCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-950 via-green-800 to-water-700 px-6 py-10 text-white sm:px-10 sm:py-12">
        {/* Soft depth so buttons stay readable */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_45%)]" />

        <div className="relative max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Turn idle machines into climate resilience
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white sm:text-lg">
            Whether you own a solar pump that sits unused between seasons or you
            need one for the next dry week — ShambaShare connects both sides
            online through your portal.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:max-w-xl sm:flex-row sm:items-stretch">
            <ButtonLink
              href="/browse"
              variant="on-dark"
              className="w-full rounded-xl px-5 py-3.5 sm:w-auto"
            >
              Find tools nearby
              <ArrowRight size={16} />
            </ButtonLink>
            <ButtonLink
              href="/join?intent=owner"
              variant="on-dark-outline"
              className="w-full rounded-xl px-5 py-3.5 sm:w-auto"
            >
              <Sprout size={16} />
              Share your equipment
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
