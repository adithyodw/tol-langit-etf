// Monthly returns — VERIFIED FROM MYFXBOOK ONLY.
//
// Source of truth:
//   V10:  https://www.myfxbook.com/members/adithyodw/tol-langit-v10/8671765
//   Gold: https://www.myfxbook.com/members/adithyodw/tol-langit-etf-gold/12042787
//
// Only values copied directly from a Myfxbook Monthly Analytics surface are
// recorded here. Omitted months mean no verified monthly bar was visible in
// Myfxbook for that account/year at the time of capture.

export type MonthlyByYear = Record<number, Partial<Record<number, number>>>;

export const V10_MONTHLY: MonthlyByYear = {
  2021: {
    7: 21.56,
    8: 10.75,
    9: 21.60,
    10: 20.90,
    11: 20.11,
    12: 15.49,
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
    4: 2.85,
    5: 2.13,
    6: 2.74,
    7: 3.09,
    8: 3.18,
    9: 4.23,
    11: 4.29,
    12: 6.23,
  },
  2024: {
    1: 4.76,
    2: 4.13,
    3: 4.35,
    4: 1.82,
    5: 0.05,
    6: 8.31,
    7: 0.28,
    8: 8.89,
    9: 0.69,
    10: 5.99,
    11: 11.34,
    12: 7.14,
  },
  2025: {
    1: -2.45,
    2: 9.19,
    3: 3.69,
    4: 9.63,
    5: 4.27,
    6: 5.11,
    7: 3.12,
    8: 5.65,
    9: 2.66,
    10: 0.25,
    11: 2.39,
    12: 5.39,
  },
  2026: {
    1: 4.65,
    2: 1.88,
    3: 2.65,
    5: 5.87,
  },
};

export const GOLD_MONTHLY: MonthlyByYear = {
  2026: {
    2: 24.87,
    3: -17.89,
    4: 190.85,
    5: 71.44,
  },
};

export function yearsOf(m: MonthlyByYear): number[] {
  return Object.keys(m)
    .map(Number)
    .sort((a, b) => a - b);
}
