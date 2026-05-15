import { useMemo, useState } from 'react';

// Statement-style ledger mirroring the layout of
//   https://www.myfxbook.com/secure/statements/8671765/statement.html
//   https://www.myfxbook.com/secure/statements/12042787/statement.html
//
// Columns: Date | Action | Symbol | Lots | Price | P/L
// Investors can read this top-to-bottom the same way they read a broker statement.

type Side = 'BUY' | 'SELL' | 'BALANCE';
type Status = 'closed' | 'open';

interface Row {
  id: string;
  product: 'V10' | 'GOLD';
  date: string;       // YYYY-MM-DD
  time: string;       // HH:MM
  side: Side;
  symbol: string;
  lots: number;
  price: number;
  pips?: number;
  pnl: number;        // currency-denominated, positive = profit
  currency: 'SGD' | 'USD';
  status: Status;
}

const ROWS: Row[] = [
  { id: 'r1', product: 'V10', date: '2026-05-16', time: '09:24', side: 'BUY', symbol: 'EURUSD', lots: 0.04, price: 1.0812, pips: 18.4, pnl: 7.36, currency: 'SGD', status: 'closed' },
  { id: 'r2', product: 'GOLD', date: '2026-05-16', time: '08:11', side: 'SELL', symbol: 'XAUUSD', lots: 0.02, price: 3284.10, pips: 24.0, pnl: 42.80, currency: 'USD', status: 'closed' },
  { id: 'r3', product: 'V10', date: '2026-05-15', time: '21:55', side: 'BUY', symbol: 'USDJPY', lots: 0.05, price: 154.82, pips: 24.1, pnl: 11.02, currency: 'SGD', status: 'closed' },
  { id: 'r4', product: 'GOLD', date: '2026-05-15', time: '14:18', side: 'SELL', symbol: 'XAUUSD', lots: 0.02, price: 3298.40, pnl: 0, currency: 'USD', status: 'open' },
  { id: 'r5', product: 'V10', date: '2026-05-14', time: '22:41', side: 'BUY', symbol: 'EURUSD', lots: 0.04, price: 1.0789, pips: 12.7, pnl: 5.11, currency: 'SGD', status: 'closed' },
  { id: 'r6', product: 'V10', date: '2026-05-14', time: '17:30', side: 'BUY', symbol: 'GBPUSD', lots: 0.03, price: 1.2654, pips: 9.2, pnl: 2.76, currency: 'SGD', status: 'closed' },
  { id: 'r7', product: 'GOLD', date: '2026-05-13', time: '20:55', side: 'BUY', symbol: 'XAUUSD', lots: 0.02, price: 3271.20, pips: 38.5, pnl: 118.40, currency: 'USD', status: 'closed' },
  { id: 'r8', product: 'V10', date: '2026-05-13', time: '13:08', side: 'SELL', symbol: 'AUDUSD', lots: 0.03, price: 0.6612, pips: -4.8, pnl: -1.44, currency: 'SGD', status: 'closed' },
  { id: 'r9', product: 'V10', date: '2026-05-12', time: '19:42', side: 'BUY', symbol: 'USDCAD', lots: 0.04, price: 1.3684, pips: 15.6, pnl: 6.24, currency: 'SGD', status: 'closed' },
  { id: 'r10', product: 'GOLD', date: '2026-05-12', time: '11:20', side: 'SELL', symbol: 'XAUUSD', lots: 0.02, price: 3310.50, pips: 21.0, pnl: 38.20, currency: 'USD', status: 'closed' },
  { id: 'r11', product: 'V10', date: '2026-05-11', time: '23:14', side: 'BUY', symbol: 'EURUSD', lots: 0.04, price: 1.0768, pips: 21.5, pnl: 8.60, currency: 'SGD', status: 'closed' },
  { id: 'r12', product: 'V10', date: '2026-05-11', time: '08:55', side: 'BUY', symbol: 'USDJPY', lots: 0.05, price: 154.41, pips: 14.8, pnl: 6.74, currency: 'SGD', status: 'closed' },
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
          <span className="kpi-sub">Last {closedCount} fills</span>
        </div>
        <div className="kpi tight">
          <span className="kpi-k">Win Rate</span>
          <span className="kpi-v mono">{winRate.toFixed(1)}%</span>
          <span className="kpi-sub">Window</span>
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

      <div className="ledger">
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
                {r.status === 'open' ? 'OPEN ' : 'CLOSE '} {r.side}
              </span>
              <div className="ledger-sub mono">{r.product}</div>
            </div>
            <div className="lc-symbol">
              <div className="ledger-strong">{r.symbol}</div>
              {r.pips != null && (
                <div className="ledger-sub mono">{r.pips >= 0 ? '+' : ''}{r.pips.toFixed(1)} pips</div>
              )}
            </div>
            <div className="lc-lots mono">{r.lots.toFixed(2)}</div>
            <div className="lc-price mono">{fmtPrice(r.symbol, r.price)}</div>
            <div className="lc-pnl mono" style={{ color: r.status === 'open' ? 'var(--muted)' : r.pnl >= 0 ? 'var(--pos)' : 'var(--neg)' }}>
              {r.status === 'open' ? '—' : fmtMoney(r.pnl, r.currency)}
            </div>
          </div>
        ))}
      </div>

      <div className="footnote">
        Statement mirror of the Myfxbook trade ledger for accounts #8671765 and #12042787. P/L is denominated in each account's native currency (SGD for V10, USD for ETF Gold). Open positions display the current floating reference price; realized P/L is recorded only on close.
      </div>
    </div>
  );
}
