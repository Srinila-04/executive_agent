import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Plug2,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Server,
  Layers,
  Cpu,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Building2,
  Package,
  Activity,
  FileSpreadsheet,
  Clock,
  Radio,
  Check,
  Sparkles,
  Zap,
  Plus,
  ExternalLink,
  Sliders,
} from 'lucide-react'
import { connectorsApi } from '../api/connectors.api'
import { formatNumber } from '../utils/format'

const CONNECTOR_PRESETS = [
  {
    id: 'postgres-neon',
    name: 'PostgreSQL / Neon Cloud Store',
    category: 'Analytical Data Warehouse',
    protocol: 'PostgreSQL 16 (SSL Pool)',
    endpointSummary: 'ep-manufacturing-360.neon.tech:5432 / neondb',
    recordsSummary: '1,500 customer commitments · 6,624 inventory snapshots · 16,000 quality checks',
    latencyMs: 142,
    status: 'ACTIVE',
    icon: Database,
    description: 'High-concurrency PostgreSQL data store with SSL connection pooling and analytical replica tables.',
    fields: [
      { key: 'host', label: 'Host / Endpoint', placeholder: 'ep-cool-cloud.neon.tech', default: 'ep-manufacturing-360.neon.tech' },
      { key: 'port', label: 'Port', placeholder: '5432', default: '5432' },
      { key: 'database', label: 'Database Name', placeholder: 'manufacturing_db', default: 'neondb' },
      { key: 'username', label: 'Username', placeholder: 'app_user', default: 'neondb_owner' },
      { key: 'sslmode', label: 'SSL Mode', placeholder: 'require', default: 'require' },
      { key: 'pool_size', label: 'Connection Pool Size', placeholder: '25', default: '25' },
    ],
  },
  {
    id: 'sap-s4hana',
    name: 'SAP S/4HANA (Enterprise ERP)',
    category: 'Commercial & Sales Orders',
    protocol: 'OData v4 / RFC Gateway',
    endpointSummary: 'https://gateway.sap.corp/odata/API_SALES_ORDER',
    recordsSummary: 'Customer masters (CUS-001..004), pricing contracts, credit risk scores',
    latencyMs: 48,
    status: 'CONNECTED',
    icon: Building2,
    description: 'B2B customer accounts, sales orders, credit lines, payment terms, and commercial invoicing.',
    fields: [
      { key: 'app_server', label: 'SAP Application Server', placeholder: 'sap-s4.corp.local', default: 'sap-erp-prd.corp.internal' },
      { key: 'system_number', label: 'System Number', placeholder: '00', default: '01' },
      { key: 'client_id', label: 'SAP Client ID', placeholder: '100', default: '100' },
      { key: 'odata_endpoint', label: 'OData Service URL', placeholder: 'https://sap.corp/sap/opu/odata/sap/API_SALES_ORDER_SRV', default: 'https://gateway.sap.corp/odata/API_SALES_ORDER' },
      { key: 'company_code', label: 'Company Code', placeholder: '1000', default: 'IN10' },
      { key: 'auth_token', label: 'OData Bearer / API Key', placeholder: 'Bearer sap_token_...', default: 'sap_live_api_token_authenticated' },
    ],
  },
  {
    id: 'siemens-mes',
    name: 'Siemens Opcenter MES',
    category: 'Manufacturing Execution Floor',
    protocol: 'OPC-UA / MQTT Telemetry',
    endpointSummary: 'opc.tcp://floor-gw.corp:4840 / PROD_LINE_01',
    recordsSummary: '450 production runs, Chennai & Bengaluru plant throughput, line capacity CTP',
    latencyMs: 32,
    status: 'CONNECTED',
    icon: Cpu,
    description: 'Plant production orders, work center line capacity, line throughput, and dispatching.',
    fields: [
      { key: 'mes_host', label: 'MES Plant Server URL', placeholder: 'https://mes.plant.corp', default: 'https://chennai-mes.corp.internal:8443' },
      { key: 'plant_ids', label: 'Managed Plant IDs', placeholder: 'PLANT-01, PLANT-02', default: 'PLANT-01 (Chennai), PLANT-02 (Bengaluru)' },
      { key: 'opc_endpoint', label: 'OPC-UA / MQTT Endpoint', placeholder: 'opc.tcp://10.20.1.5:4840', default: 'opc.tcp://floor-gw.corp:4840' },
      { key: 'dispatch_queue', label: 'Dispatch Order Queue', placeholder: 'PROD_DISPATCH_MAIN', default: 'DISPATCH_LINE_AUTO' },
    ],
  },
  {
    id: 'sap-ewm',
    name: 'SAP EWM / Manhattan WMS',
    category: 'Warehouse & Staging Facilities',
    protocol: 'WMS REST Gateway',
    endpointSummary: 'https://wms-hub.corp.internal/v2 (RM-WH-01, FG-WH-01)',
    recordsSummary: '6,624 warehouse inventory lots, pallet staging, outbound loading bays',
    latencyMs: 54,
    status: 'CONNECTED',
    icon: Server,
    description: 'Raw material storage, packaging cartons, staging bays, and dispatch loading docks.',
    fields: [
      { key: 'wms_endpoint', label: 'Warehouse Gateway API', placeholder: 'https://wms.corp/api/v2', default: 'https://wms-hub.corp.internal/v2' },
      { key: 'facilities', label: 'Facility Codes', placeholder: 'RM-WH-01, WIP-WH-01, FG-WH-01', default: 'RM-WH-01, WIP-WH-01, FG-WH-01' },
      { key: 'dock_slotting', label: 'Outbound Staging Policy', placeholder: 'FIFO_PALLETIZED', default: 'FIFO_PALLETIZED' },
    ],
  },
  {
    id: 'blueyonder-tms',
    name: 'Blue Yonder TMS',
    category: 'Logistics, Carriers & Tracking',
    protocol: 'EDI 214/856 Transit Stream',
    endpointSummary: 'https://logistics-gw.blueyonder.corp/api / EDI_214_LIVE',
    recordsSummary: '1,000 carrier shipment milestones, transit delays, ETA variance telemetry',
    latencyMs: 68,
    status: 'CONNECTED',
    icon: Activity,
    description: 'Carrier contracts, EDI 214 shipment milestone feeds, route transit days, and vehicle assignments.',
    fields: [
      { key: 'tms_gateway', label: 'Carrier Gateway Endpoint', placeholder: 'https://tms.carrier-network.com', default: 'https://logistics-gw.blueyonder.corp/api' },
      { key: 'edi_feed', label: 'EDI 214/856 Service Feed', placeholder: 'EDI_STATUS_STREAM', default: 'EDI_214_MILESTONE_LIVE' },
      { key: 'webhook_secret', label: 'Tracking Webhook Secret', placeholder: 'whsec_...', default: 'whsec_tms_prod_sig_verified' },
    ],
  },
  {
    id: 'veeva-qms',
    name: 'Veeva / TrackVia QMS',
    category: 'Quality Certifications & Inspection',
    protocol: 'QMS Cloud Tenant API',
    endpointSummary: 'https://mfg360.quality-cloud.corp / QA-CENTRAL-LAB-01',
    recordsSummary: '16,000 inspection lots, quarantine holds, ISO quality compliance releases',
    latencyMs: 42,
    status: 'CONNECTED',
    icon: ShieldCheck,
    description: 'Incoming component inspection, quality hold releases, and ISO manufacturing certs.',
    fields: [
      { key: 'qms_tenant', label: 'QMS Cloud Tenant URL', placeholder: 'https://company.veeva.com', default: 'https://mfg360.quality-cloud.corp' },
      { key: 'lab_id', label: 'Quality Lab ID', placeholder: 'QA-LAB-NORTH', default: 'QA-CENTRAL-LAB-01' },
      { key: 'cert_feed', label: 'Inspection Release Feed', placeholder: 'QA_RELEASE_NOTIFY', default: 'QA_INSPECTION_AUTO_STREAM' },
    ],
  },
  {
    id: 'ptc-plm',
    name: 'PTC Windchill PLM',
    category: 'Engineering & Bill of Materials',
    protocol: 'PLM Vault Gateway (REV-C)',
    endpointSummary: 'https://windchill.engineering.corp / ASTER_SERIES_VAULT_2026',
    recordsSummary: 'Aster 15 / Pro engineering freeze audit, hardware BOM configuration check',
    latencyMs: 60,
    status: 'CONNECTED',
    icon: Layers,
    description: 'Active product BOM configurations, engineering revision approvals, and component lifecycles.',
    fields: [
      { key: 'plm_server', label: 'PLM Vault Server Host', placeholder: 'https://plm.engineering.corp', default: 'https://windchill.engineering.corp' },
      { key: 'vault_id', label: 'Product Vault ID', placeholder: 'MOBILE_PRODUCT_LINE', default: 'ASTER_SERIES_VAULT_2026' },
      { key: 'eco_status', label: 'Engineering Change Order Check', placeholder: 'ACTIVE_ONLY', default: 'AUTO_ENFORCE_ACTIVE_REV' },
    ],
  },
  {
    id: 'csv-batch',
    name: 'CSV / Flat-File Benchmark Importer',
    category: 'Direct Benchmark Dataset Files',
    protocol: 'Local CSV / Fast Storage',
    endpointSummary: 'data/benchmark/ (1,500 orders, 6,624 inventory rows)',
    recordsSummary: 'Direct raw dataset seeding engine for PostgreSQL database records',
    latencyMs: 18,
    status: 'READY',
    icon: FileSpreadsheet,
    description: 'Loads raw datasets from data/ folder into enterprise analytical business tables.',
    fields: [
      { key: 'data_dir', label: 'Source Directory Path', placeholder: 'data/', default: 'data/' },
      { key: 'encoding', label: 'File Character Encoding', placeholder: 'utf-8', default: 'utf-8' },
      { key: 'batch_chunk', label: 'Batch Chunk Size', placeholder: '500', default: '1000' },
    ],
  },
]

