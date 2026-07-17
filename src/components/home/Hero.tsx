import Image from "next/image";
import { ArrowRight, Sprout } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { SITE } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative isolate h-[calc(100svh-4.25rem)] max-h-[900px] min-h-[520px] overflow-hidden sm:min-h-[560px]">
      <Image
        src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=2000&q=80"
        alt="Green highland farmland under open sky"
        fill
        priority
        className="object-cover object-[center_35%]"
        sizes="100vw"
      />

      {/* Readability overlays — stronger on the text side */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-950/92 via-green-950/75 to-green-900/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-green-950/80 via-green-950/25 to-green-950/45" />
      <div className="absolute inset-y-0 left-0 w-full max-w-3xl bg-gradient-to-r from-green-950/55 to-transparent" />

      <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-4 py-8 sm:px-6 sm:py-10 md:justify-end md:pb-14 md:pt-10">
        <div className="max-w-xl md:max-w-2xl">
          <p className="animate-rise font-display text-[2.35rem] font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
            {SITE.name}
          </p>
          <h1 className="animate-rise animate-delay-1 mt-3 max-w-xl font-display text-xl font-medium leading-snug text-white sm:mt-4 sm:text-2xl md:text-[2rem]">
            {SITE.tagline}
          </h1>
          <p className="animate-rise animate-delay-2 mt-3 max-w-lg text-sm leading-relaxed text-white sm:mt-4 sm:text-base md:text-lg">
            {SITE.description}
          </p>

          <div className="animate-rise animate-delay-3 mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:max-w-xl sm:flex-row sm:items-stretch">
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
