import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Minus, ArrowLeft, Activity } from 'lucide-react';
import { agentIconMap } from '../../data/sectors';

/**
 * Universal SectorTree Component
 * Dynamically displays any of the 6 industry sectors in the clean,
 * compact vertical branch/tree format matching Image 2:
 *
 * 1. Back pill at top-left: "← Overview"
 * 2. Parent sector circle on the left with sector logo, minus badge, and pill title.
 * 3. Dashed orthogonal tree connector (horizontal stem -> vertical spine -> horizontal branches).
 * 4. Staggered animated sub-section / agent nodes (circular icon badge + pill badge with green live dot).
 * 5. Compact, centered, perfectly sized (not too big).
 */
export default function SectorTree({
  sector,
  allSectors = [],
  activeAgentId = null,
  onSelectAgent,
  onSelectSector,
  onCollapse
}) {
  const agents = sector?.agents || [];
  const N = agents.length;

  // Geometry: Compact & Centered in the 700x570 blueprint stage
  const STAGE_CENTER_Y = 285;
  const PARENT_X = 120;
  const PARENT_Y = STAGE_CENTER_Y;
  const PILL_START_X = 158;
  const PILL_WIDTH = 115;
  const STEM_START_X = PILL_START_X + PILL_WIDTH; // ~273px
  const TRUNK_X = 328;
  const AGENT_X = 376;
  const AGENT_PILL_X = AGENT_X + 44; // 24px clean gap

  // Dynamic vertical step to ensure it is never too big, always sleek & centered
  const stepY = useMemo(() => {
    if (N >= 5) return 56;
    if (N === 4) return 60;
    if (N === 3) return 66;
    return 70;
  }, [N]);

  // Compute centered Y coordinate for each branch
  const agentRows = useMemo(() => {
    return agents.map((agent, idx) => {
      const y = Math.round(STAGE_CENTER_Y + (idx - (N - 1) / 2) * stepY);
      return {
        ...agent,
        y
      };
    });
  }, [agents, N, stepY]);

  const minY = agentRows.length > 0 ? agentRows[0].y : STAGE_CENTER_Y;
  const maxY = agentRows.length > 0 ? agentRows[agentRows.length - 1].y : STAGE_CENTER_Y;

  const accentColor = sector?.accentColor || '#a855f7';

  return (
    <motion.div
      className="hub-sector-tree-view"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Top Navigation Bar: Back button + Sector quick-switch pills */}
      <div className="sector-tree-top-bar">
        <button
          className="sector-tree-back-btn"
          onClick={onCollapse}
          title="Return to 6-Sector Overview"
        >
          <ArrowLeft size={14} strokeWidth={2.4} />
          <span>Overview</span>
        </button>

        {allSectors.length > 0 && (
          <div className="sector-tree-chips">
            {allSectors.map((s) => {
              const isCurrent = s.id === sector?.id;
              return (
                <button
                  key={s.id}
                  className={`sector-chip ${isCurrent ? 'active' : ''}`}
                  onClick={() => onSelectSector?.(s.id)}
                  title={`Switch to ${s.name}`}
                >
                  <span
                    className="sector-chip-dot"
                    style={{ backgroundColor: s.accentColor || '#8b5cf6' }}
                  />
                  <span>{s.shortName || s.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* SVG Dashed Orthogonal Tree Connectors */}
      <svg className="sector-tree-svg" aria-hidden="true">
        {/* 1. Horizontal Stem from Sector Pill to Vertical Spine */}
        <line
          x1={STEM_START_X}
          y1={PARENT_Y}
          x2={TRUNK_X}
          y2={PARENT_Y}
          stroke="rgba(168, 85, 247, 0.65)"
          strokeWidth="1.8"
          strokeDasharray="4 4"
        />

        {/* 2. Vertical Spine Trunk connecting all branches */}
        {agentRows.length > 1 && (
          <line
            x1={TRUNK_X}
            y1={minY}
            x2={TRUNK_X}
            y2={maxY}
            stroke="rgba(168, 85, 247, 0.65)"
            strokeWidth="1.8"
            strokeDasharray="4 4"
          />
        )}

        {/* 3. Horizontal Branches from Trunk to each Agent Disc */}
        {agentRows.map((row) => (
          <line
            key={`branch-${row.id}`}
            x1={TRUNK_X}
            y1={row.y}
            x2={AGENT_X}
            y2={row.y}
            stroke="rgba(168, 85, 247, 0.65)"
            strokeWidth="1.8"
            strokeDasharray="4 4"
          />
        ))}
      </svg>

      {/* Parent Sector Node on the Left */}
      <div
        className="tree-parent-anchor"
        style={{ left: `${PARENT_X}px`, top: `${PARENT_Y}px` }}
      >
        <motion.div
          className="tree-parent-disc"
          onClick={onCollapse}
          role="button"
          tabIndex={0}
          title={`Click to collapse ${sector?.name}`}
          aria-label={`Collapse ${sector?.name}`}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          style={{
            borderColor: accentColor,
            boxShadow: `0 0 0 3px ${accentColor}25, 0 8px 24px ${accentColor}30`
          }}
        >
          {sector?.logo ? (
            <img
              src={sector.logo}
              alt={sector.name}
              className="tree-parent-logo-img"
            />
          ) : (
            <Activity size={24} color={accentColor} />
          )}

          {/* Minus (-) Collapse Badge */}
          <div
            className="tree-minus-badge"
            onClick={(e) => {
              e.stopPropagation();
              onCollapse?.();
            }}
            title="Collapse back to overview"
            aria-label="Collapse"
            style={{ backgroundColor: accentColor }}
          >
            <Minus size={11} strokeWidth={3.4} color="#ffffff" />
          </div>
        </motion.div>

        {/* Sector Pill Label */}
        <div className="tree-parent-pill">
          <span>{sector?.shortName || sector?.name}</span>
        </div>
      </div>

      {/* The Sub-Section / Agent Rows in Image 2 Format */}
      {agentRows.map((agent, idx) => {
        const IconComponent = agentIconMap[agent.icon] || Activity;
        const isSelected = activeAgentId === agent.id;

        return (
          <motion.div
            key={agent.id}
            className="tree-agent-row"
            style={{ top: `${agent.y}px` }}
            initial={{ opacity: 0, x: -16, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              duration: 0.28,
              delay: 0.05 + idx * 0.045,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            {/* Circular Icon Disc */}
            <motion.div
              className={`tree-agent-disc ${isSelected ? 'selected' : ''}`}
              style={{
                left: `${AGENT_X}px`
              }}
              whileHover={{ scale: 1.09 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => onSelectAgent?.(agent.id)}
              role="button"
              tabIndex={0}
              aria-label={`Select: ${agent.shortName || agent.name}`}
            >
              <IconComponent size={20} className="tree-agent-icon" />
            </motion.div>

            {/* Pill Label */}
            <motion.div
              className={`tree-agent-pill ${isSelected ? 'selected' : ''}`}
              style={{
                left: `${AGENT_PILL_X}px`
              }}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectAgent?.(agent.id)}
            >
              <span className="tree-agent-name">{agent.shortName || agent.name}</span>
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
