// Shared types between client-side fallback data and the Vercel serverless sync route.

export type SyncSource = 'myfxbook-api' | 'fallback';

export interface MyfxbookAccount {
  id: number;
  name: string;
  description: string;
  accountId: string;
  gain: number;          // % gain (Myfxbook)
  absGain: number;
  daily: number;
  monthly: number;
  withdrawals: number;
  deposits: number;
  interest: number;
  profit: number;
  balance: number;
  drawdown: number;      // max DD %
  equity: number;
  equityPercent: number;
  demo: boolean;
  lastUpdateDate: string;
  creationDate: string;
  firstTradeDate: string;
  tracking: number;
  views: number;
  commission: number;
  currency: string;
  profitFactor: number;
  pips: number;
  invitationUrl: string;
  serverName: string;
  // Derived / per-signal extras
  winRatePct?: number;
  trades?: number;
  pairs?: string[];
  myfxbookUrl?: string;
  mql5Url?: string;
}

export interface SyncEnvelope {
  source: SyncSource;
  syncedAt: string;        // ISO timestamp
  accounts: MyfxbookAccount[];
  notice?: string;         // human-readable reason if fallback was used
}

export interface MyfxbookSyncResponse {
  success: boolean;
  lastUpdated?: string;
  message?: string;
  useFallback?: boolean;
  accounts?: {
    v10?: Partial<MyfxbookAccount> & { openTrades?: unknown[] };
    gold?: Partial<MyfxbookAccount> & { openTrades?: unknown[] };
  };
}
