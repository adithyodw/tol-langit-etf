// Verified live data from Myfxbook (fetched May 2026).
// Sources:
//   V10:  https://www.myfxbook.com/members/adithyodw/tol-langit-v10/8671765
//   Gold: https://www.myfxbook.com/members/adithyodw/tol-langit-etf-gold/12042787
//
// Only Myfxbook is treated as the source of truth. MQL5, SignalStart, and
// ZuluTrade are reference / copy-trade venues — execution and PnL are mirrored
// off the same broker account.

import type { MyfxbookAccount } from './types';

export interface CopyVenue {
  label: string;
  href: string;
  hint: string;
}

export interface SignalStats {
  id: 'v10' | 'gold';
  name: string;
  role: string;
  broker: string;
  brokerAccount: string;        // Real broker account number at IC Markets
  myfxbookAccountId: string;    // Myfxbook tracked account id
  platform: string;
  currency: string;
  growthPct: number;            // Myfxbook "Gain"
  absGainPct: number;           // Myfxbook "Abs. Gain"
  dailyPct: number;
  monthlyPct: number;
  drawdownPct: number;
  balance: number;
  equity: number;
  profit: number;
  trades: number;
  winRatePct: number;           // Combined longs+shorts win rate
  profitFactor: number;
  pairs: string[];
  pairAllocation: { pair: string; weight: number; color: string }[];
  mql5Url: string;
  myfxbookUrl: string;
  myfxbookStatementUrl: string;
  startedOn: string;            // ISO date — first verified track-record month
  trackRecordYears: number;     // Length of the verified live track record
  lastUpdate: string;
  copyVenues: CopyVenue[];      // Public copy-trade rails for this product
}

// TOL LANGIT V10 — Real (SGD), IC Markets, MT4, 1:500
export const V10: SignalStats = {
  id: 'v10',
  name: 'TOL LANGIT V10',
  role: 'Flagship · Multi-pair systematic',
  broker: 'IC Markets',
  brokerAccount: '270047263',
  myfxbookAccountId: '8671765',
  platform: 'MetaTrader 4',
  currency: 'SGD',
  growthPct: 2370.88,
  absGainPct: 119.80,
  dailyPct: 0.18,
  monthlyPct: 5.59,
  drawdownPct: 70.16,
  balance: 2055.77,
  equity: 946.74,
  profit: 5289.20,
  trades: 5053,
  winRatePct: 81,
  profitFactor: 1.97,
  pairs: ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'AUDNZD', 'EURGBP', 'NZDCAD'],
  pairAllocation: [
    { pair: 'EURUSD', weight: 24, color: '#0a1f3d' },
    { pair: 'GBPUSD', weight: 18, color: '#1a6e54' },
    { pair: 'USDJPY', weight: 14, color: '#b89a4e' },
    { pair: 'AUDUSD', weight: 12, color: '#6b6862' },
    { pair: 'USDCAD', weight: 10, color: '#a83a3a' },
    { pair: 'AUDNZD', weight: 9, color: '#7E6BAE' },
    { pair: 'EURGBP', weight: 7, color: '#5B8DBE' },
    { pair: 'NZDCAD', weight: 6, color: '#D97B7B' },
  ],
  mql5Url: 'https://www.mql5.com/en/signals/1083101',
  myfxbookUrl: 'https://www.myfxbook.com/members/adithyodw/tol-langit-v10/8671765',
  myfxbookStatementUrl: 'https://www.myfxbook.com/secure/statements/8671765/statement.html',
  startedOn: '2021-07-01',
  trackRecordYears: 5,
  lastUpdate: '2026-05-16',
  copyVenues: [
    {
      label: 'MQL5',
      hint: 'Signal subscription · MetaTrader',
      href: 'https://www.mql5.com/en/signals/1083101',
    },
    {
      label: 'SignalStart',
      hint: 'Auto-copy · IC Markets',
      href: 'https://icmarkets.signalstart.com/analysis/tol-langit-v10/232541',
    },
    {
      label: 'ZuluTrade',
      hint: 'Social · auto-copy',
      href: 'https://www.zulutrade.com/trader/417743/trading',
    },
  ],
};

