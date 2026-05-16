// Shared activity row shape used by both the Activity ledger and the
// Dashboard "Recent Activity" preview. The same row type renders whether
// the data comes from the live Myfxbook feed or from the verified
// snapshot fallback shipped in src/screens/Activity.tsx.

export type ActivitySide = 'BUY' | 'SELL';
export type ActivityStatus = 'closed' | 'open';

export interface ActivityRow {
  id: string;
  product: 'V10' | 'GOLD';
  date: string;        // YYYY-MM-DD
  time: string;        // HH:mm (UTC)
  side: ActivitySide;
  symbol: string;
  lots: number;
  price: number;
  pips: number;
  pnl: number;
  currency: string;
  status: ActivityStatus;
  sortKey: number;     // ms since epoch — newest first when sorted desc
  ticket?: string;
  sl?: number | null;
  tp?: number | null;
  swap?: number | null;
  commission?: number | null;
  openTime?: string;   // ISO — for closed rows
  closeTime?: string;  // ISO — for closed rows
}

// Verified snapshot fallback (May 2026 capture from the public Myfxbook
// trade widgets). Only used when the live /api/myfxbook/sync feed is
// unavailable so the screen never goes blank.
export const FALLBACK_ROWS: ActivityRow[] = [
  // Gold (USD) — recent AUDCAD activity from the public Open Trades widget
  { id: 'g1', product: 'GOLD', date: '2026-05-15', time: '12:15', side: 'BUY',  symbol: 'AUDCAD', lots: 0.21, price: 0.98283, pips:   9.2, pnl:   14.06, currency: 'USD', status: 'closed', sortKey: Date.UTC(2026, 4, 15, 12, 15) },
  { id: 'g2', product: 'GOLD', date: '2026-05-15', time: '09:25', side: 'SELL', symbol: 'AUDCAD', lots: 0.38, price: 0.98413, pips:   3.5, pnl:    9.68, currency: 'USD', status: 'closed', sortKey: Date.UTC(2026, 4, 15,  9, 25) },
  { id: 'g3', product: 'GOLD', date: '2026-05-15', time: '08:40', side: 'BUY',  symbol: 'AUDCAD', lots: 0.15, price: 0.98578, pips: -20.3, pnl:  -22.15, currency: 'USD', status: 'closed', sortKey: Date.UTC(2026, 4, 15,  8, 40) },
  { id: 'g4', product: 'GOLD', date: '2026-05-15', time: '04:50', side: 'BUY',  symbol: 'AUDCAD', lots: 0.15, price: 0.98846, pips: -47.1, pnl:  -51.40, currency: 'USD', status: 'closed', sortKey: Date.UTC(2026, 4, 15,  4, 50) },
  { id: 'g5', product: 'GOLD', date: '2026-05-14', time: '19:35', side: 'BUY',  symbol: 'AUDCAD', lots: 0.14, price: 0.99063, pips: -68.8, pnl:  -70.08, currency: 'USD', status: 'closed', sortKey: Date.UTC(2026, 4, 14, 19, 35) },
  { id: 'g6', product: 'GOLD', date: '2026-05-06', time: '03:45', side: 'SELL', symbol: 'AUDCAD', lots: 0.15, price: 0.98171, pips: -20.7, pnl:  -22.59, currency: 'USD', status: 'closed', sortKey: Date.UTC(2026, 4,  6,  3, 45) },
  { id: 'g7', product: 'GOLD', date: '2026-05-05', time: '18:05', side: 'SELL', symbol: 'AUDCAD', lots: 0.15, price: 0.97917, pips: -46.1, pnl:  -50.31, currency: 'USD', status: 'closed', sortKey: Date.UTC(2026, 4,  5, 18,  5) },
  // V10 (SGD) — recent long-running open positions on AUDNZD
  { id: 'v1', product: 'V10',  date: '2026-02-18', time: '17:43', side: 'SELL', symbol: 'AUDNZD', lots: 0.03, price: 1.18012, pips: -437.6, pnl:  -98.22, currency: 'SGD', status: 'open',   sortKey: Date.UTC(2026, 1, 18, 17, 43) },
  { id: 'v2', product: 'V10',  date: '2025-11-10', time: '12:30', side: 'SELL', symbol: 'AUDNZD', lots: 0.03, price: 1.15732, pips: -665.6, pnl: -149.40, currency: 'SGD', status: 'open',   sortKey: Date.UTC(2025, 10, 10, 12, 30) },
  { id: 'v3', product: 'V10',  date: '2025-09-30', time: '09:07', side: 'SELL', symbol: 'AUDNZD', lots: 0.03, price: 1.13841, pips: -854.7, pnl: -191.84, currency: 'SGD', status: 'open',   sortKey: Date.UTC(2025,  8, 30,  9,  7) },
  { id: 'v4', product: 'V10',  date: '2025-09-11', time: '12:36', side: 'SELL', symbol: 'AUDNZD', lots: 0.03, price: 1.11414, pips: -1097.4, pnl: -246.32, currency: 'SGD', status: 'open',   sortKey: Date.UTC(2025,  8, 11, 12, 36) },
  { id: 'v5', product: 'V10',  date: '2025-08-21', time: '12:33', side: 'SELL', symbol: 'AUDNZD', lots: 0.03, price: 1.10260, pips: -1212.8, pnl: -272.22, currency: 'SGD', status: 'open',   sortKey: Date.UTC(2025,  7, 21, 12, 33) },
];
