import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Square,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Sliders,
  Sparkles,
  FileText,
  UploadCloud,
  Send,
  Clock,
  ArrowRight,
  UserCheck,
  MessageSquare,
  ListTodo,
  PlusCircle,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

export default function AgentModal({ agent, onClose, onStatusChange }) {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'ingestion', 'queries', 'tasks', 'integration'
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supervisors, setSupervisors] = useState([]);
  
  // Manual Entry Form State
  const [manualForm, setManualForm] = useState({
    metric_name: '',
    metric_value: '',
    unit: '',
    plant_id: 'IN-TN-01',
    shift_id: 'A',
    notes: ''
  });
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);
  const [manualSuccessMsg, setManualSuccessMsg] = useState('');

  // Bulk Upload State
  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  // Query Form State
  const [queryForm, setQueryForm] = useState({
    query_text: '',
    recipient_role: '',
    priority: 'High'
  });
  const [isSubmittingQuery, setIsSubmittingQuery] = useState(false);

  // Task Form State
  const [taskForm, setTaskForm] = useState({
    task_title: '',
    description: '',
    assigned_to_role: '',
    plant_id: 'IN-TN-01',
    priority: 'High',
    target_date: ''
  });
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  // Status toggle
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Load Dashboard Data from Neon DB via FastAPI
  const fetchDashboardData = async () => {
    if (!agent) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/dashboards/${agent.id}`);
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error('Failed to load agent dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load Supervisors Directory
  const fetchSupervisors = async () => {
    try {
      const res = await fetch('/api/admin/supervisors');
      if (res.ok) {
        const data = await res.json();
        setSupervisors(data.supervisors || []);
        if (data.supervisors?.length > 0) {
          // Pre-select supervisor matching agent
          const matched = data.supervisors.find(s => s.role.includes(`Agent ${agent.agentNumber < 10 ? '0' + agent.agentNumber : agent.agentNumber}`) || s.sector === agent.sector);
          const chosen = matched ? matched.role : data.supervisors[0].role;
          setQueryForm(prev => ({ ...prev, recipient_role: chosen }));
          setTaskForm(prev => ({ ...prev, assigned_to_role: chosen }));
        }
      }
    } catch (err) {
      console.error('Failed to load supervisors:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchSupervisors();
  }, [agent?.id]);

  if (!agent) return null;

  // Toggle agent status
  const handleToggleStatus = async (newStatus) => {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/agents/${agent.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          reason: newStatus === 'stopped' ? 'Manual administrative shutdown or worker exception.' : undefined
        })
      });
      const data = await res.json();
      if (data.success && onStatusChange) {
        onStatusChange(data.agent);
      }
    } catch (err) {
      console.error('Failed to change agent status:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Submit Manual KPI Entry to Neon DB
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualForm.metric_name || !manualForm.metric_value) return;
    setIsSubmittingManual(true);
    setManualSuccessMsg('');
    try {
      const res = await fetch(`/api/dashboards/${agent.id}/manual-entry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric_name: manualForm.metric_name,
          metric_value: parseFloat(manualForm.metric_value),
          unit: manualForm.unit,
          plant_id: manualForm.plant_id,
          shift_id: manualForm.shift_id,
          notes: manualForm.notes
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setManualSuccessMsg('Record successfully committed to Neon DB!');
        setManualForm({
          metric_name: '',
          metric_value: '',
          unit: '',
          plant_id: 'IN-TN-01',
          shift_id: 'A',
          notes: ''
        });
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed manual entry:', err);
    } finally {
      setIsSubmittingManual(false);
    }
  };

  // Submit Bulk Upload CSV to Neon DB
  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;
    setIsUploading(true);
    setUploadMsg('');
    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      const res = await fetch(`/api/dashboards/${agent.id}/bulk-upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUploadMsg(data.message || 'Dataset successfully uploaded to Neon DB!');
        setUploadFile(null);
        fetchDashboardData();
      } else {
        setUploadMsg(data.detail || 'Upload failed. Please check CSV headers.');
      }
    } catch (err) {
      setUploadMsg('Bulk upload network error.');
    } finally {
      setIsUploading(false);
    }
  };

  // Submit Admin Query
  const handleSendQuery = async (e) => {
    e.preventDefault();
    if (!queryForm.query_text) return;
    setIsSubmittingQuery(true);
    try {
      const sup = supervisors.find(s => s.role === queryForm.recipient_role);
      const res = await fetch('/api/admin/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query_text: queryForm.query_text,
          agent_id: agent.id,
          agent_name: agent.name,
          recipient_role: queryForm.recipient_role,
          recipient_name: sup ? sup.name : queryForm.recipient_role,
          priority: queryForm.priority
        })
      });
      if (res.ok) {
        setQueryForm(prev => ({ ...prev, query_text: '' }));
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Query submit error:', err);
    } finally {
      setIsSubmittingQuery(false);
    }
  };

  // Reply to Admin Query (demo reply)
  const handleReplyQuery = async (queryId) => {
    const text = prompt('Enter supervisor response to log into Neon DB:');
    if (!text) return;
    try {
      const res = await fetch(`/api/admin/queries/${queryId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply_text: text })
      });
      if (res.ok) fetchDashboardData();
    } catch (err) {
      console.error('Reply submit error:', err);
    }
  };

  // Submit New Task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskForm.task_title) return;
    setIsSubmittingTask(true);
    try {
      const sup = supervisors.find(s => s.role === taskForm.assigned_to_role);
      const res = await fetch('/api/admin/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_title: taskForm.task_title,
          description: taskForm.description,
          agent_id: agent.id,
          agent_name: agent.name,
          assigned_to_role: taskForm.assigned_to_role,
          assigned_to_name: sup ? sup.name : taskForm.assigned_to_role,
          plant_id: taskForm.plant_id,
          priority: taskForm.priority,
          target_date: taskForm.target_date
        })
      });
      if (res.ok) {
        setTaskForm(prev => ({
          ...prev,
          task_title: '',
          description: '',
          target_date: ''
        }));
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Task submit error:', err);
    } finally {
      setIsSubmittingTask(false);
    }
  };

  // Advance Task Stage
  const handleAdvanceTaskStage = async (taskId, currentStage) => {
    const stages = ['Assigned', 'Acknowledged', 'In Progress', 'Quality Review', 'Completed'];
    const idx = stages.indexOf(currentStage);
    if (idx >= 0 && idx < stages.length - 1) {
      const nextStage = stages[idx + 1];
      try {
        const res = await fetch(`/api/admin/tasks/${taskId}/stage`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stage: nextStage })
        });
        if (res.ok) fetchDashboardData();
      } catch (err) {
        console.error('Advance task error:', err);
      }
    }
  };

  const STAGES = ['Assigned', 'Acknowledged', 'In Progress', 'Quality Review', 'Completed'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '1100px',
          width: '92vw',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '16px',
          overflow: 'hidden',
          background: 'var(--dr-bg)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 28px',
            borderBottom: '1px solid rgba(var(--line-rgb), 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgb(var(--surface-rgb))'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--brand-purple), var(--brand-blue))',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '17px',
                boxShadow: '0 4px 12px rgba(111, 61, 186, 0.3)'
              }}
            >
              {agent.agentNumber < 10 ? `0${agent.agentNumber}` : agent.agentNumber}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {agent.name}
                </h2>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '99px',
                    background:
                      agent.status === 'running'
                        ? 'rgba(16, 185, 129, 0.12)'
                        : agent.status === 'warning'
                        ? 'rgba(245, 158, 11, 0.12)'
                        : 'rgba(239, 68, 68, 0.12)',
                    color:
                      agent.status === 'running'
                        ? 'var(--status-success)'
                        : agent.status === 'warning'
                        ? 'var(--status-warning)'
                        : 'var(--status-danger)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span
                    className="pulse-dot"
                    style={{
                      background:
                        agent.status === 'running'
                          ? 'var(--status-success)'
                          : agent.status === 'warning'
                          ? 'var(--status-warning)'
                          : 'var(--status-danger)'
                    }}
                  />
                  {agent.status.toUpperCase()}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  • {agent.sector}
                </span>
                {dashboardData?.totalRecordsInNeon && (
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: 'rgba(111, 61, 186, 0.1)',
                      color: 'var(--brand-purple)',
                      border: '1px solid rgba(111, 61, 186, 0.2)'
                    }}
                  >
                    Neon DB: {dashboardData.totalRecordsInNeon.toLocaleString()} rows
                  </span>
                )}
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--brand-purple)', marginTop: '2px', marginBottom: 0, fontWeight: 500 }}>
                {agent.tagline}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={fetchDashboardData}
              title="Refresh Live Data"
              style={{
                background: 'none',
                border: '1px solid rgba(var(--line-rgb), 0.2)',
                borderRadius: '8px',
                padding: '6px 10px',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 600
              }}
            >
              <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
              Sync Neon
            </button>

            {agent.status === 'running' ? (
              <button
                className="btn-danger"
                onClick={() => handleToggleStatus('stopped')}
                disabled={isUpdatingStatus}
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                <Square size={13} /> Stop
              </button>
            ) : (
              <button
                className="btn-primary"
                onClick={() => handleToggleStatus('running')}
                disabled={isUpdatingStatus}
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                <Play size={13} /> Start
              </button>
            )}

            <button
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px'
              }}
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div
          style={{
            padding: '0 28px',
            borderBottom: '1px solid rgba(var(--line-rgb), 0.12)',
            display: 'flex',
            gap: '24px',
            background: 'rgb(var(--surface-rgb))'
          }}
        >
          <button
            style={{
              padding: '13px 4px',
              border: 'none',
              background: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              color: activeTab === 'dashboard' ? 'var(--brand-purple)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'dashboard' ? '2.5px solid var(--brand-purple)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onClick={() => setActiveTab('dashboard')}
          >
            <TrendingUp size={15} />
            Live Neon KPIs & Telemetry
          </button>
          <button
            style={{
              padding: '13px 4px',
              border: 'none',
              background: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              color: activeTab === 'ingestion' ? 'var(--brand-purple)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'ingestion' ? '2.5px solid var(--brand-purple)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onClick={() => setActiveTab('ingestion')}
          >
            <UploadCloud size={15} />
            Bulk Upload & Manual Entry Form
          </button>
          <button
            style={{
              padding: '13px 4px',
              border: 'none',
              background: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              color: activeTab === 'queries' ? 'var(--brand-purple)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'queries' ? '2.5px solid var(--brand-purple)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onClick={() => setActiveTab('queries')}
          >
            <MessageSquare size={15} />
            Admin Queries ({dashboardData?.queries?.length || 0})
          </button>
          <button
            style={{
              padding: '13px 4px',
              border: 'none',
              background: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              color: activeTab === 'tasks' ? 'var(--brand-purple)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'tasks' ? '2.5px solid var(--brand-purple)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onClick={() => setActiveTab('tasks')}
          >
            <ListTodo size={15} />
            Task Stage Tracker ({dashboardData?.tasks?.length || 0})
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          
          {/* ========================================================
              TAB 1: LIVE NEON KPIS & RECENT TELEMETRY RECORDS
             ======================================================== */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {/* Top Banner */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(111, 61, 186, 0.08), rgba(20, 110, 245, 0.08))',
                  border: '1px solid rgba(111, 61, 186, 0.2)',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-purple)' }}>
                    Neon DB Connected Table: {dashboardData?.tableName || 'Loading...'}
                  </span>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Live telemetry aggregated across 6 manufacturing plants (Tamil Nadu, Karnataka, Maharashtra, Gujarat, Haryana).
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Status: </span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--status-success)' }}>
                    Synced & Live
                  </span>
                </div>
              </div>

              {/* Real KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                {dashboardData?.kpis ? (
                  Object.entries(dashboardData.kpis).map(([key, val]) => (
                    <div
                      key={key}
                      style={{
                        background: 'rgb(var(--surface-rgb))',
                        border: '1px solid rgba(var(--line-rgb), 0.15)',
                        borderRadius: '12px',
                        padding: '16px 18px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                      }}
                    >
                      <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {key.replace(/_/g, ' ')}
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>
                        {val}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--status-success)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--status-success)' }} />
                        Real data from Neon DB
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading real KPIs from Neon DB...</div>
                )}
              </div>

              {/* Recent Raw Neon DB Records */}
              <div
                style={{
                  background: 'rgb(var(--surface-rgb))',
                  border: '1px solid rgba(var(--line-rgb), 0.15)',
                  borderRadius: '12px',
                  padding: '18px 20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Database size={16} color="var(--brand-purple)" />
                    Recent Live Records in Neon DB ({dashboardData?.recentRecords?.length || 0} shown of {dashboardData?.totalRecordsInNeon || 0})
                  </h3>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    Target Table: <code>{dashboardData?.tableName}</code>
                  </span>
                </div>

                <div style={{ overflowX: 'auto', maxHeight: '280px', border: '1px solid rgba(var(--line-rgb), 0.1)', borderRadius: '8px' }}>
                  {dashboardData?.recentRecords && dashboardData.recentRecords.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: 'var(--dr-bg)', borderBottom: '1px solid rgba(var(--line-rgb), 0.15)' }}>
                          {Object.keys(dashboardData.recentRecords[0]).slice(0, 7).map((col) => (
                            <th key={col} style={{ padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.recentRecords.map((row, idx) => (
                          <tr
                            key={idx}
                            style={{
                              borderBottom: '1px solid rgba(var(--line-rgb), 0.08)',
                              background: idx % 2 === 0 ? 'transparent' : 'rgba(var(--line-rgb), 0.02)'
                            }}
                          >
                            {Object.values(row).slice(0, 7).map((val, cIdx) => (
                              <td key={cIdx} style={{ padding: '7px 12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                                {typeof val === 'number' ? (Number.isInteger(val) ? val : val.toFixed(2)) : String(val || '-')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                      No records found in table {dashboardData?.tableName}.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 2: DATA INGESTION (BULK UPLOAD & MANUAL INPUT FORM)
             ======================================================== */}
          {activeTab === 'ingestion' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              
              {/* Form 1: Manual Parameter Entry */}
              <div
                style={{
                  background: 'rgb(var(--surface-rgb))',
                  border: '1px solid rgba(var(--line-rgb), 0.15)',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <PlusCircle size={18} color="var(--brand-purple)" />
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Manual KPI / Parameter Entry
                  </h3>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: 0, marginBottom: '16px' }}>
                  Plant supervisors can manually inject shift metrics, test overrides, or custom inspection logs directly into Neon DB.
                </p>

                {manualSuccessMsg && (
                  <div style={{ padding: '10px 14px', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--status-success)', borderRadius: '8px', fontSize: '12px', marginBottom: '14px', fontWeight: 600 }}>
                    ✓ {manualSuccessMsg}
                  </div>
                )}

                <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Metric / Parameter Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Line OEE Override, Temperature, Shift Defect Count"
                      value={manualForm.metric_name}
                      onChange={(e) => setManualForm({ ...manualForm, metric_name: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(var(--line-rgb), 0.2)',
                        background: 'var(--dr-bg)',
                        color: 'var(--text-primary)',
                        fontSize: '12.5px'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                        Value *
                      </label>
                      <input
                        type="number"
                        step="any"
                        placeholder="e.g. 88.5"
                        value={manualForm.metric_value}
                        onChange={(e) => setManualForm({ ...manualForm, metric_value: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(var(--line-rgb), 0.2)',
                          background: 'var(--dr-bg)',
                          color: 'var(--text-primary)',
                          fontSize: '12.5px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                        Unit
                      </label>
                      <input
                        type="text"
                        placeholder="%, Units, °C, min"
                        value={manualForm.unit}
                        onChange={(e) => setManualForm({ ...manualForm, unit: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(var(--line-rgb), 0.2)',
                          background: 'var(--dr-bg)',
                          color: 'var(--text-primary)',
                          fontSize: '12.5px'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                        Plant Facility
                      </label>
                      <select
                        value={manualForm.plant_id}
                        onChange={(e) => setManualForm({ ...manualForm, plant_id: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(var(--line-rgb), 0.2)',
                          background: 'var(--dr-bg)',
                          color: 'var(--text-primary)',
                          fontSize: '12.5px'
                        }}
                      >
                        <option value="IN-TN-01">Sriperumbudur (Tamil Nadu)</option>
                        <option value="IN-KA-01">Bengaluru (Karnataka)</option>
                        <option value="IN-MH-01">Pune (Maharashtra)</option>
                        <option value="IN-GJ-01">Sanand (Gujarat)</option>
                        <option value="IN-HR-01">Gurugram (Haryana)</option>
                        <option value="IN-TN-02">Hosur (Tamil Nadu)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                        Operational Shift
                      </label>
                      <select
                        value={manualForm.shift_id}
                        onChange={(e) => setManualForm({ ...manualForm, shift_id: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(var(--line-rgb), 0.2)',
                          background: 'var(--dr-bg)',
                          color: 'var(--text-primary)',
                          fontSize: '12.5px'
                        }}
                      >
                        <option value="A">Shift A (Morning 06:00 - 14:00)</option>
                        <option value="B">Shift B (Evening 14:00 - 22:00)</option>
                        <option value="C">Shift C (Night 22:00 - 06:00)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Supervisor / Admin Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Optional notes or calibration reference..."
                      value={manualForm.notes}
                      onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(var(--line-rgb), 0.2)',
                        background: 'var(--dr-bg)',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                        resize: 'none'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingManual}
                    className="btn-primary"
                    style={{
                      marginTop: '6px',
                      padding: '10px 16px',
                      fontSize: '13px',
                      fontWeight: 700,
                      justifyContent: 'center'
                    }}
                  >
                    {isSubmittingManual ? 'Saving to Neon DB...' : 'Save Manual Record to Neon DB'}
                  </button>
                </form>
              </div>

              {/* Form 2: Bulk CSV Upload */}
              <div
                style={{
                  background: 'rgb(var(--surface-rgb))',
                  border: '1px solid rgba(var(--line-rgb), 0.15)',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <FileSpreadsheet size={18} color="var(--brand-purple)" />
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Bulk CSV Dataset Upload
                  </h3>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: 0, marginBottom: '16px' }}>
                  Upload batches of CSV records to ingest directly into this agent's table in Neon DB (<code>{dashboardData?.tableName}</code>).
                </p>

                {uploadMsg && (
                  <div
                    style={{
                      padding: '10px 14px',
                      background: uploadMsg.includes('failed') ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                      color: uploadMsg.includes('failed') ? 'var(--status-danger)' : 'var(--status-success)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      marginBottom: '14px',
                      fontWeight: 600
                    }}
                  >
                    {uploadMsg}
                  </div>
                )}

                <div
                  style={{
                    border: '2px dashed rgba(111, 61, 186, 0.3)',
                    borderRadius: '12px',
                    padding: '30px 20px',
                    textAlign: 'center',
                    background: 'var(--dr-bg)',
                    marginBottom: '16px',
                    cursor: 'pointer'
                  }}
                  onClick={() => document.getElementById('bulk-csv-input').click()}
                >
                  <UploadCloud size={32} color="var(--brand-purple)" style={{ margin: '0 auto 10px' }} />
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {uploadFile ? uploadFile.name : 'Click to select CSV dataset'}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Supports UTF-8 formatted CSV files matching table schema
                  </div>
                  <input
                    id="bulk-csv-input"
                    type="file"
                    accept=".csv"
                    style={{ display: 'none' }}
                    onChange={(e) => setUploadFile(e.target.files[0])}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleBulkUpload}
                  disabled={!uploadFile || isUploading}
                  className="btn-primary"
                  style={{
                    marginTop: 'auto',
                    padding: '10px 16px',
                    fontSize: '13px',
                    fontWeight: 700,
                    justifyContent: 'center',
                    opacity: !uploadFile ? 0.5 : 1
                  }}
                >
                  {isUploading ? 'Ingesting rows into Neon DB...' : `Upload to Table: ${dashboardData?.tableName || 'agent'}`}
                </button>
              </div>

            </div>
          )}

          {/* ========================================================
              TAB 3: ADMIN QUERIES TO MANAGERS & SUPERVISORS
             ======================================================== */}
          {activeTab === 'queries' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Send Query Box */}
              <div
                style={{
                  background: 'rgb(var(--surface-rgb))',
                  border: '1px solid rgba(var(--line-rgb), 0.15)',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Send size={16} color="var(--brand-purple)" />
                  Dispatch Query to Plant Supervisor or Functional Lead
                </h3>

                <form onSubmit={handleSendQuery} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                        Designated Recipient (Manager / Supervisor)
                      </label>
                      <select
                        value={queryForm.recipient_role}
                        onChange={(e) => setQueryForm({ ...queryForm, recipient_role: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(var(--line-rgb), 0.2)',
                          background: 'var(--dr-bg)',
                          color: 'var(--text-primary)',
                          fontSize: '12.5px'
                        }}
                      >
                        {supervisors.map((s, idx) => (
                          <option key={idx} value={s.role}>
                            {s.role} ({s.name} - {s.plant})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                        Priority
                      </label>
                      <select
                        value={queryForm.priority}
                        onChange={(e) => setQueryForm({ ...queryForm, priority: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(var(--line-rgb), 0.2)',
                          background: 'var(--dr-bg)',
                          color: 'var(--text-primary)',
                          fontSize: '12.5px'
                        }}
                      >
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical Incident</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Query / Instruction for Supervisor *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="e.g. Please clarify why Line 2 OEE dropped below 75% during Shift B and review supplier heat-treatment lot #4812..."
                      value={queryForm.query_text}
                      onChange={(e) => setQueryForm({ ...queryForm, query_text: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(var(--line-rgb), 0.2)',
                        background: 'var(--dr-bg)',
                        color: 'var(--text-primary)',
                        fontSize: '12.5px',
                        resize: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="submit"
                      disabled={isSubmittingQuery}
                      className="btn-primary"
                      style={{ padding: '8px 18px', fontSize: '12.5px' }}
                    >
                      {isSubmittingQuery ? 'Sending...' : 'Dispatch Query'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Sent Queries & Reply Ledger */}
              <div
                style={{
                  background: 'rgb(var(--surface-rgb))',
                  border: '1px solid rgba(var(--line-rgb), 0.15)',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 14px 0' }}>
                  Query Ledger & Supervisor Replies (Saved in Neon DB)
                </h3>

                {dashboardData?.queries && dashboardData.queries.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {dashboardData.queries.map((q) => (
                      <div
                        key={q.id}
                        style={{
                          background: 'var(--dr-bg)',
                          border: '1px solid rgba(var(--line-rgb), 0.12)',
                          borderRadius: '10px',
                          padding: '14px 16px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                              To: {q.recipient_role} ({q.recipient_name})
                            </span>
                            <span
                              style={{
                                marginLeft: '8px',
                                fontSize: '11px',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                background: q.priority === 'Critical' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(111, 61, 186, 0.15)',
                                color: q.priority === 'Critical' ? 'var(--status-danger)' : 'var(--brand-purple)',
                                fontWeight: 700
                              }}
                            >
                              {q.priority}
                            </span>
                          </div>
                          <span
                            style={{
                              fontSize: '11px',
                              padding: '2px 8px',
                              borderRadius: '99px',
                              background: q.status === 'Replied' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                              color: q.status === 'Replied' ? 'var(--status-success)' : 'var(--status-warning)',
                              fontWeight: 700
                            }}
                          >
                            {q.status}
                          </span>
                        </div>

                        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '8px 0' }}>
                          "{q.query_text}"
                        </p>

                        {q.reply_text ? (
                          <div
                            style={{
                              background: 'rgba(16, 185, 129, 0.06)',
                              borderLeft: '3px solid var(--status-success)',
                              padding: '8px 12px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              color: 'var(--text-primary)',
                              marginTop: '8px'
                            }}
                          >
                            <strong>Supervisor Reply:</strong> {q.reply_text}
                          </div>
                        ) : (
                          <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleReplyQuery(q.id)}
                              style={{
                                background: 'none',
                                border: '1px solid rgba(var(--line-rgb), 0.2)',
                                borderRadius: '6px',
                                padding: '4px 10px',
                                fontSize: '11px',
                                color: 'var(--brand-purple)',
                                cursor: 'pointer',
                                fontWeight: 600
                              }}
                            >
                              + Log Supervisor Reply
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12.5px' }}>
                    No queries sent for this agent yet. Use the form above to query plant supervisors.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 4: 5-STAGE TASK TRACKING
             ======================================================== */}
          {activeTab === 'tasks' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              
              {/* Assign New Task Form */}
              <div
                style={{
                  background: 'rgb(var(--surface-rgb))',
                  border: '1px solid rgba(var(--line-rgb), 0.15)',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ListTodo size={16} color="var(--brand-purple)" />
                  Assign Operational Task with 5-Stage Lifecycle Tracking
                </h3>

                <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                        Task Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Recalibrate CNC Bearing Vibration Sensor #2"
                        value={taskForm.task_title}
                        onChange={(e) => setTaskForm({ ...taskForm, task_title: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(var(--line-rgb), 0.2)',
                          background: 'var(--dr-bg)',
                          color: 'var(--text-primary)',
                          fontSize: '12.5px'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                        Assign To Manager / Supervisor
                      </label>
                      <select
                        value={taskForm.assigned_to_role}
                        onChange={(e) => setTaskForm({ ...taskForm, assigned_to_role: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(var(--line-rgb), 0.2)',
                          background: 'var(--dr-bg)',
                          color: 'var(--text-primary)',
                          fontSize: '12.5px'
                        }}
                      >
                        {supervisors.map((s, idx) => (
                          <option key={idx} value={s.role}>
                            {s.role} ({s.name})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                        Priority
                      </label>
                      <select
                        value={taskForm.priority}
                        onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(var(--line-rgb), 0.2)',
                          background: 'var(--dr-bg)',
                          color: 'var(--text-primary)',
                          fontSize: '12.5px'
                        }}
                      >
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Detailed Instructions / SOP Requirements
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Specify checklist or technical instructions for the manager..."
                      value={taskForm.description}
                      onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(var(--line-rgb), 0.2)',
                        background: 'var(--dr-bg)',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                        resize: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="submit"
                      disabled={isSubmittingTask}
                      className="btn-primary"
                      style={{ padding: '8px 18px', fontSize: '12.5px' }}
                    >
                      {isSubmittingTask ? 'Assigning...' : 'Assign Task'}
                    </button>
                  </div>
                </form>
              </div>

              {/* 5-Stage Kanban / Task List */}
              <div
                style={{
                  background: 'rgb(var(--surface-rgb))',
                  border: '1px solid rgba(var(--line-rgb), 0.15)',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Active Manufacturing Tasks ({dashboardData?.tasks?.length || 0})
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span>Assigned</span> <ArrowRight size={12} />
                    <span>Acknowledged</span> <ArrowRight size={12} />
                    <span>In Progress</span> <ArrowRight size={12} />
                    <span>Quality Review</span> <ArrowRight size={12} />
                    <span>Completed</span>
                  </div>
                </div>

                {dashboardData?.tasks && dashboardData.tasks.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {dashboardData.tasks.map((task) => {
                      const stageIdx = STAGES.indexOf(task.stage);
                      return (
                        <div
                          key={task.id}
                          style={{
                            background: 'var(--dr-bg)',
                            border: '1px solid rgba(var(--line-rgb), 0.12)',
                            borderRadius: '10px',
                            padding: '16px 18px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {task.task_title}
                              </span>
                              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                Assigned to: <strong>{task.assigned_to_role}</strong> ({task.assigned_to_name}) • Plant: {task.plant_id}
                              </div>
                            </div>
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                padding: '3px 8px',
                                borderRadius: '4px',
                                background: task.priority === 'Critical' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(111, 61, 186, 0.15)',
                                color: task.priority === 'Critical' ? 'var(--status-danger)' : 'var(--brand-purple)'
                              }}
                            >
                              {task.priority}
                            </span>
                          </div>

                          {task.description && (
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '8px 0' }}>
                              {task.description}
                            </p>
                          )}

                          {/* Visual 5-Stage Stepper */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '14px 0 10px' }}>
                            {STAGES.map((sName, sIdx) => {
                              const isCompleted = sIdx < stageIdx;
                              const isCurrent = sIdx === stageIdx;
                              return (
                                <React.Fragment key={sName}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '5px',
                                      padding: '4px 8px',
                                      borderRadius: '6px',
                                      fontSize: '11px',
                                      fontWeight: isCurrent ? 700 : 500,
                                      background: isCurrent
                                        ? 'var(--brand-purple)'
                                        : isCompleted
                                        ? 'rgba(16, 185, 129, 0.15)'
                                        : 'rgba(var(--line-rgb), 0.08)',
                                      color: isCurrent
                                        ? '#fff'
                                        : isCompleted
                                        ? 'var(--status-success)'
                                        : 'var(--text-muted)'
                                    }}
                                  >
                                    {isCompleted ? <CheckCircle2 size={12} /> : <span>{sIdx + 1}.</span>}
                                    {sName}
                                  </div>
                                  {sIdx < STAGES.length - 1 && (
                                    <div
                                      style={{
                                        flex: 1,
                                        height: '2px',
                                        background: sIdx < stageIdx ? 'var(--status-success)' : 'rgba(var(--line-rgb), 0.15)'
                                      }}
                                    />
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </div>

                          {/* Advance Button */}
                          {stageIdx < STAGES.length - 1 && (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                              <button
                                onClick={() => handleAdvanceTaskStage(task.id, task.stage)}
                                className="btn-primary"
                                style={{
                                  padding: '5px 12px',
                                  fontSize: '11.5px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                Advance to "{STAGES[stageIdx + 1]}" <ArrowRight size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12.5px' }}>
                    No tasks currently assigned for this agent.
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
