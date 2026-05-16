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
//   - get-history.json
//   - get-daily-gain.json
//
// What's returned per account (v10, gold):
//   - Account header stats from get-my-accounts (gain, drawdown, etc.)
//   - openTrades   — array of normalised open positions
//   - history      — most recent N closed trades (newest first)
//   - monthlyByYear— { [year]: { [month]: returnPct } } compounded from
//                    daily-gain so the bar chart matches Myfxbook exactly.
import { VercelRequest, VercelResponse } from '@vercel/node';

const BASE_URL = 'https://www.myfxbook.com/api';

const v10Id = 8671765;
const goldId = 12042787;

const HISTORY_LIMIT = 60;
const DAILY_START = '2021-01-01';

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
  symbol: string;
  side: 'BUY' | 'SELL' | 'BAL';
  status: 'open' | 'closed';
  openTime: string;       // ISO timestamp ("YYYY-MM-DDTHH:mm:ssZ" approximation)
  closeTime: string | null;
  openPrice: number;
  closePrice: number | null;
  lots: number;
  pips: number;
  profit: number;
}

export type MonthlyByYear = Record<string, Record<string, number>>;

interface NormalisedAccountPayload {
  id: number;
  name: string;
  openTrades: NormalisedTrade[];
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

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

// Myfxbook timestamps come in a couple of shapes — normalise to ISO when we can.
// Supported: "YYYY-MM-DD HH:mm:ss", "MM/DD/YYYY HH:mm", "DD/MM/YYYY HH:mm".
function parseDateLoose(input: unknown): Date | null {
  if (input == null) return null;
  if (typeof input !== 'string' && typeof input !== 'number') return null;
  const raw = String(input).trim();
  if (!raw) return null;

  // Native parse first (handles ISO).
  const native = Date.parse(raw);
  if (!Number.isNaN(native)) return new Date(native);

  // YYYY-MM-DD or YYYY-MM-DD HH:mm:ss
  const isoLike = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (isoLike) {
    const [, y, m, d, h = '0', mn = '0', sc = '0'] = isoLike;
    const dt = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), Number(h), Number(mn), Number(sc)));
    return Number.isNaN(dt.getTime()) ? null : dt;
  }

  // MM/DD/YYYY HH:mm  — Myfxbook English account default
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

function parseSide(action: unknown): NormalisedTrade['side'] {
  const a = String(action ?? '').trim().toLowerCase();
  if (a.startsWith('buy')) return 'BUY';
  if (a.startsWith('sell')) return 'SELL';
  return 'BAL';
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
  [key: string]: unknown;
}

function normaliseTrade(raw: RawTrade, status: NormalisedTrade['status']): NormalisedTrade {
  const openTimeIso = toIsoOrFallback(raw.openTime, new Date(0).toISOString());
  const closeTimeIso = status === 'closed' ? toIsoOrNull(raw.closeTime) : null;
  const sizing = raw.sizing != null ? raw.sizing : raw.lots;

  return {
    ticket: String(raw.ticket ?? raw.magicNumber ?? ''),
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
  };
}

function extractTradeArray(payload: MyfxbookGenericResponse, key: 'history' | 'openTrades'): RawTrade[] {
  const value = payload?.[key];
  if (Array.isArray(value)) return value as RawTrade[];
  // Some endpoints nest the array (e.g. dataDaily). Be defensive.
  if (Array.isArray((payload as { trades?: unknown })?.trades)) {
    return (payload as { trades: RawTrade[] }).trades;
  }
  return [];
}

interface DailyGainPoint {
  ymKey: string; // "YYYY-MM"
  gainPct: number;
}

interface RawDailyEntry {
  date?: unknown;
  value?: unknown;
  profit?: unknown;
  [key: string]: unknown;
}

