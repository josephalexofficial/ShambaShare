# ShambaShare

Climate-smart farm equipment sharing for resilient communities — discover nearby tools, connect by SMS, pay on delivery.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase (Auth, Postgres, Storage) — schema in `supabase/schema.sql`
- Africa's Talking SMS (to be wired)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` to `.env.local` and fill in Supabase + Africa's Talking keys when ready.

## Current status

- Marketing pages: Home, About, How it works, Impact, Contact
- Product shell: Browse, Equipment detail, List, Auth, Dashboard
- Seed listings for Eldoret-area demo UI
- Supabase schema prepared (not connected yet)
