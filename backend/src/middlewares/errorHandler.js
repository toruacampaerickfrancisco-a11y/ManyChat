function errorHandler(err, req, res, next) {
  console.error('[API Server Error]', err);
  const status = err.status || 500;
  res.status(status).json({
    error: true,
    message: err.message || 'Error interno del servidor'
  });
}

module.exports = errorHandler;
