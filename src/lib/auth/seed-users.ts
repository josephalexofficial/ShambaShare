import { upsertLocalAccount, type LocalAccount } from "@/lib/auth/local-accounts";
import type { UserRole } from "@/lib/constants";

export type SeedDemoUser = {
  id: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  county: string;
  role: UserRole;
  area: string;
};

/** Shared demo password for all seeded network members. */
export const DEMO_NETWORK_PASSWORD = "Alex@123";

/**
 * Real demo network for ShambaShare.
 * Owners own the Find-tools catalogue; renters request their tools.
 */
export const DEMO_OWNERS: SeedDemoUser[] = [
  {
    id: "user-william",
    email: "william@gmail.com",
    password: DEMO_NETWORK_PASSWORD,
    fullName: "William Kipchoge",
    phone: "0721 458 903",
    county: "Uasin Gishu",
    role: "owner",
    area: "Turbo",
  },
  {
    id: "user-kiplagat",
    email: "kiplagat@gmail.com",
    password: DEMO_NETWORK_PASSWORD,
    fullName: "Kiplagat Keter",
    phone: "0708 224 671",
    county: "Uasin Gishu",
    role: "owner",
    area: "Moiben",
  },
  {
    id: "user-rotich",
    email: "rotich@gmail.com",
    password: DEMO_NETWORK_PASSWORD,
    fullName: "Rotich Kibet",
    phone: "0740 881 245",
    county: "Uasin Gishu",
    role: "owner",
    area: "Kapseret",
  },
  {
    id: "user-gladys",
    email: "gladys@gmail.com",
    password: DEMO_NETWORK_PASSWORD,
    fullName: "Gladys Chepkoech",
    phone: "0712 993 418",
    county: "Uasin Gishu",
    role: "owner",
    area: "Kesses",
  },
];

export const DEMO_RENTERS: SeedDemoUser[] = [
  {
    id: "user-whimsey",
    email: "whimsey@gmail.com",
    password: DEMO_NETWORK_PASSWORD,
    fullName: "Whimsey Achieng",
    phone: "0790 112 334",
    county: "Uasin Gishu",
    role: "renter",
    area: "Eldoret Town",
  },
  {
    id: "user-charles",
    email: "charles@gmail.com",
    password: DEMO_NETWORK_PASSWORD,
    fullName: "Charles Omondi",
    phone: "0724 667 890",
    county: "Uasin Gishu",
    role: "renter",
    area: "Langas",
  },
  {
    id: "user-reuben",
    email: "reuben@gmail.com",
    password: DEMO_NETWORK_PASSWORD,
    fullName: "Reuben Mutai",
    phone: "0701 553 228",
    county: "Uasin Gishu",
    role: "renter",
    area: "Burnt Forest",
  },
  {
    id: "user-owen",
    email: "owen@gmail.com",
    password: DEMO_NETWORK_PASSWORD,
    fullName: "Owen Kiprono",
    phone: "0741 220 119",
    county: "Uasin Gishu",
    role: "renter",
    area: "Soy",
  },
];

export const DEMO_NETWORK_USERS: SeedDemoUser[] = [
  ...DEMO_OWNERS,
  ...DEMO_RENTERS,
];

export function getDemoUserById(id: string): SeedDemoUser | undefined {
  return DEMO_NETWORK_USERS.find((user) => user.id === id);
}

export function getDemoUserByEmail(email: string): SeedDemoUser | undefined {
  const normalized = email.trim().toLowerCase();
  return DEMO_NETWORK_USERS.find((user) => user.email === normalized);
}

/** Upsert every demo network account into local auth storage. */
export function ensureDemoNetworkUsers(): LocalAccount[] {
  if (typeof window === "undefined") return [];
  return DEMO_NETWORK_USERS.map((user) =>
    upsertLocalAccount({
      id: user.id,
      email: user.email,
      password: user.password,
      fullName: user.fullName,
      phone: user.phone,
      county: user.county,
      role: user.role,
    }),
  );
}
