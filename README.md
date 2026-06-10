# AP Vision Care — Frontend (Next.js)

Frontend for the **Andhra Pradesh Digital Vision Care & Public Health Intelligence Platform** (Government of Andhra Pradesh).

This is the **Next.js 14 App Router** web application described in Section 5 of the deployment
spec. It is built as a **standalone, production-ready frontend running entirely on static
(mocked) data** — all databases, microservices and APIs are assumed to exist. There are no
network calls; every screen is populated from typed fixtures in `lib/data/`.

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + custom shadcn-style UI primitives |
| Charts | Recharts |
| Maps | React-Leaflet (district / hotspot heatmaps) |
| Forms | React Hook Form + Zod (multi-step EMR) |
| Client state | Zustand (demo session) |
| Icons | lucide-react |
| Auth (demo) | Role cookie + route-guard middleware (mirrors the Keycloak/next-auth pattern) |

## Getting started

```bash
npm install
npm run dev        # http://localhost:3100
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build (port 3100)
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```

## Demo login

Open `/login`, pick a role and continue — any OTP works (a demo value is pre-filled).
The selected role is stored in the `apvc-role` cookie; `middleware.ts` guards every
`/portal/*` route and redirects to `/unauthorized` if the role doesn't match the portal.

| Role | Portal home |
|---|---|
| Super Admin (SPMU) | `/portal/super-admin/dashboard` |
| Nodal Officer (District) | `/portal/nodal-officer/dashboard` |
| Screening Team | `/portal/screening-team/dashboard` |
| Patient / Citizen | `/portal/patient/dashboard` |

## The four portals

- **Super Admin** — statewide dashboard, district performance + burden map, user &
  vendor management, all camps, AI insights (hotspots, demand forecast, referral triage),
  government reports, audit log, settings.
- **Nodal Officer** — district dashboard, screening teams, camp scheduling, the
  **prescription approval queue with EMR viewer**, referral verification, spectacle SLA
  tracking, local vendor coordination.
- **Screening Team** — today's camp dashboard, patient registration (ABHA / mobile / QR
  scan-and-share), the **multi-step EMR form** (symptoms → vision → refraction → fundus →
  review) with offline draft auto-save and a live outcome **decision engine**, today's
  patient list, and a WebRTC teleconsult room.
- **Patient** — personal dashboard with ABDM care timeline, prescriptions, spectacle order
  tracking, referrals, and teleconsult booking.

## Project structure

```
app/
  page.tsx                 # public landing
  login/ unauthorized/     # demo auth
  portal/<role>/...        # role layouts + pages
components/
  ui/                      # button, card, table, tabs, … primitives
  layout/                  # portal shell (sidebar + topbar)
  shared/                  # page header, stat card, status badge, timelines, maps view
  charts/                  # Recharts wrappers
  maps/                    # React-Leaflet map (SSR-safe dynamic import)
  emr/                     # EMR multi-step form + read-only summary
lib/
  types.ts                 # domain types
  data/                    # all static fixtures
  emr-schema.ts            # Zod schema + outcome decision engine
  auth.ts nav.ts utils.ts  # roles, navigation, helpers
middleware.ts              # role-based route protection
```

## Notes

- Replacing the mock data with the real backend is a matter of swapping the `lib/data/*`
  imports for typed API-client calls (e.g. TanStack Query) — the component layer already
  consumes the same `lib/types.ts` contracts the services expose.
- The decision engine in `lib/emr-schema.ts` mirrors the screening-service business logic
  so the front end can preview outcomes before submission.
```
