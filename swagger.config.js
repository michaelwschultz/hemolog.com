const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Hemolog.com API',
      version: '1.0.0',
      description: 'API documentation for Hemolog.com',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
  },
  apis: ['./pages/api/**/*.js'], // Adjust the path according to your project structure
}

module.exports = swaggerOptions
