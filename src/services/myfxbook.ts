// Myfxbook sync client.
//
// In production the browser calls the Vercel serverless route at /api/myfxbook/sync,
// which talks to https://www.myfxbook.com/api server-side (no CORS, credentials never
// leave the server). When the route is unavailable (local dev without `vercel dev`,
// or auth missing) we surface the static fallback shipped in src/data/signals.ts.

import { buildFallbackAccounts, V10, GOLD, hydrateSignal, SignalStats } from '../data/signals';
import type { MyfxbookAccount, MyfxbookSyncResponse, SyncEnvelope } from '../data/types';

const SYNC_ENDPOINT = '/api/myfxbook/sync';
const SYNC_TIMEOUT_MS = 8_000;

export interface SyncResult {
  envelope: SyncEnvelope;
  signals: { v10: SignalStats; gold: SignalStats };
}

type ApiAccount = NonNullable<NonNullable<MyfxbookSyncResponse['accounts']>['v10']>;

function fallbackEnvelope(notice: string): SyncEnvelope {
  return {
    source: 'fallback',
    syncedAt: new Date().toISOString(),
    accounts: buildFallbackAccounts(),
    notice,
  };
}

function envelopeToSignals(env: SyncEnvelope): SyncResult['signals'] {
  const byId = new Map(env.accounts.map(a => [a.accountId, a]));
  const v10Acc = byId.get(V10.myfxbookAccountId);
  const goldAcc = byId.get(GOLD.myfxbookAccountId);
  return {
    v10: v10Acc ? hydrateSignal(V10, v10Acc) : V10,
    gold: goldAcc ? hydrateSignal(GOLD, goldAcc) : GOLD,
  };
}

function normalizeAccount(
  base: MyfxbookAccount,
  account: ApiAccount
): MyfxbookAccount {
  return {
    ...base,
    ...account,
    id: Number(account?.id ?? base.id),
    accountId: String(account?.accountId ?? account?.id ?? base.accountId),
    name: account?.name ?? base.name,
  };
}

function responseToEnvelope(payload: MyfxbookSyncResponse): SyncEnvelope {
  if (!payload.success || payload.useFallback || !payload.accounts?.v10 || !payload.accounts?.gold) {
    return fallbackEnvelope(payload.message ?? 'Live Myfxbook sync unavailable — showing last verified values.');
  }

  const [v10Base, goldBase] = buildFallbackAccounts();

  return {
    source: 'myfxbook-api',
    syncedAt: payload.lastUpdated ?? new Date().toISOString(),
    accounts: [
      normalizeAccount(v10Base, payload.accounts.v10),
      normalizeAccount(goldBase, payload.accounts.gold),
    ],
  };
}

export async function syncFromMyfxbook(): Promise<SyncResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SYNC_TIMEOUT_MS);
  try {
    const res = await fetch(SYNC_ENDPOINT, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`sync HTTP ${res.status}`);
    const payload = (await res.json()) as MyfxbookSyncResponse;
    const env = responseToEnvelope(payload);
    return { envelope: env, signals: envelopeToSignals(env) };
  } catch (err: unknown) {
    const reason =
      err instanceof DOMException && err.name === 'AbortError'
        ? 'Sync timed out — showing last verified Myfxbook values.'
        : 'Live Myfxbook sync unavailable — showing last verified values.';
    const env = fallbackEnvelope(reason);
    return { envelope: env, signals: envelopeToSignals(env) };
  } finally {
    clearTimeout(timer);
  }
}
