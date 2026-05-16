import { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts';
import type { SignalStats } from '../data/signals';
import type { MonthlyByYear } from '../data/monthlyReturns';

interface Props {
  signal: SignalStats;
  monthly: MonthlyByYear;
}

function preferredHorizonKey(monthsAvailable: number): string {
  if (monthsAvailable >= 12) return '12m';
  if (monthsAvailable >= 6) return '6m';
  return 'itd';
}

interface MonthlyPoint {
  ym: string;          // "YYYY-MM"
  label: string;       // "Jul 21"
  returnPct: number;   // monthly gain in %
  balance: number;     // resulting balance after this month
  drawdownPct: number; // running drawdown vs equity peak
}

const HORIZONS: Array<{ key: string; label: string; months: number | 'all' }> = [
  { key: '6m', label: '6M', months: 6 },
  { key: '12m', label: '12M', months: 12 },
  { key: '24m', label: '24M', months: 24 },
  { key: 'itd', label: 'ITD', months: 'all' },
];

const PRESETS = [1_000, 10_000, 100_000];
const MIN_CAPITAL = 100;
const MAX_CAPITAL = 10_000_000;

function monthLabel(year: number, month: number): string {
  const d = new Date(Date.UTC(year, month - 1, 1));
  return d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }) + ' ' + String(year).slice(-2);
}

function flattenMonthly(monthly: MonthlyByYear): Array<{ year: number; month: number; returnPct: number }> {
  const rows: Array<{ year: number; month: number; returnPct: number }> = [];
  Object.keys(monthly)
    .map(Number)
    .sort((a, b) => a - b)
    .forEach((year) => {
      const months = monthly[year] ?? {};
      Object.keys(months)
        .map(Number)
        .sort((a, b) => a - b)
        .forEach((m) => {
          const v = months[m];
          if (typeof v === 'number' && Number.isFinite(v)) {
            rows.push({ year, month: m, returnPct: v });
          }
        });
    });
  return rows;
}

