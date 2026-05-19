// Honest sync-state badge.
//
// Shows LIVE (green, pulsing) only when the data genuinely came from the
// Myfxbook API this session. When the app is running on the verified static
// fallback it shows VERIFIED (gold, steady) — it never claims "live" when it
// is not.

interface SyncBadgeProps {
  source: 'myfxbook-api' | 'fallback';
}

export function SyncBadge({ source }: SyncBadgeProps) {
  const isLive = source === 'myfxbook-api';
  return (
    <span className={`badge ${isLive ? 'badge-pos' : 'badge-warn'}`}>
      <span
        className="sync-badge-dot"
        style={{
          display: 'inline-block',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: isLive ? '#1a6e54' : '#b89a4e',
          marginRight: 6,
          animation: isLive ? 'pulse 1.6s infinite' : 'none',
        }}
      />
      {isLive ? 'LIVE' : 'VERIFIED'}
    </span>
  );
}
