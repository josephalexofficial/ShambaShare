"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SEED_EQUIPMENT } from "@/lib/seed-equipment";
import { canList, canRent } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<"renting" | "sharing">("renting");
  const myTools = useMemo(() => SEED_EQUIPMENT.slice(0, 3), []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-ink-muted">
        Loading dashboard…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold text-green-950">
          Sign in to open your dashboard
        </h1>
        <p className="mt-3 text-ink-muted">
          Renters track requests. Owners manage listings. Both get a combined
          workspace.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/auth">Sign in</ButtonLink>
          <ButtonLink href="/join" variant="secondary">
            Join
          </ButtonLink>
        </div>
      </div>
    );
  }

  const showRenting = canRent(user.role);
  const showSharing = canList(user.role);
  const activeTab =
    user.role === "owner" ? "sharing" : user.role === "renter" ? "renting" : tab;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-water-700">
            Dashboard
          </p>
          <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-green-950">
            Habari, {user.fullName.split(" ")[0]}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-ink-muted">
            Signed in as <span className="font-semibold text-green-800">{user.role}</span>
            {" · "}
            {user.county || "Uasin Gishu"} · {user.phone}
          </p>
        </div>
        <div className="flex gap-2">
          {showRenting ? (
            <ButtonLink href="/browse" variant="secondary">
              Find tools
            </ButtonLink>
          ) : null}
          {showSharing ? <ButtonLink href="/list">Share equipment</ButtonLink> : null}
        </div>
      </div>

      {user.role === "both" ? (
        <div className="mt-8 inline-flex rounded-md bg-green-800/5 p-1">
          <button
            type="button"
            onClick={() => setTab("renting")}
            className={`rounded-md px-4 py-2 text-sm font-semibold ${
              activeTab === "renting" ? "bg-white text-green-900" : "text-ink-muted"
            }`}
          >
            Renting
          </button>
          <button
            type="button"
            onClick={() => setTab("sharing")}
            className={`rounded-md px-4 py-2 text-sm font-semibold ${
              activeTab === "sharing" ? "bg-white text-green-900" : "text-ink-muted"
            }`}
          >
            Sharing
          </button>
        </div>
      ) : null}

      {activeTab === "renting" && showRenting ? (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-semibold text-green-950">
            My rental requests
          </h2>
          <div className="field-panel-strong mt-4 rounded-xl p-6 text-sm text-ink-muted">
            No live requests yet. When you tap <strong>Request to rent</strong> on
            a tool, it will appear here and trigger SMS to both sides.
          </div>
          <div className="mt-4">
            <ButtonLink href="/browse" variant="secondary">
              Browse nearby tools
            </ButtonLink>
          </div>
        </section>
      ) : null}

      {activeTab === "sharing" && showSharing ? (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-semibold text-green-950">
            My listings
          </h2>
          <div className="mt-4 grid gap-4">
            {myTools.map((item) => (
              <div
                key={item.id}
                className="field-panel-strong flex flex-col gap-3 rounded-xl p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-green-950">{item.title}</p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {item.locationLabel} · {item.ratePerDay.toLocaleString()} KES /
                    day ·{" "}
                    {item.isAvailable ? (
                      <span className="text-green-700">Available</span>
                    ) : (
                      <span className="text-soil-700">Reserved</span>
                    )}
                  </p>
                </div>
                <Link
                  href={`/equipment/${item.id}`}
                  className="text-sm font-semibold text-water-700 hover:text-green-800"
                >
                  View
                </Link>
              </div>
            ))}
          </div>

          <div className="field-panel-strong mt-6 rounded-xl p-6 text-sm text-ink-muted">
            Incoming rental requests will show here once SMS matching is live.
          </div>
        </section>
      ) : null}
    </div>
  );
}
