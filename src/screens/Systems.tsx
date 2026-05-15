import { SignalStats } from '../data/signals';
import { AllocDonut } from '../components/AllocDonut';

interface Props {
  v10: SignalStats;
  gold: SignalStats;
}

// Blended ETF allocation: half-weighted across the two underlying signal allocations.
const BLENDED_ALLOC = [
  { pair: 'EURUSD', weight: 16, color: '#0a1f3d' },
  { pair: 'GBPUSD', weight: 12, color: '#1a6e54' },
  { pair: 'USDJPY', weight: 9, color: '#b89a4e' },
  { pair: 'AUDUSD', weight: 7, color: '#6b6862' },
  { pair: 'USDCAD', weight: 6, color: '#a83a3a' },
  { pair: 'XAUUSD', weight: 50, color: '#caa64a' },
];

export function Systems({ v10, gold }: Props) {
  return (
    <div className="screen">
      <div className="topbar">
        <div className="topbar-l">
          <span className="kicker">PORTFOLIO · COMPOSITION</span>
          <h1 className="topbar-title">Systems</h1>
        </div>
      </div>

      <div className="section-label">
        <span>Composite Allocation</span>
        <span className="section-right">By instrument</span>
      </div>
      <div className="card alloc-card">
        <AllocDonut data={BLENDED_ALLOC} />
        <div className="alloc-legend">
          {BLENDED_ALLOC.map(s => (
            <div key={s.pair} className="alloc-leg-row">
              <span className="alloc-leg-dot" style={{ background: s.color }} />
              <span className="alloc-leg-name">{s.pair}</span>
              <span className="alloc-leg-w mono">{s.weight}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section-label"><span>{v10.name} — FX Basket</span></div>
      <div className="card alloc-card">
        <AllocDonut data={v10.pairAllocation} size={108} thickness={16} />
        <div className="alloc-legend">
          {v10.pairAllocation.map(s => (
            <div key={s.pair} className="alloc-leg-row">
              <span className="alloc-leg-dot" style={{ background: s.color }} />
              <span className="alloc-leg-name">{s.pair}</span>
              <span className="alloc-leg-w mono">{s.weight}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section-label"><span>{gold.name} — Single Instrument</span></div>
      <div className="card alloc-card">
        <AllocDonut data={gold.pairAllocation} size={108} thickness={16} />
        <div className="alloc-legend">
          {gold.pairAllocation.map(s => (
            <div key={s.pair} className="alloc-leg-row">
              <span className="alloc-leg-dot" style={{ background: s.color }} />
              <span className="alloc-leg-name">{s.pair}</span>
              <span className="alloc-leg-w mono">{s.weight}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section-label"><span>Strategy Pillars</span></div>
      <div className="card pillars" style={{ padding: 0 }}>
        <div className="pillar">
          <div className="pillar-num mono">01</div>
          <div>
            <div className="pillar-h">Myfxbook-verified execution</div>
            <div className="pillar-p">Every fill is mirrored to Myfxbook and shadow-tracked on MQL5. There is no off-book PnL.</div>
          </div>
        </div>
        <div className="hr h" />
        <div className="pillar">
          <div className="pillar-num mono">02</div>
          <div>
            <div className="pillar-h">Two uncorrelated engines</div>
            <div className="pillar-p">V10 grids FX majors; ETF Gold trades XAUUSD volatility. The composite smooths the drawdowns of either engine alone.</div>
          </div>
        </div>
        <div className="hr h" />
        <div className="pillar">
          <div className="pillar-num mono">03</div>
          <div>
            <div className="pillar-h">Discretionary risk overlay</div>
            <div className="pillar-p">Macro regime shifts trigger manual de-risking. Systems are paused, not over-fit.</div>
          </div>
        </div>
      </div>

      <div className="footnote">
        Allocation weights are indicative of instrument exposure over the trailing 90 days. Real-time exposure rebalances continuously on each fill.
      </div>
    </div>
  );
}
