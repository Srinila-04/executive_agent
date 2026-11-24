const express = require('express');
const router = express.Router();
let { AGENTS, SECTORS } = require('../data/agentsData');
const { addNotification } = require('../data/notificationsData');

// GET all agents
router.get('/', (req, res) => {
  res.json({ agents: AGENTS, total: AGENTS.length });
});

// GET sectors with nested agents
router.get('/sectors', (req, res) => {
  const structuredSectors = SECTORS.map(sec => {
    const sectorAgents = AGENTS.filter(a => sec.agentIds.includes(a.id));
    return {
      ...sec,
      agents: sectorAgents,
      agentCount: sectorAgents.length,
      activeCount: sectorAgents.filter(a => a.status === 'running').length
    };
  });
  res.json({ sectors: structuredSectors });
});

// GET single agent by ID
router.get('/:id', (req, res) => {
  const agent = AGENTS.find(a => a.id === parseInt(req.params.id));
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  res.json(agent);
});

// POST toggle agent status (running / stopped / warning)
router.post('/:id/status', (req, res) => {
  const { status, reason } = req.body;
  const agent = AGENTS.find(a => a.id === parseInt(req.params.id));
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  const prevStatus = agent.status;
  agent.status = status || (agent.status === 'running' ? 'stopped' : 'running');
  agent.health = agent.status === 'running' ? 'optimal' : agent.status === 'warning' ? 'warning' : 'critical';
  agent.lastHeartbeat = new Date().toISOString();

  // If status changed to stopped or warning, automatically generate an admin notification!
  if (agent.status === 'stopped' || agent.status === 'critical') {
    const alertReason = reason || 'Heartbeat timeout / unhandled runtime exception in worker process.';
    addNotification({
      agentId: agent.id,
      agentName: `${agent.name} (Agent ${agent.agentNumber < 10 ? '0' : ''}${agent.agentNumber})`,
      severity: 'error',
      title: `Agent Stopped Running: ${agent.name}`,
      message: `Agent ${agent.agentNumber} (${agent.code}) has stopped running unexpectedly on port ${agent.port}. Reason: ${alertReason}`,
      rootCause: alertReason,
      suggestedAction: `Check edge telemetry connectivity on port ${agent.port} and trigger health restart.`
    });
  } else if (agent.status === 'running' && prevStatus === 'stopped') {
    addNotification({
      agentId: agent.id,
      agentName: `${agent.name} (Agent ${agent.agentNumber < 10 ? '0' : ''}${agent.agentNumber})`,
      severity: 'success',
      title: `Agent Resumed: ${agent.name}`,
      message: `Agent ${agent.agentNumber} (${agent.code}) is back online and streaming healthy telemetry.`,
      rootCause: 'Manual or automated recovery completed.',
      suggestedAction: 'Telemetry synchronization confirmed.'
    });
  }

  res.json({ success: true, agent });
});

module.exports = router;
