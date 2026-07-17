"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
  Wrench,
} from "lucide-react";
import {
  USER_ROLES,
  type UserRole,
  postAuthPath,
} from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";

const ROLE_ICONS = {
  renter: Users,
  owner: Wrench,
  both: User,
  admin: User,
} as const;

const JOIN_ROLES = [
  {
    value: "renter" as const,
    title: "I’m a Renter",
    description: "Find and request nearby climate-smart tools for my farm.",
  },
  {
    value: "owner" as const,
    title: "I’m an Owner",
    description: "List idle equipment and earn when neighbors rent it.",
  },
  {
    value: "both" as const,
    title: "I do both",
    description: "I rent tools when I need them and share my own when idle.",
  },
];

export default function JoinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp } = useAuth();

  const intent = searchParams.get("intent");
  const next = searchParams.get("next");
  const initialRole: UserRole =
    intent === "owner" ? "owner" : intent === "renter" ? "renter" : "both";

  const [role, setRole] = useState<UserRole>(
    initialRole === "admin" ? "both" : initialRole,
  );
  const [step, setStep] = useState<"role" | "details">("role");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const selected = useMemo(
    () => JOIN_ROLES.find((item) => item.value === role) ?? USER_ROLES[2],
    [role],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "").trim();
    const confirmPassword = String(form.get("confirmPassword") ?? "").trim();

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please confirm your password.");
      return;
    }

    setSubmitting(true);

    const result = await signUp({
      fullName: String(form.get("fullName") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      password,
      phone: String(form.get("phone") ?? "").trim(),
      county: String(form.get("county") ?? "Uasin Gishu").trim(),
      role,
    });

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push(next || postAuthPath(role));
  }

  const authHref = next ? `/auth?next=${encodeURIComponent(next)}` : "/auth";

  return (
    <div className="mx-auto flex h-[calc(100svh-4.25rem)] items-center justify-center overflow-hidden px-4 py-4 sm:px-6 sm:py-5">
      <div className="flex max-h-full w-full max-w-xl flex-col rounded-2xl border border-[color:var(--line)] bg-white p-5 shadow-[0_12px_40px_rgba(18,32,24,0.06)] sm:p-7">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-water-700 sm:text-xs">
          Join ShambaShare
        </p>
        <h1 className="mt-1.5 text-[clamp(1.5rem,3.2vw,1.875rem)] font-semibold tracking-tight text-green-950">
          Create your account
        </h1>
        <p className="mt-1 text-[clamp(0.875rem,1.6vw,1rem)] text-ink-muted">
          {step === "role"
            ? "Choose how you’ll use the platform."
            : "Add your details to open your portal."}
        </p>

        <div className="mt-4 flex items-center gap-2.5">
          <div
            className={`flex h-9 flex-1 items-center justify-center rounded-xl text-sm font-semibold ${
              step === "role"
                ? "bg-green-800 text-white"
                : "bg-green-800/10 text-green-900"
            }`}
          >
            1. Role
          </div>
          <div
            className={`flex h-9 flex-1 items-center justify-center rounded-xl text-sm font-semibold ${
              step === "details"
                ? "bg-green-800 text-white"
                : "bg-[color:var(--cream-field)] text-ink-muted"
            }`}
          >
            2. Details
          </div>
        </div>

        {next ? (
          <div className="mt-3 shrink-0 rounded-xl bg-green-800/8 px-3.5 py-2.5 text-sm font-medium text-green-900">
            After creating your account, you’ll continue to your request.
          </div>
        ) : null}

        {step === "role" ? (
          <div className="mt-4 flex min-h-0 flex-1 flex-col">
            <div className="flex min-h-0 flex-1 flex-col justify-center gap-2.5 sm:gap-3">
              {JOIN_ROLES.map((item) => {
                const active = role === item.value;
                const Icon = ROLE_ICONS[item.value];
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setRole(item.value)}
                    className={`flex w-full items-center gap-3.5 rounded-2xl border px-4 py-3.5 text-left transition sm:gap-4 sm:px-5 sm:py-4 ${
                      active
                        ? "border-green-700 bg-green-800/8"
                        : "border-[color:var(--line)] bg-[color:var(--cream-field)]/50 hover:bg-white"
                    }`}
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${
                        active
                          ? "bg-green-800 text-white"
                          : "bg-white text-green-800"
                      }`}
                    >
                      <Icon className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[clamp(1rem,2vw,1.125rem)] font-semibold text-green-950">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-[clamp(0.8125rem,1.5vw,0.9375rem)] leading-snug text-ink-muted">
                        {item.description}
                      </span>
                    </span>
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                        active
                          ? "border-green-700 bg-green-800 text-white"
                          : "border-[color:var(--line)] bg-white"
                      }`}
                    >
                      {active ? <Check size={13} strokeWidth={3} /> : null}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 shrink-0 space-y-3">
              <Button
                type="button"
                onClick={() => setStep("details")}
                className="w-full rounded-xl py-3.5 text-base"
              >
                Continue
                <ArrowRight size={18} />
              </Button>
              <p className="text-center text-sm text-ink-muted sm:text-[0.9375rem]">
                Already have an account?{" "}
                <Link
                  href={authHref}
                  className="font-semibold text-green-800 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-4 flex min-h-0 flex-1 flex-col overflow-y-auto"
          >
            <div className="space-y-3.5">
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
                <span className="relative block">
                  <User
                    size={17}
                    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-muted"
                  />
                  <input
                    required
                    name="fullName"
                    autoComplete="name"
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--cream-field)]/50 py-3 pr-3 pl-10 text-[0.9375rem] text-green-950 outline-none ring-green-700 transition placeholder:text-ink-muted/70 focus:bg-white focus:ring-2"
                  />
                </span>
              </label>

              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-green-950">
                  Email
                </span>
                <span className="relative block">
                  <Mail
                    size={17}
                    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-muted"
                  />
                  <input
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@email.com"
                    className="w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--cream-field)]/50 py-3 pr-3 pl-10 text-[0.9375rem] text-green-950 outline-none ring-green-700 transition placeholder:text-ink-muted/70 focus:bg-white focus:ring-2"
                  />
                </span>
              </label>

              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-green-950">
                  Password
                </span>
                <span className="relative block">
                  <Lock
                    size={17}
                    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-muted"
                  />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    minLength={6}
                    placeholder="Create a password"
                    className="w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--cream-field)]/50 py-3 pr-11 pl-10 text-[0.9375rem] text-green-950 outline-none ring-green-700 transition placeholder:text-ink-muted/70 focus:bg-white focus:ring-2"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-ink-muted hover:text-green-900"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </span>
              </label>

              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-green-950">
                  Confirm password
                </span>
                <span className="relative block">
                  <Lock
                    size={17}
                    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-muted"
                  />
                  <input
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    autoComplete="new-password"
                    minLength={6}
                    placeholder="Re-enter your password"
                    className="w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--cream-field)]/50 py-3 pr-11 pl-10 text-[0.9375rem] text-green-950 outline-none ring-green-700 transition placeholder:text-ink-muted/70 focus:bg-white focus:ring-2"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-ink-muted hover:text-green-900"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </span>
              </label>

              <div className="grid gap-3.5 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium text-green-950">
                    Phone
                  </span>
                  <span className="relative block">
                    <Phone
                      size={17}
                      className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-muted"
                    />
                    <input
                      required
                      name="phone"
                      autoComplete="tel"
                      placeholder="07XX XXX XXX"
                      className="w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--cream-field)]/50 py-3 pr-3 pl-10 text-[0.9375rem] text-green-950 outline-none ring-green-700 transition placeholder:text-ink-muted/70 focus:bg-white focus:ring-2"
                    />
                  </span>
                </label>

                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium text-green-950">
                    County
                  </span>
                  <span className="relative block">
                    <MapPin
                      size={17}
                      className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-muted"
                    />
                    <input
                      name="county"
                      defaultValue="Uasin Gishu"
                      className="w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--cream-field)]/50 py-3 pr-3 pl-10 text-[0.9375rem] text-green-950 outline-none ring-green-700 transition focus:bg-white focus:ring-2"
                    />
                  </span>
                </label>
              </div>

              {error ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                  {error}
                </p>
              ) : null}
            </div>

            <div className="mt-4 shrink-0 space-y-3">
              <Button
                type="submit"
                className="w-full rounded-xl py-3.5 text-base"
                disabled={submitting}
              >
                {submitting ? "Creating account…" : "Create account"}
                {!submitting ? <ArrowRight size={18} /> : null}
              </Button>

              <p className="text-center text-sm text-ink-muted sm:text-[0.9375rem]">
                Already have an account?{" "}
                <Link
                  href={authHref}
                  className="font-semibold text-green-800 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
