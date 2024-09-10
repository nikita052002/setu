var express = require ("express");
var exe = require ("./connection");
const { render } = require("ejs");
var route = express.Router();
const { swaggerUiSetup, swaggerUiDocument } = require('../swagger');



route.get("/add",function (req,res){
    res.render("home.ejs");   
});


route.post('/submit_plan', async (req, res) => {
    const {
        vendor_id, category, subcategory, plan_name, duration, price, feature1, feature2, feature3, feature4, status} = req.body;

    if (!vendor_id || !category || !subcategory || !plan_name || !duration || !price || !feature1 || !feature2 || !feature3 || !feature4) {
        return res.status(400).json({ error: 'All fields  are required' });
    }

    const validStatuses = ['Active', 'Inactive'];
    if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value. Must be "Active" or "Inactive"' });
    }

    try {
        const result = await exe(
            `INSERT INTO SubscriptionPlan ( vendor_id, category, subcategory, plan_name, duration, price, feature1, feature2, feature3, feature4, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [ vendor_id, category, subcategory, plan_name, duration, price, feature1, feature2, feature3, feature4, status || 'Active'
            ]
        );

        res.status(201).json({ message: 'Plan submitted successfully!' });
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

route.put('/update_plan/:id', async (req, res) => {
    const planId = req.params.id;
    const {
        vendor_id, category, subcategory, plan_name, duration, price, feature1, feature2, feature3, feature4, status
    } = req.body;

    // Build the update query dynamically based on provided fields
    const fieldsToUpdate = {};
    if (vendor_id) fieldsToUpdate.vendor_id = vendor_id;
    if (category) fieldsToUpdate.category = category;
    if (subcategory) fieldsToUpdate.subcategory = subcategory;
    if (plan_name) fieldsToUpdate.plan_name = plan_name;
    if (duration) fieldsToUpdate.duration = duration;
    if (price) fieldsToUpdate.price = price;
    if (feature1) fieldsToUpdate.feature1 = feature1;
    if (feature2) fieldsToUpdate.feature2 = feature2;
    if (feature3) fieldsToUpdate.feature3 = feature3;
    if (feature4) fieldsToUpdate.feature4 = feature4;
    if (status) {
        const validStatuses = ['Active', 'Inactive'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status value. Must be "Active" or "Inactive"' });
        }
        fieldsToUpdate.status = status;
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    // Build the SQL query dynamically
    const setClause = Object.keys(fieldsToUpdate)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');

    const query = `UPDATE SubscriptionPlan SET ${setClause} WHERE id = $1`;

    const values = [planId, ...Object.values(fieldsToUpdate)];

    try {
        const result = await exe(query, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Plan not found' });
        }
        res.status(200).json({ message: 'Plan updated successfully!' });
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


route.get('/subscription-plan/:id', async (req, res) => {
    const planId = req.params.id;

    try {
        const result = await exe(
            'SELECT * FROM SubscriptionPlan WHERE id = $1',
            [planId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


route.post('/job-postings', async (req, res) => {
    const {job_title,company_name,location,email,contact_number,  skills,education, pay,job_type,shift_schedule,job_description, skills_and_responsibilities, qualifications,status, category } = req.body;

    const errors = {};
    if (!job_title) errors.job_title = 'Job title is required';
    if (!company_name) errors.company_name = 'Company name is required';
    if (!location) errors.location = 'Location is required';
    if (!category) errors.category = 'Category is required'; // Validate category

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: 'Validation errors',
        errors
      });
    }
    const validStatuses = ['Open', 'Close'];
    if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value. Must be "Open" or "Close"' });
    }
  
    try {
      const result = await exe(
        `INSERT INTO job_postings (
          job_title, company_name, location, email, contact_number, skills, education, pay, job_type, shift_schedule, job_description, skills_and_responsibilities, qualifications, status, category
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
        [
          job_title, company_name,location, email || null,contact_number || null, skills || null,education || null,pay || null, job_type || null,shift_schedule || null, job_description || null,skills_and_responsibilities || null, qualifications || null, status || 'Open',category 
        ] );
  
      const newJobPosting = result.rows[0];
      res.status(200).json({ message: 'Job posted successfully' });

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
  const validStatuses = ['Open', 'Close'];
    if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value. Must be "Open" or "Close"' });
    }
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
      values.push(status || 'Open');
  }

  query += `updated_at = CURRENT_TIMESTAMP, `;

  query = query.slice(0, -2);

  query += ` WHERE id = $${valueIndex} RETURNING *`;
  values.push(id);

  try {
      console.log('Executing query:', query);
      console.log('With values:', values);
      const result = await exe(query, values);

      if (result.rowCount === 0) {
          return res.status(404).json({ error: 'Job posting not found' });
      }

      const updatedJobPosting = result.rows[0];
      res.status(200).json({ message: 'Job posting updated successfully' });
  } catch (error) {
      console.error('Error updating job posting:', error);
      res.status(500).json({ error: 'An error occurred while updating the job posting' });
  }
});

