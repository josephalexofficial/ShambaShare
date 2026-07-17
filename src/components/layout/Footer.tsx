import Link from "next/link";
import { MapPin, Sprout } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/constants";

const getStarted = [
  { href: "/join?intent=renter", label: "Join as Renter" },
  { href: "/join?intent=owner", label: "Join as Owner" },
  { href: "/auth", label: "Sign in" },
  { href: "/portal/overview", label: "Open portal" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-green-950 text-white">
      <div className="mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_repeat(3,minmax(0,1fr))] lg:gap-10">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-600 to-green-900 text-white shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
                <Sprout size={18} strokeWidth={2.25} />
              </span>
              <span className="font-display text-xl font-semibold tracking-tight">
                {SITE.name}
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              An online portal for sharing climate-smart farm tools — book nearby
              equipment, manage rentals, and pay on delivery.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 text-sm text-water-300">
              <MapPin size={15} />
              {SITE.location}
            </p>
          </div>

          {/* Explore */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
              Explore
            </p>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/75 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-white/75 transition hover:text-white"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Get started */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
              Get started
            </p>
            <ul className="mt-4 space-y-2.5">
              {getStarted.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/75 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Focus */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
              Built for
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/75">
              <li>Climate-smart Agriculture</li>
              <li>Circular tool access</li>
              <li>Smallholder resilience</li>
              <li>Local cooperatives</li>
            </ul>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row lg:flex-col">
              <Link
                href="/browse"
                className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-green-950 transition hover:bg-[color:var(--cream-field)]"
              >
                Find tools
              </Link>
              <Link
                href="/join"
                className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Join now
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {year} {SITE.name}. Built for resilient farming communities.
          </p>
          <p className="sm:text-right">
            Book online · Manage in your portal · Pay on delivery
          </p>
        </div>
      </div>
    </footer>
  );
}
