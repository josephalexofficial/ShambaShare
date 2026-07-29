import type { EquipmentCategory } from "./constants";
import { SEED_EQUIPMENT } from "./seed-equipment";
import { readOwnerListings } from "./listings-store";

/**
 * A single rentable tool in the marketplace, combining owner-created listings
 * with the demo seed catalogue. `ownerId` is the member id of the listing owner
 * (null for seed/demo tools) and is used to stop members renting their own tool.
 */
export type MarketplaceListing = {
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
  ownerId: string | null;
  isAvailable: boolean;
};

export function getMarketplaceListings(): MarketplaceListing[] {
  const owned: MarketplaceListing[] = readOwnerListings().map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    description: item.description,
    ratePerDay: item.ratePerDay,
    locationLabel: item.locationLabel,
    locationLat: item.locationLat,
    locationLng: item.locationLng,
    imageUrl: item.imageUrl,
    ownerName: item.ownerName,
    ownerId: item.ownerId,
    isAvailable: item.isAvailable,
  }));

  const seed: MarketplaceListing[] = SEED_EQUIPMENT.map((item) => ({
    ...item,
    ownerId: item.ownerId,
  }));

  // Owner posts first so freshly listed tools surface quickly for renters.
  return [...owned, ...seed];
}

export function getMarketplaceListingById(id: string): MarketplaceListing | null {
  return getMarketplaceListings().find((item) => item.id === id) ?? null;
}

/** True when the listing belongs to the given member (their own tool). */
export function isOwnListing(
  listing: Pick<MarketplaceListing, "ownerId">,
  userId: string | null | undefined,
): boolean {
  return Boolean(userId && listing.ownerId && listing.ownerId === userId);
}
