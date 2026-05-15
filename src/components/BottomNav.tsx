export type Tab = 'home' | 'signals' | 'systems' | 'activity' | 'profile';

interface BottomNavProps {
  active: Tab;
  onChange: (t: Tab) => void;
}

const ICONS: Record<Tab, JSX.Element> = {
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 11l9-8 9 8v10a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2V11z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  signals: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 17l5-6 4 4 4-6 5 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  systems: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  activity: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 12h4l3-8 4 16 3-8h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  profile: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
};

const LABEL: Record<Tab, string> = {
  home: 'Home',
  signals: 'Products',
  systems: 'Systems',
  activity: 'Activity',
  profile: 'Profile',
};

export function BottomNav({ active, onChange }: BottomNavProps) {
  const tabs: Tab[] = ['home', 'signals', 'systems', 'activity', 'profile'];
  return (
    <nav className="botnav">
      {tabs.map(t => (
        <button
          key={t}
          className={`botnav-btn ${active === t ? 'on' : ''}`}
          onClick={() => onChange(t)}
        >
          {ICONS[t]}
          <span>{LABEL[t]}</span>
        </button>
      ))}
    </nav>
  );
}
