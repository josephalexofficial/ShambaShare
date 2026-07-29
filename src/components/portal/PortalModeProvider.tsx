"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { resolveEffectiveRole, type UserRole } from "@/lib/constants";
import {
  clearPortalMode,
  readPortalMode,
  writePortalMode,
  type PortalMode,
} from "@/lib/portal-mode";

type PortalModeContextValue = {
  /** False until the stored mode has been read on the client (avoids flashes). */
  ready: boolean;
  /** True when the member's account role is "both". */
  isBoth: boolean;
  /** Chosen side for "both" members; null when not yet chosen. */
  mode: PortalMode | null;
  /** Role the member is currently acting as (renter/owner/admin) or null. */
  effectiveRole: UserRole | null;
  /** True when a "both" member still needs to pick a side. */
  needsSelection: boolean;
  setMode: (mode: PortalMode) => void;
  clearMode: () => void;
};

const PortalModeContext = createContext<PortalModeContextValue | null>(null);

export function PortalModeProvider({
  userId,
  role,
  children,
}: {
  userId: string;
  role: UserRole;
  children: React.ReactNode;
}) {
  const isBoth = role === "both";
  const [mode, setModeState] = useState<PortalMode | null>(null);
  const [ready, setReady] = useState(!isBoth);

  useEffect(() => {
    if (!isBoth) {
      setModeState(null);
      setReady(true);
      return;
    }
    setModeState(readPortalMode(userId));
    setReady(true);
  }, [isBoth, userId]);

  const setMode = useCallback(
    (next: PortalMode) => {
      writePortalMode(userId, next);
      setModeState(next);
    },
    [userId],
  );

  const clearMode = useCallback(() => {
    clearPortalMode(userId);
    setModeState(null);
  }, [userId]);

  const value = useMemo<PortalModeContextValue>(() => {
    const effectiveRole = resolveEffectiveRole(role, mode);
    return {
      ready,
      isBoth,
      mode,
      effectiveRole,
      needsSelection: isBoth && ready && mode === null,
      setMode,
      clearMode,
    };
  }, [isBoth, mode, role, ready, setMode, clearMode]);

  return (
    <PortalModeContext.Provider value={value}>
      {children}
    </PortalModeContext.Provider>
  );
}

export function usePortalMode() {
  const ctx = useContext(PortalModeContext);
  if (!ctx) {
    throw new Error("usePortalMode must be used within PortalModeProvider");
  }
  return ctx;
}
