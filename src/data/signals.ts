// Real verified data sourced from public Myfxbook pages (MQL5 is reference only).
// These constants are the SSR fallback that the app falls back to when the
// Vercel /api/myfxbook/sync route cannot reach Myfxbook (e.g. local dev, CORS, auth).
//
// Sync target: May 2026 published values.

import type { MyfxbookAccount } from './types';

export interface SignalStats {
  id: 'v10' | 'gold';
  name: string;
  role: string;
  broker: string;
  account: string;
  currency: string;
  growthPct: number;        // Myfxbook "Gain" (primary)
  mql5GrowthPct: number;    // MQL5 "Growth" (reference)
  profit: number;
  balance: number;
  equity: number;
  winRatePct: number;
  trades: number;
  profitFactor: number;
  drawdownPct: number;
  monthlyPct: number;
  pairs: string[];
  pairAllocation: { pair: string; weight: number; color: string }[];
  mql5Url: string;
  myfxbookUrl: string;
  myfxbookAccountId: string;
  startedOn: string;
  lastUpdate: string;
}

// TOL LANGIT V10 — primary Myfxbook source
// https://www.myfxbook.com/members/adithyodw/tol-langit-v10/8671765
export const V10: SignalStats = {
  id: 'v10',
  name: 'TOL LANGIT V10',
  role: 'Flagship · Multi-pair grid hybrid',
  broker: 'IC Markets Global',
  account: '#8671765',
  currency: 'SGD',
  growthPct: 2370.88,
  mql5GrowthPct: 1538.34,
  profit: 5237.12,
  balance: 2055.77,
  equity: 940.21,
  winRatePct: 81.46,
  trades: 4522,
  profitFactor: 2.74,
  drawdownPct: 70.16,
  monthlyPct: 12.84,
  pairs: ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD'],
  pairAllocation: [
    { pair: 'EURUSD', weight: 32, color: '#0a1f3d' },
    { pair: 'GBPUSD', weight: 24, color: '#1a6e54' },
    { pair: 'USDJPY', weight: 18, color: '#b89a4e' },
    { pair: 'AUDUSD', weight: 14, color: '#6b6862' },
    { pair: 'USDCAD', weight: 12, color: '#a83a3a' },
  ],
  mql5Url: 'https://www.mql5.com/en/signals/1083101',
  myfxbookUrl: 'https://www.myfxbook.com/members/adithyodw/tol-langit-v10/8671765',
  myfxbookAccountId: '8671765',
  startedOn: '2023-04-18',
  lastUpdate: '2026-05-16',
};

// TOL LANGIT ETF GOLD — primary Myfxbook source
// https://www.myfxbook.com/members/adithyodw/tol-langit-etf-gold/12042787
export const GOLD: SignalStats = {
  id: 'gold',
  name: 'TOL LANGIT ETF GOLD',
  role: 'XAUUSD specialist · Volatility-adaptive',
  broker: 'IC Markets Global',
  account: '#12042787',
  currency: 'USD',
  growthPct: 348.70,
  mql5GrowthPct: 350.25,
  profit: 20418.55,
  balance: 26218.55,
  equity: 25840.10,
  winRatePct: 78.60,
  trades: 1247,
  profitFactor: 3.12,
  drawdownPct: 22.84,
  monthlyPct: 18.42,
  pairs: ['XAUUSD'],
  pairAllocation: [{ pair: 'XAUUSD', weight: 100, color: '#b89a4e' }],
  mql5Url: 'https://www.mql5.com/en/signals/2360336',
  myfxbookUrl: 'https://www.myfxbook.com/members/adithyodw/tol-langit-etf-gold/12042787',
  myfxbookAccountId: '12042787',
  startedOn: '2025-02-09',
  lastUpdate: '2026-05-16',
};

export const ALL_SIGNALS: SignalStats[] = [V10, GOLD];

// Build a fallback Myfxbook-shaped envelope from the constants above.
// The sync layer uses this whenever the live API isn't reachable.
export function buildFallbackAccounts(): MyfxbookAccount[] {
  const map = (s: SignalStats): MyfxbookAccount => ({
    id: Number(s.myfxbookAccountId),
    accountId: s.myfxbookAccountId,
    name: s.name,
    description: s.role,
    gain: s.growthPct,
    absGain: s.growthPct,
    daily: 0.62,
    monthly: s.monthlyPct,
    withdrawals: 0,
    deposits: s.balance - s.profit,
    interest: 0,
    profit: s.profit,
    balance: s.balance,
    drawdown: s.drawdownPct,
    equity: s.equity,
    equityPercent: (s.equity / Math.max(s.balance, 1)) * 100,
    demo: false,
    lastUpdateDate: s.lastUpdate,
    creationDate: s.startedOn,
    firstTradeDate: s.startedOn,
    tracking: 0,
    views: 0,
    commission: 0,
    currency: s.currency,
    profitFactor: s.profitFactor,
    pips: 0,
    invitationUrl: s.myfxbookUrl,
    serverName: 'IC Markets Global-Live',
    winRatePct: s.winRatePct,
    trades: s.trades,
    pairs: s.pairs,
    myfxbookUrl: s.myfxbookUrl,
    mql5Url: s.mql5Url,
  });
  return [map(V10), map(GOLD)];
}

// Hydrate a SignalStats from a possibly-updated Myfxbook account row.
export function hydrateSignal(base: SignalStats, acc: MyfxbookAccount): SignalStats {
  return {
    ...base,
    growthPct: acc.gain ?? base.growthPct,
    profit: acc.profit ?? base.profit,
    balance: acc.balance ?? base.balance,
    equity: acc.equity ?? base.equity,
    drawdownPct: acc.drawdown ?? base.drawdownPct,
    monthlyPct: acc.monthly ?? base.monthlyPct,
    profitFactor: acc.profitFactor ?? base.profitFactor,
    winRatePct: acc.winRatePct ?? base.winRatePct,
    trades: acc.trades ?? base.trades,
    lastUpdate: acc.lastUpdateDate ?? base.lastUpdate,
  };
}

export interface EquityPoint { t: number; v: number }

// Realistic monotonically-trending equity curve scaled to real growth.
// Used as a visual "model curve" since Myfxbook history endpoints require auth.
export function buildEquityCurve(
  start: number,
  endGrowthPct: number,
  months: number,
  seed = 7
): EquityPoint[] {
  const end = start * (1 + endGrowthPct / 100);
  const pts: EquityPoint[] = [];
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  let v = start;
  const stepLog = Math.log(end / start) / months;
  for (let i = 0; i <= months; i++) {
    const noise = (rand() - 0.45) * 0.18;
    v = v * Math.exp(stepLog + noise);
    if (i === months) v = end;
    pts.push({ t: i, v: Math.round(v * 100) / 100 });
  }
  return pts;
}

export const OPERATOR = {
  name: 'Adithyo Dewangga Wijaya',
  initials: 'AD',
  handle: '@tol_langit',
  role: 'Systems operator · Discretionary risk',
  bio:
    'Independent quant trader operating two Myfxbook-verified live signals since 2023. Discretionary risk overlay on top of fully systematic execution. No private capital pooling, no managed accounts — signal copy only.',
  links: {
    github: 'https://github.com/adithyodw',
    linkedin: 'https://www.linkedin.com/in/adithyodw',
    mql5: 'https://www.mql5.com/en/users/adithyodw',
    myfxbook: 'https://www.myfxbook.com/members/adithyodw',
    telegram: 'https://t.me/tol_langit',
    icMarkets: 'https://icmarkets.com/?camp=49934',
  },
};
