// api/myfxbook/sync.ts
//
// Server-side proxy to the Myfxbook public API. Pulls everything the client
// needs in a single round-trip per request, sanitises the payload, and caches
// at the edge so the browser never sees the Myfxbook session token.
//
// Endpoints used (all under https://www.myfxbook.com/api):
//   - login.json
//   - get-my-accounts.json
//   - get-gain.json
//   - get-open-trades.json
//   - get-open-orders.json
//   - get-history.json
//   - get-daily-gain.json
//
// What's returned per account (v10, gold):
//   - summary       — account header (balance, equity, profit, deposits,
//                     withdrawals, drawdown, profit factor, win rate, trades,
//                     last update, leverage server) for the statement view
//   - openTrades    — array of normalised open positions (sl, tp, swap...)
//   - openOrders    — array of normalised pending orders
//   - history       — most recent N closed trades (newest first, enriched)
//   - monthlyByYear — { [year]: { [month]: returnPct } } compounded from
//                     daily-gain so the bar chart matches Myfxbook exactly.
import { VercelRequest, VercelResponse } from '@vercel/node';

const BASE_URL = 'https://www.myfxbook.com/api';

const v10Id = 8671765;
const goldId = 12042787;

const HISTORY_LIMIT = 80;

interface MyfxbookLoginResponse {
  error?: boolean;
  message?: string;
  session?: string;
}

interface MyfxbookAccount {
  id?: number | string;
  accountId?: number | string;
  name?: string;
  [key: string]: unknown;
}

interface MyfxbookAccountsResponse {
  error?: boolean;
  message?: string;
  accounts?: MyfxbookAccount[];
}

interface MyfxbookGenericResponse {
  error?: boolean;
  message?: string;
  [key: string]: unknown;
}

export interface NormalisedTrade {
  ticket: string;
  magicNumber: string;
  symbol: string;
  side: 'BUY' | 'SELL' | 'BAL';
  status: 'open' | 'closed';
  openTime: string;             // ISO timestamp
  closeTime: string | null;
  openPrice: number;
  closePrice: number | null;
  lots: number;
  pips: number;
  profit: number;
  sl: number | null;
  tp: number | null;
  swap: number | null;
  commission: number | null;
  comment?: string;
}

export interface NormalisedOrder {
  ticket: string;
  magicNumber: string;
  symbol: string;
  action: string;               // raw action string (e.g. "Buy Limit")
  side: 'BUY' | 'SELL';
  type: 'LIMIT' | 'STOP' | 'OTHER';
  openTime: string;
  openPrice: number;
  lots: number;
  sl: number | null;
  tp: number | null;
  comment?: string;
}

export interface NormalisedSummary {
  balance: number;
  equity: number;
  profit: number;
  deposits: number;
  withdrawals: number;
  commission: number;
  interest: number;
  pips: number;
  drawdown: number;
  gain: number;
  absGain: number;
  daily: number;
  monthly: number;
  profitFactor: number;
  trades: number;
  winRatePct: number;
  currency: string;
  server: string;
  creationDate: string;
  firstTradeDate: string;
  lastUpdateDate: string;
}

export type MonthlyByYear = Record<string, Record<string, number>>;

interface NormalisedAccountPayload {
  id: number;
  name: string;
  summary: NormalisedSummary;
  openTrades: NormalisedTrade[];
  openOrders: NormalisedOrder[];
  history: NormalisedTrade[];
  monthlyByYear: MonthlyByYear;
  [key: string]: unknown;
}

