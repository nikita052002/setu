const express = require ("express");
const exe = require ("../db");
const route = express.Router();
const { swaggerUiSetup, swaggerUiDocument } = require('../swagger');

route.get('/search-jobs', async (req, res) => {
    try {
      console.log('Query parameters:', req.query);
  
      const { jobTitle, companyName, location } = req.query;
  
      // Initialize query and values
      let query = 'SELECT * FROM job_postings WHERE 1=1';
      const values = [];
      let paramIndex = 1;
  
      // Add conditions to the query based on the parameters
      if (jobTitle) {
        query += ` AND job_title ILIKE $${paramIndex}`;
        values.push(`%${jobTitle}%`);
        paramIndex++;
      }
      if (companyName) {
        query += ` AND company_name ILIKE $${paramIndex}`;
        values.push(`%${companyName}%`);
        paramIndex++;
      }
      if (location) {
        query += ` AND location ILIKE $${paramIndex}`;
        values.push(`%${location}%`);
        paramIndex++;
      }
  
      // Log the query and values for debugging
      console.log('Constructed query:', query);
      console.log('With values:', values);
  
      // Execute the query
      const result = await exe(query, values);
  
      // Log result for debugging
      console.log('Query result:', result.rows);
  
      // Check if any jobs are found
      if (result.rowCount > 0) {
        res.json(result.rows);
      } else {
        res.status(404).json({ error: 'No jobs found for the specified criteria' });
      }
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

route.get('/all-jobs', async (req, res) => {
    try {
      const query = 'SELECT * FROM job_postings';
      const result = await exe(query);
      console.log('Query result:', result.rows);
      if (result.rowCount > 0) {
        res.json(result.rows);
      } else {
        res.status(404).json({ error: 'No jobs found' });
      }
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = route;