import type { EquipmentCategory } from "@/lib/constants";
import { getDemoUserByEmail } from "@/lib/auth/seed-users";

export type SeedEquipment = {
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
};

const william = getDemoUserByEmail("william@gmail.com")!;
const kiplagat = getDemoUserByEmail("kiplagat@gmail.com")!;
const rotich = getDemoUserByEmail("rotich@gmail.com")!;
const gladys = getDemoUserByEmail("gladys@gmail.com")!;
const alex = getDemoUserByEmail("josephalex@gmail.com")!;

/**
 * Catalogue tied to real demo owners so Find tools, bookings, and notifications
 * all speak the same names.
 */
export const SEED_EQUIPMENT: SeedEquipment[] = [
  {
    id: "eq-solar-pump-turbo",
    title: "Solar Irrigation Pump",
    category: "irrigation",
    description:
      "Portable solar-powered water pump ideal for smallholder plots during dry spells. Includes basic hose fittings.",
    ratePerDay: 500,
    locationLabel: "Turbo, Uasin Gishu",
    locationLat: 0.633,
    locationLng: 35.173,
    imageUrl:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    ownerName: william.fullName,
    ownerId: william.id,
    isAvailable: true,
  },
  {
    id: "eq-soil-kit-moiben",
    title: "Soil Testing Kit",
    category: "soil_testing",
    description:
      "Field kit for quick soil moisture and basic nutrient checks before fertilizer application.",
    ratePerDay: 250,
    locationLabel: "Moiben, Uasin Gishu",
    locationLat: 0.687,
    locationLng: 35.387,
    imageUrl:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80",
    ownerName: kiplagat.fullName,
    ownerId: kiplagat.id,
    isAvailable: true,
  },
  {
    id: "eq-tiller-kapseret",
    title: "Conservation Tiller",
    category: "tillage",
    description:
      "Light conservation tiller for preparing beds with less soil disturbance and better moisture retention.",
    ratePerDay: 800,
    locationLabel: "Kapseret, Uasin Gishu",
    locationLat: 0.463,
    locationLng: 35.244,
    imageUrl:
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1200&q=80",
    ownerName: rotich.fullName,
    ownerId: rotich.id,
    isAvailable: true,
  },
  {
    id: "eq-drip-kesses",
    title: "Drip Irrigation Starter Kit",
    category: "water",
    description:
      "Compact drip lines and fittings for a quarter-acre garden. Helps stretch scarce water through dry weeks.",
    ratePerDay: 350,
    locationLabel: "Kesses, Uasin Gishu",
    locationLat: 0.406,
    locationLng: 35.326,
    imageUrl:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80",
    ownerName: gladys.fullName,
    ownerId: gladys.id,
    isAvailable: true,
  },
  {
    id: "eq-moisture-soy",
    title: "Soil Moisture Meter",
    category: "soil_testing",
    description:
      "Handheld moisture meter for deciding when to irrigate — reduces guesswork and water waste.",
    ratePerDay: 150,
    locationLabel: "Soy, Uasin Gishu",
    locationLat: 0.687,
    locationLng: 35.18,
    imageUrl:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80",
    ownerName: kiplagat.fullName,
    ownerId: kiplagat.id,
    isAvailable: true,
  },
  {
    id: "eq-pump-ainabkoi",
    title: "Portable Water Pump",
    category: "irrigation",
    description:
      "Reliable portable pump for moving water from tanks or shallow sources to kitchen gardens and nurseries.",
    ratePerDay: 450,
    locationLabel: "Ainabkoi, Uasin Gishu",
    locationLat: 0.18,
    locationLng: 35.53,
    imageUrl:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80",
    ownerName: alex.fullName,
    ownerId: alex.id,
    isAvailable: true,
  },
];

/** Approx Eldoret town center for demo distance sorting */
export const ELDORET_CENTER = {
  lat: 0.5143,
  lng: 35.2698,
  label: "Eldoret Town",
};

export function getEquipmentById(id: string) {
  return SEED_EQUIPMENT.find((item) => item.id === id);
}

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const r = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return r * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
