// api/myfxbook/sync.ts
import { VercelRequest, VercelResponse } from '@vercel/node';

const BASE_URL = 'https://www.myfxbook.com/api';

const v10Id = 8671765;
const goldId = 12042787;

interface MyfxbookLoginResponse {
  error?: boolean;
  message?: string;
  session?: string;
}

interface MyfxbookAccount {
  id?: number | string;
  accountId?: number | string;
  name?: string;
  [key: string]: unknown;
}

interface MyfxbookAccountsResponse {
  error?: boolean;
  message?: string;
  accounts?: MyfxbookAccount[];
}

interface MyfxbookTradesResponse {
  trades?: unknown[];
}

function getAccount(accountsData: MyfxbookAccountsResponse, accountId: number): MyfxbookAccount {
  return accountsData.accounts?.find(account => Number(account.id) === accountId || Number(account.accountId) === accountId) || {};
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const email = process.env.MYFXBOOK_EMAIL;
  const password = process.env.MYFXBOOK_PASSWORD;

  if (!email || !password) {
    return res.status(200).json({
      success: false,
      message: "No credentials in env",
      useFallback: true
    });
  }

  let session: string | null = null;

  try {
    // 1. Login
    const loginRes = await fetch(
      `${BASE_URL}/login.json?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    );
    const loginData = await loginRes.json() as MyfxbookLoginResponse;

    if (loginData.error || !loginData.session) {
      throw new Error(loginData.message || 'Login failed');
    }

    session = loginData.session;

    // 2. Get My Accounts
    const accountsRes = await fetch(`${BASE_URL}/get-my-accounts.json?session=${session}`);
    const accountsData = await accountsRes.json() as MyfxbookAccountsResponse;

    if (accountsData.error) {
      throw new Error(accountsData.message || 'Accounts fetch failed');
    }

    // 3. Fetch gain and open-trade data for your two accounts
    const [v10Res, goldRes] = await Promise.all([
      fetch(`${BASE_URL}/get-gain.json?session=${session}&id=${v10Id}`),
      fetch(`${BASE_URL}/get-gain.json?session=${session}&id=${goldId}`)
    ]);

    const v10 = await v10Res.json() as MyfxbookAccount;
    const gold = await goldRes.json() as MyfxbookAccount;

    // Optional: Get open trades
    const [v10TradesRes, goldTradesRes] = await Promise.all([
      fetch(`${BASE_URL}/get-open-trades.json?session=${session}&id=${v10Id}`),
      fetch(`${BASE_URL}/get-open-trades.json?session=${session}&id=${goldId}`)
    ]);

    const v10Trades = await v10TradesRes.json() as MyfxbookTradesResponse;
    const goldTrades = await goldTradesRes.json() as MyfxbookTradesResponse;
    const v10Account = getAccount(accountsData, v10Id);
    const goldAccount = getAccount(accountsData, goldId);

    const result = {
      success: true,
      lastUpdated: new Date().toISOString(),
      accounts: {
        v10: {
          id: v10Id,
          name: "TOL LANGIT V10",
          ...v10Account,
          ...v10,
          openTrades: v10Trades.trades || []
        },
        gold: {
          id: goldId,
          name: "TOL LANGIT ETF GOLD",
          ...goldAccount,
          ...gold,
          openTrades: goldTrades.trades || []
        }
      }
    };

    // Cache for 10 minutes
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=86400');
    return res.status(200).json(result);

  } catch (error: unknown) {
    console.error('Myfxbook Sync Error:', getErrorMessage(error));
    return res.status(200).json({
      success: false,
      message: 'Data sync unavailable. Showing last verified values.',
      useFallback: true,
      lastUpdated: new Date().toISOString()
    });
  } finally {
    if (session) {
      await fetch(`${BASE_URL}/logout.json?session=${session}`).catch(() => undefined);
    }
  }
}