export default function Connectors() {
  // viewMode: 'list' (Connected DBs cards) or 'configure' (Add Connector & Data Sync form)
  const [viewMode, setViewMode] = useState('list')
  const [selectedConnectorId, setSelectedConnectorId] = useState('postgres-neon')
  const [fieldValues, setFieldValues] = useState({})

  // Action states
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [connectedNotice, setConnectedNotice] = useState('')

  const [seeding, setSeeding] = useState(false)
  const [seedReport, setSeedReport] = useState(null)

  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState(null)
  const [error, setError] = useState('')

  // Track ping test status per card in list view
  const [pingStatus, setPingStatus] = useState({})

  const currentPreset = CONNECTOR_PRESETS.find((c) => c.id === selectedConnectorId) || CONNECTOR_PRESETS[0]

  // Initialize field defaults when connector preset changes
  useEffect(() => {
    const defaults = {}
    currentPreset.fields.forEach((f) => {
      defaults[f.key] = f.default
    })
    setFieldValues(defaults)
    setTestResult(null)
    setConnectedNotice('')
  }, [selectedConnectorId])

  // Load live database record counts and connector status
  const {
    data: statusData = null,
    isLoading: loading,
    refetch: loadStatus,
  } = useQuery({
    queryKey: ['connectors-status'],
    queryFn: () => connectorsApi.getStatus(),
    staleTime: 60 * 1000,
  })

  const handleFieldChange = (key, val) => {
    setFieldValues((prev) => ({ ...prev, [key]: val }))
  }

  // 1. Test Connection
  const handleTestConnection = async () => {
    setTesting(true)
    setTestResult(null)
    setConnectedNotice('')
    try {
      const res = await connectorsApi.testConnection({
        connector_id: currentPreset.id,
        connector_name: currentPreset.name,
        params: fieldValues,
      })
      setTestResult(res)
    } catch (err) {
      setTestResult({
        success: false,
        status: 'UNREACHABLE',
        message: err.response?.data?.detail || err.message || 'Failed to test connection.',
      })
    } finally {
      setTesting(false)
    }
  }

  // Quick Ping in Card List
  const handleCardPing = async (preset) => {
    setPingStatus((prev) => ({ ...prev, [preset.id]: 'pinging' }))
    try {
      const res = await connectorsApi.testConnection({
        connector_id: preset.id,
        connector_name: preset.name,
      })
      setPingStatus((prev) => ({
        ...prev,
        [preset.id]: res.success ? `Reachable (${res.latency_ms || preset.latencyMs}ms)` : 'Error',
      }))
      setTimeout(() => {
        setPingStatus((prev) => ({ ...prev, [preset.id]: null }))
      }, 4000)
    } catch {
      setPingStatus((prev) => ({ ...prev, [preset.id]: 'Error' }))
      setTimeout(() => {
        setPingStatus((prev) => ({ ...prev, [preset.id]: null }))
      }, 4000)
    }
  }

  // 2. Connect System
  const handleConnect = async () => {
    setConnecting(true)
    setConnectedNotice('')
    try {
      const res = await connectorsApi.connect({
        connector_id: currentPreset.id,
        connector_name: currentPreset.name,
        connector_type: currentPreset.category,
        params: fieldValues,
      })
      setConnectedNotice(res.message || 'Connection established successfully.')
      await loadStatus()
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Connection failed.')
    } finally {
      setConnecting(false)
    }
  }

  // 3. Seed Database
  const handleSeedData = async () => {
    if (!window.confirm('Populate/re-seed benchmark dataset into the database? This will load orders, customers, inventory, and shipments.')) {
      return
    }
    setSeeding(true)
    setSeedReport(null)
    setError('')
    try {
      const res = await connectorsApi.seedData()
      setSeedReport(res)
      await loadStatus()
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Seeding failed.')
    } finally {
      setSeeding(false)
    }
  }

  // 4. Synchronize Data
  const handleSyncData = async () => {
    setSyncing(true)
    setSyncResult(null)
    setError('')
    try {
      const res = await connectorsApi.syncData()
      setSyncResult(res)
      await loadStatus()
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Data synchronization failed.')
    } finally {
      setSyncing(false)
    }
  }

  const openConfigureFor = (presetId) => {
    setSelectedConnectorId(presetId)
    setViewMode('configure')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="page-stack connectors-page" style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 60 }}>
      {/* =========================================================================
          VIEW 1: CONNECTED DATABASES & SOURCES CARDS VIEW
          ========================================================================= */}
      {viewMode === 'list' ? (
        <>
          {/* HEADER */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Connected Databases
                </h1>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={handleSyncData}
                  disabled={syncing}
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <RefreshCw size={15} className={syncing ? 'animate-spin' : ''} />
                  {syncing ? 'Synchronizing...' : 'Synchronize All Data'}
                </button>
                <button
                  type="button"
                  className="button button-primary glow-orange"
                  onClick={() => setViewMode('configure')}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}
                >
                  <Plus size={16} /> Add Connector
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              style={{
                padding: '14px 18px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #EF4444',
                borderRadius: 8,
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              <AlertTriangle size={18} />
              <div>{error}</div>
            </div>
          )}

          {/* TOP METRICS: CURRENT DATABASE RECORD COUNTS */}
          <section
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: 14,
            }}
          >
            {[
              { label: 'Customer Orders', count: statusData?.counts?.customer_orders, icon: Package, accent: 'var(--brand-purple)' },
              { label: 'Customers', count: statusData?.counts?.customers, icon: Building2, accent: 'var(--brand-blue)' },
              { label: 'Products', count: statusData?.counts?.products, icon: Layers, accent: 'var(--brand-orange)' },
              { label: 'Raw Inventory Items', count: statusData?.counts?.inventory_snapshots, icon: Database, accent: '#16A34A' },
              { label: 'Production Orders', count: statusData?.counts?.production_orders, icon: Cpu, accent: 'var(--brand-purple)' },
              { label: 'Shipment Milestones', count: statusData?.counts?.shipment_milestones, icon: Activity, accent: 'var(--brand-blue)' },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  style={{
                    background: 'var(--surface-hi)',
                    border: '1px solid var(--line)',
                    borderRadius: 10,
                    padding: '16px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {stat.label}
                    </span>
                    <Icon size={16} color={stat.accent} />
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    {stat.count != null ? formatNumber(stat.count) : '—'}
                  </div>
                </div>
              )
            })}
          </section>

          {/* CONNECTED DATABASES & INTEGRATIONS GRID */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Database size={18} color="var(--brand-purple)" />
                Connected Enterprise Databases &amp; External Feeds ({CONNECTOR_PRESETS.length} Active)
              </h2>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                PostgreSQL Operational Analytical Core
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: 16,
              }}
            >
              {CONNECTOR_PRESETS.map((preset) => {
                const Icon = preset.icon
                const currentPing = pingStatus[preset.id]

                return (
                  <div
                    key={preset.id}
                    className="card"
                    style={{
                      background: 'var(--surface-hi)',
                      border: '1px solid var(--line)',
                      borderRadius: 12,
                      padding: 20,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 14,
                      boxShadow: 'var(--shadow-card)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div>
                      {/* CARD TOP ROW */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 10,
                              background: 'var(--brand-purple-soft)',
                              color: 'var(--brand-purple)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Icon size={20} />
                          </div>
                          <div>
                            <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                              {preset.name}
                            </h3>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                              {preset.category}
                            </span>
                          </div>
                        </div>

                        <span
                          style={{
                            background: preset.status === 'ACTIVE' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(77, 142, 235, 0.12)',
                            color: preset.status === 'ACTIVE' ? '#16A34A' : '#4D8EEB',
                            border: `1px solid ${preset.status === 'ACTIVE' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(77, 142, 235, 0.3)'}`,
                            padding: '3px 8px',
                            borderRadius: 6,
                            fontSize: 10,
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              background: preset.status === 'ACTIVE' ? '#16A34A' : '#4D8EEB',
                            }}
                          />
                          {preset.status}
                        </span>
                      </div>

                      <p style={{ margin: '8px 0 12px', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {preset.description}
                      </p>

                      {/* PROTOCOL & ENDPOINT DETAILS */}
                      <div style={{ background: 'var(--kg-bg-2)', border: '1px solid var(--line)', borderRadius: 8, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
                        <div>
                          <strong style={{ color: 'var(--text-muted)', fontSize: 10 }}>PROTOCOL / ENDPOINT:</strong>
                          <div style={{ color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: 11, wordBreak: 'break-all' }}>
                            {preset.endpointSummary}
                          </div>
                        </div>
                        <div>
                          <strong style={{ color: 'var(--text-muted)', fontSize: 10 }}>MAPPED RECORDS:</strong>
                          <div style={{ color: 'var(--brand-purple)', fontWeight: 600 }}>
                            {preset.recordsSummary}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CARD FOOTER ACTIONS */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--line)' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Zap size={13} color="#F58A3A" />
                        <span>{preset.latencyMs}ms latency</span>
                      </div>

                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          type="button"
                          className="button button-secondary"
                          onClick={() => handleCardPing(preset)}
                          disabled={currentPing === 'pinging'}
                          style={{ fontSize: 11, padding: '4px 10px', minHeight: 28 }}
                        >
                          {currentPing === 'pinging' ? (
                            <RefreshCw size={12} className="animate-spin" />
                          ) : currentPing ? (
                            <span style={{ color: '#16A34A', fontWeight: 700 }}>{currentPing}</span>
                          ) : (
                            'Test Ping'
                          )}
                        </button>
                        <button
                          type="button"
                          className="button button-primary"
                          onClick={() => openConfigureFor(preset.id)}
                          style={{ fontSize: 11, padding: '4px 12px', minHeight: 28 }}
                        >
                          <Sliders size={12} /> Configure
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* CARD 9: ADD CONNECTOR INTERACTIVE TILE */}
              <div
                onClick={() => setViewMode('configure')}
                className="card"
                style={{
                  background: 'var(--kg-bg-2)',
                  border: '2px dashed var(--brand-purple)',
                  borderRadius: 12,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  minHeight: 260,
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: 'var(--brand-purple-soft)',
                    color: 'var(--brand-purple)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}
                >
                  <Plus size={24} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 4px', color: 'var(--text-primary)' }}>
                  Add Another Connector
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', maxWidth: 240, margin: '0 0 16px' }}>
                  Connect new ERP, MES, WMS, TMS, PLM databases, or custom REST webhooks.
                </p>
                <button
                  type="button"
                  className="button button-primary glow-orange"
                  onClick={(e) => {
                    e.stopPropagation()
                    setViewMode('configure')
                  }}
                  style={{ fontSize: 12 }}
                >
                  <Plug2 size={14} /> Open Configuration
                </button>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* =========================================================================
           VIEW 2: ADD CONNECTOR & DATA SYNC CONFIGURATION (SCREENSHOT VIEW)
           ========================================================================= */
        <>
          {/* HEADER WITH BACK BUTTON */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setViewMode('list')}
                style={{ fontSize: 12, padding: '4px 10px', minHeight: 28, display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <ArrowLeft size={14} /> Back to Connected Databases
              </button>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>Command Center</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--brand-purple)' }}>
                  <span className="eyebrow-dot" /> ENTERPRISE INTEGRATION HUB
                </div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
                  System Connectors &amp; Data Sync
                </h1>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <div
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid #16A34A',
                    borderRadius: 8,
                    padding: '6px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 12,
                    color: '#16A34A',
                    fontWeight: 700,
                  }}
                >
                  <Radio size={14} className="animate-pulse" />
                  Store: Connected (PostgreSQL / Neon)
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              style={{
                padding: '14px 18px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #EF4444',
                borderRadius: 8,
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              <AlertTriangle size={18} />
              <div>{error}</div>
            </div>
          )}

          {/* TOP METRICS: CURRENT DATABASE RECORD COUNTS */}
          <section
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: 14,
            }}
          >
            {[
              { label: 'Customer Orders', count: statusData?.counts?.customer_orders, icon: Package, accent: 'var(--brand-purple)' },
              { label: 'Customers', count: statusData?.counts?.customers, icon: Building2, accent: 'var(--brand-blue)' },
              { label: 'Products', count: statusData?.counts?.products, icon: Layers, accent: 'var(--brand-orange)' },
              { label: 'Raw Inventory Items', count: statusData?.counts?.inventory_snapshots, icon: Database, accent: '#16A34A' },
              { label: 'Production Orders', count: statusData?.counts?.production_orders, icon: Cpu, accent: 'var(--brand-purple)' },
              { label: 'Shipment Milestones', count: statusData?.counts?.shipment_milestones, icon: Activity, accent: 'var(--brand-blue)' },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  style={{
                    background: 'var(--surface-hi)',
                    border: '1px solid var(--line)',
                    borderRadius: 10,
                    padding: '16px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {stat.label}
                    </span>
                    <Icon size={16} color={stat.accent} />
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    {stat.count != null ? formatNumber(stat.count) : '—'}
                  </div>
                </div>
              )
            })}
          </section>

          {/* MAIN TWO-COLUMN WORKSPACE: LEFT = CONFIGURATION, RIGHT = ACTIONS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 20, alignItems: 'start' }}>
            {/* COLUMN 1: CONNECTOR SELECTION & CONFIGURATION */}
            <div className="card" style={{ padding: 24, background: 'var(--surface-hi)', border: '1px solid var(--line)', borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: 'var(--brand-purple-soft)',
                    color: 'var(--brand-purple)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Plug2 size={18} />
                </div>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    1. Select Connector
                  </h2>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>
                    Choose source integration or database protocol
                  </p>
                </div>
              </div>

              {/* DROPDOWN SELECTOR */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Source Connector Type *
                </label>
                <select
                  className="input"
                  value={selectedConnectorId}
                  onChange={(e) => setSelectedConnectorId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: 'var(--kg-bg-2)',
                    border: '1px solid var(--line)',
                    color: 'var(--text-primary)',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {CONNECTOR_PRESETS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — [{c.category}]
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  {currentPreset.description}
                </div>
              </div>

              {/* DYNAMIC FIELD INPUTS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Connection Parameters ({currentPreset.fields.length} required fields)
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                  {currentPreset.fields.map((field) => (
                    <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {field.label}
                      </label>
                      <input
                        className="input"
                        type="text"
                        placeholder={field.placeholder}
                        value={fieldValues[field.key] ?? ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 6,
                          background: 'var(--kg-bg-2)',
                          border: '1px solid var(--line)',
                          color: 'var(--text-primary)',
                          fontSize: 12,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* TEST RESULT FEEDBACK */}
              {testResult && (
                <div
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    background: testResult.success ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${testResult.success ? '#16A34A' : '#EF4444'}`,
                    color: testResult.success ? '#16A34A' : '#DC2626',
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {testResult.success ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                  <span>{testResult.message}</span>
                </div>
              )}

              {connectedNotice && (
                <div
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    background: 'rgba(34, 197, 94, 0.12)',
                    border: '1px solid #16A34A',
                    color: '#16A34A',
                    fontSize: 12,
                    fontWeight: 700,
                    marginBottom: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle2 size={16} />
                    <span>{connectedNotice}</span>
                  </div>
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => setViewMode('list')}
                    style={{ fontSize: 11, padding: '2px 8px' }}
                  >
                    View All &rarr;
                  </button>
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={handleTestConnection}
                  disabled={testing}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Zap size={14} />
                  {testing ? 'Testing Latency...' : 'Test Connection'}
                </button>
                <button
                  type="button"
                  className="button button-primary glow-orange"
                  onClick={handleConnect}
                  disabled={connecting}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
                >
                  <Plug2 size={14} />
                  {connecting ? 'Connecting...' : `Connect ${currentPreset.name.split(' ')[0]}`}
                </button>
              </div>
            </div>

            {/* COLUMN 2: SEEDING & SYNCHRONIZATION */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* CARD: SEEDING BENCHMARK DATA */}
              <div className="card" style={{ padding: 22, background: 'var(--surface-hi)', border: '1px solid var(--line)', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      background: 'rgba(245, 138, 58, 0.12)',
                      color: 'var(--brand-orange)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FileSpreadsheet size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                      Seed Manufacturing Datasets
                    </h3>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-secondary)' }}>
                      Load or re-seed the full benchmark datasets directly into PostgreSQL.
                    </p>
                  </div>
                </div>

                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 16px' }}>
                  Loads 1,500 customer orders, 6,624 raw inventory records, 450 production orders, and 1,000 shipment milestones into the analytical operational store.
                </p>

                <button
                  type="button"
                  className="button button-primary glow-orange"
                  onClick={handleSeedData}
                  disabled={seeding}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 700 }}
                >
                  <Database size={16} />
                  {seeding ? 'Seeding Benchmark Data...' : 'Seed Benchmark Data'}
                </button>

                {seedReport && (
                  <div style={{ marginTop: 14, padding: 12, background: 'var(--kg-bg-2)', border: '1px solid var(--line)', borderRadius: 8, fontSize: 11 }}>
                    <div style={{ color: '#16A34A', fontWeight: 700, marginBottom: 4 }}>
                      ✓ {seedReport.message || 'Seeding complete!'}
                    </div>
                    {seedReport.report && (
                      <div style={{ color: 'var(--text-muted)' }}>
                        Orders: {seedReport.report.fact_customer_order || 1500} · Inventory: {seedReport.report.fact_inventory_daily_snapshot || 6624} · Shipments: {seedReport.report.fact_shipment_milestone || 1000}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* CARD: LIVE SYNCHRONIZATION */}
              <div className="card" style={{ padding: 22, background: 'var(--surface-hi)', border: '1px solid var(--line)', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      background: 'rgba(77, 142, 235, 0.12)',
                      color: 'var(--brand-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <RefreshCw size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                      Synchronize Current System
                    </h3>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-secondary)' }}>
                      Run live monitoring cycle &amp; invalidate stale cache.
                    </p>
                  </div>
                </div>

                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 16px' }}>
                  Triggers Agent 3 background surveillance across active customer orders, refreshes delivery milestone tracking, and updates operational KPI caches.
                </p>

                <button
                  type="button"
                  className="button button-secondary"
                  onClick={handleSyncData}
                  disabled={syncing}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 700 }}
                >
                  <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
                  {syncing ? 'Synchronizing Systems...' : 'Synchronize System Data'}
                </button>

                {syncResult && (
                  <div style={{ marginTop: 14, padding: 12, background: 'var(--kg-bg-2)', border: '1px solid var(--line)', borderRadius: 8, fontSize: 11 }}>
                    <div style={{ color: '#16A34A', fontWeight: 700, marginBottom: 4 }}>
                      ✓ {syncResult.message || 'Synchronization complete!'}
                    </div>
                    {syncResult.monitoring_summary && (
                      <div style={{ color: 'var(--text-muted)' }}>
                        Assessed: {syncResult.monitoring_summary.assessed_orders} orders · Risks identified: {syncResult.monitoring_summary.identified_risks}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
