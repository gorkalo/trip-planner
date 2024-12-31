require('dotenv').config();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    tags: [
      {
        name: 'Status',
        description: 'Endpoint for status checking',
      },
      {
        name: 'Trips',
        description: 'Endpoints for trip planning',
      },
    ],
    info: {
      title: 'Bizaway Trip Planner API',
      version: '1.0.0',
      description: 'Trip planner API documentation',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8000}`,
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/swagger/*.js'],
};

module.exports = swaggerOptions;