"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, SITE, canList } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    setOpen(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--line)] bg-[color:var(--cream-field)]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight text-green-900 sm:text-[1.7rem]">
            {SITE.name}
          </span>
          <span className="hidden text-xs font-medium uppercase tracking-[0.16em] text-water-700 sm:inline">
            AgriTech
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active =
              pathname === link.href ||
              (link.href === "/browse" && pathname.startsWith("/equipment"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-green-800/10 text-green-900"
                    : "text-ink-muted hover:bg-white/60 hover:text-green-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {loading ? null : user ? (
            <>
              {canList(user.role) ? (
                <ButtonLink href="/list" variant="ghost" className="px-3 py-2">
                  Share equipment
                </ButtonLink>
              ) : null}
              <ButtonLink href="/dashboard" variant="ghost" className="px-3 py-2">
                Dashboard
              </ButtonLink>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-md px-3 py-2 text-sm font-semibold text-ink-muted hover:bg-white/60 hover:text-green-900"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <ButtonLink href="/auth" variant="ghost" className="px-3 py-2">
                Sign in
              </ButtonLink>
              <ButtonLink href="/join" variant="primary" className="px-4 py-2.5">
                Join
              </ButtonLink>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-green-900 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-[color:var(--line)] bg-[color:var(--cream-field)] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium text-green-900 hover:bg-white/70"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-base font-medium text-green-900 hover:bg-white/70"
                >
                  Dashboard
                </Link>
                {canList(user.role) ? (
                  <Link
                    href="/list"
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-3 text-base font-medium text-green-900 hover:bg-white/70"
                  >
                    Share equipment
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-md px-3 py-3 text-left text-base font-medium text-ink-muted hover:bg-white/70"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-base font-medium text-ink-muted hover:bg-white/70"
                >
                  Sign in
                </Link>
                <ButtonLink href="/join" className="mt-2 w-full" variant="primary">
                  Join
                </ButtonLink>
              </>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
