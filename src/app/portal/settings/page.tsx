"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Check,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
  Users,
  Wrench,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import {
  SELF_SERVICE_ROLES,
  isAdmin,
  isAdminStaff,
  isSelfServiceRole,
  type SelfServiceRole,
  type UserRole,
} from "@/lib/constants";

const ROLE_ICONS = {
  renter: Users,
  owner: Wrench,
  both: User,
} as const;

const inputClass =
  "w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--cream-field)]/40 py-3 pr-3 pl-10 text-[0.9375rem] text-green-950 outline-none ring-green-700 transition placeholder:text-ink-muted/70 focus:bg-white focus:ring-2";

export default function PortalSettingsPage() {
  const { user, updateProfile } = useAuth();
  const [saved, setSaved] = useState(false);
  const [role, setRole] = useState<SelfServiceRole>("renter");

  useEffect(() => {
    if (!user) return;
    if (isSelfServiceRole(user.role)) {
      setRole(user.role);
    }
  }, [user]);

  if (!user) return null;

  const adminAccount = isAdminStaff(user.role);
  const superAdminAccount = isAdmin(user.role);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const patch: Partial<{
      fullName: string;
      phone: string;
      county: string;
      role: UserRole;
    }> = {
      fullName: String(form.get("fullName") ?? user!.fullName),
      phone: String(form.get("phone") ?? user!.phone),
      county: String(form.get("county") ?? user!.county),
    };

    // Never send admin from this form — only self-service roles for members.
    if (!adminAccount) {
      patch.role = role;
    }

    updateProfile(patch);
    setSaved(true);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-green-950">
          Settings
        </h1>
        <p className="mt-2 text-ink-muted">
          Keep your contact details current so owners and renters can reach you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className="field-panel-strong rounded-2xl p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-green-950">Profile</h2>
          <p className="mt-1 text-sm text-ink-muted">
            These details appear on bookings and pickup coordination.
          </p>

          <div className="mt-5 space-y-4">
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
                  name="fullName"
                  required
                  defaultValue={user.fullName}
                  className={inputClass}
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
                  disabled
                  value={user.email}
                  className={`${inputClass} cursor-not-allowed opacity-80`}
                />
              </span>
              <span className="mt-1.5 block text-xs text-ink-muted">
                Email can’t be changed here.
              </span>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
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
                    name="phone"
                    required
                    defaultValue={user.phone}
                    placeholder="07XX XXX XXX"
                    className={inputClass}
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
                    required
                    defaultValue={user.county}
                    className={inputClass}
                  />
                </span>
              </label>
            </div>
          </div>
        </section>

        <section className="field-panel-strong rounded-2xl p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-green-950">
            How you use ShambaShare
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            {adminAccount
              ? "Admin access is assigned by the platform — it can’t be chosen from Settings."
              : "Choose renter, owner, or both. This updates your portal menu right away."}
          </p>

          {adminAccount ? (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-green-700/20 bg-green-800/8 px-4 py-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-800 text-white">
                <Shield size={20} />
              </span>
              <div>
                <p className="font-semibold text-green-950">
                  {superAdminAccount ? "Super administrator" : "Sub-admin"}
                </p>
                <p className="mt-1 text-sm text-ink-muted">
                  {superAdminAccount
                    ? "You have full control — users, listings, impact, and the admin team. This role can’t be changed from Settings."
                    : "You can manage users, listings, and impact. Staff roles are assigned by the super admin only."}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-5 space-y-2.5">
              {SELF_SERVICE_ROLES.map((item) => {
                const Icon = ROLE_ICONS[item.value];
                const active = role === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setRole(item.value);
                      setSaved(false);
                    }}
                    className={`flex w-full items-center gap-3.5 rounded-2xl border px-4 py-3.5 text-left transition ${
                      active
                        ? "border-green-700 bg-green-800/8"
                        : "border-[color:var(--line)] bg-[color:var(--cream-field)]/40 hover:bg-white"
                    }`}
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        active
                          ? "bg-green-800 text-white"
                          : "bg-white text-green-800"
                      }`}
                    >
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-base font-semibold text-green-950">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-sm leading-snug text-ink-muted">
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
          )}
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {saved ? (
            <p className="inline-flex items-center gap-1.5 text-sm font-medium text-green-800">
              <Check size={16} />
              Profile updated.
            </p>
          ) : (
            <p className="text-sm text-ink-muted">
              Save when you’re done editing.
            </p>
          )}
          <Button type="submit" className="rounded-xl sm:min-w-[10rem]">
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
