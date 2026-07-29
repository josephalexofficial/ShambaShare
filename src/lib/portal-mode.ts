/**
 * Active portal mode for members whose role is "both".
 *
 * A "both" member can act as a Renter or an Owner, but never both at once in the
 * UI. They choose a side at login, and the choice is cleared on every sign-in /
 * sign-out so the prompt appears fresh each session. They can also switch sides
 * anytime from the sidebar.
 */
export type PortalMode = "renter" | "owner";

const KEY = "shambashare_portal_mode_v1";

type ModeMap = Record<string, PortalMode>;

function readAll(): ModeMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ModeMap;
  } catch {
    return {};
  }
}

function writeAll(map: ModeMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(map));
}

export function readPortalMode(userId: string): PortalMode | null {
  return readAll()[userId] ?? null;
}

export function writePortalMode(userId: string, mode: PortalMode) {
  const map = readAll();
  map[userId] = mode;
  writeAll(map);
}

export function clearPortalMode(userId: string) {
  const map = readAll();
  if (userId in map) {
    delete map[userId];
    writeAll(map);
  }
}
