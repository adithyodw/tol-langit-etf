import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { EquityPoint } from '../data/signals';

interface Props {
  data: EquityPoint[];
  height?: number;
  color?: string;
}

export function EquityChart({ data, height = 160, color = '#0a1f3d' }: Props) {
  return (
    <div className="chart" style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 6, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.18} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e6e2d6" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="t" hide />
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Tooltip
            contentStyle={{
              background: '#fff',
              border: '1px solid #e6e2d6',
              borderRadius: 4,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              padding: '6px 10px',
            }}
            formatter={(v: number) => [v.toLocaleString(undefined, { maximumFractionDigits: 0 }), 'Equity']}
            labelFormatter={(t: number) => `Month ${t}`}
          />
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill="url(#equityFill)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
