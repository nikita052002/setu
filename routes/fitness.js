const express = require ("express");
const exe = require ("../db");
const route = express.Router();
const { swaggerUiSetup, swaggerUiDocument } = require('../swagger');

route.get('/live-streams', async (req, res) => {
    try {
        const result = await exe(` SELECT * FROM live_streaming `);
         const streams = result.rows;
        res.status(200).json(streams);
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
route.get('/health-events', async (req, res) => {
    try {
        const result = await exe(` SELECT * FROM health_events `);
         const streams = result.rows;
        res.status(200).json(streams);
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = route;