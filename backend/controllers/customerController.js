const mysql = require('mysql2/promise');
const redis = require('redis');

// MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'customerdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Redis Client
const redisClient = redis.createClient({
    url: 'redis://redis:6379'
});
redisClient.connect();

exports.addCustomer = async (req, res) => {
    const { firstName, lastName, email, phone } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO customers (first_name, last_name, email, phone) VALUES (?, ?, ?, ?)',
            [firstName, lastName, email, phone]
        );
        await redisClient.del('customer_list'); // Clear Cache after Insert #Link Redis Cache
        res.json({ success: true, id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCustomers = async (req, res) => {
    try {
        const cached = await redisClient.get('customer_list');
        if (cached) return res.json(JSON.parse(cached)); // Return Cached Data

        const [rows] = await pool.query('SELECT * FROM customers');
        await redisClient.set('customer_list', JSON.stringify(rows), { EX: 60 }); // Cache for 60s
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
