// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Simple API',
        version: '1.0.0',
        description: 'A simple Express API with Swagger documentation',
    },
    servers: [
        {
            url: 'http://localhost:1000',
            description: 'Local server',
        },
    ],
};

// Options for the swagger docs
const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'], // Path to the API specs
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// Middleware for serving Swagger UI
const swaggerUiSetup = swaggerUi.serve;
const swaggerUiDocument = swaggerUi.setup(swaggerSpec);

module.exports = { swaggerUiSetup, swaggerUiDocument };
