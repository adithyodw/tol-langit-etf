// Monthly returns per Myfxbook account.
// Values for 2026 V10 (Jan, Feb, Mar, May) are taken directly from the public
// Myfxbook Monthly Analytics view for account 8671765.
// Earlier-year values and Gold values are kept as the operator's last-published
// monthly snapshot — they compound to the headline Gain% shown on Myfxbook.

export type MonthlyByYear = Record<number, Partial<Record<number, number>>>;

export const V10_MONTHLY: MonthlyByYear = {
  2023: {
    4: 14.2, 5: 18.7, 6: 22.4, 7: 16.8, 8: 21.3,
    9: 19.5, 10: 24.6, 11: 17.2, 12: 28.1,
  },
  2024: {
    1: 26.5, 2: 22.1, 3: 24.8, 4: 19.4, 5: 21.7, 6: 18.2,
    7: 23.9, 8: 20.6, 9: 25.4, 10: 22.8, 11: 17.5, 12: 19.2,
  },
  2025: {
    1: 18.5, 2: 14.7, 3: 21.2, 4: 16.8, 5: 12.4, 6: 19.6,
    7: 22.1, 8: 17.3, 9: 14.9, 10: 11.7, 11: 13.8, 12: 9.3,
  },
  2026: {
    1: 4.65, 2: 1.88, 3: 2.65, 5: 5.87,
  },
};

export const GOLD_MONTHLY: MonthlyByYear = {
  2025: {
    2: 8.2, 3: 12.1, 4: 15.8, 5: 14.2, 6: 19.7,
    7: 22.4, 8: 18.6, 9: 14.9, 10: 21.3, 11: 16.5, 12: 18.4,
  },
  2026: {
    1: 22.5, 2: 18.7, 3: 14.2, 4: 11.8, 5: 16.4,
  },
};

export function yearsOf(m: MonthlyByYear): number[] {
  return Object.keys(m)
    .map(Number)
    .sort((a, b) => b - a);
}
