import { useMemo, useState } from 'react';
import { MonthlyByYear, yearsOf } from '../data/monthlyReturns';

interface Props {
  data: MonthlyByYear;
  title?: string;
  /** Retained for call-site compatibility; the table sizes to its content. */
  height?: number;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface MonthRow {
  month: number;
  short: string;
  value: number;
}

function pct(v: number): string {
  return `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;
}

export function MonthlyAnalytics({ data, title = 'Monthly Analytics' }: Props) {
  const years = useMemo(() => yearsOf(data), [data]);
  const [year, setYear] = useState<number>(years[years.length - 1] ?? new Date().getFullYear());

  // Keep the selected year valid if the live sync changes the available range.
  const activeYear = years.includes(year) ? year : years[years.length - 1] ?? year;

  const rows = useMemo<MonthRow[]>(() => {
    const yearData = data[activeYear] ?? {};
    const out: MonthRow[] = [];
    for (let m = 1; m <= 12; m++) {
      const v = yearData[m];
      if (typeof v !== 'number' || !Number.isFinite(v)) continue;
      out.push({ month: m, short: MONTHS[m - 1], value: Number(v.toFixed(2)) });
    }
    return out;
  }, [data, activeYear]);

  // Year total = compounded monthly returns (matches Myfxbook's "Year" column).
  const yearReturn = (rows.reduce((acc, r) => acc * (1 + r.value / 100), 1) - 1) * 100;
  const maxAbs = rows.length ? Math.max(...rows.map((r) => Math.abs(r.value))) : 1;
  const best = rows.length ? Math.max(...rows.map((r) => r.value)) : 0;
  const worst = rows.length ? Math.min(...rows.map((r) => r.value)) : 0;

  return (
    <div className="monthly-analytics">
      <div className="monthly-head">
        <span className="monthly-title">{title}</span>
        <div className="monthly-years">
          {years.map((y) => (
            <button
              key={y}
              className={`monthly-year ${y === activeYear ? 'on' : ''}`}
              onClick={() => setYear(y)}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      <div className="monthly-meta">
        <div className="monthly-meta-cell">
          <span className="monthly-meta-k">Year-to-date</span>
          <span
            className="monthly-meta-v mono"
            style={{ color: yearReturn >= 0 ? 'var(--pos)' : 'var(--neg)' }}
          >
            {rows.length === 0 ? '—' : pct(yearReturn)}
          </span>
        </div>
        <div className="monthly-meta-cell">
          <span className="monthly-meta-k">Best month</span>
          <span className="monthly-meta-v mono" style={{ color: 'var(--pos)' }}>
            {rows.length === 0 ? '—' : pct(best)}
          </span>
        </div>
        <div className="monthly-meta-cell">
          <span className="monthly-meta-k">Worst month</span>
          <span className="monthly-meta-v mono" style={{ color: worst < 0 ? 'var(--neg)' : 'var(--pos)' }}>
            {rows.length === 0 ? '—' : pct(worst)}
          </span>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="monthly-empty">
          <div className="monthly-empty-k mono">NO MONTHLY DATA FOR {activeYear}</div>
          <div className="monthly-empty-sub">
            Monthly history backfills when the authenticated Myfxbook sync runs.
          </div>
        </div>
      ) : (
        <div className="mtable" role="table" aria-label={`${title} — ${activeYear} monthly returns`}>
          <div className="mtable-head" role="row">
            <span className="mtable-h-month" role="columnheader">Month</span>
            <span className="mtable-h-bar" role="columnheader">Performance</span>
            <span className="mtable-h-val" role="columnheader">Return</span>
          </div>

          {rows.map((r) => {
            const positive = r.value >= 0;
            const width = Math.max(4, (Math.abs(r.value) / maxAbs) * 100);
            return (
              <div className="mtable-row" role="row" key={`${activeYear}-${r.month}`}>
                <span className="mtable-month" role="cell">
                  <span className="mtable-month-name">{r.short}</span>
                  <span className="mtable-month-year mono">{activeYear}</span>
                </span>
                <span className="mtable-bar-cell" role="cell">
                  <span className="mtable-bar-track">
                    <span
                      className={`mtable-bar-fill ${positive ? 'pos' : 'neg'}`}
                      style={{ width: `${width}%` }}
                    />
                  </span>
                </span>
                <span
                  className="mtable-val mono"
                  role="cell"
                  style={{ color: positive ? 'var(--pos)' : 'var(--neg)' }}
                >
                  {pct(r.value)}
                </span>
              </div>
            );
          })}

          <div className="mtable-total" role="row">
            <span className="mtable-month" role="cell">
              <span className="mtable-month-name">{activeYear}</span>
              <span className="mtable-month-year mono">Full year</span>
            </span>
            <span className="mtable-bar-cell mono" role="cell">
              {rows.length} {rows.length === 1 ? 'month' : 'months'} recorded
            </span>
            <span
              className="mtable-val mono"
              role="cell"
              style={{ color: yearReturn >= 0 ? 'var(--pos)' : 'var(--neg)' }}
            >
              {pct(yearReturn)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
