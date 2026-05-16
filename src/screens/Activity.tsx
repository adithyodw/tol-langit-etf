import { useMemo, useState } from 'react';
import type { LiveAccountFeed, LiveAccountSummary, LiveOrder, LiveTrade } from '../data/types';
import { feedToRows } from '../data/liveAdapters';
import { ActivityRow, FALLBACK_ROWS } from './activityRows';
import { V10, GOLD, type SignalStats } from '../data/signals';

// Statement view, mirroring the Myfxbook account statements:
//   V10:  https://www.myfxbook.com/secure/statements/8671765/statement.html
//   Gold: https://www.myfxbook.com/secure/statements/12042787/statement.html
//
// Live source: /api/myfxbook/sync hydrates feeds.{v10,gold}.{summary, openTrades,
// openOrders, history}. When the sync is unavailable the screen degrades to the
// verified May 2026 snapshot in ./activityRows.ts so it never blanks out.

type Tab = 'all' | 'v10' | 'gold';

interface Props {
  v10Feed?: LiveAccountFeed;
  goldFeed?: LiveAccountFeed;
  source: 'myfxbook-api' | 'fallback';
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'all',  label: 'Composite' },
  { id: 'v10',  label: 'V10' },
  { id: 'gold', label: 'ETF Gold' },
];

const HISTORY_PAGE = 20;

