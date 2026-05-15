import { ReactNode } from 'react';

interface DeviceShellProps {
  children: ReactNode;
}

export function DeviceShell({ children }: DeviceShellProps) {
  return (
    <div className="host">
      <div className="host-meta">
        <span>TOL LANGIT ETF</span>
        Institutional · iOS · 6.7"
      </div>

      <div
        className="device-shell"
        style={{
          width: 402,
          height: 870,
          borderRadius: 48,
          overflow: 'hidden',
          position: 'relative',
          background: '#f6f4ee',
          boxShadow:
            '0 40px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06), inset 0 0 0 2px rgba(0,0,0,0.4)',
        }}
      >
        <div
          className="island"
          style={{
            position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
            width: 126, height: 37, borderRadius: 24, background: '#000', zIndex: 50,
          }}
        />
        <div
          className="fake-statusbar"
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, zIndex: 40,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '18px 32px 0',
            fontFamily: '-apple-system, system-ui',
            fontSize: 15, fontWeight: 600, color: '#000',
          }}
        >
          <span>9:41</span>
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <svg width="17" height="11" viewBox="0 0 17 11">
              <rect x="0" y="7" width="2.5" height="4" rx="0.5" fill="#000" />
              <rect x="4" y="5" width="2.5" height="6" rx="0.5" fill="#000" />
              <rect x="8" y="3" width="2.5" height="8" rx="0.5" fill="#000" />
              <rect x="12" y="1" width="2.5" height="10" rx="0.5" fill="#000" />
            </svg>
            <svg width="25" height="11" viewBox="0 0 25 11">
              <rect x="0.5" y="0.5" width="21" height="10" rx="2.5" stroke="#000" strokeOpacity="0.35" fill="none" />
              <rect x="2" y="2" width="18" height="7" rx="1.5" fill="#000" />
              <path d="M23 4v3c0.6 -0.2 1 -0.8 1 -1.5C24 4.8 23.6 4.2 23 4z" fill="#000" fillOpacity="0.4" />
            </svg>
          </span>
        </div>

        <div style={{ width: '100%', height: '100%' }}>{children}</div>

        <div
          className="home-ind"
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 60,
            height: 34, display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
            paddingBottom: 8, pointerEvents: 'none',
          }}
        >
          <div style={{ width: 139, height: 5, borderRadius: 100, background: 'rgba(0,0,0,0.25)' }} />
        </div>
      </div>

      <div className="host-tag">v1.0 · Live signal preview · May 2026</div>
    </div>
  );
}
