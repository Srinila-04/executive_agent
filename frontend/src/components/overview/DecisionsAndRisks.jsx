import React, { useState } from 'react';
import {
  FileCheck,
  Check,
  X,
  HelpCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  ArrowRight,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Send,
  UserCheck,
  MessageSquare
} from 'lucide-react';

export default function DecisionsAndRisks({ onNavigateToNotifications, onNavigateToAgents }) {
  // Decision Approvals state
  const [decisions, setDecisions] = useState({
    'dec-1': { status: 'pending', note: '' },
    'dec-2': { status: 'pending', note: '' },
    'dec-3': { status: 'pending', note: '' },
    'dec-4': { status: 'pending', note: '' },
    'dec-5': { status: 'pending', note: '' },
    'dec-6': { status: 'pending', note: '' }
  });

  // Active "Ask Details" query drawer state per card
  const [activeQueryCard, setActiveQueryCard] = useState(null);
  const [queryText, setQueryText] = useState({});
  const [sentQueries, setSentQueries] = useState({});

  const handleAction = (id, newStatus) => {
    setDecisions((prev) => ({
      ...prev,
      [id]: { ...prev[id], status: newStatus }
    }));
  };

  const handleSendQuery = (id, authorityName) => {
    const text = queryText[id] || 'Please provide detailed telemetry and mitigation options for this item.';
    setSentQueries((prev) => ({
      ...prev,
      [id]: {
        authority: authorityName,
        question: text,
        timestamp: 'Just now',
        ticketId: `QRY-${Math.floor(1000 + Math.random() * 9000)}`
      }
    }));
    setActiveQueryCard(null);
  };

  const decisionItems = [
    {
      id: 'dec-1',
      sector: 'Production Planning',
      title: 'Lock Shift-2 Capacity Plan (42,000 units on Line 03)',
      recommendation: 'Lock in revised shift-2 schedule balancing 42,000 units on Line 03 with zero overtime.',
      impact: 'Avoids ₹1.8 Lakhs in overtime pay while meeting 100% committed delivery dates.',
      urgency: 'Action needed by 15:30 today',
      color: '#6f3dba',
      authority: {
        name: 'Mr. Rajesh Sharma',
        role: 'Head of Production & Shift Operations',
        plant: 'Pune Plant',
        sla: '< 15 mins'
      },
      presetQuestions: [
        'Can Line 03 maintain takt time without extra tooling?',
        'What is the contingency if raw material feeding lags?',
        'Does Shift-1 handoff require supervisor sign-off?'
      ]
    },
    {
      id: 'dec-2',
      sector: 'Inventory Optimization',
      title: 'Approve Expedite PO #PO-94182 for SS-304 Sheet Metal',
      recommendation: 'Authorize expedite purchase order for 40T SS-304 sheet coils to JSW Steel via Automated RFQ.',
      impact: 'Prevents Line 01 stamping line stoppage in 36 hours; protects ₹24.8 Cr quarterly deliveries.',
      urgency: 'Critical • 48-hr buffer breached',
      color: '#f58a3a',
      authority: {
        name: 'Ms. Anita Rao',
        role: 'Head of Materials & Strategic Inventory',
        plant: 'Chennai Hub',
        sla: '< 10 mins'
      },
      presetQuestions: [
        'Can JSW Steel expedite dispatch within 24 hours?',
        'Are there alternative secondary stock reserves in Sanand?',
        'What is the premium cost for dedicated freight dispatch?'
      ]
    },
    {
      id: 'dec-3',
      sector: 'Sourcing & RFQ',
      title: 'Choose Best Supplier Quote for Stamping Inserts (RFQ-204)',
      recommendation: 'Award RFQ #RFQ-204 to XYZ Ltd at ₹95.5 Lakhs (5d delivery) over ABC Corp at ₹98.0 Lakhs (7d).',
      impact: 'Saves ₹2.5 Lakhs (8.4% cost reduction) and cuts delivery lead time by 2 full days.',
      urgency: 'Evaluation completed',
      color: '#0ea5e9',
      authority: {
        name: 'Mr. Vikram Mehra',
        role: 'Strategic Sourcing & RFQ Director',
        plant: 'Central Procurement Hub',
        sla: '< 20 mins'
      },
      presetQuestions: [
        'Has XYZ Ltd passed dimensional QA audit for high-speed inserts?',
        'Can XYZ Ltd guarantee fixed price for the next 2 quarters?',
        'What is the supplier warranty term on tooling wear?'
      ]
    },
    {
      id: 'dec-4',
      sector: 'Predictive Maintenance',
      title: 'Sanand Unit 07 CNC Spindle Lubrication Shutdown Window',
      recommendation: 'Approve planned 20-minute lubrication shutdown this Saturday at 12:00 during low-tariff hours.',
      impact: 'Avoids $180,000 thermal bearing seizure and 4.2 hours of emergency breakdown stoppage.',
      urgency: '120 hrs RUL remaining',
      color: '#4d8eeb',
      authority: {
        name: 'Mr. Sunil Deshmukh',
        role: 'Plant Maintenance & Reliability Director',
        plant: 'Sanand EV Unit',
        sla: '< 15 mins'
      },
      presetQuestions: [
        'Can lubrication be executed during planned lunch changeover?',
        'Are replacement ceramic bearings already staged at the cell?',
        'Will this 20-min shutdown affect afternoon throughput targets?'
      ]
    },
    {
      id: 'dec-5',
      sector: 'Engineering Change & BOM',
      title: 'Approve Rev C Cut-in for EV Battery Tray Bracket (ECN-842)',
      recommendation: 'Authorize revision cut-in starting Monday Shift 1; all Tier-1 suppliers confirmed ready.',
      impact: 'Zero obsolete stock write-off ($0 scrap exposure) and 100% design compliance.',
      urgency: 'Tooling qualified',
      color: '#10b981',
      authority: {
        name: 'Dr. Priya Nair',
        role: 'Chief Engineering & Quality Officer',
        plant: 'Bengaluru Advanced Tech Site',
        sla: '< 30 mins'
      },
      presetQuestions: [
        'Have all legacy Rev B stampings been depleted or re-machined?',
        'Has the customer OEM formally signed off on the revision PPAP?',
        'Are the welding robot coordinate jigs reprogrammed?'
      ]
    },
    {
      id: 'dec-6',
      sector: 'Logistics & Dispatch',
      title: 'Authorize Dedicated Express Dispatch to Tata Motors',
      recommendation: 'Authorize express dedicated container for 4,200 steering knuckles.',
      impact: 'Guarantees 100% on-time delivery (OTIF) despite minor regional highway slowdowns.',
      urgency: 'Staging complete',
      color: '#8b5cf6',
      authority: {
        name: 'Mr. Arvind Patel',
        role: 'Head of Logistics & Customer Dispatch',
        plant: 'Pune Stamping & Assembly',
        sla: '< 15 mins'
      },
      presetQuestions: [
        'What is the precise transit ETA with GPS fleet tracking?',
        'Can we consolidate with the afternoon shipment to lower freight cost?',
        'Has Tata Motors dispatch dock reserved the unloading bay?'
      ]
    }
  ];

  const risksAndAlerts = [
    {
      id: 'risk-1',
      title: 'Sanand CNC Milling Unit 07 Spindle Bearing Drift',
      financialImpact: '₹14.8 Lakhs / 4.2 hrs risk',
      severity: 'high',
      plant: 'Sanand EV Unit',
      owner: 'Reliability Lead',
      status: 'Being Handled',
      desc: '3.2 kHz harmonic vibration detected on Spindle Bearing B-2. Preventive work order queued.'
    },
    {
      id: 'risk-2',
      title: 'SS-304 Sheet Metal Reserve Depleted to 1.8 Days',
      financialImpact: '₹8.5 Lakhs / 16 hrs halt risk',
      severity: 'critical',
      plant: 'Chennai Hub',
      owner: 'Materials Lead',
      status: 'New (Needs Decision)',
      desc: 'Accelerated stamping volume consumed safety buffer. Awaiting PO approval to dispatch PO.'
    },
    {
      id: 'risk-3',
      title: 'Customer Order #ORD-8419 for Mahindra Auto Delay Threat',
      financialImpact: '₹5.2 Lakhs contract penalty',
      severity: 'warning',
      plant: 'Pune Stamping',
      owner: 'Fulfillment Lead',
      status: 'Being Handled',
      desc: 'Line 02 minor speed loss caught early; buffer reroute in place to preserve promised delivery date.'
    },
    {
      id: 'risk-4',
      title: 'Substation Compressor Bank Peak Energy Tariff Spike',
      financialImpact: '₹3.6 Lakhs utility penalty',
      severity: 'resolved',
      plant: 'Consortium Hubs',
      owner: 'Energy Lead',
      status: 'Resolved',
      desc: 'Automated peak shaving pre-cooled chiller wells, smoothly mitigating peak grid penalty tariff.'
    },
    {
      id: 'risk-5',
      title: 'Night Shift Operator Skill Matrix Gap on Line 04',
      financialImpact: '₹2.1 Lakhs scrap risk',
      severity: 'info',
      plant: 'Manesar Wire Plant',
      owner: 'Staffing Lead',
      status: 'Being Handled',
      desc: '2 certified robotic welding technicians absent. Automated skill matrix reassigned cross-trained tech.'
    },
    {
      id: 'risk-6',
      title: 'High-Speed Stamping Die #04 Tooling Burr & Wear Drift',
      financialImpact: '₹1.9 Lakhs scrap exposure',
      severity: 'warning',
      plant: 'Bengaluru Site',
      owner: 'Tooling Superintendent',
      status: 'Being Handled',
      desc: 'Optical QA flagged 14-micron micro-burr on edge trim. Regrinding scheduled for night maintenance.'
    }
  ];

  const pendingDecisionsCount = Object.values(decisions).filter((d) => d.status === 'pending').length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '16px', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* COLUMN 1: Decisions Waiting For You */}
      <div
        className="card"
        style={{
          padding: '16px 18px',
          background: 'rgb(var(--surface-rgb))',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#000000', letterSpacing: '0.8px' }}>
              Executive Authorizations
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#000000', marginTop: '2px' }}>
              Decisions Waiting For You ({pendingDecisionsCount} Pending)
            </h3>
          </div>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '6px',
              background: pendingDecisionsCount > 0 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
              color: pendingDecisionsCount > 0 ? '#b91c1c' : '#047857'
            }}
          >
            {pendingDecisionsCount > 0 ? `${pendingDecisionsCount} Require Sign-off` : 'All Approved ✓'}
          </span>
        </div>

        <p style={{ fontSize: '13px', color: '#111111', margin: '0' }}>
          Autonomous operations escalate critical business choices for your direct approval.
        </p>

        {/* Decision Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {decisionItems.map((item) => {
            const state = decisions[item.id] || { status: 'pending' };
            const isApproved = state.status === 'approved';
            const isRejected = state.status === 'rejected';
            const isQueryOpen = activeQueryCard === item.id;
            const sentInfo = sentQueries[item.id];

            return (
              <div
                key={item.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: isApproved
                    ? 'rgba(16, 185, 129, 0.08)'
                    : isRejected
                    ? 'rgba(239, 68, 68, 0.06)'
                    : 'var(--muted-fill)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                {/* Sector Tag & Urgency */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#000000', background: 'rgb(var(--surface-rgb))', padding: '2px 8px', borderRadius: '4px' }}>
                    {item.sector}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#000000' }}>
                    {item.urgency}
                  </span>
                </div>

                {/* Title */}
                <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: '#000000', margin: '1px 0' }}>
                  {item.title}
                </h4>

                {/* Recommendation */}
                <p style={{ fontSize: '13px', color: '#000000', lineHeight: 1.5, margin: 0 }}>
                  <strong>Recommendation:</strong> {item.recommendation}
                </p>

                {/* Financial & Operational Impact */}
                <div style={{ fontSize: '13px', color: '#000000', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <DollarSign size={14} style={{ color: 'var(--brand-purple)' }} />
                  Impact: <span>{item.impact}</span>
                </div>

                {/* Sent Query Notice if already dispatched */}
                {sentInfo && (
                  <div
                    style={{
                      background: 'rgba(111, 61, 186, 0.08)',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      fontSize: '12.5px',
                      color: '#000000'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--brand-purple)' }}>
                        <Check size={14} /> Inquiry Dispatched to {sentInfo.authority}
                      </span>
                      <span style={{ fontSize: '11.5px', color: '#222222' }}>Ticket: {sentInfo.ticketId}</span>
                    </div>
                    <div style={{ marginTop: '3px', fontSize: '12px', color: '#111111' }}>
                      "{sentInfo.question}"
                    </div>
                  </div>
                )}

                {/* Interactive Query Drawer (Ask Details Workflow) */}
                {isQueryOpen && (
                  <div
                    style={{
                      background: 'rgb(var(--surface-rgb))',
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      marginTop: '4px'
                    }}
                  >
                    {/* Authority Profile Card */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--muted-fill)', padding: '8px 12px', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <UserCheck size={16} style={{ color: 'var(--brand-purple)' }} />
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#000000' }}>
                            {item.authority.name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#111111' }}>
                            {item.authority.role} • {item.authority.plant}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--status-success)', background: 'rgba(16, 185, 129, 0.1)', padding: '3px 8px', borderRadius: '4px' }}>
                        SLA: {item.authority.sla}
                      </span>
                    </div>

                    {/* Quick Question Preset Chips */}
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#000000' }}>
                      Click to ask specific question:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {item.presetQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setQueryText((prev) => ({ ...prev, [item.id]: q }))}
                          style={{
                            textAlign: 'left',
                            padding: '6px 10px',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12.5px',
                            color: '#000000',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
                          }}
                        >
                          <MessageSquare size={12} style={{ color: 'var(--brand-purple)' }} /> {q}
                        </button>
                      ))}
                    </div>

                    {/* Query Input Box */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <input
                        type="text"
                        value={queryText[item.id] || ''}
                        onChange={(e) => setQueryText((prev) => ({ ...prev, [item.id]: e.target.value }))}
                        placeholder={`Ask ${item.authority.name} a specific question...`}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          background: 'var(--muted-fill)',
                          fontSize: '12.5px',
                          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                          color: '#000000',
                          outline: 'none'
                        }}
                      />
                    </div>

                    {/* Drawer Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setActiveQueryCard(null)}
                        style={{
                          padding: '6px 12px',
                          background: 'transparent',
                          border: 'none',
                          color: '#222222',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendQuery(item.id, item.authority.name)}
                        style={{
                          padding: '6px 14px',
                          background: 'var(--brand-purple)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
                        }}
                      >
                        <Send size={13} /> Send to Authority
                      </button>
                    </div>
                  </div>
                )}

                {/* Card Actions: Approve / Reject / Ask Details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <div style={{ fontSize: '12px', color: '#111111' }}>
                    Owner: <strong>{item.authority.name.split(' ')[1] || item.authority.name}</strong>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    {isApproved ? (
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={14} /> Approved ✓ Dispatched
                      </span>
                    ) : isRejected ? (
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--status-danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <X size={14} /> Rejected ✕ Feedback Sent
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => setActiveQueryCard(isQueryOpen ? null : item.id)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            border: 'none',
                            background: isQueryOpen ? 'var(--brand-purple-soft)' : 'rgb(var(--surface-rgb))',
                            color: '#000000',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
                          }}
                        >
                          <HelpCircle size={13} /> Ask Details
                        </button>
                        <button
                          onClick={() => handleAction(item.id, 'rejected')}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            border: 'none',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: 'var(--status-danger)',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
                          }}
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleAction(item.id, 'approved')}
                          style={{
                            padding: '5px 14px',
                            borderRadius: '6px',
                            border: 'none',
                            background: 'var(--status-success)',
                            color: '#ffffff',
                            fontSize: '12.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
                          }}
                        >
                          Approve
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* COLUMN 2: Operational Risks Ranked by Financial Impact */}
      <div
        className="card"
        style={{
          padding: '16px 18px',
          background: 'rgb(var(--surface-rgb))',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#000000', letterSpacing: '0.8px' }}>
              Operational Risk Ledger
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#000000', marginTop: '2px' }}>
              Top 6 Risks Ranked by Impact
            </h3>
          </div>
          <button
            className="btn-secondary"
            style={{
              fontSize: '12px',
              padding: '5px 10px',
              border: 'none',
              background: 'var(--muted-fill)',
              color: '#000000',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              cursor: 'pointer',
              borderRadius: '6px',
              fontWeight: 600
            }}
            onClick={onNavigateToNotifications}
          >
            All Alerts →
          </button>
        </div>

        <p style={{ fontSize: '13px', color: '#111111', margin: '0' }}>
          Ranked by direct financial exposure in Rupees and potential downtime hours lost.
        </p>

        {/* Risks List - 6 Items perfectly balanced with left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {risksAndAlerts.map((risk, index) => {
            const isCrit = risk.severity === 'critical';
            const isHigh = risk.severity === 'high';
            const isResolved = risk.severity === 'resolved';

            return (
              <div
                key={risk.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'var(--muted-fill)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#000000' }}>
                    #{index + 1} • {risk.title}
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: isCrit ? '#b91c1c' : 'var(--brand-purple)'
                    }}
                  >
                    {risk.financialImpact}
                  </span>
                </div>

                <p style={{ fontSize: '12.5px', color: '#000000', margin: '2px 0', lineHeight: 1.5 }}>
                  {risk.desc}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#111111', marginTop: '3px' }}>
                  <span>📍 {risk.plant} • Owner: <strong>{risk.owner}</strong></span>
                  <span
                    style={{
                      padding: '2.5px 7px',
                      borderRadius: '4px',
                      fontWeight: 700,
                      fontSize: '11.5px',
                      background: isResolved
                        ? 'rgba(16, 185, 129, 0.12)'
                        : isCrit
                        ? 'rgba(239, 68, 68, 0.12)'
                        : 'rgba(245, 158, 11, 0.12)',
                      color: isResolved
                        ? '#047857'
                        : isCrit
                        ? '#b91c1c'
                        : '#b45309'
                    }}
                  >
                    ● {risk.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Exposure Summary - sits directly below items without any giant whitespace */}
        <div
          style={{
            padding: '10px 12px',
            background: 'var(--muted-fill)',
            borderRadius: '8px',
            fontSize: '12.5px',
            color: '#000000',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '2px'
          }}
        >
          <span>Cumulative Risk: <strong>₹36.1 Lakhs</strong></span>
          <span style={{ color: 'var(--status-success)', fontWeight: 700 }}>
            94% Pre-Emption Rate ✓
          </span>
        </div>
      </div>
    </div>
  );
}
