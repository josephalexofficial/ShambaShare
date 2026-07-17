"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LegacyDashboardRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/portal/overview");
  }, [router]);
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 text-ink-muted">
      Opening your portal…
    </div>
  );
}
