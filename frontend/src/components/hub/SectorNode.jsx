import React from 'react';
import { motion } from 'framer-motion';

/**
 * Sector Node: Placed along the blueprint crescent arc.
 * Shows minus badge when active so user can easily collapse it.
 */
export default function SectorNode({
  sector,
  position,
  index,
  isSelected = false,
  onClick
}) {
  return (
    <div
      className="hub-sector-anchor"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: isSelected ? 24 : 15
      }}
    >
      <motion.div
        className={`hub-sector-node ${isSelected ? 'selected' : ''}`}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{
          duration: 0.35,
          delay: index * 0.03,
          ease: [0.16, 1, 0.3, 1]
        }}
        whileHover={{
          scale: 1.06,
          zIndex: 25,
          transition: { duration: 0.16 }
        }}
        whileTap={{ scale: 0.96 }}
        onClick={() => onClick(sector.id)}
        role="button"
        tabIndex={0}
        aria-label={`Sector: ${sector.name}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(sector.id);
          }
        }}
      >
        {/* Circular Node Surface Disc */}
        <div className="sector-node-disc">
          <div className="sector-logo-container">
            <img
              src={sector.logo}
              alt={sector.name}
              className="sector-logo-img"
              loading="eager"
            />
          </div>
        </div>

        {/* Clean Label placed consistently to the LEFT */}
        <div className="sector-node-label-left">
          <span className="sector-title">{sector.shortName || sector.name}</span>
        </div>
      </motion.div>
    </div>
  );
}
