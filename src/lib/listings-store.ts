import type { EquipmentCategory } from "@/lib/constants";

export type OwnerListing = {
  id: string;
  title: string;
  category: EquipmentCategory;
  description: string;
  ratePerDay: number;
  locationLabel: string;
  locationLat: number;
  locationLng: number;
  imageUrl: string;
  ownerName: string;
  ownerId: string;
  isAvailable: boolean;
  createdAt: string;
};

const KEY = "shambashare_owner_listings_v1";

export function readOwnerListings(): OwnerListing[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as OwnerListing[];
  } catch {
    return [];
  }
}

export function writeOwnerListings(listings: OwnerListing[]) {
  window.localStorage.setItem(KEY, JSON.stringify(listings));
}

export function readOwnerListingsForUser(ownerId: string): OwnerListing[] {
  return readOwnerListings()
    .filter((item) => item.ownerId === ownerId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export function addOwnerListing(
  listing: Omit<OwnerListing, "id" | "createdAt" | "isAvailable"> & {
    isAvailable?: boolean;
  },
) {
  const next: OwnerListing = {
    ...listing,
    id: `own-${crypto.randomUUID()}`,
    isAvailable: listing.isAvailable ?? true,
    createdAt: new Date().toISOString(),
  };
  writeOwnerListings([next, ...readOwnerListings()]);
  return next;
}

export function toggleOwnerListingAvailability(id: string, ownerId: string) {
  const next = readOwnerListings().map((item) =>
    item.id === id && item.ownerId === ownerId
      ? { ...item, isAvailable: !item.isAvailable }
      : item,
  );
  writeOwnerListings(next);
  return next.filter((item) => item.ownerId === ownerId);
}

/** Admin moderation: pause/unpause any owner listing. */
export function adminToggleListingAvailability(id: string) {
  const next = readOwnerListings().map((item) =>
    item.id === id ? { ...item, isAvailable: !item.isAvailable } : item,
  );
  writeOwnerListings(next);
  return next;
}

/** Admin moderation: remove an owner-created listing. */
export function adminRemoveListing(id: string) {
  const next = readOwnerListings().filter((item) => item.id !== id);
  writeOwnerListings(next);
  return next;
}
