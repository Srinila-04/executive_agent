require('dotenv').config();
const express = require('express');
const cors = require('cors');

const agentsRouter = require('./routes/agents');
const connectorsRouter = require('./routes/connectors');
const notificationsRouter = require('./routes/notifications');
const settingsRouter = require('./routes/settings');
const chatRouter = require('./routes/chat');
const reportsRouter = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/agents', agentsRouter);
app.use('/api/connectors', connectorsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/chat', chatRouter);

// System Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'GWC DATA.AI Smart Manufacturing Operations Platform (System 20: Executive Decision Command Center)',
    timestamp: new Date().toISOString(),
    version: '2.4.0',
    totalModules: 20,
    database: process.env.DATABASE_URL ? 'Neon DB (PostgreSQL)' : 'In-Memory Enterprise Cache'
  });
});

app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`🏭 GWC DATA.AI Agent 20 Master Platform API Running on Port ${PORT}`);
  console.log(`👉 Health: http://localhost:${PORT}/api/health`);
  console.log(`👉 Agents: http://localhost:${PORT}/api/agents`);
  console.log(`👉 Connectors: http://localhost:${PORT}/api/connectors`);
  console.log(`================================================================`);
});
