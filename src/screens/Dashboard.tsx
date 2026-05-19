import { useMemo, useState } from 'react';
import { SignalStats } from '../data/signals';
import { MonthlyAnalytics } from '../components/MonthlyAnalytics';
import { SimulationPanel } from '../components/SimulationPanel';
import { SyncBadge } from '../components/SyncBadge';
import { V10_MONTHLY, GOLD_MONTHLY } from '../data/monthlyReturns';
import type { LiveAccountFeed } from '../data/types';
import { combineFeeds, mergeMonthly } from '../data/liveAdapters';
import { FALLBACK_ROWS } from './activityRows';

interface Props {
  v10: SignalStats;
  gold: SignalStats;
  syncedAgo: string;
  source: 'myfxbook-api' | 'fallback';
  notice?: string;
  loading: boolean;
  onSyncNow: () => void;
  onOpenSignal: (id: 'v10' | 'gold') => void;
  v10Feed?: LiveAccountFeed;
  goldFeed?: LiveAccountFeed;
}

type Selection = 'v10' | 'gold';

const PREVIEW_LIMIT = 4;

function fmtMoney(v: number, ccy: string): string {
  const sign = v >= 0 ? '+' : '−';
  const abs = Math.abs(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${sign}${ccy} ${abs}`;
}

export function Dashboard({ v10, gold, onOpenSignal, v10Feed, goldFeed, source }: Props) {
  const [selected, setSelected] = useState<Selection>('v10');

  const blended = useMemo(() => {
    const compositeGrowthPct = (v10.growthPct + gold.growthPct) / 2;
    const compositeWinRatePct = (v10.winRatePct + gold.winRatePct) / 2;
    const compositeProfitFactor = (v10.profitFactor + gold.profitFactor) / 2;
    return {
      combinedEquity: v10.equity + gold.equity,
      compositeGrowthPct,
      compositeWinRatePct,
      compositeProfitFactor,
      totalTrades: v10.trades + gold.trades,
    };
  }, [v10, gold]);

  const heroValue = blended.combinedEquity.toLocaleString(undefined, { maximumFractionDigits: 0 });

  const v10Monthly = useMemo(() => mergeMonthly(V10_MONTHLY, v10Feed?.monthlyByYear), [v10Feed]);
  const goldMonthly = useMemo(() => mergeMonthly(GOLD_MONTHLY, goldFeed?.monthlyByYear), [goldFeed]);

  const selectedProduct = selected === 'v10' ? v10 : gold;
  const selectedMonthly = selected === 'v10' ? v10Monthly : goldMonthly;

  const liveCombined = useMemo(
    () => combineFeeds(v10Feed, goldFeed, v10.currency, gold.currency),
    [v10Feed, goldFeed, v10.currency, gold.currency]
  );
  const recentRows = (liveCombined.length > 0 ? liveCombined : FALLBACK_ROWS).slice(0, PREVIEW_LIMIT);
  const isLiveLedger = liveCombined.length > 0 && source === 'myfxbook-api';

  return (
    <div className="screen">
      <div className="topbar">
        <div className="topbar-l">
          <span className="kicker">ETF · COMPOSITE</span>
          <h1 className="topbar-title">Dashboard</h1>
        </div>
        <SyncBadge source={source} />
      </div>

      <div className="hero">
        <div className="hero-label">Combined Equity · USD-equiv</div>
        <div className="hero-value mono">${heroValue}</div>
        <div className="hero-delta">
          <span className="mono" style={{ color: 'var(--pos)' }}>
            +{blended.compositeGrowthPct.toFixed(2)}%
          </span>
          <span className="hero-period">composite Myfxbook gain · live since {v10.startedOn}</span>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi">
          <span className="kpi-k">Win Rate</span>
          <span className="kpi-v mono">{blended.compositeWinRatePct.toFixed(1)}%</span>
          <span className="kpi-sub">Blended V10 + Gold</span>
        </div>
        <div className="kpi">
          <span className="kpi-k">Profit Factor</span>
          <span className="kpi-v mono">{blended.compositeProfitFactor.toFixed(2)}</span>
          <span className="kpi-sub">Gross / gross</span>
        </div>
        <div className="kpi">
          <span className="kpi-k">Trades</span>
          <span className="kpi-v mono">{blended.totalTrades.toLocaleString()}</span>
          <span className="kpi-sub">Closed positions</span>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi tight">
          <span className="kpi-k">V10 Gain</span>
          <span className="kpi-v mono">+{v10.growthPct.toFixed(2)}%</span>
          <span className="kpi-sub">SGD · MT4</span>
        </div>
        <div className="kpi tight">
          <span className="kpi-k">Gold Gain</span>
          <span className="kpi-v mono">+{gold.growthPct.toFixed(2)}%</span>
          <span className="kpi-sub">USD · MT5</span>
        </div>
        <div className="kpi tight">
          <span className="kpi-k">Max DD</span>
          <span className="kpi-v mono" style={{ color: 'var(--neg)' }}>
            {Math.max(v10.drawdownPct, gold.drawdownPct).toFixed(2)}%
          </span>
          <span className="kpi-sub">Worst of two</span>
        </div>
      </div>

      <div className="section-label">
        <span>Monthly Analytics</span>
        <div className="seg">
          <button
            className={`seg-btn ${selected === 'v10' ? 'on' : ''}`}
            onClick={() => setSelected('v10')}
          >
            V10
          </button>
          <button
            className={`seg-btn ${selected === 'gold' ? 'on' : ''}`}
            onClick={() => setSelected('gold')}
          >
            ETF Gold
          </button>
        </div>
      </div>
      <div className="card no-pad">
        <MonthlyAnalytics
          data={selectedMonthly}
          title={`${selectedProduct.name} · Monthly gain`}
        />
      </div>

      <div className="section-label">
        <span>Simulation</span>
        <div className="seg" role="tablist" aria-label="Simulation product">
          <button
            type="button"
            role="tab"
            aria-selected={selected === 'v10'}
            className={`seg-btn ${selected === 'v10' ? 'on' : ''}`}
            onClick={() => setSelected('v10')}
          >
            V10
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selected === 'gold'}
            className={`seg-btn ${selected === 'gold' ? 'on' : ''}`}
            onClick={() => setSelected('gold')}
          >
            ETF Gold
          </button>
        </div>
      </div>
      <div className="footnote sm-pad" style={{ paddingTop: 0 }}>
        Pick a product, set your capital, choose a holding period. We replay {selectedProduct.name}'s verified Myfxbook months against your number — the output is what a copy-trade investor funding the same amount on day one would hold today, before venue fees.
      </div>
      <div className="card no-pad">
        <SimulationPanel signal={selectedProduct} monthly={selectedMonthly} />
      </div>

      <div className="section-label">
        <span>ETF Products</span>
        <span className="section-right">2 active</span>
      </div>

      <div className="systems-list">
        <button className="system-row" onClick={() => onOpenSignal('v10')}>
          <div className="system-row-top">
            <div>
              <div className="system-name">{v10.name}</div>
              <div className="system-role">{v10.role}</div>
            </div>
            <span className="badge badge-pos">+{v10.growthPct.toFixed(0)}%</span>
          </div>
          <div className="system-row-grid">
            <div><div className="srg-k">Win</div><div className="srg-v mono">{v10.winRatePct}%</div></div>
            <div><div className="srg-k">PF</div><div className="srg-v mono">{v10.profitFactor}</div></div>
            <div><div className="srg-k">DD</div><div className="srg-v mono">{v10.drawdownPct}%</div></div>
            <div><div className="srg-k">Trades</div><div className="srg-v mono">{v10.trades.toLocaleString()}</div></div>
          </div>
          <div className="system-row-foot">
            <span className="system-pairs">{v10.broker} · #{v10.brokerAccount} · {v10.currency}</span>
            <span className="system-chev">View →</span>
          </div>
        </button>

        <button className="system-row" onClick={() => onOpenSignal('gold')}>
          <div className="system-row-top">
            <div>
              <div className="system-name">{gold.name}</div>
              <div className="system-role">{gold.role}</div>
            </div>
            <span className="badge badge-warn">+{gold.growthPct.toFixed(0)}%</span>
          </div>
          <div className="system-row-grid">
            <div><div className="srg-k">Win</div><div className="srg-v mono">{gold.winRatePct}%</div></div>
            <div><div className="srg-k">PF</div><div className="srg-v mono">{gold.profitFactor}</div></div>
            <div><div className="srg-k">DD</div><div className="srg-v mono">{gold.drawdownPct}%</div></div>
            <div><div className="srg-k">Trades</div><div className="srg-v mono">{gold.trades.toLocaleString()}</div></div>
          </div>
          <div className="system-row-foot">
            <span className="system-pairs">{gold.broker} · #{gold.brokerAccount} · {gold.currency}</span>
            <span className="system-chev">View →</span>
          </div>
        </button>
      </div>

      <div className="section-label">
        <span>Recent Activity</span>
        <span className="section-right">{isLiveLedger ? `Live · ${recentRows.length} fills` : `Last ${recentRows.length} fills`}</span>
      </div>
      <div className="ledger compact">
        {recentRows.map(r => (
          <div key={r.id} className="ledger-row">
            <div className="lc-date">
              <div className="ledger-date mono">{r.date}</div>
              <div className="ledger-time mono">{r.time} GMT</div>
            </div>
            <div className="lc-action">
              <span className={`side-pill side-${r.side.toLowerCase()}`}>
                {r.status === 'open' ? 'OPEN ' : 'CLOSE '}{r.side}
              </span>
              <div className="ledger-sub mono">{r.product}</div>
            </div>
            <div className="lc-symbol">
              <div className="ledger-strong">{r.symbol}</div>
              <div className="ledger-sub mono">
                {r.pips >= 0 ? '+' : ''}{r.pips.toFixed(1)} pips
              </div>
            </div>
            <div className="lc-pnl mono" style={{ color: r.pnl >= 0 ? 'var(--pos)' : 'var(--neg)' }}>
              {fmtMoney(r.pnl, r.currency)}
            </div>
          </div>
        ))}
      </div>

      <div className="footnote">
        All figures read live from Myfxbook — V10 #{v10.myfxbookAccountId} · SGD and ETF Gold #{gold.myfxbookAccountId} · USD — re-pulled server-side on load and refreshed by daily Vercel cron. Composite is equal-weighted; SGD/USD legs are not FX-normalised. Replicate via MQL5, SignalStart, or ZuluTrade. Past performance is not indicative of future results.
      </div>
    </div>
  );
}
