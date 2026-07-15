import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { HowItWorksPreview } from "@/components/home/HowItWorksPreview";
import { FeaturedTools } from "@/components/home/FeaturedTools";
import { HomeCta } from "@/components/home/HomeCta";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorksPreview />
      <FeaturedTools />
      <HomeCta />
    </>
  );
}
