import { OPERATOR, V10, GOLD } from '../data/signals';

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

const GENERIC_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const VERIF_LINKS = [
  { name: 'TOL LANGIT V10', sub: 'Myfxbook · Live tracker', href: V10.myfxbookUrl, icon: MYFX_ICON },
  { name: 'TOL LANGIT ETF GOLD', sub: 'Myfxbook · Live tracker', href: GOLD.myfxbookUrl, icon: MYFX_ICON },
  { name: 'TOL LANGIT V10', sub: 'MQL5 · Reference', href: V10.mql5Url, icon: MQL5_ICON },
  { name: 'TOL LANGIT ETF GOLD', sub: 'MQL5 · Reference', href: GOLD.mql5Url, icon: MQL5_ICON },
];

const OP_LINKS = [
  { name: 'GitHub', sub: 'Open-source · code & infra', href: OPERATOR.links.github },
  { name: 'LinkedIn', sub: 'Professional history', href: OPERATOR.links.linkedin },
  { name: 'MQL5 Profile', sub: 'All published products', href: OPERATOR.links.mql5 },
  { name: 'Myfxbook Profile', sub: 'All tracked accounts', href: OPERATOR.links.myfxbook },
  { name: 'Telegram', sub: 'Channel announcements', href: OPERATOR.links.telegram },
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
        <p>Two live ETF products, fully verified on Myfxbook. No pooled capital, no managed accounts — just transparent execution you can copy or audit.</p>
        <div className="positioning-cite mono">— {OPERATOR.name.toUpperCase()}</div>
      </div>

      <div className="section-label"><span>Verified Track Record</span></div>
      <div className="card" style={{ padding: 0 }}>
        <div className="verif-list">
          {VERIF_LINKS.map(l => (
            <a key={l.href + l.sub} href={l.href} target="_blank" rel="noreferrer" className="verif-row clean">
              <span className="verif-icon">{l.icon}</span>
              <div className="verif-body">
                <div className="verif-name">{l.name}</div>
                <div className="verif-sub">{l.sub}</div>
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
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="verif-row clean">
              <span className="verif-icon">{GENERIC_ICON}</span>
              <div className="verif-body">
                <div className="verif-name">{l.name}</div>
                <div className="verif-sub">{l.sub}</div>
              </div>
              <span className="verif-chev">↗</span>
            </a>
          ))}
        </div>
      </div>

      <div className="section-label"><span>Risk Disclosure</span></div>
      <div className="card disclosure">
        <p><span className="mono">01</span><span>Trading leveraged FX and CFDs carries a substantial risk of loss and is not suitable for every investor.</span></p>
        <p><span className="mono">02</span><span>Past performance, including the Myfxbook and MQL5 figures shown, is not indicative of future results.</span></p>
        <p><span className="mono">03</span><span>V10 has historically experienced drawdowns of 70%+ on equity. Position size accordingly.</span></p>
        <p><span className="mono">04</span><span>Copy execution is the subscriber's responsibility. The operator does not custody client funds.</span></p>
      </div>

      <div className="footnote">© 2026 TOL LANGIT · For institutional and qualified retail reference only.</div>
    </div>
  );
}
