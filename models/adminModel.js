const { Pool } = require('pg'); // Import pg library
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create a new pool instance using your database configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Function to execute queries
const query = async (text, params) => {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows; // Return the rows of the result
  } finally {
    client.release();
  }
};

module.exports = {
  // Register new admin
  registerAdmin: async (username, email, password, role) => {
    // Check if admin already exists
    const existingAdmin = await query(
      `SELECT * FROM admins WHERE email = $1`,
      [email]
    );
    if (existingAdmin.length > 0) {
      throw new Error('Admin already exists');
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert new admin
    return query(
      `INSERT INTO admins (username, email, password, role)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [username, email, hashedPassword, role]
    );
  },

  // Admin login
  loginAdmin: async (email, password) => {
    const admin = await query(
      `SELECT * FROM admins WHERE email = $1`,
      [email]
    );
    if (admin.length === 0) throw new Error('Invalid credentials');
    
    const isMatch = await bcrypt.compare(password, admin[0].password);
    if (!isMatch) throw new Error('Invalid credentials');
    
    const payload = { adminId: admin[0].id, role: admin[0].role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
  },

  // Get all admins (superadmin only)
  getAllAdmins: async () => {
    return query(`SELECT * FROM admins`);
  },
};
