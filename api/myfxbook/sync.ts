// api/myfxbook/sync.ts
//
// Server-side proxy to the Myfxbook public API. Pulls everything the client
// needs in a single round-trip per request, sanitises the payload, and caches
// at the edge so the browser never sees the Myfxbook session token.
//
// Reliability model:
//   The CRITICAL PATH is just two calls — login.json + get-my-accounts.json.
//   get-my-accounts alone carries every headline figure the app needs (gain,
//   abs gain, daily, monthly, drawdown, balance, equity, profit, profit
//   factor). Once it succeeds the sync is reported as success.
//
//   The trade feeds (open trades, open orders, history) are BEST-EFFORT: each
//   call has its own timeout and any failure degrades to empty arrays without
//   failing the whole sync. Myfxbook's API is slow and occasionally stalls —
//   a hung feed call must never drag the headline data down with it.
//
// Endpoints used (all under https://www.myfxbook.com/api):
//   - login.json            (critical)
//   - get-my-accounts.json  (critical — all headline figures)
//   - get-open-trades.json  (best-effort)
//   - get-open-orders.json  (best-effort)
//   - get-history.json      (best-effort)
//   - logout.json           (cleanup)
import { VercelRequest, VercelResponse } from '@vercel/node';

// Allow the function enough wall-clock time to complete the worst-case
// fan-out to Myfxbook's (slow) API without Vercel terminating it early.
export const config = { maxDuration: 60 };

const BASE_URL = 'https://www.myfxbook.com/api';

const v10Id = 8671765;
const goldId = 12042787;

const HISTORY_LIMIT = 80;

// Per-request timeouts (ms). A single hung Myfxbook call must never take the
// whole sync down with it.
const LOGIN_TIMEOUT_MS = 10_000;
const ACCOUNTS_TIMEOUT_MS = 10_000;
const FEED_TIMEOUT_MS = 8_000;
const LOGOUT_TIMEOUT_MS = 4_000;

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

