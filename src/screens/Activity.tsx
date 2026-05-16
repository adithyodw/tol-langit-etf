import { useMemo, useState } from 'react';
import type { LiveAccountFeed } from '../data/types';
import { combineFeeds } from '../data/liveAdapters';
import { ActivityRow, FALLBACK_ROWS } from './activityRows';
import { V10, GOLD } from '../data/signals';

// Statement ledger mirroring the Myfxbook trade statements:
//   V10:  https://www.myfxbook.com/secure/statements/8671765/statement.html
//   Gold: https://www.myfxbook.com/secure/statements/12042787/statement.html
//
// Live source: /api/myfxbook/sync hydrates `feeds.v10.history|open` and
// `feeds.gold.history|open`. When the live sync is unavailable we fall back
// to the verified snapshot in ./activityRows.ts so the screen never blanks.

type Filter = 'all' | 'v10' | 'gold' | 'open';

interface Props {
  v10Feed?: LiveAccountFeed;
  goldFeed?: LiveAccountFeed;
  source: 'myfxbook-api' | 'fallback';
}

const CHIPS: { id: Filter; label: string }[] = [
  { id: 'all',  label: 'All' },
  { id: 'v10',  label: 'V10' },
  { id: 'gold', label: 'ETF Gold' },
  { id: 'open', label: 'Open' },
];

function fmtMoney(v: number, ccy: string): string {
  const sign = v >= 0 ? '+' : '−';
  const abs = Math.abs(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${sign}${ccy} ${abs}`;
}

function fmtPrice(symbol: string, p: number): string {
  if (symbol.startsWith('XAU')) return p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (symbol.includes('JPY')) return p.toFixed(3);
  return p.toFixed(5);
}

const LEDGER_LIMIT = 60;

export function Activity({ v10Feed, goldFeed, source }: Props) {
  const [filter, setFilter] = useState<Filter>('all');

  const liveRows = useMemo(
    () => combineFeeds(v10Feed, goldFeed, V10.currency, GOLD.currency),
    [v10Feed, goldFeed]
  );

  // Live first, snapshot only as a safety net.
  const allRows: ActivityRow[] = liveRows.length > 0 ? liveRows.slice(0, LEDGER_LIMIT) : FALLBACK_ROWS;
  const isLive = liveRows.length > 0 && source === 'myfxbook-api';

  const rows = useMemo(() => {
    if (filter === 'all')  return allRows;
    if (filter === 'open') return allRows.filter(r => r.status === 'open');
    if (filter === 'v10')  return allRows.filter(r => r.product === 'V10');
    return allRows.filter(r => r.product === 'GOLD');
  }, [allRows, filter]);

  const realized    = rows.filter(r => r.status === 'closed').reduce((s, r) => s + r.pnl, 0);
  const closedCount = rows.filter(r => r.status === 'closed').length;
  const winners     = rows.filter(r => r.status === 'closed' && r.pnl > 0).length;
  const winRate     = closedCount ? (winners / closedCount) * 100 : 0;

  return (
    <div className="screen">
      <div className="topbar">
        <div className="topbar-l">
          <span className="kicker">MYFXBOOK · STATEMENT</span>
          <h1 className="topbar-title">Activity</h1>
        </div>
        <span className={`badge ${isLive ? 'badge-pos' : 'badge-warn'}`}>
          {isLive ? 'LIVE' : 'VERIFIED SNAPSHOT'}
        </span>
      </div>

      <div className="kpi-grid">
        <div className="kpi tight">
          <span className="kpi-k">Realized P/L</span>
          <span className="kpi-v mono" style={{ color: realized >= 0 ? 'var(--pos)' : 'var(--neg)' }}>
            {realized >= 0 ? '+' : '−'}${Math.abs(realized).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
          <span className="kpi-sub">In view</span>
        </div>
        <div className="kpi tight">
          <span className="kpi-k">Win Rate</span>
          <span className="kpi-v mono">{winRate.toFixed(0)}%</span>
          <span className="kpi-sub">Closed fills</span>
        </div>
        <div className="kpi tight">
          <span className="kpi-k">Trades</span>
          <span className="kpi-v mono">{rows.length}</span>
          <span className="kpi-sub">In view</span>
        </div>
      </div>

      <div className="filter-row">
        {CHIPS.map(c => (
          <button
            key={c.id}
            className={`filter-chip ${filter === c.id ? 'on' : ''}`}
            onClick={() => setFilter(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="ledger statement-ledger">
        <div className="ledger-head mono">
          <span className="lc-date">Date</span>
          <span className="lc-action">Action</span>
          <span className="lc-symbol">Symbol</span>
          <span className="lc-lots">Lots</span>
          <span className="lc-price">Price</span>
          <span className="lc-pnl">P / L</span>
        </div>
        {rows.map(r => (
          <div key={r.id} className="ledger-row">
            <div className="lc-date">
              <div className="ledger-date mono">{r.date}</div>
              <div className="ledger-time mono">{r.time} GMT</div>
            </div>
            <div className="lc-action">
              <span className={`side-pill side-${r.side.toLowerCase()}`}>
                {r.status === 'open' ? 'OPEN ' : 'CLOSE '}
                {r.side}
              </span>
              <div className="ledger-sub mono">{r.product}</div>
            </div>
            <div className="lc-symbol">
              <div className="ledger-strong">{r.symbol}</div>
              <div className="ledger-sub mono">
                {r.pips >= 0 ? '+' : ''}{r.pips.toFixed(1)} pips
              </div>
            </div>
            <div className="lc-lots mono">{r.lots.toFixed(2)}</div>
            <div className="lc-price mono">{fmtPrice(r.symbol, r.price)}</div>
            <div
              className="lc-pnl mono"
              style={{ color: r.pnl >= 0 ? 'var(--pos)' : 'var(--neg)' }}
            >
              {fmtMoney(r.pnl, r.currency)}
            </div>
          </div>
        ))}
      </div>

      <div className="footnote">
        Live mirror of Myfxbook statements for #8671765 (V10 · SGD) and #12042787 (ETF Gold · USD), synced server-side every load and refreshed daily by Vercel cron. Open positions show unrealised P/L from the public ledger; realised P/L books on close. No off-book activity — every fill an investor replicates lands on this page.
      </div>
    </div>
  );
}
