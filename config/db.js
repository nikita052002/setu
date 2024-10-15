const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'esetubackend',
    password: 'root',
    port: 5432,
});

async function exe(sql, values) {
    const client = await pool.connect();
    try {
        const result = await client.query(sql, values);
        return result;
    } finally {
        client.release();
    }
}

module.exports = exe;
