import { useMemo, useState } from 'react';

type Filter = 'all' | 'trade' | 'rebalance' | 'control' | 'report';

interface LogItem {
  date: string;
  time: string;
  tag: 'trade' | 'monitor' | 'control' | 'report' | 'rebal' | 'close' | 'audit';
  sys: string;
  txt: string;
}

const LOGS: LogItem[] = [
  { date: '2026-05-16', time: '09:24', tag: 'trade', sys: 'V10 · EURUSD', txt: 'Closed long 0.04 lot · +18.4 pips · realized +$7.36' },
  { date: '2026-05-16', time: '08:11', tag: 'trade', sys: 'GOLD · XAUUSD', txt: 'Closed short 0.02 lot @ 3,284.10 · realized +$42.80' },
  { date: '2026-05-16', time: '06:48', tag: 'rebal', sys: 'ETF · COMPOSITE', txt: 'Volatility regime shift · GOLD weight raised to 42%' },
  { date: '2026-05-16', time: '04:02', tag: 'monitor', sys: 'V10 · GBPUSD', txt: 'Spread widened 3.2 → 5.1, entry skipped' },
  { date: '2026-05-15', time: '21:55', tag: 'trade', sys: 'V10 · USDJPY', txt: 'Closed long 0.05 lot · +24.1 pips · realized +$11.02' },
  { date: '2026-05-15', time: '17:30', tag: 'report', sys: 'MQL5 · V10', txt: 'Daily sync — growth +0.84%, win rate trailing 30d 82.1%' },
  { date: '2026-05-15', time: '14:18', tag: 'trade', sys: 'GOLD · XAUUSD', txt: 'Opened short 0.02 lot @ 3,298.40, SL 3,308.10' },
  { date: '2026-05-15', time: '10:06', tag: 'control', sys: 'ETF · COMPOSITE', txt: 'CPI release window · all systems paused 14:00 ± 30m' },
  { date: '2026-05-14', time: '22:41', tag: 'trade', sys: 'V10 · EURUSD', txt: 'Closed long 0.04 lot · +12.7 pips · realized +$5.11' },
  { date: '2026-05-14', time: '19:20', tag: 'audit', sys: 'MYFXBOOK · V10', txt: 'Tracker resynced · 4,522 trades reconciled' },
  { date: '2026-05-14', time: '11:08', tag: 'rebal', sys: 'V10', txt: 'EURUSD weight reduced 34% → 32% (volatility band)' },
  { date: '2026-05-13', time: '20:55', tag: 'close', sys: 'GOLD · XAUUSD', txt: 'Session end · 6 fills closed · realized +$118.40' },
];

const CHIPS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'trade', label: 'Trades' },
  { id: 'rebalance', label: 'Rebalances' },
  { id: 'control', label: 'Controls' },
  { id: 'report', label: 'Reports' },
];

export function Activity() {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return LOGS;
    if (filter === 'trade') return LOGS.filter(l => l.tag === 'trade' || l.tag === 'close');
    if (filter === 'rebalance') return LOGS.filter(l => l.tag === 'rebal');
    if (filter === 'control') return LOGS.filter(l => l.tag === 'control' || l.tag === 'monitor');
    return LOGS.filter(l => l.tag === 'report' || l.tag === 'audit');
  }, [filter]);

  const grouped = useMemo(() => {
    const m = new Map<string, LogItem[]>();
    filtered.forEach(l => {
      const arr = m.get(l.date) ?? [];
      arr.push(l);
      m.set(l.date, arr);
    });
    return Array.from(m.entries());
  }, [filtered]);

  return (
    <div className="screen">
      <div className="topbar">
        <div className="topbar-l">
          <span className="kicker">EXECUTION LOG</span>
          <h1 className="topbar-title">Activity</h1>
        </div>
      </div>

      <div className="filter-row">
        {CHIPS.map(c => (
          <button
            key={c.id}
            className={`filter-chip ${filter === c.id ? 'on' : ''}`}
            onClick={() => setFilter(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="logs">
        {grouped.map(([date, items]) => (
          <div key={date} className="log-group">
            <div className="log-date mono">{date.toUpperCase()}</div>
            {items.map((l, i) => (
              <div key={i} className="log-item">
                <div className="log-time mono">{l.time} GMT</div>
                <div>
                  <div className="log-head">
                    <span className={`log-tag tag-${l.tag}`}>{l.tag}</span>
                    <span className="log-sys mono">{l.sys}</span>
                  </div>
                  <div className="log-txt">{l.txt}</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
