const exe = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerAdmin = async (username, email, password, role) => {
  const existingAdmin = await exe( `SELECT * FROM admins WHERE email = $1`, [email]);
  if (existingAdmin.length > 0) {
    throw new Error('Admin already exists');
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt)
  return exe(`INSERT INTO admins (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *`, [username, email, hashedPassword, role]);
};

const loginAdmin = async (email, password) => {
    try {
      const result = await exe(`SELECT * FROM admins WHERE email = $1`, [email]);
      const admin = result.rows;
      console.log('Admin query result:', admin);
      if (admin.length === 0) {
        throw new Error('Invalid credentials');
      }
      const foundAdmin = admin[0];
      if (!foundAdmin.password) {
        throw new Error('Password field is missing');
      }
      const isMatch = await bcrypt.compare(password, foundAdmin.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }
      const payload = { adminId: foundAdmin.id, role: foundAdmin.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      return token;
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  };
  
const getAllAdmins = async () => {
    const result = await exe('SELECT * FROM admins'); 
    return result.rows; 
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAllAdmins
};
