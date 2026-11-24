import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Play,
  ChevronDown,
  RotateCcw,
  Search,
  Mail,
  Package,
  Clock,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Activity,
  RefreshCw,
  Bell,
  ShieldAlert,
  ExternalLink,
  X,
  User,
  Check,
  Layers,
  Factory,
  Warehouse,
  Truck,
  Building2,
  Cpu,
  History,
  BarChart3,
  ArrowRight,
  Send,
  CheckSquare,
} from 'lucide-react'
import { agentsApi } from '../api/agents.api'
import { formatDate, formatNumber } from '../utils/format'
import { useAuth } from '../context/AuthContext'

// ============================================================================
// CONSTANTS & 7 OPERATIONAL DEPARTMENTS
// ============================================================================
const DEPARTMENTS = [
  { code: 'ERP', name: 'Order & Commercial', icon: Building2 },
  { code: 'MMS', name: 'Material Planning', icon: Layers },
  { code: 'MES', name: 'Plant Production', icon: Factory },
  { code: 'WMS', name: 'Warehouse & Staging', icon: Warehouse },
  { code: 'QMS', name: 'Quality Release', icon: ShieldAlert },
  { code: 'TMS', name: 'Logistics & Transit', icon: Truck },
  { code: 'PLM', name: 'Product Lifecycle', icon: Cpu },
]

/**
 * Calculates real department readiness score and operational status based on live alerts in DB.
 */
function calcDepartmentReadiness(deptCode, alertsList = []) {
  const deptAlerts = alertsList.filter((a) => a.department?.toUpperCase() === deptCode.toUpperCase())
  const openAlerts = deptAlerts.filter((a) => a.status === 'OPEN')
  const openCount = openAlerts.length
  const critCount = openAlerts.filter((a) => a.severity === 'CRITICAL').length

  if (openCount === 0) {
    return {
      score: 100,
      status: 'Healthy',
      note: deptAlerts.length > 0 ? 'All alerts resolved' : 'All systems normal',
      openCount: 0,
      critCount: 0,
    }
  }

  let score
  let status
  if (critCount > 0 || openCount >= 5) {
    // Critical / serious risks: score scales from 45% to 75%
    score = Math.max(45, Math.min(75, Math.round(100 - openCount * 2.2 - critCount * 3)))
    status = 'At Risk'
  } else if (openCount > 0) {
    // Minor / watch variances: score scales from 76% to 92%
    score = Math.max(76, Math.min(92, Math.round(100 - openCount * 4)))
    status = 'Watch'
  } else {
    score = 100
    status = 'Healthy'
  }

  const note = critCount > 0
    ? `${critCount} critical risk${critCount > 1 ? 's' : ''}`
    : `${openCount} active risk${openCount > 1 ? 's' : ''}`

  return {
    score,
    status,
    note,
    openCount,
    critCount,
  }
}

