let ADMIN_SETTINGS = {
  adminName: 'Srinila Rajan',
  adminRole: 'Chief Operating Officer & Enterprise AI Administrator',
  email: 'srinila.rajan@motherson-group.com',
  phone: '+91 98401 23456',
  companyName: 'Motherson Group & GWC DATA.AI Consortium',
  headquarters: 'Sector 84, Noida, NCR, India',
  districtCoverage: [
    { state: 'Tamil Nadu', district: 'Sriperumbudur / Kanchipuram', plantCode: 'IN-TN-01', plantName: 'Chennai Electronics Plant', lines: 4, activeAgents: 19, status: 'Active', lead: 'Murugan K (Operations Lead)' },
    { state: 'Karnataka', district: 'Peenya / Whitefield', plantCode: 'IN-KA-01', plantName: 'Bengaluru Electronics Plant', lines: 3, activeAgents: 19, status: 'Active', lead: 'Sunita Rao (Robotics & R&D Lead)' }
  ],
  notificationsConfig: {
    emailAlerts: true,
    smsAlerts: true,
    agentHeartbeatTimeoutSeconds: 30,
    criticalThresholdAlertsOnly: false,
    webhookUrl: 'https://hooks.slack.com/services/T00/B00/motherson-agent-alerts'
  },
  aiConfig: {
    primaryModel: 'Domo AI / Claude 3.5 Sonnet Engine',
    temperature: 0.1,
    maxToolHops: 5,
    autoRecoveryEnabled: true,
    liveTelemetryPollingRateSeconds: 5
  }
};

function getSettings() {
  return ADMIN_SETTINGS;
}

function updateSettings(newSettings) {
  ADMIN_SETTINGS = { ...ADMIN_SETTINGS, ...newSettings };
  return ADMIN_SETTINGS;
}

module.exports = { getSettings, updateSettings };
