const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');
const swaggerOptions = require('./config/swagger');
const { AVAILABLE_COUNTRY_CODES, SORT_BY_OPTIONS } = require('./config/constants');
const errorHandler = require('./middlewares/error');
const cors = require('cors');

const app = express();

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

app.use((err, req, res, next) => {
  errorHandler(err, res);
});

app.use(cors());

module.exports = app;