import React from 'react';

const PALETTE = ['#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

function isBenchmarkSeries(name = '') {
  const lower = name.toLowerCase();
  return (
    lower.includes('target') ||
    lower.includes('threshold') ||
    lower.includes('cap') ||
    lower.includes('floor') ||
    lower.includes('ucl') ||
    lower.includes('lcl')
  );
}

/**
 * Shared chart renderer supporting compact report cards and enlarged drill-down drawer views.
 */
export default function ReportChartRenderer({ chart, accentColor = '#8b5cf6', expanded = false }) {
  if (!chart || !chart.type) return null;

  const svgWidth = expanded ? 420 : 280;
  const svgHeight = expanded ? 165 : 86;
  const padLeft = expanded ? 34 : 10;
  const padRight = expanded ? 14 : 10;
  const padTop = expanded ? 16 : 10;
  const padBottom = expanded ? 28 : 16;
  const plotW = svgWidth - padLeft - padRight;
  const plotH = svgHeight - padTop - padBottom;

  // 1. Line / Area / SPC Control Charts (shared Y-scale across all series)
  if (chart.type === 'line' || chart.type === 'area' || chart.type === 'spc') {
    const series = chart.series || [];
    const labels = chart.labels || [];
    const allValues = series.flatMap((s) => s.data || []);
    if (allValues.length === 0) return null;

    const rawMin = Math.min(...allValues);
    const rawMax = Math.max(...allValues);
    const span = rawMax - rawMin || Math.max(Math.abs(rawMax) * 0.1, 1);
    const minVal = rawMin - span * 0.15;
    const maxVal = rawMax + span * 0.15;
    const range = maxVal - minVal || 1;

    const toX = (idx, len) => (len <= 1 ? padLeft + plotW / 2 : padLeft + (idx / (len - 1)) * plotW);
    const toY = (val) => padTop + plotH - ((val - minVal) / range) * plotH;

    const primarySeries = series[0];
    const primaryPoints = (primarySeries?.data || []).map((v, i) => ({
      x: toX(i, primarySeries.data.length),
      y: toY(v),
      val: v
    }));

    // For SPC, shade the control band between UCL and LCL if present
    const uclSeries = series.find((s) => s.name?.toLowerCase().includes('ucl'));
    const lclSeries = series.find((s) => s.name?.toLowerCase().includes('lcl'));
    const gradId = `areaGrad_${(chart.id || 'chart').replace(/[^a-zA-Z0-9_-]/g, '')}_${expanded ? 'lg' : 'sm'}`;

    return (
      <div className={`rc-chart-wrap ${expanded ? 'expanded' : 'compact'}`}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className={expanded ? 'drawer-trend-svg' : 'chart-svg'}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={primarySeries?.color || accentColor} stopOpacity="0.34" />
              <stop offset="100%" stopColor={primarySeries?.color || accentColor} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Subtle horizontal gridlines */}
          {[0, 0.5, 1].map((t, idx) => {
            const gy = padTop + plotH * t;
            const labelVal = (maxVal - range * t).toFixed(rawMax >= 100 ? 0 : 1);
            return (
              <g key={idx}>
                <line
                  x1={padLeft}
                  y1={gy}
                  x2={svgWidth - padRight}
                  y2={gy}
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  strokeDasharray="3 3"
                />
                {expanded && (
                  <text x={padLeft - 4} y={gy + 3} textAnchor="end" fontSize="8.5" fill="currentColor" opacity="0.6">
                    {labelVal}
                  </text>
                )}
              </g>
            );
          })}

          {/* SPC 3-Sigma control band */}
          {chart.type === 'spc' && uclSeries && lclSeries && (
            <rect
              x={padLeft}
              y={toY(uclSeries.data[0])}
              width={plotW}
              height={Math.max(2, toY(lclSeries.data[0]) - toY(uclSeries.data[0]))}
              fill="#10b981"
              fillOpacity="0.1"
            />
          )}

          {/* Area fill under primary non-target series */}
          {chart.type === 'area' && primaryPoints.length > 1 && (
            <polygon
              fill={`url(#${gradId})`}
              points={`${primaryPoints[0].x.toFixed(1)},${padTop + plotH} ${primaryPoints
                .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
                .join(' ')} ${primaryPoints[primaryPoints.length - 1].x.toFixed(1)},${padTop + plotH}`}
            />
          )}

          {/* Series polylines & markers */}
          {series.map((s, sIdx) => {
            const dataArr = s.data || [];
            if (dataArr.length === 0) return null;
            const benchmark = isBenchmarkSeries(s.name);
            const pts = dataArr.map((v, i) => `${toX(i, dataArr.length).toFixed(1)},${toY(v).toFixed(1)}`).join(' ');
            const color = s.color || PALETTE[sIdx % PALETTE.length];

            return (
              <g key={sIdx}>
                <polyline
                  fill="none"
                  stroke={color}
                  strokeWidth={benchmark ? 1.5 : expanded ? 2.4 : 2}
                  strokeDasharray={benchmark ? '4 3' : undefined}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={pts}
                />
                {!benchmark &&
                  dataArr.map((v, i) => (
                    <circle
                      key={i}
                      cx={toX(i, dataArr.length)}
                      cy={toY(v)}
                      r={expanded ? 3 : 2}
                      fill={color}
                    >
                      <title>{`${s.name}: ${v}${labels[i] ? ` (${labels[i]})` : ''}`}</title>
                    </circle>
                  ))}
              </g>
            );
          })}

          {/* X-axis tick labels */}
          {labels.length > 0 &&
            labels.map((lbl, idx) => {
              const show = expanded
                ? labels.length <= 8 || idx % 2 === 0 || idx === labels.length - 1
                : idx === 0 || idx === Math.floor(labels.length / 2) || idx === labels.length - 1;
              if (!show) return null;
              return (
                <text
                  key={idx}
                  x={toX(idx, labels.length)}
                  y={svgHeight - 4}
                  textAnchor={idx === 0 ? 'start' : idx === labels.length - 1 ? 'end' : 'middle'}
                  fontSize={expanded ? '9' : '8'}
                  fill="currentColor"
                  opacity="0.62"
                >
                  {lbl}
                </text>
              );
            })}
        </svg>

        <div className="rc-legend-inline">
          {series.map((s, idx) => (
            <span key={idx} className="rc-legend-chip">
              <span
                className="rc-legend-swatch"
                style={
                  isBenchmarkSeries(s.name)
                    ? {
                        background: 'transparent',
                        borderTop: `2px dashed ${s.color || PALETTE[idx % PALETTE.length]}`,
                        height: 0
                      }
                    : {
                        background: s.color || PALETTE[idx % PALETTE.length]
                      }
                }
              />
              <span>{s.name}</span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  // 2. Vertical Bar Chart
  if (chart.type === 'bar') {
    const items = chart.data || [];
    if (items.length === 0) return null;
    const maxB = Math.max(...items.map((x) => x.value), 1) * 1.18;
    const slotW = plotW / items.length;
    const barW = Math.min(expanded ? 42 : 28, Math.max(10, slotW - 10));

    return (
      <div className={`rc-chart-wrap ${expanded ? 'expanded' : 'compact'}`}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className={expanded ? 'drawer-trend-svg' : 'chart-svg'}>
          <line x1={padLeft} y1={padTop + plotH} x2={svgWidth - padRight} y2={padTop + plotH} stroke="currentColor" strokeOpacity="0.15" />
          {items.map((b, idx) => {
            const barH = Math.max(3, (b.value / maxB) * plotH);
            const barX = padLeft + idx * slotW + (slotW - barW) / 2;
            const barY = padTop + plotH - barH;
            const shortLbl = b.name.length > (expanded ? 14 : 9) ? `${b.name.slice(0, expanded ? 12 : 7)}…` : b.name;
            return (
              <g key={idx}>
                <rect x={barX} y={barY} width={barW} height={barH} rx="3" fill={b.color || accentColor} opacity="0.9">
                  <title>{`${b.name}: ${b.value}`}</title>
                </rect>
                <text x={barX + barW / 2} y={barY - 3} textAnchor="middle" fontSize={expanded ? '9.5' : '8.5'} fontWeight="700" fill="currentColor" opacity="0.85">
                  {b.value}
                </text>
                <text x={barX + barW / 2} y={svgHeight - 4} textAnchor="middle" fontSize={expanded ? '8.5' : '7.5'} fill="currentColor" opacity="0.65">
                  {shortLbl}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  // 3. Grouped Dual-Plant Bar Chart (Chennai vs Bangalore)
  if (chart.type === 'grouped_bar') {
    const items = chart.data || [];
    if (items.length === 0) return null;
    const maxV = Math.max(...items.flatMap((d) => [d.Chennai || 0, d.Bangalore || 0]), 1) * 1.18;
    const slotW = plotW / items.length;
    const subW = Math.min(expanded ? 22 : 14, Math.max(7, (slotW - 14) / 2));

    return (
      <div className={`rc-chart-wrap ${expanded ? 'expanded' : 'compact'}`}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className={expanded ? 'drawer-trend-svg' : 'chart-svg'}>
          <line x1={padLeft} y1={padTop + plotH} x2={svgWidth - padRight} y2={padTop + plotH} stroke="currentColor" strokeOpacity="0.15" />
          {items.map((d, idx) => {
            const cx = padLeft + idx * slotW + slotW / 2;
            const chnH = Math.max(3, ((d.Chennai || 0) / maxV) * plotH);
            const blrH = Math.max(3, ((d.Bangalore || 0) / maxV) * plotH);
            const chnY = padTop + plotH - chnH;
            const blrY = padTop + plotH - blrH;
            const lbl = (d.shift || d.category || d.name || '').replace(/ \(.+\)/, '');
            const shortLbl = lbl.length > (expanded ? 14 : 9) ? `${lbl.slice(0, expanded ? 12 : 8)}…` : lbl;

            return (
              <g key={idx}>
                <rect x={cx - subW - 1.5} y={chnY} width={subW} height={chnH} rx="2.5" fill="#0ea5e9">
                  <title>{`${lbl} — Chennai: ${d.Chennai}`}</title>
                </rect>
                <text x={cx - subW / 2 - 1.5} y={chnY - 3} textAnchor="middle" fontSize={expanded ? '8.5' : '7.5'} fontWeight="700" fill="#0ea5e9">
                  {d.Chennai}
                </text>
                <rect x={cx + 1.5} y={blrY} width={subW} height={blrH} rx="2.5" fill="#8b5cf6">
                  <title>{`${lbl} — Bangalore: ${d.Bangalore}`}</title>
                </rect>
                <text x={cx + subW / 2 + 1.5} y={blrY - 3} textAnchor="middle" fontSize={expanded ? '8.5' : '7.5'} fontWeight="700" fill="#8b5cf6">
                  {d.Bangalore}
                </text>
                <text x={cx} y={svgHeight - 4} textAnchor="middle" fontSize={expanded ? '8.5' : '7.5'} fill="currentColor" opacity="0.65">
                  {shortLbl}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="rc-legend-inline">
          <span className="rc-legend-chip">
            <span className="rc-legend-swatch" style={{ background: '#0ea5e9' }} />
            <span>Chennai (TN)</span>
          </span>
          <span className="rc-legend-chip">
            <span className="rc-legend-swatch" style={{ background: '#8b5cf6' }} />
            <span>Bangalore (KA)</span>
          </span>
        </div>
      </div>
    );
  }

  // 4. Stacked Bar Chart
  if (chart.type === 'stacked_bar') {
    const items = chart.data || [];
    const segments = chart.segments || [];
    if (items.length === 0 || segments.length === 0) return null;

    return (
      <div className={`rc-stacked-wrap ${expanded ? 'expanded' : 'compact'}`}>
        <div className="rc-stacked-rows">
          {items.map((row, rIdx) => {
            const total = segments.reduce((sum, seg) => sum + (Number(row[seg.key]) || 0), 0) || 1;
            return (
              <div key={rIdx} className="rc-stacked-row">
                <div className="rc-stacked-meta">
                  <span className="rc-stacked-label">{row.name}</span>
                  <span className="rc-stacked-total">{row.totalLabel || `${total}`}</span>
                </div>
                <div className="rc-stacked-track">
                  {segments.map((seg, sIdx) => {
                    const val = Number(row[seg.key]) || 0;
                    const pct = (val / total) * 100;
                    return (
                      <div
                        key={sIdx}
                        className="rc-stacked-seg"
                        style={{ width: `${pct}%`, background: seg.color || PALETTE[sIdx % PALETTE.length] }}
                        title={`${row.name} — ${seg.label}: ${val}`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="rc-legend-inline">
          {segments.map((seg, idx) => (
            <span key={idx} className="rc-legend-chip">
              <span className="rc-legend-swatch" style={{ background: seg.color || PALETTE[idx % PALETTE.length] }} />
              <span>{seg.label}</span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  // 5. Horizontal Bar Chart
  if (chart.type === 'horizontal_bar') {
    const items = chart.data || [];
    if (items.length === 0) return null;
    const maxVal = Math.max(...items.map((d) => Number(d.value ?? d.count ?? 0)), 1);

    return (
      <div className={`rc-hbar-list ${expanded ? 'expanded' : 'compact'}`}>
        {items.map((item, idx) => {
          const val = Number(item.value ?? item.count ?? 0);
          const pct = Math.min(100, (val / maxVal) * 100);
          const color = item.color || accentColor;
          return (
            <div key={idx} className="rc-hbar-row">
              <span className="rc-hbar-label" title={item.name}>
                {item.name}
              </span>
              <div className="rc-hbar-track">
                <div className="rc-hbar-fill" style={{ width: `${pct}%`, background: color }} />
              </div>
              <span className="rc-hbar-val">
                {item.displayVal || (item.resolved != null ? `${item.resolved}/${item.count}` : val)}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  // 6. Pareto Chart (Bars + Cumulative % Curve)
  if (chart.type === 'pareto') {
    const items = chart.data || [];
    if (items.length === 0) return null;
    const maxC = Math.max(...items.map((x) => x.count), 1) * 1.18;
    const slotW = plotW / items.length;
    const barW = Math.min(expanded ? 40 : 26, Math.max(10, slotW - 10));

    const cumPoints = items
      .map((p, idx) => {
        const cx = padLeft + idx * slotW + slotW / 2;
        const pctNum = Number(p.cumPct ?? 100);
        const cy = padTop + plotH - (pctNum / 100) * plotH;
        return `${cx.toFixed(1)},${cy.toFixed(1)}`;
      })
      .join(' ');

    return (
      <div className={`rc-chart-wrap ${expanded ? 'expanded' : 'compact'}`}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className={expanded ? 'drawer-trend-svg' : 'chart-svg'}>
          <line x1={padLeft} y1={padTop + plotH} x2={svgWidth - padRight} y2={padTop + plotH} stroke="currentColor" strokeOpacity="0.15" />
          {items.map((p, idx) => {
            const barH = Math.max(3, (p.count / maxC) * plotH);
            const barX = padLeft + idx * slotW + (slotW - barW) / 2;
            const barY = padTop + plotH - barH;
            const shortLbl = p.name.length > (expanded ? 12 : 8) ? `${p.name.slice(0, expanded ? 10 : 6)}…` : p.name;
            return (
              <g key={idx}>
                <rect x={barX} y={barY} width={barW} height={barH} rx="3" fill="#0ea5e9" opacity="0.82">
                  <title>{`${p.name}: ${p.count} (${p.pct}, Cum ${p.cumPct}%)`}</title>
                </rect>
                <text x={barX + barW / 2} y={barY - 3} textAnchor="middle" fontSize={expanded ? '9' : '8'} fontWeight="700" fill="currentColor" opacity="0.85">
                  {p.count}
                </text>
                <text x={barX + barW / 2} y={svgHeight - 4} textAnchor="middle" fontSize={expanded ? '8.5' : '7.5'} fill="currentColor" opacity="0.65">
                  {shortLbl}
                </text>
              </g>
            );
          })}
          {/* Cumulative % Curve */}
          <polyline fill="none" stroke="#f59e0b" strokeWidth={expanded ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" points={cumPoints} />
          {items.map((p, idx) => {
            const cx = padLeft + idx * slotW + slotW / 2;
            const pctNum = Number(p.cumPct ?? 100);
            const cy = padTop + plotH - (pctNum / 100) * plotH;
            return (
              <circle key={`pt_${idx}`} cx={cx} cy={cy} r={expanded ? 3 : 2} fill="#f59e0b">
                <title>{`Cumulative: ${pctNum}%`}</title>
              </circle>
            );
          })}
        </svg>
        <div className="rc-legend-inline">
          <span className="rc-legend-chip">
            <span className="rc-legend-swatch" style={{ background: '#0ea5e9' }} />
            <span>Defect Count</span>
          </span>
          <span className="rc-legend-chip">
            <span className="rc-legend-swatch" style={{ background: '#f59e0b' }} />
            <span>Cumulative % (80/20)</span>
          </span>
        </div>
      </div>
    );
  }

  // 7. Dynamic Multi-Segment Donut Chart
  if (chart.type === 'donut') {
    const items = chart.data || [];
    const total = items.reduce((sum, d) => sum + (Number(d.value) || 0), 0) || 1;
    const radius = 15.915;
    let cumulativePct = 0;
    const size = expanded ? 126 : 64;
    const topPct = Math.round(((Number(items[0]?.value) || 0) / total) * 100);

    return (
      <div className={`chart-donut-layout ${expanded ? 'expanded' : ''}`}>
        <svg width={size} height={size} viewBox="0 0 42 42" className="donut-svg">
          <circle cx="21" cy="21" r={radius} fill="transparent" stroke="rgba(148,163,184,0.2)" strokeWidth="5.5" />
          {items.map((d, idx) => {
            const pct = ((Number(d.value) || 0) / total) * 100;
            const offset = 25 - cumulativePct;
            cumulativePct += pct;
            return (
              <circle
                key={idx}
                cx="21"
                cy="21"
                r={radius}
                fill="transparent"
                stroke={d.color || PALETTE[idx % PALETTE.length]}
                strokeWidth="5.5"
                strokeDasharray={`${pct.toFixed(2)} ${(100 - pct).toFixed(2)}`}
                strokeDashoffset={offset.toFixed(2)}
              >
                <title>{`${d.name}: ${d.value}%`}</title>
              </circle>
            );
          })}
          <text x="21" y="22.5" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="currentColor">
            {topPct}%
          </text>
        </svg>
        <div className="donut-legend">
          {items.map((d, dIdx) => (
            <span key={dIdx} className="donut-legend-item" title={`${d.name}: ${d.value}%`}>
              <span className="dot" style={{ background: d.color || PALETTE[dIdx % PALETTE.length] }} />
              <span className="text">
                {d.name}: <strong>{d.value}%</strong>
              </span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  // 8. Radial Gauge Chart
  if (chart.type === 'radial_gauge') {
    const score = Number(chart.value ?? 96);
    const target = Number(chart.target ?? 95);
    const color = chart.color || accentColor;
    const radius = 15.915;
    const size = expanded ? 124 : 64;
    const breakdown = chart.breakdown || [];

    return (
      <div className={`chart-donut-layout ${expanded ? 'expanded' : ''}`}>
        <svg width={size} height={size} viewBox="0 0 42 42" className="donut-svg">
          <circle cx="21" cy="21" r={radius} fill="transparent" stroke="rgba(148,163,184,0.2)" strokeWidth="5" />
          <circle
            cx="21"
            cy="21"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${Math.min(100, score).toFixed(1)} ${(100 - Math.min(100, score)).toFixed(1)}`}
            strokeDashoffset="25"
          />
          <text x="21" y="21.5" textAnchor="middle" fontSize="7.2" fontWeight="800" fill="currentColor">
            {score}%
          </text>
          <text x="21" y="28" textAnchor="middle" fontSize="3.8" fontWeight="600" fill="currentColor" opacity="0.6">
            Tgt {target}%
          </text>
        </svg>
        <div className="donut-legend">
          {breakdown.map((b, idx) => (
            <span key={idx} className="donut-legend-item">
              <span className="dot" style={{ background: b.color || color }} />
              <span className="text">
                {b.label}: <strong>{b.value}</strong>
              </span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  // 9. Gantt Timeline Schedule
  if (chart.type === 'gantt') {
    const items = chart.data || [];
    return (
      <div className={`chart-mini-gantt ${expanded ? 'expanded' : ''}`}>
        {items.map((task, tIdx) => (
          <div key={tIdx} className="mini-gantt-row">
            <span className="task-line" title={task.line}>
              {task.line}
            </span>
            <div className="task-track">
              <div
                className="task-fill"
                style={{
                  left: `${(task.start / 24) * 100}%`,
                  width: `${Math.max(8, ((task.end - task.start) / 24) * 100)}%`,
                  background: task.color
                }}
                title={`${task.task} (${String(task.start).padStart(2, '0')}:00–${String(task.end).padStart(2, '0')}:00)`}
              >
                {expanded ? `${task.task} (${task.start}h–${task.end}h)` : task.task}
              </div>
            </div>
          </div>
        ))}
        <div className="rc-gantt-axis">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>
      </div>
    );
  }

  return null;
}
