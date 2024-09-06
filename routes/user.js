
const express = require ("express");
const exe = require ("./connection");
const route = express.Router();
const multer = require('multer');
const path = require('path');
const { swaggerUiSetup, swaggerUiDocument } = require('../swagger');


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

/**
 * @swagger
 * /add:
 *   get:
 *     summary: Returns a hello message
 *     responses:
 *       200:
 *         description: A hello message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Hello World!'
 */

route.get("/add",(req,res)=>{
    res.send("Hello World");
})
/**
 * @swagger
 * /add_address_details:
 *   post:
 *     summary: Insert address
 *     responses:
 *       200:
 *         description: Insert address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ''
 */

route.post('/add_address_details', async (req, res) => {

    console.log('Request body:', req.body); 

    const { pincode, house_number, recipient_name, phone_number, address_name_type } = req.body;
    
    if (!pincode || !house_number || !recipient_name || !phone_number || !address_name_type) {
        return res.status(400).json({ pincode: 'fields are required',house_number:'fields are required',recipient_name:'fields are required',phone_number:'fields are required',address_name_type:'fields are required'});
    }

    const sql = `INSERT INTO add_address(pincode, house_number, recipient_name, phone_number, address_name_type) VALUES ($1, $2, $3, $4, $5)`;
    const values = [pincode, house_number, recipient_name, phone_number, address_name_type];
  
    try {
        const result = await exe(sql, values);
        res.status(201).json({ success: 'Address Added successfully' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  
});



route.post('/user-job-profile/:id', upload.fields([{ name: 'resume_file', maxCount: 1 }, { name: 'profile_picture', maxCount: 1 }]), async (req, res) => {
  const user_id = req.params.id;
  console.log('User id is:', user_id);
  
  const { position, company, education_degree, education_field, skills, status, experience } = req.body;

  const resume_file = req.files['resume_file'] ? req.files['resume_file'][0].buffer : null;
  const profile_picture = req.files['profile_picture'] ? req.files['profile_picture'][0].buffer : null;
 
  const validStatuses = ['Active', 'Inactive'];
    if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value. Must be "Active" or "Inactive"' });
    }
  
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

    // Emergency contacts Api
             
  // Add Emergency Contacts
  route.post('/insert-contacts/:id', async (req, res) => {
    const {
        contact1_name, contact1_phone_number, contact1_relation,
        contact2_name, contact2_phone_number, contact2_relation,
        contact3_name, contact3_phone_number, contact3_relation,
        contact4_name, contact4_phone_number, contact4_relation
    } = req.body;
    const user_id = req.params.id;

    // Create an array of contact objects from the request
    const newContacts = [
        { name: contact1_name, phone_number: contact1_phone_number, relation: contact1_relation },
        { name: contact2_name, phone_number: contact2_phone_number, relation: contact2_relation },
        { name: contact3_name, phone_number: contact3_phone_number, relation: contact3_relation },
        { name: contact4_name, phone_number: contact4_phone_number, relation: contact4_relation }
    ];

    // Filter out contacts that are not null or empty (i.e., valid new contacts)
    const nonNullContacts = newContacts.filter(contact =>
        contact.name || contact.phone_number || contact.relation
    );

    if (!user_id) {
        return res.status(400).json({ error: 'user_id is required' });
    }

    try {
        // Check if the user exists
        const userCheck = await exe('SELECT user_id FROM users WHERE user_id = $1', [user_id]);
        if (userCheck.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch existing contacts for this user
        const existingContacts = await exe('SELECT * FROM emergency_contacts WHERE user_id = $1', [user_id]);

        const existing = existingContacts.rows[0] || {}; // Handle cases where no contacts exist yet
        const existingContactFields = [
            { name: existing.contact1_name, phone_number: existing.contact1_phone_number, relation: existing.contact1_relation },
            { name: existing.contact2_name, phone_number: existing.contact2_phone_number, relation: existing.contact2_relation },
            { name: existing.contact3_name, phone_number: existing.contact3_phone_number, relation: existing.contact3_relation },
            { name: existing.contact4_name, phone_number: existing.contact4_phone_number, relation: existing.contact4_relation }
        ];

        // Count how many existing contacts are complete (i.e., all fields are non-null and non-empty)
        const completeExistingContacts = existingContactFields.filter(contact =>
            contact.name && contact.phone_number && contact.relation
        ).length;

        // If the user has 4 complete contacts and is trying to add more, return an error
        if (completeExistingContacts === 4 && nonNullContacts.length > 0) {
            return res.status(400).json({ error: 'Cannot add a 5th contact. All 4 contact slots are already filled.' });
        }

        // Prepare values for insertion/updating, filling only null/empty slots
        const values = [
            user_id,
            contact1_name || existing.contact1_name || null, contact1_phone_number || existing.contact1_phone_number || null, contact1_relation || existing.contact1_relation || null,
            contact2_name || existing.contact2_name || null, contact2_phone_number || existing.contact2_phone_number || null, contact2_relation || existing.contact2_relation || null,
            contact3_name || existing.contact3_name || null, contact3_phone_number || existing.contact3_phone_number || null, contact3_relation || existing.contact3_relation || null,
            contact4_name || existing.contact4_name || null, contact4_phone_number || existing.contact4_phone_number || null, contact4_relation || existing.contact4_relation || null
        ];

        // Insert or update contacts
        await exe(
            `INSERT INTO emergency_contacts (
                user_id, contact1_name, contact1_phone_number, contact1_relation,
                contact2_name, contact2_phone_number, contact2_relation,
                contact3_name, contact3_phone_number, contact3_relation,
                contact4_name, contact4_phone_number, contact4_relation
            ) VALUES (
                $1, $2, $3, $4,
                $5, $6, $7,
                $8, $9, $10,
                $11, $12, $13
            )
            ON CONFLICT (user_id) DO UPDATE
            SET
                contact1_name = COALESCE(EXCLUDED.contact1_name, emergency_contacts.contact1_name),
                contact1_phone_number = COALESCE(EXCLUDED.contact1_phone_number, emergency_contacts.contact1_phone_number),
                contact1_relation = COALESCE(EXCLUDED.contact1_relation, emergency_contacts.contact1_relation),
                contact2_name = COALESCE(EXCLUDED.contact2_name, emergency_contacts.contact2_name),
                contact2_phone_number = COALESCE(EXCLUDED.contact2_phone_number, emergency_contacts.contact2_phone_number),
                contact2_relation = COALESCE(EXCLUDED.contact2_relation, emergency_contacts.contact2_relation),
                contact3_name = COALESCE(EXCLUDED.contact3_name, emergency_contacts.contact3_name),
                contact3_phone_number = COALESCE(EXCLUDED.contact3_phone_number, emergency_contacts.contact3_phone_number),
                contact3_relation = COALESCE(EXCLUDED.contact3_relation, emergency_contacts.contact3_relation),
                contact4_name = COALESCE(EXCLUDED.contact4_name, emergency_contacts.contact4_name),
                contact4_phone_number = COALESCE(EXCLUDED.contact4_phone_number, emergency_contacts.contact4_phone_number),
                contact4_relation = COALESCE(EXCLUDED.contact4_relation, emergency_contacts.contact4_relation),
                updated_at = CURRENT_TIMESTAMP`, values);

        res.status(200).json({ message: 'Contacts inserted or updated successfully' });
    } catch (error) {
        console.error('Error inserting or updating contacts:', error);
        res.status(500).json({ error: 'Failed to insert or update contacts' });
    }
});




                    
            //   Delete contact 1

route.post('/delete-contact1/:id', async (req, res) => {
    const user_id = req.params.id;

    if (!user_id) {
        return res.status(400).json({ error: 'user_id is required' });
    }

    try {
        // Check if the user exists
        const userCheck = await exe('SELECT user_id FROM users WHERE user_id = $1', [user_id]);
        if (userCheck.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update contact1 fields to NULL
        await exe(`
            UPDATE emergency_contacts
            SET
                contact1_name = NULL,
                contact1_phone_number = NULL,
                contact1_relation = NULL,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $1
        `, [user_id]);

        res.status(200).json({ message: 'Contact 1 has been deleted' });
    } catch (error) {
        console.error('Error deleting contact 1:', error);
        res.status(500).json({ error: 'Failed to delete contact 1' });
    }
});

             //   Delete contact 2

route.post('/delete-contact2/:id', async (req, res) => {
    const user_id = req.params.id;

    if (!user_id) {
        return res.status(400).json({ error: 'user_id is required' });
    }

    try {
        // Check if the user exists
        const userCheck = await exe('SELECT user_id FROM users WHERE user_id = $1', [user_id]);
        if (userCheck.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update contact2 fields to NULL
        await exe(`
            UPDATE emergency_contacts
            SET
                contact2_name = NULL,
                contact2_phone_number = NULL,
                contact2_relation = NULL,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $1
        `, [user_id]);

        res.status(200).json({ message: 'Contact 2 has been deleted' });
    } catch (error) {
        console.error('Error deleting contact 2:', error);
        res.status(500).json({ error: 'Failed to delete contact 2' });
    }
});

             //   Delete contact 3

route.post('/delete-contact3/:id', async (req, res) => {
    const user_id = req.params.id;

    if (!user_id) {
        return res.status(400).json({ error: 'user_id is required' });
    }

    try {
        // Check if the user exists
        const userCheck = await exe('SELECT user_id FROM users WHERE user_id = $1', [user_id]);
        if (userCheck.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update contact3 fields to NULL
        await exe(`
            UPDATE emergency_contacts
            SET
                contact3_name = NULL,
                contact3_phone_number = NULL,
                contact3_relation = NULL,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $1
        `, [user_id]);

        res.status(200).json({ message: 'Contact 3 has been deleted' });
    } catch (error) {
        console.error('Error deleting contact 3:', error);
        res.status(500).json({ error: 'Failed to delete contact 3' });
    }
});
             //   Delete contact 4

route.post('/delete-contact4/:id', async (req, res) => {
    const user_id = req.params.id;

    if (!user_id) {
        return res.status(400).json({ error: 'user_id is required' });
    }

    try {
        // Check if the user exists
        const userCheck = await exe('SELECT user_id FROM users WHERE user_id = $1', [user_id]);
        if (userCheck.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update contact4 fields to NULL
        await exe(`
            UPDATE emergency_contacts
            SET
                contact4_name = NULL,
                contact4_phone_number = NULL,
                contact4_relation = NULL,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $1
        `, [user_id]);

        res.status(200).json({ message: 'Contact 4 has been deleted' });
    } catch (error) {
        console.error('Error deleting contact 4:', error);
        res.status(500).json({ error: 'Failed to delete contact 4' });
    }
});


route.get('/emergency-contacts/:id', async (req, res) => {
    const user_id = req.params.id;

    if (!user_id) {
        return res.status(400).json({ error: 'user_id is required' });
    }

    try {
        // Check if the user exists
        const userCheck = await exe('SELECT user_id FROM users WHERE user_id = $1', [user_id]);
        if (userCheck.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Retrieve contact details for the user
        const contacts = await exe(`
            SELECT
                contact1_name, contact1_phone_number, contact1_relation,
                contact2_name, contact2_phone_number, contact2_relation,
                contact3_name, contact3_phone_number, contact3_relation,
                contact4_name, contact4_phone_number, contact4_relation
            FROM emergency_contacts
            WHERE user_id = $1
        `, [user_id]);

        if (contacts.rowCount === 0) {
            return res.status(404).json({ error: 'No contacts found for this user' });
        }

        // Extract the contact data
        const contactData = contacts.rows[0];

        // Remove fields with null values
        const filteredContacts = Object.fromEntries(
            Object.entries(contactData).filter(([key, value]) => value !== null)
        );

        res.status(200).json({ contacts: filteredContacts });
    } catch (error) {
        console.error('Error retrieving contacts:', error);
        res.status(500).json({ error: 'Failed to retrieve contacts' });
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


module.exports = route;
