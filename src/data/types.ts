// Shared types between client-side fallback data and the Vercel serverless sync route.

export type SyncSource = 'myfxbook-api' | 'fallback';

export type TradeSide = 'BUY' | 'SELL' | 'BAL';
export type TradeStatus = 'open' | 'closed';
export type OrderType = 'LIMIT' | 'STOP' | 'OTHER';

export interface LiveTrade {
  ticket: string;
  magicNumber: string;
  symbol: string;
  side: TradeSide;
  status: TradeStatus;
  openTime: string;            // ISO timestamp
  closeTime: string | null;    // ISO timestamp (null when status === 'open')
  openPrice: number;
  closePrice: number | null;
  lots: number;
  pips: number;
  profit: number;
  sl: number | null;
  tp: number | null;
  swap: number | null;
  commission: number | null;
  comment?: string;
  productId?: 'v10' | 'gold';  // attached client-side
  currency?: string;           // attached client-side
}

export interface LiveOrder {
  ticket: string;
  magicNumber: string;
  symbol: string;
  action: string;
  side: 'BUY' | 'SELL';
  type: OrderType;
  openTime: string;
  openPrice: number;
  lots: number;
  sl: number | null;
  tp: number | null;
  comment?: string;
  productId?: 'v10' | 'gold';
}

export interface LiveAccountSummary {
  balance: number;
  equity: number;
  profit: number;
  deposits: number;
  withdrawals: number;
  commission: number;
  interest: number;
  pips: number;
  drawdown: number;
  gain: number;
  absGain: number;
  daily: number;
  monthly: number;
  profitFactor: number;
  trades: number;
  winRatePct: number;
  currency: string;
  server: string;
  creationDate: string;
  firstTradeDate: string;
  lastUpdateDate: string;
}

export type LiveMonthlyByYear = Record<string, Record<string, number>>;

export interface LiveAccountFeed {
  productId: 'v10' | 'gold';
  open: LiveTrade[];
  orders: LiveOrder[];
  history: LiveTrade[];
  monthlyByYear: LiveMonthlyByYear;
  summary?: LiveAccountSummary;
}

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
  feeds: { v10?: LiveAccountFeed; gold?: LiveAccountFeed };
  notice?: string;         // human-readable reason if fallback was used
}

export interface MyfxbookSyncAccount extends Partial<MyfxbookAccount> {
  openTrades?: LiveTrade[];
  openOrders?: LiveOrder[];
  history?: LiveTrade[];
  monthlyByYear?: LiveMonthlyByYear;
  summary?: LiveAccountSummary;
}

export interface MyfxbookSyncResponse {
  success: boolean;
  lastUpdated?: string;
  message?: string;
  useFallback?: boolean;
  accounts?: {
    v10?: MyfxbookSyncAccount;
    gold?: MyfxbookSyncAccount;
  };
}
