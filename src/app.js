const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');
const { AVAILABLE_COUNTRY_CODES, SORT_BY_OPTIONS } = require('./constants');

const app = express();
const PORT = process.env.PORT || 8000;

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
      {
        name: 'Authentication',
        description: 'Endpoints for user authentication',
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
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/swagger/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

const dynamicSwaggerSpec = JSON.parse(JSON.stringify(swaggerSpec));
dynamicSwaggerSpec.paths['/api/trip'].get.parameters[0].schema.enum = AVAILABLE_COUNTRY_CODES;
dynamicSwaggerSpec.paths['/api/trip'].get.parameters[1].schema.enum = AVAILABLE_COUNTRY_CODES;
dynamicSwaggerSpec.paths['/api/trip'].get.parameters[2].schema.enum = SORT_BY_OPTIONS;

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(dynamicSwaggerSpec));

fs.readdirSync(path.join(__dirname, 'routes')).forEach(file => {
  if (file.endsWith('.js')) {
    const route = require(path.join(__dirname, 'routes', file));
    app.use('/api', route);
  }
});

module.exports = app;