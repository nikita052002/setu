const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');  // Keep the correct name here

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Admin API Documentation",
      version: "1.0.0",
      description: "API for admin operations"
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Optional, but helpful
        },
      },
    },
    security: [
      {
        bearerAuth: []  // This applies the security scheme globally
      }
    ],
    servers: [
      {
        url: "http://localhost:5000", // Adjust this to your server URL
      },
    ],
  },
  apis: ['./routes/admin/registerRoutes.js', './routes/admin/fitnessRoutes.js','./routes/user/fitnessRoutes.js'],
};

// Use a different variable name here
const swaggerSpec = swaggerJsDoc(swaggerOptions);
const swaggerSetup = swaggerUi.setup(swaggerSpec);

module.exports = { swaggerUi, swaggerSetup, swaggerSpec };