function fmtMoney(currency: string, n: number): string {
  const abs = Math.abs(n);
  const opts: Intl.NumberFormatOptions = abs >= 10_000
    ? { minimumFractionDigits: 0, maximumFractionDigits: 0 }
    : { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  return `${currency} ${n.toLocaleString(undefined, opts)}`;
}

function fmtPct(n: number, withSign = true): string {
  const sign = n > 0 && withSign ? '+' : '';
  return `${sign}${n.toFixed(2)}%`;
}

function clampCapital(n: number): number {
  if (!Number.isFinite(n) || n <= 0) return 10_000;
  return Math.min(Math.max(n, MIN_CAPITAL), MAX_CAPITAL);
}

export function SimulationPanel({ signal, monthly }: Props) {
  const series = useMemo(() => flattenMonthly(monthly), [monthly]);
  const [capital, setCapital] = useState<number>(10_000);
  const [capitalDraft, setCapitalDraft] = useState<string>('10000');
  const [horizonKey, setHorizonKey] = useState<string>(() => preferredHorizonKey(series.length));

  useEffect(() => {
    setHorizonKey(preferredHorizonKey(series.length));
  }, [signal.id, series.length]);

  const horizonAvailability = useMemo(() => {
    return HORIZONS.map((h) => ({
      ...h,
      fits: h.months === 'all' ? true : series.length >= h.months,
    }));
  }, [series.length]);

  const horizon = horizonAvailability.find((h) => h.key === horizonKey) ?? horizonAvailability[horizonAvailability.length - 1];

  const slice = useMemo(() => {
    if (horizon.months === 'all') return series;
    return series.slice(-horizon.months);
  }, [series, horizon]);

  const result = useMemo(() => {
    const start = clampCapital(capital);
    let balance = start;
    let peak = start;
    let maxDD = 0;
    let bestMonth = -Infinity;
    let worstMonth = Infinity;
    let positiveMonths = 0;
    const points: MonthlyPoint[] = [];

    slice.forEach((row) => {
      balance = balance * (1 + row.returnPct / 100);
      if (balance > peak) peak = balance;
      const dd = peak > 0 ? ((balance - peak) / peak) * 100 : 0;
      if (dd < maxDD) maxDD = dd;
      if (row.returnPct > bestMonth) bestMonth = row.returnPct;
      if (row.returnPct < worstMonth) worstMonth = row.returnPct;
      if (row.returnPct > 0) positiveMonths += 1;
      points.push({
        ym: `${row.year}-${String(row.month).padStart(2, '0')}`,
        label: monthLabel(row.year, row.month),
        returnPct: row.returnPct,
        balance: Math.round(balance * 100) / 100,
        drawdownPct: Math.round(dd * 100) / 100,
      });
    });

    const ending = points.length ? points[points.length - 1].balance : start;
    const profit = ending - start;
    const roiPct = start > 0 ? (profit / start) * 100 : 0;
    const months = points.length;
    const avgMonthly = months > 0 ? (Math.pow(ending / start, 1 / months) - 1) * 100 : 0;
    const winRateMonthly = months > 0 ? (positiveMonths / months) * 100 : 0;

    return {
      start,
      ending,
      profit,
      roiPct,
      maxDDPct: Math.abs(maxDD),
      bestMonth: Number.isFinite(bestMonth) ? bestMonth : 0,
      worstMonth: Number.isFinite(worstMonth) ? worstMonth : 0,
      months,
      avgMonthly,
      winRateMonthly,
      points,
    };
  }, [capital, slice]);

  const periodLabel = (() => {
    if (!result.points.length) return '—';
    const first = result.points[0].label;
    const last = result.points[result.points.length - 1].label;
    return `${first} → ${last}`;
  })();

  const profitColor = result.profit >= 0 ? 'var(--pos)' : 'var(--neg)';
  const ddColor = 'var(--neg)';

  function commitCapital(raw: string) {
    const cleaned = raw.replace(/[^0-9.]/g, '');
    const parsed = Number(cleaned);
    const next = clampCapital(parsed);
    setCapital(next);
    setCapitalDraft(String(next));
  }

  return (
    <div className="sim-panel">
      <div className="sim-controls">
        <div className="sim-field">
          <label className="sim-label">Capital ({signal.currency})</label>
          <div className="sim-input-row">
            <span className="sim-input-prefix mono">{signal.currency}</span>
            <input
              className="sim-input mono"
              inputMode="numeric"
              value={capitalDraft}
              onChange={(e) => setCapitalDraft(e.target.value)}
              onBlur={(e) => commitCapital(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                }
              }}
              aria-label="Starting capital"
            />
          </div>
          <div className="sim-presets">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                className={`sim-preset ${capital === p ? 'on' : ''}`}
                onClick={() => {
                  setCapital(p);
                  setCapitalDraft(String(p));
                }}
              >
                {p.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <div className="sim-field">
          <label className="sim-label">Holding period</label>
          <div className="sim-seg" role="tablist">
            {horizonAvailability.map((h) => (
              <button
                key={h.key}
                type="button"
                role="tab"
                aria-selected={horizonKey === h.key}
                aria-disabled={!h.fits}
                disabled={!h.fits}
                title={!h.fits ? `Live track is shorter than ${h.label}` : undefined}
                className={`sim-seg-btn ${horizonKey === h.key ? 'on' : ''} ${!h.fits ? 'off' : ''}`}
                onClick={() => h.fits && setHorizonKey(h.key)}
              >
                {h.label}
              </button>
            ))}
          </div>
          <div className="sim-period mono">
            {periodLabel} · {result.months} mo. live
          </div>
        </div>
      </div>

      <div className="sim-headline">
        <div className="sim-headline-row">
          <span className="sim-headline-k">Projected ending balance</span>
          <span className="sim-headline-v mono" style={{ color: profitColor }}>
            {fmtMoney(signal.currency, result.ending)}
          </span>
        </div>
        <div className="sim-headline-row">
          <span className="sim-headline-k">Total profit · {result.months}M</span>
          <span className="sim-headline-v mono" style={{ color: profitColor }}>
            {result.profit >= 0 ? '+' : '−'}{fmtMoney(signal.currency, Math.abs(result.profit))} · {fmtPct(result.roiPct)}
          </span>
        </div>
      </div>

      <div className="sim-chart">
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={result.points} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#6b6862' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={28}
            />
            <YAxis
              hide
              domain={[
                (dataMin: number) => Math.floor(Math.min(dataMin, result.start) * 0.98),
                (dataMax: number) => Math.ceil(Math.max(dataMax, result.start) * 1.02),
              ]}
            />
            <Tooltip
              contentStyle={{
                background: '#0a1f3d',
                border: 'none',
                borderRadius: 6,
                fontSize: 12,
                color: '#fff',
                padding: '6px 10px',
              }}
              labelStyle={{ color: '#caa64a', fontWeight: 600 }}
              formatter={(v: number, name: string) => {
                if (name === 'balance') return [fmtMoney(signal.currency, v), 'Balance'];
                if (name === 'drawdownPct') return [`${v.toFixed(2)}%`, 'Drawdown'];
                return [v, name];
              }}
            />
            <ReferenceLine y={result.start} stroke="#6b6862" strokeDasharray="4 4" strokeOpacity={0.6} />
            <Line
              type="monotone"
              dataKey="balance"
              stroke={signal.id === 'gold' ? '#b89a4e' : '#0a1f3d'}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="sim-stats">
        <div className="sim-stat">
          <span className="sim-stat-k">Starting</span>
          <span className="sim-stat-v mono">{fmtMoney(signal.currency, result.start)}</span>
        </div>
        <div className="sim-stat">
          <span className="sim-stat-k">Ending</span>
          <span className="sim-stat-v mono" style={{ color: profitColor }}>
            {fmtMoney(signal.currency, result.ending)}
          </span>
        </div>
        <div className="sim-stat">
          <span className="sim-stat-k">ROI</span>
          <span className="sim-stat-v mono" style={{ color: profitColor }}>
            {fmtPct(result.roiPct)}
          </span>
        </div>
        <div className="sim-stat">
          <span className="sim-stat-k">Avg monthly</span>
          <span className="sim-stat-v mono">{fmtPct(result.avgMonthly)}</span>
        </div>
        <div className="sim-stat">
          <span className="sim-stat-k">Best month</span>
          <span className="sim-stat-v mono" style={{ color: 'var(--pos)' }}>
            {fmtPct(result.bestMonth)}
          </span>
        </div>
        <div className="sim-stat">
          <span className="sim-stat-k">Worst month</span>
          <span className="sim-stat-v mono" style={{ color: 'var(--neg)' }}>
            {fmtPct(result.worstMonth)}
          </span>
        </div>
        <div className="sim-stat">
          <span className="sim-stat-k">Max drawdown</span>
          <span className="sim-stat-v mono" style={{ color: ddColor }}>
            −{result.maxDDPct.toFixed(2)}%
          </span>
        </div>
        <div className="sim-stat">
          <span className="sim-stat-k">Win months</span>
          <span className="sim-stat-v mono">{result.winRateMonthly.toFixed(0)}%</span>
        </div>
      </div>

      <div className="sim-disclaimer">
        Backtest against the verified Myfxbook track for {signal.name} (account #{signal.myfxbookAccountId}).
        Each month's actual broker return is compounded onto your starting capital exactly as a copy-trade
        investor would have experienced — no curated months, no edited history. Subscriber spreads, copier
        latency, currency conversion, and venue fees sit outside the model. This is a historical replay,
        not a projection or forecast — past performance is not indicative of future results.
      </div>
    </div>
  );
}
