const express = require ("express");
const exe = require ("../db");
const route = express.Router();
const { swaggerUiSetup, swaggerUiDocument } = require('../swagger');

  //             ************** Emergency contacts Api ***********
             
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

module.exports = route;
