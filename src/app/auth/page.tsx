import type { Metadata } from "next";
import { Suspense } from "react";
import AuthForm from "./AuthForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Create a ShambaShare account with email, password, and phone.",
};

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-20 text-center text-ink-muted">
          Loading account…
        </div>
      }
    >
      <AuthForm />
    </Suspense>
  );
}
