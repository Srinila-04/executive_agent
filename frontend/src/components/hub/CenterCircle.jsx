import React from 'react';
import { motion } from 'framer-motion';

/**
 * Origin Center Node: Positioned on the left side of the blueprint.
 * Clean, luminous disc containing the Manufacturing 360° symbol,
 * soft pulsing aura, and label below.
 */
export default function CenterCircle({
  position = { x: 100, y: 340 },
  viewState = 'HOME',
  onClick
}) {
  return (
    <div
      className="hub-origin-anchor"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 25
      }}
    >
      <motion.div
        className="hub-origin-node"
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label="Manufacturing 360 Core Origin"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
          }
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Luminous Disc Surface (Single clean circle, no second round circle) */}
        <div className="origin-disc-surface">
          <div className="origin-logo-wrapper">
            <img
              src="/assets/logos/center.png"
              alt="Manufacturing 360 Core"
              className="origin-symbol-img"
              loading="eager"
            />
          </div>
        </div>

        {/* Product Brand Label Below */}
        <div className="origin-brand-label">
          <span className="origin-brand-title">Manufacturing 360°</span>
        </div>
      </motion.div>
    </div>
  );
}
