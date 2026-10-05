const ApiError = require('../utils/ApiError');

// Handles requests to routes that do not exist.
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

// Central error handler. Converts any error into a clean JSON response
// without leaking stack traces or database internals.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Something went wrong on the server. Please try again later.';
  let errors;

  if (err.isApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    errors = Object.values(err.errors).map((e) => e.message);
    message = errors[0];
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid identifier supplied.';
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'An account with this email already exists.';
  } else if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Request body contains invalid JSON.';
  } else {
    // Unknown error: log details on the server only.
    console.error(err);
  }

  res.status(statusCode).json({ success: false, message, ...(errors ? { errors } : {}) });
};

module.exports = { notFound, errorHandler };
