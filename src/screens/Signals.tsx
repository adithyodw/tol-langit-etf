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
        Two independent live ETF products inside the TOL LANGIT ETF wrapper. Each one is publicly verified on Myfxbook with shadow tracking on MQL5. No private capital pooling, no managed accounts.
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
              <a href={s.mql5Url} target="_blank" rel="noreferrer" className="verif-row clean">
                <span className="verif-icon">{MQL5_ICON}</span>
                <div className="verif-body">
                  <div className="verif-name">MQL5</div>
                  <div className="verif-sub">Reference · independent verification</div>
                </div>
                <span className="verif-chev">↗</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="footnote">
        Trading leveraged products carries significant risk of loss. Drawdowns shown are historical and may be exceeded in future market regimes.
      </div>
    </div>
  );
}
