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
import { USER_ROLES, isSelfServiceRole, type UserRole } from "@/lib/constants";
import {
  matchesSuperAdminCredentials,
  resolveStaffRole,
  SUPER_ADMIN,
  isSuperAdminEmail,
} from "@/lib/auth/admin";
import { bootstrapDemoNetwork } from "@/lib/demo-network";
import {
  DEMO_NETWORK_PASSWORD,
  getDemoUserByEmail,
  type SeedDemoUser,
} from "@/lib/auth/seed-users";
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

/** Only accept a role that is a real, known role — never guess. */
function normalizeRole(value: unknown): UserRole | null {
  return typeof value === "string" &&
    USER_ROLES.some((item) => item.value === value)
    ? (value as UserRole)
    : null;
}

function withStaffRole(user: SessionUser): SessionUser {
  return { ...user, role: resolveStaffRole(user.email, user.role) };
}

/**
 * Seeded demo accounts keep stable ids (user-william, etc.) so listings and
 * bookings stay linked even when Supabase assigns a different auth uuid.
 */
function withStableDemoIdentity(user: SessionUser): SessionUser {
  const demo = getDemoUserByEmail(user.email);
  if (!demo) return withStaffRole(user);
  return {
    ...user,
    id: demo.id,
    fullName: demo.fullName,
    phone: demo.phone,
    county: demo.county,
    role: resolveStaffRole(user.email, demo.role),
  };
}

function establishSession(user: SessionUser) {
  const next = withStableDemoIdentity(user);
  resetPortalModeIfBoth(next);
  writeLocalSession(next);
  return next;
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

  const rawRole =
    normalizeRole(metaString(user, "role")) ??
    normalizeRole(profile?.role) ??
    "both";

  const email = user.email ?? "";
  const role = resolveStaffRole(email, rawRole);

  return {
    id: user.id,
    email,
    fullName:
      profile?.full_name ||
      metaString(user, "full_name") ||
      (isSuperAdminEmail(email) ? SUPER_ADMIN.fullName : null) ||
      user.email ||
      "ShambaShare user",
    phone:
      profile?.phone ||
      metaString(user, "phone") ||
      (isSuperAdminEmail(email) ? SUPER_ADMIN.phone : "") ||
      "",
    county:
      profile?.county ||
      metaString(user, "county") ||
      SUPER_ADMIN.county,
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

async function syncAuthMetadata(user: SessionUser) {
  try {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.updateUser({
      data: {
        full_name: user.fullName,
        phone: user.phone,
        county: user.county,
        role: user.role,
      },
    });
  } catch {
    // ignore
  }
}

/**
 * Ensure the super-admin exists in Supabase so hosted login works with the
 * known credentials even on a fresh deploy.
 */
async function provisionSuperAdminOnSupabase(
  password: string,
): Promise<SessionUser | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createBrowserSupabaseClient();
  const email = SUPER_ADMIN.email;

  const signedIn = await supabase.auth.signInWithPassword({ email, password });
  if (!signedIn.error && signedIn.data.user) {
    const su = await toSupabaseSessionUser(signedIn.data.user);
    const adminUser = {
      ...su,
      role: "admin" as const,
      fullName: SUPER_ADMIN.fullName,
    };
    await syncAuthMetadata(adminUser);
    await syncProfile(adminUser);
    return adminUser;
  }

  const signedUp = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: SUPER_ADMIN.fullName,
        phone: SUPER_ADMIN.phone,
        county: SUPER_ADMIN.county,
        role: "admin",
      },
    },
  });

  if (!signedUp.error && signedUp.data.session?.user) {
    const su = await toSupabaseSessionUser(signedUp.data.session.user);
    const adminUser = {
      ...su,
      role: "admin" as const,
      fullName: SUPER_ADMIN.fullName,
    };
    await syncProfile(adminUser);
    return adminUser;
  }

  // Email confirmation may be on — local session still works for the demo.
  return null;
}

