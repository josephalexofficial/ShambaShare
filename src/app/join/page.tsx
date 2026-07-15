import type { Metadata } from "next";
import { Suspense } from "react";
import JoinForm from "./JoinForm";

export const metadata: Metadata = {
  title: "Join",
  description:
    "Join ShambaShare as a renter, owner, or both — share and access climate-smart farm tools.",
};

export default function JoinPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-20 text-center text-ink-muted">
          Loading join…
        </div>
      }
    >
      <JoinForm />
    </Suspense>
  );
}
