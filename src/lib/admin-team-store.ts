import {
  findLocalAccount,
  normalizeEmail,
  upsertLocalAccount,
  type LocalAccount,
} from "@/lib/auth/local-accounts";
import { isSuperAdminEmail } from "@/lib/auth/super-admin";

export type SubAdminRecord = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  county: string;
  createdAt: string;
  createdBy: string;
};

const KEY = "shambashare_subadmins_v1";

function readAll(): SubAdminRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SubAdminRecord[];
  } catch {
    return [];
  }
}

function writeAll(rows: SubAdminRecord[]) {
  window.localStorage.setItem(KEY, JSON.stringify(rows));
}

export function listSubAdmins(): SubAdminRecord[] {
  return readAll().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function isSubAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = normalizeEmail(email);
  return listSubAdmins().some((row) => row.email === normalized);
}

export function addSubAdmin(input: {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  county: string;
  createdBy: string;
}): { error?: string; subAdmin?: SubAdminRecord; account?: LocalAccount } {
  const email = normalizeEmail(input.email);
  const password = input.password.trim();
  const fullName = input.fullName.trim();
  const phone = input.phone.trim();
  const county = input.county.trim() || "Uasin Gishu";

  if (!email || !email.includes("@")) {
    return { error: "Enter a valid email for the sub-admin." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }
  if (!fullName) {
    return { error: "Enter the sub-admin’s full name." };
  }
  if (isSuperAdminEmail(email)) {
    return { error: "That email is reserved for the platform super admin." };
  }
  if (isSubAdminEmail(email)) {
    return { error: "That email is already a sub-admin." };
  }

  const existing = findLocalAccount(email);
  if (existing && existing.role !== "subadmin") {
    return {
      error:
        "That email already belongs to a member account. Use a different email for staff.",
    };
  }

  const id = existing?.id ?? `sub-${crypto.randomUUID()}`;
  const account = upsertLocalAccount({
    id,
    email,
    password,
    fullName,
    phone,
    county,
    role: "subadmin",
  });

  const record: SubAdminRecord = {
    id,
    email,
    fullName,
    phone,
    county,
    createdAt: new Date().toISOString(),
    createdBy: input.createdBy,
  };

  writeAll([record, ...readAll().filter((row) => row.email !== email)]);
  return { subAdmin: record, account };
}

export function deleteSubAdmin(email: string): { error?: string } {
  const normalized = normalizeEmail(email);
  if (isSuperAdminEmail(normalized)) {
    return { error: "The platform super admin cannot be deleted." };
  }

  const next = readAll().filter((row) => row.email !== normalized);
  if (next.length === readAll().length) {
    return { error: "Sub-admin not found." };
  }
  writeAll(next);

  // Soft-demote the local account so they can no longer open the admin portal.
  const account = findLocalAccount(normalized);
  if (account) {
    upsertLocalAccount({
      ...account,
      role: "both",
    });
  }

  return {};
}
