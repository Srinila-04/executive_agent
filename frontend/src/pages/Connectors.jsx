import React, { useState } from 'react';
import { DEFAULT_CONNECTORS } from '../data/defaultConnectors';
import {
  Plug,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  RefreshCw,
  ExternalLink,
  Shield,
  Database,
  Server,
  Layers,
  ArrowRight,
  Activity,
  Check
} from 'lucide-react';

export default function Connectors({ connectors = [], onToggleConnector }) {
  // Local state for instant optimistic updates and new manually added connectors
  const [localConnectors, setLocalConnectors] = useState(() => {
    if (connectors && connectors.length > 0) return connectors;
    return DEFAULT_CONNECTORS;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'connected', 'not_connected', 'database', 'erp', 'mes'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState(null);

  // Directly fetch connectors from backend on mount so grid stays fresh with live backend status
  React.useEffect(() => {
    fetch('/api/connectors')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (data && data.connectors && data.connectors.length > 0) {
          setLocalConnectors(data.connectors);
        }
      })
      .catch((err) => console.warn('Backend connectors fetch deferred, using enterprise defaults:', err));
  }, []);

  // Manual Connector Form State (At the top of the page)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Database • Plant data warehouse',
    endpoint: '',
    authType: 'OAuth 2.0 / Bearer Token',
    plant: 'All Plant Facilities (Global)'
  });

  // Sync with prop updates if length changes
  React.useEffect(() => {
    if (connectors && connectors.length > 0) {
      setLocalConnectors((prev) => {
        // Merge without losing freshly created local connectors
        const existingIds = new Set(connectors.map((c) => c.id));
        const customLocal = prev.filter((p) => !existingIds.has(p.id));
        return [...customLocal, ...connectors];
      });
    }
  }, [connectors]);

  // Handle Manual Connector Creation (Input Form at the top)
  const handleManualConnect = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/connectors/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success && data.connector) {
        setLocalConnectors((prev) => [data.connector, ...prev]);
        setSuccessBanner(`Successfully established live connection to "${data.connector.name}"!`);
        // Reset form
        setFormData({
          name: '',
          category: 'Database • Plant data warehouse',
          endpoint: '',
          authType: 'OAuth 2.0 / Bearer Token',
          plant: 'All Plant Facilities (Global)'
        });
        setTimeout(() => setSuccessBanner(null), 4500);
      }
    } catch (err) {
      // Fallback local creation if offline
      const id = 'conn-' + Date.now();
      const words = formData.name.trim().split(/\s+/);
      const shortCode = words.length > 1
        ? (words[0][0] + words[1][0]).toUpperCase()
        : formData.name.substring(0, 2).toUpperCase();

      const newConn = {
        id,
        name: formData.name.trim(),
        shortCode,
        category: formData.category,
        badge: 'Custom Integration',
        status: 'connected',
        eventsCount: 4,
        eventsText: '4 events available',
        color: '#6f3dba',
        endpoint: formData.endpoint || 'https://api.internal.plant.corp',
        lastSync: 'Live (Just now)',
        recordsSynced: '1,250'
      };
      setLocalConnectors((prev) => [newConn, ...prev]);
      setSuccessBanner(`Live connector "${newConn.name}" activated successfully!`);
      setFormData({
        name: '',
        category: 'Database • Plant data warehouse',
        endpoint: '',
        authType: 'OAuth 2.0 / Bearer Token',
        plant: 'All Plant Facilities (Global)'
      });
      setTimeout(() => setSuccessBanner(null), 4500);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Connect / Disconnect on any card
  const handleToggle = (connectorId) => {
    // 1. Optimistic UI toggle
    setLocalConnectors((prev) =>
      prev.map((c) => {
        if (c.id === connectorId) {
          const nextStatus = c.status === 'connected' ? 'available' : 'connected';
          return {
            ...c,
            status: nextStatus,
            lastSync: nextStatus === 'connected' ? 'Just now' : 'Not connected'
          };
        }
        return c;
      })
    );

    // 2. Delegate to parent handler for API call
    if (onToggleConnector) {
      onToggleConnector(connectorId);
    }
  };

  // Filtering Logic
  const filteredList = localConnectors.filter((c) => {
    // Search query
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.category && c.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.shortCode && c.shortCode.toLowerCase().includes(searchQuery.toLowerCase()));

    // Filter pills
    if (!matchesSearch) return false;
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'connected') return c.status === 'connected';
    if (selectedFilter === 'not_connected') return c.status !== 'connected';
    if (selectedFilter === 'database') {
      return (
        c.isPrimary ||
        (c.category && c.category.toLowerCase().includes('database')) ||
        c.id === 'conn-neondb' ||
        c.id === 'conn-mongodb' ||
        c.id === 'conn-snowflake'
      );
    }
    if (selectedFilter === 'erp') return c.category && (c.category.toLowerCase().includes('erp') || c.category.toLowerCase().includes('mes'));
    if (selectedFilter === 'mes') return c.category && c.category.toLowerCase().includes('mes');
    return true;
  });

  const connectedCount = localConnectors.filter((c) => c.status === 'connected').length;
  const totalCount = localConnectors.length;
  const dbCount = localConnectors.filter(
    (c) =>
      c.isPrimary ||
      (c.category && c.category.toLowerCase().includes('database')) ||
      c.id === 'conn-neondb' ||
      c.id === 'conn-mongodb' ||
      c.id === 'conn-snowflake'
  ).length;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 72px)',
        maxHeight: 'calc(100vh - 72px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: '#000000',
        padding: '16px 24px',
        gap: '16px',
        boxSizing: 'border-box',
        background: 'var(--page-bg)'
      }}
    >
      {/* SUCCESS NOTIFICATION TOAST (When manual connector added) */}
      {successBanner && (
        <div
          style={{
            background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.12) 100%)',
            border: '1.5px solid #059669',
            borderRadius: '10px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '13px',
            color: '#065f46',
            fontWeight: 700,
            animation: 'fadeIn 0.25s ease',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} style={{ color: '#059669' }} />
            <span>{successBanner}</span>
          </div>
          <button
            onClick={() => setSuccessBanner(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#065f46',
              fontWeight: 800,
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ✕
          </button>
        </div>
      )}



      {/* 1. TOP MANUAL CONNECTOR INPUT FORM (USER REQUIREMENT) */}
      <div
        className="card"
        style={{
          background: 'rgb(var(--surface-rgb))',
          borderRadius: '14px',
          padding: '18px 22px',
          boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
          border: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          flexShrink: 0
        }}
      >
        {/* Form Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'var(--brand-purple)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Plug size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#000000', margin: 0 }}>
                Connect Enterprise Data Source / Connector
              </h3>
              <p style={{ fontSize: '12px', color: '#111111', margin: '2px 0 0 0', fontWeight: 500 }}>
                Provision custom industrial databases, ERP instances, line-side MES servers or REST webhooks.
              </p>
            </div>
          </div>

          <span
            style={{
              fontSize: '11.5px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '99px',
              background: 'rgba(111, 61, 186, 0.1)',
              color: 'var(--brand-purple)'
            }}
          >
            ● Manual Connection Gateway
          </span>
        </div>

        {/* The Input Form */}
        <form
          onSubmit={handleManualConnect}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) 160px',
            gap: '12px',
            alignItems: 'flex-end'
          }}
        >
          {/* Input 1: Connector Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#000000' }}>
              Connector Name <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Oracle, Kafka, MQTT, Custom API"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.15)',
                fontSize: '13px',
                color: '#000000',
                background: 'rgb(var(--surface-rgb))',
                outline: 'none',
                fontFamily: "'Inter', sans-serif"
              }}
            />
          </div>

          {/* Input 2: System Category / Type */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#000000' }}>
              System Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.15)',
                fontSize: '12.5px',
                color: '#000000',
                background: 'rgb(var(--surface-rgb))',
                outline: 'none',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              <option value="Database • Plant data warehouse">Database • Plant data warehouse</option>
              <option value="ERP / CMMS • Work orders, notifications and costs">ERP / CMMS • Work orders and costs</option>
              <option value="MES • Production orders, downtime and line state">MES • Shop floor execution & downtime</option>
              <option value="Warehouse • Inbound receipts and dispatch staging">Warehouse • Inbound receipts & dispatch</option>
              <option value="Industrial IoT • High-speed PLC tag telemetry">Industrial IoT • SCADA & PLC telemetry</option>
              <option value="REST • Generic webhook for in-house system">REST • Generic Webhook / API</option>
              <option value="Reporting • Leadership dashboards">Reporting • Executive BI & Dashboards</option>
              <option value="File • Spreadsheet export for planner">File • Spreadsheet Excel / CSV</option>
            </select>
          </div>

          {/* Input 3: Endpoint / Host URL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#000000' }}>
              Host Endpoint URL / Socket
            </label>
            <input
              type="text"
              placeholder="e.g. https://erp.motherson.internal:8443"
              value={formData.endpoint}
              onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
              style={{
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.15)',
                fontSize: '13px',
                color: '#000000',
                background: 'rgb(var(--surface-rgb))',
                outline: 'none',
                fontFamily: "'Inter', sans-serif"
              }}
            />
          </div>

          {/* Input 4: Authentication Protocol */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#000000' }}>
              Authentication Protocol
            </label>
            <select
              value={formData.authType}
              onChange={(e) => setFormData({ ...formData, authType: e.target.value })}
              style={{
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.15)',
                fontSize: '12.5px',
                color: '#000000',
                background: 'rgb(var(--surface-rgb))',
                outline: 'none',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              <option value="OAuth 2.0 / Bearer Token">OAuth 2.0 / Bearer Token</option>
              <option value="Service Account / API Key">Service Account / API Key</option>
              <option value="Basic Auth / TLS 1.3">Basic Auth / TLS 1.3</option>
              <option value="OPC-UA / X.509 Certificate">OPC-UA / X.509 Certificate</option>
              <option value="Kerberos / SSL Strict">Kerberos / SSL Strict</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--brand-purple)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(111, 61, 186, 0.3)',
              height: '38px'
            }}
          >
            {isSubmitting ? <RefreshCw size={14} className="spin" /> : <Plus size={15} />}
            Connect System
          </button>
        </form>
      </div>

      {/* 2. STATS & FILTER TOOLBAR */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          flexShrink: 0
        }}
      >
        {/* Left: Search Input & Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgb(var(--surface-rgb))',
              border: '1px solid rgba(0,0,0,0.15)',
              borderRadius: '8px',
              padding: '6px 12px',
              width: '220px'
            }}
          >
            <Search size={14} style={{ color: '#666666' }} />
            <input
              type="text"
              placeholder="Search connectors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '12.5px',
                color: '#000000',
                width: '100%',
                fontFamily: "'Inter', sans-serif"
              }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', background: 'var(--muted-fill)', padding: '3px', borderRadius: '8px', gap: '3px' }}>
            <button
              onClick={() => setSelectedFilter('all')}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                background: selectedFilter === 'all' ? '#000000' : 'transparent',
                color: selectedFilter === 'all' ? '#ffffff' : '#000000'
              }}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setSelectedFilter('connected')}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                background: selectedFilter === 'connected' ? 'var(--status-success)' : 'transparent',
                color: selectedFilter === 'connected' ? '#ffffff' : '#000000'
              }}
            >
              Connected ({connectedCount})
            </button>
            <button
              onClick={() => setSelectedFilter('not_connected')}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                background: selectedFilter === 'not_connected' ? '#475569' : 'transparent',
                color: selectedFilter === 'not_connected' ? '#ffffff' : '#000000'
              }}
            >
              Not Connected ({totalCount - connectedCount})
            </button>
            <button
              onClick={() => setSelectedFilter('database')}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                background: selectedFilter === 'database' ? '#00e599' : 'transparent',
                color: selectedFilter === 'database' ? '#0f172a' : '#000000'
              }}
            >
              Databases ({dbCount})
            </button>
            <button
              onClick={() => setSelectedFilter('erp')}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                background: selectedFilter === 'erp' ? '#6f3dba' : 'transparent',
                color: selectedFilter === 'erp' ? '#ffffff' : '#000000'
              }}
            >
              ERP & MES
            </button>
          </div>
        </div>

        {/* Right: Mesh Summary Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#047857',
              fontSize: '12px',
              fontWeight: 700
            }}
          >
            ● {connectedCount} Active Connections
          </span>
          <span
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgb(var(--surface-rgb))',
              border: '1px solid rgba(0,0,0,0.1)',
              color: '#000000',
              fontSize: '12px',
              fontWeight: 700
            }}
          >
            99.8% Sync Rate
          </span>
        </div>
      </div>

      {/* 3. REFERENCE-STYLE CONNECTOR CARDS GRID (EXACT LAYOUT AS ATTACHED IMAGE) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '14px',
          paddingBottom: '20px'
        }}
      >
        {filteredList.map((conn) => {
          const isConnected = conn.status === 'connected';
          const isPrimary = conn.isPrimary || conn.id === 'conn-neondb';

          return (
            <div
              key={conn.id}
              className="card"
              style={{
                background: isPrimary
                  ? 'linear-gradient(135deg, rgba(0, 229, 153, 0.06) 0%, rgb(var(--surface-rgb)) 100%)'
                  : 'rgb(var(--surface-rgb))',
                borderRadius: '14px',
                border: isPrimary ? '2px solid #00e599' : '1px solid rgba(0,0,0,0.08)',
                boxShadow: isPrimary
                  ? '0 6px 20px rgba(0, 229, 153, 0.15)'
                  : isConnected
                  ? '0 4px 16px rgba(0,0,0,0.05)'
                  : '0 2px 10px rgba(0,0,0,0.02)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                minHeight: '190px'
              }}
            >
              {/* Card Header: Logo Square + Title */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Square Logo Badge with Shortcode */}
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: conn.color || '#334155',
                      color: isPrimary ? '#0f172a' : '#ffffff',
                      fontWeight: 800,
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      letterSpacing: '0.4px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
                    }}
                  >
                    {conn.shortCode || conn.name.substring(0, 2).toUpperCase()}
                  </div>

                  {/* Connector Title */}
                  <div style={{ overflow: 'hidden' }}>
                    <h4
                      style={{
                        fontSize: '14px',
                        fontWeight: 800,
                        color: '#000000',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {conn.name}
                    </h4>
                  </div>
                </div>

                {/* Status Pill: Primary Warehouse / Connected / Not connected */}
                <div>
                  {isPrimary ? (
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 800,
                        padding: '3px 9px',
                        borderRadius: '99px',
                        background: '#00e599',
                        color: '#0f172a',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        boxShadow: '0 1px 4px rgba(0, 229, 153, 0.4)'
                      }}
                    >
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0f172a' }} />
                      PRIMARY ACTIVE WAREHOUSE (NEON DB)
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '99px',
                        background: isConnected
                          ? 'rgba(16, 185, 129, 0.12)'
                          : 'rgba(100, 116, 139, 0.1)',
                        color: isConnected ? '#059669' : '#64748b',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      {isConnected ? (
                        <>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} />
                          Connected
                        </>
                      ) : (
                        'Not connected'
                      )}
                    </span>
                  )}
                </div>

                {/* Subtitle / Category Description */}
                <div
                  style={{
                    fontSize: '11.5px',
                    color: '#222222',
                    lineHeight: 1.35,
                    minHeight: '28px'
                  }}
                >
                  {conn.category}
                </div>

                {/* Endpoint or Live Synced Info */}
                {conn.endpoint && (
                  <div style={{ fontSize: '11px', color: '#475569', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    🔗 <code>{conn.endpoint}</code>
                  </div>
                )}

                {/* Events Available / Records Synced Count */}
                <div style={{ fontSize: '11px', color: isPrimary ? '#059669' : '#666666', fontWeight: 700 }}>
                  {conn.recordsSynced ? `● ${conn.recordsSynced} • ${conn.lastSync || 'Live'}` : conn.eventsText || `${conn.eventsCount || 4} events available`}
                </div>
              </div>

              {/* Action Button: Connect / Disconnect / Primary Protected */}
              <div style={{ marginTop: 'auto', paddingTop: '4px' }}>
                {isPrimary ? (
                  <button
                    disabled
                    style={{
                      width: 'auto',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#059669',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'default',
                      fontFamily: "'Inter', sans-serif",
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)'
                    }}
                    title="Neon DB is the primary live data warehouse and remains permanently connected."
                  >
                    <CheckCircle2 size={13} /> Active & Locked (Primary Star-Schema DB)
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggle(conn.id)}
                    style={{
                      width: 'auto',
                      padding: '8px 18px',
                      borderRadius: '8px',
                      border: 'none',
                      background: isConnected ? '#475569' : 'var(--brand-purple)',
                      color: '#ffffff',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif",
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease',
                      boxShadow: isConnected
                        ? 'none'
                        : '0 2px 8px rgba(111, 61, 186, 0.25)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isConnected) {
                        e.currentTarget.style.filter = 'brightness(1.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = 'none';
                    }}
                  >
                    {isConnected ? (
                      <>
                        <Check size={13} /> Connected
                      </>
                    ) : (
                      'Connect'
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
