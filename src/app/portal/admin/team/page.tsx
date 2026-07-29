"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Plus,
  Shield,
  Trash2,
  UserCog,
  Users,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { AdminGuard } from "@/components/portal/AdminGuard";
import { Button } from "@/components/ui/Button";
import {
  addSubAdmin,
  deleteSubAdmin,
  listSubAdmins,
  type SubAdminRecord,
} from "@/lib/admin-team-store";
const inputClass =
  "w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--cream-field)]/40 px-3.5 py-3 text-sm text-green-950 outline-none ring-green-700 transition placeholder:text-ink-muted/70 focus:bg-white focus:ring-2";

export default function AdminTeamPage() {
  return (
    <AdminGuard superOnly>
      <AdminTeamInner />
    </AdminGuard>
  );
}

function AdminTeamInner() {
  const { user } = useAuth();
  const [rows, setRows] = useState<SubAdminRecord[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function refresh() {
    setRows(listSubAdmins());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const fullName = String(form.get("fullName") ?? "");
    const phone = String(form.get("phone") ?? "");
    const county = String(form.get("county") ?? "Uasin Gishu");

    const result = addSubAdmin({
      email,
      password,
      fullName,
      phone,
      county,
      createdBy: user.email,
    });

    if (result.error || !result.subAdmin) {
      setError(result.error || "Could not create sub-admin.");
      setSubmitting(false);
      return;
    }

    // Best-effort remote create (service role) so hosted login works without
    // replacing the currently signed-in super-admin session.
    try {
      await fetch("/api/admin/subadmins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: result.subAdmin.email,
          password,
          fullName: result.subAdmin.fullName,
          phone: result.subAdmin.phone,
          county: result.subAdmin.county,
        }),
      });
    } catch (err) {
      console.warn("Sub-admin remote create (non-blocking):", err);
    }

    setSuccess(
      `${result.subAdmin.fullName} is now a sub-admin. They can sign in with that email and password.`,
    );
    setOpenForm(false);
    setSubmitting(false);
    refresh();
    event.currentTarget.reset();
  }

  function handleDelete(email: string, name: string) {
    if (
      !window.confirm(
        `Remove ${name} as a sub-admin? They will lose admin portal access.`,
      )
    ) {
      return;
    }
    const result = deleteSubAdmin(email);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSuccess(`${name} was removed from the admin team.`);
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-green-950">
            Admin team
          </h1>
          <p className="mt-2 max-w-2xl text-ink-muted">
            Add sub-admins who can manage users, listings, and impact. Only you
            (the super admin) can add or remove them.
          </p>
        </div>
        <Button
          type="button"
          className="rounded-xl"
          onClick={() => {
            setOpenForm((v) => !v);
            setError(null);
            setSuccess(null);
          }}
        >
          <Plus size={16} />
          {openForm ? "Cancel" : "Add sub-admin"}
        </Button>
      </div>

      {success ? (
        <div className="rounded-2xl border border-green-700/20 bg-green-800/10 px-4 py-3 text-sm text-green-900">
          {success}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {openForm ? (
        <form
          onSubmit={handleCreate}
          className="field-panel-strong space-y-4 rounded-2xl p-5 sm:p-6"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-800 text-white">
              <UserCog size={18} />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-green-950">
                New sub-admin
              </h2>
              <p className="text-sm text-ink-muted">
                They get admin portal access, but cannot manage the admin team.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1.5 block font-medium text-green-950">
                Full name
              </span>
              <input
                required
                name="fullName"
                placeholder="Jane Wanjiku"
                className={inputClass}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-green-950">
                Email
              </span>
              <input
                required
                type="email"
                name="email"
                placeholder="helper@email.com"
                className={inputClass}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-green-950">
                Temporary password
              </span>
              <input
                required
                type="text"
                name="password"
                minLength={6}
                placeholder="At least 6 characters"
                className={inputClass}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-green-950">
                Phone
              </span>
              <input
                name="phone"
                placeholder="07XX XXX XXX"
                className={inputClass}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-green-950">
                County
              </span>
              <input
                name="county"
                defaultValue="Uasin Gishu"
                className={inputClass}
              />
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="secondary"
              className="rounded-xl"
              onClick={() => setOpenForm(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl" disabled={submitting}>
              {submitting ? "Creating…" : "Create sub-admin"}
            </Button>
          </div>
        </form>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="field-panel-strong rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
            Super admin
          </p>
          <p className="mt-1 text-lg font-semibold text-green-950">1</p>
          <p className="mt-1 text-sm text-ink-muted">You — full control</p>
        </div>
        <div className="field-panel-strong rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
            Sub-admins
          </p>
          <p className="mt-1 text-lg font-semibold text-green-950">
            {rows.length}
          </p>
          <p className="mt-1 text-sm text-ink-muted">Helpers on the team</p>
        </div>
        <div className="field-panel-strong rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
            Their access
          </p>
          <p className="mt-1 text-sm font-medium text-green-950">
            Users · Listings · Impact
          </p>
          <p className="mt-1 text-sm text-ink-muted">Not the admin team</p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="field-panel-strong rounded-2xl px-6 py-14 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-800/10 text-green-800">
            <Users size={26} />
          </span>
          <p className="mt-5 text-xl font-semibold text-green-950">
            No sub-admins yet
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
            Add a trusted helper so they can moderate users and listings while
            you keep control of the admin team.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <article
              key={row.email}
              className="field-panel-strong flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-800/10 text-green-800">
                  <Shield size={18} />
                </span>
                <div className="min-w-0">
                  <h2 className="font-semibold text-green-950">{row.fullName}</h2>
                  <p className="mt-1 truncate text-sm text-ink-muted">
                    {row.email}
                    {row.phone ? ` · ${row.phone}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-ink-muted">
                    {row.county} · Added{" "}
                    {new Date(row.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(row.email, row.fullName)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
              >
                <Trash2 size={15} />
                Remove
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