// TOL LANGIT ETF GOLD — Real (USD), IC Markets, MT5, 1:500 — XAUUSD + AUDCAD
export const GOLD: SignalStats = {
  id: 'gold',
  name: 'TOL LANGIT ETF GOLD',
  role: 'XAUUSD + AUDCAD · Volatility-adaptive',
  broker: 'IC Markets',
  brokerAccount: '7948454',
  myfxbookAccountId: '12042787',
  platform: 'MetaTrader 5',
  currency: 'USD',
  growthPct: 364.77,
  absGainPct: 172.26,
  dailyPct: 1.85,
  monthlyPct: 72.65,
  drawdownPct: 42.06,
  balance: 25306.23,
  equity: 25113.44,
  profit: 20472.84,
  trades: 434,
  winRatePct: 78,
  profitFactor: 2.61,
  pairs: ['XAUUSD', 'AUDCAD'],
  pairAllocation: [
    { pair: 'XAUUSD', weight: 85, color: '#b89a4e' },
    { pair: 'AUDCAD', weight: 15, color: '#0a1f3d' },
  ],
  mql5Url: 'https://www.mql5.com/en/signals/2360336',
  myfxbookUrl: 'https://www.myfxbook.com/members/adithyodw/tol-langit-etf-gold/12042787',
  myfxbookStatementUrl: 'https://www.myfxbook.com/secure/statements/12042787/statement.html',
  startedOn: '2025-02-09',
  trackRecordYears: 1,
  lastUpdate: '2026-05-16',
  copyVenues: [
    {
      label: 'MQL5',
      hint: 'Signal subscription · MetaTrader',
      href: 'https://www.mql5.com/en/signals/2360336',
    },
    {
      label: 'SignalStart',
      hint: 'Auto-copy · IC Markets',
      href: 'https://icmarkets.signalstart.com/analysis/tol-langit-etf-gold/288423',
    },
  ],
};

export const ALL_SIGNALS: SignalStats[] = [V10, GOLD];

export function buildFallbackAccounts(): MyfxbookAccount[] {
  const map = (s: SignalStats): MyfxbookAccount => ({
    id: Number(s.myfxbookAccountId),
    accountId: s.myfxbookAccountId,
    name: s.name,
    description: s.role,
    gain: s.growthPct,
    absGain: s.absGainPct,
    daily: s.dailyPct,
    monthly: s.monthlyPct,
    withdrawals: 0,
    deposits: 0,
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
    serverName: s.broker,
    winRatePct: s.winRatePct,
    trades: s.trades,
    pairs: s.pairs,
    myfxbookUrl: s.myfxbookUrl,
    mql5Url: s.mql5Url,
  });
  return [map(V10), map(GOLD)];
}

export function hydrateSignal(base: SignalStats, acc: MyfxbookAccount): SignalStats {
  return {
    ...base,
    growthPct: acc.gain ?? base.growthPct,
    absGainPct: acc.absGain ?? base.absGainPct,
    dailyPct: acc.daily ?? base.dailyPct,
    monthlyPct: acc.monthly ?? base.monthlyPct,
    profit: acc.profit ?? base.profit,
    balance: acc.balance ?? base.balance,
    equity: acc.equity ?? base.equity,
    drawdownPct: acc.drawdown ?? base.drawdownPct,
    profitFactor: acc.profitFactor ?? base.profitFactor,
    winRatePct: acc.winRatePct ?? base.winRatePct,
    trades: acc.trades ?? base.trades,
    lastUpdate: acc.lastUpdateDate ?? base.lastUpdate,
  };
}

export interface EquityPoint { t: number; v: number }

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
  role: 'Principal · Systematic execution & risk',
  bio:
    'Independent systematic operator running two live, Myfxbook-verified trading accounts at IC Markets. ' +
    'V10 (SGD · MT4) — a multi-pair FX basket with a five-year live track record since July 2021. ' +
    'ETF Gold (USD · MT5) — XAUUSD with an AUDCAD overlay. ' +
    'No pooled capital, no managed accounts, no marketing track. Every fill is mirrored to a public statement, so investors audit the same numbers their copy-trade subscription will execute against.',
  links: {
    github: 'https://github.com/adithyodw',
    linkedin: 'https://www.linkedin.com/in/adithyodw',
    mql5: 'https://www.mql5.com/en/users/adithyodw',
    myfxbook: 'https://www.myfxbook.com/members/adithyodw',
    telegram: 'https://t.me/tol_langit',
    icMarkets: 'https://icmarkets.com/?camp=49934',
  },
};
