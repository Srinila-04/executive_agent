const express = require('express');
const router = express.Router();
const { getNotifications, addNotification, markAsRead, clearNotification } = require('../data/notificationsData');
let { AGENTS } = require('../data/agentsData');

// GET all notifications
router.get('/', (req, res) => {
  const notifs = getNotifications();
  const unreadCount = notifs.filter(n => n.status === 'unread').length;
  const stoppedCount = notifs.filter(n => n.isStoppedAgent || n.severity === 'error').length;
  const analysisCount = notifs.filter(n => n.isAgentAnalysis).length;
  res.json({
    notifications: notifs,
    unreadCount,
    stoppedCount,
    analysisCount,
    totalAgentsMonitored: 19
  });
});

// POST mark as read
router.post('/mark-read', (req, res) => {
  const { id } = req.body;
  markAsRead(id || 'all');
  const notifs = getNotifications();
  res.json({
    success: true,
    notifications: notifs,
    unreadCount: notifs.filter(n => n.status === 'unread').length
  });
});

// POST analyze all 19 agents
router.post('/analyze-19-agents', (req, res) => {
  const notifs = getNotifications();
  const stoppedAgents = notifs.filter(n => n.isStoppedAgent);
  const updates = notifs.filter(n => n.isAgentAnalysis);

  res.json({
    success: true,
    analyzedAt: new Date().toISOString(),
    totalAgents: 19,
    stoppedAgentsCount: stoppedAgents.length,
    activeAgentsCount: 19 - stoppedAgents.length,
    stoppedAgents: stoppedAgents.map(a => ({
      agentNumber: a.agentNumber,
      agentName: a.agentName,
      oneLineReason: a.oneLineReason
    })),
    importantUpdatesCount: updates.length,
    notifications: notifs
  });
});

// POST simulate alert (e.g. testing stopped agent with one-line reason)
router.post('/simulate-alert', (req, res) => {
  const { agentNumber, agentName, reason, severity } = req.body;
  const num = agentNumber || Math.floor(Math.random() * 19) + 1;
  const formattedReason = reason ? `Reason: ${reason}` : `Reason: Edge telemetry socket timed out on port ${3000 + num} during sensor sampling cycle.`;
  
  const newNotif = addNotification({
    agentId: num,
    agentNumber: num,
    agentName: agentName || `Agent ${num < 10 ? '0' : ''}${num}`,
    severity: severity || 'error',
    isStoppedAgent: true,
    title: `Agent ${num < 10 ? '0' : ''}${num} Stopped Running`,
    oneLineReason: formattedReason,
    message: `Worker node for Module ${num} halted execution. ${formattedReason}`,
    rootCause: formattedReason,
    suggestedAction: 'Check edge service health, review diagnostic logs, and click Restart Agent.',
    kpiImpact: 'Awaiting operator recovery'
  });

  res.json({ success: true, notification: newNotif });
});

// DELETE notification
router.delete('/:id', (req, res) => {
  clearNotification(req.params.id);
  res.json({ success: true });
});

module.exports = router;
