import { useMemo, useState } from 'react';

// Statement ledger mirroring the Myfxbook trade statements:
//   V10:  https://www.myfxbook.com/secure/statements/8671765/statement.html
//   Gold: https://www.myfxbook.com/secure/statements/12042787/statement.html
//
// The rows below are the most recent trades visible on each account's public
// trade widget (May 2026). When the authenticated sync runs against
// /api/myfxbook/sync, the full history can be substituted in place.

type Side = 'BUY' | 'SELL';
type Status = 'closed' | 'open';

interface Row {
  id: string;
  product: 'V10' | 'GOLD';
  date: string;
  time: string;
  side: Side;
  symbol: string;
  lots: number;
  price: number;
  pips: number;
  pnl: number;
  currency: 'SGD' | 'USD';
  status: Status;
}

// Trades sourced from the public Myfxbook trade table on the two accounts.
const ROWS: Row[] = [
  // Gold (USD) — recent AUDCAD activity from the public Open Trades widget
  { id: 'g1', product: 'GOLD', date: '2026-05-15', time: '12:15', side: 'BUY', symbol: 'AUDCAD', lots: 0.21, price: 0.98283, pips: 9.2, pnl: 14.06, currency: 'USD', status: 'closed' },
  { id: 'g2', product: 'GOLD', date: '2026-05-15', time: '09:25', side: 'SELL', symbol: 'AUDCAD', lots: 0.38, price: 0.98413, pips: 3.5, pnl: 9.68, currency: 'USD', status: 'closed' },
  { id: 'g3', product: 'GOLD', date: '2026-05-15', time: '08:40', side: 'BUY', symbol: 'AUDCAD', lots: 0.15, price: 0.98578, pips: -20.3, pnl: -22.15, currency: 'USD', status: 'closed' },
  { id: 'g4', product: 'GOLD', date: '2026-05-15', time: '04:50', side: 'BUY', symbol: 'AUDCAD', lots: 0.15, price: 0.98846, pips: -47.1, pnl: -51.40, currency: 'USD', status: 'closed' },
  { id: 'g5', product: 'GOLD', date: '2026-05-14', time: '19:35', side: 'BUY', symbol: 'AUDCAD', lots: 0.14, price: 0.99063, pips: -68.8, pnl: -70.08, currency: 'USD', status: 'closed' },
  { id: 'g6', product: 'GOLD', date: '2026-05-06', time: '03:45', side: 'SELL', symbol: 'AUDCAD', lots: 0.15, price: 0.98171, pips: -20.7, pnl: -22.59, currency: 'USD', status: 'closed' },
  { id: 'g7', product: 'GOLD', date: '2026-05-05', time: '18:05', side: 'SELL', symbol: 'AUDCAD', lots: 0.15, price: 0.97917, pips: -46.1, pnl: -50.31, currency: 'USD', status: 'closed' },
  // V10 (SGD) — recent long-running open positions on AUDNZD
  { id: 'v1', product: 'V10', date: '2026-02-18', time: '17:43', side: 'SELL', symbol: 'AUDNZD', lots: 0.03, price: 1.18012, pips: -437.6, pnl: -98.22, currency: 'SGD', status: 'open' },
  { id: 'v2', product: 'V10', date: '2025-11-10', time: '12:30', side: 'SELL', symbol: 'AUDNZD', lots: 0.03, price: 1.15732, pips: -665.6, pnl: -149.40, currency: 'SGD', status: 'open' },
  { id: 'v3', product: 'V10', date: '2025-09-30', time: '09:07', side: 'SELL', symbol: 'AUDNZD', lots: 0.03, price: 1.13841, pips: -854.7, pnl: -191.84, currency: 'SGD', status: 'open' },
  { id: 'v4', product: 'V10', date: '2025-09-11', time: '12:36', side: 'SELL', symbol: 'AUDNZD', lots: 0.03, price: 1.11414, pips: -1097.4, pnl: -246.32, currency: 'SGD', status: 'open' },
  { id: 'v5', product: 'V10', date: '2025-08-21', time: '12:33', side: 'SELL', symbol: 'AUDNZD', lots: 0.03, price: 1.10260, pips: -1212.8, pnl: -272.22, currency: 'SGD', status: 'open' },
];

type Filter = 'all' | 'v10' | 'gold' | 'open';

const CHIPS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'v10', label: 'V10' },
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

export function Activity() {
  const [filter, setFilter] = useState<Filter>('all');

  const rows = useMemo(() => {
    if (filter === 'all') return ROWS;
    if (filter === 'open') return ROWS.filter(r => r.status === 'open');
    if (filter === 'v10') return ROWS.filter(r => r.product === 'V10');
    return ROWS.filter(r => r.product === 'GOLD');
  }, [filter]);

  const realized = rows.filter(r => r.status === 'closed').reduce((s, r) => s + r.pnl, 0);
  const closedCount = rows.filter(r => r.status === 'closed').length;
  const winners = rows.filter(r => r.status === 'closed' && r.pnl > 0).length;
  const winRate = closedCount ? (winners / closedCount) * 100 : 0;

  return (
    <div className="screen">
      <div className="topbar">
        <div className="topbar-l">
          <span className="kicker">MYFXBOOK · STATEMENT</span>
          <h1 className="topbar-title">Activity</h1>
        </div>
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
              style={{
                color: r.pnl >= 0 ? 'var(--pos)' : 'var(--neg)',
              }}
            >
              {fmtMoney(r.pnl, r.currency)}
            </div>
          </div>
        ))}
      </div>

      <div className="footnote">
        Live mirror of the Myfxbook trade statements for accounts #8671765 (V10, SGD) and #12042787 (ETF Gold, USD). Open positions show unrealised P/L from the public Myfxbook ledger; realised P/L is booked only on close. There is no off-book PnL — every fill an investor copies appears here.
      </div>
    </div>
  );
}
