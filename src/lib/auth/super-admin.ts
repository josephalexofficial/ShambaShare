import { normalizeEmail } from "@/lib/auth/local-accounts";

/**
 * Platform super-admin credentials for demo + operations.
 * Seeded into local accounts and auto-provisioned on Supabase when signing in.
 */
export const SUPER_ADMIN = {
  id: "super-admin-shambashare",
  email: "shambashare@gmail.com",
  password: "Shamba@123",
  fullName: "ShambaShare Admin",
  phone: "+254700000000",
  county: "Uasin Gishu",
} as const;

export function isSuperAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return normalizeEmail(email) === SUPER_ADMIN.email;
}

export function matchesSuperAdminCredentials(
  email: string,
  password: string,
): boolean {
  return (
    isSuperAdminEmail(email) && password.trim() === SUPER_ADMIN.password
  );
}
