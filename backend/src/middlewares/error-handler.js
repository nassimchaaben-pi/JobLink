function notFoundHandler(req, res) {
  return res.status(404).json({
    code: 'NOT_FOUND',
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  if (statusCode >= 500) {
    console.error(err);
  }

  return res.status(statusCode).json({
    code,
    message: err.message || 'An unexpected error occurred.'
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
