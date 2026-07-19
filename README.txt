ARK Chronicles Investor Update

Replace these files:
1. app/dashboard/page.tsx
2. app/submit/page.tsx
3. app/investors/page.tsx

Optional SQL:
4. supabase/investor-module.sql
Run it only if the investors table is missing required columns.

This update adds investors to:
- User dashboard
- Submission page
- Public investor page

Your existing admin page and investor admin APIs can remain as they are.

Test order:
1. npm run dev
2. Open /submit and submit an Investor
3. Open /dashboard and confirm it appears as Pending
4. Open /admin and approve it
5. Open /investors and confirm it is public
