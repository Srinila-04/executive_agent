import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useToast } from '../context/ToastContext'
import {
  CheckSquare,
  ShieldCheck,
  BellRing,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  UserCheck,
  Send,
  Calendar,
  MessageSquare,
  Check,
  Building2,
  Save,
  X,
  Package,
  Sparkles,
  Mail,
} from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { workflowApi } from '../api/workflow.api'
import { agentsApi } from '../api/agents.api'
import { useAuth } from '../context/AuthContext'
import {
  canManageApprovals,
  isCustomerService,
  isOperational,
  isAdmin,
  canAcknowledgeAlert,
  canResolveAlert,
  canRecordCustomerCommunication,
} from '../utils/permissions'
import { formatDate, formatINR, formatNumber } from '../utils/format'

export default function MyWork() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { user } = useAuth()
  const canApprove = canManageApprovals(user)
  const isCS = isCustomerService(user)
  const isOp = isOperational(user)
  const isAdministrator = isAdmin(user)

  const [searchParams] = useSearchParams()
  const urlTab = searchParams.get('tab')
  const targetProposalId = searchParams.get('proposalId')

  // Default active tab based on role, or URL parameter
  const defaultTab = urlTab === 'approvals' ? 'approvals' : canApprove ? 'approvals' : isCS ? 'cs_risks' : 'department_issues'
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [proposalFilter, setProposalFilter] = useState('ALL')
  const [actionNotice, setActionNotice] = useState('')
  const [actingId, setActingId] = useState(null)

  // Resolution modal state
  const [resolvingAlert, setResolvingAlert] = useState(null)
  const [resolutionNotes, setResolutionNotes] = useState('')

  // Customer communication modal state
  const [communicatingAlert, setCommunicatingAlert] = useState(null)
  const [communicationNotes, setCommunicationNotes] = useState('')

  // 3-Day SLA follow-up state
  const [isCheckingFollowups, setIsCheckingFollowups] = useState(false)
  const [sendingFollowupAlertId, setSendingFollowupAlertId] = useState(null)

  // Query work queue data first so workData is defined for useEffect hooks
  const {
    data: workData = { proposals: [], alerts: [], assessments: [] },
    isLoading: loading,
    refetch: loadData,
  } = useQuery({
    queryKey: ['my-work-queue'],
    queryFn: async () => {
      const promises = [
        workflowApi.listProposals().catch(() => []),
        agentsApi.listAlerts({ page_size: 100 }).catch(() => []),
        agentsApi.listAssessments({ limit: 100 }).catch(() => []),
      ]
      const [proposalsRes, alertsRes, assessmentsRes] = await Promise.all(promises)
      return {
        proposals: Array.isArray(proposalsRes) ? proposalsRes : (proposalsRes?.items || []),
        alerts: Array.isArray(alertsRes) ? alertsRes : [],
        assessments: Array.isArray(assessmentsRes) ? assessmentsRes : (assessmentsRes?.items || []),
      }
    },
    staleTime: 0,
    refetchOnMount: 'always',
  })

  useEffect(() => {
    if (urlTab === 'approvals') {
      setActiveTab('approvals')
    }
  }, [urlTab])

  useEffect(() => {
    if (targetProposalId && activeTab === 'approvals') {
      const timer = setTimeout(() => {
        const el = document.getElementById(`proposal-card-${targetProposalId}`)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [targetProposalId, activeTab, workData.proposals])

  // Auto-clear action notice after 6s
  useEffect(() => {
    if (actionNotice) {
      const timer = setTimeout(() => setActionNotice(''), 6000)
      return () => clearTimeout(timer)
    }
  }, [actionNotice])

  const allProposals = workData.proposals
  const pendingProposals = allProposals.filter((p) => p.status === 'PENDING')
  const proposals = allProposals.filter((p) => {
    if (proposalFilter === 'PENDING') return p.status === 'PENDING'
    if (proposalFilter === 'APPROVED') return p.status === 'APPROVED'
    return true
  })
  const alerts = workData.alerts
  const assessments = workData.assessments || []

  const handleApprove = async (proposalId) => {
    setActingId(proposalId)
    const prevWorkData = queryClient.getQueryData(['my-work-queue'])
    const targetProposal = (workData.proposals || []).find((p) => p.id === proposalId)
    const orderLabel = targetProposal?.customer_order_id || `Proposal #${proposalId}`

    // Optimistically remove proposal immediately so it vanishes from the pending queue
    queryClient.setQueryData(['my-work-queue'], (old) => {
      if (!old) return old
      return {
        ...old,
        proposals: (old.proposals || []).filter((p) => p.id !== proposalId),
      }
    })

    // Show toast and action notice IMMEDIATELY on click
    const successMsg = `Order ${orderLabel} commercial commitment approved. Agent 3 monitoring has been activated.`
    setActionNotice(successMsg)
    const toastId = toast.success(successMsg, {
      title: 'Commitment Approved',
      duration: 5000,
    })

    try {
      await workflowApi.approveProposal(proposalId, 'Approved via My Work centralized commercial approvals queue.')
      queryClient.invalidateQueries({ queryKey: ['my-work-queue'] })
      queryClient.invalidateQueries({ queryKey: ['assessments-list'] })
      queryClient.invalidateQueries({ queryKey: ['order-monitoring'] })
      queryClient.invalidateQueries({ queryKey: ['orders-list'] })
    } catch (err) {
      if (toastId) toast.dismiss(toastId)
      if (prevWorkData) {
        queryClient.setQueryData(['my-work-queue'], prevWorkData)
      }
      const errMsg = `Approval failed: ${err?.response?.data?.detail || err.message}`
      setActionNotice(errMsg)
      toast.error(errMsg, { title: 'Approval Failed' })
    } finally {
      setActingId(null)
    }
  }

  const handleReject = async (proposalId) => {
    setActingId(proposalId)
    const prevWorkData = queryClient.getQueryData(['my-work-queue'])
    const targetProposal = (workData.proposals || []).find((p) => p.id === proposalId)
    const orderLabel = targetProposal?.customer_order_id || `Proposal #${proposalId}`

    // Optimistically remove proposal immediately so it vanishes from the pending queue
    queryClient.setQueryData(['my-work-queue'], (old) => {
      if (!old) return old
      return {
        ...old,
        proposals: (old.proposals || []).filter((p) => p.id !== proposalId),
      }
    })

    // Show toast and action notice IMMEDIATELY on click
    const rejectMsg = `Commitment proposal for ${orderLabel} rejected. Department teams have been notified.`
    setActionNotice(rejectMsg)
    const toastId = toast.info(rejectMsg, { title: 'Proposal Rejected' })

    try {
      await workflowApi.rejectProposal(proposalId, 'Rejected from My Work queue - requires rescheduled production or revised date.')
      queryClient.invalidateQueries({ queryKey: ['my-work-queue'] })
      queryClient.invalidateQueries({ queryKey: ['assessments-list'] })
    } catch (err) {
      if (toastId) toast.dismiss(toastId)
      if (prevWorkData) {
        queryClient.setQueryData(['my-work-queue'], prevWorkData)
      }
      const errMsg = `Rejection failed: ${err?.response?.data?.detail || err.message}`
      setActionNotice(errMsg)
      toast.error(errMsg, { title: 'Rejection Failed' })
    } finally {
      setActingId(null)
    }
  }

  const handleAcknowledge = async (alertId) => {
    try {
      await agentsApi.acknowledgeAlert(alertId)
      const ackMsg = `Alert #${alertId} acknowledged.`
      setActionNotice(ackMsg)
      toast.info(ackMsg, { title: 'Alert Acknowledged' })
      queryClient.invalidateQueries({ queryKey: ['my-work-queue'] })
      loadData()
    } catch (err) {
      const errMsg = `Acknowledgement failed: ${err?.response?.data?.detail || err.message}`
      setActionNotice(errMsg)
      toast.error(errMsg, { title: 'Action Failed' })
    }
  }

  const handleOpenResolve = (alert) => {
    setResolvingAlert(alert)
    setResolutionNotes('')
  }

  const handleSubmitResolve = async (e) => {
    e.preventDefault()
    if (!resolvingAlert || !resolutionNotes.trim()) return
    const alertId = resolvingAlert.id
    try {
      await agentsApi.resolveAlert(alertId, resolutionNotes.trim())
      const resMsg = `Alert #${alertId} resolved. Resolution email notifications dispatched.`
      setActionNotice(resMsg)
      toast.success(resMsg, { title: 'Alert Resolved' })
      setResolvingAlert(null)
      queryClient.invalidateQueries({ queryKey: ['my-work-queue'] })
      queryClient.invalidateQueries({ queryKey: ['order-monitoring'] })
      loadData()
    } catch (err) {
      const errMsg = `Resolution failed: ${err?.response?.data?.detail || err.message}`
      setActionNotice(errMsg)
      toast.error(errMsg, { title: 'Resolution Failed' })
    }
  }

  const handleOpenCommunication = (alert) => {
    setCommunicatingAlert(alert)
    setCommunicationNotes(alert.customer_communication_notes || '')
  }

  const handleSubmitCommunication = async (e) => {
    e.preventDefault()
    if (!communicatingAlert || !communicationNotes.trim()) return
    try {
      await agentsApi.recordCustomerCommunication(communicatingAlert.id, communicationNotes.trim())
      const commMsg = `Customer communication recorded for order ${communicatingAlert.customer_order_id}.`
      setActionNotice(commMsg)
      toast.success(commMsg, { title: 'Customer Notified' })
      setCommunicatingAlert(null)
      loadData()
    } catch (err) {
      const errMsg = `Communication recording failed: ${err?.response?.data?.detail || err.message}`
      setActionNotice(errMsg)
      toast.error(errMsg, { title: 'Recording Failed' })
    }
  }

  const handleCheckFollowups = async () => {
    setIsCheckingFollowups(true)
    try {
      const res = await agentsApi.checkFollowups()
      queryClient.invalidateQueries({ queryKey: ['my-work-queue'] })
      queryClient.invalidateQueries({ queryKey: ['order-monitoring'] })
      await loadData()
      if (res.followups_sent > 0) {
        const msg = `Agent 3 Follow-Up: Dispatched ${res.followups_sent} escalation emails across ${res.overdue_count} unresolved alerts (>3 days).`
        setActionNotice(msg)
        toast.success(msg, { title: '3-Day Follow-Up Dispatched' })
      } else {
        const msg = `3-Day SLA Check: All active alerts are within the 3-day resolution window or recently notified.`
        setActionNotice(msg)
        toast.info(msg, { title: 'SLA Status Verified' })
      }
    } catch (err) {
      const errMsg = `Follow-up check failed: ${err?.response?.data?.detail || err.message}`
      setActionNotice(errMsg)
      toast.error(errMsg, { title: 'Check Failed' })
    } finally {
      setIsCheckingFollowups(false)
    }
  }

  const handleSendSingleFollowup = async (alertId) => {
    setSendingFollowupAlertId(alertId)
    try {
      const res = await agentsApi.sendFollowup(alertId, true)
      queryClient.invalidateQueries({ queryKey: ['my-work-queue'] })
      queryClient.invalidateQueries({ queryKey: ['order-monitoring'] })
      await loadData()
      const msg = `Agent 3 follow-up dispatched for Order ${res.customer_order_id} (Day ${res.days_unresolved} unresolved).`
      setActionNotice(msg)
      toast.success(msg, { title: 'Follow-Up Email Dispatched' })
    } catch (err) {
      const errMsg = `Follow-up dispatch failed: ${err?.response?.data?.detail || err.message}`
      setActionNotice(errMsg)
      toast.error(errMsg, { title: 'Dispatch Failed' })
    } finally {
      setSendingFollowupAlertId(null)
    }
  }

  // Filter alerts by role context
  const userDept = (user?.department || '').toUpperCase().trim()

  const departmentIssues = alerts.filter((a) => {
    if (isAdministrator) return true
    if (isOp && userDept) return a.department?.toUpperCase().trim() === userDept
    return true
  })

  const csDeliveryRisks = alerts.filter((a) => {
    return (
      a.severity === 'CRITICAL' ||
      a.severity === 'HIGH' ||
      Boolean(a.delivery_impact) ||
      ['DELIVERY_DATE_BREACHED', 'CARRIER_TRANSIT_DELAY', 'SHIPMENT_EXCEPTION', 'RAW_MATERIAL_SHORTAGE', 'PRODUCTION_DELAY'].includes(a.risk_category)
    )
  })

  return (
    <div className="page-stack">
      {/* PAGE HEADER */}
      <div className="page-intro" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="eyebrow" style={{ color: 'var(--mfg-accent-primary)' }}>
            <span className="eyebrow-dot" style={{ background: 'var(--mfg-accent-primary)' }} />
            CENTRALIZED OPERATIONAL WORK QUEUE
          </div>
          <h1 style={{ margin: '4px 0 0 0', fontSize: 26, fontWeight: 700, color: 'var(--mfg-text-primary)' }}>
            My Work
          </h1>
        </div>
        <button type="button" className="button button-secondary" onClick={loadData} style={{ fontSize: 12 }}>
          <RotateCcw size={14} /> Refresh Queue
        </button>
      </div>

      {actionNotice && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            background: actionNotice.includes('failed') ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)',
            border: `1px solid ${actionNotice.includes('failed') ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.4)'}`,
            color: actionNotice.includes('failed') ? '#EF4444' : '#22C55E',
            fontSize: 13,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {actionNotice.includes('failed') ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
            <span>{actionNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionNotice('')}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'inherit',
              padding: 2,
              display: 'flex',
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* TABS */}
      <div style={{ display: 'flex', gap: 10, borderBottom: '1px solid var(--mfg-border-default)', paddingBottom: 10 }}>
        {/* Tab 1: Department Issues */}
        {(isOp || isAdministrator) && (
          <button
            type="button"
            onClick={() => setActiveTab('department_issues')}
            className={`button ${activeTab === 'department_issues' ? 'button-primary' : 'button-secondary'}`}
            style={{ fontSize: 12 }}
          >
            <Building2 size={15} /> Department Issues ({departmentIssues.length})
            {userDept && <span style={{ opacity: 0.8, fontSize: 10 }}>({userDept})</span>}
          </button>
        )}

        {/* Tab 2: Customer Service Delivery Risks */}
        {(isCS || isAdministrator) && (
          <button
            type="button"
            onClick={() => setActiveTab('cs_risks')}
            className={`button ${activeTab === 'cs_risks' ? 'button-primary' : 'button-secondary'}`}
            style={{ fontSize: 12 }}
          >
            <MessageSquare size={15} /> Customer Service Delivery Risks ({csDeliveryRisks.length})
          </button>
        )}

        {/* Tab 3: Commercial Approvals */}
        <button
          type="button"
          onClick={() => setActiveTab('approvals')}
          className={`button ${activeTab === 'approvals' ? 'button-primary' : 'button-secondary'}`}
          style={{ fontSize: 12 }}
        >
          <ShieldCheck size={15} /> Commercial Approvals ({pendingProposals.length} Pending Review)
        </button>
      </div>

      {/* TAB: DEPARTMENT ASSIGNED ISSUES */}
      {activeTab === 'department_issues' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {departmentIssues.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--mfg-bg-surface)', border: '1px solid var(--mfg-border-subtle)', borderRadius: 8, padding: '8px 14px', marginBottom: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <Clock size={15} style={{ color: departmentIssues.some((a) => a.is_followup_due && a.status !== 'RESOLVED') ? '#ef4444' : '#10b981' }} />
                <span>
                  <strong>Surveillance SLA:</strong> Issues unresolved &gt;3 days trigger automated Agent 3 escalation emails.
                  {departmentIssues.filter((a) => a.is_followup_due && a.status !== 'RESOLVED').length > 0 && (
                    <span style={{ color: '#ef4444', fontWeight: 700, marginLeft: 8 }}>
                      ({departmentIssues.filter((a) => a.is_followup_due && a.status !== 'RESOLVED').length} issue(s) reached 3+ days unresolved)
                    </span>
                  )}
                </span>
              </div>
              <button
                type="button"
                className="button button-secondary"
                onClick={handleCheckFollowups}
                disabled={isCheckingFollowups}
                style={{ fontSize: 11, padding: '3px 10px', minHeight: 28, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                title="Scan all issues and dispatch follow-up emails for any unresolved >3 days"
              >
                <Mail size={13} /> {isCheckingFollowups ? 'Checking SLA...' : 'Check 3-Day Follow-Ups'}
              </button>
            </div>
          )}

          {departmentIssues.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: 'center', background: 'var(--mfg-bg-card)', border: '1px solid var(--mfg-border-default)', borderRadius: 10 }}>
              <CheckCircle2 size={36} style={{ color: '#22C55E', margin: '0 auto 10px auto' }} />
              <h3 style={{ margin: 0, color: 'var(--mfg-text-primary)', fontSize: 16 }}>Department Queue Clean</h3>
              <p style={{ color: 'var(--mfg-text-secondary)', fontSize: 13, marginTop: 4 }}>
                No active operational issues or holds pending for your department.
              </p>
            </div>
          ) : (
            departmentIssues.map((al) => {
              const isCrit = al.severity === 'CRITICAL'
              const canAck = canAcknowledgeAlert(user, al.department) && al.status === 'OPEN'
              const canRes = canResolveAlert(user, al.department) && al.status !== 'RESOLVED'

              return (
                <div key={al.id} className="card" style={{ background: 'var(--mfg-bg-card)', border: '1px solid', borderColor: isCrit ? '#ef4444' : 'var(--mfg-border-default)', borderRadius: 10, padding: '12px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span className={`mfg-badge ${isCrit ? 'mfg-badge-critical' : 'mfg-badge-warning'}`} style={{ fontSize: 11, padding: '2px 8px' }}>
                        {al.severity}
                      </span>
                      <span className="mfg-badge" style={{ fontWeight: 700, fontSize: 11, padding: '2px 8px' }}>
                        {al.department}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--mfg-text-primary)' }}>
                        {al.title}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--mfg-text-muted)' }}>
                        • Order: <strong>{al.customer_order_id}</strong>
                      </span>
                      {al.followup_count > 0 ? (
                        <span
                          className="mfg-badge"
                          style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fcd34d', fontSize: 11, padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                          title={`Agent 3 automated 3-day follow-up escalation email dispatched (Sent on Day ${al.days_unresolved || 3})`}
                        >
                          <Mail size={12} /> Follow-Up Sent (Day {al.days_unresolved || 3})
                        </span>
                      ) : al.is_followup_due ? (
                        <span
                          className="mfg-badge"
                          style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', fontSize: 11, padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                          title="Alert unresolved for 3+ days since initial risk notice. Follow-up escalation active."
                        >
                          <Clock size={12} /> 3+ Days Unresolved
                        </span>
                      ) : null}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--mfg-text-muted)' }}>
                      Detected: {formatDate(al.detected_at)}
                    </span>
                  </div>

                  <p style={{ margin: '6px 0', fontSize: 12, color: 'var(--mfg-text-secondary)', lineHeight: 1.4 }}>
                    {al.description}
                  </p>

                  {al.delivery_impact && (
                    <div style={{ fontSize: 11, color: '#f59e0b', marginBottom: 6 }}>
                      <strong>Delivery Impact:</strong> {al.delivery_impact}
                    </div>
                  )}

                  {al.recommended_action && (
                    <div style={{ fontSize: 11, color: 'var(--mfg-text-primary)', background: 'var(--mfg-bg-surface)', padding: '6px 10px', borderRadius: 6, marginBottom: 8, border: '1px solid var(--mfg-border-subtle)' }}>
                      <strong>Recommended Corrective Action:</strong> {al.recommended_action}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--mfg-border-subtle)', paddingTop: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 11, color: 'var(--mfg-text-muted)' }}>
                        Status: <strong style={{ color: al.status === 'RESOLVED' ? '#22c55e' : '#f59e0b' }}>{al.status}</strong>
                      </span>
                      {al.first_email_sent_at && (
                        <span style={{ fontSize: 10, color: 'var(--mfg-text-muted)' }}>
                          First Email: {formatDate(al.first_email_sent_at)} ({al.days_unresolved}d ago)
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link
                        to={al.customer_order_id?.startsWith('PRE-')
                          ? `/assessments?id=${encodeURIComponent(al.customer_order_id.replace(/^PRE-/, ''))}`
                          : `/orders/${encodeURIComponent(al.customer_order_id)}`}
                        className="button button-secondary"
                        style={{ fontSize: 11, padding: '3px 10px', textDecoration: 'none', minHeight: 28 }}
                      >
                        View Order <ExternalLink size={12} />
                      </Link>

                      {al.status !== 'RESOLVED' && al.is_followup_due && (
                        <button
                          type="button"
                          className="button button-secondary"
                          onClick={() => handleSendSingleFollowup(al.id)}
                          disabled={sendingFollowupAlertId === al.id}
                          style={{ fontSize: 11, padding: '3px 10px', minHeight: 28, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                          title="Dispatch immediate Agent 3 follow-up escalation email"
                        >
                          <Mail size={12} />
                          {sendingFollowupAlertId === al.id ? 'Sending...' : 'Send Follow-Up'}
                        </button>
                      )}

                      {canAck && (
                        <button type="button" className="button button-secondary" onClick={() => handleAcknowledge(al.id)} style={{ fontSize: 11, padding: '3px 10px', minHeight: 28 }}>
                          <Check size={12} /> Acknowledge Alert
                        </button>
                      )}

                      {canRes && (
                        <button type="button" className="button button-primary" onClick={() => handleOpenResolve(al)} style={{ fontSize: 11, padding: '3px 12px', minHeight: 28 }}>
                          Record Corrective Action &amp; Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* TAB: CUSTOMER SERVICE DELIVERY RISKS */}
      {activeTab === 'cs_risks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {csDeliveryRisks.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: 'center', background: 'var(--mfg-bg-card)', border: '1px solid var(--mfg-border-default)', borderRadius: 10 }}>
              <CheckCircle2 size={36} style={{ color: '#22C55E', margin: '0 auto 10px auto' }} />
              <h3 style={{ margin: 0, color: 'var(--mfg-text-primary)', fontSize: 16 }}>No Delivery Risks Pending Communication</h3>
              <p style={{ color: 'var(--mfg-text-secondary)', fontSize: 13, marginTop: 4 }}>
                All committed orders are progressing without customer-impacting delivery variances.
              </p>
            </div>
          ) : (
            csDeliveryRisks.map((al) => {
              const isCommunicated = Boolean(al.customer_communicated)
              return (
                <div key={al.id} className="card" style={{ background: 'var(--mfg-bg-card)', border: '1px solid var(--mfg-border-default)', borderRadius: 10, padding: '12px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span className={`mfg-badge ${al.severity === 'CRITICAL' ? 'mfg-badge-critical' : 'mfg-badge-warning'}`} style={{ fontSize: 11, padding: '2px 8px' }}>
                        {al.severity}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--mfg-text-primary)' }}>
                        Delivery Risk Alert – Order {al.customer_order_id}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--mfg-text-muted)' }}>
                        • Dept: <strong>{al.department}</strong>
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {isCommunicated ? (
                        <span style={{ fontSize: 11, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                          <CheckCircle2 size={13} /> Customer Notified
                        </span>
                      ) : (
                        <span style={{ fontSize: 11, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                          <Clock size={13} /> Pending Customer Communication
                        </span>
                      )}
                    </div>
                  </div>

                  <p style={{ margin: '6px 0', fontSize: 12, color: 'var(--mfg-text-secondary)', lineHeight: 1.4 }}>
                    {al.description}
                  </p>

                  <div style={{ background: 'var(--mfg-bg-surface)', padding: '6px 10px', borderRadius: 6, fontSize: 11, color: 'var(--mfg-text-primary)', marginBottom: 8, border: '1px solid var(--mfg-border-subtle)' }}>
                    <strong>Delivery Impact:</strong> {al.delivery_impact || 'Potential schedule extension under verification.'}
                    <div style={{ fontSize: 10, color: 'var(--mfg-text-muted)', marginTop: 2 }}>
                      Directive: The revised delivery date has not yet been confirmed. Do not promise unverified dates to the customer.
                    </div>
                  </div>

                  {al.customer_communication_notes && (
                    <div style={{ background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '6px 10px', borderRadius: 6, fontSize: 11, color: '#16a34a', marginBottom: 8 }}>
                      <strong>Customer Communication Log:</strong> {al.customer_communication_notes}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid var(--mfg-border-subtle)', paddingTop: 8 }}>
                    <Link
                      to={al.customer_order_id?.startsWith('PRE-')
                        ? `/assessments?id=${encodeURIComponent(al.customer_order_id.replace(/^PRE-/, ''))}`
                        : `/orders/${encodeURIComponent(al.customer_order_id)}`}
                      className="button button-secondary"
                      style={{ fontSize: 11, padding: '3px 10px', textDecoration: 'none', minHeight: 28 }}
                    >
                      Inspect Order <ExternalLink size={12} />
                    </Link>

                    {canRecordCustomerCommunication(user) && (
                      <button type="button" className="button button-primary" onClick={() => handleOpenCommunication(al)} style={{ fontSize: 11, padding: '3px 12px', minHeight: 28 }}>
                        <MessageSquare size={13} /> Record Communication Note
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* TAB: PENDING COMMERCIAL APPROVALS */}
      {activeTab === 'approvals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {!canApprove && (
            <div style={{ padding: 12, borderRadius: 8, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#F59E0B', fontSize: 12 }}>
              <strong>Commercial Authority Notice:</strong> You are signed in as <code>{user?.role || 'user'}</code> without commercial commitment approval permission. Only authorized Customer Service Approvers and Administrators can execute commercial sign-offs.
            </div>
          )}

          {/* Sub-filter pills for proposals */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--mfg-text-muted)', textTransform: 'uppercase' }}>Filter:</span>
            <button
              type="button"
              onClick={() => setProposalFilter('ALL')}
              className={`button ${proposalFilter === 'ALL' ? 'button-primary' : 'button-secondary'}`}
              style={{ fontSize: 11, padding: '3px 10px', minHeight: 26 }}
            >
              All ({allProposals.length})
            </button>
            <button
              type="button"
              onClick={() => setProposalFilter('PENDING')}
              className={`button ${proposalFilter === 'PENDING' ? 'button-primary' : 'button-secondary'}`}
              style={{ fontSize: 11, padding: '3px 10px', minHeight: 26 }}
            >
              Pending Human Review ({pendingProposals.length})
            </button>
            <button
              type="button"
              onClick={() => setProposalFilter('APPROVED')}
              className={`button ${proposalFilter === 'APPROVED' ? 'button-primary' : 'button-secondary'}`}
              style={{ fontSize: 11, padding: '3px 10px', minHeight: 26 }}
            >
              Approved ({allProposals.filter((p) => p.status === 'APPROVED').length})
            </button>
          </div>

          {/* TASK 4: REVISED PROPOSAL WAITING INDICATOR BANNER */}
          {allProposals.filter((p) => (p.revision || 1) > 1 && p.status === 'PENDING').length > 0 && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                color: '#d97706',
                fontSize: 12,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 6,
              }}
            >
              <AlertTriangle size={16} />
              <div>
                <strong>Operational Variance Alert:</strong>{' '}
                {allProposals.filter((p) => (p.revision || 1) > 1 && p.status === 'PENDING').length} Reassessment Revision(s) waiting for Commercial Review due to operational risks.
              </div>
            </div>
          )}

          {proposals.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: 'center', background: 'var(--mfg-bg-card)', border: '1px solid var(--mfg-border-default)', borderRadius: 10 }}>
              <CheckCircle2 size={36} style={{ color: '#22C55E', margin: '0 auto 10px auto' }} />
              <h3 style={{ margin: 0, color: 'var(--mfg-text-primary)', fontSize: 16 }}>All Caught Up!</h3>
              <p style={{ color: 'var(--mfg-text-secondary)', fontSize: 13, marginTop: 4 }}>
                There are no commercial promise-date proposals matching the selected filter.
              </p>
            </div>
          ) : (
            proposals.map((p) => {
              const isPreOrder = Boolean(p.customer_order_id?.startsWith('PRE-'))
              const cleanAssessmentId = isPreOrder ? p.customer_order_id.replace(/^PRE-/, '') : null
              const journeyLink = isPreOrder
                ? `/assessments?id=${encodeURIComponent(cleanAssessmentId)}`
                : `/orders/${encodeURIComponent(p.customer_order_id)}`
              const isApproved = p.status === 'APPROVED'
              const isRejected = p.status === 'REJECTED'

              // Lookup matching assessment for rich commercial context
              const assessment = assessments.find(
                (a) =>
                  a.assessment_id === cleanAssessmentId ||
                  a.customer_order_id === p.customer_order_id ||
                  a.customer_order_id === cleanAssessmentId ||
                  a.id === cleanAssessmentId ||
                  a.proposal_id === p.id
              )

              const customerName = assessment?.customer_name || 'Retailer North'
              const customerId = assessment?.customer_id || 'CUS-001'
              const productName = assessment?.product_name || 'Aster 15 128GB (SPH-A15-128)'
              const orderQty = assessment?.order_qty || 250
              const unitPrice = assessment?.unit_price_inr || 14500
              const totalValue = orderQty * unitPrice
              const requestedDate = assessment?.requested_delivery_date
              const daysVariance = assessment?.days_variance ?? 0
              const readyCount = assessment?.readiness_records?.filter((r) => r.readiness_status === 'READY').length ?? 7

              const isRevision = (p.revision || 1) > 1
              const isTarget = targetProposalId && Number(targetProposalId) === p.id

              // Triggering alert extraction (Task 2)
              let triggeringAlert = null
              if (isRevision && Array.isArray(p.reasons)) {
                const alertMatch = p.reasons.join(' ').match(/RiskAlert #?(\d+)/i) || p.reasons.join(' ').match(/Alert #?(\d+)/i)
                if (alertMatch) {
                  const alertId = parseInt(alertMatch[1], 10)
                  triggeringAlert = alerts.find((a) => a.id === alertId)
                }
              }

              // Previous proposal for comparison (Task 2)
              let previousProposal = null
              if (isRevision) {
                const prevRev = (p.revision || 1) - 1
                previousProposal = allProposals.find(
                  (other) =>
                    other.id !== p.id &&
                    other.customer_order_id === p.customer_order_id &&
                    (other.revision || 1) === prevRev
                )
              }

              return (
                <div
                  key={p.id}
                  id={`proposal-card-${p.id}`}
                  className="card"
                  style={{
                    background: 'var(--mfg-bg-card)',
                    border: isTarget
                      ? '2px solid var(--brand-purple)'
                      : isRevision && p.status === 'PENDING'
                      ? '1px solid rgba(245, 158, 11, 0.6)'
                      : '1px solid var(--mfg-border-default)',
                    borderRadius: 10,
                    padding: '12px 16px',
                    boxShadow: isTarget ? '0 0 0 3px rgba(111, 61, 186, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Top Bar: Title, Badge, Link */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: 'var(--mfg-text-primary)' }}>
                        <Package size={15} style={{ color: 'var(--brand-purple)' }} />
                        {isPreOrder ? `Pre-Order Assessment (${cleanAssessmentId})` : `Order #${p.customer_order_id}`}
                      </span>

                      {/* Revision Number Badge (Task 2) */}
                      {isRevision && (
                        <span
                          className="mfg-badge"
                          style={{
                            background: 'rgba(111, 61, 186, 0.12)',
                            color: 'var(--brand-purple)',
                            border: '1px solid rgba(111, 61, 186, 0.25)',
                            fontWeight: 800,
                            fontSize: 11,
                            padding: '2px 8px',
                          }}
                        >
                          ⚡ Reassessment Revision #{p.revision}
                        </span>
                      )}

                      {isTarget && (
                        <span
                          className="mfg-badge"
                          style={{
                            background: 'var(--brand-purple)',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: 11,
                            padding: '2px 8px',
                          }}
                        >
                          🎯 Selected For Review
                        </span>
                      )}

                      {isApproved ? (
                        <span className="mfg-badge" style={{ background: 'rgba(34, 197, 94, 0.12)', color: '#16a34a', border: '1px solid rgba(34, 197, 94, 0.25)', fontWeight: 700, fontSize: 11, padding: '2px 8px' }}>
                          ✓ Human Approved Commitment
                        </span>
                      ) : isRejected ? (
                        <span className="mfg-badge" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#dc2626', border: '1px solid rgba(239, 68, 68, 0.25)', fontWeight: 700, fontSize: 11, padding: '2px 8px' }}>
                          ✕ Rejected
                        </span>
                      ) : (
                        <span className="mfg-badge mfg-badge-warning" style={{ fontSize: 11, padding: '2px 8px' }}>
                          Pending Human Commercial Review
                        </span>
                      )}
                    </div>
                    <Link
                      to={journeyLink}
                      style={{
                        fontSize: 11,
                        color: 'var(--mfg-accent-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        textDecoration: 'none',
                        fontWeight: 600,
                      }}
                    >
                      View Full Journey <ExternalLink size={12} />
                    </Link>
                  </div>

                  {/* TASK 2: TRIGGERING ALERT DISPLAY FOR REVISION > 1 */}
                  {isRevision && (
                    <div
                      style={{
                        background: 'rgba(239, 68, 68, 0.05)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        padding: '8px 12px',
                        borderRadius: 8,
                        fontSize: 11,
                        color: 'var(--mfg-text-primary)',
                        marginBottom: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 6,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <AlertTriangle size={14} style={{ color: '#ef4444' }} />
                        <strong style={{ color: '#dc2626' }}>Triggering Operational Risk:</strong>
                        {triggeringAlert ? (
                          <>
                            <span className={`mfg-badge ${triggeringAlert.severity === 'CRITICAL' ? 'mfg-badge-critical' : 'mfg-badge-warning'}`} style={{ fontSize: 10 }}>
                              {triggeringAlert.severity}
                            </span>
                            <span className="mfg-badge" style={{ fontSize: 10, fontWeight: 700 }}>
                              {triggeringAlert.department}
                            </span>
                            <span style={{ fontWeight: 600 }}>{triggeringAlert.title}</span>
                          </>
                        ) : (
                          <span style={{ color: 'var(--mfg-text-secondary)' }}>
                            {p.reasons?.join(' · ') || 'Automated operational risk variance detected by Agent 3 surveillance'}
                          </span>
                        )}
                      </div>
                      {triggeringAlert && (
                        <span style={{ fontSize: 10, color: 'var(--mfg-text-muted)' }}>Alert #{triggeringAlert.id}</span>
                      )}
                    </div>
                  )}

                  {/* TASK 2: SIDE-BY-SIDE PROPOSAL COMPARISON FOR REVISION > 1 */}
                  {isRevision && (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: 10,
                        background: 'var(--mfg-bg-surface)',
                        padding: 10,
                        borderRadius: 8,
                        border: '1px solid var(--mfg-border-subtle)',
                        marginBottom: 10,
                      }}
                    >
                      {/* Previous Baseline Proposal */}
                      <div
                        style={{
                          padding: '8px 12px',
                          borderRadius: 6,
                          background: 'var(--mfg-bg-card)',
                          border: '1px solid var(--mfg-border-subtle)',
                        }}
                      >
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--mfg-text-muted)', textTransform: 'uppercase' }}>
                          Baseline / Previous Proposal (Rev #{ (p.revision || 1) - 1 })
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--mfg-text-primary)', marginTop: 4 }}>
                          Promised Date: {previousProposal ? formatDate(previousProposal.proposed_date) : formatDate(p.promised_date || requestedDate)}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--mfg-text-secondary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>Status:</span>
                          <span className="mfg-badge" style={{ fontSize: 10, padding: '1px 6px' }}>
                            {previousProposal?.status || 'Baseline Commitment'}
                          </span>
                        </div>
                      </div>

                      {/* Current Revised Proposal */}
                      <div
                        style={{
                          padding: '8px 12px',
                          borderRadius: 6,
                          background: 'rgba(111, 61, 186, 0.05)',
                          border: '1px solid rgba(111, 61, 186, 0.25)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--brand-purple)', textTransform: 'uppercase' }}>
                            Revised Proposal (Rev #{p.revision})
                          </div>
                          <span
                            className="mfg-badge"
                            style={{
                              fontSize: 10,
                              background: (p.delay_days || 0) > 0 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(34, 197, 94, 0.12)',
                              color: (p.delay_days || 0) > 0 ? '#ef4444' : '#16a34a',
                              border: `1px solid ${(p.delay_days || 0) > 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
                              fontWeight: 700,
                            }}
                          >
                            Verdict: {p.verdict || ((p.delay_days || 0) > 0 ? 'DELAYED' : 'ON_TIME')}
                          </span>
                        </div>

                        <div style={{ fontSize: 12, fontWeight: 700, color: (p.delay_days || 0) > 0 ? '#ef4444' : 'var(--brand-purple)', marginTop: 4 }}>
                          Revised Date: {formatDate(p.revised_estimated_date || p.proposed_date)}
                        </div>

                        <div style={{ fontSize: 11, color: (p.delay_days || 0) > 0 ? '#ef4444' : '#16a34a', marginTop: 2, fontWeight: 600 }}>
                          Schedule Variance: {(p.delay_days || 0) > 0 ? `+${p.delay_days} days delay vs Promised (${formatDate(p.promised_date || requestedDate)})` : 'On Schedule'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dense 6-Column Commercial & Operational Summary */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                      gap: 8,
                      background: 'var(--mfg-bg-surface)',
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--mfg-border-subtle)',
                      marginBottom: 8,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--mfg-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Customer</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--mfg-text-primary)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {customerName}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--mfg-text-muted)' }}>{customerId}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: 10, color: 'var(--mfg-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Product Model</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--mfg-text-primary)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {productName}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--mfg-text-muted)' }}>Unit: Finished Good</div>
                    </div>

                    <div>
                      <div style={{ fontSize: 10, color: 'var(--mfg-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Demand &amp; Total Value</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--mfg-accent-primary)', marginTop: 2 }}>
                        {formatNumber(orderQty)} units
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--mfg-text-muted)' }}>{formatINR(totalValue)}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: 10, color: 'var(--mfg-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Customer Requested</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--mfg-text-primary)', marginTop: 2 }}>
                        {formatDate(requestedDate || p.proposed_date)}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--mfg-text-muted)' }}>Inbound PO Requirement</div>
                    </div>

                    <div>
                      <div style={{ fontSize: 10, color: 'var(--mfg-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Proposed Commitment</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-purple)', marginTop: 2 }}>
                        {formatDate(p.proposed_date)}
                      </div>
                      <div style={{ fontSize: 10, color: daysVariance > 0 ? '#d97706' : '#16a34a', fontWeight: 600 }}>
                        {daysVariance > 0 ? `+${daysVariance} days variance` : '✓ On Target Schedule'}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: 10, color: 'var(--mfg-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>7-Conduit Readiness</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: readyCount === 7 ? '#16a34a' : '#d97706', marginTop: 2 }}>
                        ● {readyCount}/7 Ready
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--mfg-text-muted)' }}>ERP • MMS • MES • WMS</div>
                    </div>
                  </div>

                  {/* Compact Evidence Strip */}
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--mfg-text-secondary)',
                      background: 'rgba(99, 102, 241, 0.04)',
                      border: '1px solid rgba(99, 102, 241, 0.12)',
                      padding: '6px 10px',
                      borderRadius: 6,
                      marginBottom: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      lineHeight: 1.4,
                    }}
                  >
                    <Sparkles size={13} style={{ color: 'var(--brand-purple)', flexShrink: 0 }} />
                    <span style={{ fontWeight: 600, color: 'var(--mfg-text-primary)' }}>Supporting Evidence:</span>
                    <span style={{ flex: 1 }}>
                      {Array.isArray(p.reasons) && p.reasons.length > 0
                        ? p.reasons.join(' · ')
                        : `Order volume of ${formatNumber(orderQty)} units is feasible based on plant capacity and inventory availability.`}
                    </span>
                    {p.decision_note && (
                      <span style={{ fontSize: 10, color: 'var(--mfg-text-muted)', borderLeft: '1px solid var(--mfg-border-subtle)', paddingLeft: 8 }}>
                        Note: {p.decision_note}
                      </span>
                    )}
                  </div>

                  {/* Compact Bottom Action Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--mfg-border-subtle)', paddingTop: 8 }}>
                    <div style={{ fontSize: 11, color: 'var(--mfg-text-muted)' }}>
                      Revision #{p.revision || 1} • Recommended by{' '}
                      <strong style={{ color: 'var(--brand-purple)' }}>
                        {p.recommended_by === 'agent' ? 'Agent 2 Feasibility Engine' : 'Human Operator'}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      {isApproved ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#16a34a', fontSize: 12, fontWeight: 600 }}>
                          <CheckCircle2 size={14} /> Commercial commitment approved on {formatDate(p.decided_at || p.updated_at)}
                        </div>
                      ) : isRejected ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#dc2626', fontSize: 12, fontWeight: 600 }}>
                          <XCircle size={14} /> Proposal rejected on {formatDate(p.decided_at || p.updated_at)}
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="button button-secondary"
                            onClick={() => handleReject(p.id)}
                            disabled={!canApprove || actingId === p.id}
                            style={{ color: '#EF4444', borderColor: 'rgba(239,68,68,0.3)', fontSize: 11, padding: '3px 10px', minHeight: 28 }}
                          >
                            <XCircle size={13} /> Reject Proposal
                          </button>
                          <button
                            type="button"
                            className="button button-primary glow-orange"
                            onClick={() => handleApprove(p.id)}
                            disabled={!canApprove || actingId === p.id}
                            style={{ fontWeight: 600, fontSize: 11, padding: '3px 14px', minHeight: 28 }}
                          >
                            <CheckCircle2 size={13} /> Approve Commercial Commitment
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* MODAL: RECORD CORRECTIVE ACTION & RESOLVE */}
      {resolvingAlert && (
        <div className="mfg-modal-overlay" role="dialog" aria-modal="true">
          <div className="mfg-modal-content" style={{ maxWidth: 540 }}>
            <div className="mfg-modal-header">
              <h2>
                <CheckCircle2 size={18} color="#22c55e" />
                Resolve Operational Alert #{resolvingAlert.id}
              </h2>
              <button type="button" className="icon-button" onClick={() => setResolvingAlert(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitResolve}>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ fontSize: 13, color: 'var(--mfg-text-primary)' }}>
                  <strong>{resolvingAlert.title}</strong> (Order: {resolvingAlert.customer_order_id})
                </div>
                <div>
                  <label className="input-label" htmlFor="res-notes">
                    Verified Corrective Action &amp; Evidence
                  </label>
                  <textarea
                    id="res-notes"
                    className="input"
                    rows={4}
                    required
                    placeholder="Enter details of corrective actions taken, verified supplier receipt, completed line rework, or carrier upgrade."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                  />
                </div>
                <div style={{ fontSize: 11, color: 'var(--mfg-text-muted)' }}>
                  Submitting resolution records verified corrective actions, terminates automated 3-day agent follow-up escalation emails, and automatically dispatches resolution notices to both department leads and Customer Service.
                </div>
              </div>

              <div className="mfg-modal-footer">
                <button type="button" className="button button-secondary" onClick={() => setResolvingAlert(null)}>
                  Cancel
                </button>
                <button type="submit" className="button button-primary">
                  <Check size={14} /> Verify &amp; Resolve Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD CUSTOMER COMMUNICATION NOTE */}
      {communicatingAlert && (
        <div className="mfg-modal-overlay" role="dialog" aria-modal="true">
          <div className="mfg-modal-content" style={{ maxWidth: 540 }}>
            <div className="mfg-modal-header">
              <h2>
                <MessageSquare size={18} color="var(--brand-purple)" />
                Record Customer Communication – Order {communicatingAlert.customer_order_id}
              </h2>
              <button type="button" className="icon-button" onClick={() => setCommunicatingAlert(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitCommunication}>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ fontSize: 13, color: 'var(--mfg-text-primary)' }}>
                  <strong>Risk:</strong> {communicatingAlert.title}
                </div>
                <div>
                  <label className="input-label" htmlFor="comm-notes">
                    Customer Communication Details
                  </label>
                  <textarea
                    id="comm-notes"
                    className="input"
                    rows={4}
                    required
                    placeholder="e.g. Called customer procurement lead regarding transit delay; customer confirmed acceptance of 24h buffer."
                    value={communicationNotes}
                    onChange={(e) => setCommunicationNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="mfg-modal-footer">
                <button type="button" className="button button-secondary" onClick={() => setCommunicatingAlert(null)}>
                  Cancel
                </button>
                <button type="submit" className="button button-primary">
                  <Save size={14} /> Save Communication Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