function getAccount(accountsData: MyfxbookAccountsResponse, accountId: number): MyfxbookAccount {
  return (
    accountsData.accounts?.find(
      (account) => Number(account.id) === accountId || Number(account.accountId) === accountId
    ) || {}
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

// Myfxbook timestamps come in a couple of shapes — normalise to ISO when we can.
// Supported: "YYYY-MM-DD HH:mm:ss", "MM/DD/YYYY HH:mm", ISO.
function parseDateLoose(input: unknown): Date | null {
  if (input == null) return null;
  if (typeof input !== 'string' && typeof input !== 'number') return null;
  const raw = String(input).trim();
  if (!raw) return null;

  const native = Date.parse(raw);
  if (!Number.isNaN(native)) return new Date(native);

  const isoLike = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (isoLike) {
    const [, y, m, d, h = '0', mn = '0', sc = '0'] = isoLike;
    const dt = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), Number(h), Number(mn), Number(sc)));
    return Number.isNaN(dt.getTime()) ? null : dt;
  }

  const usSlash = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (usSlash) {
    const [, m, d, y, h = '0', mn = '0', sc = '0'] = usSlash;
    const dt = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), Number(h), Number(mn), Number(sc)));
    return Number.isNaN(dt.getTime()) ? null : dt;
  }

  return null;
}

function toIsoOrNull(value: unknown): string | null {
  const dt = parseDateLoose(value);
  return dt ? dt.toISOString() : null;
}

function toIsoOrFallback(value: unknown, fallback: string): string {
  return toIsoOrNull(value) ?? fallback;
}

function num(v: unknown, fallback = 0): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = Number(v.replace(/,/g, ''));
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

function numOrNull(v: unknown): number | null {
  if (v == null) return null;
  const n = num(v, NaN);
  return Number.isFinite(n) ? n : null;
}

// SL/TP of 0 means "not set" in MetaTrader, normalise to null.
function priceOrNull(v: unknown): number | null {
  const n = numOrNull(v);
  return n === null || n === 0 ? null : n;
}

function parseSide(action: unknown): NormalisedTrade['side'] {
  const a = String(action ?? '').trim().toLowerCase();
  if (a.startsWith('buy')) return 'BUY';
  if (a.startsWith('sell')) return 'SELL';
  return 'BAL';
}

function parseOrderAction(action: unknown): { side: 'BUY' | 'SELL'; type: 'LIMIT' | 'STOP' | 'OTHER' } {
  const a = String(action ?? '').trim().toLowerCase();
  const side: 'BUY' | 'SELL' = a.startsWith('sell') ? 'SELL' : 'BUY';
  if (a.includes('limit')) return { side, type: 'LIMIT' };
  if (a.includes('stop')) return { side, type: 'STOP' };
  return { side, type: 'OTHER' };
}

function parseLots(sizing: unknown, fallback = 0): number {
  if (typeof sizing === 'number') return sizing;
  if (typeof sizing === 'string') return num(sizing, fallback);
  if (sizing && typeof sizing === 'object') {
    const s = sizing as { value?: unknown; lots?: unknown };
    if (s.value != null) return num(s.value, fallback);
    if (s.lots != null) return num(s.lots, fallback);
  }
  return fallback;
}

interface RawTrade {
  ticket?: unknown;
  openTicket?: unknown;
  closeTicket?: unknown;
  magicNumber?: unknown;
  openTime?: unknown;
  closeTime?: unknown;
  symbol?: unknown;
  action?: unknown;
  sizing?: unknown;
  lots?: unknown;
  openPrice?: unknown;
  closePrice?: unknown;
  pips?: unknown;
  profit?: unknown;
  sl?: unknown;
  tp?: unknown;
  swap?: unknown;
  commission?: unknown;
  comment?: unknown;
  [key: string]: unknown;
}

function pickTicket(raw: RawTrade): string {
  const t = raw.ticket ?? raw.openTicket ?? raw.closeTicket ?? '';
  return String(t);
}

function pickMagic(raw: RawTrade): string {
  return String(raw.magicNumber ?? '');
}

function pickComment(raw: RawTrade): string | undefined {
  if (raw.comment == null) return undefined;
  const s = String(raw.comment).trim();
  return s ? s : undefined;
}

