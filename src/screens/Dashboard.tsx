import { useMemo, useState } from 'react';
import { SignalStats } from '../data/signals';
import { MonthlyAnalytics } from '../components/MonthlyAnalytics';
import { SimulationPanel } from '../components/SimulationPanel';
import { V10_MONTHLY, GOLD_MONTHLY } from '../data/monthlyReturns';

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

type Selection = 'v10' | 'gold';

export function Dashboard({ v10, gold, onOpenSignal }: Props) {
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

  const selectedProduct = selected === 'v10' ? v10 : gold;
  const selectedMonthly = selected === 'v10' ? V10_MONTHLY : GOLD_MONTHLY;

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
        Pick a product, enter your capital, and choose a holding period. We replay the verified Myfxbook track for {selectedProduct.name} month-by-month against your number — the output is the balance an investor who had funded the same amount on day one would be holding today, before copy-trade fees.
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
        <span className="section-right">Last 4 fills</span>
      </div>
      <div className="ledger compact">
        <div className="ledger-row">
          <div className="lc-date">
            <div className="ledger-date mono">2026-05-15</div>
            <div className="ledger-time mono">12:15 GMT</div>
          </div>
          <div className="lc-action">
            <span className="side-pill side-buy">CLOSE BUY</span>
            <div className="ledger-sub mono">GOLD</div>
          </div>
          <div className="lc-symbol">
            <div className="ledger-strong">AUDCAD</div>
            <div className="ledger-sub mono">+9.2 pips</div>
          </div>
          <div className="lc-pnl mono" style={{ color: 'var(--pos)' }}>+USD 14.06</div>
        </div>
        <div className="ledger-row">
          <div className="lc-date">
            <div className="ledger-date mono">2026-05-15</div>
            <div className="ledger-time mono">09:25 GMT</div>
          </div>
          <div className="lc-action">
            <span className="side-pill side-sell">CLOSE SELL</span>
            <div className="ledger-sub mono">GOLD</div>
          </div>
          <div className="lc-symbol">
            <div className="ledger-strong">AUDCAD</div>
            <div className="ledger-sub mono">+3.5 pips</div>
          </div>
          <div className="lc-pnl mono" style={{ color: 'var(--pos)' }}>+USD 9.68</div>
        </div>
        <div className="ledger-row">
          <div className="lc-date">
            <div className="ledger-date mono">2026-05-15</div>
            <div className="ledger-time mono">Best XAUUSD</div>
          </div>
          <div className="lc-action">
            <span className="side-pill side-buy">CLOSE BUY</span>
            <div className="ledger-sub mono">GOLD</div>
          </div>
          <div className="lc-symbol">
            <div className="ledger-strong">XAUUSD</div>
            <div className="ledger-sub mono">Best trade</div>
          </div>
          <div className="lc-pnl mono" style={{ color: 'var(--pos)' }}>+USD 2,061.58</div>
        </div>
        <div className="ledger-row">
          <div className="lc-date">
            <div className="ledger-date mono">2026-05-16</div>
            <div className="ledger-time mono">Today</div>
          </div>
          <div className="lc-action">
            <span className="side-pill side-buy">V10 DAY</span>
            <div className="ledger-sub mono">V10</div>
          </div>
          <div className="lc-symbol">
            <div className="ledger-strong">Today P/L</div>
            <div className="ledger-sub mono">3 fills · 33% win</div>
          </div>
          <div className="lc-pnl mono" style={{ color: 'var(--pos)' }}>+SGD 107.65</div>
        </div>
      </div>

      <div className="footnote">
        Every figure on this page is read live from Myfxbook — V10 (#{v10.myfxbookAccountId} · SGD) and ETF Gold (#{gold.myfxbookAccountId} · USD). Composite numbers are equal-weighted across both products; the underlying SGD and USD legs are not FX-normalised. Investors can replicate through MQL5, SignalStart, or ZuluTrade — see each product page for the live venue links. Past performance is not indicative of future results.
      </div>
    </div>
  );
}