/** Provision a seeded owner/renter on Supabase so hosted login works. */
async function provisionDemoUserOnSupabase(
  demo: SeedDemoUser,
  password: string,
): Promise<SessionUser | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createBrowserSupabaseClient();

  const signedIn = await supabase.auth.signInWithPassword({
    email: demo.email,
    password,
  });
  if (!signedIn.error && signedIn.data.user) {
    const su = await toSupabaseSessionUser(signedIn.data.user);
    return {
      ...su,
      fullName: demo.fullName,
      phone: demo.phone,
      county: demo.county,
      role: demo.role,
    };
  }

  const signedUp = await supabase.auth.signUp({
    email: demo.email,
    password,
    options: {
      data: {
        full_name: demo.fullName,
        phone: demo.phone,
        county: demo.county,
        role: demo.role,
      },
    },
  });

  if (!signedUp.error && signedUp.data.session?.user) {
    const su = await toSupabaseSessionUser(signedUp.data.session.user);
    const next = {
      ...su,
      fullName: demo.fullName,
      phone: demo.phone,
      county: demo.county,
      role: demo.role,
    };
    await syncProfile(next);
    return next;
  }

  return null;
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
  const role = resolveStaffRole(input.email, input.role);
  const account = upsertLocalAccount({
    id: input.id,
    email: input.email,
    password: input.password,
    fullName: input.fullName,
    phone: input.phone,
    county: input.county,
    role,
  });
  return establishSession(accountToSession(account, input.source));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    bootstrapDemoNetwork();

    if (!isSupabaseConfigured()) {
      const local = readLocalSession();
      if (local) setUser(withStaffRole(local));
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
          setUser(establishSession(su));
        } else {
          const local = readLocalSession();
          if (local) setUser(withStaffRole(local));
        }
        if (active) setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        const local = readLocalSession();
        if (local) setUser(withStaffRole(local));
        setLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const su = await toSupabaseSessionUser(session.user);
          setUser(establishSession(su));
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
    bootstrapDemoNetwork();
    const email = normalizeEmail(input.email);
    const password = input.password.trim();

    // Super-admin path: always works locally; also provisions on Supabase.
    if (matchesSuperAdminCredentials(email, password)) {
      if (isSupabaseConfigured()) {
        try {
          const provisioned = await provisionSuperAdminOnSupabase(password);
          if (provisioned) {
            upsertLocalAccount({
              id: provisioned.id,
              email,
              password,
              fullName: SUPER_ADMIN.fullName,
              phone: SUPER_ADMIN.phone,
              county: SUPER_ADMIN.county,
              role: "admin",
            });
            const session = establishSession(provisioned);
            setUser(session);
            return { user: session };
          }
        } catch (error) {
          console.warn("Super-admin Supabase provision failed:", error);
        }
      }

      const local = verifyLocalAccount(email, password);
      if (local) {
        const session = establishSession(accountToSession(local, "local"));
        setUser(session);
        return { user: session };
      }
    }

    // Seeded demo network (owners + renters) — local first, then provision hosted.
    const demoUser = getDemoUserByEmail(email);
    if (demoUser && password === DEMO_NETWORK_PASSWORD) {
      if (isSupabaseConfigured()) {
        try {
          const provisioned = await provisionDemoUserOnSupabase(
            demoUser,
            password,
          );
          if (provisioned) {
            upsertLocalAccount({
              id: demoUser.id,
              email: demoUser.email,
              password,
              fullName: demoUser.fullName,
              phone: demoUser.phone,
              county: demoUser.county,
              role: demoUser.role,
            });
            const session = establishSession({
              ...provisioned,
              id: demoUser.id,
              role: demoUser.role,
              fullName: demoUser.fullName,
              phone: demoUser.phone,
              county: demoUser.county,
            });
            setUser(session);
            return { user: session };
          }
        } catch (error) {
          console.warn("Demo user Supabase provision failed:", error);
        }
      }

      const local = verifyLocalAccount(email, password);
      if (local) {
        const session = establishSession(accountToSession(local, "local"));
        setUser(session);
        return { user: session };
      }
    }

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
          const session = establishSession(su);
          setUser(session);
          return { user: session };
        }

        const local = verifyLocalAccount(email, password);
        if (local) {
          const session = establishSession(accountToSession(local, "local"));
          setUser(session);
          return { user: session };
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
      const session = establishSession(accountToSession(local, "local"));
      setUser(session);
      return { user: session };
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

      if (isSuperAdminEmail(email)) {
        return {
          error:
            "This email is reserved for the platform admin. Please Sign in with the admin credentials.",
        };
      }

      if (!email || password.length < 6) {
        return {
          error:
            "Enter a valid email and a password of at least 6 characters.",
        };
      }

      const role = resolveStaffRole(email, input.role);

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
              return await signIn({ email, password });
            }
            return { error: error.message };
          }

          if (data.session?.user) {
            const su: SessionUser = {
              id: data.session.user.id,
              email,
              fullName,
              phone,
              county,
              role,
              source: "supabase",
            };
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
            const session = establishSession(su);
            setUser(session);
            return { user: session };
          }

          return {
            error:
              "Account created, but email confirmation is on. Confirm via the email we sent, then sign in. To allow instant login across devices, disable email confirmation in Supabase → Authentication → Providers → Email.",
          };
        } catch (error) {
          console.warn("Supabase signup failed, using local account:", error);
        }
      }

      const session = saveLocalAccountAndSession({
        id: crypto.randomUUID(),
        email,
        password,
        fullName,
        phone,
        county,
        role,
        source: "local",
      });
      setUser(session);
      return { user: session };
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
        // Staff roles are locked — only the super-admin / team tools change them.
        if (current.role === "admin" || current.role === "subadmin") {
          nextRole = current.role;
        } else if (!isSelfServiceRole(patch.role)) {
          nextRole = current.role;
        } else {
          nextRole = patch.role;
        }
      }

      nextRole = resolveStaffRole(current.email, nextRole);

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
        void syncAuthMetadata(next);
        void syncProfile(next);
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
