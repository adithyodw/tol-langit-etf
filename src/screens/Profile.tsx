import { OPERATOR, V10, GOLD, type SignalStats } from '../data/signals';

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

interface VerifRow {
  label: string;
  sub: string;
  href: string;
  icon: JSX.Element;
}

function buildProductRails(s: SignalStats): VerifRow[] {
  return [
    { label: 'Myfxbook', sub: 'Primary live tracker · single source of truth', href: s.myfxbookUrl, icon: MYFX_ICON },
    ...s.copyVenues.map<VerifRow>((v) => ({
      label: v.label,
      sub: v.hint,
      href: v.href,
      icon: v.label === 'MQL5' ? MQL5_ICON : GENERIC_ICON,
    })),
  ];
}

const PRODUCT_GROUPS: Array<{
  signal: SignalStats;
  accent: string;
  rails: VerifRow[];
}> = [
  { signal: V10, accent: '#0a1f3d', rails: buildProductRails(V10) },
  { signal: GOLD, accent: '#b89a4e', rails: buildProductRails(GOLD) },
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
        <p>Two live, ETF-style products, both verified on Myfxbook from the very first fill. No pooled capital, no managed accounts, no marketing track — only transparent broker execution you can audit before you replicate a single position.</p>
        <div className="positioning-cite mono">— {OPERATOR.name.toUpperCase()}</div>
      </div>

      <div className="section-label">
        <span>Verified Track Record</span>
        <span className="section-right">Myfxbook + copy rails</span>
      </div>
      <div className="card" style={{ padding: 0 }}>
        <div className="verif-list">
          {PRODUCT_GROUPS.map((g) => (
            <div key={g.signal.id}>
              <div className="verif-sys-h">
                <span className="verif-sys-dot" style={{ background: g.accent }} />
                <span className="verif-sys-name">{g.signal.name}</span>
                <span className="verif-sys-meta mono">#{g.signal.myfxbookAccountId}</span>
              </div>
              {g.rails.map((r) => (
                <a
                  key={r.href}
                  href={r.href}
                  target="_blank"
                  rel="noreferrer"
                  className="verif-row clean"
                >
                  <span className="verif-icon">{r.icon}</span>
                  <div className="verif-body">
                    <div className="verif-name">{r.label}</div>
                    <div className="verif-sub">{r.sub}</div>
                  </div>
                  <span className="verif-chev">↗</span>
                </a>
              ))}
            </div>
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
        Disclosure — the IC Markets link is an affiliate code. It does not change your spreads, your commissions, or how the strategy executes on your account.
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
        <p><span className="mono">01</span><span>Trading leveraged FX and CFDs carries a substantial risk of loss and is not suitable for every investor. Capital can be lost in full.</span></p>
        <p><span className="mono">02</span><span>Past performance — including all Myfxbook, MQL5, SignalStart, and ZuluTrade figures shown — is not indicative of future results. The Simulation tool is a historical replay, not a forecast.</span></p>
        <p><span className="mono">03</span><span>V10 has historically experienced drawdowns above 70% of equity. Size positions accordingly and never replicate beyond your personal loss tolerance.</span></p>
        <p><span className="mono">04</span><span>Copy execution remains the subscriber's responsibility. The operator does not custody client funds and is not authorised to accept discretionary mandates.</span></p>
      </div>

      <div className="footnote">© 2026 TOL LANGIT · For institutional and qualified retail reference only.</div>
    </div>
  );
}
