import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Building2,
  TrendingUp,
  TrendingDown,
  Activity,
  Layers,
  LineChart as LineChartIcon,
  BarChart2,
  Gauge,
  Clock,
  Sparkles,
  Bot,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ShieldCheck,
  Cpu,
  RefreshCw,
  X,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Check,
  Box,
  Factory,
  Package,
  Sliders,
  ExternalLink,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Eye,
  GitPullRequest,
  Search,
  Wrench,
  Truck,
  CheckSquare,
  Shield,
  Users,
  DollarSign,
  Droplet,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  CornerDownRight,
  ListFilter
} from 'lucide-react';

import {
  PLANTS,
  PLANT_LINES,
  SHIFTS,
  DATE_PRESETS,
  AGENT_GROUPS,
  AGENTS_CONFIG
} from '../config/agents.config';
import { fetchAllReportsData, formatINR } from '../services/dataService';
import ReportChartRenderer from '../components/ReportChartRenderer';
import '../styles/reports.css';

// Icon Map for dynamic rendering
const ICON_MAP = {
  Calendar,
  Activity,
  Gauge,
  Box,
  ShieldCheck,
  Eye,
  GitPullRequest,
  Search,
  Wrench,
  Package,
  Building2,
  FileText: Layers,
  Truck,
  CheckSquare,
  Shield,
  Users,
  DollarSign,
  Zap,
  Droplet
};

