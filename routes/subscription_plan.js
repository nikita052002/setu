const express = require ("express");
const exe = require ("../db");
const route = express.Router();
const { swaggerUiSetup, swaggerUiDocument } = require('../swagger');

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