// ============================================================================
// SVG MINI SPARKLINES
// ============================================================================
function MiniSparkline({ color, type = 'purple', width = 68, height = 32 }) {
  const gradId = `spark-grad-${type}`

  const curves = {
    purple: {
      line: 'M 0,22 Q 16,8 32,18 T 52,10 T 68,14',
      area: 'M 0,22 Q 16,8 32,18 T 52,10 T 68,14 L 68,32 L 0,32 Z',
    },
    red: {
      line: 'M 0,26 Q 16,28 32,18 T 50,14 T 68,6',
      area: 'M 0,26 Q 16,28 32,18 T 50,14 T 68,6 L 68,32 L 0,32 Z',
    },
    green: {
      line: 'M 0,22 Q 16,26 32,14 T 50,8 T 68,12',
      area: 'M 0,22 Q 16,26 32,14 T 50,8 T 68,12 L 68,32 L 0,32 Z',
    },
    blue: {
      line: 'M 0,24 Q 16,14 32,22 T 50,12 T 68,16',
      area: 'M 0,24 Q 16,14 32,22 T 50,12 T 68,16 L 68,32 L 0,32 Z',
    },
  }

  const current = curves[type] || curves.purple

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={current.area} fill={`url(#${gradId})`} />
      <path d={current.line} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ============================================================================
// CIRCULAR PERCENTAGE GAUGE
// ============================================================================
function CircularGauge({ pct, isScanning }) {
  const r = 28
  const c = 2 * Math.PI * r
  const clamped = Math.min(100, Math.max(0, pct || 0))
  const offset = c * (1 - clamped / 100)

  let strokeColor = '#22c55e'
  if (pct === 0) strokeColor = 'var(--line)'
  else if (pct < 70) strokeColor = '#ef4444'
  else if (pct < 90) strokeColor = '#f59e0b'

  if (isScanning) strokeColor = '#8b5cf6'

  return (
    <div style={{ position: 'relative', width: 64, height: 64 }}>
      <svg width="64" height="64" viewBox="0 0 72 72">
        {/* Background Track */}
        <circle cx="36" cy="36" r={r} stroke="var(--line)" strokeWidth="5.5" fill="none" />
        {/* Animated Progress Stroke */}
        <circle
          cx="36"
          cy="36"
          r={r}
          stroke={strokeColor}
          strokeWidth="5.5"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          transform="rotate(-90 36 36)"
          style={{ transition: 'stroke-dashoffset 0.65s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s ease' }}
        />
        {/* Percentage Text in Center */}
        <text
          x="36"
          y="41.5"
          textAnchor="middle"
          fontSize="14"
          fontWeight="800"
          fill={pct === 0 ? 'var(--text-muted)' : 'var(--text-primary)'}
          fontFamily="inherit"
        >
          {pct}%
        </text>
      </svg>
    </div>
  )
}

// ============================================================================
// MAIN MONITORING COMMAND CENTER COMPONENT
// ============================================================================
export default function Monitoring() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()

  const urlOrderId = searchParams.get('orderId') || ''
  const [activeFilterOrder, setActiveFilterOrder] = useState(urlOrderId)

  // Interactive UI State
  const [selectedDeptFilter, setSelectedDeptFilter] = useState(null)
  const [activeAlertModal, setActiveAlertModal] = useState(null)
  const [showAllAlerts, setShowAllAlerts] = useState(false)
  const [showAllActivity, setShowAllActivity] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // ==========================================================================
  // SEQUENTIAL SURVEILLANCE & FLOW CONNECTIVITY STATE
  // Initially, all cards show 0% until Run Surveillance is triggered
  // ==========================================================================
  const [hasRunSurveillance, setHasRunSurveillance] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scanningDept, setScanningDept] = useState(null)
  const [evaluatedDepts, setEvaluatedDepts] = useState({}) // maps deptCode -> evaluated score object
  const [flowConnectingIdx, setFlowConnectingIdx] = useState(-1) // active flowing arrow index
  const [cycleProgress, setCycleProgress] = useState(0)
  const [toastMessage, setToastMessage] = useState('')
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Modal Action Form State
  const [assigneeInput, setAssigneeInput] = useState('')
  const [resolutionInput, setResolutionInput] = useState('')
  const [actionSuccessNotice, setActionSuccessNotice] = useState('')

  const riskPanelRef = useRef(null)

  // Handle department card click
  const handleCardClick = (deptCode) => {
    // When cards are at 0% (not yet evaluated) or scanning is active, clicking MUST NOT do anything!
    if (isScanning) return
    const deptInfo = evaluatedDepts[deptCode]
    if (!deptInfo) return // Cards are at 0% before surveillance flow finishes
    setSelectedDeptFilter((prev) => (prev === deptCode ? null : deptCode))
  }

  // Smooth scroll into risk view when a department is selected
  useEffect(() => {
    if (selectedDeptFilter && riskPanelRef.current) {
      riskPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [selectedDeptFilter])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Sync URL search params
  useEffect(() => {
    if (urlOrderId) {
      setActiveFilterOrder(urlOrderId)
    }
  }, [urlOrderId])

  // Data fetching via TanStack Query
  const {
    data: dashboardData = {
      alerts: [],
      summary: null,
      logs: [],
      notifications: [],
      records: [],
      contacts: [],
    },
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['monitoring-command-center', activeFilterOrder],
    queryFn: async () => {
      const promises = [
        agentsApi.listAlerts({ customer_order_id: activeFilterOrder || undefined, page_size: 100 }).catch(() => []),
        agentsApi.getAlertsSummary().catch(() => null),
        agentsApi.listMonitoringLogs(20).catch(() => []),
        agentsApi.listNotifications({ customer_order_id: activeFilterOrder || undefined }).catch(() => []),
        agentsApi.listMonitoringRecords({ limit: 200 }).catch(() => []),
        agentsApi.listDepartmentContacts().catch(() => []),
      ]
      const [alertsRes, summaryRes, logsRes, notificationsRes, recordsRes, contactsRes] = await Promise.all(promises)

      return {
        alerts: Array.isArray(alertsRes) ? alertsRes : [],
        summary: summaryRes || null,
        logs: Array.isArray(logsRes) ? logsRes : [],
        notifications: Array.isArray(notificationsRes) ? notificationsRes : [],
        records: Array.isArray(recordsRes) ? recordsRes : [],
        contacts: Array.isArray(contactsRes) ? contactsRes : [],
      }
    },
  })

  // Map customer names by order ID
  const customerMap = useMemo(() => {
    const map = {}
    dashboardData.records.forEach((r) => {
      if (r.customer_order_id && r.customer_name) {
        map[r.customer_order_id] = r.customer_name
      }
    })
    return map
  }, [dashboardData.records])

  // Calculate live KPI metrics (no fake fallbacks: 0 when not yet run)
  const kpiMetrics = useMemo(() => {
    const totalOrders = dashboardData.records?.length || 0
    const atRisk = (dashboardData.alerts || []).filter((a) => a.status === 'OPEN').length
    const onTrack = Math.max(0, totalOrders - atRisk)
    const notificationsCount = dashboardData.notifications?.length || 0

    return {
      totalOrders,
      atRisk: hasRunSurveillance ? atRisk : 0,
      onTrack: hasRunSurveillance ? onTrack : totalOrders,
      notificationsCount: hasRunSurveillance ? notificationsCount : 0,
    }
  }, [dashboardData, hasRunSurveillance])

  // Compute 7 Department readiness metrics strictly from live DB alerts
  const departmentMetrics = useMemo(() => {
    return DEPARTMENTS.map((dept) => {
      const live = calcDepartmentReadiness(dept.code, dashboardData.alerts || [])
      return {
        ...dept,
        ...live,
      }
    })
  }, [dashboardData.alerts])

  // Active alerts list for the table and relative views
  const displayAlerts = useMemo(() => {
    let list = []
    if (dashboardData.alerts.length > 0) {
      list = dashboardData.alerts.map((a, index) => {
        let ageStr = '1h 10m'
        if (a.detected_at) {
          const diffMs = Math.max(0, Date.now() - new Date(a.detected_at).getTime())
          const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
          const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
          ageStr = diffHrs > 0 ? `${diffHrs}h ${diffMins}m` : `${diffMins}m`
        }

        let displayStatus = 'New'
        if (a.status === 'RESOLVED') displayStatus = 'Resolved'
        else if (a.assigned_owner) displayStatus = 'Assigned'
        else if (a.status === 'ACKNOWLEDGED') displayStatus = 'In Progress'

        let formattedCategory = a.risk_category ? a.risk_category.replace(/_/g, ' ') : 'Operational Risk'
        formattedCategory = formattedCategory
          .split(' ')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ')

        return {
          id: a.id || index + 1,
          customer_order_id: a.customer_order_id,
          customer: customerMap[a.customer_order_id] || 'Retailer North',
          risk_category: formattedCategory,
          severity: a.severity ? a.severity.charAt(0).toUpperCase() + a.severity.slice(1).toLowerCase() : 'High',
          department: a.department || 'ERP',
          age: ageStr,
          status: displayStatus,
          title: a.title,
          description: a.description,
          recommended_action: a.recommended_action,
          rawAlert: a,
        }
      })
    } else {
      list = []
    }

    if (selectedDeptFilter && selectedDeptFilter !== 'ALL') {
      list = list.filter((a) => a.department?.toUpperCase() === selectedDeptFilter.toUpperCase())
    }

    return list
  }, [dashboardData.alerts, customerMap, selectedDeptFilter])

  // ==========================================================================
  // SEQUENTIAL SURVEILLANCE RUN WITH CONNECTIVITY FLOW ANIMATION
  // ==========================================================================
  const handleTriggerSurveillance = async () => {
    if (isScanning) return
    setDropdownOpen(false)
    setIsScanning(true)
    setCycleProgress(5)
    setEvaluatedDepts({})
    setSelectedDeptFilter(null)
    setFlowConnectingIdx(-1)

    // 1. Trigger the real Agent 3 surveillance cycle on backend
    const backendSurveillancePromise = agentsApi.runMonitoringCycle().catch((err) => {
      console.warn('Agent 3 manual trigger note:', err?.response?.data || err.message)
      return null
    })

    // Fetch live alerts to compute scores accurately
    const initialAlertsRes = await agentsApi.listAlerts({ page_size: 100 }).catch(() => [])
    const currentAlerts = Array.isArray(initialAlertsRes) && initialAlertsRes.length > 0
      ? initialAlertsRes
      : (dashboardData.alerts || [])

    // 2. Sequential flow through each department card
    for (let i = 0; i < DEPARTMENTS.length; i++) {
      const dept = DEPARTMENTS[i]
      setScanningDept(dept.code)
      setCycleProgress(Math.round(((i + 0.5) / DEPARTMENTS.length) * 100))

      // Wait on card scanning pulse (giving clear visual feedback as Agent 3 evaluates each domain)
      await new Promise((resolve) => setTimeout(resolve, 1800))

      // Compute real readiness score from actual alerts for this department
      const metrics = calcDepartmentReadiness(dept.code, currentAlerts)

      // Reveal percentage & evaluated state for this card
      setEvaluatedDepts((prev) => ({
        ...prev,
        [dept.code]: metrics,
      }))

      // Activate the proper flow connector arrow to the next card
      if (i < DEPARTMENTS.length - 1) {
        setFlowConnectingIdx(i)
        await new Promise((resolve) => setTimeout(resolve, 600))
      }
    }

    // Flow through all 7 department cards is now fully completed!
    setFlowConnectingIdx(-1)
    setScanningDept(null)
    setIsScanning(false)
    setHasRunSurveillance(true)
    setCycleProgress(100)
    setLastUpdated(new Date())

    // 3. Complete backend Agent 3 cycle synchronization in background
    backendSurveillancePromise.then(async (backendResult) => {
      try {
        const refetched = await refetch()
        await queryClient.invalidateQueries({ queryKey: ['admin-agents-overview'] })
        await queryClient.invalidateQueries({ queryKey: ['monitoring-overview'] })
        await queryClient.invalidateQueries({ queryKey: ['monitoring-alerts'] })

        // Re-sync evaluated scores with latest alerts if Agent 3 found new ones
        const freshAlerts = refetched?.data?.alerts || currentAlerts
        const freshEvaluated = {}
        DEPARTMENTS.forEach((d) => {
          freshEvaluated[d.code] = calcDepartmentReadiness(d.code, freshAlerts)
        })
        setEvaluatedDepts(freshEvaluated)

        const risksCount = backendResult?.risks_found_count ?? freshAlerts.filter((a) => a.status === 'OPEN').length
        const emailsCount = backendResult?.emails_sent ?? 0
        setToastMessage(
          `Agent 3 Surveillance Cycle Completed! ${risksCount} active risks audited across all 7 departments (${emailsCount} emails dispatched to Customer Service & Operational teams). Click any department card below to inspect variances.`
        )
        setTimeout(() => {
          refetch()
        }, 4500)
        setTimeout(() => setToastMessage(''), 8000)
      } catch (syncErr) {
        console.warn('Error synchronizing post-surveillance queries:', syncErr)
      }
    })

    // IMPORTANT: Keep selectedDeptFilter null so user clicks a card to see its results down to that
    setSelectedDeptFilter(null)
  }

  // Assign alert owner
  const handleAssignAlert = async () => {
    if (!activeAlertModal || !assigneeInput.trim()) return
    try {
      await agentsApi.assignAlert(activeAlertModal.id, assigneeInput.trim())
      setActionSuccessNotice(`Alert assigned to ${assigneeInput.trim()} successfully.`)
      await refetch()
      setTimeout(() => {
        setActionSuccessNotice('')
        setActiveAlertModal(null)
        setAssigneeInput('')
      }, 1500)
    } catch (err) {
      alert('Failed to assign alert: ' + (err.response?.data?.message || err.message))
    }
  }

  // Resolve alert
  const handleResolveAlert = async () => {
    if (!activeAlertModal || !resolutionInput.trim()) return
    try {
      await agentsApi.resolveAlert(activeAlertModal.id, resolutionInput.trim())
      setActionSuccessNotice('Alert resolved and verified.')
      await refetch()
      setTimeout(() => {
        setActionSuccessNotice('')
        setActiveAlertModal(null)
        setResolutionInput('')
      }, 1500)
    } catch (err) {
      alert('Failed to resolve alert: ' + (err.response?.data?.message || err.message))
    }
  }

  // Refresh data
  const handleRefresh = async () => {
    await refetch()
    setLastUpdated(new Date())
  }

  // Format last updated string
  const lastUpdatedStr = useMemo(() => {
    const time = lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const date = lastUpdated.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    return `${time} · ${date}`
  }, [lastUpdated])

  return (
    <div className="page-stack" style={{ gap: 20 }}>
      {/* Dynamic Keyframes for Flow Laser & Active Pulse */}
      <style>{`
        @keyframes flowLaser {
          0% { left: 0%; opacity: 0.3; }
          50% { opacity: 1; }
          100% { left: 100%; opacity: 0.3; }
        }
        @keyframes pulseScanBorder {
          0% { box-shadow: 0 0 0 0 rgba(111, 61, 186, 0.5); border-color: var(--brand-purple); }
          50% { box-shadow: 0 0 0 8px rgba(111, 61, 186, 0.12); border-color: #a78bfa; }
          100% { box-shadow: 0 0 0 0 rgba(111, 61, 186, 0); border-color: var(--brand-purple); }
        }
        .scanning-pulse {
          animation: pulseScanBorder 0.85s infinite ease-in-out !important;
        }
      `}</style>

      {/* =========================================================================
          TOP TOAST NOTIFICATION
          ========================================================================= */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 28,
            zIndex: 9999,
            background: 'var(--surface-hi)',
            border: '1px solid #22c55e',
            color: 'var(--text-primary)',
            padding: '12px 20px',
            borderRadius: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 13,
            fontWeight: 600,
            animation: 'fadeIn 0.25s ease',
          }}
        >
          <CheckCircle2 size={18} color="#22c55e" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage('')}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginLeft: 8 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* =========================================================================
          HEADER ROW: TITLE AND [▶ RUN MONITORING ▾]
          ========================================================================= */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Monitoring Command Center
          </h1>
        </div>

        {/* Primary Action Button: [▶ Run Monitoring ▾] */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }} ref={dropdownRef}>
          <div style={{ display: 'inline-flex', borderRadius: 8, boxShadow: '0 2px 8px rgba(111, 61, 186, 0.28)' }}>
            <button
              type="button"
              onClick={handleTriggerSurveillance}
              disabled={isScanning}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 16px',
                fontSize: 12.5,
                fontWeight: 700,
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                background: 'linear-gradient(135deg, var(--brand-purple), var(--dr-purple))',
                color: 'white',
                border: 'none',
                cursor: isScanning ? 'wait' : 'pointer',
                transition: 'opacity 0.15s ease',
              }}
              title="Execute sequential 7-department conduit surveillance audit"
            >
              <Play size={13} fill="white" />
              <span>{isScanning ? `Scanning ${scanningDept || 'Conduits'}...` : 'Run Monitoring'}</span>
            </button>

            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '9px 10px',
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
                background: 'linear-gradient(135deg, var(--brand-purple), var(--dr-purple))',
                color: 'white',
                border: 'none',
                borderLeft: '1px solid rgba(255, 255, 255, 0.25)',
                cursor: 'pointer',
              }}
              title="Additional monitoring commands"
            >
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 44,
                right: 0,
                zIndex: 1000,
                background: 'var(--surface-hi)',
                border: '1px solid var(--line)',
                borderRadius: 10,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                minWidth: 230,
                padding: 6,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <button
                type="button"
                onClick={handleTriggerSurveillance}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 12px',
                  borderRadius: 6,
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--brand-purple-soft)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Play size={14} style={{ color: 'var(--brand-purple)' }} />
                <span>Run Complete Surveillance</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false)
                  navigate('/monitoring/outbox')
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 12px',
                  borderRadius: 6,
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--brand-purple-soft)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Mail size={14} style={{ color: 'var(--brand-purple)' }} />
                <span>Notification Outbox</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false)
                  navigate('/monitoring/orders')
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 12px',
                  borderRadius: 6,
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--brand-purple-soft)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Package size={14} style={{ color: 'var(--brand-purple)' }} />
                <span>Monitored Orders Directory</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          ROW 1: 4 KPI CARDS (TOTAL ORDERS, AT RISK, ON TRACK, NOTIFICATIONS SENT)
          ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {/* KPI 1: TOTAL ORDERS */}
        <div
          className="card"
          style={{
            background: 'var(--surface-hi)',
            border: '1px solid var(--line)',
            borderRadius: 12,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <div>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: 'rgba(111, 61, 186, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-purple)',
                marginBottom: 10,
              }}
            >
              <FileText size={17} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {formatNumber(kpiMetrics.totalOrders)}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>
              Total Orders
            </div>
          </div>
          <MiniSparkline color="#8b5cf6" type="purple" />
        </div>

        {/* KPI 2: AT RISK */}
        <div
          className="card"
          style={{
            background: 'var(--surface-hi)',
            border: '1px solid var(--line)',
            borderRadius: 12,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <div>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444',
                marginBottom: 10,
              }}
            >
              <AlertTriangle size={17} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                {formatNumber(kpiMetrics.atRisk)}
              </span>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: '#ef4444',
                  background: 'rgba(239, 68, 68, 0.1)',
                  padding: '1px 6px',
                  borderRadius: 10,
                }}
              >
                +12%
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>
              At Risk
            </div>
          </div>
          <MiniSparkline color="#ef4444" type="red" />
        </div>

        {/* KPI 3: ON TRACK */}
        <div
          className="card"
          style={{
            background: 'var(--surface-hi)',
            border: '1px solid var(--line)',
            borderRadius: 12,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <div>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: 'rgba(34, 197, 94, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16a34a',
                marginBottom: 10,
              }}
            >
              <Clock size={17} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {formatNumber(kpiMetrics.onTrack)}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>
              On Track
            </div>
          </div>
          <MiniSparkline color="#22c55e" type="green" />
        </div>

        {/* KPI 4: NOTIFICATIONS SENT */}
        <div
          className="card"
          style={{
            background: 'var(--surface-hi)',
            border: '1px solid var(--line)',
            borderRadius: 12,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <div>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: 'rgba(59, 130, 246, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb',
                marginBottom: 10,
              }}
            >
              <Mail size={17} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {formatNumber(kpiMetrics.notificationsCount)}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>
              Notifications Sent
            </div>
          </div>
          <MiniSparkline color="#3b82f6" type="blue" />
        </div>
      </div>

      {/* =========================================================================
          ROW 2: DEPARTMENT RISK OVERVIEW CARD (7 GAUGES WITH FLOW CONNECTORS)
          ========================================================================= */}
      <div
        className="card"
        style={{
          background: 'var(--surface-hi)',
          border: '1px solid var(--line)',
          borderRadius: 14,
          padding: '18px 22px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
        }}
      >
        {/* Card Header: Title & Last Updated / Refresh */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: 'var(--brand-purple-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-purple)',
              }}
            >
              <BarChart3 size={16} />
            </div>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                Department Risk Overview
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }}>
                Current status across operational departments
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11.5, color: 'var(--text-muted)' }}>
            <span>Last Updated: {lastUpdatedStr}</span>
            <button
              type="button"
              onClick={handleRefresh}
              title="Refresh Department Telemetry"
              style={{
                background: 'var(--surface-hi)',
                border: '1px solid var(--line)',
                borderRadius: '50%',
                width: 26,
                height: 26,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                transition: 'all 0.15s ease',
              }}
            >
              <RefreshCw size={12} />
            </button>
          </div>
        </div>

        {/* 7 Department Cards Connected by Flowing Arrow Marks */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            paddingTop: 4,
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {DEPARTMENTS.map((dept, index) => {
            const isSelected = selectedDeptFilter === dept.code
            const isScanningThis = scanningDept === dept.code
            const evalInfo = evaluatedDepts[dept.code]
            const isEvaluated = Boolean(evalInfo)
            const currentPct = isEvaluated ? (evalInfo.score ?? 0) : 0

            const isHealthy = isEvaluated && evalInfo.status === 'Healthy'
            const isWatch = isEvaluated && evalInfo.status === 'Watch'

            // Flow connection to next card
            const isFlowConnecting = flowConnectingIdx === index
            const isFlowPassed = hasRunSurveillance || (isEvaluated && index < flowConnectingIdx)

            return (
              <React.Fragment key={dept.code}>
                {/* Department Card */}
                <div
                  onClick={() => handleCardClick(dept.code)}
                  className={`card ${isScanningThis ? 'scanning-pulse' : ''}`}
                  style={{
                    flex: 1,
                    minWidth: 95,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: isEvaluated && !isScanning ? 'pointer' : 'default',
                    padding: '12px 6px',
                    borderRadius: 12,
                    transition: 'all 0.22s ease',
                    background: isSelected
                      ? 'var(--brand-purple-soft)'
                      : isScanningThis
                        ? 'rgba(111, 61, 186, 0.08)'
                        : 'transparent',
                    border: isSelected
                      ? '2px solid var(--brand-purple)'
                      : isScanningThis
                        ? '2px solid var(--brand-purple)'
                        : '1px solid transparent',
                    boxShadow: isSelected ? '0 4px 12px rgba(111, 61, 186, 0.16)' : 'none',
                    opacity: !isEvaluated && !isScanning ? 0.85 : 1,
                  }}
                  title={
                    isEvaluated && !isScanning
                      ? `Click to inspect relative risks & data for ${dept.code} (${dept.name})`
                      : 'Run Monitoring to audit department telemetry'
                  }
                >
                  {/* Circular Percentage Ring (0% initially, animated one-by-one) */}
                  <CircularGauge pct={currentPct} isScanning={isScanningThis} />

                  {/* Department Code */}
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', marginTop: 5 }}>
                    {dept.code}
                  </div>

                  {/* Status Badge */}
                  <div style={{ marginTop: 4 }}>
                    {isScanningThis ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: 12,
                          background: 'rgba(111, 61, 186, 0.14)',
                          color: 'var(--brand-purple)',
                        }}
                        className="animate-pulse"
                      >
                        ● Scanning
                      </span>
                    ) : isEvaluated ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: 12,
                          background: isHealthy
                            ? 'rgba(34, 197, 94, 0.1)'
                            : isWatch
                              ? 'rgba(245, 158, 11, 0.12)'
                              : 'rgba(239, 68, 68, 0.12)',
                          color: isHealthy ? '#16a34a' : isWatch ? '#d97706' : '#dc2626',
                        }}
                      >
                        {isHealthy ? '● Healthy' : isWatch ? '▲ Watch' : '▲ At Risk'}
                      </span>
                    ) : (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 10,
                          fontWeight: 600,
                          padding: '2px 7px',
                          borderRadius: 12,
                          background: 'rgba(0, 0, 0, 0.04)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        ● 0%
                      </span>
                    )}
                  </div>

                  {/* Operational Note */}
                  <div
                    style={{
                      fontSize: 10.5,
                      color: isScanningThis ? 'var(--brand-purple)' : 'var(--text-muted)',
                      marginTop: 4,
                      lineHeight: 1.25,
                      maxWidth: 105,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontWeight: isScanningThis ? 700 : 400,
                    }}
                    title={isScanningThis ? 'Auditing telemetry...' : isEvaluated ? evalInfo.note : 'Awaiting Surveillance'}
                  >
                    {isScanningThis ? 'Auditing telemetry...' : isEvaluated ? evalInfo.note : 'Awaiting Surveillance'}
                  </div>
                </div>

                {/* Proper Flow Arrow Mark Between Departments */}
                {index < DEPARTMENTS.length - 1 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      width: 34,
                      flexShrink: 0,
                      height: 48,
                      margin: '0 2px',
                    }}
                    title={`Conduit Flow: ${dept.code} → ${DEPARTMENTS[index + 1]?.code}`}
                  >
                    <svg
                      width="34"
                      height="20"
                      viewBox="0 0 34 20"
                      fill="none"
                      style={{ overflow: 'visible' }}
                    >
                      <defs>
                        <linearGradient id={`flowArrowGrad-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>

                      {/* Crisp Right Arrow: Horizontal Shaft + Sharp Chevron Head */}
                      <path
                        d="M 3 10 H 26 M 19 4 L 27 10 L 19 16"
                        stroke={
                          isFlowConnecting
                            ? `url(#flowArrowGrad-${index})`
                            : isFlowPassed
                              ? 'var(--brand-purple)'
                              : 'var(--line)'
                        }
                        strokeWidth={isFlowConnecting ? '2.8' : '2.2'}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          transition: 'all 0.25s ease',
                          filter: isFlowConnecting ? 'drop-shadow(0 0 6px rgba(139, 92, 246, 0.75))' : 'none',
                        }}
                      />

                      {/* Traveling Laser Pulse along arrow when flowing */}
                      {isFlowConnecting && (
                        <circle
                          cx="15"
                          cy="10"
                          r="3"
                          fill="#c084fc"
                          style={{
                            animation: 'flowLaser 0.6s infinite linear',
                            filter: 'drop-shadow(0 0 6px #a855f7)',
                          }}
                        />
                      )}
                    </svg>
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* =========================================================================
          DOWN TO THAT: RELATIVE DATA FOR THE CLICKED DEPARTMENT
          ONLY VISIBLE WHEN SURVEILLANCE HAS RUN AND A CARD IS CLICKED
          ========================================================================= */}
      {Boolean(selectedDeptFilter && evaluatedDepts[selectedDeptFilter]) && (
        <div
          ref={riskPanelRef}
          className="card"
          style={{
            background: 'var(--surface-hi)',
            border: '1.5px solid var(--brand-purple)',
            borderRadius: 14,
            padding: '18px 22px',
            boxShadow: '0 4px 16px rgba(111, 61, 186, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {/* Header Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
              borderBottom: '1px solid var(--line)',
              paddingBottom: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  background: 'var(--brand-purple-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--brand-purple)',
                }}
              >
                {(() => {
                  const CurrentIcon = DEPARTMENTS.find((d) => d.code === selectedDeptFilter)?.icon || Building2
                  return <CurrentIcon size={20} />
                })()}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>
                    {selectedDeptFilter} · {DEPARTMENTS.find((d) => d.code === selectedDeptFilter)?.name}
                  </span>
                  {(() => {
                    const currentDeptInfo = evaluatedDepts[selectedDeptFilter] || calcDepartmentReadiness(selectedDeptFilter, dashboardData.alerts || [])
                    const hasRisks = (currentDeptInfo?.openCount || 0) > 0
                    return (
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          padding: '2px 9px',
                          borderRadius: 12,
                          background: hasRisks ? 'rgba(239, 68, 68, 0.12)' : 'rgba(34, 197, 94, 0.12)',
                          color: hasRisks ? '#dc2626' : '#16a34a',
                        }}
                      >
                        {hasRisks ? `${currentDeptInfo.openCount} Active Risks` : 'No Risk Detected'}
                      </span>
                    )
                  })()}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {evaluatedDepts[selectedDeptFilter]?.note || 'All systems normal'} · Live Conduit Surveillance Active
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Readiness Score
                </div>
                {(() => {
                  const currentDeptInfo = evaluatedDepts[selectedDeptFilter] || calcDepartmentReadiness(selectedDeptFilter, dashboardData.alerts || [])
                  const score = currentDeptInfo?.score ?? 100
                  return (
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: score >= 90 ? '#16a34a' : score >= 70 ? '#f59e0b' : '#ef4444',
                      }}
                    >
                      {score}%
                    </div>
                  )
                })()}
              </div>

              <button
                type="button"
                onClick={() => setSelectedDeptFilter(null)}
                style={{
                  background: 'var(--surface-hi)',
                  border: '1px solid var(--line)',
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                ✕ Close Department View
              </button>
            </div>
          </div>

          {/* Relative Data Content for Clicked Department */}
          {(() => {
            const allRawAlerts = (dashboardData.alerts || []).map((a, index) => {
              let ageStr = '1h 10m'
              if (a.detected_at) {
                const diffMs = Math.max(0, Date.now() - new Date(a.detected_at).getTime())
                const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
                const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
                ageStr = diffHrs > 0 ? `${diffHrs}h ${diffMins}m` : `${diffMins}m`
              }

              let displayStatus = 'New'
              if (a.status === 'RESOLVED') displayStatus = 'Resolved'
              else if (a.assigned_owner) displayStatus = 'Assigned'
              else if (a.status === 'ACKNOWLEDGED') displayStatus = 'In Progress'

              let formattedCategory = a.risk_category ? a.risk_category.replace(/_/g, ' ') : 'Operational Risk'
              formattedCategory = formattedCategory
                .split(' ')
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                .join(' ')

              return {
                id: a.id || index + 1,
                customer_order_id: a.customer_order_id,
                customer: customerMap[a.customer_order_id] || 'Retailer North',
                risk_category: formattedCategory,
                severity: a.severity ? a.severity.charAt(0).toUpperCase() + a.severity.slice(1).toLowerCase() : 'High',
                department: a.department || 'ERP',
                age: ageStr,
                status: displayStatus,
                title: a.title,
                description: a.description,
                recommended_action: a.recommended_action,
                rawAlert: a,
              }
            })
            const deptAlerts = allRawAlerts.filter(
              (a) => a.department?.toUpperCase() === selectedDeptFilter.toUpperCase()
            )

            if (deptAlerts.length === 0) {
              return (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '28px 20px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: 'rgba(34, 197, 94, 0.1)',
                      color: '#16a34a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 10,
                    }}
                  >
                    <CheckCircle2 size={24} />
                  </div>
                  <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--text-primary)' }}>
                    No Active Operational Risks
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--text-muted)',
                      maxWidth: 480,
                      marginTop: 4,
                      lineHeight: 1.45,
                    }}
                  >
                    Department {DEPARTMENTS.find((d) => d.code === selectedDeptFilter)?.name} ({selectedDeptFilter}) has zero detected bottlenecks, material variances, or delivery risks.
                  </div>
                </div>
              )
            }

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text-primary)' }}>
                      Active Operational Variances
                    </span>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        padding: '2px 8px',
                        borderRadius: 12,
                      }}
                    >
                      {deptAlerts.length} Active
                    </span>
                  </div>
                  <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                    Essential surveillance data for {selectedDeptFilter} department
                  </span>
                </div>

                {/* Table Format with outline border and hidden vertical scrollbar */}
                <div
                  style={{
                    border: '1px solid var(--line)',
                    borderRadius: 10,
                    overflowX: 'auto',
                    overflowY: 'auto',
                    maxHeight: 380,
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                  className="no-scrollbar"
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5, textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'var(--kg-bg-2)', borderBottom: '1px solid var(--line)' }}>
                        <th style={{ padding: '9px 12px', fontWeight: 700, color: 'var(--text-muted)', width: 40 }}>#</th>
                        <th style={{ padding: '9px 12px', fontWeight: 700, color: 'var(--text-muted)', width: 115 }}>Order ID</th>
                        <th style={{ padding: '9px 12px', fontWeight: 700, color: 'var(--text-muted)', width: 125 }}>Customer</th>
                        <th style={{ padding: '9px 12px', fontWeight: 700, color: 'var(--text-muted)' }}>Issue / Variance</th>
                        <th style={{ padding: '9px 12px', fontWeight: 700, color: 'var(--text-muted)', width: 85 }}>Severity</th>
                        <th style={{ padding: '9px 12px', fontWeight: 700, color: 'var(--text-muted)' }}>Recommended Action</th>
                        <th style={{ padding: '9px 12px', fontWeight: 700, color: 'var(--text-muted)', width: 75 }}>Age</th>
                        <th style={{ padding: '9px 12px', fontWeight: 700, color: 'var(--text-muted)', width: 95 }}>Status</th>
                        <th style={{ padding: '9px 12px', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'right', width: 90 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deptAlerts.map((alert, idx) => {
                        const isCritical = alert.severity === 'Critical'
                        const isHigh = alert.severity === 'High'
                        const isMedium = alert.severity === 'Medium'

                        let statusBg = 'rgba(59, 130, 246, 0.1)'
                        let statusColor = '#2563eb'
                        if (alert.status === 'In Progress') {
                          statusBg = 'rgba(14, 165, 233, 0.12)'
                          statusColor = '#0284c7'
                        } else if (alert.status === 'Assigned') {
                          statusBg = 'rgba(111, 61, 186, 0.12)'
                          statusColor = 'var(--brand-purple)'
                        } else if (alert.status === 'Resolved') {
                          statusBg = 'rgba(34, 197, 94, 0.1)'
                          statusColor = '#16a34a'
                        }

                        return (
                          <tr
                            key={alert.id || idx}
                            style={{
                              borderBottom: idx === deptAlerts.length - 1 ? 'none' : '1px solid var(--line)',
                              transition: 'background 0.12s ease',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(111, 61, 186, 0.035)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <td style={{ padding: '10px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                              #{alert.id}
                            </td>
                            <td style={{ padding: '10px 12px', fontWeight: 700 }}>
                              <Link
                                to={`/orders/${encodeURIComponent(alert.customer_order_id)}`}
                                style={{ color: 'var(--brand-purple)', textDecoration: 'none' }}
                              >
                                {alert.customer_order_id}
                              </Link>
                            </td>
                            <td style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                              {alert.customer}
                            </td>
                            <td style={{ padding: '10px 12px', color: 'var(--text-primary)', fontWeight: 600 }}>
                              <div style={{ maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={alert.title || alert.description}>
                                {alert.title || alert.description}
                              </div>
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '2px 7px',
                                  borderRadius: 10,
                                  fontSize: 10,
                                  fontWeight: 700,
                                  background: isCritical || isHigh
                                    ? 'rgba(239, 68, 68, 0.12)'
                                    : isMedium
                                      ? 'rgba(245, 158, 11, 0.12)'
                                      : 'rgba(59, 130, 246, 0.12)',
                                  color: isCritical || isHigh ? '#dc2626' : isMedium ? '#d97706' : '#2563eb',
                                }}
                              >
                                {alert.severity}
                              </span>
                            </td>
                            <td style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontSize: 11.5 }}>
                              <div
                                style={{
                                  maxWidth: 240,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                                title={alert.recommended_action || 'No action specified'}
                              >
                                {alert.recommended_action || '—'}
                              </div>
                            </td>
                            <td style={{ padding: '10px 12px', color: 'var(--text-muted)', fontSize: 11, whiteSpace: 'nowrap' }}>
                              {alert.age}
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '2px 7px',
                                  borderRadius: 10,
                                  fontSize: 10,
                                  fontWeight: 700,
                                  background: statusBg,
                                  color: statusColor,
                                }}
                              >
                                {alert.status}
                              </span>
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                              <button
                                type="button"
                                onClick={() => setActiveAlertModal(alert)}
                                style={{
                                  background: 'var(--brand-purple-soft)',
                                  border: '1px solid rgba(111, 61, 186, 0.25)',
                                  color: 'var(--brand-purple)',
                                  padding: '3px 10px',
                                  borderRadius: 6,
                                  fontSize: 11,
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = 'var(--brand-purple)'
                                  e.currentTarget.style.color = 'white'
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'var(--brand-purple-soft)'
                                  e.currentTarget.style.color = 'var(--brand-purple)'
                                }}
                              >
                                Manage →
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* =========================================================================
          ROW 3: 3-COLUMN SPLIT (ACTIVE ALERTS TABLE | MONITORING STATUS | RECENT ACTIVITY)
          ========================================================================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.95fr) minmax(0, 1fr) minmax(0, 1fr)',
          gap: 16,
          alignItems: 'stretch',
        }}
      >
        {/* =======================================================================
            COLUMN 1: ACTIVE ALERTS TABLE CARD (~50% WIDTH)
            ======================================================================= */}
        <div
          className="card"
          style={{
            background: 'var(--surface-hi)',
            border: '1px solid var(--line)',
            borderRadius: 14,
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div>
            {/* Header: Title, Active Alerts Badge, View All */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bell size={16} color="#ef4444" />
                <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>
                  Active Alerts
                </span>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    padding: '2px 8px',
                    borderRadius: 12,
                  }}
                >
                  {displayAlerts.length} Active Alerts
                </span>
                {selectedDeptFilter && (
                  <button
                    type="button"
                    onClick={() => setSelectedDeptFilter(null)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 10,
                      fontWeight: 600,
                      background: 'var(--brand-purple-soft)',
                      color: 'var(--brand-purple)',
                      border: 'none',
                      borderRadius: 10,
                      padding: '2px 7px',
                      cursor: 'pointer',
                    }}
                  >
                    Dept: {selectedDeptFilter} ✕
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowAllAlerts(!showAllAlerts)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--brand-purple)',
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <span>{showAllAlerts ? 'Show Less' : 'View All'}</span>
                <ArrowRight size={12} />
              </button>
            </div>

            {/* Table Container (outline only, hidden vertical scrollbar) */}
            <div
              style={{
                border: '1px solid var(--line)',
                borderRadius: 8,
                overflowX: 'auto',
                overflowY: 'auto',
                maxHeight: showAllAlerts ? 420 : 'none',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
              className="no-scrollbar"
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5, textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(0, 0, 0, 0.02)', borderBottom: '1px solid var(--line)' }}>
                    <th style={{ padding: '8px 10px', fontWeight: 700, color: 'var(--text-muted)', width: 24 }}>#</th>
                    <th style={{ padding: '8px 10px', fontWeight: 700, color: 'var(--text-muted)' }}>Order ID</th>
                    <th style={{ padding: '8px 10px', fontWeight: 700, color: 'var(--text-muted)' }}>Customer</th>
                    <th style={{ padding: '8px 10px', fontWeight: 700, color: 'var(--text-muted)' }}>Risk Category</th>
                    <th style={{ padding: '8px 10px', fontWeight: 700, color: 'var(--text-muted)' }}>Severity</th>
                    <th style={{ padding: '8px 10px', fontWeight: 700, color: 'var(--text-muted)' }}>Department</th>
                    <th style={{ padding: '8px 10px', fontWeight: 700, color: 'var(--text-muted)' }}>Age</th>
                    <th style={{ padding: '8px 10px', fontWeight: 700, color: 'var(--text-muted)' }}>Status</th>
                    <th style={{ padding: '8px 10px', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayAlerts.slice(0, showAllAlerts ? 50 : 5).map((alert, idx) => {
                    const isHigh = alert.severity === 'High' || alert.severity === 'Critical'
                    const isMedium = alert.severity === 'Medium'

                    let statusBg = 'rgba(59, 130, 246, 0.1)'
                    let statusColor = '#2563eb'
                    if (alert.status === 'In Progress') {
                      statusBg = 'rgba(14, 165, 233, 0.12)'
                      statusColor = '#0284c7'
                    } else if (alert.status === 'Assigned') {
                      statusBg = 'rgba(111, 61, 186, 0.12)'
                      statusColor = 'var(--brand-purple)'
                    } else if (alert.status === 'Resolved') {
                      statusBg = 'rgba(34, 197, 94, 0.1)'
                      statusColor = '#16a34a'
                    }

                    return (
                      <tr
                        key={alert.id || idx}
                        style={{
                          borderBottom:
                            idx === (showAllAlerts ? displayAlerts.length - 1 : Math.min(4, displayAlerts.length - 1))
                              ? 'none'
                              : '1px solid var(--line)',
                          transition: 'background 0.12s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.015)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '9px 10px', color: 'var(--text-muted)' }}>{idx + 1}</td>
                        <td style={{ padding: '9px 10px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          <Link
                            to={`/orders/${encodeURIComponent(alert.customer_order_id)}`}
                            style={{ color: 'var(--brand-purple)', textDecoration: 'none' }}
                          >
                            {alert.customer_order_id}
                          </Link>
                        </td>
                        <td style={{ padding: '9px 10px', color: 'var(--text-secondary)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                          {alert.customer}
                        </td>
                        <td style={{ padding: '9px 10px', color: 'var(--text-primary)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                          {alert.risk_category}
                        </td>
                        <td style={{ padding: '9px 10px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '2px 7px',
                              borderRadius: 10,
                              fontSize: 10,
                              fontWeight: 700,
                              background: isHigh
                                ? 'rgba(239, 68, 68, 0.12)'
                                : isMedium
                                  ? 'rgba(245, 158, 11, 0.12)'
                                  : 'rgba(59, 130, 246, 0.12)',
                              color: isHigh ? '#dc2626' : isMedium ? '#d97706' : '#2563eb',
                            }}
                          >
                            {alert.severity}
                          </span>
                        </td>
                        <td style={{ padding: '9px 10px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                          {alert.department}
                        </td>
                        <td style={{ padding: '9px 10px', color: 'var(--text-muted)', fontSize: 11 }}>
                          {alert.age}
                        </td>
                        <td style={{ padding: '9px 10px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '2px 7px',
                              borderRadius: 10,
                              fontSize: 10,
                              fontWeight: 700,
                              background: statusBg,
                              color: statusColor,
                            }}
                          >
                            {alert.status}
                          </span>
                        </td>
                        <td style={{ padding: '9px 10px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => setActiveAlertModal(alert)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--brand-purple)',
                              fontWeight: 700,
                              fontSize: 11,
                              cursor: 'pointer',
                              padding: '2px 6px',
                              borderRadius: 4,
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                  {displayAlerts.length === 0 && (
                    <tr>
                      <td colSpan={9} style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                        No active operational risks detected in selected department.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* =======================================================================
            COLUMN 2: MONITORING STATUS CARD (~25% WIDTH)
            ======================================================================= */}
        <div
          className="card"
          style={{
            background: 'var(--surface-hi)',
            border: '1px solid var(--line)',
            borderRadius: 14,
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
          }}
        >
          {/* Header: Activity Icon + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Activity size={16} style={{ color: 'var(--brand-purple)' }} />
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>
              Monitoring Status
            </span>
          </div>

          {/* Center Checkmark & Status Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', margin: '14px 0' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.35)',
                marginBottom: 10,
              }}
            >
              <Check size={24} strokeWidth={3} />
            </div>

            <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--text-primary)' }}>
              {isScanning ? 'Surveillance Audit In Progress' : 'Daily Surveillance Scheduled'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
              {isScanning
                ? `Scanning conduits · ${cycleProgress}%`
                : 'Runs once every 24 hours · Next cycle: Tomorrow, 09:00 AM'}
            </div>

            {/* Progress Indicator Bar */}
            <div
              style={{
                width: '100%',
                height: 6,
                background: 'var(--line)',
                borderRadius: 10,
                marginTop: 14,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: isScanning ? `${cycleProgress}%` : '72%',
                  background: 'linear-gradient(90deg, #22c55e, #10b981)',
                  borderRadius: 10,
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>

          {/* Bottom Split Stats: Orders Scanned & Risks Detected */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              borderTop: '1px solid var(--line)',
              paddingTop: 12,
              marginTop: 4,
            }}
          >
            <div style={{ textAlign: 'center', borderRight: '1px solid var(--line)', paddingRight: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>
                Orders Scanned
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                {formatNumber(kpiMetrics.totalOrders)}
              </div>
            </div>

            <div style={{ textAlign: 'center', paddingLeft: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>
                Risks Detected
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                {formatNumber(kpiMetrics.atRisk)}
              </div>
            </div>
          </div>
        </div>

        {/* =======================================================================
            COLUMN 3: RECENT ACTIVITY TIMELINE CARD (~25% WIDTH)
            ======================================================================= */}
        <div
          className="card"
          style={{
            background: 'var(--surface-hi)',
            border: '1px solid var(--line)',
            borderRadius: 14,
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div>
            {/* Header: Clock Icon + Title + View All */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={16} style={{ color: 'var(--brand-purple)' }} />
                <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>
                  Recent Activity
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowAllActivity(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--brand-purple)',
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <span>View All</span>
                <ArrowRight size={12} />
              </button>
            </div>

            {/* Chronological Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: 5,
                  top: 8,
                  bottom: 8,
                  width: 2,
                  background: 'var(--line)',
                  zIndex: 1,
                }}
              />

              {/* Live Chronological Timeline from Database */}
              {dashboardData.logs.length > 0 ? (
                dashboardData.logs.slice(0, 4).map((log, lIdx) => {
                  let timeStr = 'Recent'
                  if (log.executed_at) {
                    try {
                      const d = new Date(log.executed_at)
                      timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    } catch (e) { }
                  }
                  const hasRisks = (log.risks_found_count || 0) > 0
                  return (
                    <div key={log.id || lIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, position: 'relative', zIndex: 2 }}>
                      <span
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: hasRisks ? '#ef4444' : '#22c55e',
                          border: '2px solid var(--surface-hi)',
                          marginTop: 2,
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                          <span style={{ color: 'var(--text-muted)', fontWeight: 500, marginRight: 6 }}>{timeStr}</span>
                          {log.summary || `Surveillance cycle (${log.cycle_type || 'MANUAL'})`}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
                          {log.risks_found_count || 0} risks audited · Status: {log.status || 'SUCCESS'}
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', padding: '12px 0' }}>
                  No surveillance activity recorded yet. Run monitoring to generate logs.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL: ALERT DETAILS & OPERATIONAL MITIGATION ACTIONS
          ========================================================================= */}
      {activeAlertModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            style={{
              background: 'var(--surface-hi)',
              borderRadius: 14,
              border: '1px solid var(--line)',
              width: '100%',
              maxWidth: 620,
              boxShadow: '0 20px 40px rgba(0,0,0,0.22)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '90vh',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--line)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: 12,
                    background: 'rgba(239, 68, 68, 0.12)',
                    color: '#dc2626',
                  }}
                >
                  {activeAlertModal.severity?.toUpperCase()}
                </span>
                <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>
                  Alert #{activeAlertModal.id} · {activeAlertModal.customer_order_id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveAlertModal(null)
                  setActionSuccessNotice('')
                }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {actionSuccessNotice && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: 'rgba(34, 197, 94, 0.12)',
                    color: '#16a34a',
                    fontSize: 12.5,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>{actionSuccessNotice}</span>
                </div>
              )}

              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {activeAlertModal.title || activeAlertModal.risk_category}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.45 }}>
                  {activeAlertModal.description || 'Continuous monitoring telemetry detected operational variance.'}
                </div>
              </div>

              {/* Meta Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 10,
                  padding: 12,
                  borderRadius: 8,
                  background: 'rgba(0,0,0,0.02)',
                  border: '1px solid var(--line)',
                }}
              >
                <div>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Customer
                  </span>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
                    {activeAlertModal.customer}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Department
                  </span>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
                    {activeAlertModal.department}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Detected Age
                  </span>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
                    {activeAlertModal.age}
                  </div>
                </div>
              </div>

              {/* Recommended Action */}
              {activeAlertModal.recommended_action && (
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 8,
                    background: 'rgba(111, 61, 186, 0.06)',
                    border: '1px solid rgba(111, 61, 186, 0.2)',
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--brand-purple)', textTransform: 'uppercase' }}>
                    Agent 3 Recommended Mitigation
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-primary)', marginTop: 4, lineHeight: 1.4 }}>
                    {activeAlertModal.recommended_action}
                  </div>
                </div>
              )}

              {/* Assign Action */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-primary)' }}>Assign Owner</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    value={assigneeInput}
                    onChange={(e) => setAssigneeInput(e.target.value)}
                    placeholder="Enter owner name or email (e.g. erp-lead@manufacturing.internal)..."
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid var(--line)',
                      background: 'var(--surface-hi)',
                      color: 'var(--text-primary)',
                      fontSize: 12,
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAssignAlert}
                    className="button button-secondary"
                    style={{ padding: '8px 14px', fontSize: 12, fontWeight: 600 }}
                  >
                    Assign
                  </button>
                </div>
              </div>

              {/* Resolve Action */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-primary)' }}>Resolve Alert</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    value={resolutionInput}
                    onChange={(e) => setResolutionInput(e.target.value)}
                    placeholder="Resolution summary (e.g. Alternate supplier PO confirmed)..."
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid var(--line)',
                      background: 'var(--surface-hi)',
                      color: 'var(--text-primary)',
                      fontSize: 12,
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleResolveAlert}
                    style={{
                      padding: '8px 14px',
                      fontSize: 12,
                      fontWeight: 700,
                      borderRadius: 6,
                      background: '#16a34a',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Resolve
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '12px 20px',
                borderTop: '1px solid var(--line)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(0,0,0,0.015)',
              }}
            >
              <Link
                to={`/orders/${encodeURIComponent(activeAlertModal.customer_order_id)}`}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--brand-purple)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span>View Full Order Details</span>
                <ExternalLink size={12} />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setActiveAlertModal(null)
                  setActionSuccessNotice('')
                }}
                className="button button-secondary"
                style={{ padding: '6px 14px', fontSize: 12 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: FULL RECENT ACTIVITY LOGS
          ========================================================================= */}
      {showAllActivity && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            style={{
              background: 'var(--surface-hi)',
              borderRadius: 14,
              border: '1px solid var(--line)',
              width: '100%',
              maxWidth: 600,
              boxShadow: '0 20px 40px rgba(0,0,0,0.22)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '80vh',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--line)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <History size={16} style={{ color: 'var(--brand-purple)' }} />
                <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>
                  All Surveillance Execution Logs
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAllActivity(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div
              style={{
                padding: 20,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
              className="no-scrollbar"
            >
              {dashboardData.logs.length > 0 ? (
                dashboardData.logs.map((log, idx) => (
                  <div
                    key={log.id || idx}
                    style={{
                      padding: 12,
                      borderRadius: 8,
                      border: '1px solid var(--line)',
                      background: 'rgba(0,0,0,0.015)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {log.summary || `Surveillance cycle ${log.cycle_type || 'SCHEDULED'}`}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        {log.executed_at ? new Date(log.executed_at).toLocaleString() : 'Recent'} · Status: {log.status || 'SUCCESS'}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: 10,
                        background: log.risks_found_count > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                        color: log.risks_found_count > 0 ? '#ef4444' : '#16a34a',
                      }}
                    >
                      {log.risks_found_count || 0} risks
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', padding: 20 }}>
                  Surveillance logs will record automatically during background audits.
                </div>
              )}
            </div>

            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--line)', textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setShowAllActivity(false)}
                className="button button-secondary"
                style={{ padding: '6px 14px', fontSize: 12 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
