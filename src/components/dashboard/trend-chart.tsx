export function TrendChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const width = 280;
  const height = 80;
  const coords = data
    .map((p, i) => {
      const x = (i / Math.max(data.length - 1, 1)) * width;
      const y = height - (p / max) * (height - 10) - 5;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-24 w-full">
      <defs>
        <linearGradient id="dashChartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(99,102,241,0.3)" />
          <stop offset="100%" stopColor="rgba(99,102,241,0)" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${coords} ${width},${height}`}
        fill="url(#dashChartGrad)"
      />
      <polyline
        points={coords}
        fill="none"
        stroke="rgba(99,102,241,0.8)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
