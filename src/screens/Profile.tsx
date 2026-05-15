import { OPERATOR, V10, GOLD } from '../data/signals';

const VERIF_LINKS = [
  { name: 'MQL5 · V10 Signal', href: V10.mql5Url },
  { name: 'MQL5 · ETF Gold Signal', href: GOLD.mql5Url },
  { name: 'Myfxbook · V10', href: V10.myfxbookUrl },
  { name: 'Myfxbook · ETF Gold', href: GOLD.myfxbookUrl },
];

const OP_LINKS = [
  { name: 'GitHub', href: OPERATOR.links.github },
  { name: 'LinkedIn', href: OPERATOR.links.linkedin },
  { name: 'MQL5 Profile', href: OPERATOR.links.mql5 },
  { name: 'Myfxbook Profile', href: OPERATOR.links.myfxbook },
  { name: 'Telegram', href: OPERATOR.links.telegram },
];

export function Profile() {
  return (
    <div className="screen">
      <div className="topbar">
        <div className="topbar-l">
          <span className="kicker">OPERATOR · TRANSPARENCY</span>
          <h1 className="topbar-title">Profile</h1>
        </div>
      </div>

      <div className="op-card">
        <div className="op-mono">{OPERATOR.initials}</div>
        <div className="op-name">{OPERATOR.name}</div>
        <div className="op-handle mono">{OPERATOR.handle}</div>
        <div className="op-role">{OPERATOR.role}</div>
      </div>

      <div className="thesis op-bio">
        <p>{OPERATOR.bio}</p>
      </div>

      <div className="positioning">
        <div className="positioning-mark">"</div>
        <p>Two live signals, fully verified. No pooled capital, no managed accounts — just transparent execution you can copy or audit.</p>
        <div className="positioning-cite mono">— {OPERATOR.name.toUpperCase()}</div>
      </div>

      <div className="section-label"><span>Verified Track Record</span></div>
      <div className="card" style={{ padding: 0 }}>
        <div className="verif-list">
          {VERIF_LINKS.map(l => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="verif-row">
              <div>
                <div className="verif-name">{l.name}</div>
                <div className="verif-href mono">{l.href.replace('https://', '')}</div>
              </div>
              <span className="verif-chev">↗</span>
            </a>
          ))}
        </div>
      </div>

      <div className="section-label"><span>Broker</span></div>
      <a className="broker-card" href={OPERATOR.links.icMarkets} target="_blank" rel="noreferrer">
        <div className="broker-mark"><span className="broker-mark-text">IC</span></div>
        <div>
          <div className="broker-name">IC Markets</div>
          <div className="broker-role">Recommended execution venue · raw spreads</div>
          <div className="broker-meta">
            <span className="broker-reg mono">ASIC · CYSEC · FSA</span>
            <span className="badge mono">PARTNER LINK</span>
          </div>
        </div>
        <span className="verif-chev">↗</span>
      </a>
      <div className="footnote sm-pad">
        Disclosure: the IC Markets link is an affiliate code. It does not change your spreads or commissions.
      </div>

      <div className="section-label"><span>Connect</span></div>
      <div className="card" style={{ padding: 0 }}>
        <div className="verif-list">
          {OP_LINKS.map(l => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="verif-row">
              <div>
                <div className="verif-name">{l.name}</div>
                <div className="verif-href mono">{l.href.replace('https://', '')}</div>
              </div>
              <span className="verif-chev">↗</span>
            </a>
          ))}
        </div>
      </div>

      <div className="section-label"><span>Risk Disclosure</span></div>
      <div className="card disclosure">
        <p><span className="mono">01</span><span>Trading leveraged FX and CFDs carries a substantial risk of loss and is not suitable for every investor.</span></p>
        <p><span className="mono">02</span><span>Past performance, including the MQL5 and Myfxbook figures shown, is not indicative of future results.</span></p>
        <p><span className="mono">03</span><span>V10 has historically experienced drawdowns of 70%+ on equity. Position size accordingly.</span></p>
        <p><span className="mono">04</span><span>Signal copy execution is the subscriber's responsibility. The operator does not custody client funds.</span></p>
      </div>

      <div className="footnote">© 2026 TOL LANGIT · For institutional and qualified retail reference only.</div>
    </div>
  );
}
