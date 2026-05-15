// Vercel Serverless Function — Myfxbook sync proxy.
//
// Endpoint:    GET /api/myfxbook/sync
// Behavior:    Logs into Myfxbook server-side with credentials from env, lists the
//              tracked accounts for the authenticated user, and returns a normalized
//              `SyncEnvelope`. Falls back to the static envelope when credentials are
//              missing or the upstream call fails (so the UI never breaks).
//
// Env required for live sync (configure in Vercel project settings):
//   MYFXBOOK_EMAIL
//   MYFXBOOK_PASSWORD
//
// Reference: https://www.myfxbook.com/api

import type { VercelRequest, VercelResponse } from '@vercel/node';

interface MyfxbookLoginResponse {
  error: boolean;
  message: string;
  session?: string;
}

interface MyfxbookAccountsResponse {
  error: boolean;
  message: string;
  accounts?: RawMyfxbookAccount[];
}

interface RawMyfxbookAccount {
  id: number;
  name: string;
  description: string;
  accountId: number;
  gain: number;
  absGain: number;
  daily: number;
  monthly: number;
  withdrawals: number;
  deposits: number;
  interest: number;
  profit: number;
  balance: number;
  drawdown: number;
  equity: number;
  equityPercent: number;
  demo: boolean;
  lastUpdateDate: string;
  creationDate: string;
  firstTradeDate: string;
  tracking: number;
  views: number;
  commission: number;
  currency: string;
  profitFactor: number;
  pips: number;
  invitationUrl: string;
  serverName: string;
}

const V10_ID = '8671765';
const GOLD_ID = '12042787';

const TRACKED_PAIRS: Record<string, string[]> = {
  [V10_ID]: ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD'],
  [GOLD_ID]: ['XAUUSD'],
};

const TRACKED_URLS: Record<string, { myfxbook: string; mql5: string }> = {
  [V10_ID]: {
    myfxbook: 'https://www.myfxbook.com/members/adithyodw/tol-langit-v10/8671765',
    mql5: 'https://www.mql5.com/en/signals/1083101',
  },
  [GOLD_ID]: {
    myfxbook: 'https://www.myfxbook.com/members/adithyodw/tol-langit-etf-gold/12042787',
    mql5: 'https://www.mql5.com/en/signals/2360336',
  },
};

// Verified May 2026 fallback values (kept in sync with src/data/signals.ts)
const FALLBACK = {
  v10: {
    winRatePct: 81.46,
    trades: 4522,
    gain: 2370.88,
    balance: 2055.77,
    equity: 940.21,
    profit: 5237.12,
    drawdown: 70.16,
    monthly: 12.84,
    profitFactor: 2.74,
    currency: 'SGD',
    lastUpdateDate: '2026-05-16',
    creationDate: '2023-04-18',
  },
  gold: {
    winRatePct: 78.60,
    trades: 1247,
    gain: 348.7,
    balance: 26218.55,
    equity: 25840.1,
    profit: 20418.55,
    drawdown: 22.84,
    monthly: 18.42,
    profitFactor: 3.12,
    currency: 'USD',
    lastUpdateDate: '2026-05-16',
    creationDate: '2025-02-09',
  },
};

