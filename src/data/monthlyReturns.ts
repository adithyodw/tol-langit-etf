// Monthly returns — VERIFIED FROM MYFXBOOK ONLY.
//
// Source of truth:
//   V10:  https://www.myfxbook.com/members/adithyodw/tol-langit-v10/8671765
//   Gold: https://www.myfxbook.com/members/adithyodw/tol-langit-etf-gold/12042787
//
// Only values copied directly from a Myfxbook Monthly Analytics surface are
// recorded here. Omitted months mean no verified monthly bar was visible in
// Myfxbook for that account/year at the time of capture.
//
// FUTURE: When Myfxbook API adds monthly breakdown endpoint, this file becomes
// a fallback/seed. The API (api/myfxbook/sync.ts) will fetch live monthly data,
// and mergeMonthly() will overlay it on top. For now: static verified data only.

export type MonthlyByYear = Record<number, Partial<Record<number, number>>>;

// These mirror exactly what the live get-daily-gain chain-link produces, so the
// cold-start fallback is identical to the live sync (which overlays on load).
export const V10_MONTHLY: MonthlyByYear = {
  2021: {
    7: 21.56,
    8: 11.11,
    9: 21.60,
    10: 22.49,
    11: 20.55,
    12: 16.67,
  },
  2022: {
    1: 14.64,
    2: 6.81,
    3: 3.61,
    4: 14.02,
    5: 1.97,
    6: 2.83,
    7: 3.50,
    8: 5.76,
    9: 1.74,
    10: 3.03,
    11: 2.58,
    12: 2.53,
  },
  2023: {
    1: 4.13,
    2: 3.13,
    3: 3.16,
    4: 2.86,
    5: 2.13,
    6: 2.74,
    7: 3.09,
    8: 3.18,
    9: 4.23,
    11: 4.29,
    12: 6.23,
  },
  2024: {
    1: 4.75,
    2: 4.13,
    3: 4.35,
    4: 1.83,
    5: 0.05,
    6: 8.31,
    7: 0.28,
    8: 8.89,
    9: 0.69,
    10: 6.00,
    11: 11.34,
    12: 7.14,
  },
  2025: {
    1: -2.45,
    2: 9.19,
    3: 3.69,
    4: 9.63,
    5: 4.27,
    6: 5.10,
    7: 3.12,
    8: 5.64,
    9: 2.66,
    10: 0.25,
    11: 2.39,
    12: 5.39,
  },
  2026: {
    1: 4.65,
    2: 1.88,
    3: 2.65,
    5: 7.21,
  },
};

export const GOLD_MONTHLY: MonthlyByYear = {
  2026: {
    2: 24.87,
    3: -17.88,
    4: 190.84,
    5: 57.06,
    6: 8.59,
  },
};

export function yearsOf(m: MonthlyByYear): number[] {
  return Object.keys(m)
    .map(Number)
    .sort((a, b) => a - b);
}