function fmtMoney(v: number, ccy: string, sign = true): string {
  const abs = Math.abs(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (!sign) return `${ccy} ${abs}`;
  const s = v >= 0 ? '+' : '−';
  return `${s}${ccy} ${abs}`;
}

function fmtPrice(symbol: string, p: number): string {
  if (!Number.isFinite(p)) return '—';
  if (symbol.startsWith('XAU')) return p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (symbol.includes('JPY')) return p.toFixed(3);
  return p.toFixed(5);
}

function fmtDate(iso: string | undefined | null): string {
  if (!iso) return '—';
  const dt = new Date(iso);
  if (isNaN(dt.getTime())) return '—';
  return dt.toISOString().slice(0, 10);
}

function fmtTime(iso: string | undefined | null): string {
  if (!iso) return '--:--';
  const dt = new Date(iso);
  if (isNaN(dt.getTime())) return '--:--';
  return `${String(dt.getUTCHours()).padStart(2, '0')}:${String(dt.getUTCMinutes()).padStart(2, '0')}`;
}

function summaryFromSignal(s: SignalStats): LiveAccountSummary {
  return {
    balance: s.balance,
    equity: s.equity,
    profit: s.profit,
    deposits: 0,
    withdrawals: 0,
    commission: 0,
    interest: 0,
    pips: 0,
    drawdown: s.drawdownPct,
    gain: s.growthPct,
    absGain: s.absGainPct,
    daily: s.dailyPct,
    monthly: s.monthlyPct,
    profitFactor: s.profitFactor,
    trades: s.trades,
    winRatePct: s.winRatePct,
    currency: s.currency,
    server: `${s.broker} · ${s.platform}`,
    creationDate: s.startedOn,
    firstTradeDate: s.startedOn,
    lastUpdateDate: s.lastUpdate,
  };
}

interface AccountView {
  signal: SignalStats;
  summary: LiveAccountSummary;
  open: LiveTrade[];
  orders: LiveOrder[];
  history: LiveTrade[];
  rowsForFilter: ActivityRow[];
  productLabel: 'V10' | 'GOLD';
  isLive: boolean;
  statementUrl: string;
}

function buildView(
  signal: SignalStats,
  feed: LiveAccountFeed | undefined,
  productLabel: 'V10' | 'GOLD',
  liveSource: boolean
): AccountView {
  const summary = feed?.summary ?? summaryFromSignal(signal);
  const open = feed?.open ?? [];
  const orders = feed?.orders ?? [];
  const history = feed?.history ?? [];
  const liveRows = feedToRows(feed, productLabel, signal.currency);
  const fallbackRows = FALLBACK_ROWS.filter((r) => r.product === productLabel);
  return {
    signal,
    summary,
    open,
    orders,
    history,
    rowsForFilter: liveRows.length > 0 ? liveRows : fallbackRows,
    productLabel,
    isLive: liveRows.length > 0 && liveSource,
    statementUrl: signal.myfxbookStatementUrl,
  };
}

export function Activity({ v10Feed, goldFeed, source }: Props) {
  const [tab, setTab] = useState<Tab>('all');
  const [historyOpen, setHistoryOpen] = useState<Record<string, boolean>>({});
  const [historyShown, setHistoryShown] = useState(HISTORY_PAGE);

  const v10View = useMemo(
    () => buildView(V10, v10Feed, 'V10', source === 'myfxbook-api'),
    [v10Feed, source]
  );
  const goldView = useMemo(
    () => buildView(GOLD, goldFeed, 'GOLD', source === 'myfxbook-api'),
    [goldFeed, source]
  );

  const isLiveOverall = v10View.isLive || goldView.isLive;

  const composite = useMemo(() => {
    const both = [...v10View.rowsForFilter, ...goldView.rowsForFilter].sort((a, b) => b.sortKey - a.sortKey);
    return both;
  }, [v10View, goldView]);

  return (
    <div className="screen">
      <div className="topbar">
        <div className="topbar-l">
          <span className="kicker">MYFXBOOK · STATEMENT</span>
          <h1 className="topbar-title">Activity</h1>
        </div>
        <span className={`badge ${isLiveOverall ? 'badge-pos' : 'badge-warn'}`}>
          {isLiveOverall ? 'LIVE' : 'VERIFIED SNAPSHOT'}
        </span>
      </div>

      <div className="filter-row">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`filter-chip ${tab === t.id ? 'on' : ''}`}
            onClick={() => { setTab(t.id); setHistoryShown(HISTORY_PAGE); }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'all' && (
        <CompositeView
          v10={v10View}
          gold={goldView}
          rows={composite}
        />
      )}

      {tab === 'v10' && (
        <AccountStatement
          view={v10View}
          historyOpen={historyOpen}
          setHistoryOpen={setHistoryOpen}
          historyShown={historyShown}
          setHistoryShown={setHistoryShown}
        />
      )}

      {tab === 'gold' && (
        <AccountStatement
          view={goldView}
          historyOpen={historyOpen}
          setHistoryOpen={setHistoryOpen}
          historyShown={historyShown}
          setHistoryShown={setHistoryShown}
        />
      )}

      <div className="footnote">
        Mirror of the Myfxbook account statements for #{V10.myfxbookAccountId} (V10 · {V10.currency}) and #{GOLD.myfxbookAccountId} (ETF Gold · {GOLD.currency}). Pulled server-side every page load and refreshed daily by Vercel cron. Open positions show unrealised P/L from the public ledger; realised P/L books on close. No off-book activity — every fill an investor replicates lands here.
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Composite view (V10 + Gold combined)
// ---------------------------------------------------------------------------

interface CompositeProps {
  v10: AccountView;
  gold: AccountView;
  rows: ActivityRow[];
}

function CompositeView({ v10, gold, rows }: CompositeProps) {
  const realized = rows.filter((r) => r.status === 'closed').reduce((s, r) => s + r.pnl, 0);
  const closedCount = rows.filter((r) => r.status === 'closed').length;
  const winners = rows.filter((r) => r.status === 'closed' && r.pnl > 0).length;
  const winRate = closedCount ? (winners / closedCount) * 100 : 0;

  return (
    <>
      <div className="kpi-grid">
        <div className="kpi tight">
          <span className="kpi-k">Realized P/L</span>
          <span
            className="kpi-v mono"
            style={{ color: realized >= 0 ? 'var(--pos)' : 'var(--neg)' }}
          >
            {realized >= 0 ? '+' : '−'}${Math.abs(realized).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
          <span className="kpi-sub">In view (mixed ccy)</span>
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

      <AccountMiniCard view={v10} />
      <AccountMiniCard view={gold} />

      <div className="section-label">
        <span>Composite Ledger</span>
        <span className="section-right">{rows.length} rows · newest first</span>
      </div>
      <CompactLedger rows={rows.slice(0, 40)} />
    </>
  );
}

function AccountMiniCard({ view }: { view: AccountView }) {
  const { signal, summary } = view;
  return (
    <a
      href={view.statementUrl}
      target="_blank"
      rel="noreferrer"
      className="stmt-mini"
      style={{ borderColor: signal.id === 'gold' ? 'rgba(184,154,78,0.35)' : 'rgba(10,31,61,0.18)' }}
    >
      <div className="stmt-mini-head">
        <div>
          <div className="stmt-mini-name">{signal.name}</div>
          <div className="stmt-mini-meta mono">
            #{signal.myfxbookAccountId} · {summary.server || `${signal.broker} · ${signal.platform}`} · {summary.currency}
          </div>
        </div>
        <span className="stmt-mini-link mono">Statement ↗</span>
      </div>
      <div className="stmt-mini-grid">
        <div>
          <div className="stmt-k">Balance</div>
          <div className="stmt-v mono">{fmtMoney(summary.balance, summary.currency, false)}</div>
        </div>
        <div>
          <div className="stmt-k">Equity</div>
          <div className="stmt-v mono">{fmtMoney(summary.equity, summary.currency, false)}</div>
        </div>
        <div>
          <div className="stmt-k">Profit</div>
          <div className="stmt-v mono" style={{ color: summary.profit >= 0 ? 'var(--pos)' : 'var(--neg)' }}>
            {fmtMoney(summary.profit, summary.currency)}
          </div>
        </div>
        <div>
          <div className="stmt-k">Drawdown</div>
          <div className="stmt-v mono" style={{ color: 'var(--neg)' }}>
            −{summary.drawdown.toFixed(2)}%
          </div>
        </div>
      </div>
    </a>
  );
}

// ---------------------------------------------------------------------------
// Per-account statement view
// ---------------------------------------------------------------------------

interface StatementProps {
  view: AccountView;
  historyOpen: Record<string, boolean>;
  setHistoryOpen: (next: Record<string, boolean>) => void;
  historyShown: number;
  setHistoryShown: (next: number) => void;
}

function AccountStatement({ view, historyOpen, setHistoryOpen, historyShown, setHistoryShown }: StatementProps) {
  const { signal, summary, open, orders, history, isLive } = view;
  const ccy = summary.currency || signal.currency;

  const visibleHistory = history.slice(0, historyShown);
  const canLoadMore = history.length > historyShown;

  const toggle = (id: string) => {
    setHistoryOpen({ ...historyOpen, [id]: !historyOpen[id] });
  };

  return (
    <>
      <div className="stmt-card">
        <div className="stmt-card-head">
          <div>
            <div className="stmt-card-name">{signal.name}</div>
            <div className="stmt-card-meta mono">
              #{signal.myfxbookAccountId} · {summary.server || `${signal.broker} · ${signal.platform}`} · {ccy}
            </div>
          </div>
          <a href={view.statementUrl} target="_blank" rel="noreferrer" className="stmt-link mono">
            Open statement ↗
          </a>
        </div>
        <div className="stmt-card-grid">
          <SummaryCell k="Balance"      v={fmtMoney(summary.balance, ccy, false)} />
          <SummaryCell k="Equity"       v={fmtMoney(summary.equity, ccy, false)} />
          <SummaryCell k="Profit"       v={fmtMoney(summary.profit, ccy)} pos={summary.profit >= 0} />
          <SummaryCell k="Deposits"     v={fmtMoney(summary.deposits, ccy, false)} />
          <SummaryCell k="Withdrawals"  v={fmtMoney(summary.withdrawals, ccy, false)} />
          <SummaryCell k="Commission"   v={fmtMoney(summary.commission, ccy, false)} />
          <SummaryCell k="Gain"         v={`${summary.gain >= 0 ? '+' : ''}${summary.gain.toFixed(2)}%`} pos={summary.gain >= 0} />
          <SummaryCell k="Abs. Gain"    v={`${summary.absGain >= 0 ? '+' : ''}${summary.absGain.toFixed(2)}%`} pos={summary.absGain >= 0} />
          <SummaryCell k="Drawdown"     v={`−${summary.drawdown.toFixed(2)}%`} neg />
          <SummaryCell k="Profit Factor" v={summary.profitFactor.toFixed(2)} />
          <SummaryCell k="Win Rate"     v={`${summary.winRatePct.toFixed(0)}%`} />
          <SummaryCell k="Last update"  v={fmtDate(summary.lastUpdateDate) || signal.lastUpdate} />
        </div>
      </div>

      <div className="section-label">
        <span>Open Positions</span>
        <span className="section-right">{open.length} {isLive ? 'live' : 'snapshot'}</span>
      </div>
      {open.length === 0 ? (
        <div className="stmt-empty mono">NO OPEN POSITIONS ON {signal.name}</div>
      ) : (
        <div className="stmt-list">
          {open.map((t) => (
            <TradeCard key={`open-${t.ticket || t.openTime}-${t.symbol}`} trade={t} ccy={ccy} />
          ))}
        </div>
      )}

      <div className="section-label">
        <span>Pending Orders</span>
        <span className="section-right">{orders.length} pending</span>
      </div>
      {orders.length === 0 ? (
        <div className="stmt-empty mono">NO PENDING ORDERS</div>
      ) : (
        <div className="stmt-list">
          {orders.map((o) => (
            <OrderCard key={`order-${o.ticket || o.openTime}-${o.symbol}`} order={o} />
          ))}
        </div>
      )}

      <div className="section-label">
        <span>Trade History</span>
        <span className="section-right">{history.length} closed</span>
      </div>
      {history.length === 0 ? (
        <div className="stmt-empty mono">NO CLOSED TRADES IN VIEW</div>
      ) : (
        <>
          <div className="stmt-history">
            <div className="stmt-history-head mono">
              <span className="hh-date">Closed</span>
              <span className="hh-action">Action</span>
              <span className="hh-symbol">Symbol</span>
              <span className="hh-pnl">P / L</span>
            </div>
            {visibleHistory.map((t) => {
              const id = `h-${t.ticket || `${t.openTime}-${t.symbol}`}`;
              const expanded = !!historyOpen[id];
              const side = t.side === 'BAL' ? 'BUY' : t.side;
              return (
                <div key={id} className={`stmt-history-row ${expanded ? 'expanded' : ''}`}>
                  <button className="stmt-history-summary" onClick={() => toggle(id)}>
                    <div className="hh-date">
                      <div className="mono ledger-date">{fmtDate(t.closeTime)}</div>
                      <div className="mono ledger-time">{fmtTime(t.closeTime)} GMT</div>
                    </div>
                    <div className="hh-action">
                      <span className={`side-pill side-${side.toLowerCase()}`}>{side}</span>
                      <div className="ledger-sub mono">{t.lots.toFixed(2)} lots</div>
                    </div>
                    <div className="hh-symbol">
                      <div className="ledger-strong">{t.symbol}</div>
                      <div className="ledger-sub mono">
                        {t.pips >= 0 ? '+' : ''}{t.pips.toFixed(1)} pips
                      </div>
                    </div>
                    <div className="hh-pnl mono" style={{ color: t.profit >= 0 ? 'var(--pos)' : 'var(--neg)' }}>
                      {fmtMoney(t.profit, ccy)}
                    </div>
                    <span className={`stmt-chev mono ${expanded ? 'on' : ''}`}>›</span>
                  </button>
                  {expanded && (
                    <div className="stmt-history-detail">
                      <DetailRow k="Ticket"     v={t.ticket || '—'} />
                      <DetailRow k="Opened"     v={`${fmtDate(t.openTime)} · ${fmtTime(t.openTime)} GMT`} />
                      <DetailRow k="Closed"     v={`${fmtDate(t.closeTime)} · ${fmtTime(t.closeTime)} GMT`} />
                      <DetailRow k="Open price" v={fmtPrice(t.symbol, t.openPrice)} />
                      <DetailRow k="Close price" v={fmtPrice(t.symbol, t.closePrice ?? NaN)} />
                      <DetailRow k="Stop loss"  v={t.sl != null ? fmtPrice(t.symbol, t.sl) : '—'} />
                      <DetailRow k="Take profit" v={t.tp != null ? fmtPrice(t.symbol, t.tp) : '—'} />
                      <DetailRow k="Swap"       v={t.swap != null ? fmtMoney(t.swap, ccy) : '—'} />
                      <DetailRow k="Commission" v={t.commission != null ? fmtMoney(t.commission, ccy) : '—'} />
                      {t.magicNumber && <DetailRow k="Magic" v={t.magicNumber} />}
                      {t.comment && <DetailRow k="Comment" v={t.comment} />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {canLoadMore && (
            <button className="stmt-loadmore mono" onClick={() => setHistoryShown(historyShown + HISTORY_PAGE)}>
              Load {Math.min(HISTORY_PAGE, history.length - historyShown)} more
            </button>
          )}
        </>
      )}
    </>
  );
}

function SummaryCell({ k, v, pos, neg }: { k: string; v: string; pos?: boolean; neg?: boolean }) {
  const color = pos ? 'var(--pos)' : neg ? 'var(--neg)' : undefined;
  return (
    <div className="stmt-cell">
      <div className="stmt-k">{k}</div>
      <div className="stmt-v mono" style={{ color }}>{v}</div>
    </div>
  );
}

function DetailRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="stmt-detail-row">
      <span className="stmt-detail-k">{k}</span>
      <span className="stmt-detail-v mono">{v}</span>
    </div>
  );
}

function TradeCard({ trade: t, ccy }: { trade: LiveTrade; ccy: string }) {
  const side = t.side === 'BAL' ? 'BUY' : t.side;
  return (
    <div className="trade-card">
      <div className="trade-card-head">
        <div className="trade-card-l">
          <span className={`side-pill side-${side.toLowerCase()}`}>{side}</span>
          <div>
            <div className="ledger-strong">{t.symbol}</div>
            <div className="ledger-sub mono">
              {t.lots.toFixed(2)} lots · {fmtDate(t.openTime)} {fmtTime(t.openTime)} GMT
            </div>
          </div>
        </div>
        <div className="trade-card-r mono" style={{ color: t.profit >= 0 ? 'var(--pos)' : 'var(--neg)' }}>
          {fmtMoney(t.profit, ccy)}
        </div>
      </div>
      <div className="trade-card-grid">
        <div>
          <div className="stmt-k">Open</div>
          <div className="stmt-v mono">{fmtPrice(t.symbol, t.openPrice)}</div>
        </div>
        <div>
          <div className="stmt-k">Pips</div>
          <div className="stmt-v mono" style={{ color: t.pips >= 0 ? 'var(--pos)' : 'var(--neg)' }}>
            {t.pips >= 0 ? '+' : ''}{t.pips.toFixed(1)}
          </div>
        </div>
        <div>
          <div className="stmt-k">SL</div>
          <div className="stmt-v mono">{t.sl != null ? fmtPrice(t.symbol, t.sl) : '—'}</div>
        </div>
        <div>
          <div className="stmt-k">TP</div>
          <div className="stmt-v mono">{t.tp != null ? fmtPrice(t.symbol, t.tp) : '—'}</div>
        </div>
        <div>
          <div className="stmt-k">Swap</div>
          <div className="stmt-v mono">{t.swap != null ? fmtMoney(t.swap, ccy, false) : '—'}</div>
        </div>
        <div>
          <div className="stmt-k">Ticket</div>
          <div className="stmt-v mono">{t.ticket || '—'}</div>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order: o }: { order: LiveOrder }) {
  return (
    <div className="trade-card">
      <div className="trade-card-head">
        <div className="trade-card-l">
          <span className={`side-pill side-${o.side.toLowerCase()}`}>{o.action || `${o.side} ${o.type}`}</span>
          <div>
            <div className="ledger-strong">{o.symbol}</div>
            <div className="ledger-sub mono">
              {o.lots.toFixed(2)} lots · {fmtDate(o.openTime)} {fmtTime(o.openTime)} GMT
            </div>
          </div>
        </div>
        <div className="trade-card-r mono">{o.type}</div>
      </div>
      <div className="trade-card-grid">
        <div>
          <div className="stmt-k">Trigger</div>
          <div className="stmt-v mono">{fmtPrice(o.symbol, o.openPrice)}</div>
        </div>
        <div>
          <div className="stmt-k">SL</div>
          <div className="stmt-v mono">{o.sl != null ? fmtPrice(o.symbol, o.sl) : '—'}</div>
        </div>
        <div>
          <div className="stmt-k">TP</div>
          <div className="stmt-v mono">{o.tp != null ? fmtPrice(o.symbol, o.tp) : '—'}</div>
        </div>
        <div>
          <div className="stmt-k">Ticket</div>
          <div className="stmt-v mono">{o.ticket || '—'}</div>
        </div>
      </div>
    </div>
  );
}

function CompactLedger({ rows }: { rows: ActivityRow[] }) {
  if (rows.length === 0) {
    return <div className="stmt-empty mono">NO TRADES IN VIEW</div>;
  }
  return (
    <div className="ledger statement-ledger">
      <div className="ledger-head mono">
        <span className="lc-date">Date</span>
        <span className="lc-action">Action</span>
        <span className="lc-symbol">Symbol</span>
        <span className="lc-lots">Lots</span>
        <span className="lc-price">Price</span>
        <span className="lc-pnl">P / L</span>
      </div>
      {rows.map((r) => (
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
          <div className="lc-pnl mono" style={{ color: r.pnl >= 0 ? 'var(--pos)' : 'var(--neg)' }}>
            {fmtMoney(r.pnl, r.currency)}
          </div>
        </div>
      ))}
    </div>
  );
}
