import { useCallback, useEffect, useRef, useState } from 'react';
import { syncFromMyfxbook, SyncResult } from '../services/myfxbook';
import { V10, GOLD } from '../data/signals';
import type { LiveAccountFeed } from '../data/types';

const DAILY_MS = 24 * 60 * 60 * 1000;

export interface SyncState {
  v10: SyncResult['signals']['v10'];
  gold: SyncResult['signals']['gold'];
  syncedAt: Date;
  source: 'myfxbook-api' | 'fallback';
  notice?: string;
  loading: boolean;
  feeds: { v10?: LiveAccountFeed; gold?: LiveAccountFeed };
}

export function useMyfxbookSync(): SyncState & { syncNow: () => Promise<void> } {
  const [state, setState] = useState<SyncState>({
    v10: V10,
    gold: GOLD,
    syncedAt: new Date(),
    source: 'fallback',
    notice: 'Initializing — showing last verified Myfxbook values.',
    loading: true,
    feeds: {},
  });
  const inflight = useRef(false);

  const syncNow = useCallback(async () => {
    if (inflight.current) return;
    inflight.current = true;
    setState(s => ({ ...s, loading: true }));
    try {
      const result = await syncFromMyfxbook();
      setState({
        v10: result.signals.v10,
        gold: result.signals.gold,
        syncedAt: new Date(result.envelope.syncedAt),
        source: result.envelope.source,
        notice: result.envelope.notice,
        loading: false,
        feeds: result.envelope.feeds,
      });
    } finally {
      inflight.current = false;
    }
  }, []);

  useEffect(() => {
    syncNow();
    const i = setInterval(syncNow, DAILY_MS);
    return () => clearInterval(i);
  }, [syncNow]);

  return { ...state, syncNow };
}
