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
            <div className="pillar-p">Every fill on broker accounts #{v10.brokerAccount} (V10) and #{gold.brokerAccount} (Gold) lands on Myfxbook within seconds. No off-book PnL, no edited history — the statement you audit is the statement you replicate.</div>
          </div>
        </div>
        <div className="hr h" />
        <div className="pillar">
          <div className="pillar-num mono">02</div>
          <div>
            <div className="pillar-h">Two uncorrelated engines</div>
            <div className="pillar-p">V10 — multi-pair FX basket on MT4 (SGD), 5-year verified live track since July 2021. ETF Gold — XAUUSD with an AUDCAD overlay on MT5 (USD). Holding both smooths each engine's drawdowns.</div>
          </div>
        </div>
        <div className="hr h" />
        <div className="pillar">
          <div className="pillar-num mono">03</div>
          <div>
            <div className="pillar-h">Discretionary risk overlay</div>
            <div className="pillar-p">When a macro regime breaks, systems are paused — never over-fitted to the last drawdown. The composite is a deliberate portfolio decision, not a black-box bet.</div>
          </div>
        </div>
      </div>

      <div className="section-label">
        <span>Open-Source Engine</span>
        <span className="section-right">
          <a
            href="https://github.com/adithyodw/LQS-AI-INSTITUTIONAL-ENGINE"
            target="_blank"
            rel="noopener noreferrer"
            className="engine-gh-link"
          >
            GitHub ↗
          </a>
        </span>
      </div>
      <div className="card engine-card">
        <div className="engine-header">
          <div className="engine-icon">⚙</div>
          <div>
            <div className="engine-title">LQS AI Institutional Engine</div>
            <div className="engine-sub">The algorithmic core powering both TOL LANGIT products</div>
          </div>
        </div>

        <div className="engine-body">
          <p className="engine-lead">
            The strategy logic is <strong>fully open source</strong>. Every rule, every risk limit, every entry and exit condition is published on GitHub — readable by anyone, auditable by everyone.
          </p>

          <div className="engine-pillars">
            <div className="engine-pillar">
              <div className="engine-pillar-icon">🔓</div>
              <div>
                <div className="engine-pillar-h">No Black Box</div>
                <div className="engine-pillar-p">The code that runs on the broker is the same code on GitHub. You can read exactly what the EA does before investing a single dollar.</div>
              </div>
            </div>
            <div className="engine-pillar">
              <div className="engine-pillar-icon">🏦</div>
              <div>
                <div className="engine-pillar-h">Institutional-Grade Risk</div>
                <div className="engine-pillar-p">Built with the same risk management concepts used by professional funds — dynamic position sizing, volatility-adjusted lot calculation, and hard drawdown limits built in at the code level.</div>
              </div>
            </div>
            <div className="engine-pillar">
              <div className="engine-pillar-icon">🤖</div>
              <div>
                <div className="engine-pillar-h">AI-Assisted Regime Detection</div>
                <div className="engine-pillar-p">The engine reads market structure in real time — ranging vs. trending, low vs. high volatility. It adapts its behaviour to fit current conditions rather than using fixed rules that break during market regime shifts.</div>
              </div>
            </div>
            <div className="engine-pillar">
              <div className="engine-pillar-icon">📐</div>
              <div>
                <div className="engine-pillar-h">Equity-Scaled Sizing</div>
                <div className="engine-pillar-p">Lot sizes are calculated as a fraction of your live equity — they grow automatically as your account grows. No manual adjustments needed when you top up monthly.</div>
              </div>
            </div>
          </div>

          <div className="engine-why">
            <div className="engine-why-title">Why does open source matter for an investor?</div>
            <p className="engine-why-body">
              Most trading products hide their strategy. You're asked to trust a track record without seeing why it works. With LQS AI, you can verify the logic yourself — or have any developer do it for you. The Myfxbook statement proves <em>what</em> happened; the GitHub repo proves <em>how and why</em>.
            </p>
            <a
              href="https://github.com/adithyodw/LQS-AI-INSTITUTIONAL-ENGINE"
              target="_blank"
              rel="noopener noreferrer"
              className="engine-gh-btn"
            >
              View Source on GitHub ↗
            </a>
          </div>
        </div>
      </div>

      <div className="footnote">
        Indicative exposure over the trailing 90 trading days, read from the live broker statement. Real-time exposure rebalances on every fill — this view is a snapshot, not a fixed mandate.
      </div>
    </div>
  );
}
