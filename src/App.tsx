import { useEffect, useMemo, useState } from 'react';
import { DeviceShell } from './components/DeviceShell';
import { BottomNav, Tab } from './components/BottomNav';
import { Dashboard } from './screens/Dashboard';
import { Signals } from './screens/Signals';
import { SignalDetail } from './screens/SignalDetail';
import { Systems } from './screens/Systems';
import { Activity } from './screens/Activity';
import { Guide } from './screens/Guide';
import { Profile } from './screens/Profile';
import { useMyfxbookSync } from './hooks/useMyfxbookSync';

type DetailId = 'v10' | 'gold' | null;

function formatAgo(ms: number): string {
  const sec = Math.floor(ms / 1000);
  if (sec < 30) return 'just now';
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  return `${d}d ago`;
}

export default function App() {
  const sync = useMyfxbookSync();
  const [tab, setTab] = useState<Tab>('home');
  const [detail, setDetail] = useState<DetailId>(null);
  const [, force] = useState(0);

  // Re-render the "Synced X ago" ticker every 15s
  useEffect(() => {
    const i = setInterval(() => force(n => n + 1), 15_000);
    return () => clearInterval(i);
  }, []);

  const syncedAgo = useMemo(() => formatAgo(Date.now() - sync.syncedAt.getTime()), [sync.syncedAt]);

  const openSignal = (id: 'v10' | 'gold') => {
    setDetail(id);
    setTab('signals');
  };

  const renderScreen = () => {
    if (detail) {
      const s = detail === 'v10' ? sync.v10 : sync.gold;
      const feed = detail === 'v10' ? sync.feeds.v10 : sync.feeds.gold;
      return (
        <SignalDetail
          signal={s}
          liveFeed={feed}
          source={sync.source}
          onBack={() => setDetail(null)}
        />
      );
    }
    switch (tab) {
      case 'home':
        return (
          <Dashboard
            v10={sync.v10}
            gold={sync.gold}
            syncedAgo={syncedAgo}
            source={sync.source}
            notice={sync.notice}
            loading={sync.loading}
            onSyncNow={sync.syncNow}
            onOpenSignal={openSignal}
            v10Feed={sync.feeds.v10}
            goldFeed={sync.feeds.gold}
          />
        );
      case 'signals':
        return <Signals v10={sync.v10} gold={sync.gold} onOpen={openSignal} />;
      case 'systems':
        return <Systems v10={sync.v10} gold={sync.gold} />;
      case 'activity':
        return (
          <Activity
            v10Feed={sync.feeds.v10}
            goldFeed={sync.feeds.gold}
            source={sync.source}
          />
        );
      case 'guide':
        return <Guide />;
      case 'profile':
        return <Profile />;
    }
  };

  const onTab = (t: Tab) => {
    setDetail(null);
    setTab(t);
  };

  const liveLabel = sync.source === 'myfxbook-api' ? 'LIVE · MYFXBOOK' : 'VERIFIED · MYFXBOOK';
  const headerSub = `SYNCED ${syncedAgo.toUpperCase()} · ${liveLabel}`;

  return (
    <DeviceShell>
      <div className="app">
        <header className="app-header">
          <div className="brandmark">
            <span className="brand-serif">Tol Langit ETF</span>
            <span className="brand-sub mono">{headerSub}</span>
          </div>
          <button
            className="sync-btn"
            onClick={sync.syncNow}
            disabled={sync.loading}
            aria-label="Sync from Myfxbook"
            title={sync.notice ?? 'Sync from Myfxbook'}
          >
            <span
              className={`sync-dot ${sync.loading ? 'spin' : ''}`}
              style={{ background: sync.source === 'myfxbook-api' ? '#1a6e54' : '#b89a4e' }}
            />
            <span className="sync-label mono">{sync.loading ? 'SYNCING' : 'SYNC'}</span>
          </button>
        </header>

        <div className="app-scroll" key={detail ?? tab}>
          {renderScreen()}
        </div>

        <BottomNav active={tab} onChange={onTab} />
      </div>
    </DeviceShell>
  );
}
