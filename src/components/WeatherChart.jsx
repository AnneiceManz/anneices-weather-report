export default function WeatherChart({ historicalData, loading }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center gap-2 py-12">
        <div className="w-7 h-7 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-medium text-slate-400">Loading timeline vectors...</p>
      </div>
    );
  }

  if (!historicalData || historicalData.temperatures.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-red-400 font-medium">
        Failed to build history timeline or data missing.
      </div>
    );
  }

  const temps = historicalData.temperatures;
  const maxTemp = Math.max(...temps) + 3;
  const minTemp = Math.min(...temps) - 3;
  const range = maxTemp - minTemp || 1;

  const width = 600;
  const height = 200;
  const padding = 30;

  const points = temps.map((temp, index) => {
    const x = padding + (index * (width - padding * 2)) / (temps.length - 1);
    const y = height - padding - ((temp - minTemp) * (height - padding * 2)) / range;
    return { x, y, temp, label: historicalData.dates[index] };
  });

  const pathD = points.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[500px] h-auto overflow-visible">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid indicators */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#f1f5f9" strokeWidth="1" />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#f1f5f9" strokeWidth="1" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e2e8f0" strokeWidth="1.5" />

        {/* Visual vector graphics tracks */}
        <path d={areaD} fill="url(#chartGrad)" />
        <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Nodes and dynamic numerical outputs */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke="#3b82f6" strokeWidth="2" />
            <text x={p.x} y={p.y - 10} textAnchor="middle" className="text-[10px] font-bold fill-slate-700">{Math.round(p.temp)}°C</text>
            <text x={p.x} y={height - 10} textAnchor="middle" className="text-[10px] font-medium fill-slate-400">{p.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
