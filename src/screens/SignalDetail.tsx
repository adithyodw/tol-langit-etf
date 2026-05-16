import { useMemo } from 'react';
import { SignalStats } from '../data/signals';
import { MonthlyAnalytics } from '../components/MonthlyAnalytics';
import { SimulationPanel } from '../components/SimulationPanel';
import { V10_MONTHLY, GOLD_MONTHLY } from '../data/monthlyReturns';
import type { LiveAccountFeed } from '../data/types';
import { mergeMonthly } from '../data/liveAdapters';

interface Props {
  signal: SignalStats;
  onBack: () => void;
  liveFeed?: LiveAccountFeed;
}

function venueMarkClass(label: string): string {
  if (label === 'MQL5') return 'venue-mark navy';
  if (label === 'SignalStart') return 'venue-mark gold';
  if (label === 'ZuluTrade') return 'venue-mark';
  return 'venue-mark muted';
}

function venueInitial(label: string): string {
  if (label === 'MQL5') return 'M5';
  if (label === 'SignalStart') return 'SS';
  if (label === 'ZuluTrade') return 'ZT';
  return label.slice(0, 2).toUpperCase();
}

const MQL5_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7 16V8l3 5 3-5v8M16 8v8h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MYFX_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M3 17l5-6 4 4 4-6 5 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const DOC_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M6 3h9l4 4v14H6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M14 3v5h5M9 13h7M9 17h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export function SignalDetail({ signal: s, onBack, liveFeed }: Props) {
  const color = s.id === 'gold' ? '#b89a4e' : '#0a1f3d';
  const baseMonthly = s.id === 'gold' ? GOLD_MONTHLY : V10_MONTHLY;
  const monthly = useMemo(
    () => mergeMonthly(baseMonthly, liveFeed?.monthlyByYear),
    [baseMonthly, liveFeed]
  );

  return (
    <div className="screen">
      <div className="topbar">
        <button className="back" onClick={onBack}>← Back</button>
        <span className="badge badge-pos">
          <span
            style={{
              display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
              background: '#1a6e54', marginRight: 6,
            }}
          />
          LIVE
        </span>
      </div>

      <div className="sys-hero">
        <span className="kicker">{s.broker.toUpperCase()} · #{s.brokerAccount} · {s.platform.toUpperCase()}</span>
        <h1 className="sys-hero-name">{s.name}</h1>
        <div className="sys-hero-meta">
          {s.role} · {s.currency} · Live since {s.startedOn} · {s.trackRecordYears}-year verified track record
        </div>
      </div>

      <div className="hero">
        <div className="hero-label">Gain · Myfxbook verified</div>
        <div className="hero-value mono" style={{ color }}>
          +{s.growthPct.toFixed(2)}%
        </div>
        <div className="hero-delta">
          <span className="mono" style={{ color: 'var(--muted)' }}>
            Abs gain +{s.absGainPct.toFixed(2)}% · Monthly avg {s.monthlyPct.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="section-label">
        <span>Strategy Factsheet</span>
        <span className="section-right">ETF-style profile</span>
      </div>
      <div className="factsheet-stack" style={{ marginTop: 0 }}>
        <div className="factsheet">
          <div className="factsheet-head">
            <span className="factsheet-dot" style={{ background: color }} />
            <div className="factsheet-titleblock">
              <div className="factsheet-product">{s.name}</div>
              <div className="factsheet-meta mono">
                {s.platform.toUpperCase()} · {s.currency} · #{s.myfxbookAccountId}
              </div>
            </div>
          </div>
          <div className="factsheet-cat">
            <span className="factsheet-cat-k">Allocation Category</span>
            <span className="factsheet-cat-v">{s.factsheet.category}</span>
          </div>
          <div className="factsheet-bullets">
            {s.factsheet.bullets.map((b, i) => (
              <p key={i}>{b}</p>
            ))}
          </div>
          <div className="factsheet-risk">
            <div className="factsheet-risk-h mono">RISK · MYFXBOOK VERIFIED</div>
            <div className="factsheet-risk-grid">
              <div className="factsheet-risk-cell">
                <span className="factsheet-risk-k">Verified max DD</span>
                <span className="factsheet-risk-v mono" style={{ color: 'var(--neg)' }}>
                  −{s.drawdownPct.toFixed(2)}%
                </span>
              </div>
              <div className="factsheet-risk-cell">
                <span className="factsheet-risk-k">Profit factor</span>
                <span className="factsheet-risk-v mono">{s.profitFactor.toFixed(2)}</span>
              </div>
              <div className="factsheet-risk-cell">
                <span className="factsheet-risk-k">Win rate</span>
                <span className="factsheet-risk-v mono">{s.winRatePct}%</span>
              </div>
              <div className="factsheet-risk-cell">
                <span className="factsheet-risk-k">Trades</span>
                <span className="factsheet-risk-v mono">{s.trades.toLocaleString()}</span>
              </div>
              <div className="factsheet-risk-cell">
                <span className="factsheet-risk-k">Live since</span>
                <span className="factsheet-risk-v mono">{s.startedOn}</span>
              </div>
              <div className="factsheet-risk-cell">
                <span className="factsheet-risk-k">Track record</span>
                <span className="factsheet-risk-v mono">{s.trackRecordYears}y</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-label">
        <span>Monthly Analytics</span>
        <span className="section-right">Per month</span>
      </div>
      <div className="card no-pad">
        <MonthlyAnalytics data={monthly} title={`${s.name} · Monthly gain`} />
      </div>

      <div className="section-label">
        <span>Simulation</span>
        <span className="section-right">Historical replay</span>
      </div>
      <div className="footnote sm-pad" style={{ paddingTop: 0 }}>
        Set your capital and a holding period — we replay {s.name}'s verified Myfxbook months across that window. Output is the balance a copy-trade investor funding the same amount on day one would be holding today.
      </div>
      <div className="card no-pad">
        <SimulationPanel signal={s} monthly={monthly} />
      </div>

      <div className="section-label">
        <span>Replicate</span>
        <span className="section-right">Copy-trade venues</span>
      </div>
      <div className="card" style={{ padding: 0 }}>
        <div className="venues-list">
          {s.copyVenues.map((v) => (
            <a
              key={v.href}
              href={v.href}
              target="_blank"
              rel="noreferrer"
              className="venue-row"
            >
              <span className={venueMarkClass(v.label)}>{venueInitial(v.label)}</span>
              <div className="venue-body">
                <div className="venue-name">{v.label}</div>
                <div className="venue-sub">{v.hint}</div>
              </div>
              <span className="venue-cta">Open ↗</span>
            </a>
          ))}
        </div>
      </div>
      <div className="footnote sm-pad" style={{ paddingTop: 8 }}>
        Every venue copies the same fills on IC Markets account #{s.brokerAccount} — one strategy, one ledger, no edited feed. Spreads, copier latency, and venue fees sit outside the published Myfxbook performance.
      </div>

      <div className="section-label"><span>Performance</span></div>
      <div className="card">
        <div className="stat-table">
          <div className="stat-row"><span className="stat-k">Gain</span><span className="stat-v mono" style={{ color: 'var(--pos)' }}>+{s.growthPct.toFixed(2)}%</span></div>
          <div className="stat-row"><span className="stat-k">Abs. Gain</span><span className="stat-v mono">+{s.absGainPct.toFixed(2)}%</span></div>
          <div className="stat-row"><span className="stat-k">Daily</span><span className="stat-v mono">{s.dailyPct.toFixed(2)}%</span></div>
          <div className="stat-row"><span className="stat-k">Monthly</span><span className="stat-v mono">{s.monthlyPct.toFixed(2)}%</span></div>
          <div className="stat-row"><span className="stat-k">Drawdown</span><span className="stat-v mono" style={{ color: 'var(--neg)' }}>{s.drawdownPct.toFixed(2)}%</span></div>
          <div className="stat-row"><span className="stat-k">Profit Factor</span><span className="stat-v mono">{s.profitFactor.toFixed(2)}</span></div>
          <div className="stat-row"><span className="stat-k">Win Rate</span><span className="stat-v mono">{s.winRatePct}%</span></div>
          <div className="stat-row"><span className="stat-k">Trades</span><span className="stat-v mono">{s.trades.toLocaleString()}</span></div>
          <div className="stat-row"><span className="stat-k">Balance</span><span className="stat-v mono">{s.currency} {s.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
          <div className="stat-row"><span className="stat-k">Equity</span><span className="stat-v mono">{s.currency} {s.equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
          <div className="stat-row"><span className="stat-k">Realized Profit</span><span className="stat-v mono" style={{ color: 'var(--pos)' }}>+{s.currency} {s.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
        </div>
      </div>

      <div className="section-label"><span>Instruments</span></div>
      <div className="card">
        <div className="pairs">
          {s.pairs.map(p => <span key={p} className="pair-pill mono">{p}</span>)}
        </div>
      </div>

      <div className="section-label"><span>Verification</span></div>
      <div className="card" style={{ padding: 0 }}>
        <div className="verif-list">
          <a href={s.myfxbookUrl} target="_blank" rel="noreferrer" className="verif-row clean">
            <span className="verif-icon">{MYFX_ICON}</span>
            <div className="verif-body">
              <div className="verif-name">Myfxbook</div>
              <div className="verif-sub">Primary source · live tracker</div>
            </div>
            <span className="verif-chev">↗</span>
          </a>
          <a href={s.myfxbookStatementUrl} target="_blank" rel="noreferrer" className="verif-row clean">
            <span className="verif-icon">{DOC_ICON}</span>
            <div className="verif-body">
              <div className="verif-name">Statement</div>
              <div className="verif-sub">Myfxbook · full trade ledger</div>
            </div>
            <span className="verif-chev">↗</span>
          </a>
          <a href={s.mql5Url} target="_blank" rel="noreferrer" className="verif-row clean">
            <span className="verif-icon">{MQL5_ICON}</span>
            <div className="verif-body">
              <div className="verif-name">MQL5</div>
              <div className="verif-sub">Reference · independent verification</div>
            </div>
            <span className="verif-chev">↗</span>
          </a>
        </div>
      </div>

      <div className="footnote">
        Single source of truth: {s.broker} account #{s.brokerAccount} ({s.platform} · {s.currency}), mirrored live to Myfxbook #{s.myfxbookAccountId}. No separate book, no edited history. Past performance is not indicative of future results.
      </div>
    </div>
  );
}
