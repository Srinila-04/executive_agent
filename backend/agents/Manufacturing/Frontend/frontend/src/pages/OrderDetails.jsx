import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  ClipboardList,
  Cpu,
  ShieldCheck,
  Activity,
  AlertTriangle,
  History,
  CheckCircle2,
  Clock,
  Truck,
  Factory,
  Package,
  Calendar,
  Layers,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Mail,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Bot,
  Sparkles,
  RefreshCw,
  Zap,
} from 'lucide-react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { ordersApi } from '../api/orders.api'
import { agentsApi } from '../api/agents.api'
import { workflowApi } from '../api/workflow.api'
import { formatDate, formatINR, formatNumber } from '../utils/format'
import { useAuth } from '../context/AuthContext'
import { canManageApprovals } from '../utils/permissions'

const TABS = [
  { id: 'overview', label: 'Overview', icon: ClipboardList },
  { id: 'feasibility', label: 'Feasibility (Agent 2)', icon: Cpu },
  { id: 'approval', label: 'Approval', icon: ShieldCheck },
  { id: 'monitoring', label: 'Monitoring (Agent 3)', icon: Activity },
  { id: 'risks', label: 'Risks & Actions', icon: AlertTriangle },
  { id: 'communications', label: 'Notifications & Communication', icon: MessageSquare },
  { id: 'activity', label: 'Activity History', icon: History },
]

