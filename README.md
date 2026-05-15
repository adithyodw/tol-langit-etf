# TOL LANGIT ETF

> Institutional iOS-native live signal preview for the **TOL LANGIT ETF** — composite of `TOL LANGIT V10` and `TOL LANGIT ETF GOLD`. All metrics are pulled from **Myfxbook**.

Live: _deploy URL coming via Vercel_
Repo: [github.com/adithyodw/Tol-Langit-ETF](https://github.com/adithyodw/Tol-Langit-ETF)

---

## Stack

- **Vite 5** + **React 18** + **TypeScript** (strict)
- **Recharts** for performance curves
- **Vercel Serverless Functions** for the Myfxbook sync proxy
- Custom design system in `src/styles.css` (warm-paper + navy + gold)

## Screens

| Screen | File |
|---|---|
| Dashboard | `src/screens/Dashboard.tsx` |
| Signals | `src/screens/Signals.tsx` |
| Signal Detail | `src/screens/SignalDetail.tsx` |
| Systems / Allocation | `src/screens/Systems.tsx` |
| Activity | `src/screens/Activity.tsx` |
| Profile | `src/screens/Profile.tsx` |

The shell (iOS device frame + Dynamic Island + bottom nav) is in `src/components/`. On real mobile devices the shell drops away and the app goes fullscreen.

## Data flow

```
┌─────────────┐     GET /api/myfxbook/sync     ┌─────────────────────┐
│  React app  │ ─────────────────────────────► │  Vercel serverless  │
│  useSync()  │                                │  api/myfxbook/sync  │
└──────┬──────┘ ◄────── SyncEnvelope ─────────  └──────────┬──────────┘
       │                                                  │
       │ on failure → static fallback               login + get-my-accounts
       ▼                                                  ▼
   src/data/signals.ts                          www.myfxbook.com/api
```

- The browser **never** touches `myfxbook.com` directly (avoids CORS + keeps creds server-side).
- The serverless route in `api/myfxbook/sync.ts` logs in with `MYFXBOOK_EMAIL` / `MYFXBOOK_PASSWORD`, lists tracked accounts (`8671765`, `12042787`), and returns a normalized envelope.
- The client falls back to the verified May 2026 snapshot in `src/data/signals.ts` whenever the API is unreachable. The UI clearly indicates `LIVE · MYFXBOOK API` vs `VERIFIED · MYFXBOOK` in the header and the **Sync Status** banner on the dashboard.
- Auto-resync runs every 24 h; a **Sync Now** button forces an immediate refresh.

## Local development

```bash
npm install
npm run dev          # vite dev server on http://localhost:5173
```

For end-to-end testing including the serverless route:

```bash
npm install -g vercel
vercel dev
```

Add your Myfxbook credentials to `.env.local`:

```env
MYFXBOOK_EMAIL=you@example.com
MYFXBOOK_PASSWORD=••••••
```

Without them, the route returns the static fallback envelope (the UI still works perfectly).

## Build

```bash
npm run typecheck    # strict TypeScript check
npm run build        # outputs dist/
npm run preview      # serve the production build locally
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repo in [vercel.com/new](https://vercel.com/new) — it auto-detects Vite.
3. Add `MYFXBOOK_EMAIL` and `MYFXBOOK_PASSWORD` in **Settings → Environment Variables** (Production + Preview).
4. Hit **Deploy**.

The `vercel.json` already configures:
- `framework: vite`
- SPA rewrites (so deep links don't 404)
- Long-cache headers for hashed assets
- `s-maxage=900` + `stale-while-revalidate=86400` on the Myfxbook proxy (edge caches the response for 15 min and serves stale up to 24 h while revalidating)

## Verified accounts

| Signal | Myfxbook | MQL5 |
|---|---|---|
| **TOL LANGIT V10** | [myfxbook.com/…/tol-langit-v10/8671765](https://www.myfxbook.com/members/adithyodw/tol-langit-v10/8671765) | [mql5.com/en/signals/1083101](https://www.mql5.com/en/signals/1083101) |
| **TOL LANGIT ETF GOLD** | [myfxbook.com/…/tol-langit-etf-gold/12042787](https://www.myfxbook.com/members/adithyodw/tol-langit-etf-gold/12042787) | [mql5.com/en/signals/2360336](https://www.mql5.com/en/signals/2360336) |

Recommended execution venue: [IC Markets](https://icmarkets.com/?camp=49934) (raw spreads).

## Risk disclosure

Trading leveraged FX and CFDs carries substantial risk of loss. Past performance shown on Myfxbook and MQL5 is not indicative of future results. TOL LANGIT V10 has historically experienced equity drawdowns of 70%+; size positions accordingly. The operator does not custody client funds — signal copy execution remains the subscriber's responsibility.

## License

MIT © 2026 Adithyo Dewangga Wijaya
