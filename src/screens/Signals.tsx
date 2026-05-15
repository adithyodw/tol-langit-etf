import { SignalStats } from '../data/signals';

interface Props {
  v10: SignalStats;
  gold: SignalStats;
  onOpen: (id: 'v10' | 'gold') => void;
}

function SignalCard({ s, onOpen }: { s: SignalStats; onOpen: () => void }) {
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
        <span className="system-pairs">{s.broker} · {s.account}</span>
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
          <h1 className="topbar-title">Signals</h1>
        </div>
      </div>

      <div className="footnote sm-pad" style={{ paddingTop: 0 }}>
        Two independent live trading signals. Each one is publicly verified on Myfxbook with shadow tracking on MQL5. No private capital, no managed accounts.
      </div>

      <div className="section-label">
        <span>Active Signals</span>
        <span className="section-right">{list.length} listed</span>
      </div>
      <div className="systems-list">
        {list.map(s => (
          <SignalCard key={s.id} s={s} onOpen={() => onOpen(s.id)} />
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
                <span className="verif-sys-meta mono">{s.account}</span>
              </div>
              <a href={s.myfxbookUrl} target="_blank" rel="noreferrer" className="verif-row">
                <div>
                  <div className="verif-name">Myfxbook · Primary</div>
                  <div className="verif-href mono">{s.myfxbookUrl.replace('https://', '')}</div>
                </div>
                <span className="verif-chev">↗</span>
              </a>
              <a href={s.mql5Url} target="_blank" rel="noreferrer" className="verif-row">
                <div>
                  <div className="verif-name">MQL5 · Reference</div>
                  <div className="verif-href mono">{s.mql5Url.replace('https://', '')}</div>
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
