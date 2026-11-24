import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { agentIconMap } from '../../data/sectors';

/**
 * SectorInlineTree
 * Renders the clean vertical tree-branch layout (Image 2 format)
 * directly inside the home page diagram connected to the clicked sector node.
 * Keeps Manufacturing 360° and all 6 sectors fully intact on the home page.
 */
export default function SectorInlineTree({
  sector,
  sectorPos,
  activeAgentId = null,
  onSelectAgent
}) {
  const agents = sector?.agents || [];
  const N = agents.length;

  // Sector circle has radius 39px (78px width).
  // startX begins cleanly at the outer right edge of the circle (39px radius + 2px buffer = 41px).
  const startX = (sectorPos?.x || 330) + 41;
  const startY = sectorPos?.y || 285;

  // Fixed vertical trunk spine coordinate positioned cleanly to the right of ALL crescent sector circles
  // The rightmost sector circles (Quality & Maintenance) end at x = 455px.
  // Setting TRUNK_X to 490px guarantees a clean 35px clearance and zero overlap with any sector circles.
  const TRUNK_X = 490;
  // Branch line from the vertical trunk to each circular agent icon disc
  const DISC_X = TRUNK_X + 34;
  // Pill label position: gives a clean little space (12px gap) between the round icon disc and the wordings
  const PILL_X = DISC_X + 46;

  // Generous vertical gap between rows (comfortable spacing!)
  const stepY = useMemo(() => {
    if (N >= 5) return 56;
    if (N === 4) return 58;
    return 62;
  }, [N]);

  // Center Y around the clicked sector's Y, gracefully bounded to stay inside the stage
  const targetCenterY = useMemo(() => {
    const rawY = sectorPos?.y || 285;
    const halfSpan = ((N - 1) * stepY) / 2;
    return Math.max(26 + halfSpan + 8, Math.min(544 - halfSpan - 8, rawY));
  }, [sectorPos, N, stepY]);

  // Compute agent row coordinates
  const agentRows = useMemo(() => {
    return agents.map((agent, idx) => {
      const y = Math.round(targetCenterY + (idx - (N - 1) / 2) * stepY);
      return {
        ...agent,
        y
      };
    });
  }, [agents, N, stepY, targetCenterY]);

  const minY = agentRows.length > 0 ? agentRows[0].y : (sectorPos?.y || 285);
  const maxY = agentRows.length > 0 ? agentRows[agentRows.length - 1].y : (sectorPos?.y || 285);

  const spineTop = Math.min(startY, minY);
  const spineBottom = Math.max(startY, maxY);

  const accentColor = sector?.accentColor || '#8b5cf6';

  return (
    <motion.div
      className="hub-inline-tree-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      {/* SVG Dashed Orthogonal Tree Connectors */}
      <svg className="inline-tree-svg" aria-hidden="true">
        {/* 1. Horizontal Stem starting cleanly OUTSIDE the clicked Sector circle to the Vertical Trunk Spine */}
        <line
          x1={startX}
          y1={startY}
          x2={TRUNK_X}
          y2={startY}
          stroke={accentColor}
          strokeWidth="1.8"
          strokeDasharray="4 4"
          strokeOpacity="0.8"
        />

        {/* 2. Vertical Trunk Spine connecting all branches */}
        <line
          x1={TRUNK_X}
          y1={spineTop}
          x2={TRUNK_X}
          y2={spineBottom}
          stroke={accentColor}
          strokeWidth="1.8"
          strokeDasharray="4 4"
          strokeOpacity="0.8"
        />

        {/* 3. Horizontal Branches from Trunk to each Agent Disc */}
        {agentRows.map((row) => (
          <line
            key={`branch-line-${row.id}`}
            x1={TRUNK_X}
            y1={row.y}
            x2={DISC_X}
            y2={row.y}
            stroke={accentColor}
            strokeWidth="1.8"
            strokeDasharray="4 4"
            strokeOpacity="0.8"
          />
        ))}
      </svg>

      {/* The Sub-Section / Agent Rows in Image 2 Format */}
      {agentRows.map((agent, idx) => {
        const IconComponent = agentIconMap[agent.icon] || Activity;
        const isSelected = activeAgentId === agent.id;

        return (
          <div
            key={agent.id}
            className="inline-tree-row"
            style={{ top: `${agent.y}px` }}
          >
            {/* Circular Icon Disc */}
            <motion.div
              className={`inline-tree-disc ${isSelected ? 'selected' : ''}`}
              style={{ left: `${DISC_X}px` }}
              initial={{ scale: 0, opacity: 0, x: -12 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              transition={{
                duration: 0.22,
                delay: 0.03 + idx * 0.03,
                ease: [0.16, 1, 0.3, 1]
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => onSelectAgent?.(agent.id)}
              role="button"
              tabIndex={0}
              aria-label={`Select: ${agent.shortName || agent.name}`}
            >
              <IconComponent size={18} className="inline-tree-icon" />
            </motion.div>

            {/* Pill Label */}
            <motion.div
              className={`inline-tree-pill ${isSelected ? 'selected' : ''}`}
              style={{ left: `${PILL_X}px` }}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.22,
                delay: 0.05 + idx * 0.03,
                ease: [0.16, 1, 0.3, 1]
              }}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectAgent?.(agent.id)}
            >
              <span className="inline-tree-name">{agent.shortName || agent.name}</span>
            </motion.div>
          </div>
        );
      })}
    </motion.div>
  );
}
