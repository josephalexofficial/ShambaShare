"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { UserRole } from "@/lib/constants";
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
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const local = readLocalSession();
    if (local) setUser(local);
    setLoading(false);
  }, []);

  const signUp = useCallback(async (input: SignUpInput) => {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data, error } = await supabase.auth.signUp({
          email: input.email,
          password: input.password,
        });

        if (error) return { error: error.message };
        if (!data.user) return { error: "Could not create account." };

        const { error: profileError } = await supabase.from("profiles").upsert({
          id: data.user.id,
          full_name: input.fullName,
          phone: input.phone,
          county: input.county,
          role: input.role,
        });

        if (profileError) {
          // Account may exist even if profile insert fails (e.g. schema not run)
          console.warn(profileError.message);
        }

        const sessionUser: SessionUser = {
          id: data.user.id,
          email: input.email,
          fullName: input.fullName,
          phone: input.phone,
          county: input.county,
          role: input.role,
          source: "supabase",
        };
        writeLocalSession(sessionUser);
        setUser(sessionUser);
        return { user: sessionUser };
      } catch (error) {
        return {
          error:
            error instanceof Error
              ? error.message
              : "Signup failed. Check Supabase configuration.",
        };
      }
    }

    const sessionUser: SessionUser = {
      id: crypto.randomUUID(),
      email: input.email,
      fullName: input.fullName,
      phone: input.phone,
      county: input.county,
      role: input.role,
      source: "local",
    };
    writeLocalSession(sessionUser);
    setUser(sessionUser);
    return { user: sessionUser };
  }, []);

  const signIn = useCallback(async (input: SignInInput) => {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: input.email,
          password: input.password,
        });

        if (error) return { error: error.message };
        if (!data.user) return { error: "Could not sign in." };

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, phone, county, role")
          .eq("id", data.user.id)
          .maybeSingle();

        const sessionUser: SessionUser = {
          id: data.user.id,
          email: input.email,
          fullName: profile?.full_name ?? data.user.email ?? "ShambaShare user",
          phone: profile?.phone ?? "",
          county: profile?.county ?? "Uasin Gishu",
          role: (profile?.role as UserRole) ?? "both",
          source: "supabase",
        };
        writeLocalSession(sessionUser);
        setUser(sessionUser);
        return { user: sessionUser };
      } catch (error) {
        return {
          error:
            error instanceof Error
              ? error.message
              : "Sign in failed. Check Supabase configuration.",
        };
      }
    }

    const existing = readLocalSession();
    if (!existing || existing.email.toLowerCase() !== input.email.toLowerCase()) {
      return {
        error:
          "No local demo account found for that email. Use Join to create one, or connect Supabase.",
      };
    }

    setUser(existing);
    return { user: existing };
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

  const value = useMemo(
    () => ({ user, loading, signUp, signIn, signOut }),
    [user, loading, signUp, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