export default function OrderDetails() {
  const { orderId } = useParams()
  const { user } = useAuth()
  const canApprove = canManageApprovals(user)
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedEvents, setExpandedEvents] = useState({})

  const toggleEventExpanded = (id) => {
    setExpandedEvents((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const {
    data: agentTimelineData,
    isLoading: loadingAgentTimeline,
    error: agentTimelineError,
    refetch: refetchAgentTimeline,
  } = useQuery({
    queryKey: ['order-agent-timeline', orderId],
    queryFn: () => ordersApi.getAgentTimeline(orderId),
    enabled: Boolean(orderId),
    staleTime: 30 * 1000,
  })

  const {
    data: order,
    isLoading: loadingOrder,
    error: orderError,
  } = useQuery({
    queryKey: ['order-detail', orderId],
    queryFn: () => ordersApi.getById(orderId),
    enabled: Boolean(orderId),
    staleTime: 60 * 1000,
  })

  // Supplementary workflow status (assessment, proposal, monitoring status for lifecycle bar)
  const { data: workflowStatus = {} } = useQuery({
    queryKey: ['order-workflow-status', orderId],
    queryFn: async () => {
      const [assessmentsRes, proposalsRes, recordRes] = await Promise.allSettled([
        agentsApi.listAssessments({ customer_order_id: orderId }),
        workflowApi.listProposals({ customer_order_id: orderId }),
        agentsApi.getMonitoringRecord(orderId),
      ])
      const assessment = assessmentsRes.status === 'fulfilled' ? (assessmentsRes.value?.[0] || null) : null
      const proposal = proposalsRes.status === 'fulfilled' ? (proposalsRes.value?.items?.[0] || proposalsRes.value?.[0] || null) : null
      const monitoringRec = recordRes.status === 'fulfilled' ? (recordRes.value || null) : null
      return { assessment, proposal, monitoringRec }
    },
    enabled: Boolean(orderId),
    staleTime: 60 * 1000,
  })

  // Lazy tab queries (only executed when that tab is actually active!)
  const { data: events = [] } = useQuery({
    queryKey: ['order-events', orderId],
    queryFn: async () => {
      const evData = await ordersApi.getEvents(orderId)
      return Array.isArray(evData) ? evData : (evData?.events || [])
    },
    enabled: Boolean(orderId) && (activeTab === 'overview' || activeTab === 'activity'),
    staleTime: 60 * 1000,
  })

  const { data: alerts = [] } = useQuery({
    queryKey: ['order-alerts', orderId],
    queryFn: async () => {
      const res = await agentsApi.listAlerts({ customer_order_id: orderId })
      return Array.isArray(res) ? res : []
    },
    enabled: Boolean(orderId) && activeTab === 'risks',
    staleTime: 60 * 1000,
  })

  const { data: notifications = [] } = useQuery({
    queryKey: ['order-notifications', orderId],
    queryFn: async () => {
      const res = await agentsApi.listNotifications({ customer_order_id: orderId })
      return Array.isArray(res) ? res : []
    },
    enabled: Boolean(orderId) && activeTab === 'communications',
    staleTime: 60 * 1000,
  })

  const assessment = workflowStatus.assessment || null
  const proposal = workflowStatus.proposal || null
  const monitoringRec = workflowStatus.monitoringRec || null
  const loading = loadingOrder
  const error = orderError ? (orderError.response?.data?.detail || orderError.message || 'Could not load order details.') : ''

  if (loading) {
    return (
      <div className="page-stack">
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--mfg-text-muted)' }}>
          Loading order {orderId}...
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="page-stack">
        <Link to="/orders" className="back-link" style={{ color: 'var(--mfg-accent-primary)' }}>
          <ArrowLeft size={16} /> Back to Orders
        </Link>
        <div
          className="card"
          style={{
            padding: 40,
            textAlign: 'center',
            background: 'var(--mfg-bg-card)',
            border: '1px solid var(--mfg-border-default)',
            borderRadius: 12,
          }}
        >
          <AlertCircle size={36} style={{ color: '#EF4444', margin: '0 auto 12px auto' }} />
          <h3>Order {orderId} Not Found</h3>
          <p style={{ color: 'var(--mfg-text-secondary)', fontSize: 13, marginBottom: 20 }}>
            {error || 'Unable to retrieve order details.'}
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/orders" className="button button-primary" style={{ textDecoration: 'none' }}>
              View Order Book
            </Link>
            <Link to="/assessments" className="button button-secondary" style={{ textDecoration: 'none' }}>
              Check Feasibility Assessments
            </Link>
            <Link to="/my-work" className="button button-secondary" style={{ textDecoration: 'none' }}>
              Go to My Work Queue
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Derive Status & Lifecycle Stages
  const rawStatus = (order.order_status || '').toUpperCase()
  const isDelivered = rawStatus === 'DELIVERED'
  const isInTransit = ['PARTIALLY_SHIPPED', 'SHIPPED', 'IN_TRANSIT'].includes(rawStatus)
  const isInProduction = ['IN_PRODUCTION', 'PROCESSING', 'PLANNED', 'PRODUCING'].includes(rawStatus)
  const isConfirmed = rawStatus === 'CONFIRMED'

  // An order is only pending human approval if explicitly in approval status or has an open pending proposal
  const hasPendingProposal = Boolean(
    (proposal && (proposal.status === 'PENDING' || proposal.decision === 'PENDING')) ||
    (order.latest_proposal_status === 'PENDING' && !isInProduction && !isInTransit && !isDelivered) ||
    rawStatus === 'HUMAN_APPROVAL' ||
    rawStatus === 'PENDING_APPROVAL' ||
    rawStatus === 'APPROVAL_PENDING'
  )

  const isApproved =
    !hasPendingProposal &&
    (isDelivered ||
      isInTransit ||
      isInProduction ||
      isConfirmed ||
      Boolean(order.confirmed_delivery_date) ||
      Boolean(proposal && (proposal.status === 'APPROVED' || proposal.decision === 'APPROVED')))

  const hasAssessment = Boolean(assessment) || isApproved || hasPendingProposal
  const isMonitored = !hasPendingProposal && (Boolean(monitoringRec && monitoringRec.status === 'ACTIVE') || isApproved)

  const lifecycleStages = [
    { id: 1, label: 'Order Received', done: true, current: false },
    {
      id: 2,
      label: 'Feasibility (Agent 2)',
      done: isApproved || hasAssessment,
      current: !hasAssessment && !isApproved && !hasPendingProposal,
    },
    {
      id: 3,
      label: 'Human Approval',
      done: isApproved,
      current: hasPendingProposal,
    },
    {
      id: 4,
      label: 'Monitoring Active',
      done: isMonitored || isInProduction || isInTransit || isDelivered,
      current: isApproved && !isInProduction && !isInTransit && !isDelivered,
    },
    {
      id: 5,
      label: 'Production / Transit',
      done: isDelivered,
      current: (isInProduction || isInTransit) && !isDelivered,
    },
    { id: 6, label: 'Delivered', done: isDelivered, current: isDelivered },
  ]

  const getNextActionText = () => {
    if (hasPendingProposal) return 'Feasibility evaluated. Pending commercial approval in My Work queue.'
    if (isDelivered) return 'Order fulfilled and closed.'
    if (isInTransit) return 'Order in transit. Track carrier milestones and ETA adherence.'
    if (isInProduction) return 'Plant manufacturing active. Agent 3 monitoring production line milestones and component availability.'
    if (isMonitored) return 'Active surveillance engaged. Monitored daily by Agent 3 scheduler.'
    if (isApproved) return 'Commercial commitment approved. Ready for manufacturing schedule dispatch.'
    if (hasAssessment) return 'Feasibility evaluated. Pending commercial approval in My Work queue.'
    return 'Order intake received. Run Agent 2 feasibility assessment to audit multi-department readiness.'
  }

  return (
    <div className="page-stack">
      {/* BACK NAVIGATION */}
      <Link
        to="/orders"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 12,
          color: 'var(--mfg-accent-primary)',
          textDecoration: 'none',
          fontWeight: 600,
          width: 'fit-content',
        }}
      >
        <ArrowLeft size={14} /> Back to Order Book
      </Link>

      {/* HEADER HERO */}
      <div
        className="card"
        style={{
          background: 'var(--mfg-bg-card)',
          border: '1px solid var(--mfg-border-default)',
          borderRadius: 12,
          padding: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div className="eyebrow" style={{ color: 'var(--mfg-accent-primary)' }}>
            CUSTOMER ORDER • {order.customer_name || 'Enterprise Account'}
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: 26, fontWeight: 700, color: 'var(--mfg-text-primary)' }}>
            {order.customer_order_id}
          </h1>
          <div style={{ fontSize: 13, color: 'var(--mfg-text-secondary)', display: 'flex', gap: 14 }}>
            <span>Product: <strong>{order.product_name}</strong></span>
            <span>Qty: <strong>{formatNumber(order.order_qty)} units</strong></span>
            <span>Requested: <strong>{formatDate(order.requested_delivery_date)}</strong></span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span className={`mfg-badge ${isDelivered ? 'mfg-badge-ready' : 'mfg-badge-warning'}`}>
            {hasPendingProposal ? 'HUMAN APPROVAL PENDING' : (order.order_status || '').replaceAll('_', ' ')}
          </span>
          {order.risk && (
            <span className={`mfg-badge ${order.risk.risk_level === 'CRITICAL' ? 'mfg-badge-critical' : 'mfg-badge-warning'}`}>
              {order.risk.risk_level || 'RISK'}
            </span>
          )}
        </div>
      </div>

      {/* 6-STAGE TIMELINE TRACKER */}
      <div
        className="card"
        style={{
          background: 'var(--mfg-bg-card)',
          border: '1px solid var(--mfg-border-default)',
          borderRadius: 12,
          padding: 20,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--mfg-text-muted)', marginBottom: 14 }}>
          Order Lifecycle Journey
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflowX: 'auto', gap: 10 }}>
          {lifecycleStages.map((st, idx) => (
            <div key={st.id} style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: st.done
                    ? 'rgba(34,197,94,0.15)'
                    : st.current
                    ? 'rgba(255,138,36,0.2)'
                    : 'var(--mfg-bg-surface)',
                  border: '1px solid',
                  borderColor: st.done ? '#22C55E' : st.current ? 'var(--mfg-accent-primary)' : 'var(--mfg-border-default)',
                  color: st.done ? '#22C55E' : st.current ? 'var(--mfg-accent-primary)' : 'var(--mfg-text-muted)',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {st.done ? <CheckCircle2 size={16} /> : st.id}
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: st.current ? 700 : 500,
                  color: st.done ? 'var(--mfg-text-primary)' : st.current ? 'var(--mfg-accent-primary)' : 'var(--mfg-text-muted)',
                }}
              >
                {st.label}
              </span>
              {idx < lifecycleStages.length - 1 && (
                <div style={{ width: 24, height: 1, background: 'var(--mfg-border-default)', margin: '0 4px' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 6 ORDER DETAILS TABS */}
      <div style={{ display: 'flex', gap: 6, borderBottom: '1px solid var(--line)', paddingBottom: 6, overflowX: 'auto' }}>
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                background: isActive ? 'var(--brand-purple-soft)' : 'transparent',
                color: isActive ? 'var(--brand-purple)' : 'var(--text-secondary)',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon size={15} /> {tab.label}
            </button>
          )
        })}
      </div>

      {/* TAB CONTENT: 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
          <div
            className="card"
            style={{
              background: 'var(--mfg-bg-card)',
              border: '1px solid var(--mfg-border-default)',
              borderRadius: 12,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--mfg-text-primary)' }}>Commercial Parameters</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
              <div>
                <span style={{ color: 'var(--mfg-text-muted)', fontSize: 11, display: 'block' }}>Order Date</span>
                <strong>{formatDate(order.order_date)}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--mfg-text-muted)', fontSize: 11, display: 'block' }}>Order Value</span>
                <strong>{formatINR(order.total_value_inr)}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--mfg-text-muted)', fontSize: 11, display: 'block' }}>Ordered Quantity</span>
                <strong>{formatNumber(order.order_qty)}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--mfg-text-muted)', fontSize: 11, display: 'block' }}>Shipped Quantity</span>
                <strong>{formatNumber(order.shipped_qty)}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--mfg-text-muted)', fontSize: 11, display: 'block' }}>Confirmed Date</span>
                <strong>{formatDate(order.confirmed_delivery_date)}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--mfg-text-muted)', fontSize: 11, display: 'block' }}>Priority</span>
                <strong>{order.priority || 'MEDIUM'}</strong>
              </div>
            </div>
          </div>

          <div
            className="card"
            style={{
              background: 'var(--mfg-bg-card)',
              border: '1px solid var(--mfg-border-default)',
              borderRadius: 12,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--mfg-text-primary)' }}>Risk Assessment & Next Action</div>
            {order.risk ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span className={`mfg-badge ${order.risk.risk_level === 'CRITICAL' ? 'mfg-badge-critical' : 'mfg-badge-warning'}`}>
                    {order.risk.category || 'RISK'}
                  </span>
                  <span>{order.risk.risk_level} severity</span>
                </div>
                {order.risk.reasons && (
                  <ul style={{ margin: '6px 0 0 16px', padding: 0, color: 'var(--mfg-text-secondary)', lineHeight: 1.5 }}>
                    {order.risk.reasons.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                )}
              </div>
            ) : (
              <div style={{ color: '#22C55E', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} /> No operational risk flags recorded.
              </div>
            )}
            <div style={{ borderTop: '1px solid var(--mfg-border-subtle)', paddingTop: 10, fontSize: 12, color: 'var(--mfg-text-secondary)' }}>
              <strong>Next Action:</strong> {getNextActionText()}
            </div>
          </div>

          {/* TASK 5: ORDER DELIVERY COMMITMENT & REVISED SCHEDULE */}
          <div
            className="card"
            style={{
              gridColumn: '1 / -1',
              background: 'var(--mfg-bg-card)',
              border: (agentTimelineData?.delay_days || 0) > 0 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--mfg-border-default)',
              borderRadius: 12,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={18} style={{ color: (agentTimelineData?.delay_days || 0) > 0 ? '#ef4444' : 'var(--brand-purple)' }} />
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--mfg-text-primary)' }}>
                  Delivery Schedule &amp; Milestone Adherence
                </span>
                <span
                  className="mfg-badge"
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    background: (agentTimelineData?.verdict === 'DELAYED' || (agentTimelineData?.delay_days || 0) > 0)
                      ? 'rgba(239, 68, 68, 0.12)'
                      : 'rgba(34, 197, 94, 0.12)',
                    color: (agentTimelineData?.verdict === 'DELAYED' || (agentTimelineData?.delay_days || 0) > 0)
                      ? '#ef4444'
                      : '#16a34a',
                    border: (agentTimelineData?.verdict === 'DELAYED' || (agentTimelineData?.delay_days || 0) > 0)
                      ? '1px solid rgba(239, 68, 68, 0.3)'
                      : '1px solid rgba(34, 197, 94, 0.3)',
                  }}
                >
                  Verdict: {agentTimelineData?.verdict || ((agentTimelineData?.delay_days || 0) > 0 ? 'DELAYED' : 'ON_TIME')}
                </span>
              </div>

              {agentTimelineData?.has_active_revised_proposal && (
                <Link
                  to="/my-work?tab=approvals"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#d97706',
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    padding: '4px 10px',
                    borderRadius: 6,
                    textDecoration: 'none',
                  }}
                >
                  <AlertTriangle size={13} /> Revised Proposal Waiting Commercial Approval <ChevronRight size={13} />
                </Link>
              )}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 14,
                background: 'var(--mfg-bg-surface)',
                padding: '14px 16px',
                borderRadius: 8,
                border: '1px solid var(--mfg-border-subtle)',
              }}
            >
              <div>
                <span style={{ color: 'var(--mfg-text-muted)', fontSize: 11, textTransform: 'uppercase', display: 'block' }}>
                  Original Promised Date
                </span>
                <strong style={{ fontSize: 15, color: 'var(--mfg-text-primary)', marginTop: 2, display: 'block' }}>
                  {formatDate(agentTimelineData?.promised_date || order.confirmed_delivery_date || proposal?.proposed_date || order.requested_delivery_date)}
                </strong>
                <span style={{ fontSize: 11, color: 'var(--mfg-text-muted)' }}>Baseline commercial agreement</span>
              </div>

              <div>
                <span style={{ color: 'var(--mfg-text-muted)', fontSize: 11, textTransform: 'uppercase', display: 'block' }}>
                  Current Revised Estimated Date
                </span>
                <strong
                  style={{
                    fontSize: 15,
                    color: (agentTimelineData?.delay_days || 0) > 0 ? '#ef4444' : 'var(--brand-purple)',
                    marginTop: 2,
                    display: 'block',
                  }}
                >
                  {formatDate(agentTimelineData?.revised_estimated_date || proposal?.revised_estimated_date || assessment?.revised_estimated_date || assessment?.achievable_delivery_date || order.confirmed_delivery_date)}
                </strong>
                <span style={{ fontSize: 11, color: 'var(--mfg-text-muted)' }}>Latest surveillance re-evaluation</span>
              </div>

              <div>
                <span style={{ color: 'var(--mfg-text-muted)', fontSize: 11, textTransform: 'uppercase', display: 'block' }}>
                  Schedule Variance / Delay
                </span>
                <strong
                  style={{
                    fontSize: 15,
                    color: (agentTimelineData?.delay_days || 0) > 0 ? '#ef4444' : '#16a34a',
                    marginTop: 2,
                    display: 'block',
                  }}
                >
                  {(agentTimelineData?.delay_days || 0) > 0
                    ? `+${agentTimelineData.delay_days} days delay`
                    : 'On Schedule (0 days delay)'}
                </strong>
                <span style={{ fontSize: 11, color: 'var(--mfg-text-muted)' }}>
                  {(agentTimelineData?.delay_days || 0) > 0 ? 'Variance vs baseline promise' : 'Milestones intact'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. FEASIBILITY (AGENT 2) */}
      {activeTab === 'feasibility' && (
        <div className="card" style={{ background: 'var(--mfg-bg-card)', border: '1px solid var(--mfg-border-default)', borderRadius: 12, padding: 24 }}>
          {assessment ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--mfg-text-primary)' }}>
                    Autonomous Feasibility Evaluation: {assessment.overall_feasibility}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--mfg-text-secondary)', marginTop: 2 }}>
                    Evaluated by Agent 2 across 7 manufacturing systems.
                  </div>
                </div>
                <Link to="/assessments" className="button button-secondary" style={{ fontSize: 12 }}>
                  Open in Workspace <ExternalLink size={12} />
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, background: 'var(--mfg-bg-surface)', padding: 14, borderRadius: 8 }}>
                <div>
                  <span style={{ fontSize: 10, color: 'var(--mfg-text-muted)' }}>Achievable Date</span>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--mfg-accent-primary)' }}>
                    {formatDate(assessment.achievable_delivery_date)}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 10, color: 'var(--mfg-text-muted)' }}>Confidence Score</span>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#22C55E' }}>
                    {Math.round((assessment.confidence_score || 0.85) * 100)}%
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 10, color: 'var(--mfg-text-muted)' }}>Assessment ID</span>
                  <div style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--mfg-text-secondary)' }}>
                    {assessment.assessment_id}
                  </div>
                </div>
              </div>
            </div>
          ) : isApproved ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--mfg-text-primary)' }}>
                    Multi-Department Feasibility: Validated &amp; Cleared
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--mfg-text-secondary)', marginTop: 2 }}>
                    Order passed technical and commercial audit prior to manufacturing schedule release.
                  </div>
                </div>
                <span className="mfg-badge mfg-badge-ready" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={13} /> FEASIBILITY CLEARED
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--mfg-text-secondary)', background: 'var(--mfg-bg-surface)', padding: 12, borderRadius: 8 }}>
                Evaluated against BOM availability, plant line capacity, carrier transit buffers, and quality release protocols.
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--mfg-text-muted)' }}>
              No Agent 2 assessment record found for this order. Assessments run automatically upon new order intake.
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: 3. APPROVAL */}
      {activeTab === 'approval' && (
        <div className="card" style={{ background: 'var(--mfg-bg-card)', border: '1px solid var(--mfg-border-default)', borderRadius: 12, padding: 24 }}>
          {isApproved ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--mfg-text-primary)' }}>
                    Commercial Commitment Approval
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--mfg-text-secondary)', marginTop: 2 }}>
                    Confirmed commercial delivery commitment validated and active in production.
                  </div>
                </div>
                <span className="mfg-badge mfg-badge-ready" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={13} /> COMMERCIALLY APPROVED
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, background: 'var(--mfg-bg-surface)', padding: 14, borderRadius: 8 }}>
                <div>
                  <span style={{ fontSize: 10, color: 'var(--mfg-text-muted)', textTransform: 'uppercase' }}>Confirmed Delivery Date</span>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--mfg-accent-primary)', marginTop: 2 }}>
                    {formatDate(order.confirmed_delivery_date || proposal?.proposed_date)}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 10, color: 'var(--mfg-text-muted)', textTransform: 'uppercase' }}>Requested Customer Date</span>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--mfg-text-primary)', marginTop: 2 }}>
                    {formatDate(order.requested_delivery_date)}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 10, color: 'var(--mfg-text-muted)', textTransform: 'uppercase' }}>Lifecycle State</span>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#22C55E', marginTop: 2 }}>
                    {order.order_status?.replaceAll('_', ' ')}
                  </div>
                </div>
              </div>
              {(proposal?.decision_note || proposal?.review_notes) && (
                <div style={{ fontSize: 12, color: 'var(--mfg-text-secondary)', background: 'var(--mfg-bg-surface)', padding: 12, borderRadius: 8 }}>
                  <strong>Approval Notes:</strong> {proposal.decision_note || proposal.review_notes}
                </div>
              )}
            </div>
          ) : (proposal || hasPendingProposal) ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--mfg-text-primary)' }}>
                    Commercial Commitment Proposal
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--mfg-text-secondary)', marginTop: 2 }}>
                    Pending commercial approval and sign-off before manufacturing baseline commitment.
                  </div>
                </div>
                <span className={`mfg-badge ${(proposal?.status || proposal?.decision) === 'APPROVED' ? 'mfg-badge-ready' : 'mfg-badge-warning'}`}>
                  {proposal?.status || proposal?.decision || 'HUMAN APPROVAL PENDING'}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, background: 'var(--mfg-bg-surface)', padding: 14, borderRadius: 8 }}>
                <div>
                  <span style={{ fontSize: 10, color: 'var(--mfg-text-muted)', textTransform: 'uppercase' }}>Proposed Commitment Date</span>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--mfg-accent-primary)', marginTop: 2 }}>
                    {formatDate(proposal?.proposed_date || proposal?.achievable_delivery_date || order.requested_delivery_date)}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 10, color: 'var(--mfg-text-muted)', textTransform: 'uppercase' }}>Recommended By</span>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--mfg-text-primary)', marginTop: 2 }}>
                    {proposal?.recommended_by || 'Agent 2 Feasibility Engine'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 10, color: 'var(--mfg-text-muted)', textTransform: 'uppercase' }}>Revision Cycle</span>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#D97706', marginTop: 2 }}>
                    Revision #{proposal?.revision || 1}
                  </div>
                </div>
              </div>
              {(proposal?.decision_note || proposal?.review_notes || (proposal?.reasons && proposal.reasons.length > 0)) && (
                <div style={{ fontSize: 12, color: 'var(--mfg-text-secondary)', background: 'var(--mfg-bg-surface)', padding: 12, borderRadius: 8 }}>
                  <strong>Supporting Context / Notes:</strong> {proposal?.decision_note || proposal?.review_notes || (Array.isArray(proposal?.reasons) ? proposal.reasons.join('; ') : proposal?.reasons)}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <Link to="/my-work" className="button button-primary" style={{ textDecoration: 'none', fontSize: 12 }}>
                  Go to My Work Queue to Decide Proposal
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--mfg-text-muted)' }}>
              No commitment proposal submitted yet. Proposals are submitted from the Feasibility assessment.
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: 4. MONITORING (AGENT 3) */}
      {activeTab === 'monitoring' && (
        <div className="card" style={{ background: 'var(--mfg-bg-card)', border: '1px solid var(--mfg-border-default)', borderRadius: 12, padding: 24 }}>
          {monitoringRec ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--mfg-text-primary)' }}>
                  Agent 3 Surveillance Status: {monitoringRec.status}
                </div>
                <span className="mfg-badge mfg-badge-ready">ACTIVE MONITORING</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--mfg-text-secondary)' }}>
                Baseline Committed Date: <strong>{formatDate(monitoringRec.approved_delivery_baseline || monitoringRec.approved_delivery_date)}</strong> • Activated: {formatDate(monitoringRec.activated_at || monitoringRec.started_at)}
              </div>
            </div>
          ) : isApproved && !isDelivered ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--mfg-text-primary)' }}>
                    Agent 3 Autonomous Surveillance: ACTIVE
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--mfg-text-secondary)', marginTop: 2 }}>
                    Continuous surveillance active for confirmed order committed for delivery on {formatDate(order.confirmed_delivery_date)}.
                  </div>
                </div>
                <span className="mfg-badge mfg-badge-ready" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Activity size={13} /> ACTIVE SURVEILLANCE
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--mfg-text-secondary)', background: 'var(--mfg-bg-surface)', padding: 12, borderRadius: 8 }}>
                Surveillance monitors ERP commercial parameters, MMS component shortages, MES line cycle bottlenecks, TMS carrier exceptions, and QMS quality holds.
              </div>
              <Link to="/monitoring" className="button button-secondary" style={{ width: 'fit-content', fontSize: 12 }}>
                Open Agent 3 Surveillance Workspace <ExternalLink size={12} />
              </Link>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--mfg-text-muted)' }}>
              Active surveillance begins after commercial commitment approval.
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: 5. RISKS & ACTIONS */}
      {activeTab === 'risks' && (
        <div className="card" style={{ background: 'var(--mfg-bg-card)', border: '1px solid var(--mfg-border-default)', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--mfg-text-primary)', marginBottom: 14 }}>
            Risk Alerts ({alerts.length})
          </div>
          {alerts.length === 0 ? (
            <div style={{ color: '#22C55E', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={16} /> No active risk alerts for this order.
            </div>
          ) : (
            alerts.map((al) => (
              <div
                key={al.alert_id || al.id}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: 'var(--mfg-bg-surface)',
                  border: '1px solid var(--mfg-border-subtle)',
                  marginBottom: 10,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="mfg-badge" style={{ fontWeight: 700 }}>{al.department}</span>
                    <strong>{al.title}</strong>
                  </div>
                  <span className="mfg-badge mfg-badge-warning">{al.severity}</span>
                </div>
                <p style={{ margin: '8px 0 0 0', fontSize: 12, color: 'var(--mfg-text-secondary)' }}>{al.description}</p>
                {al.resolution_notes && (
                  <div style={{ marginTop: 8, padding: 8, background: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e', borderRadius: 6, fontSize: 11, color: '#16a34a' }}>
                    <strong>Resolved Corrective Action:</strong> {al.resolution_notes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT: 6. NOTIFICATIONS & COMMUNICATION */}
      {activeTab === 'communications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Customer Service Communication Notes */}
          <div className="card" style={{ background: 'var(--mfg-bg-card)', border: '1px solid var(--mfg-border-default)', borderRadius: 12, padding: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--mfg-text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <MessageSquare size={18} style={{ color: 'var(--brand-purple)' }} />
              Customer Service Communication Notes
            </div>
            {alerts.filter((a) => a.customer_communicated || a.customer_communication_notes).length === 0 ? (
              <div style={{ color: 'var(--mfg-text-muted)', fontSize: 13 }}>
                No customer communications recorded for this order yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {alerts.filter((a) => a.customer_communicated || a.customer_communication_notes).map((a) => (
                  <div key={a.id} style={{ background: 'var(--mfg-bg-surface)', border: '1px solid var(--mfg-border-subtle)', borderRadius: 8, padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--mfg-text-primary)' }}>{a.title}</span>
                      <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>Customer Notified</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--mfg-text-secondary)' }}>{a.customer_communication_notes}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Email Notification Dispatch Outbox */}
          <div className="card" style={{ background: 'var(--mfg-bg-card)', border: '1px solid var(--mfg-border-default)', borderRadius: 12, padding: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--mfg-text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Mail size={18} style={{ color: 'var(--mfg-accent-primary)' }} />
              Agent 3 Automated Email Outbox History ({notifications.length})
            </div>
            {notifications.length === 0 ? (
              <div style={{ color: 'var(--mfg-text-muted)', fontSize: 13 }}>
                No email notifications dispatched for this order.
              </div>
            ) : (
              <div className="table-scroll" style={{ overflowX: 'auto', overflowY: 'auto', width: '100%', border: 'none', borderRadius: 0, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--mfg-border-default)', color: 'var(--mfg-text-muted)', textAlign: 'left' }}>
                      <th style={{ padding: 8 }}>Channel</th>
                      <th style={{ padding: 8 }}>Recipient</th>
                      <th style={{ padding: 8 }}>Type</th>
                      <th style={{ padding: 8 }}>Subject</th>
                      <th style={{ padding: 8 }}>Status</th>
                      <th style={{ padding: 8 }}>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notifications.map((n) => (
                      <tr key={n.id} style={{ borderBottom: '1px solid var(--mfg-border-subtle)' }}>
                        <td style={{ padding: 8 }}>
                          <span className="mfg-badge" style={{ fontSize: 10 }}>{n.recipient_category || 'OPERATIONAL'}</span>
                        </td>
                        <td style={{ padding: 8, fontFamily: 'monospace' }}>{n.recipient_email}</td>
                        <td style={{ padding: 8 }}>{n.notification_type || 'ACTION_REQUIRED'}</td>
                        <td style={{ padding: 8, color: 'var(--mfg-text-primary)' }}>{n.subject}</td>
                        <td style={{ padding: 8 }}>
                          <span className={`mfg-badge ${n.status === 'SENT' ? 'mfg-badge-ready' : 'mfg-badge-neutral'}`}>
                            {n.status}
                          </span>
                        </td>
                        <td style={{ padding: 8, color: 'var(--mfg-text-muted)', fontSize: 11 }}>
                          {formatDate(n.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 7. ACTIVITY HISTORY */}
      {activeTab === 'activity' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* AGENT ACTIVITY TIMELINE (TASK 1 & TASK 6) */}
          <div
            className="card"
            style={{
              background: 'var(--mfg-bg-card)',
              border: '1px solid var(--mfg-border-default)',
              borderRadius: 12,
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: 'var(--brand-purple-soft)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--brand-purple)',
                  }}
                >
                  <Bot size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--mfg-text-primary)' }}>
                    Agent Activity Timeline
                  </h3>
                  <div style={{ fontSize: 12, color: 'var(--mfg-text-secondary)', marginTop: 2 }}>
                    Chronological audit of Agent 3 surveillance scans, corrective actions, Agent 2 reassessments, and proposal revisions.
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="button button-secondary"
                onClick={() => refetchAgentTimeline()}
                disabled={loadingAgentTimeline}
                style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <RefreshCw size={13} className={loadingAgentTimeline ? 'spinning' : ''} /> Refresh Timeline
              </button>
            </div>

            {/* DELIVERY VERDICT SUMMARY BAR (TASK 1) */}
            {agentTimelineData && (
              <div
                style={{
                  background: 'var(--mfg-bg-surface)',
                  border: '1px solid var(--mfg-border-subtle)',
                  borderRadius: 10,
                  padding: '14px 18px',
                  marginBottom: 20,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: 10, color: 'var(--mfg-text-muted)', textTransform: 'uppercase' }}>Promised Date</span>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--mfg-text-primary)', marginTop: 1 }}>
                      {formatDate(agentTimelineData.promised_date || order.confirmed_delivery_date || 'N/A')}
                    </div>
                  </div>
                  <span style={{ color: 'var(--mfg-border-default)', fontSize: 16 }}>→</span>
                  <div>
                    <span style={{ fontSize: 10, color: 'var(--mfg-text-muted)', textTransform: 'uppercase' }}>Current Revised Date</span>
                    <div style={{ fontSize: 13, fontWeight: 700, color: (agentTimelineData.delay_days || 0) > 0 ? '#ef4444' : 'var(--brand-purple)', marginTop: 1 }}>
                      {formatDate(agentTimelineData.revised_estimated_date || agentTimelineData.promised_date || 'N/A')}
                    </div>
                  </div>
                  <span style={{ color: 'var(--mfg-border-default)', fontSize: 16 }}>|</span>
                  <div>
                    <span style={{ fontSize: 10, color: 'var(--mfg-text-muted)', textTransform: 'uppercase' }}>Delivery Schedule Verdict</span>
                    <div style={{ marginTop: 2 }}>
                      <span
                        className="mfg-badge"
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '2px 8px',
                          background: (agentTimelineData.verdict === 'DELAYED' || (agentTimelineData.delay_days || 0) > 0) ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)',
                          color: (agentTimelineData.verdict === 'DELAYED' || (agentTimelineData.delay_days || 0) > 0) ? '#ef4444' : '#16a34a',
                          border: `1px solid ${(agentTimelineData.verdict === 'DELAYED' || (agentTimelineData.delay_days || 0) > 0) ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
                        }}
                      >
                        {(agentTimelineData.delay_days || 0) > 0 ? `DELAYED by ${agentTimelineData.delay_days} days` : 'ON TIME (0 days delay)'}
                      </span>
                    </div>
                  </div>
                </div>

                {agentTimelineData.has_active_revised_proposal && (
                  <Link
                    to="/my-work?tab=approvals"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#d97706',
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      padding: '4px 10px',
                      borderRadius: 6,
                      textDecoration: 'none',
                    }}
                  >
                    <AlertTriangle size={13} /> Reassessment Revision Waiting Commercial Approval <ChevronRight size={13} />
                  </Link>
                )}
              </div>
            )}

            {/* LOADING STATE (TASK 6) */}
            {loadingAgentTimeline && (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--mfg-text-muted)' }}>
                <RefreshCw size={24} style={{ margin: '0 auto 10px auto', display: 'block', animation: 'spin 1s linear infinite' }} />
                <div style={{ fontSize: 13, fontWeight: 600 }}>Loading Agent Activity Timeline...</div>
                <div style={{ fontSize: 11, marginTop: 4 }}>Aggregating surveillance scans, agent runs, actions and proposals</div>
              </div>
            )}

            {/* ERROR STATE (TASK 6) */}
            {agentTimelineError && !loadingAgentTimeline && (
              <div
                style={{
                  padding: 16,
                  borderRadius: 8,
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: '#ef4444',
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <AlertCircle size={18} />
                  <div>
                    <strong>Failed to load Agent Timeline:</strong>{' '}
                    <span>{agentTimelineError?.message || agentTimelineError?.response?.data?.detail || 'Network or server error.'}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => refetchAgentTimeline()}
                  style={{ fontSize: 11, padding: '3px 10px' }}
                >
                  Retry
                </button>
              </div>
            )}

            {/* EMPTY STATE (TASK 6) */}
            {!loadingAgentTimeline && !agentTimelineError && (!agentTimelineData?.events || agentTimelineData.events.length === 0) && (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--mfg-text-muted)' }}>
                <CheckCircle2 size={36} style={{ color: '#22C55E', margin: '0 auto 10px auto' }} />
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--mfg-text-primary)' }}>No Agent Activity Recorded Yet</div>
                <div style={{ fontSize: 12, color: 'var(--mfg-text-secondary)', marginTop: 4 }}>
                  When Agent 3 surveillance scans detect variances or Agent 2 assesses feasibility, the chronological audit trail will populate here automatically.
                </div>
              </div>
            )}

            {/* TIMELINE LISTING */}
            {!loadingAgentTimeline && !agentTimelineError && agentTimelineData?.events && agentTimelineData.events.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {agentTimelineData.events.map((ev) => {
                  const isAlert = ev.category === 'RISK_ALERT'
                  const isAction = ev.category === 'ACTION'
                  const isRun = ev.category === 'AGENT_RUN'
                  const isAssessment = ev.category === 'ASSESSMENT'
                  const isProposal = ev.category === 'PROPOSAL'
                  const isExpanded = !!expandedEvents[ev.id]

                  const borderColor =
                    ev.severity === 'CRITICAL' || ev.status === 'FAILED'
                      ? '#ef4444'
                      : isProposal && ev.status === 'PENDING'
                      ? '#f59e0b'
                      : 'var(--mfg-border-default)'

                  return (
                    <div
                      key={ev.id}
                      style={{
                        background: 'var(--mfg-bg-surface)',
                        border: '1px solid',
                        borderColor,
                        borderRadius: 10,
                        padding: '14px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                      }}
                    >
                      {/* Event Header Row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          {/* Category Icon */}
                          <div
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: 6,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: isAlert
                                ? 'rgba(239,68,68,0.1)'
                                : isAction
                                ? 'rgba(111,61,186,0.1)'
                                : isProposal
                                ? 'rgba(245,158,11,0.1)'
                                : 'rgba(59,130,246,0.1)',
                              color: isAlert
                                ? '#ef4444'
                                : isAction
                                ? 'var(--brand-purple)'
                                : isProposal
                                ? '#d97706'
                                : '#2563eb',
                            }}
                          >
                            {isAlert ? <AlertTriangle size={14} /> : isAction ? <Zap size={14} /> : isProposal ? <ShieldCheck size={14} /> : <Bot size={14} />}
                          </div>

                          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--mfg-text-primary)' }}>
                            {ev.title}
                          </span>

                          {/* Department Badge */}
                          {ev.department && (
                            <span className="mfg-badge" style={{ fontSize: 10, fontWeight: 700 }}>
                              {ev.department}
                            </span>
                          )}

                          {/* Severity Badge */}
                          {ev.severity && (
                            <span
                              className={`mfg-badge ${ev.severity === 'CRITICAL' ? 'mfg-badge-critical' : 'mfg-badge-warning'}`}
                              style={{ fontSize: 10 }}
                            >
                              {ev.severity}
                            </span>
                          )}

                          {/* Source Badge: AGENT vs RULES */}
                          {ev.source && (
                            <span
                              className="mfg-badge"
                              style={{
                                fontSize: 10,
                                background: ev.source === 'AGENT' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(100, 116, 139, 0.12)',
                                color: ev.source === 'AGENT' ? '#16a34a' : 'var(--mfg-text-muted)',
                                border: `1px solid ${ev.source === 'AGENT' ? 'rgba(34, 197, 94, 0.25)' : 'rgba(100, 116, 139, 0.25)'}`,
                              }}
                            >
                              {ev.source === 'AGENT' ? 'AI Agent (Domo)' : 'Rule Engine'}
                            </span>
                          )}

                          {/* Auto-Executed Label */}
                          {isAction && ev.is_auto_executed && (
                            <span
                              className="mfg-badge"
                              style={{
                                fontSize: 10,
                                background: 'rgba(111, 61, 186, 0.12)',
                                color: 'var(--brand-purple)',
                                border: '1px solid rgba(111, 61, 186, 0.25)',
                                fontWeight: 700,
                              }}
                            >
                              ⚡ Auto-Executed (Agent 3 Policy)
                            </span>
                          )}

                          {isAction && !ev.is_auto_executed && ev.approved_by && (
                            <span
                              className="mfg-badge"
                              style={{
                                fontSize: 10,
                                background: 'rgba(34, 197, 94, 0.12)',
                                color: '#16a34a',
                              }}
                            >
                              👤 Approved by {ev.approved_by}
                            </span>
                          )}

                          {/* Status Badge */}
                          {ev.status && (
                            <span
                              className="mfg-badge"
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                background:
                                  ev.status === 'EXECUTED' || ev.status === 'APPROVED' || ev.status === 'success' || ev.status === 'FEASIBLE'
                                    ? 'rgba(34, 197, 94, 0.12)'
                                    : ev.status === 'FAILED' || ev.status === 'REJECTED' || ev.status === 'NOT_FEASIBLE'
                                    ? 'rgba(239, 68, 68, 0.12)'
                                    : 'rgba(245, 158, 11, 0.12)',
                                color:
                                  ev.status === 'EXECUTED' || ev.status === 'APPROVED' || ev.status === 'success' || ev.status === 'FEASIBLE'
                                    ? '#16a34a'
                                    : ev.status === 'FAILED' || ev.status === 'REJECTED' || ev.status === 'NOT_FEASIBLE'
                                    ? '#dc2626'
                                    : '#d97706',
                              }}
                            >
                              {ev.status}
                            </span>
                          )}
                        </div>

                        <span style={{ fontSize: 11, color: 'var(--mfg-text-muted)' }}>
                          {formatDate(ev.timestamp)}
                        </span>
                      </div>

                      {/* Event Details Body */}
                      {isAlert && (
                        <div style={{ fontSize: 12, color: 'var(--mfg-text-secondary)', lineHeight: 1.4 }}>
                          <div>{ev.description}</div>
                          {ev.delivery_impact && (
                            <div style={{ color: '#d97706', marginTop: 3, fontWeight: 600, fontSize: 11 }}>
                              <strong>Delivery Impact:</strong> {ev.delivery_impact}
                            </div>
                          )}
                          {ev.recommended_action && (
                            <div style={{ marginTop: 3, fontSize: 11, color: 'var(--mfg-text-primary)' }}>
                              <strong>Recommended Action:</strong> {ev.recommended_action}
                            </div>
                          )}
                        </div>
                      )}

                      {isAction && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                          {/* Failure real error display (Task 1 & Task 6) */}
                          {ev.status === 'FAILED' && (
                            <div
                              style={{
                                padding: '8px 12px',
                                borderRadius: 6,
                                background: 'rgba(239, 68, 68, 0.08)',
                                border: '1px solid rgba(239, 68, 68, 0.25)',
                                color: '#dc2626',
                                fontSize: 12,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                              }}
                            >
                              <AlertCircle size={15} style={{ flexShrink: 0 }} />
                              <div>
                                <strong>Execution Failed:</strong> {ev.error_message || ev.result?.error || ev.result?.message || 'Corrective action execution encountered an internal error.'}
                              </div>
                            </div>
                          )}

                          {ev.result && ev.status !== 'FAILED' && (
                            <div style={{ color: 'var(--mfg-text-secondary)', fontSize: 12 }}>
                              <strong>Result:</strong> {ev.result.message || JSON.stringify(ev.result)}
                              {ev.result.revised_proposal_id && (
                                <Link
                                  to={`/my-work?tab=approvals&proposalId=${ev.result.revised_proposal_id}`}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    marginLeft: 8,
                                    color: 'var(--brand-purple)',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    fontSize: 11,
                                  }}
                                >
                                  Open Proposal #{ev.result.revised_proposal_id} in Approvals <ChevronRight size={12} />
                                </Link>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {isProposal && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: 'var(--mfg-text-secondary)' }}>
                          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                            <span>Proposed Date: <strong>{formatDate(ev.proposed_date)}</strong></span>
                            {ev.revised_estimated_date && (
                              <span>Revised Date: <strong style={{ color: (ev.delay_days || 0) > 0 ? '#ef4444' : 'inherit' }}>{formatDate(ev.revised_estimated_date)}</strong></span>
                            )}
                            <span>Variance: <strong style={{ color: (ev.delay_days || 0) > 0 ? '#ef4444' : '#16a34a' }}>{(ev.delay_days || 0) > 0 ? `+${ev.delay_days} days (${ev.verdict || 'DELAYED'})` : 'On Time'}</strong></span>
                          </div>
                          {Array.isArray(ev.reasons) && ev.reasons.length > 0 && (
                            <div style={{ fontSize: 11, color: 'var(--mfg-text-muted)', marginTop: 2 }}>
                              <strong>Triggering Basis:</strong> {ev.reasons.join(' · ')}
                            </div>
                          )}
                          {ev.status === 'PENDING' && (
                            <div style={{ marginTop: 4 }}>
                              <Link
                                to={`/my-work?tab=approvals&proposalId=${ev.proposal_id}`}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  color: 'var(--brand-purple)',
                                  fontWeight: 700,
                                  fontSize: 11,
                                  textDecoration: 'none',
                                }}
                              >
                                Review Commercial Proposal #{ev.proposal_id} <ChevronRight size={12} />
                              </Link>
                            </div>
                          )}
                        </div>
                      )}

                      {isRun && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: 12, color: 'var(--mfg-text-secondary)' }}>
                              Executed {ev.steps_count || 0} tool-calling interaction steps. Provider: <strong>{ev.source === 'AGENT' ? 'Domo AI Engine' : 'Rules Engine'}</strong>
                            </div>
                            {ev.assessment_id && (
                              <Link
                                to={`/assessments?id=${encodeURIComponent(ev.assessment_id)}`}
                                style={{ fontSize: 11, color: 'var(--mfg-accent-primary)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                              >
                                Open Assessment View <ExternalLink size={11} />
                              </Link>
                            )}
                          </div>
                        </div>
                      )}

                      {isAssessment && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: 'var(--mfg-text-secondary)' }}>
                          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                            <span>Achievable Date: <strong>{formatDate(ev.estimated_delivery_date)}</strong></span>
                            <span>Schedule Variance: <strong style={{ color: (ev.delay_days || 0) > 0 ? '#ef4444' : '#16a34a' }}>{(ev.delay_days || 0) > 0 ? `+${ev.delay_days} days` : '0 days'}</strong></span>
                            <span>Verdict: <strong>{ev.verdict || 'ON_TIME'}</strong></span>
                          </div>

                          {/* Expandable Reasoning Steps Trace (Task 1) */}
                          {Array.isArray(ev.agent_reasoning) && ev.agent_reasoning.length > 0 && (
                            <div style={{ marginTop: 4 }}>
                              <button
                                type="button"
                                onClick={() => toggleEventExpanded(ev.id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: 0,
                                  color: 'var(--brand-purple)',
                                  fontSize: 11,
                                  fontWeight: 700,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                }}
                              >
                                {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                {isExpanded ? 'Hide Agent Reasoning Trace' : `View Agent Reasoning Steps (${ev.agent_reasoning.length} steps)`}
                              </button>

                              {isExpanded && (
                                <div
                                  style={{
                                    marginTop: 8,
                                    background: 'var(--mfg-bg-card)',
                                    borderRadius: 6,
                                    border: '1px solid var(--mfg-border-subtle)',
                                    padding: '8px 12px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 8,
                                  }}
                                >
                                  {ev.agent_reasoning.map((step, idx) => (
                                    <div key={idx} style={{ fontSize: 11, borderBottom: idx < ev.agent_reasoning.length - 1 ? '1px solid var(--mfg-border-subtle)' : 'none', paddingBottom: 6 }}>
                                      <div style={{ fontWeight: 700, color: 'var(--mfg-text-primary)' }}>
                                        Step {step.step || idx + 1}: Tool <code>{step.tool_name || step.action}</code>
                                      </div>
                                      {step.thought && (
                                        <div style={{ color: 'var(--mfg-text-secondary)', marginTop: 2, fontStyle: 'italic' }}>
                                          "{step.thought}"
                                        </div>
                                      )}
                                      {step.tool_result && (
                                        <div style={{ color: 'var(--mfg-text-muted)', marginTop: 2, fontFamily: 'monospace', fontSize: 10 }}>
                                          Output: {typeof step.tool_result === 'object' ? JSON.stringify(step.tool_result).slice(0, 200) : String(step.tool_result).slice(0, 200)}...
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* AUDIT TRAIL & SYSTEM EVENT HISTORY */}
          <div className="card" style={{ background: 'var(--mfg-bg-card)', border: '1px solid var(--mfg-border-default)', borderRadius: 12, padding: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--mfg-text-primary)', marginBottom: 14 }}>
              System Audit Trail &amp; Milestone Events
            </div>
            {events.length === 0 ? (
              <div style={{ color: 'var(--mfg-text-muted)', fontSize: 13 }}>No historical milestone events logged.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {events.map((ev, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--mfg-accent-primary)', marginTop: 6 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--mfg-text-primary)' }}>
                        {ev.event_type || 'SYSTEM_EVENT'}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--mfg-text-secondary)' }}>
                        {ev.description || JSON.stringify(ev)}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--mfg-text-muted)', marginTop: 2 }}>
                        {formatDate(ev.timestamp || ev.created_at)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
