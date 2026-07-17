"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, Sprout, X } from "lucide-react";
import { NAV_LINKS, SITE, canList } from "@/lib/constants";
import { useAuth } from "@/components/auth/AuthProvider";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/browse") {
    return pathname === "/browse" || pathname.startsWith("/equipment");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

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
    <header className="sticky top-0 z-50 border-b border-[color:var(--line)] bg-white/85 shadow-[0_1px_0_rgba(18,32,24,0.04)] backdrop-blur-xl">
      <div className="mx-auto grid h-[4.25rem] max-w-6xl grid-cols-[1fr_auto] items-center gap-4 px-4 sm:px-6 md:grid-cols-[auto_1fr_auto]">
        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-700 to-green-900 text-white shadow-[0_8px_20px_rgba(27,77,50,0.28)] transition group-hover:scale-[1.03]">
            <Sprout size={18} strokeWidth={2.25} />
          </span>
          <span className="font-display text-[1.35rem] font-semibold tracking-tight text-green-950 sm:text-[1.45rem]">
            {SITE.name}
          </span>
        </Link>

        {/* Center nav */}
        <nav className="hidden items-center justify-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-2 text-[0.95rem] font-medium transition ${
                  active
                    ? "text-green-800"
                    : "text-ink-muted hover:text-green-900"
                }`}
              >
                {link.label}
                <span
                  className={`absolute inset-x-3.5 -bottom-[0.85rem] h-[2px] rounded-full transition ${
                    active
                      ? "bg-green-700 opacity-100"
                      : "bg-transparent opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Auth actions */}
        <div className="hidden items-center justify-end gap-2 md:flex">
          {loading ? null : user ? (
            <>
              {canList(user.role) ? (
                <Link
                  href="/portal/listings"
                  className="px-3 py-2 text-sm font-medium text-ink-muted transition hover:text-green-900"
                >
                  Share equipment
                </Link>
              ) : null}
              <Link
                href="/portal/overview"
                className="inline-flex items-center justify-center rounded-xl bg-green-800 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(27,77,50,0.28)] transition hover:bg-green-900 hover:shadow-[0_12px_28px_rgba(27,77,50,0.34)]"
              >
                Open portal
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="px-3 py-2 text-sm font-medium text-ink-muted transition hover:text-green-900"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="px-3 py-2 text-sm font-semibold text-ink-muted transition hover:text-green-900"
              >
                Sign in
              </Link>
              <Link
                href="/join"
                className="inline-flex items-center justify-center rounded-xl bg-green-800 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(27,77,50,0.28)] transition hover:-translate-y-px hover:bg-green-900 hover:shadow-[0_14px_30px_rgba(27,77,50,0.36)]"
              >
                Join now
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center justify-self-end rounded-xl p-2 text-green-900 hover:bg-green-800/5 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-[color:var(--line)] bg-white/95 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-3 py-3 text-base font-medium ${
                    active
                      ? "bg-green-800/10 text-green-900"
                      : "text-ink-muted hover:bg-green-800/5 hover:text-green-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="my-2 h-px bg-[color:var(--line)]" />

            {user ? (
              <>
                <Link
                  href="/portal/overview"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-green-800 px-3 py-3 text-center text-base font-semibold text-white"
                >
                  Open portal
                </Link>
                {canList(user.role) ? (
                  <Link
                    href="/portal/listings"
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-3 text-base font-medium text-green-900 hover:bg-green-800/5"
                  >
                    Share equipment
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-xl px-3 py-3 text-left text-base font-medium text-ink-muted hover:bg-green-800/5"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-base font-medium text-ink-muted hover:bg-green-800/5"
                >
                  Sign in
                </Link>
                <Link
                  href="/join"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-green-800 px-3 py-3 text-center text-base font-semibold text-white shadow-[0_10px_24px_rgba(27,77,50,0.28)]"
                >
                  Join now
                </Link>
              </>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
