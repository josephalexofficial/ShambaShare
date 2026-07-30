# ShambaShare

**Climate-smart farm tools, closer than you think.**

ShambaShare is a peer-to-peer marketplace that helps farmers in Eldoret and Uasin Gishu **find, request, and share idle climate-smart equipment** — solar pumps, soil kits, tillers, and more — with clear booking dates and pay on delivery.

Built as a portal-first web product: explore publicly, then manage rentals inside a role-based workspace after you join.

---

## Features

### Public site
- Marketing home with a clear call to action
- **Find tools** — browse nearby listings sorted by distance
- Equipment detail pages with **Request to rent**
- How it works, Impact, About, and Contact
- **Join** and **Sign in** with email, password, and phone

### Member portal (`/portal`)
Role-aware workspace after login:

| Role | What you get |
|------|----------------|
| **Renter** | Find tools, book with dates, track bookings, notifications, settings |
| **Owner** | Listings, rental requests, income ledger, notifications, settings |
| **Both** | Full renter + owner modules |
| **Admin** | Platform overview, users, listings, impact *(operator-assigned only)* |

Also included:
- Mobile slide-in portal sidebar
- Notifications with mark-as-read / mark-all-as-read
- Settings with self-service roles (**Renter / Owner / Both** only — Admin cannot be self-selected)
- Local-first auth so demo login works even when Supabase email confirmation is enabled

---

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **Supabase** (Auth + Postgres schema in `supabase/schema.sql`)
- **Lucide React** icons

---

## Getting started

### Prerequisites
- Node.js 20+ recommended
- npm

### Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

---

## Environment

1. Copy the example env file:

```bash
cp .env.example .env.local
```

2. Fill in values as needed:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

Supabase is optional for local demos. Without it, accounts are stored in the browser (localStorage) so join → sign out → sign in still works on the same device.

To use Supabase fully (including **hosted** Join → Sign in on another phone/browser):
1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL editor
3. Add the project URL, anon key, and **service role** key to `.env.local` and Vercel
4. In Supabase → Authentication → Providers → Email, turn **Confirm email** off for demos (or keep it on — the service role register API confirms users automatically)
5. Restart `npm run dev` / redeploy

> Never commit `.env.local`. It is gitignored.

---

## Project structure

```text
src/
  app/                 # Routes (marketing, auth, join, portal)
  components/          # UI, layout, portal shell, tools cards
  lib/                 # Auth, bookings, seeds, constants, Supabase client
supabase/
  schema.sql           # Profiles, equipment, rentals, RLS
public/                # Static assets & favicon
```

Key routes:
- `/` — Home  
- `/browse` — Find tools (public)  
- `/join` · `/auth` — Create account / sign in  
- `/portal/overview` — Workspace after login  

---

## Demo notes

- Seed equipment listings are centered around **Eldoret / Uasin Gishu**
- Demo network password for seeded owners/renters: `Alex@123` (e.g. `alexjoseph@gmail.com` renter, `josephalex@gmail.com` owner)
- Bookings and notification read-state persist in the browser for demos
- After joining, you land in the **portal**, not the marketing site
- Hosted cross-device login needs `SUPABASE_SERVICE_ROLE_KEY` on Vercel so Join creates confirmed Auth users

---

## Roadmap ideas

- Persist listings and bookings fully in Supabase
- Owner listing create/edit with photos (Storage)
- Stronger availability calendar and conflict checks
- Optional SMS / WhatsApp pickup reminders
- Impact metrics from live rental data

---

## Repository

[github.com/josephalexofficial/ShambaShare](https://github.com/josephalexofficial/ShambaShare)

---

## License

Private / project use unless otherwise stated by the repository owner.
