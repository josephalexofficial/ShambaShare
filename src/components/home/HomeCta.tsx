import { ButtonLink } from "@/components/ui/Button";

export function HomeCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-green-900 via-green-800 to-water-700 px-6 py-12 text-white sm:px-10">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Turn idle machines into climate resilience
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/80">
            Whether you own a solar pump that sits unused between seasons or you
            need one for the next dry week — ShambaShare connects both sides
            locally.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/browse" variant="on-dark">
              Find tools nearby
            </ButtonLink>
            <ButtonLink
              href="/join?intent=owner"
              variant="secondary"
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              Share your equipment
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
