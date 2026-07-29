import { ensureSuperAdminSeeded } from "@/lib/auth/admin";
import { ensureDemoNetworkUsers } from "@/lib/auth/seed-users";
import { ensureSeedBookings } from "@/lib/bookings-store";

/**
 * Boots the realistic demo network on the client:
 * - super admin credentials
 * - 4 owners + 4 renters
 * - starter bookings between them
 */
export function bootstrapDemoNetwork() {
  if (typeof window === "undefined") return;
  ensureSuperAdminSeeded();
  ensureDemoNetworkUsers();
  ensureSeedBookings();
}
