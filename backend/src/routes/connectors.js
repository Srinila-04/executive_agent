const express = require('express');
const router = express.Router();
let { CONNECTORS } = require('../data/connectorsData');
const { addNotification } = require('../data/notificationsData');

// GET all connectors
router.get('/', (req, res) => {
  res.json({ connectors: CONNECTORS, total: CONNECTORS.length });
});

// POST toggle connector status (Connect / Disconnect)
router.post('/toggle', (req, res) => {
  const { id } = req.body;
  const connector = CONNECTORS.find(c => c.id === id);
  if (!connector) {
    return res.status(404).json({ error: 'Connector not found' });
  }

  connector.status = connector.status === 'connected' ? 'available' : 'connected';
  connector.lastSync = connector.status === 'connected' ? 'Just now' : 'Not connected';
  if (connector.status === 'connected' && (!connector.recordsSynced || connector.recordsSynced === '0')) {
    connector.recordsSynced = '120,450';
  }

  addNotification({
    agentId: null,
    agentName: `Enterprise Integration Gateway`,
    severity: connector.status === 'connected' ? 'success' : 'warning',
    title: `Connector ${connector.name} ${connector.status === 'connected' ? 'Connected' : 'Disconnected'}`,
    message: `Enterprise connector ${connector.name} was ${connector.status === 'connected' ? 'activated' : 'paused'} by Admin.`,
    rootCause: 'Manual administrator configuration toggle.',
    suggestedAction: connector.status === 'connected' ? 'Initial schema sync triggered.' : 'Dependent downstream operational systems notified.'
  });

  res.json({ success: true, connector, connectors: CONNECTORS });
});

// POST manual connect connector (Input form at the top)
router.post('/create', (req, res) => {
  const { name, category, endpoint, authType, plant } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Connector name is required' });
  }

  const id = 'conn-' + Date.now().toString(36);
  const words = name.trim().split(/\s+/);
  const shortCode = words.length > 1
    ? (words[0][0] + words[1][0]).toUpperCase()
    : name.substring(0, 2).toUpperCase();

  const newConnector = {
    id,
    name: name.trim(),
    shortCode,
    category: category || 'Enterprise Integration • Custom data stream',
    badge: 'Custom Connector',
    description: `Manual connector established for ${plant || 'All Plants'}. Host endpoint: ${endpoint || 'Custom Endpoint'}.`,
    status: 'connected',
    eventsCount: 4,
    eventsText: '4 events available',
    color: '#6f3dba',
    protocol: 'RESTful API / Webhook',
    endpoint: endpoint || 'https://api.internal.plant.corp',
    authType: authType || 'OAuth 2.0 / API Key',
    lastSync: 'Live (Just Connected)',
    recordsSynced: '1,250'
  };

  CONNECTORS.unshift(newConnector);

  addNotification({
    agentId: null,
    agentName: `Enterprise Integration Gateway`,
    severity: 'success',
    title: `New Connector Activated: ${newConnector.name}`,
    message: `Admin manually provisioned connector ${newConnector.name} for ${plant || 'All Plants'}.`,
    rootCause: 'Manual Admin provisioning.',
    suggestedAction: 'Initial schema and handshake verification confirmed.'
  });

  res.json({ success: true, connector: newConnector, connectors: CONNECTORS });
});

module.exports = router;
