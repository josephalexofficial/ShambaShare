import type { UserRole } from "@/lib/constants";

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  county: string;
  role: UserRole;
  source: "local" | "supabase";
};

const STORAGE_KEY = "shambashare_session_v1";

export function readLocalSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function writeLocalSession(user: SessionUser) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearLocalSession() {
  window.localStorage.removeItem(STORAGE_KEY);
}
