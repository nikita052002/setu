const healthInsuranceService = require('../../services/adminServices/healthInsurance');

const createInsuranceTypes = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ success: false, message: 'Insurance name is required' });
    }
    try {
        const insuranceType = await healthInsuranceService.createInsuranceTypes(name);
        if (insuranceType) {
            return res.status(201).json({success: true,message: 'Insurance Type created successfully',data: insuranceType});
        } else {
            return res.status(500).json({ success: false, message: 'Failed to create insurance type' });
        }
    } catch (error) {
        console.error('Error creating insurance type:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
const updateInsuranceTypesController = async (req, res) => {
    const { id } = req.params;
    const { name, status } = req.body;
    if (!name && !status) {
        return res.status(400).json({ success: false, message: 'At least one field (name or status) must be provided for update' });
    }
    try {
        const insuranceType = await healthInsuranceService.updateInsuranceTypes(id, name, status);
        if (!insuranceType) {
            return res.status(404).json({ success: false, message: 'Insurance Type not found' });
        }
        res.status(200).json({ success: true, message: 'Insurance Type updated successfully', data: insuranceType });
    } catch (error) {
        console.error('Error updating insurance type:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
const createAgeGroup = async (req, res) => {
    const { range } = req.body; 
    if (!range) {
        return res.status(400).json({ success: false, message: 'Age range is required' });
    }
    try {
        const newAgeGroup = await healthInsuranceService.createAgeGroup(range);
        res.status(201).json({ success: true, message: 'Age Group created successfully', data: newAgeGroup });
    } catch (error) {
        console.error('Error creating age group:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
const updateAgeGroup = async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { range, status } = req.body; // Get the data to update from the request body

    try {
        // Call the service to update the age group
        const result = await healthInsuranceService.updateAgeGroup(id, { range, status });

        if (result) {
            // Return a success response if the update was successful
            return res.status(200).json({
                success: true,
                message: 'Age Group updated successfully',
                data: result,
            });
        } else {
            // Return a 404 response if the age group was not found
            return res.status(404).json({
                success: false,
                message: 'Age Group not found.',
            });
        }
    } catch (error) {
        if (error.message === 'No fields provided for update.') {
            // Return a 400 response if no fields were provided for update
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        // Return a 500 response for any other internal server errors
        console.error('Error updating age group:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};


const createCoverAmountController = async (req, res) => {
    const { insurance_type_id, age_group_id, amount } = req.body;

    try {
        if (!insurance_type_id || !age_group_id || !amount) {
            return res.status(400).json({success: false,message: 'Insurance type ID, Age group ID, and amount are required.'});
        }
        const coverAmount = await healthInsuranceService.createCoverAmount(age_group_id, insurance_type_id, amount);
        return res.status(201).json({success: true,message: 'Cover amount created successfully',data: coverAmount });
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({success: false,message: error.message});
        }
        console.error('Error creating cover amount:', error);
        return res.status(500).json({success: false,message: 'Internal Server Error'});
    }
};


const updateCoverAmountController = async (req, res) => {
    try {
        const { id } = req.params;
        const { age_group_id, insurance_type_id, amount } = req.body;
        const result = await healthInsuranceService.updateCoverAmount(id, { age_group_id, insurance_type_id, amount });

        if (!result) {
            return res.status(404).json({ success: false, message: 'Cover amount not found.' });
        }
        res.status(200).json({
            success: true,
            message: 'Cover amount updated successfully',
            data: result,
        });
    } catch (error) {
        console.error('Error updating cover amount:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const createInsurerController = async (req, res) => {
    try {
        const { insurance_type_id, age_group_id, monthly_rate, annually_rate, monthly_benefit1, monthly_benefit2, annually_benefit1, annually_benefit2 } = req.body;
        if (!insurance_type_id || !age_group_id || !monthly_rate || !annually_rate) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const result = await healthInsuranceService.createInsurer({ 
            insurance_type_id, age_group_id, monthly_rate, annually_rate,
            monthly_benefit1, monthly_benefit2, annually_benefit1, annually_benefit2 
        });
        res.status(201).json(result);
    } catch (error) {
        if (error.message.includes('Insurance type ID')) {
            return res.status(404).json({ message: error.message });
        }
        if (error.message.includes('Age group ID')) {
            return res.status(404).json({ message: error.message });
        }
        console.error('Error creating insurer:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateInsurer = async (req, res) => {
    try {
        const { id } = req.params;
        const { insurance_type_id, age_group_id, monthly_rate, annually_rate, monthly_benefit1, monthly_benefit2, annually_benefit1, annually_benefit2 } = req.body;

        const insurerData = {insurance_type_id, age_group_id,monthly_rate,annually_rate,monthly_benefit1,monthly_benefit2,
            annually_benefit1,annually_benefit2};

        const result = await healthInsuranceService.updateInsurer(id, insurerData);
        if (result) {
            res.status(200).json({ message: 'Insurer updated successfully', data: result });
        } else {
            res.status(404).json({ message: 'Insurer not found.' });
        }
    } catch (error) {
        console.error('Error updating insurer:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    createInsuranceTypes,
    updateInsuranceTypesController,
    createAgeGroup,
    updateAgeGroup,
    createCoverAmountController,
    updateCoverAmountController,
    createInsurerController,
    updateInsurer
  };
  
