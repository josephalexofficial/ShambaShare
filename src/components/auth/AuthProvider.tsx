"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { isSelfServiceRole, type UserRole } from "@/lib/constants";
import {
  accountToSession,
  findLocalAccount,
  normalizeEmail,
  upsertLocalAccount,
  verifyLocalAccount,
} from "@/lib/auth/local-accounts";
import {
  clearLocalSession,
  readLocalSession,
  writeLocalSession,
  type SessionUser,
} from "@/lib/auth/session";
import {
  createBrowserSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";

type SignUpInput = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  county: string;
  role: UserRole;
};

type SignInInput = {
  email: string;
  password: string;
};

type AuthContextValue = {
  user: SessionUser | null;
  loading: boolean;
  signUp: (input: SignUpInput) => Promise<{ error?: string; user?: SessionUser }>;
  signIn: (input: SignInInput) => Promise<{ error?: string; user?: SessionUser }>;
  updateProfile: (patch: Partial<SessionUser>) => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function saveAccountAndSession(input: {
  id: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  county: string;
  role: UserRole;
  source: SessionUser["source"];
}) {
  const account = upsertLocalAccount({
    id: input.id,
    email: input.email,
    password: input.password,
    fullName: input.fullName,
    phone: input.phone,
    county: input.county,
    role: input.role,
  });
  const sessionUser = accountToSession(account, input.source);
  writeLocalSession(sessionUser);
  return sessionUser;
}

async function syncSupabaseSignUp(input: {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  county: string;
  role: UserRole;
}): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          full_name: input.fullName,
          phone: input.phone,
          county: input.county,
          role: input.role,
        },
      },
    });

    if (error) {
      console.warn("Supabase signup (non-blocking):", error.message);
      return null;
    }

    const userId = data.user?.id ?? null;
    if (userId) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: userId,
        full_name: input.fullName,
        phone: input.phone,
        county: input.county,
        role: input.role,
      });
      if (profileError) console.warn(profileError.message);
    }
    return userId;
  } catch (error) {
    console.warn("Supabase signup failed (non-blocking):", error);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const local = readLocalSession();
    if (local) setUser(local);
    setLoading(false);
  }, []);

  const signUp = useCallback(async (input: SignUpInput) => {
    const email = normalizeEmail(input.email);
    const password = input.password.trim();

    if (!email || password.length < 6) {
      return { error: "Enter a valid email and a password of at least 6 characters." };
    }

    // Local-first: account must work even if Supabase email confirmation blocks login.
    const localId = crypto.randomUUID();
    const sessionUser = saveAccountAndSession({
      id: localId,
      email,
      password,
      fullName: input.fullName.trim(),
      phone: input.phone.trim(),
      county: input.county.trim() || "Uasin Gishu",
      role: input.role,
      source: "local",
    });
    setUser(sessionUser);

    const supabaseId = await syncSupabaseSignUp({
      email,
      password,
      fullName: input.fullName.trim(),
      phone: input.phone.trim(),
      county: input.county.trim() || "Uasin Gishu",
      role: input.role,
    });

    if (supabaseId) {
      const synced = saveAccountAndSession({
        id: supabaseId,
        email,
        password,
        fullName: input.fullName.trim(),
        phone: input.phone.trim(),
        county: input.county.trim() || "Uasin Gishu",
        role: input.role,
        source: "supabase",
      });
      setUser(synced);
      return { user: synced };
    }

    return { user: sessionUser };
  }, []);

  const signIn = useCallback(async (input: SignInInput) => {
    const email = normalizeEmail(input.email);
    const password = input.password.trim();

    // 1) Local accounts are the source of truth for portal login.
    const local = verifyLocalAccount(email, password);
    if (local) {
      const session = accountToSession(local, "local");
      writeLocalSession(session);
      setUser(session);
      return { user: session };
    }

    // 2) Optional Supabase fallback (confirmed accounts only).
    if (isSupabaseConfigured()) {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, phone, county, role")
            .eq("id", data.user.id)
            .maybeSingle();

          const sessionUser = saveAccountAndSession({
            id: data.user.id,
            email,
            password,
            fullName:
              profile?.full_name ?? data.user.email ?? "ShambaShare user",
            phone: profile?.phone ?? "",
            county: profile?.county ?? "Uasin Gishu",
            role: (profile?.role as UserRole) ?? "both",
            source: "supabase",
          });
          setUser(sessionUser);
          return { user: sessionUser };
        }
      } catch (error) {
        console.warn(error);
      }
    }

    if (findLocalAccount(email)) {
      return { error: "Wrong password for this email." };
    }

    return {
      error:
        "No saved account for this email on this device. Open Join and create your account again (same email is fine).",
    };
  }, []);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createBrowserSupabaseClient();
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    clearLocalSession();
    setUser(null);
  }, []);

  const updateProfile = useCallback((patch: Partial<SessionUser>) => {
    setUser((current) => {
      if (!current) return current;

      let nextRole = patch.role ?? current.role;
      if (patch.role !== undefined) {
        if (current.role === "admin") {
          nextRole = "admin";
        } else if (!isSelfServiceRole(patch.role)) {
          nextRole = current.role;
        } else {
          nextRole = patch.role;
        }
      }

      const next: SessionUser = { ...current, ...patch, role: nextRole };
      writeLocalSession(next);

      const stored = findLocalAccount(next.email);
      if (stored) {
        upsertLocalAccount({
          ...stored,
          fullName: next.fullName,
          phone: next.phone,
          county: next.county,
          role: next.role,
        });
      }

      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ user, loading, signUp, signIn, updateProfile, signOut }),
    [user, loading, signUp, signIn, updateProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
