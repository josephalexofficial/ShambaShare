"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { isAdmin } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/Button";

const USERS = [
  {
    name: "Grace Jeptoo",
    role: "Renter",
    county: "Uasin Gishu",
    phone: "0712 445 221",
  },
  {
    name: "Amina Cooperative",
    role: "Owner",
    county: "Uasin Gishu",
    phone: "0701 220 118",
  },
  {
    name: "Daniel Cheruiyot",
    role: "Both",
    county: "Uasin Gishu",
    phone: "0740 551 902",
  },
  {
    name: "EldoHub Admin",
    role: "Admin",
    county: "Uasin Gishu",
    phone: "0722 100 200",
  },
];

export default function AdminUsersPage() {
  const { user } = useAuth();
  if (!user || !isAdmin(user.role)) {
    return (
      <div className="field-panel-strong rounded-xl p-8 text-center">
        <h1 className="font-display text-2xl font-semibold text-green-950">
          Admin access only
        </h1>
        <ButtonLink href="/portal/overview" className="mt-6" variant="secondary">
          Back
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-green-950">
          Users
        </h1>
        <p className="mt-2 text-ink-muted">
          Renters, owners, and admins on the ShambaShare network.
        </p>
      </div>
      <div className="field-panel-strong overflow-hidden rounded-xl">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[color:var(--line)] bg-green-800/5 text-xs uppercase tracking-[0.12em] text-ink-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">County</th>
              <th className="px-4 py-3">Phone</th>
            </tr>
          </thead>
          <tbody>
            {USERS.map((row) => (
              <tr key={row.phone} className="border-b border-[color:var(--line)]">
                <td className="px-4 py-3 font-medium text-green-950">
                  {row.name}
                </td>
                <td className="px-4 py-3 text-ink-muted">{row.role}</td>
                <td className="px-4 py-3 text-ink-muted">{row.county}</td>
                <td className="px-4 py-3 text-ink-muted">{row.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
