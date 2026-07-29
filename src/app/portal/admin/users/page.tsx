"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Trash2, Users } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { AdminGuard } from "@/components/portal/AdminGuard";
import { isAdmin, type UserRole } from "@/lib/constants";
import { isSuperAdminEmail } from "@/lib/auth/super-admin";
import {
  deleteLocalAccount,
  listLocalAccounts,
  updateLocalAccountRole,
  type LocalAccount,
} from "@/lib/auth/local-accounts";

const MEMBER_ROLES: UserRole[] = ["renter", "owner", "both"];

function roleLabel(role: string) {
  if (role === "subadmin") return "Sub-admin";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export default function AdminUsersPage() {
  return (
    <AdminGuard>
      <AdminUsersInner />
    </AdminGuard>
  );
}

function AdminUsersInner() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<LocalAccount[]>([]);
  const [query, setQuery] = useState("");
  const superAdmin = Boolean(user && isAdmin(user.role));

  function refresh() {
    setAccounts(listLocalAccounts());
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return accounts;
    return accounts.filter(
      (a) =>
        a.fullName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        a.county.toLowerCase().includes(q),
    );
  }, [accounts, query]);

  function handleRoleChange(email: string, role: UserRole) {
    if (isSuperAdminEmail(email)) return;
    updateLocalAccountRole(email, role);
    refresh();
  }

  function handleDelete(email: string) {
    if (isSuperAdminEmail(email)) return;
    if (email === user?.email) return;
    if (
      !window.confirm(
        `Remove ${email} from the local account list on this device?`,
      )
    ) {
      return;
    }
    deleteLocalAccount(email);
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-green-950">
            Users
          </h1>
          <p className="mt-2 text-ink-muted">
            Renters, owners, and staff accounts.{" "}
            {superAdmin
              ? "Promote helpers from Admin team."
              : "Role changes for staff are managed by the super admin."}
          </p>
        </div>
        <p className="text-sm font-semibold text-green-800">
          {filtered.length} shown
        </p>
      </div>

      <div className="relative">
        <Search
          size={17}
          className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-muted"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, role, county…"
          className="w-full rounded-xl border border-[color:var(--line)] bg-white py-3 pr-3 pl-10 text-sm outline-none ring-green-700 focus:ring-2"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="field-panel-strong rounded-2xl px-6 py-14 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-800/10 text-green-800">
            <Users size={26} />
          </span>
          <p className="mt-5 text-xl font-semibold text-green-950">
            No users found
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            Accounts appear here after members join on this device or sign in.
          </p>
        </div>
      ) : (
        <div className="field-panel-strong overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-[color:var(--line)] bg-green-800/5 text-xs uppercase tracking-[0.12em] text-ink-muted">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">County</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => {
                  const locked =
                    isSuperAdminEmail(row.email) ||
                    row.role === "admin" ||
                    row.role === "subadmin";
                  return (
                    <tr
                      key={row.email}
                      className="border-b border-[color:var(--line)] last:border-0"
                    >
                      <td className="px-4 py-3 font-medium text-green-950">
                        {row.fullName}
                        {isSuperAdminEmail(row.email) ? (
                          <span className="ml-2 rounded-md bg-green-800/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-800">
                            Super
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-ink-muted">{row.email}</td>
                      <td className="px-4 py-3">
                        {locked ? (
                          <span className="font-medium text-green-900">
                            {roleLabel(row.role)}
                          </span>
                        ) : (
                          <select
                            value={row.role}
                            onChange={(e) =>
                              handleRoleChange(
                                row.email,
                                e.target.value as UserRole,
                              )
                            }
                            className="rounded-lg border border-[color:var(--line)] bg-white px-2 py-1.5 text-sm text-green-950 outline-none ring-green-700 focus:ring-2"
                          >
                            {MEMBER_ROLES.map((role) => (
                              <option key={role} value={role}>
                                {roleLabel(role)}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-4 py-3 text-ink-muted">{row.county}</td>
                      <td className="px-4 py-3 text-ink-muted">
                        {row.phone || "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isSuperAdminEmail(row.email) ||
                        row.email === user?.email ? (
                          <span className="text-xs text-ink-muted">Protected</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDelete(row.email)}
                            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
