// src/config/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MediaHub API',
      version: '1.0.0',
      description: 'Documentação da API de mídia, usuários, reviews, listas e administração',
    },
    servers: [
      {
        url: 'http://localhost:3001', // Ajuste conforme sua porta
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // Aqui você aponta para todos os arquivos de rotas que contêm anotações do Swagger
  apis: [
    path.join(__dirname, '../routes/**/*.js'),
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
