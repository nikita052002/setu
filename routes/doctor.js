const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const fs=require('fs')
const exe = require('./connection'); // Ensure the path is correct

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads')); // Directory where files will be saved
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Append a unique suffix to the filename
    }
});

const upload = multer({ storage: storage });


router.post('/register', upload.single('documentName'), async (req, res) => {
    try {

        if (req.fileValidationError) {
            return res.status(400).json({ message: req.fileValidationError });
        }
        if (!req.file && req.fileValidationError === undefined) {
            return res.status(400).json({ message: 'Document upload is required.' });
        }

        const {
            firstName,
            lastName,
            email,
            phoneNumber,
            regNo,
            clinicName,
            clinicAddress,
            qualificationSpecialization,
            servicesOffered
        } = req.body;

        // Create an errors object
        const errors = {};

        // Validate required fields
        if (!firstName) errors.firstName = 'This field is required';
        if (!lastName) errors.lastName = 'This field is required';
        if (!email) errors.email = 'This field is required';
        if (!phoneNumber) errors.phoneNumber = 'This field is required';
        if (!regNo) errors.regNo = 'This field is required';
        if (!clinicName) errors.clinicName = 'This field is required';
        if (!clinicAddress) errors.clinicAddress = 'This field is required';
        if (!qualificationSpecialization) errors.qualificationSpecialization = 'This field is required';
        if (!servicesOffered) errors.servicesOffered = 'This field is required';

        // If there are any errors, return them
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: 'All fields are required.',
                errors
            });
        }

        // Check if a file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'Document upload is required.' });
        }

        const documentName = req.file.filename; // Get the uploaded file's name

        // SQL query to insert data into the database
        const query = `INSERT INTO doctor_register (
            first_name, last_name, email_id, phone_number, reg_no, 
            clinic_name, clinic_address,specialization, 
            services_offered, files) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;

        const values = [
            firstName,
            lastName,
            email,
            phoneNumber,
            regNo,
            clinicName,
            clinicAddress,
            qualificationSpecialization,
            servicesOffered,
            documentName
        ];

        await exe(query, values);
        return res.status(200).json({ message: 'Registration successful.', file: documentName });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
});


router.get("/doctor-specialities", async function(req, res) {
    try {
        const data = await exe("SELECT specialization FROM doctor_register");
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching doctor specialities:", error);
        res.status(500).json({
            message: "An error occurred while fetching doctor specialities",
            error: error.message 
        });
    }
});


module.exports = router;
