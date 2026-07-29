"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Boxes,
  LineChart,
  Shield,
  UserCog,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { AdminGuard } from "@/components/portal/AdminGuard";
import { StatCard } from "@/components/portal/StatCard";
import { isAdmin } from "@/lib/constants";
import { listSubAdmins } from "@/lib/admin-team-store";
import { listLocalAccounts } from "@/lib/auth/local-accounts";
import { readBookings } from "@/lib/bookings-store";
import { readOwnerListings } from "@/lib/listings-store";
import { SEED_EQUIPMENT } from "@/lib/seed-equipment";

export default function AdminHomePage() {
  return (
    <AdminGuard>
      <AdminHomeInner />
    </AdminGuard>
  );
}

function AdminHomeInner() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    listings: 0,
    bookings: 0,
    subadmins: 0,
  });

  useEffect(() => {
    setStats({
      users: listLocalAccounts().length,
      listings: SEED_EQUIPMENT.length + readOwnerListings().length,
      bookings: readBookings().length,
      subadmins: listSubAdmins().length,
    });
  }, []);

  const superAdmin = Boolean(user && isAdmin(user.role));

  const links = [
    {
      href: "/portal/admin/users",
      title: "Manage users",
      description: "View members, change roles, remove accounts.",
      icon: Users,
    },
    ...(superAdmin
      ? [
          {
            href: "/portal/admin/team",
            title: "Admin team",
            description: "Add or remove sub-admins who help run the platform.",
            icon: UserCog,
          },
        ]
      : []),
    {
      href: "/portal/admin/listings",
      title: "All listings",
      description: "Moderate climate-smart tools across the network.",
      icon: Boxes,
    },
    {
      href: "/portal/admin/impact",
      title: "Impact snapshot",
      description: "Track shared access and climate resilience signals.",
      icon: LineChart,
    },
  ];

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-2xl border border-[color:var(--line)] bg-gradient-to-br from-green-900 via-green-800 to-green-700 px-5 py-6 text-white shadow-[0_16px_40px_rgba(18,32,24,0.14)] sm:px-7">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full bg-white/10 blur-2xl"
        />
        <div className="relative flex items-start gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <Shield size={22} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              {superAdmin ? "Super admin" : "Sub-admin"} portal
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Operate ShambaShare
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/85">
              Monitor users, moderate listings, track impact
              {superAdmin ? ", and manage your admin team" : ""}.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Users"
          value={String(stats.users)}
          hint="Accounts on this device / network"
          icon={Users}
          href="/portal/admin/users"
        />
        <StatCard
          label="Listings"
          value={String(stats.listings)}
          hint="Seed + owner posts"
          icon={Boxes}
          href="/portal/admin/listings"
        />
        <StatCard
          label="Bookings"
          value={String(stats.bookings)}
          hint="Rental requests logged"
          icon={LineChart}
        />
        <StatCard
          label="Sub-admins"
          value={String(stats.subadmins)}
          hint={superAdmin ? "Manage in Admin team" : "Assigned by super admin"}
          icon={UserCog}
          href={superAdmin ? "/portal/admin/team" : undefined}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group field-panel-strong flex items-start gap-3.5 rounded-2xl p-5 transition hover:-translate-y-0.5 hover:border-green-700/25 hover:shadow-[0_14px_32px_rgba(18,32,24,0.07)]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-800 text-white">
                <Icon size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-base font-semibold text-green-950">
                    {item.title}
                  </span>
                  <ArrowRight
                    size={16}
                    className="text-green-800 transition group-hover:translate-x-0.5"
                  />
                </span>
                <span className="mt-1 block text-sm text-ink-muted">
                  {item.description}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
