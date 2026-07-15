"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  USER_ROLES,
  type UserRole,
  postAuthPath,
} from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";

export default function JoinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp } = useAuth();

  const intent = searchParams.get("intent");
  const initialRole: UserRole =
    intent === "owner" ? "owner" : intent === "renter" ? "renter" : "both";

  const [role, setRole] = useState<UserRole>(initialRole);
  const [step, setStep] = useState<"role" | "details">("role");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selected = useMemo(
    () => USER_ROLES.find((item) => item.value === role),
    [role],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const result = await signUp({
      fullName: String(form.get("fullName") ?? ""),
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      phone: String(form.get("phone") ?? ""),
      county: String(form.get("county") ?? "Uasin Gishu"),
      role,
    });

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push(postAuthPath(role));
  }

  return (
    <div className="mx-auto flex max-w-6xl justify-center px-4 py-12 sm:px-6 sm:py-16">
      <div className="w-full max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-water-700">
          Join ShambaShare
        </p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-green-950">
          Create your account
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-muted">
          Choose how you’ll use the platform, then sign up with email, password,
          and phone for SMS rental alerts.
        </p>

        {step === "role" ? (
          <div className="mt-8 space-y-4">
            <p className="text-sm font-semibold text-green-950">
              How will you use ShambaShare?
            </p>
            <div className="grid gap-3">
              {USER_ROLES.map((item) => {
                const active = role === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setRole(item.value)}
                    className={`rounded-xl border px-5 py-4 text-left transition ${
                      active
                        ? "border-green-700 bg-green-800/10 shadow-[0_10px_30px_rgba(27,77,50,0.12)]"
                        : "border-[color:var(--line)] bg-white/80 hover:bg-white"
                    }`}
                  >
                    <p className="font-display text-xl font-semibold text-green-950">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-ink-muted">
                      {item.description}
                    </p>
                  </button>
                );
              })}
            </div>
            <Button type="button" onClick={() => setStep("details")} className="w-full sm:w-auto">
              Continue
            </Button>
            <p className="text-sm text-ink-muted">
              Already have an account?{" "}
              <Link href="/auth" className="font-semibold text-green-800 underline">
                Sign in
              </Link>
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="field-panel-strong mt-8 space-y-4 rounded-2xl p-6 sm:p-8"
          >
            <button
              type="button"
              onClick={() => setStep("role")}
              className="text-sm font-medium text-water-700 hover:text-green-800"
            >
              ← Change role ({selected?.title})
            </button>

            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-green-950">
                Full name
              </span>
              <input
                required
                name="fullName"
                className="w-full rounded-md border border-[color:var(--line)] bg-white/90 px-3 py-2.5 outline-none ring-green-700 focus:ring-2"
              />
            </label>

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

            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-green-950">
                Phone number
              </span>
              <input
                required
                name="phone"
                placeholder="07XX XXX XXX"
                className="w-full rounded-md border border-[color:var(--line)] bg-white/90 px-3 py-2.5 outline-none ring-green-700 focus:ring-2"
              />
              <span className="mt-1 block text-xs text-ink-muted">
                Required for SMS alerts when a rental is requested.
              </span>
            </label>

            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-green-950">
                County
              </span>
              <input
                name="county"
                defaultValue="Uasin Gishu"
                className="w-full rounded-md border border-[color:var(--line)] bg-white/90 px-3 py-2.5 outline-none ring-green-700 focus:ring-2"
              />
            </label>

            {error ? (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Creating account…" : "Create account"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
