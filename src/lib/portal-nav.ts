import type { UserRole } from "@/lib/constants";
import {
  LayoutDashboard,
  Search,
  CalendarRange,
  Wrench,
  Handshake,
  Wallet,
  Bell,
  Settings,
  Shield,
  Users,
  Boxes,
  LineChart,
  type LucideIcon,
} from "lucide-react";

export type PortalNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: UserRole[];
};

export const PORTAL_NAV: PortalNavItem[] = [
  {
    href: "/portal/overview",
    label: "Overview",
    icon: LayoutDashboard,
    roles: ["renter", "owner", "both", "admin"],
  },
  {
    href: "/portal/find",
    label: "Find tools",
    icon: Search,
    roles: ["renter", "both"],
  },
  {
    href: "/portal/bookings",
    label: "My bookings",
    icon: CalendarRange,
    roles: ["renter", "both"],
  },
  {
    href: "/portal/listings",
    label: "My listings",
    icon: Wrench,
    roles: ["owner", "both"],
  },
  {
    href: "/portal/rentals",
    label: "Rental requests",
    icon: Handshake,
    roles: ["owner", "both"],
  },
  {
    href: "/portal/income",
    label: "Income",
    icon: Wallet,
    roles: ["owner", "both"],
  },
  {
    href: "/portal/admin",
    label: "Admin home",
    icon: Shield,
    roles: ["admin"],
  },
  {
    href: "/portal/admin/users",
    label: "Users",
    icon: Users,
    roles: ["admin"],
  },
  {
    href: "/portal/admin/listings",
    label: "All listings",
    icon: Boxes,
    roles: ["admin"],
  },
  {
    href: "/portal/admin/impact",
    label: "Impact",
    icon: LineChart,
    roles: ["admin"],
  },
  {
    href: "/portal/notifications",
    label: "Notifications",
    icon: Bell,
    roles: ["renter", "owner", "both", "admin"],
  },
  {
    href: "/portal/settings",
    label: "Settings",
    icon: Settings,
    roles: ["renter", "owner", "both", "admin"],
  },
];

export function navForRole(role: UserRole) {
  return PORTAL_NAV.filter((item) => item.roles.includes(role));
}
