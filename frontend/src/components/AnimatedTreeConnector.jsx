import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';

/**
 * AnimatedTreeConnector
 * Renders an animated orthogonal dashed tree line
 * connecting the selected sector to its active systems in Column 2.
 * - Horizontal stem connects in the vertical CENTER of the sections
 * - Vertical spine spans symmetrically from top card to bottom card
 * - Horizontal branches enter at the exact vertical CENTER of each card
 * - Visibly streaming dashes and crisp traveling energy pulse
 * - 1:1 CSS pixel accuracy (no viewBox distortion)
 */
export default function AnimatedTreeConnector({
  selectedSectorId,
  agents = [],
  sectorRefs,
  agentRefs,
  channelRef,
  color = '#4f46e5'
}) {
  const [treeData, setTreeData] = useState(null);

  const updateCoordinates = useCallback(() => {
    if (!channelRef?.current) return;
    const cRect = channelRef.current.getBoundingClientRect();
    if (cRect.width === 0 || cRect.height === 0) return;

    const sEl = sectorRefs?.current?.[selectedSectorId];
    if (!sEl) return;
    const sRect = sEl.getBoundingClientRect();
    // Exact vertical center of selected sector card
    const startY = Math.round(sRect.top + sRect.height / 2 - cRect.top);

    // Exact vertical center of each agent card in Column 2
    const branches = [];
    agents.forEach((agent) => {
      const aEl = agentRefs?.current?.[agent.id];
      if (aEl) {
        const aRect = aEl.getBoundingClientRect();
        const targetY = Math.round(aRect.top + aRect.height / 2 - cRect.top);
        branches.push({ id: agent.id, targetY });
      }
    });

    if (branches.length === 0) return;

    const minY = branches[0].targetY;
    const maxY = branches[branches.length - 1].targetY;
    // Exact vertical center of the entire systems section
    const centerY = Math.round((minY + maxY) / 2);

    const trunkX = Math.round(cRect.width * 0.52);
    const endX = Math.round(cRect.width - 5);
    const stepTurnX = Math.round(cRect.width * 0.22);

    // Stem path: from selected sector (0, startY) transitioning to the CENTER of the sections (centerY)
    let stemPath;
    if (Math.abs(startY - centerY) <= 3) {
      stemPath = `M 0 ${centerY} H ${trunkX}`;
    } else {
      stemPath = `M 0 ${startY} H ${stepTurnX} V ${centerY} H ${trunkX}`;
    }

    setTreeData({
      startY,
      centerY,
      minY,
      maxY,
      trunkX,
      endX,
      stemPath,
      branches
    });
  }, [channelRef, sectorRefs, agentRefs, selectedSectorId, agents]);

  useLayoutEffect(() => {
    updateCoordinates();
    const t1 = setTimeout(updateCoordinates, 40);
    const t2 = setTimeout(updateCoordinates, 120);
    const t3 = setTimeout(updateCoordinates, 250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [updateCoordinates]);

  useEffect(() => {
    window.addEventListener('resize', updateCoordinates);
    return () => window.removeEventListener('resize', updateCoordinates);
  }, [updateCoordinates]);

  const markerId = `treeArrow-${selectedSectorId}`;

  if (!treeData) {
    return <div className="tree-connector-channel" ref={channelRef} />;
  }

  const { minY, maxY, trunkX, endX, stemPath, branches } = treeData;

  return (
    <div className="tree-connector-channel" ref={channelRef} title="Interactive Sector-to-Agent Tree">
      <svg
        className="tree-connector-svg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'visible',
          pointerEvents: 'none'
        }}
      >
        <defs>
          {/* Crisp arrowhead marker centered on line */}
          <marker
            id={markerId}
            viewBox="0 0 8 8"
            refX="6"
            refY="4"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M 1 1.5 L 6 4 L 1 6.5 z" fill={color} />
          </marker>
        </defs>

        <g key={`tree-group-${selectedSectorId}`} className="tree-branch-group">
          {/* 1. Subtle guide track underneath */}
          <path
            d={stemPath}
            fill="none"
            stroke={color}
            strokeWidth="2"
            opacity="0.25"
          />
          {branches.length > 1 && (
            <path
              d={`M ${trunkX} ${minY} V ${maxY}`}
              fill="none"
              stroke={color}
              strokeWidth="2"
              opacity="0.25"
            />
          )}
          {branches.map((b) => (
            <path
              key={`base-branch-${b.id}`}
              d={`M ${trunkX} ${b.targetY} H ${endX}`}
              fill="none"
              stroke={color}
              strokeWidth="2"
              opacity="0.25"
            />
          ))}

          {/* 2. Primary colored streaming dashed line */}
          <path
            d={stemPath}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="tree-flowing-dash"
          />
          {branches.length > 1 && (
            <path
              d={`M ${trunkX} ${minY} V ${maxY}`}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="tree-flowing-dash"
            />
          )}
          {branches.map((b) => (
            <path
              key={`flow-branch-${b.id}`}
              d={`M ${trunkX} ${b.targetY} H ${endX}`}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              markerEnd={`url(#${markerId})`}
              className="tree-flowing-dash"
            />
          ))}

          {/* 3. Crisp white traveling energy shimmer gliding forward */}
          <path
            d={stemPath}
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="tree-energy-pulse"
          />
          {branches.length > 1 && (
            <path
              d={`M ${trunkX} ${minY} V ${maxY}`}
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="tree-energy-pulse"
            />
          )}
          {branches.map((b) => (
            <path
              key={`pulse-branch-${b.id}`}
              d={`M ${trunkX} ${b.targetY} H ${endX}`}
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="tree-energy-pulse"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
