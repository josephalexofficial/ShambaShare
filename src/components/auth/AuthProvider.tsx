"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
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
import { clearPortalMode } from "@/lib/portal-mode";

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

/** "Both" members must re-choose their side (renter/owner) on each new session. */
function resetPortalModeIfBoth(sessionUser: SessionUser) {
  if (sessionUser.role === "both") clearPortalMode(sessionUser.id);
}

function metaString(user: User, key: string): string {
  const value = (user.user_metadata as Record<string, unknown> | null)?.[key];
  return typeof value === "string" ? value : "";
}

/**
 * Build a SessionUser from a Supabase auth user. Prefers a `profiles` row when
 * available, but falls back to the auth user's metadata so the app still works
 * even before a profiles table / RLS policies are set up.
 */
async function toSupabaseSessionUser(user: User): Promise<SessionUser> {
  let profile: {
    full_name?: string | null;
    phone?: string | null;
    county?: string | null;
    role?: string | null;
  } | null = null;

  try {
    const supabase = createBrowserSupabaseClient();
    const { data } = await supabase
      .from("profiles")
      .select("full_name, phone, county, role")
      .eq("id", user.id)
      .maybeSingle();
    profile = data ?? null;
  } catch {
    // profiles table may not exist yet — metadata fallback below.
  }

  const role = (profile?.role ||
    metaString(user, "role") ||
    "both") as UserRole;

  return {
    id: user.id,
    email: user.email ?? "",
    fullName:
      profile?.full_name ||
      metaString(user, "full_name") ||
      user.email ||
      "ShambaShare user",
    phone: profile?.phone || metaString(user, "phone") || "",
    county: profile?.county || metaString(user, "county") || "Uasin Gishu",
    role,
    source: "supabase",
  };
}

/** Best-effort mirror to a `profiles` table (ignored if it doesn't exist). */
async function syncProfile(user: SessionUser) {
  try {
    const supabase = createBrowserSupabaseClient();
    await supabase.from("profiles").upsert({
      id: user.id,
      full_name: user.fullName,
      phone: user.phone,
      county: user.county,
      role: user.role,
    });
  } catch {
    // ignore
  }
}

function saveLocalAccountAndSession(input: {
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    if (!isSupabaseConfigured()) {
      const local = readLocalSession();
      if (local) setUser(local);
      setLoading(false);
      return;
    }

    const supabase = createBrowserSupabaseClient();

    supabase.auth
      .getSession()
      .then(async ({ data }) => {
        if (!active) return;
        if (data.session?.user) {
          const su = await toSupabaseSessionUser(data.session.user);
          if (!active) return;
          setUser(su);
          writeLocalSession(su);
        } else {
          const local = readLocalSession();
          if (local) setUser(local);
        }
        if (active) setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        const local = readLocalSession();
        if (local) setUser(local);
        setLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const su = await toSupabaseSessionUser(session.user);
          setUser(su);
          writeLocalSession(su);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          clearLocalSession();
        }
      },
    );

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (input: SignInInput) => {
    const email = normalizeEmail(input.email);
    const password = input.password.trim();

    if (isSupabaseConfigured()) {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data.user) {
          const su = await toSupabaseSessionUser(data.user);
          upsertLocalAccount({
            id: su.id,
            email,
            password,
            fullName: su.fullName,
            phone: su.phone,
            county: su.county,
            role: su.role,
          });
          resetPortalModeIfBoth(su);
          setUser(su);
          writeLocalSession(su);
          return { user: su };
        }

        // Supabase rejected — try a local account created on this device.
        const local = verifyLocalAccount(email, password);
        if (local) {
          const su = accountToSession(local, "local");
          resetPortalModeIfBoth(su);
          setUser(su);
          writeLocalSession(su);
          return { user: su };
        }

        if (error && /email not confirmed/i.test(error.message)) {
          return {
            error:
              "Please confirm your email first (check your inbox), then sign in.",
          };
        }
        return { error: "Invalid email or password." };
      } catch (error) {
        console.warn("Supabase sign-in failed, trying local:", error);
      }
    }

    const local = verifyLocalAccount(email, password);
    if (local) {
      const su = accountToSession(local, "local");
      resetPortalModeIfBoth(su);
      setUser(su);
      writeLocalSession(su);
      return { user: su };
    }
    if (findLocalAccount(email)) {
      return { error: "Wrong password for this email." };
    }
    return {
      error: "No account found for this email. Open Join to create one.",
    };
  }, []);

  const signUp = useCallback(
    async (input: SignUpInput) => {
      const email = normalizeEmail(input.email);
      const password = input.password.trim();
      const fullName = input.fullName.trim();
      const phone = input.phone.trim();
      const county = input.county.trim() || "Uasin Gishu";
      const role = input.role;

      if (!email || password.length < 6) {
        return {
          error:
            "Enter a valid email and a password of at least 6 characters.",
        };
      }

      if (isSupabaseConfigured()) {
        try {
          const supabase = createBrowserSupabaseClient();
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: fullName, phone, county, role },
            },
          });

          if (error) {
            if (/registered|already/i.test(error.message)) {
              // Account exists — sign them in instead.
              return await signIn({ email, password });
            }
            return { error: error.message };
          }

          if (data.session?.user) {
            const su = await toSupabaseSessionUser(data.session.user);
            await syncProfile(su);
            upsertLocalAccount({
              id: su.id,
              email,
              password,
              fullName: su.fullName,
              phone: su.phone,
              county: su.county,
              role: su.role,
            });
            resetPortalModeIfBoth(su);
            setUser(su);
            writeLocalSession(su);
            return { user: su };
          }

          // No session returned => email confirmation is enabled.
          return {
            error:
              "Account created, but email confirmation is on. Confirm via the email we sent, then sign in. To allow instant login across devices, disable email confirmation in Supabase → Authentication → Providers → Email.",
          };
        } catch (error) {
          console.warn("Supabase signup failed, using local account:", error);
        }
      }

      // Local-only fallback (Supabase not configured or unreachable).
      const su = saveLocalAccountAndSession({
        id: crypto.randomUUID(),
        email,
        password,
        fullName,
        phone,
        county,
        role,
        source: "local",
      });
      resetPortalModeIfBoth(su);
      setUser(su);
      return { user: su };
    },
    [signIn],
  );

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured()) {
      try {
        await createBrowserSupabaseClient().auth.signOut();
      } catch {
        // ignore
      }
    }
    const current = readLocalSession();
    if (current) clearPortalMode(current.id);
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

      if (isSupabaseConfigured() && next.source === "supabase") {
        try {
          const supabase = createBrowserSupabaseClient();
          void supabase.auth.updateUser({
            data: {
              full_name: next.fullName,
              phone: next.phone,
              county: next.county,
              role: next.role,
            },
          });
          void syncProfile(next);
        } catch {
          // ignore
        }
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