export default function Reports({ onOpenAgent }) {
  // -------------------------------------------------------------------------
  // 1. URL State Synchronization (Shareable Links & Persistence)
  // -------------------------------------------------------------------------
  const parseFiltersFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      plant: params.get('plant') || 'ALL',
      shift: params.get('shift') || 'ALL',
      line: params.get('line') || 'ALL',
      datePreset: params.get('datePreset') || '30d',
      startDate: params.get('startDate') || '2026-10-26',
      endDate: params.get('endDate') || '2026-11-25',
      selectedAgents: params.get('agents') ? params.get('agents').split(',') : ['ALL'],
      severity: params.get('severity') || 'ALL',
      product: params.get('product') || 'ALL'
    };
  };

  const [filters, setFilters] = useState(parseFiltersFromUrl);
  const [activePreset, setActivePreset] = useState(filters.datePreset);
  const [selectedAgents, setSelectedAgents] = useState(filters.selectedAgents);
  const [isAgentDropdownOpen, setIsAgentDropdownOpen] = useState(false);

  // Sync state back to URL query string whenever filters change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('tab', 'reports');
    params.set('plant', filters.plant);
    params.set('shift', filters.shift);
    params.set('line', filters.line);
    params.set('datePreset', filters.datePreset);
    params.set('startDate', filters.startDate);
    params.set('endDate', filters.endDate);
    if (!filters.selectedAgents.includes('ALL')) {
      params.set('agents', filters.selectedAgents.join(','));
    } else {
      params.delete('agents');
    }
    if (filters.severity !== 'ALL') params.set('severity', filters.severity);
    else params.delete('severity');
    if (filters.product !== 'ALL') params.set('product', filters.product);
    else params.delete('product');

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [filters]);

  // -------------------------------------------------------------------------
  // 2. Data Fetching & Telemetry State
  // -------------------------------------------------------------------------
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [telemetryTick, setTelemetryTick] = useState(0);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [data, setData] = useState({
    lastUpdated: '11:45:00 IST',
    executiveKpis: [],
    plantComparison: [],
    agentData: {},
    agentErrors: {},
    aiInsights: []
  });

  // Load telemetry data from unified data service
  const loadData = useCallback(async (showSkeleton = true) => {
    if (showSkeleton) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const result = await fetchAllReportsData({ ...filters, tick: telemetryTick });
      setData(result);
    } catch (err) {
      console.error('Failed to load reports data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [filters, telemetryTick]);

  useEffect(() => {
    const isInitial = data.executiveKpis.length === 0;
    loadData(isInitial);
  }, [filters.plant, filters.shift, filters.line, filters.datePreset, filters.startDate, filters.endDate, filters.severity, filters.product]);

  // 30-Second Auto-Refresh Timer
  useEffect(() => {
    if (!autoRefreshEnabled) return;
    const interval = setInterval(() => {
      setTelemetryTick((prev) => prev + 1);
      loadData(false);
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefreshEnabled, loadData]);

  const handleManualRefresh = () => {
    setTelemetryTick((prev) => prev + 1);
    loadData(false);
  };

  // -------------------------------------------------------------------------
  // 3. Filter Handlers & Cascading Controls
  // -------------------------------------------------------------------------
  const handlePlantChange = (newPlant) => {
    setFilters((prev) => ({
      ...prev,
      plant: newPlant,
      line: 'ALL' // Reset line when plant cascades
    }));
  };

  const handleDatePresetChange = (presetId) => {
    setActivePreset(presetId);
    const today = new Date('2026-11-25');
    const toStr = today.toISOString().split('T')[0];

    let fromStr = toStr;
    if (presetId === 'today') {
      fromStr = toStr;
    } else if (presetId === '7d') {
      const d = new Date(today);
      d.setDate(d.getDate() - 7);
      fromStr = d.toISOString().split('T')[0];
    } else if (presetId === '30d') {
      const d = new Date(today);
      d.setDate(d.getDate() - 30);
      fromStr = d.toISOString().split('T')[0];
    } else if (presetId === 'quarter') {
      fromStr = '2026-10-01';
    }

    setFilters((prev) => ({
      ...prev,
      datePreset: presetId,
      startDate: fromStr,
      endDate: toStr
    }));
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      plant: 'ALL',
      shift: 'ALL',
      line: 'ALL',
      datePreset: '30d',
      startDate: '2026-10-26',
      endDate: '2026-11-25',
      selectedAgents: ['ALL'],
      severity: 'ALL',
      product: 'ALL'
    };
    setActivePreset('30d');
    setSelectedAgents(['ALL']);
    setFilters(defaultFilters);
  };

  // Cascading line options based on active plant
  const availableLines = useMemo(() => {
    return PLANT_LINES[filters.plant] || PLANT_LINES['ALL'];
  }, [filters.plant]);

  // Active filter count and removable chips
  const activeChips = useMemo(() => {
    const chips = [];
    if (filters.plant !== 'ALL') {
      const p = PLANTS.find((x) => x.id === filters.plant);
      chips.push({ key: 'plant', label: `Plant: ${p?.name || filters.plant}` });
    }
    if (filters.shift !== 'ALL') {
      chips.push({ key: 'shift', label: `Shift: ${filters.shift}` });
    }
    if (filters.line !== 'ALL') {
      const l = availableLines.find((x) => x.id === filters.line);
      chips.push({ key: 'line', label: `Line: ${l?.name || filters.line}` });
    }
    if (filters.datePreset !== '30d') {
      const pr = DATE_PRESETS.find((x) => x.id === filters.datePreset);
      chips.push({ key: 'datePreset', label: `Date: ${pr?.name || filters.datePreset}` });
    }
    if (filters.severity !== 'ALL') {
      chips.push({ key: 'severity', label: `Severity: ${filters.severity}` });
    }
    if (filters.product !== 'ALL') {
      chips.push({ key: 'product', label: `Product: ${filters.product}` });
    }
    if (!filters.selectedAgents.includes('ALL')) {
      chips.push({ key: 'agents', label: `Agents: ${filters.selectedAgents.length} Selected` });
    }
    return chips;
  }, [filters, availableLines]);

  const handleRemoveChip = (key) => {
    if (key === 'plant') handlePlantChange('ALL');
    else if (key === 'shift') setFilters((prev) => ({ ...prev, shift: 'ALL' }));
    else if (key === 'line') setFilters((prev) => ({ ...prev, line: 'ALL' }));
    else if (key === 'datePreset') handleDatePresetChange('30d');
    else if (key === 'severity') setFilters((prev) => ({ ...prev, severity: 'ALL' }));
    else if (key === 'product') setFilters((prev) => ({ ...prev, product: 'ALL' }));
    else if (key === 'agents') {
      setSelectedAgents(['ALL']);
      setFilters((prev) => ({ ...prev, selectedAgents: ['ALL'] }));
    }
  };

  // -------------------------------------------------------------------------
  // 4. Collapsible Agent Accordion State
  // -------------------------------------------------------------------------
  const [collapsedGroups, setCollapsedGroups] = useState({
    plan: false,
    produce: false,
    quality: false,
    maintain: false,
    supply_chain: false,
    safety_people: false,
    cost_energy: false
  });

  const toggleGroup = (groupId) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // Filtered agents based on multi-select
  const visibleAgents = useMemo(() => {
    if (filters.selectedAgents.includes('ALL')) {
      return AGENTS_CONFIG;
    }
    return AGENTS_CONFIG.filter((a) => filters.selectedAgents.includes(a.id));
  }, [filters.selectedAgents]);

  // -------------------------------------------------------------------------
  // 5. Drill-Down Detail Drawer State
  // -------------------------------------------------------------------------
  const [drawerDetail, setDrawerDetail] = useState(null);

  const handleOpenDrawer = (kpiOrChart, sourceTitle, accentColor = '#8b5cf6') => {
    setDrawerDetail({
      ...kpiOrChart,
      accentColor,
      sourceTitle: sourceTitle || 'Metric Telemetry'
    });
  };

  const handleCloseDrawer = () => {
    setDrawerDetail(null);
  };

  // Keyboard shortcut listener for drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setDrawerDetail(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // -------------------------------------------------------------------------
  // 6. Export Functions (CSV & Native PDF Print)
  // -------------------------------------------------------------------------
  const handleExportCSV = () => {
    let csv = `GWC DATA.AI - Consolidated Manufacturing Intelligence Report\n`;
    csv += `Export Generated,${new Date().toLocaleString('en-IN')}\n`;
    csv += `Selected Plant,${filters.plant === 'ALL' ? 'All Plants (Chennai & Bangalore)' : filters.plant}\n`;
    csv += `Selected Shift,${filters.shift}\n`;
    csv += `Date Range,${filters.startDate} to ${filters.endDate}\n\n`;

    csv += `EXECUTIVE SUMMARY HEADLINE KPIS\n`;
    csv += `Metric,Current Value,Target,Delta\n`;
    data.executiveKpis.forEach((k) => {
      csv += `"${k.name}","${k.value}","${k.target}","${k.delta}"\n`;
    });

    csv += `\nPLANT BENCHMARK COMPARISON\n`;
    csv += `Metric,Chennai (Tamil Nadu),Bangalore (Karnataka),Variance,Enterprise Target\n`;
    data.plantComparison.forEach((p) => {
      csv += `"${p.label}","${p.chennai} ${p.unit}","${p.bangalore} ${p.unit}","${p.variance} ${p.unit}","${p.target} ${p.unit}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `GWC_Manufacturing_Report_${filters.plant}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="reports-root-layout">
      {/* =================================================================== */}
      {/* 1. STICKY GLOBAL FILTER & EXPORT BAR (Cascading & URL Persistent)  */}
      {/* =================================================================== */}
      <div className="reports-sticky-filter-wrapper">
        <div className="reports-sticky-filter-bar">
          <div className="reports-filter-controls-row">
            {/* Plant Selector: STRICTLY Chennai and Bangalore */}
            <div className="reports-filter-field">
              <label className="reports-field-label">
                <Building2 size={13} />
                <span>Plant Facility</span>
              </label>
              <select
                className="reports-select-control"
                value={filters.plant}
                onChange={(e) => handlePlantChange(e.target.value)}
              >
                {PLANTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Selector */}
            <div className="reports-filter-field">
              <label className="reports-field-label">
                <Calendar size={13} />
                <span>Date Range</span>
              </label>
              <div className="reports-date-preset-pills">
                {DATE_PRESETS.map((dp) => (
                  <button
                    key={dp.id}
                    className={`date-preset-pill ${activePreset === dp.id ? 'active' : ''}`}
                    onClick={() => handleDatePresetChange(dp.id)}
                  >
                    {dp.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Range Picker (when custom is active) */}
            {activePreset === 'custom' && (
              <div className="reports-custom-date-box">
                <input
                  type="date"
                  className="reports-date-input"
                  value={filters.startDate}
                  onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value }))}
                />
                <span className="date-sep">to</span>
                <input
                  type="date"
                  className="reports-date-input"
                  value={filters.endDate}
                  onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value }))}
                />
              </div>
            )}

            {/* Production Line Selector (Cascades dynamically based on plant) */}
            <div className="reports-filter-field">
              <label className="reports-field-label">
                <Sliders size={13} />
                <span>Production Line</span>
              </label>
              <select
                className="reports-select-control"
                value={filters.line}
                onChange={(e) => setFilters((p) => ({ ...p, line: e.target.value }))}
              >
                {availableLines.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Shift Selector */}
            <div className="reports-filter-field">
              <label className="reports-field-label">
                <Clock size={13} />
                <span>Shift</span>
              </label>
              <select
                className="reports-select-control"
                value={filters.shift}
                onChange={(e) => setFilters((p) => ({ ...p, shift: e.target.value }))}
              >
                {SHIFTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Agent Multi-Select Filter */}
            <div className="reports-filter-field" style={{ position: 'relative' }}>
              <label className="reports-field-label">
                <Bot size={13} />
                <span>Agents ({filters.selectedAgents.includes('ALL') ? 'All 19' : filters.selectedAgents.length})</span>
              </label>
              <button
                type="button"
                className="reports-multi-select-btn"
                onClick={() => setIsAgentDropdownOpen(!isAgentDropdownOpen)}
              >
                <span>
                  {filters.selectedAgents.includes('ALL')
                    ? 'All Agents'
                    : `${filters.selectedAgents.length} Agents Selected`}
                </span>
                <ChevronDown size={13} />
              </button>

              {isAgentDropdownOpen && (
                <div className="reports-multi-select-popover">
                  <div className="popover-header">
                    <button
                      className="popover-action-link"
                      onClick={() => {
                        setSelectedAgents(['ALL']);
                        setFilters((p) => ({ ...p, selectedAgents: ['ALL'] }));
                      }}
                    >
                      Select All
                    </button>
                    <button
                      className="popover-action-link"
                      onClick={() => setIsAgentDropdownOpen(false)}
                    >
                      Done
                    </button>
                  </div>
                  <div className="popover-list">
                    {AGENTS_CONFIG.map((ag) => {
                      const isChecked = filters.selectedAgents.includes('ALL') || filters.selectedAgents.includes(ag.id);
                      return (
                        <label key={ag.id} className="popover-item">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              let next;
                              if (filters.selectedAgents.includes('ALL')) {
                                next = AGENTS_CONFIG.filter((x) => x.id !== ag.id).map((x) => x.id);
                              } else if (isChecked) {
                                next = filters.selectedAgents.filter((id) => id !== ag.id);
                                if (next.length === 0) next = ['ALL'];
                              } else {
                                next = [...filters.selectedAgents, ag.id];
                                if (next.length === AGENTS_CONFIG.length) next = ['ALL'];
                              }
                              setSelectedAgents(next);
                              setFilters((p) => ({ ...p, selectedAgents: next }));
                            }}
                          />
                          <span className="popover-item-name">{ag.name}</span>
                          {ag.status === 'coming_soon' && (
                            <span className="popover-soon-tag">Soon</span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Compact Telemetry & Export Action Row */}
          <div className="reports-filter-utility-row">
            <div className="reports-badge-row">
              <span className="reports-live-badge">
                <span className="live-dot" /> LIVE TELEMETRY
              </span>
              <span className="reports-scope-badge">
                Plant Scope: Chennai (TN) & Bangalore (KA) Only
              </span>
            </div>

            <div className="reports-header-actions">
              <div className="reports-refresh-status">
                <span className="status-label">Last updated:</span>
                <span className="status-time">{data.lastUpdated}</span>
              </div>

              <button
                className={`reports-btn-secondary ${isRefreshing ? 'spinning' : ''}`}
                onClick={handleManualRefresh}
                title="Refresh all agent telemetry data"
                disabled={isRefreshing}
              >
                <RefreshCw size={13} className={isRefreshing ? 'spin-icon' : ''} />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>

              <button
                className="reports-btn-secondary"
                onClick={handleExportCSV}
                title="Download CSV dataset"
              >
                <Download size={13} />
                <span>Export CSV</span>
              </button>

              <button
                className="reports-btn-primary"
                onClick={handleExportPDF}
                title="Print or export PDF report"
              >
                <Printer size={13} />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>

          {/* Active Chips & Reset Row */}
          {activeChips.length > 0 && (
            <div className="reports-active-chips-row">
              <span className="active-chips-lbl">Active Filters:</span>
              <div className="active-chips-list">
                {activeChips.map((c) => (
                  <span key={c.key} className="reports-filter-chip">
                    <span>{c.label}</span>
                    <button
                      className="chip-remove-btn"
                      onClick={() => handleRemoveChip(c.key)}
                      title={`Remove ${c.label}`}
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
              <button
                className="reports-reset-filters-btn"
                onClick={handleResetFilters}
                title="Reset all filters to factory defaults"
              >
                <RotateCcw size={12} />
                <span>Reset All</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. EXECUTIVE SUMMARY HEADLINE ROW (8 Headline KPI Cards)           */}
      {/* =================================================================== */}
      <section className="reports-executive-section">
        <div className="reports-section-title-bar">
          <div className="title-left">
            <Activity size={17} color="#8b5cf6" />
            <h2 className="section-title">Executive Operational Summary</h2>
            <span className="section-sub-tag">Enterprise Cross-Plant Baseline</span>
          </div>
          <span className="section-info-hint">Click any card for historical drill-down analysis</span>
        </div>

        {isLoading ? (
          <div className="reports-kpi-skeleton-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="reports-kpi-card-skeleton" />
            ))}
          </div>
        ) : (
          <div className="reports-executive-grid">
            {data.executiveKpis.map((kpi) => (
              <div
                key={kpi.id}
                className="reports-exec-card"
                onClick={() => handleOpenDrawer(kpi, 'Executive KPI Drill-Down')}
                title="Click to view detailed trends and underlying data"
              >
                <div className="exec-card-top">
                  <span className="exec-card-name">{kpi.name}</span>
                  <span className="exec-target-pill">Target: {kpi.target}</span>
                </div>

                <div className="exec-card-value-row">
                  <span className="exec-card-val">{kpi.value}</span>
                  <span className={`exec-card-delta ${kpi.isPositive ? 'good' : 'warning'}`}>
                    {kpi.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span>{kpi.delta}</span>
                  </span>
                </div>

                {/* SVG Sparkline */}
                <div className="exec-card-sparkline">
                  <svg viewBox="0 0 120 32" className="sparkline-svg">
                    <polyline
                      fill="none"
                      stroke={kpi.isPositive ? '#10b981' : '#f59e0b'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={kpi.sparkline
                        .map((val, idx) => {
                          const x = (idx / (kpi.sparkline.length - 1)) * 115 + 2;
                          const minVal = Math.min(...kpi.sparkline) * 0.98;
                          const maxVal = Math.max(...kpi.sparkline) * 1.02;
                          const y = 30 - ((val - minVal) / (maxVal - minVal || 1)) * 26;
                          return `${x.toFixed(1)},${y.toFixed(1)}`;
                        })
                        .join(' ')}
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =================================================================== */}
      {/* 4. PLANT COMPARISON SECTION: Chennai vs Bangalore                  */}
      {/* =================================================================== */}
      <section className="reports-plant-comp-section">
        <div className="reports-section-title-bar">
          <div className="title-left">
            <Factory size={17} color="#0ea5e9" />
            <h2 className="section-title">
              {filters.plant === 'ALL'
                ? 'Plant Benchmark: Chennai (Tamil Nadu) vs Bangalore (Karnataka)'
                : `Plant Facility Performance: ${filters.plant === 'IN-TN-01' ? 'Chennai' : 'Bangalore'} vs Target`}
            </h2>
          </div>
          <span className="comp-scope-pill">
            {filters.plant === 'ALL' ? 'Dual-Site Side by Side' : 'Site vs Benchmark'}
          </span>
        </div>

        <div className="reports-plant-comp-grid">
          {/* Comparative Grouped Bar Visual */}
          <div className="plant-comp-visual-card">
            <h3 className="comp-card-title">Cross-Plant Operational Variance</h3>
            <span className="comp-card-subtitle">Key efficiency & cost metrics benchmarked across plants</span>

            <div className="comp-bars-container">
              {data.plantComparison.map((m) => {
                const maxVal = Math.max(m.chennai, m.bangalore, m.target) * 1.15;
                const chnPct = (m.chennai / maxVal) * 100;
                const blrPct = (m.bangalore / maxVal) * 100;
                const tgtPct = (m.target / maxVal) * 100;

                return (
                  <div key={m.key} className="comp-bar-row">
                    <div className="comp-row-header">
                      <span className="comp-metric-label">{m.label}</span>
                      <span className="comp-metric-vals">
                        <strong style={{ color: '#0ea5e9' }}>CHN: {m.chennai}</strong> •{' '}
                        <strong style={{ color: '#8b5cf6' }}>BLR: {m.bangalore}</strong> (Tgt: {m.target})
                      </span>
                    </div>

                    <div className="comp-dual-track">
                      {/* Chennai Bar */}
                      <div className="comp-bar-subtrack">
                        <div
                          className="comp-bar-fill chennai"
                          style={{ width: `${chnPct}%` }}
                          title={`Chennai: ${m.chennai} ${m.unit}`}
                        />
                      </div>
                      {/* Bangalore Bar */}
                      <div className="comp-bar-subtrack">
                        <div
                          className="comp-bar-fill bangalore"
                          style={{ width: `${blrPct}%` }}
                          title={`Bangalore: ${m.bangalore} ${m.unit}`}
                        />
                      </div>
                      {/* Target Indicator Line */}
                      <div
                        className="comp-target-line"
                        style={{ left: `${tgtPct}%` }}
                        title={`Target: ${m.target} ${m.unit}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="comp-legend-row">
              <span className="legend-chip">
                <span className="legend-dot" style={{ background: '#0ea5e9' }} /> Chennai (TN)
              </span>
              <span className="legend-chip">
                <span className="legend-dot" style={{ background: '#8b5cf6' }} /> Bangalore (KA)
              </span>
              <span className="legend-chip">
                <span className="legend-line-icon" /> Enterprise Target
              </span>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="plant-comp-table-card">
            <h3 className="comp-card-title">Plant Performance Scorecard</h3>
            <span className="comp-card-subtitle">Delta analysis and plant variance metrics</span>

            <table className="plant-comp-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Chennai</th>
                  <th>Bangalore</th>
                  <th>Variance</th>
                  <th>Leader</th>
                </tr>
              </thead>
              <tbody>
                {data.plantComparison.map((row) => (
                  <tr key={row.key}>
                    <td className="metric-cell">{row.label}</td>
                    <td className="val-cell chn">{row.chennai}</td>
                    <td className="val-cell blr">{row.bangalore}</td>
                    <td className="delta-cell">
                      {row.variance > 0 ? `+${row.variance}` : row.variance} {row.unit}
                    </td>
                    <td>
                      <span className={`leader-tag ${row.leader === 'Chennai' ? 'chn' : 'blr'}`}>
                        {row.leader}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. COLLAPSIBLE AGENT ACCORDIONS (Grouped by Manufacturing Domain) */}
      {/* =================================================================== */}
      <section className="reports-agents-section">
        <div className="reports-section-title-bar">
          <div className="title-left">
            <Layers size={17} color="#8b5cf6" />
            <h2 className="section-title">Agent Telemetry & Analytical Modules</h2>
            <span className="section-sub-tag">19 Domain Agents</span>
          </div>
          <span className="section-info-hint">Grouped by Plan, Produce, Quality, Maintain, Supply Chain, Safety & Cost</span>
        </div>

        {AGENT_GROUPS.map((group) => {
          const groupAgents = visibleAgents.filter((a) => a.group === group.id);
          if (groupAgents.length === 0) return null;

          const isCollapsed = collapsedGroups[group.id];

          return (
            <div key={group.id} className="agent-group-accordion">
              {/* Group Header */}
              <div className="group-accordion-header" onClick={() => toggleGroup(group.id)}>
                <div className="group-title-row">
                  <span className="group-toggle-icon">
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                  </span>
                  <h3 className="group-title">{group.name}</h3>
                  <span className="group-agent-count">{groupAgents.length} Agents</span>
                </div>
                <span className="group-desc">{group.description}</span>
              </div>

              {/* Group Content */}
              {!isCollapsed && (
                <div className="group-agents-grid">
                  {groupAgents.map((agent) => {
                    const agentTelemetry = data.agentData[agent.id];
                    const agentError = data.agentErrors[agent.id];
                    const IconComp = ICON_MAP[agent.icon] || Activity;

                    // "Coming soon" state cards for unassigned agents
                    if (agent.status === 'coming_soon' || agentTelemetry?.isComingSoon) {
                      return (
                        <div key={agent.id} className="agent-card coming-soon-card">
                          <div className="agent-card-header">
                            <div className="agent-title-left">
                              <div className="agent-icon-box" style={{ background: '#94a3b822', color: '#64748b' }}>
                                <IconComp size={16} />
                              </div>
                              <div>
                                <h4 className="agent-name">{agent.name}</h4>
                                <span className="agent-status-badge soon">Coming soon</span>
                              </div>
                            </div>
                          </div>
                          <div className="coming-soon-body">
                            <p className="soon-desc">{agent.mission}</p>
                            <div className="soon-roadmap-box">
                              <Clock size={14} />
                              <span>Planned Q1 Ingestion: OPC-UA Gateway & Telemetry Broker</span>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Inline Error State per Agent
                    if (agentError) {
                      return (
                        <div key={agent.id} className="agent-card error-card">
                          <div className="agent-card-header">
                            <h4 className="agent-name">{agent.name}</h4>
                            <span className="agent-status-badge error">Connection Error</span>
                          </div>
                          <div className="error-body">
                            <AlertTriangle size={18} color="#ef4444" />
                            <span>{agentError}</span>
                            <button
                              className="retry-btn"
                              onClick={() => loadData(false)}
                            >
                              Retry Ingestion
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={agent.id}
                        className="agent-card"
                        style={{ '--agent-accent': agent.accentColor }}
                      >
                        {/* Agent Card Header */}
                        <div className="agent-card-header">
                          <div className="agent-title-left">
                            <div
                              className="agent-icon-box"
                              style={{ background: `${agent.accentColor}18`, color: agent.accentColor }}
                            >
                              <IconComp size={16} />
                            </div>
                            <div>
                              <div className="agent-name-row">
                                <h4 className="agent-name">{agent.name}</h4>
                                <span className="agent-status-badge live">Live Telemetry</span>
                              </div>
                              <span className="agent-mission-text">{agent.mission}</span>
                            </div>
                          </div>

                          {/* "Open agent" embedded app launcher */}
                          {agent.appUrl && (
                            <button
                              className="open-agent-link-btn"
                              onClick={() => onOpenAgent && onOpenAgent(agent.appUrl, agent.name)}
                              title={`Open ${agent.name} in embedded team member view`}
                            >
                              <span>Open agent</span>
                              <ExternalLink size={13} />
                            </button>
                          )}
                        </div>

                        {/* Agent KPI Tiles Row */}
                        {agentTelemetry?.kpis && agentTelemetry.kpis.length > 0 && (
                          <div className="agent-kpis-grid">
                            {agentTelemetry.kpis.map((kpi) => (
                              <div
                                key={kpi.id}
                                className="agent-kpi-tile"
                                onClick={() => handleOpenDrawer(kpi, `${agent.name} — ${kpi.name}`)}
                                title="Click to view detailed telemetry curve"
                              >
                                <span className="tile-label">{kpi.name}</span>
                                <div className="tile-val-row">
                                  <span className="tile-value">{kpi.value}</span>
                                  <span className={`tile-delta ${kpi.isPositive ? 'good' : 'warning'}`}>
                                    {kpi.delta}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 2 Agent Charts from KPI Catalog */}
                        {agentTelemetry?.charts && agentTelemetry.charts.length > 0 && (
                          <div className="agent-charts-row">
                            {agentTelemetry.charts.map((chart) => (
                              <div
                                key={chart.id}
                                className="agent-chart-box"
                                onClick={() => handleOpenDrawer(chart, `${agent.name} — ${chart.title}`, agent.accentColor)}
                              >
                                <div className="chart-header">
                                  <span className="chart-title" title={chart.title}>{chart.title}</span>
                                  <span className="chart-expand-hint">Expand ↗</span>
                                </div>
                                <ReportChartRenderer chart={chart} accentColor={agent.accentColor} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* =================================================================== */}
      {/* 6. AI INSIGHTS PANEL (Dynamic Synthesis from Filter State)         */}
      {/* =================================================================== */}
      <section className="reports-ai-insights-section">
        <div className="reports-section-title-bar">
          <div className="title-left">
            <Sparkles size={17} color="#8b5cf6" />
            <h2 className="section-title">AI Autonomous Diagnostics & Recommended Actions</h2>
            <span className="section-sub-tag">Synthesized across Chennai & Bangalore active telemetry</span>
          </div>
          <button
            className="ai-rescan-btn"
            onClick={handleManualRefresh}
            title="Re-run neural correlation model"
          >
            <Cpu size={13} />
            <span>Re-Analyze</span>
          </button>
        </div>

        <div className="reports-ai-insights-grid">
          {data.aiInsights.map((ins, idx) => (
            <div key={idx} className={`ai-insight-card ${ins.severity}`}>
              <div className="insight-card-top">
                <span className={`insight-badge ${ins.severity}`}>
                  {ins.type.toUpperCase()}
                </span>
                <span className="insight-ai-tag">GWC Neural Engine</span>
              </div>
              <h4 className="insight-title">{ins.title}</h4>
              <p className="insight-detail">{ins.detail}</p>
              <div className="insight-action-box">
                <span className="action-lbl">Recommended Action:</span>
                <span className="action-text">{ins.action}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 7. DRILL-DOWN DETAIL DRAWER (Overlay for Deep Telemetry & Table)    */}
      {/* =================================================================== */}
      <AnimatePresence>
        {drawerDetail && (
          <div className="reports-drawer-backdrop" onClick={handleCloseDrawer}>
            <motion.div
              className="reports-drawer-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="drawer-header">
                <div>
                  <span className="drawer-sub">{drawerDetail.sourceTitle}</span>
                  <h3 className="drawer-title">{drawerDetail.name || drawerDetail.title}</h3>
                </div>
                <button
                  className="drawer-close-btn"
                  onClick={handleCloseDrawer}
                  title="Close (Esc)"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="drawer-content">
                {/* Metric Summary */}
                {drawerDetail.value && (
                  <div className="drawer-metric-hero">
                    <span className="hero-val">{drawerDetail.value}</span>
                    <span className="hero-target">Target Benchmark: {drawerDetail.target || 'Optimal'}</span>
                    <span className="hero-delta">{drawerDetail.delta}</span>
                  </div>
                )}

                {/* Dynamic Chart matching the clicked KPI or chart type */}
                <div className="drawer-chart-card">
                  <h4 className="drawer-chart-title">
                    {drawerDetail.type
                      ? `${drawerDetail.title} (${drawerDetail.type.replace('_', ' ').toUpperCase()})`
                      : 'Historical Time-Series Telemetry (Last 30 Days)'}
                  </h4>
                  <ReportChartRenderer
                    chart={
                      drawerDetail.type
                        ? drawerDetail
                        : {
                            id: `kpi-${drawerDetail.id || 'trend'}`,
                            title: drawerDetail.name || 'Telemetry Trend',
                            type: 'area',
                            series: [
                              {
                                name: drawerDetail.name || 'Metric Value',
                                color: '#8b5cf6',
                                data: drawerDetail.sparkline || [84, 86, 85, 87, 88, 87.5, 89, 88.6, 89.2, 89.8]
                              }
                            ],
                            labels: ['D-27', 'D-24', 'D-21', 'D-18', 'D-15', 'D-12', 'D-9', 'D-6', 'D-3', 'Today']
                          }
                    }
                    accentColor={drawerDetail.accentColor || '#8b5cf6'}
                    expanded
                  />
                  <div className="drawer-chart-legend">
                    <span>Baseline: Chennai (IN-TN-01)</span>
                    <span>Secondary: Bangalore (IN-KA-01)</span>
                  </div>
                </div>

                {/* Underlying Table */}
                <div className="drawer-table-card">
                  <div className="drawer-table-header">
                    <h4>Underlying Shift Log Records</h4>
                    <span className="table-count">6 Sample Records</span>
                  </div>

                  <table className="drawer-table">
                    <thead>
                      <tr>
                        <th>Date & Shift</th>
                        <th>Plant Facility</th>
                        <th>Line / Station</th>
                        <th>Output</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>25-Nov-2026 Shift A</td>
                        <td>Chennai (TN)</td>
                        <td>SMT Line 1</td>
                        <td>99.4% FPY</td>
                        <td><span className="status-badge-good">Optimal</span></td>
                      </tr>
                      <tr>
                        <td>24-Nov-2026 Shift B</td>
                        <td>Chennai (TN)</td>
                        <td>Wave Line 2</td>
                        <td>98.8% FPY</td>
                        <td><span className="status-badge-good">Optimal</span></td>
                      </tr>
                      <tr>
                        <td>24-Nov-2026 Shift C</td>
                        <td>Bangalore (KA)</td>
                        <td>Press Line 1</td>
                        <td>86.4% OEE</td>
                        <td><span className="status-badge-warn">Warning</span></td>
                      </tr>
                      <tr>
                        <td>23-Nov-2026 Shift A</td>
                        <td>Bangalore (KA)</td>
                        <td>Wire Harness 2</td>
                        <td>98.2% OTIF</td>
                        <td><span className="status-badge-good">Optimal</span></td>
                      </tr>
                      <tr>
                        <td>23-Nov-2026 Shift B</td>
                        <td>Chennai (TN)</td>
                        <td>Box Build 4</td>
                        <td>99.1% FPY</td>
                        <td><span className="status-badge-good">Optimal</span></td>
                      </tr>
                      <tr>
                        <td>22-Nov-2026 Shift A</td>
                        <td>Bangalore (KA)</td>
                        <td>Assembly Line 3</td>
                        <td>88.0% OEE</td>
                        <td><span className="status-badge-good">Optimal</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
