import { DEMO_OWNERS, DEMO_RENTERS } from "@/lib/auth/seed-users";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "active"
  | "returned"
  | "declined";

export type PortalBooking = {
  id: string;
  equipmentId: string;
  equipmentTitle: string;
  ownerId: string;
  ownerName: string;
  renterId: string;
  renterName: string;
  renterPhone: string;
  startDate: string;
  returnDate: string;
  ratePerDay: number;
  totalKes: number;
  status: BookingStatus;
  locationLabel: string;
  createdAt: string;
};

export type PortalNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  href?: string;
};

const william = DEMO_OWNERS[0];
const kiplagat = DEMO_OWNERS[1];
const rotich = DEMO_OWNERS[2];
const gladys = DEMO_OWNERS[3];

const whimsey = DEMO_RENTERS[0];
const charles = DEMO_RENTERS[1];
const reuben = DEMO_RENTERS[2];
const owen = DEMO_RENTERS[3];

/** Starter bookings between real demo renters and owners (seeded once). */
export const SEED_NETWORK_BOOKINGS: PortalBooking[] = [
  {
    id: "bk-seed-001",
    equipmentId: "eq-solar-pump-turbo",
    equipmentTitle: "Solar Irrigation Pump",
    ownerId: william.id,
    ownerName: william.fullName,
    renterId: whimsey.id,
    renterName: whimsey.fullName,
    renterPhone: whimsey.phone,
    startDate: "2026-07-30",
    returnDate: "2026-08-02",
    ratePerDay: 500,
    totalKes: 1500,
    status: "pending",
    locationLabel: "Turbo, Uasin Gishu",
    createdAt: "2026-07-29T08:00:00.000Z",
  },
  {
    id: "bk-seed-002",
    equipmentId: "eq-soil-kit-moiben",
    equipmentTitle: "Soil Testing Kit",
    ownerId: kiplagat.id,
    ownerName: kiplagat.fullName,
    renterId: charles.id,
    renterName: charles.fullName,
    renterPhone: charles.phone,
    startDate: "2026-07-20",
    returnDate: "2026-07-22",
    ratePerDay: 250,
    totalKes: 500,
    status: "returned",
    locationLabel: "Moiben, Uasin Gishu",
    createdAt: "2026-07-19T10:00:00.000Z",
  },
  {
    id: "bk-seed-003",
    equipmentId: "eq-tiller-kapseret",
    equipmentTitle: "Conservation Tiller",
    ownerId: rotich.id,
    ownerName: rotich.fullName,
    renterId: reuben.id,
    renterName: reuben.fullName,
    renterPhone: reuben.phone,
    startDate: "2026-07-28",
    returnDate: "2026-08-01",
    ratePerDay: 800,
    totalKes: 3200,
    status: "active",
    locationLabel: "Kapseret, Uasin Gishu",
    createdAt: "2026-07-27T12:00:00.000Z",
  },
  {
    id: "bk-seed-004",
    equipmentId: "eq-drip-kesses",
    equipmentTitle: "Drip Irrigation Starter Kit",
    ownerId: gladys.id,
    ownerName: gladys.fullName,
    renterId: owen.id,
    renterName: owen.fullName,
    renterPhone: owen.phone,
    startDate: "2026-07-25",
    returnDate: "2026-07-29",
    ratePerDay: 350,
    totalKes: 1400,
    status: "confirmed",
    locationLabel: "Kesses, Uasin Gishu",
    createdAt: "2026-07-24T09:30:00.000Z",
  },
];

/** Income rows derived from completed rentals among the demo network. */
export const SEED_INCOME_ROWS = [
  {
    id: "inc-1",
    tool: "Soil Testing Kit",
    renter: charles.fullName,
    ownerId: kiplagat.id,
    days: 2,
    amount: 500,
    date: "2026-07-22",
  },
  {
    id: "inc-2",
    tool: "Drip Irrigation Starter Kit",
    renter: owen.fullName,
    ownerId: gladys.id,
    days: 4,
    amount: 1400,
    date: "2026-07-12",
  },
  {
    id: "inc-3",
    tool: "Solar Irrigation Pump",
    renter: reuben.fullName,
    ownerId: william.id,
    days: 3,
    amount: 1500,
    date: "2026-07-05",
  },
];

/** @deprecated Prefer live bookings from bookings-store. Kept for type imports. */
export const SEED_OWNER_BOOKINGS = SEED_NETWORK_BOOKINGS;
