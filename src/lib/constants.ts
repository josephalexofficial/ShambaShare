export const SITE = {
  name: "ShambaShare",
  tagline: "Climate-smart tools, closer than you think.",
  description:
    "Rent nearby solar pumps, soil kits, and farm equipment online — book dates, track requests, and manage everything in your portal.",
  location: "Eldoret · Uasin Gishu",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Find tools" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/impact", label: "Impact" },
  { href: "/about", label: "About" },
] as const;

export const USER_ROLES = [
  {
    value: "renter",
    title: "I’m a Renter",
    description: "Find and request nearby climate-smart tools for my farm.",
  },
  {
    value: "owner",
    title: "I’m an Owner",
    description: "List idle equipment and earn when neighbors rent it.",
  },
  {
    value: "both",
    title: "I do both",
    description: "I rent tools when I need them and share my own when idle.",
  },
  {
    value: "admin",
    title: "I’m an Admin",
    description: "Full platform control — users, listings, impact, and staff.",
  },
  {
    value: "subadmin",
    title: "I’m a Sub-admin",
    description: "Help operate users, listings, and impact (assigned by admin).",
  },
] as const;

export type UserRole = (typeof USER_ROLES)[number]["value"];

export type SelfServiceRole = "renter" | "owner" | "both";

/** Roles members can choose themselves. Staff roles are assigned only by operators. */
export const SELF_SERVICE_ROLES = USER_ROLES.filter(
  (role): role is (typeof USER_ROLES)[number] & { value: SelfServiceRole } =>
    role.value === "renter" ||
    role.value === "owner" ||
    role.value === "both",
);

export function isSelfServiceRole(role: string): role is SelfServiceRole {
  return SELF_SERVICE_ROLES.some((item) => item.value === role);
}

export const EQUIPMENT_CATEGORIES = [
  { value: "irrigation", label: "Irrigation" },
  { value: "soil_testing", label: "Soil testing" },
  { value: "tillage", label: "Tillage" },
  { value: "water", label: "Water" },
  { value: "other", label: "Other" },
] as const;

export type EquipmentCategory = (typeof EQUIPMENT_CATEGORIES)[number]["value"];

/**
 * The role a member is *currently acting as*.
 *
 * A "both" member behaves as a renter or an owner depending on the portal mode
 * they picked at login. Everyone else acts as their fixed role.
 */
export function resolveEffectiveRole(
  role: UserRole | null | undefined,
  mode: "renter" | "owner" | null | undefined,
): UserRole | null {
  if (!role) return null;
  if (role === "both") return mode ?? null;
  return role;
}

export function canRent(role: UserRole | null | undefined) {
  return role === "renter" || role === "both";
}

export function canList(role: UserRole | null | undefined) {
  return role === "owner" || role === "both";
}

/** Super admin only (full control, including the admin team). */
export function isAdmin(role: UserRole | null | undefined) {
  return role === "admin";
}

/** Anyone with staff access to the admin portal. */
export function isAdminStaff(role: UserRole | null | undefined) {
  return role === "admin" || role === "subadmin";
}

export function postAuthPath(role?: UserRole) {
  if (isAdminStaff(role)) return "/portal/admin";
  return "/portal/overview";
}
