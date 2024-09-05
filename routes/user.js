
const express = require ("express");
const exe = require ("./connection");
const route = express.Router();
const multer = require('multer');
const path = require('path');


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


route.get("/add",(req,res)=>{
    res.send("Hello World");
})
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
              [position, company, education_degree, education_field, skills, resume_file, profile_picture, status, experience, new Date(), user_id]
          );
          return res.status(200).json({ message: 'Profile updated successfully' });
      } else {
          await exe(`INSERT INTO user_job_profile (user_id, name, position, company, education_degree, education_field, skills, resume_file, profile_picture, status, experience)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
              [user_id, username, position, company, education_degree, education_field, skills, resume_file, profile_picture, status, experience]
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
        contact4_name, contact4_phone_number, contact4_relation,
        contact5_name, contact5_phone_number, contact5_relation
    } = req.body;
    const user_id = req.params.id;

    // Create an array of contact objects
    const contacts = [
        { name: contact1_name, phone_number: contact1_phone_number, relation: contact1_relation },
        { name: contact2_name, phone_number: contact2_phone_number, relation: contact2_relation },
        { name: contact3_name, phone_number: contact3_phone_number, relation: contact3_relation },
        { name: contact4_name, phone_number: contact4_phone_number, relation: contact4_relation },
        { name: contact5_name, phone_number: contact5_phone_number, relation: contact5_relation }
    ];

    // Count the number of filled contacts
    const filledContactsCount = contacts.filter(contact =>
        contact.name && contact.phone_number && contact.relation
    ).length;

    if (filledContactsCount > 4) {
        return res.status(400).json({ error: 'Cannot add more than 4 contacts' });
    }

    if (!user_id) {
        return res.status(400).json({ error: 'user_id is required' });
    }

    try {
        // Check if the user exists
        const userCheck = await exe(`SELECT user_id FROM users WHERE user_id = $1`, [user_id]);
        if (userCheck.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Insert or update contacts
        await exe(`
            INSERT INTO emergency_contacts (
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
                updated_at = CURRENT_TIMESTAMP
        `, [
            user_id,
            contact1_name || null, contact1_phone_number || null, contact1_relation || null,
            contact2_name || null, contact2_phone_number || null, contact2_relation || null,
            contact3_name || null, contact3_phone_number || null, contact3_relation || null,
            contact4_name || null, contact4_phone_number || null, contact4_relation || null
        ]);

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


route.get('/get-contacts/:id', async (req, res) => {
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



module.exports = route;



// CREATE TABLE contacts (
//   user_id INT PRIMARY KEY, -- This assumes one row per user_id
//   contact1_name VARCHAR(100),
//   contact1_phone_number VARCHAR(20),
//   contact1_relation VARCHAR(50),
//   contact2_name VARCHAR(100),
//   contact2_phone_number VARCHAR(20),
//   contact2_relation VARCHAR(50),
//   contact3_name VARCHAR(100),
//   contact3_phone_number VARCHAR(20),
//   contact3_relation VARCHAR(50),
//   contact4_name VARCHAR(100),
//   contact4_phone_number VARCHAR(20),
//   contact4_relation VARCHAR(50),
//   FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
// );
// INSERT INTO contacts (user_id, contact1_name, contact1_phone_number, contact1_relation, contact1_is_deleted,
//   contact2_name, contact2_phone_number, contact2_relation, contact2_is_deleted,
//   contact3_name, contact3_phone_number, contact3_relation, contact3_is_deleted,
//   contact4_name, contact4_phone_number, contact4_relation, contact4_is_deleted) 
// VALUES (1, 'Alice Smith', '555-1234', 'Friend', FALSE,
// 'Bob Johnson', '555-5678', 'Colleague', FALSE,
// 'Carol Davis', '555-8765', 'Family', FALSE,
// 'David Brown', '555-4321', 'Neighbor', FALSE);


// UPDATE contacts
// SET contact1_is_deleted = TRUE
// WHERE user_id = 1;

// UPDATE contacts
// SET contact1_is_deleted = TRUE
// WHERE user_id = 1;


// SELECT user_id, contact1_name, contact1_phone_number, contact1_relation
// FROM contacts
// WHERE user_id = 1
//   AND contact1_is_deleted = FALSE;

// -- Repeat similarly for other contacts, or use dynamic queries if necessary

// const express = require('express');
// const { Pool } = require('pg');
// const bodyParser = require('body-parser');

// // Initialize Express app
// const app = express();
// app.use(bodyParser.json());

// Configure PostgreSQL connection
// const pool = new Pool({
//     user: 'your-db-user',
//     host: 'localhost',
//     database: 'your-db-name',
//     password: 'your-db-password',
//     port: 5432,
// });

// Define the route to update contact details
// app.post('/update-contact', async (req, res) => {
//     const { user_id, contact1, contact2, contact3, contact4 } = req.body;

//     if (!user_id) {
//         return res.status(400).json({ error: 'user_id is required' });
//     }

//     const client = await pool.connect();

//     try {
//         await client.query('BEGIN');

//         // Mark existing contacts as deleted
//         await client.query(`
//             UPDATE contacts
//             SET contact1_is_deleted = TRUE
//             WHERE user_id = $1 AND contact1_is_deleted = FALSE;
//         `, [user_id]);

//         await client.query(`
//             UPDATE contacts
//             SET contact2_is_deleted = TRUE
//             WHERE user_id = $1 AND contact2_is_deleted = FALSE;
//         `, [user_id]);

//         await client.query(`
//             UPDATE contacts
//             SET contact3_is_deleted = TRUE
//             WHERE user_id = $1 AND contact3_is_deleted = FALSE;
//         `, [user_id]);

//         await client.query(`
//             UPDATE contacts
//             SET contact4_is_deleted = TRUE
//             WHERE user_id = $1 AND contact4_is_deleted = FALSE;
//         `, [user_id]);

//         // Insert new contact details
//         await client.query(`
//             INSERT INTO contacts (
//                 user_id, contact1_name, contact1_phone_number, contact1_relation, contact1_is_deleted,
//                 contact2_name, contact2_phone_number, contact2_relation, contact2_is_deleted,
//                 contact3_name, contact3_phone_number, contact3_relation, contact3_is_deleted,
//                 contact4_name, contact4_phone_number, contact4_relation, contact4_is_deleted
//             ) VALUES (
//                 $1, $2, $3, $4, FALSE,
//                 $5, $6, $7, FALSE,
//                 $8, $9, $10, FALSE,
//                 $11, $12, $13, FALSE
//             )
//             ON CONFLICT (user_id) DO UPDATE
//             SET
//                 contact1_name = EXCLUDED.contact1_name,
//                 contact1_phone_number = EXCLUDED.contact1_phone_number,
//                 contact1_relation = EXCLUDED.contact1_relation,
//                 contact1_is_deleted = EXCLUDED.contact1_is_deleted,
//                 contact2_name = EXCLUDED.contact2_name,
//                 contact2_phone_number = EXCLUDED.contact2_phone_number,
//                 contact2_relation = EXCLUDED.contact2_relation,
//                 contact2_is_deleted = EXCLUDED.contact2_is_deleted,
//                 contact3_name = EXCLUDED.contact3_name,
//                 contact3_phone_number = EXCLUDED.contact3_phone_number,
//                 contact3_relation = EXCLUDED.contact3_relation,
//                 contact3_is_deleted = EXCLUDED.contact3_is_deleted,
//                 contact4_name = EXCLUDED.contact4_name,
//                 contact4_phone_number = EXCLUDED.contact4_phone_number,
//                 contact4_relation = EXCLUDED.contact4_relation,
//                 contact4_is_deleted = EXCLUDED.contact4_is_deleted,
//                 updated_at = CURRENT_TIMESTAMP
//         `, [
//             user_id, contact1?.name, contact1?.phone_number, contact1?.relation,
//             contact2?.name, contact2?.phone_number, contact2?.relation,
//             contact3?.name, contact3?.phone_number, contact3?.relation,
//             contact4?.name, contact4?.phone_number, contact4?.relation
//         ]);

//         await client.query('COMMIT');
//         res.status(200).json({ message: 'Contacts updated successfully' });
//     } catch (error) {
//         await client.query('ROLLBACK');
//         console.error('Error updating contacts:', error);
//         res.status(500).json({ error: 'Failed to update contacts' });
//     } finally {
//         client.release();
//     }
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
