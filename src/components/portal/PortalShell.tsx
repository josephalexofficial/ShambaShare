"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Bell, LogOut, Menu, Sprout, X } from "lucide-react";
import { SITE } from "@/lib/constants";
import { navForRole } from "@/lib/portal-nav";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  NotificationsProvider,
  useNotifications,
} from "@/components/portal/NotificationsProvider";
import { ButtonLink } from "@/components/ui/Button";
import type { SessionUser } from "@/lib/auth/session";

function roleLabel(role: string) {
  if (role === "both") return "Renter & Owner";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function PortalShell({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--cream-field)]">
        <div className="flex flex-col items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-700 to-green-900 text-white shadow-[0_10px_28px_rgba(27,77,50,0.28)]">
            <Sprout size={22} />
          </span>
          <p className="text-sm font-medium text-ink-muted">
            Opening your portal…
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 text-center">
        <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-700 to-green-900 text-white shadow-[0_12px_30px_rgba(27,77,50,0.3)]">
          <Sprout size={26} />
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-green-950">
          Sign in to open your portal
        </h1>
        <p className="mt-3 text-ink-muted">
          Your dashboard, bookings, and settings live here after login.
        </p>
        <div className="mt-8 flex gap-3">
          <ButtonLink href="/auth">Sign in</ButtonLink>
          <ButtonLink href="/join" variant="secondary">
            Join
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <NotificationsProvider userId={user.id} role={user.role}>
      <PortalShellInner user={user} signOut={signOut} routerPush={router.push}>
        {children}
      </PortalShellInner>
    </NotificationsProvider>
  );
}

function PortalShellInner({
  user,
  children,
  signOut,
  routerPush,
}: {
  user: SessionUser;
  children: React.ReactNode;
  signOut: () => Promise<void>;
  routerPush: (href: string) => void;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { unreadCount } = useNotifications();
  const items = navForRole(user.role);
  const firstName = user.fullName.split(" ")[0] || "friend";
  const drawerTitleId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function handleSignOut() {
    setOpen(false);
    await signOut();
    routerPush("/");
  }

  function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
    return (
      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Portal">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const showBadge =
            item.href === "/portal/notifications" && unreadCount > 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-green-800 text-white shadow-[0_8px_20px_rgba(27,77,50,0.25)]"
                  : "text-ink-muted hover:bg-green-800/8 hover:text-green-950"
              }`}
            >
              <Icon size={18} className="shrink-0" />
              <span className="flex-1">{item.label}</span>
              {showBadge ? (
                <span
                  className={`min-w-5 rounded-full px-1.5 py-0.5 text-center text-[11px] font-bold ${
                    active ? "bg-white/20 text-white" : "bg-green-800 text-white"
                  }`}
                >
                  {unreadCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    );
  }

  function BrandBlock({ onNavigate }: { onNavigate?: () => void }) {
    return (
      <div className="border-b border-[color:var(--line)] px-4 py-5">
        <div className="flex items-start justify-between gap-2">
          <Link
            href="/portal/overview"
            onClick={onNavigate}
            className="group flex items-center gap-2.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-700 to-green-900 text-white shadow-[0_8px_20px_rgba(27,77,50,0.28)] transition group-hover:scale-[1.03]">
              <Sprout size={18} strokeWidth={2.25} />
            </span>
            <span>
              <span className="block text-lg font-semibold tracking-tight text-green-950">
                {SITE.name}
              </span>
              <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-water-700">
                {roleLabel(user.role)} portal
              </span>
            </span>
          </Link>
          {onNavigate ? (
            <button
              type="button"
              onClick={onNavigate}
              className="rounded-xl p-2 text-green-900 hover:bg-green-800/8"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  function AccountFooter() {
    return (
      <div className="border-t border-[color:var(--line)] p-3">
        <div className="mb-2 rounded-xl bg-[color:var(--cream-field)] px-3 py-2.5">
          <p className="truncate text-sm font-semibold text-green-950">
            {user.fullName}
          </p>
          <p className="truncate text-xs text-ink-muted">
            {user.county || "Uasin Gishu"}
          </p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-muted transition hover:bg-red-50 hover:text-red-700"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef5ee_0%,var(--cream-field)_45%,#e7f0ea_100%)]">
      <div className="mx-auto flex min-h-screen max-w-[1400px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-[16.5rem] shrink-0 flex-col border-r border-[color:var(--line)] bg-white/80 backdrop-blur-md lg:flex">
          <BrandBlock />
          <NavLinks />
          <AccountFooter />
        </aside>

        {/* Mobile drawer */}
        <div className="lg:hidden" aria-hidden={!open}>
          <div
            className={`fixed inset-0 z-50 bg-green-950/40 backdrop-blur-[2px] transition-opacity duration-300 ${
              open
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }`}
            onClick={() => setOpen(false)}
          />
          <aside
            id="portal-mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={drawerTitleId}
            className={`fixed inset-y-0 left-0 z-50 flex w-[min(20rem,86vw)] max-w-full flex-col border-r border-[color:var(--line)] bg-white shadow-[12px_0_40px_rgba(18,32,24,0.18)] transition-transform duration-300 ease-out ${
              open ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <h2 id={drawerTitleId} className="sr-only">
              Portal menu
            </h2>
            <BrandBlock onNavigate={() => setOpen(false)} />
            <NavLinks onNavigate={() => setOpen(false)} />
            <AccountFooter />
          </aside>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-[color:var(--line)] bg-[color:var(--cream-field)]/92 px-4 py-3.5 backdrop-blur-md md:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="rounded-xl p-2 text-green-900 hover:bg-white/70 lg:hidden"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
                aria-controls="portal-mobile-drawer"
              >
                <Menu size={20} />
              </button>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-green-950">
                  Habari, {firstName}
                </p>
                <p className="truncate text-xs text-ink-muted sm:text-sm">
                  {user.county || "Uasin Gishu"}
                  {user.phone ? ` · ${user.phone}` : " · Add phone in Settings"}
                </p>
              </div>
            </div>
            <Link
              href="/portal/notifications"
              className="relative rounded-xl p-2.5 text-green-900 transition hover:bg-white/80"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 ? (
                <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-green-800 px-1 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              ) : null}
            </Link>
          </header>

          <div className="flex-1 px-4 py-6 md:px-7 md:py-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
