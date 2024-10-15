const adminService = require('../../services/adminServices/adminServices');

const registerAdmin = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const newAdmin = await adminService.registerAdmin(username, email, password, role);
    res.status(201).json({ message: 'Admin registered successfully', admin: newAdmin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginAdmin = async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    try {
      const token = await adminService.loginAdmin(email, password);
      res.json({message: 'Login successfully', token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

const getAllAdmins = async (req, res) => {
  try {
    const admins = await adminService.getAllAdmins();
    res.json(admins); 
    console.log(admins);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAllAdmins
};

// {
//     "username": "adminUser123",
//     "email": "admin@example.com",
//     "password": "securePassword123",
//     "role": "admin"
//   }
  
// CREATE TABLE admins (
//     id SERIAL PRIMARY KEY,
//     username VARCHAR(255) NOT NULL UNIQUE,
//     email VARCHAR(255) NOT NULL UNIQUE,
//     password VARCHAR(255) NOT NULL,
//     role VARCHAR(255) DEFAULT 'admin',
//     createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
//   );
// {
//     "email": "newadmin@example.com",
//     "password": "newAdminPassword!2024" 
//   }
  