import { Suspense } from "react";
import PortalBookingsPage from "./BookingsClient";

export default function BookingsPage() {
  return (
    <Suspense
      fallback={
        <div className="text-ink-muted">Loading bookings…</div>
      }
    >
      <PortalBookingsPage />
    </Suspense>
  );
}