function normaliseTrade(raw: RawTrade, status: NormalisedTrade['status']): NormalisedTrade {
  const openTimeIso = toIsoOrFallback(raw.openTime, new Date(0).toISOString());
  const closeTimeIso = status === 'closed' ? toIsoOrNull(raw.closeTime) : null;
  const sizing = raw.sizing != null ? raw.sizing : raw.lots;

  return {
    ticket: pickTicket(raw),
    magicNumber: pickMagic(raw),
    symbol: String(raw.symbol ?? '').trim().toUpperCase(),
    side: parseSide(raw.action),
    status,
    openTime: openTimeIso,
    closeTime: closeTimeIso,
    openPrice: num(raw.openPrice),
    closePrice: status === 'closed' ? num(raw.closePrice, 0) : null,
    lots: parseLots(sizing),
    pips: num(raw.pips),
    profit: num(raw.profit),
    sl: priceOrNull(raw.sl),
    tp: priceOrNull(raw.tp),
    swap: numOrNull(raw.swap),
    commission: numOrNull(raw.commission),
    comment: pickComment(raw),
  };
}

function normaliseOrder(raw: RawTrade): NormalisedOrder {
  const openTimeIso = toIsoOrFallback(raw.openTime, new Date(0).toISOString());
  const sizing = raw.sizing != null ? raw.sizing : raw.lots;
  const { side, type } = parseOrderAction(raw.action);

  return {
    ticket: pickTicket(raw),
    magicNumber: pickMagic(raw),
    symbol: String(raw.symbol ?? '').trim().toUpperCase(),
    action: String(raw.action ?? '').trim(),
    side,
    type,
    openTime: openTimeIso,
    openPrice: num(raw.openPrice),
    lots: parseLots(sizing),
    sl: priceOrNull(raw.sl),
    tp: priceOrNull(raw.tp),
    comment: pickComment(raw),
  };
}

function extractTradeArray(payload: MyfxbookGenericResponse, key: string): RawTrade[] {
  const value = payload?.[key];
  if (Array.isArray(value)) return value as RawTrade[];
  if (Array.isArray((payload as { trades?: unknown })?.trades)) {
    return (payload as { trades: RawTrade[] }).trades;
  }
  return [];
}

function sortAndLimitHistory(trades: NormalisedTrade[], limit = HISTORY_LIMIT): NormalisedTrade[] {
  return trades
    .slice()
    .sort((a, b) => {
      const ta = a.closeTime ?? a.openTime;
      const tb = b.closeTime ?? b.openTime;
      return Date.parse(tb) - Date.parse(ta);
    })
    .slice(0, limit);
}

