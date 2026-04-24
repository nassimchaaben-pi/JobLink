const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const apiRoutes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middlewares/error-handler');

const app = express();

const allowedOrigins = new Set([
  env.corsOrigin,
  'http://localhost:4200',
  'http://127.0.0.1:4200'
]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
  })
);
app.use(express.json({ limit: '2mb' }));

app.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Welcome to the JobLink API.',
    docs: '/api/v1/health'
  });
});

app.use('/api/v1', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
