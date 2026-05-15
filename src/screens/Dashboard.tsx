import { useMemo, useState } from 'react';
import { SignalStats, buildEquityCurve } from '../data/signals';
import { EquityChart } from '../components/EquityChart';

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

const RANGES = ['1M', '3M', '6M', 'YTD', '1Y', 'ALL'] as const;
type Range = (typeof RANGES)[number];

export function Dashboard({
  v10,
  gold,
  syncedAgo,
  source,
  notice,
  loading,
  onSyncNow,
  onOpenSignal,
}: Props) {
  const [range, setRange] = useState<Range>('ALL');

  const blended = useMemo(() => {
    const combinedEquity = v10.equity + gold.equity;
    const combinedBalance = v10.balance + gold.balance;
    const combinedProfit = v10.profit + gold.profit;
    const compositeGrowthPct = (v10.growthPct + gold.growthPct) / 2;
    const compositeWinRatePct = (v10.winRatePct + gold.winRatePct) / 2;
    const compositeProfitFactor = (v10.profitFactor + gold.profitFactor) / 2;
    return {
      combinedEquity,
      combinedBalance,
      combinedProfit,
      compositeGrowthPct,
      compositeWinRatePct,
      compositeProfitFactor,
      totalTrades: v10.trades + gold.trades,
    };
  }, [v10, gold]);

  const curve = useMemo(() => {
    const months = range === '1M' ? 1 : range === '3M' ? 3 : range === '6M' ? 6 :
      range === 'YTD' ? 5 : range === '1Y' ? 12 : 37;
    const targetGrowth =
      range === 'ALL'
        ? blended.compositeGrowthPct
        : (blended.compositeGrowthPct * months) / 37;
    return buildEquityCurve(1000, targetGrowth, Math.max(months, 6), 11);
  }, [range, blended.compositeGrowthPct]);

  const heroValue = blended.combinedEquity.toLocaleString(undefined, { maximumFractionDigits: 0 });
  const sourceLabel = source === 'myfxbook-api' ? 'LIVE · MYFXBOOK API' : 'VERIFIED · MYFXBOOK';

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
              display: 'inline-block',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#1a6e54',
              marginRight: 6,
              animation: 'pulse 1.6s infinite',
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

      {/* Sync status banner */}
      <div className="sync-banner">
        <div className="sync-banner-l">
          <div className="sync-banner-k mono">SYNC STATUS</div>
          <div className="sync-banner-v">
            {sourceLabel} · <span className="mono">{syncedAgo}</span>
          </div>
          {notice && <div className="sync-banner-note">{notice}</div>}
        </div>
        <button className="sync-banner-btn mono" onClick={onSyncNow} disabled={loading}>
          {loading ? 'Syncing…' : 'Sync Now'}
        </button>
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
        <span>Performance · Model curve</span>
        <div className="range-tabs">
          {RANGES.map(r => (
            <button
              key={r}
              className={`range-tab ${range === r ? 'on' : ''}`}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="card no-pad">
        <EquityChart data={curve} />
        <div className="hr" />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 10px 8px',
            fontSize: 10.5,
            color: 'var(--muted)',
          }}
        >
          <span className="mono">Synced {syncedAgo}</span>
          <span className="mono">Source · Myfxbook</span>
        </div>
      </div>

      <div className="section-label">
        <span>Signals</span>
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

      <div className="section-label"><span>Recent Activity</span></div>
      <div className="logs compact">
        <div className="log-group">
          <div className="log-item">
            <div className="log-time mono">09:24 GMT</div>
            <div>
              <div className="log-head">
                <span className="log-tag tag-trade">TRADE</span>
                <span className="log-sys mono">V10 · EURUSD</span>
              </div>
              <div className="log-txt">Closed long 0.04 lot · +18.4 pips · realized +$7.36</div>
            </div>
          </div>
          <div className="log-item">
            <div className="log-time mono">08:11 GMT</div>
            <div>
              <div className="log-head">
                <span className="log-tag tag-trade">TRADE</span>
                <span className="log-sys mono">GOLD · XAUUSD</span>
              </div>
              <div className="log-txt">Closed short 0.02 lot @ 3,284.10 · realized +$42.80</div>
            </div>
          </div>
          <div className="log-item">
            <div className="log-time mono">06:48 GMT</div>
            <div>
              <div className="log-head">
                <span className="log-tag tag-rebal">REBALANCE</span>
                <span className="log-sys mono">ETF · COMPOSITE</span>
              </div>
              <div className="log-txt">Volatility regime shift · GOLD weight raised to 42%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="footnote">
        All performance metrics are pulled from Myfxbook. Composite figures are equal-weighted across V10 and ETF Gold; underlying account currencies (SGD/USD) are not FX-normalized. Past performance is not indicative of future results.
      </div>
    </div>
  );
}
