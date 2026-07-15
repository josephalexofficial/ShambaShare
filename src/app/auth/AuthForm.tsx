"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { postAuthPath } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";

export default function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const { signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const result = await signIn({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });

    setSubmitting(false);

    if (result.error || !result.user) {
      setError(result.error ?? "Could not sign in.");
      return;
    }

    router.push(next || postAuthPath(result.user.role));
  }

  return (
    <div className="mx-auto flex max-w-6xl justify-center px-4 py-16 sm:px-6">
      <div className="w-full max-w-md field-panel-strong rounded-2xl p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-water-700">
          Welcome back
        </p>
        <h1 className="font-display mt-3 text-3xl font-semibold text-green-950">
          Sign in
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Use your email and password. Your role opens the right dashboard for
          renting, sharing, or both.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-green-950">Email</span>
            <input
              required
              type="email"
              name="email"
              className="w-full rounded-md border border-[color:var(--line)] bg-white/90 px-3 py-2.5 outline-none ring-green-700 focus:ring-2"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-green-950">
              Password
            </span>
            <input
              required
              type="password"
              name="password"
              minLength={6}
              className="w-full rounded-md border border-[color:var(--line)] bg-white/90 px-3 py-2.5 outline-none ring-green-700 focus:ring-2"
            />
          </label>

          {error ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-5 text-sm text-ink-muted">
          New here?{" "}
          <Link href="/join" className="font-semibold text-green-800 underline">
            Join ShambaShare
          </Link>
        </p>
      </div>
    </div>
  );
}