function fallbackEnvelope(notice: string) {
  const accounts = [
    {
      id: Number(V10_ID),
      accountId: V10_ID,
      name: 'TOL LANGIT V10',
      description: 'Flagship · Multi-pair grid hybrid',
      gain: FALLBACK.v10.gain,
      absGain: FALLBACK.v10.gain,
      daily: 0.62,
      monthly: FALLBACK.v10.monthly,
      withdrawals: 0,
      deposits: FALLBACK.v10.balance - FALLBACK.v10.profit,
      interest: 0,
      profit: FALLBACK.v10.profit,
      balance: FALLBACK.v10.balance,
      drawdown: FALLBACK.v10.drawdown,
      equity: FALLBACK.v10.equity,
      equityPercent: (FALLBACK.v10.equity / FALLBACK.v10.balance) * 100,
      demo: false,
      lastUpdateDate: FALLBACK.v10.lastUpdateDate,
      creationDate: FALLBACK.v10.creationDate,
      firstTradeDate: FALLBACK.v10.creationDate,
      tracking: 0,
      views: 0,
      commission: 0,
      currency: FALLBACK.v10.currency,
      profitFactor: FALLBACK.v10.profitFactor,
      pips: 0,
      invitationUrl: TRACKED_URLS[V10_ID].myfxbook,
      serverName: 'IC Markets Global-Live',
      winRatePct: FALLBACK.v10.winRatePct,
      trades: FALLBACK.v10.trades,
      pairs: TRACKED_PAIRS[V10_ID],
      myfxbookUrl: TRACKED_URLS[V10_ID].myfxbook,
      mql5Url: TRACKED_URLS[V10_ID].mql5,
    },
    {
      id: Number(GOLD_ID),
      accountId: GOLD_ID,
      name: 'TOL LANGIT ETF GOLD',
      description: 'XAUUSD specialist · Volatility-adaptive',
      gain: FALLBACK.gold.gain,
      absGain: FALLBACK.gold.gain,
      daily: 0.85,
      monthly: FALLBACK.gold.monthly,
      withdrawals: 0,
      deposits: FALLBACK.gold.balance - FALLBACK.gold.profit,
      interest: 0,
      profit: FALLBACK.gold.profit,
      balance: FALLBACK.gold.balance,
      drawdown: FALLBACK.gold.drawdown,
      equity: FALLBACK.gold.equity,
      equityPercent: (FALLBACK.gold.equity / FALLBACK.gold.balance) * 100,
      demo: false,
      lastUpdateDate: FALLBACK.gold.lastUpdateDate,
      creationDate: FALLBACK.gold.creationDate,
      firstTradeDate: FALLBACK.gold.creationDate,
      tracking: 0,
      views: 0,
      commission: 0,
      currency: FALLBACK.gold.currency,
      profitFactor: FALLBACK.gold.profitFactor,
      pips: 0,
      invitationUrl: TRACKED_URLS[GOLD_ID].myfxbook,
      serverName: 'IC Markets Global-Live',
      winRatePct: FALLBACK.gold.winRatePct,
      trades: FALLBACK.gold.trades,
      pairs: TRACKED_PAIRS[GOLD_ID],
      myfxbookUrl: TRACKED_URLS[GOLD_ID].myfxbook,
      mql5Url: TRACKED_URLS[GOLD_ID].mql5,
    },
  ];
  return {
    source: 'fallback' as const,
    syncedAt: new Date().toISOString(),
    accounts,
    notice,
  };
}

async function myfxbookLogin(email: string, password: string): Promise<string> {
  const url = `https://www.myfxbook.com/api/login.json?email=${encodeURIComponent(
    email
  )}&password=${encodeURIComponent(password)}`;
  const res = await fetch(url);
  const json = (await res.json()) as MyfxbookLoginResponse;
  if (json.error || !json.session) throw new Error(json.message || 'login failed');
  return json.session;
}

async function myfxbookAccounts(session: string): Promise<RawMyfxbookAccount[]> {
  const url = `https://www.myfxbook.com/api/get-my-accounts.json?session=${encodeURIComponent(
    session
  )}`;
  const res = await fetch(url);
  const json = (await res.json()) as MyfxbookAccountsResponse;
  if (json.error || !json.accounts) throw new Error(json.message || 'accounts fetch failed');
  return json.accounts;
}

async function myfxbookLogout(session: string): Promise<void> {
  try {
    await fetch(`https://www.myfxbook.com/api/logout.json?session=${encodeURIComponent(session)}`);
  } catch {
    // best-effort
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=86400');

  const email = process.env.MYFXBOOK_EMAIL;
  const password = process.env.MYFXBOOK_PASSWORD;

  if (!email || !password) {
    return res
      .status(200)
      .json(fallbackEnvelope('Myfxbook credentials not configured — showing last verified values.'));
  }

  let session: string | null = null;
  try {
    session = await myfxbookLogin(email, password);
    const raw = await myfxbookAccounts(session);
    const tracked = new Set([V10_ID, GOLD_ID]);
    const accounts = raw
      .filter(a => tracked.has(String(a.accountId)))
      .map(a => {
        const id = String(a.accountId);
        return {
          ...a,
          accountId: id,
          pairs: TRACKED_PAIRS[id],
          myfxbookUrl: TRACKED_URLS[id]?.myfxbook,
          mql5Url: TRACKED_URLS[id]?.mql5,
          // Myfxbook's get-my-accounts does not include win-rate / trade count;
          // they live on get-data-daily / get-custom-widget. Keep verified values
          // for those two fields until we wire those endpoints up.
          winRatePct: id === V10_ID ? FALLBACK.v10.winRatePct : FALLBACK.gold.winRatePct,
          trades: id === V10_ID ? FALLBACK.v10.trades : FALLBACK.gold.trades,
        };
      });

    return res.status(200).json({
      source: 'myfxbook-api' as const,
      syncedAt: new Date().toISOString(),
      accounts,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error';
    return res
      .status(200)
      .json(fallbackEnvelope(`Myfxbook upstream error (${message}) — showing last verified values.`));
  } finally {
    if (session) await myfxbookLogout(session);
  }
}
