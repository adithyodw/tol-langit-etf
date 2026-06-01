import { SignalStats } from '../data/signals';
import { AllocDonut } from '../components/AllocDonut';

interface Props {
  v10: SignalStats;
  gold: SignalStats;
}

// ── Clean institutional stroke icons (no emoji) ──────────────────────────
const ICON_PROPS = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const IconLayers = (
  <svg {...ICON_PROPS}><path d="M12 3 3 8l9 5 9-5-9-5Z" /><path d="m3 13 9 5 9-5" /><path d="m3 16.5 9 5 9-5" opacity="0.5" /></svg>
);
const IconCpu = (
  <svg {...ICON_PROPS}><rect x="5" y="5" width="14" height="14" rx="2" /><rect x="9" y="9" width="6" height="6" rx="1" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" /></svg>
);
const IconShield = (
  <svg {...ICON_PROPS}><path d="M12 3 5 6v5c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>
);
const IconScale = (
  <svg {...ICON_PROPS}><path d="M4 20h16" /><path d="M7 20v-6M12 20V8M17 20v-9" /><path d="M5 11h4M10 5h4M15 8h4" opacity="0.5" /></svg>
);
const IconCode = (
  <svg {...ICON_PROPS}><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" /></svg>
);
const IconLedger = (
  <svg {...ICON_PROPS}><path d="M6 3h9l4 4v14H6z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 16.5h6" opacity="0.7" /></svg>
);

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
            <div className="pillar-h">Multi-module signal fusion</div>
            <div className="pillar-p">Five independent engines score every setup — institutional liquidity-sweep mapping, cumulative order-flow and absorption, Wyckoff accumulation/distribution, and multi-timeframe anchored VWAP. A trade is only considered when these modules reach consensus, not on a single indicator.</div>
          </div>
        </div>
        <div className="hr h" />
        <div className="pillar">
          <div className="pillar-num mono">02</div>
          <div>
            <div className="pillar-h">AI as a risk filter, not a fortune-teller</div>
            <div className="pillar-p">A 7-feature online logistic-regression layer with a Shannon-entropy market-quality gate sits on top of the modules. It never picks direction on its own — it screens out noisy, low-probability conditions and modulates risk. Learning only activates after a minimum live-trade sample.</div>
          </div>
        </div>
        <div className="hr h" />
        <div className="pillar">
          <div className="pillar-num mono">03</div>
          <div>
            <div className="pillar-h">Single-position institutional risk</div>
            <div className="pillar-p">One open position at a time, 1–3% risk per trade, broker stop/freeze-level aware, with daily loss limits. Size is volatility-adjusted and can scale via Bayesian Kelly from the account's own win-rate and reward history — discipline enforced in code, not emotion.</div>
          </div>
        </div>
        <div className="hr h" />
        <div className="pillar">
          <div className="pillar-num mono">04</div>
          <div>
            <div className="pillar-h">Verifiable by design</div>
            <div className="pillar-p">Every fill on broker accounts #{v10.brokerAccount} (V10) and #{gold.brokerAccount} (Gold) streams to Myfxbook within seconds, and a full JSON journal records each module's score, AI confidence, regime and P&L. The statement you audit is the statement you replicate.</div>
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
          <div className="engine-icon">{IconCpu}</div>
          <div>
            <div className="engine-title">LQS AI Institutional Engine</div>
            <div className="engine-sub">Open-source algorithmic core · v5.0 · powering both products</div>
          </div>
        </div>

        <div className="engine-body">
          <p className="engine-lead">
            The strategy logic is <strong>fully open source</strong>. Every rule, risk limit, entry and exit condition is published on GitHub — readable by anyone, auditable by everyone.
          </p>

          <div className="engine-pillars">
            <div className="engine-pillar">
              <div className="engine-pillar-icon">{IconLayers}</div>
              <div>
                <div className="engine-pillar-h">Five-module signal fusion</div>
                <div className="engine-pillar-p">Liquidity sweeps, order flow, Wyckoff phases and anchored VWAP must align before any entry. No single indicator can fire a trade on its own.</div>
              </div>
            </div>
            <div className="engine-pillar">
              <div className="engine-pillar-icon">{IconCpu}</div>
              <div>
                <div className="engine-pillar-h">AI decision layer</div>
                <div className="engine-pillar-p">A logistic-regression model with a Shannon-entropy filter screens out noisy, low-probability markets. It adjusts risk — it never overrides the strategy's direction.</div>
              </div>
            </div>
            <div className="engine-pillar">
              <div className="engine-pillar-icon">{IconShield}</div>
              <div>
                <div className="engine-pillar-h">Institutional risk control</div>
                <div className="engine-pillar-p">One position at a time, 1–3% risk per trade, daily loss limits and broker-aware stop handling. Drawdown discipline is built into the code, not left to emotion.</div>
              </div>
            </div>
            <div className="engine-pillar">
              <div className="engine-pillar-icon">{IconScale}</div>
              <div>
                <div className="engine-pillar-h">Equity-scaled sizing</div>
                <div className="engine-pillar-p">Lot size is a fixed fraction of live equity (e.g. 0.01 lot per $1,000), so exposure grows as the account grows and contracts automatically in drawdown.</div>
              </div>
            </div>
            <div className="engine-pillar">
              <div className="engine-pillar-icon">{IconLedger}</div>
              <div>
                <div className="engine-pillar-h">Full audit trail</div>
                <div className="engine-pillar-p">Every trade writes a JSON record — module scores, AI confidence, entry/exit, regime and P&L — so performance can be independently reviewed, not just claimed.</div>
              </div>
            </div>
          </div>

          <div className="engine-why">
            <div className="engine-why-title">
              <span className="engine-why-icon">{IconCode}</span>
              Why open source matters for an investor
            </div>
            <p className="engine-why-body">
              Most trading products hide their strategy. You're asked to trust a track record without seeing why it works. With LQS AI you can verify the logic yourself — or have any developer do it for you. The Myfxbook statement proves <em>what</em> happened; the open repository proves <em>how and why</em>.
            </p>
            <a
              href="https://github.com/adithyodw/LQS-AI-INSTITUTIONAL-ENGINE"
              target="_blank"
              rel="noopener noreferrer"
              className="engine-gh-btn"
            >
              View source on GitHub ↗
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
