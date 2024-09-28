const getHealthInsurance = require('../../services/userServices/healthInsurance');

const getAllInsuranceTypes = async (req, res) => {
    try {
        const result = await getHealthInsurance.getAllInsuranceTypes();
        const insuranceTypes = result.rows; // Extract only the rows
        res.status(200).json({ success: true, insuranceTypes }); // Return only rows
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};
const getAllAgeGroups = async (req, res) => {
    try {
        const result = await getHealthInsurance.getAllAgeGroups();
        const insuranceTypes = result.rows; // Extract only the rows
        res.status(200).json({ success: true, insuranceTypes }); // Return only rows
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};
const getAllCoverAmount = async (req, res) => {
    try {
        const result = await getHealthInsurance.getAllCoverAmount();
        const insuranceTypes = result.rows; //Extract only the rows
        res.status(200).json({ success: true, insuranceTypes }); // Return only rows
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};
const getAllInsurer = async (req, res) => {
    try {
        const result = await getHealthInsurance.getAllInsurer();
        const insuranceTypes = result.rows; //Extract only the rows
        res.status(200).json({ success: true, insuranceTypes }); // Return only rows
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};
const addUserDetails = async (req, res) => {
    const { full_name, gender, date_of_birth, mobile_no, email } = req.body;

    const validations = [
      { field: full_name, message: 'Full name is required.' },
      { field: gender, message: 'Gender is required.' },
      { field: date_of_birth, message: 'Date of birth is required.' },
      { field: mobile_no, message: 'Mobile number is required.' },
      { field: email, message: 'Email is required.' },
    ];

    if (!['Male', 'Female'].includes(gender)) {
      return res.status(400).json({ message: 'Gender must be either Male or Female.' });
    }

    for (const { field, message } of validations) {
      if (!field) return res.status(400).json({ message });
    }

    try {
      const newUser = await getHealthInsurance.adduserDetails({ full_name, gender, date_of_birth, mobile_no, email });
      return res.status(201).json({ message: 'User details added successfully', user: newUser });
    } catch (error) {
      console.error('Error adding user details:', error); // Log the actual error
      return res.status(500).json({ message: 'An error occurred while adding user details.' });
    }
};
const updateUserDetails = async (req, res) => {
    const { id } = req.params;
    const { full_name, gender, date_of_birth, mobile_no, email, status } = req.body;
    if (gender && !['Male', 'Female'].includes(gender)) {
        return res.status(400).json({ message: 'Gender must be either Male or Female.' });
    }
    try {
        const updatedUser = await getHealthInsurance.updateUserDetails({ id, full_name, gender, date_of_birth, mobile_no, email, status });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found or update failed.' });
        }
        return res.status(200).json({ message: 'User details updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user details:', error);
        return res.status(500).json({ message: 'An error occurred while updating user details.' });
    }
};



module.exports = {
    getAllInsuranceTypes,
    getAllAgeGroups,
    getAllCoverAmount,
    getAllInsurer,
    addUserDetails,
    updateUserDetails
};