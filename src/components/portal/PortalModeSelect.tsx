"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  LogOut,
  Search,
  Sprout,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { usePortalMode } from "@/components/portal/PortalModeProvider";
import { SITE } from "@/lib/constants";
import type { PortalMode } from "@/lib/portal-mode";

type ModeOption = {
  value: PortalMode;
  title: string;
  tagline: string;
  icon: LucideIcon;
  points: string[];
};

const OPTIONS: ModeOption[] = [
  {
    value: "renter",
    title: "Continue as Renter",
    tagline: "Find & book nearby tools",
    icon: Search,
    points: [
      "Browse climate-smart tools near you",
      "Request dates and track bookings",
    ],
  },
  {
    value: "owner",
    title: "Continue as Owner",
    tagline: "Share your idle equipment",
    icon: Wrench,
    points: [
      "List tools and approve requests",
      "Track active rentals and income",
    ],
  },
];

export function PortalModeSelect() {
  const { user, signOut } = useAuth();
  const { setMode } = usePortalMode();
  const router = useRouter();

  const firstName = user?.fullName.split(" ")[0] || "there";

  function choose(mode: PortalMode) {
    setMode(mode);
    router.push("/portal/overview");
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[linear-gradient(180deg,#eef5ee_0%,var(--cream-field)_45%,#e7f0ea_100%)]">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-10 sm:px-6">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-700 to-green-900 text-white shadow-[0_12px_30px_rgba(27,77,50,0.3)]">
            <Sprout size={26} strokeWidth={2.25} />
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-water-700">
            {SITE.name}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-green-950 sm:text-3xl">
            Habari, {firstName} — how do you want to continue?
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
            Your account can rent and share tools. Pick a side for this session —
            you can switch anytime from the sidebar.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => choose(option.value)}
                className="group flex flex-col rounded-2xl border border-[color:var(--line)] bg-white p-6 text-left shadow-[0_8px_30px_rgba(18,32,24,0.05)] transition duration-200 hover:-translate-y-1 hover:border-green-700/30 hover:shadow-[0_18px_44px_rgba(18,32,24,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-800 text-white shadow-[0_8px_20px_rgba(27,77,50,0.24)] transition group-hover:scale-105">
                  <Icon size={22} />
                </span>
                <h2 className="mt-4 text-xl font-semibold tracking-tight text-green-950">
                  {option.title}
                </h2>
                <p className="mt-1 text-sm font-medium text-water-700">
                  {option.tagline}
                </p>
                <ul className="mt-4 flex-1 space-y-2">
                  {option.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-sm text-ink-muted"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-700" />
                      {point}
                    </li>
                  ))}
                </ul>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-green-800 group-hover:underline">
                  Enter {option.value} portal
                  <ArrowRight
                    size={15}
                    className="transition group-hover:translate-x-0.5"
                  />
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink-muted transition hover:text-red-700"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
