const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const client = require('prom-client'); // Prometheus client

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- Prometheus Metrics ---
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 }); // 5s interval

// --- MySQL Connection Pool ---
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db', // docker-compose service name
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'customerdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// --- Optional: Wait for DB ready ---
async function waitForDB() {
  let retries = 20; // increase retries for slow startup
  while (retries) {
    try {
      await pool.query('SELECT 1');
      console.log('Connected to MySQL');
      return;
    } catch (err) {
      console.log('MySQL not ready, retrying...', err.message);
      retries -= 1;
      await new Promise(res => setTimeout(res, 3000)); // 3s wait
    }
  }
  throw new Error('Cannot connect to MySQL');
}

// --- Routes ---
// Get all customers
app.get('/api/customers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customers');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add new customer
app.post('/api/customers', async (req, res) => {
  try {
    const { first_name, last_name, email, phone } = req.body;
    const [result] = await pool.query(
      'INSERT INTO customers (first_name, last_name, email, phone) VALUES (?, ?, ?, ?)',
      [first_name, last_name, email, phone]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add customer' });
  }
});

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// --- Start server after DB ready ---
const PORT = process.env.PORT || 5000;
waitForDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Could not start server:', err.message);
    process.exit(1);
  });
