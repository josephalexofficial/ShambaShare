import type { Metadata } from "next";
import { Suspense } from "react";
import ListingsClient from "./ListingsClient";

export const metadata: Metadata = {
  title: "My listings",
};

export default function PortalListingsRoute() {
  return (
    <Suspense
      fallback={
        <div className="text-sm text-ink-muted">Loading listings…</div>
      }
    >
      <ListingsClient />
    </Suspense>
  );
}
