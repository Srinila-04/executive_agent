import React from 'react';
import { motion } from 'framer-motion';
import { agentIconMap } from '../../data/sectors';
import { Activity } from 'lucide-react';

/**
 * Calculates agent node coordinates fanning outward to the right
 * from the active sector circle position with generous non-overlapping gaps.
 */
export function getAgentPositions(count, sectorPos = { x: 468, y: 184 }, radius = 138, sectorId = null) {
  if (count <= 0) return [];

  // Special Dedicated Layout for Supply Chain (5 agents at top sector):
  // Positioned in an elegant outer arc to the right with generous air gaps between each node (~12-18px gap).
  // Completely clear of Production (x: 403, y: 142) with >70px clearance and Quality with >60px clearance.
  if (sectorId === 'supply-chain-customers' || (count === 5 && sectorPos.y < 150)) {
    return [
      { x: 462, y: 20 },  // 1. Inventory
      { x: 504, y: 70 },  // 2. Suppliers
      { x: 536, y: 122 }, // 3. Sourcing
      { x: 556, y: 178 }, // 4. Logistics
      { x: 554, y: 238 }  // 5. Orders
    ];
  }

  if (count === 1) {
    return [{ x: sectorPos.x + radius, y: sectorPos.y }];
  }
  if (count === 2) {
    // Safety sector: if at top fan downward; if at bottom (y > 350) fan upward toward center
    const angles = sectorPos.y < 150 ? [-10, 20] : sectorPos.y > 350 ? [-24, 6] : [-16, 16];
    return angles.map((deg) => {
      const rad = (deg * Math.PI) / 180;
      return {
        x: Math.round(sectorPos.x + (radius + 6) * Math.cos(rad)),
        y: Math.round(sectorPos.y + (radius + 6) * Math.sin(rad))
      };
    });
  }
  if (count === 3) {
    const angles = [-28, 0, 28];
    return angles.map((deg) => {
      const rad = (deg * Math.PI) / 180;
      return {
        x: Math.round(sectorPos.x + (radius + 6) * Math.cos(rad)),
        y: Math.round(sectorPos.y + (radius + 6) * Math.sin(rad))
      };
    });
  }
  if (count === 4) {
    const angles = [-38, -13, 13, 38];
    return angles.map((deg) => {
      const rad = (deg * Math.PI) / 180;
      return {
        x: Math.round(sectorPos.x + (radius + 6) * Math.cos(rad)),
        y: Math.round(sectorPos.y + (radius + 6) * Math.sin(rad))
      };
    });
  }
  // Fallback for 5 agents (if positioned in middle or lower sectors)
  const angles = sectorPos.y > 400
    ? [-60, -42, -24, -6, 12]
    : [-50, -25, 0, 25, 50];
  return angles.map((deg) => {
    const rad = (deg * Math.PI) / 180;
    return {
      x: Math.round(sectorPos.x + radius * Math.cos(rad)),
      y: Math.round(sectorPos.y + radius * Math.sin(rad))
    };
  });
}

/**
 * Agent Node: Circular cybernetic node with label positioned to the RIGHT.
 * Single clean circle disc (zero second outer circle/halo).
 */
export default function AgentNode({
  agent,
  position,
  index,
  isSelected,
  accentColor,
  onClick
}) {
  const IconComponent = agentIconMap[agent.icon] || Activity;

  return (
    <div
      className="hub-agent-anchor"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: isSelected ? 30 : 20
      }}
    >
      <motion.div
        className={`hub-agent-node ${isSelected ? 'selected' : ''}`}
        initial={{ scale: 0, opacity: 0, x: -10 }}
        animate={{ scale: 1, opacity: 1, x: 0 }}
        exit={{ scale: 0, opacity: 0, x: -10 }}
        transition={{
          duration: 0.3,
          delay: index * 0.04,
          ease: [0.16, 1, 0.3, 1]
        }}
        whileHover={{
          scale: 1.08,
          transition: { duration: 0.16 }
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onClick(agent.id)}
        role="button"
        tabIndex={0}
        aria-label={`Agent: ${agent.name}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(agent.id);
          }
        }}
      >
        {/* Circular Disc (Single clean circle, no second round circle) */}
        <div className="agent-node-disc">
          <IconComponent size={21} className="agent-icon" />
        </div>

        {/* Label Positioned to the RIGHT of the Disc */}
        <div className="agent-node-label-right">
          <span className="agent-live-dot" />
          <span className="agent-name-text">{agent.shortName || agent.name}</span>
        </div>
      </motion.div>
    </div>
  );
}
