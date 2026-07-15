import Image from "next/image";
import { ArrowRight, Sprout } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { SITE } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=2000&q=80"
        alt="Green highland farmland under open sky"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-green-950/88 via-green-900/72 to-green-900/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-green-950/70 via-transparent to-green-950/25" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20">
        <div className="max-w-2xl">
          <p className="animate-rise font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
            {SITE.name}
          </p>
          <h1 className="animate-rise animate-delay-1 mt-4 max-w-xl font-display text-2xl font-medium leading-snug text-white/95 sm:text-3xl md:text-[2.1rem]">
            {SITE.tagline}
          </h1>
          <p className="animate-rise animate-delay-2 mt-4 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
            {SITE.description}
          </p>
          <div className="animate-rise animate-delay-3 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/browse" variant="on-dark">
              Find tools nearby
              <ArrowRight size={16} />
            </ButtonLink>
            <ButtonLink
              href="/join?intent=owner"
              variant="secondary"
              className="border-white/25 bg-white/10 text-white hover:bg-white/20"
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
