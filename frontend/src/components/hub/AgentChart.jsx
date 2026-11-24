import React, { useMemo } from 'react';

/**
 * High-definition, responsive vector chart for the Agent Detail Card.
 * Dynamically renders tailored chart types (Smooth Spline Area, Rounded Column Bars, Waveform Telemetry)
 * with the respective agent's accent color, crisp axis markers, benchmark lines, and high-contrast typography.
 * Mathematically aligns every bar, point, and X-axis timestamp with zero drift.
 */
export default function AgentChart({
  agent,
  metrics,
  accentColor = '#10b981',
  chartType = 'auto',
  height = 74
}) {
  const rawData = metrics?.trend || [82, 85, 84, 89, 91, 93, 94.8];
  const agentId = agent?.id || '';
  const count = rawData.length;

  // Determine chart mode automatically if set to 'auto'
  const mode = useMemo(() => {
    if (chartType !== 'auto') return chartType;
    // Count / Buffer / Volume / Logistics / Energy agents -> Bar chart
    if (
      agentId.includes('inventory') ||
      agentId.includes('order') ||
      agentId.includes('energy') ||
      agentId.includes('logistics') ||
      agentId.includes('scrap') ||
      agentId.includes('workforce')
    ) {
      return 'bars';
    }
    // Telemetry / Maintenance / AOI / Signal agents -> Waveform
    if (
      agentId.includes('maintenance') ||
      agentId.includes('aoi') ||
      agentId.includes('utilities') ||
      agentId.includes('twin')
    ) {
      return 'waveform';
    }
    // Default -> Smooth Spline Area
    return 'spline';
  }, [agentId, chartType]);

  // Coordinate geometry
  const width = 340;
  const paddingX = 18;
  const topY = 16;
  const baselineY = 56;
  const chartW = width - paddingX * 2;
  const chartH = baselineY - topY;

  const minVal = Math.min(...rawData);
  const maxVal = Math.max(...rawData);
  const range = maxVal - minVal || 1;

  // Dynamically generate time labels to match rawData length exactly
  const timeLabels = useMemo(() => {
    return rawData.map((_, idx) => {
      if (idx === count - 1) return 'Now';
      const hoursAgo = count - 1 - idx;
      return `-${hoursAgo}h`;
    });
  }, [count, rawData]);

  // Bar chart layout calculations
  const barData = useMemo(() => {
    const slotW = chartW / count;
    const barWidth = Math.min(22, Math.max(12, slotW * 0.46));

    return rawData.map((val, idx) => {
      const centerX = paddingX + idx * slotW + slotW / 2;
      const x = centerX - barWidth / 2;
      const barHeight = Math.max(7, ((val - minVal) / range) * (chartH - 8) + 7);
      const y = baselineY - barHeight;
      const isLast = idx === count - 1;

      return {
        idx,
        val,
        centerX,
        x,
        y,
        width: barWidth,
        height: barHeight,
        isLast,
        label: timeLabels[idx]
      };
    });
  }, [rawData, count, chartW, paddingX, minVal, range, chartH, baselineY, timeLabels]);

  // Spline & Waveform points calculations
  const coords = useMemo(() => {
    return rawData.map((val, idx) => {
      const x = paddingX + (idx / (count - 1)) * chartW;
      const y = topY + chartH - ((val - minVal) / range) * chartH;
      return { x, y, val, label: timeLabels[idx] };
    });
  }, [rawData, count, paddingX, chartW, topY, chartH, minVal, range, timeLabels]);

  // Smooth Cubic Bezier Spline SVG path
  const { pathD, areaD } = useMemo(() => {
    if (coords.length < 2) return { pathD: '', areaD: '' };

    let d = `M ${coords[0].x.toFixed(1)},${coords[0].y.toFixed(1)}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? 0 : i - 1];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }

    const lastX = coords[coords.length - 1].x;
    const firstX = coords[0].x;
    const aD = `${d} L ${lastX.toFixed(1)},${baselineY} L ${firstX.toFixed(1)},${baselineY} Z`;

    return { pathD: d, areaD: aD };
  }, [coords, baselineY]);

  const latestPoint = coords[coords.length - 1];
  const lastVal = rawData[rawData.length - 1];
  const latestBar = barData[barData.length - 1];

  return (
    <div
      className="agent-dynamic-chart-container"
      style={{
        width: '100%',
        height: `${height}px`,
        position: 'relative',
        userSelect: 'none'
      }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="agent-chart-svg"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          {/* Main Area Fill Gradient */}
          <linearGradient id={`chart-grad-${agentId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.38" />
            <stop offset="60%" stopColor={accentColor} stopOpacity="0.10" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.0" />
          </linearGradient>

          {/* Bar Gradient */}
          <linearGradient id={`bar-grad-${agentId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.95" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.35" />
          </linearGradient>

          {/* Glow Filter */}
          <filter id={`glow-${agentId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={accentColor} floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Horizontal Benchmark Reference Guideline */}
        <line
          x1={paddingX - 4}
          y1={topY + chartH / 2}
          x2={width - paddingX + 4}
          y2={topY + chartH / 2}
          stroke="currentColor"
          strokeOpacity="0.15"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Solid Ground Baseline */}
        <line
          x1={paddingX - 4}
          y1={baselineY}
          x2={width - paddingX + 4}
          y2={baselineY}
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="1"
        />

        {/* ------------------------------------------------------------- */}
        {/* MODE 1: Smooth Spline Area Chart                              */}
        {/* ------------------------------------------------------------- */}
        {mode === 'spline' && (
          <>
            <path d={areaD} fill={`url(#chart-grad-${agentId})`} />
            <path
              d={pathD}
              fill="none"
              stroke={accentColor}
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#glow-${agentId})`}
            />

            {/* Subtle Intermediate Coordinate Dots */}
            {coords.slice(0, -1).map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r="2.5"
                fill="var(--dr-bg, #ffffff)"
                stroke={accentColor}
                strokeWidth="1.8"
                opacity="0.85"
              />
            ))}

            {/* Pulsing Active Node on Latest Value */}
            {latestPoint && (
              <g transform={`translate(${latestPoint.x}, ${latestPoint.y})`}>
                <circle r="7" fill={accentColor} opacity="0.25">
                  <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.35;0.1;0.35" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle r="4" fill={accentColor} stroke="#ffffff" strokeWidth="2" />
              </g>
            )}

            {/* Perfectly Center-Aligned X-Axis Labels */}
            {coords.map((pt, i) => (
              <text
                key={i}
                x={pt.x}
                y={baselineY + 12.5}
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="700"
                fill="currentColor"
                opacity={i === count - 1 ? 0.95 : 0.65}
              >
                {pt.label}
              </text>
            ))}

            {/* Latest Value Badge Centered Over Latest Point */}
            {latestPoint && (
              <g
                transform={`translate(${Math.min(latestPoint.x, width - 36)}, ${Math.max(latestPoint.y - 12, 10)})`}
              >
                <rect
                  x="-23"
                  y="-9"
                  width="46"
                  height="17"
                  rx="5"
                  fill={`${accentColor}22`}
                  stroke={`${accentColor}55`}
                  strokeWidth="1"
                />
                <circle cx="-14" cy="-0.5" r="2.2" fill={accentColor} />
                <text
                  x="4"
                  y="2.8"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="800"
                  fill={accentColor}
                  fontFamily="inherit"
                >
                  {lastVal}
                </text>
              </g>
            )}
          </>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODE 2: Rounded Column / Bar Chart                            */}
        {/* ------------------------------------------------------------- */}
        {mode === 'bars' && (
          <g>
            {barData.map((bar) => (
              <g key={bar.idx}>
                <rect
                  x={bar.x}
                  y={bar.y}
                  width={bar.width}
                  height={bar.height}
                  rx="4"
                  fill={bar.isLast ? accentColor : `url(#bar-grad-${agentId})`}
                  opacity={bar.isLast ? 1 : 0.65 + (bar.idx / count) * 0.3}
                  filter={bar.isLast ? `url(#glow-${agentId})` : 'none'}
                />

                {/* Highlight cap on latest bar */}
                {bar.isLast && (
                  <line
                    x1={bar.x + 1}
                    y1={bar.y}
                    x2={bar.x + bar.width - 1}
                    y2={bar.y}
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                )}

                {/* Mathematically Centered X-Axis Label under EVERY bar */}
                <text
                  x={bar.centerX}
                  y={baselineY + 12.5}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="700"
                  fill="currentColor"
                  opacity={bar.isLast ? 0.95 : 0.65}
                >
                  {bar.label}
                </text>
              </g>
            ))}

            {/* Latest Value Badge Centered Precisely Over the Last Bar */}
            {latestBar && (
              <g
                transform={`translate(${latestBar.centerX}, ${Math.max(latestBar.y - 10, 9)})`}
              >
                <rect
                  x="-23"
                  y="-9"
                  width="46"
                  height="17"
                  rx="5"
                  fill={`${accentColor}22`}
                  stroke={`${accentColor}55`}
                  strokeWidth="1"
                />
                <circle cx="-14" cy="-0.5" r="2.2" fill={accentColor} />
                <text
                  x="4"
                  y="2.8"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="800"
                  fill={accentColor}
                  fontFamily="inherit"
                >
                  {lastVal}
                </text>
              </g>
            )}
          </g>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODE 3: High-Tech Waveform / Stepped Anomaly Chart            */}
        {/* ------------------------------------------------------------- */}
        {mode === 'waveform' && (
          <>
            <path d={areaD} fill={`url(#chart-grad-${agentId})`} opacity="0.35" />
            <path
              d={coords
                .map((pt, i, arr) => {
                  if (i === 0) return `M ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
                  const prev = arr[i - 1];
                  const midX = (prev.x + pt.x) / 2;
                  return `H ${midX.toFixed(1)} V ${pt.y.toFixed(1)} H ${pt.x.toFixed(1)}`;
                })
                .join(' ')}
              fill="none"
              stroke={accentColor}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#glow-${agentId})`}
            />

            {/* Diagnostic Peak Nodes */}
            {coords.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r={i === count - 1 ? 4 : 2.2}
                fill={i === count - 1 ? accentColor : 'currentColor'}
                stroke={i === count - 1 ? '#ffffff' : 'none'}
                strokeWidth="1.5"
                opacity={i === count - 1 ? 1 : 0.6}
              />
            ))}

            {/* Centered X-Axis Labels */}
            {coords.map((pt, i) => (
              <text
                key={i}
                x={pt.x}
                y={baselineY + 12.5}
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="700"
                fill="currentColor"
                opacity={i === count - 1 ? 0.95 : 0.65}
              >
                {pt.label}
              </text>
            ))}

            {/* Floating Value Pill */}
            {latestPoint && (
              <g
                transform={`translate(${Math.min(latestPoint.x, width - 36)}, ${Math.max(latestPoint.y - 12, 10)})`}
              >
                <rect
                  x="-23"
                  y="-9"
                  width="46"
                  height="17"
                  rx="5"
                  fill={`${accentColor}22`}
                  stroke={`${accentColor}55`}
                  strokeWidth="1"
                />
                <circle cx="-14" cy="-0.5" r="2.2" fill={accentColor} />
                <text
                  x="4"
                  y="2.8"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="800"
                  fill={accentColor}
                  fontFamily="inherit"
                >
                  {lastVal}
                </text>
              </g>
            )}
          </>
        )}
      </svg>
    </div>
  );
}