async function safeJson<T>(promise: Promise<Response>): Promise<T | null> {
  try {
    const res = await promise;
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function buildSummary(
  account: MyfxbookAccount,
  gain: MyfxbookAccount,
  history: NormalisedTrade[]
): NormalisedSummary {
  const closedCount = history.filter((t) => t.status === 'closed').length;
  const winners = history.filter((t) => t.status === 'closed' && t.profit > 0).length;
  const winRatePct = closedCount ? Math.round((winners / closedCount) * 1000) / 10 : 0;

  return {
    balance: num(gain.balance ?? account.balance),
    equity: num(gain.equity ?? account.equity),
    profit: num(gain.profit ?? account.profit),
    deposits: num(account.deposits),
    withdrawals: num(account.withdrawals),
    commission: num(account.commission),
    interest: num(account.interest),
    pips: num(account.pips),
    drawdown: num(gain.drawdown ?? account.drawdown),
    gain: num(gain.gain ?? account.gain),
    absGain: num(gain.absGain ?? account.absGain),
    daily: num(gain.daily ?? account.daily),
    monthly: num(gain.monthly ?? account.monthly),
    profitFactor: num(account.profitFactor),
    trades: closedCount,
    winRatePct,
    currency: String(account.currency ?? ''),
    server: String(account.serverName ?? ''),
    creationDate: String(account.creationDate ?? ''),
    firstTradeDate: String(account.firstTradeDate ?? ''),
    lastUpdateDate: String(account.lastUpdateDate ?? ''),
  };
}

async function fetchAccountBundle(
  session: string,
  accountId: number
): Promise<{
  gain: MyfxbookAccount;
  open: NormalisedTrade[];
  orders: NormalisedOrder[];
  history: NormalisedTrade[];
  monthlyByYear: MonthlyByYear;
}> {
  const [gainRaw, openRaw, ordersRaw, historyRaw] = await Promise.all([
    safeJson<MyfxbookAccount>(fetch(`${BASE_URL}/get-gain.json?session=${session}&id=${accountId}`)),
    safeJson<MyfxbookGenericResponse>(fetch(`${BASE_URL}/get-open-trades.json?session=${session}&id=${accountId}`)),
    safeJson<MyfxbookGenericResponse>(fetch(`${BASE_URL}/get-open-orders.json?session=${session}&id=${accountId}`)),
    safeJson<MyfxbookGenericResponse>(fetch(`${BASE_URL}/get-history.json?session=${session}&id=${accountId}`)),
  ]);

  const open = (openRaw ? extractTradeArray(openRaw, 'openTrades') : []).map((t) => normaliseTrade(t, 'open'));
  const orders = (ordersRaw ? extractTradeArray(ordersRaw, 'openOrders') : []).map((o) => normaliseOrder(o));
  const history = (historyRaw ? extractTradeArray(historyRaw, 'history') : []).map((t) => normaliseTrade(t, 'closed'));

  // Monthly returns are NOT derived from the live daily-gain feed: that endpoint
  // cannot be reliably converted to per-month compounded returns and previously
  // produced astronomical values. Monthly Analytics renders the hand-verified
  // static Myfxbook history (src/data/monthlyReturns.ts) instead.
  return {
    gain: gainRaw ?? {},
    open,
    orders,
    history: sortAndLimitHistory(history),
    monthlyByYear: {},
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const email = process.env.MYFXBOOK_EMAIL;
  const password = process.env.MYFXBOOK_PASSWORD;

  if (!email || !password) {
    return res.status(200).json({
      success: false,
      message: 'No credentials in env',
      useFallback: true,
    });
  }

  let session: string | null = null;

  try {
    const loginRes = await fetch(
      `${BASE_URL}/login.json?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    );
    const loginData = (await loginRes.json()) as MyfxbookLoginResponse;

    if (loginData.error || !loginData.session) {
      throw new Error(loginData.message || 'Login failed');
    }

    session = loginData.session;

    const accountsRes = await fetch(`${BASE_URL}/get-my-accounts.json?session=${session}`);
    const accountsData = (await accountsRes.json()) as MyfxbookAccountsResponse;

    if (accountsData.error) {
      throw new Error(accountsData.message || 'Accounts fetch failed');
    }

    const [v10Bundle, goldBundle] = await Promise.all([
      fetchAccountBundle(session, v10Id),
      fetchAccountBundle(session, goldId),
    ]);

    const v10Account = getAccount(accountsData, v10Id);
    const goldAccount = getAccount(accountsData, goldId);

    const v10Summary = buildSummary(v10Account, v10Bundle.gain, v10Bundle.history);
    const goldSummary = buildSummary(goldAccount, goldBundle.gain, goldBundle.history);

    const v10Payload: NormalisedAccountPayload = {
      ...v10Account,
      ...v10Bundle.gain,
      id: v10Id,
      name: 'TOL LANGIT V10',
      summary: v10Summary,
      openTrades: v10Bundle.open,
      openOrders: v10Bundle.orders,
      history: v10Bundle.history,
      monthlyByYear: v10Bundle.monthlyByYear,
    };

    const goldPayload: NormalisedAccountPayload = {
      ...goldAccount,
      ...goldBundle.gain,
      id: goldId,
      name: 'TOL LANGIT ETF GOLD',
      summary: goldSummary,
      openTrades: goldBundle.open,
      openOrders: goldBundle.orders,
      history: goldBundle.history,
      monthlyByYear: goldBundle.monthlyByYear,
    };

    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=86400');
    return res.status(200).json({
      success: true,
      lastUpdated: new Date().toISOString(),
      accounts: { v10: v10Payload, gold: goldPayload },
    });
  } catch (error: unknown) {
    console.error('Myfxbook Sync Error:', getErrorMessage(error));
    return res.status(200).json({
      success: false,
      message: 'Data sync unavailable. Showing last verified values.',
      useFallback: true,
      lastUpdated: new Date().toISOString(),
    });
  } finally {
    if (session) {
      await fetch(`${BASE_URL}/logout.json?session=${session}`).catch(() => undefined);
    }
  }
}
