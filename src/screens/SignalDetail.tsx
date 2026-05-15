import { useMemo } from 'react';
import { SignalStats, buildEquityCurve } from '../data/signals';
import { EquityChart } from '../components/EquityChart';

interface Props {
  signal: SignalStats;
  onBack: () => void;
}

export function SignalDetail({ signal: s, onBack }: Props) {
  const curve = useMemo(
    () => buildEquityCurve(1000, s.growthPct, 36, s.id === 'gold' ? 3 : 11),
    [s]
  );

  const color = s.id === 'gold' ? '#b89a4e' : '#0a1f3d';

  return (
    <div className="screen">
      <div className="topbar">
        <button className="back" onClick={onBack}>← Back</button>
        <span className="badge badge-pos">
          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#1a6e54', marginRight: 6 }} />
          LIVE
        </span>
      </div>

      <div className="sys-hero">
        <span className="kicker">{s.broker.toUpperCase()} · {s.account}</span>
        <h1 className="sys-hero-name">{s.name}</h1>
        <div className="sys-hero-meta">{s.role} · Started {s.startedOn}</div>
      </div>

      <div className="hero">
        <div className="hero-label">Gain · Myfxbook verified</div>
        <div className="hero-value mono" style={{ color }}>
          +{s.growthPct.toFixed(2)}%
        </div>
        <div className="hero-delta">
          <span className="mono" style={{ color: 'var(--muted)' }}>
            MQL5 growth +{s.mql5GrowthPct.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="card no-pad">
        <EquityChart data={curve} color={color} height={180} />
        <div className="hr" />
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px 8px', fontSize: 10.5, color: 'var(--muted)' }}>
          <span className="mono">Last update {s.lastUpdate}</span>
          <span className="mono">Model curve</span>
        </div>
      </div>

      <div className="section-label"><span>Performance</span></div>
      <div className="card">
        <div className="stat-table">
          <div className="stat-row"><span className="stat-k">Win Rate</span><span className="stat-v mono">{s.winRatePct}%</span></div>
          <div className="stat-row"><span className="stat-k">Profit Factor</span><span className="stat-v mono">{s.profitFactor}</span></div>
          <div className="stat-row"><span className="stat-k">Trades</span><span className="stat-v mono">{s.trades.toLocaleString()}</span></div>
          <div className="stat-row"><span className="stat-k">Max Drawdown</span><span className="stat-v mono" style={{ color: 'var(--neg)' }}>{s.drawdownPct}%</span></div>
          <div className="stat-row"><span className="stat-k">Monthly Avg</span><span className="stat-v mono">+{s.monthlyPct}%</span></div>
          <div className="stat-row"><span className="stat-k">Balance</span><span className="stat-v mono">{s.currency} {s.balance.toLocaleString()}</span></div>
          <div className="stat-row"><span className="stat-k">Equity</span><span className="stat-v mono">{s.currency} {s.equity.toLocaleString()}</span></div>
          <div className="stat-row"><span className="stat-k">Realized Profit</span><span className="stat-v mono" style={{ color: 'var(--pos)' }}>+{s.currency} {s.profit.toLocaleString()}</span></div>
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
          <a href={s.mql5Url} target="_blank" rel="noreferrer" className="verif-row">
            <div>
              <div className="verif-name">MQL5 Signal Page</div>
              <div className="verif-href mono">{s.mql5Url.replace('https://', '')}</div>
            </div>
            <span className="verif-chev">↗</span>
          </a>
          <a href={s.myfxbookUrl} target="_blank" rel="noreferrer" className="verif-row">
            <div>
              <div className="verif-name">Myfxbook Tracker</div>
              <div className="verif-href mono">{s.myfxbookUrl.replace('https://', '')}</div>
            </div>
            <span className="verif-chev">↗</span>
          </a>
        </div>
      </div>

      <div className="footnote">
        All metrics are pulled from the publicly verified MQL5 signal and shadow-tracked on Myfxbook. Past performance is not a guarantee of future results.
      </div>
    </div>
  );
}
