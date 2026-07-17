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
  ownerName: string;
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

export const SEED_OWNER_BOOKINGS: PortalBooking[] = [
  {
    id: "bk-001",
    equipmentId: "eq-solar-pump-turbo",
    equipmentTitle: "Solar Irrigation Pump",
    ownerName: "You",
    renterName: "Grace Jeptoo",
    renterPhone: "0712 445 221",
    startDate: "2026-07-18",
    returnDate: "2026-07-21",
    ratePerDay: 500,
    totalKes: 1500,
    status: "pending",
    locationLabel: "Turbo, Uasin Gishu",
    createdAt: "2026-07-17T08:00:00.000Z",
  },
  {
    id: "bk-002",
    equipmentId: "eq-soil-kit-moiben",
    equipmentTitle: "Soil Testing Kit",
    ownerName: "You",
    renterName: "Peter Rono",
    renterPhone: "0708 112 334",
    startDate: "2026-07-10",
    returnDate: "2026-07-12",
    ratePerDay: 250,
    totalKes: 500,
    status: "returned",
    locationLabel: "Moiben, Uasin Gishu",
    createdAt: "2026-07-09T10:00:00.000Z",
  },
  {
    id: "bk-003",
    equipmentId: "eq-tiller-kapseret",
    equipmentTitle: "Conservation Tiller",
    ownerName: "You",
    renterName: "Mary Chebet",
    renterPhone: "0741 998 120",
    startDate: "2026-07-15",
    returnDate: "2026-07-19",
    ratePerDay: 800,
    totalKes: 3200,
    status: "active",
    locationLabel: "Kapseret, Uasin Gishu",
    createdAt: "2026-07-14T12:00:00.000Z",
  },
];

export const SEED_INCOME_ROWS = [
  {
    id: "inc-1",
    tool: "Soil Testing Kit",
    renter: "Peter Rono",
    days: 2,
    amount: 500,
    date: "2026-07-12",
  },
  {
    id: "inc-2",
    tool: "Drip Irrigation Starter Kit",
    renter: "Samuel Kiptoo",
    days: 4,
    amount: 1400,
    date: "2026-07-05",
  },
  {
    id: "inc-3",
    tool: "Solar Irrigation Pump",
    renter: "Helen Wanjiku",
    days: 3,
    amount: 1500,
    date: "2026-06-28",
  },
];

export function seedNotificationsFor(role: string): PortalNotification[] {
  if (role === "admin") {
    return [
      {
        id: "n-a1",
        title: "12 new users this week",
        body: "Uasin Gishu signups are rising as more farmers join the portal.",
        time: "2h ago",
        read: false,
        href: "/portal/admin/users",
      },
      {
        id: "n-a2",
        title: "3 listings need review",
        body: "Check photos and rates before featuring them on Find tools.",
        time: "Yesterday",
        read: false,
        href: "/portal/admin/listings",
      },
    ];
  }

  if (role === "owner" || role === "both") {
    return [
      {
        id: "n-o1",
        title: "New rental request",
        body: "Grace Jeptoo wants your Solar Irrigation Pump (18–21 Jul).",
        time: "35m ago",
        read: false,
        href: "/portal/rentals",
      },
      {
        id: "n-o2",
        title: "Return due soon",
        body: "Mary Chebet should return the Conservation Tiller by 19 Jul.",
        time: "Yesterday",
        read: true,
        href: "/portal/rentals",
      },
      {
        id: "n-o3",
        title: "Income recorded",
        body: "KES 500 added from Soil Testing Kit rental.",
        time: "3 days ago",
        read: true,
        href: "/portal/income",
      },
    ];
  }

  return [
    {
      id: "n-r1",
      title: "Booking confirmed",
      body: "Your Soil Testing Kit request was accepted. Open My bookings to track pickup.",
      time: "1h ago",
      read: false,
      href: "/portal/bookings",
    },
    {
      id: "n-r2",
      title: "New tool near you",
      body: "A Solar Irrigation Pump is available 8.2 km away in Turbo.",
      time: "Yesterday",
      read: false,
      href: "/portal/find",
    },
    {
      id: "n-r3",
      title: "Return reminder",
      body: "Remember to return rented tools on the agreed date.",
      time: "4 days ago",
      read: true,
      href: "/portal/bookings",
    },
  ];
}
