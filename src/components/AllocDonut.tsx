interface Slice { pair: string; weight: number; color: string }

interface Props {
  data: Slice[];
  size?: number;
  thickness?: number;
}

export function AllocDonut({ data, size = 120, thickness = 18 }: Props) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  const cx = size / 2;
  const cy = size / 2;
  return (
    <div className="alloc-donut" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#efece4" strokeWidth={thickness} />
        {data.map((s, i) => {
          const len = (s.weight / 100) * c;
          const dash = `${len} ${c - len}`;
          const node = (
            <circle
              key={s.pair + i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${cx} ${cy})`}
              strokeLinecap="butt"
            />
          );
          offset += len;
          return node;
        })}
      </svg>
    </div>
  );
}
