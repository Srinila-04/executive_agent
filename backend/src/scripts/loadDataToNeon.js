require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set in .env');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const DATA_DIR = path.resolve(__dirname, '../../../data/data');

// Simple CSV line parser handling quotes
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Convert column name to valid Postgres identifier
function cleanColName(name) {
  return name.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
}

async function loadTableFromCSV(client, filePath, tableName) {
  console.log(`\n[LOADER] Processing: ${tableName} from ${path.basename(filePath)}`);
  
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let headers = null;
  let batch = [];
  let totalInserted = 0;
  const BATCH_SIZE = 500;

  for await (const rawLine of rl) {
    const line = rawLine.trim();
    if (!line) continue;

    if (!headers) {
      headers = parseCSVLine(line).map(cleanColName);
      
      // Create table dynamically
      const colDefs = headers.map(h => `"${h}" TEXT`).join(', ');
      await client.query(`DROP TABLE IF EXISTS "${tableName}" CASCADE;`);
      await client.query(`CREATE TABLE "${tableName}" (${colDefs});`);
      continue;
    }

    const values = parseCSVLine(line);
    // Pad or trim values to match header length
    while (values.length < headers.length) values.push(null);
    if (values.length > headers.length) values.length = headers.length;

    // Convert empty strings to null
    const cleanValues = values.map(v => (v === '' ? null : v));
    batch.push(cleanValues);

    if (batch.length >= BATCH_SIZE) {
      await insertBatch(client, tableName, headers, batch);
      totalInserted += batch.length;
      process.stdout.write(`  Inserted ${totalInserted} rows...\r`);
      batch = [];
    }
  }

  if (batch.length > 0) {
    await insertBatch(client, tableName, headers, batch);
    totalInserted += batch.length;
  }

  console.log(`  ✓ Completed ${tableName}: ${totalInserted} rows inserted.`);
  return totalInserted;
}

async function insertBatch(client, tableName, headers, rows) {
  if (rows.length === 0) return;

  const colList = headers.map(h => `"${h}"`).join(', ');
  let paramIndex = 1;
  const valueClauses = [];
  const params = [];

  for (const row of rows) {
    const placeholders = [];
    for (const val of row) {
      placeholders.push(`$${paramIndex++}`);
      params.push(val);
    }
    valueClauses.push(`(${placeholders.join(', ')})`);
  }

  const queryText = `INSERT INTO "${tableName}" (${colList}) VALUES ${valueClauses.join(', ')};`;
  await client.query(queryText, params);
}

