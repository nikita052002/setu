const express = require('express');
const bodyparser = require('body-parser');
require('dotenv').config();
const { swaggerUi, swaggerSetup} = require('./config/swagger');
const registerRoutes = require('./routes/admin/registerRoutes');
const addfitnessRoutes = require('./routes/admin/fitnessRoutes');
const getfitnessRoutes = require('./routes/user/fitnessRoutes');
const addHealthInsurance = require('./routes/admin/healthInsuranceRoutes');
const getHealthInsurance = require('./routes/user/healthInsurance');

const app = express();

app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerSetup);

app.use('/api/admin',registerRoutes);
app.use('/api/admin', addfitnessRoutes);
app.use('/api/users', getfitnessRoutes);
app.use('/api/admin',addHealthInsurance);
app.use('/api/users',getHealthInsurance);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
