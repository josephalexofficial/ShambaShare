import type { UserRole } from "@/lib/constants";
import type { SessionUser } from "@/lib/auth/session";

export type LocalAccount = {
  id: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  county: string;
  role: UserRole;
};

const ACCOUNTS_KEY = "shambashare_accounts_v1";

function readAll(): Record<string, LocalAccount> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, LocalAccount>;
  } catch {
    return {};
  }
}

function writeAll(map: Record<string, LocalAccount>) {
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(map));
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function upsertLocalAccount(
  account: Omit<LocalAccount, "email"> & { email: string },
) {
  const email = normalizeEmail(account.email);
  const map = readAll();
  map[email] = { ...account, email };
  writeAll(map);
  return map[email];
}

export function findLocalAccount(email: string): LocalAccount | null {
  const map = readAll();
  return map[normalizeEmail(email)] ?? null;
}

export function verifyLocalAccount(
  email: string,
  password: string,
): LocalAccount | null {
  const account = findLocalAccount(email);
  if (!account) return null;
  if (account.password !== password) return null;
  return account;
}

export function listLocalAccounts(): LocalAccount[] {
  return Object.values(readAll()).sort((a, b) =>
    a.fullName.localeCompare(b.fullName),
  );
}

export function deleteLocalAccount(email: string): boolean {
  const key = normalizeEmail(email);
  const map = readAll();
  if (!(key in map)) return false;
  delete map[key];
  writeAll(map);
  return true;
}

export function updateLocalAccountRole(
  email: string,
  role: UserRole,
): LocalAccount | null {
  const account = findLocalAccount(email);
  if (!account) return null;
  return upsertLocalAccount({ ...account, role });
}

export function accountToSession(
  account: LocalAccount,
  source: SessionUser["source"] = "local",
): SessionUser {
  return {
    id: account.id,
    email: account.email,
    fullName: account.fullName,
    phone: account.phone,
    county: account.county,
    role: account.role,
    source,
  };
}
