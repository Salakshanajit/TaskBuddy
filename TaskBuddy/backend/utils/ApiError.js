// An error that carries an HTTP status code so the error handler can respond properly.
class ApiError extends Error {
  constructor(statusCode, message, errors) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isApiError = true;
  }
}

module.exports = ApiError;
