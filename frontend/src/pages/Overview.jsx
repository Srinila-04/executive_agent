import React, { useRef } from 'react';
import {
  Boxes,
  Cpu,
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';

import DailyManagementBrief from '../components/overview/DailyManagementBrief';
import CompanyHealthScorecard from '../components/overview/CompanyHealthScorecard';
import PlantMapComparison from '../components/overview/PlantMapComparison';
import DecisionsAndRisks from '../components/overview/DecisionsAndRisks';
import ProductionLossStoryCharts from '../components/overview/ProductionLossStoryCharts';
import SupplyChainAndPeopleView from '../components/overview/SupplyChainAndPeopleView';
import WholePlatformExplainer from '../components/overview/WholePlatformExplainer';

export default function Overview({
  agents,
  sectors,
  connectors,
  notifications,
  onNavigateToAgents,
  onNavigateToArchitecture,
  onNavigateToNotifications,
  onNavigateToConnectors,
  selectedPlant,
  setSelectedPlant
}) {
  const decisionsRef = useRef(null);

  const handleJumpToDecisions = () => {
    if (decisionsRef.current) {
      decisionsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="content-scroll"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        paddingBottom: '40px'
      }}
    >
      {/* 1. GREETING AND DAILY MANAGEMENT BRIEF (Source: Module 20 Executive Intelligence) */}
      <DailyManagementBrief
        onJumpToDecisions={handleJumpToDecisions}
        onSelectPlant={setSelectedPlant}
        selectedPlant={selectedPlant}
      />

      {/* 2. COMPANY HEALTH SCORECARD (8 Big Core KPI Cards) */}
      <CompanyHealthScorecard />

      {/* 2B. WHAT HAPPENS IN THE WHOLE WEBSITE (ALL 20 AGENTS & 6 SECTORS) */}
      <WholePlatformExplainer
        onNavigateToAgents={onNavigateToAgents}
        onNavigateToArchitecture={onNavigateToArchitecture}
      />

      {/* 3. PLANT MAP AND PLANT COMPARISON TABLE (India Map on Left, Leaderboard on Right) */}
      <PlantMapComparison
        selectedPlant={selectedPlant}
        onSelectPlant={setSelectedPlant}
      />

      {/* 4. DECISIONS WAITING FOR YOU, NEXT TO RISKS AND ALERTS (Two Columns) */}
      <div ref={decisionsRef}>
        <DecisionsAndRisks
          onNavigateToNotifications={onNavigateToNotifications}
          onNavigateToAgents={onNavigateToAgents}
        />
      </div>

      {/* 5. PRODUCTION, QUALITY AND COST CHARTS (Story & Loss Decomposition) */}
      <ProductionLossStoryCharts />

      {/* 6. SUPPLY CHAIN, CUSTOMERS, PEOPLE AND SAFETY (Two Columns) */}
      <SupplyChainAndPeopleView
        onNavigateToAgents={onNavigateToAgents}
      />
    </div>
  );
}
