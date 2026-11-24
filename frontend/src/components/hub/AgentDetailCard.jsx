import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { agentIconMap } from '../../data/sectors';
import AgentChart from './AgentChart';
import {
  X,
  Clock,
  Activity,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

/**
 * High-Clarity Glassmorphism Detail Card docked over the right-side video pane.
 * Features tailored operational charts, crisp typography, and respective agent accent color alignment.
 */
export default function AgentDetailCard({
  agent,
  metrics,
  sector,
  onClose,
  onLaunchApp
}) {
  // Listen for Esc key to close card
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!agent || !metrics) return null;

  const IconComponent = agentIconMap[agent.icon] || Activity;
  const accentColor = sector?.accentColor || '#10b981';

  return (
    <motion.div
      key={agent.id}
      className="hub-agent-detail-card transparent-glass"
      initial={{ opacity: 0, x: 50, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 30, scale: 0.95 }}
      transition={{
        type: 'spring',
        damping: 26,
        stiffness: 280,
        mass: 0.8
      }}
    >
      {/* Card Header with Respective Agent Colors */}
      <div className="detail-card-header">
        <div className="detail-header-left">
          <div
            className="detail-agent-icon-badge-glass"
            style={{
              backgroundColor: `${accentColor}18`,
              borderColor: `${accentColor}44`,
              color: accentColor
            }}
          >
            <IconComponent size={19} />
          </div>
          <div>
            <div
              className="detail-sector-badge-glass"
              style={{ color: accentColor }}
            >
              {sector?.name || 'Sector System'}
            </div>
            <h3 className="detail-agent-title-glass">{agent.name}</h3>
          </div>
        </div>

        <div className="detail-header-right">
          <span
            className="hub-status-chip-glass"
            style={{
              backgroundColor: `${accentColor}15`,
              borderColor: `${accentColor}35`,
              color: accentColor
            }}
          >
            <CheckCircle2 size={12} />
            <span>{metrics.status || 'Active'}</span>
          </span>
          <button
            className="detail-close-btn-glass"
            onClick={onClose}
            title="Close Card (Esc)"
            aria-label="Close details"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Mission Statement */}
      {metrics.mission && (
        <p className="detail-mission-text-glass">{metrics.mission}</p>
      )}

      {/* 3-4 KPI Metrics Grid (Crisp Contrast and Clear Alignment) */}
      <div className="detail-kpi-grid">
        {metrics.kpis?.map((kpi, idx) => (
          <motion.div
            key={idx}
            className="detail-kpi-tile-glass"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + idx * 0.04, duration: 0.25 }}
          >
            <div className="detail-kpi-label-glass">{kpi.label}</div>
            <div className="detail-kpi-val-row">
              <span className="detail-kpi-val-glass">{kpi.value}</span>
              {kpi.unit && <span className="detail-kpi-unit-glass">{kpi.unit}</span>}
            </div>
            {kpi.delta && (
              <div
                className="detail-kpi-delta-glass"
                style={{
                  color: kpi.deltaType === 'down' ? '#ef4444' : '#10b981'
                }}
              >
                <span>{kpi.delta}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Dynamic Tailored Chart Section */}
      <div className="detail-trend-section-glass">
        <div className="detail-trend-header">
          <span className="trend-title-glass">Performance Trend (Recent Cycle)</span>
          <div className="trend-updated-row-glass">
            <Clock size={11} />
            <span>{metrics.lastUpdated || 'Live'}</span>
          </div>
        </div>
        <div className="detail-sparkline-wrapper" style={{ height: '74px', marginTop: '2px' }}>
          <AgentChart
            agent={agent}
            metrics={metrics}
            accentColor={accentColor}
            height={74}
          />
        </div>
      </div>

      {/* System Recommendation Box (Frosted Glass Note) */}
      {metrics.recommendation && (
        <div
          className="detail-recommendation-box-glass"
          style={{ borderLeftColor: accentColor }}
        >
          <div
            className="recommendation-badge-glass"
            style={{ color: accentColor }}
          >
            System Note
          </div>
          <p className="recommendation-text-glass">{metrics.recommendation}</p>
        </div>
      )}

      {/* Launch Team Member Application Button */}
      <div className="detail-launch-action-row">
        {agent.appUrl ? (
          <button
            className="detail-launch-app-btn"
            onClick={() => {
              onLaunchApp?.(agent.appUrl, agent.name);
            }}
            title={`Launch full-screen ${agent.name} application`}
          >
            <ExternalLink size={15} />
            <span>Open Application</span>
          </button>
        ) : (
          <button
            className="detail-launch-app-btn placeholder-btn"
            onClick={() => onLaunchApp?.(null, agent.name)}
            title="Team member didn't provide application URL yet"
          >
            <Clock size={15} />
            <span>Team member didn't give URL</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
