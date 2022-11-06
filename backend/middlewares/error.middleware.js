var createError = require('http-errors');

// Handles non-existent routes
const notFound = (req, res, next) => {
  next(createError(404));
}

// Catches any uncaught errors
const errorHandler = (err, req, res, next) => {
  // set the error status
  res.status(err.status || 500);

  // send error message, only providing error in development
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {},
  });
}

module.exports = { notFound, errorHandler };
