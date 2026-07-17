"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bell,
  CalendarRange,
  MapPin,
  Search,
  Wallet,
  Wrench,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useNotifications } from "@/components/portal/NotificationsProvider";
import { StatCard } from "@/components/portal/StatCard";
import { ButtonLink } from "@/components/ui/Button";
import { canList, canRent, isAdmin } from "@/lib/constants";
import { SEED_EQUIPMENT } from "@/lib/seed-equipment";
import { SEED_INCOME_ROWS, SEED_OWNER_BOOKINGS } from "@/lib/seed-portal";
import { readBookings } from "@/lib/bookings-store";

export default function PortalOverviewPage() {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [myBookings, setMyBookings] = useState(0);

  useEffect(() => {
    setMyBookings(readBookings().length);
  }, []);

  if (!user) return null;

  if (isAdmin(user.role)) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-green-950 md:text-4xl">
            Admin overview
          </h1>
          <p className="mt-2 text-ink-muted">
            Monitor platform health, users, and climate-smart sharing impact.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Users" value="128" hint="Renters, owners & both" />
          <StatCard
            label="Live listings"
            value={String(SEED_EQUIPMENT.length)}
            hint="Across Uasin Gishu"
          />
          <StatCard label="Active rentals" value="17" hint="In progress this week" />
          <StatCard label="Portal alerts" value="64" hint="Requests handled this month" />
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/portal/admin/users">Manage users</ButtonLink>
          <ButtonLink href="/portal/admin/impact" variant="secondary">
            Impact snapshot
          </ButtonLink>
        </div>
      </div>
    );
  }

  const ownerPending = SEED_OWNER_BOOKINGS.filter(
    (b) => b.status === "pending",
  ).length;
  const ownerActive = SEED_OWNER_BOOKINGS.filter(
    (b) => b.status === "active",
  ).length;
  const incomeTotal = SEED_INCOME_ROWS.reduce((sum, row) => sum + row.amount, 0);
  const availableTools = SEED_EQUIPMENT.filter((e) => e.isAvailable).length;
  const firstName = user.fullName.split(" ")[0] || "there";
  const isRenterOnly = canRent(user.role) && !canList(user.role);
  const isBoth = canRent(user.role) && canList(user.role);

  return (
    <div className="space-y-7">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-2xl border border-[color:var(--line)] bg-gradient-to-br from-green-900 via-green-800 to-green-700 px-5 py-6 text-white shadow-[0_16px_40px_rgba(18,32,24,0.14)] sm:px-7 sm:py-7">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full bg-white/10 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 left-10 h-40 w-40 rounded-full bg-[color:var(--water-500)]/25 blur-2xl"
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              {isRenterOnly
                ? "Renter home"
                : isBoth
                  ? "Your workspace"
                  : "Owner home"}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl md:text-[2rem]">
              Welcome back, {firstName}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-white/85 sm:text-[0.95rem]">
              {isBoth
                ? "Rent tools when you need them, and earn when your own equipment is idle."
                : canList(user.role)
                  ? "Track requests, active rentals, and income from shared climate-smart tools."
                  : "Find nearby tools, book with clear return dates, and track every rental in one place."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {canRent(user.role) ? (
              <ButtonLink
                href="/portal/find"
                variant="on-dark"
                className="rounded-xl"
              >
                Find tools
                <ArrowRight size={16} />
              </ButtonLink>
            ) : null}
            {canList(user.role) ? (
              <ButtonLink
                href="/portal/listings"
                variant="on-dark-outline"
                className="rounded-xl"
              >
                Manage listings
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {canRent(user.role) ? (
          <>
            <StatCard
              label="My bookings"
              value={String(myBookings)}
              hint="Open My bookings to track status"
              icon={CalendarRange}
              href="/portal/bookings"
            />
            <StatCard
              label="Tools nearby"
              value={String(availableTools)}
              hint="Available around Eldoret"
              icon={MapPin}
              href="/portal/find"
            />
          </>
        ) : null}
        {canList(user.role) ? (
          <>
            <StatCard
              label="Pending requests"
              value={String(ownerPending)}
              hint="Waiting for your approval"
              icon={Wrench}
              href="/portal/rentals"
            />
            <StatCard
              label="Active rentals"
              value={String(ownerActive)}
              hint="Tools currently out"
              icon={CalendarRange}
              href="/portal/rentals"
            />
            <StatCard
              label="Income (demo)"
              value={`${incomeTotal.toLocaleString()} KES`}
              hint="Completed rentals ledger"
              icon={Wallet}
              href="/portal/income"
            />
          </>
        ) : null}
        <StatCard
          label="Unread alerts"
          value={String(unreadCount)}
          hint="Open Notifications"
          icon={Bell}
          href="/portal/notifications"
        />
      </div>

      {/* Renter actions */}
      {canRent(user.role) ? (
        <section>
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-green-950">
                What do you need today?
              </h2>
              <p className="mt-1 text-sm text-ink-muted">
                Jump straight into the next step — no guesswork.
              </p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <ActionCard
              href="/portal/find"
              icon={Search}
              title="Find a tool"
              description="Browse nearby climate-smart equipment sorted by distance."
              cta="Browse tools"
            />
            <ActionCard
              href="/portal/bookings"
              icon={CalendarRange}
              title="Track a booking"
              description="See request status, dates, and pay-on-delivery totals."
              cta="View bookings"
            />
            <ActionCard
              href="/portal/notifications"
              icon={Bell}
              title="Check alerts"
              description="Owner replies and return reminders land here."
              cta="Open alerts"
            />
          </div>
        </section>
      ) : null}

      {/* Owner quick start (kept for owner/both) */}
      {canList(user.role) ? (
        <section className="field-panel-strong rounded-2xl p-6">
          <h2 className="text-xl font-semibold tracking-tight text-green-950">
            Owner quick start
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-ink-muted">
            <li>Keep listings updated with rate and availability.</li>
            <li>
              Approve rental requests online and coordinate pickup with the
              renter.
            </li>
            <li>Review Income for completed pay-on-delivery rentals.</li>
          </ol>
          <Link
            href="/portal/rentals"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-green-800 hover:underline"
          >
            Review rental requests
            <ArrowRight size={14} />
          </Link>
        </section>
      ) : null}
    </div>
  );
}

function ActionCard({
  href,
  icon: Icon,
  title,
  description,
  cta,
}: {
  href: string;
  icon: typeof Search;
  title: string;
  description: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group field-panel-strong flex flex-col rounded-2xl p-5 transition hover:-translate-y-0.5 hover:border-green-700/25 hover:shadow-[0_14px_32px_rgba(18,32,24,0.07)]"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-800 text-white shadow-[0_8px_18px_rgba(27,77,50,0.22)]">
        <Icon size={20} />
      </span>
      <h3 className="mt-4 text-base font-semibold text-green-950">{title}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-muted">
        {description}
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-green-800 group-hover:underline">
        {cta}
        <ArrowRight
          size={14}
          className="transition group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}
