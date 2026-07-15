import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-water-700">
        404
      </p>
      <h1 className="font-display mt-3 text-4xl font-semibold text-green-950">
        Page not found
      </h1>
      <p className="mt-4 text-ink-muted">
        That route is not part of ShambaShare yet. Head back to browse nearby
        climate-smart tools.
      </p>
      <div className="mt-8 flex gap-3">
        <ButtonLink href="/">Home</ButtonLink>
        <ButtonLink href="/browse" variant="secondary">
          Browse tools
        </ButtonLink>
      </div>
      <Link href="/contact" className="mt-6 text-sm text-water-700 hover:underline">
        Contact us
      </Link>
    </div>
  );
}
