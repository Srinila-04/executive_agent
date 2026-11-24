import React from 'react';
import SectorTree from './SectorTree';

/**
 * SupplyChainTree wrapper around universal SectorTree for backwards compatibility
 */
export default function SupplyChainTree(props) {
  const supplyChainSector = {
    id: 'supply-chain-customers',
    name: 'Supply Chain & Customers',
    shortName: 'Supply Chain',
    logo: '/assets/logos/supply-chain.png',
    accentColor: '#10b981',
    agents: props.agents || []
  };

  return <SectorTree sector={supplyChainSector} {...props} />;
}
