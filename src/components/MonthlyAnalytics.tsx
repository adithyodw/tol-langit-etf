import { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from 'recharts';
import { MonthlyByYear, yearsOf } from '../data/monthlyReturns';

interface Props {
  data: MonthlyByYear;
  title?: string;
  height?: number;
}

// Myfxbook-style rotating palette — keeps successive months visually distinct.
const PALETTE = ['#7E6BAE', '#D97B7B', '#3DA38A', '#E8A672', '#5B8DBE', '#C49B3E'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function MonthlyAnalytics({ data, title = 'Monthly Analytics', height = 220 }: Props) {
  const years = useMemo(() => yearsOf(data), [data]);
  const [year, setYear] = useState<number>(years[0] ?? new Date().getFullYear());

  const rows = useMemo(() => {
    const yearData = data[year] ?? {};
    const present: { label: string; value: number; color: string; key: string }[] = [];
    let palIdx = 0;
    for (let m = 1; m <= 12; m++) {
      const v = yearData[m];
      if (typeof v !== 'number') continue;
      present.push({
        key: `${year}-${m}`,
        label: `${MONTHS[m - 1]} ${year}`,
        value: Number(v.toFixed(2)),
        color: PALETTE[palIdx % PALETTE.length],
      });
      palIdx++;
    }
    return present;
  }, [data, year]);

  const yearTotal = rows.reduce((acc, r) => acc * (1 + r.value / 100), 1) - 1;

  return (
    <div className="monthly-analytics">
      <div className="monthly-head">
        <span className="monthly-title">{title}</span>
        <div className="monthly-years">
          {years.map(y => (
            <button
              key={y}
              className={`monthly-year ${y === year ? 'on' : ''}`}
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
          <span className="monthly-meta-v mono" style={{ color: yearTotal >= 0 ? 'var(--pos)' : 'var(--neg)' }}>
            {yearTotal >= 0 ? '+' : ''}{(yearTotal * 100).toFixed(2)}%
          </span>
        </div>
        <div className="monthly-meta-cell">
          <span className="monthly-meta-k">Months recorded</span>
          <span className="monthly-meta-v mono">{rows.length}</span>
        </div>
        <div className="monthly-meta-cell">
          <span className="monthly-meta-k">Best month</span>
          <span className="monthly-meta-v mono" style={{ color: 'var(--pos)' }}>
            +{rows.length ? Math.max(...rows.map(r => r.value)).toFixed(2) : '0.00'}%
          </span>
        </div>
      </div>

      <div className="monthly-chart" style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 18, right: 6, left: 0, bottom: 4 }}>
            <CartesianGrid stroke="#e6e2d6" strokeDasharray="2 4" vertical={false} />
            <XAxis
              dataKey="label"
              tickFormatter={(label: string) => label.split(' ')[0]}
              tick={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fill: '#6b6862' }}
              axisLine={{ stroke: '#d8d3c4' }}
              tickLine={false}
              interval={0}
            />
            <YAxis
              tickFormatter={v => `${v}%`}
              tick={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fill: '#9a978f' }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Bar dataKey="value" radius={[2, 2, 0, 0]} isAnimationActive={false}>
              {rows.map(r => (
                <Cell key={r.key} fill={r.color} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                formatter={(v: number) => `${v.toFixed(2)}%`}
                style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fill: '#2a2a28' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
