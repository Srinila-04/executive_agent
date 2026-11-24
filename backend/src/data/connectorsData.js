const CONNECTORS = [
  {
    id: 'oracle',
    name: 'Oracle',
    shortCode: 'OR',
    category: 'Database • Plant data warehouse',
    badge: 'Database',
    description: 'Enterprise relational data store for plant-wide historical telemetry and production records.',
    status: 'available', // Not connected
    eventsCount: 4,
    eventsText: '4 events available',
    color: '#c2410c', // Brick red
    protocol: 'Oracle Net / JDBC OCI',
    endpoint: 'jdbc:oracle:thin:@plant-pune:1521/prod',
    authType: 'Service Account / TLS 1.3',
    lastSync: 'Not connected',
    recordsSynced: '0'
  },
  {
    id: 'mysql',
    name: 'MySQL',
    shortCode: 'MY',
    category: 'Database • Line-side application database',
    badge: 'Database',
    description: 'Line-side database tracking local station cycle times, shift logs and operator check-ins.',
    status: 'available', // Not connected
    eventsCount: 4,
    eventsText: '4 events available',
    color: '#0f766e', // Teal
    protocol: 'MySQL TCP Protocol v8.0',
    endpoint: 'tcp://line-db.pune.internal:3306',
    authType: 'Username & Password / SSL',
    lastSync: 'Not connected',
    recordsSynced: '0'
  },
  {
    id: 'sap',
    name: 'SAP',
    shortCode: 'SAP',
    category: 'ERP / CMMS • Work orders, notifications and costs',
    badge: 'Core ERP',
    description: 'Work orders, maintenance notifications, material BOMs, and manufacturing cost center ledger.',
    status: 'connected', // Connected
    eventsCount: 4,
    eventsText: '4 events available',
    color: '#0284c7', // SAP Blue
    protocol: 'OData v4 / RFC / BAPI',
    endpoint: 'https://s4hana.enterprise.motherson.internal:44300',
    authType: 'OAuth 2.0 / X.509 Certificate',
    lastSync: 'Live (Streaming)',
    recordsSynced: '2,845,190'
  },
  {
    id: 'sap-hana',
    name: 'SAP HANA',
    shortCode: 'HA',
    category: 'Database • In-memory analytics store',
    badge: 'Database',
    description: 'High-speed in-memory database engine for multi-plant financial aggregations and real-time ATP queries.',
    status: 'available', // Not connected
    eventsCount: 4,
    eventsText: '4 events available',
    color: '#1e3a8a', // Dark Navy
    protocol: 'HDB SQL / JDBC',
    endpoint: 'hana.prod.corp.internal:30015',
    authType: 'Kerberos / SSL Strict',
    lastSync: 'Not connected',
    recordsSynced: '0'
  },
  {
    id: 'excel',
    name: 'Excel',
    shortCode: 'XL',
    category: 'File • Spreadsheet export for the planner',
    badge: 'Manual CSV',
    description: 'Manual and automated spreadsheet uploads for offline shift demand inputs and production rosters.',
    status: 'connected', // Connected
    eventsCount: 4,
    eventsText: '4 events available',
    color: '#15803d', // Excel Forest Green
    protocol: 'CSV / XLSX Ingestion Pipeline',
    endpoint: 'sftp://staging-files.motherson.internal/uploads/daily',
    authType: 'SSH Key / Token Auth',
    lastSync: '10 minutes ago',
    recordsSynced: '420,100'
  },
  {
    id: 'snowflake',
    name: 'Snowflake',
    shortCode: 'SF',
    category: 'Warehouse • Group reporting warehouse',
    badge: 'Cloud Lake',
    description: 'Cloud data warehouse aggregating cross-state production archives and corporate KPI analytics.',
    status: 'available', // Not connected
    eventsCount: 4,
    eventsText: '4 events available',
    color: '#0284c7', // Snowflake Cyan Blue
    protocol: 'Snowflake SQL API / Kafka Sink',
    endpoint: 'https://motherson.snowflakecomputing.com',
    authType: 'Key Pair Authentication',
    lastSync: 'Not connected',
    recordsSynced: '0'
  },
  {
    id: 'custom-api',
    name: 'API',
    shortCode: 'API',
    category: 'REST • Generic webhook for any in-house system',
    badge: 'REST API',
    description: 'Secure incoming and outgoing REST webhooks connecting custom proprietary in-house tools.',
    status: 'connected', // Connected
    eventsCount: 4,
    eventsText: '4 events available',
    color: '#334155', // Slate Dark
    protocol: 'RESTful API / JSON Webhooks',
    endpoint: 'https://api.motherson.io/v1/telemetry-sink',
    authType: 'Bearer Token (API Key)',
    lastSync: 'Live (Streaming)',
    recordsSynced: '6,120,400'
  },
  {
    id: 'siemens-mes',
    name: 'Siemens Opcenter MES',
    shortCode: 'OP',
    category: 'MES • Production orders, downtime and line state',
    badge: 'Shop Floor MES',
    description: 'Manufacturing execution platform streaming line states, cycle counters, operator logins, and scrap.',
    status: 'connected', // Connected
    eventsCount: 4,
    eventsText: '4 events available',
    color: '#0d9488', // Dark Teal
    protocol: 'OPC-UA / Industrial Ethernet',
    endpoint: 'opc.tcp://10.244.101.228:4840',
    authType: 'TLS 1.3 / User Token',
    lastSync: 'Live (Streaming 10ms)',
    recordsSynced: '14,890,210'
  },
  {
    id: 'ms-teams',
    name: 'Microsoft Teams',
    shortCode: 'MT',
    category: 'Messaging • Shift handover channel',
    badge: 'Messaging',
    description: 'Real-time alert dispatch webhooks to plant supervisor teams and automated shift handover summaries.',
    status: 'available', // Not connected
    eventsCount: 3,
    eventsText: '3 events available',
    color: '#4f46e5', // Teams Indigo
    protocol: 'Microsoft Graph API / Webhook',
    endpoint: 'https://outlook.office.com/webhook/plant-supervisors',
    authType: 'OAuth 2.0 Webhook Signature',
    lastSync: 'Not connected',
    recordsSynced: '0'
  },
  {
    id: 'power-bi',
    name: 'Microsoft Power BI',
    shortCode: 'BI',
    category: 'Reporting • Leadership dashboards',
    badge: 'Reporting / BI',
    description: 'Direct query push and scheduled semantic model sync for executive and board-level presentations.',
    status: 'connected', // Connected
    eventsCount: 3,
    eventsText: '3 events available',
    color: '#ca8a04', // Power BI Gold
    protocol: 'Power BI REST API / XMLA',
    endpoint: 'https://api.powerbi.com/v1.0/myorg',
    authType: 'Azure Active Directory Principal',
    lastSync: '5 minutes ago',
    recordsSynced: '420,000'
  },
  {
    id: 'manhattan-wms',
    name: 'Manhattan Associates WMS',
    shortCode: 'WMS',
    category: 'Warehouse • Inbound receipts and dispatch staging',
    badge: 'Logistics WMS',
    description: 'Inbound dock receipts, rack inventory buffer tracking, and outbound carrier staging.',
    status: 'connected', // Connected
    eventsCount: 4,
    eventsText: '4 events available',
    color: '#ea580c', // Orange
    protocol: 'RESTful API / Webhooks',
    endpoint: 'https://wms.manhattan.us-east.motherson.corp/api/v2',
    authType: 'Bearer Token (API Key)',
    lastSync: '4 minutes ago',
    recordsSynced: '940,320'
  },
  {
    id: 'rockwell-plc',
    name: 'Rockwell FactoryTalk',
    shortCode: 'AB',
    category: 'Industrial IoT • Allen-Bradley PLC counters',
    badge: 'Assembly Lines',
    description: 'Assembly line robotics telemetry, high-speed Allen-Bradley PLC counters, conveyor interlocks.',
    status: 'connected', // Connected
    eventsCount: 4,
    eventsText: '4 events available',
    color: '#dc2626', // Red
    protocol: 'EtherNet/IP / CIP Protocol',
    endpoint: '10.244.101.235:44818',
    authType: 'CIP Security / Key Exchange',
    lastSync: '10 seconds ago',
    recordsSynced: '8,450,000'
  }
];

module.exports = { CONNECTORS };
