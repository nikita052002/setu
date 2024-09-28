app.get('/api/insurance-details/:insuranceTypeId/:ageGroupId', async (req, res) => {
    const { insuranceTypeId, ageGroupId } = req.params;
    const result = await pool.query(
        `SELECT * FROM insurance_details 
         WHERE insurance_type_id = $1 AND age_group_id = $2`,
        [insuranceTypeId, ageGroupId]
    );
    res.json(result.rows);
});

app.post('/api/mapping', async (req, res) => {
    const { insuranceTypeId, ageGroupId } = req.body;
    const result = await pool.query(
        `INSERT INTO insurance_type_age_group (insurance_type_id, age_group_id) 
         VALUES ($1, $2) RETURNING *`,
        [insuranceTypeId, ageGroupId]
    );
    res.status(201).json(result.rows[0]);
});
