import { SignalStats } from '../data/signals';
import { AllocDonut } from '../components/AllocDonut';

interface Props {
  v10: SignalStats;
  gold: SignalStats;
}

// ETF composite (50/50 weight): each product's instrument exposures halved.
const BLENDED_ALLOC = [
  { pair: 'XAUUSD', weight: 42, color: '#caa64a' },
  { pair: 'EURUSD', weight: 12, color: '#0a1f3d' },
  { pair: 'GBPUSD', weight: 9, color: '#1a6e54' },
  { pair: 'AUDCAD', weight: 8, color: '#7E6BAE' },
  { pair: 'USDJPY', weight: 7, color: '#b89a4e' },
  { pair: 'AUDUSD', weight: 6, color: '#6b6862' },
  { pair: 'USDCAD', weight: 5, color: '#a83a3a' },
  { pair: 'AUDNZD', weight: 4.5, color: '#D97B7B' },
  { pair: 'EURGBP', weight: 3.5, color: '#5B8DBE' },
  { pair: 'NZDCAD', weight: 3, color: '#3DA38A' },
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

      <div className="section-label"><span>{v10.name} — FX basket</span></div>
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

      <div className="section-label"><span>{gold.name} — XAUUSD + AUDCAD</span></div>
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
            <div className="pillar-p">Every fill on broker accounts #{v10.brokerAccount} (V10) and #{gold.brokerAccount} (Gold) is mirrored to Myfxbook. There is no off-book PnL.</div>
          </div>
        </div>
        <div className="hr h" />
        <div className="pillar">
          <div className="pillar-num mono">02</div>
          <div>
            <div className="pillar-h">Two uncorrelated engines</div>
            <div className="pillar-p">V10 grids FX majors on MT4 in SGD; ETF Gold trades XAUUSD with an AUDCAD overlay on MT5 in USD. The composite smooths the drawdowns of either engine alone.</div>
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
        Allocation weights are indicative exposures over the trailing 90 days. Real-time exposure rebalances continuously on each fill.
      </div>
    </div>
  );
}
