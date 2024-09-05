var express = require ("express");
var exe = require ("./connection");
const { render } = require("ejs");
var route = express.Router();

route.get("/add",function (req,res){
    res.render("home.ejs");   
});
route.post('/submit_plan', async (req, res) => {
    const { plan_name, duration, price, feature1, feature2, feature3, feature4 } = req.body;

    if (! plan_name || !duration || ! price || !feature1 || !feature2 || !feature3 || !feature4) {
        return res.status(400).json({  plan_name: 'fields are required',duration:'fields are required', price:'fields are required',feature1:'fields are required',feature2:'fields are required',feature3:'fields are required',feature4:'fields are required'});
    }
    try {
        const result = await exe(
            `INSERT INTO SubscriptionPlan (plan_name, duration, price, feature1, feature2, feature3, feature4)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [plan_name, duration, price, feature1, feature2, feature3, feature4]
        );
        res.status(201).json({ message: 'Plan submitted successfully!' });
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

route.post('/job-postings', async (req, res) => {
    const {
      job_title,
      company_name,
      location,
      email,
      contact_number,
      skills,
      education,
      pay,
      job_type,
      shift_schedule,
      job_description,
      skills_and_responsibilities,
      qualifications,
      status
    } = req.body;
  
    // Create an errors object
    const errors = {};
  
    // Validate required fields
    if (!job_title) errors.job_title = 'Job title is required';
    if (!company_name) errors.company_name = 'Company name is required';
    if (!location) errors.location = 'Location is required';
  
    // If there are any errors, return them
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: 'Validation errors',
        errors
      });
    }
  
    try {
      const result = await exe(
        `INSERT INTO job_postings (
          job_title, company_name, location, email, contact_number, skills, education, pay, job_type, shift_schedule, job_description, skills_and_responsibilities, qualifications, status
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
        ) RETURNING *`,
        [
          job_title,
          company_name,
          location,
          email || null,
          contact_number || null,
          skills || null,
          education || null,
          pay || null,
          job_type || null,
          shift_schedule || null,
          job_description || null,
          skills_and_responsibilities || null,
          qualifications || null,
          status || null
        ]
      );
  
      const newJobPosting = result.rows[0];
      res.status(201).json(newJobPosting);
    } catch (error) {
      console.error('Error inserting job posting:', error);
      res.status(500).json({ error: 'An error occurred while adding the job posting.' });
    }
  });


route.delete('/job-postings/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'Job posting ID is required' });
    }

    try {
        const result = await exe(
            `DELETE FROM job_postings WHERE id = $1 RETURNING *`,
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Job posting not found' });
        }
        res.status(200).json({ message: 'Job posting deleted successfully' });
    } catch (error) {
        console.error('Error deleting job posting:', error);
        res.status(500).json({ error: 'An error occurred while deleting the job posting' });
    }
});

route.put('/update-job-postings/:id', async (req, res) => {
  const {
      job_title,
      company_name,
      location,
      email,
      contact_number,
      skills,
      education,
      pay,
      job_type,
      shift_schedule,
      job_description,
      skills_and_responsibilities,
      qualifications,
      status
  } = req.body;

  const { id } = req.params;

  // Validate that the ID is provided
  if (!id) {
      return res.status(400).json({ error: 'Job posting ID is required' });
  }

  // Prepare the dynamic SQL query
  let query = 'UPDATE job_postings SET ';
  const values = [];
  let valueIndex = 1;

  // Add fields to be updated dynamically
  if (job_title) {
      query += `job_title = $${valueIndex++}, `;
      values.push(job_title);
  }
  if (company_name) {
      query += `company_name = $${valueIndex++}, `;
      values.push(company_name);
  }
  if (location) {
      query += `location = $${valueIndex++}, `;
      values.push(location);
  }
  if (email) {
      query += `email = $${valueIndex++}, `;
      values.push(email);
  }
  if (contact_number) {
      query += `contact_number = $${valueIndex++}, `;
      values.push(contact_number);
  }
  if (skills) {
      query += `skills = $${valueIndex++}, `;
      values.push(skills);
  }
  if (education) {
      query += `education = $${valueIndex++}, `;
      values.push(education);
  }
  if (pay) {
      query += `pay = $${valueIndex++}, `;
      values.push(pay);
  }
  if (job_type) {
      query += `job_type = $${valueIndex++}, `;
      values.push(job_type);
  }
  if (shift_schedule) {
      query += `shift_schedule = $${valueIndex++}, `;
      values.push(shift_schedule);
  }
  if (job_description) {
      query += `job_description = $${valueIndex++}, `;
      values.push(job_description);
  }
  if (skills_and_responsibilities) {
      query += `skills_and_responsibilities = $${valueIndex++}, `;
      values.push(skills_and_responsibilities);
  }
  if (qualifications) {
      query += `qualifications = $${valueIndex++}, `;
      values.push(qualifications);
  }
  if (status) {
      query += `status = $${valueIndex++}, `;
      values.push(status);
  }

  // Add the updated_at field
  query += `updated_at = CURRENT_TIMESTAMP, `;

  // Remove the trailing comma and space
  query = query.slice(0, -2);

  // Add the WHERE clause
  query += ` WHERE id = $${valueIndex} RETURNING *`;
  values.push(id);

  try {
      // Log the query and values for debugging
      console.log('Executing query:', query);
      console.log('With values:', values);

      // Execute the dynamic UPDATE query
      const result = await exe(query, values);

      // Check if the record was updated
      if (result.rowCount === 0) {
          return res.status(404).json({ error: 'Job posting not found' });
      }

      // Return the updated job posting
      const updatedJobPosting = result.rows[0];
      res.status(200).json(updatedJobPosting);
  } catch (error) {
      console.error('Error updating job posting:', error);
      res.status(500).json({ error: 'An error occurred while updating the job posting' });
  }
});



module.exports = route;



