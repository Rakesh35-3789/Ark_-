# ARK — Working Platform Build

A fresh Next.js + Supabase innovation network built for real users and moderated public content.

## Implemented in this build

- Email/password signup, verification, login, logout, persistent sessions and password reset
- Public profiles with usernames, bios, city and roles
- Four real contribution types: stories, research papers, founder profiles and opportunities
- Image and PDF uploads through Supabase Storage
- Private pending content and contributor dashboard
- Public story feed, full-text-friendly search, article pages and responsive cards
- Research directory, founder directory and opportunity board
- Comments and story bookmarks
- User notifications after admin approval or rejection
- Protected admin moderation centre covering all four content types
- RLS-enabled schema, ownership policies, storage restrictions and indexes
- Responsive navigation, mobile layouts, error/loading/empty states and 404 page
- Production build tested successfully with Next.js 16

## Setup

1. Create a new Supabase project.
2. Run `supabase/schema.sql` in Supabase SQL Editor.
3. Copy `.env.example` to `.env.local` and add:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

4. Add these Supabase Auth redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/auth/reset-password`
   - `https://YOUR-DOMAIN/auth/callback`
   - `https://YOUR-DOMAIN/auth/reset-password`
5. Install and run:

```bash
npm install
npm run dev
```

## Create first admin

Sign up normally, then run:

```sql
update public.profiles
set role='admin', verified=true
where id=(select id from auth.users where email='YOUR_EMAIL');
```

## Deployment

Push this folder to GitHub, import it into Vercel and add the same three environment variables. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only and never commit `.env.local`.

## Important launch checks

Before inviting the public, test signup confirmation, password reset, all four submission forms, uploads, approval/rejection, comments, bookmarks and mobile navigation using the exact production domain.