async function createOperationalTables(client) {
  console.log('\n[LOADER] Setting up Admin Communication & Task Tracking Tables...');

  // 1. Admin Queries to Managers & Supervisors
  await client.query(`
    CREATE TABLE IF NOT EXISTS admin_queries (
      id SERIAL PRIMARY KEY,
      query_text TEXT NOT NULL,
      agent_id INT,
      agent_name TEXT,
      recipient_role TEXT NOT NULL,
      recipient_name TEXT,
      priority TEXT DEFAULT 'High',
      status TEXT DEFAULT 'Open',
      reply_text TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      replied_at TIMESTAMP
    );
  `);

  // Insert standard query samples if empty
  const queryCheck = await client.query('SELECT COUNT(*) FROM admin_queries;');
  if (parseInt(queryCheck.rows[0].count, 10) === 0) {
    await client.query(`
      INSERT INTO admin_queries (query_text, agent_id, agent_name, recipient_role, recipient_name, priority, status, reply_text, replied_at)
      VALUES 
      ('Verify SS-304 sheet metal buffer levels and expedite shipment receipt for Line 01', 9, 'Inventory Optimization & Buffer System', 'Materials Planning Lead', 'Rajesh Sharma', 'High', 'Replied', 'Shipment PO-94182 confirmed with JSW Steel for 22 tonnes arriving tomorrow 06:00 AM.', CURRENT_TIMESTAMP),
      ('Investigate pneumatic pressure drop and micro-stop spike on SMT Line 02', 2, 'Production Monitoring System', 'Shop Floor Supervisor (Pune)', 'Vikram Patil', 'Urgent', 'Replied', 'Pressure regulator valve seals replaced during shift break; line takt normalized.', CURRENT_TIMESTAMP),
      ('Confirm weekly safety walk audit findings and verify LOTO compliance for welding cells', 14, 'EHS & Plant Safety Management System', 'Plant Safety Director', 'Ananya Deshmukh', 'High', 'Open', NULL, NULL);
    `);
  }

  // 2. Admin Tasks & Real-World Manufacturing Stage Tracking
  // Stages: Assigned -> Acknowledged -> In Progress -> Quality Review -> Completed
  await client.query(`
    CREATE TABLE IF NOT EXISTS admin_tasks (
      id SERIAL PRIMARY KEY,
      task_title TEXT NOT NULL,
      description TEXT,
      agent_id INT,
      agent_name TEXT,
      assigned_to_role TEXT NOT NULL,
      assigned_to_name TEXT,
      plant_id TEXT,
      priority TEXT DEFAULT 'High',
      stage TEXT DEFAULT 'Assigned',
      target_date DATE,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const taskCheck = await client.query('SELECT COUNT(*) FROM admin_tasks;');
  if (parseInt(taskCheck.rows[0].count, 10) === 0) {
    await client.query(`
      INSERT INTO admin_tasks (task_title, description, agent_id, agent_name, assigned_to_role, assigned_to_name, plant_id, priority, stage, target_date, notes)
      VALUES
      ('Recalibrate vibration sensor on stamping press P-04', 'Address 1.42 mm/s harmonic drift observed on main bearing', 4, 'Predictive Maintenance System', 'Maintenance Manager (Chennai)', 'Murugan K', 'IN-TN-01', 'High', 'In Progress', CURRENT_DATE + 2, 'Technician staged with replacement SKF spherical bearing.'),
      ('Reallocate 4 certified welding technicians to Night Shift', 'Compensate for operator leaves and sustain 98.4% staffing target', 15, 'Workforce Allocation & Skills System', 'Shift Roster Lead', 'Sunita Rao', 'IN-KA-01', 'High', 'Acknowledged', CURRENT_DATE + 1, 'Roster adjusted with biometric sign-in verified.'),
      ('Audit supplier batch LOT-004-260801 for copper wire harness spools', 'Verify dimensional crimp tolerance against PPAP standards', 10, 'Supplier Performance & Risk System', 'Quality Assurance Head', 'Karthik Raman', 'IN-TN-01', 'Urgent', 'Quality Review', CURRENT_DATE + 1, 'First 500 samples passed optical AOI inspection.'),
      ('Execute peak energy shaving protocol for furnace cooling loop', 'Shift high-demand furnace pre-heat to off-peak tariff band', 13, 'Energy Management & Tariff System', 'Facilities & Energy Lead', 'Deepak Joshi', 'IN-TN-01', 'Medium', 'Completed', CURRENT_DATE, 'Avoided ₹14,200 peak demand surcharge.');
    `);
  }

  // 3. Manual KPI Entries & Bulk Upload Submissions
  await client.query(`
    CREATE TABLE IF NOT EXISTS manual_kpi_entries (
      id SERIAL PRIMARY KEY,
      agent_id INT NOT NULL,
      metric_name TEXT NOT NULL,
      metric_value NUMERIC NOT NULL,
      unit TEXT,
      plant_id TEXT,
      shift_id TEXT,
      notes TEXT,
      created_by TEXT DEFAULT 'Admin (Business Owner)',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('  ✓ Operational tables created successfully.');
}

async function main() {
  console.log('====================================================');
  console.log('🚀 GWC Manufacturing Platform: Neon DB Dataset Ingestion');
  console.log('====================================================');

  const client = await pool.connect();
  try {
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.csv'));
    console.log(`Found ${files.length} CSV datasets in ${DATA_DIR}`);

    let grandTotal = 0;
    const tableSummary = [];

    // Load Dimension tables first
    const dimFiles = files.filter(f => f.startsWith('dim_'));
    const factFiles = files.filter(f => !f.startsWith('dim_'));
    const sortedFiles = [...dimFiles, ...factFiles];

    for (const f of sortedFiles) {
      const tableName = f.replace('.csv', '');
      const filePath = path.join(DATA_DIR, f);
      const rowCount = await loadTableFromCSV(client, filePath, tableName);
      grandTotal += rowCount;
      tableSummary.push({ table: tableName, rows: rowCount });
    }

    // Create Operational Tables
    await createOperationalTables(client);

    console.log('\n====================================================');
    console.log('🎉 INGESTION COMPLETE SUMMARY:');
    console.log('====================================================');
    console.table(tableSummary);
    console.log(`Total Records Uploaded into Neon DB: ${grandTotal.toLocaleString()}`);
  } catch (err) {
    console.error('Fatal ingestion error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
