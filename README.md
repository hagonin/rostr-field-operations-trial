# Rostr — Field-Staff Rostering for D2C

A rostering tool for D2C's field-staff campaigns, covering the full **create → invite → confirm → coverage** loop for in-store sampling and activation work.

**Live demo:** https://rostr-field-operations-trial.vercel.app
## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Supabase** (Postgres) via `@supabase/ssr`
- **Tailwind CSS v4** · **shadcn/ui** on Base UI
- `react-hook-form` · `zod` · `date-fns` · `sonner` · `lucide-react`
- Hosting: **Vercel** · Testing: **Vitest**



---

## Getting started

### Prerequisites

- **Node.js 20+** and npm
- A free **[Supabase](https://supabase.com)** project (provides the Postgres database)

> This project targets **Next.js 16** (App Router, React Server Components + Server Actions).

### 1. Clone & install

```bash
git clone https://github.com/hagonin/rostr-field-operations.git
cd rostr-field-operations/rostr   # the Next.js app lives in the rostr/ subdirectory
npm install
```

### 2. Provision the database

1. Create a project at [supabase.com](https://supabase.com).
2. In the project's **SQL Editor**, run **`supabase/schema.sql`** (creates the tables + row-level-security policies).
3. Run **`supabase/seed.sql`** (idempotent — truncates then re-inserts demo data; the destructive-operation warning is expected).
4. From **Project Settings → API**, copy the values for the next step.

### 3. Configure environment

```bash
cp .env.example .env.local   # then fill in your Supabase values
```

| Variable | Scope | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | client + server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client + server | Anon key — `SELECT`-only under current RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | Service-role key for writes — **never expose to the browser** |
| `ADMIN_PASSCODE` | server only | Shared passcode for the admin gate (demo only) |

> The service-role key bypasses row-level security. Keep it server-side; it must never appear in client bundles or any `NEXT_PUBLIC_*` variable.

### 4. Run

```bash
npm run dev      # http://localhost:3000
```

The landing page is a role-picker: enter as **Admin / Operations** or as a **field-staff member**.

### Scripts

```bash
npm run dev      # start the dev server
npm test         # Vitest unit suite (39 tests)
npm run build    # TypeScript compile + production build
npm run start    # serve the production build
```

**Reset demo data:** re-run `supabase/seed.sql` in the Supabase SQL Editor.

---
