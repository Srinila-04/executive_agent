const express = require('express');
const router = express.Router();
const {
  featuredReports,
  sectorReports,
  scheduledReports,
  reportHistory,
  reportHealth
} = require('../data/reportsData');

// In-memory working copies for live additions and toggles
let currentFeatured = [...featuredReports];
let currentSectorReports = [...sectorReports];
let currentSchedules = [...scheduledReports];
let currentHistory = [...reportHistory];
let currentHealth = { ...reportHealth };

// GET /api/reports
router.get('/', (req, res) => {
  res.json({
    success: true,
    featuredReports: currentFeatured,
    sectorReports: currentSectorReports,
    scheduledReports: currentSchedules,
    reportHistory: currentHistory,
    reportHealth: currentHealth
  });
});

// POST /api/reports/toggle-favorite
router.post('/toggle-favorite', (req, res) => {
  const { id } = req.body;
  currentSectorReports = currentSectorReports.map(r => {
    if (r.id === id) {
      return { ...r, isFavorite: !r.isFavorite };
    }
    return r;
  });
  currentFeatured = currentFeatured.map(r => {
    if (r.id === id) {
      return { ...r, isFavorite: !r.isFavorite };
    }
    return r;
  });
  res.json({ success: true, id });
});

// POST /api/reports/generate (Custom Ad-hoc Report Builder)
router.post('/generate', (req, res) => {
  const {
    topic,
    plants,
    dateRange,
    measures,
    format,
    saveAsTemplate,
    templateName
  } = req.body;

  const newReportId = 'rep-custom-' + Date.now();
  const plantLabel = Array.isArray(plants) && plants.length > 0 ? plants.join(', ') : 'All Plants';
  
  const generatedReport = {
    id: newReportId,
    name: templateName || `Custom ${topic || 'Executive'} Performance Report`,
    sector: topic || 'Cross-Functional Production',
    agent: 'Agent 20 (Ad-Hoc Intelligence Synthesizer)',
    agentId: 20,
    plantsCovered: plantLabel,
    lastUpdated: 'Just now',
    dataFreshness: 'Live (Synchronized just now)',
    status: 'Ready',
    formats: [format || 'PDF'],
    isFavorite: false,
    description: `Ad-hoc synthesis analyzing ${topic || 'operations'} across ${plantLabel} for period: ${dateRange || 'Current Shift'}.`,
    summary: {
      fact: `Synthesized analysis across selected measures (${(measures || []).slice(0, 3).join(', ') || 'Core Metrics'}). Operating efficiency held above standard parameters.`,
      likelyReason: 'Multi-plant telemetry ingestion reconciled line counters against ERP order bookings without latency.',
      recommendation: 'Incorporate findings into shift handover brief and flag critical deviations to Plant Head.'
    },
    metrics: [
      { label: 'Ingested Records', value: '18,400 Rows', sub: 'Verified across plants' },
      { label: 'Calculated Variance', value: '-1.4%', sub: 'Within tolerance' },
      { label: 'Data Confidence', value: '99.8%', sub: 'Telemetry verified' },
      { label: 'Export Status', value: 'Ready', sub: format || 'PDF' }
    ]
  };

  // Add to report history
  const historyEntry = {
    id: 'hist-' + Date.now(),
    name: generatedReport.name,
    generatedBy: 'Admin (Ad-Hoc Report Builder)',
    date: 'Today • Just now',
    plant: plantLabel,
    size: '1.8 MB',
    format: format || 'PDF',
    status: 'Completed',
    downloadUrl: '#'
  };
  currentHistory = [historyEntry, ...currentHistory];

  res.json({
    success: true,
    report: generatedReport,
    historyEntry
  });
});

// POST /api/reports/schedule (Add / Toggle Schedule)
router.post('/schedule', (req, res) => {
  const { id, action, scheduleData } = req.body;

  if (action === 'toggle-status' && id) {
    currentSchedules = currentSchedules.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'Active' ? 'Paused' : 'Active';
        return {
          ...s,
          status: nextStatus,
          nextRun: nextStatus === 'Active' ? 'Scheduled as per frequency' : 'Paused by Admin'
        };
      }
      return s;
    });
    return res.json({ success: true, schedules: currentSchedules });
  }

  if (action === 'delete' && id) {
    currentSchedules = currentSchedules.filter(s => s.id !== id);
    return res.json({ success: true, schedules: currentSchedules });
  }

  if (action === 'create' && scheduleData) {
    const newSch = {
      id: 'sch-' + Date.now(),
      name: scheduleData.name || 'Automated Executive Report',
      frequency: scheduleData.frequency || 'Daily at 07:00 AM IST',
      recipients: scheduleData.recipients || 'Plant Heads & Admin',
      deliveryMethod: scheduleData.deliveryMethod || 'Email (PDF)',
      status: 'Active',
      lastRun: 'Pending First Run',
      nextRun: 'Next Cycle',
      agent: scheduleData.agent || 'Agent 20',
      format: scheduleData.format || 'PDF'
    };
    currentSchedules = [newSch, ...currentSchedules];
    return res.json({ success: true, schedules: currentSchedules, created: newSch });
  }

  res.json({ success: true, schedules: currentSchedules });
});

// POST /api/reports/share
router.post('/share', (req, res) => {
  const { reportId, channel, recipients, expiry, viewOnly, passwordProtected } = req.body;
  const secureToken = Math.random().toString(36).substring(2, 12).toUpperCase();
  const shareableUrl = `https://gwc-portal.internal/reports/share/${reportId || 'rep-feat-1'}?token=${secureToken}`;
  
  res.json({
    success: true,
    channel: channel || 'email',
    recipients,
    shareableUrl,
    expiry: expiry || '7 Days',
    viewOnly: !!viewOnly,
    passwordProtected: !!passwordProtected,
    message: `Report successfully dispatched via ${channel || 'Secure Channel'} to ${recipients || 'selected stakeholders'}.`
  });
});

module.exports = router;