//  *** Fitness***

//             ************** Health Videos ***********

route.post('/health-video', async (req, res) => {
    const { description, category, subcategory, video_url, is_popular} = req.body;

    if (!category || !type) {
      return res.status(400).json({ description: 'This field are required',category:'This field are required',subcategory: 'This field are required',video_url:'This field are required',is_popular:'This field are required'});
    }
    try {
      const query = `INSERT INTO health_videos (description, category, subcategory, video_url, is_popular) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
      const values = [description, category, subcategory, video_url, is_popular || false];
      const result = await exe(query, values);

      res.status(201).json({
        message: 'Video added successfully',
        video: result.rows[0] });

    } catch (error) {
      console.error('Error inserting video:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

route.put('/health-video/:id', async (req, res) => {
  const { id } = req.params;  // Get video_id from the URL parameter
  const { description, category, subcategory, video_url, is_popular } = req.body;

  if (!category || !subcategory || !video_url || is_popular === undefined) {
    return res.status(400).json({
      error: 'All fields (category, subcategory, video_url, is_popular) are required'
    });
  }

  try {
    const query = `UPDATE health_videos SET description = $1,category = $2,subcategory = $3,video_url = $4,is_popular = $5,updated_at = CURRENT_TIMESTAMP WHERE video_id = $6 RETURNING *;`;
    
    const values = [description, category, subcategory, video_url, is_popular, id];

    const result = await exe(query, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.status(200).json({
      message: 'Video updated successfully',
      video: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//               **************** live streamming **********

route.post('/live-streams', async (req, res) => {
    const { date, time, title, category, description, video_url, is_live } = req.body;

    if (!date || !time || !title || typeof is_live !== 'boolean') {
        return res.status(400).json({ error: 'Required fields are missing or invalid' });
    }

    try {
        const result = await exe(`
            INSERT INTO live_streaming (date, time, title, category, description, video_url, is_live)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, date, time, title, category, description, video_url, is_live, created_time
        `, [date, time, title, category, description, video_url, is_live]);

        res.status(201).json({message: 'Live stream created successfully',
        });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

route.put('/live-streams/:id', async (req, res) => {
    const { id } = req.params;
    const { date, time, title, category, description, video_url, is_live } = req.body;

    // Validate required fields
    if (!date || !time || !title || typeof is_live !== 'boolean') {
        return res.status(400).json({ error: 'Required fields are missing or invalid' });
    }

    try {
        const result = await exe(`
            UPDATE live_streaming
            SET date = $1, time = $2, title = $3, category = $4, description = $5, video_url = $6, is_live = $7, updated_time = CURRENT_TIMESTAMP
            WHERE id = $8
            RETURNING id, date, time, title, category, description, video_url, is_live, created_time, updated_time
        `, [date, time, title, category, description, video_url, is_live, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Live stream not found' });
        }

        res.status(200).json({message: 'Live stream updated successfully',
        });
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = route;