// fetch + AbortController timeout. Guarantees a slow Myfxbook endpoint cannot
// hang the serverless function indefinitely.
async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function safeJson<T>(url: string, timeoutMs: number): Promise<T | null> {
  try {
    const res = await fetchWithTimeout(url, timeoutMs);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function buildSummary(
  account: MyfxbookAccount,
  history: NormalisedTrade[]
): NormalisedSummary {
  const closedCount = history.filter((t) => t.status === 'closed').length;
  const winners = history.filter((t) => t.status === 'closed' && t.profit > 0).length;
  const winRatePct = closedCount ? Math.round((winners / closedCount) * 1000) / 10 : 0;

  // All headline figures come straight from the get-my-accounts record.
  return {
    balance: num(account.balance),
    equity: num(account.equity),
    profit: num(account.profit),
    deposits: num(account.deposits),
    withdrawals: num(account.withdrawals),
    commission: num(account.commission),
    interest: num(account.interest),
    pips: num(account.pips),
    drawdown: num(account.drawdown),
    gain: num(account.gain),
    absGain: num(account.absGain),
    daily: num(account.daily),
    monthly: num(account.monthly),
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

interface AccountFeeds {
  open: NormalisedTrade[];
  orders: NormalisedOrder[];
  history: NormalisedTrade[];
}

const EMPTY_FEEDS: AccountFeeds = { open: [], orders: [], history: [] };

// Best-effort trade feeds. Every call is independently timed; any failure
// degrades to empty arrays. This never throws, so it can never fail the sync.
async function fetchAccountFeeds(session: string, accountId: number): Promise<AccountFeeds> {
  try {
    const [openRaw, ordersRaw, historyRaw] = await Promise.all([
      safeJson<MyfxbookGenericResponse>(`${BASE_URL}/get-open-trades.json?session=${session}&id=${accountId}`, FEED_TIMEOUT_MS),
      safeJson<MyfxbookGenericResponse>(`${BASE_URL}/get-open-orders.json?session=${session}&id=${accountId}`, FEED_TIMEOUT_MS),
      safeJson<MyfxbookGenericResponse>(`${BASE_URL}/get-history.json?session=${session}&id=${accountId}`, FEED_TIMEOUT_MS),
    ]);

    const open = (openRaw ? extractTradeArray(openRaw, 'openTrades') : []).map((t) => normaliseTrade(t, 'open'));
    const orders = (ordersRaw ? extractTradeArray(ordersRaw, 'openOrders') : []).map((o) => normaliseOrder(o));
    const history = (historyRaw ? extractTradeArray(historyRaw, 'history') : []).map((t) => normaliseTrade(t, 'closed'));

    return { open, orders, history: sortAndLimitHistory(history) };
  } catch {
    return EMPTY_FEEDS;
  }
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
      message: 'Myfxbook credentials are not set on the server.',
      useFallback: true,
      lastUpdated: new Date().toISOString(),
    });
  }

  let session: string | null = null;

  try {
    // ── Critical path: login ─────────────────────────────────────────────
    const loginData = await safeJson<MyfxbookLoginResponse>(
      `${BASE_URL}/login.json?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
      LOGIN_TIMEOUT_MS
    );
    if (!loginData) throw new Error('Myfxbook login did not respond in time');
    if (loginData.error || !loginData.session) {
      throw new Error(loginData.message || 'Myfxbook login was rejected');
    }
    session = loginData.session;

    // ── Critical path: accounts (carries every headline figure) ──────────
    const accountsData = await safeJson<MyfxbookAccountsResponse>(
      `${BASE_URL}/get-my-accounts.json?session=${session}`,
      ACCOUNTS_TIMEOUT_MS
    );
    if (!accountsData) throw new Error('Myfxbook accounts did not respond in time');
    if (accountsData.error || !Array.isArray(accountsData.accounts)) {
      throw new Error(accountsData.message || 'Myfxbook accounts fetch failed');
    }

    const v10Account = getAccount(accountsData, v10Id);
    const goldAccount = getAccount(accountsData, goldId);

    // From here the sync succeeds. Trade feeds are best-effort and cannot
    // fail the response — at worst they degrade to empty arrays.
    const [v10Feeds, goldFeeds] = await Promise.all([
      fetchAccountFeeds(session, v10Id),
      fetchAccountFeeds(session, goldId),
    ]);

    const v10Payload: NormalisedAccountPayload = {
      ...v10Account,
      id: v10Id,
      name: 'TOL LANGIT V10',
      summary: buildSummary(v10Account, v10Feeds.history),
      openTrades: v10Feeds.open,
      openOrders: v10Feeds.orders,
      history: v10Feeds.history,
      monthlyByYear: {},
    };

    const goldPayload: NormalisedAccountPayload = {
      ...goldAccount,
      id: goldId,
      name: 'TOL LANGIT ETF GOLD',
      summary: buildSummary(goldAccount, goldFeeds.history),
      openTrades: goldFeeds.open,
      openOrders: goldFeeds.orders,
      history: goldFeeds.history,
      monthlyByYear: {},
    };

    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=86400');
    return res.status(200).json({
      success: true,
      lastUpdated: new Date().toISOString(),
      accounts: { v10: v10Payload, gold: goldPayload },
    });
  } catch (error: unknown) {
    const reason = getErrorMessage(error);
    console.error('Myfxbook Sync Error:', reason);
    return res.status(200).json({
      success: false,
      message: `Live sync unavailable (${reason}) — showing last verified values.`,
      useFallback: true,
      lastUpdated: new Date().toISOString(),
    });
  } finally {
    if (session) {
      fetchWithTimeout(`${BASE_URL}/logout.json?session=${session}`, LOGOUT_TIMEOUT_MS).catch(
        () => undefined
      );
    }
  }
}
