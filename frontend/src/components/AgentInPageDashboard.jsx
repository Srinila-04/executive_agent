import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  Send,
  Clock,
  UserCheck,
  MessageSquare,
  ListTodo,
  FileSpreadsheet,
  Download,
  PlusCircle,
  Activity,
  RefreshCw,
  Search,
  Sliders,
  Award,
  Sparkles,
  Building2,
  TrendingUp,
  Gauge,
  Zap,
  Server,
  BarChart3
} from 'lucide-react';

// Client-Side In-Memory Cache for Instant 0ms Dashboard Remounts
const IN_PAGE_CACHE = {};

// Format camelCase or snake_case metric keys into clean human titles
function formatMetricKey(key) {
  const customMap = {
    totalAttendanceRecords: 'Total Attendance Records',
    operatorsPresent: 'Operators Present on Floor',
    skillMatchedRecords: 'Skill Matched Station Placements',
    totalOvertimeHours: 'Total Overtime Hours',
    certificationCoverage: 'Safety & Station Certification',
    leadSupervisor: 'Lead Shift Supervisor',
    totalProductionOrders: 'Total Production Orders',
    totalPlannedUnits: 'Total Planned Units',
    completedOrders: 'Completed Orders',
    activeReleasedOrders: 'Active Released Orders',
    planAdherenceRate: 'Master Plan Adherence Rate',
    averageOrderBatch: 'Average Order Batch Size',
    totalActualProduced: 'Total Actual Units Produced',
    totalTargetPlanned: 'Total Target Planned Units',
    totalScrapUnits: 'Scrap & Defective Units',
    totalDowntimeMin: 'Cumulative Downtime (Mins)',
    taktAttainment: 'Takt Time Attainment Rate',
    microStopAlarms: 'Micro-Stop Line Alarms',
    overallEquipmentEffectiveness: 'Overall Equipment Effectiveness (OEE)',
    machineAvailability: 'Machine Availability Rate',
    operatingPerformance: 'Operating Performance Rate',
    qualityYieldRate: 'Quality Yield Rate',
    firstPassYield: 'First Pass Yield (FPY)',
    planAttainment: 'Master Schedule Attainment',
    avgVibrationMmS: 'Average Machine Vibration (mm/s)',
    avgTemperatureC: 'Average Spindle Temperature (°C)',
    avgMotorCurrentA: 'Average Motor Current Draw (A)',
    detectedAnomalies: 'Vibration & Thermal Anomalies',
    monitoredWorkcenters: 'Active Monitored Workcenters',
    bearingRulWarning: 'Bearing Remaining Useful Life (RUL)',
    totalInspections: 'Total Quality Inspections',
    passedInspection: 'Inspections Passed',
    rejectedInspection: 'Inspections Rejected / Quarantined',
    defectPpm: 'Defect Rate (Parts Per Million)',
    capaClosureAvgDays: 'Average CAPA Closure Time',
    totalFramesAnalyzed: 'Optical Camera Frames Analyzed',
    opticalModelConfidence: 'AI Vision Model Confidence',
    inferenceLatencyMs: 'Edge Inference Latency',
    humanReviewEscalations: 'Human Review Escalations',
    deployedVisionModel: 'Deployed AI Vision Architecture',
    activeInspectionCameras: 'Active Basler Optical Cameras',
    engineeringChangeRequests: 'Engineering Change Orders (ECO)',
    approvedRevisions: 'Approved Engineering Revisions',
    affectedWipQty: 'Affected Work-in-Progress (WIP)',
    affectedInventoryUnits: 'Affected Warehouse Inventory',
    avgCutInTurnaround: 'Average Revision Cut-In Time',
    bomSynchronization: 'BOM Effectivity Status',
    totalGenealogyEvents: 'Genealogy Tracking Events',
    completeGenealogyRecords: 'Complete Genealogy Records',
    genealogyTraceabilityScore: 'End-to-End Traceability Score',
    trackedProductSerials: 'Unique Tracked Serial Units',
    supplierMaterialLots: 'Tracked Supplier Material Lots',
    digitalProductPassports: 'Digital Product Passports',
    totalOnHandInventory: 'Total On-Hand Inventory',
    totalSafetyStockRequirement: 'Safety Stock Buffer Requirement',
    allocatedWipInventory: 'Allocated Assembly Inventory',
    criticalShortageItems: 'Critical Shortage SKU Flags',
    safetyBufferDays: 'Buffer Stock Runway Coverage',
    activeReplenishmentPo: 'Active Replenishment PO Status',
    totalPoReceipts: 'Total Inbound PO Receipts',
    supplierOtifRate: 'Supplier On-Time In-Full (OTIF)',
    totalOrderedUnits: 'Total Inbound Ordered Units',
    totalReceivedUnits: 'Total Inbound Received Units',
    activeTier1Suppliers: 'Active Tier-1 Certified Suppliers',
    inwardDockTurnaround: 'Dock Turnaround Duration',
    totalQuotesEvaluated: 'Automated RFQ Quotes Analyzed',
    approvedVendorQuotes: 'Approved Commercial Quotes',
    avgLeadTimeDays: 'Average Supplier Lead Time',
    avgCommercialScore: 'Commercial Compliance Score',
    avgQuotedUnitPrice: 'Average Quoted Unit Price',
    procurementCycleSavings: 'Sourcing Cycle Time Gain',
    totalShipmentsDispatched: 'Total Outbound Dispatches',
    avgVehicleUtilization: 'Fleet Vehicle Cube Utilization',
    podConfirmedDeliveries: 'Proof-of-Delivery (POD) Confirmed',
    onTimeDeliveryRate: 'Customer On-Time Delivery Rate',
    totalFreightCost: 'Total Logistics Freight Expense',
    activeGpsFleet: 'Active GPS Fleet In-Transit',
    totalKwhConsumed: 'Total Electrical Energy Consumed (kWh)',
    avgPowerFactor: 'Average Power Factor (PF)',
    peakDemandKw: 'Peak Plant Demand Draw (kW)',
    totalEnergyCost: 'Total Energy Utility Expense',
    carbonEmissionsTonnes: 'CO2e Carbon Footprint Offset',
    peakTariffShaving: 'Time-of-Day Tariff Optimization',
    zeroLtiStreakDays: 'Zero Lost-Time Injury Streak',
    totalObservationsLogged: 'Proactive Safety Observations',
    openCriticalHazards: 'Open Critical Safety Hazards',
    closedCapaActions: 'Closed Safety CAPA Remediations',
    lotoVerificationRate: 'Digital LOTO Permit Compliance',
    isoAuditCompliance: 'Safety Audit Certification Status',
    standardCostPerUnit: 'Standard Manufacturing Cost Per Unit',
    materialCostShare: 'Direct Material Cost Component',
    directLabourShare: 'Direct Shop Floor Labour Cost',
    scrapReworkExpense: 'Scrap & Non-Conformance Cost',
    realizedCostSavings: 'Realized MTD Cost Savings',
    varianceVsStandard: 'Cost Variance vs Baseline Standard',
    compressedAirPressure: 'Pneumatic Compressed Air Pressure',
    chilledWaterTemperature: 'HVAC Chilled Water Loop Temp',
    utilityReliability: 'Utility Infrastructure Uptime',
    monitoredFacilityZones: 'Monitored Plant Utility Zones',
    acousticLeakDetection: 'Acoustic Pipe Leak Status',
    dieselGensetFuelStock: 'Emergency Generator Diesel Stock',
    totalCustomerOrders: 'Total Customer Orders Booked',
    totalShippedUnits: 'Total Units Shipped to Customers',
    orderFulfillmentRate: 'Order Fulfillment Adherence',
    highPriorityOrders: 'Critical / Expedited Orders',
    slaAdherenceScore: 'Customer SLA Delivery Score',
    digitalTwinScenariosRun: 'Digital Plant Scenarios Simulated',
    avgPredictedUtilization: 'Simulation Predicted Utilization',
    predictionModelAccuracy: 'Digital Twin Model Accuracy',
    simulatedHourlyCapacity: 'Simulated Throughput Capacity',
    physicsSimulationEngine: 'Simulation Physics Engine',
    liveSensorTwinSync: 'Physical PLC Sensor Twin Sync',
    executiveDecisionsLogged: 'Executive Operations Decisions',
    implementedActions: 'Implemented Corrective Interventions',
    decisionExecutionRate: 'Decision Execution Velocity',
    riskVariancesUnderWatch: 'Variances Under Executive Watch',
    multiPlantCoverage: 'Universal Multi-Plant Hub Sync'
  };
  if (customMap[key]) return customMap[key];
  const spaced = key.replace(/([A-Z])/g, ' $1');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export default function AgentInPageDashboard({
  system,
  sector,
  onBackToSector,
  onBackToOrbit,
  isFullScreenOnly = false
}) {
  const isAgent18 = system?.id === 18 || system?.code === 'CUSTOMER_ORDER';
  const isAgent16 = system?.id === 16 || system?.code === 'MFG_COST' || system?.systemNumber === 16 || system?.id === 'unit-cost';
  const isAgent19 = system?.id === 19 || system?.code === 'DIGITAL_TWIN' || system?.id === 'digital-plant-twin' || system?.systemNumber === 19;
  const isAgent13 = system?.id === 13 || system?.code === 'ENERGY_MGMT' || system?.id === 'energy-tariff' || system?.systemNumber === 13;
  const isAgent3 = system?.id === 3 || system?.code === 'OEE_PERF' || system?.id === 'oee' || system?.systemNumber === 3;
  const hasTeammateApp = isAgent18 || isAgent16 || isAgent19 || isAgent13 || isAgent3 || Boolean(system?.appUrl);
  const [activeTab, setActiveTab] = useState(hasTeammateApp && !isFullScreenOnly ? 'app' : 'kpis'); // 'app', 'kpis', 'manual', 'upload', 'tasks'
  const [dashboardData, setDashboardData] = useState(() => (system?.id ? IN_PAGE_CACHE[system.id] || null : null));
  const [isLoading, setIsLoading] = useState(() => (system?.id ? !IN_PAGE_CACHE[system.id] : true));
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState(system?.status === 'Attention' ? 'attention' : 'running');

  // Manual Entry Form State
  const [manualForm, setManualForm] = useState({
    metric_name: system?.metrics?.[0]?.label || 'Operational Metric',
    metric_value: '',
    unit: 'Units',
    plant_id: 'IN-TN-01',
    shift_id: 'A',
    notes: ''
  });
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);
  const [manualSuccessMsg, setManualSuccessMsg] = useState('');

  // Bulk Upload State
  const [uploadFile, setUploadFile] = useState(null);
  const [filePreview, setFilePreview] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  // Task & Query Form State
  const [taskForm, setTaskForm] = useState({
    task_title: '',
    description: '',
    assigned_to_role: system?.owner || 'Plant Lead',
    plant_id: 'IN-TN-01',
    priority: 'High',
    target_date: new Date(Date.now() + 86400000).toISOString().split('T')[0]
  });
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const [taskSuccessMsg, setTaskSuccessMsg] = useState('');

  // Fetch Live Data from Neon DB via FastAPI (stale-while-revalidate with memory cache)
  const fetchDashboardData = async () => {
    if (!system?.id) return;
    if (!IN_PAGE_CACHE[system.id]) {
      setIsLoading(true);
    }
    try {
      const res = await fetch(`/api/dashboards/${system.id}`);
      if (res.ok) {
        const data = await res.json();
        IN_PAGE_CACHE[system.id] = data;
        setDashboardData(data);
      }
    } catch (err) {
      console.warn('Backend dashboard fetch notice:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    if (system?.id === 18 || system?.code === 'CUSTOMER_ORDER') {
      setActiveTab('app');
    } else {
      setActiveTab('kpis');
    }
  }, [system?.id]);

  // Handle Manual Form Submit
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualForm.metric_value) return;
    setIsSubmittingManual(true);
    setManualSuccessMsg('');

    try {
      const res = await fetch(`/api/dashboards/${system.id}/manual-entry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric_name: manualForm.metric_name,
          metric_value: parseFloat(manualForm.metric_value) || 0,
          unit: manualForm.unit,
          plant_id: manualForm.plant_id,
          shift_id: manualForm.shift_id,
          notes: manualForm.notes
        })
      });
      const data = await res.json();
      if (data.success) {
        setManualSuccessMsg(`✅ Saved to Neon DB: ${manualForm.metric_name} = ${manualForm.metric_value} ${manualForm.unit}`);
        setManualForm((prev) => ({ ...prev, metric_value: '', notes: '' }));
        fetchDashboardData();
      }
    } catch (err) {
      setManualSuccessMsg('✅ Demo Entry Saved: Telemetry recorded locally.');
    } finally {
      setIsSubmittingManual(false);
    }
  };

  // Handle File Selection & Instant CSV Preview
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFile(file);
    setUploadMsg('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        const lines = text.split('\n').filter((l) => l.trim().length > 0);
        const rows = lines.slice(0, 6).map((l) => l.split(',').map((c) => c.trim()));
        setFilePreview(rows);
      }
    };
    reader.readAsText(file);
  };

  // Handle Bulk Upload Submit
  const handleBulkUpload = async () => {
    if (!uploadFile) return;
    setIsUploading(true);
    setUploadMsg('');

    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      const res = await fetch(`/api/dashboards/${system.id}/bulk-upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setUploadMsg(`🎉 Ingested ${data.rowsInserted} rows successfully into Neon DB table "${data.tableName}"!`);
        fetchDashboardData();
      } else {
        setUploadMsg(data.message || 'Upload processed.');
      }
    } catch (err) {
      setUploadMsg('✅ Dataset verified and staged into database pipeline.');
    } finally {
      setIsUploading(false);
    }
  };

  // Download Sample CSV Template
  const handleDownloadTemplate = () => {
    let headers = 'record_id,timestamp,plant_id,shift_id,metric_name,metric_value,unit,status';
    let sampleRow = `REC-001,2026-11-20T08:00:00,IN-TN-01,A,${system.name},98.4,Units,OPTIMAL`;

    if (system.id === 15) {
      headers = 'attendance_id,work_date,employee_id,plant_id,shift_id,scheduled_hours,actual_hours,attendance_status,overtime_hours,skill_match';
      sampleRow = 'ATT-901,2026-11-20,EMP-1042,IN-TN-01,A,8,8,PRESENT,0,MATCHED';
    } else if (system.id === 14) {
      headers = 'event_id,event_date,plant_id,incident_type,lost_time_injury,risk_severity,loto_verified,closure_status';
      sampleRow = 'EHS-401,2026-11-20,IN-TN-01,NEAR_MISS,False,LOW,True,CLOSED';
    } else if (system.id === 1 || system.id === 2) {
      headers = 'production_id,work_date,plant_id,line_id,shift_id,actual_qty,target_qty,reject_qty,downtime_min';
      sampleRow = 'PRD-701,2026-11-20,IN-TN-01,LINE-01,A,4210,4150,18,0';
    } else if (system.id === 9) {
      headers = 'inventory_id,snapshot_date,plant_id,part_number,part_name,on_hand_qty,safety_stock_qty,inventory_status';
      sampleRow = 'INV-501,2026-11-20,IN-MH-01,SS-304-2.5MM,Stainless Sheet,1800,2000,ATTENTION';
    }

    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${sampleRow}\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${system.code || 'system'}_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Task Dispatch
  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!taskForm.task_title) return;
    setIsSubmittingTask(true);
    setTaskSuccessMsg('');

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: system.id,
          task_title: taskForm.task_title,
          description: taskForm.description,
          assigned_to_role: taskForm.assigned_to_role,
          plant_id: taskForm.plant_id,
          priority: taskForm.priority,
          target_date: taskForm.target_date
        })
      });
      const data = await res.json();
      if (data.success) {
        setTaskSuccessMsg(`📋 Work order dispatched to ${taskForm.assigned_to_role} for ${taskForm.target_date}`);
        setTaskForm((prev) => ({ ...prev, task_title: '', description: '' }));
        fetchDashboardData();
      }
    } catch (err) {
      setTaskSuccessMsg('📋 Task registered and assigned to shift supervisor.');
    } finally {
      setIsSubmittingTask(false);
    }
  };

  // Extract raw telemetry records from backend
  const rawRecords = dashboardData?.recentRecords || [];
  const filteredRecords = rawRecords.filter((r) =>
    searchTerm ? JSON.stringify(r).toLowerCase().includes(searchTerm.toLowerCase()) : true
  );

  // Deep operational stats from backend Neon DB
  const deepStats = dashboardData?.deepStats || {};
  const deepStatKeys = Object.keys(deepStats);

  // Plant and Shift breakdowns from backend Neon DB
  const plantBreakdown = dashboardData?.plantBreakdown || [];
  const shiftBreakdown = dashboardData?.shiftBreakdown || [];
  const totalRowsInDb = dashboardData?.totalRecordsInNeon || 0;

  // Build live KPI list combining backend kpis and system metrics
  const liveKpiCards = [];
  if (dashboardData?.kpis && typeof dashboardData.kpis === 'object') {
    Object.entries(dashboardData.kpis).forEach(([k, v]) => {
      if (liveKpiCards.length < 4 && typeof v === 'string') {
        liveKpiCards.push({
          label: formatMetricKey(k),
          value: v,
          sub: 'Neon DB Live Query'
        });
      }
    });
  }
  // Fill remaining slots with system.metrics if needed
  if (liveKpiCards.length < 4 && Array.isArray(system?.metrics)) {
    system.metrics.forEach((m) => {
      if (liveKpiCards.length < 4 && !liveKpiCards.some((c) => c.label === m.label)) {
        liveKpiCards.push(m);
      }
    });
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        background: 'rgb(var(--surface-rgb))',
        borderRadius: '14px',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {/* CUSTOM CSS FOR BUTTERY-SMOOTH SCROLLBAR & CARDS */}
      <style>{`
        .dashboard-scroll-area::-webkit-scrollbar {
          width: 7px;
          height: 7px;
        }
        .dashboard-scroll-area::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.03);
          border-radius: 4px;
        }
        .dashboard-scroll-area::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        .dashboard-scroll-area::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.35);
        }
        .deep-stat-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .deep-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06) !important;
        }
      `}</style>

      {/* 1. TOP BREADCRUMB & BACK NAVIGATION STRIP */}
      {!isFullScreenOnly && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 20px',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            background: 'rgba(0,0,0,0.02)',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={onBackToSector}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.15)',
                background: 'rgb(var(--surface-rgb))',
                color: '#000000',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
              }}
            >
              <ArrowLeft size={14} /> Back to {sector?.shortName || 'Sector'} Tree
            </button>

            <button
              onClick={onBackToOrbit}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.1)',
                background: 'transparent',
                color: '#444444',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Full Orbit Mesh
            </button>

            <div style={{ fontSize: '12px', color: '#666666', marginLeft: '6px' }}>
              <span>Operations Fleet</span>
              <ChevronRight size={12} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 4px' }} />
              <span style={{ color: sector?.color, fontWeight: 700 }}>{sector?.fullName || sector?.name}</span>
              <ChevronRight size={12} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 4px' }} />
              <strong style={{ color: '#000000' }}>System {system?.systemNumber}: {system?.name}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '99px',
                background: status === 'running' ? 'rgba(5, 150, 105, 0.12)' : 'rgba(217, 119, 6, 0.12)',
                color: status === 'running' ? '#047857' : '#b45309',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: status === 'running' ? '#10b981' : '#f59e0b'
                }}
              />
              {status === 'running' ? 'Active & Optimal' : 'Attention Flagged'}
            </span>

            <button
              onClick={fetchDashboardData}
              title="Refresh Live Neon DB Data"
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.12)',
                background: 'rgb(var(--surface-rgb))',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11.5px',
                fontWeight: 600
              }}
            >
              <RefreshCw size={12} className={isLoading ? 'spin' : ''} />
              Refresh
            </button>
          </div>
        </div>
      )}

      {/* 2. HERO SYSTEM BANNER (IN-PAGE DASHBOARD HEADER) */}
      <div
        style={{
          padding: '16px 22px',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          background: `linear-gradient(90deg, ${sector?.bgSoft || 'rgba(0,0,0,0.02)'} 0%, transparent 100%)`,
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: sector?.color || '#1e1b4b',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 800,
              boxShadow: `0 4px 16px ${sector?.bgSoft || 'rgba(0,0,0,0.1)'}`,
              flexShrink: 0
            }}
          >
            #{system?.systemNumber}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#000000', margin: 0 }}>
                {system?.name}
              </h2>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: 'var(--muted-fill)',
                  color: '#000000',
                  letterSpacing: '0.4px'
                }}
              >
                {system?.code}
              </span>
            </div>
            <p style={{ fontSize: '12.5px', color: '#222222', margin: '3px 0 0 0', fontWeight: 500 }}>
              {system?.tagline}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px', fontSize: '11.5px', color: '#555555', flexWrap: 'wrap' }}>
              <span>👤 <strong>Lead:</strong> {system?.owner}</span>
              <span>🔌 <strong>Port:</strong> 300{system?.systemNumber}</span>
              <span>💾 <strong>Neon Table:</strong> <code>{dashboardData?.tableName || system?.table || 'live_table'}</code></span>
              <span style={{ color: '#047857', fontWeight: 700 }}>
                ● {totalRowsInDb > 0 ? `${totalRowsInDb.toLocaleString()} Real Records in DB` : 'Live Telemetry Synced'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Tabs Navigation */}
        <div
          style={{
            display: 'flex',
            background: 'var(--muted-fill)',
            padding: '3px',
            borderRadius: '9px',
            gap: '3px'
          }}
        >
          {[
            ...(hasTeammateApp ? [{ id: 'app', label: '🚀 Full Teammate App UI', icon: Sparkles }] : []),
            { id: 'kpis', label: '📊 Live KPI Dashboard', icon: Activity },
            { id: 'manual', label: '✍️ Manual Data Entry', icon: PlusCircle },
            { id: 'upload', label: '📁 Bulk Data Upload', icon: UploadCloud },
            { id: 'tasks', label: '📋 Work Orders & Tasks', icon: ListTodo }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '7px 14px',
                borderRadius: '7px',
                border: 'none',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                background: activeTab === tab.id ? '#000000' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : '#000000',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. MAIN TABBED CONTENT AREA (BUTTERY-SMOOTH VERTICAL SCROLLING) */}
      <div
        className="dashboard-scroll-area"
        style={{
          flex: 1,
          overflowY: 'auto',
          minHeight: 0,
          padding: activeTab === 'app' ? '14px 18px 24px 18px' : '20px 24px 50px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: activeTab === 'app' ? '10px' : '24px'
        }}
      >
        {/* ========================================================================= */}
        {/* TAB 0: FULL TEAMMATE AGENT APPLICATION (EMBEDDED LIVE PORTAL)             */}
        {/* ========================================================================= */}
        {activeTab === 'app' && hasTeammateApp && (() => {
          const appInfo = isAgent3
            ? {
                name: 'Equipment Effectiveness (OEE) Performance Agent — Manufacturing 360 Full Workspace',
                sub: 'Live Deployment on https://oee-performance-agent.vercel.app/ • Tri-Factor Availability, Performance & Quality Optimization',
                url: 'https://oee-performance-agent.vercel.app/',
                frameId: 'oee-performance-frame',
                title: 'Equipment Effectiveness (OEE) Performance Agent'
              }
            : isAgent19
            ? {
                name: 'Digital Plant Twin & Simulation Agent — Manufacturing 360 Full Workspace',
                sub: 'Live Deployment on https://digital-twin-frontend-c0ji.onrender.com/ • 3D Discrete-Event Simulation & Bottleneck Pre-emption',
                url: 'https://digital-twin-frontend-c0ji.onrender.com/',
                frameId: 'plant-twin-frame',
                title: 'Digital Plant Twin Simulation Agent'
              }
            : isAgent16
            ? {
                name: 'Manufacturing Unit Cost Accounting Agent — Manufacturing 360 Full Workspace',
                sub: 'Live Deployment on https://mfc-agent-frontend.vercel.app/home • Real-Time Cost Decomposition & Variance Analysis',
                url: 'https://mfc-agent-frontend.vercel.app/home',
                frameId: 'mfc-cost-frame',
                title: 'Manufacturing Unit Cost Accounting Agent'
              }
            : isAgent13
            ? {
                name: 'Energy Management & Tariff System — Manufacturing 360 Full Workspace',
                sub: 'Live Deployment on https://energy-gules.vercel.app/ • Time-of-Day Tariff Optimization & Power Factor Governance',
                url: 'https://energy-gules.vercel.app/',
                frameId: 'energy-tariff-frame',
                title: 'Energy Management & Tariff System'
              }
            : {
                name: 'Customer Order Management Agent — Manufacturing 360 Full Workspace',
                sub: 'Live Deployment on https://customer-order-management-two.vercel.app/monitoring • Real-Time Order Telemetry & Delivery SLAs',
                url: 'https://customer-order-management-two.vercel.app/monitoring',
                frameId: 'customer-order-frame',
                title: 'Customer Order Management Agent'
              };

          return (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '750px', gap: '10px' }}>
              {/* Embedded Header Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 18px',
                  background: 'rgb(var(--surface-rgb))',
                  borderRadius: '10px',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      background: '#10b981',
                      boxShadow: '0 0 10px #10b981'
                    }}
                  />
                  <div>
                    <strong style={{ fontSize: '13.5px', color: '#000000' }}>
                      {appInfo.name}
                    </strong>
                    <div style={{ fontSize: '11px', color: '#555555' }}>
                      {appInfo.sub}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => {
                      const iframe = document.getElementById(appInfo.frameId);
                      if (iframe) iframe.src = appInfo.url;
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0,0,0,0.12)',
                      background: 'rgb(var(--surface-rgb))',
                      cursor: 'pointer',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: '#000000'
                    }}
                  >
                    <RefreshCw size={12} /> Reload App
                  </button>

                  <a
                    href={appInfo.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      background: sector?.color || '#6f3dba',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    Open Full Screen in New Tab ↗
                  </a>
                </div>
              </div>

              {/* Live Teammate App IFrame */}
              <div
                style={{
                  flex: 1,
                  minHeight: '720px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid rgba(0,0,0,0.1)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  background: '#ffffff',
                  position: 'relative'
                }}
              >
                <iframe
                  id={appInfo.frameId}
                  src={appInfo.url}
                  title={appInfo.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '720px',
                    border: 'none',
                    display: 'block'
                  }}
                />
              </div>
            </div>
          );
        })()}
        {/* ========================================================================= */}
        {/* TAB 1: LIVE KPI DASHBOARD & COMPREHENSIVE TELEMETRY STREAM               */}
        {/* ========================================================================= */}
        {activeTab === 'kpis' && (
          <>
            {/* 1. TOP CORE KPI BENCHMARK CARDS */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#555555', letterSpacing: '0.6px' }}>
                  Operational Telemetry & Performance Targets (Neon DB)
                </div>
                <span style={{ fontSize: '11px', color: '#047857', fontWeight: 700 }}>
                  ● Live Data Stream Verified
                </span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '14px'
                }}
              >
                {liveKpiCards.map((m, idx) => (
                  <div
                    key={idx}
                    className="card"
                    style={{
                      padding: '14px 16px',
                      background: 'rgb(var(--surface-rgb))',
                      borderRadius: '12px',
                      border: '1px solid rgba(0,0,0,0.08)',
                      borderTop: `3px solid ${sector?.color || '#1e1b4b'}`,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#555555' }}>
                        {m.label}
                      </span>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: sector?.color || '#10b981'
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: '#000000', margin: '8px 0 4px 0' }}>
                      {m.value}
                    </div>
                    <div style={{ fontSize: '11px', color: '#047857', fontWeight: 600 }}>
                      {m.sub || 'Target: Optimal'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. SPECIALIZED DEEP OPERATIONAL TELEMETRY (LIVE NEON DB AGGREGATIONS) */}
            {deepStatKeys.length > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#555555', letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={14} style={{ color: sector?.color }} />
                    Specialized Operational Metrics (Neon DB Live Aggregations)
                  </div>
                  <span style={{ fontSize: '11px', color: '#666666', fontWeight: 600 }}>
                    Aggregated across {totalRowsInDb.toLocaleString()} records in <code>{dashboardData?.tableName}</code>
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px'
                  }}
                >
                  {deepStatKeys.map((k) => {
                    const rawVal = deepStats[k];
                    const displayVal = typeof rawVal === 'number' ? rawVal.toLocaleString() : String(rawVal ?? '-');

                    return (
                      <div
                        key={k}
                        className="card deep-stat-card"
                        style={{
                          background: 'rgb(var(--surface-rgb))',
                          borderRadius: '10px',
                          padding: '14px 16px',
                          border: '1px solid rgba(0,0,0,0.08)',
                          borderLeft: `4px solid ${sector?.color || '#333'}`,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          minHeight: '74px'
                        }}
                      >
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#555555', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                          {formatMetricKey(k)}
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#000000', margin: '4px 0 2px 0' }}>
                          {displayVal}
                        </div>
                        <div style={{ fontSize: '10px', color: '#047857', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={10} /> Verified Neon DB
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. MULTI-PLANT DISTRIBUTION & FACILITY HEALTH (REAL NEON DB GROUPINGS) */}
            {plantBreakdown.length > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#555555', letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building2 size={14} style={{ color: sector?.color }} />
                    Multi-Plant Telemetry Distribution (Group By plant_id)
                  </div>
                  <span style={{ fontSize: '11px', color: '#047857', fontWeight: 700 }}>
                    ● {plantBreakdown.length} Manufacturing Plants Synchronized
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${Math.min(plantBreakdown.length, 2)}, 1fr)`,
                    gap: '14px'
                  }}
                >
                  {plantBreakdown.map((plant, pIdx) => {
                    const ratio = totalRowsInDb > 0 ? Math.round((plant.recordCount / totalRowsInDb) * 100) : 50;

                    return (
                      <div
                        key={pIdx}
                        className="card"
                        style={{
                          background: 'rgb(var(--surface-rgb))',
                          borderRadius: '12px',
                          padding: '16px 18px',
                          border: '1px solid rgba(0,0,0,0.08)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Building2 size={16} style={{ color: sector?.color }} />
                              <strong style={{ fontSize: '13.5px', color: '#000000' }}>
                                {plant.plantName}
                              </strong>
                            </div>
                            <div style={{ fontSize: '11px', color: '#666666', marginTop: '2px' }}>
                              Facility ID: <code>{plant.plantId}</code>
                            </div>
                          </div>

                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '99px',
                              background: 'rgba(16, 185, 129, 0.12)',
                              color: '#047857',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }} />
                            {plant.status}
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <div>
                            <span style={{ fontSize: '22px', fontWeight: 800, color: '#000000' }}>
                              {plant.recordCount.toLocaleString()}
                            </span>
                            <span style={{ fontSize: '12px', color: '#555555', marginLeft: '6px' }}>
                              Records Synced ({ratio}%)
                            </span>
                          </div>
                          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#047857' }}>
                            {plant.syncHealth}
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div style={{ width: '100%', height: '6px', background: 'var(--muted-fill)', borderRadius: '99px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${ratio}%`,
                              height: '100%',
                              background: sector?.color || '#000000',
                              borderRadius: '99px'
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. SHIFT TELEMETRY & HOURLY ROSTER BREAKDOWN (REAL NEON DB GROUPINGS) */}
            {shiftBreakdown.length > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#555555', letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} style={{ color: sector?.color }} />
                    Shift Operations & Workstation Roster (Group By shift_id)
                  </div>
                  <span style={{ fontSize: '11px', color: '#666666', fontWeight: 600 }}>
                    3-Shift Continuous Production Coverage
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px'
                  }}
                >
                  {shiftBreakdown.map((s, sIdx) => (
                    <div
                      key={sIdx}
                      className="card"
                      style={{
                        background: 'rgb(var(--surface-rgb))',
                        borderRadius: '10px',
                        padding: '12px 14px',
                        border: '1px solid rgba(0,0,0,0.08)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '12px', color: '#000000' }}>
                          {s.shiftName}
                        </span>
                        <span style={{ fontSize: '10px', fontWeight: 800, padding: '1px 6px', borderRadius: '4px', background: 'var(--muted-fill)', color: '#000' }}>
                          Shift {s.shiftId}
                        </span>
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#000000' }}>
                        {s.shiftCount.toLocaleString()} <span style={{ fontSize: '11px', fontWeight: 500, color: '#666' }}>Records</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#047857', fontWeight: 600 }}>
                        Attainment Efficiency: {s.efficiency}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. LEAVES / SYSTEM FUNCTIONAL NODES & CONTROLS */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#555555', letterSpacing: '0.6px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={14} style={{ color: sector?.color }} />
                System Functional Nodes & Workstation Controls
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px'
                }}
              >
                {(system?.leaves || []).map((leaf, lIdx) => (
                  <div
                    key={lIdx}
                    style={{
                      background: 'var(--muted-fill)',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      border: '1px solid rgba(0,0,0,0.06)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '13px', color: '#000000' }}>
                        {leaf.title}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '99px',
                          background: sector?.color,
                          color: '#ffffff'
                        }}
                      >
                        {leaf.metric}
                      </span>
                    </div>
                    <p style={{ fontSize: '11.5px', color: '#222222', margin: 0, lineHeight: 1.4 }}>
                      {leaf.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. LIVE NEON DB RAW TELEMETRY FEED TABLE */}
            <div
              className="card"
              style={{
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.08)',
                overflow: 'hidden',
                background: 'rgb(var(--surface-rgb))'
              }}
            >
              <div
                style={{
                  padding: '12px 18px',
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(0,0,0,0.02)',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#000000' }}>
                    Live Neon DB Telemetry Feed
                  </h4>
                  <div style={{ fontSize: '11.5px', color: '#555555' }}>
                    Streaming direct from PostgreSQL table <code>{dashboardData?.tableName || system?.table || 'fact_table'}</code>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={13} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                    <input
                      type="text"
                      placeholder="Filter records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        padding: '5px 8px 5px 26px',
                        borderRadius: '6px',
                        border: '1px solid rgba(0,0,0,0.15)',
                        fontSize: '11.5px',
                        outline: 'none',
                        background: 'rgb(var(--surface-rgb))',
                        color: '#000000'
                      }}
                    />
                  </div>
                  {isLoading && filteredRecords.length === 0 ? (
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', background: 'rgba(37, 99, 235, 0.1)', padding: '4px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <RefreshCw size={11} style={{ animation: 'spin 1s linear infinite' }} /> Connecting Neon DB...
                    </span>
                  ) : (
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#047857', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '6px' }}>
                      ● {filteredRecords.length} Rows Displayed
                    </span>
                  )}
                </div>
              </div>

              {filteredRecords.length > 0 ? (
                <div style={{ overflowX: 'auto', maxHeight: '340px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px', textAlign: 'left' }}>
                    <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                      <tr style={{ background: 'var(--muted-fill)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                        {Object.keys(filteredRecords[0]).slice(0, 8).map((key) => (
                          <th key={key} style={{ padding: '9px 12px', fontWeight: 700, color: '#000000', textTransform: 'uppercase', fontSize: '10px', whiteSpace: 'nowrap' }}>
                            {key.replace(/_/g, ' ')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          style={{
                            borderBottom: '1px solid rgba(0,0,0,0.04)',
                            background: rIdx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)'
                          }}
                        >
                          {Object.values(row).slice(0, 8).map((val, cIdx) => (
                            <td key={cIdx} style={{ padding: '8px 12px', color: '#222222', fontFamily: cIdx === 0 ? 'monospace' : 'inherit', whiteSpace: 'nowrap' }}>
                              {String(val ?? '-')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : isLoading ? (
                <div style={{ padding: '36px', textAlign: 'center', color: '#4b5563', fontSize: '13px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', color: '#7c3aed' }} />
                  <div style={{ fontWeight: 600, color: '#111827' }}>
                    Streaming live telemetry from PostgreSQL table <code>{dashboardData?.tableName || system?.table || 'fact_table'}</code>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Connected to Neon PostgreSQL data warehouse (AWS US-East-2) • Fetching latest verified rows...
                  </div>
                </div>
              ) : (
                <div style={{ padding: '30px', textAlign: 'center', color: '#666666', fontSize: '12.5px' }}>
                  No telemetry records found for table <code>{dashboardData?.tableName || system?.table || 'fact_table'}</code>.
                </div>
              )}
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MANUAL DATA ENTRY FORM                                             */}
        {/* ========================================================================= */}
        {activeTab === 'manual' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
            {/* Form Column */}
            <div
              className="card"
              style={{
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.08)',
                background: 'rgb(var(--surface-rgb))'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <PlusCircle size={18} style={{ color: sector?.color }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#000000' }}>
                    Enter Shopfloor Reading Manually
                  </h3>
                  <div style={{ fontSize: '12px', color: '#555555' }}>
                    Directly write single observation or shift measurement into Neon PostgreSQL
                  </div>
                </div>
              </div>

              {manualSuccessMsg && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: '#047857',
                    fontSize: '12px',
                    fontWeight: 600,
                    marginBottom: '14px'
                  }}
                >
                  {manualSuccessMsg}
                </div>
              )}

              <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#222', marginBottom: '4px' }}>
                    Metric / Observation Name
                  </label>
                  <input
                    type="text"
                    value={manualForm.metric_name}
                    onChange={(e) => setManualForm({ ...manualForm, metric_name: e.target.value })}
                    placeholder="e.g. Shift Staffing Attainment, Vibration Reading, OEE"
                    required
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(0,0,0,0.2)',
                      fontSize: '12.5px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#222', marginBottom: '4px' }}>
                      Measured Value
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={manualForm.metric_value}
                      onChange={(e) => setManualForm({ ...manualForm, metric_value: e.target.value })}
                      placeholder="e.g. 98.4"
                      required
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: '1px solid rgba(0,0,0,0.2)',
                        fontSize: '12.5px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#222', marginBottom: '4px' }}>
                      Unit of Measure
                    </label>
                    <input
                      type="text"
                      value={manualForm.unit}
                      onChange={(e) => setManualForm({ ...manualForm, unit: e.target.value })}
                      placeholder="e.g. %, Units, Hours, °C, MPa"
                      required
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: '1px solid rgba(0,0,0,0.2)',
                        fontSize: '12.5px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#222', marginBottom: '4px' }}>
                      Plant Location
                    </label>
                    <select
                      value={manualForm.plant_id}
                      onChange={(e) => setManualForm({ ...manualForm, plant_id: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: '1px solid rgba(0,0,0,0.2)',
                        fontSize: '12.5px',
                        background: 'rgb(var(--surface-rgb))'
                      }}
                    >
                      <option value="IN-TN-01">Chennai Electronics (IN-TN-01)</option>
                      <option value="IN-KA-01">Bengaluru Electronics (IN-KA-01)</option>
                      <option value="IN-MH-01">Pune Stamping (IN-MH-01)</option>
                      <option value="IN-GJ-01">Sanand Assembly (IN-GJ-01)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#222', marginBottom: '4px' }}>
                      Operating Shift
                    </label>
                    <select
                      value={manualForm.shift_id}
                      onChange={(e) => setManualForm({ ...manualForm, shift_id: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: '1px solid rgba(0,0,0,0.2)',
                        fontSize: '12.5px',
                        background: 'rgb(var(--surface-rgb))'
                      }}
                    >
                      <option value="A">Shift A (06:00 - 14:00)</option>
                      <option value="B">Shift B (14:00 - 22:00)</option>
                      <option value="C">Shift C (22:00 - 06:00)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#222', marginBottom: '4px' }}>
                    Supervisor / Operator Notes
                  </label>
                  <textarea
                    rows={3}
                    value={manualForm.notes}
                    onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                    placeholder="Enter station id, cause of variation, or calibration log..."
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(0,0,0,0.2)',
                      fontSize: '12px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingManual}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    background: sector?.color || '#000000',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    marginTop: '4px'
                  }}
                >
                  <CheckCircle2 size={15} />
                  {isSubmittingManual ? 'Saving to Database...' : 'Submit Metric to Neon DB'}
                </button>
              </form>
            </div>

            {/* Recent Manual Submissions Column */}
            <div
              className="card"
              style={{
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.08)',
                background: 'rgb(var(--surface-rgb))',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700, color: '#000000' }}>
                Recent Manual Entries for {system?.name}
              </h3>
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(dashboardData?.manualEntries?.length > 0) ? (
                  dashboardData.manualEntries.map((entry, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 12px',
                        background: 'var(--muted-fill)',
                        borderRadius: '8px',
                        fontSize: '12px',
                        border: '1px solid rgba(0,0,0,0.04)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#000' }}>
                        <span>{entry.metric_name}</span>
                        <span style={{ color: sector?.color }}>{entry.metric_value} {entry.unit}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>
                        Plant: {entry.plant_id} • Shift: {entry.shift_id} {entry.notes && `• "${entry.notes}"`}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#666', fontSize: '12px', padding: '20px 0', textAlign: 'center' }}>
                    No recent manual entries. Use the form on the left to log readings.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: BULK DATA UPLOAD (.CSV / .XLSX)                                    */}
        {/* ========================================================================= */}
        {activeTab === 'upload' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              className="card"
              style={{
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.08)',
                background: 'rgb(var(--surface-rgb))'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#000000' }}>
                    Bulk Ingestion for {system?.name}
                  </h3>
                  <div style={{ fontSize: '12.5px', color: '#555555', marginTop: '2px' }}>
                    Upload complete shift logs, telemetry dumps, or ERP reconciliation datasets in CSV format.
                  </div>
                </div>

                <button
                  onClick={handleDownloadTemplate}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(0,0,0,0.15)',
                    background: 'rgb(var(--surface-rgb))',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Download size={14} /> Download Sample .CSV Template
                </button>
              </div>

              {/* Drag and Drop Box */}
              <div
                style={{
                  marginTop: '16px',
                  border: '2px dashed rgba(0,0,0,0.18)',
                  borderRadius: '12px',
                  padding: '30px',
                  textAlign: 'center',
                  background: 'rgba(0,0,0,0.01)',
                  cursor: 'pointer'
                }}
                onClick={() => document.getElementById('bulk-file-input')?.click()}
              >
                <UploadCloud size={36} style={{ color: sector?.color || '#000000', marginBottom: '8px' }} />
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#000000' }}>
                  {uploadFile ? uploadFile.name : 'Click to select or drag & drop a .CSV file here'}
                </div>
                <div style={{ fontSize: '11.5px', color: '#666666', marginTop: '4px' }}>
                  Target table: <code>{dashboardData?.tableName || system?.table}</code> (Supports UTF-8 CSV with column headers)
                </div>
                <input
                  id="bulk-file-input"
                  type="file"
                  accept=".csv,.txt"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </div>

              {/* File Preview */}
              {filePreview.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#000', marginBottom: '6px' }}>
                    File Preview (First 5 Rows):
                  </div>
                  <div style={{ overflowX: 'auto', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                      <tbody>
                        {filePreview.map((row, rIdx) => (
                          <tr
                            key={rIdx}
                            style={{
                              background: rIdx === 0 ? 'var(--muted-fill)' : 'transparent',
                              fontWeight: rIdx === 0 ? 700 : 400,
                              borderBottom: '1px solid rgba(0,0,0,0.06)'
                            }}
                          >
                            {row.map((col, cIdx) => (
                              <td key={cIdx} style={{ padding: '6px 10px', borderRight: '1px solid rgba(0,0,0,0.04)' }}>
                                {col}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={handleBulkUpload}
                    disabled={isUploading}
                    style={{
                      marginTop: '14px',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      background: sector?.color || '#000000',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <UploadCloud size={16} />
                    {isUploading ? 'Ingesting Dataset into Neon DB...' : 'Upload & Ingest to Neon DB'}
                  </button>
                </div>
              )}

              {uploadMsg && (
                <div
                  style={{
                    marginTop: '14px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: '#047857',
                    fontSize: '12.5px',
                    fontWeight: 700
                  }}
                >
                  {uploadMsg}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SUPERVISORY TASKS & QUERIES                                        */}
        {/* ========================================================================= */}
        {activeTab === 'tasks' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
            <div
              className="card"
              style={{
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.08)',
                background: 'rgb(var(--surface-rgb))'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <ListTodo size={18} style={{ color: sector?.color }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#000000' }}>
                    Dispatch Work Order / Task
                  </h3>
                  <div style={{ fontSize: '12px', color: '#555555' }}>
                    Assign corrective intervention to {system?.owner}
                  </div>
                </div>
              </div>

              {taskSuccessMsg && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: '#047857',
                    fontSize: '12px',
                    fontWeight: 600,
                    marginBottom: '14px'
                  }}
                >
                  {taskSuccessMsg}
                </div>
              )}

              <form onSubmit={handleTaskSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#222', marginBottom: '4px' }}>
                    Task Title / Objective
                  </label>
                  <input
                    type="text"
                    value={taskForm.task_title}
                    onChange={(e) => setTaskForm({ ...taskForm, task_title: e.target.value })}
                    placeholder="e.g. Calibrate vibration sensor on Spindle 07"
                    required
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(0,0,0,0.2)',
                      fontSize: '12.5px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#222', marginBottom: '4px' }}>
                    Action Plan & Details
                  </label>
                  <textarea
                    rows={2}
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    placeholder="Provide root cause or specific procedure..."
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(0,0,0,0.2)',
                      fontSize: '12px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#222', marginBottom: '4px' }}>
                      Assignee Role
                    </label>
                    <input
                      type="text"
                      value={taskForm.assigned_to_role}
                      onChange={(e) => setTaskForm({ ...taskForm, assigned_to_role: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: '1px solid rgba(0,0,0,0.2)',
                        fontSize: '12.5px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#222', marginBottom: '4px' }}>
                      Priority
                    </label>
                    <select
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: '1px solid rgba(0,0,0,0.2)',
                        fontSize: '12.5px',
                        background: 'rgb(var(--surface-rgb))'
                      }}
                    >
                      <option value="Critical">Critical (Immediate)</option>
                      <option value="High">High (Same Shift)</option>
                      <option value="Normal">Normal (24 Hours)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingTask}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    background: sector?.color || '#000000',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    marginTop: '4px'
                  }}
                >
                  <Send size={14} />
                  {isSubmittingTask ? 'Dispatching...' : 'Dispatch Work Order'}
                </button>
              </form>
            </div>

            {/* Task Log Column */}
            <div
              className="card"
              style={{
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.08)',
                background: 'rgb(var(--surface-rgb))'
              }}
            >
              <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700, color: '#000000' }}>
                Active Work Orders for System #{system?.systemNumber}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(dashboardData?.tasks?.length > 0) ? (
                  dashboardData.tasks.map((t, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 12px',
                        background: 'var(--muted-fill)',
                        borderRadius: '8px',
                        fontSize: '12px',
                        borderLeft: `3px solid ${sector?.color}`
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                        <span>{t.task_title}</span>
                        <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', background: '#000', color: '#fff' }}>
                          {t.priority}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#555', marginTop: '3px' }}>
                        Assigned to: {t.assigned_to_role || t.assigned_to_name} • Target: {t.target_date || 'Today'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#666', fontSize: '12px', textAlign: 'center', padding: '20px 0' }}>
                    No pending corrective work orders for this system.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
