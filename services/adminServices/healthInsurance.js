const exe = require('../../config/db');

const createInsuranceTypes = async (name) => {
    const query = `INSERT INTO insurance_types (name) VALUES ($1) RETURNING *`;
    const values = [name];
        const result = await exe(query, values);
        if (result && result.rows && result.rows.length > 0) {
            return result.rows[0];
        }
};                         
const updateInsuranceTypes = async (id, name, status = null) => {
    const existingQuery = `SELECT * FROM insurance_types WHERE id = $1`;
    const existingResult = await exe(existingQuery, [id]);
    if (existingResult.rows.length === 0) {
        return null;
    }
    const existingInsuranceType = existingResult.rows[0];
    const updatedName = name || existingInsuranceType.name;
    const updatedStatus = status || existingInsuranceType.status;
    const updateQuery = `UPDATE insurance_types SET name = $1, status = $2, updated_at = NOW() WHERE id = $3 RETURNING *`;
    const updateValues = [updatedName, updatedStatus, id];
    const updateResult = await exe(updateQuery, updateValues);
    return updateResult.rows[0];
};
const createAgeGroup = async (range) => {
    const query = `INSERT INTO age_groups (range) VALUES ($1) RETURNING *`;
    const values = [range];
    const result = await exe(query, values);
    return result.rows[0];
};

const updateAgeGroup = async (id, ageGroupData) => {
    const { range, status } = ageGroupData;
    const checkQuery = 'SELECT * FROM age_groups WHERE id = $1';
    const checkValues = [id];
    const checkResult = await exe(checkQuery, checkValues);

    if (checkResult.rowCount === 0) {
        console.log(`Age Group with ID ${id} not found.`);
        return null; 
    }
    let query = 'UPDATE age_groups SET ';
    const values = [];
    const updates = [];
    if (range) {
        updates.push(`range = $${updates.length + 1}`);
        values.push(range);
    }
    if (status) {
        updates.push(`status = $${updates.length + 1}`);
        values.push(status);
    }
    if (updates.length === 0) {
        throw new Error('No fields provided for update.');
    }
    query += updates.join(', ') + `, updated_at = NOW() WHERE id = $${updates.length + 1} RETURNING *`;
    values.push(id);
    const result = await exe(query, values);
    if (result.rowCount === 0) {
        console.log(`No rows updated for Age Group with ID ${id}.`);
        return null; 
    }
    return result.rows[0]; 
};

const createCoverAmount = async (age_group_id,insurance_type_id, amount) => {
    const checkQuery = `SELECT 
        (SELECT COUNT(*) FROM insurance_types WHERE id = $1) AS insurance_exists,
        (SELECT COUNT(*) FROM age_groups WHERE id = $2) AS age_group_exists;`;
const checkValues = [insurance_type_id, age_group_id];
const checkResult = await exe(checkQuery, checkValues);
const { insurance_exists, age_group_exists } = checkResult.rows[0];
if (insurance_exists == 0) {
    throw new Error(`Insurance type ID ${insurance_type_id} not found.`);
}
if (age_group_exists == 0) {
    throw new Error(`Age group ID ${age_group_id} not found.`);
}
    const query = `INSERT INTO cover_amounts (insurance_type_id,age_group_id, amount) VALUES ($1, $2, $3) RETURNING *`;
    const values = [insurance_type_id,age_group_id, amount];
    const result = await exe(query, values);
    return result.rows[0];
};
const updateCoverAmount = async (id, coverAmountData) => {
    const existingQuery = `SELECT * FROM cover_amounts WHERE id = $1`;
    const existingResult = await exe(existingQuery, [id]);
    if (existingResult.rows.length === 0) {
        return null;
    }
    const existingCoverAmount = existingResult.rows[0];
    const updatedAgeGroupId = coverAmountData.age_group_id || existingCoverAmount.age_group_id;
    const updatedInsuranceTypeId = coverAmountData.insurance_type_id || existingCoverAmount.insurance_type_id;
    const updatedAmount = coverAmountData.amount || existingCoverAmount.amount;

    const updateQuery = `UPDATE cover_amounts SET age_group_id = $1, insurance_type_id = $2, amount = $3 WHERE id = $4 RETURNING *`;
    const updateValues = [updatedAgeGroupId, updatedInsuranceTypeId, updatedAmount, id];
    const updateResult = await exe(updateQuery, updateValues);
    return updateResult.rows[0];
};
const createInsurer = async (insurerData) => {
    const { insurance_type_id, age_group_id, monthly_rate, annually_rate, monthly_benefit1, monthly_benefit2, annually_benefit1,annually_benefit2 } = insurerData;

    const checkQuery = `SELECT 
        (SELECT COUNT(*) FROM insurance_types WHERE id = $1) AS insurance_exists,
        (SELECT COUNT(*) FROM age_groups WHERE id = $2) AS age_group_exists;`;
    const checkValues = [insurance_type_id, age_group_id];
    const checkResult = await exe(checkQuery, checkValues);

    const { insurance_exists, age_group_exists } = checkResult.rows[0];
    if (insurance_exists == 0) {
        throw new Error(`Insurance type ID ${insurance_type_id} not found.`);
    }
    if (age_group_exists == 0) {
        throw new Error(`Age group ID ${age_group_id} not found.`);
    }
    const query =`INSERT INTO insurer(insurance_type_id,age_group_id,monthly_rate,annually_rate,monthly_benefit1,
            monthly_benefit2,annually_benefit1,annually_benefit2 )VALUES($1, $2, $3, $4, $5, $6, $7, $8)RETURNING *`;   
    const values = [ insurance_type_id, age_group_id, monthly_rate, annually_rate, monthly_benefit1, monthly_benefit2, annually_benefit1, annually_benefit2];
    const result = await exe(query, values);
    return result.rows[0];
};
const updateInsurer = async (id, insurerData) => {
    const fields = [];
    const values = [];
    let index = 1;
    for (const [key, value] of Object.entries(insurerData)) {
        if (value !== undefined && value !== null) {
            fields.push(`${key} = $${index}`);
            values.push(value);
            index++;
        }
    }
    if (fields.length === 0) {
        throw new Error('No fields to update');
    }
    const query = `UPDATE insurer SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
    values.push(id);

    const result = await exe(query, values);
    return result.rows[0];
};

module.exports = {
    createInsuranceTypes,
    updateInsuranceTypes,
    createAgeGroup,
    updateAgeGroup,
    createCoverAmount,
    updateCoverAmount,
    createInsurer,
    updateInsurer
  };
  