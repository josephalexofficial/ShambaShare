import Link from "next/link";
import { SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[color:var(--line)] bg-green-950 text-[color:var(--cream-field)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl font-semibold tracking-tight">
            {SITE.name}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">
            Making climate-smart farm tools affordable through local sharing —
            discover nearby equipment, connect by SMS, pay on delivery.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-water-300">
            Explore
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>
              <Link href="/browse" className="hover:text-white">
                Find tools
              </Link>
            </li>
            <li>
              <Link href="/how-it-works" className="hover:text-white">
                How it works
              </Link>
            </li>
            <li>
              <Link href="/impact" className="hover:text-white">
                Climate impact
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">
                About
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-water-300">
            Focus
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>Climate-smart Agriculture</li>
            <li>Circular tool access</li>
            <li>{SITE.location}</li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} {SITE.name}. Built for resilient farming communities.</p>
          <p>Reserve & pay on delivery · SMS-first coordination</p>
        </div>
      </div>
    </footer>
  );
}
