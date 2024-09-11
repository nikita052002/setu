const express = require ("express");
const exe = require ("../db");
const route = express.Router();
const multer = require('multer');
const path = require('path');
const { swaggerUiSetup, swaggerUiDocument } = require('../swagger');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/UserJobProfile/')); // Directory where files will be saved
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Append a unique suffix to the filename
    }
});

const upload = multer({ storage: storage });


route.post('/user-job-profile/:id', upload.fields([{ name: 'resume_file', maxCount: 1 }, { name: 'profile_picture', maxCount: 1 }]), async (req, res) => {
    const user_id = req.params.id;
    console.log('User id is:', user_id);
    
    const { position, company, education_degree, education_field, skills, status, experience } = req.body;
  
    const resume_file = req.files['resume_file'] ? req.files['resume_file'][0].buffer : null;
    const profile_picture = req.files['profile_picture'] ? req.files['profile_picture'][0].buffer : null;
   
    
    try {
        // Check if the user exists
        const userResult = await exe('SELECT u.username FROM users u WHERE u.user_id = $1', [user_id]);
        
        console.log('Number of rows returned:', userResult.rowCount);
        let username = null;
        if (userResult.rowCount > 0) {
            username = userResult.rows[0].username;
            console.log('User Name is:', username);
        } else {
            console.log('No user found with the given ID.');
            return res.status(404).json({ error: 'User not found' });
        }
  
        // Check if the profile exists
        const { rowCount: profileExists } = await exe('SELECT user_id FROM user_job_profile WHERE user_id = $1', [user_id]);
        console.log('Profile existence count:', profileExists);
  
        if (profileExists > 0) {
            await exe(`UPDATE user_job_profile
                SET position = $1, company = $2, education_degree = $3, education_field = $4, skills = $5, resume_file = $6, profile_picture = $7, status = $8, experience = $9, updated_at = $10
                WHERE user_id = $11`,
                [position, company, education_degree, education_field, skills, resume_file, profile_picture,  status || 'Active', experience, new Date(), user_id]
            );
            return res.status(200).json({ message: 'Profile updated successfully' });
        } else {
            await exe(`INSERT INTO user_job_profile (user_id, name, position, company, education_degree, education_field, skills, resume_file, profile_picture, status, experience)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                [user_id, username, position, company, education_degree, education_field, skills, resume_file, profile_picture,  status || 'Active', experience]
            );
            return res.status(201).json({ message: 'Profile created successfully' });
        }
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
  
  route.get('/user-job-profile/:id', async (req, res) => {
      const user_id = req.params.id;
  
      if (!user_id || isNaN(user_id)) {
        return res.status(400).json({ error: 'Invalid user_id' });
      }
    
      try {
        const result = await exe(
          'SELECT * FROM user_job_profile WHERE user_id = $1', [user_id]);
  
        if (result.rowCount > 0) {
          res.status(200).json(result.rows[0]);
        } else {
          res.status(404).json({ error: 'Profile not found' });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

module.exports = route;