import { useMemo } from 'react';
import { SignalStats } from '../data/signals';
import { MonthlyAnalytics } from '../components/MonthlyAnalytics';
import { V10_MONTHLY, GOLD_MONTHLY, MonthlyByYear } from '../data/monthlyReturns';

interface Props {
  v10: SignalStats;
  gold: SignalStats;
  syncedAgo: string;
  source: 'myfxbook-api' | 'fallback';
  notice?: string;
  loading: boolean;
  onSyncNow: () => void;
  onOpenSignal: (id: 'v10' | 'gold') => void;
}

// Compose the ETF view by averaging the two product monthly series for each year/month.
function blendMonthly(a: MonthlyByYear, b: MonthlyByYear): MonthlyByYear {
  const out: MonthlyByYear = {};
  const years = new Set([...Object.keys(a), ...Object.keys(b)].map(Number));
  for (const y of years) {
    const ya = a[y] ?? {};
    const yb = b[y] ?? {};
    const months: Partial<Record<number, number>> = {};
    for (let m = 1; m <= 12; m++) {
      const va = ya[m];
      const vb = yb[m];
      if (va != null && vb != null) months[m] = Number(((va + vb) / 2).toFixed(2));
      else if (va != null) months[m] = va;
      else if (vb != null) months[m] = vb;
    }
    out[y] = months;
  }
  return out;
}

export function Dashboard({ v10, gold, onOpenSignal }: Props) {
  const blended = useMemo(() => {
    const combinedEquity = v10.equity + gold.equity;
    const compositeGrowthPct = (v10.growthPct + gold.growthPct) / 2;
    const compositeWinRatePct = (v10.winRatePct + gold.winRatePct) / 2;
    const compositeProfitFactor = (v10.profitFactor + gold.profitFactor) / 2;
    return {
      combinedEquity,
      compositeGrowthPct,
      compositeWinRatePct,
      compositeProfitFactor,
      totalTrades: v10.trades + gold.trades,
    };
  }, [v10, gold]);

  const blendedMonthly = useMemo(() => blendMonthly(V10_MONTHLY, GOLD_MONTHLY), []);
  const heroValue = blended.combinedEquity.toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div className="screen">
      <div className="topbar">
        <div className="topbar-l">
          <span className="kicker">ETF · COMPOSITE</span>
          <h1 className="topbar-title">Dashboard</h1>
        </div>
        <span className="badge badge-pos">
          <span
            style={{
              display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
              background: '#1a6e54', marginRight: 6, animation: 'pulse 1.6s infinite',
            }}
          />
          LIVE
        </span>
      </div>

      <div className="hero">
        <div className="hero-label">Combined Equity · USD-equiv</div>
        <div className="hero-value mono">${heroValue}</div>
        <div className="hero-delta">
          <span className="mono" style={{ color: 'var(--pos)' }}>
            +{blended.compositeGrowthPct.toFixed(2)}%
          </span>
          <span className="hero-period">composite Myfxbook gain · since {v10.startedOn}</span>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi">
          <span className="kpi-k">Win Rate</span>
          <span className="kpi-v mono">{blended.compositeWinRatePct.toFixed(2)}%</span>
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
          <span className="kpi-sub">Myfxbook</span>
        </div>
        <div className="kpi tight">
          <span className="kpi-k">Gold Gain</span>
          <span className="kpi-v mono">+{gold.growthPct.toFixed(2)}%</span>
          <span className="kpi-sub">XAUUSD only</span>
        </div>
        <div className="kpi tight">
          <span className="kpi-k">Max DD</span>
          <span className="kpi-v mono" style={{ color: 'var(--neg)' }}>{v10.drawdownPct.toFixed(2)}%</span>
          <span className="kpi-sub">V10 historical</span>
        </div>
      </div>

      <div className="section-label">
        <span>Monthly Analytics</span>
        <span className="section-right">Composite</span>
      </div>
      <div className="card no-pad">
        <MonthlyAnalytics data={blendedMonthly} title="Composite · Monthly gain" />
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
            <span className="system-pairs">{v10.pairs.join(' · ')}</span>
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
            <span className="system-pairs">{gold.pairs.join(' · ')}</span>
            <span className="system-chev">View →</span>
          </div>
        </button>
      </div>

      <div className="section-label">
        <span>Recent Activity</span>
        <span className="section-right">Last 4 fills</span>
      </div>
      <div className="ledger compact">
        <div className="ledger-row">
          <div className="lc-date">
            <div className="ledger-date mono">2026-05-16</div>
            <div className="ledger-time mono">09:24</div>
          </div>
          <div className="lc-action">
            <span className="side-pill side-buy">CLOSE BUY</span>
            <div className="ledger-sub mono">V10</div>
          </div>
          <div className="lc-symbol">
            <div className="ledger-strong">EURUSD</div>
            <div className="ledger-sub mono">+18.4 pips</div>
          </div>
          <div className="lc-pnl mono" style={{ color: 'var(--pos)' }}>+SGD 7.36</div>
        </div>
        <div className="ledger-row">
          <div className="lc-date">
            <div className="ledger-date mono">2026-05-16</div>
            <div className="ledger-time mono">08:11</div>
          </div>
          <div className="lc-action">
            <span className="side-pill side-sell">CLOSE SELL</span>
            <div className="ledger-sub mono">GOLD</div>
          </div>
          <div className="lc-symbol">
            <div className="ledger-strong">XAUUSD</div>
            <div className="ledger-sub mono">+24.0 pips</div>
          </div>
          <div className="lc-pnl mono" style={{ color: 'var(--pos)' }}>+USD 42.80</div>
        </div>
        <div className="ledger-row">
          <div className="lc-date">
            <div className="ledger-date mono">2026-05-15</div>
            <div className="ledger-time mono">21:55</div>
          </div>
          <div className="lc-action">
            <span className="side-pill side-buy">CLOSE BUY</span>
            <div className="ledger-sub mono">V10</div>
          </div>
          <div className="lc-symbol">
            <div className="ledger-strong">USDJPY</div>
            <div className="ledger-sub mono">+24.1 pips</div>
          </div>
          <div className="lc-pnl mono" style={{ color: 'var(--pos)' }}>+SGD 11.02</div>
        </div>
        <div className="ledger-row">
          <div className="lc-date">
            <div className="ledger-date mono">2026-05-13</div>
            <div className="ledger-time mono">20:55</div>
          </div>
          <div className="lc-action">
            <span className="side-pill side-buy">CLOSE BUY</span>
            <div className="ledger-sub mono">GOLD</div>
          </div>
          <div className="lc-symbol">
            <div className="ledger-strong">XAUUSD</div>
            <div className="ledger-sub mono">+38.5 pips</div>
          </div>
          <div className="lc-pnl mono" style={{ color: 'var(--pos)' }}>+USD 118.40</div>
        </div>
      </div>

      <div className="footnote">
        All performance metrics are pulled from Myfxbook. Composite figures are equal-weighted across V10 and ETF Gold; underlying account currencies (SGD/USD) are not FX-normalized. Past performance is not indicative of future results.
      </div>
    </div>
  );
}
