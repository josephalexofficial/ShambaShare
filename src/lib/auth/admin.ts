import { upsertLocalAccount } from "@/lib/auth/local-accounts";
import {
  SUPER_ADMIN,
  isSuperAdminEmail,
  matchesSuperAdminCredentials,
} from "@/lib/auth/super-admin";
import { isSubAdminEmail } from "@/lib/admin-team-store";
import type { UserRole } from "@/lib/constants";

export {
  SUPER_ADMIN,
  isSuperAdminEmail,
  matchesSuperAdminCredentials,
} from "@/lib/auth/super-admin";

/** Ensure the super-admin account always exists on this device. */
export function ensureSuperAdminSeeded() {
  if (typeof window === "undefined") return;
  upsertLocalAccount({
    id: SUPER_ADMIN.id,
    email: SUPER_ADMIN.email,
    password: SUPER_ADMIN.password,
    fullName: SUPER_ADMIN.fullName,
    phone: SUPER_ADMIN.phone,
    county: SUPER_ADMIN.county,
    role: "admin",
  });
}

/**
 * Resolve the true staff role from email.
 * Super-admin email always wins as `admin`. Known sub-admins resolve as
 * `subadmin`. Random members can never keep a staff role.
 */
export function resolveStaffRole(
  email: string,
  role: UserRole | null | undefined,
): UserRole {
  if (isSuperAdminEmail(email)) return "admin";
  if (isSubAdminEmail(email)) return "subadmin";
  if (role === "admin" || role === "subadmin") return "both";
  return role ?? "both";
}
