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
    description: "Monitor users, listings, rentals, and platform impact.",
  },
] as const;

export type UserRole = (typeof USER_ROLES)[number]["value"];

/** Roles members can choose themselves. Admin is assigned only by operators. */
export const SELF_SERVICE_ROLES = USER_ROLES.filter(
  (role) => role.value !== "admin",
);

export type SelfServiceRole = (typeof SELF_SERVICE_ROLES)[number]["value"];

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

export function canRent(role: UserRole | null | undefined) {
  return role === "renter" || role === "both";
}

export function canList(role: UserRole | null | undefined) {
  return role === "owner" || role === "both";
}

export function isAdmin(role: UserRole | null | undefined) {
  return role === "admin";
}

export function postAuthPath(_role?: UserRole) {
  return "/portal/overview";
}
