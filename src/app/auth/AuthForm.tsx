"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const result = await signIn({
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? "").trim(),
    });

    setSubmitting(false);

    if (result.error || !result.user) {
      setError(result.error ?? "Could not sign in.");
      return;
    }

    router.push(next || postAuthPath(result.user.role));
  }

  const joinHref = next
    ? `/join?intent=renter&next=${encodeURIComponent(next)}`
    : "/join";

  return (
    <div className="mx-auto flex justify-center px-4 py-12 sm:px-6 sm:py-16">
      <div className="w-full max-w-md rounded-2xl border border-[color:var(--line)] bg-white p-6 shadow-[0_12px_40px_rgba(18,32,24,0.06)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-water-700">
          Welcome back
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-green-950">
          Sign in
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Use your email and password to open your portal.
        </p>

        {next ? (
          <div className="mt-4 rounded-xl bg-green-800/8 px-3 py-2.5 text-xs font-medium text-green-900">
            After signing in, you’ll continue to your request.
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-green-950">Email</span>
            <span className="relative block">
              <Mail
                size={16}
                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-muted"
              />
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@email.com"
                className="w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--cream-field)]/50 py-3 pr-3 pl-10 text-sm text-green-950 outline-none ring-green-700 transition placeholder:text-ink-muted/70 focus:bg-white focus:ring-2"
              />
            </span>
          </label>

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-green-950">
              Password
            </span>
            <span className="relative block">
              <Lock
                size={16}
                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-muted"
              />
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                minLength={6}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--cream-field)]/50 py-3 pr-11 pl-10 text-sm text-green-950 outline-none ring-green-700 transition placeholder:text-ink-muted/70 focus:bg-white focus:ring-2"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-ink-muted hover:text-green-900"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </span>
          </label>

          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            className="w-full rounded-xl py-3.5"
            disabled={submitting}
          >
            {submitting ? "Signing in…" : "Sign in"}
            {!submitting ? <ArrowRight size={16} /> : null}
          </Button>
        </form>

        <div className="mt-6 border-t border-[color:var(--line)] pt-5 text-center text-sm text-ink-muted">
          New here?{" "}
          <Link
            href={joinHref}
            className="font-semibold text-green-800 hover:underline"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