function flattenDailyGain(payload: MyfxbookGenericResponse): RawDailyEntry[] {
  const series = (payload?.dailyGain ?? payload?.daily_gain ?? []) as unknown;
  if (!Array.isArray(series)) return [];
  // Myfxbook returns dataDaily / dailyGain as either a flat array or array-of-arrays.
  const flat: RawDailyEntry[] = [];
  for (const slot of series as Array<unknown>) {
    if (Array.isArray(slot)) {
      for (const inner of slot) {
        if (inner && typeof inner === 'object') flat.push(inner as RawDailyEntry);
      }
    } else if (slot && typeof slot === 'object') {
      flat.push(slot as RawDailyEntry);
    }
  }
  return flat;
}

function normaliseDaily(payload: MyfxbookGenericResponse): DailyGainPoint[] {
  const flat = flattenDailyGain(payload);
  const result: DailyGainPoint[] = [];
  for (const entry of flat) {
    const dt = parseDateLoose(entry.date);
    if (!dt) continue;
    const y = dt.getUTCFullYear();
    const m = dt.getUTCMonth() + 1;
    const ymKey = `${y}-${String(m).padStart(2, '0')}`;
    const v = num(entry.value, NaN);
    if (!Number.isFinite(v)) continue;
    result.push({ ymKey, gainPct: v });
  }
  return result;
}

function aggregateMonthly(daily: DailyGainPoint[]): MonthlyByYear {
  const buckets = new Map<string, number[]>();
  for (const d of daily) {
    if (!buckets.has(d.ymKey)) buckets.set(d.ymKey, []);
    buckets.get(d.ymKey)!.push(d.gainPct);
  }
  const result: MonthlyByYear = {};
  for (const [ymKey, gains] of buckets) {
    const [yearStr, monthStr] = ymKey.split('-');
    const compounded = gains.reduce((acc, g) => acc * (1 + g / 100), 1);
    const monthlyPct = Math.round((compounded - 1) * 10000) / 100;
    if (!result[yearStr]) result[yearStr] = {};
    result[yearStr][String(Number(monthStr))] = monthlyPct;
  }
  return result;
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

async function fetchAccountBundle(
  session: string,
  accountId: number
): Promise<{
  gain: MyfxbookAccount;
  open: NormalisedTrade[];
  history: NormalisedTrade[];
  monthlyByYear: MonthlyByYear;
}> {
  const today = todayIso();
  const [gainRaw, openRaw, historyRaw, dailyRaw] = await Promise.all([
    safeJson<MyfxbookAccount>(fetch(`${BASE_URL}/get-gain.json?session=${session}&id=${accountId}`)),
    safeJson<MyfxbookGenericResponse>(fetch(`${BASE_URL}/get-open-trades.json?session=${session}&id=${accountId}`)),
    safeJson<MyfxbookGenericResponse>(fetch(`${BASE_URL}/get-history.json?session=${session}&id=${accountId}`)),
    safeJson<MyfxbookGenericResponse>(
      fetch(`${BASE_URL}/get-daily-gain.json?session=${session}&id=${accountId}&start=${DAILY_START}&end=${today}`)
    ),
  ]);

  const open = (openRaw ? extractTradeArray(openRaw, 'openTrades') : []).map((t) => normaliseTrade(t, 'open'));
  const history = (historyRaw ? extractTradeArray(historyRaw, 'history') : []).map((t) => normaliseTrade(t, 'closed'));
  const monthlyByYear = dailyRaw ? aggregateMonthly(normaliseDaily(dailyRaw)) : {};

  return {
    gain: gainRaw ?? {},
    open,
    history: sortAndLimitHistory(history),
    monthlyByYear,
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

    const v10Payload: NormalisedAccountPayload = {
      ...v10Account,
      ...v10Bundle.gain,
      id: v10Id,
      name: 'TOL LANGIT V10',
      openTrades: v10Bundle.open,
      history: v10Bundle.history,
      monthlyByYear: v10Bundle.monthlyByYear,
    };

    const goldPayload: NormalisedAccountPayload = {
      ...goldAccount,
      ...goldBundle.gain,
      id: goldId,
      name: 'TOL LANGIT ETF GOLD',
      openTrades: goldBundle.open,
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
