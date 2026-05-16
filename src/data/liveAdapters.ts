// Bridges between the live Myfxbook feed (LiveAccountFeed) and the
// static fallback shapes the screens render today.
//
// Two responsibilities:
//   1. mergeMonthly()    — overlay live monthly returns on top of the curated
//      static history. Live wins per (year, month); static fills any month
//      the live daily-gain stream doesn't cover.
//   2. liveTradesToRows()— map normalised LiveTrade objects into the row
//      shape the Activity ledger renders.

import type { LiveAccountFeed, LiveMonthlyByYear, LiveTrade } from './types';
import type { MonthlyByYear } from './monthlyReturns';
import type { ActivityRow } from '../screens/activityRows';

export function mergeMonthly(
  staticMap: MonthlyByYear,
  liveMap: LiveMonthlyByYear | undefined
): MonthlyByYear {
  if (!liveMap || Object.keys(liveMap).length === 0) return staticMap;

  const merged: MonthlyByYear = {};
  // Seed with the static curated history.
  for (const yearStr of Object.keys(staticMap)) {
    const y = Number(yearStr);
    merged[y] = { ...(staticMap[y] ?? {}) };
  }
  // Overlay every live cell.
  for (const yearStr of Object.keys(liveMap)) {
    const y = Number(yearStr);
    if (!merged[y]) merged[y] = {};
    const months = liveMap[yearStr] ?? {};
    for (const monthStr of Object.keys(months)) {
      const m = Number(monthStr);
      const v = months[monthStr];
      if (Number.isFinite(v)) {
        merged[y][m] = Number(v);
      }
    }
  }
  return merged;
}

export function feedToRows(
  feed: LiveAccountFeed | undefined,
  productLabel: 'V10' | 'GOLD',
  currency: string
): ActivityRow[] {
  if (!feed) return [];
  const closed = feed.history.map((t) => liveTradeToRow(t, productLabel, currency, 'closed'));
  const open = feed.open.map((t) => liveTradeToRow(t, productLabel, currency, 'open'));
  return [...open, ...closed];
}

function liveTradeToRow(
  t: LiveTrade,
  productLabel: 'V10' | 'GOLD',
  currency: string,
  status: 'open' | 'closed'
): ActivityRow {
  // For open trades use openTime; for closed trades use closeTime when present.
  const refIso = status === 'closed' && t.closeTime ? t.closeTime : t.openTime;
  const dt = refIso ? new Date(refIso) : new Date();
  const date = isNaN(dt.getTime()) ? '—' : dt.toISOString().slice(0, 10);
  const time = isNaN(dt.getTime())
    ? '--:--'
    : `${String(dt.getUTCHours()).padStart(2, '0')}:${String(dt.getUTCMinutes()).padStart(2, '0')}`;

  const referencePrice = status === 'closed' && t.closePrice != null ? t.closePrice : t.openPrice;
  const side = t.side === 'BAL' ? 'BUY' : t.side;

  return {
    id: `${productLabel.toLowerCase()}-${t.ticket || `${date}-${time}-${t.symbol}`}`,
    product: productLabel,
    date,
    time,
    side,
    symbol: t.symbol,
    lots: t.lots,
    price: referencePrice ?? 0,
    pips: t.pips,
    pnl: t.profit,
    currency,
    status,
    sortKey: dt.getTime(),
  };
}

export function combineFeeds(
  v10Feed: LiveAccountFeed | undefined,
  goldFeed: LiveAccountFeed | undefined,
  v10Currency: string,
  goldCurrency: string
): ActivityRow[] {
  const rows: ActivityRow[] = [
    ...feedToRows(v10Feed, 'V10', v10Currency),
    ...feedToRows(goldFeed, 'GOLD', goldCurrency),
  ];
  rows.sort((a, b) => b.sortKey - a.sortKey);
  return rows;
}
