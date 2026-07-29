"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { ButtonLink } from "@/components/ui/Button";
import { isAdmin, isAdminStaff } from "@/lib/constants";
import { Shield } from "lucide-react";

export function AdminGuard({
  children,
  superOnly = false,
}: {
  children: React.ReactNode;
  /** When true, only the platform super admin (role admin) may enter. */
  superOnly?: boolean;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-ink-muted">
        Checking admin access…
      </div>
    );
  }

  const allowed = superOnly
    ? Boolean(user && isAdmin(user.role))
    : Boolean(user && isAdminStaff(user.role));

  if (!allowed) {
    return (
      <div className="field-panel-strong mx-auto max-w-lg rounded-2xl p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-800/10 text-green-800">
          <Shield size={26} />
        </span>
        <h1 className="mt-5 text-2xl font-semibold text-green-950">
          {superOnly ? "Super admin only" : "Admin access only"}
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          {superOnly
            ? "Managing the admin team is reserved for the platform super admin."
            : "Sign in with an admin or sub-admin account to open this area."}
        </p>
        <ButtonLink href="/portal/overview" className="mt-6" variant="secondary">
          Back to overview
        </ButtonLink>
      </div>
    );
  }

  return <>{children}</>;
}
