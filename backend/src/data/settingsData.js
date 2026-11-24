let ADMIN_SETTINGS = {
  adminName: 'Srinila Rajan',
  adminRole: 'Chief Operating Officer & Enterprise AI Administrator',
  email: 'srinila.rajan@motherson-group.com',
  phone: '+91 98401 23456',
  companyName: 'Motherson Group & GWC DATA.AI Consortium',
  headquarters: 'Sector 84, Noida, NCR, India',
  districtCoverage: [
    { state: 'Tamil Nadu', district: 'Kanchipuram & Sriperumbudur', plantCode: 'PLANT-TN-01', plantName: 'Chennai Precision Automotive Hub', lines: 14, activeAgents: 19 },
    { state: 'Maharashtra', district: 'Pune & Chakan Industrial Belt', plantCode: 'PLANT-MH-02', plantName: 'Pune Stamping & Assembly Works', lines: 18, activeAgents: 19 },
    { state: 'Gujarat', district: 'Sanand & Ahmedabad Zone', plantCode: 'PLANT-GJ-03', plantName: 'Sanand EV Powertrain & Casting Unit', lines: 12, activeAgents: 18 },
    { state: 'Haryana', district: 'Gurugram & Manesar', plantCode: 'PLANT-HR-04', plantName: 'Manesar Polymer & Wire Harness Plant', lines: 22, activeAgents: 19 },
    { state: 'Karnataka', district: 'Bengaluru Urban & Peenya', plantCode: 'PLANT-KA-05', plantName: 'Bengaluru Advanced Robotics & R&D', lines: 8, activeAgents: 19 },
    { state: 'Texas (USA)', district: 'Austin Metro & Travis County', plantCode: 'PLANT-US-06', plantName: 'Austin Global Export Assembly', lines: 10, activeAgents: 19 }
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
