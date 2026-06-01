import { SignalStats } from '../data/signals';

interface Props {
  v10: SignalStats;
  gold: SignalStats;
  onOpen: (id: 'v10' | 'gold') => void;
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

function ProductCard({ s, onOpen }: { s: SignalStats; onOpen: () => void }) {
  return (
    <button className="system-row" onClick={onOpen}>
      <div className="system-row-top">
        <div>
          <div className="system-name">{s.name}</div>
          <div className="system-role">{s.role}</div>
        </div>
        <span className={`badge ${s.id === 'gold' ? 'badge-warn' : 'badge-pos'}`}>
          +{s.growthPct.toFixed(2)}%
        </span>
      </div>
      <div className="system-row-grid">
        <div><div className="srg-k">Win</div><div className="srg-v mono">{s.winRatePct}%</div></div>
        <div><div className="srg-k">PF</div><div className="srg-v mono">{s.profitFactor}</div></div>
        <div><div className="srg-k">DD</div><div className="srg-v mono">{s.drawdownPct}%</div></div>
        <div><div className="srg-k">Trades</div><div className="srg-v mono">{s.trades.toLocaleString()}</div></div>
      </div>
      <div className="system-row-foot">
        <span className="system-pairs">{s.broker} · #{s.brokerAccount} · {s.platform} · {s.currency}</span>
        <span className="system-chev">Open →</span>
      </div>
    </button>
  );
}

export function Signals({ v10, gold, onOpen }: Props) {
  const list = [v10, gold];
  return (
    <div className="screen">
      <div className="topbar">
        <div className="topbar-l">
          <span className="kicker">MYFXBOOK · VERIFIED</span>
          <h1 className="topbar-title">Products</h1>
        </div>
      </div>

      <div className="footnote sm-pad" style={{ paddingTop: 0 }}>
        Two independent live strategies inside the TOL LANGIT ETF wrapper. Each is publicly verified on Myfxbook and mirrored on MQL5. No pooled capital and no managed accounts — investors simply copy the same broker fills you can audit on the live statement.
      </div>

      <div className="section-label">
        <span>Active Products</span>
        <span className="section-right">{list.length} listed</span>
      </div>
      <div className="systems-list">
        {list.map(s => (
          <ProductCard key={s.id} s={s} onOpen={() => onOpen(s.id)} />
        ))}
      </div>

      <div className="section-label"><span>What You're Investing In</span></div>
      <div className="card explain-card">
        <div className="explain-block">
          <div className="explain-h">
            <span className="explain-dot" style={{ background: '#0a1f3d' }} />
            {v10.name}
            <span className="explain-tag">Core</span>
          </div>
          <p className="explain-p">
            A multi-pair forex strategy that has traded live for more than five years. It spreads risk across eight major currency pairs and aims for steady, compounding growth rather than big one-off swings. Think of it as the <strong>stable core</strong> of the portfolio — the role a conservative, broadly-diversified holding plays in a serious investment book.
          </p>
        </div>
        <div className="hr h" />
        <div className="explain-block">
          <div className="explain-h">
            <span className="explain-dot" style={{ background: '#b89a4e' }} />
            {gold.name}
            <span className="explain-tag gold">Growth satellite</span>
          </div>
          <p className="explain-p">
            A specialist gold (XAUUSD) engine with an AUDCAD overlay. It targets higher returns by trading gold's volatility through strict, rules-based execution — no grid, no martingale, one position at a time. Think of it as the <strong>focused growth satellite</strong> that sits alongside the stable core for investors who want more upside and can sit through deeper swings.
          </p>
        </div>
      </div>

      <div className="section-label"><span>Why Verification Matters</span></div>
      <div className="card trust-card">
        <p className="trust-lead">
          Anyone can post screenshots or claim a winning track record. Very few can show a <strong>live, independently-tracked account that cannot be edited after the fact.</strong>
        </p>
        <p className="trust-p">
          Both TOL LANGIT products stream every trade to Myfxbook in real time and are mirrored on MQL5. The numbers on this app are not marketing — they are pulled from those same public, third-party records. If a strategy is not verified on a platform like Myfxbook or MQL5, treat its performance claims as <em>unproven</em>.
        </p>
      </div>

      <div className="section-label"><span>Verification</span></div>
      <div className="card" style={{ padding: 0 }}>
        <div className="verif-list">
          {list.map(s => (
            <div key={s.id}>
              <div className="verif-sys-h">
                <span
                  className="verif-sys-dot"
                  style={{ background: s.id === 'gold' ? '#b89a4e' : '#0a1f3d' }}
                />
                <span className="verif-sys-name">{s.name}</span>
                <span className="verif-sys-meta mono">#{s.myfxbookAccountId}</span>
              </div>
              <a href={s.myfxbookUrl} target="_blank" rel="noreferrer" className="verif-row clean">
                <span className="verif-icon">{MYFX_ICON}</span>
                <div className="verif-body">
                  <div className="verif-name">Myfxbook</div>
                  <div className="verif-sub">Primary source · live tracker</div>
                </div>
                <span className="verif-chev">↗</span>
              </a>
              {s.copyVenues.map((v) => (
                <a key={v.href} href={v.href} target="_blank" rel="noreferrer" className="verif-row clean">
                  <span className="verif-icon">{MQL5_ICON}</span>
                  <div className="verif-body">
                    <div className="verif-name">{v.label}</div>
                    <div className="verif-sub">{v.hint}</div>
                  </div>
                  <span className="verif-chev">↗</span>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="footnote">
        Trading leveraged products carries a substantial risk of loss. Historical drawdowns shown can be exceeded in future regimes — size positions accordingly.
      </div>
    </div>
  );
}
