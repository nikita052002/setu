const exe = require('../../config/db');

const getAllInsuranceTypes = async () => {
    const query = "SELECT * FROM insurance_types WHERE status = 'Active'";
    return await exe(query);
};
const getAllAgeGroups = async () => {
    const query = "SELECT * FROM age_groups WHERE status = 'Active'";
    return await exe(query);
};
const getAllCoverAmount = async () => {
    const query = "SELECT * FROM cover_amounts WHERE status = 'Active'";
    return await exe(query);
};
const getAllInsurer = async () => {
    const query = "SELECT * FROM insurer WHERE status = 'Active'";
    return await exe(query);
};
const adduserDetails =  async (userData) => {
    const { full_name, gender, date_of_birth, mobile_no, email } = userData;
    const query = `INSERT INTO add_your_details (full_name, gender, date_of_birth, mobile_no, email, status)VALUES ($1, $2, $3, $4, $5, 'active')RETURNING *;`;
  try {
      const result = await exe(query, [full_name, gender, date_of_birth, mobile_no, email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
}
const updateUserDetails = async (userData) => {
    const { id, full_name, gender, date_of_birth, mobile_no, email, status } = userData;
    let query = 'UPDATE add_your_details SET updated_at = CURRENT_TIMESTAMP';
    const values = [];
    let setClause = [];
    if (full_name) {
        setClause.push(`full_name = $${values.length + 1}`);
        values.push(full_name);
    }
    if (gender) {
        setClause.push(`gender = $${values.length + 1}`);
        values.push(gender);
    }
    if (date_of_birth) {
        setClause.push(`date_of_birth = $${values.length + 1}`);
        values.push(date_of_birth);
    }
    if (mobile_no) {
        setClause.push(`mobile_no = $${values.length + 1}`);
        values.push(mobile_no);
    }
    if (email) {
        setClause.push(`email = $${values.length + 1}`);
        values.push(email);
    }
    if (status) {
        setClause.push(`status = $${values.length + 1}`);
        values.push(status);
    }
    if (setClause.length > 0) {
        query += ', ' + setClause.join(', ');
    }
    query += ` WHERE id = $${values.length + 1} RETURNING *;`;
    values.push(id); 
    try {
        const result = await exe(query, values);
        return result.rows[0]; 
    } catch (error) {
        throw error; 
    }
};


module.exports = {
    getAllInsuranceTypes,
    getAllAgeGroups,
    getAllCoverAmount,
    getAllInsurer,
    adduserDetails,
    updateUserDetails
}
